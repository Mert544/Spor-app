// Skeleton loading components for better UX
// Provides visual placeholders while content is loading

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`bg-bg-card border border-white/10 rounded-2xl p-4 ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-white/10 rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-white/10 rounded-lg w-1/2 animate-pulse" />
        <div className="h-4 bg-white/10 rounded-lg w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

export function WorkoutCardSkeleton() {
  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-white/10 rounded-lg w-1/2 animate-pulse" />
          <div className="h-3 bg-white/10 rounded-lg w-1/3 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 bg-white/10 rounded-lg w-2/3 animate-pulse" />
            <div className="h-4 bg-white/10 rounded-lg w-12 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressChartSkeleton() {
  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-5 bg-white/10 rounded-lg w-1/3 animate-pulse" />
        <div className="h-5 bg-white/10 rounded-lg w-1/4 animate-pulse" />
      </div>
      <div className="flex items-end gap-2 h-32">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div
            key={i}
            className="flex-1 bg-white/10 rounded-t-lg animate-pulse"
            style={{ height: `${30 + Math.random() * 50}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5, itemHeight = 60 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-card border border-white/10 rounded-xl"
          style={{ height: itemHeight }}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded-lg w-1/2 animate-pulse" />
              <div className="h-3 bg-white/10 rounded-lg w-1/3 animate-pulse" />
            </div>
            <div className="w-16 h-8 rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AvatarSkeleton({ size = 'medium' }) {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };
  return (
    <div className={`${sizes[size] || sizes.medium} rounded-full bg-white/10 animate-pulse`} />
  );
}

export function TextSkeleton({ width = '1/2', lines = 2 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-white/10 rounded-lg animate-pulse ${typeof width === 'number' ? '' : width}`}
          style={typeof width === 'number' ? { width: `${width}%` } : {}}
        />
      ))}
    </div>
  );
}

export function ButtonSkeleton({ fullWidth = false }) {
  return (
    <div
      className={`h-11 bg-white/10 rounded-2xl animate-pulse ${fullWidth ? 'w-full' : 'w-32'}`}
    />
  );
}

export function InputSkeleton() {
  return (
    <div className="bg-bg-input border border-white/10 rounded-2xl px-4 py-3 h-11 animate-pulse" />
  );
}
