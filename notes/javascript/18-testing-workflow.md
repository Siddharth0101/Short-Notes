---
id: javascript-testing-workflow
title: Testing aur debugging — bug ko repeatable proof banao
track: javascript
order: 18
level: Intermediate
minutes: 3
summary: Unit test — chhota isolated behavior check karo.
tags: testing, assertions, debugging, async
---

## Quick revision

> Revision target — Bug ko smallest reproducible input mein badlo; test expected public behavior aur async completion verify kare.

- Unit test — chhota isolated behavior check karo.
- Integration test — real boundaries milkar kaam karte hain ya nahi.
- Arrange/Act/Assert — setup karo, action chalao, expected result check karo.
- Boundary cases — empty, duplicate, invalid aur failure inputs bhi lo.
- Async test — Promise return/await karo; warna test jaldi pass ho sakta hai.
- Fake timer — clock control karo; cleanup aur pending work check karo.
- Mock — controlled dependency; implementation details ko test mat banao.
- Regression — bug reproduce karne wala test fix ko protect karta hai.
- Test isolation — shared state/timers restore; order change se test result nahi badalna chahiye.
- Property check — individual examples ke saath invariant verify, jaise sorted output aur preserved items.
- Flaky test — uncontrolled clock/network/randomness identify; blind retry se root cause nahi mit-ta.

### Edge cases aur reasoning

- Rejection assertion — expected async failure ko await assert.rejects se verify; synchronous throws check Promise failure ko cover nahi karta.
- Oracle independence — expected answer same implementation se compute mat karo; known cases ya simpler brute-force reference use karo.
- Resource verification — success ke saath abort/error par listener, handle aur timer cleanup bhi observable contract hai.

## Example se samjho

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

- Trace — empty case missing initial accumulator ko pakadta hai; multi-item case skipped element ko expose karta hai.
- Catch — function ke loop count ko assert karna unnecessary implementation coupling hoga; result ka contract verify karo.
- Check — async behavior test ho toh returned promise await/return karo; test complete hone ke baad assertion lost nahi honi chahiye.

## Recall aur practice

- Sawal — Test callback ke andar unawaited Promise assertion reliable kyun nahi?
- Jawaab — Runner test complete maan sakta hai before assertion settles; Promise return ya await karna chahiye.
- Khud try karo — Async loader ke success, rejection aur cleanup tests likho; failed request par caller draft unchanged verify karo.

## Practice questions

### Easy · AAA style unit test

`applyDiscount(price, percent)` ke liye `node:test` mein tests likho: normal case, `0%`, `100%`, aur invalid `150%` par error.

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

- Boundary — 0 aur 100 jaise edges par hi bugs chhupte hain.
- Ek test, ek behaviour — failure message se seedha pata chale kya toota.

</details>

### Medium · Async test jo hamesha pass hota hai

```js
test('loads user', () => {
  loadUser(1).then((user) => assert.equal(user.name, 'Wrong'));
});
```

<details>
<summary>Answer</summary>

- Bug — promise return/await nahi hua; test function turant khatam, assertion baad mein (ya unhandled rejection) chalta hai.
- Fix — `test('loads user', async () => { const user = await loadUser(1); assert.equal(user.name, 'Asha'); });`
- Rejection test — `await assert.rejects(loadUser(-1), /not found/)`.

</details>

### Medium · Debounce ko bina wait kiye test karo

300ms debounce wale search ko real 300ms wait kiye bina kaise test karoge?

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

- Fake timers — time ko manually aage badhao; tests fast aur deterministic.
- Boundary — 299 par call nahi, 300 par exactly ek.

</details>

### Medium · Flaky test ke causes

CI par ek test kabhi pass, kabhi fail. Teen common causes aur unke fixes batao.

<details>
<summary>Answer</summary>

- Time — `Date.now()`/timezone par depend; clock inject karo ya fake timers.
- Shared state — pichle test ka data/global mock bacha; `beforeEach` mein reset, tests ko order-independent banao.
- Real I/O — network/race; dependency fake karo, ya async completion ko properly `await` karo (arbitrary `sleep` nahi).
- Process — flaky test ko quarantine karke root cause fix karo; retry-until-green bug chhupata hai.

</details>

### Hard · Regression test aur independent oracle

Bug: cart mein `0.1` price ke 3 items ka total `0.30000000000000004` dikh raha hai. Test kaise likhoge, aur expected value same `calculateTotal` function se kyun nahi nikalni chahiye?

<details>
<summary>Answer</summary>

- Pehle failing test — `assert.equal(formatTotal(cartWith(3, 10)), '₹0.30')` (prices paise mein: 10).
- Fix — prices integer paise mein store/compute karo; sirf display par divide karke format.
- Independent oracle — expected value hand-computed constant ho; same code se expected nikaloge toh bug dono taraf same hoga aur test pass ho jaayega.
- Property check — random carts par "total === sum of line totals" aur "total >= 0" verify karo.

</details>

## Sources — aur padhne ke liye

- [Node test runner](https://nodejs.org/api/test.html)
- [strict assertions](https://nodejs.org/api/assert.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/18-testing-workflow.md)
