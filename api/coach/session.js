// Agent API devre dışı bırakıldı - token tasarrufu için
export default async function handler(req, res) {
  return res.status(503).json({ error: 'Agent API devre dışı bırakıldı' });
}
