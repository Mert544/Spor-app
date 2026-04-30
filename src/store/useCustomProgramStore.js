import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Custom programs are stored as a dict matching ALL_PROGRAMS structure,
// plus extra fields for periodization modeling.
// ID format: custom_${timestamp}

const useCustomProgramStore = create(
  persist(
    (set, get) => ({
      programs: {}, // { [programId]: programObject }
      weeklyProgress: {}, // { [programId]: { completedDayIndices: number[], currentWeek: number } }

      addProgram: (program) =>
        set((s) => ({ programs: { ...s.programs, [program.id]: { ...program, mesocycleWeek: 1 } } })),

      updateProgram: (id, updates) =>
        set((s) => ({
          programs: {
            ...s.programs,
            [id]: { ...s.programs[id], ...updates },
          },
        })),

      deleteProgram: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.programs;
          return { programs: rest };
        }),

      getProgram: (id) => get().programs[id] ?? null,

      listPrograms: () => Object.values(get().programs),

      // Mesocycle week management
      getMesocycleWeek: (id) => get().programs[id]?.mesocycleWeek ?? 1,

      setMesocycleWeek: (id, week) =>
        set((s) => ({
          programs: {
            ...s.programs,
            [id]: { ...s.programs[id], mesocycleWeek: week },
          },
        })),

      incrementMesocycleWeek: (id) => {
        const program = get().programs[id];
        if (!program) return;
        const maxWeek = program.mesocycle?.durationWeeks ?? 6;
        const current = program.mesocycleWeek ?? 1;
        if (current < maxWeek) {
          get().setMesocycleWeek(id, current + 1);
        }
      },

      startNewMesocycle: (id) => {
        const program = get().programs[id];
        if (!program) return;
        // Reset week to 1; bump MEV landmarks toward previous MRV (10% adaptation nudge)
        const oldLandmarks = program.volumeLandmarks || {};
        const newLandmarks = {};
        Object.entries(oldLandmarks).forEach(([muscle, { mev, mav, mrv }]) => {
          if (mev == null || mav == null) {
            newLandmarks[muscle] = { mev, mav, mrv };
            return;
          }
          const nudge = Math.round((mav - mev) * 0.15);
          newLandmarks[muscle] = {
            mev: Math.min(mev + nudge, mav),
            mav: Math.min(mav + nudge, mrv),
            mrv,
          };
        });
        set((s) => ({
          programs: {
            ...s.programs,
            [id]: {
              ...s.programs[id],
              mesocycleWeek: 1,
              volumeLandmarks: newLandmarks,
              previousMesocycles: [
                ...(s.programs[id].previousMesocycles || []),
                {
                  completedAt: Date.now(),
                  durationWeeks: s.programs[id].mesocycle?.durationWeeks ?? 6,
                  landmarks: oldLandmarks,
                },
              ],
            },
          },
        }));
      },

      // Auto-advance mesocycle week when all program days completed in a week
      markDayComplete: (id, dayIndex, totalDays) => {
        if (!totalDays || totalDays <= 0) return;
        const wp = get().weeklyProgress[id] || { completedDayIndices: [], currentWeek: get().programs[id]?.mesocycleWeek ?? 1 };
        if (wp.completedDayIndices.includes(dayIndex)) return; // already counted today
        const nextIndices = [...wp.completedDayIndices, dayIndex];
        const maxWeek = get().programs[id]?.mesocycle?.durationWeeks ?? 6;
        let nextWeek = wp.currentWeek;
        if (nextIndices.length >= totalDays && nextWeek < maxWeek) {
          nextWeek += 1;
          nextIndices.length = 0; // reset for new week
        }
        set((s) => ({
          weeklyProgress: {
            ...s.weeklyProgress,
            [id]: { completedDayIndices: nextIndices, currentWeek: nextWeek },
          },
          programs: {
            ...s.programs,
            [id]: { ...s.programs[id], mesocycleWeek: nextWeek },
          },
        }));
      },

      getWeeklyProgress: (id) => get().weeklyProgress[id] || { completedDayIndices: [], currentWeek: get().programs[id]?.mesocycleWeek ?? 1 },
    }),
    { name: 'vtaper-custom-programs' }
  )
);

export default useCustomProgramStore;
