import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  cleanTitle,
  mergeVideos,
  parseFolderHtml,
  sanitizeMetrics,
} from './sync-drive.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(
  path.join(here, 'fixtures', 'folder.html'),
  'utf8',
);

function entryHtml({
  id,
  title,
  icon = 'type/video/mp4',
  date = 'Nov 5',
} = {}) {
  return (
    `<div class="flip-entry" id="entry-${id}" tabindex="0" role="link">` +
    `<div class="flip-entry-info"><a href="#">` +
    `<div class="flip-entry-visual"><div class="flip-entry-thumb">` +
    `<img src="thumb.jpg" alt="Video"/></div></div>` +
    `<div class="flip-entry-list-icon">` +
    `<img src="https://drive-thirdparty.googleusercontent.com/16/${icon}" alt=""/></div>` +
    `<div class="flip-entry-title">${title}</div></a></div>` +
    `<div class="flip-entry-last-modified"><div>${date}</div></div></div>`
  );
}

test('el fixture contiene exactamente los 6 ids esperados', () => {
  const entries = parseFolderHtml(fixture);
  assert.deepEqual(
    entries.map((entry) => entry.id),
    [
      '1YPM_cn_Jn0yUEHYDiuWQY7r2nREqRHLC',
      '1CE0A-vtdnEWtZ6tSFYn4cLvGSkpcLVqv',
      '1TiukRRjshOUKm6eudSooK5nkk32hQn6Q',
      '10T6uw4YNruo9vgQisBvHc9AOSXgx8fRZ',
      '1wryZGsrixY3MkVI7Q6aYxMjMfQjelf3-',
      '18fPjwqUXsceqKgzxA75A8qOpM8duVGrQ',
    ],
  );
});

test('HTML sin entradas lanza error', () => {
  assert.throws(() => parseFolderHtml('<html><body></body></html>'), /ninguna entrada/i);
});

test('una entrada que no es de video se descarta', () => {
  const html =
    entryHtml({ id: 'validVideo1', title: 'Uno.mp4' }) +
    entryHtml({ id: 'validPdf123', title: 'Doc.pdf', icon: 'type/pdf' });
  const entries = parseFolderHtml(html);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].id, 'validVideo1');
});

test('un id con caracteres inválidos se descarta', () => {
  const html =
    entryHtml({ id: 'validVideo1', title: 'Uno.mp4' }) +
    entryHtml({ id: 'bad!id', title: 'Dos.mp4' });
  const entries = parseFolderHtml(html);
  assert.deepEqual(entries.map((entry) => entry.id), ['validVideo1']);
});

test('limpieza de títulos: extensión sin distinguir mayúsculas y guiones bajos', () => {
  assert.equal(
    cleanTitle('Anuncio Publicitario Carlotas.MP4'),
    'Anuncio Publicitario Carlotas',
  );
  assert.equal(
    cleanTitle('MEYDEY_reel 1_ semana 1.mp4'),
    'MEYDEY reel 1 semana 1',
  );
  assert.equal(cleanTitle('  Titulo   con    espacios.mp4  '), 'Titulo con espacios');
});

test('merge aplica overrides', () => {
  const entries = [
    { id: 'abc123', title: 'Original_uno.MP4', driveModified: 'Nov 5' },
  ];
  const overrides = {
    abc123: {
      order: 1,
      title: 'Curado',
      client: 'MEY DEY',
      tag_es: 'Reel',
      tag_en: 'Reel',
      loopStart: 4,
      metrics: [{ label_es: 'Vistas', label_en: 'Views', value: '10K' }],
    },
  };
  const [video] = mergeVideos({
    entries,
    overrides,
    previousVideos: [],
    today: '2026-11-07',
    media: {
      abc123: {
        width: 540,
        height: 960,
        orientation: 'vertical',
        loop: 'assets/loops/abc123.mp4',
        poster: 'assets/posters/abc123.jpg',
      },
    },
  });

  assert.equal(video.title, 'Curado');
  assert.equal(video.client, 'MEY DEY');
  assert.equal(video.firstSeen, '2026-11-07');
  assert.equal(video.orientation, 'vertical');
  assert.equal(video.driveModified, 'Nov 5');
  assert.deepEqual(video.metrics, [
    { label_es: 'Vistas', label_en: 'Views', value: '10K' },
  ]);
});

test('orden: overrides con order primero, luego firstSeen descendente y título', () => {
  const entries = [
    { id: 'uno', title: 'Zeta.mp4', driveModified: 'A' },
    { id: 'dos', title: 'Alfa.mp4', driveModified: 'B' },
    { id: 'tres', title: 'Ordenado.mp4', driveModified: 'C' },
    { id: 'cuatro', title: 'Beta.mp4', driveModified: 'D' },
  ];
  const overrides = { tres: { order: 1 } };
  const previousVideos = [
    { id: 'uno', firstSeen: '2026-01-01' },
    { id: 'dos', firstSeen: '2026-02-01' },
    { id: 'cuatro', firstSeen: '2026-02-01' },
  ];

  const videos = mergeVideos({
    entries,
    overrides,
    previousVideos,
    today: '2026-11-07',
  });

  assert.deepEqual(
    videos.map((video) => video.id),
    ['tres', 'dos', 'cuatro', 'uno'],
  );
});

test('firstSeen se conserva del manifiesto previo', () => {
  const entries = [{ id: 'abc123', title: 'Uno.mp4', driveModified: 'Nov 5' }];
  const [video] = mergeVideos({
    entries,
    overrides: {},
    previousVideos: [{ id: 'abc123', firstSeen: '2024-03-09' }],
    today: '2026-11-07',
  });
  assert.equal(video.firstSeen, '2024-03-09');
});

test('sanitizeMetrics solo admite label_es, label_en y value', () => {
  assert.deepEqual(
    sanitizeMetrics([
      { label_es: 'A', label_en: 'A', value: 1, extra: 'x' },
      { value: 2 },
      { label_es: 'B', value: null },
      null,
    ]),
    [{ label_es: 'A', label_en: 'A', value: 1 }],
  );
});

test('un video fallido conserva la fecha previa para reintentarse', () => {
  const [video] = mergeVideos({
    entries: [{ id: 'abc', title: 'a.mp4', driveModified: 'Nov 7' }],
    previousVideos: [{ id: 'abc', driveModified: 'Nov 1', firstSeen: '2026-11-01' }],
    today: '2026-11-07',
    media: { abc: { driveModified: 'Nov 1', loopStart: null } },
  });
  assert.equal(video.driveModified, 'Nov 1');
});
