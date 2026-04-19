// syncEngine.js — Push/pull all user data between Zustand stores and Supabase.
// Strategy: device-local is always writable (offline-first).
//   • On login: pull Supabase → restore stores (Supabase wins)
//   • On first sign-up: push existing local data → seed Supabase
//   • On any store change: debounced push (handled in App.jsx)
// Features: Conflict resolution, Incremental sync, Offline queue

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import useWorkoutStore    from '../store/useWorkoutStore';
import useProgressStore   from '../store/useProgressStore';
import useCustomProgramStore from '../store/useCustomProgramStore';
import useSettingsStore   from '../store/useSettingsStore';
import useAuthStore from '../store/useAuthStore';

const OFFLINE_QUEUE_KEY = 'vtaper-offline-queue';
const LAST_SYNC_KEY = 'vtaper-last-sync';

// ── Offline Queue ─────────────────────────────────────────────────────────────

function getOfflineQueue() {
  try {
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function addToOfflineQueue(operation) {
  const queue = getOfflineQueue();
  queue.push({
    ...operation,
    timestamp: new Date().toISOString(),
    id: crypto.randomUUID(),
  });
  saveOfflineQueue(queue);
  return queue.length;
}

export async function processOfflineQueue(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return 0;

  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  let processed = 0;
  const remaining = [];

  for (const operation of queue) {
    try {
      await processOfflineOperation(operation, userId);
      processed++;
    } catch (error) {
      console.warn('[sync] Failed operation:', operation.type, error);
      remaining.push(operation);
    }
  }

  saveOfflineQueue(remaining);
  return processed;
}

async function processOfflineOperation(operation, userId) {
  const { type, table, data, timestamp } = operation;

  switch (type) {
    case 'upsert':
      await supabase.from(table).upsert({
        user_id: userId,
        ...data,
        updated_at: timestamp,
      });
      break;
    case 'merge':
      const { data: existing } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const merged = mergeData(existing, data, operation.mergeStrategy || 'local-wins');
        await supabase.from(table).upsert({
          user_id: userId,
          ...merged,
          updated_at: new Date().toISOString(),
        });
      } else {
        await supabase.from(table).upsert({
          user_id: userId,
          ...data,
          updated_at: timestamp,
        });
      }
      break;
  }
}

// ── Conflict Resolution ────────────────────────────────────────────────────────

function mergeData(serverData, localData, strategy = 'local-wins') {
  if (strategy === 'server-wins') {
    return { ...localData, ...serverData };
  }
  if (strategy === 'local-wins') {
    return { ...serverData, ...localData };
  }
  if (strategy === 'merge') {
    return deepMerge(serverData, localData);
  }
  return localData;
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

export async function resolveConflict(userId, table, localData, serverData) {
  const merged = mergeData(serverData, localData, 'merge');
  await supabase.from(table).upsert({
    user_id: userId,
    ...merged,
    updated_at: new Date().toISOString(),
  });
  return merged;
}

// ── Incremental Sync ──────────────────────────────────────────────────────────

export function getLastSyncTime() {
  return localStorage.getItem(LAST_SYNC_KEY);
}

function setLastSyncTime(time) {
  localStorage.setItem(LAST_SYNC_KEY, time);
}

function getChangedFields(local, server) {
  const changes = {};
  for (const key in local) {
    if (JSON.stringify(local[key]) !== JSON.stringify(server[key])) {
      changes[key] = {
        local: local[key],
        server: server[key],
        timestamp: new Date().toISOString(),
      };
    }
  }
  return changes;
}

// ── Push ─────────────────────────────────────────────────────────────────────

export async function pushAllData(userId, options = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    if (!navigator.onLine) {
      addToOfflineQueue({ type: 'upsert', table: 'user_workout_logs', data: { logs: useWorkoutStore.getState().logs } });
    }
    return;
  }

  const w  = useWorkoutStore.getState();
  const p  = useProgressStore.getState();
  const cp = useCustomProgramStore.getState();
  const s  = useSettingsStore.getState();
  const ts = new Date().toISOString();

  const pushOptions = {
    incremental: false,
    force: false,
    ...options,
  };

  const results = await Promise.allSettled([
    pushTableData(userId, 'user_workout_logs', {
      logs:           w.logs,
      exercise_notes: w.exerciseNotes ?? {},
    }, ts, pushOptions),

    pushTableData(userId, 'user_progress', {
      data: {
        weights:        p.weights        ?? {},
        measurements:   p.measurements   ?? {},
        weeklyCheckIns: p.weeklyCheckIns ?? {},
        currentWeek:    p.currentWeek    ?? 1,
        startWeight:    p.startWeight    ?? null,
        targetWeight:   p.targetWeight   ?? null,
      },
    }, ts, pushOptions),

    pushTableData(userId, 'user_programs', {
      programs: cp.programs ?? {},
    }, ts, pushOptions),

    pushTableData(userId, 'user_settings', {
      data: {
        activeProgram:        s.activeProgram,
        user:                 s.user,
        hapticEnabled:        s.hapticEnabled,
        notificationsEnabled:  s.notificationsEnabled,
        isOnboarded:         s.isOnboarded,
      },
    }, ts, pushOptions),
  ]);

  setLastSyncTime(ts);

  results.forEach((r, i) => {
    if (r.status === 'rejected') console.warn(`[sync] push[${i}] failed:`, r.reason);
    if (r.value?.error)          console.warn(`[sync] push[${i}] error:`,  r.value.error.message);
  });
}

async function pushTableData(userId, table, data, timestamp, options = {}) {
  const { incremental, force } = options;

  if (incremental && !force) {
    const { data: existing } = await supabase
      .from(table)
      .select('updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing?.updated_at && new Date(existing.updated_at) >= new Date(timestamp)) {
      return { success: true, skipped: true };
    }
  }

  return supabase.from(table).upsert({
    user_id: userId,
    ...data,
    updated_at: timestamp,
  });
}

// ── Pull ─────────────────────────────────────────────────────────────────────

export async function pullAndRestoreData(userId, options = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) return false;

  const {
    conflictStrategy = 'local-wins',
    restoreMissing = false,
  } = options;

  const [workoutRes, progressRes, programsRes, settingsRes] = await Promise.all([
    supabase.from('user_workout_logs').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_progress')    .select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_programs')    .select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_settings')    .select('*').eq('user_id', userId).maybeSingle(),
  ]);

  let restored = false;

  if (workoutRes.data) {
    const localLogs = useWorkoutStore.getState().logs;
    const serverLogs = workoutRes.data.logs ?? {};
    const merged = conflictStrategy === 'server-wins'
      ? serverLogs
      : conflictStrategy === 'merge'
        ? deepMerge(serverLogs, localLogs)
        : localLogs;

    useWorkoutStore.setState({
      logs:          merged,
      exerciseNotes: workoutRes.data.exercise_notes ?? {},
    });
    restored = true;
  } else if (restoreMissing) {
    useWorkoutStore.setState({ logs: {}, exerciseNotes: {} });
  }

  if (progressRes.data?.data) {
    const d = progressRes.data.data;
    const localProgress = {
      weights:        useProgressStore.getState().weights        ?? {},
      measurements:   useProgressStore.getState().measurements   ?? {},
      weeklyCheckIns: useProgressStore.getState().weeklyCheckIns ?? {},
    };

    useProgressStore.setState({
      weights:        d.weights        ?? {},
      measurements:   d.measurements   ?? {},
      weeklyCheckIns: d.weeklyCheckIns ?? {},
      currentWeek:    d.currentWeek    ?? 1,
      startWeight:    d.startWeight    ?? null,
      targetWeight:   d.targetWeight   ?? null,
    });
    restored = true;
  } else if (restoreMissing) {
    useProgressStore.setState({
      weights: {}, measurements: {}, weeklyCheckIns: {}, currentWeek: 1,
    });
  }

  if (programsRes.data) {
    useCustomProgramStore.setState({
      programs: programsRes.data.programs ?? {},
    });
    restored = true;
  } else if (restoreMissing) {
    useCustomProgramStore.setState({ programs: {} });
  }

  if (settingsRes.data?.data) {
    const d = settingsRes.data.data;
    useSettingsStore.setState({
      activeProgram:        d.activeProgram       ?? 'vtaper_orta',
      user:                 d.user                ?? { name: '', height: '', gender: null },
      hapticEnabled:        d.hapticEnabled        ?? true,
      notificationsEnabled: d.notificationsEnabled ?? false,
      isOnboarded:          d.isOnboarded          ?? false,
    });
    restored = true;
  }

  return restored;
}

// ── Sync Status ──────────────────────────────────────────────────────────────

export function getSyncStatus() {
  const queue = getOfflineQueue();
  const lastSync = getLastSyncTime();

  return {
    isOnline: navigator.onLine,
    pendingOperations: queue.length,
    lastSyncTime: lastSync,
    hasQueuedData: queue.length > 0,
  };
}

export function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

// ── Network Status Listener ──────────────────────────────────────────────────

export function initNetworkListeners(onStatusChange) {
  const handleOnline = async () => {
    const userId = useAuthStore.getState()?.session?.user?.id;
    if (userId) {
      const processed = await processOfflineQueue(userId);
      if (processed > 0) {
        await pushAllData(userId);
      }
    }
    onStatusChange?.({ isOnline: true });
  };

  const handleOffline = () => {
    onStatusChange?.({ isOnline: false });
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
