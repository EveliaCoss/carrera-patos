# Carrera de Patos

Carrera de obstáculos en vivo para la clase. Los alumnos entran desde su celular o laptop con el código de
la sala (o escaneando el QR), eligen uno de 95 patitos de hule disfrazados (clásicos, Halloween y Día de Muertos), un ícono y su nombre, y nadan
por el lago esquivando obstáculos. Gana quien llega primero a la meta.

- **Alumnos:** `https://eveliacoss.github.io/carrera-patos/`
- **Maestra:** `https://eveliacoss.github.io/carrera-patos/host.html` (pide correo y contraseña)

## Cómo usarla

1. Abre la página de la maestra en el proyector e inicia sesión. Aparece la sala con su **código** y su **QR**.
2. Los alumnos escanean el QR, o entran a la página de alumnos y escriben el código. Eligen pato, ícono y nombre.
3. Pulsa **¡Arrancar carrera!**. Al terminar puedes lanzar **Correr otra vez**, que genera una pista nueva con los mismos patos.

Con **Gestionar participantes** puedes sacar a un pato (por ejemplo, si alguien entra con un nombre
inapropiado); queda bloqueado en esa sala.

## Cómo funciona

- La página se publica en **GitHub Pages** (carpeta `public/`) y se conecta a **Firebase**: Realtime Database
  para la carrera en vivo y Authentication para las cuentas.
- La **pantalla de la maestra** es la que corre la carrera: crea la sala, mueve a los patos y manda el estado
  a todos. Déjala abierta y visible en el proyector mientras juegan (si cambias de pestaña, el navegador la frena).
- Los **alumnos** no necesitan cuenta: Firebase les da un acceso anónimo. Con él solo pueden escribir su
  propio patito y sus propios controles.

### Seguridad (`database.rules.json`)

| Quién | Qué puede hacer |
|---|---|
| Tu cuenta (registrada en `/admins`) | Crear salas, arrancar y terminar carreras, sacar patos. Solo en salas que creó ella. |
| Alumno (acceso anónimo) | Leer la sala, crear o cambiar **su** patito (nombre de 1–16 letras, pato 0–94, ícono 0–35) y mandar **sus** controles. |
| Alumno que sacaste | Nada en esa sala: queda bloqueado. |
| Cualquier otra persona | Nada sin iniciar sesión. Nadie puede tocar el patito de otro ni una sala ajena. |

Además, **App Check** (con reCAPTCHA v3, invisible para los alumnos) hace que Firebase solo atienda a esta página
abierta en un navegador real: un bot que use los datos de `firebase-config.js` desde un script queda fuera.

## Configuración (una sola vez)

### 1. Firebase

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto (por ejemplo
   `carrera-patos`). Google Analytics no hace falta.
2. **Authentication → Comenzar → Método de acceso:** activa **Correo electrónico/contraseña** y **Anónimo**.
3. **Authentication → Usuarios → Agregar usuario:** crea tu cuenta de maestra (tu correo y una contraseña).
   Copia el **UID** que aparece en la lista.
4. **Authentication → Configuración → Dominios autorizados:** agrega `eveliacoss.github.io`.
5. **Realtime Database → Crear base de datos** (en modo bloqueado). En la pestaña **Reglas** pega el contenido
   de `database.rules.json` y publica.
6. En **Realtime Database → Datos**, agrega con el botón **+** en la raíz: clave `admins`, y dentro de ella
   clave = tu **UID**, valor = `true`. Así quedas como la única maestra.
7. **⚙️ Configuración del proyecto → Tus apps → Web (`</>`):** registra una app y copia los datos de
   `firebaseConfig` en `public/firebase-config.js`.

### 2. GitHub Pages

1. El repo tiene que ser **público** (GitHub Pages gratis solo publica repos públicos). Ojo: así también quedan
   públicas las imágenes de los patos y del lago.
2. **Settings → Pages → Source:** elige **GitHub Actions**.
3. Sube los cambios a `main`. El flujo `.github/workflows/pages.yml` publica `public/` en un par de minutos.

### 3. App Check (contra bots)

1. En [google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create) crea una clave
   **reCAPTCHA v3** con los dominios `eveliacoss.github.io` y `localhost`. Copia la **clave de sitio** y la
   **clave secreta**.
2. En Firebase, **App Check → Apps:** elige la app web, proveedor **reCAPTCHA**, pega la **clave secreta** y guarda.
3. Pega la **clave de sitio** en `recaptchaSiteKey` de `public/firebase-config.js` y sube el cambio a `main`.
4. Juega una carrera y revisa en **App Check → APIs** que las solicitudes salgan como *verificadas*. Solo entonces
   pulsa **Aplicar** (Enforce) en **Realtime Database** y en **Authentication**. Si lo aplicas antes de publicar la
   clave, nadie podrá entrar al juego.

## Controles del alumno

| Acción | Teclado | Celular |
|---|---|---|
| Nadar adelante / atrás | ▶ / ◀ (o D / A) | botones ▶ / ◀ |
| Subir / bajar en el lago | ▲ / ▼ (o W / S) | botones ▲ / ▼ |
| Nitro (2.5 s, se recarga en 8 s) | doble ▶ rápido, cuando la barra está verde | doble toque en ▶ |

Todos salen formados en la línea de salida. En el lago hay **rocas** y **troncos** (si chocas te quedas
aturdido medio segundo y pierdes el nitro) y **remolinos** (te frenan a menos de la mitad). Si un pato se
atora 4 segundos en el mismo punto, se reacomoda 2 m adelante.

## Ajustes y herramientas

- Velocidades, largo de la pista (500 m), nitro y aturdimiento: el objeto `T` en `public/game.js`.
- Probar en tu computadora: `cd public && python3 -m http.server 8000` y abre `http://localhost:8000/host.html`.
- Prueba de la física: `node test.js`.
- Patitos: las hojas originales están en `herramientas/hojas/`. Para agregar más, pon la hoja nueva ahí, agrega sus
  nombres al final de `NAMES` en `herramientas/recortar_patos.py` y corre:
  `uv run --no-project --with pillow --with numpy python herramientas/recortar_patos.py herramientas/hojas/1-clasicos.png:7x5 herramientas/hojas/2-halloween.png:6x5 herramientas/hojas/3-dia-de-muertos.png:6x5 <nueva.png>:<columnas>x<filas>`.
  Recorta cada pato, encuentra sus ojos para el parpadeo y actualiza `public/ducks.js`. Si cambia el total, sube
  el límite de `duck` en `database.rules.json` y vuelve a pegar las reglas en Firebase.
- Cambiar el fondo del lago de la sala:
  `uv run --no-project --with pillow --with numpy python herramientas/fondo_lago.py imagen.png`.
  El lago de la carrera es `public/lago/carrera.jpg`.

## Límites del plan gratis de Firebase

Hasta 100 conexiones a la vez (alcanza para un grupo de 60) y 10 GB de descarga al mes, que da para unas
100 carreras de 3 minutos con 40 alumnos.
