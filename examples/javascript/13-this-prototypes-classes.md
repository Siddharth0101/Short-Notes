# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Prototype chain in the raw

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

## Depth walkthrough — andar kya ho raha hai?

```js
'use strict';
const meter = {
  value: 5,
  read() { return this.value; }
};
const read = meter.read;
console.log(meter.read()); // 5
console.log(read.call({ value: 9 })); // 9
const fixed = read.bind(meter);
console.log(fixed()); // 5
```
