// Default timeout for API calls (30 seconds)
const DEFAULT_TIMEOUT = 30000;

export async function createSession() {
  const res = await fetch('/api/coach/session', {
    method: 'POST',
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  });
  if (!res.ok) throw new Error('Session başlatılamadı');
  const { sessionId } = await res.json();
  return sessionId;
}

export async function* sendMessage(sessionId, message, context) {
  const res = await fetch(`/api/coach/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
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
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.done) return;
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.text) yield parsed.text;
      } catch (e) {
        if (e.message !== 'Unexpected end of JSON input') throw e;
      }
    }
  }
}
