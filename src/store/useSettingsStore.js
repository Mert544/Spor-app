import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      isOnboarded: false,
      user: {
        name: '',
        height: '',
        gender: null, // 'male' | 'female' | null
      },
      hapticEnabled: true,
      soundEnabled: false,
      timerVisible: false,
      activeProgram: 'vtaper_orta',
      notificationsEnabled: false,
      deloadDismissed: false,
      coachSessionId: null,
      tourShown: false,
      userProfile: null,
      theme: 'dark', // 'dark' | 'light' | 'system'

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
        const { theme } = get();
        if (theme === 'system') {
          if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          return 'dark';
        }
        return theme;
      },
    }),
    { name: 'vtaper-settings' }
  )
);

export default useSettingsStore;
