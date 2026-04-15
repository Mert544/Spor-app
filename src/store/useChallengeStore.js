import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CHALLENGES = [
  {
    id: 'weekly_volume_50k',
    title: 'Haftalık Hacim Ustası',
    description: 'Bu hafta 50,000 kg toplam hacim kaldır',
    icon: '💪',
    type: 'weekly',
    goal: 50000,
    unit: 'kg',
    xpReward: 500,
    tier: 'bronze',
  },
  {
    id: 'weekly_workouts_5',
    title: 'Haftada 5 Antrenman',
    description: '7 gün içinde 5 antrenman tamamla',
    icon: '🏋️',
    type: 'weekly',
    goal: 5,
    unit: 'gün',
    xpReward: 300,
    tier: 'bronze',
  },
  {
    id: 'streak_7',
    title: '7 Gün Seri',
    description: '7 gün üst üste antrenman yap',
    icon: '🔥',
    type: 'streak',
    goal: 7,
    unit: 'gün',
    xpReward: 400,
    tier: 'silver',
  },
  {
    id: 'pr_3',
    title: 'PR Avcısı',
    description: '3 yeni kişisel rekord kır',
    icon: '🏆',
    type: 'pr',
    goal: 3,
    unit: 'PR',
    xpReward: 350,
    tier: 'silver',
  },
  {
    id: 'monthly_volume_200k',
    title: 'Aylık Hacim Kralı',
    description: 'Bu ay 200,000 kg toplam hacim kaldır',
    icon: '👑',
    type: 'monthly',
    goal: 200000,
    unit: 'kg',
    xpReward: 1000,
    tier: 'gold',
  },
  {
    id: 'consistency_30',
    title: '30 Gün Seri',
    description: '30 gün üst üste antrenman yap',
    icon: '💎',
    type: 'streak',
    goal: 30,
    unit: 'gün',
    xpReward: 2000,
    tier: 'gold',
  },
];

const useChallengeStore = create(
  persist(
    (set, get) => ({
      activeChallenges: [],
      completedChallenges: [],
      challengeProgress: {},

      startChallenge: (challengeId) => {
        const state = get();
        const challenge = CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return;

        if (state.activeChallenges.includes(challengeId)) return;

        set({
          activeChallenges: [...state.activeChallenges, challengeId],
          challengeProgress: {
            ...state.challengeProgress,
            [challengeId]: { current: 0, startedAt: new Date().toISOString() },
          },
        });
      },

      updateProgress: (challengeId, value) => {
        set((state) => ({
          challengeProgress: {
            ...state.challengeProgress,
            [challengeId]: {
              ...state.challengeProgress[challengeId],
              current: value,
            },
          },
        }));
        get().checkCompletion(challengeId);
      },

      addProgress: (challengeId, amount) => {
        const state = get();
        const current = state.challengeProgress[challengeId]?.current || 0;
        get().updateProgress(challengeId, current + amount);
      },

      checkCompletion: (challengeId) => {
        const state = get();
        const challenge = CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return;

        const progress = state.challengeProgress[challengeId]?.current || 0;
        if (progress >= challenge.goal && !state.completedChallenges.includes(challengeId)) {
          get().completeChallenge(challengeId);
        }
      },

      completeChallenge: (challengeId) => {
        const state = get();
        const challenge = CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return;

        set({
          completedChallenges: [...state.completedChallenges, challengeId],
          activeChallenges: state.activeChallenges.filter(id => id !== challengeId),
        });
      },

      getActiveChallenges: () => {
        const state = get();
        return CHALLENGES.filter(c =>
          state.activeChallenges.includes(c.id) &&
          !state.completedChallenges.includes(c.id)
        ).map(c => ({
          ...c,
          progress: state.challengeProgress[c.id]?.current || 0,
          percentage: Math.min(100, Math.round(((state.challengeProgress[c.id]?.current || 0) / c.goal) * 100)),
        }));
      },

      getAvailableChallenges: () => {
        const state = get();
        return CHALLENGES.filter(c =>
          !state.activeChallenges.includes(c.id) &&
          !state.completedChallenges.includes(c.id)
        );
      },

      getCompletedChallenges: () => {
        const state = get();
        return CHALLENGES.filter(c => state.completedChallenges.includes(c.id));
      },

      getChallengeById: (id) => {
        return CHALLENGES.find(c => c.id === id);
      },

      getTimeRemaining: (challengeId) => {
        const state = get();
        const challenge = CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return null;

        const startedAt = state.challengeProgress[challengeId]?.startedAt;
        if (!startedAt) return null;

        const start = new Date(startedAt);
        const now = new Date();
        let end;

        if (challenge.type === 'weekly') {
          end = new Date(start);
          end.setDate(end.getDate() + 7);
        } else if (challenge.type === 'monthly') {
          end = new Date(start);
          end.setMonth(end.getMonth() + 1);
        }

        const remaining = end - now;
        if (remaining <= 0) return 'Süre doldu';

        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}g ${hours}s kaldı`;
        return `${hours}s kaldı`;
      },

      resetWeeklyChallenges: () => {
        const state = get();
        const weeklyChallengeIds = CHALLENGES
          .filter(c => c.type === 'weekly')
          .map(c => c.id);

        const stillActive = state.activeChallenges.filter(id => !weeklyChallengeIds.includes(id));
        const resetProgress = { ...state.challengeProgress };

        weeklyChallengeIds.forEach(id => {
          if (state.activeChallenges.includes(id)) {
            resetProgress[id] = { current: 0, startedAt: new Date().toISOString() };
          }
        });

        set({
          activeChallenges: stillActive,
          challengeProgress: resetProgress,
        });
      },
    }),
    { name: 'vtaper-challenges' }
  )
);

export { CHALLENGES };
export default useChallengeStore;
