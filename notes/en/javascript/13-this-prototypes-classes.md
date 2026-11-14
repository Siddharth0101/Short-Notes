---
id: js-this-prototypes-classes
title: This binding prototypes and classes
track: javascript
order: 13
level: Intermediate
minutes: 5
summary: Regular `this` — decided by how the function is called.
tags: this, prototype, classes, oop, inheritance
visual: prototype-chain
---

## Quick revision

> Revision target — Look at the call site before the function definition; explain the difference between a receiver and lexical capture.

- Regular `this` — decided by how the function is called.
- Arrow `this` — comes from the surrounding scope; `call`/`bind` do not change it.
- Detached method — `const f = obj.method` loses the receiver.
- `call` — args listed separately; `apply` — args as an array-like; `bind` — a new bound function.
- Prototype — a missing property is searched for along the prototype chain.
- Class — syntax for prototype-based object creation; instance methods live on the prototype, instance fields are own, and static members live on the class.
- `new` — creates an object, links the prototype and calls the constructor.
- `extends`/`super` — inheritance; in a derived constructor call `super()` before using `this`.
- Own property — `Object.hasOwn()` does not include an inherited property.
- Private field — `#name` is not directly accessible outside the class.
- Static method — called on the class/constructor; different from an instance prototype method.
- `Object.create` — an object with the chosen prototype; the constructor does not run automatically.
- Getter/setter — logic behind property syntax; assigning the same property inside its setter can cause recursion.

### Receiver and prototype

- Partial application — bind some arguments first, pass the rest at call time.
- Listener cleanup — store the bound function; every `bind()` creates a new function.
- Borrowed method — the chosen receiver must satisfy the fields/contract the method expects.
- Explicit argument — making a dependency a parameter can reduce hidden receiver coupling.
### Class and prototype details

- Class TDZ — a class cannot be used before its lexical declaration is initialized.
- Chaining — if a method returns `this`, calls can be chained.
- `instanceof` — checks a prototype-chain relation; cross-realm/custom behaviour is the catch.
- Prototype shadowing — an instance's own property hides a prototype property of the same name.
- Instance fields — each object's own state; keeping a mutable array on the shared prototype can cause accidental sharing.
- Descriptor — writable, enumerable and configurable control a property's behaviour.
- `Object.getPrototypeOf` — the object's actual prototype; a constructor's `.prototype` is a different property.
### Call-site traps

- Plain call — in strict mode `this` is undefined; non-strict behaviour depends on the runtime.
- Global `this` — a browser classic script, an ES module and the Node context are not the same.
- DOM listener — for a regular listener `this` is currentTarget; for an arrow it is the outer `this`.
- Method wrapper — `() => obj.method()` preserves the call-time object lookup.
- Nested regular call — an inner regular function does not automatically inherit the outer method's receiver.

### Proxy and Reflect

- Proxy — intercepts object operations with traps such as get/set; a missing trap forwards the default operation.
- Reflect — forwards an object operation in function form; you can pass the same arguments in a proxy trap.
- Proxy receiver — `Reflect.get(target, key, receiver)` preserves the getter's intended `this`.
- Proxy identity — a proxy and its target are different references; not interchangeable for equality or as Map keys.

### Edge cases and reasoning

- Constructor return — if a regular constructor explicitly returns an object, that object can be the result of new.
- Private brand — a private-field method can fail through a proxy/wrong receiver; private access is not ordinary property forwarding.
- Bound constructor — a bound function of a constructable target can be called with new; the bound this does not force the constructor's receiver.

## Understand it with an example

```js
"use strict";
const person = {
  name: "Asha",
  greet() { return this.name; },
};
const greet = person.greet.bind(person);
console.log(greet()); // Asha
```

- Trace — `bind` returns a new function whose receiver is `person`; even a detached invocation reads the intended object.
- Catch — `const loose = person.greet; loose()` throws on property access in strict mode, because `this` is undefined.
- Check — replacing a method with an arrow is not a universal fix; an arrow takes the `this` of the surrounding scope.

## Recall and practice

- Question — How can the receiver be lost when obj.method is passed directly as a timer callback?
- Answer — The callback invocation is not obj.method(); preserve the intended receiver with a stored bind or a wrapper.
- Try it yourself — Detach an account method, then compare bind and a wrapper; verify that two instances have independent balances and that the cleanup callback identity is stable.

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

- First — `1`; the call site is `counter.inc()`, so `this = counter`.
- Second — `TypeError` (`this` is `undefined` in strict mode).
- Fix — `const inc = counter.inc.bind(counter)` or a wrapper `() => counter.inc()`.

</details>

### Easy · `this` in an arrow function

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
- Arrow — does not create its own `this`; it takes the `this` of the outer (module top-level) scope, which is `undefined`.
- Rule — regular method syntax for object methods; an arrow when you need the outer `this` inside callbacks.

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
- `a.sound = ...` — creates an own property on `a` that shadows the prototype value.
- `b` — has no own property, so the lookup goes up to the prototype and finds the latest `bark`.

</details>

### Medium · Static, private and getters

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
- Chaining — `deposit` returns `this`.
- `static` — lives on the class, not on the instance.
- `#balance` — a real private field; it cannot be accessed with the string key `'#balance'`, and writing `acc.#balance` outside is a SyntaxError.

</details>

### Hard · Implement the `new` operator yourself

Write `myNew(Ctor, ...args)` that behaves like `new Ctor(...args)`, including the case where the constructor returns an object.

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

- Steps — a new object, the prototype link, calling the constructor with `this = obj`, then the return rule.
- Return rule — if the constructor returns an object, that is what you get; a primitive return is ignored.
- Limit — `class` constructors cannot be called with `apply` (TypeError); real code uses `Reflect.construct(Ctor, args)`.

</details>

## Sources — further reading

- [javascript.info — Proxy/Reflect](https://javascript.info/proxy)

- [MDN working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [MDN classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/13-this-prototypes-classes.md)
