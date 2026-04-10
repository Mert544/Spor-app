import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import { ALL_PROGRAMS, PROGRAM_LIBRARY } from '../../data/program';

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Trisep': '#EC4899', 'Omuz': '#F5A623',
  'Sırt': '#3B82F6', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Hamstring': '#10B981', 'Kalça': '#10B981',
};

const ALL_MUSCLES = ['Tümü', 'Göğüs', 'Sırt', 'Omuz', 'Trisep', 'Bisep', 'Bacak', 'Kor'];

export default function ExerciseHistory() {
  const { getExerciseHistory, getPersonalRecord } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const [muscleFilter, setMuscleFilter] = useState('Tümü');
  const [expanded, setExpanded] = useState(null);

  const resolvedProgram = (activeProgram && ALL_PROGRAMS[activeProgram]) ? activeProgram : 'vtaper_orta';
  const programData = ALL_PROGRAMS[resolvedProgram];
  const programMeta = PROGRAM_LIBRARY.find(p => resolvedProgram.startsWith(p.id));

  // Collect unique exercises from the program (dedupe by base name)
  const exerciseMap = new Map();
  Object.values(programData.program).forEach(day => {
    day.exercises.forEach(ex => {
      if (!exerciseMap.has(ex.name)) {
        exerciseMap.set(ex.name, { ...ex });
      }
    });
  });
  const allExercises = [...exerciseMap.values()];

  const filtered = muscleFilter === 'Tümü'
    ? allExercises
    : allExercises.filter(ex => ex.muscle === muscleFilter);

  return (
    <div className="space-y-3">
      {/* Program badge */}
      <div className="flex items-center gap-2 px-1">
        <span>{programMeta?.emoji}</span>
        <p className="text-xs text-white/40">{programMeta?.name} programından egzersizler</p>
      </div>

      {/* Muscle filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {ALL_MUSCLES.map(m => (
          <button
            key={m}
            onClick={() => setMuscleFilter(m)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
            style={muscleFilter === m
              ? { backgroundColor: MUSCLE_COLORS[m] || '#14B8A6', color: '#fff' }
              : { backgroundColor: '#1e293b', color: 'rgba(255,255,255,0.4)' }
            }
          >
            {m}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="space-y-2">
        {filtered.map(ex => {
          const history = getExerciseHistory(ex.id);
          const pr = getPersonalRecord(ex.id);
          const last = history[history.length - 1];
          const prev = history[history.length - 2];
          const trend = last && prev
            ? last.maxWeight > prev.maxWeight ? 'up'
            : last.maxWeight < prev.maxWeight ? 'down'
            : 'same'
            : null;

          const chartData = history.slice(-12).map(h => ({
            w: h.maxWeight,
            label: h.date.slice(5),
          }));
          const isOpen = expanded === ex.id;
          const color = MUSCLE_COLORS[ex.muscle] || '#fff';

          return (
            <div key={ex.id} className="bg-bg-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : ex.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{ex.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: color + '99' }}>{ex.muscle}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {history.length === 0 ? (
                    <span className="text-xs text-white/20">Kayıt yok</span>
                  ) : (
                    <>
                      <div className="text-right">
                        {last && (
                          <p className="text-base font-bold text-white">{last.maxWeight} <span className="text-xs text-white/40">kg</span></p>
                        )}
                        {trend && (
                          <p className="text-xs" style={{ color: trend === 'up' ? '#10B981' : trend === 'down' ? '#E94560' : '#F5A623' }}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {prev && `${prev.maxWeight}kg`}
                          </p>
                        )}
                      </div>
                      {/* Mini sparkline */}
                      {chartData.length >= 2 && (
                        <div style={{ width: 48, height: 32 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                              <Line type="monotone" dataKey="w" stroke={color} strokeWidth={1.5} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </>
                  )}
                  <span className="text-white/20 text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded: full chart */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3">
                  {history.length < 2 ? (
                    <p className="text-xs text-white/30 text-center py-4">
                      En az 2 antrenman kaydı gerekli.
                    </p>
                  ) : (
                    <>
                      {/* Stats row */}
                      <div className="flex gap-2 mb-3">
                        <MiniStat label="Toplam Seans" value={history.length} color={color} />
                        {pr && <MiniStat label="PR (e1RM)" value={`${pr.e1rm} kg`} color="#F5A623" />}
                        {pr && <MiniStat label={`${pr.weight}kg × ${pr.reps}`} value={pr.date.slice(5)} color="rgba(255,255,255,0.3)" />}
                      </div>

                      {/* Chart */}
                      <p className="text-xs text-white/30 mb-2">Max ağırlık (son {chartData.length} seans)</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                          <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          {pr && (
                            <ReferenceLine y={pr.e1rm} stroke="#F5A62340" strokeDasharray="3 3" label={{ value: 'PR', fill: '#F5A623', fontSize: 9 }} />
                          )}
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              return (
                                <div className="bg-bg-dark border border-white/10 rounded-lg px-2 py-1.5 text-xs">
                                  <p style={{ color }}>{payload[0].value} kg</p>
                                  <p className="text-white/40">{payload[0].payload.label}</p>
                                </div>
                              );
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="w"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="flex-1 bg-bg-dark rounded-xl px-2 py-2 text-center">
      <p className="text-sm font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-white/30 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}
