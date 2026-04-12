import { create } from 'zustand';

// Auth state — NOT persisted (session is handled by Supabase's own storage)
const useAuthStore = create((set) => ({
  user:             null,
  session:          null,
  loading:          true,
  isGuest:          false,
  isPasswordRecovery: false,

  setSession:          (session) => set({ session, user: session?.user ?? null, loading: false, isGuest: false }),
  setLoading:          (loading) => set({ loading }),
  setGuest:            ()        => set({ isGuest: true, loading: false }),
  setPasswordRecovery: (v)       => set({ isPasswordRecovery: v }),
  clearAuth:           ()        => set({ user: null, session: null, isGuest: false, isPasswordRecovery: false }),
}));

export default useAuthStore;
