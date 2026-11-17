// The page's side of offline support: registering the service worker (offline/sw.js), offering
// an update when a new release has been downloaded, and saving or removing the offline copy of
// the notes. Everything here is an extra: if any of it fails, the app works as before.
const OPT_IN = 'shortnotes.offline';
const UPDATE_CHECK = 60 * 60 * 1000;

let state = { updateReady: false };
let waiting = null;
let accepted = false;
const listeners = new Set();
export const subscribeOffline = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getOfflineState = () => state;

// A new release has finished downloading and waits until the reader agrees to switch.
export function offerUpdate(worker) {
  waiting = worker;
  state = { ...state, updateReady: true };
  listeners.forEach((listener) => listener());
}
// Switch to the waiting release; the page reloads once the new worker is in control.
export function applyUpdate() {
  accepted = true;
  waiting?.postMessage({ type: 'skip-waiting' });
}

export const offlineSupported = () =>
  typeof navigator !== 'undefined' && 'serviceWorker' in navigator;

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !offlineSupported()) return;
  const sw = navigator.serviceWorker;
  // The first install also takes control (clients.claim) — that must not reload the page.
  sw.addEventListener('controllerchange', () => accepted && window.location.reload());
  window.addEventListener('load', async () => {
    try {
      const registration = await sw.register('/sw.js');
      const watch = (worker) =>
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && sw.controller) offerUpdate(worker);
        });
      if (registration.waiting && sw.controller) offerUpdate(registration.waiting);
      watch(registration.installing);
      registration.addEventListener('updatefound', () => watch(registration.installing));
      // An installed app can stay open for days; look for a new release when it comes back.
      let checked = Date.now();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible' || Date.now() - checked < UPDATE_CHECK) return;
        checked = Date.now();
        registration.update().catch(() => {});
      });
      refreshSaved();
    } catch {
      // No offline support in this browser or on this host; nothing else changes.
    }
  });
}

const timeout = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('offline.unavailable')), ms));

async function controller() {
  const sw = navigator.serviceWorker;
  if (sw.controller) return sw.controller;
  // Right after the first install the worker takes control a moment later.
  const control = sw.ready.then(
    () =>
      sw.controller ||
      new Promise((resolve) =>
        sw.addEventListener('controllerchange', () => resolve(sw.controller), { once: true }),
      ),
  );
  return Promise.race([control, timeout(8000)]);
}

// One request to the worker; progress messages arrive before the final answer.
async function ask(message, onProgress) {
  if (!offlineSupported()) throw new Error('offline.unavailable');
  const worker = await controller();
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      if ('progress' in data) {
        onProgress?.(data);
        return;
      }
      channel.port1.close();
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    };
    worker.postMessage(message, [channel.port2]);
  });
}

function readOptIn() {
  try {
    const value = JSON.parse(localStorage.getItem(OPT_IN));
    return Array.isArray(value) ? value.filter((lang) => ['hinglish', 'en'].includes(lang)) : [];
  } catch {
    return [];
  }
}
function writeOptIn(langs) {
  try {
    if (langs.length) localStorage.setItem(OPT_IN, JSON.stringify(langs));
    else localStorage.removeItem(OPT_IN);
  } catch {
    // Without storage the copy is still saved; it is just not refreshed after an update.
  }
}

// { version, langs: { hinglish: { saved, total, bytes }, en: { … } } }
export const offlineStatus = () => ask({ type: 'offline-status' });

export async function saveOffline(lang, onProgress) {
  // Ask the browser not to clear the copy when space runs low. It may say no; that is fine.
  navigator.storage?.persist?.().catch?.(() => {});
  const result = await ask({ type: 'save-offline', lang }, onProgress);
  writeOptIn([...new Set([...readOptIn(), lang])]);
  return result;
}

export async function forgetOffline() {
  writeOptIn([]);
  return ask({ type: 'forget-offline' });
}

// After an update some saved files have new names. A reader who saved the notes gets them
// saved again, quietly, the next time the app opens online.
export async function refreshSaved() {
  const langs = readOptIn();
  if (!langs.length || (typeof navigator !== 'undefined' && navigator.onLine === false)) return;
  try {
    const { langs: current } = await offlineStatus();
    for (const lang of langs)
      if (current[lang] && current[lang].saved < current[lang].total) await saveOffline(lang);
  } catch {
    // Tried again on the next start.
  }
}
