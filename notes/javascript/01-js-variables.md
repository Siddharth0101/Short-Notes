---
id: js-variables
title: Variables and assignment with let and const
track: javascript
order: 1
level: Foundation
minutes: 12
summary: Start here: name a value, read it, and update it.
tags: fundamentals, js, variables
---

## Mental model

Variable ek naam hai jisse program value ko refer karta hai. Start with a single value before thinking about functions, objects or a framework. JavaScript statements execute in order. You can try these examples in the browser developer console or in a JavaScript file executed with Node. Run one small example at a time so you can predict every line.

> **Core takeaway:** A binding names a value; assignment evaluates the right side before replacing the left side.

## Declare before reading

```javascript
const learner = 'Asha';
let completed = 0;
console.log(learner); // Asha
console.log(completed); // 0
completed = completed + 1;
console.log(completed); // 1
```

const declares a binding you will not reassign. let declares one you intend to update. The equals sign assigns a value; it does not ask whether two values are equal. In completed = completed + 1, read the old value on the right, calculate the result, and store it on the left. console.log displays a value so you can inspect what happened.

## Naming and initialization

Use names that explain meaning: completedLessons is clearer than x. Names are case-sensitive, so score and Score are different bindings. A name cannot start with a digit or use a reserved keyword. Initialize a binding when you can. A let declaration without an initializer has the value undefined until assigned; reading a binding before its declaration is a different situation and produces an error.

Prefer const unless reassignment is needed. Older courses also show var; learn to recognize it, but its function-scoped behavior belongs in the later scope lesson. You do not need hoisting terminology to write these first examples correctly.

## Practice

Create a constant courseName and a changing lessonsRead count. Increase lessonsRead twice and predict the output after each statement. Try reassigning courseName and read the error. Then fix your design: should the course name really change, or should that binding remain constant? Avoid changing const to let merely to silence an error without thinking about the intended behavior.

## Check before moving on

You should be able to explain declaration, initialization and reassignment separately. Write three statements that turn an initial score of 4 into 7 without typing 7 directly. Next, study the types of values these names can hold.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Start with `let minutes = 10`. Add 5, then double it. Predict both values. Which declaration should hold an unchanging course name?

> **Hint:** Trace one assignment at a time.

**Answer guide — compare after attempting:** The intermediate value is 15 and the final value is 30. Use `const courseName = 'JavaScript'` for the name. Changing the count needs `let`; declaring a name and assigning a new value are separate operations.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types) covers declarations and values.
