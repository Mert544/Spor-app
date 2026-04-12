// ProgramAnalytics — Exercise progression + muscle volume chart for a custom program
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import useWorkoutStore from '../../store/useWorkoutStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { computeMultiWeekVolume } from '../../utils/volumeEngine';
import MesocycleView from './MesocycleView';

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Kalça': '#10B981', 'Hamstring': '#F97316',
};

function getColor(muscle) {
  return MUSCLE_COLOR[muscle] || '#ffffff40';
}

// ─── Exercise Progression Card ────────────────────────────────────────────

function ExProgressCard({ exercise, getHistory, getPR }) {
  const history = useMemo(() => getHistory(exercise.id), [exercise.id, getHistory]);
  const pr      = useMemo(() => getPR(exercise.id),      [exercise.id, getPR]);
  const chartData = history.slice(-8).map((h, i) => ({ i: i + 1, w: h.maxWeight || 0 }));
  const hasData   = chartData.length >= 2;
  const muscleColor = getColor(exercise.muscle);

  return (
    <div className="bg-bg-card rounded-xl p-3 border border-white/8">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">{exercise.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: muscleColor + '20', color: muscleColor }}>
              {exercise.muscle}
            </span>
            {exercise.tier && (
              <span className="text-xs text-white/30">{exercise.tier}</span>
            )}
          </div>
        </div>
        {pr && (
          <div className="text-right shrink-0 ml-2">
            <p className="text-xs text-[#F5A623] font-bold">PR</p>
            <p className="text-sm font-bold text-white">{pr.weight}kg</p>
            <p className="text-xs text-white/40">{pr.reps} tekrar</p>
          </div>
        )}
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={52}>
          <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <Line
              type="monotone" dataKey="w" stroke={muscleColor}
              strokeWidth={2} dot={{ fill: muscleColor, r: 2, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-10 flex items-center">
          <p className="text-xs text-white/30">Henüz log yok</p>
        </div>
      )}

      <div className="flex justify-between mt-1 px-0.5">
        <span className="text-xs text-white/30">
          {exercise.sets}×{exercise.reps} · RPE {exercise.rpe}
        </span>
        <span className="text-xs text-white/30">{history.length} seans</span>
      </div>
    </div>
  );
}

// ─── Volume Tab ───────────────────────────────────────────────────────────

function VolumeTab({ programData, logs }) {
  const history = useMemo(() =>
    computeMultiWeekVolume(logs, programData, 8),
    [logs, programData]
  );

  // Collect all muscles
  const allMuscles = useMemo(() => {
    const set = new Set();
    history.forEach(h => Object.keys(h.volume).forEach(m => set.add(m)));
    return [...set];
  }, [history]);

  const chartData = history.map((h, i) => ({
    week: `Hf${i + 1}`,
    ...h.volume,
  }));

  if (chartData.every(row => allMuscles.every(m => !row[m]))) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-white/30 text-sm">Henüz antrenman logu yok.</p>
        <p className="text-white/30 text-xs mt-1">Program aktifleştirip antrenman yaptıkça burada görünecek.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-3 space-y-4">
      <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
        <p className="text-xs text-white/50 mb-3">Haftalık Set Dağılımı (kas grubu)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111c2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
            />
            {allMuscles.slice(0, 6).map(m => (
              <Bar key={m} dataKey={m} stackId="a" fill={getColor(m)} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-muscle totals for last week */}
      {history.length > 0 && (
        <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
          <p className="text-xs text-white/50 mb-3">Son Hafta</p>
          <div className="space-y-2">
            {allMuscles.map(m => {
              const sets = history[history.length - 1]?.volume[m] || 0;
              if (!sets) return null;
              return (
                <div key={m} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getColor(m) }} />
                  <span className="text-sm text-white/70 flex-1">{m}</span>
                  <span className="text-sm font-bold text-white">{sets}</span>
                  <span className="text-xs text-white/30">set</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary Banner ───────────────────────────────────────────────────────

function SummaryBanner({ programData, logs }) {
  const stats = useMemo(() => {
    let totalSets = 0, totalReps = 0, prCount = 0;
    const exIds = new Set();

    Object.values(programData.program || {}).forEach(day => {
      (day.exercises || []).forEach(ex => exIds.add(ex.id));
    });

    Object.values(logs).forEach(dayLog => {
      Object.entries(dayLog).forEach(([exId, setMap]) => {
        if (!exIds.has(exId)) return;
        Object.values(setMap).forEach(s => {
          if (!s?.done) return;
          totalSets++;
          totalReps += s.reps || 0;
        });
      });
    });

    return { totalSets, totalReps, exCount: exIds.size };
  }, [programData, logs]);

  return (
    <div className="grid grid-cols-3 gap-2 px-4 mb-4">
      {[
        ['Egzersiz', stats.exCount, ''],
        ['Toplam Set', stats.totalSets, ''],
        ['Toplam Tekrar', stats.totalReps, ''],
      ].map(([label, val, unit]) => (
        <div key={label} className="bg-bg-card rounded-xl p-3 text-center border border-white/8">
          <p className="text-lg font-bold text-white">{val.toLocaleString()}{unit}</p>
          <p className="text-xs text-white/40 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

// ─── Mesocycle Timeline Tab ───────────────────────────────────────────────

function MesocycleTab({ programData, mesoWeek, onWeekChange, onNewMeso }) {
  const meso = programData.mesocycle;
  if (!meso) return (
    <div className="px-4 py-10 text-center text-white/30 text-sm">
      Bu programda mesocycle tanımlı değil.
    </div>
  );

  const totalWeeks = meso.durationWeeks;
  const phases = meso.phases || [];
  const prevMesos = programData.previousMesocycles || [];

  return (
    <div className="px-4 space-y-4 pb-8">
      {/* Timeline */}
      <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Mesocycle Takvimi</p>
          <span className="text-xs text-white/40">{totalWeeks} hafta</span>
        </div>
        <MesocycleView mesocycle={meso} />
      </div>

      {/* Current week control */}
      <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
        <p className="text-xs text-white/50 uppercase tracking-wide mb-3">Mevcut Hafta</p>
        <div className="flex items-center gap-3">
          <button onClick={() => onWeekChange(Math.max(1, mesoWeek - 1))}
            disabled={mesoWeek <= 1}
            className="w-10 h-10 rounded-xl bg-white/5 text-white/60 text-lg disabled:opacity-30">
            ‹
          </button>
          <div className="flex-1 text-center">
            <p className="text-3xl font-bold text-white">{mesoWeek}</p>
            <p className="text-xs text-white/40">/ {totalWeeks} hafta</p>
          </div>
          <button onClick={() => onWeekChange(Math.min(totalWeeks, mesoWeek + 1))}
            disabled={mesoWeek >= totalWeeks}
            className="w-10 h-10 rounded-xl bg-white/5 text-white/60 text-lg disabled:opacity-30">
            ›
          </button>
        </div>

        {/* Week set targets per exercise */}
        <div className="mt-4 space-y-2">
          {Object.values(programData.program || {}).flatMap(day => day.exercises || []).filter(ex => ex.weeklySetRamp?.length).map((ex, i) => {
            const target = ex.weeklySetRamp[mesoWeek - 1] ?? ex.sets;
            const max = Math.max(...ex.weeklySetRamp);
            const pct = (target / max) * 100;
            return (
              <div key={ex.id || i} className="flex items-center gap-3">
                <p className="text-xs text-white/60 w-32 truncate shrink-0">{ex.name}</p>
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: programData.color }} />
                </div>
                <span className="text-xs font-bold text-white w-6 text-right">{target}</span>
                <span className="text-xs text-white/30">set</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* New mesocycle CTA */}
      {mesoWeek >= totalWeeks && (
        <button onClick={onNewMeso}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #14B8A6, #3B82F6)' }}>
          Yeni Mesocycle Başlat
        </button>
      )}

      {/* Previous mesocycles */}
      {prevMesos.length > 0 && (
        <div className="bg-bg-card rounded-2xl p-4 border border-white/8">
          <p className="text-xs text-white/50 uppercase tracking-wide mb-3">Geçmiş Mesocycle'lar</p>
          <div className="space-y-2">
            {prevMesos.slice().reverse().map((prev, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-white/5 text-white/40">
                  {prevMesos.length - i}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/70">{prev.durationWeeks} hafta</p>
                  <p className="text-xs text-white/30">
                    {new Date(prev.completedAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <span className="text-xs text-[#14B8A6]">Tamamlandı</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'exercise', label: 'Egzersizler' },
  { id: 'volume',   label: 'Hacim' },
  { id: 'meso',     label: 'Meso' },
];

export default function ProgramAnalytics() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { programs, getMesocycleWeek, setMesocycleWeek, startNewMesocycle } = useCustomProgramStore();
  const { logs, getExerciseHistory, getPersonalRecord } = useWorkoutStore();
  const [tab, setTab] = useState('exercise');

  const programData = programs[programId];
  const mesoWeek = getMesocycleWeek(programId);

  if (!programData) {
    return (
      <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm">Program bulunamadı.</p>
          <button onClick={() => navigate('/programlar')} className="mt-4 text-[#14B8A6] text-sm">
            ← Programlara dön
          </button>
        </div>
      </div>
    );
  }

  const allExercises = useMemo(() =>
    Object.values(programData.program || {}).flatMap(day => day.exercises || []),
    [programData]
  );

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-white/8 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/programlar')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 text-lg">
          ‹
        </button>
        <span className="text-lg">{programData.emoji}</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-white truncate">{programData.name}</h1>
          <p className="text-xs text-white/40">{programData.subtitle}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-4">
        <SummaryBanner programData={programData} logs={logs} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? 'text-white'
                : 'bg-white/5 text-white/40'
            }`}
            style={tab === t.id ? { background: `linear-gradient(135deg, ${programData.color}cc, ${programData.color}88)` } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'exercise' && (
        <div className="px-4 space-y-3 pb-8">
          {allExercises.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">Bu programda egzersiz yok.</p>
          )}
          {allExercises.map((ex, i) => (
            <ExProgressCard
              key={ex.id || i}
              exercise={ex}
              getHistory={getExerciseHistory}
              getPR={getPersonalRecord}
            />
          ))}
        </div>
      )}

      {tab === 'volume' && (
        <VolumeTab programData={programData} logs={logs} />
      )}

      {tab === 'meso' && (
        <MesocycleTab
          programData={programData}
          mesoWeek={mesoWeek}
          onWeekChange={(w) => setMesocycleWeek(programId, w)}
          onNewMeso={() => { startNewMesocycle(programId); setTab('exercise'); }}
        />
      )}
    </div>
  );
}
