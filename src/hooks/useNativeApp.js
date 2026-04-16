import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { setupPushNotifications } from './utils/notifications';

export function useNativeApp() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupApp = async () => {
      try {
        await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            console.log('[app] App became active');
          } else {
            console.log('[app] App became inactive');
          }
        });

        await CapacitorApp.addListener('appUrlOpen', ({ url }) => {
          console.log('[app] App opened with URL:', url);
        });

        await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          console.log('[app] Back button pressed, canGoBack:', canGoBack);
        });

        await setupPushNotifications();

        console.log('[app] Native app initialized');
      } catch (error) {
        console.error('[app] Native app setup error:', error);
      }
    };

    setupApp();

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);
}

export function setupNativeFeatures() {
  if (typeof window === 'undefined') return;

  if (Capacitor.isNativePlatform()) {
    document.body.classList.add('native-platform');
  } else {
    document.body.classList.add('web-platform');
  }

  if (Capacitor.getPlatform() === 'ios') {
    document.body.classList.add('platform-ios');
  } else if (Capacitor.getPlatform() === 'android') {
    document.body.classList.add('platform-android');
  }
}
