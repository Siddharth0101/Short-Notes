---
id: js-conditionals
title: Decisions with if else and boolean logic
track: javascript
order: 3
level: Foundation
minutes: 3
summary: `if` — the block runs when the condition is truthy.
tags: fundamentals, js, conditionals
---

## Quick revision

> Revision target — Break a business rule into boolean branches; handle a valid zero and a missing value separately.

- `if` — the block runs when the condition is truthy.
- `else if` — the first matching branch runs; the rest are skipped.
- `else` — the fallback when no condition matches.
- `&&` — returns the first falsy operand or the last one; `||` — the first truthy operand or the last one.
- `!` — turns truthiness into the opposite boolean.
- Ternary — `condition ? yes : no`; for selecting a small value.
- `switch` — cases match by strict equality; use `break` to stop fall-through.
- Boundary — `age >= 18` includes 18; check with 17, 18 and 19.
- Guard clause — return early on an invalid or finished case; nesting is reduced.
- Optional value — `user?.age ?? 0` handles a missing user/age and preserves a valid zero.
- Assignment trap — `if (x = 5)` assigns; use `===` to compare.

### Short-circuit assignment

- Logical assignment — `||=`, `&&=`, `??=` assign only when their condition is met.

### Edge cases and reasoning

- Optional call — fn?.() handles a missing function; a present non-function value still throws a TypeError.
- Chain boundary — (user?.address).city can throw for a nullish user; the grouping breaks the continuous optional chain.
- Decision table — keep the priority explicit when rules overlap; verify discount/auth branches with examples.

## Understand it with an example

```js
function deliveryFee(total, isMember) {
  if (!Number.isFinite(total) || total < 0) return "invalid";
  if (isMember || total >= 500) return 0;
  return 40;
}
```

- Trace — invalid input exits first; for valid input, membership or the minimum total gives free delivery.
- Boundary — check totals `499`, `500` and `0` for a non-member; the expected fees are `40`, `0`, `40`.
- Catch — the rule assumes a numeric total and a boolean membership here; validate raw form strings first.

## Recall and practice

- Question — If price = 0, how does price ? price : 100 treat a free item?
- Answer — Zero is falsy, so the result is 100; a nullish check is needed to tell a missing price from a valid zero.
- Try it yourself — Write a shipping rule: reject a missing total, total >= 500 is free, otherwise 40; verify 0, 499, 500 and undefined.

## Practice questions

### Easy · Count the truthy values

```js
const values = [0, '0', [], '', null, NaN, {}];
console.log(values.filter(Boolean).length);
```

<details>
<summary>Answer</summary>

- Output — `3`.
- Truthy — `'0'`, `[]`, `{}` (a non-empty string and every object are truthy).
- Falsy — `0`, `''`, `null`, `NaN` (plus `false`, `undefined`, `0n`, `-0`).

</details>

### Easy · The bug in the grade function

```js
function grade(score) {
  if (score >= 50) return 'C';
  else if (score >= 75) return 'B';
  else if (score >= 90) return 'A';
  return 'F';
}
console.log(grade(95));
```

<details>
<summary>Answer</summary>

- Output — `C`; the first true condition wins and the rest are never checked.
- Fix — strictest condition first: `>= 90`, then `>= 75`, then `>= 50`.
- Boundary tests — `49, 50, 74, 75, 89, 90`; also decide the policy for invalid input (`NaN`, `-1`, `101`).

</details>

### Medium · `switch` fall-through

```js
function label(day) {
  switch (day) {
    case 'sat':
    case 'sun':
      return 'weekend';
    case 'fri':
      console.log('almost');
    default:
      return 'weekday';
  }
}
console.log(label('fri'));
```

<details>
<summary>Answer</summary>

- Output — first `almost`, then `weekday`.
- Why — `case 'fri'` has no `break`/`return`, so execution falls through to `default`.
- Note — the `'sat'`/`'sun'` fall-through is intentional, not a mistake. `switch` compares with `===`.

</details>

### Medium · Optional chaining and logical assignment

```js
const config = { retry: 0, user: null };
config.retry ||= 3;
config.timeout ??= 1000;
console.log(config.retry, config.timeout, config.user?.name, config.user?.name.length);
```

<details>
<summary>Answer</summary>

- Output — `3 1000 undefined undefined`.
- `||=` — `0` is falsy, so it is overwritten; use `??=` when `0` is valid.
- `?.` short-circuit — `user` is null, so the whole chain gives `undefined`; `.length` is never evaluated.
- Catch — write `(config.user?.name).length` and the brackets break the chain → `TypeError`.

</details>

### Hard · Turn nested ifs into guard clauses

```js
function shippingFee(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.country === 'IN') {
        if (order.total >= 500) return 0;
        else return 40;
      } else {
        return 250;
      }
    } else {
      return 0;
    }
  }
}
```

Refactor it and list the test cases.

<details>
<summary>Answer</summary>

```js
function shippingFee(order) {
  if (!order || !Array.isArray(order.items)) throw new TypeError('order required');
  if (order.items.length === 0) return 0;
  if (order.country !== 'IN') return 250;
  return order.total >= 500 ? 0 : 40;
}
```

- Guard clauses — invalid/edge cases return first, and the main path stays flat.
- Behaviour change — the original silently returned `undefined` for `null`; now it is an explicit error. Confirm this decision with the callers.
- Cases — `null`, empty items, `'US'`, `'IN'` + 499, `'IN'` + 500.

</details>

## Sources — further reading

- [MDN optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

- [MDN control flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/03-js-conditionals.md)
