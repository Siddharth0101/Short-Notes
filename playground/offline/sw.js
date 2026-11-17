/* Shortnotes service worker.
 *
 * `vite build` turns this file into dist/sw.js with the build's file lists in OFFLINE, written
 * above this comment by offline/plugin.js:
 *   version  changes whenever any file of the app shell changes
 *   shell    the page, its scripts, styles, icons: cached on install, so the app always opens
 *   assets   every hashed file of this build; anything else is old and gets dropped
 *   content  chapter text and interview answers per language, saved only when the reader asks
 *   sizes    compressed size of each content file, for "about N MB" in the page
 *
 * Plain script on purpose: no imports, no bundling, nothing that can fail before it runs.
 */
/* global OFFLINE */
const SHELL = `shell-${OFFLINE.version}`;
// Content files keep their name while their text is unchanged, so they outlive app updates.
const CONTENT = 'content';
// On a weak connection a page request can hang; after this long, the saved copy is shown.
const PAGE_TIMEOUT = 4000;
const known = new Set(OFFLINE.assets);
const shell = new Set(OFFLINE.shell);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) =>
        cache.addAll(OFFLINE.shell.map((url) => new Request(url, { cache: 'reload' }))),
      )
      // The very first install has no open page to disturb, so it takes over at once. An update
      // waits for the reader to accept it (the page posts 'skip-waiting').
      .then(() => !self.registration.active && self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith('shell-') && key !== SHELL) await caches.delete(key);
      // Saved files whose name is not part of this build belong to an older one.
      const content = await caches.open(CONTENT);
      for (const request of await content.keys())
        if (!known.has(new URL(request.url).pathname)) await content.delete(request);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Other sites (fonts), the interviewer API and the 15-30 MB course PDFs go to the network.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(page(request));
    return;
  }
  if (known.has(url.pathname) || shell.has(url.pathname)) event.respondWith(file(request, url));
});

// Pages: the network first, so an online reader always gets the newest release; the saved page
// when offline or when the network is too slow to answer.
async function page(request) {
  const saved = await caches.match('/index.html');
  const network = fetch(request);
  if (!saved) return network;
  network.catch(() => {}); // a late failure after the timeout is not an error anyone sees
  const timeout = new Promise((resolve) => setTimeout(resolve, PAGE_TIMEOUT, null));
  try {
    return (await Promise.race([network, timeout])) || saved;
  } catch {
    return saved;
  }
}

// Files: a hashed name never changes its bytes, so a saved copy is always right. A file fetched
// for the first time is kept, which is how chapters a reader has opened stay available.
async function file(request, url) {
  const saved = await caches.match(url.pathname);
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok && known.has(url.pathname)) {
    const cache = await caches.open(CONTENT);
    await cache.put(url.pathname, response.clone());
  }
  return response;
}

// English needs the Hinglish text too: anchors, practice ids and flashcard ids come from it.
const filesFor = (lang) => [
  ...new Set(
    lang === 'en' ? [...OFFLINE.content.hinglish, ...OFFLINE.content.en] : OFFLINE.content.hinglish,
  ),
];

async function status() {
  const langs = {};
  for (const lang of Object.keys(OFFLINE.content)) {
    const files = filesFor(lang);
    let saved = 0;
    for (const url of files) if (await caches.match(url)) saved++;
    langs[lang] = {
      saved,
      total: files.length,
      bytes: files.reduce((sum, url) => sum + (OFFLINE.sizes[url] || 0), 0),
    };
  }
  return { version: OFFLINE.version, langs };
}

async function save(lang, port) {
  const files = filesFor(lang);
  const missing = [];
  for (const url of files) if (!(await caches.match(url))) missing.push(url);
  const cache = await caches.open(CONTENT);
  let done = files.length - missing.length;
  port?.postMessage({ progress: done, total: files.length });
  // A few at a time: quicker than one by one, gentler than all at once on a phone.
  const queue = [...missing];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const response = await fetch(url, { cache: 'reload' });
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      await cache.put(url, response);
      port?.postMessage({ progress: ++done, total: files.length });
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  return status();
}

self.addEventListener('message', (event) => {
  const { data } = event;
  const port = event.ports[0];
  const reply = (work) =>
    event.waitUntil(
      work.then(
        (result) => port?.postMessage({ result }),
        (error) => port?.postMessage({ error: String(error?.message || error) }),
      ),
    );
  if (data?.type === 'skip-waiting') self.skipWaiting();
  else if (data?.type === 'offline-status') reply(status());
  else if (data?.type === 'save-offline' && OFFLINE.content[data.lang])
    reply(save(data.lang, port));
  // Forgetting drops every saved file, including chapters kept because they were opened.
  else if (data?.type === 'forget-offline') reply(caches.delete(CONTENT).then(status));
});
