---
id: interview-javascript
title: JavaScript interview playbook
track: interview
order: 1
level: Intermediate
minutes: 1
summary: Answer — definition + ek key catch; code/output poochha ho toh exact result do.
tags: javascript, interview, closures, event-loop, coding
visual: event-loop
---

## Quick revision

- Answer — definition + ek key catch; code/output poochha ho toh exact result do.
- `var`/`let`/`const` — function scope / block scope / fixed binding.
- Closure — outer bindings accessible; frozen snapshot assume mat karo.
- `this` — regular call-site se, arrow outer scope se.
- Async order — sync stack → microtasks → eligible tasks; runtime assumptions bolo.
- Debounce — last call ke baad delay; throttle — call frequency limit.
- Debug — reproduce, state/queue trace, smallest fix, regression case.
- Project — problem, apna contribution, decision aur measured result bolo.
- Output puzzle — runtime, strict/module mode aur sync/async boundaries pehle identify.
- Unknown API — behavior invent mat karo; assumption bolo aur minimal experiment suggest.
- Answer length — definition, one example, one caveat; follow-up par detail kholo.

## Research notes: Explain the contract before coding

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/01-javascript-playbook.md)
