import { useLocation } from 'react-router-dom';
import useSettingsStore from '../../store/useSettingsStore.js';
import useWorkoutStore from '../../store/useWorkoutStore.js';
import { LEVEL_CONFIG, PROGRAM_LIBRARY } from '../../data/program.js';

const PAGE_TITLES = {
  '/antrenman': null,
  '/ilerleme': 'İlerleme',
  '/programlar': 'Programlar',
  '/profil': 'Profil',
};

export default function Header() {
  const location = useLocation();
  const { setTimerVisible, activeProgram, user } = useSettingsStore();
  const getStreak = useWorkoutStore((s) => s.getStreak);
  const streak = getStreak();
  const isWorkout = location.pathname === '/antrenman';
  const pageTitle = PAGE_TITLES[location.pathname];

  // Parse active program
  const lastUnderscore = activeProgram?.lastIndexOf('_') ?? -1;
  const activeCategory = lastUnderscore > 0 ? activeProgram.slice(0, lastUnderscore) : activeProgram;
  const activeLevel = lastUnderscore > 0 ? activeProgram.slice(lastUnderscore + 1) : 'orta';
  const programMeta = PROGRAM_LIBRARY.find(p => p.id === activeCategory);
  const levelCfg = LEVEL_CONFIG[activeLevel];

  return (
    <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto z-40 pt-safe"
      style={{ background: 'linear-gradient(180deg, #0a0f1a 80%, #0a0f1a00 100%)' }}>
      <div className="flex items-center justify-between px-4 py-3">

        {/* Left: logo or page title */}
        {isWorkout ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold"
              style={{ backgroundColor: programMeta?.color + '30', color: programMeta?.color }}>
              {programMeta?.emoji || '💪'}
            </div>
            <div>
              <p className="text-base font-bold text-white leading-tight">
                {user?.name ? `Merhaba, ${user.name}` : 'V-Taper Coach'}
              </p>
              {programMeta && (
                <p className="text-xs leading-tight" style={{ color: programMeta.color + 'cc' }}>
                  {programMeta.name} · {levelCfg?.label}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg">💪</span>
            <h1 className="text-base font-bold text-white">{pageTitle}</h1>
          </div>
        )}

        {/* Right: streak + timer */}
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#F5A62320', border: '1px solid #F5A62340' }}>
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-accent-gold">{streak} gün</span>
            </div>
          )}
          {isWorkout && (
            <button
              onClick={() => setTimerVisible(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90"
              style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label="Dinlenme zamanlayıcısı"
            >
              ⏱️
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
