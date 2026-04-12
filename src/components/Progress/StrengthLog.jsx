import { LineChart, Line, ResponsiveContainer } from 'recharts';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS } from '../../data/program';

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Kalça': '#EC4899', 'Hamstring': '#10B981',
  'Kalça Dış': '#F5A623', 'İç Bacak': '#10B981',
};

const MUSCLE_ORDER = ['Göğüs', 'Sırt', 'Omuz', 'Bisep', 'Trisep', 'Bacak', 'Kalça', 'Hamstring'];
const SKIP_MUSCLES = new Set(['Kardiyovasküler', 'Full Body', 'Kor', 'Kalça Dış', 'İç Bacak', 'Kardiyovasküler+Kol']);

export default function StrengthLog() {
  const { getPersonalRecord, getExerciseHistory } = useWorkoutStore();
  const activeProgram = useSettingsStore(s => s.activeProgram);

  const customPrograms = useCustomProgramStore(s => s.programs);
  const isCustom = activeProgram?.startsWith('custom_');
  const resolvedProgram = (activeProgram && (ALL_PROGRAMS[activeProgram] || isCustom)) ? activeProgram : 'vtaper_orta';
  const programData = isCustom ? (customPrograms[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']) : (ALL_PROGRAMS[resolvedProgram] || ALL_PROGRAMS['vtaper_orta']);

  // Find the first heavy compound (≥3 sets) per muscle from the active program
  const mainLifts = new Map();
  Object.values(programData.program).forEach(day => {
    day.exercises.forEach(ex => {
      if (!ex.muscle || SKIP_MUSCLES.has(ex.muscle)) return;
      if (ex.sets < 3) return;
      if (!mainLifts.has(ex.muscle)) mainLifts.set(ex.muscle, ex);
    });
  });

  // Sort by MUSCLE_ORDER, append any extras
  const exerciseList = [
    ...MUSCLE_ORDER.map(m => mainLifts.get(m)).filter(Boolean),
    ...[...mainLifts.entries()]
      .filter(([m]) => !MUSCLE_ORDER.includes(m))
      .map(([, ex]) => ex),
  ];

  const prCount = exerciseList.filter(ex => getPersonalRecord(ex.id) !== null).length;

  return (
    <div className="space-y-3">
      {/* Header card */}
      <div className="bg-bg-card rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Kişisel Rekorlar · e1RM</p>
          <p className="text-xs text-white/25 mt-0.5">Epley: ağırlık × (1 + tekrar/30)</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black" style={{ color: '#F5A623' }}>{prCount}</p>
          <p className="text-xs text-white/30">PR kaydı</p>
        </div>
      </div>

      {exerciseList.length === 0 ? (
        <p className="text-center text-white/30 text-sm py-8">Aktif programda kayıt bulunamadı.</p>
      ) : (
        <div className="space-y-2">
          {exerciseList.map(ex => {
            const pr = getPersonalRecord(ex.id);
            // getPersonalRecord handles level suffixes (pa2_o, pa2_k, etc.)
            const history = getExerciseHistory(ex.id);
            const color = MUSCLE_COLOR[ex.muscle] || '#14B8A6';

            const chartData = history.slice(-10).map(h => ({
              v: h.maxE1RM || h.maxWeight,
            }));

            const trend = history.length >= 2
              ? history[history.length - 1].maxWeight > history[history.length - 2].maxWeight
                ? 'up'
                : history[history.length - 1].maxWeight < history[history.length - 2].maxWeight
                  ? 'down' : 'same'
              : null;

            const trendColor = { up: '#10B981', down: '#E94560', same: '#F5A623' };

            return (
              <div key={ex.id} className="flex items-center gap-3 bg-bg-card rounded-2xl px-4 py-3">
                <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate leading-tight">{ex.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs" style={{ color: color + '80' }}>{ex.muscle}</p>
                    {trend && (
                      <span className="text-xs font-bold" style={{ color: trendColor[trend] }}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                      </span>
                    )}
                    {history.length > 0 && (
                      <span className="text-xs text-white/20">{history.length} seans</span>
                    )}
                  </div>
                </div>

                {/* Sparkline */}
                {chartData.length >= 2 && (
                  <div style={{ width: 52, height: 32 }} className="flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={color}
                          strokeWidth={1.5}
                          dot={false}
                          connectNulls
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* PR stats */}
                <div className="text-right flex-shrink-0 min-w-14">
                  {pr ? (
                    <>
                      <p className="text-xl font-black leading-none" style={{ color }}>{pr.e1rm}</p>
                      <p className="text-xs text-white/30 leading-tight">kg e1RM</p>
                      <p className="text-xs text-white/20 mt-0.5">{pr.weight}×{pr.reps}</p>
                    </>
                  ) : (
                    <p className="text-white/20 text-base">—</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-white/15 text-center pb-1">
        e1RM = tahmini 1 tekrar maksimum · tüm zaman en iyi
      </p>
    </div>
  );
}
