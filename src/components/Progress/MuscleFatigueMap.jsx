import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import { ALL_PROGRAMS } from '../../data/program';

const MUSCLES = ['Göğüs', 'Sırt', 'Omuz', 'Trisep', 'Bisep', 'Bacak', 'Kor'];

const MUSCLE_ICONS = {
  'Göğüs': '🫁', 'Sırt': '🦴', 'Omuz': '💡',
  'Trisep': '💪', 'Bisep': '💪', 'Bacak': '🦵', 'Kor': '⚡',
};

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981', 'Kor': '#14B8A6',
};

// Recovery status based on days since last trained
function recoveryStatus(daysSince) {
  if (daysSince === null) return { label: 'Hazır', color: '#10B981', pct: 100 };
  if (daysSince === 0) return { label: 'Bugün', color: '#E94560', pct: 10 };
  if (daysSince === 1) return { label: 'Dün', color: '#F5A623', pct: 40 };
  if (daysSince === 2) return { label: '2g önce', color: '#F5A623', pct: 70 };
  return { label: 'Hazır', color: '#10B981', pct: 100 };
}

export default function MuscleFatigueMap() {
  const { logs } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);

  const resolvedProgram = (activeProgram && ALL_PROGRAMS[activeProgram]) ? activeProgram : 'vtaper_orta';
  const programData = ALL_PROGRAMS[resolvedProgram];

  // Build exerciseId → muscle map from active program
  const idToMuscle = {};
  Object.values(programData.program).forEach(day => {
    day.exercises.forEach(ex => { idToMuscle[ex.id] = ex.muscle; });
  });

  // Find last trained date per muscle
  const today = new Date().toISOString().split('T')[0];
  const lastTrained = {};

  const sortedDates = Object.keys(logs).sort().reverse();
  for (const date of sortedDates) {
    const dayLogs = logs[date];
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      const muscle = idToMuscle[exId];
      if (!muscle) continue;
      if (lastTrained[muscle] !== undefined) continue;
      const hasDone = Object.values(exLogs).some(s => s?.done);
      if (hasDone) lastTrained[muscle] = date;
    }
  }

  return (
    <div className="bg-bg-card rounded-2xl p-4">
      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Kas Toparlanma Durumu</p>
      <div className="space-y-2.5">
        {MUSCLES.map(muscle => {
          const lastDate = lastTrained[muscle];
          let daysSince = null;
          if (lastDate) {
            const diff = (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);
            daysSince = Math.round(diff);
          }
          const { label, color, pct } = recoveryStatus(daysSince);
          const baseColor = MUSCLE_COLORS[muscle];

          return (
            <div key={muscle} className="flex items-center gap-3">
              <span className="text-base w-6 text-center flex-shrink-0">{MUSCLE_ICONS[muscle]}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">{muscle}</span>
                  <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}66` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-white/20 mt-3 text-center">
        🔴 Dün/bugün  🟡 2 gün önce  🟢 3+ gün önce
      </p>
    </div>
  );
}
