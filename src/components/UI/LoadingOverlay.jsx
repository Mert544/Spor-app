import { X } from 'lucide-react';

// Loading overlay with optional cancellation
export function LoadingOverlay({
  message = 'Yükleniyor...',
  progress = null,
  onCancel = null,
  backdrop = true,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {backdrop && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      )}

      <div className="relative bg-bg-card border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        {/* Close button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
        </div>

        {/* Message */}
        <p className="text-center text-white/70 text-sm mb-2">{message}</p>

        {/* Progress bar */}
        {progress !== null && (
          <div className="space-y-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#14B8A6] transition-all duration-300"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
            <p className="text-center text-xs text-white/50">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Cancel button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full mt-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            İptal
          </button>
        )}
      </div>
    </div>
  );
}

// Smaller loading spinner for inline use
export function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-2',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`rounded-full border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin ${sizes[size] || sizes.medium}`}
      />
    </div>
  );
}

// Full page loading screen
export function PageLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-3 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
        <p className="text-xs text-white/30 tracking-widest uppercase">Yükleniyor</p>
      </div>
    </div>
  );
}
