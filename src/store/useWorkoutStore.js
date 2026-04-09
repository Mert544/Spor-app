import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROGRAM } from '../data/program.js';

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
      // { "2026-04-09": { "pa1": { 0: {weight:80, reps:6, rpe:8, done:true} } } }
      logs: {},

      // Kişisel egzersiz notları: { "pa1": "Dirsekleri içerde tut" }
      exerciseNotes: {},

      logSet: (date, exerciseId, setIndex, data) =>
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: {
              ...state.logs[date],
              [exerciseId]: {
                ...state.logs[date]?.[exerciseId],
                [setIndex]: {
                  ...state.logs[date]?.[exerciseId]?.[setIndex],
                  ...data,
                },
              },
            },
          },
        })),

      setExerciseNote: (exerciseId, note) =>
        set((state) => ({
          exerciseNotes: { ...state.exerciseNotes, [exerciseId]: note },
        })),

      getExerciseLogs: (date, exerciseId) =>
        get().logs[date]?.[exerciseId] || {},

      isExerciseComplete: (date, exerciseId, totalSets) => {
        const exLogs = get().logs[date]?.[exerciseId] || {};
        return Object.values(exLogs).filter((s) => s?.done).length >= totalSets;
      },

      getDayProgress: (date, exercises) => {
        const completed = exercises.filter((ex) =>
          get().isExerciseComplete(date, ex.id, ex.sets)
        ).length;
        return { completed, total: exercises.length };
      },

      // Streak: kaç gün üst üste en az 1 set tamamlandı
      getStreak: () => {
        const logs = get().logs;
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayLogs = logs[dateStr];
          const hasActivity = dayLogs && Object.values(dayLogs).some(
            exLogs => Object.values(exLogs).some(s => s?.done)
          );
          if (hasActivity) {
            streak++;
          } else if (i > 0) {
            break; // Bugün antrenman yoksa streak hâlâ devam edebilir (i=0 geç)
          }
        }
        return streak;
      },

      // Kas grubu için haftalık tamamlanan set sayısı
      getWeeklyVolume: (weekStartDate, muscle) => {
        const logs = get().logs;
        let totalSets = 0;
        const startDate = new Date(weekStartDate);
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          const dayLogs = logs[dateStr];
          if (!dayLogs) continue;
          for (const dayName of Object.keys(PROGRAM)) {
            const exercises = PROGRAM[dayName].exercises;
            for (const ex of exercises) {
              if (ex.muscle !== muscle && !ex.muscle?.includes(muscle)) continue;
              const exLogs = dayLogs[ex.id];
              if (!exLogs) continue;
              totalSets += Object.values(exLogs).filter((s) => s?.done).length;
            }
          }
        }
        return totalSets;
      },

      // Toplam antrenman hacmi (bir seans için)
      getSessionVolume: (date, exercises) => {
        const logs = get().logs[date] || {};
        let totalVolume = 0;
        let totalSets = 0;
        for (const ex of exercises) {
          const exLogs = logs[ex.id] || {};
          for (const setLog of Object.values(exLogs)) {
            if (setLog?.done && setLog.weight && setLog.reps) {
              totalVolume += (setLog.weight || 0) * (parseInt(setLog.reps) || 0);
              totalSets++;
            }
          }
        }
        return { totalVolume: Math.round(totalVolume), totalSets };
      },
    }),
    { name: 'vtaper-workout-logs' }
  )
);

export default useWorkoutStore;
