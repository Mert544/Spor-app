import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROGRAM_LIBRARY, LEVEL_CONFIG } from '../../data/program';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import ProgramWizard from './ProgramWizard';

const GENDER_FILTERS = [
  { id: 'all',    label: 'Tümü',  emoji: '⚡' },
  { id: 'male',   label: 'Erkek', emoji: '♂️' },
  { id: 'female', label: 'Kadın', emoji: '♀️' },
];

const GOAL_LABELS = {
  hypertrophy: 'Kas Kazan',
  strength:    'Güçlen',
  fat_loss:    'Yağ Yak',
  athletic:    'Atletik',
  fitness:     'Genel Fitness',
};

const EXPERIENCE_LABELS = {
  beginner:     'Yeni Başlayan',
  intermediate: 'Orta Seviye',
  advanced:     'İleri Seviye',
};

// ─── PersonalProgramCard ───────────────────────────────────────────────────

function PersonalProgramCard({ program, isActive, onActivate, onRegenerate, onDelete }) {
  const goal = program.profile?.goal;
  const experience = program.profile?.experience;
  const days = program.profile?.days;
  const color = program.color || '#14B8A6';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const avgExercises = useMemo(() => {
    const entries = Object.values(program.program || {});
    if (entries.length === 0) return 0;
    const total = entries.reduce((s, d) => s + (d.exercises?.length || 0), 0);
    return Math.round(total / entries.length);
  }, [program]);

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all"
      style={{ borderColor: isActive ? color : 'rgba(255,255,255,0.10)' }}
    >
      {/* Main row */}
      <div
        className="p-4"
        style={{ backgroundColor: '#111c2d' }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${color}22` }}
          >
            {program.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-white">{program.name}</p>
              {isActive && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: color }}
                >
                  Aktif
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                Kişisel
              </span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">
              {days} gün/hafta · {EXPERIENCE_LABELS[experience] || experience}
            </p>
          </div>

          {/* Delete button */}
          <div className="flex-shrink-0">
            {showDeleteConfirm ? (
              <div className="flex gap-1.5">
                <button
                  onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border"
                  style={{ backgroundColor: 'rgba(233,69,96,0.15)', color: '#E94560', borderColor: 'rgba(233,69,96,0.30)' }}
                >
                  Sil
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 border border-white/10"
                >
                  İptal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors text-white/30 hover:text-[#E94560]"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                🗑
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mb-3">
          {[
            { label: 'Gün', value: `${days}/hafta` },
            { label: 'Egzersiz/Gün', value: `~${avgExercises}` },
            { label: 'Hedef', value: GOAL_LABELS[goal] || goal },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl py-2 px-2 text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-xs font-semibold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className="flex gap-2">
          {!isActive && (
            <button
              onClick={onActivate}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
            >
              Aktif Et
            </button>
          )}
          <button
            onClick={onRegenerate}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.60)',
            }}
          >
            Yeniden Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function ProgramsPage() {
  const navigate = useNavigate();
  const { activeProgram, setActiveProgram, user } = useSettingsStore();
  const { programs: customPrograms, deleteProgram, addProgram } = useCustomProgramStore();

  const [activeTab, setActiveTab] = useState('hazir');
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  const defaultFilter = user?.gender || 'all';
  const [genderFilter, setGenderFilter] = useState(defaultFilter);

  const allCustomList = Object.values(customPrograms);
  const personalPrograms = allCustomList.filter((p) => p.isPersonal);
  const regularCustomList = allCustomList.filter((p) => !p.isPersonal);

  const LEVELS = ['kolay', 'orta', 'zor'];
  const lastUnderscore = activeProgram?.lastIndexOf('_') ?? -1;
  const maybeLevelSuffix = lastUnderscore > 0 ? activeProgram.slice(lastUnderscore + 1) : '';
  const hasLevel = LEVELS.includes(maybeLevelSuffix);
  const activeCategory = hasLevel ? activeProgram.slice(0, lastUnderscore) : (activeProgram || 'vtaper');
  const activeLevel = hasLevel ? maybeLevelSuffix : 'orta';

  const visiblePrograms = PROGRAM_LIBRARY.filter((lib) => {
    if (genderFilter === 'all') return true;
    const tg = lib.targetGender || 'all';
    return tg === genderFilter || tg === 'all';
  });

  function select(categoryId, level) {
    setActiveProgram(`${categoryId}_${level}`);
    setExpanded(null);
  }

  const activeMeta = PROGRAM_LIBRARY.find((l) => l.id === activeCategory);

  function handleWizardComplete(generatedProgram) {
    setShowWizard(false);
    setActiveProgram(generatedProgram.id);
    setTimeout(() => navigate('/antrenman'), 300);
  }

  return (
    <>
      {showWizard && (
        <ProgramWizard
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}

      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
        <div className="px-4 pt-4">
          <h1 className="text-xl font-bold text-white mb-1">Programlar</h1>
          <p className="text-xs text-white/40 mb-3">Seviyeni seç, programa başla</p>

          {/* Main tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'hazir',   label: 'Hazır Programlar' },
              { id: 'kisisel', label: 'Kişisel Programım' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  activeTab === tab.id
                    ? {
                        backgroundColor: '#14B8A620',
                        color: '#14B8A6',
                        border: '1px solid #14B8A650',
                      }
                    : {
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.40)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Hazır Programlar ─────────────────────────────────── */}
          {activeTab === 'hazir' && (
            <div>
              {/* Gender filter */}
              <div className="flex gap-2 mb-4">
                {GENDER_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setGenderFilter(f.id); setExpanded(null); }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    style={
                      genderFilter === f.id
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
                      backgroundColor:
                        activeLevel === 'kolay' ? '#10B981' : activeLevel === 'zor' ? '#EF4444' : '#F5A623',
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
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: '#EC489915', color: '#EC4899' }}
                              >
                                Kadın
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{lib.description}</p>
                        </div>
                        <span className="text-white/30 text-lg flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                          {Object.entries(LEVEL_CONFIG).map(([level, cfg]) => {
                            const isCurrentLevel = isActive && activeLevel === level;
                            return (
                              <button
                                key={level}
                                onClick={() => select(lib.id, level)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
                                style={
                                  isCurrentLevel
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
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="text-white/50 text-sm font-medium">Bu kriterde program yok.</p>
                  <p className="text-white/30 text-xs mt-1">Filtre seçimini değiştirmeyi dene.</p>
                </div>
              )}

              {/* Regular custom programs */}
              {regularCustomList.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-3">Kendi Programların</p>
                  <div className="space-y-3">
                    {regularCustomList.map((cp) => {
                      const isActive = activeProgram === cp.id;
                      return (
                        <div
                          key={cp.id}
                          className="bg-bg-card rounded-2xl overflow-hidden border transition-all"
                          style={{ borderColor: isActive ? cp.color : 'rgba(255,255,255,0.08)' }}
                        >
                          <div className="flex items-center gap-3 p-4">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ backgroundColor: `${cp.color}20` }}
                            >
                              {cp.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-white">{cp.name}</p>
                                {isActive && (
                                  <span
                                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                                    style={{ backgroundColor: cp.color }}
                                  >
                                    Aktif
                                  </span>
                                )}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">Özel</span>
                              </div>
                              <p className="text-xs text-white/40 mt-0.5">{cp.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {!isActive && (
                                <button
                                  onClick={() => setActiveProgram(cp.id)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                                  style={{ backgroundColor: cp.color + '25', border: `1px solid ${cp.color}40` }}
                                >
                                  Seç
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/programlar/${cp.id}/analiz`)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-white/50 border border-white/8"
                              >
                                Analiz
                              </button>
                              <button
                                onClick={() => navigate(`/programlar/duzenle/${cp.id}`)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-white/50 border border-white/8"
                              >
                                Düzenle
                              </button>
                              {confirmDelete === cp.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => {
                                      deleteProgram(cp.id);
                                      if (isActive) setActiveProgram('vtaper_orta');
                                      setConfirmDelete(null);
                                    }}
                                    className="px-2 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 border border-red-500/30"
                                  >
                                    Sil
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1.5 rounded-lg text-xs bg-white/5 text-white/50"
                                  >
                                    İptal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(cp.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/30 text-sm"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Create custom program button */}
              <button
                onClick={() => navigate('/programlar/olustur')}
                className="w-full mt-5 py-3.5 rounded-2xl text-sm font-semibold text-[#14B8A6]
                           border border-[#14B8A6]/30 bg-[#14B8A6]/8 hover:bg-[#14B8A6]/15 transition-all active:scale-[0.98]"
              >
                + Kendi Programını Oluştur
              </button>

              <p className="text-center text-white/30 text-xs mt-6 mb-2">
                Program değiştirmek antrenman geçmişini etkilemez.
              </p>
            </div>
          )}

          {/* ── Tab: Kişisel Programım ────────────────────────────────── */}
          {activeTab === 'kisisel' && (
            <div>
              {personalPrograms.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
                    style={{ backgroundColor: '#14B8A610', border: '1px solid #14B8A625' }}
                  >
                    ⚡
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Kişisel Programın Yok</h3>
                  <p className="text-sm text-white/40 mb-6 leading-relaxed max-w-xs">
                    Hedefine ve seviyene göre sana özel bir program oluşturalım. 4 adımda hazır.
                  </p>
                  <button
                    onClick={() => setShowWizard(true)}
                    className="px-8 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #14B8A6, #3B82F6)' }}
                  >
                    Programını Oluştur
                  </button>
                </div>
              ) : (
                /* Has personal programs */
                <div>
                  <div className="space-y-4 mb-5">
                    {personalPrograms.map((prog) => (
                      <PersonalProgramCard
                        key={prog.id}
                        program={prog}
                        isActive={activeProgram === prog.id}
                        onActivate={() => setActiveProgram(prog.id)}
                        onRegenerate={() => setShowWizard(true)}
                        onDelete={() => {
                          deleteProgram(prog.id);
                          if (activeProgram === prog.id) setActiveProgram('vtaper_orta');
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setShowWizard(true)}
                    className="w-full py-3.5 rounded-2xl text-sm font-semibold text-[#14B8A6]
                               border border-[#14B8A6]/30 bg-[#14B8A6]/8 transition-all active:scale-[0.98]"
                  >
                    + Yeni Kişisel Program Oluştur
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// [autonomous-TASK-0100] Updated at 2026-04-16T21:09:29.836155

// [autonomous-TASK-0100] Updated at 2026-04-16T21:09:30.049140

// [autonomous-TASK-0100] Updated at 2026-04-16T21:09:30.262267

// [autonomous-TASK-0028] Updated at 2026-04-16T21:42:58.164574

// [autonomous-TASK-0070] Updated at 2026-04-16T21:43:57.865330

// [autonomous-TASK-0112] Updated at 2026-04-16T21:44:58.158101
