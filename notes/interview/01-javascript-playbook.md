---
id: interview-javascript
title: JavaScript interview playbook
track: interview
order: 1
level: Intermediate
minutes: 3
summary: Answer — definition + ek key catch; code/output poochha ho toh exact result do.
tags: javascript, interview, closures, event-loop, coding
visual: event-loop
---

## Quick revision

> Revision target — Definition ko exact runtime trace, concrete example aur one caveat ke saath explain karo.

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

### Quick answer checks

- Output trace — sync, microtask aur task ko alag mark; await ke pehle ka code synchronous ho sakta hai.
- Polyfill answer — native contract pehle: this, holes, callback args, mutation aur error cases.

### Edge cases aur reasoning

- Contract-first drill — debounce trailing/leading, cancellation, this/args aur return semantics pehle clarify; unspecified behavior silently invent mat karo.
- Runtime-specific trace — browser versus Node, ESM versus classic/CJS specify; scheduling puzzle ka environment-dependent answer conditional do.
- Evidence-based self-review — predicted output aur actual observation separately record; correct guess bina mechanism explanation ko complete mastery mat maano.

## Research notes: Explain the contract before coding

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Example se samjho

- Scenario — Function local count zero banata hai aur returned callback count increment karta hai. Same returned callback two baar call hota hai.
- Reasoning — Calls count 1, phir 2 observe kar sakti hain: closure same outer binding retain karti hai. Factory dobara call karoge toh separate counter binding milegi.
- Catch — Closure ko frozen value bolna wrong model hai; interviewer se callback kya return/print karta hai clarify karo aur two independent counters se explanation test karo.

## Recall aur practice

- Sawal — Debounce implement karne se pehle kaunse requirements interviewer se clarify karoge?
- Jawaab — Trailing/leading behavior, latest args/receiver, cancel/flush, delay range aur returned-result contract; scope agreed hone par code karo.
- Khud try karo — 15-minute drill: output predict, closure/this reason, debounce implement; burst, cancellation aur two independent wrappers verify karo.

## Practice questions

### Easy · Closure 30 seconds mein explain karo

<details>
<summary>Answer</summary>

- Definition — "Closure woh function hai jo apne lexical scope ke variables yaad rakhta hai, outer function return hone ke baad bhi."
- Example — counter factory: har call ka apna private `count`.
- Use — private state, callbacks, memoization.
- Catch — live binding hai, snapshot nahi; bade objects capture karke memory hold kar sakta hai.

</details>

### Medium · Output puzzle ko trace karo

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
- Sync — `1`, async IIFE ka `5`, `7`.
- Microtasks (queue order) — `3` (pehla then), phir `6` (await continuation).
- Timers — `2` (pehle schedule hua), `4` (microtask ke andar schedule).
- Interview tip — teen columns bolo: sync, microtasks, macrotasks.

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

- Order — index par likho, completion order par nahi.
- Non-promises — `Promise.resolve` se wrap.
- Empty — turant `[]`.

</details>

### Medium · "Yeh API mujhe yaad nahi"

Interviewer `Array.prototype.findLast` ke baare mein poochta hai jo tumne use nahi kiya.

<details>
<summary>Answer</summary>

- Honest — "Exact signature yaad nahi, par naam se lagta hai `find` jaisa end se search karta hai."
- Reason — contract guess karo aur verify kaise karoge batao (MDN, quick console test).
- Fallback — bina API ke implement karke dikhao (reverse loop).
- Avoid — confident galat answer; interviewers reasoning aur honesty dekhte hain.

</details>

### Hard · `throttle` implement + test plan

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

- Behaviour — leading call turant, window ke andar ke calls ka last (trailing) end par.
- Tests — fake timers: 0ms par call, 50ms par call (deferred), 100ms par trailing with latest args.
- Trade-off bolo — scroll/resize ke liye throttle; search input ke liye debounce.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/01-javascript-playbook.md)
