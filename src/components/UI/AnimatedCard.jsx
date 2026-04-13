import { motion } from 'framer-motion';

// Animated card wrapper with smooth transitions
// Provides consistent animations throughout the app

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function AnimatedCard({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  onClick,
  hover = true,
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      transition={{ duration, delay }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated list with staggered children
export function AnimatedList({
  children,
  staggerDelay = 0.05,
  className = '',
}) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={listVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Animated fade in
export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated slide up
export function SlideUp({
  children,
  delay = 0,
  duration = 0.3,
  distance = 20,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated scale in
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Number counter animation
export function AnimatedNumber({
  value,
  duration = 1,
  formatFn = (n) => n,
  className = '',
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {formatFn(value)}
    </motion.span>
  );
}

// Progress bar animation
export function AnimatedProgress({
  value,
  max = 100,
  duration = 1,
  className = '',
  color = '#14B8A6',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// Skeleton loading with animation
export function AnimatedSkeleton({
  children,
  className = '',
  lines = 3,
}) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="h-4 bg-white/10 rounded-lg"
          style={{ width: `${50 + Math.random() * 50}%`, marginBottom: i < lines - 1 ? '8px' : '0' }}
        />
      ))}
    </div>
  );
}

// Button press animation
export function AnimatedButton({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
