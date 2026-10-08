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

## Recall aur practice

- Sawal — Test callback ke andar unawaited Promise assertion reliable kyun nahi?
- Jawaab — Runner test complete maan sakta hai before assertion settles; Promise return ya await karna chahiye.
- Khud try karo — Async loader ke success, rejection aur cleanup tests likho; failed request par caller draft unchanged verify karo.

## Sources — aur padhne ke liye

- [Node test runner](https://nodejs.org/api/test.html)
- [strict assertions](https://nodejs.org/api/assert.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/18-testing-workflow.md)
