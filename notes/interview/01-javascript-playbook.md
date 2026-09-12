---
id: interview-javascript
title: JavaScript interview playbook
track: interview
order: 1
level: Intermediate
minutes: 24
summary: Language mechanics, async behavior, and practical browser coding ko explain aur defend karo.
tags: javascript, interview, closures, event-loop, coding
visual: event-loop
---

## Mental model

Interview mein definition recall ke saath prediction aur debugging test hota hai. Strong answer ka flow hai: rule batao, chhota example do, edge case discuss karo, phir practical use connect karo. Output question mein code run karne se pehle execution trace likho; guess correct hone se reasoning prove nahi hoti.

## A focused mock session

| Time | Task | Good evidence |
| --- | --- | --- |
| 5 minutes | Scope, closure, this | Binding aur call-site clearly distinguish karna |
| 8 minutes | Async output trace | Synchronous stack, microtasks, tasks ka correct order |
| 15 minutes | Debounced search utility | Cancellation, arguments, this, empty states |
| 7 minutes | Debug stale data | Request identity aur cleanup explain karna |
| 5 minutes | Tradeoffs and questions | Complexity aur API contract state karna |

## Representative questions and answers

**What does a closure capture?** Function lexical environment ke bindings retain karta hai. Ye values ki automatic immutable snapshot nahi; same binding mutate ho to callback updated value dekh sakta hai. `let` loop ke per-iteration bindings aur `var` ke shared function binding ka difference isi model se explain hota hai.

**Why does an arrow function behave differently as a method?** Arrow apna dynamic `this` nahi banata, outer scope ka `this` use karta hai. Object literal ke andar arrow likhne se object automatically receiver nahi banta. Regular method ko detach karne par call-site change hota hai, isliye uska `this` bhi change ho sakta hai.

**What prints below?**

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Typical browser execution: A D C B
```

Current script synchronous A/D print karta hai. Promise reaction microtask checkpoint par run hoti hai; timer future task mein eligible hota hai. “Zero milliseconds” exact execution deadline nahi hai. Node-specific scheduling questions mein browser model blindly apply mat karo; environment clarify karo.

**Why is Promise.all not cancellation?** Combined promise kisi rejection se reject ho sakta hai, lekin baaki underlying operations continue kar sakte hain. AbortSignal ya task-specific cancellation separately coordinate karni hogi. allSettled tab useful hai jab every outcome inspect karna ho.

**Why does `class Dog extends Animal` still count as prototype-based inheritance?** `extends` syntax sugar hai; runtime mein `Dog.prototype`'s `[[Prototype]]` `Animal.prototype` par point kar diya jaata hai, aur method lookup usi chain se hoti hai. Isliye `hasOwnProperty` se instance property aur inherited prototype method mein difference clearly dikh sakta hai. Interview follow-up: private fields (`#field`) subclass ko directly inherit nahi hote, sirf parent ke expose kiye methods se accessible hote hain.

**Why does event delegation replace one listener per row?** Bubbling ki wajah se child par hua click parent tak travel karta hai; ek hi parent listener `event.target.closest(...)` se intended element resolve kar sakta hai. Dynamically added rows ke liye bhi kaam karta hai kyunki listener DOM insertion ke time par attach nahi hota, parent par already registered rehta hai. Cleanup ke liye named function reference ya `AbortController` signal use karo, taaki listener leak na ho.

**Why does `0.1 + 0.2 !== 0.3` in JavaScript?** Number IEEE-754 double-precision binary floating point hai; kuch decimal fractions binary mein exactly represent nahi ho sakti, isliye tiny rounding error aata hai. Currency jaisi exact arithmetic ke liye smallest unit (paise/cents) ko integer maan kar calculate karo, aur display ke last step par hi formatting/rounding apply karo. `toFixed()` bhi yaad rakho ki string return karta hai, number nahi.

**What's the practical difference between ESM and CommonJS in a Node project?** ESM (`import`/`export`) static, analyzable graph banata hai, strict mode default hai, aur exports live bindings hote hain; CommonJS (`require`/`module.exports`) synchronous aur dynamic hai, runtime par kabhi bhi conditionally require ho sakta hai. `package.json` ka `type` field aur file extension (`.mjs`/`.cjs`) decide karte hain kaunsa system apply hoga. Dono ko mix karte waqt default-vs-named export interop mismatch common gotcha hai.

## Coding drill and review

Debounce implement karo jo latest arguments aur receiver preserve kare aur cancel method expose kare.

```js
function debounce(fn, delay) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    const receiver = this;
    timer = setTimeout(() => fn.apply(receiver, args), delay);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
```

Contract trailing-only hai. Return value delayed function result nahi hota; async promise-returning debounce ke liye separate API design chahiye. Interview follow-ups: flush support, leading call, component cleanup, error propagation, aur overlapping network requests. Debounce alone stale in-flight response prevent nahi karta.

## Self-review rubric

Har dimension ko 0–2 score do: semantics, example, edge cases, implementation, communication. 0 = missing/wrong, 1 = mostly correct but prompted, 2 = independently correct with justification. Total 8/10 target rakho aur missed dimension ko next practice mein repeat karo. Memorized terms ke bajaye “why this update is safe” explain karna high-signal hai.

## Practice and answer

**Prompt:** Search A start hua, then search B. B result pehle aaya, A later. Correct UI kya kare?

**Answer:** B results preserve kare. Request generation ID ya current-request guard lagao; replacement/unmount par previous fetch abort bhi kar sakte ho. Loading/error update bhi same identity guard ke under hona chahiye.

## Assessed mock: JavaScript debugging round

**Prompt:** Implement a cancellable search controller, trace a microtask sequence, and explain a retained closure.

**Round structure:** Spend 5 minutes clarifying requirements and assumptions, 20 minutes implementing or drawing the core flow, 10 minutes investigating failures, and 5 minutes defending tradeoffs. These are practice targets, not a claim about any company's interview format.

**Failure injection:** Reverse two network responses; remove and recreate the widget; include a zero-valued input.

**Strong-answer evidence:** Correct queue model, explicit ownership, stale-result protection, and a cleanup demonstration.

Score each dimension from 0 to 2: correctness, concrete example, failure handling, and tradeoff reasoning. Zero means missing or incorrect; one means plausible but untested; two means demonstrated with a trace, test, or explicit invariant. A high total with a correctness gap still needs revision.

After the round, write the smallest counterexample that broke your first approach, repair it, and explain the change aloud without notes. Use the chapter's answer-reveal questions for focused revision before repeating the mock.

## Source check
[MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures), [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model), aur [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) semantics ke references hain.
