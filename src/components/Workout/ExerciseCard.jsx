import { useState } from 'react';
import SetLogger from './SetLogger';
import useWorkoutStore from '../../store/useWorkoutStore';

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Trisep': '#EC4899', 'Omuz': '#F5A623',
  'Sırt': '#3B82F6', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Hamstring': '#10B981', 'Kalça': '#10B981',
};

export default function ExerciseCard({ exercise, date, accentColor, supersetPartnerName }) {
  const [open, setOpen] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const { isExerciseComplete, getExerciseLogs, exerciseNotes, setExerciseNote } = useWorkoutStore();
  const complete = isExerciseComplete(date, exercise.id, exercise.sets);
  const muscleColor = MUSCLE_COLORS[exercise.muscle] || '#ffffff50';
  const logs = getExerciseLogs(date, exercise.id);
  const doneSets = Object.values(logs).filter(l => l.done).length;
  const personalNote = exerciseNotes[exercise.id] || '';

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
          <p className={`font-semibold text-sm leading-tight ${complete ? 'text-white/60 line-through' : 'text-white'}`}>
            {exercise.name}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {exercise.sets} set × {exercise.reps}
            {exercise.tempo && <span> · {exercise.tempo}</span>}
            {exercise.technique && <span className="text-accent-gold"> · {exercise.technique}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {personalNote && <span className="text-accent-gold text-xs">📝</span>}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${muscleColor}22`, color: muscleColor }}
          >
            {exercise.muscle}
          </span>
          <span className="text-white/30 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="px-3 pb-3 border-t border-white/5 pt-2">
          {/* Program note */}
          {exercise.note && (
            <p className="text-xs italic text-accent-gold/80 mb-2 px-1">{exercise.note}</p>
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
              key={i}
              date={date}
              exerciseId={exercise.id}
              setIndex={i}
              accentColor={accentColor}
            />
          ))}

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
