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

export default function App() {
  const isOnboarded = useSettingsStore((s) => s.isOnboarded);

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
