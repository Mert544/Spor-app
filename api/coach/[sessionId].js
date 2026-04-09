import Anthropic from '@anthropic-ai/sdk';

function buildContextualMessage(message, context) {
  if (!context) return message;
  const { week, phase, dayName, completed, total, currentWeight } = context;
  const parts = [];
  if (week) parts.push(`[Hafta ${week}${phase ? `, Faz ${phase}` : ''}]`);
  if (dayName) parts.push(`${dayName}:`);
  if (completed !== undefined && total !== undefined) {
    parts.push(`${completed}/${total} egzersiz tamamlandı.`);
  }
  if (currentWeight) parts.push(`Güncel kilo: ${currentWeight} kg.`);
  if (parts.length === 0) return message;
  return `${parts.join(' ')}\n\nKullanıcı sorusu: ${message}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;
  const { message, context } = req.body || {};

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId ve message gerekli' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY eksik' });
  }

  const client = new Anthropic({ apiKey });
  const contextualMessage = buildContextualMessage(message, context);

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  function send(data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  try {
    // Stream-first: open stream before sending user event
    const stream = client.beta.sessions.events.stream(sessionId);

    // Send user message event
    await client.beta.sessions.events.send(sessionId, {
      events: [{ type: 'user.message', content: [{ type: 'text', text: contextualMessage }] }],
    });

    // Stream response events
    for await (const event of stream) {
      if (event.type === 'agent.message') {
        for (const block of (event.content || [])) {
          if (block.type === 'text' && block.text) {
            send({ text: block.text });
          }
        }
      }
      if (event.type === 'agent.message.delta') {
        const delta = event.delta;
        if (delta?.type === 'text_delta' && delta.text) {
          send({ text: delta.text });
        }
      }
      if (
        event.type === 'session.status_idle' ||
        event.type === 'session.status_terminated' ||
        event.type === 'session.completed'
      ) {
        break;
      }
    }

    send({ done: true });
    res.end();
  } catch (err) {
    console.error('Session mesaj hatası:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Mesaj gönderilemedi', details: err.message });
    } else {
      send({ error: err.message });
      res.end();
    }
  }
}
