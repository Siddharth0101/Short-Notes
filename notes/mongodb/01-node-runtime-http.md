---
id: mongo-node-runtime-http
title: Node runtime HTTP modules and streams
track: mongodb
order: 1
level: Foundation
minutes: 1
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

## Research notes: Backpressure is a producer contract

- Writable.write() false de toh producer pause kare jab tak destination ready na ho.

## Sources — aur padhne ke liye

- [Source yahan padho — Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [Node event loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Node stream documentation](https://nodejs.org/api/stream.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/01-node-runtime-http.md)
