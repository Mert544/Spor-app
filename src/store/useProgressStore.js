import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgressStore = create(
  persist(
    (set, get) => ({
      // Kilo: { "2026-04-09": 94.2 }
      weights: {},
      // Vücut ölçümleri: { "2026-04-09": { waist: 88, chest: 105, arm: 38, hip: 100 } }
      measurements: {},
      // Haftalık check-in: { 1: { energy:8, sleep:7, hunger:6, motivation:9, recovery:7, mood:8 } }
      weeklyCheckIns: {},
      // Program takibi
      currentWeek: 1,
      startWeight: null,
      targetWeight: null,
      startDate: new Date().toISOString().split('T')[0],

      addWeight: (date, weight) =>
        set((state) => ({ weights: { ...state.weights, [date]: parseFloat(weight) } })),

      addMeasurement: (date, data) =>
        set((state) => ({ measurements: { ...state.measurements, [date]: data } })),

      addCheckIn: (week, data) =>
        set((state) => ({ weeklyCheckIns: { ...state.weeklyCheckIns, [week]: data } })),

      setCurrentWeek: (week) => set({ currentWeek: parseInt(week) }),

      setStartWeight: (w) => set({ startWeight: parseFloat(w) }),

      // Son N günlük ağırlıkları sıralı al
      getRecentWeights: (days = 30) => {
        const weights = get().weights;
        return Object.entries(weights)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-days)
          .map(([date, weight]) => ({ date, weight }));
      },

      // 7 günlük hareketli ortalama
      getWeeklyAverage: () => {
        const weights = get().weights;
        const last7 = Object.entries(weights)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .slice(0, 7)
          .map(([_, w]) => w);
        if (last7.length === 0) return null;
        return parseFloat((last7.reduce((a, b) => a + b, 0) / last7.length).toFixed(1));
      },

      // Bugünkü kilo
      getTodayWeight: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().weights[today] || null;
      },

      // Toplam değişim
      getTotalChange: () => {
        const { startWeight, weights } = get();
        if (!startWeight) return null;
        const sorted = Object.entries(weights).sort((a, b) => b[0].localeCompare(a[0]));
        if (sorted.length === 0) return null;
        return parseFloat((sorted[0][1] - startWeight).toFixed(1));
      },
    }),
    { name: 'vtaper-progress' }
  )
);

export default useProgressStore;
