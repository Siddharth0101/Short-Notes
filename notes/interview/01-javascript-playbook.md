---
id: interview-javascript
title: JavaScript interview playbook
track: interview
order: 1
level: Intermediate
minutes: 27
summary: Achhe language answer mein output prediction, andar ka mechanism aur ek changed example teeno hote hain.
tags: javascript, interview, closures, event-loop, coding
visual: event-loop
---

## Mental model — simple soch

Interview mein definition recall ke saath prediction aur debugging test hota hai. Strong answer ka flow hai: rule batao, chhota example do, edge case discuss karo, phir practical use connect karo. Output question mein code run karne se pehle execution trace likho; guess correct hone se reasoning prove nahi hoti.

> **Core takeaway:** Achhe language answer mein output prediction, andar ka mechanism aur ek changed example teeno hote hain.

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

**Neeche kya print hoga?**

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

Har dimension ko 0–2 score do: semantics, example, edge cases, implementation, communication. 0 = missing/galat, 1 = prompt ke baad mostly correct, 2 = independently correct aur reason clear. Total 8/10 target rakho aur missed dimension ko next practice mein repeat karo. Memorized terms ke bajaye “why this update is safe” explain karna high-signal hai.

## Practice and answer

**Prompt:** Search A start hua, then search B. B result pehle aaya, A later. Correct UI kya kare?

**Answer:** B results preserve kare. Request generation ID ya current-request guard lagao; replacement/unmount par previous fetch abort bhi kar sakte ho. Loading/error update bhi same identity guard ke under hona chahiye.

## Assessed mock: JavaScript debugging round

**Prompt:** Cancellable search controller banao, microtask sequence trace karo aur retained closure samjhao.

**Round structure:** 5 minute requirements/assumptions clear karo, 20 minute core flow implement/draw karo, 10 minute failures inspect karo, aur 5 minute tradeoffs defend karo. Yeh practice timings hain; kisi company ke exact interview format ka claim nahi.

**Failure injection:** Do network responses ka completion order reverse karo; widget remove/recreate karo; zero-valued input do.

**Strong-answer evidence:** Correct queue model, clear ownership, stale-result protection aur working cleanup dikhao.

Correctness, concrete example, failure handling aur tradeoff reasoning ko 0–2 score do. 0=missing/incorrect; 1=plausible par untested; 2=trace, test ya invariant se demonstrated. Total achha ho lekin correctness gap ho toh revision abhi bhi chahiye.

Round ke baad first approach todne wala smallest counterexample likho, fix karo aur notes dekhe bina change bolkar samjhao. Mock repeat karne se pehle chapter ke answer-reveal questions se focused revision karo.

## Research notes: Explain the contract before coding

Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

**Original practice round:** Receiver preserve karne wala trailing debounce banao jisme cancellation ho. Calls result return karti hain ya sirf work schedule, contract mein clear karo.

**Failure injection:** Delay se pehle cancel karo, rapidly do calls karo, phir receiver change karo.

**Evidence to bring:** Final arguments, receiver identity, cancellation ke baad zero calls aur timer cleanup verify karo.

Employer source assessment approach ka reference hai. Yeh exercise original practice hai; reported company question nahi.

**Interview check:** Attempt ke baad is round ko review kaise karoge?

**Answer:** First failing example save karo, wrong assumption batao aur fix se behavior kaise badla dikhao. Jo demonstrate kiya aur jo extra time mein investigate karoge, unhe clearly identify karo.

**Practice:** Different failure ke saath repeat karo aur reasoning bolte jao.

[Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Unknown snippet ko mechanically solve karne ka route

Pehle execution environment bolo: browser/module/strict mode ya Node. Phir synchronous statements, lexical bindings, receiver aur scheduled continuations mark karo. Output pehle guess karne ke bajay har transition likho. Closure live binding padhti hai ya precomputed string, distinguish karo.

Coding task mein input contract, invalid values, order aur mutation permission clarify karo. Async task mein result order, active limit, rejection aur cancellation separately define karo. Short happy-path utility ke missing production boundaries honestly label karo.

**Mock follow-up:** Interviewer input mein emoji, duplicate item ya never-settling promise add kare. Existing proof ka kaunsa assumption badla? Implementation modify karne se pehle reasoning revise karo. Score answer vocabulary se nahi, predicted behavior aur independent tests se do.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Do factory-created counters independent kyun hain, do minute mein samjhao. Phir example badalkar unse intentionally shared state use karwao.

> **Hint — chhota ishara:** Har returned function exactly kis binding ko access karta hai, woh identify karo.

**Answer guide — pehle khud karo, phir compare karo:** Separate factory calls separate bindings banati hain; shared counters ek outer binding read karte hain. Dono ka short call trace aur alag outputs dikhao. Sirf closure word bolna kaafi nahi; mechanism aur evidence bhi do.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures), [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model), aur [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) semantics ke references hain.

## Project explanation aur debugging handoff

Original practice prompt: “Search feature mein kabhi old results dikhte the. Tumne kaise diagnose aur fix kiya?” Pehle user impact batao, phir smallest reproduction: A slow request, B fast request, A late response. Apna actual contribution separate bolo; team ne jo kiya use apna solo work mat present karo. Agar production metrics available nahi toh invented percentage ki jagah observed test/result bolo.

Do-minute answer ka order: context → expected contract → first wrong assumption → evidence → fix → remaining limitation. Network cancellation aur stale response guard ko distinct responsibilities ki tarah explain karo. Follow-up: server ne request already process kar li thi toh abort ka meaning kya hai?

**Practice:** Ek bug handoff likho: steps, expected/actual, minimal input, runtime, failed hypothesis aur next check. **Answer guide:** “Async broken hai” weak handoff hai. “B resolve ke baad A response list overwrite karta hai; controlled promise test reproduces; current request identity guard missing” actionable hai. Reviewer ko exact failed contract aur verification path milna chahiye.

[Testing workflow](../javascript/18-testing-workflow.md) se reproducible regression banane ki practice karo.
