/**
 * Progression Engine — V-Taper Coach
 *
 * 5 algorithms sourced from research:
 *   1. Double Progression       — Helms / Legion Athletics
 *   2. Linear Progression       — standard novice/intermediate
 *   3. RPE Autoregulation       — Zourdos & Helms (±2.5% per RPE point)
 *   4. Percentage Wave          — 5/3/1 / DUP Zourdos 2016
 *   5. GZCL Tiered Reset        — Cody LeFever GZCLP
 *
 * All functions read from raw workout logs (useWorkoutStore.logs).
 * No additional store fields required.
 */

// Strip level suffix: pa1_o → pa1
function baseId(id) {
  return id.replace(/_(k|o|z)$/, '');
}

// Epley e1RM estimate
function e1rm(weight, reps) {
  const w = parseFloat(weight);
  const r = parseInt(reps);
  if (!w || !r || r < 1) return 0;
  return r === 1 ? w : Math.round(w * (1 + r / 30));
}

// ─── Core: get all sets from the most recent session ──────────────────────────
export function getLastSessionSets(exerciseId, logs) {
  const base = baseId(exerciseId);
  const sortedDates = Object.keys(logs).sort().reverse();

  for (const date of sortedDates) {
    const dayLogs = logs[date];
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      if (exId !== exerciseId && baseId(exId) !== base) continue;
      const done = Object.values(exLogs).filter(
        (s) => s?.done && s.weight && s.reps
      );
      if (done.length > 0) return { date, sets: done };
    }
  }
  return null;
}

// ─── 1. Double Progression ────────────────────────────────────────────────────
// Reps-first: when all sets hit repRangeMax → increase load, reset to repRangeMin
// Reference: Legion Athletics / Helms "The Muscle & Strength Pyramid"
export function doubleProgressionSuggestion(exercise, logs) {
  const { progressionRule: rule } = exercise;
  const { repRangeMin = 8, repRangeMax = 12, loadIncrement = 2.5 } =
    rule?.params ?? {};

  const last = getLastSessionSets(exercise.id, logs);
  if (!last) {
    return {
      weight: 20,
      reps: repRangeMin,
      label: `Başlangıç: 20kg × ${repRangeMin} tekrar`,
      badge: 'Yeni',
      badgeColor: '#14B8A6',
    };
  }

  const { sets } = last;
  const maxWeightUsed = Math.max(...sets.map((s) => Number(s.weight)));
  const minRepsAchieved = Math.min(...sets.map((s) => parseInt(s.reps)));
  const avgReps = sets.reduce((a, s) => a + parseInt(s.reps), 0) / sets.length;

  // All sets hit top of range → increase weight
  if (minRepsAchieved >= repRangeMax) {
    return {
      weight: maxWeightUsed + loadIncrement,
      reps: repRangeMin,
      label: `+${loadIncrement}kg → ${maxWeightUsed + loadIncrement}kg × ${repRangeMin}`,
      badge: 'Ağırlık Artışı',
      badgeColor: '#10B981',
      reason: `Son seans ${minRepsAchieved} tekrara ulaştın (hedef: ${repRangeMax})`,
    };
  }

  // Still working up to repRangeMax
  const targetReps = Math.min(Math.ceil(avgReps) + 1, repRangeMax);
  return {
    weight: maxWeightUsed,
    reps: targetReps,
    label: `${maxWeightUsed}kg × ${targetReps} tekrar hedefi`,
    badge: 'Tekrar Artışı',
    badgeColor: '#F5A623',
    reason: `Ortalama ${avgReps.toFixed(1)} → ${targetReps} tekrar`,
  };
}

// ─── 2. Linear Progression ───────────────────────────────────────────────────
// Add loadIncrement kg each successful session
// Reference: Starting Strength / 5/3/1 T2 progressions
export function linearProgressionSuggestion(exercise, logs) {
  const { progressionRule: rule } = exercise;
  const { loadIncrement = 2.5, repsTarget = 5 } = rule?.params ?? {};

  const last = getLastSessionSets(exercise.id, logs);
  if (!last) {
    return {
      weight: 20,
      reps: repsTarget,
      label: `Başlangıç: 20kg × ${repsTarget}`,
      badge: 'Yeni',
      badgeColor: '#14B8A6',
    };
  }

  const { sets } = last;
  const maxWeight = Math.max(...sets.map((s) => Number(s.weight)));
  const allCompleted = sets.every((s) => parseInt(s.reps) >= repsTarget);

  if (allCompleted) {
    return {
      weight: maxWeight + loadIncrement,
      reps: repsTarget,
      label: `+${loadIncrement}kg → ${maxWeight + loadIncrement}kg`,
      badge: '+' + loadIncrement + 'kg',
      badgeColor: '#10B981',
      reason: 'Tüm setler tamamlandı',
    };
  }

  return {
    weight: maxWeight,
    reps: repsTarget,
    label: `${maxWeight}kg × ${repsTarget} (tekrar dene)`,
    badge: 'Aynı Ağırlık',
    badgeColor: '#F5A623',
    reason: 'Hedef tekrara ulaşılamadı',
  };
}

// ─── 3. RPE Autoregulation ───────────────────────────────────────────────────
// ±2.5% per RPE point off target
// Reference: Zourdos et al. 2016 JSCR, Helms et al.
export function rpeAutoregulationSuggestion(exercise, logs) {
  const { progressionRule: rule } = exercise;
  const { targetRPE = 8, repsTarget = 5, adjustPct = 0.025 } =
    rule?.params ?? {};

  const last = getLastSessionSets(exercise.id, logs);
  if (!last) {
    return {
      weight: 20,
      reps: repsTarget,
      label: `Başlangıç: 20kg × ${repsTarget} @RPE${targetRPE}`,
      badge: 'Yeni',
      badgeColor: '#14B8A6',
    };
  }

  const { sets } = last;
  const rpeRecorded = sets.filter((s) => s.rpe);
  const maxWeight = Math.max(...sets.map((s) => Number(s.weight)));

  if (!rpeRecorded.length) {
    return {
      weight: maxWeight,
      reps: repsTarget,
      label: `${maxWeight}kg (RPE kaydı yok)`,
      badge: 'RPE Kaydet',
      badgeColor: '#F5A623',
    };
  }

  const avgRPE =
    rpeRecorded.reduce((a, s) => a + Number(s.rpe), 0) / rpeRecorded.length;
  const delta = targetRPE - avgRPE;
  const adjustedWeight = Math.round((maxWeight * (1 + delta * adjustPct)) / 2.5) * 2.5;

  return {
    weight: adjustedWeight,
    reps: repsTarget,
    label: `${adjustedWeight}kg @RPE${targetRPE} (gerçek: ${avgRPE.toFixed(1)})`,
    badge: delta > 0 ? `+${(delta * adjustPct * 100).toFixed(1)}%` : `${(delta * adjustPct * 100).toFixed(1)}%`,
    badgeColor: delta > 0.3 ? '#10B981' : delta < -0.3 ? '#E94560' : '#F5A623',
    reason: `Hedef RPE ${targetRPE}, son seans ${avgRPE.toFixed(1)}`,
  };
}

// ─── 4. Percentage Wave ──────────────────────────────────────────────────────
// Prescribes weight as % of estimated 1RM, cycling a wave pattern
// Reference: 5/3/1 Wendler, DUP Zourdos 2016
export function percentageWaveSuggestion(exercise, logs, currentWeek = 1) {
  const { progressionRule: rule } = exercise;
  const {
    trainingMaxPct = 0.9,
    wavePattern = [0.65, 0.75, 0.85],
    repsForWave = [5, 3, 1],
  } = rule?.params ?? {};

  // Estimate 1RM from best set in logs
  const base = baseId(exercise.id);
  let best1RM = 0;
  for (const dayLogs of Object.values(logs)) {
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      if (exId !== exercise.id && baseId(exId) !== base) continue;
      for (const s of Object.values(exLogs)) {
        if (s?.done && s.weight && s.reps) {
          const est = e1rm(s.weight, s.reps);
          if (est > best1RM) best1RM = est;
        }
      }
    }
  }

  if (best1RM === 0) {
    return {
      weight: 20,
      reps: repsForWave[0],
      label: `Başlangıç: 20kg (1RM tahmini yok)`,
      badge: 'Yeni',
      badgeColor: '#14B8A6',
    };
  }

  const trainingMax = best1RM * trainingMaxPct;
  const waveIdx = (currentWeek - 1) % wavePattern.length;
  const pct = wavePattern[waveIdx];
  const targetWeight = Math.round((trainingMax * pct) / 2.5) * 2.5;
  const targetReps = repsForWave[waveIdx] ?? 5;

  return {
    weight: targetWeight,
    reps: targetReps,
    label: `${targetWeight}kg × ${targetReps} (%${Math.round(pct * 100)} TM)`,
    badge: `Hf${currentWeek} — ${Math.round(pct * 100)}%`,
    badgeColor: '#8B5CF6',
    reason: `1RM ≈${best1RM}kg → TM ${trainingMax.toFixed(1)}kg`,
  };
}

// ─── 5. GZCL Tiered Reset ────────────────────────────────────────────────────
// Failure → shift to higher-set/lower-rep before resetting
// Reference: Cody LeFever GZCLP
export function gzclResetSuggestion(exercise, logs) {
  const { tier = 'T2' } = exercise;
  const last = getLastSessionSets(exercise.id, logs);

  const T1_PROGRESSION = [
    { sets: 5, reps: 3 },
    { sets: 6, reps: 2 },
    { sets: 10, reps: 1 },
  ];
  const T2_PROGRESSION = [
    { sets: 3, reps: 10 },
    { sets: 3, reps: 8 },
    { sets: 3, reps: 6 },
  ];

  const progression = tier === 'T1' ? T1_PROGRESSION : T2_PROGRESSION;

  if (!last) {
    const init = progression[0];
    return {
      weight: 20,
      reps: init.reps,
      sets: init.sets,
      label: `${init.sets}×${init.reps} @20kg`,
      badge: 'Başlangıç',
      badgeColor: '#14B8A6',
    };
  }

  const { sets } = last;
  const maxWeight = Math.max(...sets.map((s) => Number(s.weight)));
  const targetReps = tier === 'T1' ? 3 : 10;
  const targetSets = tier === 'T1' ? 5 : 3;
  const allCompleted = sets.every((s) => parseInt(s.reps) >= targetReps);

  if (allCompleted && sets.length >= targetSets) {
    return {
      weight: maxWeight + (tier === 'T1' ? 2.5 : 5),
      reps: targetReps,
      sets: targetSets,
      label: `+${tier === 'T1' ? 2.5 : 5}kg → ${maxWeight + (tier === 'T1' ? 2.5 : 5)}kg`,
      badge: 'Ağırlık Artışı',
      badgeColor: '#10B981',
    };
  }

  // Find current stage
  const lastReps = Math.min(...sets.map((s) => parseInt(s.reps)));
  const stageIdx = progression.findIndex((p) => p.reps === lastReps);
  const nextStage = progression[Math.min(stageIdx + 1, progression.length - 1)];

  return {
    weight: maxWeight,
    reps: nextStage.reps,
    sets: nextStage.sets,
    label: `${nextStage.sets}×${nextStage.reps} @${maxWeight}kg (reset)`,
    badge: 'Tier Reset',
    badgeColor: '#E94560',
    reason: `${lastReps} tekrara düştü → protocol ilerliyor`,
  };
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────
export function getProgressionSuggestion(exercise, logs, currentWeek = 1) {
  const type = exercise.progressionRule?.type;
  switch (type) {
    case 'double_progression':
      return doubleProgressionSuggestion(exercise, logs);
    case 'linear':
      return linearProgressionSuggestion(exercise, logs);
    case 'rpe_autoregulate':
      return rpeAutoregulationSuggestion(exercise, logs);
    case 'percentage_wave':
      return percentageWaveSuggestion(exercise, logs, currentWeek);
    case 'gzcl_reset':
      return gzclResetSuggestion(exercise, logs);
    default:
      return null;
  }
}

// ─── Set Ramp Generator ───────────────────────────────────────────────────────
// Generates weekly set targets for a mesocycle (MEV → MRV ramp + deload)
export function generateSetRamp(baseSets, mesocycle) {
  if (!mesocycle?.phases) return [];
  const { durationWeeks, phases } = mesocycle;
  const ramp = [];

  // Collect non-deload weeks in order
  const workWeeks = [];
  for (let w = 1; w <= durationWeeks; w++) {
    const phase = phases.find((p) => p.weeks?.includes(w));
    if (phase && !phase.volumeMultiplier) workWeeks.push(w);
  }

  for (let w = 1; w <= durationWeeks; w++) {
    const phase = phases.find((p) => p.weeks?.includes(w));
    if (phase?.volumeMultiplier) {
      // Deload
      ramp.push(Math.max(1, Math.round(baseSets * phase.volumeMultiplier)));
    } else {
      const idx = workWeeks.indexOf(w);
      ramp.push(baseSets + Math.max(0, idx));
    }
  }

  return ramp;
}

// ─── Volume landmark defaults (RP Strength) ───────────────────────────────────
export const DEFAULT_VOLUME_LANDMARKS = {
  Göğüs:     { mev: 8,  mav: 14, mrv: 22 },
  Sırt:      { mev: 10, mav: 18, mrv: 25 },
  Omuz:      { mev: 8,  mav: 16, mrv: 22 },
  Bisep:     { mev: 8,  mav: 14, mrv: 20 },
  Trisep:    { mev: 6,  mav: 12, mrv: 18 },
  Bacak:     { mev: 8,  mav: 14, mrv: 20 },
  Kor:       { mev: 4,  mav: 10, mrv: 16 },
  Kalça:     { mev: 6,  mav: 12, mrv: 20 },
  Hamstring: { mev: 6,  mav: 10, mrv: 16 },
};

// ─── Mesocycle presets ────────────────────────────────────────────────────────
export const MESOCYCLE_PRESETS = {
  rp_6week: {
    label: 'RP Hipertrofi · 6 Hafta',
    description: 'Birikim ×3 + Yoğunlaştırma ×2 + Deload ×1',
    icon: '🧬',
    durationWeeks: 6,
    deloadWeek: 6,
    phases: [
      { name: 'Birikim',        weeks: [1, 2, 3], rpeTarget: 7.5, rpeMax: 8 },
      { name: 'Yoğunlaştırma',  weeks: [4, 5],    rpeTarget: 8.5, rpeMax: 9 },
      { name: 'Deload',         weeks: [6],        rpeTarget: 6,   rpeMax: 7, volumeMultiplier: 0.4 },
    ],
  },
  rp_4week: {
    label: 'RP Kısa Meso · 4 Hafta',
    description: 'Birikim ×2 + Yoğunlaştırma ×1 + Deload ×1',
    icon: '⚡',
    durationWeeks: 4,
    deloadWeek: 4,
    phases: [
      { name: 'Birikim',       weeks: [1, 2], rpeTarget: 7.5, rpeMax: 8 },
      { name: 'Yoğunlaştırma', weeks: [3],    rpeTarget: 8.5, rpeMax: 9 },
      { name: 'Deload',        weeks: [4],    rpeTarget: 6,   rpeMax: 7, volumeMultiplier: 0.4 },
    ],
  },
  dup_4week: {
    label: 'DUP · 4 Hafta',
    description: 'Günlük dalgalı yoğunluk (Zourdos 2016)',
    icon: '📊',
    durationWeeks: 4,
    deloadWeek: 4,
    phases: [
      { name: 'Hacim/Güç/Kuvvet Dalgası', weeks: [1, 2, 3], rpeTarget: 8, rpeMax: 9 },
      { name: 'Deload',                   weeks: [4],        rpeTarget: 6, rpeMax: 7, volumeMultiplier: 0.4 },
    ],
  },
  strength_531: {
    label: '5/3/1 Kuvvet · 4 Hafta',
    description: '%65-75-85-deload dalgası (Wendler)',
    icon: '💪',
    durationWeeks: 4,
    deloadWeek: 4,
    phases: [
      { name: 'Hf1 · %65-75', weeks: [1], rpeTarget: 7,   rpeMax: 7.5 },
      { name: 'Hf2 · %75-85', weeks: [2], rpeTarget: 8,   rpeMax: 8.5 },
      { name: 'Hf3 · %85-95', weeks: [3], rpeTarget: 8.5, rpeMax: 9.5 },
      { name: 'Deload · %40', weeks: [4], rpeTarget: 5,   rpeMax: 6, volumeMultiplier: 0.4 },
    ],
  },
};

export const PROGRESSION_RULES = [
  {
    type: 'double_progression',
    label: 'Çift Progresyon',
    description: 'Tekrar → sonra ağırlık artır (T2/T3 önerilen)',
    icon: '📈',
    defaultParams: { repRangeMin: 8, repRangeMax: 12, loadIncrement: 2.5 },
  },
  {
    type: 'linear',
    label: 'Lineer Artış',
    description: 'Her haftada sabit kg ekle (T1 kuvvet fazı)',
    icon: '➕',
    defaultParams: { loadIncrement: 2.5, repsTarget: 5 },
  },
  {
    type: 'rpe_autoregulate',
    label: 'RPE Autoregülasyon',
    description: '±2.5% per RPE noktası (Zourdos & Helms)',
    icon: '🎯',
    defaultParams: { targetRPE: 8, repsTarget: 5, adjustPct: 0.025 },
  },
  {
    type: 'percentage_wave',
    label: 'Yüzde Dalgası',
    description: '% 1RM bazlı dalga (5/3/1 & DUP)',
    icon: '🌊',
    defaultParams: {
      trainingMaxPct: 0.9,
      wavePattern: [0.65, 0.75, 0.85],
      repsForWave: [5, 3, 1],
    },
  },
  {
    type: 'gzcl_reset',
    label: 'GZCL Tiered Reset',
    description: 'Başarısız → tier drop → sıfırla (GZCLP)',
    icon: '🔄',
    defaultParams: {},
  },
];
