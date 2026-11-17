// Chapter text and interview answers are fetched on demand. These tests start with nothing
// fetched and check what each screen asks for, what it shows meanwhile, and how it recovers.
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
  'FormData',
  'MouseEvent',
  'KeyboardEvent',
  'localStorage',
])
  globalThis[name] = dom.window[name];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};
// The reader fetches interview answers when their section nears the viewport. jsdom has no
// layout, so the test decides when that happens.
const observers = new Set();
globalThis.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    observers.add(this);
  }
  disconnect() {
    observers.delete(this);
  }
};

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
const { notes: light, questionTotal } = await server.ssrLoadModule('/src/data/catalog.js');
const store = await server.ssrLoadModule('/src/data/store.js');
// Page components are lazy too; load them now so only the content is still to come.
await Promise.all([
  ...['Reader', 'Library', 'Interviews'].map((name) =>
    server.ssrLoadModule(`/src/library/${name}.jsx`),
  ),
  ...['PlayHub', 'Flashcards'].map((name) => server.ssrLoadModule(`/src/play/${name}.jsx`)),
]);

let root;
async function mount(route) {
  if (root) await React.act(async () => root.unmount());
  root = createRoot(document.getElementById('root'));
  await React.act(async () => {
    root.render(
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)),
    );
  });
}
const settle = (ms = 20) =>
  React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
async function until(check, label) {
  for (let waited = 0; waited < 8000; waited += 20) {
    if (check()) return;
    await settle();
  }
  assert.fail(`Timed out waiting for ${label}`);
}
async function click(element) {
  assert(element, 'Expected an interactive element');
  await React.act(async () =>
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
  );
}
const scrollNearQuestions = () =>
  React.act(async () =>
    [...observers].forEach((observer) => observer.callback([{ isIntersecting: true }])),
  );
// Start a test with nothing fetched. `hold()` keeps every download waiting until released.
function fresh(before) {
  localStorage.clear();
  store.resetContent({ before });
}
function hold() {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  fresh(() => gate);
  return release;
}
// jsdom has no layout; record which element a section link scrolls to.
const scrolledTo = [];
dom.window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {
  scrolledTo.push(this.id);
};
const status = () => document.querySelector('.content-status');
const body = (id) => store.getCatalog('hinglish').noteById[id].body;

after(async () => {
  if (root) await React.act(async () => root.unmount());
  await server.close();
  dom.window.close();
});

test('The first download lists every chapter without its text or any answers', () => {
  fresh();
  assert.equal(light.length, 118);
  for (const note of light) {
    assert(note.title && note.summary && note.source, note.id);
    assert.equal(typeof note.practiceCount, 'number', note.id);
    assert.equal(typeof note.questionCount, 'number', note.id);
    assert.equal(note.body, undefined, `${note.id}: chapter text must not be in the catalog`);
    assert.equal(note.questions, undefined, `${note.id}: answers must not be in the catalog`);
  }
  const catalog = store.getCatalog('hinglish');
  assert(catalog.notes.every((note) => note.body === undefined));
  assert.equal(catalog.questions.length, 0);
  assert.equal(catalog.questionTotal, questionTotal);
  assert.equal(store.isReady('hinglish', { chapters: 'js-variables' }), false);
  assert.equal(store.isReady('hinglish', { questions: true }), false);
  assert.equal(store.isReady('hinglish'), true, 'the chapter list itself needs no download');
});

test('Opening a chapter shows its title at once, then its text, and fetches no other subject', async () => {
  const release = hold();
  await mount('/notes/js-variables');
  assert.equal(
    document.querySelector('.reader h1').textContent,
    'Variables and assignment with let and const',
  );
  assert.match(status().textContent, /Chapter load ho raha hai/);
  assert.equal(status().getAttribute('role'), 'status');
  assert.equal(document.querySelector('.reader-article'), null);
  release();
  await until(() => document.querySelector('.reader-article'), 'the chapter text');
  assert.match(document.querySelector('.reader-article').textContent, /value ko diya hua naam/);
  assert.equal(store.isReady('hinglish', { chapters: 'js-variables' }), true);
  assert.equal(body('react-jsx-props'), undefined, 'another subject must not be fetched');
  assert.equal(store.isReady('hinglish', { chapters: 'all' }), false);
});

test('A link to a section still lands on it, and focus is kept, when the text arrives late', async () => {
  const release = hold();
  scrolledTo.length = 0;
  await mount('/notes/js-variables#recall-aur-practice');
  assert.equal(document.getElementById('recall-aur-practice'), null);
  assert.equal(document.activeElement.tagName, 'H1', 'the route focuses the heading');
  release();
  await until(() => document.querySelector('.reader-article'), 'the chapter text');
  await settle();
  assert.equal(scrolledTo.at(-1), 'recall-aur-practice');
  assert.equal(document.activeElement, document.querySelector('.reader h1'));
  // A chapter that is already in memory is not scrolled a second time by the reader.
  scrolledTo.length = 0;
  await mount('/notes/js-variables#recall-aur-practice');
  await settle();
  assert.deepEqual(scrolledTo, ['recall-aur-practice']);
});

test('Interview answers of a chapter wait until the reader gets near them', async () => {
  fresh();
  await mount('/notes/js-variables');
  await until(() => document.querySelector('.reader-article'), 'the chapter text');
  const practice = () => document.querySelector('.chapter-practice');
  assert(practice(), 'the section and its heading are there from the start');
  assert.match(practice().querySelector('.content-status').textContent, /Interview questions load/);
  assert.equal(store.isReady('hinglish', { questions: true }), false);
  await scrollNearQuestions();
  await until(() => practice().querySelector('.question-card'), 'the interview questions');
  const expected = light.find((note) => note.id === 'js-variables').questionCount;
  assert.equal(practice().querySelectorAll('.question-card').length, expected);
  assert.equal(practice().querySelector('.content-status'), null);
});

test('A download that fails offers a retry, and the retry recovers', async () => {
  let offline = true;
  fresh(() => (offline ? Promise.reject(new Error('offline')) : undefined));
  await mount('/notes/js-loops');
  await until(() => document.querySelector('.content-status--failed'), 'the failure message');
  const failure = document.querySelector('.content-status--failed');
  assert.equal(failure.getAttribute('role'), 'alert');
  assert.match(failure.textContent, /load nahi ho paya/);
  assert.equal(
    document.querySelector('.reader h1').textContent,
    'Loops counters and accumulators',
    'the reader still knows which chapter this is',
  );
  offline = false;
  await click(failure.querySelector('button'));
  await until(() => document.querySelector('.reader-article'), 'the chapter text after a retry');
  assert.equal(document.querySelector('.content-status--failed'), null);
});

test('Search matches titles at once and chapter text once it has arrived', async () => {
  const release = hold();
  // "redeclaration" appears in the text of one chapter and in no title, summary, tag or answer.
  await mount('/library?q=redeclaration');
  const results = () => document.querySelector('.results-heading [role="status"]').textContent;
  assert.match(results(), /^0 results/);
  assert.match(results(), /poora text abhi load ho raha hai/);
  release();
  await until(
    () => store.isReady('hinglish', { chapters: 'all', questions: true }),
    'every chapter and the question bank',
  );
  await settle();
  assert.match(results(), /^1 results/);
  assert.doesNotMatch(results(), /load ho raha hai/);
  assert(document.querySelector('a[href="/notes/js-variables"]'));
  // Without a query the library asks for nothing.
  fresh();
  await mount('/library');
  await settle(60);
  assert.equal(store.isReady('hinglish', { chapters: 'js-variables' }), false);
  assert.match(results(), /^118 results/);
});

test('A game opened for one chapter fetches that chapter only', async () => {
  const release = hold();
  await mount('/play/flashcards?chapter=js-loops');
  assert.match(status().textContent, /Cards load ho rahe hain/);
  assert.equal(document.querySelector('.flashcard-stage'), null);
  release();
  await until(() => document.querySelector('.flashcard-stage'), 'the flashcards');
  assert.equal(store.isReady('hinglish', { chapters: 'js-loops' }), true);
  assert.equal(body('react-jsx-props'), undefined);
  assert.equal(store.isReady('hinglish', { chapters: 'track:react' }), false);
});

test('The interview page waits for the question bank and then lists it', async () => {
  const release = hold();
  await mount('/interview');
  assert.match(status().textContent, /Interview questions load ho rahe hain/);
  assert.equal(document.querySelector('.question-card'), null);
  release();
  await until(() => document.querySelector('.question-card'), 'the question bank');
  assert.equal(document.querySelectorAll('.question-card').length, 12);
  assert.equal(body('js-variables'), undefined, 'the bank needs no chapter text');
});

test('English fetches the titles, then both texts of the chapter being read', async () => {
  fresh();
  localStorage.setItem('shortnotes.lang', 'en');
  await mount('/notes/js-variables');
  await until(() => document.querySelector('.reader-article'), 'the English chapter');
  assert.match(document.querySelector('.reader-article').textContent, /a name given to a value/);
  // Anchors stay canonical, which needs the Hinglish text of the same chapter.
  assert(document.querySelector('.markdown h2#recall-aur-practice'));
  assert.equal(store.isReady('en', { chapters: 'js-variables' }), true);
  assert.equal(body('js-variables') === undefined, false);
  assert.equal(store.getCatalog('en').noteById['react-jsx-props'].body, undefined);
  assert.equal(store.getCatalog('en').noteById['react-jsx-props'].title.length > 0, true);
  assert.equal(store.isReady('en', { chapters: 'all' }), false);
  localStorage.clear();
});
