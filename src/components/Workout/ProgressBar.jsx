export default function ProgressBar({ completed, total, color }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-3">
        {/* Segmented dots */}
        <div className="flex gap-1 flex-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i < completed ? color : 'rgba(255,255,255,0.08)',
                boxShadow: i < completed ? `0 0 6px ${color}66` : 'none',
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-xs font-bold flex-shrink-0 tabular-nums"
          style={{ color: completed === total && total > 0 ? color : 'rgba(255,255,255,0.4)' }}>
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}
