import { useEffect, useState } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';

export default function CompletionCard({ date, exercises, accentColor }) {
  const { getSessionVolume } = useWorkoutStore();
  const user = useSettingsStore((s) => s.user);
  const [elapsed, setElapsed] = useState(null);

  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const { totalVolume: volume } = getSessionVolume(date, exercises);

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

  const name = user?.name || 'Sporcu';

  return (
    <div className="mx-4 mb-4 rounded-3xl overflow-hidden"
      style={{ border: `1.5px solid ${accentColor}44` }}>

      {/* Gradient header */}
      <div className="p-5 text-center"
        style={{ background: `linear-gradient(135deg, ${accentColor}28 0%, ${accentColor}10 100%)` }}>
        <div className="text-5xl mb-2">🏆</div>
        <h2 className="text-lg font-bold text-white">Antrenman Tamamlandı!</h2>
        <p className="text-sm mt-0.5" style={{ color: accentColor + 'cc' }}>
          Muhteşem iş çıkardın {name}! 💪
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-white/5"
        style={{ backgroundColor: '#0a0f1a' }}>
        <Stat label="Set" value={totalSets} icon="📋" color={accentColor} />
        <Stat label="Hacim" value={volume > 0 ? `${(volume / 1000).toFixed(1)}t` : '—'} icon="⚖️" color={accentColor} />
        <Stat label="Süre" value={elapsed ? `${elapsed}dk` : '—'} icon="⏱️" color={accentColor} />
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
