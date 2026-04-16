import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useNativeApp() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    console.log('[app] Native app initialized');
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
