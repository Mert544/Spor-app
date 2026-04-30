// CoachPage — AI features disabled per user preference
// Compact placeholder to prevent routing errors
export default function CoachPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">
        🤖
      </div>
      <h2 className="text-lg font-bold text-white mb-2">AI Coach</h2>
      <p className="text-sm text-white/40 max-w-xs leading-relaxed">
        Bu özellik şu anda devre dışı. Antrenman takibi ve program yönetimi tüm hızıyla çalışıyor.
      </p>
    </div>
  );
}
