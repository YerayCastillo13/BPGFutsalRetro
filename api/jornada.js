// GET  /api/jornada  -> datos de la jornada (público)
// POST /api/jornada  -> { user, pass, action:'login' } comprueba acceso
//                       { user, pass, data:{ n, rival, fecha, hora, lugar } } guarda la jornada
const { redis, checkAuth, sanitize, readBody, KEY } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    if (req.method === 'GET') {
      const raw = await redis('GET', KEY);
      res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=120');
      return res.status(200).end(JSON.stringify({ jornada: raw ? JSON.parse(raw) : null }));
    }
    if (req.method === 'POST') {
      const b = await readBody(req);
      const auth = await checkAuth(req, b.user, b.pass);
      if (!auth.ok) return res.status(auth.status).end(JSON.stringify({ error: auth.error }));
      if (b.action === 'login') return res.status(200).end(JSON.stringify({ ok: true }));
      const data = sanitize(b.data);
      if (!data) return res.status(400).end(JSON.stringify({ error: 'INVALID_DATA' }));
      data.updated = new Date().toISOString();
      await redis('SET', KEY, JSON.stringify(data));
      return res.status(200).end(JSON.stringify({ ok: true, jornada: data }));
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }));
  } catch (e) {
    const code = e && e.message === 'REDIS_NOT_CONFIGURED' ? 'REDIS_NOT_CONFIGURED' : 'SERVER_ERROR';
    return res.status(500).end(JSON.stringify({ error: code }));
  }
};
