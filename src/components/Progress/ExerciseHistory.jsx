import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import useWorkoutStore from '../../store/useWorkoutStore';
import { ALL_PROGRAMS } from '../../data/program';

const MUSCLE_COLORS = {
  'Göğüs': '#E94560', 'Trisep': '#EC4899', 'Omuz': '#F5A623',
  'Sırt': '#3B82F6', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Hamstring': '#10B981', 'Kalça': '#EC4899',
  'Kalça Dış': '#F5A623', 'İç Bacak': '#10B981',
};

// Strip level suffix: pa1_o → pa1
function baseId(id) {
  return id.replace(/_(k|o|z)$/, '');
}

export default function ExerciseHistory() {
  const { getExerciseHistory, getPersonalRecord, logs } = useWorkoutStore();
  const [muscleFilter, setMuscleFilter] = useState('Tümü');
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // ─── Build master exercise registry from ALL programs ──────────────
  const { exerciseRegistry, allMuscles } = useMemo(() => {
    const registry = new Map(); // baseId → exercise info
    const muscles = new Set(['Tümü']);

    Object.values(ALL_PROGRAMS).forEach(prog => {
      Object.values(prog.program).forEach(day => {
        day.exercises.forEach(ex => {
          const base = baseId(ex.id);
          if (!registry.has(base)) {
            registry.set(base, { ...ex, id: base });
          }
          if (ex.muscle && !['Kardiyovasküler', 'Full Body', 'Kardiyovasküler+Kol'].includes(ex.muscle)) {
            muscles.add(ex.muscle);
          }
        });
      });
    });

    // Also scan logs for any IDs not in registry (custom exercises, etc.)
    Object.values(logs).forEach(dayLogs => {
      Object.keys(dayLogs).forEach(exId => {
        const base = baseId(exId);
        if (!registry.has(base)) {
          registry.set(base, { id: base, name: base, muscle: '—', sets: 0, reps: '—' });
        }
      });
    });

    return {
      exerciseRegistry: registry,
      allMuscles: ['Tümü', ...Array.from(muscles).filter(m => m !== 'Tümü').sort()],
    };
  }, [logs]);

  // ─── Filter + sort ─────────────────────────────────────────────────
  const allExercises = useMemo(() => {
    return Array.from(exerciseRegistry.values()).map(ex => {
      const history = getExerciseHistory(ex.id);
      const pr = getPersonalRecord(ex.id);
      return { ...ex, history, pr, hasData: history.length > 0 };
    });
  }, [exerciseRegistry, getExerciseHistory, getPersonalRecord]);

  const filtered = useMemo(() => {
    let list = allExercises;
    if (muscleFilter !== 'Tümü') {
      list = list.filter(ex => ex.muscle === muscleFilter);
    }
    if (!showAll) {
      list = list.filter(ex => ex.hasData);
    }
    // Sort: exercises with data first, then by sessions desc
    return list.sort((a, b) => {
      if (a.hasData !== b.hasData) return a.hasData ? -1 : 1;
      return b.history.length - a.history.length;
    });
  }, [allExercises, muscleFilter, showAll]);

  const withDataCount = allExercises.filter(ex =>
    muscleFilter === 'Tümü' ? ex.hasData : (ex.muscle === muscleFilter && ex.hasData)
  ).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Egzersiz Geçmişi</p>
          <p className="text-xs text-white/40 mt-0.5">
            {withDataCount} egzersiz · tüm programlar
          </p>
        </div>
        <button
          onClick={() => setShowAll(v => !v)}
          className="text-xs px-3 py-1.5 rounded-lg transition-all"
          style={{
            backgroundColor: showAll ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.06)',
            color: showAll ? '#14B8A6' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${showAll ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {showAll ? 'Sadece Kayıtlılar' : 'Tümünü Göster'}
        </button>
      </div>

      {/* Muscle filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {allMuscles.map(m => {
          const color = MUSCLE_COLORS[m] || '#14B8A6';
          const active = muscleFilter === m;
          return (
            <button
              key={m}
              onClick={() => setMuscleFilter(m)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={active
                ? { backgroundColor: color, color: '#fff' }
                : { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      {filtered.length === 0 ? (
        <div className="bg-bg-card rounded-2xl p-6 text-center">
          <p className="text-white/30 text-sm">
            {showAll ? 'Bu grupta egzersiz yok.' : 'Henüz kayıt yok.'}
          </p>
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs text-white/40 mt-2 underline"
            >
              Tüm egzersizleri göster
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(ex => {
            const { history, pr } = ex;
            const last = history[history.length - 1];
            const prev = history[history.length - 2];
            const trend = last && prev
              ? last.maxWeight > prev.maxWeight ? 'up'
              : last.maxWeight < prev.maxWeight ? 'down' : 'same'
              : null;

            const chartData = history.slice(-12).map(h => ({
              w: h.maxWeight,
              label: h.date.slice(5),
            }));
            const isOpen = expanded === ex.id;
            const color = MUSCLE_COLORS[ex.muscle] || '#14B8A6';
            const trendColor = { up: '#10B981', down: '#E94560', same: '#F5A623' };

            return (
              <div key={ex.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: '#1e293b',
                  border: `1px solid ${ex.hasData ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'}`,
                }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : ex.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <div
                    className="w-1.5 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ex.hasData ? color : 'rgba(255,255,255,0.12)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${ex.hasData ? 'text-white' : 'text-white/40'}`}>
                      {ex.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs" style={{ color: ex.hasData ? color + '80' : 'rgba(255,255,255,0.2)' }}>
                        {ex.muscle}
                      </p>
                      {history.length > 0 && (
                        <span className="text-xs text-white/20">{history.length} seans</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!ex.hasData ? (
                      <span className="text-xs text-white/20">Kayıt yok</span>
                    ) : (
                      <>
                        <div className="text-right">
                          {last && (
                            <p className="text-base font-bold text-white leading-none">
                              {last.maxWeight} <span className="text-xs text-white/40">kg</span>
                            </p>
                          )}
                          {trend && (
                            <p className="text-xs mt-0.5" style={{ color: trendColor[trend] }}>
                              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}{' '}
                              {prev && `${prev.maxWeight}kg`}
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

                {/* Expanded: full chart + stats */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    {/* Exercise note from program */}
                    {ex.note && (
                      <div
                        className="mb-3 px-3 py-2 rounded-xl text-xs text-amber-300/75 italic leading-relaxed"
                        style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}
                      >
                        {ex.note}
                      </div>
                    )}

                    {history.length < 2 ? (
                      <p className="text-xs text-white/30 text-center py-4">
                        Grafik için en az 2 antrenman kaydı gerekli.
                      </p>
                    ) : (
                      <>
                        {/* Stats row */}
                        <div className="flex gap-2 mb-3">
                          <MiniStat label="Toplam Seans" value={history.length} color={color} />
                          {pr && <MiniStat label="PR (e1RM)" value={`${pr.e1rm} kg`} color="#F5A623" />}
                          {pr && (
                            <MiniStat
                              label={pr.date.slice(5)}
                              value={`${pr.weight}×${pr.reps}`}
                              color="rgba(255,255,255,0.3)"
                            />
                          )}
                        </div>

                        {/* Chart */}
                        <p className="text-xs text-white/30 mb-2">
                          Max ağırlık · son {chartData.length} seans
                        </p>
                        <ResponsiveContainer width="100%" height={120}>
                          <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                            <XAxis
                              dataKey="label"
                              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                              tickLine={false}
                              axisLine={false}
                              domain={['auto', 'auto']}
                            />
                            {pr && (
                              <ReferenceLine
                                y={pr.e1rm}
                                stroke="#F5A62340"
                                strokeDasharray="3 3"
                                label={{ value: 'PR', fill: '#F5A623', fontSize: 9 }}
                              />
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

                    {/* Program info */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                      {ex.sets > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {ex.sets}×{ex.reps}
                        </span>
                      )}
                      {ex.rpe && (
                        <span className="text-xs px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: color + '15', color: color + 'cc' }}>
                          RPE {ex.rpe}
                        </span>
                      )}
                      {ex.rest > 0 && (
                        <span className="text-xs text-white/30">
                          {ex.rest >= 60 ? `${ex.rest / 60}dk` : `${ex.rest}sn`} dinlenme
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
