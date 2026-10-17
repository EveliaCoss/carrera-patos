// Patos, íconos y dibujo de la pista. Lo usan las páginas (alumno y maestra) y server.js (validación).

// Patitos de hule (imágenes en /ducks/NN.png): [nombre, ancho, alto, ojos abiertos].
// Cada ojo: [x, y, rx, ry] como fracción de la imagen + color de la cara alrededor (para el parpadeo).
const DUCKS = [
  ['Marinero', 166, 180, [[0.7198, 0.4291, 0.0392, 0.0583, '#fbd9ba'], [0.4431, 0.4628, 0.0633, 0.0611, '#fceccf']]],
  ['Astronauta', 159, 180, [[0.7315, 0.3925, 0.0409, 0.0556, '#fcdc96'], [0.4331, 0.42, 0.0629, 0.0583, '#fdecab']]],
  ['Vaquero', 162, 180, [[0.8398, 0.4149, 0.037, 0.0556, '#fcdca9'], [0.5546, 0.4476, 0.0617, 0.0583, '#fdedb9']]],
  ['Detective', 175, 178, [[0.7119, 0.3984, 0.0371, 0.059, '#fce1ad'], [0.436, 0.4375, 0.06, 0.059, '#fcf1bc']]],
  ['Chef', 156, 180, [[0.8356, 0.4409, 0.0417, 0.0556, '#fde2ac'], [0.5474, 0.4756, 0.0609, 0.0556, '#fdedbe']]],
  ['Doctor', 169, 172, [[0.8217, 0.3258, 0.0414, 0.061, '#fce3be'], [0.5188, 0.3692, 0.0651, 0.064, '#fdf1d0']]],
  ['Enfermera', 176, 180, [[0.7366, 0.3935, 0.0369, 0.0528, '#fce5bf'], [0.4668, 0.4341, 0.0597, 0.0583, '#fdf0c6']]],
  ['Mago', 180, 174, [[0.7054, 0.45, 0.0333, 0.0517, '#fcd8ac'], [0.457, 0.4871, 0.0528, 0.0575, '#fce9bc']]],
  ['Bruja', 180, 176, [[0.7539, 0.4497, 0.0361, 0.054, '#fbd297'], [0.5112, 0.483, 0.0528, 0.0568, '#fcdead']]],
  ['Artista', 180, 173, [[0.7425, 0.3871, 0.0361, 0.0607, '#fde3bb'], [0.4791, 0.4252, 0.0583, 0.0607, '#fdebbf']]],
  ['Músico', 174, 174, [[0.7112, 0.3566, 0.0402, 0.0603, '#fbde9b'], [0.4282, 0.3906, 0.0603, 0.0632, '#fdeda9']]],
  ['Gamer', 155, 174, [[0.7966, 0.3627, 0.0419, 0.0603, '#fbe0af'], [0.4798, 0.3965, 0.0677, 0.0632, '#fdeab9']]],
  ['Graduado', 168, 180, [[0.8055, 0.4081, 0.0387, 0.0556, '#fce095'], [0.5231, 0.4408, 0.0595, 0.0556, '#fdeea6']]],
  ['Científico', 180, 169, [[0.7469, 0.3444, 0.0417, 0.0592, '#f7d6ad'], [0.4852, 0.3821, 0.0528, 0.0621, '#f9ecc1']]],
  ['Girasol', 180, 175, [[0.7597, 0.3739, 0.0361, 0.0571, '#fce2b0'], [0.4958, 0.4104, 0.0583, 0.06, '#fdeebd']]],
  ['Hawaiano', 174, 175, [[0.828, 0.3432, 0.0402, 0.06, '#fcdfb7'], [0.5482, 0.3814, 0.0603, 0.0629, '#fcedca']]],
  ['Playa', 177, 175, [[0.7513, 0.3677, 0.0395, 0.0629, '#f58641'], [0.49, 0.4062, 0.0565, 0.0629, '#f9aa72']]],
  ['Buzo', 180, 176, [[0.786, 0.3641, 0.0361, 0.0597, '#f2cbab'], [0.5138, 0.3954, 0.0583, 0.0625, '#fbe9b9']]],
  ['Explorador', 152, 175, [[0.826, 0.3734, 0.0428, 0.0571, '#fcdfa7'], [0.5012, 0.4167, 0.0691, 0.06, '#fcedb6']]],
  ['Lluvia', 180, 166, [[0.6537, 0.3761, 0.0361, 0.0602, '#fbd6a3'], [0.3989, 0.415, 0.0556, 0.0633, '#fdecbc']]],
  ['Invierno', 175, 180, [[0.8758, 0.3975, 0.04, 0.0556, '#fbe4b3'], [0.5952, 0.4434, 0.06, 0.0583, '#fdeebe']]],
  ['Fresa', 170, 180, [[0.8401, 0.4285, 0.0382, 0.0556, '#fcd4a4'], [0.5545, 0.4645, 0.0618, 0.0583, '#fdebc4']]],
  ['Rana', 168, 180, [[0.827, 0.4024, 0.0417, 0.0583, '#fcdfa2'], [0.5321, 0.4378, 0.0625, 0.0583, '#fde9bd']]],
  ['Panda', 157, 179, [[0.8288, 0.4098, 0.0446, 0.0587, '#fce4ac'], [0.5004, 0.4444, 0.0701, 0.0615, '#fceebc']]],
  ['Gatito', 162, 179, [[0.8496, 0.4118, 0.0463, 0.0587, '#fce2ab'], [0.528, 0.447, 0.0648, 0.0615, '#fcedbb']]],
  ['Dino', 147, 180, [[0.8923, 0.4232, 0.0408, 0.0556, '#fbd772'], [0.5711, 0.4578, 0.068, 0.0556, '#fde683']]],
  ['Unicornio', 160, 180, [[0.8717, 0.4437, 0.0406, 0.0583, '#fbe1c6'], [0.5638, 0.4818, 0.0656, 0.0583, '#fce2da']]],
  ['Abeja', 158, 180, [[0.8711, 0.4359, 0.0411, 0.0556, '#fce18a'], [0.5596, 0.4818, 0.0665, 0.0583, '#fdee9d']]],
  ['Cupcake', 145, 180, [[0.7245, 0.4268, 0.0414, 0.0472, '#fcdcb4'], [0.4286, 0.4644, 0.0621, 0.0528, '#fde5b8']]],
  ['Dona', 166, 179, [[0.7559, 0.3098, 0.0452, 0.0615, '#fcdfb5'], [0.4404, 0.3497, 0.0633, 0.0615, '#fdebc3']]],
  ['Elegante', 137, 180, [[0.8402, 0.4185, 0.0438, 0.05, '#fde3b0'], [0.5109, 0.4557, 0.0693, 0.0528, '#fdeebe']]],
  ['Princesa', 153, 180, [[0.8026, 0.3988, 0.0458, 0.0528, '#fde5b1'], [0.499, 0.4448, 0.0621, 0.0556, '#fdedbe']]],
  ['Pirata', 150, 180, [[0.7999, 0.4416, 0.04, 0.05, '#fce1b0'], [0.505, 0.478, 0.0633, 0.0528, '#fdeeb8']]],
  ['Samurái', 144, 180, [[0.5257, 0.494, 0.0625, 0.0528, '#fce6b9'], [0.822, 0.445, 0.045, 0.05, '#fce6b9']]],
  ['Ángel', 153, 180, [[0.8263, 0.4034, 0.0425, 0.0556, '#fce4b8'], [0.5182, 0.4413, 0.0621, 0.0556, '#fdeec3']]],
  ['Calabaza', 180, 162, [[0.7705, 0.4194, 0.0306, 0.0586, '#fcde98'], [0.5384, 0.4657, 0.0611, 0.0679, '#fdeeb2']]],
  ['Bruja Naranja', 180, 158, [[0.7743, 0.4202, 0.0306, 0.0601, '#fdc678'], [0.5476, 0.466, 0.0583, 0.0696, '#fdecb0']]],
  ['Fantasma', 180, 148, [[0.7933, 0.3788, 0.0306, 0.0642, '#fcd0b3'], [0.5643, 0.4217, 0.0583, 0.0743, '#fdedb4']]],
  ['Vampiro', 180, 147, [[0.7911, 0.3514, 0.0306, 0.0646, '#fcc06c'], [0.5622, 0.3987, 0.0611, 0.0782, '#fdeec5']]],
  ['Esqueleto', 180, 144, [[0.7794, 0.3338, 0.0306, 0.066, '#fdc893'], [0.544, 0.3811, 0.0611, 0.0799, '#fdeec9']]],
  ['Diablito', 180, 141, [[0.7496, 0.3927, 0.0278, 0.0638, '#fdcb85'], [0.5371, 0.4389, 0.0556, 0.0745, '#fdeebc']]],
  ['Gato Negro', 180, 151, [[0.804, 0.3886, 0.0306, 0.0629, '#fcbb75'], [0.5719, 0.4351, 0.0611, 0.0762, '#fdeeb4']]],
  ['Bruja Escoba', 180, 147, [[0.7332, 0.4531, 0.0278, 0.0612, '#fdd884'], [0.5163, 0.5017, 0.0556, 0.0714, '#fdeaaf']]],
  ['Momia', 180, 146, [[0.7978, 0.355, 0.0306, 0.0651, '#fcc37c'], [0.5621, 0.4042, 0.0611, 0.0788, '#fde8ae']]],
  ['Frankenstein', 180, 152, [[0.7919, 0.382, 0.0306, 0.0658, '#e3c445'], [0.5536, 0.4314, 0.0611, 0.0757, '#e5e76a']]],
  ['Murciélago Calabaza', 180, 146, [[0.8554, 0.4059, 0.0278, 0.0616, '#fdc87f'], [0.6297, 0.4553, 0.0583, 0.0753, '#fdedba']]],
  ['La Parca', 180, 135, [[0.8202, 0.312, 0.0528, 0.1148, '#908a91'], [0.6833, 0.3629, 0.0278, 0.0667, '#fbc074']]],
  ['Calavera Flores', 180, 149, [[0.8445, 0.3787, 0.0333, 0.0738, '#fca98b'], [0.603, 0.427, 0.0694, 0.0839, '#f5a3c8']]],
  ['Bruja Telaraña', 180, 153, [[0.795, 0.4629, 0.0278, 0.0621, '#fdc382'], [0.5697, 0.5087, 0.0583, 0.0686, '#fdebaf']]],
  ['Murciélago', 180, 143, [[0.8386, 0.4064, 0.0278, 0.0629, '#fcc680'], [0.6172, 0.4527, 0.0583, 0.0734, '#fdecbc']]],
  ['Pirata Fantasma', 180, 153, [[0.7933, 0.456, 0.0306, 0.0621, '#fcc783'], [0.5617, 0.5019, 0.0611, 0.0752, '#fdefbb']]],
  ['Calabazota', 180, 148, [[0.8146, 0.4078, 0.0306, 0.0642, '#fdc059'], [0.5852, 0.4579, 0.0583, 0.0777, '#fdeaaf']]],
  ['Hechicero', 180, 132, [[0.7569, 0.3783, 0.0278, 0.0682, '#fcc67b'], [0.5445, 0.429, 0.0556, 0.0795, '#fdeebc']]],
  ['Araña', 180, 151, [[0.8248, 0.3916, 0.0306, 0.0662, '#fcbf73'], [0.5897, 0.4392, 0.0611, 0.0728, '#fdecb3']]],
  ['Bruja Verde', 180, 154, [[0.7979, 0.4179, 0.0306, 0.0617, '#fdc56e'], [0.5704, 0.4646, 0.0583, 0.0714, '#fde8a3']]],
  ['Gato Murciélago', 180, 142, [[0.8387, 0.4007, 0.0278, 0.0599, '#fdc883'], [0.6212, 0.4487, 0.0556, 0.0739, '#fdecb7']]],
  ['Dulcecito', 180, 152, [[0.8043, 0.3891, 0.0306, 0.0658, '#fcd890'], [0.5612, 0.4396, 0.0611, 0.0757, '#fdedb9']]],
  ['Fantasma Azul', 180, 142, [[0.8127, 0.3741, 0.0306, 0.0669, '#fccfb2'], [0.5825, 0.4232, 0.0611, 0.0775, '#fdecbf']]],
  ['Zombi', 180, 149, [[0.821, 0.3871, 0.0333, 0.0638, '#ebc455'], [0.5825, 0.4367, 0.0611, 0.0772, '#eae36d']]],
  ['Calabacita', 180, 167, [[0.7806, 0.395, 0.0306, 0.0599, '#fdbe78'], [0.5368, 0.4418, 0.0611, 0.0689, '#fdecb0']]],
  ['Bruja Voladora', 180, 164, [[0.7933, 0.4307, 0.0306, 0.0579, '#fdc482'], [0.5647, 0.4717, 0.0583, 0.0671, '#fdeab5']]],
  ['Fantasma Cosido', 180, 152, [[0.8376, 0.3858, 0.0306, 0.0625, '#fdd3b5'], [0.6058, 0.4262, 0.0611, 0.0757, '#fdeed6']]],
  ['Espantapájaros', 180, 165, [[0.791, 0.3968, 0.0306, 0.0576, '#fcc183'], [0.5526, 0.4381, 0.0639, 0.0667, '#fdecae']]],
  ['Esqueleto Flores', 180, 151, [[0.8312, 0.3268, 0.0306, 0.0662, '#fdc29d'], [0.5946, 0.3776, 0.0667, 0.0828, '#fdf1de']]],
  ['Bruja Calabazas', 180, 158, [[0.8004, 0.4115, 0.0278, 0.0601, '#fec47c'], [0.5689, 0.4564, 0.0583, 0.0696, '#fde8ae']]],
  ['Catrina Flores', 180, 154, [[0.7798, 0.3432, 0.0306, 0.0617, '#fdca65'], [0.4072, 0.3411, 0.0333, 0.0357, '#e83b68']]],
  ['Catrín Esqueleto', 180, 156, [[0.7658, 0.3546, 0.0278, 0.0577, '#fdc633'], [0.56, 0.4259, 0.0611, 0.0737, '#fdf3df']]],
  ['Catrina Rosa', 180, 152, [[0.7388, 0.3546, 0.0278, 0.0625, '#fcc66e'], [0.5339, 0.4232, 0.0611, 0.0789, '#fdefe0']]],
  ['Mariachi', 180, 155, [[0.748, 0.3518, 0.0278, 0.0581, '#fdc333'], [0.5453, 0.4187, 0.0639, 0.0742, '#fde99b']]],
  ['Catrina Velo', 180, 143, [[0.7907, 0.3436, 0.025, 0.0664, '#fdc13c'], [0.6009, 0.413, 0.0583, 0.0769, '#fdede0']]],
  ['Catrín Calavera', 180, 161, [[0.7881, 0.4177, 0.0222, 0.0559, '#fcc534'], [0.6005, 0.475, 0.0583, 0.0683, '#fcf1e0']]],
  ['Catrina Morada', 180, 158, [[0.7884, 0.3941, 0.025, 0.057, '#fcbc34'], [0.5931, 0.4556, 0.0611, 0.0728, '#fdebcd']]],
  ['Catrina Encaje', 180, 147, [[0.8163, 0.3525, 0.0278, 0.0646, '#fdbf76'], [0.6085, 0.4172, 0.0611, 0.0782, '#fdefd7']]],
  ['Mariachi Rojo', 180, 154, [[0.8105, 0.3845, 0.0222, 0.0584, '#fd9125'], [0.6132, 0.4457, 0.0583, 0.0747, '#fc5d2f']]],
  ['Catrina Azul', 180, 146, [[0.777, 0.3514, 0.0278, 0.0651, '#fdcf8b'], [0.5735, 0.411, 0.0611, 0.0788, '#fdf4d6']]],
  ['Mariachi Guitarra', 180, 142, [[0.7159, 0.3889, 0.0222, 0.0563, '#f78c82'], [0.5338, 0.448, 0.0556, 0.0739, '#ef54f8']]],
  ['Catrina Blanca', 180, 155, [[0.8113, 0.3595, 0.0278, 0.0613, '#fdca7e'], [0.6028, 0.4213, 0.0639, 0.0774, '#fdf1d6']]],
  ['Catrina Rebozo', 180, 146, [[0.8166, 0.3269, 0.0278, 0.0651, '#fdc04a'], [0.6111, 0.3945, 0.0611, 0.0822, '#fde490']]],
  ['Charro Vela', 180, 148, [[0.7514, 0.3808, 0.025, 0.0608, '#fdc051'], [0.5469, 0.4418, 0.0583, 0.0743, '#fde895']]],
  ['Catrina Fiesta', 180, 145, [[0.8057, 0.3488, 0.0306, 0.069, '#fdc071'], [0.5949, 0.4159, 0.0611, 0.0828, '#fde9dc']]],
  ['Calaverita', 180, 142, [[0.7985, 0.3401, 0.0278, 0.0634, '#fdc656'], [0.5935, 0.4074, 0.0611, 0.081, '#fceed9']]],
  ['Charro Guitarra', 180, 139, [[0.7296, 0.3798, 0.025, 0.0612, '#fdc34c'], [0.5352, 0.4391, 0.0583, 0.0791, '#fdeba2']]],
  ['Catrina Noche', 180, 143, [[0.8405, 0.3592, 0.025, 0.0664, '#fdc342'], [0.6378, 0.4203, 0.0611, 0.0804, '#fdeadf']]],
  ['Catrina Vela', 180, 147, [[0.7807, 0.3374, 0.0278, 0.068, '#e68b69'], [0.5766, 0.3959, 0.0611, 0.0816, '#b341fa']]],
  ['Catrín Elegante', 180, 163, [[0.8142, 0.4051, 0.0278, 0.0583, '#fcc06a'], [0.6024, 0.4663, 0.0639, 0.0706, '#fdf2e1']]],
  ['Catrina Lila', 180, 141, [[0.8105, 0.3467, 0.0278, 0.0674, '#fdc182'], [0.6075, 0.4061, 0.0639, 0.0851, '#fde9cb']]],
  ['Charro', 180, 150, [[0.7658, 0.391, 0.0278, 0.0633, '#fcc23d'], [0.5651, 0.4453, 0.0611, 0.0767, '#fde692']]],
  ['Catrina Sombrero', 180, 148, [[0.7995, 0.3903, 0.0278, 0.0642, '#fcbb70'], [0.5882, 0.4521, 0.0611, 0.0777, '#fde6dd']]],
  ['Charro Morado', 180, 156, [[0.586, 0.454, 0.0611, 0.0762, '#3d3842'], [0.795, 0.397, 0.025, 0.0596, '#3d3842']]],
  ['Catrina Talavera', 180, 146, [[0.7949, 0.3476, 0.0278, 0.0651, '#fdc745'], [0.5891, 0.4122, 0.0611, 0.0822, '#fdf4d4']]],
  ['Charrito', 180, 153, [[0.7947, 0.3837, 0.0278, 0.0621, '#fdc75b'], [0.5866, 0.4434, 0.0611, 0.0752, '#fde588']]],
  ['Catrina Mantilla', 180, 138, [[0.8298, 0.3389, 0.025, 0.0688, '#fdc26b'], [0.6335, 0.4004, 0.0611, 0.0797, '#fdecd3']]],
  ['Catrín Sombrero', 180, 154, [[0.7781, 0.4199, 0.0306, 0.0617, '#fdc127'], [0.566, 0.4748, 0.0611, 0.0747, '#fdf2e2']]],
  ['Catrina Velita', 180, 134, [[0.7568, 0.329, 0.025, 0.0634, '#d7977c'], [0.5653, 0.3956, 0.0583, 0.0821, '#b947fa']]],
  ['Charrito Sarape', 180, 152, [[0.7833, 0.3854, 0.0278, 0.0625, '#fdc150'], [0.5681, 0.4377, 0.0639, 0.0789, '#fde68e']]],
];

const ICONS = ['⭐', '🔥', '⚡', '🍀', '🌈', '🎯', '🚀', '🎸', '🍕', '🐸', '👑', '💎', '🌙', '🎮', '🏆', '🍩', '🦄', '⚽',
  // Halloween y Día de Muertos (al final para no cambiar los íconos ya elegidos)
  '🎃', '💀', '☠️', '👻', '🦇', '🕷️', '🕸️', '🧙', '🧛', '🧟', '🍬', '🍭', '🕯️', '🌕', '🐈‍⬛', '🌼', '🪦', '🔮'];

// Versión de las imágenes: al cambiarla, los navegadores no pueden reusar copias viejas. herramientas/recortar_patos.py la actualiza.
const ART_V = '20261016191445';
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

  // Halloween: calabazas y calaveritas en las orillas, velitas y calabazas flotando, murciélagos en el cielo.
  // Avanzan con la cámara (quedan fijas en la pista) y se mecen suavemente.
  for (let wx = Math.floor(x0 / 340) * 340; wx < x1; wx += 340) {
    const n = hash(wx / 340 + 7.7), m = hash(wx / 340 + 1.3);
    const sway = Math.sin(t / 900 + n * 9) * 0.08;
    emoji(c, ['🎃', '💀', '🎃', '🪦'][n * 4 | 0], X(wx + 40 + m * 120), Y(-10 - n * 14), (26 + m * 10) * k, sway);
    emoji(c, ['💀', '🎃', '🕯️', '🎃'][m * 4 | 0], X(wx + 200 + n * 90), Y(pondH + 40 + m * 34), (24 + n * 10) * k, -sway);
    if (n > 0.45) { // flotando en el agua, cerca de la orilla para no confundirse con obstáculos
      const fy = n > 0.72 ? 14 : pondH - 6, bob = Math.sin(t / 700 + m * 6) * 3 * k;
      c.globalAlpha = 0.9; emoji(c, m > 0.5 ? '🕯️' : '🎃', X(wx + 120 + m * 160), Y(fy) + bob, 20 * k, Math.sin(t / 600 + n * 4) * 0.12); c.globalAlpha = 1;
    }
  }
  for (let i = 0; i < 3; i++) {
    const bx = w + 80 - ((t * 0.05 + i * 410) % (w + 200)), by = Y(-BANK_TOP + 40 + i * 22) + Math.sin(t / 250 + i * 2) * 10 * k;
    c.save(); c.translate(bx, by); c.scale(1, 0.6 + 0.4 * Math.abs(Math.sin(t / 110 + i))); emoji(c, '🦇', 0, 0, (18 + i * 3) * k); c.restore();
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
