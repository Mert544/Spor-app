import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav    from './components/Layout/BottomNav.jsx';
import Header       from './components/Layout/Header.jsx';
import RestTimer    from './components/Timer/RestTimer.jsx';
import ToastContainer from './components/UI/Toast.jsx';
import AchievementUnlock from './components/Profile/AchievementUnlock.jsx';
import AuthPage          from './components/Auth/AuthPage.jsx';
import PasswordResetPage from './components/Auth/PasswordResetPage.jsx';
import AppTour           from './components/Onboarding/AppTour.jsx';
import useSettingsStore      from './store/useSettingsStore.js';
import useWorkoutStore       from './store/useWorkoutStore.js';
import useProgressStore      from './store/useProgressStore.js';
import useCustomProgramStore from './store/useCustomProgramStore.js';
import useAuthStore          from './store/useAuthStore.js';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';
import { pushAllData, pullAndRestoreData } from './utils/syncEngine.js';

// Lazy-load all route-level pages — keeps initial bundle lean
const WorkoutPage      = lazy(() => import('./components/Workout/WorkoutPage.jsx'));
const ProgressPage     = lazy(() => import('./components/Progress/ProgressPage.jsx'));
const ProfilePage      = lazy(() => import('./components/Profile/ProfilePage.jsx'));
const ProgramsPage     = lazy(() => import('./components/Programs/ProgramsPage.jsx'));
const CreateProgramPage= lazy(() => import('./components/Programs/CreateProgramPage.jsx'));
const ProgramAnalytics = lazy(() => import('./components/Programs/ProgramAnalytics.jsx'));
const OnboardingPage      = lazy(() => import('./components/Onboarding/OnboardingPage.jsx'));
const SupplementGuide     = lazy(() => import('./components/Profile/SupplementGuide.jsx'));
const PremiumPage        = lazy(() => import('./components/Settings/PremiumPage.jsx'));
const LandingPage        = lazy(() => import('./components/Landing/LandingPage.jsx'));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#14B8A6]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#14B8A6] animate-spin" />
          <div className="absolute inset-1.5 rounded-full bg-[#14B8A6]/10 animate-pulse" />
        </div>
        <p className="text-xs text-white/30 tracking-[0.2em] uppercase font-medium">Hazırlanıyor</p>
      </div>
    </div>
  );
}

const pageTransition = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        {...pageTransition}
        className="flex-1 overflow-y-auto pb-32 scrollbar-hide"
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/antrenman" replace />} />
          <Route path="/antrenman" element={<WorkoutPage />} />
          <Route path="/ilerleme"  element={<ProgressPage />} />
          <Route path="/programlar" element={<ProgramsPage />} />
          <Route path="/programlar/olustur" element={<CreateProgramPage />} />
          <Route path="/programlar/duzenle/:editId" element={<CreateProgramPage />} />
          <Route path="/programlar/:programId/analiz" element={<ProgramAnalytics />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/takviye" element={<SupplementGuide />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/welcome" element={<LandingPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Offline indicator ─────────────────────────────────────────────────────────
function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (online) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623]">
      <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
      Çevrimdışı moddasın · Veriler cihazında güvende
    </div>
  );
}

// ── Sync badge (top-right indicator) ──────────────────────────────────────────
function SyncBadge({ status }) {
  if (status === 'idle') return null;
  return (
    <div
      className="fixed top-4 right-4 z-50 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none"
      style={{
        backgroundColor: status === 'syncing' ? '#14B8A615' : '#10B98115',
        border: `1px solid ${status === 'syncing' ? '#14B8A640' : '#10B98140'}`,
        color: status === 'syncing' ? '#14B8A6' : '#10B981',
      }}
    >
      {status === 'syncing'
        ? <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
        : <span className="text-[10px]">✓</span>
      }
      {status === 'syncing' ? 'Senkronize ediliyor…' : 'Senkronize edildi'}
    </div>
  );
}

// ── Debounced cloud sync ───────────────────────────────────────────────────────
const SYNC_DELAY_MS = 3000;

function useDebouncedSync(userId) {
  const timerRef = useRef(null);

  // Watch the three stores most likely to change during a workout
  const logs     = useWorkoutStore(s => s.logs);
  const programs = useCustomProgramStore(s => s.programs);
  const weights  = useProgressStore(s => s.weights);

  useEffect(() => {
    if (!userId) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushAllData(userId), SYNC_DELAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [logs, programs, weights, userId]); // eslint-disable-line
}

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const isOnboarded        = useSettingsStore(s => s.isOnboarded);
  const tourShown          = useSettingsStore(s => s.tourShown);
  const notificationsEnabled = useSettingsStore(s => s.notificationsEnabled);
  const user               = useSettingsStore(s => s.user);
  const { session, loading, isGuest, isPasswordRecovery, setSession, setLoading, setPasswordRecovery, clearAuth } = useAuthStore();

  // ── Supabase auth listener ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // No Supabase configured — skip auth entirely, act as guest
      setLoading(false);
      return;
    }

    // Check existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for sign-in / sign-out / token-refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (event === 'SIGNED_IN' && session?.user) {
          await pullAndRestoreData(session.user.id);
        }
        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true);
        }
        if (event === 'SIGNED_OUT') {
          clearAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line

  // ── Workout notification ───────────────────────────────────────────────────
  useEffect(() => {
    if (!notificationsEnabled) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const hour = now.getHours();
    if (hour < 8 || hour >= 22) return;

    const today = now.toISOString().split('T')[0];
    const logs = useWorkoutStore.getState().logs;
    const hasTrainedToday = logs[today] &&
      Object.values(logs[today]).some(exLogs =>
        Object.values(exLogs).some(s => s?.done)
      );

    if (!hasTrainedToday) {
      const name = user?.name ? `, ${user.name}` : '';
      new Notification(`💪 Antrenman zamanı${name}!`, {
        body: 'Bugünkü antrenmanın seni bekliyor. Hadi gidelim.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'workout-reminder',
        renotify: false,
      });
    }
  }, [notificationsEnabled, user]);

  // ── Debounced sync (only when signed in) ──────────────────────────────────
  useDebouncedSync(session?.user?.id ?? null);

  // ── Loading splash (while Supabase resolves initial session) ──────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
      </div>
    );
  }

  // ── Password recovery (user clicked reset link in email) ──────────────────
  if (isPasswordRecovery) {
    return <PasswordResetPage />;
  }

  // ── Auth gate (Supabase configured + not signed in + not guest) ───────────
  if (isSupabaseConfigured && !session && !isGuest) {
    return <AuthPage />;
  }

  // ── Onboarding ─────────────────────────────────────────────────────────────
  if (!isOnboarded) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-bg" />}>
        <OnboardingPage />
      </Suspense>
    );
  }

  // ── Main app ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto relative">
      <OfflineIndicator />
      <ToastContainer />
      <AchievementUnlock />
      <Header />
      {!tourShown && <AppTour />}
      <main className="flex-1 overflow-y-auto pb-20 pt-16">
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
      <BottomNav />
      <RestTimer />
    </div>
  );
}
