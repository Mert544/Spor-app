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
      activeProgram: 'vtaper', // 'vtaper' | 'combat_strength' | 'combat_conditioning'

      setCoachSessionId: (id) => set({ coachSessionId: id }),
      clearCoachSession: () => set({ coachSessionId: null }),
      setHapticEnabled: (v) => set({ hapticEnabled: v }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setTimerVisible: (v) => set({ timerVisible: v }),
      setActiveProgram: (id) => set({ activeProgram: id }),
    }),
    { name: 'vtaper-settings' }
  )
);

export default useSettingsStore;
