import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const SITE_DESCRIPTION = 'Site-wide description';
const dom = new JSDOM(
  `<!doctype html><meta name="description" content="${SITE_DESCRIPTION}"><div id="root"></div>`,
  {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  },
);
for (const name of [
  'window',
  'document',
  'HTMLElement',
  'Event',
  'MouseEvent',
  'KeyboardEvent',
  'localStorage',
]) {
  globalThis[name] = dom.window[name];
}
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
const { MemoryRouter, Routes, Route } = await import('react-router-dom');
const { default: Reader } = await server.ssrLoadModule('/src/library/Reader.jsx');
const { default: Markdown } = await server.ssrLoadModule('/src/library/Markdown.jsx');
const { ProgressProvider } = await server.ssrLoadModule('/src/lib/progress.jsx');
// Chapter text loads on demand; fetch it once so the reader renders the chapter straight away.
const store = await server.ssrLoadModule('/src/data/store.js');
await store.preloadAll();
let root;
async function render(element) {
  if (root) await React.act(async () => root.unmount());
  root = createRoot(document.getElementById('root'));
  await React.act(async () => root.render(element));
}
async function openChapter() {
  await render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/notes/js-variables'] },
      React.createElement(
        ProgressProvider,
        null,
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: '/notes/:noteId',
            element: React.createElement(Reader),
          }),
        ),
      ),
    ),
  );
}
async function click(element) {
  assert(element, 'Expected an interactive element');
  await React.act(async () =>
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
  );
}
after(async () => {
  if (root) await React.act(async () => root.unmount());
  await server.close();
  dom.window.close();
});

const sample = `## Quick revision

- Binding — naam aur value ka connection.
- Jawaab — yeh ordinary note visible rehna chahiye.

## Recall aur practice

- Sawal — const binding aur object mein kya farq hai?
- Jawaab — binding reassign nahi hoti; object mutate ho sakta hai.
- Khud try karo — array push aur reassignment compare karo.

## Agla section

- Jawaab — yeh bhi ordinary note hai.
`;

test('Chapter recall hides only its answer and keeps questions, headings and regular notes readable', async () => {
  await render(React.createElement(Markdown, { recallAnswers: true }, sample));
  assert(document.getElementById('quick-revision'));
  assert(document.getElementById('recall-aur-practice'));
  assert.equal(document.querySelectorAll('.recall-answer').length, 1);
  const answer = document.querySelector('.recall-answer-content');
  const control = document.querySelector('.recall-answer button');
  assert.equal(answer.hidden, true);
  assert.equal(control.getAttribute('aria-expanded'), 'false');
  assert.equal(control.getAttribute('aria-controls'), answer.id);
  assert.match(document.querySelector('.markdown > ul').textContent, /ordinary note visible/);
  assert.equal(document.querySelector('.markdown > ul > li > strong').textContent, 'Binding');
  await click(control);
  assert.equal(answer.hidden, false);
  assert.equal(control.getAttribute('aria-expanded'), 'true');
  assert.match(answer.textContent, /object mutate ho sakta hai/);
  await click(control);
  assert.equal(answer.hidden, true);
});

test('Interviewer and example Markdown keep their existing visible answers unless opted in', async () => {
  await render(React.createElement(Markdown, null, sample));
  assert.equal(document.querySelectorAll('.recall-answer').length, 0);
  assert.match(document.querySelector('.markdown').textContent, /binding reassign nahi hoti/);
});

test('Reading controls leave completion untouched and Escape exits focus without resetting text size', async () => {
  localStorage.clear();
  await openChapter();
  const before = JSON.parse(localStorage.getItem('shortnotes.progress.v1'));
  assert(document.querySelector('[role="group"][aria-label="Reading controls"]'));
  const size = document.querySelector('[aria-label="Bada text — larger reading text"]');
  const focus = document.querySelector('[aria-label="Focus reading mode"]');
  await click(size);
  await click(focus);
  assert(document.querySelector('.reader--large-text.reader--focused'));
  assert.equal(size.getAttribute('aria-pressed'), 'true');
  assert.equal(focus.getAttribute('aria-pressed'), 'true');
  await React.act(async () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
  );
  assert.equal(document.querySelector('.reader--focused'), null);
  assert(document.querySelector('.reader--large-text'));
  assert.equal(focus.getAttribute('aria-pressed'), 'false');
  assert.deepEqual(JSON.parse(localStorage.getItem('shortnotes.progress.v1')), before);
  const recallLink = document.querySelector('.reader-tools a');
  await click(recallLink);
  assert.equal(document.activeElement.id, recallLink.hash.slice(1));
});

test('A chapter shows its own summary to search engines and gives the site description back after', async () => {
  const description = () =>
    document.querySelector('meta[name="description"]').getAttribute('content');
  localStorage.clear();
  await openChapter();
  // js-variables: "Variable — value ko diya hua naam."
  assert.match(description(), /^Variable — /);
  await click(document.querySelector('.chapter-navigation a:last-child'));
  assert.notEqual(description(), SITE_DESCRIPTION);
  assert.doesNotMatch(description(), /^Variable — /);
  await React.act(async () => root.unmount());
  root = null;
  assert.equal(description(), SITE_DESCRIPTION);
});

test('Revealed answers survive bookmarking and reset when moving to another chapter', async () => {
  localStorage.clear();
  await openChapter();
  await click(document.querySelector('.recall-answer button'));
  await click(document.querySelector('.reader-heading > button'));
  assert.equal(document.querySelector('.recall-answer-content').hidden, false);
  assert(JSON.parse(localStorage.getItem('shortnotes.progress.v1')).saved.includes('js-variables'));
  await click(document.querySelector('.chapter-navigation a:last-child'));
  assert.equal(document.querySelector('.recall-answer-content').hidden, true);
  assert.equal(
    document.querySelector('[aria-label="Focus reading mode"]').getAttribute('aria-pressed'),
    'false',
  );
  assert.equal(JSON.parse(localStorage.getItem('shortnotes.progress.v1')).completed.length, 0);
});

test('Practice questions hide answers until asked and persist the clear mark per question', async () => {
  localStorage.clear();
  await render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/notes/js-scope-closures'] },
      React.createElement(
        ProgressProvider,
        null,
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: '/notes/:noteId',
            element: React.createElement(Reader),
          }),
        ),
      ),
    ),
  );
  const cards = document.querySelectorAll('.practice-card');
  assert(cards.length >= 5);
  assert(document.getElementById('practice-questions'));
  assert([...cards].every((card) => card.querySelector('.practice-answer').hidden));
  const first = cards[0];
  const reveal = first.querySelector('.practice-actions button');
  assert.equal(reveal.getAttribute('aria-expanded'), 'false');
  await click(reveal);
  assert.equal(first.querySelector('.practice-answer').hidden, false);
  assert.equal(reveal.getAttribute('aria-expanded'), 'true');
  await click(first.querySelector('.practice-mark'));
  const stored = JSON.parse(localStorage.getItem('shortnotes.progress.v1'));
  assert.equal(stored.practiced.length, 1);
  assert.match(stored.practiced[0], /^js-scope-closures#/);
  assert.match(document.querySelector('.practice-score').textContent, /^1\//);
  const hard = [...document.querySelectorAll('.practice-filter button')].find(
    (item) => item.textContent === 'Hard',
  );
  await click(hard);
  assert(
    [...document.querySelectorAll('.practice-card')].every((card) => card.dataset.level === 'hard'),
  );
  assert.equal(stored.completed.length, 0);
});
