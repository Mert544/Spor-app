import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/Layout/BottomNav.jsx';
import Header from './components/Layout/Header.jsx';
import RestTimer from './components/Timer/RestTimer.jsx';
import useSettingsStore from './store/useSettingsStore.js';
import useWorkoutStore from './store/useWorkoutStore.js';

// Lazy-load all route-level pages — keeps initial bundle lean
const WorkoutPage      = lazy(() => import('./components/Workout/WorkoutPage.jsx'));
const ProgressPage     = lazy(() => import('./components/Progress/ProgressPage.jsx'));
const ProfilePage      = lazy(() => import('./components/Profile/ProfilePage.jsx'));
const ProgramsPage     = lazy(() => import('./components/Programs/ProgramsPage.jsx'));
const CreateProgramPage= lazy(() => import('./components/Programs/CreateProgramPage.jsx'));
const ProgramAnalytics = lazy(() => import('./components/Programs/ProgramAnalytics.jsx'));
const OnboardingPage   = lazy(() => import('./components/Onboarding/OnboardingPage.jsx'));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
        <p className="text-xs text-white/30">Yükleniyor…</p>
      </div>
    </div>
  );
}

export default function App() {
  const isOnboarded = useSettingsStore((s) => s.isOnboarded);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const user = useSettingsStore((s) => s.user);

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
        body: 'Bugünkü antrenmanını henüz tamamlamadın. Hazır mısın?',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'workout-reminder',
        renotify: false,
      });
    }
  }, [notificationsEnabled, user]);

  if (!isOnboarded) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-bg" />}>
        <OnboardingPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto relative">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 pt-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/antrenman" replace />} />
            <Route path="/antrenman" element={<WorkoutPage />} />
            <Route path="/ilerleme" element={<ProgressPage />} />
            <Route path="/programlar" element={<ProgramsPage />} />
            <Route path="/programlar/olustur" element={<CreateProgramPage />} />
            <Route path="/programlar/duzenle/:editId" element={<CreateProgramPage />} />
            <Route path="/programlar/:programId/analiz" element={<ProgramAnalytics />} />
            <Route path="/profil" element={<ProfilePage />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
      <RestTimer />
    </div>
  );
}
