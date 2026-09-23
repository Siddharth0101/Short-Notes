---
id: javascript-async-patterns
title: Async patterns and bounded concurrency
track: javascript
order: 16
level: Advanced
minutes: 1
summary: Sequential await — next kaam previous result par depend kare tab.
tags: promises, concurrency, cancellation, machine-coding
---

## Quick revision

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

## Research notes: Independent outcomes with allSettled

- Independent dashboard panels partial results dikha sakte hain.

## Sources — aur padhne ke liye

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/16-async-patterns.md)
