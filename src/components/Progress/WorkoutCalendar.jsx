import { useState } from 'react';
import useWorkoutStore from '../../store/useWorkoutStore';

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',
];

// Heatmap intensity tiers (by completed sets)
function getHeatColor(sets) {
  if (!sets || sets === 0) return null;
  if (sets <= 4)  return { bg: '#14B8A620', border: '#14B8A640', text: '#14B8A6' };
  if (sets <= 9)  return { bg: '#14B8A640', border: '#14B8A680', text: '#14B8A6' };
  if (sets <= 14) return { bg: '#14B8A660', border: '#14B8A6aa', text: '#fff' };
  if (sets <= 19) return { bg: '#14B8A690', border: '#14B8A6cc', text: '#fff' };
  return              { bg: '#14B8A6cc', border: '#14B8A6', text: '#fff' };
}

export default function WorkoutCalendar() {
  const { getDateVolumes, getStreak } = useWorkoutStore();
  const volumes = getDateVolumes(); // { "2026-04-09": 18 }
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
    cells.push({ d, dateStr, sets: volumes[dateStr] || 0, isToday: dateStr === todayStr });
  }

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const totalLogged = Object.keys(volumes).filter(d => d.startsWith(monthPrefix)).length;
  const totalSets = Object.entries(volumes)
    .filter(([d]) => d.startsWith(monthPrefix))
    .reduce((sum, [, v]) => sum + v, 0);

  // Legend tiers
  const LEGEND = [
    { label: '0', color: '#ffffff12' },
    { label: '1-4', color: '#14B8A620' },
    { label: '5-9', color: '#14B8A640' },
    { label: '10-14', color: '#14B8A660' },
    { label: '15-19', color: '#14B8A690' },
    { label: '20+', color: '#14B8A6cc' },
  ];

  return (
    <div className="space-y-3">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {streak > 0 && (
          <div className="bg-bg-card rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-accent-gold">{streak}</p>
            <p className="text-xs text-white/40 mt-0.5">gün seri</p>
          </div>
        )}
        <div className={`bg-bg-card rounded-xl p-3 text-center ${streak === 0 ? 'col-span-2' : ''}`}>
          <p className="text-xl font-bold text-accent-teal">{totalLogged}</p>
          <p className="text-xs text-white/40 mt-0.5">antrenman</p>
        </div>
        <div className="bg-bg-card rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white/70">{totalSets}</p>
          <p className="text-xs text-white/40 mt-0.5">toplam set</p>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-bg-card rounded-2xl p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 active:bg-white/10 transition-colors text-lg"
          >
            ‹
          </button>
          <p className="text-sm font-bold text-white">{MONTHS[month]} {year}</p>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            disabled={year === today.getFullYear() && month >= today.getMonth()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 active:bg-white/10 transition-colors text-lg disabled:opacity-20"
          >
            ›
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map(l => (
            <div key={l} className="text-center text-xs text-white/30 font-medium">{l}</div>
          ))}
        </div>

        {/* Heatmap cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e-${i}`} />;
            const heat = getHeatColor(cell.sets);
            return (
              <div
                key={cell.dateStr}
                className="aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  backgroundColor: heat ? heat.bg : cell.isToday ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                  color: heat ? heat.text : cell.isToday ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                  border: heat
                    ? `1px solid ${heat.border}`
                    : cell.isToday
                    ? '1px solid rgba(255,255,255,0.2)'
                    : '1px solid transparent',
                  boxShadow: heat && cell.sets >= 10 ? `0 0 6px ${heat.bg}` : 'none',
                }}
                title={cell.sets > 0 ? `${cell.sets} set` : ''}
              >
                {cell.d}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/30">Yoğunluk (set sayısı)</span>
          <div className="flex items-center gap-1">
            {LEGEND.map(l => (
              <div
                key={l.label}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: l.color }}
                title={l.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
