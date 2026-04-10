import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      isOnboarded: false,
      user: {
        name: '',
        height: '',
      },
      hapticEnabled: true,
      soundEnabled: false,
      timerVisible: false,
      activeProgram: 'vtaper_orta',
      notificationsEnabled: false,
      deloadDismissed: false,

      setOnboarded: (v) => set({ isOnboarded: v }),
      setUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
      setHapticEnabled: (v) => set({ hapticEnabled: v }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setTimerVisible: (v) => set({ timerVisible: v }),
      setActiveProgram: (id) => set({ activeProgram: id }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setDeloadDismissed: (v) => set({ deloadDismissed: v }),
    }),
    { name: 'vtaper-settings' }
  )
);

export default useSettingsStore;
