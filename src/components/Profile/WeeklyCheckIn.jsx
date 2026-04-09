import { useState } from 'react';
import useProgressStore from '../../store/useProgressStore';

const METRICS = [
  { key: 'energy', label: 'Enerji', emoji: '⚡' },
  { key: 'sleep', label: 'Uyku', emoji: '😴' },
  { key: 'hunger', label: 'Açlık', emoji: '🍽️' },
  { key: 'motivation', label: 'Motivasyon', emoji: '🔥' },
  { key: 'recovery', label: 'Toparlanma', emoji: '💪' },
  { key: 'mood', label: 'Ruh Hali', emoji: '😊' },
];

export default function WeeklyCheckIn({ week }) {
  const { addCheckIn, weeklyCheckIns } = useProgressStore();
  const existing = weeklyCheckIns[week] || {};
  const [values, setValues] = useState(() =>
    METRICS.reduce((acc, m) => ({ ...acc, [m.key]: existing[m.key] ?? 5 }), {})
  );
  const [saved, setSaved] = useState(!!existing.energy);

  const avg = (Object.values(values).reduce((a, b) => a + b, 0) / METRICS.length).toFixed(1);

  function handleSave() {
    addCheckIn(week, values);
    setSaved(true);
  }

  function scoreColor(v) {
    if (v >= 8) return '#10B981';
    if (v >= 6) return '#F5A623';
    return '#E94560';
  }

  return (
    <div className="bg-bg-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">Hafta {week} — Check-in</p>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: scoreColor(Number(avg)) }}>{avg}</p>
          <p className="text-xs text-white/40">ort. skor</p>
        </div>
      </div>

      <div className="space-y-4">
        {METRICS.map(m => (
          <div key={m.key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white/70">{m.emoji} {m.label}</span>
              <span className="text-sm font-bold" style={{ color: scoreColor(values[m.key]) }}>
                {values[m.key]}
              </span>
            </div>
            <input
              type="range"
              min={1} max={10}
              value={values[m.key]}
              onChange={e => setValues(v => ({ ...v, [m.key]: Number(e.target.value) }))}
              className="w-full accent-accent-teal h-1.5"
              style={{ accentColor: scoreColor(values[m.key]) }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ backgroundColor: saved ? '#10B981' : '#14B8A6', color: '#fff' }}
      >
        {saved ? '✓ Kaydedildi' : 'Kaydet'}
      </button>
    </div>
  );
}
