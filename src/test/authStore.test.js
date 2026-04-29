import { describe, it, expect, beforeEach } from 'vitest';
import useAuthStore, { SUBSCRIPTION_TIERS } from '../store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      loading: true,
      isGuest: false,
      isPasswordRecovery: false,
      subscriptionTier: 'free',
      subscriptionExpiry: null,
      stripeCustomerId: null,
    });
  });

  it('defaults to free tier', () => {
    expect(useAuthStore.getState().subscriptionTier).toBe('free');
    expect(useAuthStore.getState().isPremium()).toBe(false);
  });

  it('detects premium tier correctly', () => {
    useAuthStore.getState().setSubscription('premium');
    expect(useAuthStore.getState().isPremium()).toBe(true);
    expect(useAuthStore.getState().getTier().id).toBe('premium');
  });

  it('detects expired subscription', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    useAuthStore.getState().setSubscription('premium', pastDate.toISOString());
    expect(useAuthStore.getState().isPremium()).toBe(false);
    expect(useAuthStore.getState().getTier().id).toBe('free');
  });

  it('hasFeature returns correct values for free tier', () => {
    expect(useAuthStore.getState().hasFeature('customPrograms')).toBe(false);
    expect(useAuthStore.getState().hasFeature('advancedAnalytics')).toBe(false);
    expect(useAuthStore.getState().hasFeature('aiCoach')).toBe(false);
  });

  it('hasFeature returns correct values for premium tier', () => {
    useAuthStore.getState().setSubscription('premium');
    expect(useAuthStore.getState().hasFeature('customPrograms')).toBe(true);
    expect(useAuthStore.getState().hasFeature('advancedAnalytics')).toBe(true);
    expect(useAuthStore.getState().hasFeature('aiCoach')).toBe(true);
  });

  it('coach tier has all features including oneOnOne', () => {
    useAuthStore.getState().setSubscription('coach');
    expect(useAuthStore.getState().hasFeature('oneOnOneCoaching')).toBe(true);
    expect(useAuthStore.getState().getMessagesRemaining()).toBeNull();
  });

  it('free tier has 0 AI messages', () => {
    expect(useAuthStore.getState().getMessagesRemaining()).toBe(0);
  });

  it('premium tier has 20 AI messages per day', () => {
    useAuthStore.getState().setSubscription('premium');
    expect(useAuthStore.getState().getMessagesRemaining()).toBe(20);
  });

  it('expired premium returns 0 messages', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    useAuthStore.getState().setSubscription('premium', pastDate.toISOString());
    expect(useAuthStore.getState().getMessagesRemaining()).toBe(0);
  });

  it('clears auth state completely', () => {
    useAuthStore.getState().setSubscription('premium', null, 'cus_123');
    useAuthStore.getState().setGuest();
    useAuthStore.getState().clearAuth();
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.session).toBeNull();
    expect(s.isGuest).toBe(false);
    expect(s.subscriptionTier).toBe('free');
    expect(s.stripeCustomerId).toBeNull();
  });

  it('SUBSCRIPTION_TIERS has correct pricing', () => {
    expect(SUBSCRIPTION_TIERS.free.price).toBe(0);
    expect(SUBSCRIPTION_TIERS.premium.price).toBe(49);
    expect(SUBSCRIPTION_TIERS.coach.price).toBe(149);
    expect(SUBSCRIPTION_TIERS.premium.yearlyPrice).toBe(399);
  });
});
