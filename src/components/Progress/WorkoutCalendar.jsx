import { useState } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',
];

export default function WorkoutCalendar() {
  const { getLoggedDates, getStreak } = useWorkoutStore();
  const loggedSet = new Set(getLoggedDates());
  const streak = getStreak();

  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayStr = today.toISOString().split('T')[0];

  // Monday-first offset
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ d, dateStr, logged: loggedSet.has(dateStr), isToday: dateStr === todayStr });
  }

  const totalLogged = [...loggedSet].filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length;

  return (
    <div className="space-y-3">
      {/* Streak + month summary */}
      <div className="flex gap-2">
        {streak > 0 && (
          <div className="flex-1 bg-bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-accent-gold">🔥 {streak}</p>
            <p className="text-xs text-white/40 mt-0.5">gün üst üste</p>
          </div>
        )}
        <div className="flex-1 bg-bg-card rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-accent-teal">{totalLogged}</p>
          <p className="text-xs text-white/40 mt-0.5">bu ay antrenman</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-bg-card rounded-2xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 active:bg-white/10"
          >
            ‹
          </button>
          <p className="text-sm font-bold text-white">{MONTHS[month]} {year}</p>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            disabled={year === today.getFullYear() && month >= today.getMonth()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 active:bg-white/10 disabled:opacity-20"
          >
            ›
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map(l => (
            <div key={l} className="text-center text-xs text-white/30 py-1">{l}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e-${i}`} />;
            return (
              <div
                key={cell.dateStr}
                className="aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  backgroundColor: cell.logged
                    ? '#14B8A622'
                    : cell.isToday
                    ? 'rgba(255,255,255,0.07)'
                    : 'transparent',
                  color: cell.logged
                    ? '#14B8A6'
                    : cell.isToday
                    ? 'rgba(255,255,255,0.8)'
                    : 'rgba(255,255,255,0.25)',
                  border: cell.isToday ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                  boxShadow: cell.logged ? '0 0 8px #14B8A644' : 'none',
                }}
              >
                {cell.logged ? '💪' : cell.d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
