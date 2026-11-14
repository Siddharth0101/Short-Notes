// English content overlay. Loaded on demand (one async chunk) when the reader switches language;
// Hinglish stays canonical for IDs, order, anchors and saved progress.
import { parseFrontmatter } from '../lib/content.js';
import stages from '../../../notes/en/curriculum.json';
import chapterMeta from '../../../notes/en/chapters.json';
import questions from './i18n/questions.en.json';

const files = import.meta.glob(['../../../notes/en/*/*.md', '!../../../notes/en/*/README.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
});
export const chapters = Object.fromEntries(
  Object.values(files)
    .map((raw) => {
      const note = parseFrontmatter(raw);
      return [note.id, { title: note.title, summary: note.summary, body: note.body }];
    })
    .filter(([id]) => id),
);
// `chapterMeta` gives every chapter an English title and summary even before its full text
// is translated; `chapters` holds the fully translated ones.
export { stages, chapterMeta, questions };
