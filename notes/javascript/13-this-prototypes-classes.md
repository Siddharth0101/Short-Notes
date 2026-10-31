---
id: js-this-prototypes-classes
title: This binding prototypes and classes
track: javascript
order: 13
level: Intermediate
minutes: 5
summary: Regular `this` — function kaise call hua usse decide hota hai.
tags: this, prototype, classes, oop, inheritance
---

## Quick revision

> Revision target — Function definition se pehle call site dekho; receiver aur lexical capture ka difference explain karo.

- Regular `this` — function kaise call hua usse decide hota hai.
- Arrow `this` — surrounding scope se aata hai; `call`/`bind` se change nahi hota.
- Detached method — `const f = obj.method` receiver kho deta hai.
- `call` — args alag; `apply` — args array-like; `bind` — naya bound function.
- Prototype — missing property prototype chain mein search hoti hai.
- Class — prototype-based object creation ka syntax; instance methods prototype par, instance fields own aur static members class par.
- `new` — object banata, prototype jodta aur constructor call karta hai.
- `extends`/`super` — inheritance; derived constructor mein `this` se pehle `super()`.
- Own property — `Object.hasOwn()` inherited property ko include nahi karta.
- Private field — `#name` class ke bahar directly accessible nahi.
- Static method — class/constructor par call; instance prototype method se alag.
- `Object.create` — chosen prototype wala object; constructor automatically run nahi hota.
- Getter/setter — property syntax par logic; same property ko setter mein assign karna recursion kara sakta hai.

### Receiver aur prototype

- Partial application — kuch arguments pehle bind, baaki call par do.
- Listener cleanup — bound function store karo; har `bind()` naya function banata hai.
- Borrowed method — chosen receiver ko method ke expected fields/contract satisfy karne chahiye.
- Explicit argument — dependency ko parameter banana hidden receiver coupling kam kar sakta hai.
### Class aur prototype details

- Class TDZ — lexical declaration initialize hone se pehle class use nahi kar sakte.
- Chaining — method `this` return kare toh calls chain kar sakte ho.
- `instanceof` — prototype-chain relation check; cross-realm/custom behavior ka catch hai.
- Prototype shadowing — instance ki own property same-name prototype property ko hide karti hai.
- Instance fields — har object ki own state; shared prototype par mutable array rakhna accidental sharing kara sakta hai.
- Descriptor — writable, enumerable aur configurable property behavior control karte hain.
- `Object.getPrototypeOf` — object's actual prototype; constructor `.prototype` alag property hai.
### Call-site traps

- Plain call — strict mode mein `this` undefined; non-strict behavior runtime par depend karta hai.
- Global `this` — browser classic script, ES module aur Node context same nahi.
- DOM listener — regular listener ka `this` currentTarget; arrow ka outer `this`.
- Method wrapper — `() => obj.method()` call-time object lookup preserve karta hai.
- Nested regular call — outer method ka receiver inner regular function ko automatically inherit nahi hota.

### Proxy aur Reflect

- Proxy — object operations ko get/set jaise traps se intercept; missing trap default operation forward karta hai.
- Reflect — object operation ko function form mein forward; proxy trap mein same arguments pass kar sakte ho.
- Proxy receiver — `Reflect.get(target, key, receiver)` getter ka intended `this` preserve karta hai.
- Proxy identity — proxy aur target alag references; equality aur Map keys mein interchangeable nahi.

### Edge cases aur reasoning

- Constructor return — regular constructor explicitly object return kare toh new ka result woh object ho sakta hai.
- Private brand — proxy/wrong receiver se private-field method fail ho sakta hai; private access ordinary property forwarding nahi.
- Bound constructor — constructable target ka bound function new se call ho sakta hai; bound this constructor receiver ko force nahi karta.

## Example se samjho

```js
"use strict";
const person = {
  name: "Asha",
  greet() { return this.name; },
};
const greet = person.greet.bind(person);
console.log(greet()); // Asha
```

- Trace — `bind` naya function deta hai jiska receiver `person` hai; detached invocation bhi intended object read karti hai.
- Catch — `const loose = person.greet; loose()` strict mode mein `this` undefined hone se property access par throw karega.
- Check — arrow se method replace karna universal fix nahi; arrow surrounding scope ka `this` leti hai.

## Recall aur practice

- Sawal — obj.method ko timer callback directly dene par receiver kaise kho sakta hai?
- Jawaab — Callback invocation obj.method() nahi hoti; stored bind ya wrapper se intended receiver preserve karo.
- Khud try karo — Account method detach karo, phir bind aur wrapper compare karo; do instances ka balance independent aur cleanup callback identity stable verify karo.

## Practice questions

### Easy · Detached method

```js
'use strict';
const counter = {
  count: 0,
  inc() { this.count++; return this.count; },
};
const inc = counter.inc;
console.log(counter.inc());
console.log(inc());
```

<details>
<summary>Answer</summary>

- Pehla — `1`; call site `counter.inc()` hai, `this = counter`.
- Doosra — `TypeError` (`this` is `undefined` in strict mode).
- Fix — `const inc = counter.inc.bind(counter)` ya wrapper `() => counter.inc()`.

</details>

### Easy · Arrow function ka `this`

```js
// ES module
const user = {
  name: 'Asha',
  regular() { return this.name; },
  arrow: () => this?.name,
};
console.log(user.regular(), user.arrow());
```

<details>
<summary>Answer</summary>

- Output — `Asha undefined`.
- Arrow — apna `this` nahi banata; outer (module top-level) ka `this` leta hai jo `undefined` hai.
- Rule — object methods ke liye regular method syntax; callbacks ke andar outer `this` chahiye toh arrow.

</details>

### Medium · Prototype shadowing

```js
function Dog(name) { this.name = name; }
Dog.prototype.sound = 'woof';
const a = new Dog('a');
const b = new Dog('b');
a.sound = 'grr';
Dog.prototype.sound = 'bark';
console.log(a.sound, b.sound, Object.hasOwn(b, 'sound'));
```

<details>
<summary>Answer</summary>

- Output — `grr bark false`.
- `a.sound = ...` — `a` par own property banti hai jo prototype value ko shadow karti hai.
- `b` — own property nahi, isliye lookup prototype tak jaata hai aur latest `bark` milta hai.

</details>

### Medium · Static, private aur getters

```js
class Account {
  static count = 0;
  #balance = 0;
  constructor() { Account.count++; }
  deposit(n) { this.#balance += n; return this; }
  get balance() { return this.#balance; }
}
const acc = new Account().deposit(50).deposit(25);
console.log(acc.balance, Account.count, acc.count, acc['#balance']);
```

<details>
<summary>Answer</summary>

- Output — `75 1 undefined undefined`.
- Chaining — `deposit` `this` return karta hai.
- `static` — class par rehta hai, instance par nahi.
- `#balance` — real private field; string key `'#balance'` se access nahi hota, bahar se `acc.#balance` likhna SyntaxError hai.

</details>

### Hard · `new` operator khud implement karo

`myNew(Ctor, ...args)` likho jo `new Ctor(...args)` jaisa behave kare, constructor ke object return karne wala case bhi.

<details>
<summary>Answer</summary>

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  const isObject = result !== null && (typeof result === 'object' || typeof result === 'function');
  return isObject ? result : obj;
}
```

- Steps — naya object, prototype link, constructor ko `this = obj` ke saath call, phir return rule.
- Return rule — constructor object return kare toh wahi milta hai; primitive return ignore hota hai.
- Limit — `class` constructors ko `apply` se call nahi kar sakte (TypeError); real code mein `Reflect.construct(Ctor, args)` use hota hai.

</details>

## Sources — aur padhne ke liye

- [javascript.info — Proxy/Reflect](https://javascript.info/proxy)

- [MDN working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [MDN classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/13-this-prototypes-classes.md)
