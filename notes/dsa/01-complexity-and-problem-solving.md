---
id: dsa-complexity
title: Complexity and problem solving
track: dsa
order: 1
level: Foundation
minutes: 4
summary: Big-O — input badhne par upper-bound growth; exact milliseconds nahi.
tags: big-o, complexity, problem-solving, invariants
---

## Quick revision

- Big-O — input badhne par upper-bound growth; exact milliseconds nahi.
- O(1) — constant; O(log n) — range shrink; O(n) — single scan.
- O(n log n) — efficient comparison sorts; O(n²) — many pairwise scans.
- Space — auxiliary memory aur recursion stack count karo.
- Worst/average/amortized — alag guarantees; interchangeable nahi.
- Amortized — operations ki sequence ka total cost average karo.
- Recursion — calls × per-call work; stack depth bhi count karo.
- Solve — constraints → brute force → bottleneck → invariant → optimize.
- JS trap — `shift`, `slice`, spread aur string copies ka cost mat bhoolo.
- Independent inputs — two lists sizes n,m hon toh O(n+m); blindly O(n) mat bolo.
- Log base — constant bases Big-O mein equivalent; repeated halving logarithmic growth deta hai.
- Output space — result materialize karna required ho toh minimum output-size cost bhi batao.

### Math shortcuts

- Permutation/combination — ordered choices n!/(n-k)!; unordered choices n!/(k!×(n-k)!), factorial overflow check karo.
- Fast power — nonnegative integer exponent ko halve karke square/multiply; O(log exponent) multiplications.
- Float comparison — precision ke hisaab se tolerance choose; decimal arithmetic par blindly exact equality mat lagao.
- Euclidean GCD — nonnegative a,b mein `(a,b) = (b,a%b)` jab tak b zero; positive inputs par O(log min(a,b)).
- LCM — positive a,b ke liye `(a/gcd(a,b))*b`; pehle divide se intermediate overflow risk kam, result phir bhi overflow kar sakta hai.
- Prime sieve — 2..n ke prime multiples mark; O(n log log n) time, O(n) space.
- Sieve start — prime p ke multiples p² se mark; smaller multiples pehle marked, 0/1 prime nahi.

### Edge cases aur reasoning

- Input encoding — O(W) numeric capacity mein linear, binary input bit-length mein exponential ho sakta; pseudo-polynomial qualifier preserve karo.
- Nested independent costs — repeated halving outer loop aur full scan inner loop O(n log n); loop count alone square cost prove nahi.
- Practical constraints — O(n²) at n=100 aur n=100000 ka feasibility different; input limits se algorithm choose karo.

## Recall aur practice

- Sawal — for i doubling till n aur each step n items scan kare toh complexity?
- Jawaab — O(n log n): logarithmic outer iterations multiplied by linear work; auxiliary space chosen operations se separately count karo.
- Khud try karo — Three snippets ka operation count derive karo: triangular nested scan, doubling loop aur two independent arrays; brute-force feasible bound justify karo.

## Sources — aur padhne ke liye

- [Yangshun Tay — math cheatsheet](https://www.techinterviewhandbook.org/algorithms/math/)
- [CP-Algorithms — Euclidean algorithm](https://cp-algorithms.com/algebra/euclid-algorithm.html)
- [CP-Algorithms — prime sieve](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html)

- [Princeton algorithm analysis](https://algs4.cs.princeton.edu/14analysis/)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/01-complexity-and-problem-solving.md)
