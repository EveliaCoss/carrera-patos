# Recorta las hojas de patitos en imágenes sin fondo, encuentra sus ojos para el parpadeo
# y reescribe la tabla DUCKS de public/ducks.js (los patos se numeran en el orden de las hojas).
#
#   uv run --no-project --with pillow --with numpy python herramientas/recortar_patos.py \
#       herramientas/hojas/1-clasicos.png:7x5 herramientas/hojas/2-halloween.png:6x5 herramientas/hojas/3-dia-de-muertos.png:6x5
#
# Cada hoja: fondo blanco, patos en rejilla (columnas x filas). Para agregar patos, agrega una hoja al final y
# sus nombres al final de NAMES. Si cambias el total, revisa el límite de "duck" en database.rules.json.
import json, re, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

SHEETS = [(a.rsplit(':', 1)[0], *map(int, a.rsplit(':', 1)[1].split('x'))) for a in sys.argv[1:]]
CLOSED = set()  # índices de patos dibujados con los ojos ya cerrados (no parpadean)
# Ojos que no se pueden encontrar solos (ojos negros sobre una cara negra): [x, y, rx, ry, color de la cara].
EYE_FIX = {
    88: [[0.586, 0.454, 0.0611, 0.0762, '#3d3842'], [0.795, 0.397, 0.025, 0.0596, '#3d3842']],  # Charro Morado
    33: [[0.5257, 0.494, 0.0625, 0.0528, '#fce6b9'], [0.822, 0.445, 0.045, 0.05, '#fce6b9']],  # Samurái (el casco negro confunde)
}
ROOT = __file__.rsplit('/herramientas/', 1)[0]
out_dir = f'{ROOT}/public/ducks'
TOL, PLATE_TOL = 3, 4
NAMES = ['Marinero', 'Astronauta', 'Vaquero', 'Detective', 'Chef', 'Doctor', 'Enfermera', 'Mago', 'Bruja', 'Artista',
         'Músico', 'Gamer', 'Graduado', 'Científico', 'Girasol', 'Hawaiano', 'Playa', 'Buzo', 'Explorador', 'Lluvia',
         'Invierno', 'Fresa', 'Rana', 'Panda', 'Gatito', 'Dino', 'Unicornio', 'Abeja', 'Cupcake', 'Dona', 'Elegante',
         'Princesa', 'Pirata', 'Samurái', 'Ángel',
         # Halloween
         'Calabaza', 'Bruja Naranja', 'Fantasma', 'Vampiro', 'Esqueleto', 'Diablito',
         'Gato Negro', 'Bruja Escoba', 'Momia', 'Frankenstein', 'Murciélago Calabaza', 'La Parca',
         'Calavera Flores', 'Bruja Telaraña', 'Murciélago', 'Pirata Fantasma', 'Calabazota', 'Hechicero',
         'Araña', 'Bruja Verde', 'Gato Murciélago', 'Dulcecito', 'Fantasma Azul', 'Zombi',
         'Calabacita', 'Bruja Voladora', 'Fantasma Cosido', 'Espantapájaros', 'Esqueleto Flores', 'Bruja Calabazas',
         # Día de Muertos
         'Catrina Flores', 'Catrín Esqueleto', 'Catrina Rosa', 'Mariachi', 'Catrina Velo', 'Catrín Calavera',
         'Catrina Morada', 'Catrina Encaje', 'Mariachi Rojo', 'Catrina Azul', 'Mariachi Guitarra', 'Catrina Blanca',
         'Catrina Rebozo', 'Charro Vela', 'Catrina Fiesta', 'Calaverita', 'Charro Guitarra', 'Catrina Noche',
         'Catrina Vela', 'Catrín Elegante', 'Catrina Lila', 'Charro', 'Catrina Sombrero', 'Charro Morado',
         'Catrina Talavera', 'Charrito', 'Catrina Mantilla', 'Catrín Sombrero', 'Catrina Velita', 'Charrito Sarape']
# La rejilla se toma de la imagen: cerca de cada división esperada (hoja repartida en partes iguales) se corta
# por la columna/fila con menos tinta, así funciona aunque dos patos casi se toquen.
def bands(ink_count, n):
    L = len(ink_count); cuts = [0]
    for k in range(1, n):
        c, win = k * L // n, L // (n * 4)
        lo, hi = max(1, c - win), min(L - 1, c + win)
        cuts.append(lo + int(np.argmin(ink_count[lo:hi])))
    return cuts + [L]

def is_bg(px):
    mn, mx = px.min(-1), px.max(-1)
    return (mn > 196) & (mx - mn < 20)  # fondo blanco + platito gris

def is_page(px):
    mn, mx = px.min(-1), px.max(-1)
    return (mn >= 249) & (mx - mn <= 4)  # solo el blanco puro de la hoja (los fantasmas son un poco más grises o cálidos)

sprites = []
for sheet, ncols, nrows in SHEETS:
  im = np.asarray(Image.open(sheet).convert('RGB')).astype(int)
  ink = ~is_page(im)  # todo lo que no es hoja, platitos incluidos: así el corte cae en el blanco entre patos
  COLS, ROWS = bands(ink.sum(0), ncols), bands(ink.sum(1), nrows)
  print(sheet, 'rejilla', COLS, ROWS)
  for r in range(nrows):
    for ci in range(ncols):
        cell = im[ROWS[r]:ROWS[r + 1], COLS[ci]:COLS[ci + 1]]
        h, w, _ = cell.shape
        cand = is_page(cell)
        bg = np.zeros((h, w), bool)
        q = deque()
        for y in range(h):
            for x in (0, w - 1):
                if cand[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
        for x in range(w):
            for y in (0, h - 1):
                if cand[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
        while q:
            y, x = q.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                # grow only across smooth background: any edge (outline, shading step) stops it
                if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx] and np.abs(cell[ny, nx] - cell[y, x]).max() <= TOL:
                    bg[ny, nx] = True; q.append((ny, nx))
        # Second pass: the plate under each duck. Seed from plate-coloured pixels touching the page in the
        # lower part of the cell and grow across smooth plate shading only.
        cand = is_bg(cell) & (cell[..., 2] - cell[..., 0] >= 6)  # el platito es azulado; un fantasma blanco no
        lower = np.zeros((h, w), bool); lower[int(h * 0.55):] = True
        near = np.zeros((h, w), bool); near[1:] |= bg[:-1]; near[:-1] |= bg[1:]; near[:, 1:] |= bg[:, :-1]; near[:, :-1] |= bg[:, 1:]
        for y, x in zip(*np.nonzero(cand & lower & near & ~bg)):
            bg[y, x] = True; q.append((y, x))
        while q:
            y, x = q.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx] and ny > h * 0.45 and np.abs(cell[ny, nx] - cell[y, x]).max() <= PLATE_TOL:
                    bg[ny, nx] = True; q.append((ny, nx))
        alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
        rgba = Image.fromarray(cell.astype(np.uint8)).convert('RGBA'); rgba.putalpha(alpha)
        box = rgba.getbbox(); rgba = rgba.crop(box)
        rgba.thumbnail((180, 180), Image.LANCZOS)
        n = len(sprites)
        rgba.save(f'{out_dir}/{n:02d}.png', optimize=True)
        sprites.append(rgba)


result = []
for n in range(len(sprites)):
    im = sprites[n]; a = np.asarray(im).astype(int)
    h, w = a.shape[:2]
    dark = (a[..., :3].max(-1) < 75) & (a[..., 3] > 200)
    seen = np.zeros_like(dark); eyes = []
    for y0, x0 in zip(*np.nonzero(dark)):
        if seen[y0, x0]: continue
        q = deque([(y0, x0)]); seen[y0, x0] = True; pts = []
        while q:
            y, x = q.popleft(); pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and dark[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; q.append((ny, nx))
        ys, xs = np.array(pts).T
        bh, bw = np.ptp(ys) + 1, np.ptp(xs) + 1
        fill = len(pts) / (np.pi / 4 * bh * bw)
        # eyes: small, a bit taller than wide, solid, in the face band
        if 15 <= len(pts) <= 600 and 0.75 <= bh / bw <= 3.0 and fill > 0.5 and 0.2 * h < ys.mean() < 0.68 * h and xs.mean() > 0.36 * w:
            # skin colour: median of the opaque face pixels in a ring just outside the eye
            # (any hue, so purple/red/blue faces work; skips the eye itself and white sparkles)
            y1, y2, x1, x2 = max(0, ys.min() - 5), min(h, ys.max() + 6), max(0, xs.min() - 5), min(w, xs.max() + 6)
            ring = a[y1:y2, x1:x2].reshape(-1, 4)
            ring = ring[(ring[:, 3] > 200) & (ring[:, :3].max(-1) > 100) & (ring[:, :3].min(-1) < 240)]
            skin = np.median(ring[:, :3], 0).astype(int).tolist() if len(ring) else [255, 236, 170]
            eyes.append({'n': len(pts), 'x': round(xs.mean() / w, 4), 'y': round(ys.mean() / h, 4), 'rx': round((bw / 2 + 1.5) / w, 4), 'ry': round((bh / 2 + 1.5) / h, 4), 'skin': '#%02x%02x%02x' % tuple(skin)})
    # More than two blobs: keep the best pair (same height, sensible spacing, similar size).
    if len(eyes) > 2:
        best = None
        for i in range(len(eyes)):
            for j in range(i + 1, len(eyes)):
                e, f = eyes[i], eyes[j]
                dx, dy = abs(e['x'] - f['x']), abs(e['y'] - f['y'])
                if not (0.08 < dx < 0.38 and dy < 0.08): continue
                score = dy * 4 + abs(e['n'] - f['n']) / max(e['n'], f['n']) - (e['y'] + f['y']) * 0  # prefer level, same-size pair
                if best is None or score < best[0]: best = (score, [e, f])
        eyes = best[1] if best else eyes[:1]
    if n in CLOSED: eyes = []  # drawn with closed eyes already
    if n in EYE_FIX: eyes = [dict(zip(['x', 'y', 'rx', 'ry', 'skin'], e)) for e in EYE_FIX[n]]
    for e in eyes: e.pop('n', None)
    result.append({'w': w, 'h': h, 'eyes': eyes})

rows = []
assert len(NAMES) >= len(result), f'faltan nombres: hay {len(result)} patos y {len(NAMES)} nombres'
for name, d in zip(NAMES, result):
    eyes = ', '.join(f"[{e['x']}, {e['y']}, {e['rx']}, {e['ry']}, '{e['skin']}']" for e in d['eyes'])
    rows.append(f"  ['{name}', {d['w']}, {d['h']}, [{eyes}]],")
js = open(f'{ROOT}/public/ducks.js').read()
js = re.sub(r"const DUCKS = \[\n.*?\n\];", "const DUCKS = [\n" + "\n".join(rows) + "\n];", js, count=1, flags=re.S)
import time
js = re.sub(r"const ART_V = '[^']*';", f"const ART_V = '{time.strftime('%Y%m%d%H%M%S')}';", js)  # que nadie vea patos viejos
open(f'{ROOT}/public/ducks.js', 'w').write(js)
print('ojos por pato:', [len(r['eyes']) for r in result])
