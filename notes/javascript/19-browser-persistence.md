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

## Recall aur practice

- Sawal — Do tabs same counter read karke +1 save karein toh dono increments guaranteed hain?
- Jawaab — Nahi; dono same previous value likh sakte hain. Transactional storage ya explicit coordination/merge strategy chahiye.
- Khud try karo — Versioned draft loader banao; malformed JSON, old schema, quota error aur two-tab conflict par current typed answer preserve karo.

## Sources — aur padhne ke liye

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/19-browser-persistence.md)
