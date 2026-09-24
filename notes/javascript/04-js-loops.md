---
id: js-loops
title: Loops counters and accumulators
track: javascript
order: 4
level: Foundation
minutes: 1
summary: `for` — initialization → condition → body → update repeat hota hai.
tags: fundamentals, js, loops
---

## Quick revision

- `for` — initialization → condition → body → update repeat hota hai.
- `while` — condition pehle check; body zero baar bhi chal sakti hai.
- `do...while` — body kam-se-kam ek baar chalti hai.
- `for...of` — iterable ki values; `for...in` — enumerable string keys.
- `break` — loop rokta hai; `continue` — current iteration skip.
- Index — array mein `0` se `length - 1` tak; condition `i < length`.
- Infinite loop — condition kabhi false na ho; counter/update check karo.
- Nested loop — cost iterations ke total se nikalo; hamesha O(n²) assume mat karo.
- Accumulator — total/count ko loop se pehle initialize, andar update karo.
- Reverse traversal — end se delete karne par remaining earlier indices shift nahi hote.
- Iterable — `for...of` plain object par direct nahi; `Object.entries(obj)` use kar sakte ho.

## Sources — aur padhne ke liye

- [MDN loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/04-js-loops.md)
