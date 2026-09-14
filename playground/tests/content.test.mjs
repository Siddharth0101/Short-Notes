import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseFrontmatter,
  filterNotes,
  extractHeadings,
  legacyToMarkdown,
  normalizeProgress,
  TRACKS,
} from '../src/lib/content.js';
import { binarySearchTrace, bubbleSortTrace, bfsTrace, fibonacciTrace } from '../src/lib/traces.js';
import { VISUAL_IDS } from '../src/lib/visualIds.js';
import { VISUALS } from '../src/data/visuals.js';
import { interviewQuestions } from '../src/data/interviewQuestions.js';
import { monotonicStackTrace } from '../src/data/advancedVisuals.js';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const directories = await readdir(path.join(repo, 'notes'), { withFileTypes: true });
const files = (
  await Promise.all(
    directories
      .filter((entry) => entry.isDirectory())
      .map(async (entry) =>
        (await readdir(path.join(repo, 'notes', entry.name)))
          .filter((file) => file.endsWith('.md') && file !== 'README.md')
          .map((file) => path.join(repo, 'notes', entry.name, file)),
      ),
  )
).flat();
const chapters = await Promise.all(
  files.map(async (file) => ({ file, raw: await readFile(file, 'utf8') })),
);
const curriculum = JSON.parse(await readFile(path.join(repo, 'notes/curriculum.json'), 'utf8'));

test('Every study chapter has valid metadata, unique identity, readable content, sources, and a working visual mapping', () => {
  const ids = new Set();
  const orderKeys = new Set();
  for (const { file, raw } of chapters) {
    const note = parseFrontmatter(raw);
    assert.match(note.id, /^[a-z][a-z0-9-]+$/, file);
    assert(!ids.has(note.id), `Duplicate id ${note.id}`);
    ids.add(note.id);
    assert(
      TRACKS.some((track) => track.id === note.track),
      `${file}: track`,
    );
    assert(['Foundation', 'Intermediate', 'Advanced'].includes(note.level), `${file}: level`);
    assert(note.title && note.summary && note.tags.length > 0, `${file}: metadata`);
    assert(Number.isInteger(note.order) && note.order > 0, `${file}: order`);
    const orderKey = `${note.track}:${note.order}`;
    assert(!orderKeys.has(orderKey), `Duplicate track order ${orderKey}`);
    orderKeys.add(orderKey);
    assert(note.minutes > 0 && note.minutes < 120, `${file}: read time`);
    assert.match(note.body, /^## Mental model\b/, file);
    assert(note.body.split(/\s+/).length >= 250, `${file}: insufficient content`);
    assert.equal((note.body.match(/^```/gm) || []).length % 2, 0, `${file}: unclosed code fence`);
    assert.match(note.body, /https:\/\//, `${file}: missing source`);
    assert.match(note.body, /## .*Practice/, `${file}: missing practice`);
    if (note.visual)
      assert(VISUAL_IDS.includes(note.visual), `${file}: unknown visual ${note.visual}`);
    const headings = extractHeadings(note.body);
    assert.equal(
      new Set(headings.map((heading) => heading.id)).size,
      headings.length,
      `${file}: duplicate section anchors`,
    );
  }
  for (const track of TRACKS)
    assert(
      chapters.some(({ raw }) => parseFrontmatter(raw).track === track.id),
      `Empty track ${track.id}`,
    );
});

test('Local Markdown links in the study collection resolve', async () => {
  for (const { file, raw } of [
    ...chapters,
    ...(await Promise.all(
      ['notes/README.md', ...TRACKS.map((track) => `notes/${track.id}/README.md`)].map(
        async (relative) => ({
          file: path.join(repo, relative),
          raw: await readFile(path.join(repo, relative), 'utf8'),
        }),
      ),
    )),
    {
      file: path.join(repo, 'notes/COURSE_COVERAGE.md'),
      raw: await readFile(path.join(repo, 'notes/COURSE_COVERAGE.md'), 'utf8'),
    },
  ]) {
    for (const match of raw.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (/^(https?:|#|mailto:)/.test(href)) continue;
      assert(
        (await stat(path.resolve(path.dirname(file), href.split('#')[0]))).isFile(),
        `${file}: ${href}`,
      );
    }
  }
});

test('Course prerequisites and lesson order form a complete acyclic learning sequence', () => {
  const byId = new Map(
    chapters.map(({ raw }) => {
      const note = parseFrontmatter(raw);
      return [note.id, note];
    }),
  );
  const dependencies = new Map();
  const assigned = [];
  for (const [track, course] of Object.entries(curriculum)) {
    const ids = course.stages.flatMap((stage) => stage.chapters);
    assert(
      course.stages.every((stage) => stage.goal && stage.checkpoint && stage.chapters.length),
      track,
    );
    ids.forEach((id, i) => {
      assert.equal(byId.get(id)?.track, track);
      assert.equal(byId.get(id)?.order, i + 1);
      assigned.push(id);
      dependencies.set(id, i ? [ids[i - 1]] : course.prerequisites);
    });
  }
  assert.equal(new Set(assigned).size, chapters.length);
  assert.equal(assigned.length, chapters.length);
  const complete = new Set();
  const visiting = new Set();
  function visit(id) {
    assert(byId.has(id), `Missing prerequisite ${id}`);
    assert(!visiting.has(id), `Prerequisite cycle at ${id}`);
    if (complete.has(id)) return;
    visiting.add(id);
    for (const dependency of dependencies.get(id)) visit(dependency);
    visiting.delete(id);
    complete.add(id);
  }
  assigned.forEach(visit);
  assert.deepEqual(curriculum.javascript.stages[0].chapters, [
    'js-variables',
    'js-types-operators',
    'js-conditionals',
    'js-loops',
    'js-functions',
    'js-arrays-objects',
  ]);
  for (const [before, after] of [
    ['javascript-browser-foundations', 'js-dom-events-browser'],
    ['dsa-hashing', 'dsa-patterns'],
    ['dsa-heaps', 'dsa-graphs'],
    ['java-classes-constructors', 'java-object-model'],
    ['react-jsx-props', 'react-state-forms'],
    ['react-state-forms', 'react-components-rendering'],
  ])
    assert(byId.get(before).order < byId.get(after).order, `${before} must precede ${after}`);
});

test('Full-text search combines words and applies track/difficulty filters', () => {
  const sample = [
    {
      title: 'Event loop',
      summary: 'Understand promises',
      body: 'microtask checkpoint',
      tags: ['runtime'],
      track: 'javascript',
      level: 'Advanced',
    },
    { title: 'React', body: 'render', tags: [], track: 'react', level: 'Foundation' },
  ];
  assert.equal(
    filterNotes(sample, { query: 'PROMISES checkpoint', track: 'javascript', level: 'Advanced' })
      .length,
    1,
  );
  assert.equal(filterNotes(sample, { query: 'checkpoint', track: 'react' }).length, 0);
  assert.equal(filterNotes(sample, { query: '  ' }).length, 2);
});

test('Original source conversion preserves Java code and strips only comment formatting', () => {
  const markdown = legacyToMarkdown('/**\n * ## Types\n * A value.\n */\nint n = 3;', 'java');
  assert(markdown.includes('## Types'));
  assert(markdown.includes('```java\nint n = 3;\n```'));
  assert.deepEqual(extractHeadings('## Actual\n```text\n## Not a heading\n```'), [
    { title: 'Actual', id: 'actual' },
  ]);
});

test('Malformed persisted progress is normalized without losing valid unique entries', () => {
  assert.deepEqual(normalizeProgress(null), { saved: [], completed: [], known: [], recent: [] });
  assert.deepEqual(
    normalizeProgress({ saved: ['a', 'a', 2], completed: {}, known: ['q'], recent: ['a'] }),
    { saved: ['a'], completed: [], known: ['q'], recent: ['a'] },
  );
  assert.equal(
    normalizeProgress({ recent: Array.from({ length: 15 }, (_, i) => String(i)) }).recent.length,
    8,
  );
});

test('Binary search finds boundaries, handles duplicates and empty/missing targets', () => {
  for (const values of [[], [2], [1, 2, 2, 5], [3, 8, 15, 23, 31, 42, 56, 71, 89]]) {
    for (const target of [-1, 1, 2, 3, 5, 42, 44, 89, 100]) {
      const frames = binarySearchTrace(values, target);
      assert.equal(frames.at(-1).found, values.includes(target), `${values}: ${target}`);
      assert(frames.length <= Math.ceil(Math.log2(values.length + 1)) + 1);
    }
  }
});

test('Sorting frames contain real snapshots and never mutate the input', () => {
  for (const input of [[], [1], [5, 2, 2, 1], [1, 2, 3], [5, 4, 3, 2, 1]]) {
    const original = [...input];
    const frames = bubbleSortTrace(input);
    assert.deepEqual(
      frames.at(-1).result,
      [...input].sort((a, b) => a - b),
    );
    assert.deepEqual(input, original);
    for (const frame of frames)
      assert.deepEqual(
        frame.bars.map((bar) => bar.value).sort((a, b) => a - b),
        [...input].sort((a, b) => a - b),
      );
  }
});

test('BFS handles cycles and only visits reachable vertices once', () => {
  const frames = bfsTrace({ A: ['B', 'C'], B: ['A', 'C'], C: ['A'], D: [] });
  assert.deepEqual(frames.at(-1).order, ['A', 'B', 'C']);
  assert.equal(new Set(frames.at(-1).order).size, 3);
  assert.deepEqual(frames.at(-1).queue, []);
});

test('Dynamic programming traces return correct base cases and recurrence results', () => {
  for (const [n, expected] of [
    [0, 0],
    [1, 1],
    [2, 1],
    [6, 8],
    [8, 21],
  ])
    assert.equal(fibonacciTrace(n).at(-1).result, expected);
});

test('Interview bank and visual catalog remain complete and internally consistent', () => {
  assert.equal(new Set(interviewQuestions.map((item) => item.id)).size, interviewQuestions.length);
  assert.equal(
    new Set(interviewQuestions.map((item) => item.question)).size,
    interviewQuestions.length,
  );
  for (const track of TRACKS.filter((item) => item.id !== 'interview'))
    assert(interviewQuestions.filter((item) => item.track === track.id).length >= 12);
  for (const item of interviewQuestions) {
    assert(item.answer.length > 70 && item.followUp.length > 20 && item.tags.length > 0, item.id);
    assert(['Foundation', 'Intermediate', 'Advanced'].includes(item.level), item.id);
    if (item.noteId)
      assert(
        chapters.some(({ raw }) => parseFrontmatter(raw).id === item.noteId),
        `${item.id}: broken reading link`,
      );
  }
  assert.deepEqual(VISUALS.map((visual) => visual.id).sort(), [...VISUAL_IDS].sort());
});

test('Monotonic stack trace matches a brute-force oracle across duplicate and boundary cases', () => {
  const cases = [[], [30], [30, 30], [40, 30, 20], [20, 30, 40], [73, 74, 75, 71, 69, 72, 76, 73]];
  // Enumerate short arrays so all equality and ordering combinations are exercised.
  for (let code = 0; code < 243; code++) {
    let value = code;
    cases.push(
      Array.from({ length: 5 }, () => {
        const digit = value % 3;
        value = Math.floor(value / 3);
        return digit;
      }),
    );
  }
  for (const values of cases) {
    const original = [...values];
    const expected = values.map((temperature, i) => {
      for (let j = i + 1; j < values.length; j++) if (values[j] > temperature) return j - i;
      return 0;
    });
    const frames = monotonicStackTrace(values);
    assert.deepEqual(frames.at(-1).result, expected);
    assert.deepEqual(values, original);
    assert(frames.length <= 2 * values.length + 2);
  }
});

test('Researched notes cover every course and link to actual chapter sections and primary sources', async () => {
  const research = JSON.parse(
    await readFile(path.join(repo, 'notes/research-sources.json'), 'utf8'),
  );
  const sourceMap = await readFile(path.join(repo, 'notes/RESEARCH_SOURCES.md'), 'utf8');
  const covered = new Set();
  const sectionKeys = new Set();
  for (const entry of research) {
    const chapter = chapters.find(({ raw }) => parseFrontmatter(raw).id === entry.chapter);
    assert(chapter, entry.chapter);
    const note = parseFrontmatter(chapter.raw);
    assert.equal(path.relative(repo, chapter.file), entry.file);
    assert(
      extractHeadings(note.body).some(({ id }) => id === entry.anchor),
      entry.anchor,
    );
    assert(note.body.includes(`](${entry.url})`), entry.url);
    assert.equal(new URL(entry.url).protocol, 'https:');
    assert(entry.publisher && /^\d{4}-\d{2}-\d{2}$/.test(entry.reviewed));
    assert(sourceMap.includes(`${entry.file.replace('notes/', '')}#${entry.anchor}`));
    assert(!sectionKeys.has(`${entry.chapter}:${entry.anchor}`));
    sectionKeys.add(`${entry.chapter}:${entry.anchor}`);
    covered.add(note.track);
  }
  assert.deepEqual([...covered].sort(), TRACKS.map(({ id }) => id).sort());
});
