---
id: js-loops
title: Loops counters and accumulators
track: javascript
order: 4
level: Foundation
minutes: 3
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

### Edge cases aur reasoning

- Per-iteration binding — for loop ka let callbacks ko separate iteration value deta hai; var ek shared binding deta hai.
- Object key traversal — for...in inherited enumerable keys bhi de sakta hai; own keys ke liye Object.keys/entries prefer karo.
- Loop progress — har branch, including continue, termination ki taraf advance kare; while counter skip ho toh loop atak sakta hai.

## Recall aur practice

- Sawal — while loop mein counter increment se pehle continue aaye toh kya failure possible hai?
- Jawaab — Skipped increment se condition unchanged reh sakti hai aur infinite loop ban sakta hai.
- Khud try karo — Array ka positive-number sum likho; empty input 0, negative skip, zero valid aur original array unchanged verify karo.

## Sources — aur padhne ke liye

- [MDN loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/04-js-loops.md)
