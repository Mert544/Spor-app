import { getTodayDayIndex } from '../../data/program.js';
import useWorkoutStore from '../../store/useWorkoutStore.js';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function DaySelector({ selectedIndex, onSelect, days, program }) {
  const todayIndex = getTodayDayIndex();
  const today = getToday();
  const { getDayProgress } = useWorkoutStore();

  return (
    <div className="flex gap-2 px-4 pt-2 pb-1 overflow-x-auto scrollbar-hide">
      {(days || []).map((day, i) => {
        const isSelected = i === selectedIndex;
        const isToday = i === todayIndex;
        const color = program?.[day]?.color || '#E94560';
        const emoji = program?.[day]?.emoji || '';
        const exercises = program?.[day]?.exercises || [];
        const { completed, total } = getDayProgress(today, exercises);
        const isDone = total > 0 && completed === total;
        const hasProgress = completed > 0 && !isDone;

        // Short label: first word before " - "
        const short = day.split(' - ')[0] || `G${i + 1}`;

        return (
          <button
            key={day}
            onClick={() => onSelect(i)}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 pt-2 pb-1.5 rounded-2xl transition-all active:scale-95"
            style={isSelected
              ? { backgroundColor: color, boxShadow: `0 4px 16px ${color}55` }
              : { backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            {/* Emoji */}
            <span className="text-base leading-none">{emoji}</span>

            {/* Day label */}
            <span className={`text-xs font-bold leading-none ${isSelected ? 'text-white' : 'text-white/50'}`}>
              {short}
            </span>

            {/* Today dot / completion indicator */}
            <div className="flex items-center justify-center h-2">
              {isDone ? (
                <span className="text-xs leading-none">✓</span>
              ) : hasProgress ? (
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : color }} />
              ) : isToday ? (
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? 'white' : color + '99' }} />
              ) : (
                <div className="w-1 h-1 rounded-full bg-white/10" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
