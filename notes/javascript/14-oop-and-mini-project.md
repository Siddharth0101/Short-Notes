---
id: js-oop-mini-project
title: OOP pillars and a banking mini-project
track: javascript
order: 14
level: Advanced
minutes: 3
summary: Encapsulation — data aur rules saath rakho; invalid state ko entry par roko.
tags: oop, encapsulation, inheritance, polymorphism, abstraction, classes, closures, capstone
---

## Quick revision

> Revision target — Object ke valid states define karo; private field ke saath business invariant bhi enforce karo.

- Encapsulation — data aur rules saath rakho; invalid state ko entry par roko.
- Abstraction — useful interface dikhao, implementation details chhupao.
- Inheritance — is-a relation; unnecessary deep hierarchy se bacho.
- Composition — chhote behaviors jodkar object banao.
- Polymorphism — same method contract, implementations alag.
- Invariant — har valid operation ke baad rule true rehna chahiye.
- Private state — `#field`/closure se direct outside mutation roko.
- Mini-project — model mein rules, UI mein display aur handlers rakho.
- Serialization — JSON methods/prototypes preserve nahi karta; restore par validate karo.
- Dependency injection — storage/network collaborator bahar se do; testing aur swapping easier.
- Method contract — mutation hoti hai ya naya object milta hai, caller ko clear rakho.
- Deep freeze — `Object.freeze` shallow hai; nested objects separately freeze karne padte hain.

### Edge cases aur reasoning

- Validation before mutation — operation ka precondition pehle check; halfway failure se model ko invalid state mein mat chhodo.
- Composition dependency — collaborating object inject karo; inheritance sirf real substitutable relationship par choose karo.
- Restoration invariant — JSON se object restore karte waqt constructor/domain rules reapply; raw parsed data ko trusted instance mat maano.

## Example se samjho

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

- Contract — teaching wallet integer minor units rakhta hai; currency conversion aur real payment settlement is example ka scope nahi.
- Trace — validation successful hone ke baad hi balance mutate hota hai; failed deposit previous state preserve karta hai.
- Check — `50` accept; `0`, negative, fraction aur unsafe sum reject; privacy ko validation ka substitute mat samjho.

## Recall aur practice

- Sawal — Private balance field hone se negative deposit automatically reject hota hai?
- Jawaab — Nahi; privacy access control hai, business validation method contract mein enforce hoti hai.
- Khud try karo — Wallet model banao; positive deposit, insufficient withdraw, invalid amount aur serialization restore par balance invariant verify karo.

## Practice questions

### Easy · Public balance ka problem

```js
class Account {
  constructor() { this.balance = 0; }
  withdraw(n) { if (n <= this.balance) this.balance -= n; }
}
const acc = new Account();
acc.balance = -500;
```

Design problem kya hai? Fix ka idea?

<details>
<summary>Answer</summary>

- Problem — invariant ("balance kabhi negative nahi") koi bhi bypass kar sakta hai; validation sirf `withdraw` mein hai.
- Fix — `#balance` private field + read-only getter; badlav sirf validated methods (`deposit`, `withdraw`) se.
- Encapsulation ka matlab — data chhupana nahi, invariant ko ek jagah enforce karna.

</details>

### Medium · Penguin `extends` Bird

```js
class Bird { fly() { return 'flying'; } }
class Penguin extends Bird {
  fly() { throw new Error('cannot fly'); }
}
```

Is hierarchy mein kya galat hai aur composition se kaise theek karoge?

<details>
<summary>Answer</summary>

- Problem — `Bird` ka contract "har bird fly kar sakta hai" hai; Penguin use todta hai (substitution principle). `birds.forEach(b => b.fly())` crash karega.
- Fix — capabilities compose karo:

```js
const canFly = { fly() { return `${this.name} flying`; } };
const canSwim = { swim() { return `${this.name} swimming`; } };
const penguin = Object.assign({ name: 'Pingu' }, canSwim);
```

- Rule — "is-a" tabhi jab poora behavior valid ho; warna "has-a/can-do" composition.

</details>

### Medium · Polymorphism without `instanceof`

`totalArea(shapes)` likho jo `Circle`, `Rect` aur future shapes ke saath bina `if/instanceof` chains ke chale.

<details>
<summary>Answer</summary>

```js
class Circle { constructor(r) { this.r = r; } area() { return Math.PI * this.r ** 2; } }
class Rect { constructor(w, h) { this.w = w; this.h = h; } area() { return this.w * this.h; } }
const totalArea = (shapes) => shapes.reduce((sum, shape) => sum + shape.area(), 0);
```

- Polymorphism — har shape `area()` contract implement karta hai; caller type nahi poochta.
- Open/closed — naya `Triangle` add karne par `totalArea` change nahi hota.

</details>

### Medium · Transfer mein half-done state

```js
function transfer(from, to, amount) {
  from.withdraw(amount);
  to.deposit(amount); // to null ho ya deposit throw kare?
}
```

Bug kya hai aur safe version kya hoga?

<details>
<summary>Answer</summary>

- Bug — `from` se paisa nikal gaya, phir `to.deposit` fail hua → paisa gayab (partial mutation).
- Fix — pehle saari validation, phir mutation:

```js
function transfer(from, to, amount) {
  if (!to || to === from) throw new Error('invalid target');
  if (!(amount > 0) || amount > from.balance) throw new RangeError('invalid amount');
  from.withdraw(amount);
  to.deposit(amount);
}
```

- Real systems — database transaction ya compensating step; in-memory mein "validate then mutate" rule.

</details>

### Hard · Private fields ke saath save/restore

`JSON.stringify(account)` `{}` deta hai kyunki `#movements` private hai. `toJSON()` aur `static fromJSON(data)` likho jo restore par invariant check kare.

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

- `toJSON` — `JSON.stringify` isse automatically call karta hai; copy return karo.
- Restore — untrusted JSON ko public methods ya explicit checks se guzaro; seedha private state mein mat daalo.
- Static method class ke andar hai, isliye private field access kar sakta hai.

</details>

## Sources — aur padhne ke liye

- [MDN Object-oriented JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_building_practice)
- [MDN private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/14-oop-and-mini-project.md)
