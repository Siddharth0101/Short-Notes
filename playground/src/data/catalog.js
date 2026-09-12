import { parseFrontmatter, TRACKS } from '../lib/content.js';
import sourceChapters from './sourceChapters.json';
import { interviewQuestions } from './interviewQuestions.js';
import { chapterPlacement } from './curriculum.js';

const chapters = import.meta.glob(['../../../notes/*/*.md', '!../../../notes/*/README.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
});
export const notes = Object.entries(chapters)
  .map(([source, raw]) => {
    const note = parseFrontmatter(raw);
    return {
      ...note,
      ...chapterPlacement[note.id],
      source: source.replace('../../../', ''),
      kind: 'chapter',
    };
  })
  .filter((note) => note.id)
  .sort(
    (a, b) =>
      TRACKS.findIndex((t) => t.id === a.track) - TRACKS.findIndex((t) => t.id === b.track) ||
      a.order - b.order,
  );

const originals = import.meta.glob(
  [
    '../../../01_JavaScript/**/*.js',
    '../../../02_Dsa/**/*.js',
    '../../../03_Frontend/**/*.js',
    '../../../04_Backend/**/*.{js,java}',
    '../../../05_Interview/**/*.{js,jsx}',
    '../../../06_System_Design/**/*.js',
  ],
  { query: '?raw', import: 'default' },
);
export const archive = Object.entries(originals).map(([source, load], index) => {
  const path = source.replace('../../../', '');
  const track = path.startsWith('01_')
    ? 'javascript'
    : path.startsWith('02_')
      ? 'dsa'
      : path.startsWith('03_')
        ? 'react'
        : path.startsWith('05_')
          ? 'interview'
          : path.startsWith('06_')
            ? 'system-design'
            : path.includes('Java_Spring')
              ? 'java'
              : 'mongodb';
  const domain = {
    '01': 'javascript',
    '02': 'dsa',
    '03': 'frontend',
    '04': 'backend',
    '05': 'interview',
    '06': 'systemdesign',
  }[path.slice(0, 2)];
  const originalUrl =
    path.endsWith('.java') || (domain === 'interview' && path.endsWith('.js'))
      ? null
      : `/domain/${domain}/file/${path
          .split('/')
          .slice(1)
          .join('/')
          .replace(/\.[^.]+$/, '')
          .toLowerCase()
          .replaceAll('_', '-')
          .replaceAll(',', '-')}`;
  return {
    id: `original-${path
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}`,
    title: path
      .split('/')
      .pop()
      .replace(/\.[^.]+$/, '')
      .replace(/^\d+_/, '')
      .replaceAll('_', ' '),
    source: path,
    track,
    originalUrl,
    chapterId: sourceChapters[path],
    order: index,
    level: 'Reference',
    minutes: 0,
    summary: path
      .split('/')
      .slice(1, -1)
      .map((s) => s.replace(/^\d+_/, '').replaceAll('_', ' '))
      .join(' / '),
    tags: ['Original notes'],
    language: path.endsWith('.java') ? 'java' : path.endsWith('.jsx') ? 'jsx' : 'javascript',
    kind: 'original',
    load,
  };
});
const pdfFiles = import.meta.glob(['../../../01_JavaScript/*.pdf', '../../../04_Backend/*.pdf'], {
  query: '?url',
  import: 'default',
  eager: true,
});
export const resources = Object.entries(pdfFiles).map(([source, url]) => ({
  url,
  title: source.includes('01_JavaScript') ? 'JavaScript course slides' : 'Backend course slides',
  source: source.replace('../../../', ''),
}));
// One canonical lesson owns each source file. Keep old IDs as aliases for saved links.
for (const note of notes) {
  note.references = archive.filter((item) => item.chapterId === note.id);
  const practiceTrack = note.track === 'interview' ? note.id.replace('interview-', '') : note.track;
  note.questions = interviewQuestions.filter((item) => {
    if (note.track === 'interview') return item.track === practiceTrack;
    if (item.noteId) return item.noteId === note.id;
    if (item.track !== note.track) return false;
    return item.tags.some((tag) => note.tags.includes(tag));
  });
  note.searchText = [
    ...note.references.map((item) => `${item.title} ${item.source}`),
    ...note.questions.map((item) => `${item.question} ${item.answer}`),
  ].join(' ');
}
export const allNotes = [...notes, ...archive];
export const noteById = Object.fromEntries(allNotes.map((note) => [note.id, note]));
export const trackById = Object.fromEntries(TRACKS.map((track) => [track.id, track]));
