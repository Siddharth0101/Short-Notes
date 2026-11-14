---
id: javascript-async-patterns
title: Async patterns and bounded concurrency
track: javascript
order: 16
level: Advanced
minutes: 3
summary: Sequential await — for when the next task depends on the previous result.
tags: promises, concurrency, cancellation, machine-coding
---

## Quick revision

> Revision target — Look at the dependencies to choose sequential or concurrent work; keep the failure and cancellation contracts separate.

- Sequential await — for when the next task depends on the previous result.
- `Promise.all` — needs every one to succeed; one rejection rejects it, and the rest are not auto-cancelled.
- `allSettled` — collects the success/failure of every operation.
- `race` — the first settled result; `any` — the first fulfilled result.
- Timeout — a race timeout does not cancel the underlying request; abort it separately.
- Concurrency limit — a bounded number of requests at once; do not flood the server.
- Retry — backoff + jitter on transient failures; keep the total attempts/deadline bounded.
- Idempotency — a retry must not create a duplicate side effect.
- Stale response — do not let an old request overwrite the latest state.
- Async iteration — `for...of` + await is sequential; an async `forEach` does not wait for completion.
- Async generator — `async function*` yields values gradually; consume it with `for await...of`.
- Error ownership — handle the rejection of a fire-and-forget task explicitly.
- Request dedupe — share the same in-flight read; do not mix different auth/query keys.

### Edge cases and reasoning

- Empty combinators — all/allSettled fulfil on empty input, any gives an AggregateError, and race gives a Promise that stays pending indefinitely.
- Result order — all/allSettled preserve input order; do not map indexes from completion order.
- Retry amplification — retries in nested layers can multiply; share an operation-wide attempt budget and deadline.

## Research notes: Independent outcomes with allSettled

- Independent dashboard panels can show partial results.

## Understand it with an example

```js
const results = await Promise.allSettled([
  Promise.resolve("profile"),
  Promise.reject(new Error("recommendations unavailable")),
]);
const usable = results
  .filter((result) => result.status === "fulfilled")
  .map((result) => result.value);
console.log(usable); // ["profile"]
```

- Setup — run top-level `await` in a module, or keep it inside an async function.
- Trace — independent results are retained; the failed recommendations do not discard the successful profile.
- Catch — `allSettled` does not apply a concurrency limit; thousands of requests need a separate bounded worker pool.

## Recall and practice

- Question — Why can the second payment request still complete after Promise.all rejects?
- Answer — A combinator rejection does not cancel the underlying operations; side-effect identity and supported cancellation are needed separately.
- Try it yourself — Write a concurrency-2 mapper; verify input-order results even when completion order is reversed, an active count <=2 and the policy for rejected work.

## Practice questions

### Easy · Sequential vs parallel await

```js
const user = await getUser();     // ~300ms
const orders = await getOrders(); // ~300ms, does not depend on user
```

What is the total time? A faster version?

<details>
<summary>Answer</summary>

- Now — ~600ms; the second request does not even start until the first has finished.
- Fix — `const [user, orders] = await Promise.all([getUser(), getOrders()]);` → ~300ms.
- Sequential is right — when the second call needs the first one's result (e.g. `getOrders(user.id)`).

</details>

### Medium · `all` vs `allSettled`

```js
const jobs = [delay(100, 'a'), fail(50, 'boom'), delay(200, 'c')];
await Promise.all(jobs).catch((e) => console.log('all:', e.message));
const results = await Promise.allSettled(jobs);
console.log(results.map((r) => r.status));
```

<details>
<summary>Answer</summary>

- `all` — `all: boom` at ~50ms; it rejects on the first rejection.
- `allSettled` — `['fulfilled', 'rejected', 'fulfilled']`, after everything has settled.
- Catch — `Promise.all` does not cancel the remaining promises; they keep running in the background. Pass an `AbortController` if you need cancellation.

</details>

### Medium · A stale response in search

The user types `re`, then `react`. The request for `re` is slow and arrives later, overwriting the results. Fix it.

<details>
<summary>Answer</summary>

```js
let controller;
async function search(query) {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
    render(await res.json());
  } catch (error) {
    if (error.name !== 'AbortError') showError(error);
  }
}
```

- Abort — the old request is cancelled; its response never reaches the render.
- Alternative — keep a request id/counter and apply only the result of the latest id.
- Debounce is different — it reduces requests; it does not solve the out-of-order problem.

</details>

### Medium · `retry` with backoff

Write `retry(fn, { retries = 3, baseMs = 200 })`: exponential backoff + jitter, and fail immediately on non-retryable errors such as 4xx.

<details>
<summary>Answer</summary>

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function retry(fn, { retries = 3, baseMs = 200, isRetryable = () => true } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= retries || !isRetryable(error)) throw error;
      await sleep(baseMs * 2 ** attempt * (0.5 + Math.random()));
    }
  }
}
```

- `isRetryable` — yes for network errors, 429 and 503; no for 400/401/404.
- Jitter — so that all clients do not retry together and bring the server down again.
- Idempotency — retrying a POST is safe only when the server recognizes the duplicate through an idempotency key.

</details>

### Hard · `mapLimit` (bounded concurrency)

Write `mapLimit(items, limit, fn)`: at most `limit` async jobs at a time, results in input order, reject on the first error.

<details>
<summary>Answer</summary>

```js
async function mapLimit(items, limit, fn) {
  if (!(limit >= 1)) throw new RangeError('limit must be >= 1');
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
```

- Worker pool — `limit` workers take from a shared `next` index; JS is single-threaded, so `next++` is race-free.
- Order — a result is written at its `index`, not in completion order.
- Error — as soon as one job rejects, `Promise.all` rejects, but the remaining workers keep picking up new items. To stop them, set a shared `failed` flag and check it in the loop.

</details>

## Sources — further reading

- [MDN Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/16-async-patterns.md)
