import { Haptics, ImpactStyle } from '@capacitor/haptics';

let isNative = false;

export function detectPlatform() {
  isNative = window.location.protocol === 'capacitor:';
  return {
    isNative,
    isWeb: !isNative,
    platform: isNative ? 'native' : 'web',
  };
}

export async function hapticFeedback(style = 'Medium') {
  if (!isNative) return;
  try {
    const styleMap = {
      Light: ImpactStyle.Light,
      Medium: ImpactStyle.Medium,
      Heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styleMap[style] || ImpactStyle.Medium });
  } catch {
    // Haptics not available
  }
}

export async function hapticNotification(type = 'success') {
  if (!isNative) return;
  try {
    if (type === 'success') {
      await Haptics.notification({ type: 'SUCCESS' });
    } else if (type === 'warning') {
      await Haptics.notification({ type: 'WARNING' });
    } else if (type === 'error') {
      await Haptics.notification({ type: 'ERROR' });
    }
  } catch {
    // Haptics not available
  }
}

export async function hapticSelection() {
  if (!isNative) return;
  try {
    await Haptics.selection();
  } catch {
    // Haptics not available
  }
}

export { isNative };
