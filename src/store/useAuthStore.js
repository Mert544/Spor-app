import { create } from 'zustand';
import { SUBSCRIPTION_TIERS, FEATURES } from './subscriptionTiers.js';

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

  _isExpired: () => {
    const { subscriptionExpiry } = get();
    return !!(subscriptionExpiry && new Date(subscriptionExpiry) < new Date());
  },

  isPremium: () => {
    if (get()._isExpired()) return false;
    return get().subscriptionTier === 'premium' || get().subscriptionTier === 'coach';
  },

  hasFeature: (featureId) => {
    if (get()._isExpired()) return false;
    const tier = SUBSCRIPTION_TIERS[get().subscriptionTier] || SUBSCRIPTION_TIERS.free;
    return tier.features[featureId] === true;
  },

  getTier: () => {
    if (get()._isExpired()) return SUBSCRIPTION_TIERS.free;
    return SUBSCRIPTION_TIERS[get().subscriptionTier] || SUBSCRIPTION_TIERS.free;
  },

  getDailyMessageLimit: () => {
    if (get()._isExpired()) return 0;
    const tier = SUBSCRIPTION_TIERS[get().subscriptionTier];
    if (tier.limits.aiMessagesPerDay === null) return null;
    return tier.limits.aiMessagesPerDay;
  },
}));

export { SUBSCRIPTION_TIERS, FEATURES };
export default useAuthStore;
