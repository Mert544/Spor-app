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
        set((s) => ({ programs: { ...s.programs, [program.id]: program } })),

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
    }),
    { name: 'vtaper-custom-programs' }
  )
);

export default useCustomProgramStore;
