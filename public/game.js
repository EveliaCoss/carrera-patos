// Física de la carrera. La corre la pantalla de la maestra (es la "dueña" de la partida) y test.js la prueba.

// Unidades de pista: 10 = 1 m. Ajusta aquí la dificultad.
const T = {
  trackLen: 5000, speed: 240, backSpeed: 160, sideSpeed: 210, accel: 1400, R: 20,
  nitroMul: 1.9, nitroMs: 2500, nitroCooldownMs: 8000,
  slowMul: 0.45, stunMs: 500, stuckMs: 4000, unstuckDist: 20, tickHz: 30, sendHz: 10,
};
const MAX_PLAYERS = 60;
// Alto del estanque según cuántos patos hay, para que quepan formados en la salida.
const pondHeight = n => Math.max(480, Math.min(1500, n * 50 + 80));

// Columnas de obstáculos a lo largo del estanque. Cada columna deja siempre paso libre:
// la suma de lo que bloquea nunca pasa de H menos el ancho de tres patos.
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
function step(p, now, dt, obs, H) {
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

if (typeof module !== 'undefined') module.exports = { T, MAX_PLAYERS, pondHeight, makeTrack, fresh, step, isFree, unstick };
