import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import { ALL_PROGRAMS, VOLUME_TARGETS } from '../../data/program';

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981', 'Kor': '#14B8A6',
};

function getMondayOfWeek(dateStr) {
  const d = new Date(dateStr);
  const diff = (d.getDay() === 0 ? -6 : 1 - d.getDay());
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

export default function VolumeChart() {
  const { getWeeklyVolume } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);

  const resolvedProgram = (activeProgram && ALL_PROGRAMS[activeProgram]) ? activeProgram : 'vtaper_orta';
  const programData = ALL_PROGRAMS[resolvedProgram];
  const allExercises = Object.values(programData.program).flatMap(d => d.exercises);

  const monday = getMondayOfWeek(new Date().toISOString().split('T')[0]);

  const data = Object.entries(VOLUME_TARGETS).map(([muscle, target]) => {
    const actual = getWeeklyVolume(monday, muscle, allExercises);
    return { muscle, actual, min: target.min, max: target.max, color: MUSCLE_COLOR[muscle] || '#fff' };
  });

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="muscle" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs">
                <p className="text-white font-semibold mb-1">{d.muscle}</p>
                <p style={{ color: d.color }}>Haftalık: {d.actual} set</p>
                <p className="text-white/40">Hedef: {d.min}–{d.max} set</p>
              </div>
            );
          }}
        />
        <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
          {data.map((d) => <Cell key={d.muscle} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
