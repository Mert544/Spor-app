import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { setupPushNotifications } from '../utils/notifications';

export function useNativeApp() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupApp = async () => {
      try {
        const { App } = await import('@capacitor/app');
        if (App?.addListener) {
          await App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
              console.log('[app] App became active');
            } else {
              console.log('[app] App became inactive');
            }
          });

          await App.addListener('appUrlOpen', ({ url }) => {
            console.log('[app] App opened with URL:', url);
          });
        }

        await setupPushNotifications();
        console.log('[app] Native app initialized');
      } catch (error) {
        console.warn('[app] Native app setup error:', error);
      }
    };

    setupApp();
  }, []);
}

export function setupNativeFeatures() {
  if (typeof window === 'undefined') return;

  if (Capacitor.isNativePlatform()) {
    document.body.classList.add('native-platform');
  } else {
    document.body.classList.add('web-platform');
  }

  const platform = Capacitor.getPlatform();
  if (platform === 'ios') {
    document.body.classList.add('platform-ios');
  } else if (platform === 'android') {
    document.body.classList.add('platform-android');
  }
}
