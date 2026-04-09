import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      // Managed Agents session ID — persist across page refreshes
      coachSessionId: null,
      hapticEnabled: true,
      soundEnabled: false,
      timerVisible: false,

      setCoachSessionId: (id) => set({ coachSessionId: id }),
      clearCoachSession: () => set({ coachSessionId: null }),
      setHapticEnabled: (v) => set({ hapticEnabled: v }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setTimerVisible: (v) => set({ timerVisible: v }),
    }),
    { name: 'vtaper-settings' }
  )
);

export default useSettingsStore;
