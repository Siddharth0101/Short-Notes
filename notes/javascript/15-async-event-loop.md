---
id: js-async-event-loop
title: Event loop promises and resilient fetching
track: javascript
order: 15
level: Advanced
minutes: 30
summary: Tasks, microtasks, promise composition, cancellation aur request races ko trace karo.
tags: async, promises, event-loop, fetch, cancellation
visual: event-loop
---

## Mental model

Browser mein current JavaScript job run-to-completion hota hai. Async I/O host environment handle karta hai; completion ke baad callback continuation schedule hoti hai. Promise fulfilled hone se `.then` callback current synchronous line ke beech execute nahi hota. `await` surrounding async function ko suspend karta hai, poore browser ko block nahi karta.

> **Core takeaway:** Promise reactions run after the current synchronous work; a zero-delay timer is still scheduled work.

## Trace the order

```js
console.log("A");
setTimeout(() => console.log("D"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("B");
// Browser output: A, B, C, D
```

Synchronous stack finish hone ke baad microtask checkpoint promise reaction run karta hai. Timer future task mein eligible hota hai. Zero delay exact zero milliseconds ki guarantee nahi deta. Microtasks jo further microtasks add karte rahein woh rendering aur tasks ko starve kar sakte hain. Browser ordering ko Node ke phase-specific behavior par blindly apply mat karo.

## Fetch with explicit failure handling

```js
async function getTopic(id, signal) {
  const response = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
    signal,
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Topic request failed (${response.status})`);
  }
  return response.json();
}

const controller = new AbortController();
try {
  const topics = await Promise.all([
    getTopic("closures", controller.signal),
    getTopic("promises", controller.signal)
  ]);
  console.log(topics);
} catch (error) {
  if (error.name !== "AbortError") console.error(error.message);
}
// Top-level await requires a module. Call controller.abort() to cancel.
```

Fetch HTTP 404/500 par normally resolve hota hai; `response.ok` check required hai. Network failure aur HTTP failure alag layers hain. JSON parsing khud fail ho sakti hai. Abort server par already completed side effect undo nahi karta.

## Promise composition

`Promise.all` ordered results deta hai aur first rejection par combined promise reject karta hai; other running work automatically cancel nahi hota. `allSettled` har outcome return karta hai. `race` first settled outcome deta hai. `any` first fulfillment deta hai, aur sab reject ho to AggregateError. Independent requests parallel start karo; dependent request ko previous result ka wait karna hoga. Thousands of requests ke liye unbounded Promise.all ki jagah bounded concurrency use karo.

## Retrying transient failures

```js
async function withRetry(fn, { attempts = 3, baseDelay = 300 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      await new Promise(resolve => setTimeout(resolve, baseDelay * 2 ** (attempt - 1)));
    }
  }
  throw lastError;
}

await withRetry(() => getTopic("closures"));
```

Exponential backoff har retry ke beech delay badhata hai taaki failing server ko overwhelm na kare. Yeh loop deliberately sequential hai — retry attempts ek dusre ke baad hi chalne chahiye, parallel nahi, warna woh ek saath teen requests fire kar dega.

`.then` chaining aur `async`/`await` equivalent hain, sirf readability alag hai:

```js
// Same logic, two styles
function loadProfileThen(id) {
  return getTopic(id)
    .then(topic => enrich(topic))
    .catch(error => {
      console.error(error.message);
      throw error;
    });
}

async function loadProfileAsync(id) {
  try {
    const topic = await getTopic(id);
    return await enrich(topic);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
```

Async/await sequential logic ko synchronous jaisa readable banata hai, especially jab multiple dependent steps ho; deeply nested `.then` chains ("callback pyramid" ka promise version) yahan avoid ho jaati hain.

## Gotchas

Promise constructor ka executor synchronous run hota hai. Async executor Promise constructor mein mat use karo; errors ka propagation confusing hota hai. `forEach(async ...)` completion wait nahi karta. Sequential work ke liye `for...of` plus await, independent work ke liye map plus Promise.all use karo. Search UI mein old request late finish karke new result overwrite kar sakti hai; abort ya request-generation guard lagao.

## Common mistakes

- **Wrong assumption:** `async` function hamesha kaam parallel/background mein karti hai. **Why it breaks:** `async` sirf return-value-ko-Promise-mein-wrap-karna aur `await` par suspend hone ki guarantee deta hai; pehle `await` tak function body poori tarah synchronous chalti hai, current call stack ko block karte hue. **Fix:** Samjho ki `async`/`await` concurrency create nahi karta, sirf asynchronous continuation ko sequential-jaisa likhne deta hai.
- **Wrong assumption:** `try/catch` ek async function ke andar har error catch kar lega, including unrelated timer callback ka error. **Why it breaks:** `setTimeout` callback apne aap mein ek separate call stack/task hai; uske andar thrown error us try/catch ke bahar hai aur uncaught exception ban jaata hai. **Fix:** Timer-based operation ko khud Promise mein wrap karo (jaisa `fetch` karta hai) taaki reject sahi jagah propagate ho.
- **Wrong assumption:** `Promise.race` losing operations ko automatically cancel kar deta hai. **Why it breaks:** `race` sirf pehla settled result return karta hai; baaki promises background mein chalte reh sakte hain aur unke side effects (duplicate write, duplicate network call) ho sakte hain. **Fix:** Race ka winner decide hote hi baaki operations ko `AbortController` se explicitly cancel karo.

Real app mein retry-with-backoff pattern payment APIs aur flaky third-party integrations mein common hai; race-without-cancel wahi stale-search-result bug create karta hai jo isi chapter mein pehle discuss hua.

## Practice

Search box banao with debounce, abort aur loading/error/empty states. Slow first request aur fast second request simulate karo. Verify karo ki latest query ka result hi visible rahe.

## Interview questions

**Q. Promise parallel thread hai?** Nahi. Promise future outcome ka object hai; underlying operation execution model decide karta hai.

**Q. Await loop ko fast banata hai?** Nahi. Har iteration await kare to work sequential hota hai. Concurrency explicitly design karni padti hai.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Predict a script that logs A, schedules a zero-delay timer logging B, queues `Promise.resolve().then(() => console.log('C'))`, then logs D.

> **Hint:** Finish the current script before draining its promise reactions.

**Answer guide — compare after attempting:** The order is A, D, C, B in this ordinary single-script scenario. The timer delay does not make it interrupt synchronous code. Explain the queue boundary instead of memorizing letters; adding more asynchronous sources requires a fresh trace.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) composition explain karta hai. [MDN using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) HTTP errors aur cancellation explain karta hai.
