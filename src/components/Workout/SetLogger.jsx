import { useState } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';

const RPE_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export default function SetLogger({ date, exerciseId, setIndex, accentColor }) {
  const { logSet, getExerciseLogs } = useWorkoutStore();
  const logs = getExerciseLogs(date, exerciseId);
  const entry = logs[setIndex] || {};

  const [weight, setWeight] = useState(entry.weight ?? '');
  const [reps, setReps] = useState(entry.reps ?? '');
  const [rpe, setRpe] = useState(entry.rpe ?? 8);
  const [done, setDone] = useState(entry.done ?? false);

  function save(patch) {
    const next = { weight, reps, rpe, done, ...patch };
    logSet(date, exerciseId, setIndex, next);
  }

  function handleDone() {
    const nextDone = !done;
    setDone(nextDone);
    save({ done: nextDone });
    if (nextDone && navigator.vibrate) navigator.vibrate(30);
  }

  return (
    <div className={`flex items-center gap-2 py-1.5 px-1 rounded-lg transition-colors ${done ? 'opacity-60' : ''}`}>
      <span className="text-xs text-white/40 w-5 text-center font-mono">{setIndex + 1}</span>

      {/* Weight */}
      <div className="flex-1 relative">
        <input
          type="number"
          placeholder="kg"
          value={weight}
          onChange={e => { setWeight(e.target.value); save({ weight: e.target.value }); }}
          className="w-full bg-bg-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-white/30"
          disabled={done}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">kg</span>
      </div>

      {/* Reps */}
      <div className="flex-1 relative">
        <input
          type="number"
          placeholder="tekrar"
          value={reps}
          onChange={e => { setReps(e.target.value); save({ reps: e.target.value }); }}
          className="w-full bg-bg-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-white/30"
          disabled={done}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">×</span>
      </div>

      {/* RPE */}
      <select
        value={rpe}
        onChange={e => { setRpe(Number(e.target.value)); save({ rpe: Number(e.target.value) }); }}
        className="bg-bg-dark border border-white/10 rounded-lg px-1 py-1.5 text-sm text-white/80 focus:outline-none"
        disabled={done}
      >
        {RPE_OPTIONS.map(r => (
          <option key={r} value={r}>@{r}</option>
        ))}
      </select>

      {/* Done toggle */}
      <button
        onClick={handleDone}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
        style={done
          ? { backgroundColor: accentColor, borderColor: accentColor }
          : { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent' }
        }
      >
        {done && <span className="text-white text-xs">✓</span>}
      </button>
    </div>
  );
}
