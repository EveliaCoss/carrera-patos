# Carrera de Patos

Carrera de obstáculos en vivo para la clase. Los alumnos entran desde su celular o laptop
escaneando un QR, eligen uno de 35 patitos de hule disfrazados, un ícono y su nombre, y nadan por el estanque esquivando obstáculos. Gana quien llega primero a la meta.

## Cómo usarla

1. En tu laptop (Node 18 o más nuevo, sin instalar nada más): `node server.js`
2. Abre en el proyector el enlace **Pantalla de la maestra** que aparece en la terminal.
3. Los alumnos escanean el QR. Tienen que estar en **la misma Wi‑Fi** que tu laptop.
4. Pulsa **¡Arrancar carrera!**. Al terminar puedes lanzar **Correr otra vez**, que genera una pista nueva con los mismos patos.

Con **Gestionar participantes** puedes sacar a un pato (por ejemplo, si alguien entra con un nombre inapropiado).

## Controles del alumno

| Acción | Teclado | Celular |
|---|---|---|
| Nadar adelante / atrás | ▶ / ◀ (o D / A) | botones ▶ / ◀ |
| Subir / bajar en el estanque | ▲ / ▼ (o W / S) | botones ▲ / ▼ |
| Nitro (2.5 s, se recarga en 8 s) | doble ▶ rápido, cuando la barra está verde | doble toque en ▶ |

Todos salen formados en la línea de salida. Dentro del estanque hay **rocas** y **troncos** (si chocas te
quedas aturdido medio segundo y pierdes el nitro) y **remolinos** (te frenan a menos de la mitad). Hay que esquivarlos.

## Ajustes

- Velocidades, largo de la pista (500 m), tiempos del nitro y del aturdimiento: el objeto `T` al inicio de `server.js`.
- Carrera más corta o más larga (en metros): `TRACK_M=250 node server.js`. Otro puerto: `PORT=8080 node server.js`. Clave fija de maestra: `HOST_KEY=miclave node server.js`.
- Prueba de la física: `node test.js`.
- Cambiar los patitos por otra hoja de 7 x 5 (fondo blanco): `uv run --no-project --with pillow --with numpy python herramientas/recortar_patos.py hoja.png`. Recorta cada pato, encuentra sus ojos para el parpadeo y actualiza `public/ducks.js`.
- El lago del proyector está en `public/lago/` (fondo, cocodrilo y letrero por separado para animarlos).

El QR y la tipografía se cargan de internet. Sin internet, la página muestra la dirección para escribirla a mano.
