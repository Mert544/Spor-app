import { useEffect, useRef, useState, useMemo } from 'react';
import MessageBubble from './MessageBubble';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS, getTodayDayIndex } from '../../data/program';
import { streamCoachResponse, buildSystemPrompt } from '../../utils/claudeCoach';

const QUICK_PROMPTS = [
  'Bugünkü antrenmanım nasıl gitti?',
  'Bu hafta deload yapmalı mıyım?',
  'Protein alımımı nasıl optimize edeyim?',
  'Toparlanmam için ne önerirsin?',
  'Progresyon önerisi ver',
];

// ─── API Key Setup Screen ────────────────────────────────────────────────────
function SetupScreen({ onSave }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center mb-5 text-3xl">
        🤖
      </div>
      <h2 className="text-lg font-bold text-white mb-2 text-center">AI Koç'u Etkinleştir</h2>
      <p className="text-xs text-white/40 text-center mb-6 leading-relaxed max-w-xs">
        AI Koç, Anthropic'in Claude modelini kullanır. API anahtarın yalnızca bu cihazda saklanır,
        hiçbir sunucuya gönderilmez.
      </p>

      {/* Input */}
      <div className="w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-bg-card border border-white/10 rounded-2xl px-4 py-3 text-sm text-white
                       placeholder:text-white/25 focus:outline-none focus:border-[#14B8A6]/50 pr-12"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs px-1 py-0.5"
          >
            {show ? 'Gizle' : 'Göster'}
          </button>
        </div>

        <button
          onClick={() => key.trim().startsWith('sk-ant-') && onSave(key.trim())}
          disabled={!key.trim().startsWith('sk-ant-')}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-all"
          style={{
            backgroundColor: key.trim().startsWith('sk-ant-') ? '#14B8A6' : '#1e293b',
            color: key.trim().startsWith('sk-ant-') ? '#fff' : 'rgba(255,255,255,0.25)',
          }}
        >
          Koçu Etkinleştir
        </button>

        <p className="text-xs text-white/25 text-center">
          API anahtarını{' '}
          <span className="text-[#14B8A6]/70">console.anthropic.com</span>
          {' '}adresinden alabilirsin.
        </p>
      </div>
    </div>
  );
}

// ─── Main Coach Page ──────────────────────────────────────────────────────────
export default function CoachPage() {
  const { anthropicApiKey, setAnthropicApiKey, activeProgram, user } = useSettingsStore();
  const { currentWeek, weights, startWeight, targetWeight } = useProgressStore();
  const { getDayProgress, logs: allLogs, getPersonalRecord } = useWorkoutStore();
  const { programs: customPrograms, getMesocycleWeek } = useCustomProgramStore();

  const userName = user?.name || 'Sporcu';

  // Resolve program data
  const isCustom = activeProgram?.startsWith('custom_');
  const programData = isCustom
    ? (customPrograms[activeProgram] || ALL_PROGRAMS['vtaper_orta'])
    : (ALL_PROGRAMS[activeProgram] || ALL_PROGRAMS['vtaper_orta']);

  const todayIndex = getTodayDayIndex();
  const safeIndex = Math.min(todayIndex, (programData.days?.length ?? 1) - 1);
  const dayKey = programData.days?.[safeIndex];
  const dayData = programData.program?.[dayKey];
  const today = new Date().toISOString().split('T')[0];
  const { completed, total } = dayData ? getDayProgress(today, dayData.exercises) : { completed: 0, total: 0 };

  // Current weight
  const currentWeight = (() => {
    const entries = Object.entries(weights || {}).sort(([a], [b]) => b.localeCompare(a));
    return entries[0]?.[1] ?? null;
  })();

  // Recent workout count (last 7 days)
  const recentWorkoutDays = useMemo(() => {
    let count = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const dl = allLogs[ds];
      if (dl && Object.values(dl).some(ex => Object.values(ex).some(s => s?.done))) count++;
    }
    return count;
  }, [allLogs]);

  // Top PRs
  const prs = useMemo(() => {
    if (!dayData?.exercises) return [];
    return dayData.exercises
      .slice(0, 4)
      .map(ex => {
        const pr = getPersonalRecord(ex.id);
        return pr ? { name: ex.name, weight: pr.weight, reps: pr.reps } : null;
      })
      .filter(Boolean);
  }, [dayData, getPersonalRecord]);

  // System prompt (stable per render session)
  const systemPrompt = useMemo(() => buildSystemPrompt({
    userName,
    gender: user?.gender,
    activeProgram: programData.name,
    todayDay: dayKey,
    todayCompleted: completed,
    todayTotal: total,
    currentWeek,
    mesocycleWeek: isCustom ? getMesocycleWeek(activeProgram) : undefined,
    mesocycleDuration: programData.mesocycle?.durationWeeks,
    recentWorkoutDays,
    prs,
    currentWeight,
    targetWeight,
    startWeight,
  }), [userName]); // eslint-disable-line — intentionally stable per mount

  // Conversation state — stored as Anthropic message format
  const [history, setHistory] = useState([]); // { role: 'user'|'assistant', content: string }[]
  const [displayMessages, setDisplayMessages] = useState([
    { role: 'assistant', text: `Merhaba ${userName}! 💪 Antrenman, beslenme veya toparlanma hakkında sormak istediğin bir şey var mı?` },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  function saveKey(key) {
    setAnthropicApiKey(key);
  }

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || streaming || !anthropicApiKey) return;
    setInput('');
    setError(null);

    // Add user message to display
    setDisplayMessages(m => [...m, { role: 'user', text: msg }]);
    // Add streaming placeholder
    setDisplayMessages(m => [...m, { role: 'assistant', text: '', streaming: true }]);
    setStreaming(true);

    // Build conversation history for API (keep last 20 turns to manage tokens)
    const newHistory = [
      ...history,
      { role: 'user', content: msg },
    ].slice(-20);

    try {
      let full = '';
      for await (const chunk of streamCoachResponse({
        conversationHistory: newHistory,
        systemPrompt,
        apiKey: anthropicApiKey,
      })) {
        full += chunk;
        setDisplayMessages(m => {
          const next = [...m];
          next[next.length - 1] = { role: 'assistant', text: full, streaming: true };
          return next;
        });
      }

      // Finalize
      setDisplayMessages(m => {
        const next = [...m];
        next[next.length - 1] = { role: 'assistant', text: full, streaming: false };
        return next;
      });

      // Persist to conversation history
      setHistory([...newHistory, { role: 'assistant', content: full }]);

    } catch (e) {
      setError(e.message || 'Mesaj gönderilemedi. Tekrar dene.');
      setDisplayMessages(m => m.slice(0, -1)); // remove empty placeholder
    } finally {
      setStreaming(false);
    }
  }

  // ── No API key → setup screen ──────────────────────────────────────────────
  if (!anthropicApiKey) {
    return (
      <div className="flex flex-col h-full">
        <SetupScreen onSave={saveKey} />
      </div>
    );
  }

  // ── Chat UI ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* API key badge */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <p className="text-xs text-white/25">AI Koç · claude-opus-4-6</p>
        <button
          onClick={() => setAnthropicApiKey('')}
          className="text-xs text-white/20 hover:text-accent-red transition-colors"
        >
          Anahtarı Sil
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-2 scrollbar-hide">
        {error && (
          <div className="bg-[#E94560]/10 border border-[#E94560]/30 rounded-xl px-4 py-3 mb-3 text-xs text-[#E94560] text-center">
            {error}
          </div>
        )}

        {displayMessages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} streaming={m.streaming} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — only when fresh conversation */}
      {displayMessages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={streaming}
              className="flex-shrink-0 text-xs px-3 py-2 rounded-full bg-bg-card border border-white/10 text-white/60
                         hover:border-[#14B8A6]/40 active:bg-white/5 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2 border-t border-white/5 shrink-0">
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
            disabled={streaming}
            className="flex-1 bg-bg-card border border-white/10 rounded-2xl px-4 py-3 text-sm text-white
                       resize-none focus:outline-none focus:border-[#14B8A6]/50 max-h-28 overflow-y-auto scrollbar-hide"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || streaming}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0"
            style={{
              backgroundColor: (!input.trim() || streaming) ? '#1e293b' : '#14B8A6',
            }}
          >
            {streaming
              ? <span className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              : <span className="text-white text-lg leading-none">↑</span>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
