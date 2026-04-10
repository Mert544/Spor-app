import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Custom exercises added to specific workout days
// Structure: { "2026-04-10": [{id, name, muscle, sets, reps}] }
export const useCustomStore = create(
  persist(
    (set, get) => ({
      dayExercises: {},

      addExercise: (date, exercise) =>
        set((s) => ({
          dayExercises: {
            ...s.dayExercises,
            [date]: [
              ...(s.dayExercises[date] || []),
              { ...exercise, id: `custom_${Date.now()}` },
            ],
          },
        })),

      removeExercise: (date, id) =>
        set((s) => ({
          dayExercises: {
            ...s.dayExercises,
            [date]: (s.dayExercises[date] || []).filter(e => e.id !== id),
          },
        })),

      getExercises: (date) => get().dayExercises[date] || [],
    }),
    { name: 'vtaper-custom-exercises' }
  )
);

export default useCustomStore;
