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

> Revision target — Code ke actual operations gin kar time, auxiliary space aur input dimensions explain karo.

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

## Example se samjho

- Scenario — Ek loop n items padhta hai aur doosra independent loop m items; n=4,m=3 par total7 visits hain.
- Reasoning — Sequential work add hota hai: O(n+m). Har n item ke liye all m items scan hon toh4×3=12 visits aur O(nm).
- Catch — Two loops dikhne se O(n²) conclude mat karo; nesting, iteration range, per-iteration copies aur output memory alag inspect karo.

## Recall aur practice

- Sawal — for i doubling till n aur each step n items scan kare toh complexity?
- Jawaab — O(n log n): logarithmic outer iterations multiplied by linear work; auxiliary space chosen operations se separately count karo.
- Khud try karo — Three snippets ka operation count derive karo: triangular nested scan, doubling loop aur two independent arrays; brute-force feasible bound justify karo.

## Practice questions

### Easy · Loops ki complexity

```js
for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) work();   // A
for (let i = 1; i < n; i *= 2) work();                            // B
for (let i = 0; i < n; i++) for (let j = 0; j < 5; j++) work();   // C
```

<details>
<summary>Answer</summary>

- A — `0 + 1 + ... + (n−1) = n(n−1)/2` → `O(n²)`.
- B — `i` har baar double → `O(log n)`.
- C — inner loop constant 5 → `O(n)`.

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

- Complexity — `includes` khud `O(n)`; loop ke andar → `O(n²)`.
- Fix — `return [...new Set(arr)];` → `O(n)` average, order preserved.
- Aur hidden costs — loop mein `arr.shift()`, `str += ch` (bade strings), `indexOf`, `splice`.

</details>

### Medium · Do alag inputs

```js
function common(a, b) {
  a.sort((x, y) => x - y);
  let count = 0;
  for (const x of a) for (const y of b) if (x === y) count++;
  return count;
}
```

Complexity kya hai? Isse `O(n²)` kehna kyun galat ho sakta hai?

<details>
<summary>Answer</summary>

- Total — `O(a log a + a·b)`; `a` aur `b` independent sizes hain.
- `O(n²)` sirf tab jab dono same order ke hon; interview mein variables alag rakho.
- Better — `b` ka `Set` banao: `O(a + b)` time, `O(b)` space.

</details>

### Medium · Fast power

`power(x, n)` likho `O(log n)` mein; `n` negative bhi ho sakta hai.

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
- Modular version — bade results ke liye har step `% mod` (BigInt agar `2^53` se upar).

</details>

### Hard · Sieve se primes `≤ n`

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

- `i * i` se start — chhote multiples pehle hi chhote primes ne mark kar diye.
- Complexity — `O(n log log n)` time, `O(n)` space.
- Single number check ke liye sieve overkill — `O(√n)` trial division.

</details>

## Sources — aur padhne ke liye

- [Yangshun Tay — math cheatsheet](https://www.techinterviewhandbook.org/algorithms/math/)
- [CP-Algorithms — Euclidean algorithm](https://cp-algorithms.com/algebra/euclid-algorithm.html)
- [CP-Algorithms — prime sieve](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html)

- [Princeton algorithm analysis](https://algs4.cs.princeton.edu/14analysis/)
- [ECMAScript Map specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/01-complexity-and-problem-solving.md)
