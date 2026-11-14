// Helper for translating chapters to English without touching code or structure.
//
//   node scripts/translate-chapters.mjs extract <track> [from] [to]
//       writes .i18n-work/seg/<track>-<from>-<to>.txt — one numbered line per translatable line
//   node scripts/translate-chapters.mjs weave <track>
//       reads every .i18n-work/tr/<track>-*.txt (same "@@ file" / "N|text" layout, translated)
//       and writes notes/en/<track>/<same-file>.md
//
// Code blocks, blank lines, standard headings and plain source links are copied or mapped
// automatically, so a woven chapter always passes the structure rules of check-translations.mjs.
// The wording itself is not checked — review it. `.i18n-work/` is ignored by git.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const work = path.join(root, '.i18n-work');
// Lines with one fixed English form are never sent for translation.
const AUTO = new Map([
  ['## Quick revision', '## Quick revision'],
  ['## Example se samjho', '## Understand it with an example'],
  ['## Recall aur practice', '## Recall and practice'],
  ['## Practice questions', '## Practice questions'],
  ['## Sources — aur padhne ke liye', '## Sources — further reading'],
  ['## Code practice', '## Code practice'],
  ['### Edge cases aur reasoning', '### Edge cases and reasoning'],
  ['### Quick answer checks', '### Quick answer checks'],
  ['<details>', '<details>'],
  ['</details>', '</details>'],
  ['<summary>Answer</summary>', '<summary>Answer</summary>'],
]);
const hinglish =
  /\b(hai|hain|hota|hoti|hote|karo|karta|karti|karte|nahi|aur|mein|ke liye|ka|ki|ko|par|yeh|wala|wali|kar|ho|se|toh|bhi|sirf|pehle|baad|agar|kyun|kya)\b/;
const leftover =
  /\b(hai|hain|karo|nahi|aur|mein|hota|hoti|hote|ke liye|kya|toh|karta|karti|karte|hoga|wala|wali|sirf|agar|kyun|chahiye|phir|bhi|yeh|woh|iska|uska|apna|apni)\b/;

// Classify every line of a chapter: keep as is, map automatically, or translate.
function plan(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  let fenced = false;
  let front = 0;
  lines.forEach((line, i) => {
    if (line === '---' && front < 2) {
      front++;
      return out.push({ i, kind: 'keep' });
    }
    if (front === 1)
      return out.push(
        /^(title|summary):/.test(line) ? { i, kind: 'seg', text: line } : { i, kind: 'keep' },
      );
    if (line.startsWith('```')) {
      fenced = !fenced;
      return out.push({ i, kind: 'keep' });
    }
    if (fenced) {
      // Only comments that read as Hinglish need a translation; the code itself never changes.
      const comment = line.match(/(\/\/|#|\/\*|--)\s?(.*)$/);
      return out.push(
        comment && hinglish.test(comment[2]) ? { i, kind: 'seg', text: line } : { i, kind: 'keep' },
      );
    }
    if (!line.trim()) return out.push({ i, kind: 'keep' });
    if (AUTO.has(line.trim())) return out.push({ i, kind: 'auto', text: AUTO.get(line.trim()) });
    if (
      /^- \[[^\]]*\]\(https?:\/\/[^)]+\)$/.test(line) &&
      !hinglish.test(line.replace(/\(.*\)/, ''))
    )
      return out.push({ i, kind: 'keep' });
    const example = line.match(
      /^- \[Examples — jab code revise karna ho\]\(\.\.\/\.\.\/(examples\/.*)\)$/,
    );
    if (example)
      return out.push({
        i,
        kind: 'auto',
        // English chapters sit one folder deeper.
        text: `- [Examples — when you want to revise the code](../../../${example[1]})`,
      });
    return out.push({ i, kind: 'seg', text: line });
  });
  return { lines, out };
}

const [command, track, a, b] = process.argv.slice(2);
if (!['extract', 'weave'].includes(command) || !track) {
  console.error('usage: translate-chapters.mjs extract <track> [from] [to] | weave <track>');
  process.exit(1);
}
const directory = path.join(root, 'notes', track);
const files = readdirSync(directory)
  .filter((name) => /^\d.*\.md$/.test(name))
  .sort();

if (command === 'extract') {
  const from = Number(a || 1);
  const to = Number(b || files.length);
  mkdirSync(path.join(work, 'seg'), { recursive: true });
  mkdirSync(path.join(work, 'tr'), { recursive: true });
  let text = '';
  let total = 0;
  for (const name of files.slice(from - 1, to)) {
    text += `@@ ${name}\n`;
    let n = 0;
    for (const item of plan(path.join(directory, name)).out)
      if (item.kind === 'seg') text += `${++n}|${item.text}\n`;
    total += n;
  }
  const target = path.join(work, 'seg', `${track}-${from}-${to}.txt`);
  writeFileSync(target, text);
  console.log(`${path.relative(root, target)}: ${total} lines to translate`);
} else {
  const translated = {};
  let current = null;
  const parts = readdirSync(path.join(work, 'tr'))
    .filter((name) => name.startsWith(`${track}-`))
    .sort();
  for (const part of parts)
    for (const line of readFileSync(path.join(work, 'tr', part), 'utf8').split('\n')) {
      if (line.startsWith('@@ ')) {
        current = line.slice(3).trim();
        translated[current] = [];
        continue;
      }
      if (!line.trim() || !current) continue;
      const match = line.match(/^(\d+)\|(.*)$/);
      if (!match) throw new Error(`${part}: expected "N|text": ${line.slice(0, 60)}`);
      translated[current][Number(match[1]) - 1] = match[2];
    }
  mkdirSync(path.join(root, 'notes/en', track), { recursive: true });
  const spans = (text) => (text.match(/`[^`]*`/g) || []).length;
  const marker = (text) => text.match(/^(\s*(?:[-*>]|\d+\.|#{1,6})?\s*)/)[1];
  let done = 0;
  for (const name of files) {
    const lines = translated[name];
    if (!lines) continue;
    const chapter = plan(path.join(directory, name));
    const expected = chapter.out.filter((item) => item.kind === 'seg').length;
    if (lines.length !== expected || lines.includes(undefined))
      throw new Error(`${name}: expected ${expected} lines, got ${lines.filter(Boolean).length}`);
    let n = 0;
    const result = chapter.out.map((item) => {
      const original = chapter.lines[item.i];
      if (item.kind === 'keep') return original;
      if (item.kind === 'auto') return original.replace(original.trim(), item.text);
      const text = lines[n++];
      // Warnings only: a human decides whether the difference is intended.
      if (spans(original) !== spans(text))
        console.warn(`  ! ${name} #${n}: code spans ${spans(original)} → ${spans(text)}`);
      if (marker(original) !== marker(text)) console.warn(`  ! ${name} #${n}: list marker changed`);
      const prose = text.replace(/`[^`]*`/g, '').replace(/"[^"]*"|'[^']*'/g, '');
      if (leftover.test(prose)) console.warn(`  ? ${name} #${n}: looks untranslated: ${text.slice(0, 70)}`);
      return text;
    });
    writeFileSync(path.join(root, 'notes/en', track, name), result.join('\n'));
    done++;
  }
  console.log(`wrote ${done} English chapters for ${track}`);
}
