import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import { ALL_PROGRAMS } from '../../data/program';

function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const diff = (d.getDay() === 0 ? -6 : 1 - d.getDay());
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates() {
  const monday = getMondayOfWeek();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export default function WeeklySummary() {
  const { logs, getStreak } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const streak = getStreak();

  const resolvedProgram = (activeProgram && ALL_PROGRAMS[activeProgram]) ? activeProgram : 'vtaper_orta';
  const programData = ALL_PROGRAMS[resolvedProgram];

  const idToMuscle = {};
  Object.values(programData.program).forEach(day =>
    day.exercises.forEach(ex => { idToMuscle[ex.id] = ex.muscle; })
  );

  const weekDates = getWeekDates();
  let totalSets = 0, totalVolume = 0;
  const musclesThisWeek = new Set();
  let workoutDays = 0;

  for (const date of weekDates) {
    const dayLogs = logs[date];
    if (!dayLogs) continue;
    let hadActivity = false;
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      const muscle = idToMuscle[exId];
      for (const s of Object.values(exLogs)) {
        if (!s?.done) continue;
        totalSets++;
        hadActivity = true;
        if (muscle) musclesThisWeek.add(muscle);
        if (s.weight && s.reps) totalVolume += Number(s.weight) * parseInt(s.reps);
      }
    }
    if (hadActivity) workoutDays++;
  }

  const today = new Date().getDay(); // 0=Sun
  const weekProgress = today === 0 ? 7 : today; // days into week (Mon-based: treat Sun as day 7)
  const mondayBased = ((today + 6) % 7) + 1; // 1=Mon ... 7=Sun

  return (
    <div className="space-y-3">
      {/* Week progress header */}
      <div className="bg-bg-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Bu Hafta</p>
          <span className="text-xs text-white/40">
            {weekDates[0].slice(5)} – {weekDates[6].slice(5)}
          </span>
        </div>

        {/* Day pills */}
        <div className="flex gap-1 mb-4">
          {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((label, i) => {
            const date = weekDates[i];
            const dayLogs = logs[date];
            const trained = dayLogs && Object.values(dayLogs).some(ex =>
              Object.values(ex).some(s => s?.done)
            );
            const isToday = i === ((new Date().getDay() + 6) % 7);
            return (
              <div
                key={i}
                className="flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: trained ? '#14B8A622' : isToday ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: trained ? '#14B8A6' : isToday ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                  border: isToday ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                }}
              >
                {trained ? '✓' : label}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <WeekStat label="Antrenman" value={workoutDays} suffix="gün" color="#14B8A6" />
          <WeekStat label="Set" value={totalSets} color="#3B82F6" />
          <WeekStat label="Hacim" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : '—'} color="#8B5CF6" />
          <WeekStat label="Seri" value={streak > 0 ? `🔥${streak}` : '—'} color="#F5A623" />
        </div>
      </div>

      {/* Muscles trained this week */}
      {musclesThisWeek.size > 0 && (
        <div className="bg-bg-card rounded-2xl p-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Bu Hafta Çalışılan Kaslar</p>
          <div className="flex flex-wrap gap-1.5">
            {[...musclesThisWeek].map(m => (
              <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-bg-dark border border-white/10 text-white/70">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeekStat({ label, value, suffix, color }) {
  return (
    <div className="bg-bg-dark rounded-xl p-2 text-center">
      <p className="text-sm font-bold" style={{ color }}>
        {value}{suffix ? <span className="text-xs text-white/30 ml-0.5">{suffix}</span> : null}
      </p>
      <p className="text-xs text-white/30 mt-0.5">{label}</p>
    </div>
  );
}
