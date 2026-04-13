// Stripe client configuration for payments
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const STRIPE_PRICES = {
  // Turkish Lira prices
  premium_monthly: process.env.NODE_ENV === 'production'
    ? 'price_premium_monthly_prod'
    : 'price_premium_monthly_test',
  premium_yearly: process.env.NODE_ENV === 'production'
    ? 'price_premium_yearly_prod'
    : 'price_premium_yearly_test',
  coach_monthly: process.env.NODE_ENV === 'production'
    ? 'price_coach_monthly_prod'
    : 'price_coach_monthly_test',
};

export const PLANS = [
  {
    id: 'premium_monthly',
    tier: 'premium',
    name: 'Premium',
    price: 49,
    currency: 'TRY',
    interval: 'month',
    priceId: STRIPE_PRICES.premium_monthly,
    features: [
      'AI Koç tam erişim',
      'Sınırsız özel program',
      'Gelişmiş analitik',
      'Form ipuçları',
      'Yemek planlama',
    ],
    highlight: false,
  },
  {
    id: 'premium_yearly',
    tier: 'premium',
    name: 'Premium (Yıllık)',
    price: 399,
    currency: 'TRY',
    interval: 'year',
    priceId: STRIPE_PRICES.premium_yearly,
    features: [
      'AI Koç tam erişim',
      'Sınırsız özel program',
      'Gelişmiş analitik',
      'Form ipuçları',
      'Yemek planlama',
      '%33 indirim',
    ],
    highlight: true,
    badge: 'En Popüler',
  },
  {
    id: 'coach_monthly',
    tier: 'coach',
    name: 'Coach',
    price: 149,
    currency: 'TRY',
    interval: 'month',
    priceId: STRIPE_PRICES.coach_monthly,
    features: [
      'AI Koç sınırsız',
      'Sınırsız özel program',
      'Gelişmiş analitik',
      'Form ipuçları',
      'Yemek planlama',
      '1:1 Koçluk desteği',
      'Haftalık review',
    ],
    highlight: false,
    badge: 'PRO',
  },
];

export { stripePromise };
