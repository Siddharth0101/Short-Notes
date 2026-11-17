// Offline support: the service worker's caching rules (run here against an in-memory cache and
// a fake network), and the page's save-for-offline panel and update prompt.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

// ---------------------------------------------------------------------------------------------
// The service worker, in a sandbox.

const ORIGIN = 'https://shortnotes.test';
const template = readFileSync(new URL('../offline/sw.js', import.meta.url), 'utf8');
assert(template.includes('const PAGE_TIMEOUT = 4000;'), 'the page timeout this test shortens');
const BUILD = {
  version: 'v2',
  shell: ['/index.html', '/assets/index-a.js', '/assets/Reader-b.js', '/favicon.svg'],
  assets: [
    '/assets/index-a.js',
    '/assets/Reader-b.js',
    '/assets/notes-javascript-c.js',
    '/assets/notes-react-d.js',
    '/assets/interviewQuestions-e.js',
    '/assets/notes-en-javascript-f.js',
    '/assets/notes-en-react-g.js',
    '/assets/questions.en-h.js',
    '/assets/LegacyRoute-i.js',
  ],
  content: {
    hinglish: [
      '/assets/interviewQuestions-e.js',
      '/assets/notes-javascript-c.js',
      '/assets/notes-react-d.js',
    ],
    en: [
      '/assets/notes-en-javascript-f.js',
      '/assets/notes-en-react-g.js',
      '/assets/questions.en-h.js',
    ],
  },
  sizes: {
    '/assets/interviewQuestions-e.js': 130000,
    '/assets/notes-javascript-c.js': 46000,
    '/assets/notes-react-d.js': 31000,
    '/assets/notes-en-javascript-f.js': 47000,
    '/assets/notes-en-react-g.js': 32000,
    '/assets/questions.en-h.js': 126000,
  },
};
const toUrl = (input) => new URL(typeof input === 'string' ? input : input.url, ORIGIN).href;
const pathOf = (input) => new URL(toUrl(input)).pathname;
// Requests in a worker resolve relative URLs against its own location; Node's need absolute ones.
class WorkerRequest extends Request {
  constructor(input, init) {
    super(typeof input === 'string' ? toUrl(input) : input, init);
  }
}

function worker({ active = false } = {}) {
  const net = { offline: false, delay: 0, files: {}, requests: [] };
  for (const url of [...BUILD.shell, ...BUILD.assets]) net.files[url] = `body of ${url}`;
  net.files['/assets/old-z.js'] = 'old';
  net.files['/sample.pdf'] = 'pdf';
  const store = new Map();
  const open = (name) => {
    if (!store.has(name)) store.set(name, new Map());
    const entries = store.get(name);
    return {
      async addAll(requests) {
        for (const request of requests) {
          const response = await fake.fetch(request);
          if (!response.ok) throw new TypeError(`addAll: ${response.status}`);
          entries.set(toUrl(request), response);
        }
      },
      async put(request, response) {
        entries.set(toUrl(request), response);
      },
      async keys() {
        return [...entries.keys()].map((url) => new Request(url));
      },
      async delete(request) {
        return entries.delete(toUrl(request));
      },
    };
  };
  const listeners = {};
  const fake = {
    net,
    store,
    skipped: 0,
    claimed: 0,
    async fetch(input) {
      const url = pathOf(input);
      net.requests.push(url);
      if (net.delay) await new Promise((resolve) => setTimeout(resolve, net.delay));
      if (net.offline) throw new TypeError('Failed to fetch');
      return url in net.files
        ? new Response(net.files[url], { status: 200 })
        : new Response('missing', { status: 404 });
    },
    cached: (name) => [...(store.get(name)?.keys() || [])].map((url) => new URL(url).pathname),
    async dispatch(type, extra = {}) {
      let work;
      const event = { ...extra, waitUntil: (promise) => (work = promise) };
      listeners[type](event);
      await work;
      return event;
    },
    // A fetch event: the response the worker gives, or null when it lets the browser handle it.
    async request(url, { mode = 'no-cors', method = 'GET' } = {}) {
      let response = null;
      listeners.fetch({
        request: { url: toUrl(url), mode, method },
        respondWith: (promise) => (response = promise),
      });
      return response && (await response);
    },
    async message(data) {
      const replies = [];
      // Messages are copied between the worker and the page, as structured cloning does.
      const port = { postMessage: (reply) => replies.push(JSON.parse(JSON.stringify(reply))) };
      await fake.dispatch('message', { data, ports: [port] });
      return replies;
    },
  };
  const self = {
    location: new URL(`${ORIGIN}/sw.js`),
    registration: { active: active ? {} : null },
    addEventListener: (type, listener) => (listeners[type] = listener),
    skipWaiting: async () => fake.skipped++,
    clients: { claim: async () => fake.claimed++ },
  };
  const caches = {
    open: async (name) => open(name),
    keys: async () => [...store.keys()],
    delete: async (name) => store.delete(name),
    async match(input) {
      for (const entries of store.values()) {
        const hit = entries.get(toUrl(input));
        if (hit) return hit.clone();
      }
      return undefined;
    },
  };
  const source = `const OFFLINE = ${JSON.stringify(BUILD)};\n${template.replace(
    'const PAGE_TIMEOUT = 4000;',
    'const PAGE_TIMEOUT = 40;',
  )}`;
  vm.runInContext(
    source,
    vm.createContext({
      self,
      caches,
      fetch: fake.fetch,
      Request: WorkerRequest,
      Response,
      URL,
      Promise,
      setTimeout,
    }),
  );
  return fake;
}

test('Installing caches the whole app shell; only the first install takes over at once', async () => {
  const first = worker();
  await first.dispatch('install');
  assert.deepEqual(first.cached('shell-v2').sort(), [...BUILD.shell].sort());
  assert.equal(first.skipped, 1, 'nothing to disturb on a first install');
  assert(!first.net.requests.some((url) => url.includes('notes-')), 'no chapter text on install');
  const update = worker({ active: true });
  await update.dispatch('install');
  assert.equal(update.skipped, 0, 'an update waits for the reader');
});

test('Activating drops older shells and saved files that are not part of this build', async () => {
  const sw = worker();
  sw.store.set('shell-v1', new Map([[toUrl('/index.html'), new Response('old')]]));
  sw.store.set(
    'content',
    new Map([
      [toUrl('/assets/notes-javascript-c.js'), new Response('kept')],
      [toUrl('/assets/notes-javascript-OLD.js'), new Response('stale')],
    ]),
  );
  await sw.dispatch('install');
  await sw.dispatch('activate');
  assert.deepEqual([...sw.store.keys()].sort(), ['content', 'shell-v2']);
  assert.deepEqual(sw.cached('content'), ['/assets/notes-javascript-c.js']);
  assert.equal(sw.claimed, 1);
});

test('Pages come from the network when it answers, and from the saved shell when it does not', async () => {
  const sw = worker();
  await sw.dispatch('install');
  sw.net.files['/notes/js-loops'] = 'fresh page';
  const online = await sw.request('/notes/js-loops', { mode: 'navigate' });
  assert.equal(await online.text(), 'fresh page');
  sw.net.offline = true;
  const offline = await sw.request('/notes/js-loops', { mode: 'navigate' });
  assert.equal(await offline.text(), 'body of /index.html');
  // A connection that hangs gets the saved page after the timeout instead of a blank wait.
  sw.net.offline = false;
  sw.net.delay = 400;
  const started = Date.now();
  const slow = await sw.request('/play', { mode: 'navigate' });
  assert.equal(await slow.text(), 'body of /index.html');
  assert(Date.now() - started < 300, 'did not wait for the slow network');
});

test('Files of this build are kept once fetched; everything else is left to the network', async () => {
  const sw = worker();
  await sw.dispatch('install');
  await sw.dispatch('activate');
  const first = await sw.request('/assets/notes-react-d.js');
  assert.equal(await first.text(), 'body of /assets/notes-react-d.js');
  assert(sw.cached('content').includes('/assets/notes-react-d.js'), 'an opened chapter is kept');
  sw.net.offline = true;
  const again = await sw.request('/assets/notes-react-d.js');
  assert.equal(await again.text(), 'body of /assets/notes-react-d.js');
  assert.equal(
    await (await sw.request('/assets/Reader-b.js')).text(),
    'body of /assets/Reader-b.js',
  );
  // Not handled: a file from another build, the course PDFs, the API, other sites, POSTs.
  for (const [url, options] of [
    ['/assets/old-z.js'],
    ['/sample.pdf'],
    ['/api/interviewer/session'],
    ['https://fonts.googleapis.com/css2?family=Inter'],
    ['/assets/notes-react-d.js', { method: 'POST' }],
  ])
    assert.equal(await sw.request(url, options), null, url);
});

test('Saving English saves the Hinglish text too, reports progress and can be undone', async () => {
  const sw = worker();
  await sw.dispatch('install');
  await sw.dispatch('activate');
  const [before] = await sw.message({ type: 'offline-status' });
  assert.deepEqual(before.result.langs.hinglish, { saved: 0, total: 3, bytes: 207000 });
  assert.deepEqual(before.result.langs.en, { saved: 0, total: 6, bytes: 412000 });

  const replies = await sw.message({ type: 'save-offline', lang: 'en' });
  const progress = replies.filter((reply) => 'progress' in reply).map((reply) => reply.progress);
  assert.deepEqual(progress, [0, 1, 2, 3, 4, 5, 6]);
  const { result } = replies.at(-1);
  assert.deepEqual(result.langs.en, { saved: 6, total: 6, bytes: 412000 });
  assert.equal(result.langs.hinglish.saved, 3, 'the Hinglish copy is complete as well');

  sw.net.offline = true;
  assert.equal(
    await (await sw.request('/assets/questions.en-h.js')).text(),
    'body of /assets/questions.en-h.js',
  );
  sw.net.offline = false;
  const [forgotten] = await sw.message({ type: 'forget-offline' });
  assert.equal(forgotten.result.langs.en.saved, 0);
  assert.deepEqual(sw.cached('shell-v2').sort(), [...BUILD.shell].sort(), 'the app still opens');
});

test('A save that fails part-way reports an error and later fetches only what is missing', async () => {
  const sw = worker();
  await sw.dispatch('install');
  delete sw.net.files['/assets/notes-react-d.js'];
  const failed = await sw.message({ type: 'save-offline', lang: 'hinglish' });
  assert.match(failed.at(-1).error, /notes-react-d\.js: 404/);
  sw.net.files['/assets/notes-react-d.js'] = 'back';
  sw.net.requests.length = 0;
  const retried = await sw.message({ type: 'save-offline', lang: 'hinglish' });
  assert.equal(retried.at(-1).result.langs.hinglish.saved, 3);
  assert(sw.net.requests.includes('/assets/notes-react-d.js'));
  assert(
    sw.net.requests.length < BUILD.content.hinglish.length,
    `already saved files were fetched again: ${sw.net.requests}`,
  );
  await sw.message({ type: 'skip-waiting' });
  assert.equal(sw.skipped, 2, 'one for the first install, one for the message');
  assert.deepEqual(await sw.message({ type: 'save-offline', lang: 'xx' }), [], 'unknown language');
});

// ---------------------------------------------------------------------------------------------
// The page: Saved page panel and the update prompt, with a fake service worker.

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
const offline = await server.ssrLoadModule('/src/lib/offline.js');

// What the page sees as navigator.serviceWorker. `answer` decides each reply.
function fakeServiceWorker(answer) {
  const sent = [];
  const controller = {
    postMessage(message, [port]) {
      sent.push(message);
      const reply = (data) => port.postMessage(data);
      Promise.resolve(answer(message, reply)).then(() => port.close());
    },
  };
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { controller, ready: Promise.resolve(), addEventListener() {} },
  });
  return sent;
}
const status = (saved) => ({
  version: 'v2',
  langs: {
    hinglish: { saved: saved ? 10 : 0, total: 10, bytes: 401000 },
    en: { saved: 0, total: 20, bytes: 808000 },
  },
});

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
const settle = (ms = 30) =>
  React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
async function until(check, label) {
  for (let waited = 0; waited < 5000; waited += 20) {
    if (check()) return;
    await settle(20);
  }
  assert.fail(`Timed out waiting for ${label}`);
}
async function click(element) {
  assert(element, 'Expected an interactive element');
  await React.act(async () =>
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
  );
}
const panel = () => document.querySelector('.offline-panel');
await server.ssrLoadModule('/src/library/Library.jsx');

after(async () => {
  if (root) await React.act(async () => root.unmount());
  delete navigator.serviceWorker;
  await server.close();
  dom.window.close();
});

test('The Saved page offers to save the notes offline, shows progress and the result', async () => {
  localStorage.clear();
  let saved = false;
  const sent = fakeServiceWorker(async (message, reply) => {
    if (message.type === 'offline-status') reply({ result: status(saved) });
    if (message.type === 'save-offline') {
      for (let done = 0; done <= 10; done += 5) reply({ progress: done, total: 10 });
      saved = true;
      reply({ result: status(true) });
    }
    if (message.type === 'forget-offline') {
      saved = false;
      reply({ result: status(false) });
    }
  });
  await mount('/saved');
  await until(() => panel()?.querySelector('button'), 'the offline panel');
  assert.match(panel().textContent, /Bina internet ke padho/);
  assert.match(panel().textContent, /download lagbhag 0\.4 MB/);
  await click(panel().querySelector('button'));
  await until(() => /Is device par save hai/.test(panel().textContent), 'the saved message');
  assert.match(panel().textContent, /saare 118 chapters aur 456 interview answers/);
  assert.deepEqual(
    sent.map((message) => message.type),
    ['offline-status', 'save-offline'],
  );
  assert.equal(sent[1].lang, 'hinglish');
  assert.equal(localStorage.getItem('shortnotes.offline'), '["hinglish"]');
  await click(panel().querySelector('button'));
  await until(() => /Hata diya/.test(panel().textContent), 'the removed message');
  assert.equal(localStorage.getItem('shortnotes.offline'), null);
  assert.match(panel().querySelector('button').textContent, /Offline ke liye save karo/);
});

test('A save that fails can be retried, and the panel follows the reading language', async () => {
  localStorage.clear();
  localStorage.setItem('shortnotes.lang', 'en');
  let attempts = 0;
  fakeServiceWorker(async (message, reply) => {
    if (message.type === 'offline-status') reply({ result: status(false) });
    if (message.type === 'save-offline') {
      attempts++;
      reply({ progress: 0, total: 20 });
      if (attempts === 1) reply({ error: 'notes-en-java: 503' });
      else
        reply({
          result: {
            ...status(false),
            langs: { ...status(false).langs, en: { saved: 20, total: 20, bytes: 808000 } },
          },
        });
    }
  });
  await mount('/saved');
  await until(() => panel()?.querySelector('button'), 'the offline panel');
  assert.match(panel().textContent, /in English on this device — about 0\.8 MB/);
  await click(panel().querySelector('button'));
  await until(() => /did not finish/.test(panel().textContent), 'the failure message');
  assert.match(panel().querySelector('[role="status"]').textContent, /Check your connection/);
  assert.match(panel().querySelector('button').textContent, /Try again/);
  await click(panel().querySelector('button'));
  await until(() => /Saved on this device/.test(panel().textContent), 'the saved message');
  assert.equal(attempts, 2);
  localStorage.clear();
});

test('Without service worker support the panel stays out of the way', async () => {
  delete navigator.serviceWorker;
  localStorage.clear();
  await mount('/saved');
  await settle(60);
  assert.equal(panel(), null);
  assert(document.querySelector('.backup-panel'), 'the backup panel is still there');
});

test('A downloaded update is offered, and switching happens only when the reader asks', async () => {
  localStorage.clear();
  await mount('/');
  assert.equal(document.querySelector('.update-prompt'), null);
  const waiting = { messages: [], postMessage: (message) => waiting.messages.push(message) };
  await React.act(async () => offline.offerUpdate(waiting));
  const prompt = document.querySelector('.update-prompt');
  assert.equal(prompt.getAttribute('role'), 'status');
  assert.match(prompt.textContent, /naya version ready hai/);
  assert.deepEqual(waiting.messages, []);
  await click(prompt.querySelector('button'));
  assert.deepEqual(waiting.messages, [{ type: 'skip-waiting' }]);
});
