import { DAYS, getTodayDayIndex } from '../../data/program.js';

const DAY_COLORS = [
  '#E94560', // Pzt - PUSH A
  '#3B82F6', // Sal - PULL A
  '#F5A623', // Çar - OMUZ+KOL
  '#EC4899', // Per - PUSH B
  '#14B8A6', // Cum - PULL B
  '#10B981', // Cmt - BACAK
];

const SHORT_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function DaySelector({ selectedDay, onSelect }) {
  const todayIndex = getTodayDayIndex();

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      {DAYS.map((day, i) => {
        const isSelected = day === selectedDay;
        const isToday = i === todayIndex;
        const color = DAY_COLORS[i];

        return (
          <button
            key={day}
            onClick={() => onSelect(day)}
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
            <span>{SHORT_LABELS[i]}</span>
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
