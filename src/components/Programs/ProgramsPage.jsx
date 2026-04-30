import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_PROGRAMS, PROGRAM_LIBRARY, LEVEL_CONFIG } from '../../data/program';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import useAuthStore from '../../store/useAuthStore';

const LEVELS = ['kolay', 'orta', 'zor'];
const card = 'rounded-2xl border border-white/8 overflow-hidden';
const btn = 'flex-1 py-2.5 text-xs font-semibold transition-colors';
const sep = 'w-px bg-white/5';

const getInfo = (activeId) => {
  if (!activeId) return null;
  if (ALL_PROGRAMS[activeId]) return ALL_PROGRAMS[activeId];
  return useCustomProgramStore.getState().programs[activeId] || null;
};

const GenderBadge = ({ targetGender, userGender }) => {
  if (targetGender === 'all') return null;
  const match = userGender === targetGender;
  const label = targetGender === 'male' ? 'Erkek' : 'Kadın';
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: match ? '#14B8A618' : '#E9456018', color: match ? '#14B8A6' : '#E94560', border: `1px solid ${match ? '#14B8A630' : '#E9456030'}` }}>
      {label}
    </span>
  );
};

export default function ProgramsPage() {
  const nav = useNavigate();
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const setActiveProgram = useSettingsStore(s => s.setActiveProgram);
  const user = useSettingsStore(s => s.user);
  const customPrograms = useCustomProgramStore(s => s.programs);
  const deleteProgram = useCustomProgramStore(s => s.deleteProgram);
  const isPremium = useAuthStore(s => s.isPremium);
  const hasFeature = useAuthStore(s => s.hasFeature);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedLib, setExpandedLib] = useState(null);

  const activeInfo = getInfo(activeProgram);
  const userGender = user?.gender || null;
  const customList = Object.values(customPrograms);
  const canCreate = isPremium() || hasFeature('customPrograms');

  const activate = (id) => { setActiveProgram(id); if (navigator.vibrate) navigator.vibrate(20); };

  const handleDelete = (id) => {
    deleteProgram(id);
    setConfirmDelete(null);
    if (activeProgram === id) setActiveProgram('vtaper_orta');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-4">Programlar</h1>

        {/* Active Program */}
        {activeInfo && (
          <div className="rounded-2xl p-4 mb-5 border" style={{ background: `linear-gradient(135deg, ${activeInfo.color}12 0%, #1e293b 60%)`, borderColor: `${activeInfo.color}50` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${activeInfo.color}22`, border: `1px solid ${activeInfo.color}40` }}>{activeInfo.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 uppercase tracking-wide">Aktif Program</p>
                <h2 className="text-base font-bold text-white truncate">{activeInfo.name}{activeInfo.level && ` · ${LEVEL_CONFIG[activeInfo.level]?.label || activeInfo.level}`}</h2>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[#14B8A6]/15 text-[#14B8A6] font-semibold">Aktif</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{activeInfo.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-white/30">{activeInfo.days?.length || 0} antrenman günü</span>
              {activeProgram?.startsWith('custom_') && <button onClick={() => nav(`/programlar/${activeProgram}/analiz`)} className="text-xs text-[#14B8A6] ml-auto hover:underline">Analiz →</button>}
            </div>
          </div>
        )}

        {/* Library */}
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Program Kütüphanesi</p>
        <div className="space-y-3 mb-6">
          {PROGRAM_LIBRARY.map((lib) => {
            const isExpanded = expandedLib === lib.id;
            const isActiveCat = activeInfo?.category === lib.id || activeInfo?.id?.startsWith(lib.id);
            const genderMatch = lib.targetGender === 'all' || !userGender || lib.targetGender === userGender;

            return (
              <div key={lib.id} className={`${card} transition-all`} style={{ backgroundColor: isActiveCat ? `${lib.color}08` : '#1e293b', borderColor: isActiveCat ? `${lib.color}40` : 'rgba(255,255,255,0.08)' }}>
                <button onClick={() => setExpandedLib(isExpanded ? null : lib.id)} className="w-full flex items-center gap-3 p-4 text-left">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${lib.color}20` }}>{lib.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{lib.name}</p>
                      <GenderBadge targetGender={lib.targetGender} userGender={userGender} />
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{lib.description}</p>
                  </div>
                  <span className="text-white/30 text-xs transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {LEVELS.map((lvl) => {
                        const pid = `${lib.id}_${lvl}`;
                        const isActive = activeProgram === pid;
                        const cfg = LEVEL_CONFIG[lvl];
                        return (
                          <button key={lvl} onClick={() => activate(pid)} disabled={!genderMatch}
                            className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? 'text-white shadow-lg' : genderMatch ? 'text-white/60 hover:text-white' : 'text-white/20 cursor-not-allowed'}`}
                            style={isActive ? { backgroundColor: lib.color, boxShadow: `0 4px 14px ${lib.color}40` } : { backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <span className="block text-sm mb-0.5">{cfg.emoji}</span>{cfg.label}
                          </button>
                        );
                      })}
                    </div>
                    {!genderMatch && <p className="text-xs text-[#E94560] text-center">Bu program {lib.targetGender === 'male' ? 'erkek' : 'kadın'} kullanıcılar için optimize edilmiş.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Programs */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Özel Programlarım</p>
          {customList.length > 0 && <span className="text-xs text-white/30">{customList.length} program</span>}
        </div>

        {customList.length === 0 ? (
          <div className="bg-bg-card rounded-2xl p-6 border border-white/8 text-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl mx-auto mb-3">📋</div>
            <p className="text-sm font-semibold text-white mb-1">Henüz özel program yok</p>
            <p className="text-xs text-white/40 mb-4">Kendi antrenman programını oluştur, mesocycle planla ve takip et.</p>
            <button onClick={() => nav('/programlar/olustur')} disabled={!canCreate} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${canCreate ? 'bg-[#14B8A6] text-white hover:bg-[#14B8A6]/80' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
              {canCreate ? 'Program Oluştur' : 'Premium Gerekli'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {customList.map((prog) => {
              const isActive = activeProgram === prog.id;
              const c = prog.color || '#14B8A6';
              return (
                <div key={prog.id} className={card} style={{ backgroundColor: isActive ? `${c}08` : '#1e293b', borderColor: isActive ? `${c}40` : 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${c}20` }}>{prog.emoji || '📋'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{prog.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{prog.days?.length || 0} gün{prog.mesocycle ? ` · ${prog.mesocycle.durationWeeks} hafta meso` : ''}</p>
                    </div>
                    {isActive && <span className="text-xs px-2 py-1 rounded-full bg-[#14B8A6]/15 text-[#14B8A6] font-semibold shrink-0">Aktif</span>}
                  </div>

                  <div className="flex border-t border-white/5">
                    <button onClick={() => activate(prog.id)} className={`${btn} ${isActive ? 'text-[#14B8A6]' : 'text-white/50 hover:text-white'}`}>{isActive ? 'Aktif' : 'Aktifleştir'}</button>
                    <div className={sep} />
                    <button onClick={() => nav(`/programlar/${prog.id}/analiz`)} className={`${btn} text-white/50 hover:text-white`}>Analiz</button>
                    <div className={sep} />
                    <button onClick={() => nav(`/programlar/duzenle/${prog.id}`)} className={`${btn} text-white/50 hover:text-white`}>Düzenle</button>
                    <div className={sep} />
                    {confirmDelete === prog.id ? (
                      <button onClick={() => handleDelete(prog.id)} className={`${btn} text-[#E94560] bg-[#E94560]/10`}>Sil?</button>
                    ) : (
                      <button onClick={() => setConfirmDelete(prog.id)} className={`${btn} text-white/30 hover:text-[#E94560]`}>Sil</button>
                    )}
                  </div>
                </div>
              );
            })}

            <button onClick={() => nav('/programlar/olustur')} disabled={!canCreate} className={`w-full py-3 rounded-2xl border border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-all ${canCreate ? 'border-white/10 text-white/40 hover:border-[#14B8A6]/40 hover:text-[#14B8A6]' : 'border-white/5 text-white/20 cursor-not-allowed'}`}>
              <span>+</span> Yeni Program Oluştur
            </button>
          </div>
        )}

        {/* Premium hint */}
        {!isPremium() && (
          <button onClick={() => nav('/premium')} className="w-full rounded-2xl p-4 border border-[#14B8A6]/20 bg-[#14B8A6]/5 flex items-center gap-3 transition-all active:scale-[0.98]">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 flex items-center justify-center text-lg shrink-0">✨</div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-white">Özel Program Oluştur</p>
              <p className="text-xs text-white/40">Premium ile sınırsız program, mesocycle ve analiz.</p>
            </div>
            <span className="text-white/30 text-sm">›</span>
          </button>
        )}
      </div>
    </div>
  );
}
