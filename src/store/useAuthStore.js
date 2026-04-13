import { create } from 'zustand';

// ─── Subscription tiers ─────────────────────────────────────────────────────
export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'TRY',
    interval: 'month',
    features: {
      aiCoach: false,
      customPrograms: false,
      advancedAnalytics: false,
      formVideos: false,
      mealPlanning: false,
      oneOnOneCoaching: false,
    },
    limits: {
      aiMessagesPerDay: 0,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 49,
    currency: 'TRY',
    interval: 'month',
    yearlyPrice: 399,
    features: {
      aiCoach: true,
      customPrograms: true,
      advancedAnalytics: true,
      formVideos: true,
      mealPlanning: true,
      oneOnOneCoaching: false,
    },
    limits: {
      aiMessagesPerDay: 20,
    },
  },
  coach: {
    id: 'coach',
    name: 'Coach',
    price: 149,
    currency: 'TRY',
    interval: 'month',
    features: {
      aiCoach: true,
      customPrograms: true,
      advancedAnalytics: true,
      formVideos: true,
      mealPlanning: true,
      oneOnOneCoaching: true,
    },
    limits: {
      aiMessagesPerDay: null,
    },
  },
};

// ─── Feature flags ───────────────────────────────────────────────────────
export const FEATURES = {
  AI_COACH: { id: 'aiCoach', name: 'AI Koç', icon: '🤖' },
  CUSTOM_PROGRAMS: { id: 'customPrograms', name: 'Özel Programlar', icon: '📋' },
  ADVANCED_ANALYTICS: { id: 'advancedAnalytics', name: 'Gelişmiş Analitik', icon: '📊' },
  FORM_VIDEOS: { id: 'formVideos', name: 'Form Videoları', icon: '📹' },
  MEAL_PLANNING: { id: 'mealPlanning', name: 'Yemek Planlama', icon: '🍽️' },
  ONE_ON_ONE: { id: 'oneOnOneCoaching', name: '1:1 Koçluk', icon: '👨‍🏫' },
};

// Auth state — NOT persisted (session is handled by Supabase's own storage)
const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isGuest: false,
  isPasswordRecovery: false,
  subscriptionTier: 'free',
  subscriptionExpiry: null,
  stripeCustomerId: null,

  setSession: (session) => set({ session, user: session?.user ?? null, loading: false, isGuest: false }),
  setLoading: (loading) => set({ loading }),
  setGuest: () => set({ isGuest: true, loading: false }),
  setPasswordRecovery: (v) => set({ isPasswordRecovery: v }),
  clearAuth: () => set({ user: null, session: null, isGuest: false, isPasswordRecovery: false, subscriptionTier: 'free', subscriptionExpiry: null, stripeCustomerId: null }),

  setSubscription: (tier, expiry = null, stripeCustomerId = null) =>
    set({ subscriptionTier: tier, subscriptionExpiry: expiry, stripeCustomerId }),

  isPremium: () => {
    const { subscriptionTier, subscriptionExpiry } = get();
    if (subscriptionExpiry && new Date(subscriptionExpiry) < new Date()) {
      return false;
    }
    return subscriptionTier === 'premium' || subscriptionTier === 'coach';
  },

  hasFeature: (featureId) => {
    const { subscriptionTier, subscriptionExpiry } = get();
    if (subscriptionExpiry && new Date(subscriptionExpiry) < new Date()) {
      return false;
    }
    const tier = SUBSCRIPTION_TIERS[subscriptionTier] || SUBSCRIPTION_TIERS.free;
    return tier.features[featureId] === true;
  },

  getTier: () => {
    const { subscriptionTier, subscriptionExpiry } = get();
    if (subscriptionExpiry && new Date(subscriptionExpiry) < new Date()) {
      return SUBSCRIPTION_TIERS.free;
    }
    return SUBSCRIPTION_TIERS[subscriptionTier] || SUBSCRIPTION_TIERS.free;
  },

  getMessagesRemaining: () => {
    const { subscriptionTier, subscriptionExpiry } = get();
    if (subscriptionExpiry && new Date(subscriptionExpiry) < new Date()) {
      return 0;
    }
    const tier = SUBSCRIPTION_TIERS[subscriptionTier];
    if (tier.limits.aiMessagesPerDay === null) return null; // unlimited
    return tier.limits.aiMessagesPerDay;
  },
}));

export default useAuthStore;
