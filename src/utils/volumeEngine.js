// volumeEngine.js — Cumulative fatigue, deload detection, Banister fitness-fatigue model
// References:
//   Israetel & Hoffman (RP Strength) — MEV/MAV/MRV landmarks
//   Banister 1975 (TRIMP) — fitness τ≈45 days, fatigue τ≈15 days; fatigue decays 3× faster
//   Zourdos 2016 (DUP, JSCR) — DUP superior to linear periodization

import { DEFAULT_VOLUME_LANDMARKS } from './progressionEngine';

// ─── Week helpers ─────────────────────────────────────────────────────────

/** Returns ISO week start (Monday) date string for a given date string or Date */
export function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

/** Returns array of ISO week-start strings for the last N weeks, most-recent first */
export function getLastNWeeks(n) {
  const weeks = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    weeks.push(getWeekStart(d.toISOString().split('T')[0]));
  }
  return [...new Set(weeks)]; // deduplicate
}

// ─── Volume computation ───────────────────────────────────────────────────

/**
 * Compute total working sets per muscle group for a given week.
 * @param {object} logs — useWorkoutStore.logs ({ [date]: { [exId]: { [setIdx]: {done, weight, reps} } } })
 * @param {object} programData — { program: { [dayKey]: { exercises: [{id, muscle, sets}] } } }
 * @param {string} weekStart — ISO date string (Monday)
 * @returns {{ [muscle]: number }} — sets logged that week
 */
export function computeWeeklyVolume(logs, programData, weekStart) {
  const result = {};
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Build exercise → muscle map from programData
  const exMuscle = {};
  if (programData?.program) {
    Object.values(programData.program).forEach(day => {
      (day?.exercises || []).forEach(ex => {
        if (ex.id && ex.muscle) exMuscle[ex.id] = ex.muscle;
      });
    });
  }

  // Scan logs for this week
  Object.entries(logs).forEach(([dateStr, dayLog]) => {
    const d = new Date(dateStr);
    if (d < new Date(weekStart) || d >= weekEnd) return;

    Object.entries(dayLog).forEach(([exId, setMap]) => {
      const muscle = exMuscle[exId];
      if (!muscle) return;
      const doneSets = Object.values(setMap).filter(s => s?.done).length;
      result[muscle] = (result[muscle] || 0) + doneSets;
    });
  });

  return result;
}

/**
 * Compute weekly volume for the last N weeks.
 * @returns {{ weekStart: string, volume: {[muscle]: number} }[]} — sorted old→new
 */
export function computeMultiWeekVolume(logs, programData, nWeeks = 6) {
  const weeks = getLastNWeeks(nWeeks);
  return weeks
    .map(ws => ({ weekStart: ws, volume: computeWeeklyVolume(logs, programData, ws) }))
    .reverse(); // old → new
}

// ─── Deload trigger detection ─────────────────────────────────────────────

/**
 * Check which muscles are approaching or exceeding MRV.
 * @param {object} weekVolume — { [muscle]: number } current week's sets
 * @param {object} volumeLandmarks — { [muscle]: { mev, mav, mrv } }
 * @returns {{ muscle, sets, mrv, ratio, status }[]} — sorted by ratio desc
 */
export function checkDeloadTriggers(weekVolume, volumeLandmarks = DEFAULT_VOLUME_LANDMARKS) {
  const alerts = [];
  Object.entries(volumeLandmarks).forEach(([muscle, { mev, mav, mrv }]) => {
    const sets = weekVolume[muscle] || 0;
    if (sets < mev) return; // below MEV — not relevant
    const ratio = sets / mrv;
    let status;
    if (ratio >= 1.0)       status = 'exceeded'; // red
    else if (ratio >= 0.85) status = 'warning';  // amber — within 15% of MRV
    else if (ratio >= 0.6)  status = 'optimal';  // teal — MAV zone
    else                    status = 'low';       // gray — below MAV
    if (status !== 'low') {
      alerts.push({ muscle, sets, mev, mav, mrv, ratio, status });
    }
  });
  return alerts.sort((a, b) => b.ratio - a.ratio);
}

// ─── Failed-set deload trigger ────────────────────────────────────────────

/**
 * Calculate the ratio of failed sets over the last N weeks.
 * A "failed" set is done=true but reps < expected lower bound.
 * @returns {{ failRatio: number, recommendation: string|null }}
 */
export function checkFailedSetRatio(logs, programData, nWeeks = 4) {
  const weeks = getLastNWeeks(nWeeks);
  let total = 0, failed = 0;

  // Build expected reps lower bound from program
  const exRepsMin = {};
  if (programData?.program) {
    Object.values(programData.program).forEach(day => {
      (day?.exercises || []).forEach(ex => {
        if (!ex.id) return;
        const repsStr = String(ex.reps || '');
        const match = repsStr.match(/(\d+)/);
        exRepsMin[ex.id] = match ? parseInt(match[1]) : 5;
      });
    });
  }

  weeks.forEach(ws => {
    const weekEnd = new Date(ws);
    weekEnd.setDate(weekEnd.getDate() + 7);
    Object.entries(logs).forEach(([dateStr, dayLog]) => {
      const d = new Date(dateStr);
      if (d < new Date(ws) || d >= weekEnd) return;
      Object.entries(dayLog).forEach(([exId, setMap]) => {
        const minReps = exRepsMin[exId] || 5;
        Object.values(setMap).forEach(s => {
          if (!s?.done) return;
          total++;
          if (s.reps < minReps) failed++;
        });
      });
    });
  });

  const failRatio = total > 0 ? failed / total : 0;
  return {
    failRatio,
    recommendation: failRatio > 0.25
      ? `Son ${nWeeks} haftada setlerin %${Math.round(failRatio * 100)}'i başarısız — deload zamanı.`
      : null,
  };
}

// ─── Banister Fitness-Fatigue Model (simplified, volume-load based) ───────

const TAU_FITNESS  = 45; // days
const TAU_FATIGUE  = 15; // days

/**
 * Compute a simplified Banister fitness-fatigue score from workout logs.
 * Volume-load proxy: done_sets × estimated_weight (if available) or done_sets × 50.
 * @returns {{ fitness: number, fatigue: number, performance: number, trend: 'improving'|'fatigued'|'recovering'|'detraining' }}
 */
export function banisterModel(logs, nDays = 60) {
  const today = new Date();
  const days = [];
  for (let i = nDays; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  let fitness  = 0;
  let fatigue  = 0;

  days.forEach((dateStr, idx) => {
    // Decay previous values
    if (idx > 0) {
      fitness  *= Math.exp(-1 / TAU_FITNESS);
      fatigue  *= Math.exp(-1 / TAU_FATIGUE);
    }

    // Add today's training impulse
    const dayLog = logs[dateStr];
    if (!dayLog) return;

    let impulse = 0;
    Object.values(dayLog).forEach(setMap => {
      Object.values(setMap).forEach(s => {
        if (!s?.done) return;
        const w = s.weight > 0 ? s.weight : 50;
        impulse += w * (s.reps || 1);
      });
    });

    // Normalise impulse to 0–100 range (1000 volume-load ≈ 10 points)
    const norm = impulse / 100;
    fitness  += norm;
    fatigue  += norm;
  });

  const performance = fitness - fatigue;

  let trend;
  if      (fatigue > fitness * 1.2)    trend = 'fatigued';
  else if (performance > 5 && fatigue < 15) trend = 'improving';
  else if (fatigue < 5)                trend = 'detraining';
  else                                 trend = 'recovering';

  return {
    fitness:  Math.round(fitness  * 10) / 10,
    fatigue:  Math.round(fatigue  * 10) / 10,
    performance: Math.round(performance * 10) / 10,
    trend,
  };
}

// ─── Weekly set ramp display ──────────────────────────────────────────────

/**
 * Compute target set counts per muscle per week for a mesocycle.
 * Uses volumeLandmarks MEV → MRV ramp, last week = deload (×0.4).
 */
export function computeMesocycleSetRamp(mesocycle, volumeLandmarks = DEFAULT_VOLUME_LANDMARKS) {
  if (!mesocycle?.durationWeeks) return {};
  const { durationWeeks, phases } = mesocycle;

  const result = {}; // { [muscle]: number[] }

  Object.entries(volumeLandmarks).forEach(([muscle, { mev, mrv }]) => {
    const ramp = [];
    for (let w = 1; w <= durationWeeks; w++) {
      // Find phase for this week
      const phase = phases?.find(p => p.weeks?.includes(w));
      if (phase?.volumeMultiplier) {
        // Deload phase
        ramp.push(Math.round(mev * phase.volumeMultiplier));
      } else {
        // Linear ramp MEV → MRV over non-deload weeks
        const deloadWeeks = (phases || []).filter(p => p.volumeMultiplier).flatMap(p => p.weeks || []);
        const workWeeks = durationWeeks - deloadWeeks.length;
        const workWeekIdx = ramp.filter((_, i) => !deloadWeeks.includes(i + 1)).length;
        const t = workWeeks > 1 ? workWeekIdx / (workWeeks - 1) : 0;
        ramp.push(Math.round(mev + t * (mrv - mev)));
      }
    }
    result[muscle] = ramp;
  });

  return result;
}
