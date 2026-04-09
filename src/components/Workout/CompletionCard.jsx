import { useEffect, useState } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';

export default function CompletionCard({ date, exercises, accentColor }) {
  const { getSessionVolume } = useWorkoutStore();
  const [elapsed, setElapsed] = useState(null);

  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const { totalVolume: volume } = getSessionVolume(date, exercises);

  useEffect(() => {
    // Try to compute elapsed from first logged set
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

  return (
    <div
      className="mx-4 mb-4 rounded-2xl p-5 text-center"
      style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`, border: `1.5px solid ${accentColor}55` }}
    >
      <div className="text-4xl mb-2">🏆</div>
      <h2 className="text-lg font-bold text-white mb-1">Antrenman Tamamlandı!</h2>
      <p className="text-white/50 text-sm mb-4">Harika iş çıkardın Mert 💪</p>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Toplam Set" value={totalSets} color={accentColor} />
        <Stat label="Hacim" value={volume > 0 ? `${(volume / 1000).toFixed(1)}t` : '—'} color={accentColor} />
        <Stat label="Süre" value={elapsed ? `${elapsed} dk` : '—'} color={accentColor} />
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl py-3 px-2" style={{ backgroundColor: `${color}22` }}>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50 mt-0.5">{label}</p>
    </div>
  );
}
