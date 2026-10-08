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

## Recall aur practice

- Sawal — Promise.all reject hone par doosri payment request kyun still complete ho sakti hai?
- Jawaab — Combinator rejection underlying operations cancel nahi karti; side-effect identity aur supported cancellation separately chahiye.
- Khud try karo — Concurrency-2 mapper likho; completion order reversed ho tab input-order results, active count <=2 aur rejected work policy verify karo.

## Sources — aur padhne ke liye

- [MDN Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

- [Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN promise guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/16-async-patterns.md)
