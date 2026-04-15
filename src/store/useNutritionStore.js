import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DAILY_GOALS = {
  calories: 2500,
  protein: 150,
  carbs: 250,
  fat: 80,
  water: 3000,
};

const useNutritionStore = create(
  persist(
    (set, get) => ({
      dailyLogs: {},
      customFoods: [],

      logMeal: (date, meal) => {
        const id = Date.now().toString();
        set((state) => ({
          dailyLogs: {
            ...state.dailyLogs,
            [date]: {
              ...state.dailyLogs[date],
              meals: [...(state.dailyLogs[date]?.meals || []), { ...meal, id }],
            },
          },
        }));
        return id;
      },

      updateMeal: (date, mealId, updates) => {
        set((state) => ({
          dailyLogs: {
            ...state.dailyLogs,
            [date]: {
              ...state.dailyLogs[date],
              meals: (state.dailyLogs[date]?.meals || []).map((m) =>
                m.id === mealId ? { ...m, ...updates } : m
              ),
            },
          },
        }));
      },

      deleteMeal: (date, mealId) => {
        set((state) => ({
          dailyLogs: {
            ...state.dailyLogs,
            [date]: {
              ...state.dailyLogs[date],
              meals: (state.dailyLogs[date]?.meals || []).filter((m) => m.id !== mealId),
            },
          },
        }));
      },

      addWater: (date, ml) => {
        set((state) => ({
          dailyLogs: {
            ...state.dailyLogs,
            [date]: {
              ...state.dailyLogs[date],
              water: (state.dailyLogs[date]?.water || 0) + ml,
            },
          },
        }));
      },

      getDailyTotals: (date) => {
        const dayLog = get().dailyLogs[date] || {};
        const meals = dayLog.meals || [];
        const water = dayLog.water || 0;

        const totals = meals.reduce(
          (acc, meal) => ({
            calories: acc.calories + (meal.calories || 0),
            protein: acc.protein + (meal.protein || 0),
            carbs: acc.carbs + (meal.carbs || 0),
            fat: acc.fat + (meal.fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        return { ...totals, water };
      },

      getGoalProgress: (date) => {
        const totals = get().getDailyTotals(date);
        return {
          calories: Math.round((totals.calories / DAILY_GOALS.calories) * 100),
          protein: Math.round((totals.protein / DAILY_GOALS.protein) * 100),
          carbs: Math.round((totals.carbs / DAILY_GOALS.carbs) * 100),
          fat: Math.round((totals.fat / DAILY_GOALS.fat) * 100),
          water: Math.round((totals.water / DAILY_GOALS.water) * 100),
        };
      },

      getMeals: (date) => {
        return get().dailyLogs[date]?.meals || [];
      },

      getWater: (date) => {
        return get().dailyLogs[date]?.water || 0;
      },

      setDailyGoals: (goals) => {
        Object.assign(DAILY_GOALS, goals);
      },

      getDailyGoals: () => ({ ...DAILY_GOALS }),
    }),
    { name: 'vtaper-nutrition' }
  )
);

export { DAILY_GOALS };
export default useNutritionStore;
