import { useState } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';

const RPE_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

function calc1RM(weight, reps) {
  const w = parseFloat(weight);
  const r = parseInt(reps);
  if (!w || !r || r < 1 || r > 30) return null;
  return r === 1 ? w : Math.round(w * (1 + r / 30));
}

export default function SetLogger({ date, exerciseId, setIndex, accentColor, restSeconds }) {
  const { logSet, getExerciseLogs, getPreviousWeight } = useWorkoutStore();
  const setTimerVisible = useSettingsStore(s => s.setTimerVisible);

  const logs = getExerciseLogs(date, exerciseId);
  const entry = logs[setIndex] || {};
  const prevWeight = getPreviousWeight(exerciseId, setIndex);

  const [weight, setWeight] = useState(entry.weight ?? '');
  const [reps, setReps] = useState(entry.reps ?? '');
  const [rpe, setRpe] = useState(entry.rpe ?? 8);
  const [done, setDone] = useState(entry.done ?? false);
  const [isPR, setIsPR] = useState(false);

  const estimated1RM = calc1RM(weight, reps);

  function save(patch) {
    logSet(date, exerciseId, setIndex, { weight, reps, rpe, done, ...patch });
  }

  function handleDone() {
    const nextDone = !done;

    if (nextDone) {
      // Check PR before saving (old state)
      const oldPR = useWorkoutStore.getState().getPersonalRecord(exerciseId);
      const cur1RM = calc1RM(weight, reps);
      setDone(true);
      save({ done: true });
      if (navigator.vibrate) navigator.vibrate(30);
      if (cur1RM && (!oldPR || cur1RM > oldPR.e1rm)) setIsPR(true);
      if (restSeconds > 0) setTimerVisible(true);
    } else {
      setDone(false);
      setIsPR(false);
      save({ done: false });
    }
  }

  return (
    <div className={`transition-all ${done ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-2 py-1.5 px-1">
        <span className="text-xs text-white/40 w-5 text-center font-mono">{setIndex + 1}</span>

        {/* Weight */}
        <div className="flex-1 relative">
          <input
            type="number"
            inputMode="decimal"
            placeholder={prevWeight ? String(prevWeight) : 'kg'}
            value={weight}
            onChange={e => { setWeight(e.target.value); save({ weight: e.target.value }); }}
            className="w-full bg-bg-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-white/30"
            disabled={done}
          />
          {!weight && prevWeight && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/25 text-xs pointer-events-none">
              ↑{prevWeight}
            </span>
          )}
          {weight && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">kg</span>
          )}
        </div>

        {/* Reps */}
        <div className="flex-1 relative">
          <input
            type="number"
            inputMode="numeric"
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
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all border flex-shrink-0"
          style={done
            ? { backgroundColor: accentColor, borderColor: accentColor }
            : { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent' }
          }
        >
          {done && <span className="text-white text-xs">✓</span>}
        </button>
      </div>

      {/* 1RM + PR badge */}
      {(estimated1RM || isPR) && weight && reps && (
        <div className="flex justify-end gap-2 pr-1 pb-1">
          {isPR && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: '#F5A62330', color: '#F5A623' }}>
              🏅 Yeni PR!
            </span>
          )}
          {estimated1RM && !done && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
              ~1RM: {estimated1RM} kg
            </span>
          )}
        </div>
      )}
    </div>
  );
}
