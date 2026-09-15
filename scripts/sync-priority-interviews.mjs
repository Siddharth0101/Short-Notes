import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { interviewQuestions } from '../playground/src/data/interviewQuestions.js';
import { parseFrontmatter, TRACKS } from '../playground/src/lib/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'notes/interview-priorities.json'), 'utf8'));
const byId = new Map(interviewQuestions.map(q => [q.id, q]));
const readingById = new Map();
for (const track of TRACKS) {
  for (const filename of await readdir(path.join(root, 'notes', track.id))) {
    if (!filename.endsWith('.md') || filename === 'README.md') continue;
    const file = `${track.id}/${filename}`;
    const note = parseFrontmatter(await readFile(path.join(root, 'notes', file), 'utf8'));
    readingById.set(note.id, { file, title: note.title });
  }
}
const seen = new Set();
const entries = config.selection.map(entry => {
  const q = byId.get(entry.id);
  if (!q || seen.has(entry.id)) throw new Error(`Invalid priority identity: ${entry.id}`);
  seen.add(entry.id);
  const reading = q.noteId ? readingById.get(q.noteId) : [...readingById.values()].find(n => n.file === entry.reading);
  if (!reading) throw new Error(`Missing priority reading: ${entry.id}`);
  return { q, reading };
});
let out = (await readFile(path.join(root, 'scripts/templates/interview-priority-intro.md'), 'utf8'))
  .replaceAll('../../notes/', '');
out += `\nReview date: ${config.reviewed}. Full bank: ${interviewQuestions.length} questions. Priority set: ${entries.length}.\n\n## Selected questions — seedha topic par jao\n\n`;
for (const track of TRACKS.filter(t => t.id !== 'interview')) {
  const selected = entries.filter(({ q }) => q.track === track.id);
  if (!selected.length) continue;
  out += `### ${track.name}\n\n`;
  for (const { q } of selected) out += `- [${q.question}](#${q.id})\n`;
}
for (const { q, reading } of entries) {
  out += `\n## ${q.id}\n\n**${q.question}**\n\n[Pehle concept padho: ${reading.title}](${reading.file})\n\n`;
  if (q.promptCode) out += `${q.promptCode}\n\n`;
  out += `**Answer — reasoning samjho:**\n\n${q.answer}\n\n**Follow-up — khud explain karo:** ${q.followUp}\n`;
  for (const source of q.sources || []) out += `\n[${source.title}](${source.url})\n`;
}
for (const [, href] of out.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
  if (/^(https?:|#|mailto:)/.test(href)) continue;
  if (!(await stat(path.resolve(root, 'notes', href.split('#')[0]))).isFile()) throw new Error(`Broken priority link: ${href}`);
}
const target = path.join(root, 'notes/INTERVIEW_PRIORITY_GUIDE.md');
if (process.argv.includes('--check')) {
  if ((await readFile(target, 'utf8')) !== out) throw new Error('Run node scripts/sync-priority-interviews.mjs');
} else await writeFile(target, out);
console.log(`Verified ${entries.length} priority questions with canonical answers and chapter links.`);
