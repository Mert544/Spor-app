import { useLocation } from 'react-router-dom';
import useSettingsStore from '../../store/useSettingsStore.js';
import useWorkoutStore from '../../store/useWorkoutStore.js';

const PAGE_TITLES = {
  '/antrenman': 'V-Taper Coach',
  '/ilerleme': 'İlerleme',
  '/koc': 'AI Koç',
  '/profil': 'Profil',
};

export default function Header() {
  const location = useLocation();
  const setTimerVisible = useSettingsStore((s) => s.setTimerVisible);
  const getStreak = useWorkoutStore((s) => s.getStreak);
  const title = PAGE_TITLES[location.pathname] || 'V-Taper Coach';
  const streak = getStreak();
  const isWorkout = location.pathname === '/antrenman';

  return (
    <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto bg-bg-dark/90 backdrop-blur border-b border-white/10 z-40 pt-safe">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-white">{title}</h1>
          {streak > 0 && isWorkout && (
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-accent-gold/20 text-accent-gold">
              🔥 {streak}
            </span>
          )}
        </div>
        {isWorkout && (
          <button
            onClick={() => setTimerVisible(true)}
            className="w-9 h-9 bg-bg-card rounded-xl flex items-center justify-center text-lg hover:bg-bg-hover transition-colors active:scale-95"
            aria-label="Dinlenme zamanlayıcısı"
          >
            ⏱️
          </button>
        )}
      </div>
    </header>
  );
}
