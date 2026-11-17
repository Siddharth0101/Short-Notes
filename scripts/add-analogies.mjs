// Inserts new analogies from .i18n-work/analogies/*.json into playground/src/data/analogies.js,
// each at the end of its subject's section. A JSON file is { "<Section name>": [entry, …] } with
// entries shaped like the ones in analogies.js. Chapters that already have an analogy are skipped.
//
//   node scripts/add-analogies.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const target = path.join(root, 'playground/src/data/analogies.js');
const work = path.join(root, '.i18n-work/analogies');
let source = readFileSync(target, 'utf8');
const existing = new Set([...source.matchAll(/^\s+id: '([^']+)'/gm)].map((match) => match[1]));
const quote = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const side = (value) =>
  `{\n      title: ${quote(value.title)},\n      text: ${quote(value.text)},\n      catch: ${quote(value.catch)},\n    }`;
let added = 0;
for (const file of readdirSync(work).filter((name) => name.endsWith('.json')).sort()) {
  const batch = JSON.parse(readFileSync(path.join(work, file), 'utf8'));
  for (const [section, entries] of Object.entries(batch)) {
    const header = `  // ——— ${section} ———\n`;
    const start = source.indexOf(header);
    if (start < 0) throw new Error(`${file}: no section "${section}"`);
    // The section ends where the next one starts, or at the end of the array.
    const next = source.indexOf('  // ——— ', start + header.length);
    const end = next < 0 ? source.indexOf('\n];\n') + 1 : next;
    const block = entries
      .filter((entry) => {
        for (const lang of ['hinglish', 'en'])
          for (const field of ['title', 'text', 'catch'])
            if (!entry[lang]?.[field]?.trim()) throw new Error(`${entry.id}: missing ${lang}.${field}`);
        return !existing.has(entry.id) && existing.add(entry.id);
      })
      .map((entry) => `  {\n    id: '${entry.id}',\n    hinglish: ${side(entry.hinglish)},\n    en: ${side(entry.en)},\n  },\n`)
      .join('');
    added += block ? block.split("\n    id: '").length - 1 : 0;
    source = source.slice(0, end) + block + source.slice(end);
  }
}
writeFileSync(target, source);
console.log(`added ${added} analogies; ${existing.size} chapters now have one`);
