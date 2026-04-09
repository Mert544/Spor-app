import { useState } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useProgressStore from '../../store/useProgressStore';

const FIELDS = [
  { key: 'waist', label: 'Bel', unit: 'cm', color: '#E94560' },
  { key: 'chest', label: 'Göğüs', unit: 'cm', color: '#3B82F6' },
  { key: 'arm', label: 'Kol (sağ)', unit: 'cm', color: '#8B5CF6' },
  { key: 'hip', label: 'Kalça', unit: 'cm', color: '#10B981' },
];

export default function BodyMeasurements() {
  const { measurements, addMeasurement } = useProgressStore();
  const [form, setForm] = useState({ waist: '', chest: '', arm: '', hip: '' });

  function handleSave() {
    const date = new Date().toISOString().split('T')[0];
    const patch = {};
    FIELDS.forEach(f => { if (form[f.key]) patch[f.key] = Number(form[f.key]); });
    if (Object.keys(patch).length) {
      addMeasurement(date, patch);
      setForm({ waist: '', chest: '', arm: '', hip: '' });
    }
  }

  const sorted = Object.entries(measurements)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, vals]) => ({ date: date.slice(5).replace('-', '/'), ...vals }));

  const latest = sorted[sorted.length - 1] || {};

  return (
    <div>
      {/* Current values */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {FIELDS.map(f => (
          <div key={f.key} className="bg-bg-dark rounded-xl p-3">
            <p className="text-xs text-white/40 mb-1">{f.label}</p>
            <p className="text-lg font-bold" style={{ color: f.color }}>
              {latest[f.key] ? `${latest[f.key]} cm` : '—'}
            </p>
          </div>
        ))}
      </div>

      {/* Mini chart for waist */}
      {sorted.length > 1 && (
        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">Bel trendi</p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={sorted}>
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="waist" stroke="#E94560" strokeWidth={2} dot={false} name="Bel" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Input form */}
      <div className="bg-bg-dark rounded-xl p-3">
        <p className="text-xs text-white/50 mb-3 font-semibold">Yeni Ölçüm Ekle</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs text-white/40 block mb-1">{f.label} ({f.unit})</label>
              <input
                type="number"
                placeholder={f.label}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-accent-teal text-white font-semibold py-2.5 rounded-xl text-sm"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}
