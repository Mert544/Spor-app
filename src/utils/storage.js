import { Preferences } from '@capacitor/preferences';

const isNative = window.location.protocol === 'capacitor:';

export async function setStorageItem(key, value) {
  if (isNative) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function getStorageItem(key) {
  if (isNative) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  } else {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}

export async function removeStorageItem(key) {
  if (isNative) {
    await Preferences.remove({ key });
  } else {
    localStorage.removeItem(key);
  }
}

export async function clearStorage() {
  if (isNative) {
    await Preferences.clear();
  } else {
    localStorage.clear();
  }
}

export async function getAllKeys() {
  if (isNative) {
    const { keys } = await Preferences.keys();
    return keys;
  } else {
    return Object.keys(localStorage);
  }
}
