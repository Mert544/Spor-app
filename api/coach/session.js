import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const agentId = process.env.AGENT_ID;
  const envId = process.env.ENV_ID;

  if (!apiKey || !agentId || !envId) {
    return res.status(500).json({ error: 'Sunucu yapılandırması eksik. Lütfen environment variables kontrol edin.' });
  }

  try {
    const client = new Anthropic({ apiKey });
    const session = await client.beta.sessions.create({
      agent_id: agentId,
      environment_id: envId,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Session oluşturma hatası:', err);
    res.status(500).json({ error: 'Session başlatılamadı', details: err.message });
  }
}
