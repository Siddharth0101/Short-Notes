// Chapter text and interview answers are not part of the first download. This store fetches them
// when a screen asks, keeps what has arrived, and builds the catalog for a language from it.
// Hinglish is canonical: anchors, practice ids and flashcard ids always come from its text.
import { archive, notes as chapters, questionTotal } from './catalog.js';
import { courses } from './curriculum.js';
import {
  chapterQuestions,
  extractHeadings,
  parseFrontmatter,
  splitPractice,
} from '../lib/content.js';

const files = {
  hinglish: import.meta.glob(['../../../notes/*/*.md', '!../../../notes/*/README.md'], {
    query: '?raw',
    import: 'default',
  }),
  en: import.meta.glob(['../../../notes/en/*/*.md', '!../../../notes/en/*/README.md'], {
    query: '?raw',
    import: 'default',
  }),
};
const pathOf = (note, lang) =>
  `../../../${lang === 'en' ? note.source.replace(/^notes\//, 'notes/en/') : note.source}`;
const byId = (items) => Object.fromEntries(items.map((item) => [item.id, item]));
const chapterById = byId(chapters);

const text = { hinglish: new Map(), en: new Map() }; // chapter id → chapter text
const bank = { hinglish: null, en: null }; // question list, and the English overlay keyed by id
let englishMeta = null; // English stage text and chapter titles

let version = 0;
const listeners = new Set();
const catalogs = new Map();
function changed() {
  version++;
  catalogs.clear();
  listeners.forEach((listener) => listener());
}
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getVersion = () => version;

// One request per resource. A failed request is forgotten so that a retry really tries again.
// `before` is a seam for tests: awaited ahead of every request, it lets a test hold a download
// back or make it fail. The app never sets it.
const requests = new Map();
let before = null;
function once(key, load) {
  if (!requests.has(key))
    requests.set(
      key,
      Promise.resolve(before?.(key))
        .then(load)
        .catch((error) => {
          requests.delete(key);
          throw error;
        }),
    );
  return requests.get(key);
}
const loadText = (note, lang) =>
  once(`text:${lang}:${note.id}`, async () => {
    const load = files[lang][pathOf(note, lang)];
    if (!load) throw new Error(`No ${lang} text for ${note.id}`);
    text[lang].set(note.id, parseFrontmatter(await load()).body);
  });
const loadBank = (lang) =>
  once(`bank:${lang}`, async () => {
    bank[lang] =
      lang === 'en'
        ? (await import('./i18n/questions.en.json')).default
        : (await import('./interviewQuestions.js')).interviewQuestions;
  });
export const loadEnglishMeta = () =>
  once('english-meta', async () => {
    englishMeta = await import('./englishMeta.js');
    changed();
  });

// What a screen needs. `chapters` is 'all', 'track:<id>' or one chapter id; `questions` asks for
// the interview bank. English also needs the Hinglish text of the same chapters (see top).
function wanted({ chapters: scope } = {}) {
  if (!scope) return [];
  if (scope === 'all') return chapters;
  if (scope.startsWith('track:')) return chapters.filter((note) => note.track === scope.slice(6));
  return chapterById[scope] ? [chapterById[scope]] : [];
}
const hasText = (note, lang) =>
  text.hinglish.has(note.id) && (lang !== 'en' || !note.english || text.en.has(note.id));
const hasBank = (lang) => bank.hinglish !== null && (lang !== 'en' || bank.en !== null);

export function isReady(lang, need = {}) {
  return (
    (lang !== 'en' || englishMeta !== null) &&
    wanted(need).every((note) => hasText(note, lang)) &&
    (!need.questions || hasBank(lang))
  );
}

export async function ensure(lang, need = {}) {
  if (isReady(lang, need)) return;
  const english = lang === 'en';
  await Promise.all([
    english && loadEnglishMeta(),
    ...wanted(need).flatMap((note) => [
      loadText(note, 'hinglish'),
      english && note.english && loadText(note, 'en'),
    ]),
    need.questions && loadBank('hinglish'),
    need.questions && english && loadBank('en'),
  ]);
  changed();
}

// Everything, in both languages. Tests use it so that screens render without a loading step.
export const preloadAll = () => ensure('en', { chapters: 'all', questions: true });

// Forget everything that was fetched. For tests of the loading states only.
export function resetContent(options = {}) {
  before = options.before || null;
  text.hinglish.clear();
  text.en.clear();
  bank.hinglish = bank.en = null;
  englishMeta = null;
  requests.clear();
  questionIds = null;
  localized = {};
  anchors.clear();
  changed();
}

// The canonical (Hinglish) text of a chapter, or undefined while it has not been fetched.
export const canonicalText = (id) => text.hinglish.get(id);

let localized = {};
function questionsFor(lang) {
  if (!hasBank(lang)) return null;
  localized[lang] ??=
    lang === 'en'
      ? bank.hinglish.map((question) =>
          bank.en[question.id]
            ? { ...question, ...bank.en[question.id] }
            : { ...question, untranslated: true },
        )
      : bank.hinglish;
  return localized[lang];
}
let questionIds = null;
function questionIdsOf(note) {
  questionIds ??= new Map(
    chapters.map((chapter) => [
      chapter.id,
      chapterQuestions(chapter, bank.hinglish).map((question) => question.id),
    ]),
  );
  return questionIds.get(note.id);
}
// Anchors and practice ids of a translated chapter, taken from the canonical text by position.
const anchors = new Map();
function anchorsOf(note, canonical, translation) {
  if (!anchors.has(note.id)) {
    const original = extractHeadings(canonical);
    anchors.set(note.id, {
      headingIds: Object.fromEntries(
        extractHeadings(translation).map((heading, index) => [
          heading.title,
          original[index]?.id ?? heading.id,
        ]),
      ),
      practiceSlugs: splitPractice(canonical).questions.map((question) => question.slug),
    });
  }
  return anchors.get(note.id);
}

function build(lang) {
  const english = lang === 'en';
  const questions = questionsFor(lang);
  const questionById = questions ? byId(questions) : {};
  const stageById = {};
  const localCourses = english
    ? Object.fromEntries(
        Object.entries(courses).map(([track, course]) => [
          track,
          {
            ...course,
            stages: course.stages.map((stage) => {
              stageById[stage.id] = { ...stage, ...englishMeta.stages[stage.id] };
              return stageById[stage.id];
            }),
          },
        ]),
      )
    : courses;
  const notes = chapters.map((note) => {
    const own = questions ? questionIdsOf(note).map((id) => questionById[id]) : undefined;
    const base = {
      ...note,
      ...(own && { questions: own }),
      searchText: [
        ...note.references.map((item) => `${item.title} ${item.source}`),
        ...(own || []).map((item) => `${item.question} ${item.answer}`),
      ].join(' '),
    };
    const canonical = text.hinglish.get(note.id);
    if (!english) return canonical === undefined ? base : { ...base, body: canonical };
    const meta = englishMeta.chapterMeta?.[note.id];
    const shared = {
      ...base,
      title: meta?.title || note.title,
      summary: meta?.summary || note.summary,
      stage: note.stage ? stageById[note.stage.id] : note.stage,
    };
    // A chapter with no English file is shown in Hinglish, flagged so the reader is told.
    if (!note.english)
      return { ...shared, untranslated: true, ...(canonical !== undefined && { body: canonical }) };
    const translation = text.en.get(note.id);
    if (canonical === undefined || translation === undefined) return shared;
    return { ...shared, body: translation, ...anchorsOf(note, canonical, translation) };
  });
  return {
    lang,
    notes,
    noteById: byId([...notes, ...archive]),
    courses: localCourses,
    questions: questions || [],
    questionById,
    questionTotal,
  };
}

// The catalog for a language, from whatever has been fetched so far. Until the English titles
// arrive, English readers see the Hinglish catalog.
export function getCatalog(lang) {
  const key = lang === 'en' && englishMeta ? 'en' : 'hinglish';
  if (!catalogs.has(key)) catalogs.set(key, build(key));
  return catalogs.get(key);
}
