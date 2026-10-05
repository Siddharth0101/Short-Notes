import { readFile } from 'node:fs/promises';
const names = ['intro', 'theory', 'coding', 'review'];
const permissions = {
  intro: ['search_notes', 'respond'],
  theory: ['search_notes', 'get_questions', 'respond'],
  coding: ['search_notes', 'get_questions', 'assign_coding', 'respond'],
  review: ['search_notes', 'respond'],
};
export const specialists = Object.fromEntries(
  await Promise.all(
    names.map(async (id) => [
      id,
      {
        id,
        allowedTools: permissions[id],
        instructions: await readFile(new URL(`./prompts/${id}.md`, import.meta.url), 'utf8'),
      },
    ]),
  ),
);
