import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Custom programs are stored as a dict matching ALL_PROGRAMS structure,
// plus extra fields for periodization modeling.
// ID format: custom_${timestamp}

const useCustomProgramStore = create(
  persist(
    (set, get) => ({
      programs: {}, // { [programId]: programObject }

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
    }),
    { name: 'vtaper-custom-programs' }
  )
);

export default useCustomProgramStore;
