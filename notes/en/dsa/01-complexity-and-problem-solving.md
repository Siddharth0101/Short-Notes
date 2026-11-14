---
id: dsa-complexity
title: Complexity and problem solving
track: dsa
order: 1
level: Foundation
minutes: 4
summary: Big-O — an upper bound on growth as the input grows; not exact milliseconds.
tags: big-o, complexity, problem-solving, invariants
---

## Quick revision

> Revision target — Count the actual operations in the code to explain time, auxiliary space and the input dimensions.

- Big-O — an upper bound on growth as the input grows; not exact milliseconds.
- O(1) — constant; O(log n) — the range shrinks; O(n) — a single scan.
- O(n log n) — efficient comparison sorts; O(n²) — many pairwise scans.
- Space — count auxiliary memory and the recursion stack.
- Worst/average/amortized — different guarantees; not interchangeable.
- Amortized — average the total cost over a sequence of operations.
- Recursion — calls × per-call work; count the stack depth too.
- Solve — constraints → brute force → bottleneck → invariant → optimize.
- JS trap — do not forget the cost of `shift`, `slice`, spread and string copies.
- Independent inputs — for two lists of sizes n and m it is O(n+m); do not blindly say O(n).
- Log base — constant bases are equivalent in Big-O; repeated halving gives logarithmic growth.
- Output space — if the result must be materialized, state the minimum output-size cost too.

### Math shortcuts

- Permutation/combination — ordered choices n!/(n-k)!; unordered choices n!/(k!×(n-k)!); check for factorial overflow.
- Fast power — halve a nonnegative integer exponent and square/multiply; O(log exponent) multiplications.
- Float comparison — choose a tolerance to match the precision; do not blindly apply exact equality to decimal arithmetic.
- Euclidean GCD — for nonnegative a,b apply `(a,b) = (b,a%b)` until b is zero; O(log min(a,b)) on positive inputs.
- LCM — for positive a,b use `(a/gcd(a,b))*b`; dividing first lowers the risk of intermediate overflow, but the result can still overflow.
- Prime sieve — mark the multiples of primes in 2..n; O(n log log n) time, O(n) space.
- Sieve start — mark the multiples of a prime p from p²; smaller multiples are already marked, and 0/1 are not prime.

### Edge cases and reasoning

- Input encoding — O(W) is linear in the numeric capacity but can be exponential in the bit-length of a binary input; keep the pseudo-polynomial qualifier.
- Nested independent costs — an outer loop of repeated halving with a full-scan inner loop is O(n log n); a loop count alone does not prove a square cost.
- Practical constraints — the feasibility of O(n²) differs at n=100 and n=100000; choose the algorithm from the input limits.

## Understand it with an example

- Scenario — One loop reads n items and another independent loop reads m items; with n=4,m=3 there are 7 visits in total.
- Reasoning — Sequential work adds up: O(n+m). If all m items are scanned for each of the n items there are 4×3=12 visits and it is O(nm).
- Catch — Do not conclude O(n²) just from seeing two loops; inspect the nesting, the iteration range, per-iteration copies and output memory separately.

## Recall and practice

- Question — If i doubles until n and every step scans n items, what is the complexity?
- Answer — O(n log n): logarithmic outer iterations multiplied by linear work; count auxiliary space separately from the chosen operations.
- Try it yourself — Derive the operation count of three snippets: a triangular nested scan, a doubling loop and two independent arrays; justify the bound at which brute force is feasible.

## Practice questions

### Easy · Complexity of loops

```js
for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) work();   // A
for (let i = 1; i < n; i *= 2) work();                            // B
for (let i = 0; i < n; i++) for (let j = 0; j < 5; j++) work();   // C
```

<details>
<summary>Answer</summary>

- A — `0 + 1 + ... + (n−1) = n(n−1)/2` → `O(n²)`.
- B — `i` doubles every time → `O(log n)`.
- C — the inner loop is a constant 5 → `O(n)`.

</details>

### Easy · Hidden `O(n²)`

```js
function unique(arr) {
  const out = [];
  for (const x of arr) if (!out.includes(x)) out.push(x);
  return out;
}
```

<details>
<summary>Answer</summary>

- Complexity — `includes` is itself `O(n)`; inside a loop → `O(n²)`.
- Fix — `return [...new Set(arr)];` → `O(n)` on average, order preserved.
- More hidden costs — `arr.shift()` in a loop, `str += ch` (large strings), `indexOf`, `splice`.

</details>

### Medium · Two different inputs

```js
function common(a, b) {
  a.sort((x, y) => x - y);
  let count = 0;
  for (const x of a) for (const y of b) if (x === y) count++;
  return count;
}
```

What is the complexity? Why can calling it `O(n²)` be wrong?

<details>
<summary>Answer</summary>

- Total — `O(a log a + a·b)`; `a` and `b` are independent sizes.
- `O(n²)` only when both are of the same order; keep the variables separate in an interview.
- Better — build a `Set` from `b`: `O(a + b)` time, `O(b)` space.

</details>

### Medium · Fast power

Write `power(x, n)` in `O(log n)`; `n` can also be negative.

<details>
<summary>Answer</summary>

```js
function power(x, n) {
  if (n < 0) return 1 / power(x, -n);
  let result = 1;
  let base = x;
  let exp = n;
  while (exp > 0) {
    if (exp % 2 === 1) result *= base;
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return result;
}
```

- Idea — `x^13 = x^8 · x^4 · x^1` (binary of 13 = 1101).
- Complexity — `O(log n)` multiplications.
- Modular version — for large results apply `% mod` at every step (BigInt above `2^53`).

</details>

### Hard · Primes `≤ n` with a sieve

<details>
<summary>Answer</summary>

```js
function primesUpTo(n) {
  if (n < 2) return [];
  const composite = new Uint8Array(n + 1);
  for (let i = 2; i * i <= n; i++) {
    if (composite[i]) continue;
    for (let j = i * i; j <= n; j += i) composite[j] = 1;
  }
  const primes = [];
  for (let i = 2; i <= n; i++) if (!composite[i]) primes.push(i);
  return primes;
}
```

- Start from `i * i` — smaller multiples were already marked by smaller primes.
- Complexity — `O(n log log n)` time, `O(n)` space.
- A sieve is overkill for checking a single number — use `O(√n)` trial division.

</details>

## Sources — further reading

- [Yangshun Tay — math cheatsheet](https://www.techinterviewhandbook.org/algorithms/math/)
- [CP-Algorithms — Euclidean algorithm](https://cp-algorithms.com/algebra/euclid-algorithm.html)
- [CP-Algorithms — prime sieve](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html)

- [Princeton algorithm analysis](https://algs4.cs.princeton.edu/14analysis/)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/01-complexity-and-problem-solving.md)
