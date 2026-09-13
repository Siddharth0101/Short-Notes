---
id: js-functions
title: Functions parameters arguments and return values
track: javascript
order: 5
level: Foundation
minutes: 12
summary: Name a reusable calculation and keep its inputs and output explicit.
tags: fundamentals, js, functions
---

## Mental model

Function ek reusable operation hai. A parameter names an input inside its definition; an argument supplies the actual value at a call site. A return statement sends a value back to the caller and ends that function call. Printing a value is not the same as returning it: a caller cannot calculate with a console message.

> **Core takeaway:** A return value lets callers compose work; logging only displays information.

## One operation many inputs

```javascript
function lessonMinutes(lessons, minutesPerLesson) {
  return lessons * minutesPerLesson;
}
const monday = lessonMinutes(2, 15);
const tuesday = lessonMinutes(3, 10);
console.log(monday + tuesday); // 60
```

Each call receives its own parameters. The return value becomes the value of the call expression. You can store it, pass it into another calculation or print it. Without an explicit return value, a normal function returns undefined. A return exits the current call, not the entire program.

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

The accumulator belongs to this function call. Calling sumThrough again starts with a new total. For now, assume a non-negative whole-number input; validation will be combined with functions in the foundations checkpoint. Stating that assumption is better than silently promising support for every possible value.

A function expression stores a function value in a binding. An arrow function is another syntax, such as const double = value => value * 2. Learn basic inputs and returns first; receiver behavior and closures have dedicated later lessons. Default parameters supply a fallback when an argument is undefined, not for every falsy value.

## Practice

Write rectangleArea(width, height), call it twice and combine the results. Replace return with console.log temporarily and observe what the caller receives. Restore the return, then implement a function that counts how many integers from 1 through n are even. Use the loop and decision lessons you have already completed.

## Check before moving on

Explain the difference between a function definition and a function call. Next, use arrays and objects to represent several related values rather than inventing a separate variable for each one.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Write `studyTotal(days, minutesPerDay)` and use its result to calculate two learners' combined minutes. Check `(3,20)` and `(0,20)`.

> **Hint:** Return the multiplication so another expression can use it.

**Answer guide — compare after attempting:** `function studyTotal(days, minutesPerDay) { return days * minutesPerDay; }` returns 60 and 0 for the stated nonnegative numeric inputs. Add two calls to get the combined total. A function that only logs gives the caller `undefined`.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) covers definitions, calls and parameters.
