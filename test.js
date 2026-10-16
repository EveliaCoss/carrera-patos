// node test.js — revisa que la física de la carrera se comporte como se espera.
const assert = require('assert');
const { step, fresh, makeTrack, T } = require('./public/game.js');
const dt = 1 / T.tickHz, H = 480;
const duck = (dx, dy = 0, y = 240) => Object.assign(fresh({}), { dx, dy, x: 0, y });
const run = (p, obs, secs, onTick = () => {}) => {
  let now = 0;
  for (let i = 0; i < secs * T.tickHz; i++) { now += dt * 1000; onTick(p); step(p, now, dt, obs, H); }
  return p;
};
const roca = [{ t: 'roca', x: 300, y: 240, r: 40 }];

// De frente contra la roca: se queda atorado antes de ella.
let p = run(duck(1), roca, 3);
assert.ok(p.x < 300 && p.x > 200, `debió quedarse antes de la roca, x=${p.x}`);

// Esquivando hacia abajo a tiempo: la pasa.
p = run(duck(1), roca, 3, p => { p.dy = p.x > 150 && p.x < 340 ? 1 : 0; });
assert.ok(p.x > 500, `debió esquivar la roca, x=${p.x}`);

// Atorado 4 s empujando contra la roca: se reacomoda 2 m adelante en un lugar libre y sigue la carrera.
p = run(duck(1), roca, 8);
assert.ok(p.x > 400, `debió reacomodarse y pasar la roca, x=${p.x}`);
// Pero un pato quieto (su alumno no presiona nada) no se mueve solo.
p = Object.assign(duck(0), { x: 240 }); run(p, roca, 8);
assert.strictEqual(p.x, 240);

// Tronco horizontal: no se atraviesa y nunca deja al pato adentro.
const tronco = [{ t: 'tronco', x: 300, y: 220, w: 150, h: 38 }];
p = run(duck(1), tronco, 3);
assert.ok(p.x + T.R <= 300.01, `no debió atravesar el tronco, x=${p.x}`);

// Remolino frena, nitro acelera.
const remolino = [{ t: 'remolino', x: 0, y: 240, r: 5000 }];
const normal = run(duck(1), [], 2).x, enRemolino = run(duck(1), remolino, 2).x;
const conNitro = run(Object.assign(duck(1), { nitroUntil: 1e9 }), [], 2).x;
assert.ok(enRemolino < normal * 0.6 && conNitro > normal * 1.6, { normal, enRemolino, conNitro });

// No sale del estanque por arriba ni por abajo.
assert.strictEqual(run(duck(0, -1), [], 3).y, T.R);
assert.strictEqual(run(duck(0, 1), [], 3).y, H - T.R);

// Los obstáculos generados quedan dentro del estanque.
for (let i = 0; i < 200; i++) for (const o of makeTrack(H)) {
  const [top, bottom] = o.t === 'tronco' ? [o.y, o.y + o.h] : [o.y - o.r, o.y + o.r];
  assert.ok(top >= 0 && bottom <= H, JSON.stringify(o));
}
console.log('ok', { normal: Math.round(normal), enRemolino: Math.round(enRemolino), conNitro: Math.round(conNitro) });
