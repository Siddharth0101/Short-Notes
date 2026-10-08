---
id: dsa-monotonic-stack-lab
title: Monotonic stacks and amortized reasoning
track: dsa
order: 8
level: Advanced
minutes: 3
summary: Monotonic stack — candidates ko increasing/decreasing order mein rakho.
tags: dsa, monotonic-stack, amortized, arrays
visual: monotonic-stack
---

## Quick revision

- Monotonic stack — candidates ko increasing/decreasing order mein rakho.
- Next greater — current value se chhote unresolved candidates pop/resolve karo.
- Indices — distance/position chahiye toh values ki jagah indices store karo.
- Duplicates — strict vs non-strict comparison question ke contract se decide.
- Amortized O(n) — har item ek baar push aur maximum ek baar pop.
- Daily temperatures — warmer day ka index minus old index answer.
- Unresolved — scan ke end par bache items ka default answer rakho.
- Histogram area — popped bar ki height × nearest smaller boundaries ke beech width.
- Circular next-greater — indices wrap karke two-pass scan; answers/stack additions bounded rakho.
- Monotonic deque — expired front aur dominated back hataakar sliding maximum maintain.

### Edge cases aur reasoning

- Histogram width — pop ke baad smaller left index aur current right boundary ke beech width = right-left-1; sentinel convention explicit rakho.
- Equal heights — > versus >= pop policy equal candidates assign differently; area/next-strict answer contract se consistency prove karo.
- Deque expiry — window se expired index front se remove before answer; dominated values back se remove, both invariants separately maintain karo.

## Recall aur practice

- Sawal — Histogram [2,2] ka max area 2 hoga ya 4?
- Jawaab — 4; adjacent equal heights width2 form karte. Strict/non-strict stack policy correct shared span account kare.
- Khud try karo — Histogram area aur sliding maximum trace karo; equal heights, increasing/decreasing values, k=1 aur invalid k policy verify karo.

## Sources — aur padhne ke liye

- [MIT algorithms materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/08-monotonic-stack-lab.md)
