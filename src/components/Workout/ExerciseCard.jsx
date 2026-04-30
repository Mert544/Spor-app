import { useState, useMemo, useCallback, memo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import SetLogger from './SetLogger';
import useWorkoutStore from '../../store/useWorkoutStore';
import useProgressStore from '../../store/useProgressStore';
import { getVideoUrl } from '../../data/videos';
import { getAlternatives } from '../../data/exerciseAlternatives';
import { getProgressionSuggestion } from '../../utils/progressionEngine';

const SET_INDICES = Array.from({ length: 20 }, (_, i) => i);

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Trisep': '#EC4899', 'Omuz': '#F5A623',
  'Sırt': '#3B82F6', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Hamstring': '#10B981', 'Kalça': '#10B981',
};

function ExerciseCard_({ exercise, date, accentColor, supersetPartnerName, mesoWeek }) {
  const [open, setOpen] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showAlts, setShowAlts] = useState(false);
  const alternatives = getAlternatives(exercise.name);
  const toggleOpen = useCallback(() => setOpen(o => !o), []);
  const toggleAlts = useCallback(() => setShowAlts(v => !v), []);
  const showNote = useCallback(() => setShowNoteInput(true), []);
  const hideNote = useCallback(() => setShowNoteInput(false), []);
  const isExerciseComplete = useWorkoutStore(s => s.isExerciseComplete);
  const getExerciseLogs = useWorkoutStore(s => s.getExerciseLogs);
  const exerciseNotes = useWorkoutStore(s => s.exerciseNotes);
  const setExerciseNote = useWorkoutStore(s => s.setExerciseNote);
  const getExerciseHistory = useWorkoutStore(s => s.getExerciseHistory);
  const getPersonalRecord = useWorkoutStore(s => s.getPersonalRecord);
  const allLogs = useWorkoutStore(s => s.logs);
  const currentWeek = useProgressStore(s => s.currentWeek);

  // Use weeklySetRamp if available (custom programs pass mesoWeek prop)
  const effectiveWeek = mesoWeek ?? currentWeek;
  const rampSets = exercise.weeklySetRamp?.[effectiveWeek - 1] ?? exercise.sets;
  const isRampActive = !!(exercise.weeklySetRamp?.length);

  const complete = isExerciseComplete(date, exercise.id, rampSets);
  const muscleColor = MUSCLE_COLORS[exercise.muscle] || '#ffffff50';
  const logs = getExerciseLogs(date, exercise.id);
  const doneSets = useMemo(() => Object.values(logs).filter(l => l.done).length, [logs]);
  const handleNoteChange = useCallback((e) => {
    setExerciseNote(exercise.id, e.target.value);
  }, [exercise.id, setExerciseNote]);
  const personalNote = exerciseNotes[exercise.id] || '';
  const history = open ? getExerciseHistory(exercise.id) : [];
  const pr = open ? getPersonalRecord(exercise.id) : null;
  const chartData = useMemo(() => history.slice(-10).map(h => ({ w: h.maxWeight })), [history]);

  // Infer a progression rule for static program exercises that lack one
  const exerciseWithRule = useMemo(() => {
    if (exercise.progressionRule) return exercise;
    const reps = exercise.reps ?? '';
    const rpe  = exercise.rpe  ?? '';
    const repMax = parseInt(String(reps).split('-').pop()) || 0;

    let rule;
    if (repMax <= 6) {
      // Heavy strength range → linear
      rule = { type: 'linear', params: { loadIncrement: 2.5 } };
    } else if (String(rpe).includes('7') || String(rpe).includes('8')) {
      // Moderate RPE range → double progression
      const repParts = String(reps).split('-');
      rule = {
        type: 'double_progression',
        params: {
          repRangeMin: parseInt(repParts[0]) || 8,
          repRangeMax: parseInt(repParts[1]) || 12,
          loadIncrement: 2.5,
        },
      };
    } else {
      // Default: double progression
      rule = {
        type: 'double_progression',
        params: { repRangeMin: 10, repRangeMax: 15, loadIncrement: 2.5 },
      };
    }
    return { ...exercise, progressionRule: rule };
  }, [exercise]);

  // Progression suggestion for all exercises
  const suggestion = useMemo(() => {
    try { return getProgressionSuggestion(exerciseWithRule, allLogs, currentWeek); }
    catch { return null; }
  }, [exerciseWithRule, allLogs, currentWeek]);

  return (
    <div
      className="mx-4 mb-3 rounded-2xl overflow-hidden transition-all duration-300 hover-glow btn-press"
      style={{
        background: complete
          ? `linear-gradient(135deg, ${accentColor}12 0%, rgba(30,41,59,0.7) 55%)`
          : 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: complete
          ? `1.5px solid ${accentColor}80`
          : exercise.superset
          ? `1.5px solid ${accentColor}40`
          : '1.5px solid rgba(255,255,255,0.06)',
        boxShadow: complete
          ? `0 4px 24px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.04)`
          : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Superset badge */}
      {exercise.superset && (
        <div className="px-3 pt-2 pb-0">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accentColor}22`, color: accentColor }}>
            Superset ↕ {supersetPartnerName || exercise.superset}
          </span>
        </div>
      )}

      {/* Header row */}
      <button
        onClick={toggleOpen}
        aria-expanded={open}
          aria-label={`${exercise.name} detaylari`}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all"
          style={complete
            ? { backgroundColor: accentColor, borderColor: accentColor }
            : { borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent' }
          }
        >
          {complete
            ? <span className="text-white text-sm font-bold" aria-hidden="true">✓</span>
            : <span className="text-white/40 text-xs font-mono">{doneSets}/{rampSets}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${complete ? 'text-white/50 line-through' : 'text-white'}`}>
            {exercise.name}
          </p>
          {/* Chips row */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <Chip
              text={isRampActive ? `${rampSets}×${exercise.reps}` : `${exercise.sets}×${exercise.reps}`}
              color="rgba(255,255,255,0.12)" textColor="rgba(255,255,255,0.6)"
            />
            {isRampActive && rampSets !== exercise.sets && (
              <Chip text={`Hf${effectiveWeek}`} color="#14B8A618" textColor="#14B8A6" />
            )}
            {exercise.rpe && <Chip text={`RPE ${exercise.rpe}`} color={accentColor + '22'} textColor={accentColor + 'cc'} />}
            {exercise.rest > 0 && <Chip text={`${exercise.rest}sn ⏱`} color="rgba(255,255,255,0.06)" textColor="rgba(255,255,255,0.35)" />}
            {personalNote && <Chip text="📝" color="#F5A62320" textColor="#F5A623" />}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${muscleColor}22`, color: muscleColor }}
          >
            {exercise.muscle}
          </span>
          <span
            aria-hidden="true"
            className="text-white/30 text-xs transition-transform duration-200 inline-block"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >▼</span>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="px-3 pb-3 border-t border-white/5 pt-2 animate-fadeInUp">
          {/* Program note + Video + Alt buttons */}
          <div className="flex items-start gap-2 mb-2">
            {exercise.note && (
              <p className="text-xs italic text-accent-gold/80 px-1 flex-1">{exercise.note}</p>
            )}
            <div className="flex gap-1 flex-shrink-0">
              {alternatives.length > 0 && (
                <button
                  onClick={toggleAlts}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all active:scale-95"
                  style={{ backgroundColor: '#F5A62320', color: '#F5A623', border: '1px solid #F5A62333' }}
                >
                  ⇄ Alt
                </button>
              )}
              <a
                href={getVideoUrl(exercise.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all active:scale-95"
                style={{ backgroundColor: '#FF000022', color: '#FF4444', border: '1px solid #FF444433' }}
              >
                ▶ Video
              </a>
            </div>
          </div>

          {/* Alternatives panel */}
          {showAlts && (
            <div className="mb-3 bg-bg-dark rounded-xl p-3">
              <p className="text-xs font-semibold text-accent-gold mb-2">⇄ Alternatif Egzersizler</p>
              <div className="space-y-1">
                {alternatives.map((alt, i) => (
                  <div key={i} className="text-xs text-white/60 px-1 py-0.5 flex items-center gap-1.5">
                    <span className="text-white/30">•</span> {alt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal note */}
          {showNoteInput ? (
            <div className="mb-3">
              <textarea
                rows={2}
                placeholder="Kişisel notun... (form ipucu, ağırlık geçmişi vb.)"
                value={personalNote}
                onChange={handleNoteChange}
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-accent-gold/50"
              />
              <button
                type="button"
                onClick={hideNote}
                className="text-xs text-white/40 mt-1 px-1"
              >
                Kapat
              </button>
            </div>
          ) : (
            <div className="mb-3">
              {personalNote ? (
                <button
                  type="button"
                  onClick={showNote}
                  className="w-full text-left text-xs text-accent-gold/70 bg-accent-gold/5 border border-accent-gold/20 rounded-xl px-3 py-2"
                >
                  📝 {personalNote}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={showNote}
                  className="text-xs text-white/30 px-1 hover:text-white/50 transition-colors"
                >
                  + Not ekle
                </button>
              )}
            </div>
          )}

          {/* Progression suggestion (custom programs) */}
          {suggestion && (
            <div className="mb-3 px-3 py-2 rounded-xl border flex items-center gap-2"
              style={{ backgroundColor: '#14B8A608', borderColor: '#14B8A630' }}>
              <span className="text-base">🎯</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#14B8A6]">Önerilen</p>
                <p className="text-xs text-white/60">{suggestion.label}</p>
              </div>
              {suggestion.note && (
                <span className="text-xs text-white/30 shrink-0">{suggestion.note}</span>
              )}
            </div>
          )}

          {/* Set header */}
          <div className="flex items-center gap-2 px-1 mb-1">
            <span className="w-5" />
            <span className="flex-1 text-center text-xs text-white/30">Ağırlık</span>
            <span className="flex-1 text-center text-xs text-white/30">Tekrar</span>
            <span className="text-xs text-white/30 w-12 text-center">RPE</span>
            <span className="w-8" />
          </div>

          {SET_INDICES.slice(0, rampSets).map(i => (
            <SetLogger
              key={`${exercise.id}-set-${i}`}
              date={date}
              exerciseId={exercise.id}
              setIndex={i}
              accentColor={accentColor}
              restSeconds={exercise.rest || 0}
            />
          ))}

          {/* Exercise history sparkline */}
          {chartData.length >= 2 && (
            <div className="mt-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-xs text-white/30">İlerleme (son {chartData.length} seans)</span>
                {pr && (
                  <span className="text-xs font-semibold" style={{ color: '#F5A623' }}>
                    🏅 PR: {pr.weight}kg × {pr.reps}
                  </span>
                )}
              </div>
              <ResponsiveContainer width="100%" height={48}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <Line type="monotone" dataKey="w" stroke={accentColor} strokeWidth={2} dot={{ fill: accentColor, r: 2, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {exercise.rest && (
            <p className="text-xs text-white/30 text-center mt-2">
              ⏱ {exercise.rest >= 60 ? `${exercise.rest / 60} dk` : `${exercise.rest} sn`} dinlenme
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const Chip = memo(function Chip({ text, color, textColor }) {
  return (
    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
      style={{ backgroundColor: color, color: textColor }}>
      {text}
    </span>
  );
});

export { Chip };
export default memo(ExerciseCard_);
