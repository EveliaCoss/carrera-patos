# Pone una imagen nueva como fondo del lago (pantalla de la maestra).
#
#   uv run --no-project --with pillow --with numpy python herramientas/fondo_lago.py <imagen.png>
#
# Si la imagen trae pintada la línea de salida a cuadros rojos, la borra (la del juego se mueve con la carrera).
# La imagen debe tener el mismo acomodo que la original: ~1800 x 874, agua entre y=258 y y=742.
import re, sys, time
import numpy as np
from PIL import Image

src = sys.argv[1]
ROOT = __file__.rsplit('/herramientas/', 1)[0]
a = np.asarray(Image.open(src).convert('RGB')).astype(float)
H, W = a.shape[:2]

# Línea de salida: columnas con muchos cuadros rojos dentro del agua.
water = a[300:700]
red = (water[..., 0] > 200) & (water[..., 1] < 120) & (water[..., 2] < 160)
cols = np.nonzero(red.sum(0) > 40)[0]
if len(cols):
    x0, x1 = cols.min() - 45, cols.max() + 47         # incluye el borde, los postes y margen para difuminar
    w = x1 - x0
    sx = -(w + 40) if x0 - (w + 40) > 0 else w + 40     # copia el lago de al lado
    y0, y1 = 165, min(H, 805)                          # los postes van de ~205 a ~768
    src_patch = a[y0:y1, x0 + sx:x1 + sx].copy()
    fy = np.minimum(np.arange(y1 - y0), np.arange(y1 - y0)[::-1]); fx = np.minimum(np.arange(w), np.arange(w)[::-1])
    wgt = np.clip(np.minimum.outer(fy, fx) / 30, 0, 1)[..., None]  # bordes difuminados: sin costuras
    a[y0:y1, x0:x1] = a[y0:y1, x0:x1] * (1 - wgt) + src_patch * wgt
    print(f'línea de salida borrada en x={x0}..{x1}')
else:
    print('no encontré línea de salida pintada; la imagen se usa tal cual')

Image.fromarray(a.astype(np.uint8)).save(f'{ROOT}/public/lago/fondo.jpg', quality=86, optimize=True)
js = open(f'{ROOT}/public/ducks.js').read()
js = re.sub(r"const ART_V = '[^']*';", f"const ART_V = '{time.strftime('%Y%m%d%H%M%S')}';", js)  # que nadie vea el fondo viejo
open(f'{ROOT}/public/ducks.js', 'w').write(js)
print(f'listo: public/lago/fondo.jpg ({W} x {H})')
