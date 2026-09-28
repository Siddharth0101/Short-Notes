---
id: mongo-node-runtime-http
title: Node runtime HTTP modules and streams
track: mongodb
order: 1
level: Foundation
minutes: 2
summary: Node.js — JavaScript runtime; I/O async ho sakti hai, heavy JS event loop block karta hai.
tags: node, http, npm, streams, event-loop, modules
visual: request-flow
---

## Quick revision

- Node.js — JavaScript runtime; I/O async ho sakti hai, heavy JS event loop block karta hai.
- Event loop — callbacks schedule; worker pool aur OS kuch async work handle karte hain.
- HTTP — method, URL, headers aur body se request; status/headers/body se response.
- Module — ESM `import/export`; CommonJS `require/module.exports`.
- Stream — chunks mein data; poori file memory mein lena zaroori nahi.
- Backpressure — slow consumer ho toh producer ko slow/pause karo.
- Buffer — binary bytes; text decode karte waqt encoding sahi rakho.
- Environment — config validate karo; secrets client/logs mein leak mat karo.
- EventEmitter — listeners synchronous call ho sakte hain; emit ko automatic async mat samjho.
- Client disconnect — abandoned response ke database/stream work ko cancel/close karo.
- CPU saturation — event-loop delay measure; heavy computation ko bounded worker execution do.

### Node scheduling

- Node phases — timers, poll, check jaise phases; timer/immediate order context-dependent hai.
- `nextTick` — Node ki separate queue; ESM/CJS scheduling ko ek universal order mat samjho.
- Emitter errors — EventEmitter ka unhandled error event throw kar sakta hai; listener/cleanup owner define karo.

### Node modules

- npm — packages/scripts; package.json dependencies aur commands define karta hai.
- Core modules — fs files, path paths, http server aur events event handling.
- Sync API — request path par expensive synchronous I/O event loop block kar sakti hai.

### HTTP boundaries

- Cookies/session — browser credential transport aur server identity state alag concepts.
- Proxy — client/server ke beech routing, TLS, caching ya protection layer.

### Workers aur streams

- libuv — event loop aur worker pool support; har async I/O pool par nahi hoti.
- Worker threads — CPU-heavy JS parallel; message transfer/shared-memory rules chahiye.
- Stream types — readable, writable, duplex, transform.
- Pipeline — backpressure, errors aur cleanup coordinate karo.

### Async context aur stream limits

- AsyncLocalStorage — request ID/context ko async callbacks aur Promise chain mein carry karo.
- Context run — `run(store, callback)` se context scope banao; unrelated requests ke liye shared mutable store reuse mat karo.
- highWaterMark — buffering ka threshold; total memory ki hard limit nahi.
- Object-mode buffering — highWaterMark objects count karta hai; ek huge object phir bhi bahut memory le sakta hai.

## Research notes: Backpressure is a producer contract

- Writable.write() false de toh producer pause kare jab tak destination ready na ho.

## Sources — aur padhne ke liye

- [Node — AsyncLocalStorage](https://nodejs.org/api/async_context.html)

- [Source yahan padho — Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [Node event loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Node stream documentation](https://nodejs.org/api/stream.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/01-node-runtime-http.md)
