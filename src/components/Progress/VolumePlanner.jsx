// VolumePlanner — Per-muscle weekly volume tracker with MRV warnings
// Uses RP Strength landmarks + Banister fitness-fatigue model

import { useMemo } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS } from '../../data/program';
import { DEFAULT_VOLUME_LANDMARKS } from '../../utils/progressionEngine';
import {
  computeWeeklyVolume,
  computeMultiWeekVolume,
  checkDeloadTriggers,
  checkFailedSetRatio,
  banisterModel,
} from '../../utils/volumeEngine';

const STATUS_COLORS = {
  exceeded: { bg: '#E9456015', bar: '#E94560', text: '#E94560', label: 'MRV Aşıldı' },
  warning:  { bg: '#F5A62315', bar: '#F5A623', text: '#F5A623', label: 'MRV Yakın' },
  optimal:  { bg: '#14B8A615', bar: '#14B8A6', text: '#14B8A6', label: 'Optimal' },
  low:      { bg: 'rgba(255,255,255,0.03)', bar: '#ffffff30', text: '#ffffff40', label: 'Düşük' },
};

const TREND_META = {
  improving:   { color: '#10B981', label: 'Gelişiyor',    icon: '↗' },
  recovering:  { color: '#14B8A6', label: 'Toparlıyor',   icon: '→' },
  fatigued:    { color: '#E94560', label: 'Yorgun',        icon: '↘' },
  detraining:  { color: '#6B7280', label: 'Dekondisyon',  icon: '↓' },
};

// ─── Sub-components ───────────────────────────────────────────────────────

function MuscleBar({ muscle, sets, mev, mav, mrv, status }) {
  const { bg, bar, text, label } = STATUS_COLORS[status] || STATUS_COLORS.low;
  const pct = Math.min((sets / mrv) * 100, 100);
  const mavPct = (mav / mrv) * 100;
  const mevPct = (mev / mrv) * 100;

  return (
    <div className="rounded-xl p-3 border border-white/8" style={{ backgroundColor: bg }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{muscle}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: text }}>{label}</span>
          <span className="text-sm font-bold" style={{ color: text }}>{sets}</span>
          <span className="text-xs text-white/30">/ {mrv} set</span>
        </div>
      </div>

      {/* Progress bar with MEV and MAV markers */}
      <div className="relative h-2 rounded-full bg-white/8 overflow-visible">
        {/* Filled portion */}
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: bar }} />
        {/* MEV marker */}
        <div className="absolute top-[-2px] w-0.5 h-3 rounded-full bg-white/20"
          style={{ left: `${mevPct}%` }} />
        {/* MAV marker */}
        <div className="absolute top-[-2px] w-0.5 h-3 rounded-full bg-white/30"
          style={{ left: `${mavPct}%` }} />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-white/25">MEV {mev}</span>
        <span className="text-xs text-white/25">MAV {mav}</span>
        <span className="text-xs text-white/25">MRV {mrv}</span>
      </div>
    </div>
  );
}

function BanisterCard({ model }) {
  const { fitness, fatigue, performance, trend } = model;
  const { color, label, icon } = TREND_META[trend] || TREND_META.recovering;

  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Banister Fitness-Fatigue</h3>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + '20', color }}>
          {icon} {label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xl font-bold text-[#14B8A6]">{fitness}</p>
          <p className="text-xs text-white/40">Fitness</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-[#E94560]">{fatigue}</p>
          <p className="text-xs text-white/40">Fatigue</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color }}>{performance > 0 ? '+' : ''}{performance}</p>
          <p className="text-xs text-white/40">Performans</p>
        </div>
      </div>

      <p className="text-xs text-white/30 mt-3 leading-relaxed">
        Fitness τ≈45g / Fatigue τ≈15g — Banister 1975 TRIMP modelinden türetilmiştir.
      </p>
    </div>
  );
}

function WeekHistoryMini({ history, muscle }) {
  if (history.length < 2) return null;
  const values = history.map(h => h.volume[muscle] || 0);
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-0.5 h-6">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-[#14B8A6]"
          style={{ height: `${Math.max((v / max) * 100, 8)}%`, opacity: 0.3 + (i / values.length) * 0.7 }} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function VolumePlanner() {
  const logs = useWorkoutStore(s => s.logs);
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const customPrograms = useCustomProgramStore(s => s.programs);

  const isCustom = activeProgram?.startsWith('custom_');
  const programData = useMemo(() => {
    if (isCustom) return customPrograms[activeProgram] || ALL_PROGRAMS['vtaper_orta'];
    return ALL_PROGRAMS[activeProgram] || ALL_PROGRAMS['vtaper_orta'];
  }, [activeProgram, isCustom, customPrograms]);

  // Use custom program's volumeLandmarks if available, else defaults
  const landmarks = useMemo(() => {
    if (isCustom && programData?.volumeLandmarks) return programData.volumeLandmarks;
    return DEFAULT_VOLUME_LANDMARKS;
  }, [isCustom, programData]);

  const thisWeekStart = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  }, []);

  const weekVolume = useMemo(() =>
    computeWeeklyVolume(logs, programData, thisWeekStart),
    [logs, programData, thisWeekStart]
  );

  const history = useMemo(() =>
    computeMultiWeekVolume(logs, programData, 6),
    [logs, programData]
  );

  const alerts = useMemo(() =>
    checkDeloadTriggers(weekVolume, landmarks),
    [weekVolume, landmarks]
  );

  const { recommendation: failRec } = useMemo(() =>
    checkFailedSetRatio(logs, programData, 4),
    [logs, programData]
  );

  const banister = useMemo(() =>
    banisterModel(logs, 60),
    [logs]
  );

  // All muscles sorted by ratio (highest first)
  const allMuscles = useMemo(() => {
    const muscles = Object.keys(landmarks);
    return muscles.map(muscle => {
      const { mev, mav, mrv } = landmarks[muscle];
      const sets = weekVolume[muscle] || 0;
      const ratio = sets / mrv;
      let status;
      if (sets === 0)        status = 'low';
      else if (ratio >= 1.0) status = 'exceeded';
      else if (ratio >= 0.85)status = 'warning';
      else if (ratio >= 0.5) status = 'optimal';
      else                   status = 'low';
      return { muscle, sets, mev, mav, mrv, ratio, status };
    }).sort((a, b) => b.ratio - a.ratio);
  }, [weekVolume, landmarks]);

  const hasAlerts = alerts.some(a => a.status === 'exceeded' || a.status === 'warning');

  return (
    <div className="px-4 pt-2 pb-6 space-y-4">

      {/* Deload alerts */}
      {hasAlerts && (
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#F5A62308', borderColor: '#F5A62330' }}>
          <p className="text-xs font-bold text-[#F5A623] mb-2">Deload Uyarısı</p>
          {alerts.filter(a => a.status !== 'optimal').slice(0, 3).map(a => (
            <div key={a.muscle} className="flex items-center gap-2 mb-1">
              <span className="text-xs" style={{ color: STATUS_COLORS[a.status]?.text }}>
                {a.status === 'exceeded' ? '⚠' : '•'}
              </span>
              <span className="text-xs text-white/60">
                {a.muscle}: {a.sets}/{a.mrv} set ({Math.round(a.ratio * 100)}% MRV)
              </span>
            </div>
          ))}
          {failRec && (
            <p className="text-xs text-[#E94560] mt-2">{failRec}</p>
          )}
        </div>
      )}

      {/* Banister model */}
      <BanisterCard model={banister} />

      {/* Per-muscle volume bars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Bu Hafta</h3>
          <span className="text-xs text-white/40">MEV · MAV · MRV</span>
        </div>
        <div className="space-y-2">
          {allMuscles.map(({ muscle, sets, mev, mav, mrv, status }) => (
            <div key={muscle}>
              <MuscleBar muscle={muscle} sets={sets} mev={mev} mav={mav} mrv={mrv} status={status} />
              {history.length > 1 && (
                <div className="mt-1 px-3">
                  <WeekHistoryMini history={history} muscle={muscle} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2">
        {Object.entries(STATUS_COLORS).map(([key, { bar, label }]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bar }} />
            <span className="text-xs text-white/40">{label}</span>
          </div>
        ))}
      </div>

      {/* Program landmarks info */}
      {isCustom && programData?.mesocycle && (
        <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
          <p className="text-xs font-semibold text-white/70 mb-1">Program Mesocycle</p>
          <p className="text-xs text-white/40">
            {programData.mesocycle.durationWeeks} hafta ·{' '}
            {programData.mesocycle.phases?.map(p => p.name).join(' → ')}
          </p>
        </div>
      )}
    </div>
  );
}
