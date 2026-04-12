import { useState, useEffect } from 'react';
import DaySelector from '../Layout/DaySelector';
import ProgressBar from './ProgressBar';
import ExerciseCard from './ExerciseCard';
import CompletionCard from './CompletionCard';
import DayBasisCard from './DayBasisCard';
import { ALL_PROGRAMS, getTodayDayIndex, PHASES } from '../../data/program';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useCustomStore from '../../store/useCustomStore';

const MUSCLES = ['Göğüs', 'Sırt', 'Omuz', 'Trisep', 'Bisep', 'Bacak', 'Kor'];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Check if user has trained 16+ days in last 28 days → suggest deload
function useDeloadSuggestion(logs) {
  const dismissed = useSettingsStore(s => s.deloadDismissed);
  const setDeloadDismissed = useSettingsStore(s => s.setDeloadDismissed);

  const today = new Date();
  let count = 0;
  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const dl = logs[ds];
    if (dl && Object.values(dl).some(ex => Object.values(ex).some(s => s?.done))) count++;
  }
  const show = count >= 16 && !dismissed;
  return { show, count, dismiss: () => setDeloadDismissed(true) };
}

function getCurrentPhase(week) {
  for (const [num, phase] of Object.entries(PHASES)) {
    if (phase.weeks.includes(week)) return { num: parseInt(num), ...phase };
  }
  return null;
}

export default function WorkoutPage() {
  const { activeProgram, setActiveProgram } = useSettingsStore();
  const { logs, getDayProgress } = useWorkoutStore();
  const { currentWeek } = useProgressStore();
  const { getExercises, addExercise, removeExercise } = useCustomStore();

  const resolvedProgram = (() => {
    if (!activeProgram) return 'vtaper_orta';
    if (ALL_PROGRAMS[activeProgram]) return activeProgram;
    const withLevel = `${activeProgram}_orta`;
    if (ALL_PROGRAMS[withLevel]) return withLevel;
    return 'vtaper_orta';
  })();

  useEffect(() => {
    if (activeProgram && !ALL_PROGRAMS[activeProgram]) {
      const withLevel = `${activeProgram}_orta`;
      if (ALL_PROGRAMS[withLevel]) setActiveProgram(withLevel);
      else setActiveProgram('vtaper_orta');
    }
  }, [activeProgram, setActiveProgram]);

  const programData = ALL_PROGRAMS[resolvedProgram] || ALL_PROGRAMS['vtaper_orta'];
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayDayIndex());
  const date = getToday();

  const safeIndex = Math.min(selectedDayIndex, programData.days.length - 1);
  const dayKey = programData.days[safeIndex];
  const dayData = programData.program[dayKey];

  // Custom exercises for today
  const customExercises = getExercises(date);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ name: '', muscle: 'Göğüs', sets: 3, reps: '8-10' });

  const { show: showDeload, count: deloadCount, dismiss: dismissDeload } = useDeloadSuggestion(logs);
  const currentPhase = getCurrentPhase(currentWeek);
  const isDeloadWeek = currentPhase && currentPhase.deload === currentWeek;

  if (!dayData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/40 text-sm">Antrenman bulunamadı.</p>
      </div>
    );
  }

  const exercises = dayData.exercises;
  const { completed, total } = getDayProgress(date, exercises);
  const allDone = total > 0 && completed === total;

  const nameMap = {};
  exercises.forEach(e => { nameMap[e.id] = e.name; });

  function handleAddCustom() {
    if (!customForm.name.trim()) return;
    addExercise(date, { ...customForm, sets: Number(customForm.sets) });
    setCustomForm({ name: '', muscle: 'Göğüs', sets: 3, reps: '8-10' });
    setShowCustomForm(false);
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <DaySelector
        selectedIndex={selectedDayIndex}
        onSelect={setSelectedDayIndex}
        days={programData.days}
        program={programData.program}
      />

      {/* Phase / Week context banner */}
      {currentPhase && (
        <div
          className="mx-4 mb-3 rounded-xl px-4 py-2.5"
          style={{
            background: isDeloadWeek
              ? 'linear-gradient(135deg, #F5A62308, #F5A62318)'
              : 'linear-gradient(135deg, #14B8A608, #14B8A618)',
            border: `1px solid ${isDeloadWeek ? '#F5A62330' : '#14B8A630'}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: isDeloadWeek ? '#F5A62325' : '#14B8A625', color: isDeloadWeek ? '#F5A623' : '#14B8A6' }}>
                Hf {currentWeek}
              </span>
              <span className="text-xs font-semibold text-white/60">
                Faz {currentPhase.num}: {currentPhase.name}
                {isDeloadWeek && ' · DELOAD'}
              </span>
            </div>
            <span className="text-xs text-white/30">
              RPE ≤{currentPhase.rpeMax}
            </span>
          </div>
          {isDeloadWeek && (
            <p className="text-xs text-accent-gold/70 mt-1.5 leading-relaxed">{currentPhase.deloadNote}</p>
          )}
        </div>
      )}

      {/* Deload suggestion banner */}
      {showDeload && (
        <div className="mx-4 mb-3 rounded-xl px-4 py-3 border border-accent-gold/30 bg-accent-gold/5">
          <div className="flex items-start gap-2">
            <span className="text-base">🔄</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-accent-gold">Deload Haftası Önerisi</p>
              <p className="text-xs text-white/50 mt-0.5">
                Son 28 günde {deloadCount} antrenman yaptın. Vücudun toparlanmak için bir haftalık deload'a hazır olabilir. Ağırlıkları %40 azalt.
              </p>
            </div>
            <button onClick={dismissDeload} className="text-white/30 text-sm flex-shrink-0">✕</button>
          </div>
        </div>
      )}

      {/* Day header */}
      <div className="px-4 pt-2 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: dayData.color }}>
          {dayData.emoji} {dayKey}
        </p>
        {dayData.subtitle && (
          <p className="text-white/40 text-xs mt-0.5">{dayData.subtitle}</p>
        )}
      </div>

      <ProgressBar completed={completed} total={total} color={dayData.color} />

      {/* Scientific basis accordion */}
      <DayBasisCard dayKey={dayKey} accentColor={dayData.color} />

      {/* Morning note */}
      {dayData.morning && (
        <div className="mx-4 mb-3 rounded-xl px-4 py-3 bg-bg-card border border-accent-teal/20">
          <p className="text-xs font-semibold text-accent-teal mb-0.5">🌅 Sabah</p>
          <p className="text-white/70 text-sm">{dayData.morning}</p>
        </div>
      )}

      {/* Completion card */}
      {allDone && (
        <CompletionCard date={date} exercises={exercises} accentColor={dayData.color} />
      )}

      {/* Program exercises */}
      {exercises.map(ex => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          date={date}
          accentColor={dayData.color}
          supersetPartnerName={ex.superset ? nameMap[ex.superset] : null}
        />
      ))}

      {/* Custom exercises */}
      {customExercises.map(ex => (
        <div key={ex.id} className="mx-4 mb-3 relative">
          <ExerciseCard
            exercise={ex}
            date={date}
            accentColor="#14B8A6"
            supersetPartnerName={null}
          />
          <button
            onClick={() => removeExercise(date, ex.id)}
            className="absolute top-3 right-12 text-white/25 text-xs hover:text-accent-red transition-colors"
          >✕</button>
        </div>
      ))}

      {/* Add custom exercise */}
      <div className="mx-4 mb-4">
        {showCustomForm ? (
          <div className="bg-bg-card rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-accent-teal">+ Özel Egzersiz Ekle</p>
            <input
              type="text"
              placeholder="Egzersiz adı"
              value={customForm.name}
              onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-teal"
            />
            <div className="flex gap-2">
              <select
                value={customForm.muscle}
                onChange={e => setCustomForm(f => ({ ...f, muscle: e.target.value }))}
                className="flex-1 bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                {MUSCLES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input
                type="number"
                placeholder="Set"
                value={customForm.sets}
                onChange={e => setCustomForm(f => ({ ...f, sets: e.target.value }))}
                className="w-16 bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tekrar"
                value={customForm.reps}
                onChange={e => setCustomForm(f => ({ ...f, reps: e.target.value }))}
                className="w-20 bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCustomForm(false)} className="flex-1 py-2 rounded-xl text-sm text-white/50 bg-bg-dark">İptal</button>
              <button onClick={handleAddCustom} className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-accent-teal">Ekle</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomForm(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-white/30 text-sm flex items-center justify-center gap-2 active:border-accent-teal/40 transition-colors"
          >
            <span>+</span> Özel Egzersiz Ekle
          </button>
        )}
      </div>
    </div>
  );
}
