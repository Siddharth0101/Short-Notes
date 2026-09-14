---
id: js-functions
title: Functions parameters arguments and return values
track: javascript
order: 5
level: Foundation
minutes: 12
summary: Return value caller ko aage calculation karne deti hai; console.log sirf information dikhata hai.
tags: fundamentals, js, functions
---

## Mental model — simple soch

Function ek reusable operation hai. A parameter names an input inside its definition; an argument supplies the actual value at a call site. A return statement sends a value back to the caller and ends that function call. Printing a value is not the same as returning it: a caller cannot calculate with a console message.

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

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** `studyTotal(days, minutesPerDay)` likho aur do learners ke total minutes add karo. `(3,20)` aur `(0,20)` check karo.

> **Hint:** Multiplication return karo, taaki doosri expression result use kar sake.

**Answer guide — compare after attempting:** `function studyTotal(days, minutesPerDay) { return days * minutesPerDay; }` given nonnegative numeric inputs par 60 aur 0 deta hai. Combined total ke liye do calls add karo. Sirf log karne wali function caller ko undefined return karti hai.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) mein definitions, calls aur parameters padho.
