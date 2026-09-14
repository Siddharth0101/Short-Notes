import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const dom = new JSDOM('<!doctype html><div id="root"></div>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
for (const name of [
  'window',
  'document',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLSelectElement',
  'Event',
  'MouseEvent',
  'KeyboardEvent',
  'localStorage',
])
  globalThis[name] = dom.window[name];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};
const server = await createServer({
  configFile: false,
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', 'react-router-dom'] },
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});
const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { MemoryRouter } = await import('react-router-dom');
const { default: App } = await server.ssrLoadModule('/src/App.jsx');
const { notes, archive } = await server.ssrLoadModule('/src/data/catalog.js');
const { VISUAL_IDS } = await server.ssrLoadModule('/src/lib/visualIds.js');
const { interviewQuestions } = await server.ssrLoadModule('/src/data/interviewQuestions.js');
// Preload lazy pages so tests cover their resolved UI rather than Suspense fallbacks.
await Promise.all(
  ['Reader', 'VisualLab', 'Interviews', 'LegacyRoute'].map((name) =>
    server.ssrLoadModule(`/src/library/${name}.jsx`),
  ),
);
let root;
async function mount(route) {
  if (root) await React.act(async () => root.unmount());
  root = createRoot(document.getElementById('root'));
  await React.act(async () => {
    root.render(
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)),
    );
  });
  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}
const text = () => document.body.textContent;
const button = (label) =>
  [...document.querySelectorAll('button')].find(
    (element) =>
      element.textContent.trim() === label || element.getAttribute('aria-label') === label,
  );
async function click(element) {
  assert(element, 'Expected interactive element');
  await React.act(async () => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
}
async function select(element, value) {
  await React.act(async () => {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
after(async () => {
  if (root) await React.act(async () => root.unmount());
  await server.close();
  dom.window.close();
});

test('Dashboard displays actual chapter/reference/visual totals and subject navigation', async () => {
  localStorage.clear();
  await mount('/');
  assert.match(text(), /Har din thoda aur clear/);
  assert.equal(document.querySelectorAll('.track-card').length, 7);
  assert.equal(document.querySelectorAll('.stat strong')[0].textContent, `${notes.length}↗`);
  assert.equal(document.querySelectorAll('.stat strong')[1].textContent, String(archive.length));
  assert.equal(document.querySelectorAll('.stat strong')[2].textContent, String(VISUAL_IDS.length));
});

test('Library has one sequence, including old collection URLs and reference difficulty', async () => {
  await mount('/library?view=original&level=Reference');
  assert.equal(document.querySelectorAll('.note-row').length, notes.length);
  assert.doesNotMatch(text(), /Study chapters|Original notes/);
  assert.match(document.querySelector('.results-heading').textContent, /Course order/);
  await mount('/library?view=original&level=Advanced');
  assert.equal(
    document.querySelectorAll('.note-row').length,
    notes.filter((n) => n.level === 'Advanced').length,
  );
});

test('Every source has exactly one chapter owner and every chapter includes relevant practice', () => {
  assert.equal(notes.flatMap((n) => n.references).length, archive.length);
  for (const reference of archive) {
    const owner = notes.find((n) => n.id === reference.chapterId);
    assert(owner, reference.source);
    assert(owner.references.includes(reference));
  }
  for (const note of notes) {
    assert(note.questions.length > 0, note.id);
    for (const question of note.questions) {
      const expectedTracks =
        note.id === 'interview-java'
          ? ['java', 'spring-boot']
          : [note.track === 'interview' ? note.id.replace('interview-', '') : note.track];
      assert(expectedTracks.includes(question.track), `${note.id}: ${question.track}`);
      if (note.track !== 'interview' && question.noteId) assert.equal(question.noteId, note.id);
    }
  }
});

test('Source title searches find the owning chapter and source links open examples inline', async () => {
  const reference = archive.find((n) => n.source.endsWith('/This_Keyword.js'));
  await mount('/library?q=This_Keyword');
  assert(document.querySelector(`a[href="/notes/${reference.chapterId}"]`));
  await mount(`/notes/${reference.id}`);
  const example = document.getElementById(`source-${reference.id}`);
  assert(example?.open);
  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
  });
  assert(example.querySelector('.markdown'));
  assert(document.querySelector('.chapter-practice .question-card'));
  await click(button('Answer dekho'));
  assert(document.querySelector('.chapter-practice .question-answer'));
  assert(document.querySelector('.chapter-navigation'));
});

test('Old source bookmarks merge into a removable chapter bookmark without inflating completion', async () => {
  const reference = archive[0];
  localStorage.setItem(
    'shortnotes.progress.v1',
    JSON.stringify({
      saved: [reference.id, reference.chapterId],
      completed: [reference.id],
      recent: [reference.id],
      known: [],
    }),
  );
  await mount('/saved');
  assert.equal(document.querySelectorAll('.note-row').length, 1);
  const stored = JSON.parse(localStorage.getItem('shortnotes.progress.v1'));
  assert.deepEqual(stored.saved, [reference.chapterId]);
  assert.deepEqual(stored.recent, [reference.chapterId]);
  assert(!stored.completed.includes(reference.chapterId));
  await click(document.querySelector('.save-button'));
  assert.equal(document.querySelectorAll('.note-row').length, 0);
  localStorage.clear();
});

test('Deep-linked search and track filters show relevant content and empty states', async () => {
  await mount('/library?track=react&q=useEffect');
  assert(document.querySelectorAll('.note-row').length > 0);
  for (const row of document.querySelectorAll('.note-row'))
    assert.match(row.querySelector('.note-meta').textContent, /React/);
  await mount('/library?q=absolutely-no-such-concept-9999');
  assert.match(text(), /Koi note nahi mila/);
});

test('Library and paths share staged course order and keep lesson numbers stable in search', async () => {
  for (const route of ['/library?track=javascript', '/paths?track=javascript']) {
    await mount(route);
    assert.equal(document.querySelectorAll('.course-outline').length, 1);
    assert.equal(document.querySelectorAll('.course-stage').length, 5);
    assert.match(document.querySelector('.note-row h3').textContent, /Variables and assignment/);
    assert.equal(document.querySelectorAll('.stage-checkpoint').length, 5);
  }
  await mount('/library?track=javascript&q=closures');
  for (const row of document.querySelectorAll('.note-row')) {
    const id = row.querySelector('.note-row-body').getAttribute('href').split('/').at(-1);
    const note = notes.find((note) => note.id === id);
    if (!row.querySelector('.note-row-number.done'))
      assert.equal(Number(row.querySelector('.note-row-number').textContent), note.order);
  }
  await mount('/paths?track=react');
  assert(document.querySelector('.course-readiness a[href="/notes/js-async-event-loop"]'));
});

test('Readers follow the new syllabus across stage boundaries while retaining original IDs', async () => {
  await mount('/notes/js-arrays-objects');
  assert.match(document.querySelector('.reader-course-context').textContent, /Stage 1/);
  assert.match(document.querySelector('.reader-course-context').textContent, /Lesson 6/);
  assert(document.querySelector('.chapter-navigation a[href="/notes/js-modern-data-collections"]'));
  assert(document.querySelector('.stage-checkpoint'));
  await mount('/notes/js-language-foundations');
  assert.match(document.querySelector('.reader-course-context').textContent, /Stage 2/);
  assert.match(document.querySelector('.reader h1').textContent, /Foundations checkpoint/);
  await mount('/notes/java-jpa-transactions');
  assert(document.querySelector('.chapter-navigation a[href="/notes/spring-validation-errors"]'));
});

test('Reader saves bookmarks and completion across mounts, renders code and section anchors', async () => {
  const note = notes.find((item) => item.track === 'javascript');
  await mount(`/notes/${note.id}`);
  assert.match(text(), new RegExp(note.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert(document.querySelector('.markdown h2#mental-model'));
  assert(document.querySelector('.code-block pre'));
  await click(button('Note save karo'));
  await click(button('Complete mark karo'));
  const persisted = JSON.parse(localStorage.getItem('shortnotes.progress.v1'));
  assert(persisted.saved.includes(note.id));
  assert(persisted.completed.includes(note.id));
  await mount('/saved');
  assert.equal(document.querySelectorAll('.note-row').length, 1);
  await mount(`/notes/${note.id}`);
  assert(button('Saved'));
  assert(button('Completed'));
});

test('Interview questions reveal answers, mark confidence, and filter practiced items', async () => {
  await mount('/interview?track=java');
  const javaTotal = interviewQuestions.filter((item) => item.track === 'java').length;
  const initialLimit = Math.min(javaTotal, 12);
  assert.equal(document.querySelectorAll('.question-card').length, initialLimit);
  assert.equal(document.querySelectorAll('.question-answer').length, 0);
  await click(button('Answer dekho'));
  assert.equal(document.querySelectorAll('.question-answer').length, 1);
  await click(button('Yeh samajh aa gaya'));
  assert.equal(JSON.parse(localStorage.getItem('shortnotes.progress.v1')).known.length, 1);
  await click(document.querySelector('input[type="checkbox"]'));
  assert.equal(
    document.querySelectorAll('.question-card').length,
    Math.min(javaTotal - 1, initialLimit),
  );
});

test('Visual controls step, reset, seek, and exercise missing binary-search targets', async () => {
  await mount('/visuals?topic=binary-search');
  assert.match(document.querySelector('.step-explanation').textContent, /31 ko 42 se compare karo/);
  await click(button('Agla step'));
  assert.match(document.querySelector('.step-explanation').textContent, /56 ko 42 se compare karo/);
  await click(button('Reset visualization'));
  assert.match(document.querySelector('.step-explanation').textContent, /31 ko 42 se compare karo/);
  await select(document.querySelector('[aria-label="Binary search target"]'), '44');
  while (!button('Agla step').disabled) await click(button('Agla step'));
  assert.match(document.querySelector('.step-explanation').textContent, /Target present nahi hai/);
  await click(button('Play visualization'));
  assert(button('Pause visualization'));
  await click(button('Pause visualization'));
});

test('Every visual topic mounts successfully and can reach its final step', async () => {
  for (const topic of VISUAL_IDS) {
    await mount(`/visuals?topic=${topic}`);
    assert(document.querySelector('.simulation-canvas'), topic);
    let count = 0;
    while (!button('Agla step').disabled && count++ < 100) await click(button('Agla step'));
    assert(count < 100, `Trace did not finish: ${topic}`);
    assert.match(document.querySelector('.simulation-pill').textContent, /Complete/);
  }
});

test('Mock interview keeps a fixed filtered pool, resets answers, and produces a session review', async () => {
  await mount('/interview?track=react');
  await click(button('Start mock interview · 5 questions'));
  assert.match(text(), /Question 1 of 5/);
  assert.equal(document.querySelectorAll('.question-card').length, 1);
  assert.equal(document.querySelector('.question-answer'), null);
  const textarea = document.querySelector('textarea');
  await React.act(async () => {
    Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set.call(
      textarea,
      'My explanation of identity',
    );
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await click(button('Timer pause karo'));
  assert(button('Timer continue karo'));
  await click(button('Timer continue karo'));
  await click(button('Answer dekho'));
  assert(document.querySelector('.answer-reading').getAttribute('href').startsWith('/notes/'));
  await click(button('Clear hai · Agla'));
  assert.match(text(), /Question 2 of 5/);
  assert.equal(document.querySelector('textarea').value, '');
  assert.equal(document.querySelector('.question-answer'), null);
  for (let i = 0; i < 4; i++) await click(button('Revision chahiye · Agla'));
  assert.match(text(), /1 of 5 answers tumne clear mark kiye/);
  assert.match(text(), /My explanation of identity/);
  assert.equal(document.querySelectorAll('.mock-review').length, 5);
  await click(button('Questions par wapas'));
  assert.equal(document.querySelectorAll('.filter-chips .active')[0].textContent, 'React');
});

test('Mock deadline expires without discarding the current answer or forcing submission', async () => {
  await mount('/interview?track=java');
  await click(button('Start mock interview · 5 questions'));
  const now = Date.now;
  try {
    Date.now = () => now() + 16 * 60 * 1000;
    await React.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    assert.match(text(), /Time khatam/);
    assert.equal(document.querySelector('[role="timer"]').textContent, '0:00');
    assert(button('Answer dekho'));
    assert(button('Clear hai · Agla'));
  } finally {
    Date.now = now;
  }
  await click(button('Session khatam karo'));
});

test('Visual subject selection and chapter tabs expose new explanatory traces', async () => {
  await mount('/visuals');
  await select(document.querySelector('[aria-label="Visualization subject"]'), 'react');
  assert.equal(document.querySelectorAll('.visual-picker button').length, 3);
  await click(button('React keys and draft identity'));
  assert.match(document.querySelector('.simulator h2').textContent, /React keys/);
  await mount('/notes/java-sql-interview-lab?tab=visual');
  assert.match(document.querySelector('.simulator h2').textContent, /last-seat/);
});

test('Original folders and Java deep links continue to resolve', async () => {
  await mount('/domain/javascript/dir/03-async');
  assert(!text().includes('Directory Not Found'));
  assert(document.querySelectorAll('.scenario-card').length > 0);
  await mount(
    '/domain/backend/file/02-java-spring-boot/01-java-notes/02-core-java/core-java-basics',
  );
  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  assert(document.querySelector('.reader'));
  assert(!text().includes('Run Code'));
});

test('Every original playground link resolves to its exact preserved source file', async () => {
  const { getNodeBySplatPath } = await server.ssrLoadModule('/src/registry/index.js');
  for (const reference of archive.filter((item) => item.originalUrl)) {
    const match = reference.originalUrl.match(/^\/domain\/([^/]+)\/file\/(.*)$/);
    assert.equal(
      getNodeBySplatPath(match[1], match[2])?.source,
      reference.source,
      reference.originalUrl,
    );
  }
});

test('Appearance follows the OS only in System mode and persists explicit choices across pages', async () => {
  const originalMatchMedia = window.matchMedia;
  const previous = localStorage.getItem('shortnotes.theme');
  const listeners = new Set();
  let systemDark = true;
  window.matchMedia = () => ({
    matches: systemDark,
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  });
  async function changeSystem(matches) {
    systemDark = matches;
    await React.act(async () => {
      for (const listener of listeners) listener({ matches });
    });
  }
  try {
    localStorage.removeItem('shortnotes.theme');
    await mount('/');
    assert.equal(document.documentElement.dataset.theme, 'dark');
    assert.equal(document.querySelector('[aria-label="Appearance"]').value, 'system');
    await changeSystem(false);
    assert.equal(document.documentElement.dataset.theme, 'light');
    await select(document.querySelector('[aria-label="Appearance"]'), 'light');
    await changeSystem(true);
    assert.equal(document.documentElement.dataset.theme, 'light');
    await select(document.querySelector('[aria-label="Appearance"]'), 'dark');
    await mount('/notes/js-variables');
    assert.equal(document.documentElement.dataset.theme, 'dark');
    assert.equal(document.documentElement.style.colorScheme, 'dark');
    assert.equal(document.querySelector('[aria-label="Appearance"]').value, 'dark');
    await click(button('Switch to light mode'));
    assert.equal(localStorage.getItem('shortnotes.theme'), 'light');
    await React.act(async () =>
      window.dispatchEvent(
        new dom.window.StorageEvent('storage', { key: 'shortnotes.theme', newValue: 'dark' }),
      ),
    );
    assert.equal(document.documentElement.dataset.theme, 'dark');
  } finally {
    window.matchMedia = originalMatchMedia;
    if (previous === null) localStorage.removeItem('shortnotes.theme');
    else localStorage.setItem('shortnotes.theme', previous);
  }
});

test('Interview topic deep links, code answers, and mock rounds retain the requested subject', async () => {
  localStorage.clear();
  await mount('/interview?topic=html');
  assert.equal(document.querySelector('[aria-label="Interview topic"]').value, 'html');
  const htmlCount = interviewQuestions.filter(
    (item) => item.topic === 'html' || item.id === 'iq-lab-04',
  ).length;
  assert.match(
    document.querySelector('.results-heading').textContent,
    new RegExp(`${htmlCount} questions`),
  );
  await select(document.querySelector('[aria-label="Interview topic"]'), 'redux');
  assert(
    [...document.querySelectorAll('.question-card h2')].every((h) =>
      /Redux|reducer|store|connect/i.test(h.textContent),
    ),
  );
  assert.equal(document.querySelectorAll('.question-answer').length, 0);
  await click(
    [...document.querySelectorAll('.question-card')][1].querySelector('.question-actions button'),
  );
  assert(document.querySelector('.question-answer pre code'));
  assert.match(document.querySelector('.question-answer pre').textContent, /initialState/);
  await click(button('Start mock interview · 5 questions'));
  assert(document.querySelector('.mock-session'));
  assert.match(document.querySelector('.mock-session .question-card h2').textContent, /Redux/);
});

test('An output puzzle shows code before revealing its answer and retains the chapter reading link', async () => {
  await mount('/notes/js-async-event-loop');
  const heading = [...document.querySelectorAll('.question-card h2')].find((h) =>
    h.textContent.includes('await setTimeout'),
  );
  assert(heading);
  const card = heading.closest('.question-card');
  assert.match(card.querySelector('pre').textContent, /await setTimeout/);
  assert(!card.querySelector('.question-answer'));
  await click(card.querySelector('.question-actions button'));
  assert.match(card.querySelector('.question-answer pre').textContent, /new Promise/);
  assert.equal(
    card.querySelector('.answer-reading[href^="/notes/"]').getAttribute('href'),
    '/notes/js-async-event-loop',
  );
});

test('Java and Spring Boot expose independent courses with stable reader links', async () => {
  for (const track of ['java', 'spring-boot']) {
    await mount(`/library?track=${track}`);
    const courseNotes = notes.filter((note) => note.track === track);
    for (const note of courseNotes) {
      assert(document.querySelector(`a[href="/notes/${note.id}"]`), note.id);
    }
    const otherTrack = track === 'java' ? 'spring-boot' : 'java';
    for (const note of notes.filter((note) => note.track === otherTrack)) {
      assert(!document.querySelector(`.note-row a[href="/notes/${note.id}"]`), note.id);
    }
  }
  await mount('/paths?track=spring-boot');
  assert(document.querySelector('.course-readiness a[href="/notes/java-maven-testing"]'));
  await mount('/notes/java-jpa-transactions');
  assert(document.querySelector('.reader-course-context a[href="/paths?track=spring-boot"]'));
  assert.match(document.querySelector('.reader-course-context').textContent, /Lesson 6 of 10/);
  await mount('/interview?track=spring-boot');
  assert(document.querySelector('.question-card'));
});
