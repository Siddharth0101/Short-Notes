---
id: javascript-browser-persistence
title: Browser persistence and offline behaviour — be clear what "saved" means
track: javascript
order: 19
level: Intermediate
minutes: 3
summary: `localStorage` — origin-scoped string storage; synchronous and persistent in the browser.
tags: storage, indexeddb, offline, versioning
---

## Quick revision

> Revision target — Understand storage read/write failures, schema and browser scope; do not accept saved state as trusted input.

- `localStorage` — origin-scoped string storage; synchronous and persistent in the browser.
- `sessionStorage` — data for the tab session; it survives a reload.
- JSON storage — serialize/parse; validate malformed or old data.
- IndexedDB — async structured storage; for large/offline data.
- Cookie — can travel with matching requests; its flags and scope matter.
- Secret — keeping sensitive credentials in browser-readable storage is risky.
- Quota — writes can fail; keep a fallback and error handling.
- `storage` event — other matching documents learn about the change; the writer does not.
- Offline conflict — keep a version/merge rule; do not blindly accept the last write.
- Schema version — keep a version on stored data; migrate an old format or fall back safely.
- Atomic browser data — group related IndexedDB changes in the same transaction.
- Storage scope — a different origin means separate storage; handle private mode/blocked storage failures.

### Offline browser

- Manifest — app install metadata; offline caching is the separate job of a service worker.

### Offline and cookies

- Service worker — intercepts/caches network requests; handle its lifecycle/version updates.
- Cache-first — speed/offline; network-first — freshness; stale-while-revalidate — cached, then refresh.
- HttpOnly cookie — blocks JS reads; Secure — sent over HTTPS only; SameSite — the cross-site send policy; server auth/CSRF checks are still needed.
- XSS — unsafe script injection; defend with output encoding, sanitization and CSP.

### Edge cases and reasoning

- Read-modify-write race — a localStorage get/set sequence is not an atomic cross-tab transaction; concurrent edits can be overwritten.
- Private cache partition — keep the user/tenant identity in cache keys; clear the previous private entries on logout.
- Durability limit — browser data can be evicted or cleared by the user; give an export and recovery contract for important unsynced work.

## Understand it with an example

```js
function readTheme(storage) {
  try {
    const value = storage.getItem("theme");
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}
```

- Contract — the storage dependency is explicit; a usable default is returned for missing, invalid and read-failure cases.
- Catch — even accessing the actual `window.localStorage` property can throw; guard the boundary that acquires the storage too.
- Check — with a mock storage test `null`, `"dark"`, invalid text and a thrown error; on a write failure keep the user's current choice in memory.

## Recall and practice

- Question — If two tabs read the same counter and save +1, are both increments guaranteed?
- Answer — No; both can write the same previous value. Transactional storage or an explicit coordination/merge strategy is needed.
- Try it yourself — Build a versioned draft loader; preserve the currently typed answer through malformed JSON, an old schema, a quota error and a two-tab conflict.

## Practice questions

### Easy · `localStorage` stores only strings

```js
localStorage.setItem('prefs', { dark: true });
console.log(localStorage.getItem('prefs'));
localStorage.setItem('count', 5);
console.log(localStorage.getItem('count') + 1);
```

<details>
<summary>Answer</summary>

- Output — `'[object Object]'` and `'51'`.
- Why — values are converted to strings.
- Fix — save with `JSON.stringify`, read with `JSON.parse`; use `Number(...)` for numbers.

</details>

### Easy · Which storage, when?

`localStorage`, `sessionStorage`, cookie and IndexedDB — give the lifetime, scope and use case in one line each.

<details>
<summary>Answer</summary>

- `localStorage` — origin-wide, shared across tabs, survives closing; small sync string data (theme).
- `sessionStorage` — the session of one tab; cleared when the tab closes (a draft step).
- Cookie — goes to the server with every matching request; `HttpOnly` for a session.
- IndexedDB — async, large structured data, transactions; offline data/caches.

</details>

### Medium · Load corrupt or old data safely

Write `loadPrefs()` that handles a missing value, invalid JSON, the old `version: 1` schema and blocked storage (a throw) — all of them.

<details>
<summary>Answer</summary>

```js
const DEFAULTS = { version: 2, theme: 'system', fontSize: 16 };
function loadPrefs() {
  try {
    const raw = localStorage.getItem('prefs');
    if (!raw) return DEFAULTS;
    const data = JSON.parse(raw);
    if (data?.version === 1) return { ...DEFAULTS, theme: data.dark ? 'dark' : 'light' };
    if (data?.version === 2) return { ...DEFAULTS, ...data };
    return DEFAULTS;
  } catch {
    return DEFAULTS; // storage blocked ya JSON kharab
  }
}
```

- Versioning — keep the migration explicit, so old users' data does not break.
- Access can throw too — in privacy mode/with blocked cookies the `localStorage` getter itself can fail.

</details>

### Medium · Why not keep the token in `localStorage`?

<details>
<summary>Answer</summary>

- XSS — any script that runs on the page can read `localStorage` and steal the token.
- Better — keep the session in an `HttpOnly; Secure; SameSite=Lax` cookie; JS cannot read it at all.
- Trade-off — cookies are sent automatically, so state-changing requests need CSRF protection (SameSite + a CSRF token).
- In both cases, fixing XSS is the real defence.

</details>

### Hard · Two tabs, one cart — a lost update

Both tabs read `cart`, add an item and write to `localStorage`. One tab's item disappears. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Cause — a read-modify-write race: both read the same old cart, and the second write overwrites the first.
- Sync — tell the other tabs about the new cart through the `storage` event (or `BroadcastChannel`) and refresh the UI.
- Atomic update — one tab at a time with `navigator.locks.request('cart', async () => { read; modify; write; })`; or an IndexedDB transaction.
- Server cart — for logged-in users, the source of truth is on the server, with versioned updates.

</details>

## Sources — further reading

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/19-browser-persistence.md)
