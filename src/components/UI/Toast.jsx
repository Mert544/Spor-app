import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

let toastId = 0;
const listeners = new Set();

function notify(message, type = 'info', duration = 3000) {
  const id = ++toastId;
  listeners.forEach((fn) => fn({ id, message, type, duration }));
}

export const toast = {
  success: (msg, dur) => notify(msg, 'success', dur),
  error: (msg, dur) => notify(msg, 'error', dur),
  info: (msg, dur) => notify(msg, 'info', dur),
};

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const COLORS = {
  success: { bg: '#14B8A615', border: '#14B8A640', text: '#14B8A6' },
  error: { bg: '#E9456015', border: '#E9456040', text: '#E94560' },
  info: { bg: '#3B82F615', border: '#3B82F640', text: '#3B82F6' },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, t.duration);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => listeners.delete(addToast);
  }, [addToast]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-auto w-full"
          >
            <div
              className="rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium glass-strong"
              style={{
                backgroundColor: COLORS[t.type].bg,
                borderColor: COLORS[t.type].border,
                color: COLORS[t.type].text,
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <span className="text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: COLORS[t.type].bg, border: `1px solid ${COLORS[t.type].border}` }}>
                {ICONS[t.type]}
              </span>
              <span className="truncate">{t.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
