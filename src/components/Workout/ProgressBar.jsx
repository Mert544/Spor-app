export default function ProgressBar({ completed, total, color }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="px-4 py-2">
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>{completed}/{total} egzersiz</span>
        <span>%{pct}</span>
      </div>
      <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color || '#E94560' }}
        />
      </div>
    </div>
  );
}
