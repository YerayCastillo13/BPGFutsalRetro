// Utilidades compartidas de las funciones serverless (los archivos con "_" no se publican como ruta).
const crypto = require('crypto');

const KEY = 'bpg:jornada';
const REDIS_URL = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Upstash Redis por REST (sin dependencias).
async function redis(...cmd) {
  const url = REDIS_URL(), token = REDIS_TOKEN();
  if (!url || !token) throw new Error('REDIS_NOT_CONFIGURED');
  const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error('REDIS_ERROR');
  return j.result;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
function safeEq(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Comprueba usuario/clave contra variables de entorno, con límite de intentos fallidos por IP.
async function checkAuth(req, user, pass) {
  const U = process.env.ADMIN_USER, P = process.env.ADMIN_PASS;
  if (!U || !P) return { ok: false, status: 500, error: 'ADMIN_NOT_CONFIGURED' };
  const ip = String((req.headers['x-forwarded-for'] || '').split(',')[0] || (req.socket && req.socket.remoteAddress) || 'x').trim();
  const fk = 'bpg:fail:' + ip;
  let fails = 0;
  try { fails = +(await redis('GET', fk)) || 0; } catch (e) { /* sin redis: seguimos sin límite */ }
  if (fails >= 8) return { ok: false, status: 429, error: 'TOO_MANY_ATTEMPTS' };
  const good = safeEq(user || '', U) && safeEq(pass || '', P);
  if (!good) {
    try { await redis('INCR', fk); await redis('EXPIRE', fk, 900); } catch (e) { /* ignorar */ }
    await sleep(700);
    return { ok: false, status: 401, error: 'BAD_CREDENTIALS' };
  }
  try { if (fails) await redis('DEL', fk); } catch (e) { /* ignorar */ }
  return { ok: true };
}

const clean = (v, max) => String(v == null ? '' : v).replace(/<[^>]*>/g, '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);
function sanitize(d) {
  d = d || {};
  const n = parseInt(d.n, 10);
  const out = {
    n: Number.isFinite(n) ? Math.min(99, Math.max(1, n)) : null,
    rival: clean(d.rival, 40).toUpperCase(),
    fecha: clean(d.fecha, 12),
    hora: clean(d.hora, 8),
    lugar: clean(d.lugar, 50).toUpperCase(),
  };
  const seed = parseInt(d.seed, 10);
  if (Number.isFinite(seed) && seed >= 0 && seed < 1000000) out.seed = seed; // semilla del escudo (si no hay, se deriva del nombre)
  if (!out.n || !out.rival) return null;
  return out;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return {};
}

module.exports = { redis, checkAuth, sanitize, readBody, clean, KEY };
