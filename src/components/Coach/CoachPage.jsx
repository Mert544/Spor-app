import { useEffect, useRef, useState, useMemo } from 'react';
import MessageBubble from './MessageBubble';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import useAuthStore from '../../store/useAuthStore';
import { ALL_PROGRAMS, getTodayDayIndex } from '../../data/program';
import { streamCoachResponse, buildSystemPrompt } from '../../utils/claudeCoach';
import { getExerciseFormTips } from '../../utils/exerciseTips';

const QUICK_PROMPTS = [
  'Bugünkü antrenmanım nasıl gitti?',
  'Bu hafta deload yapmalı mıyım?',
  'Protein alımımı nasıl optimize edeyim?',
  'Toparlanmam için ne önerirsin?',
  'Progresyon önerisi ver',
];

// ─── Workout Analysis Card ──────────────────────────────────────────────
function WorkoutAnalysisCard({ recentWorkoutDays, completed, total, prs }) {
  const intensityScore = useMemo(() => {
    const workoutRatio = recentWorkoutDays / 7;
    const completionRatio = total > 0 ? completed / total : 0;
    return Math.round((workoutRatio * 0.6 + completionRatio * 0.4) * 100);
  }, [recentWorkoutDays, completed, total]);

  const getIntensityColor = (score) => {
    if (score >= 80) return 'text-[#10B981]';
    if (score >= 60) return 'text-[#14B8A6]';
    if (score >= 40) return 'text-[#F59E0B]';
    return 'text-[#E94560]';
  };

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Antrenman Analizi</h3>
        <span className={`text-lg font-bold ${getIntensityColor(intensityScore)}`}>{intensityScore}%</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Son 7 Gün</span>
          <span className="text-xs text-white">{recentWorkoutDays}/7 antrenman</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Bugün</span>
          <span className="text-xs text-white">{completed}/{total} tamamlandı</span>
        </div>
        {prs.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-xs text-white/50">Son PR'ler:</span>
            <div className="flex gap-2 mt-1 flex-wrap">
              {prs.slice(0, 3).map((pr, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] rounded-lg">
                  {pr.name}: {pr.weight}kg×{pr.reps}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Goal Tracking Widget ───────────────────────────────────────────────
function GoalTrackingWidget({ currentWeight, targetWeight, startWeight }) {
  const progress = useMemo(() => {
    if (!targetWeight || !startWeight) return null;
    const totalChange = Math.abs(targetWeight - startWeight);
    if (totalChange === 0) return null;
    const currentChange = Math.abs(currentWeight - startWeight);
    return Math.min(Math.round((currentChange / totalChange) * 100), 100);
  }, [currentWeight, targetWeight, startWeight]);

  const isLoss = targetWeight < startWeight;
  const isOnTrack = currentWeight && targetWeight && startWeight;

  if (!isOnTrack) return null;

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">Hedef Takibi</h3>
        <span className="text-xs text-white/60">{isLoss ? 'Yağ Yakımı' : 'Kas Kazanımı'}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: isLoss ? '#E94560' : '#14B8A6',
            }}
          />
        </div>
        <span className="text-xs font-bold text-white">{progress}%</span>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-white/40">Başlangıç: {startWeight}kg</span>
        <span className="text-xs text-white/40">Şu an: {currentWeight}kg</span>
        <span className="text-xs text-white/40">Hedef: {targetWeight}kg</span>
      </div>
    </div>
  );
}

// ─── Deload Recommendation ──────────────────────────────────────────────
function DeloadRecommendation({ recentWorkoutDays, currentWeek, onAsk }) {
  const shouldDeload = useMemo(() => {
    if (recentWorkoutDays >= 6) return { should: true, reason: 'Yüksek antrenman hacmi', urgency: 'high' };
    if (currentWeek > 0 && currentWeek % 4 === 0) return { should: true, reason: 'Periyodik deload zamanı', urgency: 'medium' };
    if (recentWorkoutDays >= 4) return { should: true, reason: 'Kümülatif yorgunluk', urgency: 'low' };
    return { should: false, reason: null, urgency: null };
  }, [recentWorkoutDays, currentWeek]);

  if (!shouldDeload.should) return null;

  const urgencyColors = {
    high: 'bg-[#E94560]/10 border-[#E94560]/30 text-[#E94560]',
    medium: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]',
    low: 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]',
  };

  return (
    <div className={`${urgencyColors[shouldDeload.urgency]} border rounded-2xl p-4 mb-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⚠️</span>
        <h3 className="text-sm font-semibold">Deload Önerisi</h3>
      </div>
      <p className="text-xs mb-3 opacity-90">{shouldDeload.reason} nedeniyle bir deload haftası düşünebilirsin.</p>
      <button
        onClick={onAsk}
        className="w-full py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors"
      >
        Koçuna Sor
      </button>
    </div>
  );
}

// ─── Progression Visualization ───────────────────────────────────────────
function ProgressionVisualization({ logs }) {
  const progressData = useMemo(() => {
    const weeklyData = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      const weekStart = d.toISOString().split('T')[0];
      weeklyData[weekStart] = { completed: 0, volume: 0 };
    }

    Object.entries(logs || {}).forEach(([date, dayLogs]) => {
      Object.entries(dayLogs).forEach(([_, exSets]) => {
        Object.values(exSets).forEach(set => {
          if (set?.done) {
            const weekKey = Object.keys(weeklyData).find(key => date >= key);
            if (weekKey) {
              weeklyData[weekKey].completed++;
              weeklyData[weekKey].volume += (set.weight || 0) * (set.reps || 0);
            }
          }
        });
      });
    });

    return Object.entries(weeklyData).map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      ...data,
    }));
  }, [logs]);

  const maxVolume = Math.max(...progressData.map(d => d.volume), 1);

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <h3 className="text-sm font-semibold text-white mb-3">Haftalık Progresyon</h3>
      <div className="flex items-end justify-between gap-2 h-16">
        {progressData.map((data, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-[#14B8A6] to-[#14B8A6]/60 rounded-t-lg transition-all duration-300"
              style={{ height: `${Math.max((data.volume / maxVolume) * 100, 5)}%` }}
            />
            <span className="text-xs text-white/40 mt-1">{data.week}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
        {progressData.slice(0, 3).map((d, i) => (
          <span key={i} className="text-xs text-white/50">{d.week}: {d.completed} set</span>
        ))}
      </div>
    </div>
  );
}

// ─── Form Tips Widget ───────────────────────────────────────────────────
function FormTipsWidget({ dayData }) {
  const [showTips, setShowTips] = useState(false);

  if (!dayData?.exercises) return null;

  const firstExercise = dayData.exercises[0];
  const tips = getExerciseFormTips(firstExercise?.name);

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <button
        onClick={() => setShowTips(!showTips)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-semibold text-white">Form İpuçları</h3>
        </div>
        <span className={`text-xs text-white/40 transition-transform ${showTips ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {showTips && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-white/60 mb-2">
            <strong>{firstExercise?.name}</strong> için form önerileri:
          </div>
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/70">
              <span className="text-[#14B8A6]">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Nutrition Calculator Widget ────────────────────────────────────────
function NutritionCalculator({ currentWeight, goal, gender, onAsk }) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [weight, setWeight] = useState(currentWeight || 80);
  const [activityLevel, setActivityLevel] = useState('moderate');

  const calculateNutrition = () => {
    // Mifflin-St Jeor Equation
    const w = weight || currentWeight || 80;
    let bmr = gender === 'male' ? (10 * w) + (178) - (5 * 25) + 5 : (10 * w) + (178) - (5 * 25) - 161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));

    let targetCalories = tdee;
    if (goal === 'fat_loss') targetCalories = tdee - 500;
    else if (goal === 'hypertrophy') targetCalories = tdee + 300;

    const protein = Math.round((targetCalories * 0.30) / 4);
    const carbs = Math.round((targetCalories * 0.45) / 4);
    const fats = Math.round((targetCalories * 0.25) / 9);

    return { tdee, targetCalories, protein, carbs, fats };
  };

  const nutrition = calculateNutrition();

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <button
        onClick={() => setShowCalculator(!showCalculator)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🍽️</span>
          <h3 className="text-sm font-semibold text-white">Beslenme Hesaplayıcı</h3>
        </div>
        <span className={`text-xs text-white/40 transition-transform ${showCalculator ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {showCalculator && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-white/50 block mb-1">Kilo (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Aktivite</label>
              <select
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="sedentary">Az Hareket</option>
                <option value="light">Hafif</option>
                <option value="moderate">Orta</option>
                <option value="active">Aktif</option>
                <option value="very_active">Çok Aktif</option>
              </select>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/50 block">TDEE</span>
                <span className="text-lg font-bold text-white">{nutrition.tdee}</span>
              </div>
              <div>
                <span className="text-white/50 block">Hedef Kalori</span>
                <span className="text-lg font-bold text-[#14B8A6]">{nutrition.targetCalories}</span>
              </div>
              <div>
                <span className="text-white/50 block">Protein</span>
                <span className="font-semibold text-[#F59E0B]">{nutrition.protein}g</span>
              </div>
              <div>
                <span className="text-white/50 block">Karb</span>
                <span className="font-semibold text-[#8B5CF6]">{nutrition.carbs}g</span>
              </div>
              <div className="col-span-2">
                <span className="text-white/50 block">Yağ</span>
                <span className="font-semibold text-[#E94560]">{nutrition.fats}g</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onAsk(`Bu makrolara göre beslenme planı oluştur: ${nutrition.protein}g protein, ${nutrition.carbs}g karb, ${nutrition.fats}g yağ`)}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#14B8A6] hover:bg-[#14B8A6]/80 transition-colors"
          >
            Koçuna Sor
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Daily Motivation Widget ─────────────────────────────────────────────
function DailyMotivation() {
  const motivations = [
    { emoji: '💪', text: 'Her tekrar, hedefine bir adım daha yaklaştırır.' },
    { emoji: '🔥', text: 'Bugün yapacağın iş, yarını belirler.' },
    { emoji: '⚡', text: 'Konsantrasyonun gücünü, tutkusu belirler.' },
    { emoji: '🎯', text: 'Hedefine odaklan, yol bulursun.' },
    { emoji: '💎', text: 'Sıkı çalışmanın altını zaman çalar.' },
    { emoji: '🚀', text: 'Gelişim, rahat alanının dışında başlar.' },
    { emoji: '🌟', text: 'Küçük adımlar, büyük değişimler yaratır.' },
    { emoji: '🏆', text: 'Başarı, tutarlılığın en iyi ödülüdür.' },
  ];

  const todayMotivation = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return motivations[dayOfYear % motivations.length];
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 border border-white/10 rounded-2xl p-4 mb-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{todayMotivation.emoji}</span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white mb-1">Günün Motivasyonu</h3>
          <p className="text-xs text-white/70">{todayMotivation.text}</p>
        </div>
      </div>
    </div>
  );
}

// ─── AI Workout Suggestion Widget ───────────────────────────────────────
function AIWorkoutSuggestion({ dayData, programData, onAsk }) {
  if (!dayData?.exercises || !programData) return null;

  const exerciseCount = dayData.exercises.length;
  const totalSets = dayData.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);

  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="text-sm font-semibold text-white">AI Antrenman Önerisi</h3>
        </div>
        <button
          onClick={() => onAsk(`Bugünkü ${programData.name} programımı analiz et ve öneriler ver`)}
          className="text-xs text-[#14B8A6] hover:text-[#14B8A6]/80"
        >
          Detaylı Analiz →
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{exerciseCount}</span>
          <span className="text-xs text-white/50 block">Egzersiz</span>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{totalSets}</span>
          <span className="text-xs text-white/50 block">Set</span>
        </div>
        <div className="flex-1">
          <button
            onClick={() => onAsk(`Bugünkü antrenman için ısınma ve soğuma önerisi ver`)}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 transition-colors text-white/70"
          >
            Isınma & Soğuma Önerisi
          </button>
        </div>
      </div>
    </div>
  );
}

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
        AI Koç, Kilo AI Gateway üzerinden ücretsiz AI modeli kullanır. API anahtarı gerekmez.
      </p>

      {/* Input */}
      <div className="w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type="text"
            value="Kilo AI - Ücretsiz"
            readOnly
            className="w-full bg-bg-card border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/60"
          />
        </div>

        <button
          onClick={() => onSave()}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-all bg-[#14B8A6] text-white"
        >
          Koçu Etkinleştir
        </button>

        <p className="text-xs text-white/30 text-center">
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
  const { activeProgram, user } = useSettingsStore();
  const { currentWeek, weights, startWeight, targetWeight } = useProgressStore();
  const { getDayProgress, logs: allLogs, getPersonalRecord } = useWorkoutStore();
  const { programs: customPrograms, getMesocycleWeek } = useCustomProgramStore();
  const { hasFeature, isPremium, subscriptionTier } = useAuthStore();

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

  // OpenRouter AI - no client-side key needed
  const [history, setHistory] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([
    { role: 'assistant', text: `Merhaba ${userName}! Antrenman, beslenme veya toparlanma hakkında sormak istedigin bir sey var mi?` },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);

  // Show widgets for first-time conversation (wrapped in useMemo to avoid TDZ)
  const showWidgets = useMemo(() => displayMessages.length <= 2, [displayMessages]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || streaming) return;
    setInput('');
    setError(null);

    // Add user message to display
    setDisplayMessages(m => [...m, { role: 'user', text: msg }]);
    // Add streaming placeholder
    setDisplayMessages(m => [...m, { role: 'assistant', text: '', streaming: true }]);
    setStreaming(true);

    // Build conversation history for API (keep last 5 turns to save tokens)
    const newHistory = [
      ...history,
      { role: 'user', content: msg },
    ].slice(-5);

    try {
      let full = '';
      for await (const chunk of streamCoachResponse({
        conversationHistory: newHistory,
        systemPrompt,
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

  // ── Main Coach UI (Free for testing) ─────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* AI badge */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <p className="text-xs text-white/30">AI Koç · Kilo Auto Free</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-2 scrollbar-hide">
        {showWidgets && (
          <div className="space-y-2 mb-4">
            <DailyMotivation />
            <DeloadRecommendation
              recentWorkoutDays={recentWorkoutDays}
              currentWeek={currentWeek}
              onAsk={() => handleSend('Bu hafta deload yapmalı mıyım?')}
            />
            <GoalTrackingWidget
              currentWeight={currentWeight}
              targetWeight={targetWeight}
              startWeight={startWeight}
            />
            <WorkoutAnalysisCard
              recentWorkoutDays={recentWorkoutDays}
              completed={completed}
              total={total}
              prs={prs}
            />
            <AIWorkoutSuggestion
              dayData={dayData}
              programData={programData}
              onAsk={handleSend}
            />
            <ProgressionVisualization logs={allLogs} />
            <FormTipsWidget dayData={dayData} />
            <NutritionCalculator
              currentWeight={currentWeight}
              goal={programData.mesocycle?.goal}
              gender={user?.gender}
              onAsk={handleSend}
            />
          </div>
        )}

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
