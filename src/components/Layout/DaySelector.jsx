import { getTodayDayIndex } from '../../data/program.js';

const SHORT_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function DaySelector({ selectedIndex, onSelect, days, program }) {
  const todayIndex = getTodayDayIndex();

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      {(days || []).map((day, i) => {
        const isSelected = i === selectedIndex;
        const isToday = i === todayIndex;
        const color = program?.[day]?.color || '#E94560';

        return (
          <button
            key={day}
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isSelected
                ? 'text-white scale-105'
                : 'text-white/50 bg-bg-card hover:text-white/80'
            }`}
            style={
              isSelected
                ? { backgroundColor: color, boxShadow: `0 0 12px ${color}66` }
                : {}
            }
          >
            <span>{SHORT_LABELS[i] || `G${i + 1}`}</span>
            {isToday && (
              <span
                className="w-1.5 h-1.5 rounded-full mt-1"
                style={{ backgroundColor: isSelected ? 'white' : color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
