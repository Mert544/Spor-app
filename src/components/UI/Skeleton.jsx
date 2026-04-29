import { motion } from 'framer-motion';

export function SkeletonLine({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div
      className={`skeleton rounded-lg ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      <SkeletonLine width="60%" height="1.25rem" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '40%' : '100%'} height="0.875rem" />
      ))}
    </motion.div>
  );
}

export function SkeletonPage() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <SkeletonLine width="50%" height="1.5rem" />
      <SkeletonCard lines={2} />
      <SkeletonCard lines={3} />
      <SkeletonCard lines={2} />
    </div>
  );
}
