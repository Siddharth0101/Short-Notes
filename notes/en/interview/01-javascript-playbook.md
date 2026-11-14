---
id: interview-javascript
title: JavaScript interview playbook
track: interview
order: 1
level: Intermediate
minutes: 3
summary: Answer — a definition plus one key catch; give the exact result when code or output is asked.
tags: javascript, interview, closures, event-loop, coding
visual: event-loop
---

## Quick revision

> Revision target — Explain a definition with an exact runtime trace, a concrete example and one caveat.

- Answer — a definition + one key catch; give the exact result when code/output is asked.
- `var`/`let`/`const` — function scope / block scope / fixed binding.
- Closure — outer bindings stay accessible; do not assume a frozen snapshot.
- `this` — from the call site for a regular function, from the outer scope for an arrow.
- Async order — sync stack → microtasks → eligible tasks; state your runtime assumptions.
- Debounce — a delay after the last call; throttle — limit the call frequency.
- Debug — reproduce, trace the state/queue, the smallest fix, a regression case.
- Project — state the problem, your own contribution, the decision and the measured result.
- Output puzzle — first identify the runtime, strict/module mode and the sync/async boundaries.
- Unknown API — do not invent behaviour; state the assumption and suggest a minimal experiment.
- Answer length — a definition, one example, one caveat; open up the detail on a follow-up.

### Quick answer checks

- Output trace — mark sync, microtask and task separately; code before an await can be synchronous.
- Polyfill answer — the native contract first: this, holes, callback args, mutation and error cases.

### Edge cases and reasoning

- Contract-first drill — first clarify debounce trailing/leading, cancellation, this/args and return semantics; do not silently invent unspecified behaviour.
- Runtime-specific trace — specify browser versus Node, ESM versus classic/CJS; give a conditional answer for an environment-dependent scheduling puzzle.
- Evidence-based self-review — record the predicted output and the actual observation separately; do not treat a correct guess without a mechanism explanation as complete mastery.

## Research notes: Explain the contract before coding

- The linked Amazon guidance focuses on applying fundamentals to problems; merely memorizing details is not the learning goal.

## Understand it with an example

- Scenario — A function creates a local count of zero and the returned callback increments count. The same returned callback is called twice.
- Reasoning — The calls can observe count 1, then 2: the closure retains the same outer binding. Call the factory again and you get a separate counter binding.
- Catch — Calling a closure a frozen value is the wrong model; clarify with the interviewer what the callback returns/prints and test the explanation with two independent counters.

## Recall and practice

- Question — Which requirements would you clarify with the interviewer before implementing debounce?
- Answer — Trailing/leading behaviour, the latest args/receiver, cancel/flush, the delay range and the returned-result contract; write code once the scope is agreed.
- Try it yourself — A 15-minute drill: predict an output, reason about a closure/this, implement debounce; verify a burst, cancellation and two independent wrappers.

## Practice questions

### Easy · Explain a closure in 30 seconds

<details>
<summary>Answer</summary>

- Definition — "A closure is a function that remembers the variables of its lexical scope, even after the outer function has returned."
- Example — a counter factory: each call has its own private `count`.
- Use — private state, callbacks, memoization.
- Catch — it is a live binding, not a snapshot; capturing large objects can hold memory.

</details>

### Medium · Trace an output puzzle

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => {
  console.log(3);
  setTimeout(() => console.log(4));
});
(async () => {
  console.log(5);
  await null;
  console.log(6);
})();
console.log(7);
```

<details>
<summary>Answer</summary>

- Output — `1 5 7 3 6 2 4`.
- Sync — `1`, the `5` of the async IIFE, `7`.
- Microtasks (queue order) — `3` (the first then), then `6` (the await continuation).
- Timers — `2` (scheduled first), `4` (scheduled inside a microtask).
- Interview tip — talk in three columns: sync, microtasks, macrotasks.

</details>

### Medium · `Promise.all` polyfill

<details>
<summary>Answer</summary>

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = [...iterable];
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        results[index] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
```

- Order — write at the index, not in completion order.
- Non-promises — wrap with `Promise.resolve`.
- Empty — `[]` immediately.

</details>

### Medium · "I don't remember this API"

The interviewer asks about `Array.prototype.findLast`, which you have not used.

<details>
<summary>Answer</summary>

- Honest — "I don't remember the exact signature, but from the name it searches from the end, like `find`."
- Reason — guess the contract and say how you would verify it (MDN, a quick console test).
- Fallback — show an implementation without the API (a reverse loop).
- Avoid — a confident wrong answer; interviewers look at reasoning and honesty.

</details>

### Hard · Implement `throttle` + a test plan

<details>
<summary>Answer</summary>

```js
function throttle(fn, wait) {
  let last = 0;
  let timer = null;
  let pendingArgs = null;
  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      last = now;
      fn.apply(this, args);
    } else {
      pendingArgs = args;
      timer ??= setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, pendingArgs);
      }, remaining);
    }
  };
}
```

- Behaviour — the leading call runs immediately, and the last of the calls within the window (trailing) runs at its end.
- Tests — fake timers: a call at 0ms, a call at 50ms (deferred), the trailing call at 100ms with the latest args.
- State the trade-off — throttle for scroll/resize; debounce for a search input.

</details>

## Sources — further reading

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

## Code practice

- [Examples — when you want to revise the code](../../../examples/interview/01-javascript-playbook.md)
