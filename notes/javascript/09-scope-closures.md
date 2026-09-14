---
id: js-scope-closures
title: Execution contexts scope and closures
track: javascript
order: 9
level: Intermediate
minutes: 26
summary: Closure apni lexical bindings access kar sakta hai; separate factory calls apna-apna state bana sakti hain.
tags: scope, closures, hoisting, execution-context, memory
visual: closures
---

## Mental model — simple soch

Function call hone par execution context stack par aata hai. Function apne variables ke liye pehle local scope, phir definition ke surrounding lexical scopes search karta hai. Caller ka scope automatically access nahi hota. Closure function aur uske accessible lexical environment ka combination hai. Function return hone ke baad bhi captured bindings reachable hain to environment alive reh sakta hai.

> **Core takeaway:** Closure apni lexical bindings access kar sakta hai; separate factory calls apna-apna state bana sakti hain.

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

Pehli factory call ka `count` aur dusri call ka `count` alag bindings hain. Pehle object ke dono methods ek environment share karte hain. Closure value ki frozen photograph nahi leta: binding update hoti hai to next read updated value dekhega. React stale closures samajhne ke liye yeh distinction essential hai; separate renders separate bindings create karte hain.

## Hoisting and the temporal dead zone

Hoisting ko source code physically upar move hona mat samjho. Declaration setup execution se pehle hota hai, lekin initialization rules declaration type par depend karte hain. `var` binding initial value undefined ke saath accessible hoti hai. `let` aur `const` apne scope ke start se declaration execute hone tak uninitialized rehte hain; access par ReferenceError aata hai. Function declarations often declaration se pehle call ki ja sakti hain; function expressions assigned to const TDZ rules follow karti hain.

```js
const callbacks = [];
for (let i = 0; i < 3; i++) callbacks.push(() => i);
console.log(callbacks.map(fn => fn())); // [0, 1, 2]
```

`let` loop ke har iteration ke liye suitable fresh binding deta hai. Isi code mein `var` use karoge to callbacks shared binding ka final value padhenge. Yeh scheduling ka magic nahi, scope ka result hai.

`var` function-scoped hai, block-scoped nahi — `if`/`for` ke andar declare karne se bhi woh puri function mein accessible rehta hai:

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

`typeof` normally undeclared identifier ke liye safe hota hai (`"undefined"` deta hai), lekin TDZ mein pade hue `let`/`const` binding par `typeof` bhi ReferenceError deta hai. Isliye "typeof check karke safely access kar lenge" assumption `var` ke liye sahi hai, `let`/`const` ke liye nahi.

## Closures in real UI code

```js
const buttons = document.querySelectorAll(".tab");
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    console.log(`Tab ${index} clicked`);
  });
});
```

Har button apna khud ka `index` closure mein capture karta hai kyunki `forEach` callback har iteration ke liye naya function-call environment banata hai — yeh `let` loop wale example jaisa hi hai. Memoization bhi closure ka classic real use hai:

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

`cache` returned function ke closure mein private rehta hai; bahar se directly accessible nahi hai, sirf `fastSquare` ke through interact hota hai.

## Practical patterns and gotchas

Closures private state, memoization, event handlers aur function factories mein useful hain. Higher-order function function ko accept ya return karta hai. IIFE ek function ko immediately execute karke scope bana sakta hai; modules mein manual IIFE ki need frequently kam ho jaati hai. Callback registered reh gaya to captured large object bhi reachable reh sakta hai. Listener removal, subscription cleanup aur cache size limit memory management ka part hain.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Closure variable ki value creation time par "snapshot" ho jaati hai. **Why it breaks:** Closure binding capture karta hai, value nahi — agar shared binding baad mein mutate hoti hai (jaise `var` loop mein), sab callbacks final value dekhte hain, apna-apna captured value nahi. **Fix:** Per-iteration binding chahiye to `let`/`const` use karo, ya explicit IIFE/helper function se naya scope banao.
- **Wrong assumption:** `typeof possiblyUndeclared` hamesha safe hai, ReferenceError kabhi nahi dega. **Why it breaks:** TDZ mein pade `let`/`const` binding par `typeof` bhi throw karta hai; yeh sirf truly undeclared identifiers ke liye safe hai. **Fix:** Variable ko use se pehle explicitly declare/initialize karo; "typeof guard" pattern ko TDZ case mein rely mat karo.
- **Wrong assumption:** `memoize` ka cache bina limit ke safe hai. **Why it breaks:** Unbounded `Map` production mein memory leak ban sakta hai agar arguments ki combinations unlimited hain (jaise user-typed search query). **Fix:** Cache size cap lagao ya LRU-style eviction add karo jab input space unbounded ho.

Real app mein yeh dynamic list ke event handlers (har row ka apna id/index), API response caching layer aur debounced-search jaisi jagah directly dikhta hai — jahan galat scope ek shared state accidentally sab instances mein leak kar deta hai.

## Practice

`createAttemptLimiter(max)` banao jo remaining attempts private rakhe aur `tryOnce()` return kare. Do instances interleave karke independence prove karo. Phir reset method add karo aur explain karo ki returned methods same count kaise share karte hain.

## Interview questions — bolkar practice karo

**Q. Closure function return hone ke baad kaise work karta hai?** Stack frame end hota hai, lekin reachable lexical bindings ko garbage collector reclaim nahi karta.

**Q. Scope aur call stack same hain?** Nahi. Stack active calls dikhata hai; lexical scope variable lookup ka relationship hai jo code definition se decide hota hai.

## Research notes: Live bindings versus snapshots

Closure binding read karta hai; pehle calculate ki hui string khud update nahi hoti.

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

Dono readers closures hain. Ek changing number ki binding read karta hai; doosra pehle calculated string read karta hai.

**Interview check:** Dono closures hone par bhi snapshot same kyun rehta hai?

**Answer:** Number binding badli, earlier string recalculate nahi hui. Current label chahiye toh reader ke andar calculate karo; historical state chahiye tab deliberately snapshot capture karo.

**Practice:** Label creation snapshot() ke andar move karo aur output predict karo.

[Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Zero se start hone wale do counters banao. First ko do baar, second ko ek baar call karo. Outputs batao aur global count ka effect samjhao.

> **Hint:** Count factory ke andar declare karo aur use increment karne wali function return karo.

**Answer guide — compare after attempting:** `function makeCounter() { let n = 0; return () => ++n; }` se calls ka output 1, 2, 1 hai. Har factory invocation n ki nayi binding banati hai. Global binding share hoti toh output 1, 2, 3 hota.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) lexical environments ka reference hai. [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) stack aur jobs explain karta hai.
