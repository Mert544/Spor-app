import { useState } from 'react';
import DaySelector from '../Layout/DaySelector';
import ProgressBar from './ProgressBar';
import ExerciseCard from './ExerciseCard';
import CompletionCard from './CompletionCard';
import { ALL_PROGRAMS, getTodayDayIndex } from '../../data/program';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function WorkoutPage() {
  const { activeProgram, setActiveProgram } = useSettingsStore();

  // Migrate old format (e.g. "vtaper") → new format ("vtaper_orta")
  const resolvedProgram = (() => {
    if (!activeProgram) return 'vtaper_orta';
    if (ALL_PROGRAMS[activeProgram]) return activeProgram;
    // Old format without level suffix — append _orta
    const withLevel = `${activeProgram}_orta`;
    if (ALL_PROGRAMS[withLevel]) {
      setActiveProgram(withLevel);
      return withLevel;
    }
    return 'vtaper_orta';
  })();

  const programData = ALL_PROGRAMS[resolvedProgram];

  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayDayIndex());
  const date = getToday();
  const { getDayProgress } = useWorkoutStore();

  const dayKey = programData.days[selectedDayIndex];
  const dayData = programData.program[dayKey];

  if (!dayData) return null;

  const exercises = dayData.exercises;
  const { completed, total } = getDayProgress(date, exercises);
  const allDone = total > 0 && completed === total;

  const nameMap = {};
  exercises.forEach(e => { nameMap[e.id] = e.name; });

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <DaySelector
        selectedIndex={selectedDayIndex}
        onSelect={setSelectedDayIndex}
        days={programData.days}
        program={programData.program}
      />

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

      {/* Exercise list */}
      {exercises.map(ex => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          date={date}
          accentColor={dayData.color}
          supersetPartnerName={ex.superset ? nameMap[ex.superset] : null}
        />
      ))}
    </div>
  );
}
