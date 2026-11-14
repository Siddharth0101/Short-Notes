import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { dictionaries } from '../src/i18n/index.js';
import {
  createTranslator,
  DEFAULT_LANG,
  htmlLang,
  LANGUAGES,
  normalizeLang,
} from '../src/lib/lang.js';
import { ANALOGIES, analogyFor } from '../src/data/analogies.js';
import { VISUAL_IDS } from '../src/lib/visualIds.js';

const app = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  configFile: false,
  root: app,
  server: { middlewareMode: true, watch: null, hmr: false, ws: false, fs: { allow: ['..'] } },
  appType: 'custom',
  logLevel: 'error',
});
const { VISUALS } = await server.ssrLoadModule('/src/data/visuals.js');
const { localizeVisual, VISUALS_EN } = await server.ssrLoadModule('/src/data/visuals.en.js');
const { BASE_CATALOG, buildEnglishCatalog, chapterHeadings, loadEnglish } =
  await server.ssrLoadModule('/src/data/localized.js');
const { extractHeadings, extractTerms, splitPractice } =
  await server.ssrLoadModule('/src/lib/content.js');
const english = await loadEnglish();
const catalog = buildEnglishCatalog(english);
after(() => server.close());

const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
// Words that only appear in Hinglish sentences; a quick guard against untranslated English copy.
const hinglishWords = /\b(hai|hain|karo|nahi|aur|mein|hota|hoti|ke liye|kya|toh)\b/i;

test('Both languages define exactly the same UI strings with the same placeholders', () => {
  const [hinglish, en] = [dictionaries.hinglish, dictionaries.en];
  assert.deepEqual(Object.keys(en).sort(), Object.keys(hinglish).sort());
  for (const [key, text] of Object.entries(hinglish)) {
    assert(text.trim() || key === 'md.exampleError', `Empty Hinglish string: ${key}`);
    assert(en[key].trim(), `Empty English string: ${key}`);
    assert.deepEqual(placeholders(en[key]), placeholders(text), `Placeholders differ: ${key}`);
  }
  for (const [key, text] of Object.entries(en))
    assert(!hinglishWords.test(text), `English string still reads as Hinglish: ${key} → ${text}`);
});

test('Every literal key passed to t() exists, so a typo cannot ship as visible key text', async () => {
  async function sources(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await sources(full)));
      else if (/\.jsx?$/.test(entry.name)) files.push(full);
    }
    return files;
  }
  const used = new Set();
  for (const file of await sources(path.join(app, 'src'))) {
    if (file.includes(`${path.sep}i18n${path.sep}`)) continue;
    const code = await readFile(file, 'utf8');
    for (const match of code.matchAll(/\bt\(\s*'([a-zA-Z0-9_./-]+)'/g)) used.add(match[1]);
  }
  assert(used.size > 150, 'Expected the app to use the dictionaries');
  for (const key of used) assert(key in dictionaries.hinglish, `Missing translation key: ${key}`);
});

test('Translator falls back to Hinglish, then to the key, and picks singular forms', () => {
  const t = createTranslator(
    {
      hinglish: { a: 'A {n}', only: 'sirf yahan', days: '{count} din', days_one: 'ek din' },
      en: { a: 'EN {n}' },
    },
    'en',
  );
  assert.equal(t('a', { n: 2 }), 'EN 2');
  assert.equal(t('only'), 'sirf yahan');
  assert.equal(t('missing.key'), 'missing.key');
  assert.equal(t('days', { count: 1 }), 'ek din');
  assert.equal(t('days', { count: 3 }), '3 din');
  assert.equal(t('a'), 'EN {n}');
});

test('Language preference accepts only known languages and maps to an html lang', () => {
  assert.equal(DEFAULT_LANG, 'hinglish');
  assert.deepEqual(
    LANGUAGES.map((language) => language.id),
    ['hinglish', 'en'],
  );
  for (const value of [null, undefined, '', 'hi', 'EN', 'english', '<script>'])
    assert.equal(normalizeLang(value), 'hinglish');
  assert.equal(normalizeLang('en'), 'en');
  assert.equal(htmlLang('en'), 'en');
  assert.equal(htmlLang('hinglish'), 'hi-Latn');
});

test('English catalog keeps ids, order, anchors and practice ids of the canonical notes', () => {
  assert.equal(catalog.notes.length, BASE_CATALOG.notes.length);
  assert.deepEqual(
    catalog.notes.map((note) => note.id),
    BASE_CATALOG.notes.map((note) => note.id),
  );
  let translated = 0;
  for (const [index, note] of catalog.notes.entries()) {
    const original = BASE_CATALOG.notes[index];
    for (const key of ['track', 'order', 'level', 'minutes', 'practiceCount', 'visual'])
      assert.deepEqual(note[key], original[key], `${note.id}: ${key}`);
    assert(note.title && note.summary, note.id);
    assert(
      !hinglishWords.test(note.summary),
      `${note.id}: summary is not English: ${note.summary}`,
    );
    if (note.untranslated) {
      assert.equal(note.body, original.body, `${note.id}: fallback body must be the original`);
      continue;
    }
    translated++;
    assert.deepEqual(
      chapterHeadings(note).map((heading) => heading.id),
      extractHeadings(original.body).map((heading) => heading.id),
      `${note.id}: section anchors must not change with the language`,
    );
    assert.deepEqual(
      splitPractice(note.body, note.practiceSlugs).questions.map((question) => question.slug),
      splitPractice(original.body).questions.map((question) => question.slug),
      `${note.id}: practice progress ids must not change with the language`,
    );
    assert.equal(extractTerms(note.body).length, extractTerms(original.body).length, note.id);
    assert.notEqual(note.body, original.body, note.id);
  }
  assert.equal(translated, Object.keys(english.chapters).length);
  assert(translated > 0, 'At least one chapter should be fully translated');
});

test('English stages and question overlays only reference existing ids', () => {
  const stageIds = Object.values(BASE_CATALOG.courses).flatMap((course) =>
    course.stages.map((stage) => stage.id),
  );
  assert.deepEqual(Object.keys(english.stages).sort(), [...stageIds].sort());
  for (const course of Object.values(catalog.courses))
    for (const stage of course.stages) {
      assert(!hinglishWords.test(`${stage.title} ${stage.goal} ${stage.checkpoint}`), stage.id);
      assert(Array.isArray(stage.chapters) && stage.chapters.length > 0, stage.id);
    }
  const first = catalog.notes.find((note) => note.stage);
  assert.equal(first.stage, catalog.courses[first.track].stages[first.stageNumber - 1]);
  assert.equal(catalog.questions.length, BASE_CATALOG.questions.length);
  for (const id of Object.keys(english.questions)) assert(BASE_CATALOG.questionById[id], id);
  for (const question of catalog.questions)
    assert.equal(Boolean(question.untranslated), !english.questions[question.id], question.id);
});

test('Every visual has English copy, and traces keep the same steps in both languages', () => {
  assert.deepEqual(Object.keys(VISUALS_EN).sort(), [...VISUAL_IDS].sort());
  for (const visual of VISUALS) {
    const localized = localizeVisual(visual, 'en');
    assert.equal(localizeVisual(visual, 'hinglish'), visual);
    assert(!hinglishWords.test(localized.description), `${visual.id}: description`);
    assert(!hinglishWords.test(localized.takeaway), `${visual.id}: takeaway`);
    assert.equal(localized.code, visual.code);
    if (visual.trace) {
      for (const variant of [false, true]) {
        const [original, translated] = [
          visual.trace('hinglish', variant),
          visual.trace('en', variant),
        ];
        assert.equal(translated.length, original.length, `${visual.id}: frame count`);
        for (const [index, frame] of translated.entries()) {
          assert(
            !hinglishWords.test(`${frame.title} ${frame.explanation}`),
            `${visual.id} #${index}`,
          );
          assert.deepEqual(frame.cells, original[index].cells, `${visual.id} #${index}: cells`);
          assert.deepEqual(
            frame.metrics,
            original[index].metrics,
            `${visual.id} #${index}: metrics`,
          );
        }
      }
    } else if (visual.frames) {
      assert.equal(VISUALS_EN[visual.id].frames.length, visual.frames.length, visual.id);
      for (const [index, frame] of localized.frames.entries()) {
        assert(
          !hinglishWords.test(`${frame.title} ${frame.explanation}`),
          `${visual.id} #${index}`,
        );
        assert.equal(
          frame.lanes.length,
          visual.frames[index].lanes.length,
          `${visual.id} #${index}`,
        );
      }
    }
  }
});

test('Analogies belong to real chapters and state their limit in both languages', () => {
  const ids = new Set(BASE_CATALOG.notes.map((note) => note.id));
  assert.equal(new Set(ANALOGIES.map((item) => item.id)).size, ANALOGIES.length);
  for (const item of ANALOGIES) {
    assert(ids.has(item.id), `Unknown chapter for analogy: ${item.id}`);
    for (const lang of ['hinglish', 'en'])
      for (const field of ['title', 'text', 'catch'])
        assert(item[lang][field].trim().length > 10, `${item.id}.${lang}.${field}`);
    assert(!hinglishWords.test(`${item.en.title} ${item.en.text} ${item.en.catch}`), item.id);
  }
  assert.equal(analogyFor('js-scope-closures', 'en').title, 'A closure is a lunchbox from home');
  assert.equal(analogyFor('js-scope-closures', 'xx').title, 'Closure = ghar se mila tiffin');
  assert.equal(analogyFor('no-such-chapter', 'en'), null);
});
