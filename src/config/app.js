import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

export const APP_VERSION = '1.0.0';
export const APP_BUILD = '1';

export const API_CONFIG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};

export const FEATURE_FLAGS = {
  enableCamera: true,
  enablePushNotifications: true,
  enableHaptics: true,
  enableAnalytics: true,
  enableOfflineMode: true,
};

export const PLATFORMS = {
  isIOS: Capacitor.getPlatform() === 'ios',
  isAndroid: Capacitor.getPlatform() === 'android',
  isWeb: !Capacitor.isNativePlatform(),
};

export const STORAGE_KEYS = {
  onboarding: 'vtaper-onboarding',
  settings: 'vtaper-settings',
  workout: 'vtaper-workout',
  progress: 'vtaper-progress',
  nutrition: 'vtaper-nutrition',
  gamification: 'vtaper-gamification',
  challenges: 'vtaper-challenges',
  photos: 'vtaper-photos',
};

export const NOTIFICATION_CHANNELS = {
  workout: {
    id: 'workout-reminders',
    name: 'Antrenman Hatırlatıcıları',
    description: 'Günlük antrenman hatırlatmaları',
    importance: 'high',
  },
  streak: {
    id: 'streak-alerts',
    name: 'Seri Uyarıları',
    description: 'Streak koruma uyarıları',
    importance: 'high',
  },
  challenges: {
    id: 'challenge-updates',
    name: 'Challenge Güncellemeleri',
    description: 'Challenge ilerleme ve tamamlama bildirimleri',
    importance: 'default',
  },
  marketing: {
    id: 'marketing',
    name: 'Kampanyalar',
    description: 'Özel kampanya ve promosyon bildirimleri',
    importance: 'low',
  },
};

export const PERMISSIONS = {
  camera: 'CAMERA',
  photoLibrary: 'PHOTOS',
  notifications: 'NOTIFICATIONS',
  location: 'LOCATION',
};

export const ANALYTICS_EVENTS = {
  workout_complete: 'workout_complete',
  streak_milestone: 'streak_milestone',
  challenge_complete: 'challenge_complete',
  level_up: 'level_up',
  achievement_unlock: 'achievement_unlock',
  photo_upload: 'photo_upload',
  onboarding_complete: 'onboarding_complete',
  subscription_start: 'subscription_start',
  subscription_cancel: 'subscription_cancel',
};
