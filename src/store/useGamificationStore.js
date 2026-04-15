import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DAILY_QUESTS = {
  WORKOUT: {
    id: 'workout',
    title: 'Bugünkü Antrenman',
    icon: '🏋️',
    points: 100,
  },
  WATER: {
    id: 'water',
    title: 'Su Hedefi (3L)',
    icon: '💧',
    points: 20,
  },
  SLEEP: {
    id: 'sleep',
    title: '7+ Saat Uyku',
    icon: '😴',
    points: 20,
  },
  STRETCH: {
    id: 'stretch',
    title: 'Esneme/Rahatlama',
    icon: '🧘',
    points: 15,
  },
  STEP: {
    id: 'step',
    title: '10,000 Adım',
    icon: '🚶',
    points: 25,
  },
};

const ACHIEVEMENTS = [
  { id: 'first_workout', title: 'İlk Adım', description: 'İlk antrenmanını tamamla', icon: '🎯', requirement: 1, type: 'workout_count' },
  { id: 'streak_7', title: 'Haftalık Seri', description: '7 gün üst üste antrenman', icon: '🔥', requirement: 7, type: 'streak' },
  { id: 'streak_30', title: 'Aylık Efsane', description: '30 gün üst üste antrenman', icon: '💎', requirement: 30, type: 'streak' },
  { id: 'pr_5', title: 'PR Avcısı', description: '5 farklı egzersizde PR kır', icon: '🏆', requirement: 5, type: 'pr_count' },
  { id: 'volume_100k', title: 'Hacim Ustası', description: '100,000 kg toplam hacim', icon: '💪', requirement: 100000, type: 'total_volume' },
  { id: 'level_5', title: 'Seviye 5', description: 'Level 5\'e ulaş', icon: '⭐', requirement: 5, type: 'level' },
  { id: 'level_10', title: 'Seviye 10', description: 'Level 10\'a ulaş', icon: '🌟', requirement: 10, type: 'level' },
  { id: 'workout_50', title: 'Yarı Profesyonel', description: '50 antrenman tamamla', icon: '🎖️', requirement: 50, type: 'workout_count' },
  { id: 'workout_100', title: 'Profesyonel', description: '100 antrenman tamamla', icon: '🏅', requirement: 100, type: 'workout_count' },
  { id: 'consistency_14', title: 'İki Hafta', description: '14 gün streak', icon: '🔥', requirement: 14, type: 'streak' },
];

const useGamificationStore = create(
  persist(
    (set, get) => ({
      streak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalWorkouts: 0,
      totalVolume: 0,
      prCount: 0,
      achievements: [],
      dailyQuests: {
        workout: false,
        water: false,
        sleep: false,
        stretch: false,
        step: false,
      },
      questsWaterML: 0,
      questsSteps: 0,

      addXP: (amount) => {
        const state = get();
        let newXP = state.xp + amount;
        let newLevel = state.level;
        let xpNeeded = state.xpToNextLevel;

        while (newXP >= xpNeeded) {
          newXP -= xpNeeded;
          newLevel++;
          xpNeeded = Math.round(xpNeeded * 1.5);
        }

        set({
          xp: newXP,
          level: newLevel,
          xpToNextLevel: xpNeeded,
        });
      },

      completeQuest: (questId) => {
        const state = get();
        const quest = DAILY_QUESTS[questId.toUpperCase()];
        if (!quest || state.dailyQuests[questId]) return;

        set({
          dailyQuests: { ...state.dailyQuests, [questId]: true },
        });

        get().addXP(quest.points);
        get().checkAchievements();
      },

      recordWorkout: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newStreak = state.streak;
        if (state.lastWorkoutDate === today) {
          return;
        } else if (state.lastWorkoutDate === yesterday) {
          newStreak = state.streak + 1;
        } else if (!state.lastWorkoutDate) {
          newStreak = 1;
        } else {
          newStreak = 1;
        }

        set({
          streak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastWorkoutDate: today,
          totalWorkouts: state.totalWorkouts + 1,
          dailyQuests: { ...state.dailyQuests, workout: true },
        });

        get().addXP(100);
        get().checkAchievements();
      },

      addVolume: (kg) => {
        set((state) => ({
          totalVolume: state.totalVolume + kg,
        }));
        get().checkAchievements();
      },

      recordPR: () => {
        set((state) => ({
          prCount: state.prCount + 1,
        }));
        get().addXP(50);
        get().checkAchievements();
      },

      checkAchievements: () => {
        const state = get();
        const newAchievements = [...state.achievements];

        ACHIEVEMENTS.forEach((achievement) => {
          if (newAchievements.includes(achievement.id)) return;

          let unlocked = false;
          switch (achievement.type) {
            case 'streak':
              unlocked = state.streak >= achievement.requirement;
              break;
            case 'workout_count':
              unlocked = state.totalWorkouts >= achievement.requirement;
              break;
            case 'total_volume':
              unlocked = state.totalVolume >= achievement.requirement;
              break;
            case 'pr_count':
              unlocked = state.prCount >= achievement.requirement;
              break;
            case 'level':
              unlocked = state.level >= achievement.requirement;
              break;
          }

          if (unlocked) {
            newAchievements.push(achievement.id);
          }
        });

        if (newAchievements.length !== state.achievements.length) {
          set({ achievements: newAchievements });
        }
      },

      resetDailyQuests: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastReset = get().lastQuestReset;

        if (lastReset !== today) {
          set({
            dailyQuests: {
              workout: false,
              water: false,
              sleep: false,
              stretch: false,
              step: false,
            },
            questsWaterML: 0,
            questsSteps: 0,
            lastQuestReset: today,
          });
        }
      },

      addWater: (ml) => {
        set((state) => {
          const newTotal = state.questsWaterML + ml;
          const completed = newTotal >= 3000;
          return {
            questsWaterML: newTotal,
            dailyQuests: {
              ...state.dailyQuests,
              water: completed || state.dailyQuests.water,
            },
          };
        });
        get().checkAchievements();
      },

      addSteps: (steps) => {
        set((state) => {
          const newTotal = state.questsSteps + steps;
          const completed = newTotal >= 10000;
          return {
            questsSteps: newTotal,
            dailyQuests: {
              ...state.dailyQuests,
              step: completed || state.dailyQuests.step,
            },
          };
        });
        get().checkAchievements();
      },

      getStreakMessage: () => {
        const { streak } = get();
        if (streak >= 30) return `💎 ${streak} gün! Efsane!`;
        if (streak >= 7) return `🔥 ${streak} gün! Harika gidiyorsun!`;
        if (streak >= 3) return `⚡ ${streak} gün! Devam et!`;
        if (streak >= 1) return `▶️ ${streak} gün! Başladın!`;
        return '🎯 Hedefini yakala!';
      },

      getLevelProgress: () => {
        const { xp, level, xpToNextLevel } = get();
        return {
          current: xp,
          required: xpToNextLevel,
          percentage: Math.round((xp / xpToNextLevel) * 100),
          level,
        };
      },

      getDailyQuestProgress: () => {
        const { dailyQuests } = get();
        const completed = Object.values(dailyQuests).filter(Boolean).length;
        return {
          completed,
          total: Object.keys(dailyQuests).length,
          percentage: Math.round((completed / Object.keys(dailyQuests).length) * 100),
        };
      },

      getRecentAchievements: () => {
        const { achievements } = get();
        return ACHIEVEMENTS.filter(a => achievements.includes(a.id)).slice(-3);
      },
    }),
    { name: 'vtaper-gamification' }
  )
);

export { DAILY_QUESTS, ACHIEVEMENTS };
export default useGamificationStore;
