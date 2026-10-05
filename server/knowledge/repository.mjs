import { supplementalCodingTasks } from './coding-tasks.mjs';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, TRACKS } from '../../playground/src/lib/content.js';
import { interviewQuestions } from '../../playground/src/data/interviewQuestions.js';
export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const subjects = TRACKS.filter((t) => t.id !== 'interview').map(({ id, name }) => ({
  id,
  name,
}));
export async function loadContent() {
  const notes = [];
  for (const { id } of subjects) {
    for (const file of await readdir(resolve(ROOT, 'notes', id))) {
      if (!file.endsWith('.md') || file === 'README.md') continue;
      const note = parseFrontmatter(await readFile(resolve(ROOT, 'notes', id, file), 'utf8'));
      if (note.id) notes.push(note);
    }
  }
  return {
    notes,
    questions: [...interviewQuestions, ...supplementalCodingTasks],
  };
}
export function search(items, subject, query = '', limit = 5) {
  const terms = String(query).toLowerCase().split(/\W+/).filter(Boolean).slice(0, 12);
  return items
    .filter((n) => n.track === subject)
    .map((item) => ({
      item,
      score: terms.reduce(
        (score, term) => score + (JSON.stringify(item).toLowerCase().includes(term) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
