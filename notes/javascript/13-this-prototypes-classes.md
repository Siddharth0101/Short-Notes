---
id: js-this-prototypes-classes
title: This binding prototypes and classes
track: javascript
order: 13
level: Intermediate
minutes: 24
summary: Call-site binding, prototype delegation, constructors aur composition ka difference samjho.
tags: this, prototype, classes, oop, inheritance
---

## Mental model

Ordinary function mein `this` usually call ka receiver hota hai. Function kis object par originally stored tha, usse permanent binding create nahi hoti. Arrow function surrounding `this` capture karta hai. Prototype lookup mein object par property missing ho to next prototype par search hoti hai; object ke andar parent ki saari methods copy nahi hoti.

## Predict the receiver

```js
"use strict";
const profile = {
  name: "Asha",
  greet(prefix) { return `${prefix} ${this.name}`; }
};
console.log(profile.greet("Hello")); // Hello Asha
const greet = profile.greet;
console.log(greet.call({ name: "Kabir" }, "Hi")); // Hi Kabir
console.log(greet.apply(profile, ["Welcome"])); // Welcome Asha
const greetAsha = greet.bind(profile, "Namaste");
console.log(greetAsha()); // Namaste Asha
```

Bare `greet("Hi")` strict mode mein undefined `this` ke kaaran fail karega. `call` immediately invoke karta hai with separate arguments; `apply` arguments collection leta hai; `bind` new callable deta hai. Callback pass karte waqt receiver preserve karne ke liye binding ya wrapper function chahiye ho sakta hai.

## Classes and constructor functions

```js
class ReadingList {
  #titles = [];
  add(title) {
    if (!title.trim()) throw new Error("Title is required");
    this.#titles.push(title);
  }
  get size() { return this.#titles.length; }
  snapshot() { return [...this.#titles]; }
}
const list = new ReadingList();
list.add("Closures");
console.log(list.size); // 1
```

Class methods prototype par shared hoti hain; public instance fields har instance par hote hain. `#titles` private field class body ke access rules follow karta hai. Getter property-style access deta hai, lekin expensive work chhupana surprising ho sakta hai. Static method constructor/class par call hota hai, instance par nahi.

Constructor function plus `new` prototype-based model ka older syntax hai. `new` naya object create karta hai, prototype link set karta hai aur constructor mein `this` bind karta hai. `extends` inheritance relationship create karta hai; derived constructor mein `this` use karne se pehle `super()` required hai. Composition tab useful hai jab features combine karne hain, lekin real "is-a" relationship nahi hai. Notification service ko email sender inject karna inheritance tree banane se simpler ho sakta hai.

Getter/setter pair internal representation ko ek dusre unit mein convert karke expose kar sakta hai:

```js
class Temperature {
  #celsius;
  constructor(celsius) { this.#celsius = celsius; }
  get fahrenheit() { return this.#celsius * 9 / 5 + 32; }
  set fahrenheit(value) { this.#celsius = (value - 32) * 5 / 9; }
}
const temp = new Temperature(25);
console.log(temp.fahrenheit); // 77
temp.fahrenheit = 98.6;
console.log(temp.fahrenheit.toFixed(1)); // "98.6"
```

Caller ke liye yeh plain property jaisa dikhta hai; internally sirf ek `#celsius` source of truth maintain hoti hai, do separate fields sync karne ki zaroorat nahi.

## Prototype chain in the raw

`class` syntax ke peeche yehi delegation model hota hai, bina `class` keyword use kiye bhi likha ja sakta hai:

```js
const animalBehaviors = {
  describe() { return `${this.name} makes a sound`; }
};
const dog = Object.create(animalBehaviors);
dog.name = "Rex";
console.log(dog.describe()); // Rex makes a sound
console.log(Object.getPrototypeOf(dog) === animalBehaviors); // true
console.log(dog.hasOwnProperty("name")); // true
console.log(dog.hasOwnProperty("describe")); // false
```

`class Dog extends Animal` internally `Dog.prototype`'s `[[Prototype]]` ko `Animal.prototype` par point karta hai — same delegation, sirf syntax cleaner hai. `hasOwnProperty` batata hai ki property instance par hai ya prototype chain se aa rahi hai; `for...in` bina check ke inherited enumerable properties bhi include kar sakta hai, isliye `Object.keys` ya explicit `hasOwnProperty` guard safer hote hain.

## Gotchas

Methods mein arrow syntax unnecessarily use karne se per-instance functions create ho sakti hain. Object literal arrow method surrounding `this` lega, object khud nahi. `Object.freeze` shallow hai; nested object mutate ho sakta hai. Prototype mutate karke built-in behavior globally change karna debugging ko difficult banata hai.

## Common mistakes

- **Wrong assumption:** Ek bound function ko dobara `bind`/`call` karne se receiver change ho jayega. **Why it breaks:** Bound function ka `this` permanently fix ho chuka hota hai; second `bind`/`call`/`apply` silently ignore ho jaata hai. **Fix:** Agar dusra receiver kabhi chahiye ho, original unbound function ka reference alag se rakho.
- **Wrong assumption:** `extends` use karne se parent ki private fields (`#field`) subclass directly access kar sakti hai. **Why it breaks:** Private fields class-body-scoped hain; subclass unhe directly padh/likh nahi sakti, sirf parent ke expose kiye hue public method/getter se. **Fix:** Protected-jaisa access chahiye to parent class mein ek getter/method expose karo jo private field return kare.
- **Wrong assumption:** Object method ko directly array callback (jaise `.map(obj.method)`) mein pass karna safe hai. **Why it breaks:** Method object se detach ho jaata hai; call-site par `this` object nahi rehta, undefined ban jaata hai (strict mode mein) aur `this.something` access karte hi TypeError aata hai. **Fix:** Arrow wrapper (`.map(item => obj.method(item))`) use karo ya `obj.method.bind(obj)` pass karo.

Real app mein yeh pattern React class components (legacy) ke constructor mein handler bind karna, ya kisi service class ka method event handler ko directly pass karte waqt `this` lose ho jaana — common production bug hai jo debugging session mein baar-baar aata hai.

## Practice

ReadingList mein duplicate prevention aur remove method add karo. Snapshot mutate karke verify karo ki internal array safe hai. Phir class ki jagah closure factory implement karke compare karo: shared methods, private state aur ergonomics mein kya tradeoff hai?

## Interview questions

**Q. Class aur prototype unrelated systems hain?** Nahi. JavaScript classes prototype-based object model par language syntax aur extra rules add karti hain.

**Q. Arrow function ko bind se new `this` de sakte hain?** Nahi. Uska `this` lexical hota hai; call/apply/bind us receiver ko replace nahi karte.

## Sources

[MDN working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects) object behavior explain karta hai. [MDN classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) class-specific semantics ka reference hai.
