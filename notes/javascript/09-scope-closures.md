---
id: js-scope-closures
title: Execution contexts scope and closures
track: javascript
order: 9
level: Intermediate
minutes: 4
summary: Scope — variable kahan accessible hai; lexical scope code ki location se decide hota hai.
tags: scope, closures, hoisting, execution-context, memory
visual: closures
---

## Quick revision

> Revision target — Closure mein captured binding aur independent function calls ko trace karke lifetime samjho.

- Scope — variable kahan accessible hai; lexical scope code ki location se decide hota hai.
- Block scope — `let`/`const` `{}` tak; `var` nearest function tak.
- Scope chain — naam local se outer scopes mein search hota hai.
- Closure — function outer bindings yaad rakhta hai, outer call khatam hone ke baad bhi.
- Live binding — closure latest binding padhta hai; automatic snapshot nahi.
- Loop trap — `var` callbacks same binding share; `let` har iteration ki binding deta hai.
- Hoisting — declarations pehle register; initialization ka timing alag hai.
- TDZ — lexical binding initialize hone tak access error deta hai.
- Memory — reachable closure captured objects ko alive rakh sakta hai.
- Use — private counters, callbacks aur function factories.
- Factory isolation — outer function ki har call apni local bindings banati hai.
- Captured reference — object reachable rahe toh closure se uske latest mutations dikh sakte hain.
- Shadowing trap — inner same-name binding TDZ mein ho toh outer value fallback nahi milti.

### Execution context

- Execution context — function call ka local execution state; stack active calls track karta hai.
- Call-stack overflow — unbounded synchronous recursion stack exhaust kar sakti hai; base/progress verify karo.
- Engine pipeline — source parse → execute → hot code optimize; engine internals language guarantees se alag.

### Edge cases aur reasoning

- Retained environment — closure poora call stack preserve nahi karta; needed reachable lexical environment function lifetime se survive kar sakta hai.
- Stale derived text — captured binding latest ho sakti hai, par pehle calculated message string automatic recompute nahi hoti.
- Explicit dispose — long-lived subscriptions captured large data retain kar sakti hain; unsubscribe aur cache bounds define karo.

## Research notes: Live bindings versus snapshots

- Closure binding read karta hai; pehle calculate ki hui string khud update nahi hoti.

## Example se samjho

```js
function counter() {
  let count = 0;
  return () => ++count;
}
const first = counter();
const second = counter();
console.log(first(), first(), second()); // 1 2 1
```

- Trace — `first` apni call ka `count` retain karta hai; `second` ki factory call nayi binding banati hai.
- Catch — `count` factory ke bahar rakho toh dono functions shared state use karenge.
- Check — captured value ko frozen snapshot mat bolo; closure us reachable lexical binding ko read/update karta hai.

## Recall aur practice

- Sawal — Factory ki do calls se bane counters same count share karenge?
- Jawaab — Har factory call apni local count binding banaye toh independent; module/global binding ho toh shared.
- Khud try karo — Do counters banao; pehle ko twice aur doosre ko once increment karke 2/1 verify karo, captured message versus live count compare karo.

## Practice questions

### Easy · `var` vs `let` loop timers

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log('var', i));
for (let j = 0; j < 3; j++) setTimeout(() => console.log('let', j));
```

Output kya hoga aur dono loops alag kyun behave karte hain?

<details>
<summary>Answer</summary>

- Output — `var 3` teen baar, phir `let 0`, `let 1`, `let 2`.
- `var` — poore function/script mein ek hi `i` binding; callbacks loop khatam hone ke baad chalte hain, tab `i === 3`.
- `let` — har iteration ki nayi `j` binding; har callback apni iteration wali binding capture karta hai.
- Catch — timers synchronous loop ke baad chalte hain, isliye `var` version mein final value hi dikhti hai.

</details>

### Easy · Shadowing aur TDZ

```js
let x = 'outer';
function show() {
  console.log(x);
  let x = 'inner';
}
show();
```

Kya print hoga?

<details>
<summary>Answer</summary>

- Result — `ReferenceError: Cannot access 'x' before initialization`.
- Kyun — function ke andar `let x` poore function scope mein register ho chuka hai; declaration line tak woh TDZ mein hai.
- Catch — inner binding outer `x` ko shadow karti hai, isliye engine fallback karke `'outer'` nahi padhta.

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
- `live` — call time par `name` binding padhta hai, jo `rename` ne update kar di.
- `saved` — `message` string factory call ke time ban chuki thi; closure binding yaad rakhta hai, purani string recompute nahi hoti.

</details>

### Medium · `once(fn)` implement karo

`once(fn)` likho: pehli call `fn` chalaye aur result yaad rakhe; baad ki calls wahi result return karein. `this` aur arguments preserve hone chahiye.

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

- Closure — `done` aur `result` har `once` call ki private state hain.
- `apply(this, args)` — method ki tarah use ho toh receiver bana rehta hai; isliye arrow function return nahi kiya.
- Policy — `done = true` call ke baad set kiya, toh `fn` throw kare to agli call retry karegi; "throw ke baad bhi block karo" chahiye toh pehle set karo.

</details>

### Hard · SPA mein listener leak

```js
function openPage(page) {
  const snapshot = structuredClone(page.bigState); // ~5 MB
  window.addEventListener('resize', () => layout(snapshot.id));
}
```

Har route change par `openPage` chalta hai. Kuch navigation ke baad memory badhti rehti hai. Kyun, aur fix kya hai?

<details>
<summary>Answer</summary>

- Cause — `window` app bhar alive rehta hai; har call ek naya listener add karta hai jo poore `snapshot` ko capture karta hai, isliye koi snapshot GC nahi hota.
- Fix 1 — closure mein sirf zaroori value rakho: `const id = page.bigState.id`.
- Fix 2 — listener ka owner banao aur page leave par remove karo:

```js
function openPage(page) {
  const controller = new AbortController();
  const id = page.bigState.id;
  window.addEventListener('resize', () => layout(id), { signal: controller.signal });
  return () => controller.abort(); // route leave par call karo
}
```

- Check — DevTools heap snapshot mein navigation ke baad retained snapshots count stable rehna chahiye.

</details>

### Hard · Private account with closures

`createAccount(initial)` banao: `deposit`, `withdraw` (balance negative na ho), `balance()` aur `history()`. Balance ya history bahar se directly change nahi honi chahiye.

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

- Privacy — `balance` aur `log` sirf returned methods ke closure mein reachable hain.
- Catch — `history()` internal array return kare toh caller `push`/mutate kar sakta hai; copy return karo.
- Validation — `!(amount > 0)` `NaN`, negative aur zero teeno reject karta hai.

</details>

## Sources — aur padhne ke liye

- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/09-scope-closures.md)
