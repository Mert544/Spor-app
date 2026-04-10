import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function e1rm(weight, reps) {
  const w = parseFloat(weight), r = parseInt(reps);
  if (!w || !r || r < 1) return 0;
  return r === 1 ? w : Math.round(w * (1 + r / 30));
}

// Strip level suffix: 'pa1_o' → 'pa1', 'pa1_k' → 'pa1'
function baseId(id) {
  return id.replace(/_(k|o|z)$/, '');
}

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
      logs: {},
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
                  ts: Date.now(),
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

      // Auto-fill: last recorded weight for same exercise + set index (before today)
      getPreviousWeight: (exerciseId, setIndex) => {
        const logs = get().logs;
        const today = new Date().toISOString().split('T')[0];
        const dates = Object.keys(logs).filter(d => d < today).sort().reverse();
        for (const date of dates) {
          const w = logs[date]?.[exerciseId]?.[setIndex]?.weight;
          if (w != null && w !== '') return Number(w);
        }
        return null;
      },

      // Best e1RM across ALL sessions (any level suffix for same base exercise)
      getPersonalRecord: (exerciseId) => {
        const logs = get().logs;
        const base = baseId(exerciseId);
        let best = null;
        for (const [date, dayLogs] of Object.entries(logs)) {
          for (const [exId, exLogs] of Object.entries(dayLogs)) {
            if (exId !== exerciseId && baseId(exId) !== base) continue;
            for (const setData of Object.values(exLogs)) {
              if (!setData?.done || !setData.weight || !setData.reps) continue;
              const est = e1rm(setData.weight, setData.reps);
              if (!best || est > best.e1rm) {
                best = {
                  weight: Number(setData.weight),
                  reps: Number(setData.reps),
                  e1rm: est,
                  date,
                };
              }
            }
          }
        }
        return best;
      },

      // Chronological history of max weight per session (for sparkline)
      getExerciseHistory: (exerciseId) => {
        const logs = get().logs;
        const base = baseId(exerciseId);
        const byDate = {};
        for (const [date, dayLogs] of Object.entries(logs)) {
          for (const [exId, exLogs] of Object.entries(dayLogs)) {
            if (exId !== exerciseId && baseId(exId) !== base) continue;
            for (const setData of Object.values(exLogs)) {
              if (!setData?.done || !setData.weight) continue;
              const w = Number(setData.weight);
              const est = e1rm(setData.weight, setData.reps);
              if (!byDate[date] || w > byDate[date].maxWeight) {
                byDate[date] = { date, maxWeight: w, maxE1RM: est };
              }
            }
          }
        }
        return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
      },

      // All dates with at least one completed set (for calendar)
      getLoggedDates: () => {
        const logs = get().logs;
        return Object.keys(logs).filter(date => {
          const dl = logs[date];
          return Object.values(dl).some(exLogs =>
            Object.values(exLogs).some(s => s?.done)
          );
        });
      },

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
            break;
          }
        }
        return streak;
      },

      // Weekly volume — allExercises: [{id, muscle}] from active program
      getWeeklyVolume: (weekStartDate, muscle, allExercises = []) => {
        const logs = get().logs;
        let totalSets = 0;
        const startDate = new Date(weekStartDate);
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          const dayLogs = logs[dateStr];
          if (!dayLogs) continue;
          for (const ex of allExercises) {
            if (ex.muscle !== muscle) continue;
            const exLogs = dayLogs[ex.id];
            if (!exLogs) continue;
            totalSets += Object.values(exLogs).filter((s) => s?.done).length;
          }
        }
        return totalSets;
      },

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
