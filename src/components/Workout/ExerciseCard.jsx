import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import SetLogger from './SetLogger';
import useWorkoutStore from '../../store/useWorkoutStore';
import { getVideoUrl } from '../../data/videos';
import { getAlternatives } from '../../data/exerciseAlternatives';

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Trisep': '#EC4899', 'Omuz': '#F5A623',
  'Sırt': '#3B82F6', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Hamstring': '#10B981', 'Kalça': '#10B981',
};

export default function ExerciseCard({ exercise, date, accentColor, supersetPartnerName }) {
  const [open, setOpen] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showAlts, setShowAlts] = useState(false);
  const alternatives = getAlternatives(exercise.name);
  const { isExerciseComplete, getExerciseLogs, exerciseNotes, setExerciseNote, getExerciseHistory, getPersonalRecord } = useWorkoutStore();
  const complete = isExerciseComplete(date, exercise.id, exercise.sets);
  const muscleColor = MUSCLE_COLORS[exercise.muscle] || '#ffffff50';
  const logs = getExerciseLogs(date, exercise.id);
  const doneSets = Object.values(logs).filter(l => l.done).length;
  const personalNote = exerciseNotes[exercise.id] || '';
  const history = open ? getExerciseHistory(exercise.id) : [];
  const pr = open ? getPersonalRecord(exercise.id) : null;
  const chartData = history.slice(-10).map(h => ({ w: h.maxWeight }));

  return (
    <div
      className="mx-4 mb-3 rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: '#1e293b',
        border: complete
          ? `1.5px solid ${accentColor}`
          : exercise.superset
          ? `1.5px solid ${accentColor}44`
          : '1.5px solid transparent',
        boxShadow: complete ? `0 0 12px ${accentColor}33` : 'none',
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
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all"
          style={complete
            ? { backgroundColor: accentColor, borderColor: accentColor }
            : { borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent' }
          }
        >
          {complete
            ? <span className="text-white text-sm font-bold">✓</span>
            : <span className="text-white/40 text-xs font-mono">{doneSets}/{exercise.sets}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${complete ? 'text-white/50 line-through' : 'text-white'}`}>
            {exercise.name}
          </p>
          {/* Chips row */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <Chip text={`${exercise.sets}×${exercise.reps}`} color="rgba(255,255,255,0.12)" textColor="rgba(255,255,255,0.6)" />
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
          <span className="text-white/20 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="px-3 pb-3 border-t border-white/5 pt-2">
          {/* Program note + Video + Alt buttons */}
          <div className="flex items-start gap-2 mb-2">
            {exercise.note && (
              <p className="text-xs italic text-accent-gold/80 px-1 flex-1">{exercise.note}</p>
            )}
            <div className="flex gap-1 flex-shrink-0">
              {alternatives.length > 0 && (
                <button
                  onClick={() => setShowAlts(v => !v)}
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
                    <span className="text-white/25">•</span> {alt}
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
                onChange={e => setExerciseNote(exercise.id, e.target.value)}
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-accent-gold/50"
              />
              <button
                onClick={() => setShowNoteInput(false)}
                className="text-xs text-white/40 mt-1 px-1"
              >
                Kapat
              </button>
            </div>
          ) : (
            <div className="mb-3">
              {personalNote ? (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="w-full text-left text-xs text-accent-gold/70 bg-accent-gold/5 border border-accent-gold/20 rounded-xl px-3 py-2"
                >
                  📝 {personalNote}
                </button>
              ) : (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="text-xs text-white/25 px-1 hover:text-white/50 transition-colors"
                >
                  + Not ekle
                </button>
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

          {Array.from({ length: exercise.sets }, (_, i) => (
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

function Chip({ text, color, textColor }) {
  return (
    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
      style={{ backgroundColor: color, color: textColor }}>
      {text}
    </span>
  );
}
