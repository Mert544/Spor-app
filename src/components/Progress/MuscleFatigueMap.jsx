import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS } from '../../data/program';

// RP Strength hacim eşikleri (set/hafta) — Israetel et al.
const VOLUME_LANDMARKS = {
  'Göğüs':     { mev: 8,  mav: 14, mrv: 22 },
  'Sırt':      { mev: 10, mav: 18, mrv: 25 },
  'Omuz':      { mev: 8,  mav: 16, mrv: 22 },
  'Bisep':     { mev: 8,  mav: 14, mrv: 20 },
  'Trisep':    { mev: 6,  mav: 12, mrv: 18 },
  'Bacak':     { mev: 8,  mav: 14, mrv: 20 },
  'Kor':       { mev: 4,  mav: 10, mrv: 16 },
  'Kalça':     { mev: 6,  mav: 12, mrv: 20 },
  'Hamstring': { mev: 6,  mav: 10, mrv: 16 },
  'Kalça Dış': { mev: 4,  mav: 8,  mrv: 14 },
  'İç Bacak':  { mev: 4,  mav: 8,  mrv: 14 },
};

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Kalça': '#EC4899', 'Hamstring': '#10B981',
  'Kalça Dış': '#F5A623', 'İç Bacak': '#10B981',
};

function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
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

function getVolumeStatus(sets, lm) {
  if (!lm || sets === 0) return { label: '—', color: 'rgba(255,255,255,0.2)', barColor: 'rgba(255,255,255,0.08)' };
  if (sets < lm.mev) return { label: 'MEV altı',  color: '#F5A623', barColor: '#F5A623' };
  if (sets <= lm.mav) return { label: 'İdeal',    color: '#10B981', barColor: '#10B981' };
  if (sets <= lm.mrv) return { label: 'Yüksek',   color: '#14B8A6', barColor: '#14B8A6' };
  return              { label: 'MRV üstü!',       color: '#E94560', barColor: '#E94560' };
}

function recLabel(daysSince) {
  if (daysSince === null) return null;
  if (daysSince === 0) return { text: 'bugün', color: '#E94560' };
  if (daysSince === 1) return { text: 'dün',   color: '#F5A623' };
  if (daysSince === 2) return { text: '2g önce', color: '#F5A623' };
  return { text: `${daysSince}g önce`, color: '#10B981' };
}

export default function MuscleFatigueMap() {
  const { logs } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const currentWeek = useProgressStore(s => s.currentWeek);

  const customPrograms = useCustomProgramStore(s => s.programs);
  const isCustom = activeProgram?.startsWith('custom_');
  const resolvedProgram = (activeProgram && (ALL_PROGRAMS[activeProgram] || isCustom)) ? activeProgram : 'vtaper_orta';
  const programData = isCustom ? (customPrograms[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']) : (ALL_PROGRAMS[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']);

  // exerciseId → muscle
  const idToMuscle = {};
  const programMuscles = new Set();
  Object.values(programData.program).forEach(day =>
    day.exercises.forEach(ex => {
      idToMuscle[ex.id] = ex.muscle;
      if (ex.muscle && !['Kardiyovasküler', 'Full Body', 'Kardiyovasküler+Kol'].includes(ex.muscle)) {
        programMuscles.add(ex.muscle);
      }
    })
  );

  const today = new Date().toISOString().split('T')[0];
  const weekDates = getWeekDates();

  // Sets this week per muscle
  const setsThisWeek = {};
  const extraMuscles = new Set();
  for (const date of weekDates) {
    const dayLogs = logs[date];
    if (!dayLogs) continue;
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      const muscle = idToMuscle[exId];
      if (!muscle || ['Kardiyovasküler', 'Full Body'].includes(muscle)) continue;
      for (const s of Object.values(exLogs)) {
        if (!s?.done) continue;
        setsThisWeek[muscle] = (setsThisWeek[muscle] || 0) + 1;
        if (!programMuscles.has(muscle)) extraMuscles.add(muscle);
      }
    }
  }

  // Last trained date per muscle
  const lastTrained = {};
  const sortedDates = Object.keys(logs).sort().reverse();
  for (const date of sortedDates) {
    const dayLogs = logs[date];
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      const muscle = idToMuscle[exId];
      if (!muscle) continue;
      if (lastTrained[muscle] !== undefined) continue;
      if (Object.values(exLogs).some(s => s?.done)) lastTrained[muscle] = date;
    }
  }

  const displayMuscles = [...new Set([...programMuscles, ...extraMuscles])];

  // Weekly totals
  const totalSets = Object.values(setsThisWeek).reduce((a, b) => a + b, 0);
  const musclesAboveMEV = displayMuscles.filter(m => {
    const lm = VOLUME_LANDMARKS[m];
    return lm && (setsThisWeek[m] || 0) >= lm.mev;
  }).length;

  return (
    <div className="space-y-3">
      {/* Summary header */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-card rounded-xl p-3 text-center">
          <p className="text-base font-bold text-accent-teal">{totalSets}</p>
          <p className="text-xs text-white/35 mt-0.5">Toplam Set</p>
        </div>
        <div className="bg-bg-card rounded-xl p-3 text-center">
          <p className="text-base font-bold" style={{ color: '#10B981' }}>{musclesAboveMEV}</p>
          <p className="text-xs text-white/35 mt-0.5">MEV üstü kas</p>
        </div>
        <div className="bg-bg-card rounded-xl p-3 text-center">
          <p className="text-base font-bold" style={{ color: '#F5A623' }}>Hf {currentWeek}</p>
          <p className="text-xs text-white/35 mt-0.5">Aktif hafta</p>
        </div>
      </div>

      {/* Muscle volume bars */}
      <div className="bg-bg-card rounded-2xl p-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-0.5">Haftalık Hacim Takibi</p>
        <p className="text-xs text-white/25 mb-4">RP Strength MEV → MAV → MRV eşikleri</p>

        {displayMuscles.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-6">Bu hafta antrenman kaydı yok.</p>
        ) : (
          <div className="space-y-4">
            {displayMuscles.map(muscle => {
              const sets = setsThisWeek[muscle] || 0;
              const lm = VOLUME_LANDMARKS[muscle];
              const { label: volLabel, barColor } = getVolumeStatus(sets, lm);
              const color = MUSCLE_COLORS[muscle] || '#14B8A6';

              const lastDate = lastTrained[muscle];
              const daysSince = lastDate
                ? Math.round((new Date(today) - new Date(lastDate)) / 86400000)
                : null;
              const rec = recLabel(daysSince);

              const mrv = lm?.mrv || 20;
              const mev = lm?.mev || 0;
              const mav = lm?.mav || mrv * 0.7;
              const fillPct = Math.min((sets / mrv) * 100, 100);
              const mevPct = (mev / mrv) * 100;
              const mavPct = (mav / mrv) * 100;

              return (
                <div key={muscle}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-white">{muscle}</span>
                      {rec && (
                        <span className="text-xs" style={{ color: rec.color }}>{rec.text}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold" style={{ color: sets > 0 ? barColor : 'rgba(255,255,255,0.3)' }}>
                        {sets} set
                      </span>
                      {lm && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: barColor + '20', color: barColor }}
                        >
                          {volLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {lm ? (
                    <>
                      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                          style={{ width: `${fillPct}%`, backgroundColor: barColor, opacity: sets > 0 ? 1 : 0 }}
                        />
                        {/* MEV marker */}
                        <div className="absolute top-0 h-full w-px bg-white/30" style={{ left: `${mevPct}%` }} />
                        {/* MAV marker */}
                        <div className="absolute top-0 h-full w-px bg-white/20" style={{ left: `${mavPct}%` }} />
                      </div>
                      <div className="relative h-3.5 mt-0.5">
                        <span className="absolute text-xs text-white/20" style={{ left: 0 }}>0</span>
                        <span className="absolute text-xs text-white/20" style={{ left: `${mevPct}%`, transform: 'translateX(-50%)' }}>
                          {mev}
                        </span>
                        <span className="absolute text-xs text-white/20" style={{ left: `${mavPct}%`, transform: 'translateX(-50%)' }}>
                          {mav}
                        </span>
                        <span className="absolute text-xs text-white/20" style={{ right: 0 }}>
                          {mrv}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="h-1.5 bg-white/5 rounded-full">
                      <div className="h-full rounded-full" style={{ width: '30%', backgroundColor: color + '40' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-bg-card rounded-2xl p-3">
        <div className="grid grid-cols-2 gap-1.5 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span>MEV altı: bakım minimum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>İdeal: hipertrofi bölgesi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
            <span>Yüksek: MAV → MRV arası</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            <span>MRV üstü: toparlanma riski</span>
          </div>
        </div>
        <p className="text-xs text-white/20 mt-2 text-center">Kaynak: Israetel & Hoffman — RP Strength</p>
      </div>
    </div>
  );
}
