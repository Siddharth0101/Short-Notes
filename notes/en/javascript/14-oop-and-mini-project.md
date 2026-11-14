---
id: js-oop-mini-project
title: OOP pillars and a banking mini-project
track: javascript
order: 14
level: Advanced
minutes: 3
summary: Encapsulation — keep data and rules together; stop invalid state at the point of entry.
tags: oop, encapsulation, inheritance, polymorphism, abstraction, classes, closures, capstone
---

## Quick revision

> Revision target — Define an object's valid states; enforce the business invariant along with the private field.

- Encapsulation — keep data and rules together; stop invalid state at the point of entry.
- Abstraction — show a useful interface, hide the implementation details.
- Inheritance — an is-a relation; avoid an unnecessarily deep hierarchy.
- Composition — build an object by combining small behaviours.
- Polymorphism — the same method contract, different implementations.
- Invariant — the rule must hold after every valid operation.
- Private state — block direct outside mutation with `#field`/a closure.
- Mini-project — keep the rules in the model, display and handlers in the UI.
- Serialization — JSON does not preserve methods/prototypes; validate on restore.
- Dependency injection — supply the storage/network collaborator from outside; testing and swapping get easier.
- Method contract — make it clear to the caller whether it mutates or returns a new object.
- Deep freeze — `Object.freeze` is shallow; nested objects have to be frozen separately.

### Edge cases and reasoning

- Validation before mutation — check an operation's precondition first; do not leave the model in an invalid state through a halfway failure.
- Composition dependency — inject the collaborating object; choose inheritance only for a real substitutable relationship.
- Restoration invariant — when restoring an object from JSON, reapply the constructor/domain rules; do not accept raw parsed data as a trusted instance.

## Understand it with an example

```js
class Wallet {
  #balance = 0;
  deposit(amount) {
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new RangeError("Positive integer amount required");
    }
    if (!Number.isSafeInteger(this.#balance + amount)) {
      throw new RangeError("Balance limit exceeded");
    }
    this.#balance += amount;
  }
  get balance() { return this.#balance; }
}
```

- Contract — the teaching wallet keeps integer minor units; currency conversion and real payment settlement are out of scope for this example.
- Trace — the balance is mutated only after validation succeeds; a failed deposit preserves the previous state.
- Check — accept `50`; reject `0`, a negative, a fraction and an unsafe sum; do not treat privacy as a substitute for validation.

## Recall and practice

- Question — Does having a private balance field automatically reject a negative deposit?
- Answer — No; privacy is access control, while business validation is enforced in the method contract.
- Try it yourself — Build a wallet model; verify a positive deposit, an insufficient withdraw, an invalid amount, and the balance invariant when restoring from serialization.

## Practice questions

### Easy · The problem with a public balance

```js
class Account {
  constructor() { this.balance = 0; }
  withdraw(n) { if (n <= this.balance) this.balance -= n; }
}
const acc = new Account();
acc.balance = -500;
```

What is the design problem? What is the idea of the fix?

<details>
<summary>Answer</summary>

- Problem — anyone can bypass the invariant ("the balance is never negative"); validation exists only in `withdraw`.
- Fix — a private `#balance` field + a read-only getter; changes only through validated methods (`deposit`, `withdraw`).
- What encapsulation means — not hiding data, but enforcing the invariant in one place.

</details>

### Medium · Penguin `extends` Bird

```js
class Bird { fly() { return 'flying'; } }
class Penguin extends Bird {
  fly() { throw new Error('cannot fly'); }
}
```

What is wrong with this hierarchy, and how would you fix it with composition?

<details>
<summary>Answer</summary>

- Problem — the contract of `Bird` is "every bird can fly"; Penguin breaks it (the substitution principle). `birds.forEach(b => b.fly())` will crash.
- Fix — compose the capabilities:

```js
const canFly = { fly() { return `${this.name} flying`; } };
const canSwim = { swim() { return `${this.name} swimming`; } };
const penguin = Object.assign({ name: 'Pingu' }, canSwim);
```

- Rule — "is-a" only when the whole behaviour is valid; otherwise "has-a/can-do" composition.

</details>

### Medium · Polymorphism without `instanceof`

Write `totalArea(shapes)` that works with `Circle`, `Rect` and future shapes without `if/instanceof` chains.

<details>
<summary>Answer</summary>

```js
class Circle { constructor(r) { this.r = r; } area() { return Math.PI * this.r ** 2; } }
class Rect { constructor(w, h) { this.w = w; this.h = h; } area() { return this.w * this.h; } }
const totalArea = (shapes) => shapes.reduce((sum, shape) => sum + shape.area(), 0);
```

- Polymorphism — every shape implements the `area()` contract; the caller does not ask for the type.
- Open/closed — adding a new `Triangle` does not change `totalArea`.

</details>

### Medium · A half-done state in a transfer

```js
function transfer(from, to, amount) {
  from.withdraw(amount);
  to.deposit(amount); // what if to is null or deposit throws?
}
```

What is the bug, and what would a safe version be?

<details>
<summary>Answer</summary>

- Bug — the money left `from`, then `to.deposit` failed → the money vanished (a partial mutation).
- Fix — all validation first, then the mutation:

```js
function transfer(from, to, amount) {
  if (!to || to === from) throw new Error('invalid target');
  if (!(amount > 0) || amount > from.balance) throw new RangeError('invalid amount');
  from.withdraw(amount);
  to.deposit(amount);
}
```

- Real systems — a database transaction or a compensating step; in memory, the "validate then mutate" rule.

</details>

### Hard · Save/restore with private fields

`JSON.stringify(account)` gives `{}` because `#movements` is private. Write `toJSON()` and `static fromJSON(data)` that check the invariant on restore.

<details>
<summary>Answer</summary>

```js
class Account {
  #movements = [];
  constructor(owner) { this.owner = owner; }
  deposit(n) { if (!(n > 0)) throw new RangeError('bad amount'); this.#movements.push(n); }
  get balance() { return this.#movements.reduce((a, b) => a + b, 0); }
  toJSON() { return { owner: this.owner, movements: [...this.#movements] }; }
  static fromJSON(data) {
    if (typeof data?.owner !== 'string' || !Array.isArray(data.movements))
      throw new TypeError('bad account data');
    const account = new Account(data.owner);
    for (const n of data.movements) {
      if (!Number.isFinite(n)) throw new TypeError('bad movement');
      account.#movements.push(n);
    }
    if (account.balance < 0) throw new RangeError('negative balance');
    return account;
  }
}
```

- `toJSON` — `JSON.stringify` calls it automatically; return a copy.
- Restore — pass untrusted JSON through public methods or explicit checks; do not put it straight into private state.
- The static method is inside the class, so it can access the private field.

</details>

## Sources — further reading

- [MDN Object-oriented JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_building_practice)
- [MDN private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/14-oop-and-mini-project.md)
