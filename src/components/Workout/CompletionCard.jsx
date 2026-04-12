import { useEffect, useState, useMemo } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';

const MUSCLE_COLORS = {
  'Gogus': '#E94560', 'Trisep': '#EC4899', 'Omuz': '#F5A623',
  'Sirt': '#3B82F6', 'Bisep': '#8B5CF6', 'Bacak': '#10B981',
  'Kor': '#14B8A6', 'Hamstring': '#10B981', 'Kalca': '#10B981',
};

function e1rm(weight, reps) {
  const w = parseFloat(weight), r = parseInt(reps);
  if (!w || !r || r < 1) return 0;
  return r === 1 ? w : Math.round(w * (1 + r / 30));
}

export default function CompletionCard({ date, exercises, accentColor }) {
  const { getSessionVolume, getStreak, logs } = useWorkoutStore();
  const user = useSettingsStore((s) => s.user);
  const [elapsed, setElapsed] = useState(null);

  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const { totalVolume: volume } = getSessionVolume(date, exercises);
  const streak = getStreak();

  // Calculate elapsed time from first set timestamp
  useEffect(() => {
    const stored = localStorage.getItem('vtaper-workout-logs');
    if (stored) {
      try {
        const all = JSON.parse(stored).state?.logs || {};
        const dayLogs = all[date] || {};
        const timestamps = Object.values(dayLogs)
          .flatMap(setMap => Object.values(setMap))
          .map(s => s.ts)
          .filter(Boolean);
        if (timestamps.length) {
          const minTs = Math.min(...timestamps);
          setElapsed(Math.round((Date.now() - minTs) / 60000));
        }
      } catch {}
    }
  }, [date]);

  // Detect PRs broken in this session
  const sessionPRs = useMemo(() => {
    const prs = [];
    const dayLogs = logs[date] || {};
    for (const ex of exercises) {
      const exLogs = dayLogs[ex.id] || {};
      for (const setData of Object.values(exLogs)) {
        if (!setData?.done || !setData.weight || !setData.reps) continue;
        const thisE1RM = e1rm(setData.weight, setData.reps);

        // Check all previous sessions for this exercise
        let prevBest = 0;
        for (const [d, dl] of Object.entries(logs)) {
          if (d >= date) continue;
          const prev = dl[ex.id];
          if (!prev) continue;
          for (const s of Object.values(prev)) {
            if (!s?.done || !s.weight || !s.reps) continue;
            const est = e1rm(s.weight, s.reps);
            if (est > prevBest) prevBest = est;
          }
        }

        if (thisE1RM > prevBest && prevBest > 0) {
          prs.push({ name: ex.name, e1rm: thisE1RM, prev: prevBest });
        }
      }
    }
    // Deduplicate by exercise name (keep best)
    const byName = {};
    for (const pr of prs) {
      if (!byName[pr.name] || pr.e1rm > byName[pr.name].e1rm) byName[pr.name] = pr;
    }
    return Object.values(byName);
  }, [date, exercises, logs]);

  // Muscle groups worked
  const musclesWorked = useMemo(() => {
    const map = {};
    for (const ex of exercises) {
      if (ex.muscle) {
        map[ex.muscle] = (map[ex.muscle] || 0) + ex.sets;
      }
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [exercises]);

  // Compare to last same-exercises session volume
  const volumeChange = useMemo(() => {
    if (volume <= 0) return null;
    const dates = Object.keys(logs).filter(d => d < date).sort().reverse();
    for (const d of dates) {
      const dayLogs = logs[d] || {};
      // Check if same exercises were logged
      const matchCount = exercises.filter(ex => dayLogs[ex.id]).length;
      if (matchCount < exercises.length * 0.5) continue;

      let prevVol = 0;
      for (const ex of exercises) {
        const exLogs = dayLogs[ex.id] || {};
        for (const s of Object.values(exLogs)) {
          if (s?.done && s.weight && s.reps) {
            prevVol += (Number(s.weight) || 0) * (parseInt(s.reps) || 0);
          }
        }
      }
      if (prevVol > 0) {
        const pct = Math.round(((volume - prevVol) / prevVol) * 100);
        return pct;
      }
    }
    return null;
  }, [date, exercises, logs, volume]);

  const name = user?.name || 'Sporcu';
  const kcal = elapsed ? Math.round(elapsed * 5) : Math.round(totalSets * 12);

  return (
    <div className="mx-4 mb-4 rounded-3xl overflow-hidden"
      style={{ border: `1.5px solid ${accentColor}44` }}>

      {/* Gradient header */}
      <div className="p-5 text-center"
        style={{ background: `linear-gradient(135deg, ${accentColor}28 0%, ${accentColor}10 100%)` }}>
        <div className="text-5xl mb-2">{sessionPRs.length > 0 ? '🏆' : '✅'}</div>
        <h2 className="text-lg font-bold text-white">Antrenman Tamamlandi!</h2>
        <p className="text-sm mt-0.5" style={{ color: accentColor + 'cc' }}>
          {sessionPRs.length > 0
            ? `${sessionPRs.length} yeni PR kirdin ${name}!`
            : `Muhtesem is cikardin ${name}!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 divide-x divide-white/5"
        style={{ backgroundColor: '#0a0f1a' }}>
        <Stat label="Set" value={totalSets} icon="📋" color={accentColor} />
        <Stat label="Hacim" value={volume > 0 ? `${(volume / 1000).toFixed(1)}t` : '—'} icon="⚖️" color={accentColor} />
        <Stat label="Sure" value={elapsed ? `${elapsed}dk` : '—'} icon="⏱️" color={accentColor} />
        <Stat label="Kalori" value={`~${kcal}`} icon="🔥" color="#F5A623" />
      </div>

      {/* Volume change comparison */}
      {volumeChange !== null && (
        <div className="px-4 py-2.5 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#0a0f1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs text-white/40">Onceki seansa gore:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            volumeChange > 0 ? 'bg-[#10B981]/15 text-[#10B981]' :
            volumeChange < 0 ? 'bg-[#E94560]/15 text-[#E94560]' :
            'bg-white/10 text-white/50'
          }`}>
            {volumeChange > 0 ? '↑' : volumeChange < 0 ? '↓' : '='} {volumeChange > 0 ? '+' : ''}{volumeChange}% hacim
          </span>
        </div>
      )}

      {/* PRs broken */}
      {sessionPRs.length > 0 && (
        <div className="px-4 py-3" style={{ backgroundColor: '#0a0f1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-semibold text-[#F5A623] mb-2">Yeni Kisisel Rekorlar</p>
          <div className="space-y-1.5">
            {sessionPRs.map((pr, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#F5A623]/8 rounded-xl px-3 py-2">
                <span className="text-sm">🏅</span>
                <span className="text-xs text-white/80 flex-1 min-w-0 truncate">{pr.name}</span>
                <span className="text-xs font-bold text-[#F5A623] flex-shrink-0">
                  e1RM {pr.e1rm}kg
                </span>
                <span className="text-xs text-white/30 flex-shrink-0">
                  (+{pr.e1rm - pr.prev})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Muscle groups worked + streak */}
      <div className="px-4 py-3 flex items-start justify-between gap-3"
        style={{ backgroundColor: '#0a0f1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Muscles */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/30 mb-1.5">Calisan Kaslar</p>
          <div className="flex flex-wrap gap-1">
            {musclesWorked.map(([muscle, sets]) => {
              const color = MUSCLE_COLORS[muscle.normalize('NFD').replace(/[\u0300-\u036f]/g, '')] || '#ffffff50';
              return (
                <span key={muscle} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: color + '20', color: color }}>
                  {muscle} ({sets})
                </span>
              );
            })}
          </div>
        </div>
        {/* Streak */}
        {streak > 0 && (
          <div className="flex flex-col items-center flex-shrink-0 bg-[#14B8A6]/10 rounded-xl px-3 py-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-[#14B8A6]">{streak}</span>
            <span className="text-xs text-white/30">seri</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color }) {
  return (
    <div className="flex flex-col items-center py-3 gap-0.5">
      <span className="text-lg">{icon}</span>
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}
