---
id: mongo-node-runtime-http
title: Node runtime HTTP modules and streams
track: mongodb
order: 1
level: Foundation
minutes: 5
summary: Node.js — JavaScript runtime; I/O async ho sakti hai, heavy JS event loop block karta hai.
tags: node, http, npm, streams, event-loop, modules
visual: request-flow
---

## Quick revision

> Revision target — Async I/O aur CPU work ke difference ko stream flow/cleanup se connect karo.

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

### Edge cases aur reasoning

- Chunk decoding — UTF-8 character chunks ke beech split ho sakta; StringDecoder/stream encoding se incremental text correctly decode karo.
- Pipeline ownership — pipeline error par streams destroy kar sakta hai; HTTP socket already closed ho toh normal error response possible nahi.
- Worker overhead — worker startup/data copy cost count; small I/O tasks ko worker thread par bhejna automatically faster nahi.

## Research notes: Backpressure is a producer contract

- Writable.write() false de toh producer pause kare jab tak destination ready na ho.

## Example se samjho

- Scenario — Large export fast produce hota hai, download client slow hai; destination write false return karti hai.
- Reasoning — Producer drain readiness tak pause kare ya pipeline backpressure coordinate kare. Client disconnect par cursor/streams ka owner cleanup kare.
- Catch — False ka matlab write ko dobara blindly bhejna nahi; queued data duplicate ho sakta hai. Buffer threshold total process memory ki hard cap bhi nahi.

## Recall aur practice

- Sawal — Readable chunk ko independent chunk.toString() karna Unicode text ko kaise corrupt kar sakta hai?
- Jawaab — Multibyte character chunk boundary par split ho sakta; incremental decoder incomplete bytes next chunk tak retain karta hai.
- Khud try karo — UTF-8 streamed export banao; split emoji, slow consumer, upstream error aur client disconnect par data/cleanup verify karo.

## Practice questions

### Easy · `nextTick`, promise aur timers ka order

```js
// main module (ESM nahi, CommonJS)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('sync');
```

<details>
<summary>Answer</summary>

- Pehle — `sync`, `nextTick`, `promise`.
- Phir — `timeout` aur `immediate`; main module mein inka order guaranteed nahi (process timing par depend).
- I/O callback ke andar — `setImmediate` hamesha `setTimeout(0)` se pehle.
- Rule — `nextTick` queue promise microtasks se bhi pehle drain hoti hai; zyada use I/O starve kar sakta hai.

</details>

### Easy · Handler mein `readFileSync`

```js
app.get('/report', (req, res) => {
  const data = fs.readFileSync('big-report.csv');
  res.send(data);
});
```

<details>
<summary>Answer</summary>

- Problem — sync call event loop block karti hai; jab tak file padhi jaa rahi, saari doosri requests ruk jaati hain.
- Fix — `await fs.promises.readFile(...)` ya better, stream: `fs.createReadStream(path).pipe(res)` (bade files memory mein load nahi).
- Sync API theek — startup par config load jaise one-time kaam.

</details>

### Medium · Backpressure ignore karna

```js
source.on('data', (chunk) => destination.write(chunk));
```

Slow destination (network) par memory kyun badhti hai? Sahi tareeka?

<details>
<summary>Answer</summary>

- Kyun — `write()` `false` return karke "ruk jao" bolta hai; ignore karne par chunks memory mein buffer hote rehte hain.
- Fix:

```js
import { pipeline } from 'node:stream/promises';
await pipeline(source, transform, destination);
```

- `pipeline` — backpressure, errors aur cleanup (sab streams destroy) handle karta hai; `.pipe()` errors forward nahi karta.

</details>

### Medium · `'error'` event bina listener

```js
const emitter = new EventEmitter();
emitter.emit('error', new Error('boom'));
console.log('after');
```

<details>
<summary>Answer</summary>

- Result — process crash (uncaught exception); `after` print nahi hota.
- Rule — `'error'` special event hai; listener na ho toh throw hota hai.
- Fix — `emitter.on('error', handleError)`; streams/sockets par bhi error listeners lagao.

</details>

### Hard · CPU-heavy endpoint se poori API slow

`POST /thumbnail` image resize karta hai (~400ms CPU). Load par `/health` bhi slow ho jaata hai. Kyun aur fix?

<details>
<summary>Answer</summary>

- Kyun — JS single main thread par CPU kaam event loop rokta hai; baaki requests queue mein.
- Measure — `perf_hooks.monitorEventLoopDelay()` se event loop lag.
- Fix — `worker_threads` pool (Piscina jaisi library) mein CPU kaam; ya job queue + alag worker service.
- Limits — worker pool bounded rakho; workers ka startup/data copy cost hota hai, chhote tasks ke liye fayda nahi.

</details>

## Sources — aur padhne ke liye

- [Node stream and pipeline contracts](https://nodejs.org/api/stream.html)

- [Node — AsyncLocalStorage](https://nodejs.org/api/async_context.html)

- [Source yahan padho — Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [Node event loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/01-node-runtime-http.md)
