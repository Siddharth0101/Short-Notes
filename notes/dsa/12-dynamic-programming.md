---
id: dsa-dynamic-programming
title: Dynamic programming from state to recurrence
track: dsa
order: 12
level: Advanced
minutes: 4
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
- Counting order — coin loop aur amount loop ka order combinations vs permutations change kar sakta hai.
- Impossible state — infinity/negative sentinel safely choose; overflow aur invalid transitions avoid.
- DAG view — DP states dependencies ka graph; valid evaluation order pehle dependencies solve kare.

### Common DP states

- Grid traveler — state row/column; blocked/boundary cells ke base cases clear karo.
- Coin change — minimum coins aur combination count alag transitions maangte hain.
- LCS — two-prefix state; matching chars par diagonal + 1, warna neighboring maximum.

### Edge cases aur reasoning

- LIS quadratic — dp[i]=1+max(dp[j]) for j<i and a[j]<a[i]; O(n²) time, O(n) space for strictly increasing subsequence.
- LIS tails — smallest tail per length + lower_bound gives O(n log n) length; tails array actual valid subsequence necessarily nahi.
- Edit distance — prefix states; match diagonal unchanged, otherwise 1+min(insert,delete,replace); O(nm) time, rolling rows O(min(n,m)) space.
- Memo key completeness — index alone insufficient when budget/previous choice changes result; all future-relevant information key mein include karo.
- Counting precision — many-path counts safe-integer bound cross kar sakte; BigInt/modulus contract explicitly choose karo.

## Research notes: Numeric magnitude can dominate DP

- O(nW) knapsack numeric capacity W par depend karta hai.

## Recall aur practice

- Sawal — 0/1 knapsack capacity forward scan se same item reuse kaise hota hai?
- Jawaab — Current item ka updated smaller-capacity state later read hota; reverse scan previous-item states preserve karta hai.
- Khud try karo — LIS [3,1,2,2,4] result3 aur edit distance kitten→sitting result3 verify karo; empty inputs aur duplicate strictness explain karo.

## Sources — aur padhne ke liye

- [MIT dynamic programming course materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/pages/lecture-notes/)

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf)
- [Princeton's recursion and dynamic programming discussion](https://introcs.cs.princeton.edu/java/23recursion/)
- [Princeton's analysis chapter](https://algs4.cs.princeton.edu/14analysis/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/12-dynamic-programming.md)
