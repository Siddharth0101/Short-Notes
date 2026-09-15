---
id: js-functions
title: Functions parameters arguments and return values
track: javascript
order: 5
level: Foundation
minutes: 15
summary: Return value caller ko aage calculation karne deti hai; console.log sirf information dikhata hai.
tags: fundamentals, js, functions
---

## Mental model — simple soch

Function ek reusable operation hai. Parameter function definition ke andar input ka naam hai; argument call karte waqt di hui actual value hai. Return statement result caller ko wapas deti hai aur current function call finish karti hai. Value print karna aur return karna alag hain: console message ko caller calculation ke result ki tarah use nahi kar sakta.

> **Core takeaway:** Return value caller ko aage calculation karne deti hai; console.log sirf information dikhata hai.

## One operation many inputs

```javascript
function lessonMinutes(lessons, minutesPerLesson) {
  return lessons * minutesPerLesson;
}
const monday = lessonMinutes(2, 15);
const tuesday = lessonMinutes(3, 10);
console.log(monday + tuesday); // 60
```

Har call ko apne parameters milte hain. Return result call expression ki value banta hai; store, calculate ya print kar sakte ho. Explicit return value na ho toh normal function undefined deti hai. return current call exit karta hai, entire program nahi.

## Build with familiar statements

```javascript
function sumThrough(last) {
  let total = 0;
  for (let value = 1; value <= last; value++) {
    total += value;
  }
  return total;
}
console.log(sumThrough(4)); // 10
```

Accumulator is function call ka local state hai. sumThrough dobara call karoge toh naya total start hoga. Abhi nonnegative whole-number input assume karo; validation later checkpoint mein combine hogi. Har possible value support karne ka silent promise mat karo.

Function expression function value ko binding mein store karti hai. Arrow bhi syntax hai: `const double = value => value * 2`. Pehle inputs/returns seekho; this aur closures later hain. Default parameter sirf undefined par fallback deta hai, har falsy value par nahi.

## Practice

rectangleArea(width,height) likho; do calls ke results add karo. return temporarily console.log se replace karke caller ka received result dekho. Return restore karo; phir 1–n ke even integers count function banao using loops/conditions.

## Aage badhne se pehle check karo

Function definition aur function call ka difference samjhao. Next related values ko arrays/objects mein rakhenge, har item ka separate variable nahi banayenge.

## Depth walkthrough — andar kya ho raha hai?

### Caller aur callee ki responsibility alag dekho

```js
function discounted(price, discount = 0) {
  return price - discount;
}
const first = discounted(20, 5);
const second = discounted(20);
console.log(first + second); // 35
```

Definition mein price/discount parameters hain; call mein 20/5 actual arguments. Pehli call apni local bindings se 15 return karti hai, doosri default discount 0 se 20. Caller dono results combine karta hai. Function ke andar total log karke return hata doge toh caller ko undefined milega aur addition meaningful result nahi dega.

Function value bhi pass ho sakti hai. `run(discounted)` function deta hai; `run(discounted(20,5))` pehle calculation karke 15 deta hai. Event handlers aur callbacks mein yahi difference baar-baar aayega. Arrow ka expression body result return karta hai; braces wali body mein explicit return chahiye.

**Contract boundary:** Example finite prices aur valid discount assume karta hai. Kya discount price se bada ho sakta hai? Caller validation own karega ya function reject karegi, choose karo. Pure calculation ka same valid input same output hota hai; network, logging aur shared-state changes side effects hain. Calculation ko unse separate rakhne se reuse aur tests simple hote hain.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** `studyTotal(days, minutesPerDay)` likho aur do learners ke total minutes add karo. `(3,20)` aur `(0,20)` check karo.

> **Hint — chhota ishara:** Multiplication return karo, taaki doosri expression result use kar sake.

**Answer guide — pehle khud karo, phir compare karo:** `function studyTotal(days, minutesPerDay) { return days * minutesPerDay; }` given nonnegative numeric inputs par 60 aur 0 deta hai. Combined total ke liye do calls add karo. Sirf log karne wali function caller ko undefined return karti hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) mein definitions, calls aur parameters padho.
