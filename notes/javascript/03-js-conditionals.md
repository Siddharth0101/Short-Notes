---
id: js-conditionals
title: Decisions with if else and boolean logic
track: javascript
order: 3
level: Foundation
minutes: 12
summary: Use comparisons to choose a branch without mixing assignment and equality.
tags: fundamentals, js, conditionals
---

## Mental model

A condition asks a question whose result determines which path runs. Pehle question ko plain language mein likho: is the learner eligible to start? Then turn that question into comparisons. An if statement runs its branch when its condition is truthy; an else branch handles the alternative. A chain of else if branches selects the first matching branch.

## Trace one decision

```javascript
const score = 72;
const submitted = true;
if (!submitted) {
  console.log('Submit your work first');
} else if (score >= 80) {
  console.log('Ready for advanced practice');
} else if (score >= 50) {
  console.log('Revise and try again');
} else {
  console.log('Repeat the fundamentals');
}
```

The result is Revise and try again. Once that branch matches, later branches are skipped. Order matters: putting score >= 50 first would also catch scores above 80. Use braces even for short examples so adding a second statement does not accidentally move it outside the branch.

## Combine conditions

&& requires both conditions to succeed; || permits either; ! negates a boolean. These operators short circuit, so a later operand may not be evaluated. Start with explicit comparisons such as age >= 18 && hasTicket. JavaScript conditions can also coerce values: an empty string and zero are falsy, while a nonempty string such as 'false' is truthy. A variable named submitted should therefore contain a real boolean if that is the intended contract.

A ternary expression chooses a value, such as const label = passed ? 'Pass' : 'Retry'. Keep longer branching logic in readable statements. A switch can match one expression against multiple cases; learn it after if/else rather than treating it as a required replacement.

## Practice

Write a delivery-fee rule: free for totals at least 500, otherwise 40. Add an invalid-negative-total branch before the business rule. Test -1, 0, 499 and 500 and explain every result. Then add a boolean premiumMember rule that also grants free delivery.

## Check before moving on

You should be able to explain which branch runs at an exact boundary. The next lesson repeats statements with loops instead of writing the same decision many times.

## Sources

[MDN control flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) introduces conditional execution.
