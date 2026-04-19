import { useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav    from './components/Layout/BottomNav.jsx';
import Header       from './components/Layout/Header.jsx';
import RestTimer    from './components/Timer/RestTimer.jsx';
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
import { useNativeApp, setupNativeFeatures } from './hooks/useNativeApp.js';

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
const AnalyticsDashboard = lazy(() => import('./components/Admin/AnalyticsDashboard.jsx'));
const Dashboard          = lazy(() => import('./components/Dashboard/Dashboard.jsx'));
const ChallengePage      = lazy(() => import('./components/Challenge/ChallengePage.jsx'));
const LeaderboardPage    = lazy(() => import('./components/Social/LeaderboardPage.jsx'));
const NutritionPage      = lazy(() => import('./components/Nutrition/NutritionPage.jsx'));
const CoachPage          = lazy(() => import('./components/Coach/CoachPage.jsx'));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
        <p className="text-xs text-white/30 tracking-widest uppercase">Hazırlanıyor</p>
      </div>
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

  useNativeApp();
  useEffect(() => {
    setupNativeFeatures();
  }, []);

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

  // ── Landing page (public, before onboarding) ───────────────────────────────
  const location = useLocation();
  if (location.pathname === '/landing' || location.pathname === '/') {
    return (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    );
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
  const pageVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.2,
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto relative">
      <Header />
      {!tourShown && <AppTour />}
      <main className="flex-1 overflow-y-auto pb-20 pt-16">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname.split('/')[1]}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <Dashboard />
                </motion.div>
              } />
              <Route path="/antenman" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <WorkoutPage />
                </motion.div>
              } />
              <Route path="/ilerleme" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <ProgressPage />
                </motion.div>
              } />
              <Route path="/programlar" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <ProgramsPage />
                </motion.div>
              } />
              <Route path="/programlar/olustur" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <CreateProgramPage />
                </motion.div>
              } />
              <Route path="/programlar/duzenle/:editId" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <CreateProgramPage />
                </motion.div>
              } />
              <Route path="/programlar/:programId/analiz" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <ProgramAnalytics />
                </motion.div>
              } />
              <Route path="/profil" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <ProfilePage />
                </motion.div>
              } />
              <Route path="/takviye" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <SupplementGuide />
                </motion.div>
              } />
              <Route path="/premium" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <PremiumPage />
                </motion.div>
              } />
              <Route path="/analytics" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <AnalyticsDashboard />
                </motion.div>
              } />
              <Route path="/challenges" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <ChallengePage />
                </motion.div>
              } />
              <Route path="/leaderboard" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <LeaderboardPage />
                </motion.div>
              } />
              <Route path="/beslenme" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <NutritionPage />
                </motion.div>
              } />
              <Route path="/ai-koc" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                  <CoachPage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <BottomNav />
      <RestTimer />
    </div>
  );
}
