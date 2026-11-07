# FERMnke — portafolio editorial de edición de video

Sitio estático (HTML + CSS + JavaScript vanilla, sin framework ni bundler) que se
sincroniza automáticamente con una carpeta pública de Google Drive.

## Cómo funciona

```
Drive (carpeta pública)
   │  GitHub Action cada 6 h / manual
   ▼
scripts/sync-drive.mjs ──► data/videos.json
   │                       assets/loops/<id>.mp4
   │                       assets/posters/<id>.jpg
   ▼
index.html  ◄── fetch('data/videos.json')
```

El navegador nunca consulta Drive para listar la carpeta: solo lee
`data/videos.json`. Si la sincronización falla, sigue publicado el último
manifiesto válido.

## Añadir un video

1. Súbelo a la carpeta de Drive
   [`1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG`](https://drive.google.com/drive/folders/1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG).
2. Ejecuta el workflow **Sync Drive videos** desde la pestaña *Actions* (o espera
   al cron de cada 6 horas).
3. El script descarga un loop de 5 s y un poster, actualiza el manifiesto y
   publica los cambios.

## Cambiar textos o métricas

Edita `data/video-overrides.json`. Las claves son el ID de Drive del video. Cada
entrada admite `order`, `title`, `client`, `tag_es`, `tag_en`, `desc_es`,
`desc_en`, `loopStart` y `metrics` (`{ label_es, label_en, value }`).

Los overrides mandan sobre los títulos derivados del nombre del archivo. Las
entradas huérfanas se ignoran sin borrarse.

## Sincronización manual en local

Requisitos: Node ≥ 20 y `ffmpeg` en el `PATH` (o `FFMPEG` apuntando al binario).

```bash
node --test scripts/sync-drive.test.mjs
node scripts/sync-drive.mjs
```

`data/videos.json` es determinista: dos ejecuciones sin cambios en Drive generan
los mismos bytes.

## Ver el sitio en local

```bash
python -m http.server 8123
```

Abre `http://localhost:8123/`. Las rutas son relativas, así que el sitio funciona
igual bajo un subdirectorio (por ejemplo `/creative-marketing-portfolio/`).

## Estructura

```
index.html
assets/css/styles.css
assets/js/main.js
assets/loops/            loops de 5 s (≤ 4 MB)
assets/posters/          posters generados
data/videos.json         manifiesto generado
data/video-overrides.json
scripts/sync-drive.mjs
scripts/sync-drive.test.mjs
scripts/fixtures/folder.html
.github/workflows/sync-drive.yml
```
