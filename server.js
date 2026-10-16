// Carrera de Patos: servidor sin dependencias. `node server.js` y abre el enlace de maestra.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const { DUCKS, ICONS } = require('./public/ducks.js');

const PORT = +process.env.PORT || 3000;
const HOST_KEY = process.env.HOST_KEY || crypto.randomBytes(3).toString('hex');
const MAX_PLAYERS = 60;

// Física en unidades de pista (10 unidades = 1 m). Ajusta aquí la dificultad.
const T = {
  trackLen: (+process.env.TRACK_M || 500) * 10, speed: 240, backSpeed: 160, sideSpeed: 210, accel: 1400, R: 20,
  nitroMul: 1.9, nitroMs: 2500, nitroCooldownMs: 8000,
  slowMul: 0.45, stunMs: 500, stuckMs: 4000, unstuckDist: 20, tickHz: 30, sendHz: 15,
};
// Alto del estanque según cuántos patos hay, para que quepan formados en la salida.
const pondHeight = n => Math.max(480, Math.min(1500, n * 50 + 80));

let phase = 'lobby'; // lobby | countdown | race | done
let countdownEnd = 0, raceStart = 0, finishOrder = 0, obstacles = [], nextPid = 1, pondH = pondHeight(0);
const players = new Map(); // token secreto -> jugador (el pid público es lo que ven los demás)
const clients = new Set();

// Columnas de obstáculos a lo largo del estanque. Cada columna deja siempre paso libre:
// la suma de lo que bloquea nunca pasa de pondH menos el ancho de tres patos.
function makeTrack(H) {
  const obs = [], rnd = Math.random;
  for (let x = 450; x < T.trackLen - 350; x += 190 + (rnd() * 170 | 0)) {
    let budget = H - 6 * T.R;
    const n = 1 + (rnd() * Math.max(1.5, H / 300) | 0);
    for (let i = 0; i < n; i++) {
      const r = rnd();
      let o, block;
      if (r < 0.45) { const rad = 24 + (rnd() * 22 | 0); o = { t: 'roca', x: x + (rnd() * 60 | 0), y: rad + (rnd() * (H - 2 * rad) | 0), r: rad }; block = 2 * rad; }
      else if (r < 0.75) { const vert = rnd() < 0.5, w = vert ? 38 : 150, h = vert ? 130 : 38; o = { t: 'tronco', x, y: rnd() * (H - h) | 0, w, h }; block = h; }
      else { const rad = 55 + (rnd() * 25 | 0); o = { t: 'remolino', x: x + (rnd() * 60 | 0), y: rad + (rnd() * (H - 2 * rad) | 0), r: rad }; block = 0; }
      if (block > budget) continue;
      budget -= block; obs.push(o);
    }
  }
  return obs;
}

function fresh(p) {
  return Object.assign(p, { x: -40, y: T.R, vx: 0, vy: 0, dx: 0, dy: 0, nitroUntil: 0, nitroReady: 0, stunUntil: 0, finish: null, place: null, at: 0 });
}

// Un paso de física para un pato. Devuelve true si cruzó la meta en este paso.
function step(p, now, dt, obs = obstacles, H = pondH) {
  const stunned = now < p.stunUntil;
  const slow = obs.some(o => o.t === 'remolino' && (p.x - o.x) ** 2 + (p.y - o.y) ** 2 < o.r * o.r);
  let tx = stunned ? 0 : p.dx > 0 ? T.speed : p.dx < 0 ? -T.backSpeed : 0;
  let ty = stunned ? 0 : p.dy * T.sideSpeed;
  if (now < p.nitroUntil && tx > 0) tx *= T.nitroMul;
  if (slow) { tx *= T.slowMul; ty *= T.slowMul; }
  const a = T.accel * dt, toward = (v, target) => v + Math.max(-a, Math.min(a, target - v));
  p.vx = toward(p.vx, tx); p.vy = toward(p.vy, ty);
  p.x = Math.max(-60, p.x + p.vx * dt);
  p.y = Math.max(T.R, Math.min(H - T.R, p.y + p.vy * dt));

  for (const o of obs) {
    if (o.t === 'remolino') continue;
    // Punto del obstáculo más cercano al centro del pato
    let cx, cy, min;
    if (o.t === 'roca') { cx = o.x; cy = o.y; min = o.r + T.R; }
    else { cx = Math.max(o.x, Math.min(o.x + o.w, p.x)); cy = Math.max(o.y, Math.min(o.y + o.h, p.y)); min = T.R; }
    let ex = p.x - cx, ey = p.y - cy, d = Math.hypot(ex, ey);
    if (d >= min) continue;
    if (d === 0) { ex = -1; ey = 0; d = 1; } // centro dentro del tronco: sale hacia atrás
    p.x = cx + ex / d * min; p.y = Math.max(T.R, Math.min(H - T.R, cy + ey / d * min));
    p.vx = p.vy = 0; p.stunUntil = now + T.stunMs; p.nitroUntil = 0;
  }

  // Atorado: si en 4 s no avanzó ni 1 m aunque intenta nadar (o sigue aturdido), se reacomoda 2 m adelante
  // en el lugar libre más cercano. Un pato quieto porque su alumno no presiona nada no se mueve.
  const trying = p.dx || p.dy || now < p.stunUntil;
  if (!p.at || !trying || Math.hypot(p.x - p.ax, p.y - p.ay) > 10) { p.ax = p.x; p.ay = p.y; p.at = now; }
  else if (now - p.at >= T.stuckMs) { unstick(p, obs, H); p.ax = p.x; p.ay = p.y; p.at = now; }
  return p.x >= T.trackLen;
}

function isFree(x, y, obs, H) {
  if (y < T.R || y > H - T.R) return false;
  return obs.every(o => {
    if (o.t === 'remolino') return true;
    if (o.t === 'roca') return Math.hypot(x - o.x, y - o.y) >= o.r + T.R + 2;
    const cx = Math.max(o.x, Math.min(o.x + o.w, x)), cy = Math.max(o.y, Math.min(o.y + o.h, y));
    return Math.hypot(x - cx, y - cy) >= T.R + 2;
  });
}

// Lugar libre 2 m adelante, lo más cerca de su carril, con el camino al frente despejado unos metros
// (si no hay ninguno así, basta con que el lugar esté libre).
function unstick(p, obs, H) {
  const clearAhead = (x, y) => { for (let d = 0; d <= 120; d += 10) if (!isFree(x + d, y, obs, H)) return false; return true; };
  for (const ok of [clearAhead, (x, y) => isFree(x, y, obs, H)]) {
    for (let ahead = T.unstuckDist; ahead <= 400; ahead += 10) {
      for (let k = 0; k <= H / 5; k++) {
        const y = p.y + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 10;
        if (ok(p.x + ahead, y)) { p.x += ahead; p.y = y; p.vx = p.vy = 0; p.stunUntil = 0; return; }
      }
    }
  }
}

// Formar a todos en la línea de salida, repartidos a lo alto del estanque.
function lineUp() {
  const list = [...players.values()];
  pondH = pondHeight(list.length);
  list.forEach((p, i) => { fresh(p); p.y = Math.round((i + 0.5) * pondH / list.length); });
}

function tick() {
  const now = Date.now();
  if (phase === 'countdown' && now >= countdownEnd) { phase = 'race'; raceStart = now; broadcast(meta()); }
  if (phase !== 'race') return;
  for (const p of players.values()) {
    if (p.finish != null) continue;
    if (step(p, now, 1 / T.tickHz)) { p.x = T.trackLen; p.finish = now - raceStart; p.place = ++finishOrder; }
  }
  // Gana el primero en cruzar la meta: ahí termina la carrera y los demás quedan por distancia.
  if (finishOrder) { phase = 'done'; broadcast(meta()); }
}

function meta() {
  return {
    t: 'm', phase, trackLen: T.trackLen, pondH, nitroTotal: T.nitroMs + T.nitroCooldownMs, obstacles,
    joinUrl: `http://${lanIp()}:${PORT}`,
    roster: [...players.values()].map(p => ({ pid: p.pid, name: p.name, duck: p.duck, icon: p.icon, online: p.online, x: Math.round(p.x), y: Math.round(p.y), finish: p.finish, place: p.place })),
  };
}

function snapshot() {
  const now = Date.now();
  return {
    t: 's', phase, cd: phase === 'countdown' ? Math.ceil((countdownEnd - now) / 1000) : 0, el: phase === 'race' ? now - raceStart : 0,
    p: [...players.values()].map(p => [p.pid, Math.round(p.x), Math.round(p.y), now < p.nitroUntil ? 1 : 0, now < p.stunUntil ? 1 : 0, Math.max(0, p.nitroReady - now)]),
  };
}

function broadcast(msg) { const s = `data: ${JSON.stringify(msg)}\n\n`; for (const c of clients) c.res.write(s); }

function startRace() {
  if (!players.size) return;
  for (const [tok, p] of players) if (!p.online) players.delete(tok);
  lineUp();
  obstacles = makeTrack(pondH); finishOrder = 0;
  phase = 'countdown'; countdownEnd = Date.now() + 3000;
  broadcast(meta());
}
function endRace() { if (phase === 'race' || phase === 'countdown') { phase = 'done'; broadcast(meta()); } }
function toLobby() { phase = 'lobby'; obstacles = []; lineUp(); broadcast(meta()); }
function kick(pid) {
  for (const [tok, p] of players) if (p.pid === pid) {
    players.delete(tok);
    for (const c of clients) if (c.token === tok) c.res.end();
  }
  if (phase === 'lobby') lineUp();
  broadcast(meta());
}

function join(res, b) {
  const name = String(b.name ?? '').replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮]/g, '').trim().slice(0, 16);
  const duck = Number(b.duck), icon = Number(b.icon);
  if (!name) return json(res, 400, { error: 'Escribe tu nombre para entrar.' });
  if (!Number.isInteger(duck) || !DUCKS[duck] || !Number.isInteger(icon) || !ICONS[icon]) return json(res, 400, { error: 'Elige un pato y un ícono.' });
  if (players.size >= MAX_PLAYERS) return json(res, 409, { error: `La carrera está llena (${MAX_PLAYERS} patos).` });
  const token = crypto.randomUUID(), pid = nextPid++;
  const p = fresh({ pid, name, duck, icon, online: false });
  players.set(token, p);
  // En la sala se reacomoda la fila; si la carrera ya va, sale desde atrás en un lugar al azar.
  if (phase === 'lobby') lineUp(); else p.y = T.R + Math.random() * (pondH - 2 * T.R) | 0;
  broadcast(meta());
  json(res, 200, { token, pid });
}

function input(b) {
  const p = players.get(b.token); if (!p) return;
  if ('dx' in b) p.dx = Math.sign(Number(b.dx)) || 0;
  if ('dy' in b) p.dy = Math.sign(Number(b.dy)) || 0;
  const now = Date.now();
  if (b.nitro && phase === 'race' && p.finish == null && now >= p.nitroReady) {
    p.nitroUntil = now + T.nitroMs; p.nitroReady = now + T.nitroMs + T.nitroCooldownMs;
  }
}

function sse(req, res, token) {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
  res.write('retry: 1500\n\n');
  const c = { res, token }; clients.add(c);
  const p = players.get(token);
  if (p) { p.online = true; broadcast(meta()); } else res.write(`data: ${JSON.stringify(meta())}\n\n`);
  req.on('close', () => {
    clients.delete(c);
    const p = players.get(token);
    if (!p || [...clients].some(x => x.token === token)) return;
    p.online = false; broadcast(meta());
  });
}

function json(res, code, obj) { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); }
function readBody(req) {
  return new Promise((ok, fail) => {
    let s = '';
    req.on('data', d => { s += d; if (s.length > 2048) { fail(new Error('too big')); req.destroy(); } });
    req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch (e) { fail(e); } });
  });
}
function lanIp() {
  for (const list of Object.values(os.networkInterfaces()))
    for (const a of list || []) if (a.family === 'IPv4' && !a.internal) return a.address;
  return 'localhost';
}

const FILES = { '/': 'index.html', '/host': 'host.html', '/ducks.js': 'ducks.js' };
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (req.method === 'GET') {
      if (u.pathname === '/events') return sse(req, res, u.searchParams.get('token'));
      if (u.pathname === '/me') return json(res, players.has(u.searchParams.get('token')) ? 200 : 404, {});
      if (/^\/(ducks\/\d{2}\.png|lago\/(fondo\.jpg|carrera\.jpg|cocodrilo\.png|letrero\.png))$/.test(u.pathname)) {
        const f = path.join(__dirname, 'public', u.pathname);
        if (!fs.existsSync(f)) return json(res, 404, {});
        res.writeHead(200, { 'content-type': u.pathname.endsWith('.jpg') ? 'image/jpeg' : 'image/png', 'cache-control': 'no-cache' });
        return fs.createReadStream(f).pipe(res);
      }
      const file = FILES[u.pathname];
      if (!file) return json(res, 404, { error: 'No existe' });
      res.writeHead(200, { 'content-type': file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      return fs.createReadStream(path.join(__dirname, 'public', file)).pipe(res);
    }
    if (req.method !== 'POST') return json(res, 405, {});
    const body = await readBody(req);
    if (u.pathname === '/join') return join(res, body);
    if (u.pathname === '/input') { input(body); return json(res, 200, {}); }
    if (u.pathname.startsWith('/host/')) {
      if (u.searchParams.get('key') !== HOST_KEY) return json(res, 403, { error: 'Clave de maestra incorrecta.' });
      const actions = { start: startRace, end: endRace, lobby: toLobby, kick: () => kick(body.pid) };
      const fn = actions[u.pathname.slice(6)];
      if (!fn) return json(res, 404, {});
      fn(); return json(res, 200, {});
    }
    json(res, 404, {});
  } catch {
    if (!res.headersSent) json(res, 400, { error: 'Petición inválida.' });
  }
});

if (require.main === module) {
  setInterval(tick, 1000 / T.tickHz);
  setInterval(() => { if (phase === 'countdown' || phase === 'race') broadcast(snapshot()); }, 1000 / T.sendHz);
  setInterval(() => { for (const c of clients) c.res.write(': ping\n\n'); }, 15000);
  server.listen(PORT, '0.0.0.0', () => {
    console.log('\n🦆 Carrera de Patos lista\n');
    console.log(`  Pantalla de la maestra:  http://localhost:${PORT}/host?key=${HOST_KEY}`);
    console.log(`  Alumnos (misma Wi‑Fi):   http://${lanIp()}:${PORT}\n`);
  });
}

module.exports = { step, fresh, makeTrack, T };
