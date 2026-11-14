---
id: js-async-event-loop
title: Event loop promises and resilient fetching
track: javascript
order: 15
level: Advanced
minutes: 3
summary: Call stack — synchronous functions execute here.
tags: async, promises, event-loop, fetch, cancellation
visual: event-loop
---

## Quick revision

> Revision target — Predict the order of sync work, queued microtasks and timer tasks; handle a fetching failure separately.

- Call stack — synchronous functions execute here.
- Event loop — gives queued work a chance once the stack is empty.
- Microtasks — Promise callbacks/`queueMicrotask`; the queue is drained at the checkpoint.
- Timers — queued microtasks can run before a timer task.
- Promise — goes from pending to fulfilled or rejected; once settled, the state is fixed.
- `.then` — returns a new Promise; the callback's return value feeds the chain.
- `async` — always returns a Promise; `await` suspends only the current async flow.
- `fetch` — usually resolves on HTTP 404/500; check `response.ok`.
- Abort — cancel a supported operation with `AbortController`; guard against a late result too.
- Starvation — endless microtasks can delay rendering and tasks.
- Promise executor — the executor of `new Promise` runs synchronously.
- Rejected chain — return a normal value from catch and the chain can become fulfilled.
- Finally — for cleanup; a throw or rejected Promise there can replace the original outcome.

### Browser scheduling

- Animation — `requestAnimationFrame` schedules work before the repaint.

### Edge cases and reasoning

- Await continuation — even when awaiting an already fulfilled Promise, the async code that follows resumes later in a microtask.
- Response body — response.json is async and can fail; HTTP success does not prove a valid application schema.
- Request outcome — a client abort does not guarantee a server-side write is rolled back; handle an uncertain write with idempotency/reconciliation.

## Understand it with an example

```js
console.log("A");
setTimeout(() => console.log("D"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("B");
// In this simple browser example: A B C D
```

- Trace — the current script finishes, the queued promise callback runs, then the timer task gets its turn.
- Catch — zero delay is not an exact execution time; a busy stack and scheduling can delay the timer.
- Check — put a heavy loop inside the promise callback and the timer will be late; the async label does not make CPU work parallel.

## Recall and practice

- Question — In a simple browser snippet, what is the order of a sync log, Promise.then and setTimeout(...,0)?
- Answer — The current synchronous code first, then the queued promise microtask, then the timer task; do not assume a universal order across unrelated task sources.
- Try it yourself — Build an A/B/C log trace; in a fetch helper, verify non-2xx, malformed JSON and abort as distinct failures.

## Practice questions

### Easy · Event loop order

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

<details>
<summary>Answer</summary>

- Output — `A D C B`.
- Sync code first — `A`, `D`.
- Microtasks (promise callbacks) are fully drained after every task → `C`.
- The timer callback is the next task → `B`.

</details>

### Medium · What happens after `await`?

```js
async function f() {
  console.log(1);
  await null;
  console.log(2);
}
console.log(3);
f();
console.log(4);
```

<details>
<summary>Answer</summary>

- Output — `3 1 4 2`.
- `async` function — runs synchronously up to the first `await`.
- `await` — the rest of the body is scheduled in a microtask; the caller's `console.log(4)` runs first.

</details>

### Medium · How the Promise executor behaves

```js
const p = new Promise((resolve) => {
  console.log('executor');
  resolve(1);
  resolve(2);
  console.log('after resolve');
});
p.then((v) => console.log('then', v));
console.log('sync end');
```

<details>
<summary>Answer</summary>

- Output — `executor`, `after resolve`, `sync end`, `then 1`.
- Executor — runs immediately and synchronously.
- Settle once — the first `resolve(1)` wins; later ones are ignored. `resolve` does not exit the function.

</details>

### Medium · Error handling with `fetch`

```js
try {
  const res = await fetch('/api/user');
  const user = await res.json();
  render(user);
} catch {
  showError();
}
```

What happens on a 404 or 500? Write the correct version.

<details>
<summary>Answer</summary>

- Problem — `fetch` rejects only on a network failure/abort; 404/500 resolve too. If the error page is HTML, `res.json()` throws a parse error; otherwise the error body gets passed to `render`.
- Fix:

```js
const res = await fetch('/api/user');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const user = await res.json();
```

- UX — a message that fits the status (401 → login, 404 → not found, 5xx → retry).

</details>

### Hard · An abortable `fetchJSON` with a timeout

Write `fetchJSON(url, { timeoutMs, signal })`: the request is aborted on timeout, the caller's signal is respected too, and HTTP errors are reported separately.

<details>
<summary>Answer</summary>

```js
async function fetchJSON(url, { timeoutMs = 8000, signal } = {}) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const res = await fetch(url, { signal: combined });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

- Abort — the real request is cancelled, not just a promise race.
- Errors — a `TimeoutError` on timeout, an `AbortError` on a caller abort (the DOMException `name`); the UI can treat the two differently.
- Older runtime — the same pattern with `AbortController` + `setTimeout` + `finally { clearTimeout }`.

</details>

## Sources — further reading

- [MDN using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/15-async-event-loop.md)
