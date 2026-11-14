---
id: mongo-node-runtime-http
title: Node runtime HTTP modules and streams
track: mongodb
order: 1
level: Foundation
minutes: 5
summary: Node.js — a JavaScript runtime; I/O can be async, but heavy JS blocks the event loop.
tags: node, http, npm, streams, event-loop, modules
visual: request-flow
---

## Quick revision

> Revision target — Connect the difference between async I/O and CPU work to stream flow/cleanup.

- Node.js — a JavaScript runtime; I/O can be async, but heavy JS blocks the event loop.
- Event loop — schedules callbacks; the worker pool and the OS handle some async work.
- HTTP — a request is method, URL, headers and body; a response is status/headers/body.
- Module — ESM `import/export`; CommonJS `require/module.exports`.
- Stream — data in chunks; there is no need to hold the whole file in memory.
- Backpressure — when the consumer is slow, slow down/pause the producer.
- Buffer — binary bytes; use the correct encoding when decoding text.
- Environment — validate config; do not leak secrets to the client/logs.
- EventEmitter — listeners can be called synchronously; do not assume emit is automatically async.
- Client disconnect — cancel/close the database/stream work of an abandoned response.
- CPU saturation — measure event-loop delay; give heavy computation bounded worker execution.

### Node scheduling

- Node phases — phases such as timers, poll and check; the timer/immediate order depends on the context.
- `nextTick` — Node's separate queue; do not treat ESM/CJS scheduling as one universal order.
- Emitter errors — an unhandled error event on an EventEmitter can throw; define who owns the listener/cleanup.

### Node modules

- npm — packages/scripts; package.json defines the dependencies and commands.
- Core modules — fs for files, path for paths, http for a server and events for event handling.
- Sync API — expensive synchronous I/O on the request path can block the event loop.

### HTTP boundaries

- Cookies/session — the browser's credential transport and the server's identity state are separate concepts.
- Proxy — a routing, TLS, caching or protection layer between client and server.

### Workers and streams

- libuv — supports the event loop and the worker pool; not every async I/O goes to the pool.
- Worker threads — CPU-heavy JS in parallel; message transfer/shared-memory rules are needed.
- Stream types — readable, writable, duplex, transform.
- Pipeline — coordinates backpressure, errors and cleanup.

### Async context and stream limits

- AsyncLocalStorage — carries the request ID/context through async callbacks and the Promise chain.
- Context run — create a context scope with `run(store, callback)`; do not reuse a shared mutable store for unrelated requests.
- highWaterMark — the buffering threshold; not a hard limit on total memory.
- Object-mode buffering — highWaterMark counts objects; one huge object can still take a lot of memory.

### Edge cases and reasoning

- Chunk decoding — a UTF-8 character can be split across chunks; decode text incrementally and correctly with StringDecoder/a stream encoding.
- Pipeline ownership — pipeline can destroy the streams on an error; if the HTTP socket is already closed, a normal error response is not possible.
- Worker overhead — count the worker startup/data copy cost; sending small I/O tasks to a worker thread is not automatically faster.

## Research notes: Backpressure is a producer contract

- If Writable.write() returns false, the producer should pause until the destination is ready.

## Understand it with an example

- Scenario — A large export is produced fast and the download client is slow; the destination write returns false.
- Reasoning — The producer pauses until drain signals readiness, or pipeline coordinates the backpressure. On a client disconnect the owner cleans up the cursor/streams.
- Catch — False does not mean blindly sending the write again; queued data can be duplicated. The buffer threshold is not a hard cap on total process memory either.

## Recall and practice

- Question — How can calling an independent chunk.toString() on each readable chunk corrupt Unicode text?
- Answer — A multibyte character can be split at a chunk boundary; an incremental decoder retains the incomplete bytes until the next chunk.
- Try it yourself — Build a UTF-8 streamed export; verify the data/cleanup for a split emoji, a slow consumer, an upstream error and a client disconnect.

## Practice questions

### Easy · The order of `nextTick`, promise and timers

```js
// main module (CommonJS, not ESM)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('sync');
```

<details>
<summary>Answer</summary>

- First — `sync`, `nextTick`, `promise`.
- Then — `timeout` and `immediate`; in the main module their order is not guaranteed (it depends on process timing).
- Inside an I/O callback — `setImmediate` always runs before `setTimeout(0)`.
- Rule — the `nextTick` queue is drained even before promise microtasks; overusing it can starve I/O.

</details>

### Easy · `readFileSync` in a handler

```js
app.get('/report', (req, res) => {
  const data = fs.readFileSync('big-report.csv');
  res.send(data);
});
```

<details>
<summary>Answer</summary>

- Problem — a sync call blocks the event loop; while the file is being read, every other request stops.
- Fix — `await fs.promises.readFile(...)` or, better, a stream: `fs.createReadStream(path).pipe(res)` (large files are not loaded into memory).
- A sync API is fine — for one-time work such as loading config at startup.

</details>

### Medium · Ignoring backpressure

```js
source.on('data', (chunk) => destination.write(chunk));
```

Why does memory grow with a slow destination (the network)? The right way?

<details>
<summary>Answer</summary>

- Why — `write()` says "stop" by returning `false`; if you ignore it, chunks keep buffering in memory.
- Fix:

```js
import { pipeline } from 'node:stream/promises';
await pipeline(source, transform, destination);
```

- `pipeline` — handles backpressure, errors and cleanup (it destroys all the streams); `.pipe()` does not forward errors.

</details>

### Medium · An `'error'` event without a listener

```js
const emitter = new EventEmitter();
emitter.emit('error', new Error('boom'));
console.log('after');
```

<details>
<summary>Answer</summary>

- Result — the process crashes (an uncaught exception); `after` is not printed.
- Rule — `'error'` is a special event; without a listener it is thrown.
- Fix — `emitter.on('error', handleError)`; add error listeners on streams/sockets too.

</details>

### Hard · A CPU-heavy endpoint slows the whole API

`POST /thumbnail` resizes an image (~400ms of CPU). Under load even `/health` becomes slow. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Why — CPU work on the single main JS thread stalls the event loop; the other requests wait in the queue.
- Measure — event loop lag with `perf_hooks.monitorEventLoopDelay()`.
- Fix — do the CPU work in a `worker_threads` pool (a library like Piscina); or a job queue + a separate worker service.
- Limits — keep the worker pool bounded; workers have a startup/data copy cost, so there is no benefit for small tasks.

</details>

## Sources — further reading

- [Node stream and pipeline contracts](https://nodejs.org/api/stream.html)

- [Node — AsyncLocalStorage](https://nodejs.org/api/async_context.html)

- [Source yahan padho — Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [Node event loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/01-node-runtime-http.md)
