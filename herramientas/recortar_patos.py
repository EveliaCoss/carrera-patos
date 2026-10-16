# Recorta la hoja de 35 patitos (7 x 5) en imágenes sin fondo, encuentra sus ojos para el parpadeo
# y actualiza la tabla DUCKS de public/ducks.js.
#
#   uv run --no-project --with pillow --with numpy python herramientas/recortar_patos.py <hoja.png> [ojos cerrados: 0,26]
#
# La hoja debe tener el mismo acomodo que la original: fondo blanco, 7 columnas y 5 filas.
import json, re, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

sheet = sys.argv[1]
CLOSED = {int(n) for n in sys.argv[2].split(',')} if len(sys.argv) > 2 and sys.argv[2] else set()
ROOT = __file__.rsplit('/herramientas/', 1)[0]
out_dir = f'{ROOT}/public/ducks'
TOL, PLATE_TOL = 3, 4
NAMES = ['Marinero', 'Astronauta', 'Vaquero', 'Detective', 'Chef', 'Doctor', 'Enfermera', 'Mago', 'Bruja', 'Artista',
         'Músico', 'Gamer', 'Graduado', 'Científico', 'Girasol', 'Hawaiano', 'Playa', 'Buzo', 'Explorador', 'Lluvia',
         'Invierno', 'Fresa', 'Rana', 'Panda', 'Gatito', 'Dino', 'Unicornio', 'Abeja', 'Cupcake', 'Dona', 'Elegante',
         'Princesa', 'Pirata', 'Samurái', 'Ángel']
# La rejilla se toma de la imagen: columnas/filas separadas por franjas de puro fondo.
def bands(profile, n):
    gaps = [i for i in range(1, len(profile)) if profile[i] != profile[i - 1]]
    pairs = list(zip(gaps[1::2], gaps[2::2]))  # (fin de un pato, inicio del siguiente)
    pairs = sorted(pairs, key=lambda p: p[1] - p[0], reverse=True)[:n - 1]
    return [0] + sorted((a + b) // 2 for a, b in pairs) + [len(profile)]

def is_bg(px):
    mn, mx = px.min(-1), px.max(-1)
    return (mn > 196) & (mx - mn < 20)  # fondo blanco + platito gris

im = np.asarray(Image.open(sheet).convert('RGB')).astype(int)
ink = im.min(-1) < 215
COLS, ROWS = bands(ink.any(0), 7), bands(ink.any(1), 5)
print('rejilla', COLS, ROWS)

sprites = []
for r in range(5):
    for ci in range(7):
        cell = im[ROWS[r]:ROWS[r + 1], COLS[ci]:COLS[ci + 1]]
        h, w, _ = cell.shape
        cand = is_bg(cell)
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
        n = r * 7 + ci
        rgba.save(f'{out_dir}/{n:02d}.png', optimize=True)
        sprites.append(rgba)


result = []
for n in range(35):
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
        if 15 <= len(pts) <= 300 and 0.75 <= bh / bw <= 2.3 and fill > 0.5 and 0.2 * h < ys.mean() < 0.68 * h and xs.mean() > 0.36 * w:
            # skin colour: median of opaque, bright pixels in a ring just outside the eye
            y1, y2, x1, x2 = max(0, ys.min() - 5), min(h, ys.max() + 6), max(0, xs.min() - 5), min(w, xs.max() + 6)
            ring = a[y1:y2, x1:x2].reshape(-1, 4)
            ring = ring[(ring[:, 3] > 200) & (ring[:, :3].min(-1) > 150)]
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
    for e in eyes: e.pop('n', None)
    result.append({'w': w, 'h': h, 'eyes': eyes})

rows = []
for name, d in zip(NAMES, result):
    eyes = ', '.join(f"[{e['x']}, {e['y']}, {e['rx']}, {e['ry']}, '{e['skin']}']" for e in d['eyes'])
    rows.append(f"  ['{name}', {d['w']}, {d['h']}, [{eyes}]],")
js = open(f'{ROOT}/public/ducks.js').read()
js = re.sub(r"const DUCKS = \[\n.*?\n\];", "const DUCKS = [\n" + "\n".join(rows) + "\n];", js, count=1, flags=re.S)
import time
js = re.sub(r"const ART_V = '[^']*';", f"const ART_V = '{time.strftime('%Y%m%d%H%M%S')}';", js)  # que nadie vea patos viejos
open(f'{ROOT}/public/ducks.js', 'w').write(js)
print('ojos por pato:', [len(r['eyes']) for r in result])
