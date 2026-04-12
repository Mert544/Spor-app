// claudeCoach.js — Direct browser → Anthropic API streaming for the AI Coach
// Uses the Messages API with SSE (no backend required — API key stored locally)

const MODEL = 'claude-opus-4-6';
const API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Build a personalized Turkish fitness coach system prompt from user context.
 */
export function buildSystemPrompt(ctx) {
  const {
    userName = 'Sporcu',
    gender,
    activeProgram,
    todayDay,
    todayCompleted,
    todayTotal,
    currentWeek,
    mesocycleWeek,
    mesocycleDuration,
    recentWorkoutDays,
    prs,
    currentWeight,
    targetWeight,
    startWeight,
  } = ctx;

  const genderLine = gender === 'male'
    ? 'Kullanıcı erkektir.'
    : gender === 'female'
    ? 'Kullanıcı kadındır.'
    : '';

  const prLines = prs?.length
    ? `Son kişisel rekorlar:\n${prs.map(p => `- ${p.name}: ${p.weight} kg × ${p.reps} tekrar`).join('\n')}`
    : '';

  const weightLine = currentWeight
    ? `Mevcut vücut ağırlığı: ${currentWeight} kg${targetWeight ? ` (hedef: ${targetWeight} kg)` : ''}`
    : '';

  const workoutLine = todayDay
    ? `Bugünkü antrenman: ${todayDay} — ${todayCompleted ?? 0}/${todayTotal ?? 0} egzersiz tamamlandı`
    : '';

  const mesoLine = mesocycleDuration
    ? `Mesosiklus: Hafta ${mesocycleWeek ?? currentWeek}/${mesocycleDuration}`
    : `Antrenman haftası: ${currentWeek}`;

  const recentLine = recentWorkoutDays != null
    ? `Son 7 günde antrenman sayısı: ${recentWorkoutDays}`
    : '';

  return `Sen V-Taper Coach'un yapay zeka antrenman koçusun. Kullanıcıya Türkçe olarak kısa, net ve bilimsel tabanlı fitness tavsiyeleri veriyorsun.

Uzmanlık alanların:
- Hipertrofi periodizasyonu (RP Strength, MEV/MAV/MRV çerçevesi)
- Günlük dalgalanan periodizasyon (DUP — Zourdos 2016)
- RPE/RIR tabanlı yük yönetimi (Helms 2016)
- Deload ve toparlanma planlama (Israetel & Hoffman)
- Beslenme: protein sentezi penceresi, kalori fazlası/açığı, makro dağılımı
- Uyku, stres, kortizol — antrenman uyumuna etkileri

Kullanıcı bilgileri:
İsim: ${userName}
${genderLine}
Aktif program: ${activeProgram ?? 'V-Taper'}
${workoutLine}
${mesoLine}
${recentLine}
${weightLine}
${prLines}

Yanıt tarzı:
- Her zaman Türkçe konuş
- Kısa tut (2-4 paragraf), bilimsel ama erişilebilir
- Gerektiğinde madde listesi kullan
- Motivasyon ver ama abartma — gerçekçi ol
- Kullanıcının adını ara sıra kullan (her mesajda değil)
- Kaynak belirtmek istersen kısaca "(RP Strength)" veya "(Schoenfeld 2010)" gibi parantez içinde ver`;
}

/**
 * Async generator — streams text chunks from Anthropic Claude.
 * Throws on API errors (bad key, rate limit, etc.)
 */
export async function* streamCoachResponse({ conversationHistory, systemPrompt, apiKey }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages: conversationHistory,
    }),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.error?.message || message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        if (
          parsed.type === 'content_block_delta' &&
          parsed.delta?.type === 'text_delta' &&
          parsed.delta.text
        ) {
          yield parsed.delta.text;
        }
      } catch { /* malformed chunk — skip */ }
    }
  }
}
