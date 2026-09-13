---
id: js-types-operators
title: Value types operators and explicit conversion
track: javascript
order: 2
level: Foundation
minutes: 12
summary: Learn numbers strings booleans and comparisons before writing decisions.
tags: fundamentals, js, types, operators
---

## Mental model

A value has a type, and that type affects what an operator does. Variables are names; values are the things being named. JavaScript can assign a different type to a let binding later, but keeping one clear meaning per variable makes a program easier to follow. For now, concentrate on numbers, strings and booleans, plus missing values.

> **Core takeaway:** Conversion is a decision at the input boundary; truthiness does not validate a number.

## Calculate and compare

```javascript
const price = 20;
const quantity = 3;
const total = price * quantity;
const label = 'Total: ' + total;
const affordable = total <= 100;
console.log(total, label, affordable); // 60, Total: 60, true
console.log(7 % 2); // 1: remainder
console.log('20' + 3); // '203'
console.log(Number('20') + 3); // 23
console.log('20' === 20); // false
```

Arithmetic operators include +, -, *, / and %. Parentheses make grouping explicit. Strings contain text; joining text with + is concatenation. Booleans are true and false. Strict equality compares without first converting a string into a number. Prefer explicit conversion when your input is textual but the calculation requires a number.

## Inspect input deliberately

Use typeof to inspect common value types. undefined usually represents a missing or not-yet-assigned value; null is often an explicit absence chosen by an API. The full primitive list also includes bigint and symbol, which later examples introduce when useful. Number('hello') produces NaN, so conversion is not proof of valid input. Number.isNaN checks that particular numeric result. An empty string converts to zero, which may conflict with a required-field rule.

## Practice

Predict '5' + 2, Number('5') + 2, 5 > 2 and 5 === '5'. Then run them. Compute the area of a rectangle using numeric width and height. Change width to a numeric string and explicitly convert it at the input boundary. State what the program should do if width is blank or invalid instead of assuming every input is correct.

## Check before moving on

Explain why 0 and '0' are different values. You should be able to produce a boolean comparison and distinguish it from assignment. The next lesson uses these booleans to choose which statements run.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Predict `'8' + 2`, `Number('8') + 2`, and `Number('')`. Why should an empty form field not automatically become a valid score?

> **Hint:** An empty string has a numeric conversion too.

**Answer guide — compare after attempting:** The results are `'82'`, `10`, and `0`. Reject blank input before conversion, then check that the result is finite and within the allowed range. A successful conversion alone does not prove that the user supplied a score.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators) describes these operations.
