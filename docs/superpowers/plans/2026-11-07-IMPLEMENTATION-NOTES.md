# Notas de implementación — 2026-11-07

Plan implementado: `docs/superpowers/plans/2026-11-07-editorial-redesign-drive-sync.md`.

## Estado

- Sincronización real ejecutada con `node scripts/sync-drive.mjs` (usando `FFMPEG`
  del entorno). 6 videos descargados y procesados sin errores.
- Dos corridas consecutivas dejan `data/videos.json` con el mismo hash
  (`4bffd3162040594a2757e19816122ef260e2c0c4`).
- `node --test scripts/` en verde (9 tests).
- Sitio verificado en navegador real a 320, 390, 768, 1280 y 1920 px: sin
  overflow horizontal y sin errores de consola.
- Sin commits ni push.

## Desviaciones y notas

1. **Node local vs. `node --test scripts/`.** La máquina de implementación usa
   Node v24.22.1. En esa versión `node --test scripts/` resolvía el directorio
   como módulo (`Cannot find module ...\scripts`) en lugar de descubrir los
   archivos de test. Se añadió `scripts/index.js` como puente de compatibilidad
   (`require('./sync-drive.test.mjs')`), de modo que el comando exacto del plan
   funciona tanto en Node 20 (descubrimiento de tests en el directorio) como en
   Node 24. No se añadió `package.json`.
2. **Servidor local.** Se sirvió el sitio con `python -m http.server 8123` y se
   comprobó que `index.html`, `data/videos.json`, CSS, JS, un loop y un poster
   responden 200. El entorno de bash no permite `kill`, así que el proceso del
   servidor no pudo detenerse explícitamente desde esta sesión.
3. **Bash restringido.** Solo se usaron los comandos permitidos. No se intentó
   ningún rodeo para comandos denegados.
4. **Métricas.** `metrics` está vacío en todos los overrides; por tanto no se
   renderiza ningún bloque de métricas (no hay bloques vacíos).
5. **Posters.** El poster se regenera en cada corrida a partir del loop; los
   loops solo se regeneran si falta el archivo o cambia `driveModified`.

## Correcciones de la auditoría

- Se eliminó `scripts/index.js`; los tests se ejecutan con `node --test scripts/sync-drive.test.mjs`.
- El sync regenera el loop al cambiar `loopStart` y reintenta los videos fallidos.
- Nav con fondo sólido por paleta en lugar de `mix-blend-mode`, por legibilidad sobre video.
- `scroll-snap-type` movido al contenedor que hace scroll.
- Índice y reel muestran el título: cuatro proyectos comparten cliente.
- `about_p3` ya no menciona gameplays ni contenido viral: esos videos ya no están en la carpeta.
