---
id: javascript-browser-persistence
title: Browser persistence aur offline behavior — save ka meaning clear karo
track: javascript
order: 19
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/19-browser-persistence.md)
