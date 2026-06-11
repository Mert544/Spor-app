// ProgramDetailPage — Bir programın tam yapısını aktifleştirmeden önce gösterir:
// seviye seçimi, periodizasyon zaman çizelgesi, gün gün egzersiz listesi.
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Check, Play, Download } from 'lucide-react';
import { exportProgram } from '../../utils/programIO';
import {
  PROGRAM_LIBRARY,
  ALL_PROGRAMS,
  LEVEL_CONFIG,
  LIBRARY_MESOCYCLE,
  parseProgramId,
} from '../../data/program';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import MesocycleView from './MesocycleView';

const LEVEL_DOT = { kolay: '#10B981', orta: '#F5A623', zor: '#EF4444' };

function DayAccordion({ dayKey, dayData, color }) {
  const [open, setOpen] = useState(false);
  const exercises = dayData?.exercises || [];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dayData?.color || color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{dayData?.name || dayKey}</p>
          {dayData?.subtitle && (
            <p className="text-xs text-white/40 truncate">{dayData.subtitle}</p>
          )}
        </div>
        <span className="text-xs text-white/40 flex-shrink-0">
          {exercises.length} egzersiz
        </span>
        <ChevronDown
          size={16}
          className={`text-white/30 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-white/[0.06]">
          {dayData?.morning && (
            <p className="px-3 pt-2 text-xs text-white/40">
              Sabah: {dayData.morning}
            </p>
          )}
          {exercises.map((ex, i) => (
            <div
              key={ex.id || i}
              className="flex items-center gap-3 px-3 py-2.5 border-b border-white/[0.04] last:border-b-0"
            >
              <span className="text-xs text-white/30 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/90 truncate">{ex.name}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {ex.sets}×{ex.reps}
                  {ex.rpe && ex.rpe !== '-' ? ` · RPE ${ex.rpe}` : ''}
                </p>
              </div>
              {ex.muscle && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 flex-shrink-0">
                  {ex.muscle}
                </span>
              )}
            </div>
          ))}
          {exercises.length === 0 && (
            <p className="px-3 py-3 text-xs text-white/30">Dinlenme / aktif toparlanma günü.</p>
          )}
        </div>
      )}
    </div>
  );
}

function PhaseAccordion({ phases }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="space-y-1.5 mt-3">
      {phases.map((phase, i) => {
        const open = openIdx === i;
        const isDeload = !!phase.volumeMultiplier;
        return (
          <div key={i} className="rounded-lg bg-white/[0.03] border border-white/[0.05] overflow-hidden">
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left"
            >
              <span className="text-xs font-semibold text-white/80 flex-1">
                Hf {phase.weeks[0]}
                {phase.weeks.length > 1 ? `–${phase.weeks[phase.weeks.length - 1]}` : ''} · {phase.name}
              </span>
              <span className="text-xs text-white/40">
                {isDeload ? `hacim ×${Math.round(phase.volumeMultiplier * 100)}%` : phase.rpeMax ? `≤RPE ${phase.rpeMax}` : ''}
              </span>
              <ChevronDown
                size={14}
                className={`text-white/30 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && phase.focus && (
              <p className="px-3 pb-2.5 text-xs text-white/50 leading-relaxed">{phase.focus}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { activeProgram, setActiveProgram } = useSettingsStore();
  const { programs: customPrograms } = useCustomProgramStore();

  const parsed = parseProgramId(programId);
  const isCustom = parsed.isCustom;
  const libMeta = !isCustom ? PROGRAM_LIBRARY.find((l) => l.id === parsed.category) : null;
  const customProgram = isCustom ? customPrograms[programId] : null;

  const active = parseProgramId(activeProgram);
  const [level, setLevel] = useState(
    !isCustom && active.category === parsed.category ? active.level : (parsed.level || 'orta')
  );

  const preview = isCustom
    ? customProgram
    : ALL_PROGRAMS[`${parsed.category}_${level}`];

  const targetId = isCustom ? programId : `${parsed.category}_${level}`;
  const isActive = activeProgram === targetId;
  const color = (isCustom ? customProgram?.color : libMeta?.color) || '#14B8A6';
  const name = isCustom ? customProgram?.name : libMeta?.name;
  const emoji = isCustom ? customProgram?.emoji : libMeta?.emoji;

  const descriptionPills = useMemo(() => {
    const desc = isCustom ? customProgram?.subtitle : libMeta?.description;
    if (!desc) return [];
    return desc.split('·').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  }, [isCustom, customProgram, libMeta]);

  const mesocycle = isCustom ? customProgram?.mesocycle : LIBRARY_MESOCYCLE;

  const stats = useMemo(() => {
    if (!preview?.days?.length) return null;
    const dayEntries = preview.days.map((d) => preview.program?.[d]).filter(Boolean);
    const exCounts = dayEntries.map((d) => d.exercises?.length || 0);
    const totalSets = dayEntries.reduce(
      (sum, d) => sum + (d.exercises || []).reduce((s, ex) => s + (Number(ex.sets) || 0), 0),
      0
    );
    const trainingDays = exCounts.filter((c) => c > 0).length || 1;
    return {
      days: preview.days.length,
      avgExercises: Math.round(exCounts.reduce((a, b) => a + b, 0) / trainingDays),
      totalSets,
      durationWeeks: mesocycle?.durationWeeks ?? 12,
    };
  }, [preview, mesocycle]);

  if ((!isCustom && !libMeta) || (isCustom && !customProgram)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-white/40 text-sm">Program bulunamadı.</p>
        <button
          onClick={() => navigate('/programlar')}
          className="px-4 py-2 rounded-xl text-sm text-[#14B8A6] border border-[#14B8A6]/30"
        >
          Programlara Dön
        </button>
      </div>
    );
  }

  function handleStart() {
    if (isActive) return;
    setActiveProgram(targetId);
    navigate('/antrenman');
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/programlar')}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 text-white/60 flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white truncate">{name}</h1>
              {(isCustom ? false : libMeta?.targetGender === 'female') && (
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#EC489915', color: '#EC4899' }}>
                  Kadın
                </span>
              )}
              {!isCustom && libMeta?.targetGender === 'male' && (
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#3B82F615', color: '#3B82F6' }}>
                  Erkek
                </span>
              )}
            </div>
            <p className="text-xs text-white/40">
              {isCustom ? 'Özel program' : 'Hazır program'}
            </p>
          </div>
          {isCustom && (
            <button
              onClick={() => exportProgram(programId)}
              title="Programı JSON olarak dışa aktar"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 text-white/60 flex-shrink-0"
            >
              <Download size={16} />
            </button>
          )}
        </div>

        {/* Description pills */}
        {descriptionPills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {descriptionPills.map((pill, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60"
              >
                {pill}
              </span>
            ))}
          </div>
        )}

        {/* Level segmented control (library only) */}
        {!isCustom && (
          <div className="bg-bg-card rounded-2xl p-3 border border-white/10 mb-4">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Seviye</p>
            <div className="flex gap-1.5 mb-2">
              {Object.entries(LEVEL_CONFIG).map(([lv, cfg]) => {
                const selected = level === lv;
                return (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                    style={
                      selected
                        ? { borderColor: LEVEL_DOT[lv], backgroundColor: `${LEVEL_DOT[lv]}18`, color: 'white' }
                        : { borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.45)' }
                    }
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LEVEL_DOT[lv] }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-white/50">{LEVEL_CONFIG[level]?.description}</p>
          </div>
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Gün/Hafta', value: stats.days },
              { label: 'Egz./Gün', value: `~${stats.avgExercises}` },
              { label: 'Haftalık Set', value: stats.totalSets },
              { label: 'Süre', value: `${stats.durationWeeks} hf` },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl py-2.5 px-1 text-center bg-white/[0.04] border border-white/[0.06]"
              >
                <p className="text-sm font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Periodization timeline */}
        {mesocycle?.phases?.length > 0 && (
          <div className="bg-bg-card rounded-2xl p-4 border border-white/10 mb-4">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-3">
              Periodizasyon · {mesocycle.durationWeeks} Hafta
            </p>
            <MesocycleView mesocycle={mesocycle} />
            <PhaseAccordion phases={mesocycle.phases} />
          </div>
        )}

        {/* Day-by-day breakdown */}
        {preview?.days?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2">
              Haftalık Plan
            </p>
            <div className="space-y-2">
              {preview.days.map((dayKey) => (
                <DayAccordion
                  key={dayKey}
                  dayKey={dayKey}
                  dayData={preview.program?.[dayKey]}
                  color={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 px-4 pt-3 pb-4 bg-gradient-to-t from-bg via-bg/95 to-transparent">
        <button
          onClick={handleStart}
          disabled={isActive}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-100"
          style={
            isActive
              ? { backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' }
              : { background: `linear-gradient(135deg, ${color}, ${color}bb)` }
          }
        >
          {isActive ? (
            <>
              <Check size={16} /> Aktif Program
            </>
          ) : (
            <>
              <Play size={16} /> Bu Programı Başlat
            </>
          )}
        </button>
      </div>
    </div>
  );
}
