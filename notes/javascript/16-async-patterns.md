---
id: javascript-async-patterns
title: Async patterns and bounded concurrency
track: javascript
order: 16
level: Advanced
minutes: 25
summary: Build cancellation, retries and concurrency limits with explicit failure behavior.
tags: promises, concurrency, cancellation, machine-coding
---

## Mental model

Async ka matlab unlimited parallel work nahi hai. A promise represents an eventual outcome; it does not own cancellation, scheduling or resource limits. Before writing an async utility, define four contracts: result order, maximum in-flight work, failure policy and cancellation ownership. These decisions matter more than remembering a combinator name.

> **Core takeaway:** A concurrency limit bounds in-flight work, not the total number of jobs.

## Worked implementation

This worker pool preserves input order and caps active mapper calls. The mapper receives an index so repeated values remain distinguishable. The contract is to settle every item, similar to allSettled, rather than stop on the first rejection.

```javascript
async function mapLimit(items, limit, mapper) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = {
          status: 'fulfilled',
          value: await mapper(items[index], index),
        };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}
```

For inputs A, B, C and limit 2, workers start A and B. If B finishes first, its worker starts C. Output slots still stay A, B, C. cursor increment happens synchronously before await on the single JS thread, so two workers do not claim the same index. This reasoning does not transfer to shared memory across actual threads.

Scheduling overhead is O(n), results use O(n) memory, and at most min(n, limit) mapper calls remain active. Network duration determines elapsed time; a concurrency limit alone is not a requests-per-second rate limit.

## Failure and cancellation decisions

Promise.all rejects when one input rejects, but other operations continue. Promise.race with a timeout also leaves the losing operation running. Abort a fetch through its signal, and check response.ok because HTTP 404 is a response, not a transport rejection. Cancellation requires cooperation from the underlying operation.

Retry only failures your application defines as transient. Use a bounded attempt count and total deadline. A retried write needs a stable operation identity; generating a fresh identifier on every attempt defeats deduplication. If a downstream server keeps processing after cancellation, the client cannot infer that no write happened.

## Practice

Use manually controlled promises to verify that active mapper calls never exceed two. Resolve B before A and inspect output order. Reject C and ensure its slot contains a rejected result. Check empty input, limit zero and synchronous mapper exceptions. Then add AbortSignal support with an explicit contract: stop starting new items, pass the signal into active work, and decide how unstarted slots are represented.

## Interview questions

**Why does await inside forEach not wait for the whole loop?** forEach ignores the returned promises. Use for...of for sequencing or map plus a combinator for concurrent results.

**Why can a pool still overload an API?** Fast responses can yield high request rates even with a small concurrency cap. Add rate control when the service contract requires it.

## Research notes: Independent outcomes with allSettled

Independent dashboard panels can show partial results. `allSettled` returns outcomes in input order, regardless of completion order.

```js
const outcomes = await Promise.allSettled([
  Promise.resolve({ unread: 4 }),
  Promise.reject(new Error('Recommendations unavailable')),
]);
console.log(outcomes.map(item => item.status));
// ["fulfilled", "rejected"]
```

Inspect each outcome. Replacing every error with an empty array hides the difference between empty data and failed loading. Collecting outcomes does not limit how many jobs you start.

**Interview check:** Will allSettled finish when one input promise never settles?

**Answer:** No. It waits for every input to settle. Define deadlines separately; also distinguish a timed-out observation from cancellation of the underlying work.

**Practice:** Add a never-settling job and design a deadline without losing successful panels.

[Read the source — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Five jobs take `[50,10,10,10,10]` milliseconds and two workers take the next job whenever free. Sketch starts and completions, ignoring scheduling overhead.

> **Hint:** One worker can finish several short jobs while the long job continues.

**Answer guide — compare after attempting:** Jobs 1 and 2 start at time 0. The second worker starts jobs 3, 4, and 5 at times 10, 20, and 30; they finish at 20, 30, and 40. Job 1 finishes at 50. At most two are active; preserve result indices if input order matters.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) explains promise composition and cancellation boundaries.
