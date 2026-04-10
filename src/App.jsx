import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/Layout/BottomNav.jsx';
import Header from './components/Layout/Header.jsx';
import WorkoutPage from './components/Workout/WorkoutPage.jsx';
import ProgressPage from './components/Progress/ProgressPage.jsx';
import ProfilePage from './components/Profile/ProfilePage.jsx';
import ProgramsPage from './components/Programs/ProgramsPage.jsx';
import RestTimer from './components/Timer/RestTimer.jsx';
import OnboardingPage from './components/Onboarding/OnboardingPage.jsx';
import useSettingsStore from './store/useSettingsStore.js';
import useWorkoutStore from './store/useWorkoutStore.js';

export default function App() {
  const isOnboarded = useSettingsStore((s) => s.isOnboarded);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const user = useSettingsStore((s) => s.user);

  // Workout reminder notification — fires on app open
  useEffect(() => {
    if (!notificationsEnabled) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const hour = now.getHours();
    if (hour < 8 || hour >= 22) return; // only 08:00–22:00

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
    return <OnboardingPage />;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto relative">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/antrenman" replace />} />
          <Route path="/antrenman" element={<WorkoutPage />} />
          <Route path="/ilerleme" element={<ProgressPage />} />
          <Route path="/programlar" element={<ProgramsPage />} />
          <Route path="/profil" element={<ProfilePage />} />
        </Routes>
      </main>
      <BottomNav />
      <RestTimer />
    </div>
  );
}
