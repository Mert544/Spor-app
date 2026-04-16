import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';

export function useCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isNative = Capacitor.isNativePlatform();

  const requestPermission = async () => {
    if (!isNative) return true;

    try {
      const status = await Camera.requestPermissions();
      setHasPermission(status.camera === 'granted');
      return status.camera === 'granted';
    } catch (error) {
      console.error('[camera] Permission error:', error);
      return false;
    }
  };

  const takePhoto = async () => {
    if (!isNative) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      return new Promise((resolve) => {
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          }
        };
        input.click();
      });
    }

    setIsLoading(true);
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: true,
      });

      return image.dataUrl;
    } catch (error) {
      console.error('[camera] Take photo error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    if (!isNative) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      return new Promise((resolve) => {
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          }
        };
        input.click();
      });
    }

    setIsLoading(true);
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      return image.dataUrl;
    } catch (error) {
      console.error('[camera] Pick photo error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isNative,
    hasPermission,
    isLoading,
    requestPermission,
    takePhoto,
    pickFromGallery,
  };
}

export function useHaptics() {
  const isNative = Capacitor.isNativePlatform();

  const impact = async (style = ImpactStyle.Medium) => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('[haptics] Impact error:', error);
    }
  };

  const vibrate = async (duration = 100) => {
    if (!isNative) return;
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.warn('[haptics] Vibrate error:', error);
    }
  };

  const notification = async (type = 'success') => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type });
    } catch (error) {
      console.warn('[haptics] Notification error:', error);
    }
  };

  return { impact, vibrate, notification };
}

export async function setupPushNotifications() {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
      return true;
    }

    return false;
  } catch (error) {
    console.error('[push] Setup error:', error);
    return false;
  }
}

export function usePushNotifications(onNotificationReceived) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      const hasPermission = await setupPushNotifications();
      if (hasPermission) {
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          onNotificationReceived?.(notification);
        });
      }
    };

    setup();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);
}

export async function saveSecurePreference(key, value) {
  try {
    await Preferences.set({ key, value: JSON.stringify(value) });
  } catch (error) {
    console.warn('[preferences] Save error:', error);
  }
}

export async function getSecurePreference(key, defaultValue = null) {
  try {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.warn('[preferences] Get error:', error);
    return defaultValue;
  }
}

export async function deleteSecurePreference(key) {
  try {
    await Preferences.remove({ key });
  } catch (error) {
    console.warn('[preferences] Delete error:', error);
  }
}

export async function savePhotoToFilesystem(base64Data, filename) {
  if (!Capacitor.isNativePlatform()) return base64Data;

  try {
    const fileName = `${filename}_${Date.now()}.jpg`;
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
    });
    return fileName;
  } catch (error) {
    console.error('[filesystem] Save photo error:', error);
    return base64Data;
  }
}

export async function readPhotoFromFilesystem(fileName) {
  if (!Capacitor.isNativePlatform()) return fileName;

  try {
    const { data } = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Documents,
    });
    return `data:image/jpeg;base64,${data}`;
  } catch (error) {
    console.error('[filesystem] Read photo error:', error);
    return fileName;
  }
}
