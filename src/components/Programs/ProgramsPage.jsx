import { useState } from 'react';
import { PROGRAM_LIBRARY, LEVEL_CONFIG } from '../../data/program';
import useSettingsStore from '../../store/useSettingsStore';

const GENDER_FILTERS = [
  { id: 'all',    label: 'Tümü',  emoji: '⚡' },
  { id: 'male',   label: 'Erkek', emoji: '♂️' },
  { id: 'female', label: 'Kadın', emoji: '♀️' },
];

export default function ProgramsPage() {
  const { activeProgram, setActiveProgram, user } = useSettingsStore();
  const [expanded, setExpanded] = useState(null);
  // Default filter based on user's gender setting; falls back to 'all'
  const defaultFilter = user?.gender || 'all';
  const [genderFilter, setGenderFilter] = useState(defaultFilter);

  const LEVELS = ['kolay', 'orta', 'zor'];
  const lastUnderscore = activeProgram?.lastIndexOf('_') ?? -1;
  const maybeLevelSuffix = lastUnderscore > 0 ? activeProgram.slice(lastUnderscore + 1) : '';
  const hasLevel = LEVELS.includes(maybeLevelSuffix);
  const activeCategory = hasLevel ? activeProgram.slice(0, lastUnderscore) : (activeProgram || 'vtaper');
  const activeLevel = hasLevel ? maybeLevelSuffix : 'orta';

  // Filter programs by gender
  const visiblePrograms = PROGRAM_LIBRARY.filter(lib => {
    if (genderFilter === 'all') return true;
    const tg = lib.targetGender || 'all';
    return tg === genderFilter || tg === 'all';
  });

  function select(categoryId, level) {
    setActiveProgram(`${categoryId}_${level}`);
    setExpanded(null);
  }

  const activeMeta = PROGRAM_LIBRARY.find(l => l.id === activeCategory);

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-1">Programlar</h1>
        <p className="text-xs text-white/40 mb-3">Seviyeni seç, programa başla</p>

        {/* Gender filter tabs */}
        <div className="flex gap-2 mb-4">
          {GENDER_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => { setGenderFilter(f.id); setExpanded(null); }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={genderFilter === f.id
                ? {
                    backgroundColor: f.id === 'female' ? '#EC489920' : f.id === 'male' ? '#3B82F620' : '#14B8A620',
                    color: f.id === 'female' ? '#EC4899' : f.id === 'male' ? '#3B82F6' : '#14B8A6',
                    border: `1px solid ${f.id === 'female' ? '#EC489950' : f.id === 'male' ? '#3B82F650' : '#14B8A650'}`,
                  }
                : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              <span>{f.emoji}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Active program banner */}
        {activeProgram && activeMeta && (
          <div className="bg-bg-card rounded-2xl p-3 mb-4 flex items-center gap-3 border border-white/10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${activeMeta.color}22` }}
            >
              {activeMeta.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40">Aktif Program</p>
              <p className="text-sm font-bold text-white truncate">{activeMeta.name}</p>
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-full text-white"
              style={{
                backgroundColor: activeLevel === 'kolay' ? '#10B981' : activeLevel === 'zor' ? '#EF4444' : '#F5A623',
              }}
            >
              {LEVEL_CONFIG[activeLevel]?.label}
            </span>
          </div>
        )}

        {/* Program list */}
        <div className="space-y-3">
          {visiblePrograms.map((lib) => {
            const isExpanded = expanded === lib.id;
            const isActive = activeCategory === lib.id;
            const isFemale = lib.targetGender === 'female';
            return (
              <div
                key={lib.id}
                className="bg-bg-card rounded-2xl overflow-hidden border transition-all"
                style={{ borderColor: isActive ? lib.color : 'rgba(255,255,255,0.08)' }}
              >
                {/* Category header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : lib.id)}
                  className="w-full flex items-center gap-3 p-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${lib.color}20` }}
                  >
                    {lib.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white">{lib.name}</p>
                      {isActive && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: lib.color }}
                        >
                          Aktif
                        </span>
                      )}
                      {isFemale && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EC489915', color: '#EC4899' }}>
                          ♀ Kadın
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{lib.description}</p>
                  </div>
                  <span className="text-white/30 text-lg flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
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
                          }
                        >
                          <span className="text-xl">{cfg.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-white">{cfg.label}</p>
                            <p className="text-xs text-white/40">{cfg.description}</p>
                          </div>
                          {isCurrentLevel && <span className="text-lg">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {visiblePrograms.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/30 text-sm">Bu filtre için program bulunamadı.</p>
          </div>
        )}

        <p className="text-center text-white/20 text-xs mt-6 mb-2">
          Program değiştirmek antrenman geçmişini etkilemez.
        </p>
      </div>
    </div>
  );
}
