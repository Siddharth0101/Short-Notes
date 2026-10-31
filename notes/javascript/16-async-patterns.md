---
id: javascript-async-patterns
title: Async patterns and bounded concurrency
track: javascript
order: 16
level: Advanced
minutes: 3
summary: Sequential await — next kaam previous result par depend kare tab.
tags: promises, concurrency, cancellation, machine-coding
---

## Quick revision

> Revision target — Dependencies dekhkar sequential ya concurrent work choose karo; failure aur cancellation ke contracts separate rakho.

- Sequential await — next kaam previous result par depend kare tab.
- `Promise.all` — sab successful chahiye; ek reject toh reject, baaki auto-cancel nahi.
- `allSettled` — har operation ka success/failure collect karo.
- `race` — pehla settled result; `any` — pehla fulfilled result.
- Timeout — race timeout underlying request cancel nahi karta; abort alag karo.
- Concurrency limit — ek saath bounded requests; server ko flood mat karo.
- Retry — transient failures par backoff + jitter; total attempts/deadline bounded rakho.
- Idempotency — retry se duplicate side effect na bane.
- Stale response — old request ko latest state overwrite na karne do.
- Async iteration — `for...of` + await sequential; async `forEach` completion wait nahi karta.
- Async generator — `async function*` values ko gradually yield; `for await...of` se consume.
- Error ownership — fire-and-forget task ki rejection explicitly handle karo.
- Request dedupe — same in-flight read share karo; different auth/query keys ko mix mat karo.

### Edge cases aur reasoning

- Empty combinators — all/allSettled empty par fulfilled, any empty par AggregateError, race empty par indefinitely pending Promise deta hai.
- Result order — all/allSettled input order preserve; completion order se indexes map mat karo.
- Retry amplification — nested layers ki retries multiply ho sakti hain; operation-wide attempt budget aur deadline share karo.

## Research notes: Independent outcomes with allSettled

- Independent dashboard panels partial results dikha sakte hain.

## Example se samjho

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

- Setup — top-level `await` ko module mein chalao, ya async function ke andar rakho.
- Trace — independent results retain hote hain; failed recommendations successful profile ko discard nahi karti.
- Catch — `allSettled` concurrency limit nahi lagata; thousands of requests ke liye bounded worker pool alag chahiye.

## Recall aur practice

- Sawal — Promise.all reject hone par doosri payment request kyun still complete ho sakti hai?
- Jawaab — Combinator rejection underlying operations cancel nahi karti; side-effect identity aur supported cancellation separately chahiye.
- Khud try karo — Concurrency-2 mapper likho; completion order reversed ho tab input-order results, active count <=2 aur rejected work policy verify karo.

## Practice questions

### Easy · Sequential vs parallel await

```js
const user = await getUser();     // ~300ms
const orders = await getOrders(); // ~300ms, user par depend nahi
```

Total time kitna? Faster version?

<details>
<summary>Answer</summary>

- Abhi — ~600ms; doosri request pehli ke khatam hone tak shuru hi nahi hoti.
- Fix — `const [user, orders] = await Promise.all([getUser(), getOrders()]);` → ~300ms.
- Sequential tab sahi — jab doosri call ko pehli ka result chahiye (e.g. `getOrders(user.id)`).

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

- `all` — ~50ms par `all: boom`; pehli rejection par reject.
- `allSettled` — `['fulfilled', 'rejected', 'fulfilled']`, sab settle hone ke baad.
- Catch — `Promise.all` baaki promises cancel nahi karta; woh background mein chalte rehte hain. Cancel chahiye toh `AbortController` pass karo.

</details>

### Medium · Search mein stale response

User `re` type karta hai, phir `react`. `re` ki request slow hai aur baad mein aati hai, results overwrite ho jaate hain. Fix karo.

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

- Abort — purani request cancel; uska response render tak pahunchta hi nahi.
- Alternative — request id/counter rakho aur sirf latest id ka result apply karo.
- Debounce isse alag hai — requests kam karta hai, out-of-order problem solve nahi karta.

</details>

### Medium · Backoff ke saath `retry`

`retry(fn, { retries = 3, baseMs = 200 })` likho: exponential backoff + jitter, aur 4xx jaise non-retryable errors par turant fail.

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

- `isRetryable` — network errors, 429, 503 haan; 400/401/404 nahi.
- Jitter — saare clients ek saath retry karke server ko dobara na girayein.
- Idempotency — POST retry tabhi safe jab server idempotency key se duplicate ko pehchane.

</details>

### Hard · `mapLimit` (bounded concurrency)

`mapLimit(items, limit, fn)` likho: ek time par max `limit` async jobs, results input order mein, pehle error par reject.

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

- Worker pool — `limit` workers shared `next` index uthate hain; JS single-threaded hai isliye `next++` race-free.
- Order — result `index` par likha jaata hai, completion order par nahi.
- Error — ek job reject hote hi `Promise.all` reject hota hai, par baaki workers naye items uthate rehte hain. Rokna ho toh shared `failed` flag set karo aur loop mein check karo.

</details>

## Sources — aur padhne ke liye

- [MDN Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/16-async-patterns.md)
