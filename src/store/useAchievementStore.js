import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_workout',
    title: 'İlk Adım',
    description: 'İlk antrenmanını tamamla',
    emoji: '🏋️',
    color: '#14B8A6',
    condition: (state) => state.totalWorkouts >= 1,
  },
  {
    id: 'week_warrior',
    title: 'Hafta Savaşçısı',
    description: '7 gün üst üste antrenman yap',
    emoji: '🔥',
    color: '#F5A623',
    condition: (state) => state.maxStreak >= 7,
  },
  {
    id: 'month_master',
    title: 'Ayın Ustası',
    description: '30 gün üst üste antrenman yap',
    emoji: '💎',
    color: '#8B5CF6',
    condition: (state) => state.maxStreak >= 30,
  },
  {
    id: 'volume_king',
    title: 'Hacim Kralı',
    description: 'Tek seansta 10.000 kg hacim yap',
    emoji: '👑',
    color: '#E94560',
    condition: (state) => state.maxSessionVolume >= 10000,
  },
  {
    id: 'pr_breaker',
    title: 'Rekor Kıran',
    description: 'İlk PR\'ını kır',
    emoji: '🏆',
    color: '#F5A623',
    condition: (state) => state.totalPRs >= 1,
  },
  {
    id: 'pr_legend',
    title: 'PR Efsanesi',
    description: '10 PR kır',
    emoji: '🚀',
    color: '#EC4899',
    condition: (state) => state.totalPRs >= 10,
  },
  {
    id: 'program_creator',
    title: 'Program Ustası',
    description: 'İlk özel programını oluştur',
    emoji: '📋',
    color: '#3B82F6',
    condition: (state) => state.customProgramsCreated >= 1,
  },
  {
    id: 'program_master',
    title: 'Program Dehası',
    description: '5 özel program oluştur',
    emoji: '🎯',
    color: '#10B981',
    condition: (state) => state.customProgramsCreated >= 5,
  },
  {
    id: 'weight_tracker',
    title: 'Kilo Takipçisi',
    description: '30 gün kilo kaydet',
    emoji: '⚖️',
    color: '#6366F1',
    condition: (state) => state.weightEntries >= 30,
  },
  {
    id: 'early_bird',
    title: 'Erken Kuş',
    description: 'Sabah 7\'den önce antrenman yap',
    emoji: '🌅',
    color: '#F97316',
    condition: (state) => state.earlyWorkouts >= 1,
  },
  {
    id: 'night_owl',
    title: 'Gece Kuşu',
    description: 'Akşam 10\'dan sonra antrenman yap',
    emoji: '🌙',
    color: '#1D4ED8',
    condition: (state) => state.lateWorkouts >= 1,
  },
  {
    id: 'consistent',
    title: 'Tutarlı',
    description: 'Toplam 50 antrenman tamamla',
    emoji: '📊',
    color: '#14B8A6',
    condition: (state) => state.totalWorkouts >= 50,
  },
  {
    id: 'legend',
    title: 'Efsane',
    description: 'Toplam 100 antrenman tamamla',
    emoji: '🌟',
    color: '#F5A623',
    condition: (state) => state.totalWorkouts >= 100,
  },
];

const useAchievementStore = create(
  persist(
    (set, get) => ({
      unlocked: [], // ['first_workout', 'week_warrior', ...]
      stats: {
        totalWorkouts: 0,
        maxStreak: 0,
        maxSessionVolume: 0,
        totalPRs: 0,
        customProgramsCreated: 0,
        weightEntries: 0,
        earlyWorkouts: 0,
        lateWorkouts: 0,
      },
      lastChecked: null,

      checkAchievements: () => {
        const { unlocked, stats } = get();
        const newlyUnlocked = [];

        for (const ach of ACHIEVEMENTS) {
          if (!unlocked.includes(ach.id) && ach.condition(stats)) {
            newlyUnlocked.push(ach);
          }
        }

        if (newlyUnlocked.length > 0) {
          set({
            unlocked: [...unlocked, ...newlyUnlocked.map((a) => a.id)],
            lastChecked: Date.now(),
          });
        }

        return newlyUnlocked;
      },

      updateStats: (patch) => {
        set((s) => ({
          stats: { ...s.stats, ...patch },
        }));
        return get().checkAchievements();
      },

      // Convenience methods for common events
      recordWorkout: (sessionVolume = 0, hour = new Date().getHours()) => {
        const patch = {
          totalWorkouts: get().stats.totalWorkouts + 1,
          maxSessionVolume: Math.max(get().stats.maxSessionVolume, sessionVolume),
        };
        if (hour < 7) patch.earlyWorkouts = get().stats.earlyWorkouts + 1;
        if (hour >= 22) patch.lateWorkouts = get().stats.lateWorkouts + 1;
        return get().updateStats(patch);
      },

      recordStreak: (streak) => {
        if (streak > get().stats.maxStreak) {
          return get().updateStats({ maxStreak: streak });
        }
        return [];
      },

      recordPR: () => get().updateStats({ totalPRs: get().stats.totalPRs + 1 }),
      recordProgramCreated: () => get().updateStats({ customProgramsCreated: get().stats.customProgramsCreated + 1 }),
      recordWeightEntry: () => get().updateStats({ weightEntries: get().stats.weightEntries + 1 }),

      getProgress: (achievementId) => {
        const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!ach) return 0;
        // Simple progress calculation based on condition
        const s = get().stats;
        if (achievementId === 'first_workout') return Math.min(s.totalWorkouts / 1, 1);
        if (achievementId === 'week_warrior') return Math.min(s.maxStreak / 7, 1);
        if (achievementId === 'month_master') return Math.min(s.maxStreak / 30, 1);
        if (achievementId === 'volume_king') return Math.min(s.maxSessionVolume / 10000, 1);
        if (achievementId === 'pr_breaker') return Math.min(s.totalPRs / 1, 1);
        if (achievementId === 'pr_legend') return Math.min(s.totalPRs / 10, 1);
        if (achievementId === 'program_creator') return Math.min(s.customProgramsCreated / 1, 1);
        if (achievementId === 'program_master') return Math.min(s.customProgramsCreated / 5, 1);
        if (achievementId === 'weight_tracker') return Math.min(s.weightEntries / 30, 1);
        if (achievementId === 'early_bird') return Math.min(s.earlyWorkouts / 1, 1);
        if (achievementId === 'late_workouts') return Math.min(s.lateWorkouts / 1, 1);
        if (achievementId === 'consistent') return Math.min(s.totalWorkouts / 50, 1);
        if (achievementId === 'legend') return Math.min(s.totalWorkouts / 100, 1);
        return 0;
      },
    }),
    { name: 'vtaper-achievements' }
  )
);

export default useAchievementStore;
