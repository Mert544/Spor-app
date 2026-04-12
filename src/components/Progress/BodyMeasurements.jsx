import { useState } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useProgressStore from '../../store/useProgressStore';

const FIELDS = [
  { key: 'waist',    label: 'Bel',        unit: 'cm', color: '#E94560', lowerBetter: true  },
  { key: 'chest',    label: 'Göğüs',      unit: 'cm', color: '#3B82F6', lowerBetter: false },
  { key: 'arm',      label: 'Kol (Sağ)',  unit: 'cm', color: '#8B5CF6', lowerBetter: false },
  { key: 'shoulder', label: 'Omuz',       unit: 'cm', color: '#F5A623', lowerBetter: false },
  { key: 'hip',      label: 'Kalça',      unit: 'cm', color: '#10B981', lowerBetter: null  },
  { key: 'thigh',    label: 'Uyluk',      unit: 'cm', color: '#EC4899', lowerBetter: false },
];

function deltaColor(diff, lowerBetter) {
  if (!diff || diff === 0) return 'rgba(255,255,255,0.3)';
  if (lowerBetter === null) return 'rgba(255,255,255,0.4)';
  const good = lowerBetter ? diff < 0 : diff > 0;
  return good ? '#10B981' : '#E94560';
}

function fmtDelta(diff) {
  if (!diff || diff === 0) return null;
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`;
}

export default function BodyMeasurements() {
  const { measurements, addMeasurement } = useProgressStore();
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(f => [f.key, ''])));
  const [activeField, setActiveField] = useState('waist');

  const sorted = Object.entries(measurements || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, label: date.slice(5).replace('-', '/'), ...vals }));

  const first  = sorted[0] || {};
  const prev   = sorted.length >= 3 ? sorted[sorted.length - 2] : {};
  const latest = sorted[sorted.length - 1] || {};

  // V-Taper Score: Omuz / Bel oranı (ideal: ≥ 1.5, elit: ≥ 1.6)
  const vtaperRatio  = latest.shoulder && latest.waist ? latest.shoulder / latest.waist : null;
  const vtaperLabel  = vtaperRatio ? (vtaperRatio >= 1.6 ? 'Elit' : vtaperRatio >= 1.5 ? 'Harika' : vtaperRatio >= 1.4 ? 'İyi' : 'Gelişiyor') : null;
  const vtaperColor  = vtaperRatio ? (vtaperRatio >= 1.6 ? '#10B981' : vtaperRatio >= 1.5 ? '#F5A623' : vtaperRatio >= 1.4 ? '#3B82F6' : '#E94560') : null;
  const vtaperTarget = 1.6;
  const vtaperPct    = vtaperRatio ? Math.min((vtaperRatio / vtaperTarget) * 100, 100) : 0;

  function handleSave() {
    const date = new Date().toISOString().split('T')[0];
    const patch = {};
    FIELDS.forEach(f => { if (form[f.key]) patch[f.key] = Number(form[f.key]); });
    if (Object.keys(patch).length) {
      const existing = (measurements || {})[date] || {};
      addMeasurement(date, { ...existing, ...patch });
      setForm(Object.fromEntries(FIELDS.map(f => [f.key, ''])));
    }
  }

  const chartData   = sorted.slice(-12);
  const activeF     = FIELDS.find(f => f.key === activeField);
  const hasData     = sorted.length > 0;
  const hasMulti    = sorted.length > 1;
  const activeFields = FIELDS.filter(f => sorted.some(s => s[f.key] != null));

  return (
    <div className="space-y-4">

      {/* V-Taper Score */}
      {vtaperRatio ? (
        <div
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(135deg, ${vtaperColor}0c, ${vtaperColor}1c)`,
            border: `1px solid ${vtaperColor}30`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-white/40 mb-0.5">V-Taper Skoru · Omuz/Bel</p>
              <p className="text-3xl font-black" style={{ color: vtaperColor }}>
                {vtaperRatio.toFixed(2)}
              </p>
              <p className="text-xs font-bold mt-0.5" style={{ color: vtaperColor }}>{vtaperLabel}</p>
            </div>
            <div className="text-right text-xs text-white/30 space-y-0.5">
              <p>Hedef: <span className="text-white/50">1.6 (Elit)</span></p>
              <p className="text-white/20">1.4 İyi · 1.5 Harika</p>
              <p className="text-white/20">Adonis Index</p>
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${vtaperPct}%`, backgroundColor: vtaperColor }}
            />
          </div>
          <p className="text-xs text-white/20 mt-1">{vtaperPct.toFixed(0)}% hedefe</p>
        </div>
      ) : !latest.shoulder && (
        <div className="rounded-xl px-3 py-2.5 border border-accent-gold/20 bg-accent-gold/5">
          <p className="text-xs text-accent-gold/70">Omuz ölçümü ekle → V-Taper skoru görünür</p>
        </div>
      )}

      {/* Current values grid with deltas */}
      <div className="grid grid-cols-3 gap-2">
        {FIELDS.map(f => {
          const cur  = latest[f.key];
          const fst  = first[f.key];
          const prv  = prev[f.key];
          const dFst = cur && fst && fst !== cur ? cur - fst : null;
          const dPrv = cur && prv && prv !== cur ? cur - prv : null;

          return (
            <div
              key={f.key}
              className="bg-bg-dark rounded-xl p-3 cursor-pointer transition-all"
              style={{
                border: `1px solid ${activeField === f.key ? f.color + '50' : 'rgba(255,255,255,0.05)'}`,
              }}
              onClick={() => setActiveField(f.key)}
            >
              <p className="text-xs mb-0.5" style={{ color: f.color + '80' }}>{f.label}</p>
              <p className="text-base font-bold text-white">
                {cur ?? <span className="text-white/20">—</span>}
                {cur && <span className="text-xs font-normal text-white/30"> cm</span>}
              </p>
              {dFst !== null && (
                <p className="text-xs mt-0.5 font-medium" style={{ color: deltaColor(dFst, f.lowerBetter) }}>
                  {fmtDelta(dFst)} ilk
                </p>
              )}
              {dPrv !== null && dPrv !== dFst && (
                <p className="text-xs font-medium" style={{ color: deltaColor(dPrv, f.lowerBetter) }}>
                  {fmtDelta(dPrv)} önceki
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      {hasMulti && (
        <div className="bg-bg-dark rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <p className="text-xs font-semibold text-white/50 mr-1">Trend:</p>
            {FIELDS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveField(f.key)}
                className="px-2.5 py-0.5 rounded-full text-xs transition-all"
                style={{
                  backgroundColor: activeField === f.key ? f.color + '25' : 'rgba(255,255,255,0.04)',
                  color: activeField === f.key ? f.color : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${activeField === f.key ? f.color + '45' : 'transparent'}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [`${v} cm`, activeF?.label]}
              />
              <Line
                type="monotone"
                dataKey={activeField}
                stroke={activeF?.color || '#14B8A6'}
                strokeWidth={2}
                dot={{ fill: activeF?.color || '#14B8A6', r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History table */}
      {hasData && activeFields.length > 0 && (
        <div className="bg-bg-dark rounded-xl p-3">
          <p className="text-xs font-semibold text-white/40 mb-2.5 uppercase tracking-wide">Son Ölçümler</p>
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left text-white/30 pb-2 pr-2 font-normal">Tarih</th>
                  {activeFields.map(f => (
                    <th
                      key={f.key}
                      className="text-right pb-2 px-1.5 font-medium"
                      style={{ color: f.color + '70' }}
                    >
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...sorted].reverse().slice(0, 6).map((row, i) => (
                  <tr key={row.date}>
                    <td className="text-white/40 py-1.5 pr-2">{row.label}</td>
                    {activeFields.map(f => (
                      <td
                        key={f.key}
                        className="text-right py-1.5 px-1.5 font-medium"
                        style={{ color: row[f.key] ? (i === 0 ? f.color : f.color + '80') : 'rgba(255,255,255,0.1)' }}
                      >
                        {row[f.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="bg-bg-dark rounded-xl p-3">
        <p className="text-xs font-semibold text-white/50 mb-3">+ Yeni Ölçüm Ekle</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs block mb-1" style={{ color: f.color + '70' }}>
                {f.label} <span className="text-white/20">({f.unit})</span>
              </label>
              <input
                type="number"
                placeholder="—"
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-accent-teal text-white font-semibold py-2.5 rounded-xl text-sm active:opacity-80"
        >
          Ölçümü Kaydet
        </button>
      </div>
    </div>
  );
}
