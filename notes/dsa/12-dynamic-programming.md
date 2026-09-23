---
id: dsa-dynamic-programming
title: Dynamic programming from state to recurrence
track: dsa
order: 12
level: Advanced
minutes: 1
summary: DP — overlapping subproblems ke results reuse karo.
tags: dynamic-programming, memoization, tabulation, coin-change, knapsack
visual: dynamic-programming
---

## Quick revision

- DP — overlapping subproblems ke results reuse karo.
- State — subproblem ko uniquely define karne wali minimum information.
- Transition — smaller states se current answer ka relation.
- Base case — smallest states ke known answers.
- Memoization — top-down recursion + cache.
- Tabulation — bottom-up dependency order mein fill karo.
- Complexity — states × transition cost; storage alag count.
- 0/1 knapsack — one-array optimization mein capacity reverse scan.
- Unbounded choice — reuse allowed; loop order contract ke hisaab se.
- Reconstruction — choices/parents store karo jab actual solution chahiye.
- Optimization — sirf required prior states rakho; dependency overwrite mat karo.

## Research notes: Numeric magnitude can dominate DP

- O(nW) knapsack numeric capacity W par depend karta hai.

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf)
- [Princeton's recursion and dynamic programming discussion](https://introcs.cs.princeton.edu/java/23recursion/)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/12-dynamic-programming.md)
