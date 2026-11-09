'use strict';
(() => {
// ================== CONSTANTES ==================
const VW = 270, VH = 480;
const P = { l: 14, r: 256, t: 34, b: 446 };        // límites de la pista
const CX = 135, CY = 240;
const GW = 64, GX1 = CX - GW / 2, GX2 = CX + GW / 2; // portería
const BR = 3.6;                                    // radio balón
const BASE_SPD = 60;

// Plantilla completa. "gk" = alcance si juega de portero. Edita aquí rasgos y looks.
const ROSTER = [
  { num: 27, name: 'ANCIO',     look: 'cap',     short: 'Portero gato',      trait: 'Reflejos felinos bajo palos. El mejor portero.',
    spd: .95, shot: 1.0, ctrl: 1.0, tackle: 1.0, pass: 1.1, gk: 1.6 },
  { num: 3,  name: 'TORRY',     look: 'beard',   short: 'Muro defensivo',    trait: 'Corta todo lo que pasa por su zona.',
    spd: .95, shot: .95, ctrl: 1.05, tackle: 1.65, pass: 1.05, gk: 1.15 },
  { num: 4,  name: 'NACH',      look: 'glasses', short: 'Pase de tiralíneas', trait: 'Ve pases que nadie más ve. Pase rápido y preciso.',
    spd: 1.0, shot: 1.0, ctrl: 1.15, tackle: 1.3, pass: 1.45, gk: 1.1 },
  { num: 5,  name: 'JESUS',     look: 'buzz',    short: 'Ancla',             trait: 'Siempre bien colocado. Entradas de acero.',
    spd: 1.0, shot: 1.05, ctrl: 1.1, tackle: 1.55, pass: 1.25, gk: 1.15 },
  { num: 6,  name: 'ZARATE',    look: 'stache',  short: 'Pulmón infinito',   trait: 'Corre todo el partido. Su sprint se recarga rápido.',
    spd: 1.18, shot: 1.0, ctrl: 1.0, tackle: 1.3, pass: 1.05, gk: 1.1, dashCd: .5 },
  { num: 7,  name: 'ROMERO JR', look: 'band',    short: 'Turbo',             trait: 'El pato más rápido de Fuenla.',
    spd: 1.32, shot: .95, ctrl: .95, tackle: 1.0, pass: 1.0, gk: 1.05, dashCd: .4 },
  { num: 8,  name: 'ALES',      look: 'curl',    short: 'Regateador',        trait: 'Cintura de goma: casi imposible quitarle el balón.',
    spd: 1.1, shot: 1.0, ctrl: 1.6, tackle: .95, pass: 1.1, gk: 1.05 },
  { num: 9,  name: 'JOSE',      look: 'mohawk',  short: 'Tiro de fuego',     trait: 'Cargado al máximo, el balón sale en llamas.',
    spd: .95, shot: 1.45, ctrl: 1.05, tackle: 1.0, pass: .95, gk: 1.05, fire: true },
  { num: 10, name: 'ROMERO',    look: 'shades',  short: 'Capitán · El mago', trait: 'El capitán. Regate y tiros con efecto que se cuelan.',
    spd: 1.05, shot: 1.05, ctrl: 1.8, tackle: .9, pass: 1.15, gk: 1.05, curve: true, captain: true },
  { num: 13, name: 'YERAY',     look: 'bandana', short: 'Todoterreno',       trait: 'Llega a todo: ataca, defiende y tira bien.',
    spd: 1.12, shot: 1.15, ctrl: 1.2, tackle: 1.2, pass: 1.15, gk: 1.15 },
  { num: 14, name: 'MIGU',      look: 'afro',    short: 'Killer del área',   trait: 'Rápido y con tiro seco cerca de portería.',
    spd: 1.1, shot: 1.3, ctrl: 1.1, tackle: .95, pass: 1.0, gk: 1.05 },
  { num: 19, name: 'PATO',      look: 'crown',   short: 'El pato original',  trait: 'Sus tiros llevan un ¡CUAC! que asusta al portero.',
    spd: 1.05, shot: 1.2, ctrl: 1.25, tackle: 1.0, pass: 1.05, gk: 1.1, quack: true },
  { num: 23, name: 'ORMEÑO',    look: 'wrist',   short: 'La torre',          trait: 'Corpulento: gana los choques y protege el balón.',
    spd: .92, shot: 1.2, ctrl: 1.3, tackle: 1.45, pass: 1.0, gk: 1.3, big: true },
  // ---- CANTERA: mini patos (más pequeños, rápidos y con mucha ilusión) ----
  { num: 30, name: 'HUGO',      look: 'spiky',    mini: true, short: 'Torbellino',      trait: 'Pequeño huracán de pelo en pico: no para ni un segundo.',
    spd: 1.28, shot: .85, ctrl: 1.1, tackle: .85, pass: .95, gk: .85 },
  { num: 31, name: 'LUCAS',     look: 'beanie',   mini: true, short: 'Cabeza fría',     trait: 'Con su gorro de lana nunca pierde la calma. Pases certeros.',
    spd: 1.1, shot: .95, ctrl: 1.1, tackle: .95, pass: 1.3, gk: .9 },
  { num: 32, name: 'MARIO',     look: 'mcap',     mini: true, short: 'Saltarín',        trait: 'Gorra roja y piernas de muelle: llega a todos los balones.',
    spd: 1.2, shot: .95, ctrl: 1.05, tackle: 1.1, pass: 1.0, gk: .95 },
  { num: 33, name: 'MIA',       look: 'bow',      mini: true, short: 'Estrellita',      trait: 'Regatea a todos con su lazo rosa. Casi no se le quita el balón.',
    spd: 1.1, shot: .9, ctrl: 1.45, tackle: .85, pass: 1.1, gk: .85 },
  { num: 34, name: 'SOFIA', full: 'SOFÍA', look: 'pigtails', mini: true, short: 'Rayo',            trait: 'Dos coletas al viento y un sprint que no se acaba.',
    spd: 1.3, shot: .9, ctrl: 1.05, tackle: .9, pass: 1.0, gk: .85, dashCd: .5 },
  { num: 35, name: 'SOFIA G.', full: 'SOFÍA G.',look: 'ponytail', mini: true, short: 'Cañoncito',       trait: 'Pega como una mayor: tiros secos desde donde sea.',
    spd: 1.05, shot: 1.25, ctrl: 1.0, tackle: .9, pass: .95, gk: .9 },
];
const SLOTS = ['gk', 'def', 'wl', 'wr', 'piv'];
const SLOT_LBL = ['POR', 'CIE', 'ALA', 'ALA', 'PÍV'];
const DEFAULT_LINEUP = [27, 5, 7, 10, 9];
const DEFAULT_LINEUP2 = [23, 3, 6, 8, 14]; // quinteto por defecto del jugador 2
const byNum = n => ROSTER.find(r => r.num === n);
let SQUAD = [];
const RIVAL = [
  { num: 1,  name: 'PORTERO', role: 'gk',  look: 'gk', spd: .95, shot: 1, ctrl: 1, tackle: 1, pass: 1, reach: 1.05 },
  { num: 4,  name: 'CIERRE',  role: 'def', spd: 1.0, shot: 1, ctrl: 1, tackle: 1.2, pass: 1 },
  { num: 8,  name: 'ALA',     role: 'wl',  spd: 1.08, shot: 1, ctrl: 1, tackle: 1, pass: 1 },
  { num: 11, name: 'ALA',     role: 'wr',  spd: 1.05, shot: 1, ctrl: 1.1, tackle: 1, pass: 1 },
  { num: 9,  name: 'PÍVOT',   role: 'piv', spd: 1.0, shot: 1.15, ctrl: 1, tackle: 1, pass: 1 },
];
const HOME = { gk: [CX, 434], def: [CX, 378], wl: [64, 326], wr: [206, 326], piv: [CX, 272] };
const RV = { hud: 'UNI', saca: 'UNIÓN', gol: 'UNIÓN FS', me: 'BPG' }; // nombres de cada lado (se actualizan con el modo / la jornada)
const DIFFS = {
  // react: probabilidad/seg de que la IA tome decisiones (tirar/pasar) — más bajo = más tiempo para ti
  easy:   { spd: .74, tackle: .3,  gk: .8,  shoot: .75, react: .55 },
  normal: { spd: .84, tackle: .55, gk: .92, shoot: .88, react: .75 },
  hard:   { spd: .95, tackle: .9,  gk: 1.05, shoot: 1.0, react: 1.0 },
  versus: { spd: 1, tackle: 1, gk: 1, shoot: 1, react: 1 }, // 2 jugadores: nadie tiene ventaja
};

// ================== UTILIDADES ==================
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const hyp = Math.hypot;
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const dist = (a, b) => hyp(a.x - b.x, a.y - b.y);
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
  return hyp(px - (ax + dx * t), py - (ay + dy * t));
}
function vib(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

// ================== AUDIO (chiptune) ==================
const S = { ctx: null, on: store.get('bpg_sound', true) };
function audio() {
  if (!S.ctx) { try { S.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (S.ctx && S.ctx.state === 'suspended') S.ctx.resume();
}
function tone(f, d, type = 'square', v = .06, f2 = 0, at = 0) {
  const c = S.ctx; if (!c || !S.on) return;
  const t0 = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
  g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + d + .02);
}
function noise(d, v = .08, at = 0) {
  const c = S.ctx; if (!c || !S.on) return;
  const n = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, n, c.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = c.createBufferSource(), g = c.createGain(); s.buffer = buf; g.gain.value = v;
  s.connect(g).connect(c.destination); s.start(c.currentTime + at);
}
const sfx = {
  kick(p = .5) { tone(200 + p * 80, .09, 'square', .07, 70); noise(.05, .06 + p * .06); },
  pass() { tone(330, .06, 'square', .05, 200); noise(.03, .04); },
  whistle(n = 1) { for (let i = 0; i < n; i++) { tone(2500, .22, 'sine', .05, 0, i * .3); tone(2640, .22, 'sine', .05, 0, i * .3); } },
  goal() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, .12, 'square', .06, 0, i * .09)); sfx.quack(.7); },
  quack(at = 0) { tone(560, .13, 'sawtooth', .07, 280, at); tone(540, .15, 'sawtooth', .07, 250, at + .17); },
  steal() { tone(440, .07, 'square', .05, 900); },
  bounce() { tone(170, .04, 'triangle', .07); },
  post() { tone(950, .18, 'triangle', .09, 620); },
  save() { tone(300, .1, 'square', .06, 120); noise(.08, .08); },
  dash() { noise(.06, .04); tone(240, .06, 'triangle', .04, 480); },
};

// En online, el anfitrión reenvía sus efectos de sonido al invitado (los internos de otro efecto y el "gol" no).
(() => {
  let inside = false;
  for (const k of Object.keys(sfx)) {
    const f = sfx[k];
    sfx[k] = (...a) => {
      const fwd = !inside && k !== 'goal' && NET.role === 'host' && NET.live;
      const was = inside; inside = true;
      try { f(...a); } finally { inside = was; }
      if (fwd) NET.ev.push(['s', k, a]);
    };
  }
})();

// ================== ESTADO ==================
const G = {
  state: 'menu', mode: 'quick', flip: false, hum: [true, false], u: [null, null], players: [], ball: null, score: [0, 0], time: 120, dur: 120,
  diffKey: 'normal', diff: DIFFS.normal, timer: 0, shake: 0, particles: [],
  scorers: [], scorers1: [], switchCd: [0, 0], crowdJump: 0, t: 0, chaser: [null, null], cover: [null, null], prevState: null,
};
const mkInput = () => ({ x: 0, y: 0, tx: 0, ty: 0, touch: false, aDown: false, aHeld: false, bDown: false });
const inputs = [mkInput(), mkInput()];                    // [P1, P2]
const isUser = p => G.hum[p.team] && G.u[p.team] === p;   // ¿lo maneja un humano ahora mismo?
const twoHum = () => G.mode === 'versus' || G.mode === 'online';   // modos con dos humanos (mismo móvil u online)
// Estado de la partida online (ver el módulo ONLINE al final)
const NET = { role: null, peer: null, conn: null, live: false, inMatch: false, code: '', ev: [], seq: 0, rtt: 0, buf: [], remoteLu: null, hostLu: null,
  an: 0, bn: 0, anSeen: 0, bnSeen: 0, lastRx: 0, lastTx: 0, lastPing: 0, lastBadge: 0, rm: false, timer: 0, joinCode: null };

// ================== ENTIDADES ==================
function newP(d, team) {
  const h = HOME[d.role];
  const hx = team ? VW - h[0] : h[0], hy = team ? VH - h[1] : h[1];
  return Object.assign({}, d, {
    team, hx, hy, x: hx, y: hy, vx: 0, vy: 0, tvx: 0, tvy: 0, fx: 0, fy: team ? 1 : -1,
    r: (d.role === 'gk' ? 9 : 8) + (d.big ? 1 : 0) - (d.mini ? 1.5 : 0), stun: 0, dash: 0, dashT: 0, dashHit: false, anim: rnd(6),
    holdT: 0, charge: 0, charging: false, react: 0, reach: d.role === 'gk' ? (d.reach || d.gk || 1) : 1, dashCdBase: d.dashCd || .75,
  });
}
function newBall() {
  return { x: CX, y: CY, vx: 0, vy: 0, owner: null, noTouch: 0, lastTouch: null, shooter: null,
    passTarget: null, curve: 0, fire: false, protect: 0, spin: 0, trail: [] };
}
const team = t => G.players.filter(p => p.team === t);

function maxSpd(p) {
  let s = BASE_SPD * p.spd;
  if (p.team === 1) s *= G.diff.spd;
  if (G.ball.owner === p) s *= .88;
  if (p.charging) s *= .55;
  if (p.dash > 0) s *= 1.9;
  if (p.stun > 0) s *= .3;
  return s;
}
function seek(p, x, y, m = 1) {
  const dx = x - p.x, dy = y - p.y, d = hyp(dx, dy);
  if (d < 1) { p.tvx = p.tvy = 0; return; }
  const s = maxSpd(p) * m * Math.min(1, d / 22);
  p.tvx = dx / d * s; p.tvy = dy / d * s;
}

// ================== FLUJO DE PARTIDO ==================
const ARC_TIME = 60, ARC_BONUS = 5;
const needIdx = mode => mode === 'arcade' ? [0, 2, 4] : [0, 1, 2, 3, 4]; // huecos del quinteto que juegan (arcade es 3 vs 3)
const lgDiff = s => ({ spd: .74 + .21 * s, tackle: .3 + .6 * s, gk: .8 + .25 * s, shoot: .75 + .25 * s, react: .55 + .45 * s });
const arcDiff = n => ({ spd: Math.min(.98, .76 + n * .02), tackle: Math.min(.95, .35 + n * .04), gk: Math.min(1.05, .82 + n * .02),
  shoot: Math.min(1, .8 + n * .02), react: Math.min(1, .6 + n * .03) });
function setRV(hud, saca, gol, me = 'BPG') {
  RV.hud = hud; RV.saca = saca; RV.gol = gol; RV.me = me;
  $('#hudRival').textContent = hud; $('#hudMe').textContent = me;
}
function startMatch() {
  audio();
  const mode = M.mode, vs = mode === 'versus', onl = mode === 'online', idx = needIdx(mode);
  if (idx.some(i => lineups[0][i] == null) || (vs && lineups[1].some(n => n == null))) return;
  if (onl && (!NET.live || NET.role !== 'host' || !NET.remoteLu)) return;
  const withRole = (lu, i) => Object.assign({}, byNum(lu[i]), { role: SLOTS[i] });
  SQUAD = idx.map(i => withRole(lineups[0], i));
  const away = vs ? [0, 1, 2, 3, 4].map(i => withRole(lineups[1], i))
    : onl ? [0, 1, 2, 3, 4].map(i => withRole(NET.remoteLu, i))
    : RIVAL.filter(d => mode !== 'arcade' || ['gk', 'def', 'piv'].includes(d.role));
  G.mode = mode; G.hum = [true, vs || onl]; G.flip = false;
  G.players = [...SQUAD.map(d => newP(d, 0)), ...away.map(d => newP(d, 1))];
  G.ball = newBall();
  G.score = [0, 0]; G.scorers = []; G.scorers1 = []; G.particles = []; G.switchCd = [0, 0];
  G.dur = G.time = mode === 'arcade' ? ARC_TIME : +store.get('bpg_dur', 120);
  if (mode === 'quick') { G.diffKey = store.get('bpg_diff', 'normal'); G.diff = DIFFS[G.diffKey] || DIFFS.normal; rvFromJornada(); }
  else if (vs) { G.diff = DIFFS.versus; setRV('P2', 'P2', 'P2', 'P1'); }
  else if (onl) { G.diff = DIFFS.versus; setRV('RIV', 'RIVAL', 'RIVAL', 'TÚ'); }
  else if (mode === 'league') { const o = LG_TEAMS[lgOpp()]; G.diff = lgDiff(o.str); setRV(o.short, o.short, o.name); }
  else { G.diff = arcDiff(0); setRV('CPU', 'CPU', 'CPU'); }
  $('#app').classList.toggle('vs', vs);
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  showScreen(null);
  if (onl) { NET.ev = []; NET.rm = false; NET.seq = 0; }
  kickoff(mode === 'arcade' ? 0 : Math.random() < .5 ? 0 : 1);
  if (onl) { NET.inMatch = true; netSendInit(); }
}
function kickoff(t) {
  const b = G.ball;
  for (const p of G.players) {
    let x = p.hx, y = p.hy;
    if (p.role === 'piv') {
      if (p.team === t) { x = CX; y = t === 0 ? CY + 10 : CY - 10; }
      else y = p.team === 0 ? CY + 46 : CY - 46;
    }
    Object.assign(p, { x, y, vx: 0, vy: 0, tvx: 0, tvy: 0, fx: 0, fy: p.team ? 1 : -1, stun: 0, dash: 0, charging: false, charge: 0, holdT: 0, hop: 0 });
  }
  Object.assign(b, newBall());
  const piv = tm => G.players.find(p => p.team === tm && p.role === 'piv');
  take(piv(t), true); b.protect = 1.4;
  G.u[0] = piv(0); G.u[1] = piv(1);
  G.state = 'ready'; G.timer = G.mode === 'arcade' ? .8 : 1.2;
  banner(t === 0 ? 'SACA ' + RV.me : 'SACA ' + RV.saca, '', t === 0 ? 'small' : 'small blue', true);
  if (G.mode === 'online') NET.ev.push(['ko', t]);   // cada lado escribe "SACA TÚ / SACA RIVAL" desde su punto de vista
  sfx.whistle(1);
}
function goal(t) {
  const b = G.ball, arc = G.mode === 'arcade', vs = twoHum(), onl = G.mode === 'online';
  G.score[t]++; G.state = 'goal'; G.timer = arc ? 1.7 : 2.9; G.shake = .5; G.crowdJump = 3; G.concede = 1 - t;
  const s = b.shooter, own = !!s && s.team === t;
  const name = own ? (t === 0 || vs ? s.name : RV.gol) : 'EN PROPIA PUERTA';
  if (t === 0) G.scorers.push(own ? s.name : 'EN PROPIA');
  else if (vs) G.scorers1.push(own ? s.name : 'EN PROPIA');
  let sub;
  if (arc) {
    // arcade: cada gol tuyo da tiempo, cada gol en contra lo quita, y el rival se va endureciendo
    G.time = clamp(G.time + (t === 0 ? ARC_BONUS : -ARC_BONUS), 0, 99);
    G.diff = arcDiff(G.score[0]);
    sub = name + (t === 0 ? '  +' : '  -') + ARC_BONUS + 'S';
  } else {
    const mm = Math.floor((G.dur - G.time) / 60), ss = Math.floor((G.dur - G.time) % 60);
    sub = name + "  " + mm + "'" + String(ss).padStart(2, '0');
  }
  const title = onl || !vs ? (t === 0 ? '¡GOOOL!' : 'GOL RIVAL') : '¡GOL ' + (t ? 'P2' : 'P1') + '!';
  banner(title, sub, t === 0 ? '' : 'blue', onl);
  if (onl) NET.ev.push(['g', t, r1(b.x), sub]);   // el invitado monta su propio cartel y confeti
  if (t === 0 || (vs && !onl)) { sfx.goal(); vib([60, 40, 140]); } else { sfx.whistle(1); tone(300, .4, 'square', .05, 120, .2); vib(80); }
  goalFx(t, b.x);
}
function goalFx(t, x) {
  const gy = t === 0 ? P.t : P.b;
  for (let i = 0; i < 90; i++) {
    const a = rnd(Math.PI * 2), sp = rnd(30, 170);
    G.particles.push({ x, y: gy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: rnd(1.2, 2.4),
      col: t === 0 ? ['#f6c400', '#0d0d0d', '#fff', '#f6c400'][i % 4] : ['#7dd3fc', '#fff', '#0c4a6e'][i % 3], s: rnd(1.5, 3), g: 60 });
  }
}
function endMatch() {
  G.state = 'end'; sfx.whistle(3);
  const [a, c] = G.score, mode = G.mode;
  const names = l => { const n = {}; l.forEach(x => n[x] = (n[x] || 0) + 1); return Object.entries(n).map(([k, v]) => k + (v > 1 ? ' x' + v : '')).join('<br>'); };
  const R = { msg: '', sc: '', rec: '', again: true, next: false, share: false, win: a > c };
  if (mode === 'quick') {
    const rec = store.get('bpg_rec', { w: 0, d: 0, l: 0 });
    if (a > c) rec.w++; else if (a === c) rec.d++; else rec.l++;
    store.set('bpg_rec', rec);
    R.msg = a > c ? '¡VICTORIA PATUNA! CUAC CUAC' : a === c ? 'EMPATE. ¡A POR LA REVANCHA!' : 'HOY NO... ¡PERO VOLVEREMOS!';
    R.sc = G.scorers.length ? '⚽ GOLES BPG<br>' + names(G.scorers) : 'SIN GOLES DEL BPG';
    R.rec = `HISTORIAL: ${rec.w}V · ${rec.d}E · ${rec.l}D`;
  } else if (mode === 'versus') {
    R.msg = a > c ? '¡GANA P1!' : a < c ? '¡GANA P2!' : 'EMPATE. ¡REVANCHA!';
    R.win = a !== c;
    R.sc = '<span class="y">P1</span><br>' + (G.scorers.length ? names(G.scorers) : '-') + '<br><br><span class="s">P2</span><br>' + (G.scorers1.length ? names(G.scorers1) : '-');
  } else if (mode === 'online') {
    const nm = l => l.length ? names(l) : '-';
    R.msg = a > c ? '¡GANAS! CUAC CUAC' : a < c ? 'HAS PERDIDO... ¡REVANCHA!' : 'EMPATE. ¡REVANCHA!';
    R.win = a > c;
    R.sc = '<span class="y">TÚ</span><br>' + nm(G.scorers) + '<br><br><span class="s">RIVAL</span><br>' + nm(G.scorers1);
    R.rec = NET.rm ? 'EL RIVAL QUIERE REVANCHA' : '';
    NET.ev.push(['end', a, c, G.scorers.slice(), G.scorers1.slice()]);
  } else if (mode === 'league') {
    const L = lgReport(a, c);
    R.msg = a > c ? '¡VICTORIA! +3 PUNTOS' : a === c ? 'EMPATE · +1 PUNTO' : 'DERROTA · 0 PUNTOS';
    R.sc = G.scorers.length ? '⚽ GOLES BPG<br>' + names(G.scorers) : 'SIN GOLES DEL BPG';
    R.rec = L.finished ? (L.pos === 1 ? '🏆 ¡CAMPEONES DE LIGA! 🏆' : `LIGA TERMINADA · ${L.pos}º`) : `JORNADA ${league.round}/${LG_ROUNDS} · AHORA ${L.pos}º`;
    R.again = false; R.next = true; if (L.finished && L.pos === 1) R.win = true;
  } else {
    const ar = store.get('bpg_arcade', { best: 0, plays: 0 }), nr = a > ar.best;
    if (nr) ar.best = a;
    ar.plays++; store.set('bpg_arcade', ar);
    R.msg = nr ? '¡NUEVO RÉCORD!' : a ? 'SE ACABÓ EL TIEMPO' : 'NI UN GOL... ¡OTRA!';
    R.sc = a ? '⚽ ' + a + (a === 1 ? ' GOL' : ' GOLES') + ' EN 60"' : '';
    R.rec = `RÉCORD: ${ar.best} · PARTIDAS: ${ar.plays}`;
    R.share = a > 0; R.win = nr;
  }
  banner('¡FINAL!', '', 'small');
  setTimeout(() => {
    $('#f0').textContent = a; $('#f1').textContent = c;
    $('#finalMsg').textContent = R.msg; $('#finalScorers').innerHTML = R.sc; $('#finalRecord').textContent = R.rec;
    $('#againBtn').textContent = mode === 'arcade' ? '↻ OTRA VEZ' : '↻ REVANCHA';
    $('#againBtn').hidden = !R.again; $('#nextBtn').hidden = !R.next; $('#shareBtn').hidden = !R.share;
    showScreen('final');
    if (R.win) sfx.goal();
  }, 1500);
}

// ================== ACCIONES ==================
function take(p, quiet) {
  const b = G.ball;
  b.owner = p; b.protect = p.team === 0 ? .9 : .5; b.passTarget = null; b.curve = 0; b.fire = false; b.scary = false; b.vx = b.vy = 0;
  p.holdT = 0;
  if (G.hum[p.team]) G.u[p.team] = p;
  if (!quiet) tone(p.team === 0 ? 520 : 380, .04, 'square', .035);
}
function kick(p, dx, dy, speed) {
  const b = G.ball, d = hyp(dx, dy) || 1;
  dx /= d; dy /= d;
  b.owner = null; b.vx = dx * speed; b.vy = dy * speed;
  b.x = p.x + dx * (p.r + BR + 1); b.y = p.y + dy * (p.r + BR + 1);
  b.noTouch = .2; b.lastTouch = p; b.curve = 0; b.fire = false; b.passTarget = null; b.scary = false;
  p.charging = false; p.charge = 0; p.holdT = 0;
}
function shoot(p, c) {
  const b = G.ball, gy = p.team === 0 ? P.t - 6 : P.b + 6;
  const pw = .35 + .65 * c;
  let side;
  if (isUser(p) && Math.abs(inputs[p.team].x) > .15) side = clamp(inputs[p.team].x * 1.3, -1, 1);
  else side = rnd(-1, 1);
  const aimX = CX + side * (GW / 2 - 7);
  let dx = aimX - b.x, dy = gy - b.y;
  const d = hyp(dx, dy); dx /= d; dy /= d;
  let ang = (Math.random() - .5) * (.1 + .06 * pw);
  let curve = 0;
  if (p.curve && d > 70) {
    const s = Math.abs(side) > .15 ? Math.sign(side) : (Math.random() < .5 ? -1 : 1);
    curve = s * 230; ang -= s * .26;
  }
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const ndx = dx * ca - dy * sa, ndy = dx * sa + dy * ca;
  const speed = Math.min(520, (150 + 250 * pw) * p.shot * (p.team === 1 ? G.diff.shoot : 1));
  kick(p, ndx, ndy, speed);
  b.curve = curve; b.shooter = p; b.fire = !!p.fire && pw > .7;
  if (p.quack) { b.scary = true; sfx.quack(); }
  sfx.kick(pw); if (b.fire) { noise(.2, .1); vib(30); }
  if (p.team === 0) vib(15);
}
function pass(p) {
  const b = G.ball, mates = G.players.filter(q => q.team === p.team && q !== p);
  const opps = G.players.filter(q => q.team !== p.team);
  const fwd = p.team === 0 ? -1 : 1;
  const inp = inputs[p.team], jm = hyp(inp.x, inp.y);
  const useJoy = isUser(p) && jm > .3;
  let best = null, bs = -1e9;
  for (const q of mates) {
    const dx = q.x - p.x, dy = q.y - p.y, d = hyp(dx, dy) || 1;
    let s;
    if (useJoy) s = (dx * inp.x + dy * inp.y) / (d * jm) * 3 - d / 280;
    else s = dy * fwd / 110 - d / 260 + rnd(.3);
    for (const o of opps) if (segDist(o.x, o.y, p.x, p.y, q.x, q.y) < 11) s -= useJoy ? .4 : 1.2;
    if (q.role === 'gk') s -= useJoy ? .8 : 2;
    if (s > bs) { bs = s; best = q; }
  }
  if (!best) return;
  const d = dist(p, best);
  const tx = best.x + best.vx * .3, ty = best.y + best.vy * .3;
  const speed = clamp(130 + d * 1.0, 150, 290) * p.pass;
  kick(p, tx - b.x, ty - b.y, speed);
  b.passTarget = best; b.shooter = p;
  if (G.hum[p.team]) G.u[p.team] = best;
  sfx.pass();
}
function steal(q, o) {
  o.stun = .5; o.charging = false; o.charge = 0; o.vx *= .2; o.vy *= .2;
  take(q, true); sfx.steal();
  for (let i = 0; i < 8; i++) G.particles.push({ x: o.x, y: o.y, vx: rnd(-50, 50), vy: rnd(-50, 50), life: .35, col: '#fff', s: 1.5 });
  if (q.team === 0) vib(20);
}
function switchUser(t) {
  const b = G.ball;
  let best = null, bd = 1e9;
  for (const q of team(t)) {
    if (q === G.u[t] || q.role === 'gk') continue;
    const d = hyp(q.x - b.x, q.y - b.y);
    if (d < bd) { bd = d; best = q; }
  }
  if (best) { G.u[t] = best; G.switchCd[t] = .7; tone(700, .04, 'square', .03); }
}
function autoSwitch(dt) {
  const b = G.ball;
  for (const t of [0, 1]) {
    if (!G.hum[t]) continue;
    G.switchCd[t] -= dt;
    if (b.owner && b.owner.team === t) continue;
    if (!b.owner && b.passTarget && b.passTarget.team === t) continue;
    if (G.switchCd[t] > 0) continue;
    const px = b.x + b.vx * .25, py = b.y + b.vy * .25;
    let best = null, bd = 1e9;
    for (const q of team(t)) {
      if (q.role === 'gk') continue;
      const d = hyp(q.x - px, q.y - py);
      if (d < bd) { bd = d; best = q; }
    }
    const u = G.u[t], ud = u.role === 'gk' ? 1e9 : hyp(u.x - px, u.y - py);
    if (best && best !== u && bd + 18 < ud) { G.u[t] = best; G.switchCd[t] = .35; }
  }
}

// ================== CONTROL DEL USUARIO ==================
function userCtl(p, dt) {
  const b = G.ball, has = b.owner === p, inp = inputs[p.team];
  const s = maxSpd(p);
  p.tvx = inp.x * s; p.tvy = inp.y * s;
  const jm = hyp(inp.x, inp.y);
  if (jm > .2) { p.wfx = inp.x / jm; p.wfy = inp.y / jm; } else p.wfx = null;

  if (inp.aDown) {
    inp.aDown = false;
    if (has) { p.charging = true; p.charge = 0; }
    else if (p.dashT <= 0 && p.stun <= 0) {
      p.dash = .24; p.dashT = p.dashCdBase; p.dashHit = false;
      const fx = jm > .2 ? inp.x / jm : p.fx, fy = jm > .2 ? inp.y / jm : p.fy;
      p.vx += fx * 90; p.vy += fy * 90; sfx.dash();
      for (let i = 0; i < 6; i++) G.particles.push({ x: p.x, y: p.y + 4, vx: -fx * rnd(20, 60) + rnd(-15, 15), vy: -fy * rnd(20, 60) + rnd(-15, 15), life: .35, col: '#d9f99d', s: 1.5 });
    }
  }
  if (p.charging) {
    if (!has) { p.charging = false; p.charge = 0; }
    else {
      p.charge = Math.min(1, p.charge + dt * 1.5);
      if (!inp.aHeld) shoot(p, p.charge);
    }
  }
  if (inp.bDown) {
    inp.bDown = false;
    if (has) pass(p); else if (G.switchCd[p.team] < .5) switchUser(p.team);
  }
  if (has && p.role === 'gk') { p.holdT += dt; if (p.holdT > 2.6) pass(p); }
}

// ================== IA ==================
function aiCarrier(p, dt) {
  p.holdT += dt;
  if (p.role === 'gk') { p.tvx = p.tvy = 0; if (p.holdT > .8) pass(p); return; }
  const gy = p.team === 0 ? P.t : P.b;
  const dg = hyp(CX - p.x, gy - p.y);
  let no = 1e9;
  const opps = G.players.filter(q => q.team !== p.team);
  for (const o of opps) no = Math.min(no, dist(o, p));
  const rv = p.team === 1 ? G.diff.react : 1;
  const shootR = 115 * (p.team === 1 ? G.diff.shoot : 1);
  if (G.ball.protect <= 0 && dg < shootR && (Math.random() < 1.5 * rv * dt || dg < 65)) { shoot(p, rnd(.35, .9)); return; }
  if ((no < 22 && Math.random() < 1.2 * rv * dt) || p.holdT > 3.5) { pass(p); return; }
  let dx = CX + (p.x - CX) * .45 - p.x, dy = gy - p.y;
  let d = hyp(dx, dy) || 1; dx /= d; dy /= d;
  let ax = 0, ay = 0;
  for (const o of opps) {
    const ox = p.x - o.x, oy = p.y - o.y, od = hyp(ox, oy) || 1;
    if (od < 48) { const w = (48 - od) / 48 * 1.7; ax += ox / od * w; ay += oy / od * w * .5; }
  }
  if (p.x < P.l + 22) ax += .6; if (p.x > P.r - 22) ax -= .6;
  dx += ax; dy += ay; d = hyp(dx, dy) || 1;
  const s = maxSpd(p);
  p.tvx = dx / d * s; p.tvy = dy / d * s;
}
function aiOff(p, dt) {
  if (p.role === 'gk') return gkAI(p, dt);
  const b = G.ball, fwd = p.team === 0 ? -1 : 1;
  if (b.passTarget === p && !b.owner) { seek(p, b.x + b.vx * .18, b.y + b.vy * .18, 1); return; }
  const ot = b.owner ? b.owner.team : -1;
  if (ot === p.team) {
    let tx = p.hx + (b.x - CX) * .25 + Math.sin(G.t * 1.2 + p.num) * 14;
    let ty = p.hy + fwd * (p.role === 'def' ? 60 : 105);
    if (p.role === 'piv') ty = p.hy + fwd * 130;
    seek(p, clamp(tx, P.l + 12, P.r - 12), clamp(ty, P.t + 30, P.b - 30), .85);
  } else {
    if (G.chaser[p.team] === p) { seek(p, b.x + b.vx * .2, b.y + b.vy * .2, 1); return; }
    // segundo defensor: cierra el camino a portería
    if (G.cover[p.team] === p && ot !== -1) {
      const gy = p.team === 0 ? P.b : P.t;
      seek(p, lerp(b.x, CX, .3), lerp(b.y, gy, .3), .95); return;
    }
    let tx = lerp(p.hx, b.x, .38), ty = lerp(p.hy, b.y, ot === -1 ? .3 : .35);
    // no adelantarse demasiado al balón cuando defiende
    if (ot !== -1) ty = p.team === 0 ? Math.max(ty, b.y + 12) : Math.min(ty, b.y - 12);
    seek(p, tx, clamp(ty, P.t + 10, P.b - 10), .85);
  }
}
function gkAI(p, dt) {
  const b = G.ball, gy = p.team === 0 ? P.b : P.t, out = p.team === 0 ? -1 : 1;
  let tx = clamp(CX + (b.x - CX) * .42, GX1 + 4, GX2 - 4), ty = gy + out * 9, m = .9;
  const toward = !b.owner && (p.team === 0 ? b.vy > 70 : b.vy < -70);
  if (toward) {
    p.react += dt;
    const delay = (p.team === 1 ? .2 / G.diff.gk : .06) + (b.scary ? .22 : 0);
    if (p.react > delay) {
      const t = (ty - b.y) / b.vy;
      if (t > 0 && t < 1.5) { tx = clamp(b.x + b.vx * t, GX1 - 6, GX2 + 6); m = 1.45 * (p.team === 1 ? G.diff.gk : 1.1); }
    }
  } else p.react = 0;
  const dG = hyp(b.x - CX, b.y - gy);
  if (!b.owner && dG < 72 && hyp(b.vx, b.vy) < 150) { tx = b.x; ty = b.y; m = 1.2; }
  else if (b.owner && b.owner.team !== p.team && dG < 95) ty = gy + out * 16;
  seek(p, tx, ty, m);
}
function pickChasers() {
  const b = G.ball;
  for (const t of [0, 1]) {
    const hum = G.hum[t];
    const cands = team(t).filter(q => q.role !== 'gk' && q !== b.owner && !(hum && q === G.u[t]))
      .sort((a, c) => hyp(a.x - b.x, a.y - b.y) - hyp(c.x - b.x, c.y - b.y));
    // el equipo humano maneja al "chaser"; sus compañeros IA solo hacen cobertura
    G.chaser[t] = hum ? null : cands[0] || null;
    G.cover[t] = hum ? cands[0] || null : cands[1] || null;
  }
}

// ================== FÍSICA ==================
function step(dt) {
  G.t += dt;
  updParticles(dt);
  G.shake = Math.max(0, G.shake - dt);
  G.crowdJump = Math.max(0, G.crowdJump - dt);
  if (G.state !== 'play') { for (const i of inputs) i.aDown = i.bDown = false; }
  if (G.state === 'ready') { G.timer -= dt; if (G.timer <= 0) { G.state = 'play'; hideBanner(); } return; }
  if (G.state === 'goal' || G.state === 'end') {
    G.timer -= dt; celebrate(dt);
    if (G.state === 'goal' && G.timer <= 0) { hideBanner(); if (G.time <= 0) endMatch(); else kickoff(G.concede); }
    return;
  }
  if (G.state !== 'play') return;

  G.time -= dt;
  if (G.time <= 0) { G.time = 0; G.timer = 99; endMatch(); return; }
  const b = G.ball;
  for (const p of G.players) { p.stun -= dt; p.dash -= dt; p.dashT -= dt; }
  b.noTouch -= dt; b.protect -= dt;

  autoSwitch(dt);
  pickChasers();
  for (const p of G.players) {
    if (isUser(p)) userCtl(p, dt);
    else if (b.owner === p) aiCarrier(p, dt);
    else aiOff(p, dt);
  }
  if (G.state !== 'play') return; // un gol pudo cambiar el estado
  movePlayers(dt);
  updBall(dt);
  if (G.state !== 'play') return;
  steals(dt);
  pickups();
}
function movePlayers(dt) {
  for (const p of G.players) {
    const k = p.dash > 0 ? 22 : 10;
    p.vx += (p.tvx - p.vx) * Math.min(1, k * dt);
    p.vy += (p.tvy - p.vy) * Math.min(1, k * dt);
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.x = clamp(p.x, P.l + 4, P.r - 4); p.y = clamp(p.y, P.t + 4, P.b - 4);
    if (p.role === 'gk') {
      const gy = p.team === 0 ? P.b : P.t, d = hyp(p.x - CX, p.y - gy);
      if (d > 74) { p.x = CX + (p.x - CX) / d * 74; p.y = gy + (p.y - gy) / d * 74; }
    }
    const sp = hyp(p.vx, p.vy);
    let nx = null, ny;
    if (isUser(p) && p.wfx != null) { nx = p.wfx; ny = p.wfy; }
    else if (sp > 12) { nx = p.vx / sp; ny = p.vy / sp; }
    if (nx !== null) {
      p.fx += (nx - p.fx) * Math.min(1, 16 * dt); p.fy += (ny - p.fy) * Math.min(1, 16 * dt);
      const fl = hyp(p.fx, p.fy) || 1; p.fx /= fl; p.fy /= fl;
    }
    p.anim += dt * (sp / 55);
    if (p.dash > 0 && Math.random() < .5) G.particles.push({ x: p.x - p.fx * 6, y: p.y - p.fy * 6, vx: 0, vy: 0, life: .2, col: p.team ? '#bae6fd' : '#fde68a', s: 2 });
    if (p.spd > 1.25 && sp > 75 && Math.random() < .35) G.particles.push({ x: p.x - p.fx * 7, y: p.y - p.fy * 7, vx: 0, vy: 0, life: .22, col: '#fb7185', s: 1.5 });
  }
  // separación entre jugadores
  const ps = G.players;
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const a = ps[i], c = ps[j], dx = c.x - a.x, dy = c.y - a.y, d = hyp(dx, dy), m = a.r + c.r - 2;
    if (d > 0 && d < m) { const o = (m - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; c.x += nx * o; c.y += ny * o; }
  }
}
function updBall(dt) {
  const b = G.ball;
  if (b.owner) {
    const o = b.owner, wob = Math.sin(o.anim * 9) * 1.2 * Math.min(1, hyp(o.vx, o.vy) / 60);
    b.x = o.x + o.fx * (o.r + BR + wob); b.y = o.y + o.fy * (o.r + BR + wob);
    b.x = clamp(b.x, P.l + BR, P.r - BR); b.y = clamp(b.y, P.t + BR, P.b - BR);
    b.vx = o.vx; b.vy = o.vy; b.spin += hyp(o.vx, o.vy) * dt * .2;
    return;
  }
  let sp = hyp(b.vx, b.vy);
  if (b.curve && sp > 40) {
    const nx = -b.vy / sp, ny = b.vx / sp;
    b.vx += nx * b.curve * dt; b.vy += ny * b.curve * dt;
    b.curve *= Math.pow(.35, dt);
  }
  const f = Math.pow(.45, dt); b.vx *= f; b.vy *= f;
  sp = hyp(b.vx, b.vy);
  if (sp < 6) { b.vx = b.vy = 0; b.fire = false; }
  if (sp < 160) b.fire = false;
  b.x += b.vx * dt; b.y += b.vy * dt; b.spin += sp * dt * .2;
  b.trail.push([b.x, b.y]); if (b.trail.length > 7) b.trail.shift();
  if (b.fire) for (let i = 0; i < 2; i++) G.particles.push({ x: b.x + rnd(-1.5, 1.5), y: b.y + rnd(-1.5, 1.5), vx: rnd(-20, 20), vy: rnd(-20, 20), life: rnd(.2, .4), col: ['#ef4444', '#f97316', '#fde047'][i + (Math.random() < .5 ? 0 : 1)], s: rnd(1.5, 3) });
  // paredes laterales (fútbol sala arcade: rebota)
  if (b.x < P.l + BR) { b.x = P.l + BR; b.vx = Math.abs(b.vx) * .7; if (sp > 60) sfx.bounce(); }
  if (b.x > P.r - BR) { b.x = P.r - BR; b.vx = -Math.abs(b.vx) * .7; if (sp > 60) sfx.bounce(); }
  // postes
  for (const [px, py] of [[GX1, P.t], [GX2, P.t], [GX1, P.b], [GX2, P.b]]) {
    const dx = b.x - px, dy = b.y - py, d = hyp(dx, dy);
    if (d < BR + 1.8 && d > 0) {
      const nx = dx / d, ny = dy / d, vn = b.vx * nx + b.vy * ny;
      if (vn < 0) { b.vx -= 1.75 * vn * nx; b.vy -= 1.75 * vn * ny; sfx.post(); G.shake = .15; b.curve = 0; }
      b.x = px + nx * (BR + 1.9); b.y = py + ny * (BR + 1.9);
    }
  }
  const inMouth = b.x > GX1 + 1 && b.x < GX2 - 1;
  if (b.y < P.t + BR) {
    if (inMouth) { if (b.y < P.t - 3) { b.y = Math.max(b.y, P.t - 9); goal(0); return; } }
    else { b.y = P.t + BR; b.vy = Math.abs(b.vy) * .7; if (sp > 60) sfx.bounce(); }
  }
  if (b.y > P.b - BR) {
    if (inMouth) { if (b.y > P.b + 3) { b.y = Math.min(b.y, P.b + 9); goal(1); return; } }
    else { b.y = P.b - BR; b.vy = -Math.abs(b.vy) * .7; if (sp > 60) sfx.bounce(); }
  }
}
function steals(dt) {
  const b = G.ball, o = b.owner;
  if (!o || b.protect > 0) return;
  for (const q of G.players) {
    if (q.team === o.team || q.stun > 0) continue;
    const d = dist(q, o);
    if (d > q.r + o.r + 4) continue;
    if (isUser(q)) {
      if (q.dash > 0 && !q.dashHit) {
        q.dashHit = true;
        if (Math.random() < .6 + .3 * q.tackle / o.ctrl) { steal(q, o); return; }
        q.stun = .25; tone(150, .08, 'square', .04);
      } else if (Math.random() < .8 * q.tackle / o.ctrl * dt) { steal(q, o); return; }
    } else {
      const rate = (q.team === 1 && !twoHum() ? 1.1 * G.diff.tackle : 1.0) * q.tackle / o.ctrl;
      if (Math.random() < rate * dt) { steal(q, o); return; }
    }
  }
}
function pickups() {
  const b = G.ball;
  if (b.owner) return;
  for (const p of G.players) {
    if (p.stun > 0) continue;
    if (b.noTouch > 0 && p === b.lastTouch) continue;
    const isGk = p.role === 'gk';
    const R = p.r * (isGk ? p.reach : 1) + BR;
    const dx = b.x - p.x, dy = b.y - p.y, d = hyp(dx, dy);
    if (d >= R) continue;
    const rel = hyp(b.vx - p.vx, b.vy - p.vy);
    let th;
    if (isGk) th = 270 * p.reach * (p.team === 1 ? G.diff.gk : 1);
    else th = 210 * p.ctrl + (b.passTarget === p ? 260 : 0) + (b.passTarget && b.passTarget.team === p.team ? 80 : 0);
    if (rel < th) { take(p); return; }
    // desvío / parada
    const nx = d ? dx / d : 0, ny = d ? dy / d : -1, vn = b.vx * nx + b.vy * ny;
    if (vn < 0) { b.vx -= 1.6 * vn * nx; b.vy -= 1.6 * vn * ny; }
    b.vx *= .75; b.vy *= .75; b.x = p.x + nx * (R + .5); b.y = p.y + ny * (R + .5);
    b.lastTouch = p; b.noTouch = .12; b.passTarget = null; b.curve = 0; b.fire = false;
    if (isGk) { sfx.save(); if (rel > 330) { banner('¡PARADÓN!', p.team === 0 ? p.name : '', p.team === 0 ? 'small' : 'small blue'); flashHide(); G.shake = .2; } }
    else sfx.bounce();
    return;
  }
}
function celebrate(dt) {
  const b = G.ball;
  b.vx *= .9; b.vy *= .9; b.x += b.vx * dt; b.y += b.vy * dt;
  b.x = clamp(b.x, GX1 + 3, GX2 - 3);
  for (const p of G.players) {
    p.vx *= .9; p.vy *= .9; p.x += p.vx * dt; p.y += p.vy * dt; p.anim += dt * 2;
    p.hop = (G.state === 'goal' && p.team !== G.concede) ? Math.abs(Math.sin(G.t * 9 + p.num)) * 4 : 0;
  }
}
function updParticles(dt) {
  const ps = G.particles;
  for (let i = ps.length - 1; i >= 0; i--) {
    const q = ps[i]; q.life -= dt;
    if (q.life <= 0) { ps.splice(i, 1); continue; }
    q.vy += (q.g || 0) * dt; q.vx *= .97; q.vy *= .97; q.x += q.vx * dt; q.y += q.vy * dt;
  }
}

// ================== RENDER ==================
const cv = $('#game'), ctx = cv.getContext('2d');
const crowd = [];
(function genCrowd() {
  const cols = ['#f6c400', '#0d0d0d', '#f6c400', '#fff', '#0d0d0d', '#f6c400', '#7dd3fc', '#e5e7eb'];
  for (let y = 3; y < VH; y += 5) for (let x = 2; x < VW; x += 5) {
    const inside = x > P.l - 8 && x < P.r + 8 && y > P.t - 16 && y < P.b + 16;
    if (inside) continue;
    if (Math.random() < .15) continue;
    crowd.push({ x: x + rnd(-1, 1), y, c: cols[Math.floor(Math.random() * cols.length)], ph: rnd(7) });
  }
})();
function circ(x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

function drawField() {
  ctx.fillStyle = '#1b1426'; ctx.fillRect(0, 0, VW, VH);
  // grada
  const jump = G.crowdJump > 0;
  for (const c of crowd) {
    const dy = jump ? -Math.abs(Math.sin(G.t * 12 + c.ph)) * 2.5 : (Math.sin(G.t * 2 + c.ph) > .97 ? -1 : 0);
    ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y + dy, 3, 3);
  }
  // vallas publicitarias amarillo/negro
  ctx.fillStyle = '#0d0d0d'; ctx.fillRect(P.l - 6, P.t - 14, P.r - P.l + 12, P.b - P.t + 28);
  for (let x = P.l - 6; x < P.r + 6; x += 12) {
    ctx.fillStyle = (x / 12 | 0) % 2 ? '#f6c400' : '#2a2a2a';
    ctx.fillRect(x, P.t - 14, 6, 3); ctx.fillRect(x, P.b + 11, 6, 3);
  }
  // césped / pista
  for (let i = 0, y = P.t; y < P.b; y += 24, i++) { ctx.fillStyle = i % 2 ? '#2f9a44' : '#2a8c3d'; ctx.fillRect(P.l, y, P.r - P.l, Math.min(24, P.b - y)); }
  ctx.fillStyle = '#2a8c3d'; ctx.fillRect(P.l - 3, P.t - 3, P.r - P.l + 6, 3); ctx.fillRect(P.l - 3, P.b, P.r - P.l + 6, 3);
  ctx.fillRect(P.l - 3, P.t, 3, P.b - P.t); ctx.fillRect(P.r, P.t, 3, P.b - P.t);
  // líneas
  ctx.strokeStyle = 'rgba(240,255,240,.85)'; ctx.lineWidth = 1.5;
  ctx.strokeRect(P.l, P.t, P.r - P.l, P.b - P.t);
  ctx.beginPath(); ctx.moveTo(P.l, CY); ctx.lineTo(P.r, CY); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, 30, 0, Math.PI * 2); ctx.stroke();
  // escudo central
  ctx.globalAlpha = .35; drawCrest(ctx, CX, CY, 34); ctx.globalAlpha = 1;
  circ(CX, CY, 1.8, '#f0fff0');
  // áreas (D de fútbol sala)
  ctx.beginPath(); ctx.arc(CX, P.t, 64, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, P.b, 64, Math.PI, Math.PI * 2); ctx.stroke();
  for (const y of [P.t + 62, P.b - 62]) circ(CX, y, 1.5, '#f0fff0');
  for (const y of [P.t + 104, P.b - 104]) circ(CX, y, 1.2, '#f0fff0');
  // porterías
  drawGoal(P.t, -1); drawGoal(P.b, 1);
}
function drawGoal(y, dir) {
  const d = 11, y0 = dir < 0 ? y - d : y;
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(GX1, y0, GW, d);
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = .6;
  ctx.beginPath();
  for (let x = GX1; x <= GX2; x += 4) { ctx.moveTo(x, y0); ctx.lineTo(x, y0 + d); }
  for (let yy = y0; yy <= y0 + d; yy += 3) { ctx.moveTo(GX1, yy); ctx.lineTo(GX2, yy); }
  ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(GX1, y); ctx.lineTo(GX1, y + dir * d); ctx.lineTo(GX2, y + dir * d); ctx.lineTo(GX2, y); ctx.stroke();
  circ(GX1, y, 1.8, '#ef4444'); circ(GX2, y, 1.8, '#ef4444');
}
function drawDuck(p) {
  const hop = p.hop || 0;
  const x = p.x, y = p.y - hop, fx = p.fx, fy = p.fy, px = -fy, py = fx, r = p.r;
  const rival = p.team === 1, gk = p.role === 'gk';
  const sp = hyp(p.vx, p.vy);
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(p.x + 1.5, p.y + 3, r, r * .7, 0, 0, 7); ctx.fill();
  if (isUser(p)) { ctx.strokeStyle = p.team ? '#7dd3fc' : '#f6c400'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, r + 3, (r + 3) * .7, 0, 0, 7); ctx.stroke(); }
  // patas
  const ph = sp > 10 ? Math.sin(p.anim * 14) : 0;
  ctx.fillStyle = '#ff8a00';
  for (const s of [-1, 1]) { const o = ph * s * (r - 1); ctx.fillRect(x + px * s * 3.5 + fx * o - 1.5, y + py * s * 3.5 + fy * o - 1.5, 3, 3); }
  // cuerpo / camiseta
  const jersey = gk ? (rival ? '#fb923c' : '#22c55e') : (rival ? '#7dd3fc' : '#f6c400');
  const trim = rival ? '#0c4a6e' : '#0d0d0d';
  circ(x, y, r, trim); circ(x, y, r - 2, jersey);
  if (!rival && !gk) { ctx.fillStyle = trim; ctx.fillRect(x - .8 - fx * 1.5, y - .8 - fy * 1.5, 1.6, 1.6); }
  const fea = rival ? '#f1f5f9' : '#ffd23f', feaD = rival ? '#64748b' : '#a86b00';
  // alas / guantes
  for (const s of [-1, 1]) {
    const wx = x + px * s * (r - .3) + fx * (gk ? 1.5 : -1), wy = y + py * s * (r - .3) + fy * (gk ? 1.5 : -1);
    if (gk) { circ(wx, wy, 2.9, '#f8fafc'); circ(wx, wy, 1.4, rival ? '#fb923c' : '#22c55e'); }
    else circ(wx, wy, 2.2, fea);
    if (p.captain && s === 1) { ctx.fillStyle = '#fff'; ctx.fillRect(wx - 1.5, wy - 1.5, 3, 3); ctx.fillStyle = '#ef4444'; ctx.fillRect(wx - .5, wy - .5, 1, 1); }
    if (p.look === 'wrist') circ(wx, wy, 1.3, '#fff');
  }
  // cabeza
  const hx = x + fx * 1.6, hy = y + fy * 1.6, hr = r * (p.mini ? .8 : .62);
  const L = p.look;
  const line = (col, w, x1, y1, x2, y2) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const ring = (col, w, rr) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(hx, hy, rr, 0, 7); ctx.stroke(); };
  if (L === 'afro') circ(hx - fx * 1.5, hy - fy * 1.5, hr + 2.6, '#3b2414');
  circ(hx, hy, hr + 1, feaD); circ(hx, hy, hr, fea);
  const tail = col => { const w = Math.sin(G.t * 22) * 1.5; line(col, 1.5, hx - fx * hr, hy - fy * hr, hx - fx * (hr + 5) + px * w, hy - fy * (hr + 5) + py * w); };
  if (L === 'band') { ring('#e11d48', 1.5, hr - .5); tail('#e11d48'); }
  if (L === 'bandana') { ring('#2563eb', 1.8, hr - .6); tail('#2563eb'); }
  if (L === 'wrist') ring('#fff', 1.3, hr - .5);
  if (L === 'mohawk') line('#ef4444', 2.2, hx + fx * (hr - 1), hy + fy * (hr - 1), hx - fx * (hr + 1.5), hy - fy * (hr + 1.5));
  if (L === 'curl') { circ(hx - fx * 1.5 + px, hy - fy * 1.5 + py, 2, '#1c1917'); circ(hx - fx * 1.5 - px * 1.5, hy - fy * 1.5 - py * 1.5, 1.8, '#1c1917'); }
  if (L === 'cap') {
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(hx, hy, hr + .3, Math.atan2(fy, fx) + Math.PI / 2, Math.atan2(fy, fx) + Math.PI * 1.5); ctx.fill();
    ctx.fillRect(hx - fx * (hr + 2.5) - 1.5, hy - fy * (hr + 2.5) - 1.5, 3, 3); circ(hx - fx * 1.5, hy - fy * 1.5, .9, '#f6c400');
  }
  if (L === 'buzz') {
    ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(hx, hy, hr + .2, Math.atan2(fy, fx) + Math.PI * .6, Math.atan2(fy, fx) + Math.PI * 1.4); ctx.fill();
  }
  if (L === 'crown') {
    circ(hx - fx, hy - fy, 2.6, '#eab308'); circ(hx - fx, hy - fy, 1.4, '#fde047');
    ctx.fillStyle = '#dc2626'; ctx.fillRect(hx - fx - .6, hy - fy - .6, 1.2, 1.2);
  }
  if (L === 'beard') { ctx.strokeStyle = '#4a2c17'; ctx.lineWidth = 1.6; ctx.beginPath(); const a = Math.atan2(fy, fx); ctx.arc(hx, hy, hr - .3, a - 1.2, a + 1.2); ctx.stroke(); }
  // looks de la cantera
  if (L === 'spiky') { for (const s of [-1, 0, 1]) line('#7c4a21', 1.6, hx + px * s * 2, hy + py * s * 2, hx - fx * (hr + 2) + px * s * 3.2, hy - fy * (hr + 2) + py * s * 3.2); }
  if (L === 'beanie' || L === 'mcap') {
    const a = Math.atan2(fy, fx), col = L === 'mcap' ? '#dc2626' : '#38bdf8';
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(hx, hy, hr + .4, a + Math.PI / 2, a + Math.PI * 1.5); ctx.fill();
    if (L === 'beanie') circ(hx - fx * (hr + .6), hy - fy * (hr + .6), 1.7, '#fff');
    else { ctx.fillStyle = '#7f1d1d'; ctx.fillRect(hx + fx * hr * .55 - 1.2, hy + fy * hr * .55 - 1.2, 2.4, 2.4); circ(hx - fx * .4, hy - fy * .4, 1.2, '#fff'); }
  }
  if (L === 'bow') { for (const s of [-1, 1]) circ(hx - fx * hr * .5 + px * s * (hr * .8), hy - fy * hr * .5 + py * s * (hr * .8), 1.9, '#ec4899'); circ(hx - fx * hr * .5, hy - fy * hr * .5, 1.2, '#be185d'); }
  if (L === 'pigtails') { for (const s of [-1, 1]) { circ(hx + px * s * (hr + 1.2), hy + py * s * (hr + 1.2) - fy * .5, 2, '#7c4a21'); circ(hx + px * s * (hr - .2), hy + py * s * (hr - .2), .9, '#ef4444'); } }
  if (L === 'ponytail') { const w = Math.sin(G.t * 12) * 1.4; line('#d6a23a', 2.2, hx - fx * hr, hy - fy * hr, hx - fx * (hr + 5) + px * w, hy - fy * (hr + 5) + py * w); circ(hx - fx * hr, hy - fy * hr, 1.1, '#ec4899'); }
  // ojos
  const ex = hx + fx * hr * .4, ey = hy + fy * hr * .4;
  if (L === 'shades') {
    line('#000', 2.4, ex + px * 2.8, ey + py * 2.8, ex - px * 2.8, ey - py * 2.8);
  } else {
    ctx.fillStyle = '#000';
    for (const s of [-1, 1]) ctx.fillRect(ex + px * s * 1.9 - .8, ey + py * s * 1.9 - .8, 1.6, 1.6);
    if (L === 'glasses') { ctx.strokeStyle = '#fff'; ctx.lineWidth = .8; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(ex + px * s * 1.9, ey + py * s * 1.9, 1.7, 0, 7); ctx.stroke(); } }
  }
  if (L === 'stache') line('#1c1917', 1.4, hx + fx * (hr - .5) + px * 2.4, hy + fy * (hr - .5) + py * 2.4, hx + fx * (hr - .5) - px * 2.4, hy + fy * (hr - .5) - py * 2.4);
  // pico
  ctx.fillStyle = '#ff8a00'; ctx.beginPath();
  ctx.moveTo(hx + fx * (hr + 3.6), hy + fy * (hr + 3.6));
  ctx.lineTo(hx + fx * (hr - 1) + px * 2.2, hy + fy * (hr - 1) + py * 2.2);
  ctx.lineTo(hx + fx * (hr - 1) - px * 2.2, hy + fy * (hr - 1) - py * 2.2);
  ctx.fill();
  if (p.stun > 0) { ctx.fillStyle = '#fff'; for (let i = 0; i < 3; i++) { const a = G.t * 8 + i * 2.1; ctx.fillRect(x + Math.cos(a) * 6 - .7, y - r - 3 + Math.sin(a) * 2 - .7, 1.4, 1.4); } }
}
function drawBall() {
  const b = G.ball, sp = hyp(b.vx, b.vy);
  if (!b.owner && sp > 200) {
    b.trail.forEach(([x, y], i) => { ctx.globalAlpha = i / b.trail.length * .35; circ(x, y, BR * .9, b.fire ? '#f97316' : '#fff'); });
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(b.x + 1.5, b.y + 2.5, BR + 1, (BR + 1) * .7, 0, 0, 7); ctx.fill();
  // aro amarillo pulsante cuando el balón está suelto, para localizarlo siempre
  if (!b.owner && (G.state === 'play' || G.state === 'paused')) {
    const pr = BR + 4 + Math.sin(G.t * 10) * 1.5;
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(b.x, b.y, pr, 0, 7); ctx.stroke();
    ctx.strokeStyle = '#f6c400'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(b.x, b.y, pr, 0, 7); ctx.stroke();
  }
  circ(b.x, b.y, BR + 1.2, '#000');
  circ(b.x, b.y, BR, b.fire ? '#fde047' : '#fff');
  ctx.fillStyle = '#111';
  for (let i = 0; i < 2; i++) {
    const a = b.spin + i * Math.PI;
    ctx.fillRect(b.x + Math.cos(a) * 1.6 - 1, b.y + Math.sin(a) * 1.6 - 1, 2, 2);
  }
}
function render() {
  ctx.save();
  if (G.shake > 0) ctx.translate(rnd(-2, 2) * G.shake * 3, rnd(-2, 2) * G.shake * 3);
  ctx.save();
  if (G.flip) { ctx.translate(VW, VH); ctx.rotate(Math.PI); }   // el invitado ve el campo girado: su equipo queda abajo
  drawField();
  const list = [...G.players].sort((a, b) => a.y - b.y);
  for (const p of list) drawDuck(p);
  drawBall();
  for (const q of G.particles) { ctx.globalAlpha = Math.min(1, q.life * 3); ctx.fillStyle = q.col; ctx.fillRect(q.x - q.s / 2, q.y - q.s / 2, q.s, q.s); }
  ctx.globalAlpha = 1;
  ctx.restore();
  // indicador de cada jugador humano (amarillo = P1, celeste = P2), siempre derecho aunque el campo esté girado
  for (const t of [0, 1]) {
    const u = G.u[t];
    if (!G.hum[t] || !u || G.state === 'end') continue;
    const ux = G.flip ? VW - u.x : u.x, uy = G.flip ? VH - u.y : u.y;
    const bob = Math.sin(G.t * 8) * 1.5, ty = uy - u.r - 9 + bob - (u.hop || 0);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(ux - 4.5, ty - 1); ctx.lineTo(ux + 4.5, ty - 1); ctx.lineTo(ux, ty + 5); ctx.fill();
    ctx.fillStyle = t ? '#7dd3fc' : '#f6c400'; ctx.beginPath(); ctx.moveTo(ux - 3, ty); ctx.lineTo(ux + 3, ty); ctx.lineTo(ux, ty + 3.5); ctx.fill();
    if (u.charging) {
      const w = 20, bx = ux - w / 2, by = ty - 6;
      ctx.fillStyle = '#000'; ctx.fillRect(bx - 1, by - 1, w + 2, 5);
      ctx.fillStyle = u.charge > .85 ? (G.t * 20 % 2 < 1 ? '#ef4444' : '#fde047') : u.charge > .5 ? '#f97316' : '#f6c400';
      ctx.fillRect(bx, by, w * u.charge, 3);
    }
  }
  ctx.restore();
}

// ================== RETRATOS (tarjetas y portada) ==================
function drawPortrait(canvas, d, t = 0) {
  canvas.width = 64; canvas.height = 64;
  const c = canvas.getContext('2d');
  c.translate(0, 3); // margen para coronas/crestas
  const rival = t === 1, gk = d.role === 'gk';
  const jersey = gk ? (rival ? '#fb923c' : '#22c55e') : (rival ? '#7dd3fc' : '#f6c400');
  const trim = rival ? '#0c4a6e' : '#0d0d0d';
  const fea = rival ? '#f1f5f9' : '#ffcc1f', feaD = rival ? '#94a3b8' : '#b77900';
  const C = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); };
  const E = (x, y, rx, ry, col) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };
  const R = (x, y, w, h, col, rad = 0) => { c.fillStyle = col; c.beginPath(); if (c.roundRect && rad) c.roundRect(x, y, w, h, rad); else c.rect(x, y, w, h); c.fill(); };
  const T = (pts, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.fill(); };
  // torso (en los mini, cuerpo más pequeño y cabezón)
  if (d.mini) { c.save(); c.translate(32, 44); c.scale(.8, .8); c.translate(-32, -44); }
  R(7, 41, 50, 26, trim, 12);
  R(14, 43, 36, 24, jersey, 6);
  T([25, 43, 39, 43, 32, 50], trim);
  if (!rival && !gk) { C(42, 47, 2.5, trim); C(42, 47, 1.5, jersey); }
  // brazos cruzados
  R(8, 47, 9, 12, trim, 3); R(47, 47, 9, 12, trim, 3);
  R(10, 50, 44, 9, feaD, 5); R(11, 51, 42, 7, fea, 4);
  const L = d.look;
  if (gk) { C(12, 54, 6, '#f8fafc'); C(52, 54, 6, '#f8fafc'); C(12, 54, 2.5, jersey); C(52, 54, 2.5, jersey); }
  if (d.captain) { R(8, 50, 9, 5, '#fff', 1); c.fillStyle = '#000'; c.font = 'bold 6px monospace'; c.textAlign = 'center'; c.fillText('C', 12.5, 55); }
  if (L === 'wrist' && !gk) { R(8, 50, 9, 5, '#fff', 1); R(47, 50, 9, 5, '#fff', 1); }
  if (d.mini) c.restore();
  // cabeza
  if (L === 'afro') { C(32, 21, 22, '#3b2414'); C(14, 18, 6, '#3b2414'); C(50, 18, 6, '#3b2414'); }
  C(32, 25, 17, feaD); C(32, 25, 16, fea);
  if (L === 'buzz') {
    c.save(); c.beginPath(); c.arc(32, 25, 16.5, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#2a1a10'; c.beginPath(); c.moveTo(10, 0); c.lineTo(54, 0); c.lineTo(54, 16);
    for (let x = 50; x >= 14; x -= 4) c.lineTo(x, x % 8 ? 13 : 16);
    c.closePath(); c.fill(); c.restore();
  }
  if (!['cap', 'crown', 'curl', 'afro', 'buzz', 'spiky', 'beanie', 'mcap', 'bow', 'pigtails', 'ponytail'].includes(L)) { T([27, 11, 31, 1, 34, 11], fea); T([32, 11, 39, 4, 37, 12], fea); }
  if (L === 'band') { R(16, 11, 32, 5, '#e11d48', 2); R(46, 12, 11, 3, '#e11d48', 1); R(47, 16, 9, 3, '#be123c', 1); }
  if (L === 'bandana') {
    R(16, 10, 32, 7, '#2563eb', 3); c.fillStyle = '#fff'; [20, 26, 32, 38, 44].forEach((x, i) => c.fillRect(x, 12 + (i % 2) * 2, 1.5, 1.5));
    T([46, 12, 58, 8, 56, 15], '#2563eb'); T([46, 14, 57, 19, 52, 21], '#1d4ed8');
  }
  if (L === 'wrist') R(16, 11, 32, 4, '#fff', 2);
  if (L === 'mohawk') { for (let i = 0; i < 4; i++) T([22 + i * 5, 11, 25 + i * 5, -1 + (i % 2) * 3, 28 + i * 5, 11], i % 2 ? '#f97316' : '#ef4444'); }
  if (L === 'curl') { [[23, 10, 5], [31, 7, 6], [39, 9, 5], [27, 12, 4], [36, 12, 4], [18, 14, 3.5], [45, 14, 3.5]].forEach(([x, y, r]) => C(x, y, r, '#1c1917')); }
  if (L === 'cap') {
    c.fillStyle = '#111'; c.beginPath(); c.arc(32, 22, 16.6, Math.PI, 0); c.fill();
    R(15, 19, 34, 3, '#111'); R(44, 17, 15, 4, '#111', 2); C(32, 6.5, 1.6, '#f6c400');
    c.fillStyle = '#f6c400'; c.font = 'bold 8px monospace'; c.textAlign = 'center'; c.fillText('B', 27, 16);
  }
  if (L === 'crown') {
    R(19, 5, 26, 7, '#eab308', 1);
    T([19, 6, 21, -3, 25, 6], '#eab308'); T([28, 6, 32, -4, 36, 6], '#eab308'); T([39, 6, 43, -3, 45, 6], '#eab308');
    C(32, 8.5, 1.8, '#dc2626'); C(24, 8.5, 1.3, '#2563eb'); C(40, 8.5, 1.3, '#16a34a');
  }
  if (L === 'spiky') { for (let i = 0; i < 5; i++) T([19 + i * 6.5, 11, 22 + i * 6.5, -2 + (i % 2) * 4, 25 + i * 6.5, 11], '#7c4a21'); }
  if (L === 'beanie') {
    c.fillStyle = '#38bdf8'; c.beginPath(); c.arc(32, 22, 16.6, Math.PI, 0); c.fill();
    R(15, 17, 34, 6, '#0ea5e9', 2); c.fillStyle = '#0284c7'; for (let x = 18; x < 48; x += 5) c.fillRect(x, 17, 1.5, 6);
    C(32, 5, 4.2, '#fff'); C(32, 5, 2.4, '#e0f2fe');
  }
  if (L === 'mcap') {
    c.fillStyle = '#dc2626'; c.beginPath(); c.arc(32, 22, 16.6, Math.PI, 0); c.fill();
    R(15, 19, 34, 3, '#dc2626'); R(44, 17, 15, 4, '#991b1b', 2);
    C(32, 10, 5, '#fff'); c.fillStyle = '#dc2626'; c.font = 'bold 8px monospace'; c.textAlign = 'center'; c.fillText('M', 32, 13);
  }
  if (L === 'bow') {
    c.fillStyle = '#7c4a21'; c.beginPath(); c.arc(32, 22, 16.6, Math.PI * 1.02, Math.PI * 1.98); c.fill();
    T([46, 9, 57, 2, 57, 16], '#ec4899'); T([46, 9, 35, 2, 35, 16], '#ec4899'); C(46, 9, 3, '#be185d');
  }
  if (L === 'pigtails') {
    C(11, 19, 7, '#7c4a21'); C(53, 19, 7, '#7c4a21'); C(14, 15, 2.2, '#ef4444'); C(50, 15, 2.2, '#ef4444');
    c.fillStyle = '#7c4a21'; c.beginPath(); c.arc(32, 22, 16.6, Math.PI * 1.02, Math.PI * 1.98); c.fill();
  }
  if (L === 'ponytail') {
    c.save(); c.translate(54, 14); c.rotate(.5); E(0, 8, 5, 11, '#d6a23a'); c.restore(); C(50, 12, 2.4, '#ec4899');
    c.fillStyle = '#d6a23a'; c.beginPath(); c.arc(32, 22, 16.6, Math.PI * 1.02, Math.PI * 1.98); c.fill();
  }
  // ojos y cejas enfadadas
  if (L === 'shades') {
    R(16, 19, 14, 8, '#111', 3); R(34, 19, 14, 8, '#111', 3); R(29, 21, 6, 2, '#111');
    c.fillStyle = '#fff'; c.fillRect(18, 20, 3, 2); c.fillRect(36, 20, 3, 2);
  } else {
    E(25, 24, 5, 6, '#fff'); E(39, 24, 5, 6, '#fff'); C(26.5, 25, 2.6, '#111'); C(37.5, 25, 2.6, '#111');
    if (L === 'glasses') {
      c.strokeStyle = '#111'; c.lineWidth = 1.8;
      c.beginPath(); c.arc(25, 24, 7, 0, 7); c.moveTo(46, 24); c.arc(39, 24, 7, 0, 7); c.moveTo(32, 23); c.lineTo(32, 23); c.stroke();
      R(31, 22, 2, 2, '#111');
    }
  }
  c.strokeStyle = '#111'; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(18, 15.5); c.lineTo(29, 19.5); c.moveTo(46, 15.5); c.lineTo(35, 19.5); c.stroke();
  // barba (debajo del pico)
  if (L === 'beard') { E(32, 40, 12, 6, '#4a2c17'); R(16, 28, 4, 10, '#4a2c17', 2); R(44, 28, 4, 10, '#4a2c17', 2); }
  // pico
  E(32, 35, 11, 5.5, '#ff8a00'); c.fillStyle = '#c2410c'; c.fillRect(22, 35, 20, 1.3);
  if (L === 'stache') { E(26.5, 31, 6, 2.2, '#1c1917'); E(37.5, 31, 6, 2.2, '#1c1917'); }
}

// ================== UI ==================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('show', s.id === id));
}
let bannerT = null;
const netHost = () => NET.role === 'host' && NET.live;
function banner(t, sub, cls = '', noNet) {
  const el = $('#banner'); clearTimeout(bannerT);
  el.className = ''; void el.offsetWidth;
  el.querySelector('b').textContent = t; el.querySelector('small').textContent = sub || '';
  el.className = 'show ' + cls;
  if (netHost() && !noNet) NET.ev.push(['b', t, sub || '', cls]);
}
function hideBanner() { $('#banner').className = ''; if (netHost()) NET.ev.push(['h']); }
function flashHide() {
  clearTimeout(bannerT); bannerT = setTimeout(() => { if (G.state === 'play') hideBanner(); }, 900);
  if (netHost()) NET.ev.push(['fh']);
}

const hudCache = {};
function setTxt(id, v) { if (hudCache[id] !== v) { hudCache[id] = v; $(id).innerHTML = v; } }
function hud() {
  if (!G.ball) return;
  setTxt('#s0', String(G.score[0])); setTxt('#s1', String(G.score[1]));
  const t = Math.ceil(G.time), m = Math.floor(t / 60), s = t % 60;
  setTxt('#clock', m + ':' + String(s).padStart(2, '0'));
  const onl = G.mode === 'online';   // online: cada uno ve solo su mando (el invitado maneja al equipo 1)
  for (const k of onl ? [NET.role === 'guest' ? 1 : 0] : G.hum[1] ? [0, 1] : [0]) {
    const u = G.u[k], has = G.ball.owner === u, sx = k && !onl ? '2' : '';
    if (u) setTxt('#who' + sx, `<b>#${u.num} ${u.name}</b><br>${u.short}`);
    setTxt('#bA' + sx + ' span', has ? 'TIRO' : 'ENTRADA');
    setTxt('#bB' + sx + ' span', has ? 'PASE' : 'CAMBIO');
  }
}

function fitCanvas() {
  const tv = $('#tv'), sc = $('#screen');
  const w = tv.clientWidth - 16, h = tv.clientHeight - 8;
  let cw = w, ch = w * VH / VW;
  if (ch > h) { ch = h; cw = h * VW / VH; }
  sc.style.width = Math.floor(cw) + 'px'; sc.style.height = Math.floor(ch) + 'px';
}
window.addEventListener('resize', fitCanvas);
if (window.ResizeObserver) new ResizeObserver(fitCanvas).observe($('#tv'));

// --- elegir quinteto ---
const loadLU = (key, def) => {
  const s = store.get(key, null);
  if (Array.isArray(s) && s.length === 5 && s.every(n => n == null || byNum(n))) {
    const f = s.filter(n => n != null);
    if (new Set(f).size === f.length) return s;
  }
  return def.slice();
};
const lineups = [loadLU('bpg_lineup', DEFAULT_LINEUP), loadLU('bpg_lineup2', DEFAULT_LINEUP2)];
let lineup = lineups[0], startLabel = '¡AL CAMPO! ▶';   // "lineup" apunta al quinteto que se está editando
const M = { mode: 'quick', pick: 0, from: 'modes' };       // modo elegido y desde dónde se abrió el selector
const cardEls = {};
let focusNum = null, tab = 'main';
const STATS = [['VEL', 'spd'], ['TIRO', 'shot'], ['REGATE', 'ctrl'], ['ENTRADA', 'tackle'], ['PASE', 'pass'], ['PORTERO', 'gk']];
const segs = v => clamp(Math.round((v - .3) / 1.5 * 10), 1, 10);
function buildSelect() {
  const grid = $('#roster'); grid.innerHTML = '';
  for (const d of ROSTER) {
    const el = document.createElement('button'); el.type = 'button'; el.className = 'pcard' + (d.mini ? ' mini' : '');
    el.innerHTML = `<span class="pnum">${d.num}${d.captain ? ' <i class="cap">C</i>' : ''}</span><span class="ptag"></span>`;
    const cvs = document.createElement('canvas'); drawPortrait(cvs, d, 0); el.appendChild(cvs);
    const nm = document.createElement('span'); nm.className = 'pname'; nm.textContent = d.name; el.appendChild(nm);
    el.addEventListener('click', () => pickPlayer(d.num));
    grid.appendChild(el); cardEls[d.num] = el;
  }
  const note = document.createElement('div'); note.id = 'cnote';
  note.innerHTML = '★ LA CANTERA DEL BPG ★<br><span>Pequeños, rápidos y con mucha ilusión.</span>';
  grid.appendChild(note);
  document.querySelectorAll('#tabs .rbtn').forEach(b => b.addEventListener('click', () => { audio(); tone(440, .04, 'square', .04); setTab(b.dataset.t); }));
  const slots = $('#slots'); slots.innerHTML = '';
  SLOT_LBL.forEach((lbl, i) => {
    const s = document.createElement('button'); s.type = 'button'; s.className = 'slot';
    s.innerHTML = `<span class="slbl">${lbl}</span><canvas width="64" height="64"></canvas><span class="sname"></span>`;
    s.addEventListener('click', () => {
      if (lineup[i] == null) return;
      audio(); focusNum = lineup[i]; lineup[i] = null; tone(300, .05, 'square', .04); refreshSelect();
    });
    slots.appendChild(s);
  });
  refreshSelect();
}
function setTab(t) {
  tab = t;
  document.querySelectorAll('#tabs .rbtn').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  document.querySelectorAll('#tabs .rbtn').forEach(b => b.classList.toggle('dark', b.dataset.t !== t));
  for (const d of ROSTER) cardEls[d.num].hidden = !!d.mini !== (t === 'mini');
  $('#cnote').hidden = t !== 'mini';
}
function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
function pickPlayer(n) {
  audio(); focusNum = n;
  const i = lineup.indexOf(n);
  if (i >= 0) { lineup[i] = null; tone(300, .05, 'square', .04); }
  else {
    const e = needIdx(M.mode).find(k => lineup[k] == null);
    if (e === undefined) { shake($('#slots')); tone(150, .1, 'square', .05); refreshSelect('<b>' + (M.mode === 'arcade' ? 'Equipo' : 'Quinteto') + ' completo.</b> Toca un hueco de arriba para liberarlo.'); return; }
    lineup[e] = n; tone(520 + e * 80, .06, 'square', .05);
  }
  refreshSelect();
}
function showCard(f) {
  const i = lineup.indexOf(f.num), role = i >= 0 ? SLOTS[i] : 'x';
  drawPortrait($('#bigp'), Object.assign({}, f, { role }), 0);
  const card = $('#card'); card.classList.toggle('mini', !!f.mini);
  card.classList.remove('flip'); void card.offsetWidth; card.classList.add('flip');
  $('#cNum').textContent = '#' + f.num;
  $('#cName').textContent = f.full || f.name;
  $('#cSub').textContent = f.short;
  const tags = [];
  tags.push(i >= 0 ? `<em class="in">EN CAMPO · ${SLOT_LBL[i]}</em>` : '<em>BANQUILLO</em>');
  if (f.mini) tags.push('<em class="mn">MINI</em>');
  if (f.captain) tags.push('<em class="cp">CAPITÁN</em>');
  if (f.fire) tags.push('<em class="sp">🔥 FUEGO</em>');
  if (f.curve) tags.push('<em class="sp">↻ EFECTO</em>');
  if (f.quack) tags.push('<em class="sp">¡CUAC!</em>');
  if (f.big) tags.push('<em class="sp">TORRE</em>');
  if (f.gk >= 1.3) tags.push('<em class="sp">PORTERO</em>');
  $('#cTags').innerHTML = tags.join('');
  $('#cStats').innerHTML = STATS.map(([lbl, k]) => {
    const n = segs(f[k]);
    return `<div class="st"><b>${lbl}</b><i>${Array.from({ length: 10 }, (_, j) => `<s class="${j < n ? 'f' + (n >= 8 ? 3 : n >= 5 ? 2 : 1) : ''}"></s>`).join('')}</i></div>`;
  }).join('');
  $('#cDesc').textContent = f.trait;
}
function refreshSelect(msg) {
  store.set(M.pick ? 'bpg_lineup2' : 'bpg_lineup', lineup);
  const need = needIdx(M.mode);
  for (const d of ROSTER) {
    const i = lineup.indexOf(d.num), el = cardEls[d.num];
    el.classList.toggle('on', i >= 0); el.classList.toggle('focus', d.num === focusNum);
    el.querySelector('.ptag').textContent = i >= 0 ? SLOT_LBL[i] : '';
  }
  $('#slots').querySelectorAll('.slot').forEach((s, i) => {
    const n = lineup[i], cv = s.querySelector('canvas');
    s.classList.toggle('empty', n == null); s.classList.toggle('unused', !need.includes(i));
    if (n != null) { drawPortrait(cv, Object.assign({}, byNum(n), { role: SLOTS[i] }), 0); s.querySelector('.sname').textContent = byNum(n).name; }
    else { cv.width = 64; s.querySelector('.sname').textContent = '+'; }
  });
  if (focusNum == null) focusNum = lineup.find(n => n != null) ?? ROSTER[0].num;
  showCard(byNum(focusNum));
  const left = need.filter(i => lineup[i] == null).length;
  $('#pinfo').innerHTML = msg || (left ? 'Toca jugadores para ficharlos. <b>El primero es el portero.</b>'
    : M.mode === 'arcade' ? '<b>ARCADE 3 vs 3:</b> juegan POR, ALA y PÍV. Toca a un jugador para cambiarlo.' : '<b>¡Quinteto listo!</b> Toca a un jugador para cambiarlo.');
  $('#startBtn').classList.toggle('off', left > 0);
  $('#startBtn').textContent = left ? `FALTAN ${left}` : startLabel;
}

// --- escena de portada (TV + consola, estilo cartel) ---
const SW = 360, SH = 392, SCR = { x: 56, y: 32, w: 248, h: 194 };
const scene = { cv: $('#hero'), stat: null, duck: null, crowd: [], flags: [], scarves: [] };
// escudo oficial (crest.svg) también dentro de los canvas
const crestImg = new Image();
crestImg.onload = () => { scene.stat = null; };
crestImg.src = 'crest.svg';
const crestOK = () => crestImg.complete && crestImg.naturalWidth > 0;
const drawCrest = (c, x, y, s) => { if (crestOK()) c.drawImage(crestImg, x - s / 2, y - s / 2, s, s); };
const mkCv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
// "BPG" en píxel-art 3x5 (a tamaños pequeños la tipografía confundía la B con una D)
const BPG_GLYPHS = ['110101110101110', '110101110100100', '011100101101011'];
function bpgPx(c, cx, cy, s, col) {
  c.fillStyle = col;
  const x0 = cx - 11 * s / 2, y0 = cy - 5 * s / 2;
  BPG_GLYPHS.forEach((g, k) => { for (let i = 0; i < 15; i++) if (g[i] === '1') c.fillRect(x0 + (k * 4 + i % 3) * s, y0 + (i / 3 | 0) * s, s, s); });
}
function painter(c) {
  return {
    F: (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); },
    R: (x, y, w, h, r, col) => { c.fillStyle = col; c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); c.fill(); },
    E: (x, y, rx, ry, col, rot = 0) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); c.fill(); },
    P: (pts, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); c.fill(); },
    L: (pts, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.stroke(); },
    T: (txt, x, y, size, col, font = '"Press Start 2P"') => { c.fillStyle = col; c.font = `${size}px ${font}, monospace`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y); },
  };
}
(() => {
  const shirts = ['#f6c400', '#0d0d0d', '#f6c400', '#e5e7eb', '#0d0d0d', '#f6c400', '#a88600'];
  const heads = ['#e0a872', '#c68642', '#8d5524', '#f1c27d', '#ffcc1f', '#ffcc1f'];
  const tiers = [[28, 58, 2.6, 3.4], [62, 91, 3.6, 4.6], [95, 127, 5, 6.2]];
  for (const [y0, y1, s, sp] of tiers) for (let y = y0; y < y1 - s; y += sp) for (let x = 0; x < SCR.w; x += sp) {
    if (Math.random() < .06) continue;
    scene.crowd.push({ x: x + rnd(-.6, .6), y, s, c: shirts[Math.random() * shirts.length | 0], k: heads[Math.random() * heads.length | 0], ph: rnd(7), arm: s > 4 && Math.random() < .35 });
  }
  for (let i = 0; i < 9; i++) scene.flags.push({ x: 6 + i * 27 + rnd(-4, 4), y: rnd(34, 82), ph: rnd(7) });
  for (let i = 0; i < 5; i++) scene.scarves.push({ x: 18 + i * 48 + rnd(-6, 6), y: rnd(100, 116), ph: rnd(7) });
})();

// Todo lo que no se mueve: pared, tele, mesa, consola, cartuchos, mando...
function buildStatic() {
  const cv = mkCv(SW, SH), c = cv.getContext('2d'), { F, R, E, P, L, T } = painter(c);
  // pared con lamas y resplandor de la tele
  for (let x = 0; x < SW; x += 20) { F(x, 0, 20, 304, (x / 20) % 2 ? '#271d31' : '#21182b'); F(x, 0, 1, 304, '#1a1222'); }
  const g = c.createRadialGradient(180, 130, 40, 180, 130, 240);
  g.addColorStop(0, 'rgba(110,160,255,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, SW, 304);
  // póster izquierdo con el escudo
  R(2, 16, 30, 46, 2, '#6b4a26'); F(5, 19, 24, 40, '#0d0d0d');
  drawCrest(c, 17, 34, 22);
  bpgPx(c, 17, 50, 1, '#f6c400');
  // estantería con juegos
  [['#dc2626', 2, 20], ['#f6c400', 8, 26], ['#2563eb', 14, 18], ['#16a34a', 20, 22], ['#0d0d0d', 26, 27]].forEach(([col, x, h]) => {
    F(x, 150 - h, 5, h, col); F(x, 150 - h + 3, 5, 1, 'rgba(255,255,255,.35)'); F(x, 150 - h + 6, 5, 1, 'rgba(255,255,255,.2)');
  });
  F(0, 150, 34, 4, '#5a3f2c'); F(0, 154, 34, 2, '#3a281c');
  // cuadro derecho: marciano pixel
  R(328, 14, 30, 36, 2, '#6b4a26'); F(331, 17, 24, 30, '#121a33');
  ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...']
    .forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') F(332 + i * 2, 23 + j * 2, 2, 2, '#4ade80'); }));
  // banderín
  L([330, 64, 358, 64], '#9ca3af', 1.5);
  P([332, 64, 356, 64, 344, 106], '#f6c400'); P([337, 64, 351, 64, 344, 92], '#0d0d0d'); T('B', 344, 73, 7, '#f6c400');
  // TV: carcasa con degradado y brillo
  R(34, 6, 292, 296, 26, '#0b0b0b');
  const tg = c.createLinearGradient(0, 8, 0, 300); tg.addColorStop(0, '#4d4d4d'); tg.addColorStop(.6, '#353535'); tg.addColorStop(1, '#222');
  R(37, 9, 286, 290, 23, tg);
  F(62, 11, 236, 2, 'rgba(255,255,255,.14)'); F(39, 34, 2, 220, 'rgba(255,255,255,.08)');
  R(46, 20, 268, 218, 18, '#080808'); R(50, 24, 260, 210, 15, '#1a1a1a');
  // panel inferior: rejilla, placa, mandos
  for (let i = 0; i < 14; i++) R(60 + i * 8, 250, 4, 38, 2, '#141414');
  R(168, 256, 44, 15, 3, '#151515'); R(169, 257, 42, 13, 2, '#2a2a2a'); bpgPx(c, 190, 264, 1.6, '#f6c400');
  [[270, 266, 13], [298, 266, 10]].forEach(([x, y, r]) => { E(x, y + 2, r, r, '#0a0a0a'); E(x, y, r, r, '#2b2b2b'); E(x, y, r - 3, r - 3, '#4f4f4f'); E(x - 2, y - 2, r - 7, r - 7, '#5e5e5e'); F(x - 1, y - r + 2, 2, 7, '#151515'); });
  R(226, 282, 12, 5, 2, '#111'); R(242, 282, 12, 5, 2, '#111');
  R(64, 298, 30, 8, 3, '#0b0b0b'); R(266, 298, 30, 8, 3, '#0b0b0b');
  // mesa de madera
  F(0, 302, SW, 90, '#3f2b1f'); F(0, 302, SW, 5, '#5e4230'); F(0, 307, SW, 2, '#2c1e15');
  for (let y = 318; y < SH; y += 13) for (let x = ((y / 13) % 2) * 30; x < SW; x += 62) F(x, y, 36, 1, '#35251b');
  // bote de lápices
  [['#ef4444', 334, 250], ['#f6c400', 339, 244], ['#22c55e', 344, 252], ['#3b82f6', 349, 246], ['#f97316', 354, 254]].forEach(([col, x, y]) => {
    F(x, y, 4, 30, col); P([x, y, x + 4, y, x + 2, y - 6], '#f1d3a1'); F(x + 1.5, y - 6, 1, 2.5, '#333');
  });
  E(345, 304, 18, 3, 'rgba(0,0,0,.35)');
  R(330, 268, 30, 36, 3, '#1e3a8a'); F(330, 273, 30, 4, '#f6c400');
  drawCrest(c, 345, 291, 16);
  // cartuchos de la izquierda
  E(56, 384, 56, 6, 'rgba(0,0,0,.35)');
  R(4, 352, 104, 30, 4, '#3a3a3a'); R(4, 352, 104, 4, 2, '#555');
  R(10, 357, 74, 21, 2, '#0d0d0d'); R(11, 358, 72, 19, 2, '#f6c400');
  T('FORZA BPG', 47, 368, 7, '#0d0d0d');
  F(88, 357, 16, 21, '#2a2a2a'); for (let i = 0; i < 5; i++) F(90, 359 + i * 4, 12, 1, '#4a4a4a');
  c.save(); c.translate(62, 338); c.rotate(-.06);
  R(-52, -14, 104, 26, 4, '#232323'); R(-52, -14, 104, 3, 2, '#3c3c3c');
  R(-44, -10, 68, 18, 2, '#f6c400');
  drawCrest(c, -35, -1, 15);
  T('BPG', -4, 0, 10, '#0d0d0d', 'Bungee');
  for (let i = 0; i < 4; i++) F(30, -9 + i * 5, 16, 1.5, '#3c3c3c');
  c.restore();
  // consola
  E(180, 384, 78, 7, 'rgba(0,0,0,.45)');
  R(106, 334, 148, 48, 12, '#968f84');
  R(106, 324, 148, 48, 12, '#d8d2c6');
  R(116, 328, 128, 14, 7, '#e8e2d7');
  R(124, 352, 28, 10, 5, '#8a8276'); R(208, 352, 28, 10, 5, '#8a8276');
  T('POWER', 138, 368, 4, '#6b6458'); T('RESET', 222, 368, 4, '#6b6458');
  E(180, 357, 4.5, 4.5, '#7c3aed'); E(180, 356, 2.5, 2.5, '#a78bfa'); E(164, 358, 1.8, 1.8, '#ef4444');
  R(128, 372, 16, 8, 2, '#5b554c'); R(216, 372, 16, 8, 2, '#5b554c');
  // cartucho BPG metido en la consola
  F(134, 330, 92, 6, '#5d574d');
  R(136, 268, 88, 66, 5, '#1d1d1d'); R(136, 268, 88, 4, 3, '#383838');
  for (let i = 0; i < 4; i++) F(142, 275 + i * 3, 76, 1, '#333');
  R(143, 288, 74, 40, 3, '#0d0d0d'); R(144, 289, 72, 38, 2, '#f6c400');
  drawCrest(c, 162, 303, 24);
  T('BPG', 196, 304, 14, '#0d0d0d', 'Bungee'); T('FUENLABRADA', 180, 321, 5, '#0d0d0d');
  // mando
  c.strokeStyle = '#6b6b6b'; c.lineWidth = 2; c.beginPath(); c.moveTo(252, 366); c.bezierCurveTo(264, 390, 238, 392, 232, 376); c.stroke();
  E(302, 386, 52, 5, 'rgba(0,0,0,.35)');
  R(250, 344, 106, 38, 19, '#bdb6a8'); R(250, 342, 106, 36, 18, '#d4cdc1'); R(256, 348, 94, 26, 13, '#e0d9cd');
  F(263, 358, 22, 7, '#2b2b2b'); F(270.5, 350.5, 7, 22, '#2b2b2b'); F(272, 352, 4, 3, '#444');
  R(292, 365, 10, 4, 2, '#7a7366'); R(305, 365, 10, 4, 2, '#7a7366');
  [[334, 353, '#7c3aed'], [344, 361, '#ef4444'], [324, 361, '#22c55e'], [334, 369, '#eab308']].forEach(([x, y, col]) => { E(x, y + 1, 5, 5, 'rgba(0,0,0,.35)'); E(x, y, 5, 5, col); E(x - 1.5, y - 1.5, 1.6, 1.6, 'rgba(255,255,255,.5)'); });
  return cv;
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { scene.stat = null; });

function drawScene(t) {
  const cv = scene.cv;
  if (cv.width !== SW) { cv.width = SW; cv.height = SH; }
  if (!scene.stat) scene.stat = buildStatic();
  if (!scene.duck) { scene.duck = mkCv(64, 64); drawPortrait(scene.duck, { role: "x", look: "hero" }, 0); }
  const c = cv.getContext('2d'), { F, E, L, T } = painter(c);
  c.drawImage(scene.stat, 0, 0);
  const X = SCR.x, Y0 = SCR.y, W = SCR.w, H = SCR.h;
  c.save(); c.beginPath(); if (c.roundRect) c.roundRect(X, Y0, W, H, 12); else c.rect(X, Y0, W, H); c.clip();
  // cielo nocturno y focos
  const sky = c.createLinearGradient(0, Y0, 0, Y0 + 40); sky.addColorStop(0, '#081233'); sky.addColorStop(1, '#1e3f8f');
  c.fillStyle = sky; c.fillRect(X, Y0, W, 40);
  for (const fx of [X + 12, X + W - 40]) {
    const gl = c.createRadialGradient(fx + 14, Y0 + 11, 2, fx + 14, Y0 + 11, 44);
    gl.addColorStop(0, 'rgba(255,250,220,.6)'); gl.addColorStop(1, 'rgba(255,250,220,0)');
    c.fillStyle = gl; c.fillRect(fx - 32, Y0 - 30, 92, 90);
    F(fx + 13, Y0 + 16, 2, 14, '#3f3f46'); F(fx, Y0 + 5, 28, 12, '#3f3f46');
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) F(fx + 2 + i * 6.5, Y0 + 7 + j * 5, 5, 3.5, '#fffbe6');
  }
  // gradas en tres anillos
  F(X, Y0 + 26, W, 34, '#211a33'); F(X, Y0 + 60, W, 34, '#2a2140'); F(X, Y0 + 94, W, 34, '#30264a');
  for (const p of scene.crowd) {
    const dy = Math.sin(t * 6 + p.ph) > .6 ? -1 : 0;
    F(X + p.x, Y0 + p.y + p.s * .7 + dy, p.s, p.s, p.c);
    F(X + p.x + p.s * .15, Y0 + p.y + dy, p.s * .7, p.s * .7, p.k);
    if (p.arm && Math.sin(t * 5 + p.ph) > .2) { F(X + p.x - 1, Y0 + p.y - p.s * .5 + dy, 1.2, p.s, p.c); F(X + p.x + p.s, Y0 + p.y - p.s * .5 + dy, 1.2, p.s, p.c); }
  }
  F(X, Y0 + 59, W, 2, '#6b7280'); F(X, Y0 + 93, W, 2, '#6b7280');
  for (const sc of scene.scarves) for (let i = 0; i < 7; i++) F(X + sc.x + i * 3, Y0 + sc.y + Math.round(Math.sin(t * 4 + sc.ph + i) * .8), 3, 3, i % 2 ? '#0d0d0d' : '#f6c400');
  for (const fl of scene.flags) {
    F(X + fl.x, Y0 + fl.y, 1.5, 32, '#d6d3d1');
    for (let i = 0; i < 18; i++) {
      const dy = Math.round(Math.sin(t * 6 + fl.ph + i * .45) * 1.6);
      for (let j = 0; j < 12; j++) F(X + fl.x + 1.5 + i, Y0 + fl.y + j + dy, 1, 1, ((i / 4.5 | 0) + (j / 4 | 0)) % 2 ? '#0d0d0d' : '#f6c400');
    }
  }
  // vallas publicitarias
  for (let x = 0, i = 0; x < W; x += 31, i++) { F(X + x, Y0 + 127, 31, 12, i % 2 ? '#0d0d0d' : '#f6c400'); bpgPx(c, X + x + 15.5, Y0 + 133.5, 1, i % 2 ? '#f6c400' : '#0d0d0d'); }
  // césped con perspectiva
  let yy = Y0 + 139;
  [6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18].forEach((h, i) => { F(X, yy, W, h, i % 2 ? '#2f9a44' : '#278a3a'); yy += h; });
  F(X, Y0 + 139, W, 1.5, 'rgba(255,255,255,.75)');
  L([X + 30, Y0 + H, X + 66, Y0 + 154, X + W - 66, Y0 + 154, X + W - 30, Y0 + H], 'rgba(255,255,255,.55)', 1.5);
  // portería con red
  const gx1 = X + 60, gx2 = X + W - 60, gt = Y0 + 96, gb = Y0 + 141;
  F(gx1, gt, gx2 - gx1, gb - gt, 'rgba(255,255,255,.05)');
  c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = .8; c.beginPath();
  for (let x = gx1 + 6; x < gx2; x += 6) { c.moveTo(x, gt + 4); c.lineTo(x, gb - 1); }
  for (let y = gt + 6; y < gb; y += 6) { c.moveTo(gx1 + 4, y); c.lineTo(gx2 - 4, y); }
  c.stroke();
  F(gx1 - 2, gt, gx2 - gx1 + 4, 4, '#f5f5f5'); F(gx1 - 2, gt, 4, gb - gt, '#f5f5f5'); F(gx2 - 2, gt, 4, gb - gt, '#f5f5f5');
  // el pato (respira)
  const bob = Math.sin(t * 2.2) * 1.5;
  c.imageSmoothingEnabled = false;
  c.drawImage(scene.duck, X + W / 2 - 96, Y0 + 2 + Math.round(bob), 192, 192);
  c.imageSmoothingEnabled = true;
  // efecto CRT
  for (let y = Y0; y < Y0 + H; y += 2) F(X, y, W, 1, 'rgba(0,0,0,.13)');
  const vg = c.createRadialGradient(X + W / 2, Y0 + H / 2, H * .35, X + W / 2, Y0 + H / 2, H * .85);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); c.fillStyle = vg; c.fillRect(X, Y0, W, H);
  c.fillStyle = 'rgba(255,255,255,.07)'; c.beginPath(); c.moveTo(X, Y0); c.lineTo(X + 120, Y0); c.lineTo(X, Y0 + 90); c.fill();
  c.restore();
  E(214, 284.5, 2.2, 2.2, t % 1.2 < .9 ? '#ef4444' : '#7f1d1d');
}
function bindSeg(id, key, def) {
  const seg = $(id), cur = String(store.get(key, def));
  seg.querySelectorAll('button').forEach(b => {
    b.classList.toggle('on', b.dataset.v === cur);
    b.addEventListener('click', () => {
      seg.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
      store.set(key, isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v); audio(); tone(660, .05, 'square', .04);
    });
  });
}

// ================== ENTRADA ==================
// Cada mando (P1 abajo, P2 arriba y girado 180º) tiene su joystick flotante y sus botones, ligados a su propio "input".
const JR = 46;
function bindBtn(el, down, up) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault(); audio();
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    el.classList.add('pressed'); down();
  });
  const rel = () => { if (el.classList.contains('pressed')) { el.classList.remove('pressed'); up && up(); } };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => el.addEventListener(ev, rel));
}
function bindPad(root, inp, flip) {
  const zone = root.querySelector('.joyzone'), base = root.querySelector('.joybase'), knob = root.querySelector('.joyknob');
  const sg = flip ? -1 : 1;   // el mando de P2 está girado 180º: sus coordenadas locales van al revés
  let joyId = null, jcx = 0, jcy = 0;
  const placeBase = (x, y) => {
    const r = zone.getBoundingClientRect();
    base.style.left = (flip ? r.right - x : x - r.left) + 'px'; base.style.top = (flip ? r.bottom - y : y - r.top) + 'px';
  };
  const moveJoy = e => {
    let dx = e.clientX - jcx, dy = e.clientY - jcy, d = hyp(dx, dy);
    if (d > JR) { jcx += dx / d * (d - JR); jcy += dy / d * (d - JR); placeBase(jcx, jcy); dx = dx / d * JR; dy = dy / d * JR; d = JR; }
    knob.style.transform = `translate(${dx * sg}px,${dy * sg}px)`;
    const m = clamp((d / JR - .15) / .55, 0, 1);
    inp.tx = d ? dx / d * m : 0; inp.ty = d ? dy / d * m : 0;
  };
  zone.addEventListener('pointerdown', e => {
    e.preventDefault(); audio();
    if (joyId !== null) return;
    joyId = e.pointerId; try { zone.setPointerCapture(e.pointerId); } catch (_) {}
    jcx = e.clientX; jcy = e.clientY; placeBase(jcx, jcy); inp.touch = true; moveJoy(e);
  });
  zone.addEventListener('pointermove', e => { if (e.pointerId === joyId) moveJoy(e); });
  const endJoy = e => {
    if (e.pointerId !== joyId) return;
    joyId = null; inp.touch = false; inp.tx = inp.ty = 0;
    knob.style.transform = ''; base.style.left = '50%'; base.style.top = '58%';
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => zone.addEventListener(ev, endJoy));
  bindBtn(root.querySelector('.bA'), () => { inp.aDown = true; inp.aHeld = true; vib(8); }, () => { inp.aHeld = false; });
  bindBtn(root.querySelector('.bB'), () => { inp.bDown = true; vib(8); });
}
bindPad($('#pad'), inputs[0], false);
bindPad($('#pad2'), inputs[1], true);
document.addEventListener('contextmenu', e => e.preventDefault());

// Teclado. 1 jugador: flechas/WASD, Espacio/J/K = A, X/L/Shift = B.
// 2 jugadores: P1 = WASD + F (tiro) + G (pase) · P2 = flechas + . (tiro) + , (pase)
const keys = {};
const isVs = () => G.mode === 'versus';
window.addEventListener('keydown', e => {
  if (e.repeat || (e.target.closest && e.target.closest('input,textarea'))) return;
  keys[e.code] = true; audio();
  const vs = isVs(), c = e.code;
  if ((vs ? c === 'KeyF' : ['Space', 'KeyJ', 'KeyK'].includes(c))) { inputs[0].aDown = true; inputs[0].aHeld = true; e.preventDefault(); }
  if ((vs ? c === 'KeyG' : ['KeyX', 'KeyL', 'ShiftLeft', 'ShiftRight'].includes(c))) inputs[0].bDown = true;
  if (vs && c === 'Period') { inputs[1].aDown = true; inputs[1].aHeld = true; e.preventDefault(); }
  if (vs && c === 'Comma') inputs[1].bDown = true;
  if (c === 'Escape' || c === 'KeyP') togglePause();
  if (c.startsWith('Arrow')) e.preventDefault();
});
window.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (isVs() ? e.code === 'KeyF' : ['Space', 'KeyJ', 'KeyK'].includes(e.code)) inputs[0].aHeld = false;
  if (isVs() && e.code === 'Period') inputs[1].aHeld = false;
});
const kd = (...cs) => cs.some(c => keys[c]);
function keyDir(inp, l, r, u, d) {
  const x = (r ? 1 : 0) - (l ? 1 : 0), y = (d ? 1 : 0) - (u ? 1 : 0), m = hyp(x, y) || 1;
  inp.x = x / m; inp.y = y / m;
}
function readInput() {
  for (const i of inputs) if (i.touch) { i.x = i.tx; i.y = i.ty; }
  if (isVs()) {
    if (!inputs[0].touch) keyDir(inputs[0], kd('KeyA'), kd('KeyD'), kd('KeyW'), kd('KeyS'));
    if (!inputs[1].touch) keyDir(inputs[1], kd('ArrowLeft'), kd('ArrowRight'), kd('ArrowUp'), kd('ArrowDown'));
  } else if (!inputs[0].touch) keyDir(inputs[0], kd('ArrowLeft', 'KeyA'), kd('ArrowRight', 'KeyD'), kd('ArrowUp', 'KeyW'), kd('ArrowDown', 'KeyS'));
}

// ================== PAUSA / BOTONES ==================
function togglePause() {
  if (G.mode === 'online') {   // online no hay pausa: solo se abre el menú por encima de la partida, que sigue
    if ($('#pause').classList.contains('show')) showScreen(null);
    else if (['play', 'ready', 'goal'].includes(G.state)) { $('#helpVs').hidden = true; $('#helpSolo').hidden = false; showScreen('pause'); }
    return;
  }
  if (G.state === 'paused') { G.state = G.prevState; showScreen(null); }
  else if (['play', 'ready', 'goal'].includes(G.state)) {
    G.prevState = G.state; G.state = 'paused';
    $('#helpVs').hidden = !isVs(); $('#helpSolo').hidden = isVs();
    showScreen('pause');
  }
}
$('#pauseBtn').addEventListener('click', togglePause);
$('#resumeBtn').addEventListener('click', togglePause);
$('#quitBtn').addEventListener('click', () => { if (G.mode === 'online') netClose(); G.state = 'menu'; showModes(); });
$('#muteBtn').addEventListener('click', () => { S.on = !S.on; store.set('bpg_sound', S.on); $('#muteBtn').style.opacity = S.on ? 1 : .4; audio(); });
$('#muteBtn').style.opacity = S.on ? 1 : .4;
$('#toSquad').addEventListener('click', () => { audio(); sfx.quack(); showModes(); });
$('#backBtn').addEventListener('click', () => {
  if (M.mode === 'versus' && M.pick === 1) openSquad('versus', 0, M.from);
  else if (M.from === 'league') showLeague(); else showModes();
});
$('#startBtn').addEventListener('click', () => {
  audio();
  if (needIdx(M.mode).some(i => lineup[i] == null)) { shake($('#slots')); tone(150, .1, 'square', .05); return; }
  if (M.mode === 'online') { const c = NET.joinCode; showOnline(); if (c) { $('#olCode').value = c; netJoin(c); } return; }
  if (M.mode === 'versus' && M.pick === 0) { tone(660, .06, 'square', .05); openSquad('versus', 1, M.from); return; }
  if (M.mode === 'league') { if (!league) newLeague(); showLeague(); return; }
  startMatch();
});
$('#againBtn').addEventListener('click', () => { if (G.mode === 'online' && NET.role === 'guest') netRematch(); else startMatch(); });
$('#nextBtn').addEventListener('click', () => showLeague());
$('#shareBtn').addEventListener('click', shareArcade);
$('#menuBtn').addEventListener('click', () => { if (G.mode === 'online') netClose(); G.state = 'menu'; showModes(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode !== 'online' && ['play', 'ready', 'goal'].includes(G.state)) togglePause(); });

// ================== JORNADA (cartel) + MODO ADMIN ==================
const JDEF = { n: 4, rival: 'UNIÓN FUENLABRADA FS', fecha: '8/11/26', hora: '10:30', lugar: 'P. FERNANDO TORRES (1)' };
let J = Object.assign({}, JDEF);
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// ---- Escudos de rival generados (determinista por semilla) ----
const hashStr = s => { let h = 2166136261; for (const ch of norm(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) % 1000000; };
const mulberry = a => () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const CREST_SHAPES = [
  'M8,6 H56 V30 C56,46 45,55 32,60 C19,55 8,46 8,30 Z',
  'M4,32 A28,28 0 1,0 60,32 A28,28 0 1,0 4,32 Z',
  'M10,6 H54 V30 L32,60 L10,30 Z',
  'M32,3 L57,15 V43 L32,61 L7,43 V15 Z',
  'M8,6 H56 V38 Q56,58 32,60 Q8,58 8,38 Z',
];
const CREST_COLORS = [
  ['#7f1d1d', '#fca5a5', '#450a0a'], ['#14532d', '#86efac', '#052e16'], ['#4c1d95', '#c4b5fd', '#2e1065'], ['#9a3412', '#fdba74', '#431407'],
  ['#18181b', '#f4f4f5', '#000000'], ['#831843', '#f9a8d4', '#500724'], ['#134e4a', '#5eead4', '#042f2e'], ['#1e3a8a', '#fca5a5', '#172554'],
  ['#b91c1c', '#ffffff', '#450a0a'], ['#065f46', '#fde68a', '#022c22'],
];
const CREST_PATTERNS = [
  '', '<rect x="12" y="0" width="9" height="64"/><rect x="29" y="0" width="9" height="64"/><rect x="46" y="0" width="9" height="64"/>',
  '<rect x="0" y="25" width="64" height="13"/>', '<polygon points="0,18 0,32 64,54 64,40"/>', '<rect x="32" y="0" width="32" height="64"/>',
  '<path d="M0,22 L32,42 L64,22 V33 L32,53 L0,33Z"/>', '<rect x="0" y="0" width="64" height="17"/>',
];
const CREST_EMBLEMS = [
  c => `<polygon points="32,19 35.2,26.5 43.2,27.2 37.2,32.6 39,40.5 32,36.4 25,40.5 26.8,32.6 20.8,27.2 28.8,26.5" fill="${c}"/>`,
  c => `<circle cx="32" cy="30" r="8" fill="#fff"/><polygon points="32,25.5 36.3,28.6 34.6,33.6 29.4,33.6 27.7,28.6" fill="#111"/>`,
  c => `<polygon points="35,18 24,32 31,32 28,43 40,27 33,27" fill="${c}"/>`,
  c => `<polygon points="32,18 42,31 32,44 22,31" fill="${c}"/><polygon points="32,24 37,31 32,38 27,31" fill="#000" opacity=".35"/>`,
  c => `<polygon points="21,40 21,25 27,32 32,22 37,32 43,25 43,40" fill="${c}"/><rect x="21" y="40" width="22" height="3" fill="${c}"/>`,
  c => `<rect x="28" y="18" width="8" height="26" fill="${c}"/><rect x="20" y="26" width="24" height="8" fill="${c}"/>`,
  (c, t) => `<circle cx="30" cy="31" r="9.5" fill="${c}"/><circle cx="34.5" cy="28" r="8.5" fill="${t}"/><polygon points="40,36 41.2,38.8 44,39.2 42,41 42.5,44 40,42.5 37.5,44 38,41 36,39.2 38.8,38.8" fill="${c}"/>`,
];
const CREST_STOP = new Set(['CD', 'CF', 'UD', 'FC', 'FS', 'F.S.', 'DE', 'DEL', 'LA', 'EL', 'LOS', 'LAS', 'SD', 'AD', 'CDE', 'ATLETICO', 'CLUB']);
function crestSVG(rival, seed, uid = 'c') {
  const rnd = mulberry(seed >>> 0), pick = a => a[rnd() * a.length | 0];
  const shape = pick(CREST_SHAPES), [main, acc, trim] = pick(CREST_COLORS), pat = pick(CREST_PATTERNS), emb = pick(CREST_EMBLEMS);
  const words = String(rival).trim().toUpperCase().split(/\s+/).filter(w => !CREST_STOP.has(norm(w)));
  const ws = words.length ? words : String(rival).trim().toUpperCase().split(/\s+/);
  const ini = (ws.length > 1 ? ws.slice(0, 3).map(w => w[0]).join('') : ws[0].slice(0, 3)).replace(/[<>&"]/g, '');
  return `<defs><clipPath id="${uid}cp"><path d="${shape}"/></clipPath></defs>` +
    `<g clip-path="url(#${uid}cp)"><rect width="64" height="64" fill="${main}"/><g fill="${acc}" opacity=".9">${pat}</g>` +
    `<circle cx="32" cy="31" r="12" fill="${trim}" opacity=".85"/>${emb("#fff", trim)}` +
    `<rect x="0" y="43" width="64" height="11" fill="${trim}"/></g>` +
    `<path d="${shape}" fill="none" stroke="${acc}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<text x="32" y="52" font-family="Bungee,Arial Black" font-size="${ini.length > 2 ? 8 : 9}" fill="#fff" text-anchor="middle">${esc(ini)}</text>`;
}
const UNI_CREST = $('#rcrest').innerHTML;
const crestSeed = j => (j && j.seed != null && isFinite(+j.seed)) ? +j.seed : hashStr(j && j.rival || '');
function applyJornada(j) {
  J = Object.assign({}, JDEF, j || {});
  $('#jTitle').textContent = 'JORNADA ' + J.n;
  // rival en dos líneas equilibradas
  const words = String(J.rival).trim().split(/\s+/);
  let best = 1, bd = 1e9;
  for (let k = 1; k < words.length; k++) { const d = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length); if (d < bd) { bd = d; best = k; } }
  $('#jRival').innerHTML = words.length > 1 ? esc(words.slice(0, best).join(' ')) + '<br>' + esc(words.slice(best).join(' ')) : esc(words[0] || '');
  $('#jDate').textContent = J.fecha || '--';
  $('#jTime').textContent = J.hora ? J.hora.replace(/h$/i, '') + 'h' : '--';
  $('#jPlace').textContent = J.lugar || '--';
  const isUni = norm(J.rival).includes('UNION FUENLABRADA');
  rvFromJornada();
  $('#rcrest').innerHTML = isUni ? UNI_CREST : crestSVG(J.rival, crestSeed(J), 'r');
}
async function loadJornada() {
  const c = store.get('bpg_jornada', null); if (c) applyJornada(c);
  try {
    const r = await fetch('api/jornada', { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    if (j.jornada) { applyJornada(j.jornada); store.set('bpg_jornada', j.jornada); }
  } catch (e) { /* sin servidor: nos quedamos con la caché o el cartel por defecto */ }
}

// Admin: mantener pulsado POWER o RESET de la consola (portada) 1,5 s
(() => {
  const hero = $('#hero'); let t = null;
  const inBtn = e => {
    const r = hero.getBoundingClientRect(), s = Math.min(r.width / SW, r.height / SH);
    const x = (e.clientX - r.left - (r.width - SW * s) / 2) / s, y = (e.clientY - r.top - (r.height - SH * s) / 2) / s;
    return y > 344 && y < 370 && ((x > 118 && x < 158) || (x > 202 && x < 242));
  };
  hero.addEventListener('pointerdown', e => {
    if (!inBtn(e)) return;
    audio(); tone(200, .06, 'square', .03);
    clearTimeout(t); t = setTimeout(() => { t = null; tone(880, .08, 'square', .05); tone(1320, .12, 'square', .05, 0, .09); openAdmin(); }, 1500);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) hero.addEventListener(ev, () => { clearTimeout(t); t = null; });
})();

const ad = { user: '', pass: '', fails: 0, lock: 0, seed: null, manual: false };
function adCrestRefresh() {
  const rival = $('#adRival').value.trim();
  if (!ad.manual) ad.seed = hashStr(rival);
  $('#adCrest').innerHTML = norm(rival).includes('UNION FUENLABRADA') ? UNI_CREST : crestSVG(rival || '?', ad.seed, 'p');
}
$('#adRival').addEventListener('input', adCrestRefresh);
$('#adDice').addEventListener('click', () => { ad.manual = true; ad.seed = Math.random() * 1000000 | 0; tone(500, .05, 'square', .04); adCrestRefresh(); });
const adMsg = (id, txt, cls = '') => { const el = $(id); el.textContent = txt; el.className = 'admsg ' + cls; };
const AD_ERR = {
  BAD_CREDENTIALS: 'Usuario o clave incorrectos.', TOO_MANY_ATTEMPTS: 'Demasiados intentos. Espera 15 minutos.',
  ADMIN_NOT_CONFIGURED: 'Falta configurar ADMIN_USER y ADMIN_PASS en Vercel.', REDIS_NOT_CONFIGURED: 'Falta conectar la base de datos (Upstash) en Vercel.',
  INVALID_DATA: 'Datos no válidos: hace falta jornada y rival.', SERVER_ERROR: 'Error del servidor. Inténtalo de nuevo.',
};
async function adPost(path, body) {
  try {
    const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let j = {}; try { j = await r.json(); } catch (e) { /* respuesta no JSON */ }
    if (!r.ok && !j.error) j.error = r.status === 404 || r.status === 405 ? 'NO_SERVER' : 'SERVER_ERROR';
    return { ok: r.ok, status: r.status, j };
  } catch (e) { return { ok: false, status: 0, j: { error: 'NO_SERVER' } }; }
}
const adErr = e => e === 'NO_SERVER' ? 'Sin conexión con el servidor. En local usa "npx vercel dev".' : (AD_ERR[e] || AD_ERR.SERVER_ERROR);
function openAdmin() {
  ad.user = ad.pass = ''; $('#adUser').value = $('#adPass').value = '';
  $('#adLogin').hidden = false; $('#adForm').hidden = true; adMsg('#adMsg1', '');
  showScreen('admin');
}
function closeAdmin() { ad.user = ad.pass = ''; $('#adUser').value = $('#adPass').value = ''; $('#adText').value = ''; showScreen('title'); }
document.querySelectorAll('#admin [data-close]').forEach(b => b.addEventListener('click', closeAdmin));
$('#adLogin').addEventListener('submit', async e => {
  e.preventDefault();
  if (Date.now() < ad.lock) { adMsg('#adMsg1', 'Bloqueado unos segundos. Espera un poco.', 'err'); return; }
  const user = $('#adUser').value.trim(), pass = $('#adPass').value;
  adMsg('#adMsg1', 'Comprobando…');
  const r = await adPost('api/jornada', { user, pass, action: 'login' });
  if (r.ok) {
    ad.user = user; ad.pass = pass; ad.fails = 0;
    $('#adPass').value = '';
    $('#adN').value = J.n; $('#adFecha').value = J.fecha; $('#adHora').value = J.hora; $('#adRival').value = J.rival; $('#adLugar').value = J.lugar;
    ad.manual = J.seed != null; ad.seed = J.seed != null ? +J.seed : null; adCrestRefresh();
    adMsg('#adMsg2', ''); $('#adLogin').hidden = true; $('#adForm').hidden = false; tone(660, .08, 'square', .05);
  } else if (r.status === 401) {
    ad.fails++; tone(150, .15, 'square', .06);
    if (ad.fails >= 3) { ad.lock = Date.now() + 30000; ad.fails = 0; adMsg('#adMsg1', 'Tres intentos fallidos. Bloqueado 30 s.', 'err'); }
    else adMsg('#adMsg1', adErr(r.j.error) + ' (' + ad.fails + '/3)', 'err');
  } else adMsg('#adMsg1', adErr(r.j.error), 'err');
});
$('#adParse').addEventListener('click', async () => {
  const text = $('#adText').value.trim(); if (!text) { adMsg('#adMsg2', 'Pega primero el mensaje.', 'err'); return; }
  adMsg('#adMsg2', 'Interpretando…');
  const r = await adPost('api/parse', { user: ad.user, pass: ad.pass, text });
  if (!r.ok) { adMsg('#adMsg2', adErr(r.j.error), 'err'); return; }
  const d = r.j.data || {};
  if (d.n) $('#adN').value = d.n;
  if (d.fecha) $('#adFecha').value = d.fecha;
  if (d.hora) $('#adHora').value = d.hora;
  if (d.rival) { $('#adRival').value = d.rival; adCrestRefresh(); }
  if (d.lugar) $('#adLugar').value = d.lugar;
  adMsg('#adMsg2', (r.j.via === 'ai' ? 'Interpretado con IA' : 'Interpretación básica') + '. Revisa los datos y pulsa GUARDAR.', 'ok');
});
$('#adForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = { n: $('#adN').value, fecha: $('#adFecha').value, hora: $('#adHora').value, rival: $('#adRival').value, lugar: $('#adLugar').value, seed: ad.manual ? ad.seed : null };
  if (!+data.n || !data.rival.trim()) { adMsg('#adMsg2', 'Hace falta número de jornada y rival.', 'err'); return; }
  adMsg('#adMsg2', 'Guardando…');
  const r = await adPost('api/jornada', { user: ad.user, pass: ad.pass, data });
  if (!r.ok) { adMsg('#adMsg2', adErr(r.j.error), 'err'); return; }
  applyJornada(r.j.jornada); store.set('bpg_jornada', r.j.jornada);
  adMsg('#adMsg2', '¡Jornada guardada! ✔', 'ok'); sfx.goal();
  setTimeout(closeAdmin, 1100);
});

// ================== MODOS · LIGA · ARCADE ==================
function rvFromJornada() {
  const words = String(J.rival).trim().split(/\s+/);
  const isUni = norm(J.rival).includes('UNION FUENLABRADA');
  const key = words.find(w => norm(w).length > 2) || words[0] || 'RIVAL';
  setRV(isUni ? 'UNI' : norm(key).slice(0, 3), isUni ? 'UNIÓN' : key, isUni ? 'UNIÓN FS' : String(J.rival).slice(0, 16));
}

// --- Liga: 6 equipos ficticios, todos contra todos a una vuelta (5 jornadas). Edita aquí nombres y fuerza (0 = flojo, 1 = crack).
const LG_TEAMS = [
  { name: 'BPG FUENLABRADA', short: 'BPG', str: .5 },
  { name: 'GAVIOTAS FS', short: 'GAV', str: .1 },
  { name: 'REAL CHARCA', short: 'CHA', str: .3 },
  { name: 'ATLÉTICO ESTANQUE', short: 'EST', str: .5 },
  { name: 'BAÑERA UNITED', short: 'BAÑ', str: .7 },
  { name: 'DEPORTIVO COCODRILO', short: 'COC', str: .9 },
];
const LG_ROUNDS = LG_TEAMS.length - 1;
let league = (() => {
  const l = store.get('bpg_league', null);
  const ok = l && Array.isArray(l.t) && l.t.length === LG_TEAMS.length && Array.isArray(l.fx) && l.fx.length === LG_ROUNDS && l.round >= 0 && l.round <= LG_ROUNDS;
  return ok ? l : null;
})();
function lgFixtures(n) {   // método del círculo: cada equipo juega una vez contra cada otro
  const ids = [...Array(n).keys()], rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const m = [];
    for (let i = 0; i < n / 2; i++) m.push([ids[i], ids[n - 1 - i]]);
    rounds.push(m);
    ids.splice(1, 0, ids.pop());
  }
  return rounds.reverse();   // así los rivales del BPG van de más flojo a más duro (jefe final en la última jornada)
}
function newLeague() {
  league = { round: 0, fx: lgFixtures(LG_TEAMS.length), t: LG_TEAMS.map(() => ({ P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 })) };
  store.set('bpg_league', league);
}
const lgSorted = () => league.t.map((s, i) => Object.assign({ i }, s))
  .sort((a, b) => b.Pts - a.Pts || (b.GF - b.GA) - (a.GF - a.GA) || b.GF - a.GF || a.i - b.i);
function lgApply(a, b, ga, gb) {
  const A = league.t[a], B = league.t[b];
  A.P++; B.P++; A.GF += ga; A.GA += gb; B.GF += gb; B.GA += ga;
  if (ga > gb) { A.W++; A.Pts += 3; B.L++; } else if (ga < gb) { B.W++; B.Pts += 3; A.L++; } else { A.D++; B.D++; A.Pts++; B.Pts++; }
}
const poisson = l => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; };
const simGoals = (sa, sb) => poisson(clamp(2.1 + (sa - sb) * 1.4, .6, 3.8));
const lgOpp = () => { const m = league.fx[league.round].find(x => x[0] === 0 || x[1] === 0); return m[0] === 0 ? m[1] : m[0]; };
function lgReport(a, c) {   // a = goles del BPG, c = goles del rival. Juega la jornada entera (los demás partidos se simulan).
  const opp = lgOpp();
  for (const [x, y] of league.fx[league.round]) {
    if (x === 0 || y === 0) { lgApply(0, opp, a, c); continue; }
    lgApply(x, y, simGoals(LG_TEAMS[x].str, LG_TEAMS[y].str), simGoals(LG_TEAMS[y].str, LG_TEAMS[x].str));
  }
  league.round++;
  const pos = lgSorted().findIndex(r => r.i === 0) + 1, finished = league.round >= LG_ROUNDS;
  if (finished && pos === 1) store.set('bpg_titles', store.get('bpg_titles', 0) + 1);
  store.set('bpg_league', league);
  return { pos, finished };
}
const lgCrest = (i, uid = 'lt') => i === 0 ? '<img class="lgc" src="crest.svg" alt="">'
  : `<svg class="lgc" viewBox="0 0 64 64">${crestSVG(LG_TEAMS[i].name, hashStr(LG_TEAMS[i].name), uid + i)}</svg>`;
let lgArm = 0;
function showLeague() {
  G.state = 'menu'; hideBanner(); lgArm = 0;
  const fin = league.round >= LG_ROUNDS, rows = lgSorted(), pos = rows.findIndex(r => r.i === 0) + 1;
  $('#lgRound').textContent = fin ? 'LIGA FINALIZADA' : `JORNADA ${league.round + 1} DE ${LG_ROUNDS}`;
  if (fin) {
    $('#lgNext').innerHTML = `<div class="lgend">${pos === 1 ? '🏆 ¡CAMPEONES! 🏆' : pos + 'º CLASIFICADO'}</div><div class="lgd">TÍTULOS: ${store.get('bpg_titles', 0)}</div>`;
  } else {
    const o = lgOpp(), t = LG_TEAMS[o], st = 1 + Math.round(t.str * 4);
    $('#lgNext').innerHTML = `<div class="matchup"><img class="crest" src="crest.svg" alt=""><div class="tname">BPG<br>FUENLABRADA</div><div class="vs">VS</div>` +
      `<div class="tname">${esc(t.name)}</div><svg class="crest" viewBox="0 0 64 64">${crestSVG(t.name, hashStr(t.name), 'lx')}</svg></div>` +
      `<div class="lgd">RIVAL ${'★'.repeat(st)}${'☆'.repeat(5 - st)}</div>`;
  }
  $('#lgTable').innerHTML = '<div class="lgr h"><b>#</b><span class="lgn">EQUIPO</span><i>PJ</i><i>DG</i><i>PTS</i></div>' +
    rows.map((r, k) => {
      const gd = r.GF - r.GA;
      return `<div class="lgr${r.i === 0 ? ' me' : ''}"><b>${k + 1}</b><span class="lgn">${lgCrest(r.i)}${esc(LG_TEAMS[r.i].name)}</span><i>${r.P}</i><i>${gd > 0 ? '+' : ''}${gd}</i><i>${r.Pts}</i></div>`;
    }).join('');
  $('#lgPlay').hidden = fin; $('#lgSquad').hidden = fin;
  $('#lgNew').textContent = fin ? 'NUEVA LIGA ▶' : 'REINICIAR';
  $('#lgNew').classList.toggle('dark', !fin);
  showScreen('league');
}
$('#lgBack').addEventListener('click', () => { audio(); showModes(); });
$('#lgSquad').addEventListener('click', () => { audio(); openSquad('league', 0, 'league'); });
$('#lgPlay').addEventListener('click', () => { audio(); M.mode = 'league'; startMatch(); });
$('#lgNew').addEventListener('click', () => {
  audio();
  const fin = league.round >= LG_ROUNDS;
  if (!fin && !lgArm) {
    lgArm = 1; $('#lgNew').textContent = '¿SEGURO?';
    setTimeout(() => { if (lgArm) { lgArm = 0; $('#lgNew').textContent = 'REINICIAR'; } }, 2500);
    return;
  }
  newLeague(); tone(660, .08, 'square', .05); showLeague();
});

// --- Menú de modos
function showModes() {
  G.state = 'menu'; hideBanner(); $('#app').classList.remove('vs');
  const r = store.get('bpg_rec', null), ar = store.get('bpg_arcade', null), ti = store.get('bpg_titles', 0);
  $('#mQuick').textContent = r ? `${r.w}V · ${r.d}E · ${r.l}D` : '';
  $('#mArcade').textContent = ar && ar.best ? `RÉCORD ${ar.best}` : '';
  let lg = '';
  if (league) {
    const pos = lgSorted().findIndex(x => x.i === 0) + 1;
    lg = league.round >= LG_ROUNDS ? `TERMINADA · ${pos}º` : `JORNADA ${league.round + 1}/${LG_ROUNDS} · ${pos}º`;
  }
  if (ti) lg += (lg ? ' · ' : '') + '🏆 ' + ti;
  $('#mLeague').textContent = lg;
  showScreen('modes');
}
function openSquad(mode, pick = 0, from = 'modes') {
  Object.assign(M, { mode, pick, from });
  lineup = lineups[pick]; focusNum = null; setTab('main');
  $('#sqTitle').textContent = { quick: 'TU QUINTETO', league: 'QUINTETO LIGA', arcade: 'EQUIPO ARCADE', versus: pick ? 'QUINTETO · P2' : 'QUINTETO · P1', online: 'QUINTETO ONLINE' }[mode];
  $('#optDiff').hidden = mode !== 'quick'; $('#optDur').hidden = mode === 'arcade';
  startLabel = (mode === 'versus' && pick === 0) || mode === 'online' ? 'SIGUIENTE ▶' : mode === 'league' ? 'ACEPTAR ▶' : '¡AL CAMPO! ▶';
  refreshSelect(); showScreen('squad');
}
document.querySelectorAll('#modes .mode').forEach(b => b.addEventListener('click', () => {
  audio(); tone(520, .06, 'square', .05);
  const m = b.dataset.m;
  if (m === 'league' && league) { M.mode = 'league'; showLeague(); } else openSquad(m, 0, 'modes');
}));
$('#modesBack').addEventListener('click', () => { audio(); showScreen('title'); });

// --- Arcade: compartir la puntuación
function shareArcade() {
  const g = G.score[0];
  const txt = `🦆⚽ Mi pato marcó ${g} gol${g === 1 ? '' : 'es'} en 60 segundos en BPG Futsal Ducks. ¿Me superas?`;
  const url = location.href.split('?')[0];
  if (navigator.share) navigator.share({ text: txt, url }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(txt + ' ' + url).then(() => {
    $('#shareBtn').textContent = '¡COPIADO!'; setTimeout(() => { $('#shareBtn').textContent = '↗ COMPARTIR'; }, 1600);
  }).catch(() => {});
}

// ================== ONLINE (WebRTC con PeerJS: gratis y sin servidor propio) ==================
// Anfitrión = autoridad: corre el partido entero (juega el equipo amarillo) y manda ~30 "fotos" por segundo.
// Invitado = solo manda sus controles y dibuja lo que recibe, con la vista girada (su equipo, el azul, queda abajo).
// PeerJS solo hace de "casamentero" (servicio público gratuito); el juego va directo de móvil a móvil.
const NET_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', NET_PREFIX = 'bpgfd-', NET_HZ = 30, NET_DELAY = 110;
const netCode = () => Array.from({ length: 5 }, () => NET_ALPHA[Math.random() * NET_ALPHA.length | 0]).join('');
const r0 = Math.round, r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
const olMsg = (t, cls = '') => { const el = $('#olStatus'); el.textContent = t; el.className = cls; };
const scorerNames = l => { const n = {}; l.forEach(x => n[x] = (n[x] || 0) + 1); return l.length ? Object.entries(n).map(([k, v]) => k + (v > 1 ? ' x' + v : '')).join('<br>') : '-'; };
const validLU = l => Array.isArray(l) && l.length === 5 && l.every(n => byNum(n)) && new Set(l).size === 5;
const netSend = o => { try { if (NET.conn && NET.conn.open) NET.conn.send(o); } catch (e) {} };

function netClose() {
  const c = NET.conn, p = NET.peer, live = NET.live;
  if (c && live) { try { c.send({ k: 'bye' }); } catch (e) {} }
  clearTimeout(NET.timer);
  Object.assign(NET, { role: null, peer: null, conn: null, live: false, inMatch: false, code: '', ev: [], buf: [], remoteLu: null, hostLu: null,
    an: 0, bn: 0, anSeen: 0, bnSeen: 0, rm: false, seq: 0, rtt: 0 });
  Object.assign(inputs[1], mkInput());
  $('#netBadge').hidden = true; G.flip = false;
  try { c && c.close(); } catch (e) {}
  try { p && p.destroy(); } catch (e) {}
}
function olHome(msg, cls) {
  $('#olHome').hidden = false; $('#olWait').hidden = true; olMsg(msg || '', cls || '');
  $('#olCreate').classList.remove('off'); $('#olJoin').classList.remove('off');
  showScreen('online');
}
function showOnline() { netClose(); G.state = 'menu'; hideBanner(); olHome(); }
function netFail(msg) { netClose(); G.state = 'menu'; hideBanner(); olHome(msg, 'err'); }
const netErr = e => netFail(({
  'peer-unavailable': 'No existe esa sala. Revisa el código.',
  'network': 'Sin conexión con el servidor de salas.',
  'server-error': 'El servidor de salas no responde. Prueba en un rato.',
  'socket-error': 'Sin conexión con el servidor de salas.',
  'socket-closed': 'Sin conexión con el servidor de salas.',
  'browser-incompatible': 'Este navegador no admite partidas online.',
  'webrtc': 'No se pudo abrir la conexión directa. Prueba con otra red.',
})[e && e.type] || 'No se pudo conectar (' + ((e && e.type) || 'error') + ').');

function netCreate(tries = 0) {
  if (typeof Peer === 'undefined') return olMsg('No se pudo cargar el módulo online. Revisa tu conexión.', 'err');
  netClose(); NET.role = 'host'; NET.code = netCode();
  olMsg('Creando sala…'); $('#olCreate').classList.add('off');
  let peer;
  try { peer = new Peer(NET_PREFIX + NET.code); } catch (e) { return netFail('No se pudo crear la sala.'); }
  NET.peer = peer;
  peer.on('open', () => { if (NET.peer === peer) showWait(); });
  peer.on('connection', c => {
    if (NET.peer !== peer) return;
    if (NET.conn) { c.on('open', () => { try { c.close(); } catch (e) {} }); return; }   // sala ocupada
    netAttach(c);
  });
  peer.on('error', e => {
    if (NET.peer !== peer) return;
    if (e && e.type === 'unavailable-id' && tries < 5) return netCreate(tries + 1);   // código repetido: otro
    if (NET.live) return;   // con la partida en marcha el juego va directo; el servidor ya no hace falta
    netErr(e);
  });
}
function netJoin(code) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 5) return olMsg('El código tiene 5 caracteres.', 'err');
  if (typeof Peer === 'undefined') return olMsg('No se pudo cargar el módulo online. Revisa tu conexión.', 'err');
  netClose(); NET.role = 'guest'; NET.code = code;
  olMsg('Conectando…'); $('#olJoin').classList.add('off');
  let peer;
  try { peer = new Peer(); } catch (e) { return netFail('No se pudo conectar.'); }
  NET.peer = peer;
  peer.on('open', () => {
    if (NET.peer !== peer) return;
    netAttach(peer.connect(NET_PREFIX + code, { reliable: true, serialization: 'json' }));
    NET.timer = setTimeout(() => { if (NET.peer === peer && !NET.live) netFail('No se pudo conectar. ¿Código correcto? Prueba con otra red.'); }, 15000);
  });
  peer.on('error', e => { if (NET.peer === peer && !NET.live) netErr(e); });
}
function netAttach(c) {
  NET.conn = c;
  c.on('open', () => {
    if (NET.conn !== c) return;
    clearTimeout(NET.timer);
    NET.live = true; NET.lastRx = performance.now();
    netSend({ k: 'hi', lu: lineups[0] });
    olMsg('Conectado ✔ Intercambiando equipos…', 'ok');
  });
  c.on('data', m => { if (NET.conn === c && m && typeof m === 'object') { NET.lastRx = performance.now(); netData(m); } });
  c.on('close', () => { if (NET.conn === c) netFail('El rival se ha desconectado.'); });
  c.on('error', () => { if (NET.conn === c) netFail('Se perdió la conexión.'); });
}
function showWait() {
  const host = NET.role === 'host', ready = NET.live && (host ? NET.remoteLu : NET.hostLu);
  $('#olHome').hidden = true; $('#olWait').hidden = false;
  $('#olTitle').textContent = host ? 'CÓDIGO DE SALA' : 'SALA';
  $('#olBig').textContent = NET.code;
  $('#olShare').hidden = !host; $('#olStart').hidden = !(host && ready);
  olMsg(host ? (ready ? '¡Rival conectado! Pulsa EMPEZAR.' : 'Esperando a tu rival… Pásale el código o el enlace.')
    : (ready ? 'Conectado ✔ Esperando a que el anfitrión empiece…' : 'Conectando…'), ready ? 'ok' : '');
  showScreen('online');
}
function netData(m) {
  switch (m.k) {
    case 'hi':
      if (!validLU(m.lu)) return;
      if (NET.role === 'host') NET.remoteLu = m.lu; else NET.hostLu = m.lu;
      if (!NET.inMatch) showWait();
      break;
    case 'init': if (NET.role === 'guest') guestStart(m); break;
    case 's': if (NET.role === 'guest' && NET.inMatch && m.q > (NET.buf.length ? NET.buf[NET.buf.length - 1].s.q : 0)) NET.buf.push({ at: performance.now(), s: m, done: false }); break;
    case 'i':
      if (NET.role === 'host') {
        const i = inputs[1];
        i.x = clamp(+m.x || 0, -1, 1); i.y = clamp(+m.y || 0, -1, 1); i.aHeld = !!m.ah;
        if (m.an > NET.anSeen) { NET.anSeen = m.an; i.aDown = true; }
        if (m.bn > NET.bnSeen) { NET.bnSeen = m.bn; i.bDown = true; }
      }
      break;
    case 'rm':
      NET.rm = true;
      if ($('#final').classList.contains('show')) $('#finalRecord').textContent = 'EL RIVAL QUIERE REVANCHA';
      break;
    case 'p': netSend({ k: 'o', t: m.t }); break;
    case 'o': NET.rtt = Math.round(performance.now() - m.t); break;
    case 'bye': netFail('El rival ha salido de la partida.'); break;
  }
}
function netRematch() {
  NET.rm = true; netSend({ k: 'rm' });
  $('#againBtn').textContent = 'ESPERANDO AL ANFITRIÓN…';
}
function netSendInit() { netSend({ k: 'init', l0: lineups[0], l1: NET.remoteLu, dur: G.dur }); }

// --- latido, envío periódico y pings
function netTick(now) {
  if (!NET.live) return;
  if (now - NET.lastPing > 1500) { NET.lastPing = now; netSend({ k: 'p', t: now }); }
  if (now - NET.lastRx > 7000) return netFail('Se perdió la conexión con el rival.');
  if (NET.inMatch && now - NET.lastBadge > 1000) {
    NET.lastBadge = now; const b = $('#netBadge'); b.hidden = false; b.textContent = NET.rtt ? '● ' + NET.rtt + ' ms' : '● …';
    b.style.color = NET.rtt > 200 ? '#f87171' : NET.rtt > 100 ? '#fbbf24' : '#86efac';
  }
  if (!NET.inMatch || now - NET.lastTx < 1000 / NET_HZ - 3) return;
  NET.lastTx = now;
  if (NET.role === 'host') netSendSnap(); else netSendInput();
}
function netSendInput() {   // invitado -> anfitrión. Pulsaciones como contadores acumulados: no se pierde ninguna aunque falle algún paquete.
  const i = inputs[0];
  if (i.aDown) { NET.an++; i.aDown = false; }
  if (i.bDown) { NET.bn++; i.bDown = false; }
  // el invitado ve el campo girado 180º, así que sus ejes van invertidos respecto al campo real
  netSend({ k: 'i', x: r2(-i.x), y: r2(-i.y), ah: i.aHeld ? 1 : 0, an: NET.an, bn: NET.bn });
}
function netSendSnap() {   // anfitrión -> invitado
  const c = NET.conn;
  if (!c || !c.open) return;
  if (c.dataChannel && c.dataChannel.bufferedAmount > 30000) return;   // la red no da más: no acumular retardo
  const b = G.ball, Ps = G.players;
  netSend({ k: 's', q: ++NET.seq, st: G.state, tm: r2(G.time), sc: G.score, sh: r2(G.shake), cj: r2(G.crowdJump), u: [Ps.indexOf(G.u[0]), Ps.indexOf(G.u[1])],
    p: Ps.map(p => [r1(p.x), r1(p.y), r2(p.fx), r2(p.fy), r0(p.vx), r0(p.vy), (p.stun > 0 ? 1 : 0) | (p.charging ? 2 : 0) | (p.dash > 0 ? 4 : 0), r2(p.charge || 0), r1(p.hop || 0)]),
    b: [r1(b.x), r1(b.y), r0(b.vx), r0(b.vy), Ps.indexOf(b.owner), b.fire ? 1 : 0, b.scary ? 1 : 0],
    ev: NET.ev.splice(0) });
}

// --- lado invitado: reconstruir la partida y dibujarla con un pequeño retardo para suavizar
function guestStart(m) {
  if (!validLU(m.l0) || !validLU(m.l1)) return;
  const mk = (lu, t) => [0, 1, 2, 3, 4].map(i => newP(Object.assign({}, byNum(lu[i]), { role: SLOTS[i] }), t));
  G.mode = 'online'; G.hum = [false, true]; G.flip = true;
  G.players = [...mk(m.l0, 0), ...mk(m.l1, 1)];
  G.ball = newBall(); G.u = [null, null];
  G.score = [0, 0]; G.scorers = []; G.scorers1 = []; G.particles = [];
  G.dur = G.time = +m.dur || 120; G.state = 'ready'; G.shake = 0; G.crowdJump = 0;
  setRV('TÚ', 'TÚ', 'TÚ', 'RIV');
  NET.buf = []; NET.inMatch = true; NET.rm = false;
  $('#app').classList.remove('vs'); hideBanner();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  showScreen(null);
}
function guestDiscrete(s) {
  G.state = s.st; G.score = s.sc; G.time = s.tm; G.shake = s.sh; G.crowdJump = s.cj;
  G.u = [s.u[0] >= 0 ? G.players[s.u[0]] : null, s.u[1] >= 0 ? G.players[s.u[1]] : null];
  for (const e of s.ev || []) guestEv(e);
}
function guestEv(e) {
  switch (e[0]) {
    case 'b': banner(e[1], e[2], e[3]); break;
    case 'h': hideBanner(); break;
    case 'fh': flashHide(); break;
    case 's': { const f = sfx[e[1]]; if (f) f(...(e[2] || [])); break; }
    case 'ko': banner(e[1] === 1 ? 'SACA TÚ' : 'SACA RIVAL', '', e[1] === 0 ? 'small' : 'small blue'); break;
    case 'g': {
      const t = e[1];
      banner(t === 1 ? '¡GOOOL!' : 'GOL RIVAL', e[3], t === 0 ? '' : 'blue'); goalFx(t, e[2]);
      if (t === 1) { sfx.goal(); vib([60, 40, 140]); } else { tone(300, .4, 'square', .05, 120, .2); vib(80); }
      break;
    }
    case 'end': guestEnd(e[1], e[2], e[3], e[4]); break;
  }
}
function guestEnd(a, c, s0, s1) {   // a = goles del anfitrión (amarillo), c = goles del invitado (tú, azul)
  setTimeout(() => {
    $('#f0').textContent = a; $('#f1').textContent = c;
    $('#finalMsg').textContent = c > a ? '¡GANAS! CUAC CUAC' : c < a ? 'HAS PERDIDO... ¡REVANCHA!' : 'EMPATE. ¡REVANCHA!';
    $('#finalScorers').innerHTML = '<span class="s">TÚ</span><br>' + scorerNames(s1) + '<br><br><span class="y">RIVAL</span><br>' + scorerNames(s0);
    $('#finalRecord').textContent = '';
    $('#againBtn').textContent = '↻ REVANCHA'; $('#againBtn').hidden = false; $('#nextBtn').hidden = true; $('#shareBtn').hidden = true;
    showScreen('final');
    if (c > a) sfx.goal();
  }, 1500);
}
function guestFrame(now, dt) {
  const B = NET.buf, rt = now - NET_DELAY;
  for (const sn of B) if (!sn.done && sn.at <= rt) { sn.done = true; guestDiscrete(sn.s); }
  G.t += dt;
  if (B.length) {
    let i = B.length - 1;
    while (i > 0 && B[i].at > rt) i--;
    const a = B[i].s, bb = (B[i + 1] || B[i]).s, f = B[i + 1] ? clamp((rt - B[i].at) / (B[i + 1].at - B[i].at), 0, 1) : 1;
    const Ps = G.players;
    for (let k = 0; k < Ps.length; k++) {
      const p = Ps[k], pa = a.p[k], pb = bb.p[k];
      if (!pa || !pb) continue;
      p.x = lerp(pa[0], pb[0], f); p.y = lerp(pa[1], pb[1], f);
      const fx = lerp(pa[2], pb[2], f), fy = lerp(pa[3], pb[3], f), fl = hyp(fx, fy) || 1;
      p.fx = fx / fl; p.fy = fy / fl; p.vx = pb[4]; p.vy = pb[5];
      p.stun = pb[6] & 1; p.charging = !!(pb[6] & 2); p.dash = pb[6] & 4 ? 1 : 0; p.charge = pb[7]; p.hop = pb[8];
      p.anim += dt * hyp(p.vx, p.vy) / 55;
      if (p.dash > 0 && Math.random() < .5) G.particles.push({ x: p.x - p.fx * 6, y: p.y - p.fy * 6, vx: 0, vy: 0, life: .2, col: p.team ? '#bae6fd' : '#fde68a', s: 2 });
    }
    const bl = G.ball, ba = a.b, bn = bb.b;
    bl.x = lerp(ba[0], bn[0], f); bl.y = lerp(ba[1], bn[1], f); bl.vx = bn[2]; bl.vy = bn[3];
    bl.owner = bn[4] >= 0 ? Ps[bn[4]] : null; bl.fire = !!bn[5]; bl.scary = !!bn[6];
    bl.spin += hyp(bl.vx, bl.vy) * dt * .2;
    bl.trail.push([bl.x, bl.y]); if (bl.trail.length > 7) bl.trail.shift();
    if (bl.fire) for (let j = 0; j < 2; j++) G.particles.push({ x: bl.x + rnd(-1.5, 1.5), y: bl.y + rnd(-1.5, 1.5), vx: rnd(-20, 20), vy: rnd(-20, 20), life: rnd(.2, .4), col: ['#ef4444', '#f97316', '#fde047'][j + (Math.random() < .5 ? 0 : 1)], s: rnd(1.5, 3) });
    while (B.length > 3 && B[1].at < rt - 300) B.shift();
  }
  updParticles(dt);
}

// --- pantalla ONLINE
$('#olCreate').addEventListener('click', () => { audio(); if (!$('#olCreate').classList.contains('off')) netCreate(); });
$('#olJoin').addEventListener('click', () => { audio(); if (!$('#olJoin').classList.contains('off')) netJoin($('#olCode').value); });
$('#olCode').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
$('#olCode').addEventListener('keydown', e => { if (e.key === 'Enter') $('#olJoin').click(); });
$('#olBack').addEventListener('click', () => { audio(); netClose(); showModes(); });
$('#olStart').addEventListener('click', () => { audio(); M.mode = 'online'; startMatch(); });
$('#olShare').addEventListener('click', () => {
  const url = location.origin + location.pathname + '?sala=' + NET.code;
  const txt = `🦆⚽ ¡Te reto a un partido de BPG Futsal Ducks! Sala ${NET.code}`;
  if (navigator.share) navigator.share({ text: txt, url }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(txt + ' ' + url).then(() => {
    $('#olShare').textContent = '¡ENLACE COPIADO!'; setTimeout(() => { $('#olShare').textContent = '↗ COMPARTIR ENLACE'; }, 1600);
  }).catch(() => {});
});

// ================== BUCLE ==================
let last = performance.now(), acc = 0;
const DT = 1 / 60;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  readInput();
  if (NET.role === 'guest' && NET.inMatch) { guestFrame(now, dt); acc = 0; }   // el invitado no simula: dibuja lo que manda el anfitrión
  else if (G.state !== 'menu' && G.state !== 'paused') {
    acc += dt;
    while (acc >= DT) { step(DT); acc -= DT; }
  } else acc = 0;
  netTick(now);
  if (titleEl.classList.contains('show')) drawScene(now / 1000);
  else if (G.ball) render();
  hud();
}

// init
const titleEl = $('#title');
buildSelect();
setTab('main');
loadJornada();
bindSeg('#segDiff', 'bpg_diff', 'normal');
bindSeg('#segDur', 'bpg_dur', 120);
G.ball = newBall();
SQUAD = DEFAULT_LINEUP.map((n, i) => Object.assign({}, byNum(n), { role: SLOTS[i] }));
G.players = [...SQUAD.map(d => newP(d, 0)), ...RIVAL.map(d => newP(d, 1))];
G.u[0] = G.players[4];
fitCanvas();
// enlace de invitación (?sala=ABCDE): ir directo a elegir quinteto y unirse
(() => {
  const c = (new URLSearchParams(location.search).get('sala') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  if (c.length === 5) { NET.joinCode = c; openSquad('online', 0, 'modes'); }
})();
requestAnimationFrame(frame);
if (/[?&]debug/.test(location.search)) window.__BPG = { G, M, inputs, step, startMatch, render, crestSVG, hashStr, applyJornada, getLeague: () => league, newLeague, lgReport, showLeague, showModes, openSquad, endMatch, NET, netCreate, netJoin, netClose };
})();
