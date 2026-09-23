# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Trace an independent counter

```js
function createCounter(start = 0) {
  let count = start;
  return {
    increment() { count += 1; return count; },
    read() { return count; }
  };
}

const first = createCounter(10);
const second = createCounter(0);
console.log(first.increment()); // 11
console.log(first.increment()); // 12
console.log(second.read()); // 0
```

## Hoisting and the temporal dead zone

```js
const callbacks = [];
for (let i = 0; i < 3; i++) callbacks.push(() => i);
console.log(callbacks.map(fn => fn())); // [0, 1, 2]
```

```js
function demoVar() {
  if (true) {
    var hoisted = "I am function scoped";
  }
  console.log(hoisted); // "I am function scoped"
}
demoVar();

function demoLet() {
  console.log(typeof blockScoped); // ReferenceError, not "undefined"
  let blockScoped = "I am block scoped";
}
```

## Closures in real UI code

```js
const buttons = document.querySelectorAll(".tab");
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    console.log(`Tab ${index} clicked`);
  });
});
```

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = n => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
console.log(fastSquare(5)); // computed once
console.log(fastSquare(5)); // cached
```

## Research notes: Live bindings versus snapshots

```js
function makeRevision() {
  let revision = 0;
  const label = `Revision ${revision}`;
  return {
    advance: () => ++revision,
    live: () => revision,
    snapshot: () => label,
  };
}
const r = makeRevision();
r.advance();
console.log(r.live(), r.snapshot()); // 1, "Revision 0"
```

## Depth walkthrough — andar kya ho raha hai?

```js
function makeLabel() {
  let count = 0;
  const initial = `Count: ${count}`;
  return {
    increment() { count++; },
    current() { return count; },
    originalLabel() { return initial; }
  };
}
const label = makeLabel();
label.increment();
console.log(label.current(), label.originalLabel()); // 1, Count: 0
```
