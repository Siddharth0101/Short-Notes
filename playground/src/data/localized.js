import { notes, archive } from './catalog.js';
import { courses } from './curriculum.js';
import { interviewQuestions } from './interviewQuestions.js';
import { extractHeadings, splitPractice } from '../lib/content.js';

const byId = (items) => Object.fromEntries(items.map((item) => [item.id, item]));

// Hinglish is the canonical catalog; other languages are overlays on the same IDs.
export const BASE_CATALOG = {
  lang: 'hinglish',
  notes,
  noteById: byId([...notes, ...archive]),
  courses,
  questions: interviewQuestions,
  questionById: byId(interviewQuestions),
};

let englishModule;
export function loadEnglish() {
  englishModule ??= import('./english.js');
  return englishModule;
}

// Missing translations fall back to the Hinglish original and are flagged `untranslated`.
export function buildEnglishCatalog(english) {
  const questions = interviewQuestions.map((question) =>
    english.questions[question.id]
      ? { ...question, ...english.questions[question.id] }
      : { ...question, untranslated: true },
  );
  const questionById = byId(questions);
  const stageById = {};
  const localizedCourses = Object.fromEntries(
    Object.entries(courses).map(([track, course]) => [
      track,
      {
        ...course,
        stages: course.stages.map((stage) => {
          const localized = { ...stage, ...english.stages[stage.id] };
          stageById[stage.id] = localized;
          return localized;
        }),
      },
    ]),
  );
  const localizedNotes = notes.map((note) => {
    const translation = english.chapters[note.id];
    const shared = {
      ...note,
      stage: note.stage ? stageById[note.stage.id] : note.stage,
      questions: note.questions.map((question) => questionById[question.id]),
    };
    shared.searchText = [
      ...note.references.map((item) => `${item.title} ${item.source}`),
      ...shared.questions.map((item) => `${item.question} ${item.answer}`),
    ].join(' ');
    const meta = english.chapterMeta?.[note.id];
    if (!translation)
      return {
        ...shared,
        title: meta?.title || note.title,
        summary: meta?.summary || note.summary,
        untranslated: true,
      };
    // Anchors and practice IDs stay canonical so links and progress survive a language switch.
    const canonical = extractHeadings(note.body);
    const headingIds = Object.fromEntries(
      extractHeadings(translation.body).map((heading, index) => [
        heading.title,
        canonical[index]?.id ?? heading.id,
      ]),
    );
    return {
      ...shared,
      title: translation.title || note.title,
      summary: translation.summary || note.summary,
      body: translation.body,
      headingIds,
      practiceSlugs: splitPractice(note.body).questions.map((question) => question.slug),
    };
  });
  return {
    lang: 'en',
    notes: localizedNotes,
    noteById: byId([...localizedNotes, ...archive]),
    courses: localizedCourses,
    questions,
    questionById,
  };
}

const built = new WeakMap();
export function getCatalog(lang, english) {
  if (lang !== 'en' || !english) return BASE_CATALOG;
  if (!built.has(english)) built.set(english, buildEnglishCatalog(english));
  return built.get(english);
}

// Headings for a chapter's table of contents, with canonical anchors in every language.
export function chapterHeadings(note) {
  return extractHeadings(note.body).map((heading) => ({
    ...heading,
    id: note.headingIds?.[heading.title] ?? heading.id,
  }));
}
