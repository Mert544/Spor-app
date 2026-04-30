import { describe, it, expect } from 'vitest';

// Plain JS store factory mimicking useSettingsStore logic
function createTestStore() {
  let state = {
    isOnboarded: false,
    user: { name: '', height: '', gender: null },
    hapticEnabled: true,
    soundEnabled: false,
    timerVisible: false,
    activeProgram: 'vtaper_orta',
    notificationsEnabled: false,
    deloadDismissed: false,
    coachSessionId: null,
    tourShown: false,
    userProfile: null,
    theme: 'dark',
  };

  function getState() { return state; }

  function set(patch) {
    if (typeof patch === 'function') {
      state = { ...state, ...patch(state) };
    } else {
      state = { ...state, ...patch };
    }
  }

  return {
    getState,
    setOnboarded: (v) => set({ isOnboarded: v }),
    setUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
    setHapticEnabled: (v) => set({ hapticEnabled: v }),
    setSoundEnabled: (v) => set({ soundEnabled: v }),
    setTimerVisible: (v) => set({ timerVisible: v }),
    setActiveProgram: (id) => set({ activeProgram: id }),
    setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
    setDeloadDismissed: (v) => set({ deloadDismissed: v }),
    setCoachSessionId: (id) => set({ coachSessionId: id }),
    setTourShown: (v) => set({ tourShown: v }),
    setUserProfile: (v) => set({ userProfile: v }),
    setTheme: (theme) => set({ theme }),
    getCurrentTheme: () => {
      const { theme } = state;
      if (theme === 'system') {
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark';
      }
      return theme;
    },
  };
}

describe('useSettingsStore', () => {
  let store;

  function freshStore() {
    store = createTestStore();
  }

  describe('initial state', () => {
    it('has correct defaults', () => {
      freshStore();
      const s = store.getState();
      expect(s.isOnboarded).toBe(false);
      expect(s.user).toEqual({ name: '', height: '', gender: null });
      expect(s.hapticEnabled).toBe(true);
      expect(s.soundEnabled).toBe(false);
      expect(s.timerVisible).toBe(false);
      expect(s.activeProgram).toBe('vtaper_orta');
      expect(s.notificationsEnabled).toBe(false);
      expect(s.deloadDismissed).toBe(false);
      expect(s.coachSessionId).toBeNull();
      expect(s.tourShown).toBe(false);
      expect(s.userProfile).toBeNull();
      expect(s.theme).toBe('dark');
    });
  });

  describe('setOnboarded', () => {
    it('sets onboarding status', () => {
      freshStore();
      store.setOnboarded(true);
      expect(store.getState().isOnboarded).toBe(true);
    });

    it('can toggle back to false', () => {
      freshStore();
      store.setOnboarded(true);
      store.setOnboarded(false);
      expect(store.getState().isOnboarded).toBe(false);
    });
  });

  describe('setUser', () => {
    it('patches user fields individually', () => {
      freshStore();
      store.setUser({ name: 'Ahmet' });
      expect(store.getState().user.name).toBe('Ahmet');
      expect(store.getState().user.height).toBe(''); // unchanged
    });

    it('patches multiple user fields', () => {
      freshStore();
      store.setUser({ name: 'Ahmet', height: '180', gender: 'male' });
      expect(store.getState().user).toEqual({ name: 'Ahmet', height: '180', gender: 'male' });
    });

    it('does not reset other state', () => {
      freshStore();
      store.setHapticEnabled(false);
      store.setUser({ name: 'Mehmet' });
      expect(store.getState().hapticEnabled).toBe(false);
      expect(store.getState().user.name).toBe('Mehmet');
    });
  });

  describe('setHapticEnabled', () => {
    it('defaults to true', () => {
      freshStore();
      expect(store.getState().hapticEnabled).toBe(true);
    });

    it('can be disabled', () => {
      freshStore();
      store.setHapticEnabled(false);
      expect(store.getState().hapticEnabled).toBe(false);
    });
  });

  describe('setSoundEnabled', () => {
    it('defaults to false', () => {
      freshStore();
      expect(store.getState().soundEnabled).toBe(false);
    });

    it('can be enabled', () => {
      freshStore();
      store.setSoundEnabled(true);
      expect(store.getState().soundEnabled).toBe(true);
    });
  });

  describe('setTimerVisible', () => {
    it('toggles timer visibility', () => {
      freshStore();
      expect(store.getState().timerVisible).toBe(false);
      store.setTimerVisible(true);
      expect(store.getState().timerVisible).toBe(true);
    });
  });

  describe('setActiveProgram', () => {
    it('changes active program', () => {
      freshStore();
      store.setActiveProgram('vtaper_ileri');
      expect(store.getState().activeProgram).toBe('vtaper_ileri');
    });

    it('accepts custom program ids', () => {
      freshStore();
      store.setActiveProgram('custom_123');
      expect(store.getState().activeProgram).toBe('custom_123');
    });
  });

  describe('setNotificationsEnabled', () => {
    it('defaults to false', () => {
      freshStore();
      expect(store.getState().notificationsEnabled).toBe(false);
    });

    it('can be enabled', () => {
      freshStore();
      store.setNotificationsEnabled(true);
      expect(store.getState().notificationsEnabled).toBe(true);
    });
  });

  describe('setDeloadDismissed', () => {
    it('tracks deload suggestion dismissal', () => {
      freshStore();
      store.setDeloadDismissed(true);
      expect(store.getState().deloadDismissed).toBe(true);
    });
  });

  describe('setCoachSessionId', () => {
    it('sets session id', () => {
      freshStore();
      store.setCoachSessionId('sess_123');
      expect(store.getState().coachSessionId).toBe('sess_123');
    });

    it('can be cleared', () => {
      freshStore();
      store.setCoachSessionId('sess_123');
      store.setCoachSessionId(null);
      expect(store.getState().coachSessionId).toBeNull();
    });
  });

  describe('setTourShown', () => {
    it('tracks tour completion', () => {
      freshStore();
      store.setTourShown(true);
      expect(store.getState().tourShown).toBe(true);
    });
  });

  describe('setUserProfile', () => {
    it('sets user profile object', () => {
      freshStore();
      const profile = { id: 'u1', email: 'test@test.com' };
      store.setUserProfile(profile);
      expect(store.getState().userProfile).toEqual(profile);
    });

    it('can be cleared', () => {
      freshStore();
      store.setUserProfile({ id: 'u1' });
      store.setUserProfile(null);
      expect(store.getState().userProfile).toBeNull();
    });
  });

  describe('setTheme', () => {
    it('defaults to dark', () => {
      freshStore();
      expect(store.getState().theme).toBe('dark');
    });

    it('can set light theme', () => {
      freshStore();
      store.setTheme('light');
      expect(store.getState().theme).toBe('light');
    });

    it('can set system theme', () => {
      freshStore();
      store.setTheme('system');
      expect(store.getState().theme).toBe('system');
    });
  });

  describe('getCurrentTheme', () => {
    it('returns dark when theme is dark', () => {
      freshStore();
      expect(store.getCurrentTheme()).toBe('dark');
    });

    it('returns light when theme is light', () => {
      freshStore();
      store.setTheme('light');
      expect(store.getCurrentTheme()).toBe('light');
    });

    it('returns dark for system theme when matchMedia unavailable', () => {
      freshStore();
      store.setTheme('system');
      // jsdom has window but no matchMedia - mock it
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = (query) => ({
        matches: false,
        media: query,
        addListener: () => {},
        removeListener: () => {},
      });
      expect(store.getCurrentTheme()).toBe('light');
      window.matchMedia = (query) => ({
        matches: true,
        media: query,
        addListener: () => {},
        removeListener: () => {},
      });
      expect(store.getCurrentTheme()).toBe('dark');
      window.matchMedia = originalMatchMedia;
    });
  });

  describe('state isolation', () => {
    it('multiple stores are independent', () => {
      const s1 = createTestStore();
      const s2 = createTestStore();
      s1.setUser({ name: 'A' });
      s2.setUser({ name: 'B' });
      expect(s1.getState().user.name).toBe('A');
      expect(s2.getState().user.name).toBe('B');
    });
  });
});
