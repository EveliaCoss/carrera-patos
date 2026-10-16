// Patos, íconos y dibujo de la pista. Lo usan las páginas (alumno y maestra) y server.js (validación).

// Patitos de hule (imágenes en /ducks/NN.png): [nombre, ancho, alto, ojos abiertos].
// Cada ojo: [x, y, rx, ry] como fracción de la imagen + color de la cara alrededor (para el parpadeo).
const DUCKS = [
  ['Marinero', 168, 180, [[0.7195, 0.428, 0.0417, 0.0583, '#fcebca'], [0.4435, 0.4625, 0.0625, 0.0611, '#fceed2']]],
  ['Astronauta', 160, 180, [[0.7295, 0.3963, 0.0438, 0.0556, '#fceca7'], [0.4343, 0.4253, 0.0656, 0.0583, '#fdeeac']]],
  ['Vaquero', 162, 180, [[0.8397, 0.4122, 0.037, 0.0556, '#fcedb4'], [0.5553, 0.444, 0.0617, 0.0583, '#fdefbe']]],
  ['Detective', 174, 178, [[0.7159, 0.3984, 0.0374, 0.059, '#fcebb8'], [0.4385, 0.4375, 0.0603, 0.059, '#fdf2bf']]],
  ['Chef', 156, 180, [[0.8356, 0.4409, 0.0417, 0.0556, '#fcedc1'], [0.5474, 0.4756, 0.0609, 0.0556, '#fdefc0']]],
  ['Doctor', 169, 172, [[0.8217, 0.3258, 0.0414, 0.061, '#fcecca'], [0.5188, 0.3692, 0.0651, 0.064, '#fdf3d2']]],
  ['Enfermera', 178, 180, [[0.735, 0.4004, 0.0365, 0.0556, '#fbeec4'], [0.4638, 0.4417, 0.059, 0.0611, '#fdf1c8']]],
  ['Mago', 180, 172, [[0.7057, 0.4438, 0.0333, 0.0523, '#fceab8'], [0.4569, 0.4813, 0.0528, 0.0581, '#fdebc0']]],
  ['Bruja', 180, 179, [[0.7665, 0.4497, 0.0333, 0.0559, '#fbe4ac'], [0.5189, 0.4826, 0.0528, 0.0559, '#fde5b1']]],
  ['Artista', 180, 174, [[0.7467, 0.3866, 0.0361, 0.0575, '#fcebbf'], [0.4821, 0.424, 0.0556, 0.0603, '#fdefc3']]],
  ['Músico', 174, 173, [[0.7112, 0.3529, 0.0402, 0.0607, '#fbeca6'], [0.4282, 0.3871, 0.0603, 0.0636, '#fdefab']]],
  ['Gamer', 155, 174, [[0.7966, 0.3627, 0.0419, 0.0603, '#fbeaba'], [0.4798, 0.3965, 0.0677, 0.0632, '#fdedbd']]],
  ['Graduado', 169, 180, [[0.8049, 0.4039, 0.0414, 0.0556, '#fcefa5'], [0.5231, 0.4385, 0.0621, 0.0583, '#fdefa8']]],
  ['Científico', 175, 174, [[0.7271, 0.3501, 0.0429, 0.0603, '#fae4b8'], [0.4447, 0.3884, 0.0571, 0.0632, '#faefc5']]],
  ['Girasol', 180, 171, [[0.7597, 0.3818, 0.0361, 0.0585, '#fcecb8'], [0.4962, 0.4196, 0.0583, 0.0614, '#fdefbf']]],
  ['Hawaiano', 174, 175, [[0.828, 0.3432, 0.0402, 0.06, '#fbebc2'], [0.5482, 0.3814, 0.0603, 0.0629, '#fdefcc']]],
  ['Playa', 176, 175, [[0.7556, 0.3677, 0.0398, 0.0629, '#fcbbc4'], [0.4928, 0.4062, 0.0568, 0.0629, '#fbadb6']]],
  ['Buzo', 178, 178, [[0.8032, 0.3636, 0.0393, 0.059, '#f8e2b4'], [0.5255, 0.3956, 0.059, 0.0618, '#fcedb9']]],
  ['Explorador', 152, 175, [[0.826, 0.3734, 0.0428, 0.0571, '#fceaaf'], [0.5012, 0.4167, 0.0691, 0.06, '#fdefb8']]],
  ['Lluvia', 180, 165, [[0.6511, 0.3762, 0.0361, 0.0576, '#fce6b6'], [0.3964, 0.4151, 0.0528, 0.0606, '#fdefc0']]],
  ['Invierno', 165, 180, [[0.8685, 0.3978, 0.0424, 0.0556, '#fbedba'], [0.5716, 0.4434, 0.0636, 0.0583, '#fdf1c1']]],
  ['Fresa', 170, 180, [[0.8401, 0.4285, 0.0382, 0.0556, '#fcebbe'], [0.5545, 0.4645, 0.0618, 0.0583, '#fdedc8']]],
  ['Rana', 169, 180, [[0.8321, 0.4059, 0.0414, 0.0583, '#fceab2'], [0.5354, 0.4423, 0.0621, 0.0611, '#fdedc1']]],
  ['Panda', 157, 177, [[0.8288, 0.4032, 0.0446, 0.0593, '#fcecb8'], [0.5004, 0.4382, 0.0701, 0.0621, '#fcefbe']]],
  ['Gatito', 162, 179, [[0.8496, 0.4118, 0.0463, 0.0587, '#fcecb5'], [0.528, 0.447, 0.0648, 0.0615, '#fcf0bd']]],
  ['Dino', 147, 180, [[0.8923, 0.4232, 0.0408, 0.0556, '#faf2e5'], [0.5711, 0.4578, 0.068, 0.0556, '#fdf19b']]],
  ['Unicornio', 155, 180, [[0.8991, 0.439, 0.0419, 0.0556, '#faf0e2'], [0.5812, 0.4763, 0.0645, 0.0583, '#fdf8f1']]],
  ['Abeja', 154, 180, [[0.8933, 0.4362, 0.0422, 0.0556, '#fef3a2'], [0.5739, 0.4818, 0.0682, 0.0583, '#fdf3a3']]],
  ['Cupcake', 153, 180, [[0.7259, 0.4411, 0.0392, 0.05, '#fce6bd'], [0.4293, 0.4799, 0.0621, 0.0556, '#fde8be']]],
  ['Dona', 166, 179, [[0.7559, 0.3098, 0.0452, 0.0615, '#fce5bb'], [0.4404, 0.3497, 0.0633, 0.0615, '#fdedc7']]],
  ['Elegante', 138, 180, [[0.841, 0.4161, 0.0435, 0.0528, '#fdeec1'], [0.5104, 0.4536, 0.0688, 0.0556, '#feefc1']]],
  ['Princesa', 154, 180, [[0.8029, 0.3946, 0.0422, 0.0556, '#fcedbc'], [0.4993, 0.4422, 0.0649, 0.0556, '#fef0c0']]],
  ['Pirata', 149, 180, [[0.815, 0.4366, 0.0436, 0.05, '#fdefbd'], [0.5137, 0.4723, 0.0638, 0.0528, '#fdf0bc']]],
  ['Samurái', 143, 180, [[0.9154, 0.3376, 0.028, 0.0361, '#ffecaa'], [0.5257, 0.4963, 0.0664, 0.0556, '#fdedc1']]],
  ['Ángel', 154, 180, [[0.8266, 0.4016, 0.0422, 0.0556, '#fcebc2'], [0.5181, 0.4394, 0.0649, 0.0556, '#fdefc5']]],
];

const ICONS = ['⭐', '🔥', '⚡', '🍀', '🌈', '🎯', '🚀', '🎸', '🍕', '🐸', '👑', '💎', '🌙', '🎮', '🏆', '🍩', '🦄', '⚽'];

// Versión de las imágenes: al cambiarla, los navegadores no pueden reusar copias viejas. herramientas/recortar_patos.py la actualiza.
const ART_V = '20261016171757';
const DUCK_IMG = typeof Image === 'undefined' ? [] : DUCKS.map((_, i) => {
  const im = new Image(); im.src = `ducks/${String(i).padStart(2, '0')}.png?v=${ART_V}`; return im;
});

function ell(c, x, y, rx, ry, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(rx, 0), Math.max(ry, 0), rot, 0, Math.PI * 2); }
function star(c, x, y, r) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath(); c.fill();
}

const DUCK_H = 72; // alto del pato en unidades del dibujo (s = 1)

// Dibuja el pato con los pies en (x, y). o: {alpha, t (ms), seed, moving, nitro, stun}
// Movimiento: flota y se mece, se estira y aplasta al nadar, parpadea, y tiembla con estrellitas si choca.
function drawDuck(c, x, y, s, idx, o = {}) {
  const d = DUCKS[idx] || DUCKS[0], im = DUCK_IMG[idx];
  const t = o.t || 0, seed = o.seed ?? idx, moving = !!o.moving;
  const H = DUCK_H, W = H * d[1] / d[2];
  c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = o.alpha ?? 1;
  if (o.nitro) {
    const f = 1 + Math.sin(t / 35) * 0.3;
    c.fillStyle = '#FF6B00'; ell(c, -W * 0.5 - 8, -14, 16 * f, 7); c.fill();
    c.fillStyle = '#FFD43B'; ell(c, -W * 0.5 - 3, -14, 9 * f, 4); c.fill();
  }
  const shake = o.stun ? Math.sin(t / 25) * 2.5 : 0;
  const bob = Math.sin(t / 380 + seed) * (moving ? 2.2 : 1.4);
  const tilt = Math.sin(t / (moving ? 160 : 600) + seed) * (moving ? 0.07 : 0.035) + (moving ? 0.05 : 0);
  const sq = moving ? Math.sin(t / 85 + seed) * 0.05 : Math.sin(t / 700 + seed) * 0.015;
  c.translate(shake, bob); c.rotate(tilt); c.scale(1 + sq, 1 - sq);
  if (im && im.complete && im.naturalWidth) c.drawImage(im, -W / 2, -H, W, H);

  // Parpadeo: cada ~3 s (cada pato a su ritmo) el párpado tapa el ojo y queda una rayita curva
  const ph = (t + seed * 997) % 3100, closed = o.stun || ph < 170;
  if (closed) {
    for (const [ex, ey, rx, ry, skin] of d[3]) {
      const cx = -W / 2 + ex * W, cy = -H + ey * H, px = rx * W * 1.25, py = ry * H * 1.2;
      c.fillStyle = skin; ell(c, cx, cy, px, py); c.fill();
      c.strokeStyle = '#2B1D14'; c.lineWidth = Math.max(1, py * 0.35); c.lineCap = 'round';
      c.beginPath(); c.arc(cx, cy - py * 0.45, px * 0.85, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
    }
  }
  c.restore();
  if (o.stun) {
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#FCC419';
    for (let i = 0; i < 3; i++) { const a = t / 150 + i * 2.09; star(c, Math.cos(a) * 16, -H - 6 + Math.sin(a) * 4, 3.6); }
    c.restore();
  }
}

// ---------- Estanque ----------
// Mundo: x = avance (0 = salida, trackLen = meta), y = 0..pondH es agua. Arriba y abajo hay orilla.
const BANK_TOP = 130, BANK_BOT = 100;
const TOP_DECOR = ['🌳', '🌲', '🍄', '🐸', '🌳', '🌷', '🌲', '🌻', '🐢', '🌳', '🪨', '🌼', '🌲', '🍄', '🌳', '🦔'];
const BOT_DECOR = ['🌷', '🌼', '🍄', '🐸', '🌻', '🪨', '🌿', '🐌', '🌺', '🍀', '🐢', '🌾', '🌸', '🍄'];
const hash = n => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

function checker(c, x, y0, y1, sq, a, b) {
  for (let y = y0, r = 0; y < y1; y += sq, r++)
    for (let j = 0; j < 2; j++) { c.fillStyle = (r + j) % 2 ? a : b; c.fillRect(x + j * sq, y, sq, Math.min(sq, y1 - y)); }
}

function emoji(c, ch, x, y, px, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.font = `${px}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillText(ch, 0, 0); c.restore();
}

// V: {w, h, camX, camY, k, pondH, trackLen, obstacles, ducks, t, arrows, backdrop}
// backdrop: ya hay un fondo pintado (el lago de la maestra): solo se dibuja lo que avanza con la carrera.
// Cada pato: {pid, x, y, duck, icon, name, me, alpha, moving, look, nitro, stun, offline}
function drawPond(c, V) {
  const { w, h, camX, camY, k, pondH, trackLen, obstacles, ducks, t } = V;
  const X = wx => (wx - camX) * k, Y = wy => (wy - camY) * k;
  const x0 = camX - 150, x1 = camX + w / k + 150, bd = !!V.backdrop;
  let g;

  if (!bd) {
  // Cielo, sol y nubes
  g = c.createLinearGradient(0, Y(-BANK_TOP), 0, Y(-55));
  g.addColorStop(0, '#7CC8F5'); g.addColorStop(1, '#D4F0FF');
  c.fillStyle = g; c.fillRect(0, 0, w, Y(-55));
  if (Y(-55) > 0) {
    const sr = 34 * k, sx = Math.min(w * 0.08, 90 * k) + sr, sy = Y(-BANK_TOP + 30);
    const sg = c.createRadialGradient(sx, sy, sr * 0.3, sx, sy, sr * 2.2);
    sg.addColorStop(0, 'rgba(255,224,102,1)'); sg.addColorStop(0.45, 'rgba(255,224,102,.55)'); sg.addColorStop(1, 'rgba(255,224,102,0)');
    c.fillStyle = sg; c.fillRect(sx - sr * 2.2, sy - sr * 2.2, sr * 4.4, sr * 4.4);
    c.fillStyle = '#FFE066'; ell(c, sx, sy, sr, sr); c.fill();
    c.fillStyle = 'rgba(255,255,255,.92)';
    const span = w + 300;
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 380 + t * 0.012 - camX * 0.25) * k % span + span) % span - 150, cy = Y(-BANK_TOP + 25 + hash(i) * 30);
      for (const [dx, dy, r] of [[0, 0, 16], [16, -6, 20], [34, 0, 15], [17, 5, 15]]) { ell(c, cx + dx * k, cy + dy * k, r * k, r * k * 0.8); c.fill(); }
    }
  }
  // Colinas y orilla de arriba
  c.fillStyle = '#9BD88A';
  c.beginPath(); c.moveTo(0, Y(-40));
  for (let sx = 0; sx <= w + 40; sx += 40) c.lineTo(sx, Y(-58) + Math.sin((sx / k + camX * 0.6) / 140) * 10 * k);
  c.lineTo(w, Y(-40)); c.closePath(); c.fill();
  c.fillStyle = '#76C267'; c.fillRect(0, Y(-46), w, Y(0) - Y(-46));
  c.fillStyle = '#8B6B3F'; c.fillRect(0, Y(-6), w, 8 * k);

  // Agua
  g = c.createLinearGradient(0, Y(0), 0, Y(pondH));
  g.addColorStop(0, '#5AAEE8'); g.addColorStop(1, '#3B7EC6');
  c.fillStyle = g; c.fillRect(0, Y(0), w, Y(pondH) - Y(0));
  }
  // Olas que avanzan con la cámara (sobre el fondo pintado van más suaves)
  c.strokeStyle = bd ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.38)'; c.lineWidth = Math.max(1, 2.4 * k); c.lineCap = 'round';
  for (let wy = 40, row = 0; wy < pondH - 10; wy += 64, row++) {
    for (let wx = Math.floor(x0 / 200) * 200; wx < x1; wx += 200) {
      const n = hash(row * 97 + wx / 200), ox = wx + n * 140 + Math.sin(t / 900 + n * 6) * 14, oy = wy + hash(n) * 30, len = 26 + n * 30;
      c.beginPath(); c.moveTo(X(ox), Y(oy)); c.quadraticCurveTo(X(ox + len / 2), Y(oy - 6), X(ox + len), Y(oy)); c.stroke();
    }
  }
  if (!bd) {
  // Nenúfares decorativos
  for (let wx = Math.floor(x0 / 260) * 260; wx < x1; wx += 260) {
    const n = hash(wx / 260 + 0.5); if (n < 0.55) continue;
    const px = X(wx + n * 120), py = Y(25 + hash(n * 7) * (pondH - 50)), r = (11 + n * 6) * k, a = Math.sin(t / 1500 + n * 9) * 0.2;
    c.fillStyle = '#4CAF50'; c.beginPath(); c.moveTo(px, py); c.arc(px, py, r, a + 0.35, a + Math.PI * 2 - 0.35); c.closePath(); c.fill();
    c.strokeStyle = '#2E7D32'; c.lineWidth = Math.max(1, k); c.stroke();
  }

  // Orilla de abajo
  c.fillStyle = '#8B6B3F'; c.fillRect(0, Y(pondH - 2), w, 8 * k);
  c.fillStyle = '#76C267'; c.fillRect(0, Y(pondH + 6), w, h - Y(pondH + 6));

  // Decoración en las orillas
  for (let wx = Math.floor(x0 / 120) * 120; wx < x1; wx += 120) {
    const n = hash(wx / 120), m = hash(wx / 120 + 3.3);
    const top = TOP_DECOR[n * TOP_DECOR.length | 0];
    emoji(c, top, X(wx + n * 50), Y(-8 - m * 18), (30 + m * 22) * k, Math.sin(t / 1100 + n * 7) * 0.05);
    const bot = BOT_DECOR[m * BOT_DECOR.length | 0];
    emoji(c, bot, X(wx + 60 + m * 40), Y(pondH + 46 + n * 30), (24 + n * 14) * k, Math.sin(t / 900 + m * 5) * 0.08);
  }
  }
  // Mariposas
  for (let i = 0; i < 4; i++) {
    const bx = ((t * 0.035 + i * 330) % (w + 120)) - 60, by = (i % 2 ? Y(-30) : Y(pondH + 30)) + Math.sin(t / 400 + i) * 14 * k;
    c.save(); c.translate(bx, by); c.scale(0.55 + 0.45 * Math.abs(Math.sin(t / 90 + i)), 1); emoji(c, '🦋', 0, 0, 20 * k); c.restore();
  }

  // Salida, meta y letreros de distancia
  const sq = Math.max(5, 12 * k);
  checker(c, X(0) - sq, Y(0), Y(pondH), sq, '#F03E6E', '#fff');
  if (X(trackLen) < w + 40) { checker(c, X(trackLen), Y(0), Y(pondH), sq, '#1B2B34', '#fff'); emoji(c, '🏁', X(trackLen) + sq, Y(-4), 34 * k); }
  c.font = `700 ${Math.max(9, 12 * k)}px system-ui, sans-serif`; c.textAlign = 'center';
  for (let m = 1000; m < trackLen; m += 1000) {
    const sx = X(m); if (sx < -60 || sx > w + 60) continue;
    c.fillStyle = '#6B4423'; c.fillRect(sx - 2 * k, Y(-30), 4 * k, 26 * k);
    c.fillStyle = '#C08A4E'; c.beginPath(); c.roundRect(sx - 26 * k, Y(-46), 52 * k, 18 * k, 4 * k); c.fill();
    c.fillStyle = '#fff'; c.fillText(m / 10 + ' m', sx, Y(-33));
  }
  c.textAlign = 'left';

  // Obstáculos
  for (const o of obstacles) {
    const right = o.t === 'tronco' ? o.x + o.w : o.x + o.r, left = o.t === 'tronco' ? o.x : o.x - o.r;
    if (right < x0 || left > x1) continue;
    if (o.t === 'remolino') {
      const cx = X(o.x), cy = Y(o.y), r = o.r * k, a = t / 400;
      c.fillStyle = 'rgba(25,70,140,.35)'; ell(c, cx, cy, r, r); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1.5, 3 * k);
      for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(cx, cy, r * (0.2 + i * 0.22), a + i * 1.3, a + i * 1.3 + 3.6); c.stroke(); }
    } else if (o.t === 'roca') {
      const cx = X(o.x), cy = Y(o.y), r = o.r * k, p = 1 + Math.sin(t / 500 + o.x) * 0.05;
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = Math.max(1, 2 * k); ell(c, cx, cy + r * 0.25, r * 1.18 * p, r * 0.9 * p); c.stroke();
      c.fillStyle = '#6E737A'; ell(c, cx, cy, r, r * 0.88); c.fill();
      c.fillStyle = '#9AA0A6'; ell(c, cx - r * 0.12, cy - r * 0.15, r * 0.8, r * 0.66); c.fill();
      c.fillStyle = '#C3C8CD'; ell(c, cx - r * 0.35, cy - r * 0.38, r * 0.25, r * 0.16, -0.5); c.fill();
      c.fillStyle = '#69B25E'; ell(c, cx + r * 0.3, cy - r * 0.5, r * 0.3, r * 0.14, 0.3); c.fill();
    } else {
      const sx = X(o.x), sy = Y(o.y), sw = o.w * k, sh = o.h * k, vert = o.h > o.w, th = Math.min(sw, sh);
      c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = Math.max(1, 2 * k);
      c.beginPath(); c.roundRect(sx - 5 * k, sy - 5 * k, sw + 10 * k, sh + 10 * k, th / 2 + 5 * k); c.stroke();
      c.fillStyle = '#8B5A2B'; c.beginPath(); c.roundRect(sx, sy, sw, sh, th / 2); c.fill();
      c.strokeStyle = '#6B4220'; c.lineWidth = Math.max(1, 1.5 * k);
      for (let i = 1; i < 4; i++) { c.beginPath(); vert ? (c.moveTo(sx + sw * 0.3, sy + sh * i / 4), c.lineTo(sx + sw * 0.7, sy + sh * i / 4 - 6 * k)) : (c.moveTo(sx + sw * i / 4, sy + sh * 0.3), c.lineTo(sx + sw * i / 4 + 6 * k, sy + sh * 0.7)); c.stroke(); }
      const ex = vert ? sx + sw / 2 : sx + sw - th / 2, ey = vert ? sy + sh - th / 2 : sy + sh / 2;
      c.fillStyle = '#D9A066'; ell(c, ex, ey, th / 2.4, th / 2.4); c.fill();
      c.strokeStyle = '#8B5A2B'; ell(c, ex, ey, th / 5, th / 5); c.stroke();
      c.fillStyle = '#4CAF50'; ell(c, vert ? sx + sw / 2 : sx + sw * 0.3, vert ? sy + sh * 0.25 : sy + 3 * k, 5 * k, 3 * k); c.fill();
    }
  }

  // Patos (de atrás hacia adelante)
  const lp = Math.max(10, Math.min(15, 13 * k));
  for (const d of [...ducks].sort((a, b) => a.y - b.y || !!a.me - !!b.me)) {
    const sx = X(d.x), sy = Y(d.y), base = sy + 12 * k, s = k * 0.95;
    if (sx < -10 * k) {
      if (V.arrows && sy > 0 && sy < h) {
        c.globalAlpha = d.alpha ?? 1; c.fillStyle = '#fff'; c.font = `700 ${lp}px system-ui, sans-serif`;
        c.fillText(`◂ ${ICONS[d.icon]} ${Math.round((camX - d.x) / 10)} m`, 6, sy); c.globalAlpha = 1;
      }
      continue;
    }
    c.globalAlpha = d.alpha ?? 1;
    if (d.moving) {
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = Math.max(1, 2 * k);
      c.beginPath(); c.moveTo(sx - 18 * k, base - 2 * k); c.lineTo(sx - 52 * k, base - 12 * k); c.moveTo(sx - 18 * k, base + 2 * k); c.lineTo(sx - 52 * k, base + 10 * k); c.stroke();
    }
    c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1, 1.6 * k);
    ell(c, sx, base, 31 * k * (1 + Math.sin(t / 300 + d.pid) * 0.06), 6.5 * k); c.stroke();
    drawDuck(c, sx, base, s, d.duck, { t, seed: d.pid, moving: d.moving, nitro: d.nitro, stun: d.stun, alpha: d.alpha });
    c.fillStyle = 'rgba(59,126,198,.6)'; ell(c, sx, base - s, 28 * s, 5 * s); c.fill();
    c.globalAlpha = 1;
    if (d.name != null) {
      const label = `${ICONS[d.icon]} ${d.name}`;
      c.font = `700 ${lp}px "Baloo 2", system-ui, sans-serif`;
      const tw = c.measureText(label).width, px = sx - 30 * k - tw - 12, py = sy - lp * 0.75;
      c.globalAlpha = d.offline ? 0.5 : 1;
      c.fillStyle = d.me ? '#FFD43B' : 'rgba(255,255,255,.95)'; c.beginPath(); c.roundRect(px, py, tw + 12, lp * 1.5, lp * 0.75); c.fill();
      c.fillStyle = '#1B2B34'; c.textBaseline = 'middle'; c.fillText(label, px + 6, py + lp * 0.78); c.textBaseline = 'alphabetic';
      c.globalAlpha = 1;
    }
  }
}

// Lago pintado (public/lago/fondo.jpg): medidas en píxeles de la imagen y franja de agua.
const LAKE_W = 1800, LAKE_H = 874, LAKE_WATER = [262, 738];
const lakeImage = name => typeof Image === 'undefined' ? null : Object.assign(new Image(), { src: `lago/${name}?v=${ART_V}` });
const LAKE_BG = lakeImage('fondo.jpg');        // sala: lago con flores y nenúfares
const LAKE_RACE = lakeImage('carrera.jpg');    // carrera: lago despejado (misma franja de agua)
const imgReady = im => im && im.complete && im.naturalWidth;

// Fondo para la vista que sigue a un pato: el lago se repite a lo largo de la pista (una copia sí y otra
// en espejo, así las orillas empatan) y su franja de agua coincide con el estanque del juego.
// Arriba sigue el cielo y abajo el pasto. Devuelve false si la imagen aún no carga.
// race: 0 = lago de la sala, 1 = lago de la carrera (valores intermedios = transición).
function drawLakeTiles(c, { w, h, camX, camY, k, pondH, race = 0 }) {
  if (!imgReady(LAKE_BG)) return false;
  const s = pondH * k / (LAKE_WATER[1] - LAKE_WATER[0]), tw = LAKE_W * s, th = LAKE_H * s;
  const top = (0 - camY) * k - LAKE_WATER[0] * s;
  c.fillStyle = '#43BFFD'; c.fillRect(0, 0, w, Math.max(0, top) + 2);
  c.fillStyle = '#50A539'; c.fillRect(0, top + th - 2, w, h);
  const off = camX * k, first = Math.floor(off / tw);
  const layers = [[LAKE_BG, 1]];
  if (race > 0 && imgReady(LAKE_RACE)) layers.push([LAKE_RACE, race]);
  for (const [img, alpha] of layers) {
    c.globalAlpha = alpha;
    for (let i = first; i * tw - off < w; i++) {
      const x = i * tw - off;
      c.save();
      if (i % 2) { c.translate(x + tw, top); c.scale(-1, 1); } else c.translate(x, top);
      c.drawImage(img, 0, 0, tw + 1, th);
      c.restore();
    }
  }
  c.globalAlpha = 1;
  return true;
}

// Barra de avance: un ícono por pato sobre una línea hasta la meta.
function drawProgress(c, x, y, w, ducks, trackLen) {
  c.fillStyle = 'rgba(27,43,52,.18)'; c.fillRect(x, y - 2, w, 4);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const d of [...ducks].sort((a, b) => !!a.me - !!b.me)) {
    c.globalAlpha = d.me ? 1 : 0.75; c.font = `${d.me ? 22 : 15}px system-ui, sans-serif`;
    c.fillText(ICONS[d.icon], x + Math.max(0, Math.min(1, d.x / trackLen)) * w, y);
  }
  c.globalAlpha = 1; c.font = '18px system-ui, sans-serif'; c.fillText('🏁', x + w + 14, y);
  c.textAlign = 'left'; c.textBaseline = 'alphabetic';
}

// Interpola posiciones del servidor (15/s) a 60 fps y deriva hacia dónde miran los ojos.
function smooth(live) {
  for (const s of live.values()) {
    if (Math.abs(s.tx - s.x) > 300 || Math.abs(s.ty - s.y) > 300) { s.x = s.tx; s.y = s.ty; }
    const dx = (s.tx - s.x) * 0.3, dy = (s.ty - s.y) * 0.3;
    s.x += dx; s.y += dy;
    s.moving = Math.hypot(dx, dy) > 0.25;
    s.look = s.moving ? [Math.max(-1, Math.min(1, dx / 2)), Math.max(-1, Math.min(1, dy / 2))] : null;
  }
}

// Lienzo nítido en pantallas retina; devuelve el tamaño en px CSS.
function fitCanvas(cv) {
  const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { c, w: r.width, h: r.height };
}

// Miniaturas animadas (parpadean y miran alrededor) para el selector, la sala y el podio.
const thumbs = new Set();
function paintThumb(cv, t) {
  const { i, px, c } = cv.duck;
  c.clearRect(0, 0, px, px);
  drawDuck(c, px * 0.5, px * 0.94, px / 76, i, { t, seed: i });
}
function animateThumbs(t) {
  for (const cv of thumbs) {
    if (!cv.isConnected && ++cv.duck.away > 120) { thumbs.delete(cv); continue; }
    paintThumb(cv, t);
  }
  if (thumbs.size) requestAnimationFrame(animateThumbs);
}
function duckThumb(i, px = 72) {
  const cv = document.createElement('canvas'), dpr = window.devicePixelRatio || 1;
  cv.width = cv.height = px * dpr; cv.style.width = cv.style.height = px + 'px';
  const c = cv.getContext('2d'); c.scale(dpr, dpr);
  cv.duck = { i, px, c, away: 0 };
  paintThumb(cv, 1000);
  if (!thumbs.size) requestAnimationFrame(animateThumbs);
  thumbs.add(cv);
  return cv;
}

if (typeof module !== 'undefined') module.exports = { DUCKS, ICONS };
