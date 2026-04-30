import { create } from 'zustand';
import { SUBSCRIPTION_TIERS, FEATURES } from './subscriptionTiers.js';

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

export { SUBSCRIPTION_TIERS, FEATURES };
export default useAuthStore;