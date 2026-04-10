import { useState } from 'react';
import { PROGRAM_LIBRARY, LEVEL_CONFIG } from '../../data/program';
import useSettingsStore from '../../store/useSettingsStore';

export default function ProgramsPage() {
  const { activeProgram, setActiveProgram } = useSettingsStore();
  const [expanded, setExpanded] = useState(null);

  // Parse "category_level" format
  const lastUnderscore = activeProgram?.lastIndexOf('_') ?? -1;
  const activeCategory = lastUnderscore > 0 ? activeProgram.slice(0, lastUnderscore) : activeProgram;
  const activeLevel = lastUnderscore > 0 ? activeProgram.slice(lastUnderscore + 1) : 'orta';

  function select(categoryId, level) {
    setActiveProgram(`${categoryId}_${level}`);
    setExpanded(null);
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-1">Programlar</h1>
        <p className="text-xs text-white/40 mb-4">Seviyeni seç, programa başla</p>

        {/* Active program banner */}
        {activeProgram && (
          <div className="bg-bg-card rounded-2xl p-3 mb-4 flex items-center gap-3 border border-white/10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${PROGRAM_LIBRARY.find(l => l.id === activeCategory)?.color}22` }}>
              {PROGRAM_LIBRARY.find(l => l.id === activeCategory)?.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40">Aktif Program</p>
              <p className="text-sm font-bold text-white truncate">
                {PROGRAM_LIBRARY.find(l => l.id === activeCategory)?.name}
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: LEVEL_CONFIG[activeLevel]?.emoji === '🟢' ? '#10B981' : activeLevel === 'zor' ? '#EF4444' : '#F5A623', color: '#fff' }}>
              {LEVEL_CONFIG[activeLevel]?.label}
            </span>
          </div>
        )}

        {/* Program list */}
        <div className="space-y-3">
          {PROGRAM_LIBRARY.map((lib) => {
            const isExpanded = expanded === lib.id;
            const isActive = activeCategory === lib.id;
            return (
              <div key={lib.id}
                className="bg-bg-card rounded-2xl overflow-hidden border transition-all"
                style={{ borderColor: isActive ? lib.color : 'rgba(255,255,255,0.08)' }}>
                {/* Category header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : lib.id)}
                  className="w-full flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${lib.color}20` }}>
                    {lib.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{lib.name}</p>
                      {isActive && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: lib.color, color: '#fff' }}>
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{lib.description}</p>
                  </div>
                  <span className="text-white/30 text-lg">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Level selector */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                    {Object.entries(LEVEL_CONFIG).map(([level, cfg]) => {
                      const isCurrentLevel = isActive && activeLevel === level;
                      return (
                        <button
                          key={level}
                          onClick={() => select(lib.id, level)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
                          style={isCurrentLevel
                            ? { borderColor: lib.color, backgroundColor: `${lib.color}18` }
                            : { borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }
                          }>
                          <span className="text-xl">{cfg.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-white">{cfg.label}</p>
                            <p className="text-xs text-white/40">{cfg.description}</p>
                          </div>
                          {isCurrentLevel && (
                            <span className="text-lg">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-white/20 text-xs mt-6 mb-2">
          Program değiştirmek antrenman geçmişini etkilemez.
        </p>
      </div>
    </div>
  );
}
