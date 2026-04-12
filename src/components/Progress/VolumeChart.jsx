import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, ErrorBar } from 'recharts';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS } from '../../data/program';

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Kalça': '#EC4899', 'Hamstring': '#10B981',
};

// RP Strength MEV eşikleri (set/hafta)
const MEV_TARGETS = {
  'Göğüs': 8, 'Sırt': 10, 'Omuz': 8, 'Bisep': 8, 'Trisep': 6,
  'Bacak': 8, 'Kor': 4, 'Kalça': 6, 'Hamstring': 6,
};

function getMondayOfWeek(offsetWeeks = 0) {
  const d = new Date();
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff + offsetWeeks * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(offsetWeeks = 0) {
  const monday = getMondayOfWeek(offsetWeeks);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function computeMuscleSetCounts(logs, weekDates, idToMuscle) {
  const counts = {};
  for (const date of weekDates) {
    const dayLogs = logs[date];
    if (!dayLogs) continue;
    for (const [exId, exLogs] of Object.entries(dayLogs)) {
      const muscle = idToMuscle[exId];
      if (!muscle || ['Kardiyovasküler', 'Full Body'].includes(muscle)) continue;
      for (const s of Object.values(exLogs)) {
        if (s?.done) counts[muscle] = (counts[muscle] || 0) + 1;
      }
    }
  }
  return counts;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-white font-semibold mb-1">{d.fullMuscle}</p>
      <p style={{ color: d.color }}>Bu hafta: <strong>{d.thisWeek} set</strong></p>
      {d.lastWeek > 0 && (
        <p className="text-white/50">Geçen hafta: {d.lastWeek} set</p>
      )}
      <p className="text-white/30">MEV hedef: {d.mev} set</p>
    </div>
  );
};

export default function VolumeChart() {
  const { logs } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);

  const customPrograms = useCustomProgramStore(s => s.programs);
  const isCustom = activeProgram?.startsWith('custom_');
  const resolvedProgram = (activeProgram && (ALL_PROGRAMS[activeProgram] || isCustom)) ? activeProgram : 'vtaper_orta';
  const programData = isCustom ? (customPrograms[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']) : (ALL_PROGRAMS[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']);

  // Build idToMuscle mapping from active program
  const idToMuscle = {};
  const programMuscles = new Set();
  Object.values(programData.program).forEach(day =>
    day.exercises.forEach(ex => {
      idToMuscle[ex.id] = ex.muscle;
      if (ex.muscle && !['Kardiyovasküler', 'Full Body'].includes(ex.muscle)) {
        programMuscles.add(ex.muscle);
      }
    })
  );

  const thisWeekDates = getWeekDates(0);
  const lastWeekDates = getWeekDates(-1);

  const thisWeekCounts = computeMuscleSetCounts(logs, thisWeekDates, idToMuscle);
  const lastWeekCounts = computeMuscleSetCounts(logs, lastWeekDates, idToMuscle);

  // Build chart data from program muscles
  const muscles = [...programMuscles];
  const data = muscles.map(muscle => ({
    muscle: muscle.length > 5 ? muscle.slice(0, 5) : muscle,
    fullMuscle: muscle,
    thisWeek: thisWeekCounts[muscle] || 0,
    lastWeek: lastWeekCounts[muscle] || 0,
    mev: MEV_TARGETS[muscle] || 6,
    color: MUSCLE_COLOR[muscle] || '#14B8A6',
  }));

  const hasAnyData = data.some(d => d.thisWeek > 0 || d.lastWeek > 0);
  const aboveMEV = data.filter(d => d.thisWeek >= d.mev).length;
  const totalSets = data.reduce((a, d) => a + d.thisWeek, 0);

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2">
        <p className="text-white/30 text-sm">Bu hafta antrenman kaydı yok</p>
        <p className="text-white/20 text-xs">Egzersiz logla, hacim burada görünür</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50">{totalSets} set toplam</span>
          <span className="text-xs" style={{ color: aboveMEV === data.length ? '#10B981' : '#F5A623' }}>
            {aboveMEV}/{data.length} kas MEV üstü
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="inline-block w-3 h-2 rounded-sm bg-white/20" /> geçen hafta
        </div>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barGap={2}>
          <XAxis
            dataKey="muscle"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Last week (faded) */}
          <Bar dataKey="lastWeek" radius={[3, 3, 0, 0]} maxBarSize={14} fill="rgba(255,255,255,0.10)" />

          {/* This week (colored) */}
          <Bar dataKey="thisWeek" radius={[4, 4, 0, 0]} maxBarSize={14}>
            {data.map((d) => (
              <Cell
                key={d.fullMuscle}
                fill={d.thisWeek === 0
                  ? 'rgba(255,255,255,0.08)'
                  : d.thisWeek < d.mev
                    ? d.color + '80'
                    : d.color}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-2 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-accent-teal" />
          <span className="text-xs text-white/40">Bu hafta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-white/15" />
          <span className="text-xs text-white/40">Geçen hafta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-white/25" />
          <span className="text-xs text-white/40">soluk = MEV altı</span>
        </div>
      </div>
    </div>
  );
}
