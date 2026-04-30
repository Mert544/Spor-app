import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  onClick,
}) {
  const base = 'rounded-2xl overflow-hidden';
  const glass = 'glass';
  const hoverFx = hover ? 'hover-glow' : '';
  const press = onClick ? 'btn-press cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`${base} ${glass} ${hoverFx} ${press} ${className}`}
      style={{
        boxShadow: glow ? '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' : undefined,
      }}
      onClick={onClick}
    >
      {gradient && <div className="h-0.5 w-full bg-gradient-to-r from-[#14B8A6] via-[#3B82F6] to-[#EC4899] opacity-60" />}
      {children}
    </motion.div>
  );
}
