import { useState } from 'react';
import useProgressStore from '../../store/useProgressStore';
import WeightChart from './WeightChart';
import VolumeChart from './VolumeChart';
import StrengthLog from './StrengthLog';
import BodyMeasurements from './BodyMeasurements';
import WorkoutCalendar from './WorkoutCalendar';
import ExerciseHistory from './ExerciseHistory';

const TABS = [
  { id: 'Kilo', label: 'Kilo', icon: '⚖️' },
  { id: 'Hacim', label: 'Hacim', icon: '📊' },
  { id: 'Kuvvet', label: 'Kuvvet', icon: '💪' },
  { id: 'Egzersiz', label: 'Egzersiz', icon: '📈' },
  { id: 'Takvim', label: 'Takvim', icon: '📅' },
  { id: 'Ölçüm', label: 'Ölçüm', icon: '📐' },
];

export default function ProgressPage() {
  const [tab, setTab] = useState('Kilo');
  const { weights, startWeight, targetWeight, getTodayWeight, getTotalChange, addWeight, currentWeek } = useProgressStore();
  const [weightInput, setWeightInput] = useState('');

  function handleAddWeight() {
    const w = parseFloat(weightInput);
    if (!w || w < 40 || w > 200) return;
    const date = new Date().toISOString().split('T')[0];
    addWeight(date, w);
    setWeightInput('');
  }

  const todayWeight = getTodayWeight();
  const totalChange = getTotalChange();

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      {/* Header stats */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-white mb-3">İlerleme</h1>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatCard label="Başlangıç" value={startWeight ? `${startWeight} kg` : '—'} color="rgba(255,255,255,0.3)" />
          <StatCard label="Bugün" value={todayWeight ? `${todayWeight} kg` : '—'} color="#14B8A6" />
          <StatCard
            label="Hedef"
            value={targetWeight ? `${targetWeight} kg` : '—'}
            color="#E94560"
            sub={totalChange !== null ? `${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)} kg` : null}
          />
        </div>

        {/* Quick weight add */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Bugünkü kilo (kg)"
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddWeight()}
            className="flex-1 bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-teal"
          />
          <button
            onClick={handleAddWeight}
            className="bg-accent-teal text-white font-bold px-4 rounded-xl text-sm"
          >
            Ekle
          </button>
        </div>
      </div>

      {/* Tabs — horizontal scroll */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={tab === t.id
              ? { backgroundColor: '#14B8A6', color: '#fff' }
              : { backgroundColor: '#1e293b', color: 'rgba(255,255,255,0.4)' }
            }
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4">
        {tab === 'Kilo' && (
          <div className="bg-bg-card rounded-2xl p-4">
            <p className="text-xs text-white/40 mb-3 font-semibold">SON 30 GÜN{targetWeight ? ` · Hedef: ${targetWeight} kg` : ''}</p>
            <WeightChart />
            <div className="flex gap-3 mt-3">
              <Legend color="#3B82F6" label="Günlük kilo" />
              <Legend color="#14B8A6" label="7 günlük ort." />
              <Legend color="#E94560" label="Hedef" dashed />
            </div>
          </div>
        )}

        {tab === 'Hacim' && (
          <div className="bg-bg-card rounded-2xl p-4">
            <p className="text-xs text-white/40 mb-1 font-semibold">HAFTALIK SET HACMİ</p>
            <p className="text-xs text-white/30 mb-3">Hafta {currentWeek}</p>
            <VolumeChart />
          </div>
        )}

        {tab === 'Kuvvet' && (
          <div>
            <p className="text-xs text-white/40 mb-3 font-semibold uppercase tracking-wider">En İyi Setler</p>
            <StrengthLog />
          </div>
        )}

        {tab === 'Egzersiz' && <ExerciseHistory />}

        {tab === 'Takvim' && <WorkoutCalendar />}

        {tab === 'Ölçüm' && <BodyMeasurements />}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <div className="bg-bg-card rounded-2xl p-3 text-center">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-base font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
    </div>
  );
}

function Legend({ color, label, dashed }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-4 h-0.5 rounded"
        style={{ background: dashed ? 'none' : color, borderTop: dashed ? `2px dashed ${color}` : undefined }}
      />
      <span className="text-xs text-white/40">{label}</span>
    </div>
  );
}
