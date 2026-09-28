---
id: js-this-prototypes-classes
title: This binding prototypes and classes
track: javascript
order: 13
level: Intermediate
minutes: 3
summary: Regular `this` — function kaise call hua usse decide hota hai.
tags: this, prototype, classes, oop, inheritance
---

## Quick revision

- Regular `this` — function kaise call hua usse decide hota hai.
- Arrow `this` — surrounding scope se aata hai; `call`/`bind` se change nahi hota.
- Detached method — `const f = obj.method` receiver kho deta hai.
- `call` — args alag; `apply` — args array-like; `bind` — naya bound function.
- Prototype — missing property prototype chain mein search hoti hai.
- Class — prototype-based object creation ka syntax; methods prototype par hote hain.
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

## Sources — aur padhne ke liye

- [javascript.info — Proxy/Reflect](https://javascript.info/proxy)

- [MDN working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [MDN classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/13-this-prototypes-classes.md)
