import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import { ALL_PROGRAMS, getTodayDayIndex } from '../../data/program';
import { createSession, sendMessage } from '../../utils/api';

const QUICK_PROMPTS = [
  'Bugünkü antrenmanim nasıl?',
  'Beslenme önerisi ver',
  'Toparlanma için ne yapmalıyım?',
  'Motivasyonumu artır 💪',
];

export default function CoachPage() {
  const { coachSessionId, setCoachSessionId, activeProgram, user } = useSettingsStore();
  const { currentWeek, getTodayWeight } = useProgressStore();
  const { getDayProgress } = useWorkoutStore();

  const userName = user?.name || 'Sporcu';

  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Merhaba ${userName}! 💪 Bugün nasıl hissediyorsun? Antrenman, beslenme veya toparlanma hakkında sormak istediğin bir şey var mı?` },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [sessionReady, setSessionReady] = useState(!!coachSessionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSessionReady(!!coachSessionId);
  }, [coachSessionId]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Build workout context from current program
  const resolvedProgram = (activeProgram && ALL_PROGRAMS[activeProgram]) ? activeProgram : 'vtaper_orta';
  const programData = ALL_PROGRAMS[resolvedProgram];
  const todayIndex = getTodayDayIndex();
  const safeIndex = Math.min(todayIndex, programData.days.length - 1);
  const dayKey = programData.days[safeIndex];
  const dayData = programData.program[dayKey];
  const today = new Date().toISOString().split('T')[0];
  const { completed, total } = dayData ? getDayProgress(today, dayData.exercises) : { completed: 0, total: 0 };
  const currentWeight = getTodayWeight();

  useEffect(() => {
    if (!coachSessionId) {
      createSession()
        .then(id => { setCoachSessionId(id); })
        .catch(e => {
          console.error(e);
          setError('AI Koç bu sürümde aktif değil. Uygulamayı kendi sunucuna deploy edip Anthropic API anahtarı eklemen gerekiyor.');
        });
    }
  }, [coachSessionId, setCoachSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || streaming || !sessionReady) return;
    setInput('');
    setError(null);

    setMessages(m => [...m, { role: 'user', text: msg }]);
    setMessages(m => [...m, { role: 'assistant', text: '', streaming: true }]);
    setStreaming(true);

    const context = {
      week: currentWeek,
      dayName: dayKey,
      completed,
      total,
      currentWeight,
    };

    try {
      let full = '';
      for await (const chunk of sendMessage(coachSessionId, msg, context)) {
        full += chunk;
        setMessages(m => {
          const next = [...m];
          next[next.length - 1] = { role: 'assistant', text: full, streaming: true };
          return next;
        });
      }
      setMessages(m => {
        const next = [...m];
        next[next.length - 1] = { role: 'assistant', text: full, streaming: false };
        return next;
      });
    } catch (e) {
      setError('Mesaj gönderilemedi. Tekrar dene.');
      setMessages(m => m.slice(0, -1)); // remove empty assistant bubble
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scrollbar-hide">
        {/* Session status */}
        {!sessionReady && !error && (
          <div className="text-center text-white/30 text-xs py-2 mb-2">Koç bağlanıyor...</div>
        )}
        {error && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl px-4 py-3 mb-3 text-sm text-accent-red text-center">
            {error}
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} streaming={m.streaming} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={!sessionReady || streaming}
              className="flex-shrink-0 text-xs px-3 py-2 rounded-full bg-bg-card border border-white/10 text-white/70 hover:border-accent-teal/50 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-safe py-2 border-t border-white/5">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Koçuna sor..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            disabled={!sessionReady || streaming}
            className="flex-1 bg-bg-card border border-white/10 rounded-2xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-accent-teal/50 max-h-28 overflow-y-auto scrollbar-hide"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || !sessionReady || streaming}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0"
            style={{ backgroundColor: (!input.trim() || !sessionReady || streaming) ? '#1e293b' : '#E94560' }}
          >
            <span className="text-white text-lg">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
}
