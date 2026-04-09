import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      hapticEnabled: true,
      soundEnabled: false,
      timerVisible: false,
      activeProgram: 'vtaper',

      setHapticEnabled: (v) => set({ hapticEnabled: v }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setTimerVisible: (v) => set({ timerVisible: v }),
      setActiveProgram: (id) => set({ activeProgram: id }),
    }),
    { name: 'vtaper-settings' }
  )
);

export default useSettingsStore;
