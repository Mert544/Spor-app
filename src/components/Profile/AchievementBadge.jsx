import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS } from '../../store/useAchievementStore';

export default function AchievementBadge({ id, unlocked, progress }) {
  const ach = ACHIEVEMENTS.find((a) => a.id === id);
  if (!ach) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-2xl p-3.5 overflow-hidden transition-all duration-300 ${
        unlocked ? 'glass hover-glow' : 'opacity-40'
      }`}
      style={{
        borderColor: unlocked ? `${ach.color}40` : 'rgba(255,255,255,0.05)',
        boxShadow: unlocked ? `0 0 20px ${ach.color}15` : 'none',
      }}
    >
      {/* Progress bar background */}
      {!unlocked && progress > 0 && (
        <div
          className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: ach.color,
            opacity: 0.5,
          }}
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{
            backgroundColor: unlocked ? `${ach.color}25` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${unlocked ? ach.color + '40' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {ach.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-white/40'}`}>
            {ach.title}
          </p>
          <p className="text-xs text-white/40 truncate">{ach.description}</p>
        </div>
        {unlocked && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ backgroundColor: ach.color + '25', color: ach.color }}
          >
            ✓
          </div>
        )}
      </div>
    </motion.div>
  );
}
