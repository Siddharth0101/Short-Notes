---
id: javascript-browser-persistence
title: Browser persistence aur offline behavior — save ka meaning clear karo
track: javascript
order: 19
level: Intermediate
minutes: 3
summary: `localStorage` — origin-scoped string storage; synchronous aur browser mein persistent.
tags: storage, indexeddb, offline, versioning
---

## Quick revision

> Revision target — Storage read/write failure, schema aur browser scope samjho; saved state ko trusted input mat maano.

- `localStorage` — origin-scoped string storage; synchronous aur browser mein persistent.
- `sessionStorage` — tab session tak data; reload par rehta hai.
- JSON storage — serialize/parse karo; malformed ya old data validate karo.
- IndexedDB — async structured storage; bade/offline data ke liye.
- Cookie — matching requests ke saath ja sakti hai; flags aur scope important.
- Secret — browser-readable storage mein sensitive credentials rakhna risky hai.
- Quota — writes fail ho sakti hain; fallback aur error handling rakho.
- `storage` event — doosre matching documents ko change pata chalta hai; writer ko nahi.
- Offline conflict — version/merge rule rakho; last write blindly accept mat karo.
- Schema version — stored data ka version rakho; old format migrate ya safe fallback.
- Atomic browser data — related IndexedDB changes same transaction mein group karo.
- Storage scope — origin badla toh storage alag; private mode/blocked storage failure handle karo.

### Offline browser

- Manifest — app install metadata; offline caching service worker ka separate kaam.

### Offline aur cookies

- Service worker — network requests intercept/cache; lifecycle/version updates handle.
- Cache-first — speed/offline; network-first — freshness; stale-while-revalidate — cached then refresh.
- HttpOnly cookie — JS reads block; Secure — HTTPS-only send; SameSite — cross-site send policy; server auth/CSRF checks phir bhi chahiye.
- XSS — unsafe script injection; output encoding, sanitization aur CSP defense.

### Edge cases aur reasoning

- Read-modify-write race — localStorage get/set sequence cross-tab atomic transaction nahi; concurrent edits overwrite ho sakti hain.
- Private cache partition — user/tenant identity cache keys mein rakho; logout par previous private entries clear karo.
- Durability limit — browser data eviction/user clearing possible; important unsynced work ke liye export aur recovery contract do.

## Example se samjho

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

- Contract — storage dependency explicit hai; missing, invalid aur read failure ke liye usable default milta hai.
- Catch — actual `window.localStorage` property access bhi throw kar sakta hai; storage acquire karne wali boundary ko bhi guard karo.
- Check — mock storage se `null`, `"dark"`, invalid text aur thrown error test karo; write failure par user ka current choice memory mein preserve karo.

## Recall aur practice

- Sawal — Do tabs same counter read karke +1 save karein toh dono increments guaranteed hain?
- Jawaab — Nahi; dono same previous value likh sakte hain. Transactional storage ya explicit coordination/merge strategy chahiye.
- Khud try karo — Versioned draft loader banao; malformed JSON, old schema, quota error aur two-tab conflict par current typed answer preserve karo.

## Practice questions

### Easy · `localStorage` sirf strings rakhta hai

```js
localStorage.setItem('prefs', { dark: true });
console.log(localStorage.getItem('prefs'));
localStorage.setItem('count', 5);
console.log(localStorage.getItem('count') + 1);
```

<details>
<summary>Answer</summary>

- Output — `'[object Object]'` aur `'51'`.
- Kyun — values string mein convert hoti hain.
- Fix — `JSON.stringify` se save, `JSON.parse` se read; numbers ke liye `Number(...)`.

</details>

### Easy · Kaunsa storage kab?

`localStorage`, `sessionStorage`, cookie aur IndexedDB — lifetime, scope aur use case ek-ek line mein batao.

<details>
<summary>Answer</summary>

- `localStorage` — origin-wide, tabs mein shared, close ke baad bhi; small sync string data (theme).
- `sessionStorage` — ek tab ka session; tab close par clear (draft step).
- Cookie — har matching request ke saath server ko jaati hai; `HttpOnly` session ke liye.
- IndexedDB — async, bada structured data, transactions; offline data/caches.

</details>

### Medium · Corrupt ya purana data safely load karo

`loadPrefs()` likho jo missing value, invalid JSON, purana `version: 1` schema aur blocked storage (throw) — sab handle kare.

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

- Versioning — migration explicit rakho, purane users ka data na toote.
- Access bhi throw kar sakta hai — privacy mode/blocked cookies mein `localStorage` getter hi fail ho sakta hai.

</details>

### Medium · Token `localStorage` mein kyun nahi?

<details>
<summary>Answer</summary>

- XSS — page par chala koi bhi script `localStorage` padh kar token chura sakta hai.
- Better — session `HttpOnly; Secure; SameSite=Lax` cookie mein; JS use padh hi nahi sakta.
- Trade-off — cookies automatically jaati hain, isliye state-changing requests par CSRF protection (SameSite + CSRF token) chahiye.
- Dono case mein XSS fix karna hi asli defence hai.

</details>

### Hard · Do tabs, ek cart — lost update

Dono tabs `cart` padhte hain, item add karte hain aur `localStorage` mein likhte hain. Ek tab ka item gayab ho jaata hai. Kyun, aur fix?

<details>
<summary>Answer</summary>

- Cause — read-modify-write race: dono ne same purana cart padha, doosra write pehle ko overwrite kar deta hai.
- Sync — doosre tabs ko `storage` event (ya `BroadcastChannel`) se naya cart batao aur UI refresh karo.
- Atomic update — `navigator.locks.request('cart', async () => { read; modify; write; })` se ek time par ek tab; ya IndexedDB transaction.
- Server cart — logged-in users ke liye source of truth server par, versioned updates ke saath.

</details>

## Sources — aur padhne ke liye

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/19-browser-persistence.md)
