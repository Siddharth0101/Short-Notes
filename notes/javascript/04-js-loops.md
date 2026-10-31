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

> Revision target — Har iteration mein index, accumulator aur exit condition ko track karke off-by-one errors pakdo.

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

## Example se samjho

```js
const values = [3, -1, 4];
let total = 0;
for (let i = 0; i < values.length; i++) {
  if (values[i] < 0) continue;
  total += values[i];
}
console.log(total); // 7
```

- Trace — index `0` par total `3`; index `1` skip; index `2` par total `7`.
- Catch — `for` mein `continue` ke baad update expression chalta hai; manually incremented `while` ka behavior blindly same mat assume karo.
- Check — empty array ka total `0`; last element bhi visit ho, par index `length` access na ho.

## Recall aur practice

- Sawal — while loop mein counter increment se pehle continue aaye toh kya failure possible hai?
- Jawaab — Skipped increment se condition unchanged reh sakti hai aur infinite loop ban sakta hai.
- Khud try karo — Array ka positive-number sum likho; empty input 0, negative skip, zero valid aur original array unchanged verify karo.

## Practice questions

### Easy · Off-by-one sum

```js
const nums = [4, 8, 15];
let sum = 0;
for (let i = 0; i <= nums.length; i++) sum += nums[i];
console.log(sum);
```

<details>
<summary>Answer</summary>

- Output — `NaN`.
- Kyun — last iteration `nums[3]` hai jo `undefined`; `27 + undefined` → `NaN`.
- Fix — `i < nums.length`, ya `for (const n of nums) sum += n`.

</details>

### Easy · `for...in` vs `for...of` on array

```js
const arr = ['a', 'b'];
arr.extra = 'x';
for (const k in arr) console.log(k);
for (const v of arr) console.log(v);
```

<details>
<summary>Answer</summary>

- `for...in` — `'0'`, `'1'`, `'extra'` (enumerable string keys, inherited bhi).
- `for...of` — `'a'`, `'b'` (iterator ke values).
- Rule — arrays par values ke liye `for...of`; objects ke liye `Object.keys/entries`.

</details>

### Medium · Loop jo kabhi khatam nahi hota

```js
let n = 10;
while (n !== 0) {
  n -= 3;
}
```

Problem kya hai aur safe condition kya hogi?

<details>
<summary>Answer</summary>

- Sequence — `10, 7, 4, 1, -2, ...`; `0` kabhi exact nahi aata → infinite loop.
- Fix — `while (n > 0)`; exit condition ko progress direction ke saath match karo.
- Check — har loop mein pucho: "kaunsi value har iteration exit ki taraf move kar rahi hai?"

</details>

### Medium · Pair dhundo aur dono loops roko

`findPair(nums, target)` likho jo pehla pair `[i, j]` (`i < j`) return kare jiska sum `target` ho; na mile toh `null`.

<details>
<summary>Answer</summary>

```js
function findPair(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return null;
}
```

- Exit — function ke andar `return` dono loops turant rokta hai; bahar labelled `break outer` use hota.
- Complexity — `O(n²)` time; `Map` mein seen values rakhkar `O(n)` time, `O(n)` space.
- `j = i + 1` — same element do baar use nahi hota.

</details>

### Hard · Sabse frequent character

`topChar(text)` likho: sabse zyada aane wala character return karo; tie ho toh jo pehle dikha. Empty string par `null`. Emoji bhi sahi count hone chahiye.

<details>
<summary>Answer</summary>

```js
function topChar(text) {
  const counts = new Map();
  for (const ch of text) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let best = null;
  let bestCount = 0;
  for (const [ch, count] of counts) {
    if (count > bestCount) [best, bestCount] = [ch, count];
  }
  return best;
}
```

- `for...of` string — code points iterate karta hai, isliye `'😀'` ek character; index loop use do UTF-16 halves deta.
- Tie — `Map` insertion order rakhta hai aur `>` (not `>=`) pehle wale ko jeetne deta hai.
- Complexity — `O(n)` time, `O(k)` space (distinct characters).

</details>

## Sources — aur padhne ke liye

- [MDN loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

## Code practice

- [Examples — jab code revise karna ho](../../examples/javascript/04-js-loops.md)
