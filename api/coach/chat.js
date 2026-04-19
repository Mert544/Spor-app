// Vercel Serverless Function: AI Coach via Kilo Gateway (Free MiniMax M2.5)
// Uses Kilo's AI Gateway - no API key required for free models
const KILO_GATEWAY_URL = 'https://api.kilo.ai/api/gateway';

// Default fallback prompt - actual prompt comes from client with user context
const DEFAULT_SYSTEM_PROMPT = `Sen V-Taper Coach'un yapay zeka antrenman koçusun. Türkçe kısa, bilimsel fitness tavsiyeleri ver.

Kurallar:
- Kısa tut (2-3 paragraf), madde listesi kullan
- Motivasyon ver, kaynak belirt (RP Strength, Schoenfeld 2010)
- Gerçekçi ol: mucize vaddetme, bilim tabanlı konuş
- Jargon kullanabilirsin ama Türkçe açıkla
- Emoji kullanma`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array gerekli' });
  }

  // Use provided system prompt or fall back to default
  const finalSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;

  // Convert to OpenAI-compatible format
  const apiMessages = [
    { role: 'system', content: finalSystemPrompt },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content ?? m.text ?? '',
    })),
  ];

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    // Use Kilo Gateway with MiniMax M2.5 Free model (no API key needed)
    const response = await fetch(KILO_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m2.5:free',
        messages: apiMessages,
        max_tokens: 512,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Kilo Gateway error: ${response.status}`);
    }

    // Stream the response
    const reader = response.body.getReader();
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
            send({ text: parsed.choices[0].delta.content });
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }

    send({ done: true });
    res.end();
  } catch (err) {
    console.error('Coach chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Yanıt alınamadı', details: err.message });
    } else {
      send({ error: err.message });
      res.end();
    }
  }
}