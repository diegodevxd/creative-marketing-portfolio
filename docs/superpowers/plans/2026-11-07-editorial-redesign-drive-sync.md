# Plan: rediseño editorial + sincronización automática con Drive

Rol: **Claude = arquitecto y auditor. opencode (DeepSeek v4.1 Flash) = implementador.**
Implementa TODO lo que sigue. No improvises producto ni diseño: si algo no está aquí, elige lo más simple. Ante un bloqueo real, documéntalo en `docs/superpowers/plans/2026-11-07-IMPLEMENTATION-NOTES.md` y sigue con lo demás.

## 0. Reglas no negociables

- NO hagas `git commit`, `git push`, `git reset`, `git clean`, ni abras PRs. Deja todo sin commitear; se audita con `git diff`.
- Los únicos datos reales son los de este plan y del repo. **Prohibido inventar** métricas, resultados, clientes, testimonios, años, premios o descripciones. Un dato ausente se omite del HTML: ningún placeholder, "próximamente" ni número de relleno.
- Prohibido copiar texto, imágenes, marcas o resultados de los sitios de referencia. Se reutilizan patrones de layout.
- Sitio estático puro: sin framework, sin bundler, sin `package.json`. HTML + CSS + JS vanilla. Rutas siempre relativas (GitHub Pages sirve bajo `/creative-marketing-portfolio/`).
- No toques `.agents/`, `.claude/`, `skills-lock.json` ni los planes antiguos de `docs/`.
- Datos procedentes de Drive (títulos, etc.) se insertan con `textContent`/`setAttribute`, nunca con `innerHTML`.

## 1. Diagnóstico verificado (2026-11-07)

Carpeta origen: `1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG`. Contiene exactamente 6 videos:

| ID | Archivo | Formato |
|---|---|---|
| `1TiukRRjshOUKm6eudSooK5nkk32hQn6Q` | MEY DEY Gordito Campechanas.mp4 | 9:16 |
| `10T6uw4YNruo9vgQisBvHc9AOSXgx8fRZ` | MEYDEY Con Gorditos - Tomahawk subt2.mp4 | 9:16 |
| `18fPjwqUXsceqKgzxA75A8qOpM8duVGrQ` | Tacos de chicharrón de Ribeye.mp4 | 9:16 |
| `1wryZGsrixY3MkVI7Q6aYxMjMfQjelf3-` | MEYDEY_reel 1_ semana 1.mp4 | 9:16 |
| `1YPM_cn_Jn0yUEHYDiuWQY7r2nREqRHLC` | Anuncio Publicitario Carlotas.MP4 | 9:16 |
| `1CE0A-vtdnEWtZ6tSFYn4cLvGSkpcLVqv` | Expo GamexZonee.mp4 | 16:9 |

Problemas del sitio actual:
- `portfolioVideos` está fijo en `main.js` con 11 videos: solo 2 siguen en la carpeta, 4 dan 404 y los demás ya no están en ella (los consultados están en la papelera). Faltan los 4 nuevos.
- `main.js:513` usa `CF_CONFIG`, que no existe: lanza `ReferenceError`.
- El modal afirma "16:9 4K Widescreen" para todo video horizontal (dato falso).
- Hay dos `index.html` que solo difieren en rutas.
- El miniaturizado de Drive puede salir negro (`1wry...`): no depender de él.

## 2. Arquitectura

```
Drive (carpeta pública)
   │  GitHub Action cada 6 h / manual
   ▼
scripts/sync-drive.mjs ──► data/videos.json + assets/loops/<id>.mp4 + assets/posters/<id>.jpg
   ▲                              │
data/video-overrides.json         ▼
(textos curados a mano)     index.html (fetch de data/videos.json)
                                  │ clic
                                  ▼
                        iframe drive.google.com/file/d/<id>/preview
```

El navegador nunca consulta la carpeta de Drive: solo lee `data/videos.json`. Si la sincronización falla, sigue publicado el último manifiesto válido.

### Estructura final

```
index.html
README.md                     (movido a la raíz y reescrito)
assets/css/styles.css
assets/js/main.js
assets/loops/  assets/posters/
data/videos.json  data/video-overrides.json
scripts/sync-drive.mjs  scripts/sync-drive.test.mjs  scripts/fixtures/folder.html
.github/workflows/sync-drive.yml
```

Elimina la carpeta anidada `creative-marketing-portfolio-main/` tras mover lo necesario. El CSS y el JS antiguos se reescriben.

## 3. Sincronización: `scripts/sync-drive.mjs`

Node ≥ 20, sin dependencias, ESM. Exporta funciones puras para test y ejecuta `main()` solo si es el entrypoint.

**Listado.** `GET https://drive.google.com/embeddedfolderview?id=<FOLDER_ID>`. Parsea cada `div.flip-entry`: id (`id="entry-…"`), título (`flip-entry-title`), fecha (`flip-entry-last-modified`), y conserva solo entradas cuyo icono contenga `type/video`. Si la respuesta no es 200 o hay 0 entradas válidas: `process.exit(1)` **sin modificar ningún archivo**. Valida cada id con `^[A-Za-z0-9_-]+$`; descarta los que no cumplan.

**Título por defecto.** Quita extensión (sin distinguir mayúsculas), cambia `_` por espacio y colapsa espacios. Los overrides lo reemplazan.

**Loop y poster** (solo si faltan o si cambió la fecha `driveModified` respecto al manifiesto previo). Usa `execFile` (nunca shell) con el binario de `process.env.FFMPEG || 'ffmpeg'`. Enfoque ya probado (6–9 s por video, sin descargar el archivo entero):

```
ffmpeg -hide_banner -loglevel error -y -ss <loopStart> -t 5 \
  -i "https://drive.usercontent.google.com/download?id=<id>&export=download&confirm=t" \
  -an -vf "scale='if(gt(iw,ih),960,-2)':'if(gt(iw,ih),-2,960)',fps=24" \
  -c:v libx264 -crf 28 -preset veryfast -pix_fmt yuv420p -movflags +faststart assets/loops/<id>.mp4
```

- `loopStart`: override o `2` por defecto.
- Poster: fotograma en el segundo 2 del loop → `assets/posters/<id>.jpg`, calidad `-q:v 4`.
- Dimensiones: parsea `\d{3,4}x\d{3,4}` del stderr de `ffmpeg -i <loop>`. `orientation = width >= height ? 'horizontal' : 'vertical'`.
- Escribe primero a un archivo temporal y renombra al terminar.
- Si un loop supera 4 MB, repite una vez con `-crf 33`.
- Si falla un video: registra el error, conserva su loop/poster previo si existe; si no existe, `loop: null, poster: null`, y termina con `process.exitCode = 1` tras escribir el resto. Nunca aborta toda la corrida por un solo video.

**Limpieza.** Borra de `assets/loops` y `assets/posters` los archivos cuyo id ya no esté en la carpeta. Las entradas de overrides huérfanas se ignoran sin borrarlas.

**Orden del manifiesto.** Primero los ids con `order` en overrides (ascendente); después los demás con `firstSeen` descendente y título como desempate. `firstSeen` se conserva del manifiesto previo; para ids nuevos es la fecha de hoy `YYYY-MM-DD`.

**Determinismo.** Dos corridas sin cambios en Drive deben producir bytes idénticos en `data/videos.json` (sin `syncedAt`, JSON con 2 espacios y `\n` final) para no generar commits vacíos.

### Esquema de `data/videos.json`

```json
{
  "folderId": "1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG",
  "videos": [{
    "id": "…", "title": "…", "client": null,
    "orientation": "vertical", "width": 540, "height": 960,
    "loop": "assets/loops/<id>.mp4", "poster": "assets/posters/<id>.jpg",
    "driveModified": "Nov 5", "firstSeen": "2026-11-07",
    "tag_es": null, "tag_en": null, "desc_es": null, "desc_en": null,
    "metrics": []
  }]
}
```

`metrics` solo admite `{ "label_es", "label_en", "value" }` y viene exclusivamente de overrides.

### `data/video-overrides.json` inicial (úsalo tal cual)

```json
{
  "1TiukRRjshOUKm6eudSooK5nkk32hQn6Q": { "order": 1, "title": "Gordito Campechanas", "client": "MEY DEY", "tag_es": "Reel", "tag_en": "Reel", "metrics": [] },
  "18fPjwqUXsceqKgzxA75A8qOpM8duVGrQ": { "order": 2, "title": "Tacos de chicharrón de Ribeye", "client": "MEY DEY", "tag_es": "Reel", "tag_en": "Reel", "metrics": [] },
  "10T6uw4YNruo9vgQisBvHc9AOSXgx8fRZ": { "order": 3, "title": "Con Gorditos: Tomahawk", "client": "MEY DEY", "tag_es": "Reel", "tag_en": "Reel", "metrics": [] },
  "1wryZGsrixY3MkVI7Q6aYxMjMfQjelf3-": { "order": 4, "title": "Reel 1, Semana 1", "client": "MEY DEY", "tag_es": "Reel", "tag_en": "Reel", "loopStart": 4, "metrics": [] },
  "1CE0A-vtdnEWtZ6tSFYn4cLvGSkpcLVqv": { "order": 5, "title": "Expo GamexZonee", "client": "GamexZonee", "tag_es": "Spot promocional", "tag_en": "Promo spot", "desc_es": "Video promocional para evento gamer con montaje cinematográfico y color grading.", "desc_en": "Promotional spot for a gaming expo with cinematic editing and color grading.", "metrics": [] },
  "1YPM_cn_Jn0yUEHYDiuWQY7r2nREqRHLC": { "order": 6, "title": "Anuncio Publicitario Carlotas", "client": null, "tag_es": "Spot institucional", "tag_en": "Institutional spot", "desc_es": "Video institucional grabado en aula con enfoque informativo y publicitario.", "desc_en": "Institutional video filmed in a classroom with an informative and advertising focus.", "metrics": [] }
}
```

### Tests: `scripts/sync-drive.test.mjs` (`node --test scripts/`)

Sin red ni ffmpeg. Fixture: `scripts/fixtures/folder.html` (copia de `C:/Users/pibed/AppData/Local/Temp/claude/562d210797016f1a/34bfea05-9c6f-487f-8e7c-4938f5249f60/scratchpad/net/folder.html`). Casos mínimos: parsea 6 ids exactos; HTML sin entradas → error; entrada no-video se descarta; id inválido se descarta; limpieza de títulos (`.MP4`, `_`); merge de overrides; orden; `firstSeen` se conserva.

### `.github/workflows/sync-drive.yml`

- Triggers: `schedule: '17 */6 * * *'`, `workflow_dispatch`.
- `permissions: { contents: write, pages: write, actions: write }`, `concurrency` de grupo único.
- Pasos: checkout → setup-node 20 → `sudo apt-get install -y ffmpeg` → `node --test scripts/` → `node scripts/sync-drive.mjs` → si `git status --porcelain data assets` no está vacío: commit como `github-actions[bot]` con `chore: sync videos from Drive` y push → si hubo commit: `gh api -X POST repos/${{ github.repository }}/pages/builds` → siempre: `gh api -X PUT repos/${{ github.repository }}/actions/workflows/sync-drive.yml/enable` (GitHub desactiva los cron tras 60 días sin actividad).
- `GH_TOKEN: ${{ github.token }}`. Publica lo que sí se sincronizó aunque un video falle; el job termina en rojo para avisar.

## 4. Dirección de diseño

Concepto: **revista impresa de un montajista**. Base blanco y negro, un solo acento, tipografía gigante y video real en movimiento. Nada de tarjetas de vidrio, glows, gradientes, bento, emojis, ni hero centrado.

- Tokens en `:root`: `--ink #0B0B0B`, `--paper #F2EFE8`, `--ember #E8481C`, `--grey #8A8780`.
- Texto sobre ember: siempre `--ink` (blanco no alcanza contraste AA).
- Fuentes Google: **Anton** (titulares), **Newsreader** (lectura, itálicas), **IBM Plex Mono** (etiquetas). Elimina Gochi Hand y Plus Jakarta Sans.
- Escala: titulares `clamp(4.5rem, 19vw, 20rem)`, line-height ≈ 0.86, en mayúsculas. Sin overflow horizontal a 320 px.
- Cambio de paleta por sección (Nick Velten): cada `section[data-palette]` activa con IntersectionObserver `document.body.dataset.palette`, con transición de `background-color`/`color` de 400 ms.
- Nav: barra fija de texto plano con `mix-blend-mode: difference`: `FERMnke` a la izquierda; anclas y `ES/EN` a la derecha. En móvil, solo logo, `ES/EN` y un botón "Menú" que abre overlay a pantalla completa.

### Secciones, en este orden

**1. `#inicio` (ink): dividido en dos (Volta) + carrusel de fondo (mherreravsquez).**
Dos mitades a `100svh`. Izquierda: `FERM/NKE` gigante en dos líneas; debajo, en Newsreader itálica, "Edición de video y marketing digital"; en mono, los enlaces `Ver trabajo ↓` y `Contacto ↗`. Derecha: fundido entre los loops verticales del manifiesto, cada 5 s, con la etiqueta en mono de cliente y título del video visible. Móvil: el video ocupa arriba 55svh y el nombre abajo.

**2. `#reel` (paper): carrusel principal de loops sin grid (Epik + Astro Rocket).**
Título gigante `EL REEL`. Fila horizontal con `scroll-snap-type: x mandatory`, todos los videos a la misma altura (`min(70vh, 720px)`), conservando cada proporción. Debajo o sobre cada video, el nombre del cliente muy grande (título si `client` es null). Controles anterior/siguiente en texto, flechas de teclado cuando el carrusel tiene foco, y arrastre con mouse. Clic sin arrastre (umbral 6 px) abre el modal. No uses `setPointerCapture` en el contenedor si impide el clic en la tarjeta. Sin dots y sin filtros: son 6 videos.

**3. `#casos` (se alternan ink y paper): pliegos de revista (Beans + Viral/Videoship/SocialLift).**
Un `<article id="caso-<id>">` por video. Asimétrico, alternando el lado de cada caso: numeración `01` en Anton enorme, título grande, video en loop en una columna y texto en la otra (dos columnas de lectura solo a ≥1024 px). Ficha en mono solo con lo existente: cliente, tipo (`tag`), formato (derivado de width/height, p. ej. `9:16`). `desc` y **bloque de métricas se renderizan solo si existen**; hoy `metrics` está vacío y el bloque no debe aparecer. Debe verse completo y deliberado cuando solo hay título y ficha. Botón `Ver completo` abre el modal.

**4. `#indice` (paper): proyectos en círculos en blanco y negro (Major Tom).**
Cada proyecto es un círculo con su poster en `grayscale(1)` que pasa a color en hover/focus, con su nombre al lado, enlazando a `#caso-<id>`. Tamaños y desplazamientos variados con `nth-child`, sin retícula regular. Móvil versión simplificada: lista vertical con círculos pequeños.

**5. `#perfil` (ember): dividido en dos.**
Izquierda: `SOBRE MÍ` gigante. Derecha: los párrafos reales existentes `about_p1`, `about_p2` y `about_p3` (ES/EN), más una lista tipográfica sin iconos de herramientas ya presentes en el sitio: Adobe Premiere Pro, CapCut Pro, After Effects. Elimina: bento, "100% Dedicación", "Respondo en menos de 24 horas", "Hooks de Alta Retención" y demás promesas no comprobables.

**6. `#contacto` (ink).**
`HABLEMOS` gigante y tres enlaces tipográficos enormes con estos destinos exactos: `https://www.tiktok.com/@unsillon8`, `https://wa.me/5214775747592`, `https://www.instagram.com/lui._zc`. Pie: `© 2026 FERMnke · UEPCA`. Sin formulario.

### Modal (patrón EditKaro)

`<dialog>` nativo. Muestra título y un `<iframe src="https://drive.google.com/file/d/<id>/preview" allow="autoplay; fullscreen">` que se crea **solo al abrir** y se destruye al cerrar. Proporción según `orientation`, sin rebasar `100dvh`. Enlace `Ver en Drive ↗` (`/view`), anterior/siguiente, cierre con Esc, clic en backdrop y botón; devuelve el foco al elemento que lo abrió. Sin badge de resolución.

### Comportamiento de video (`assets/js/main.js`)

- Cada loop: `muted loop playsinline preload="none" poster=…`, sin audio. Sin `autoplay` en el HTML: un IntersectionObserver hace `play()` al entrar y `pause()` al salir; ignora el rechazo de la promesa.
- `prefers-reduced-motion: reduce` o `navigator.connection?.saveData`: no reproducir, solo posters; sin fundido en el hero.
- `loop: null` → usa `https://drive.google.com/thumbnail?id=<id>&sz=w800` como imagen; el video sigue abriendo en el modal.
- Si `fetch('data/videos.json')` falla: mensaje breve y enlace a `https://drive.google.com/drive/folders/1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG`.
- i18n ES/EN: conserva el mecanismo `data-i18n`, reduce el diccionario al texto que quede, traduce también tags, descripciones y métricas, y guarda el idioma en `localStorage` dentro de `try/catch`. El cambio de idioma no recarga videos.
- `alt` y `aria-label` en todo lo interactivo, foco visible, jerarquía `h1 > h2 > h3`.
- Meta `title`/`description` actualizados, sin afirmaciones nuevas.

### Referencias de código (solo para leer el patrón)

Lee con `gh api repos/<repo>/contents/<ruta> --jq .content | base64 -d`:
- `JeanpaulPerez-blip/JeanpaulPerez-blip.github.io` → `src/components/projects/ProjectCarousel.astro`
- `mherreravsquez/mherreravsquez.github.io` → `js/main.js` (`hero-bg-carousel`). **Sin licencia: no copies código.**
- `aryansengar007/EditKaro.in-v1` → `src/components/sections/Portfolio.jsx`

Reimplementa en vanilla. No añadas sus dependencias.

## 5. Orden de ejecución

1. Reestructura carpetas y crea `scripts/`, fixture y tests; `node --test scripts/` en verde.
2. Ejecuta el sync real: `FFMPEG="C:/Users/pibed/AppData/Local/Temp/claude/562d210797016f1a/34bfea05-9c6f-487f-8e7c-4938f5249f60/scratchpad/ff/node_modules/ffmpeg-static/ffmpeg.exe" node scripts/sync-drive.mjs`. No instales nada de forma global.
3. Vuelve a ejecutarlo y confirma con `git hash-object data/videos.json` que no cambia.
4. Escribe `index.html`, CSS y JS según la sección 4.
5. Escribe el workflow y el README (uso: añadir un video = subirlo a la carpeta; texto y métricas = editar overrides; sync manual desde Actions; correr en local con `python -m http.server`).
6. Sirve con `python -m http.server 8123`, comprueba que `data/videos.json` y los assets respondan 200, y detén el servidor.

## 6. Criterios de aceptación (los verificará el auditor)

- [ ] `node --test scripts/` en verde; dos syncs seguidos no alteran `data/videos.json`.
- [ ] El manifiesto contiene exactamente los 6 ids de la sección 1, con orientación correcta (5 verticales, 1 horizontal).
- [ ] Sin referencias en el sitio a los 9 ids antiguos, `CF_CONFIG`, `4K`, Gochi Hand ni la carpeta anidada.
- [ ] Todos los loops ≤ 4 MB; `preload="none"`; el iframe no existe hasta abrir el modal.
- [ ] Sin overflow horizontal a 320, 390, 768, 1280 y 1920 px; sin errores de consola.
- [ ] Clic, arrastre, teclado y modal funcionan; el modal apaga el video al cerrar.
- [ ] ES/EN cambia todo el texto visible.
- [ ] Ningún bloque de métricas vacío; ningún dato inventado.
- [ ] Rutas relativas: funciona bajo un subdirectorio.
- [ ] Nada commiteado ni subido.

Al terminar, responde con: archivos creados y eliminados, salida de los tests, tamaño de cada loop y cualquier desviación del plan.
