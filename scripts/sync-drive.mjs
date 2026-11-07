#!/usr/bin/env node
/**
 * Sincroniza los videos de una carpeta pública de Drive con data/videos.json
 * y genera loops ligeros + posters con ffmpeg.
 *
 * Node >= 20, ESM, sin dependencias.
 */

import { readFile, writeFile, rename, readdir, mkdir, unlink } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const FOLDER_ID = '1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG';
export const FOLDER_URL = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`;
export const FOLDER_WEB_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
export const ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const MAX_LOOP_BYTES = 4 * 1024 * 1024;
const LOOP_SECONDS = 5;
const DEFAULT_LOOP_START = 2;
const VIDEO_FILTER =
  "scale='if(gt(iw,ih),960,-2)':'if(gt(iw,ih),-2,960)',fps=24";

/* ------------------------------------------------------------------ */
/* Utilidades puras                                                    */
/* ------------------------------------------------------------------ */

export function decodeEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
}

function stripTags(value) {
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanTitle(filename) {
  const withoutExtension = String(filename)
    .trim()
    .replace(/\.[A-Za-z0-9]{1,5}$/, '');
  return withoutExtension.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Parsea el HTML de embeddedfolderview.
 * Devuelve [{ id, title, driveModified }] solo con entradas de video válidas.
 * Lanza si no queda ninguna entrada válida.
 */
export function parseFolderHtml(html) {
  const source = String(html);
  const starts = [];
  const opener =
    /<div[^>]*\bclass="(?:[^"]*\s)?flip-entry(?:\s[^"]*)?"[^>]*>/gi;
  let match;
  while ((match = opener.exec(source)) !== null) {
    starts.push(match);
  }

  const entries = [];
  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i].index;
    const end = i + 1 < starts.length ? starts[i + 1].index : source.length;
    const block = source.slice(start, end);

    const idMatch = starts[i][0].match(/\bid="entry-([^"]+)"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    if (!ID_PATTERN.test(id)) continue;

    if (!/type\/video/.test(block)) continue;

    const titleMatch = block.match(
      /class="flip-entry-title"[^>]*>([\s\S]*?)<\/div>/i,
    );
    const dateMatch = block.match(
      /class="flip-entry-last-modified"[^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>/i,
    );

    entries.push({
      id,
      title: titleMatch ? stripTags(titleMatch[1]) : '',
      driveModified: dateMatch ? stripTags(dateMatch[1]) : '',
    });
  }

  if (entries.length === 0) {
    throw new Error('La carpeta no devolvió ninguna entrada de video válida.');
  }

  return entries;
}

export function sanitizeMetrics(metrics) {
  if (!Array.isArray(metrics)) return [];
  return metrics
    .filter(
      (metric) =>
        metric &&
        typeof metric === 'object' &&
        metric.value !== undefined &&
        metric.value !== null &&
        (metric.label_es || metric.label_en),
    )
    .map((metric) => ({
      label_es: metric.label_es ?? null,
      label_en: metric.label_en ?? null,
      value: metric.value,
    }));
}

function compareTitles(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * Fusiona entradas, overrides y manifiesto previo.
 *
 * media: { [id]: { width, height, orientation, loop, poster } }
 */
export function mergeVideos({
  entries,
  overrides = {},
  previousVideos = [],
  today,
  media = {},
}) {
  const previousById = new Map(previousVideos.map((video) => [video.id, video]));

  const videos = entries.map((entry) => {
    const override = overrides[entry.id] ?? {};
    const previous = previousById.get(entry.id) ?? {};
    const mediaForId = media[entry.id] ?? {};

    const width = Number.isFinite(mediaForId.width)
      ? mediaForId.width
      : Number.isFinite(previous.width)
        ? previous.width
        : null;
    const height = Number.isFinite(mediaForId.height)
      ? mediaForId.height
      : Number.isFinite(previous.height)
        ? previous.height
        : null;

    let orientation = mediaForId.orientation ?? previous.orientation ?? null;
    if (!orientation && width && height) {
      orientation = width >= height ? 'horizontal' : 'vertical';
    }

    return {
      id: entry.id,
      title:
        typeof override.title === 'string' && override.title.trim()
          ? override.title.trim()
          : cleanTitle(entry.title),
      client: override.client ?? null,
      orientation,
      width,
      height,
      loopStart: mediaForId.loopStart ?? previous.loopStart ?? null,
      loop: mediaForId.loop !== undefined ? mediaForId.loop : (previous.loop ?? null),
      poster:
        mediaForId.poster !== undefined
          ? mediaForId.poster
          : (previous.poster ?? null),
      // Un video que falló conserva la fecha previa para reintentarse en la siguiente corrida.
      driveModified:
        mediaForId.driveModified !== undefined
          ? mediaForId.driveModified
          : entry.driveModified || previous.driveModified || null,
      firstSeen: previous.firstSeen || today,
      tag_es: override.tag_es ?? null,
      tag_en: override.tag_en ?? null,
      desc_es: override.desc_es ?? null,
      desc_en: override.desc_en ?? null,
      metrics: sanitizeMetrics(override.metrics),
    };
  });

  const orderOf = (video) => {
    const value = overrides[video.id]?.order;
    return Number.isFinite(value) ? value : null;
  };

  return videos.sort((a, b) => {
    const orderA = orderOf(a);
    const orderB = orderOf(b);

    if (orderA !== null || orderB !== null) {
      if (orderA === null) return 1;
      if (orderB === null) return -1;
      if (orderA !== orderB) return orderA - orderB;
    }

    if (a.firstSeen !== b.firstSeen) {
      return a.firstSeen < b.firstSeen ? 1 : -1;
    }

    return compareTitles(a.title, b.title);
  });
}

export function buildManifest(videos) {
  return `${JSON.stringify({ folderId: FOLDER_ID, videos }, null, 2)}\n`;
}

/* ------------------------------------------------------------------ */
/* Procesos externos                                                   */
/* ------------------------------------------------------------------ */

function run(command, args) {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      { maxBuffer: 16 * 1024 * 1024, windowsHide: true },
      (error, stdout, stderr) => {
        resolve({
          code: error ? (typeof error.code === 'number' ? error.code : 1) : 0,
          error,
          stdout: stdout ?? '',
          stderr: stderr ?? '',
        });
      },
    );
  });
}

async function fileExists(file) {
  try {
    await readFile(file);
    return true;
  } catch {
    return false;
  }
}

async function fileSize(file) {
  const buffer = await readFile(file);
  return buffer.byteLength;
}

const driveDownloadUrl = (id) =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

async function renderLoop({ id, loopStart, ffmpeg, loopsDir, log, crf = 28 }) {
  const tmp = path.join(loopsDir, `.${id}.tmp.mp4`);
  const result = await run(ffmpeg, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-ss',
    String(loopStart),
    '-t',
    String(LOOP_SECONDS),
    '-i',
    driveDownloadUrl(id),
    '-an',
    '-vf',
    VIDEO_FILTER,
    '-c:v',
    'libx264',
    '-crf',
    String(crf),
    '-preset',
    'veryfast',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    tmp,
  ]);

  if (result.code !== 0) {
    await removeIfExists(tmp);
    throw new Error(result.stderr.trim() || `ffmpeg terminó con código ${result.code}`);
  }

  const finalPath = path.join(loopsDir, `${id}.mp4`);
  await replaceFile(tmp, finalPath);
  return finalPath;
}

async function renderPoster({ id, loopPath, ffmpeg, postersDir }) {
  const tmp = path.join(postersDir, `.${id}.tmp.jpg`);
  const result = await run(ffmpeg, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-ss',
    '2',
    '-i',
    loopPath,
    '-frames:v',
    '1',
    '-q:v',
    '4',
    tmp,
  ]);

  if (result.code !== 0) {
    await removeIfExists(tmp);
    throw new Error(result.stderr.trim() || `ffmpeg terminó con código ${result.code}`);
  }

  const finalPath = path.join(postersDir, `${id}.jpg`);
  await replaceFile(tmp, finalPath);
  return finalPath;
}

async function probeDimensions(loopPath, ffmpeg) {
  const result = await run(ffmpeg, ['-hide_banner', '-i', loopPath]);
  const output = `${result.stderr}\n${result.stdout}`;
  const match = output.match(/\b(\d{3,4})x(\d{3,4})\b/);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return null;
  return {
    width,
    height,
    orientation: width >= height ? 'horizontal' : 'vertical',
  };
}

async function removeIfExists(file) {
  try {
    await unlink(file);
  } catch {
    /* no-op */
  }
}

async function replaceFile(from, to) {
  await removeIfExists(to);
  await rename(from, to);
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Sincronización                                                      */
/* ------------------------------------------------------------------ */

export async function fetchEntries({ log = console } = {}) {
  const response = await fetch(FOLDER_URL, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (compatible; FERMnkePortfolioSync/1.0; +https://github.com/)',
    },
  });
  if (response.status !== 200) {
    throw new Error(`El listado de Drive respondió HTTP ${response.status}.`);
  }
  const html = await response.text();
  const entries = parseFolderHtml(html);
  log.log(`Drive: ${entries.length} videos encontrados.`);
  return entries;
}

export async function main({
  cwd = process.cwd(),
  ffmpeg = process.env.FFMPEG || 'ffmpeg',
  log = console,
  today = new Date().toISOString().slice(0, 10),
} = {}) {
  // Cualquier fallo del listado ocurre antes de tocar archivos.
  const entries = await fetchEntries({ log });

  const dataDir = path.join(cwd, 'data');
  const loopsDir = path.join(cwd, 'assets', 'loops');
  const postersDir = path.join(cwd, 'assets', 'posters');
  await mkdir(dataDir, { recursive: true });
  await mkdir(loopsDir, { recursive: true });
  await mkdir(postersDir, { recursive: true });

  const manifestPath = path.join(dataDir, 'videos.json');
  const overridesPath = path.join(dataDir, 'video-overrides.json');

  const previousManifest = await readJson(manifestPath, { videos: [] });
  const previousVideos = Array.isArray(previousManifest.videos)
    ? previousManifest.videos
    : [];
  const previousById = new Map(previousVideos.map((video) => [video.id, video]));
  const overrides = await readJson(overridesPath, {});
  const overrideMap =
    overrides && typeof overrides === 'object' && !Array.isArray(overrides)
      ? overrides
      : {};

  let hadFailure = false;
  const media = {};

  for (const entry of entries) {
    const override = overrideMap[entry.id] ?? {};
    const previous = previousById.get(entry.id);
    const loopPath = path.join(loopsDir, `${entry.id}.mp4`);
    const posterPath = path.join(postersDir, `${entry.id}.jpg`);

    const previousDate = previous?.driveModified ?? null;
    const loopStart = Number.isFinite(Number(override.loopStart))
      ? Number(override.loopStart)
      : DEFAULT_LOOP_START;
    const sourceChanged =
      !previous ||
      previousDate !== entry.driveModified ||
      (previous.loopStart ?? DEFAULT_LOOP_START) !== loopStart;
    const loopMissing = !(await fileExists(loopPath));
    let generatedLoop = false;
    let failed = false;

    if (sourceChanged || loopMissing) {
      try {
        log.log(`Procesando ${entry.id} (${entry.title})…`);
        await renderLoop({
          id: entry.id,
          loopStart,
          ffmpeg,
          loopsDir,
          log,
        });
        generatedLoop = true;

        const size = await fileSize(loopPath);
        if (size > MAX_LOOP_BYTES) {
          log.log(`  ${entry.id} supera 4 MB (${size} B); reintentando con CRF 33.`);
          await renderLoop({
            id: entry.id,
            loopStart,
            ffmpeg,
            loopsDir,
            log,
            crf: 33,
          });
        }
      } catch (error) {
        log.error(`Error generando loop de ${entry.id}: ${error.message}`);
        hadFailure = true;
        failed = true;
      }
    }

    const loopExists = await fileExists(loopPath);
    const posterExistsBefore = await fileExists(posterPath);
    if (loopExists && (generatedLoop || !posterExistsBefore)) {
      try {
        await renderPoster({
          id: entry.id,
          loopPath,
          ffmpeg,
          postersDir,
        });
      } catch (error) {
        log.error(`Error generando poster de ${entry.id}: ${error.message}`);
        hadFailure = true;
        failed = true;
      }
    }

    const dimensions = loopExists
      ? await probeDimensions(loopPath, ffmpeg)
      : null;
    const posterExists = await fileExists(posterPath);

    media[entry.id] = {
      driveModified: failed ? (previous?.driveModified ?? null) : entry.driveModified,
      loopStart: failed ? (previous?.loopStart ?? null) : loopStart,
      loop: loopExists ? `assets/loops/${entry.id}.mp4` : null,
      poster: posterExists ? `assets/posters/${entry.id}.jpg` : null,
      width: dimensions?.width ?? previous?.width ?? null,
      height: dimensions?.height ?? previous?.height ?? null,
      orientation:
        dimensions?.orientation ?? previous?.orientation ?? null,
    };
  }

  const currentIds = new Set(entries.map((entry) => entry.id));
  await cleanupOrphans(loopsDir, currentIds, /^(.+)\.mp4$/i);
  await cleanupOrphans(postersDir, currentIds, /^(.+)\.jpg$/i);

  const videos = mergeVideos({
    entries,
    overrides: overrideMap,
    previousVideos,
    today,
    media,
  });

  await writeFile(manifestPath, buildManifest(videos), 'utf8');
  log.log(`Manifiesto escrito: ${videos.length} videos.`);

  if (hadFailure) {
    process.exitCode = 1;
  }
}

async function cleanupOrphans(directory, currentIds, pattern) {
  let names = [];
  try {
    names = await readdir(directory);
  } catch {
    return;
  }
  for (const name of names) {
    if (name.startsWith('.')) continue;
    const match = name.match(pattern);
    if (!match) continue;
    if (currentIds.has(match[1])) continue;
    await removeIfExists(path.join(directory, name));
  }
}

const isEntrypoint =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  main().catch((error) => {
    console.error(`Sync abortado: ${error.message}`);
    process.exit(1);
  });
}
