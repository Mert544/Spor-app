// claudeCoach.js — AI Coach streaming via OpenRouter backend proxy
// Routes through /api/coach/chat (API key never exposed to browser)

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
    ? 'Kullanici erkektir.'
    : gender === 'female'
    ? 'Kullanici kadin.'
    : '';

  const prLines = prs?.length
    ? `Son kisisel rekorlar:\n${prs.map(p => `- ${p.name}: ${p.weight} kg x ${p.reps} tekrar`).join('\n')}`
    : '';

  const weightLine = currentWeight
    ? `Mevcut vucut agirligi: ${currentWeight} kg${targetWeight ? ` (hedef: ${targetWeight} kg)` : ''}`
    : '';

  const workoutLine = todayDay
    ? `Bugunku antrenman: ${todayDay} - ${todayCompleted ?? 0}/${todayTotal ?? 0} egzersiz tamamlandi`
    : '';

  const mesoLine = mesocycleDuration
    ? `Mesosiklus: Hafta ${mesocycleWeek ?? currentWeek}/${mesocycleDuration}`
    : `Antrenman haftasi: ${currentWeek}`;

  const recentLine = recentWorkoutDays != null
    ? `Son 7 gunde antrenman sayisi: ${recentWorkoutDays}`
    : '';

  return `Sen V-Taper Coach'un yapay zeka antrenman kocusun. Turkce kisa, bilimsel fitness tavsiyeleri ver.

Kullanici: ${userName} ${genderLine}
Program: ${activeProgram ?? 'V-Taper'} | ${mesoLine}
${workoutLine}${recentLine ? ` | ${recentLine}` : ''}
${weightLine}${prLines ? `\n${prLines}` : ''}

Kurallar: Kisa tut (2-3 paragraf), madde listesi kullan, motivasyon ver, kaynak belirt (RP Strength, Schoenfeld 2010).`;
}

/**
 * Async generator — streams text chunks from OpenRouter backend proxy.
 * Parses OpenAI-compatible SSE streaming format.
 */
export async function* streamCoachResponse({ conversationHistory, systemPrompt }) {
  const API_PROXY_URL = '/api/coach/chat';

  const res = await fetch(API_PROXY_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      messages: conversationHistory,
      systemPrompt: systemPrompt,
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
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]' || raw === 'done') continue;
      try {
        const parsed = JSON.parse(raw);
        // OpenAI streaming format: choices[0].delta.content
        if (parsed.choices?.[0]?.delta?.content) {
          yield parsed.choices[0].delta.content;
        }
      } catch { /* malformed chunk — skip */ }
    }
  }
}