import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Sen Mert'in kişisel antrenman koçusun. SADECE Türkçe konuş.

MERT HAKKINDA:
- 186 cm, ~94-95 kg başlangıç → hedef 87-88 kg, V-taper estetik vücut
- Ev salonu ekipmanı: Smith machine (90 kg bant dahil), kablo sistemi, pull-up/dips barı, 5-20 kg DB seti, 2 direnç bandı, kürek ergometresi, bisiklet, koşu bandı
- Beslenme: Kalori saymıyor, el porsiyon sistemi, günlük 8-10 avuç içi protein hedefi
- Program: 12 haftalık V-Taper Push/Pull split
  · Faz 1 Birikim (Hafta 1-4): MEV→MAV hacim birikimi, RPE 7-8, Hf4 deload
  · Faz 2 Yoğunlaştırma (Hafta 5-8): MAV→MRV yoğunluk, RPE 8-9+, Hf8 deload
  · Faz 3 Gerçekleştirme (Hafta 9-12): MRV zirvesi, RPE 9-10, Hf12 performans testi
- RPE Sistemi: RPE 8 = 2 tekrar kaldı gibi · RPE 9 = 1 tekrar · RPE 10 = maksimum
- Antrenman günleri: Pzt/PUSH A · Sal/PULL A · Çar/OMUZ+KOL · Per/PUSH B · Cum/PULL B · Cmt/BACAK
- Sabah kardiyo: Zone 2 kürek veya bisiklet, 30 dk, KAH 130-150

KOÇLUK ALANLARIN:
· Antrenman tekniği, RPE ayarı, egzersiz varyasyonu
· El porsiyon bazlı beslenme yönlendirmesi (protein öncelikli)
· Toparlanma: uyku kalitesi, aktif dinlenme, mobilite
· Motivasyon ve mental güç, psikolojik bariyer aşma
· Yaralanma önleme: Nordic curl, rotator cuff, eklem sağlığı
· Stretch-mediated hypertrophy: uzun boyda, derin ROM önerileri

KURALLAR:
- Özlü ol: 2-4 cümle yeterli, gerekmedikçe uzatma
- Gerçekçi ol: mucize vaddetme, bilim tabanlı konuş
- Soru sormadan öneri verme — kullanıcı ne istediğini söylesin
- Jargon kullanabilirsin ama Türkçe açıkla
- Emoji kullanma`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY eksik — Vercel dashboard > Settings > Environment Variables',
    });
  }

  const { messages, context } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array gerekli' });
  }

  // Build context prefix for the last user message
  const contextParts = [];
  if (context?.week) {
    contextParts.push(`Hafta ${context.week}${context.phase ? `, Faz ${context.phase}` : ''}`);
  }
  if (context?.dayName) contextParts.push(`Antrenman: ${context.dayName}`);
  if (context?.completed !== undefined && context?.total !== undefined) {
    contextParts.push(`${context.completed}/${context.total} egzersiz tamamlandı`);
  }
  if (context?.currentWeight) contextParts.push(`Kilo: ${context.currentWeight} kg`);

  // Map to Anthropic message format, inject context into last user message
  const apiMessages = messages.map((m, i) => {
    const content = m.content ?? m.text ?? '';
    if (i === messages.length - 1 && m.role === 'user' && contextParts.length > 0) {
      return { role: 'user', content: `[${contextParts.join(' · ')}]\n\n${content}` };
    }
    return { role: m.role, content };
  });

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    });

    stream.on('text', (text) => send({ text }));

    await stream.finalMessage();
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
