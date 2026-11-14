---
id: js-scope-closures
title: Execution contexts scope and closures
track: javascript
order: 9
level: Intermediate
minutes: 4
summary: Scope — where a variable is accessible; lexical scope is decided by where the code is written.
tags: scope, closures, hoisting, execution-context, memory
visual: closures
---

## Quick revision

> Revision target — Trace the captured binding and independent function calls in a closure to understand lifetime.

- Scope — where a variable is accessible; lexical scope is decided by where the code is written.
- Block scope — `let`/`const` live up to the `{}`; `var` up to the nearest function.
- Scope chain — a name is searched from the local scope outwards.
- Closure — a function remembers outer bindings, even after the outer call has finished.
- Live binding — a closure reads the latest binding; it is not an automatic snapshot.
- Loop trap — `var` callbacks share one binding; `let` gives a binding per iteration.
- Hoisting — declarations are registered first; the timing of initialization is separate.
- TDZ — access throws an error until the lexical binding is initialized.
- Memory — a reachable closure can keep its captured objects alive.
- Use — private counters, callbacks and function factories.
- Factory isolation — every call of the outer function creates its own local bindings.
- Captured reference — while the object stays reachable, its latest mutations are visible through the closure.
- Shadowing trap — if an inner binding of the same name is in the TDZ, there is no fallback to the outer value.

### Execution context

- Execution context — the local execution state of a function call; the stack tracks active calls.
- Call-stack overflow — unbounded synchronous recursion can exhaust the stack; verify the base case and progress.
- Engine pipeline — source parse → execute → optimize hot code; engine internals are separate from language guarantees.

### Edge cases and reasoning

- Retained environment — a closure does not preserve the whole call stack; the reachable lexical environment it needs can outlive the function call.
- Stale derived text — a captured binding can be the latest, but a message string calculated earlier is not recomputed automatically.
- Explicit dispose — long-lived subscriptions can retain large captured data; define unsubscribe and cache bounds.

## Research notes: Live bindings versus snapshots

- A closure reads the binding; a string calculated earlier does not update itself.

## Understand it with an example

```js
function counter() {
  let count = 0;
  return () => ++count;
}
const first = counter();
const second = counter();
console.log(first(), first(), second()); // 1 2 1
```

- Trace — `first` retains the `count` of its own call; the factory call for `second` creates a new binding.
- Catch — keep `count` outside the factory and both functions will use shared state.
- Check — do not call the captured value a frozen snapshot; the closure reads/updates that reachable lexical binding.

## Recall and practice

- Question — Will counters created by two calls of the factory share the same count?
- Answer — Independent if every factory call creates its own local count binding; shared if it is a module/global binding.
- Try it yourself — Create two counters; increment the first twice and the second once and verify 2/1; compare a captured message with the live count.

## Practice questions

### Easy · `var` vs `let` loop timers

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log('var', i));
for (let j = 0; j < 3; j++) setTimeout(() => console.log('let', j));
```

What is the output, and why do the two loops behave differently?

<details>
<summary>Answer</summary>

- Output — `var 3` three times, then `let 0`, `let 1`, `let 2`.
- `var` — a single `i` binding for the whole function/script; the callbacks run after the loop ends, when `i === 3`.
- `let` — a new `j` binding for every iteration; each callback captures the binding of its own iteration.
- Catch — timers run after the synchronous loop, so the `var` version only ever shows the final value.

</details>

### Easy · Shadowing and the TDZ

```js
let x = 'outer';
function show() {
  console.log(x);
  let x = 'inner';
}
show();
```

What gets printed?

<details>
<summary>Answer</summary>

- Result — `ReferenceError: Cannot access 'x' before initialization`.
- Why — `let x` inside the function is already registered for the whole function scope; it is in the TDZ until its declaration line.
- Catch — the inner binding shadows the outer `x`, so the engine does not fall back and read `'outer'`.

</details>

### Medium · Live binding vs saved string

```js
function makeGreeter() {
  let name = 'Asha';
  const message = `Hi ${name}`;
  return {
    rename(next) { name = next; },
    live: () => `Hi ${name}`,
    saved: () => message,
  };
}
const g = makeGreeter();
g.rename('Ravi');
console.log(g.live(), '|', g.saved());
```

<details>
<summary>Answer</summary>

- Output — `Hi Ravi | Hi Asha`.
- `live` — reads the `name` binding at call time, which `rename` has updated.
- `saved` — the `message` string was built when the factory was called; a closure remembers the binding, the old string is not recomputed.

</details>

### Medium · Implement `once(fn)`

Write `once(fn)`: the first call runs `fn` and remembers the result; later calls return that same result. `this` and the arguments must be preserved.

<details>
<summary>Answer</summary>

```js
function once(fn) {
  let done = false;
  let result;
  return function (...args) {
    if (!done) {
      result = fn.apply(this, args);
      done = true;
    }
    return result;
  };
}
```

- Closure — `done` and `result` are private state of each `once` call.
- `apply(this, args)` — keeps the receiver when it is used as a method; that is why an arrow function is not returned.
- Policy — `done = true` is set after the call, so if `fn` throws the next call retries; set it before if you want "block even after a throw".

</details>

### Hard · A listener leak in an SPA

```js
function openPage(page) {
  const snapshot = structuredClone(page.bigState); // ~5 MB
  window.addEventListener('resize', () => layout(snapshot.id));
}
```

`openPage` runs on every route change. After some navigation, memory keeps growing. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Cause — `window` lives for the whole app; every call adds a new listener that captures the entire `snapshot`, so no snapshot is ever garbage collected.
- Fix 1 — keep only the needed value in the closure: `const id = page.bigState.id`.
- Fix 2 — give the listener an owner and remove it when leaving the page:

```js
function openPage(page) {
  const controller = new AbortController();
  const id = page.bigState.id;
  window.addEventListener('resize', () => layout(id), { signal: controller.signal });
  return () => controller.abort(); // call this when leaving the route
}
```

- Check — in a DevTools heap snapshot, the count of retained snapshots should stay stable after navigation.

</details>

### Hard · Private account with closures

Build `createAccount(initial)`: `deposit`, `withdraw` (the balance must not go negative), `balance()` and `history()`. The balance and history must not be directly changeable from outside.

<details>
<summary>Answer</summary>

```js
function createAccount(initial = 0) {
  let balance = initial;
  const log = [];
  const record = (type, amount) => log.push({ type, amount, balance });
  return {
    deposit(amount) {
      if (!(amount > 0)) throw new RangeError('amount must be positive');
      balance += amount;
      record('deposit', amount);
    },
    withdraw(amount) {
      if (!(amount > 0) || amount > balance) throw new RangeError('invalid withdrawal');
      balance -= amount;
      record('withdraw', amount);
    },
    balance: () => balance,
    history: () => log.map((entry) => ({ ...entry })),
  };
}
```

- Privacy — `balance` and `log` are reachable only through the closure of the returned methods.
- Catch — if `history()` returns the internal array, the caller can `push`/mutate it; return a copy.
- Validation — `!(amount > 0)` rejects all three: `NaN`, negative and zero.

</details>

## Sources — further reading

- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/09-scope-closures.md)
