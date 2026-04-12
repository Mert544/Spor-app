import { create } from 'zustand';

// Auth state — NOT persisted (session is handled by Supabase's own storage)
const useAuthStore = create((set) => ({
  user:    null,   // Supabase User object
  session: null,   // Supabase Session object
  loading: true,   // true while checking initial session
  isGuest: false,  // user chose to skip auth

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
    loading: false,
    isGuest: false,
  }),
  setLoading: (loading) => set({ loading }),
  setGuest:   ()        => set({ isGuest: true, loading: false }),
  clearAuth:  ()        => set({ user: null, session: null, isGuest: false }),
}));

export default useAuthStore;
