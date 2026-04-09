import { useEffect, useRef, useState } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

const PRESETS = [30, 45, 60, 90, 120, 180, 240];
const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS;

export default function RestTimer() {
  const { timerVisible, setTimerVisible } = useSettingsStore();
  const [selected, setSelected] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const totalRef = useRef(90);

  useEffect(() => {
    if (!timerVisible) {
      clearInterval(intervalRef.current);
      setRunning(false);
      setRemaining(selected);
    }
  }, [timerVisible]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function selectPreset(s) {
    setSelected(s);
    totalRef.current = s;
    setRemaining(s);
    setRunning(false);
  }

  function toggle() {
    if (remaining === 0) {
      setRemaining(selected);
      totalRef.current = selected;
      setRunning(true);
    } else {
      setRunning(r => !r);
    }
  }

  function adjust(delta) {
    setRemaining(r => {
      const next = Math.max(0, r + delta);
      if (!running) {
        setSelected(next);
        totalRef.current = next;
      }
      return next;
    });
  }

  const progress = totalRef.current > 0 ? remaining / totalRef.current : 0;
  const dashOffset = CIRC * (1 - progress);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (!timerVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(10,15,26,0.97)' }}
    >
      {/* Close */}
      <button
        onClick={() => setTimerVisible(false)}
        className="absolute top-14 right-5 w-9 h-9 rounded-full bg-bg-card flex items-center justify-center text-white/60"
      >
        ✕
      </button>

      <p className="text-white/40 text-sm mb-8 tracking-widest uppercase">Dinlenme Sayacı</p>

      {/* SVG circle */}
      <div className="relative mb-8">
        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke={remaining === 0 ? '#10B981' : '#14B8A6'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white font-mono">
            {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs}
          </span>
          {mins === 0 && <span className="text-white/30 text-xs">sn</span>}
        </div>
      </div>

      {/* Adjust buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => adjust(-15)}
          className="w-12 h-12 rounded-full bg-bg-card text-white/70 font-semibold flex items-center justify-center"
        >
          -15
        </button>
        <button
          onClick={toggle}
          className="w-16 h-16 rounded-full text-white font-bold text-lg flex items-center justify-center"
          style={{ backgroundColor: running ? '#E94560' : '#14B8A6' }}
        >
          {remaining === 0 ? '↺' : running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => adjust(15)}
          className="w-12 h-12 rounded-full bg-bg-card text-white/70 font-semibold flex items-center justify-center"
        >
          +15
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap justify-center px-8">
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => selectPreset(p)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={selected === p
              ? { backgroundColor: '#14B8A6', color: '#fff' }
              : { backgroundColor: '#1e293b', color: 'rgba(255,255,255,0.5)' }
            }
          >
            {p >= 60 ? `${p / 60}dk` : `${p}s`}
          </button>
        ))}
      </div>
    </div>
  );
}
