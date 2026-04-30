import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAchievementStore from '../../store/useAchievementStore';

export default function AchievementUnlock() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const { unlocked } = useAchievementStore();

  // Watch for new achievements
  useEffect(() => {
    const store = useAchievementStore.getState();
    const check = () => {
      const newOnes = store.checkAchievements();
      if (newOnes.length > 0) {
        setQueue((prev) => [...prev, ...newOnes]);
      }
    };
    // Check periodically (achievement stats are updated externally)
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, []);

  // Process queue
  useEffect(() => {
    if (current || queue.length === 0) return;
    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);
    const timer = setTimeout(() => setCurrent(null), 4000);
    return () => clearTimeout(timer);
  }, [queue, current]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] w-full max-w-xs px-4"
        >
          <div
            className="rounded-2xl p-4 glass-strong gradient-border"
            style={{
              boxShadow: `0 8px 32px ${current.color}30, 0 0 60px ${current.color}15`,
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{
                  backgroundColor: `${current.color}25`,
                  border: `2px solid ${current.color}60`,
                }}
              >
                {current.emoji}
              </motion.div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: current.color }}>
                  Yeni Rozet Kazanıldı!
                </p>
                <p className="text-sm font-bold text-white">{current.title}</p>
                <p className="text-xs text-white/50">{current.description}</p>
              </div>
            </div>
            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                background: `linear-gradient(105deg, transparent 40%, ${current.color}15 50%, transparent 60%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
