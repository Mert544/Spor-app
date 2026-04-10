import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import useProgressStore from '../../store/useProgressStore';

function movingAvg(data, n = 7) {
  return data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - n + 1), i + 1).map(x => x.value).filter(Boolean);
    return { ...d, avg: slice.length ? +(slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2) : null };
  });
}

// Simple linear regression → predict when target weight is reached
function predictGoalDate(weights, targetWeight) {
  const entries = Object.entries(weights)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, w]) => ({ t: new Date(date).getTime(), w: Number(w) }));

  if (entries.length < 4) return null;

  const n = entries.length;
  const t0 = entries[0].t;
  const xs = entries.map(e => (e.t - t0) / (1000 * 60 * 60 * 24)); // days from first
  const ys = entries.map(e => e.w);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumXX = xs.reduce((a, x) => a + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  if (Math.abs(slope) < 0.001) return null; // no meaningful trend

  // Predict day x when y = targetWeight
  const xTarget = (targetWeight - intercept) / slope;
  const today = (Date.now() - t0) / (1000 * 60 * 60 * 24);

  if (xTarget <= today) return null; // already past target
  if (xTarget > today + 730) return null; // more than 2 years away

  const goalDate = new Date(t0 + xTarget * 1000 * 60 * 60 * 24);
  const weeksAway = Math.round((xTarget - today) / 7);
  const weeklyChange = Math.abs(slope * 7).toFixed(2);

  return {
    date: goalDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
    weeksAway,
    weeklyChange,
    direction: slope < 0 ? 'azalıyor' : 'artıyor',
  };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value} kg</p>
      ))}
    </div>
  );
};

export default function WeightChart() {
  const { weights, targetWeight, getRecentWeights } = useProgressStore();
  const recent = getRecentWeights(30);

  const raw = recent.map(({ date, weight }) => ({
    date: date.slice(5).replace('-', '/'),
    value: weight,
  }));
  const data = movingAvg(raw);

  const prediction = targetWeight ? predictGoalDate(weights, targetWeight) : null;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-white/30 text-sm">
        Henüz kilo verisi yok
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={targetWeight} stroke="#E94560" strokeDasharray="4 2" strokeOpacity={0.6} />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={1.5} dot={false} name="Kilo" connectNulls />
          <Line type="monotone" dataKey="avg" stroke="#14B8A6" strokeWidth={2} dot={false} name="7g ort." connectNulls />
        </LineChart>
      </ResponsiveContainer>

      {/* Goal date prediction */}
      {prediction && (
        <div className="mt-3 rounded-xl px-3 py-2.5 flex items-center gap-2"
          style={{ backgroundColor: '#10B98115', border: '1px solid #10B98130' }}>
          <span className="text-base">🎯</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">
              Hedefe ~{prediction.weeksAway} haftada ulaşırsın
            </p>
            <p className="text-xs text-white/40">
              Tahmini tarih: {prediction.date} · Haftalık {prediction.weeklyChange}kg {prediction.direction}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
