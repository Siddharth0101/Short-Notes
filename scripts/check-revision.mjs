import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, TRACKS } from '../playground/src/lib/content.js';
import { interviewQuestions } from '../playground/src/data/interviewQuestions.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const owners = JSON.parse(await readFile(path.join(root, 'playground/src/data/sourceChapters.json'), 'utf8'));
const chapterIds = new Set();
const totals = {};
const topicKey = (line) => {
  const label = line.split(' — ')[0].replace(/^\s*(?:\*\s*)?-\s*/, '').toLowerCase();
  return label.replace(/[^a-z0-9]+/g, '') || label.replace(/[`\s]/g, '');
};
const chapterTopics = new Set();
const sourceTopics = new Map();
const aliases = JSON.parse(await readFile(path.join(root, 'scripts/revision-topic-aliases.json'), 'utf8'));
let pointCount = 0;
let recallCount = 0;
function checkPoints(lines, file, minimum = 5) {
  assert(lines.length >= minimum, `${file}: missing revision concepts`);
  for (const line of lines) {
    assert(line.includes(' — '), `${file}: use term — meaning`);
    assert(line.split(/\s+/).length <= 40, `${file}: explanation is too long: ${line}`);
  }
}
for (const track of TRACKS) {
  totals[track.id] = 0;
  const directory = path.join(root, 'notes', track.id);
  for (const name of await readdir(directory)) {
    if (!/^\d.*\.md$/.test(name)) continue;
    const note = parseFrontmatter(await readFile(path.join(directory, name), 'utf8'));
    assert(note.body.startsWith('## Quick revision\n'), `${name}: missing quick revision`);
    const points = note.body.split('\n## ')[0].split('\n').filter(line => line.startsWith('- '));
    checkPoints(points, name);
    const localTopics = points.map(topicKey);
    const labels = points.map((line) => line.slice(2).split(' — ')[0].replaceAll('`', '').trim());
    assert.equal(new Set(labels).size, labels.length, `${name}: repeated concept label; merge the points`);
    const recallSections = note.body.split(/^## /m).filter(section => section.startsWith('Recall aur practice\n'));
    assert.equal(recallSections.length, 1, `${name}: include one recall and practice section`);
    const recallPoints = recallSections[0].split('\n').filter(line => line.startsWith('- '));
    checkPoints(recallPoints, name, 3);
    assert.deepEqual(
      recallPoints.map(line => line.slice(2).split(' — ')[0]),
      ['Sawal', 'Jawaab', 'Khud try karo'],
      `${name}: include a recall question, answer and concrete practice checks`,
    );
    recallCount++;
    localTopics.forEach((topic) => chapterTopics.add(topic));
    pointCount += points.length;
    chapterIds.add(note.id);
    totals[track.id]++;
  }
}
async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(full));
    else if (/\.(js|jsx|java)$/.test(entry.name)) files.push(path.relative(root, full));
  }
  return files;
}
const found = [];
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isDirectory() && /^0\d_/.test(entry.name)) found.push(...await sourceFiles(path.join(root, entry.name)));
}
assert.deepEqual(found.sort(), Object.keys(owners).sort(), 'Every numbered source file needs an audited chapter mapping');
for (const file of found) {
  assert(chapterIds.has(owners[file]), `${file}: missing chapter`);
  const raw = await readFile(path.join(root, file), 'utf8');
  const intro = raw.match(/^\/\*\*\n \* ## Quick revision\n([\s\S]*?)\*\//)?.[1];
  assert(intro, `${file}: missing short source notes`);
  checkPoints(intro.split('\n').filter(line => line.startsWith(' * - ')), file);
  for (const line of intro.split('\n').filter(line => line.startsWith(' * - '))) {
    sourceTopics.set(topicKey(line), file);
  }
  for (const match of raw.matchAll(/\/\*\*?([\s\S]*?)\*\//g)) {
    if (match[1].includes('## Quick revision')) continue;
    assert(match[1].split(/\s+/).length <= 40, `${file}: leftover long comment block`);
  }
}
// Topic-presence audit complements format checks; aliases cover equivalent labels,
// not permission to omit the concept. Content accuracy still needs manual review.
for (const [topic, file] of sourceTopics) {
  let target = topic;
  const visited = new Set();
  while (!chapterTopics.has(target) && aliases[target]) {
    assert(!visited.has(target), `Circular revision alias: ${topic}`);
    visited.add(target);
    target = aliases[target];
  }
  assert(chapterTopics.has(target), `${file}: source topic "${topic}" missing from main revision notes`);
}
for (const topic of Object.keys(aliases)) {
  assert(sourceTopics.has(topic), `Stale revision alias: ${topic}`);
}
for (const question of interviewQuestions) {
  let fenced = false;
  for (const line of question.answer.split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    else if (!fenced && !line.startsWith('|'))
      assert(line.split(/\s+/).length <= 40, `${question.id}: long answer paragraph`);
  }
}
console.log('Chapter coverage:', totals);
console.log(`Verified ${chapterIds.size} chapters, ${found.length} source files and ${interviewQuestions.length} interview answers.`);
console.log(`Checked ${pointCount} revision bullets and ${sourceTopics.size} distinct source-topic labels (including reviewed aliases).`);
console.log(`Verified ${recallCount} chapter-specific recall questions, answers and practice exercises.`);
