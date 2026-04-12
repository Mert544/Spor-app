import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS } from '../../data/program';

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Kalça': '#EC4899', 'Hamstring': '#10B981',
  'Kalça Dış': '#F5A623', 'İç Bacak': '#10B981',
};

const CHECK_IN_FIELDS = [
  { key: 'energy',     label: 'Enerji',    color: '#F5A623' },
  { key: 'sleep',      label: 'Uyku',      color: '#3B82F6' },
  { key: 'motivation', label: 'Motivasyon', color: '#8B5CF6' },
  { key: 'recovery',   label: 'Toparlanma', color: '#10B981' },
  { key: 'hunger',     label: 'Açlık',     color: '#E94560' },
  { key: 'mood',       label: 'Ruh Hali',  color: '#14B8A6' },
];

function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(offsetWeeks = 0) {
  const monday = getMondayOfWeek();
  monday.setDate(monday.getDate() + offsetWeeks * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function computeWeekStats(logs, weekDates, idToMuscle) {
  let totalSets = 0, totalVolume = 0, workoutDays = 0;
  const muscleSets = {};
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
        if (s.weight && s.reps) totalVolume += Number(s.weight) * parseInt(s.reps);
        if (muscle && !['Kardiyovasküler', 'Full Body'].includes(muscle)) {
          muscleSets[muscle] = (muscleSets[muscle] || 0) + 1;
        }
      }
    }
    if (hadActivity) workoutDays++;
  }
  return { totalSets, totalVolume, workoutDays, muscleSets };
}

function Delta({ curr, prev, positive: forcePositive }) {
  if (prev == null || prev === 0) return null;
  const diff = curr - prev;
  if (diff === 0) return null;
  const good = forcePositive !== undefined ? (diff > 0) === forcePositive : diff > 0;
  return (
    <span className="text-xs ml-0.5" style={{ color: good ? '#10B981' : '#E94560' }}>
      {diff > 0 ? '+' : ''}{typeof diff === 'number' && Math.abs(diff) >= 1000
        ? `${(diff / 1000).toFixed(1)}t` : diff}
    </span>
  );
}

export default function WeeklySummary() {
  const { logs, getStreak } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const { weeklyCheckIns, currentWeek } = useProgressStore();
  const streak = getStreak?.() ?? 0;

  const customPrograms = useCustomProgramStore(s => s.programs);
  const isCustom = activeProgram?.startsWith('custom_');
  const resolvedProgram = (activeProgram && (ALL_PROGRAMS[activeProgram] || isCustom)) ? activeProgram : 'vtaper_orta';
  const programData = isCustom ? (customPrograms[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']) : (ALL_PROGRAMS[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']);

  const idToMuscle = {};
  Object.values(programData.program).forEach(day =>
    day.exercises.forEach(ex => { idToMuscle[ex.id] = ex.muscle; })
  );

  const weekDates = getWeekDates(0);
  const lastWeekDates = getWeekDates(-1);

  const thisWeek = computeWeekStats(logs, weekDates, idToMuscle);
  const lastWeek = computeWeekStats(logs, lastWeekDates, idToMuscle);

  const checkIn = weeklyCheckIns?.[currentWeek];
  const checkInVals = checkIn ? CHECK_IN_FIELDS.map(f => checkIn[f.key]).filter(Boolean) : [];
  const checkInAvg = checkInVals.length
    ? (checkInVals.reduce((a, b) => a + b, 0) / checkInVals.length).toFixed(1)
    : null;

  const muscleEntries = Object.entries(thisWeek.muscleSets).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-3">
      {/* Week header + day pills */}
      <div className="bg-bg-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Bu Hafta</p>
          <span className="text-xs text-white/40">
            {weekDates[0].slice(5)} – {weekDates[6].slice(5)}
          </span>
        </div>

        <div className="flex gap-1 mb-4">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((label, i) => {
            const date = weekDates[i];
            const dayLogs = logs[date];
            const trained = dayLogs && Object.values(dayLogs).some(ex =>
              Object.values(ex).some(s => s?.done)
            );
            const isToday = i === ((new Date().getDay() + 6) % 7);
            return (
              <div
                key={i}
                className="flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
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

        {/* Stats with vs-last-week deltas */}
        <div className="grid grid-cols-4 gap-2">
          <StatCell label="Antrenman" color="#14B8A6">
            {thisWeek.workoutDays}<span className="text-xs text-white/30 ml-0.5">gün</span>
            <Delta curr={thisWeek.workoutDays} prev={lastWeek.workoutDays} />
          </StatCell>
          <StatCell label="Set" color="#3B82F6">
            {thisWeek.totalSets}
            <Delta curr={thisWeek.totalSets} prev={lastWeek.totalSets} />
          </StatCell>
          <StatCell label="Hacim" color="#8B5CF6">
            {thisWeek.totalVolume > 0 ? `${(thisWeek.totalVolume / 1000).toFixed(1)}t` : '—'}
            {lastWeek.totalVolume > 0 && thisWeek.totalVolume > 0 && (
              <Delta curr={thisWeek.totalVolume} prev={lastWeek.totalVolume} />
            )}
          </StatCell>
          <StatCell label="Seri" color="#F5A623">
            {streak > 0 ? `🔥 ${streak}` : '—'}
          </StatCell>
        </div>

        {lastWeek.totalSets > 0 && (
          <p className="text-xs text-white/20 mt-2 text-center">
            Geçen hafta: {lastWeek.workoutDays}g · {lastWeek.totalSets} set · {(lastWeek.totalVolume / 1000).toFixed(1)}t
          </p>
        )}
      </div>

      {/* Muscle breakdown */}
      {muscleEntries.length > 0 && (
        <div className="bg-bg-card rounded-2xl p-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
            Bu Hafta Kas Dağılımı
          </p>
          <div className="grid grid-cols-2 gap-2">
            {muscleEntries.map(([muscle, sets]) => {
              const lastSets = lastWeek.muscleSets[muscle] || 0;
              const diff = sets - lastSets;
              const color = MUSCLE_COLORS[muscle] || '#14B8A6';
              return (
                <div key={muscle} className="flex items-center gap-2.5 bg-bg-dark rounded-xl p-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <p className="text-xs text-white/60 flex-1 truncate">{muscle}</p>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold leading-none" style={{ color }}>{sets}</p>
                    {lastSets > 0 && diff !== 0 && (
                      <p className="text-xs leading-none mt-0.5" style={{ color: diff > 0 ? '#10B981' : '#E94560' }}>
                        {diff > 0 ? '+' : ''}{diff}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly check-in scores */}
      {checkIn && (
        <div className="bg-bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Hafta {currentWeek} · Check-In
            </p>
            {checkInAvg && (
              <span className="text-sm font-bold" style={{ color: '#F5A623' }}>
                {checkInAvg}/10
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CHECK_IN_FIELDS.map(f => {
              const val = checkIn[f.key];
              if (!val) return null;
              return (
                <div key={f.key} className="bg-bg-dark rounded-xl p-2 text-center">
                  <p className="text-sm font-bold leading-none" style={{ color: f.color }}>{val}</p>
                  <p className="text-xs text-white/30 mt-1 leading-tight">{f.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {thisWeek.totalSets === 0 && muscleEntries.length === 0 && !checkIn && (
        <div className="text-center py-8">
          <p className="text-white/30 text-sm">Bu hafta antrenman verisi yok.</p>
          <p className="text-white/15 text-xs mt-1">Egzersiz kayıtla ve burada görün.</p>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, color, children }) {
  return (
    <div className="bg-bg-dark rounded-xl p-2 text-center">
      <p className="text-sm font-bold leading-snug" style={{ color }}>{children}</p>
      <p className="text-xs text-white/30 mt-0.5">{label}</p>
    </div>
  );
}
