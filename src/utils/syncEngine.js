// syncEngine.js — Push/pull all user data between Zustand stores and Supabase.
// Strategy: device-local is always writable (offline-first).
//   • On login: pull Supabase → restore stores (Supabase wins)
//   • On first sign-up: push existing local data → seed Supabase
//   • On any store change: debounced push (handled in App.jsx)

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import useWorkoutStore    from '../store/useWorkoutStore';
import useProgressStore   from '../store/useProgressStore';
import useCustomProgramStore from '../store/useCustomProgramStore';
import useSettingsStore   from '../store/useSettingsStore';
import useAchievementStore from '../store/useAchievementStore';

// ── Push ──────────────────────────────────────────────────────────────────────

export async function pushAllData(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  const w  = useWorkoutStore.getState();
  const p  = useProgressStore.getState();
  const cp = useCustomProgramStore.getState();
  const s  = useSettingsStore.getState();
  const ts = new Date().toISOString();

  const results = await Promise.allSettled([
    supabase.from('user_workout_logs').upsert({
      user_id:        userId,
      logs:           w.logs,
      exercise_notes: w.exerciseNotes ?? {},
      updated_at:     ts,
    }),

    supabase.from('user_progress').upsert({
      user_id:    userId,
      data: {
        weights:        p.weights        ?? {},
        measurements:   p.measurements   ?? {},
        weeklyCheckIns: p.weeklyCheckIns ?? {},
        currentWeek:    p.currentWeek    ?? 1,
        startWeight:    p.startWeight    ?? null,
        targetWeight:   p.targetWeight   ?? null,
      },
      updated_at: ts,
    }),

    supabase.from('user_programs').upsert({
      user_id:   userId,
      programs:  cp.programs ?? {},
      updated_at: ts,
    }),

    supabase.from('user_settings').upsert({
      user_id: userId,
      data: {
        activeProgram:       s.activeProgram,
        user:                s.user,
        hapticEnabled:       s.hapticEnabled,
        notificationsEnabled: s.notificationsEnabled,
        isOnboarded:         s.isOnboarded,
      },
      updated_at: ts,
    }),
  ]);

  // Log errors but don't throw — app stays functional even if sync fails
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.warn(`[sync] push[${i}] failed:`, r.reason);
    if (r.value?.error)          console.warn(`[sync] push[${i}] error:`,  r.value.error.message);
  });
}

// ── Pull ─────────────────────────────────────────────────────────────────────

export async function pullAndRestoreData(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return false;

  const [workoutRes, progressRes, programsRes, settingsRes] = await Promise.all([
    supabase.from('user_workout_logs').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_progress')    .select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_programs')    .select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_settings')    .select('*').eq('user_id', userId).maybeSingle(),
  ]);

  let restored = false;

  if (workoutRes.data) {
    useWorkoutStore.setState({
      logs:          workoutRes.data.logs           ?? {},
      exerciseNotes: workoutRes.data.exercise_notes ?? {},
    });
    restored = true;
  }

  if (progressRes.data?.data) {
    const d = progressRes.data.data;
    useProgressStore.setState({
      weights:        d.weights        ?? {},
      measurements:   d.measurements   ?? {},
      weeklyCheckIns: d.weeklyCheckIns ?? {},
      currentWeek:    d.currentWeek    ?? 1,
      startWeight:    d.startWeight    ?? null,
      targetWeight:   d.targetWeight   ?? null,
    });
    restored = true;
  }

  if (programsRes.data) {
    useCustomProgramStore.setState({
      programs: programsRes.data.programs ?? {},
    });
    restored = true;
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
