---
id: javascript-testing-workflow
title: Testing and debugging — turn a bug into repeatable proof
track: javascript
order: 18
level: Intermediate
minutes: 3
summary: Unit test — check one small, isolated behaviour.
tags: testing, assertions, debugging, async
---

## Quick revision

> Revision target — Reduce a bug to the smallest reproducible input; the test should verify the expected public behaviour and async completion.

- Unit test — check one small, isolated behaviour.
- Integration test — whether real boundaries work together.
- Arrange/Act/Assert — set up, run the action, check the expected result.
- Boundary cases — include empty, duplicate, invalid and failure inputs too.
- Async test — return/await the Promise; otherwise the test can pass too early.
- Fake timer — control the clock; check cleanup and pending work.
- Mock — a controlled dependency; do not turn implementation details into the test.
- Regression — a test that reproduces the bug protects the fix.
- Test isolation — restore shared state/timers; changing the order must not change a test's result.
- Property check — alongside individual examples verify an invariant, such as sorted output and preserved items.
- Flaky test — identify the uncontrolled clock/network/randomness; a blind retry does not remove the root cause.

### Edge cases and reasoning

- Rejection assertion — verify an expected async failure with await assert.rejects; a synchronous throws check does not cover a Promise failure.
- Oracle independence — do not compute the expected answer with the same implementation; use known cases or a simpler brute-force reference.
- Resource verification — besides success, cleanup of listeners, handles and timers on abort/error is also an observable contract.

## Understand it with an example

```js
import assert from "node:assert/strict";
import test from "node:test";

const total = (items) => items.reduce((sum, item) => sum + item, 0);
test("empty cart has zero total", () => {
  assert.equal(total([]), 0);
});
test("all items contribute", () => {
  assert.equal(total([10, 5, 2]), 17);
});
```

- Trace — the empty case catches a missing initial accumulator; the multi-item case exposes a skipped element.
- Catch — asserting the function's loop count would be unnecessary implementation coupling; verify the contract of the result.
- Check — when testing async behaviour, await/return the returned promise; an assertion must not be lost after the test completes.

## Recall and practice

- Question — Why is an unawaited Promise assertion inside a test callback unreliable?
- Answer — The runner can consider the test complete before the assertion settles; the Promise must be returned or awaited.
- Try it yourself — Write success, rejection and cleanup tests for an async loader; verify that a failed request leaves the caller's draft unchanged.

## Practice questions

### Easy · An AAA-style unit test

Write tests in `node:test` for `applyDiscount(price, percent)`: the normal case, `0%`, `100%`, and an error for an invalid `150%`.

<details>
<summary>Answer</summary>

```js
import test from 'node:test';
import assert from 'node:assert/strict';

test('applies a percentage discount', () => {
  assert.equal(applyDiscount(200, 10), 180); // arrange+act+assert
});
test('handles boundaries', () => {
  assert.equal(applyDiscount(200, 0), 200);
  assert.equal(applyDiscount(200, 100), 0);
});
test('rejects invalid percent', () => {
  assert.throws(() => applyDiscount(200, 150), RangeError);
});
```

- Boundary — bugs hide exactly at edges like 0 and 100.
- One test, one behaviour — the failure message should say directly what broke.

</details>

### Medium · The async test that always passes

```js
test('loads user', () => {
  loadUser(1).then((user) => assert.equal(user.name, 'Wrong'));
});
```

<details>
<summary>Answer</summary>

- Bug — the promise was not returned/awaited; the test function ends immediately and the assertion runs later (or as an unhandled rejection).
- Fix — `test('loads user', async () => { const user = await loadUser(1); assert.equal(user.name, 'Asha'); });`
- Rejection test — `await assert.rejects(loadUser(-1), /not found/)`.

</details>

### Medium · Test a debounce without waiting

How do you test a search with a 300ms debounce without really waiting 300ms?

<details>
<summary>Answer</summary>

```js
test('calls once after the pause', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const calls = [];
  const search = debounce((q) => calls.push(q), 300);
  search('r'); search('re'); search('react');
  t.mock.timers.tick(299);
  assert.deepEqual(calls, []);
  t.mock.timers.tick(1);
  assert.deepEqual(calls, ['react']);
});
```

- Fake timers — advance time manually; the tests are fast and deterministic.
- Boundary — no call at 299, exactly one at 300.

</details>

### Medium · Causes of a flaky test

A test sometimes passes and sometimes fails on CI. Name three common causes and their fixes.

<details>
<summary>Answer</summary>

- Time — depends on `Date.now()`/the timezone; inject the clock or use fake timers.
- Shared state — data or a global mock left over from the previous test; reset in `beforeEach` and make tests order-independent.
- Real I/O — network/race; fake the dependency, or properly `await` the async completion (not an arbitrary `sleep`).
- Process — quarantine the flaky test and fix the root cause; retry-until-green hides the bug.

</details>

### Hard · A regression test and an independent oracle

Bug: the total for 3 items priced `0.1` in the cart shows `0.30000000000000004`. How do you write the test, and why should the expected value not come from the same `calculateTotal` function?

<details>
<summary>Answer</summary>

- A failing test first — `assert.equal(formatTotal(cartWith(3, 10)), '₹0.30')` (prices in paise: 10).
- Fix — store/compute prices as integer paise; divide and format only for display.
- Independent oracle — the expected value should be a hand-computed constant; derive it from the same code and the bug is identical on both sides, so the test passes.
- Property check — on random carts verify "total === sum of line totals" and "total >= 0".

</details>

## Sources — further reading

- [Node test runner](https://nodejs.org/api/test.html)
- [strict assertions](https://nodejs.org/api/assert.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/javascript/18-testing-workflow.md)
