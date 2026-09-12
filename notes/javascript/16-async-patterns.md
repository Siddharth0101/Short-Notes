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

## Sources

[MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) explains promise composition and cancellation boundaries.
