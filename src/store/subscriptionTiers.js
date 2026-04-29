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
