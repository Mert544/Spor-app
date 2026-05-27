import { useEffect, useState, useRef } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import useGamificationStore from '../../store/useGamificationStore';
import { CALORIE_PER_MINUTE, CALORIE_PER_SET } from '../../config/constants';

export default function CompletionCard({ date, exercises, accentColor }) {
  const { getSessionVolume, getExerciseLogs } = useWorkoutStore();
  const user = useSettingsStore((s) => s.user);
  const recordWorkout = useGamificationStore((s) => s.recordWorkout);
  const addVolume = useGamificationStore((s) => s.addVolume);
  const [elapsed, setElapsed] = useState(null);
  const gamificationRecorded = useRef(false);

  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
  const { totalVolume: volume } = getSessionVolume(date, exercises);

  useEffect(() => {
    const timestamps = [];
    for (const ex of exercises) {
      const exLogs = getExerciseLogs(date, ex.id);
      for (const setData of Object.values(exLogs)) {
        if (setData?.ts) timestamps.push(setData.ts);
      }
    }
    if (timestamps.length) {
      const minTs = Math.min(...timestamps);
      setElapsed(Math.round((Date.now() - minTs) / 60000));
    }
  }, [date, exercises, getExerciseLogs]);

  useEffect(() => {
    if (!gamificationRecorded.current) {
      gamificationRecorded.current = true;
      recordWorkout();
      if (volume > 0) addVolume(volume);
    }
  }, [recordWorkout, addVolume, volume]);

  const name = user?.name || 'Sporcu';
  const kcal = elapsed ? Math.round(elapsed * CALORIE_PER_MINUTE) : Math.round(totalSets * CALORIE_PER_SET);

  return (
    <div className="mx-4 mb-4 rounded-3xl overflow-hidden"
      style={{ border: `1.5px solid ${accentColor}44` }}>

      <div className="p-5 text-center"
        style={{ background: `linear-gradient(135deg, ${accentColor}28 0%, ${accentColor}10 100%)` }}>
        <div className="text-5xl mb-2">🏆</div>
        <h2 className="text-lg font-bold text-white">Antrenman Bitti!</h2>
        <p className="text-sm mt-0.5" style={{ color: accentColor + 'cc' }}>
          {name}, harika bir seans. Devam et! 💪
        </p>
      </div>

      <div className="grid grid-cols-4 divide-x divide-white/5"
        style={{ backgroundColor: '#0a0f1a' }}>
        <Stat label="Set" value={totalSets} icon="📋" color={accentColor} />
        <Stat label="Hacim" value={volume > 0 ? `${(volume / 1000).toFixed(1)}t` : '—'} icon="⚖️" color={accentColor} />
        <Stat label="Sure" value={elapsed ? `${elapsed}dk` : '—'} icon="⏱️" color={accentColor} />
        <Stat label="Kalori" value={`~${kcal}`} icon="🔥" color="#F5A623" />
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
