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
];
const SLOTS = ['gk', 'def', 'wl', 'wr', 'piv'];
const SLOT_LBL = ['POR', 'CIE', 'ALA', 'ALA', 'PÍV'];
const DEFAULT_LINEUP = [27, 5, 7, 10, 9];
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
const DIFFS = {
  // react: probabilidad/seg de que la IA tome decisiones (tirar/pasar) — más bajo = más tiempo para ti
  easy:   { spd: .74, tackle: .3,  gk: .8,  shoot: .75, react: .55 },
  normal: { spd: .84, tackle: .55, gk: .92, shoot: .88, react: .75 },
  hard:   { spd: .95, tackle: .9,  gk: 1.05, shoot: 1.0, react: 1.0 },
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

// ================== ESTADO ==================
const G = {
  state: 'menu', players: [], ball: null, score: [0, 0], time: 120, dur: 120,
  diffKey: 'normal', diff: DIFFS.normal, user: null, timer: 0, shake: 0, particles: [],
  scorers: [], switchCd: 0, crowdJump: 0, t: 0, chaser: [null, null], cover: [null, null], prevState: null,
};
const input = { x: 0, y: 0, tx: 0, ty: 0, touch: false, kx: 0, ky: 0, aDown: false, aHeld: false, bDown: false };

// ================== ENTIDADES ==================
function newP(d, team) {
  const h = HOME[d.role];
  const hx = team ? VW - h[0] : h[0], hy = team ? VH - h[1] : h[1];
  return Object.assign({}, d, {
    team, hx, hy, x: hx, y: hy, vx: 0, vy: 0, tvx: 0, tvy: 0, fx: 0, fy: team ? 1 : -1,
    r: (d.role === 'gk' ? 9 : 8) + (d.big ? 1 : 0), stun: 0, dash: 0, dashT: 0, dashHit: false, anim: rnd(6),
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
function startMatch() {
  audio();
  if (lineup.some(n => n == null)) return;
  SQUAD = lineup.map((n, i) => Object.assign({}, byNum(n), { role: SLOTS[i] }));
  G.players = [...SQUAD.map(d => newP(d, 0)), ...RIVAL.map(d => newP(d, 1))];
  G.ball = newBall();
  G.score = [0, 0]; G.dur = G.time = +store.get('bpg_dur', 120); G.scorers = []; G.particles = [];
  G.diffKey = store.get('bpg_diff', 'normal'); G.diff = DIFFS[G.diffKey] || DIFFS.normal;
  showScreen(null);
  kickoff(Math.random() < .5 ? 0 : 1);
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
  const kicker = G.players.find(p => p.team === t && p.role === 'piv');
  take(kicker, true); b.protect = 1.4;
  G.user = G.players.find(p => p.team === 0 && p.role === 'piv');
  G.state = 'ready'; G.timer = 1.2;
  banner(t === 0 ? 'SACA BPG' : 'SACA UNIÓN', '', t === 0 ? 'small' : 'small blue');
  sfx.whistle(1);
}
function goal(t) {
  const b = G.ball;
  G.score[t]++; G.state = 'goal'; G.timer = 2.9; G.shake = .5; G.crowdJump = 3; G.concede = 1 - t;
  const s = b.shooter;
  const name = s && s.team === t ? (t === 0 ? s.name : 'UNIÓN FS') : 'EN PROPIA PUERTA';
  if (t === 0) G.scorers.push(s && s.team === 0 ? s.name : 'EN PROPIA');
  const mm = Math.floor((G.dur - G.time) / 60), ss = Math.floor((G.dur - G.time) % 60);
  banner(t === 0 ? '¡GOOOL!' : 'GOL RIVAL', name + "  " + mm + "'" + String(ss).padStart(2, '0'), t === 0 ? '' : 'blue');
  if (t === 0) { sfx.goal(); vib([60, 40, 140]); } else { sfx.whistle(1); tone(300, .4, 'square', .05, 120, .2); vib(80); }
  const gy = t === 0 ? P.t : P.b;
  for (let i = 0; i < 90; i++) {
    const a = rnd(Math.PI * 2), sp = rnd(30, 170);
    G.particles.push({ x: b.x, y: gy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: rnd(1.2, 2.4),
      col: t === 0 ? ['#f6c400', '#0d0d0d', '#fff', '#f6c400'][i % 4] : ['#7dd3fc', '#fff', '#0c4a6e'][i % 3], s: rnd(1.5, 3), g: 60 });
  }
}
function endMatch() {
  G.state = 'end'; sfx.whistle(3);
  const [a, c] = G.score;
  const rec = store.get('bpg_rec', { w: 0, d: 0, l: 0 });
  if (a > c) rec.w++; else if (a === c) rec.d++; else rec.l++;
  store.set('bpg_rec', rec);
  banner('¡FINAL!', '', 'small');
  setTimeout(() => {
    $('#f0').textContent = a; $('#f1').textContent = c;
    $('#finalMsg').textContent = a > c ? '¡VICTORIA PATUNA! CUAC CUAC' : a === c ? 'EMPATE. ¡A POR LA REVANCHA!' : 'HOY NO... ¡PERO VOLVEREMOS!';
    const cnt = {}; G.scorers.forEach(n => cnt[n] = (cnt[n] || 0) + 1);
    $('#finalScorers').innerHTML = G.scorers.length
      ? '⚽ GOLES BPG<br>' + Object.entries(cnt).map(([n, k]) => n + (k > 1 ? ' x' + k : '')).join('<br>')
      : 'SIN GOLES DEL BPG';
    $('#finalRecord').textContent = `HISTORIAL: ${rec.w}V · ${rec.d}E · ${rec.l}D`;
    showScreen('final');
    if (a > c) sfx.goal();
  }, 1500);
}

// ================== ACCIONES ==================
function take(p, quiet) {
  const b = G.ball;
  b.owner = p; b.protect = p.team === 0 ? .9 : .5; b.passTarget = null; b.curve = 0; b.fire = false; b.scary = false; b.vx = b.vy = 0;
  p.holdT = 0;
  if (p.team === 0) G.user = p;
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
  if (p === G.user && Math.abs(input.x) > .15) side = clamp(input.x * 1.3, -1, 1);
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
  const jm = hyp(input.x, input.y);
  const useJoy = p === G.user && jm > .3;
  let best = null, bs = -1e9;
  for (const q of mates) {
    const dx = q.x - p.x, dy = q.y - p.y, d = hyp(dx, dy) || 1;
    let s;
    if (useJoy) s = (dx * input.x + dy * input.y) / (d * jm) * 3 - d / 280;
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
  if (p.team === 0) G.user = best;
  sfx.pass();
}
function steal(q, o) {
  o.stun = .5; o.charging = false; o.charge = 0; o.vx *= .2; o.vy *= .2;
  take(q, true); sfx.steal();
  for (let i = 0; i < 8; i++) G.particles.push({ x: o.x, y: o.y, vx: rnd(-50, 50), vy: rnd(-50, 50), life: .35, col: '#fff', s: 1.5 });
  if (q.team === 0) vib(20);
}
function switchUser() {
  const b = G.ball;
  let best = null, bd = 1e9;
  for (const q of team(0)) {
    if (q === G.user || q.role === 'gk') continue;
    const d = hyp(q.x - b.x, q.y - b.y);
    if (d < bd) { bd = d; best = q; }
  }
  if (best) { G.user = best; G.switchCd = .7; tone(700, .04, 'square', .03); }
}
function autoSwitch(dt) {
  G.switchCd -= dt;
  const b = G.ball;
  if (b.owner && b.owner.team === 0) return;
  if (!b.owner && b.passTarget && b.passTarget.team === 0) return;
  if (G.switchCd > 0) return;
  const px = b.x + b.vx * .25, py = b.y + b.vy * .25;
  let best = null, bd = 1e9;
  for (const q of team(0)) {
    if (q.role === 'gk') continue;
    const d = hyp(q.x - px, q.y - py);
    if (d < bd) { bd = d; best = q; }
  }
  const u = G.user, ud = u.role === 'gk' ? 1e9 : hyp(u.x - px, u.y - py);
  if (best && best !== u && bd + 18 < ud) { G.user = best; G.switchCd = .35; }
}

// ================== CONTROL DEL USUARIO ==================
function userCtl(p, dt) {
  const b = G.ball, has = b.owner === p;
  const s = maxSpd(p);
  p.tvx = input.x * s; p.tvy = input.y * s;
  const jm = hyp(input.x, input.y);
  if (jm > .2) { p.wfx = input.x / jm; p.wfy = input.y / jm; } else p.wfx = null;

  if (input.aDown) {
    input.aDown = false;
    if (has) { p.charging = true; p.charge = 0; }
    else if (p.dashT <= 0 && p.stun <= 0) {
      p.dash = .24; p.dashT = p.dashCdBase; p.dashHit = false;
      const fx = jm > .2 ? input.x / jm : p.fx, fy = jm > .2 ? input.y / jm : p.fy;
      p.vx += fx * 90; p.vy += fy * 90; sfx.dash();
      for (let i = 0; i < 6; i++) G.particles.push({ x: p.x, y: p.y + 4, vx: -fx * rnd(20, 60) + rnd(-15, 15), vy: -fy * rnd(20, 60) + rnd(-15, 15), life: .35, col: '#d9f99d', s: 1.5 });
    }
  }
  if (p.charging) {
    if (!has) { p.charging = false; p.charge = 0; }
    else {
      p.charge = Math.min(1, p.charge + dt * 1.5);
      if (!input.aHeld) shoot(p, p.charge);
    }
  }
  if (input.bDown) {
    input.bDown = false;
    if (has) pass(p); else if (G.switchCd < .5) switchUser();
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
    const cands = team(t).filter(q => q.role !== 'gk' && q !== b.owner && q !== G.user)
      .sort((a, c) => hyp(a.x - b.x, a.y - b.y) - hyp(c.x - b.x, c.y - b.y));
    // nuestro "chaser" es el usuario; los compañeros IA solo hacen cobertura
    G.chaser[t] = t === 0 ? null : cands[0] || null;
    G.cover[t] = t === 0 ? cands[0] || null : cands[1] || null;
  }
}

// ================== FÍSICA ==================
function step(dt) {
  G.t += dt;
  updParticles(dt);
  G.shake = Math.max(0, G.shake - dt);
  G.crowdJump = Math.max(0, G.crowdJump - dt);
  if (G.state !== 'play') { input.aDown = input.bDown = false; }
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
    if (p === G.user) userCtl(p, dt);
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
    if (p === G.user && p.wfx != null) { nx = p.wfx; ny = p.wfy; }
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
    if (q === G.user) {
      if (q.dash > 0 && !q.dashHit) {
        q.dashHit = true;
        if (Math.random() < .6 + .3 * q.tackle / o.ctrl) { steal(q, o); return; }
        q.stun = .25; tone(150, .08, 'square', .04);
      } else if (Math.random() < .8 * q.tackle / o.ctrl * dt) { steal(q, o); return; }
    } else {
      const rate = (q.team === 1 ? 1.1 * G.diff.tackle : 1.0) * q.tackle / o.ctrl;
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
  ctx.globalAlpha = .22; circ(CX, CY, 15, '#f6c400'); circ(CX, CY, 11, '#0d0d0d'); circ(CX, CY, 7, '#f6c400'); ctx.globalAlpha = 1;
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
  if (p === G.user) { ctx.strokeStyle = '#f6c400'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, r + 3, (r + 3) * .7, 0, 0, 7); ctx.stroke(); }
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
  const hx = x + fx * 1.6, hy = y + fy * 1.6, hr = r * .62;
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
  drawField();
  const list = [...G.players].sort((a, b) => a.y - b.y);
  for (const p of list) drawDuck(p);
  drawBall();
  for (const q of G.particles) { ctx.globalAlpha = Math.min(1, q.life * 3); ctx.fillStyle = q.col; ctx.fillRect(q.x - q.s / 2, q.y - q.s / 2, q.s, q.s); }
  ctx.globalAlpha = 1;
  // indicador del usuario
  const u = G.user;
  if (u && G.state !== 'end') {
    const bob = Math.sin(G.t * 8) * 1.5, ty = u.y - u.r - 9 + bob - (u.hop || 0);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(u.x - 4.5, ty - 1); ctx.lineTo(u.x + 4.5, ty - 1); ctx.lineTo(u.x, ty + 5); ctx.fill();
    ctx.fillStyle = '#f6c400'; ctx.beginPath(); ctx.moveTo(u.x - 3, ty); ctx.lineTo(u.x + 3, ty); ctx.lineTo(u.x, ty + 3.5); ctx.fill();
    if (u.charging) {
      const w = 20, bx = u.x - w / 2, by = ty - 6;
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
  // torso
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
  // cabeza
  if (L === 'afro') { C(32, 21, 22, '#3b2414'); C(14, 18, 6, '#3b2414'); C(50, 18, 6, '#3b2414'); }
  C(32, 25, 17, feaD); C(32, 25, 16, fea);
  if (L === 'buzz') {
    c.save(); c.beginPath(); c.arc(32, 25, 16.5, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#2a1a10'; c.beginPath(); c.moveTo(10, 0); c.lineTo(54, 0); c.lineTo(54, 16);
    for (let x = 50; x >= 14; x -= 4) c.lineTo(x, x % 8 ? 13 : 16);
    c.closePath(); c.fill(); c.restore();
  }
  if (!['cap', 'crown', 'curl', 'afro', 'buzz'].includes(L)) { T([27, 11, 31, 1, 34, 11], fea); T([32, 11, 39, 4, 37, 12], fea); }
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
function banner(t, sub, cls = '') {
  const el = $('#banner'); clearTimeout(bannerT);
  el.className = ''; void el.offsetWidth;
  el.querySelector('b').textContent = t; el.querySelector('small').textContent = sub || '';
  el.className = 'show ' + cls;
}
function hideBanner() { $('#banner').className = ''; }
function flashHide() { clearTimeout(bannerT); bannerT = setTimeout(() => { if (G.state === 'play') hideBanner(); }, 900); }

const hudCache = {};
function setTxt(id, v) { if (hudCache[id] !== v) { hudCache[id] = v; $(id).innerHTML = v; } }
function hud() {
  if (!G.ball) return;
  setTxt('#s0', String(G.score[0])); setTxt('#s1', String(G.score[1]));
  const t = Math.ceil(G.time), m = Math.floor(t / 60), s = t % 60;
  setTxt('#clock', m + ':' + String(s).padStart(2, '0'));
  const u = G.user, has = G.ball.owner === u;
  if (u) setTxt('#who', `<b>#${u.num} ${u.name}</b><br>${u.short}`);
  setTxt('#bA span', has ? 'TIRO' : 'ENTRADA');
  setTxt('#bB span', has ? 'PASE' : 'CAMBIO');
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
let lineup = (() => {
  const s = store.get('bpg_lineup', null);
  if (Array.isArray(s) && s.length === 5 && s.every(n => n == null || byNum(n))) {
    const f = s.filter(n => n != null);
    if (new Set(f).size === f.length) return s;
  }
  return DEFAULT_LINEUP.slice();
})();
const cardEls = {};
let focusNum = null;
function buildSelect() {
  const grid = $('#roster'); grid.innerHTML = '';
  for (const d of ROSTER) {
    const el = document.createElement('button'); el.type = 'button'; el.className = 'pcard';
    el.innerHTML = `<span class="pnum">${d.num}${d.captain ? ' <i class="cap">C</i>' : ''}</span><span class="ptag"></span>`;
    const cvs = document.createElement('canvas'); drawPortrait(cvs, d, 0); el.appendChild(cvs);
    const nm = document.createElement('span'); nm.className = 'pname'; nm.textContent = d.name; el.appendChild(nm);
    el.addEventListener('click', () => pickPlayer(d.num));
    grid.appendChild(el); cardEls[d.num] = el;
  }
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
function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
function pickPlayer(n) {
  audio(); focusNum = n;
  const i = lineup.indexOf(n);
  if (i >= 0) { lineup[i] = null; tone(300, .05, 'square', .04); }
  else {
    const e = lineup.indexOf(null);
    if (e < 0) { shake($('#slots')); tone(150, .1, 'square', .05); refreshSelect('<b>Quinteto completo.</b><br>Toca un hueco de arriba para liberarlo.'); return; }
    lineup[e] = n; tone(520 + e * 80, .06, 'square', .05);
  }
  refreshSelect();
}
function refreshSelect(msg) {
  store.set('bpg_lineup', lineup);
  for (const d of ROSTER) {
    const i = lineup.indexOf(d.num), el = cardEls[d.num];
    el.classList.toggle('on', i >= 0); el.classList.toggle('focus', d.num === focusNum);
    el.querySelector('.ptag').textContent = i >= 0 ? SLOT_LBL[i] : '';
  }
  $('#slots').querySelectorAll('.slot').forEach((s, i) => {
    const n = lineup[i], cv = s.querySelector('canvas');
    s.classList.toggle('empty', n == null);
    if (n != null) { drawPortrait(cv, Object.assign({}, byNum(n), { role: SLOTS[i] }), 0); s.querySelector('.sname').textContent = byNum(n).name; }
    else { cv.width = 64; s.querySelector('.sname').textContent = '+'; }
  });
  const f = focusNum != null ? byNum(focusNum) : null;
  $('#pinfo').innerHTML = msg || (f
    ? `<b>#${f.num} ${f.name}</b> · ${f.short}<br>${f.trait}${f.gk >= 1.3 ? ' <i>Buen portero.</i>' : ''}`
    : 'Toca a 5 jugadores. Van entrando en orden: <b>el primero es el portero</b>.');
  const left = lineup.filter(n => n == null).length;
  $('#startBtn').classList.toggle('off', left > 0);
  $('#startBtn').textContent = left ? `FALTAN ${left}` : '¡AL CAMPO! ▶';
}

// --- escena de portada (TV + consola, estilo cartel) ---
const SW = 360, SH = 392, SCR = { x: 56, y: 32, w: 248, h: 194 };
const scene = { cv: $('#hero'), stat: null, duck: null, crowd: [], flags: [], scarves: [] };
const mkCv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
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
  E(17, 33, 9, 9, '#f6c400'); E(17, 33, 6.5, 6.5, '#0d0d0d'); E(17, 33, 4, 4, '#f6c400'); E(17, 33, 1.6, 1.6, '#0d0d0d');
  T('BPG', 17, 50, 6, '#f6c400');
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
  R(168, 256, 44, 15, 3, '#151515'); R(169, 257, 42, 13, 2, '#2a2a2a'); T('BPG', 190, 264, 8, '#f6c400');
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
  E(345, 291, 6.5, 6.5, '#0d0d0d'); E(345, 291, 4.5, 4.5, '#f6c400'); E(345, 291, 1.8, 1.8, '#0d0d0d');
  // cartuchos de la izquierda
  E(56, 384, 56, 6, 'rgba(0,0,0,.35)');
  R(4, 352, 104, 30, 4, '#3a3a3a'); R(4, 352, 104, 4, 2, '#555');
  R(10, 357, 74, 21, 2, '#0d0d0d'); R(11, 358, 72, 19, 2, '#f6c400');
  T('FORZA BPG', 47, 368, 7, '#0d0d0d');
  F(88, 357, 16, 21, '#2a2a2a'); for (let i = 0; i < 5; i++) F(90, 359 + i * 4, 12, 1, '#4a4a4a');
  c.save(); c.translate(62, 338); c.rotate(-.06);
  R(-52, -14, 104, 26, 4, '#232323'); R(-52, -14, 104, 3, 2, '#3c3c3c');
  R(-44, -10, 68, 18, 2, '#f6c400');
  E(-35, -1, 6, 6, '#0d0d0d'); E(-35, -1, 4, 4, '#f6c400'); E(-35, -1, 1.5, 1.5, '#0d0d0d');
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
  E(162, 303, 10, 10, '#0d0d0d'); E(162, 303, 7.5, 7.5, '#f6c400'); E(162, 303, 4.5, 4.5, '#0d0d0d'); E(162, 303, 1.8, 1.8, '#fff');
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
  for (let x = 0, i = 0; x < W; x += 31, i++) { F(X + x, Y0 + 127, 31, 12, i % 2 ? '#0d0d0d' : '#f6c400'); T('BPG', X + x + 15.5, Y0 + 133.5, 6, i % 2 ? '#f6c400' : '#0d0d0d'); }
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
const zone = $('#joyzone'), base = $('#joybase'), knob = $('#joyknob');
let joyId = null, jcx = 0, jcy = 0;
const JR = 46;
function placeBase(x, y) { const r = zone.getBoundingClientRect(); base.style.left = (x - r.left) + 'px'; base.style.top = (y - r.top) + 'px'; }
function moveJoy(e) {
  let dx = e.clientX - jcx, dy = e.clientY - jcy, d = hyp(dx, dy);
  if (d > JR) { jcx += dx / d * (d - JR); jcy += dy / d * (d - JR); placeBase(jcx, jcy); dx = dx / d * JR; dy = dy / d * JR; d = JR; }
  knob.style.transform = `translate(${dx}px,${dy}px)`;
  const m = clamp((d / JR - .15) / .55, 0, 1);
  input.tx = d ? dx / d * m : 0; input.ty = d ? dy / d * m : 0;
}
zone.addEventListener('pointerdown', e => {
  e.preventDefault(); audio();
  if (joyId !== null) return;
  joyId = e.pointerId; try { zone.setPointerCapture(e.pointerId); } catch (_) {}
  jcx = e.clientX; jcy = e.clientY; placeBase(jcx, jcy); input.touch = true; moveJoy(e);
});
zone.addEventListener('pointermove', e => { if (e.pointerId === joyId) moveJoy(e); });
const endJoy = e => {
  if (e.pointerId !== joyId) return;
  joyId = null; input.touch = false; input.tx = input.ty = 0;
  knob.style.transform = ''; base.style.left = '50%'; base.style.top = '58%';
};
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => zone.addEventListener(ev, endJoy));

function bindBtn(el, down, up) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault(); audio();
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    el.classList.add('pressed'); down();
  });
  const rel = () => { if (el.classList.contains('pressed')) { el.classList.remove('pressed'); up && up(); } };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => el.addEventListener(ev, rel));
}
bindBtn($('#bA'), () => { input.aDown = true; input.aHeld = true; vib(8); }, () => { input.aHeld = false; });
bindBtn($('#bB'), () => { input.bDown = true; vib(8); });
document.addEventListener('contextmenu', e => e.preventDefault());

const keys = {};
window.addEventListener('keydown', e => {
  if (e.repeat) return;
  keys[e.code] = true; audio();
  if (['Space', 'KeyJ', 'KeyK'].includes(e.code)) { input.aDown = true; input.aHeld = true; e.preventDefault(); }
  if (['KeyX', 'KeyL', 'ShiftLeft', 'ShiftRight'].includes(e.code)) input.bDown = true;
  if (e.code === 'Escape' || e.code === 'KeyP') togglePause();
  if (e.code.startsWith('Arrow')) e.preventDefault();
});
window.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (['Space', 'KeyJ', 'KeyK'].includes(e.code)) input.aHeld = false;
});
function readInput() {
  if (input.touch) { input.x = input.tx; input.y = input.ty; return; }
  let x = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
  let y = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
  const m = hyp(x, y) || 1; input.x = x / m; input.y = y / m;
}

// ================== PAUSA / BOTONES ==================
function togglePause() {
  if (G.state === 'paused') { G.state = G.prevState; showScreen(null); }
  else if (['play', 'ready', 'goal'].includes(G.state)) { G.prevState = G.state; G.state = 'paused'; showScreen('pause'); }
}
$('#pauseBtn').addEventListener('click', togglePause);
$('#resumeBtn').addEventListener('click', togglePause);
$('#quitBtn').addEventListener('click', () => { G.state = 'menu'; hideBanner(); showScreen('title'); });
$('#muteBtn').addEventListener('click', () => { S.on = !S.on; store.set('bpg_sound', S.on); $('#muteBtn').style.opacity = S.on ? 1 : .4; audio(); });
$('#muteBtn').style.opacity = S.on ? 1 : .4;
$('#toSquad').addEventListener('click', () => { audio(); sfx.quack(); focusNum = null; refreshSelect(); showScreen('squad'); });
$('#backBtn').addEventListener('click', () => showScreen('title'));
$('#startBtn').addEventListener('click', () => {
  if (lineup.some(n => n == null)) { shake($('#slots')); tone(150, .1, 'square', .05); return; }
  startMatch();
});
$('#againBtn').addEventListener('click', startMatch);
$('#menuBtn').addEventListener('click', () => { G.state = 'menu'; showScreen('title'); });
document.addEventListener('visibilitychange', () => { if (document.hidden && ['play', 'ready', 'goal'].includes(G.state)) togglePause(); });

// ================== BUCLE ==================
let last = performance.now(), acc = 0;
const DT = 1 / 60;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  readInput();
  if (G.state !== 'menu' && G.state !== 'paused') {
    acc += dt;
    while (acc >= DT) { step(DT); acc -= DT; }
  } else acc = 0;
  if (titleEl.classList.contains('show')) drawScene(now / 1000);
  else if (G.ball) render();
  hud();
}

// init
const titleEl = $('#title');
buildSelect();
bindSeg('#segDiff', 'bpg_diff', 'normal');
bindSeg('#segDur', 'bpg_dur', 120);
G.ball = newBall();
SQUAD = DEFAULT_LINEUP.map((n, i) => Object.assign({}, byNum(n), { role: SLOTS[i] }));
G.players = [...SQUAD.map(d => newP(d, 0)), ...RIVAL.map(d => newP(d, 1))];
G.user = G.players[4];
fitCanvas();
requestAnimationFrame(frame);
if (/[?&]debug/.test(location.search)) window.__BPG = { G, step, startMatch, render, input };
})();
