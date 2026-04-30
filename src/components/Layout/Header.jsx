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
    <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto z-40 pt-safe">
      <div className="glass-strong mx-3 mt-2 rounded-2xl">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Left: logo or page title */}
          {isWorkout ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold"
                style={{ backgroundColor: programMeta?.color + '25', color: programMeta?.color, boxShadow: `0 0 12px ${programMeta?.color}15` }}>
                {programMeta?.emoji || '💪'}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  {user?.name ? `Merhaba, ${user.name}` : 'V-Taper Coach'}
                </p>
                {programMeta && (
                  <p className="text-[11px] leading-tight font-medium" style={{ color: programMeta.color + 'bb' }}>
                    {programMeta.name} · {levelCfg?.label}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">💪</span>
              <h1 className="text-sm font-bold text-white">{pageTitle}</h1>
            </div>
          )}

          {/* Right: streak + timer */}
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{ backgroundColor: '#F5A62318', border: '1px solid #F5A62335', boxShadow: '0 0 8px #F5A62315' }}>
                <span className="text-xs">🔥</span>
                <span className="text-[11px] font-bold text-[#F5A623]">{streak}</span>
              </div>
            )}
            {isWorkout && (
              <button
                onClick={() => setTimerVisible(true)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all btn-press"
                style={{ backgroundColor: '#ffffff08', border: '1px solid rgba(255,255,255,0.08)' }}
                aria-label="Dinlenme zamanlayıcısı"
              >
                ⏱️
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
