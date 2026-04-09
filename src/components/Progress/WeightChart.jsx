import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import useProgressStore from '../../store/useProgressStore';

function movingAvg(data, n = 7) {
  return data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - n + 1), i + 1).map(x => x.value).filter(Boolean);
    return { ...d, avg: slice.length ? +(slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2) : null };
  });
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

  const raw = recent.map(([date, value]) => ({
    date: date.slice(5).replace('-', '/'),
    value,
  }));
  const data = movingAvg(raw);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-white/30 text-sm">
        Henüz kilo verisi yok
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={targetWeight} stroke="#E94560" strokeDasharray="4 2" strokeOpacity={0.6} />
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={1.5} dot={false} name="Kilo" connectNulls />
        <Line type="monotone" dataKey="avg" stroke="#14B8A6" strokeWidth={2} dot={false} name="7 günlük ort." connectNulls strokeDasharray="" />
      </LineChart>
    </ResponsiveContainer>
  );
}
