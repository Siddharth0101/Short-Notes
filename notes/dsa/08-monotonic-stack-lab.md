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

> Revision target — Unresolved candidates aur pop condition se linear total work justify karo.

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

## Example se samjho

- Scenario — Strict next-greater values `[3,1,4]` ke liye indices ka stack lo.
- Reasoning — 3 aur1 unresolved push;4 aate hi1 aur3 dono resolve to4. Last4 ka answer absent sentinel. Har index ek push aur maximum ek pop.
- Catch — Nested while ko automatically O(n²) mat bolo; total pops n se bounded hain. Equal value strict greater ka answer nahi hoti.

## Recall aur practice

- Sawal — Histogram [2,2] ka max area 2 hoga ya 4?
- Jawaab — 4; adjacent equal heights width2 form karte. Strict/non-strict stack policy correct shared span account kare.
- Khud try karo — Histogram area aur sliding maximum trace karo; equal heights, increasing/decreasing values, k=1 aur invalid k policy verify karo.

## Practice questions

### Easy · Next greater element trace

`[2, 1, 2, 4, 3]` ke har element ka next greater (right side ka pehla bada) batao; na ho toh `-1`.

<details>
<summary>Answer</summary>

- Output — `[4, 2, 4, -1, -1]`.
- Note — pehle `2` ke liye next greater `4` hai (beech ka `2` equal hai, greater nahi).
- Stack idea — unresolved indexes stack mein; bada element aaye toh woh unka answer.

</details>

### Medium · Daily temperatures

Har din ke liye kitne din baad garmi badhegi? `[73,74,75,71,69,72,76,73]` → `[1,1,4,2,1,1,0,0]`.

<details>
<summary>Answer</summary>

```js
function dailyTemperatures(temps) {
  const answer = Array(temps.length).fill(0);
  const stack = []; // indexes, temps decreasing
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}
```

- Indexes store karo — distance nikalne ke liye value kaafi nahi.
- Amortized `O(n)` — har index ek baar push, ek baar pop.

</details>

### Medium · Circular next greater

`[1, 2, 1]` circular array → `[2, -1, 2]`.

<details>
<summary>Answer</summary>

```js
function nextGreaterCircular(nums) {
  const n = nums.length;
  const answer = Array(n).fill(-1);
  const stack = [];
  for (let k = 0; k < 2 * n; k++) {
    const i = k % n;
    while (stack.length && nums[i] > nums[stack.at(-1)]) answer[stack.pop()] = nums[i];
    if (k < n) stack.push(i);
  }
  return answer;
}
```

- Do pass — second pass mein wrap-around candidates milte hain.
- Sirf pehle pass mein push — har index ek hi baar resolve hota hai.

</details>

### Hard · Histogram mein largest rectangle

`[2,1,5,6,2,3]` → `10`.

<details>
<summary>Answer</summary>

```js
function largestRectangle(heights) {
  const stack = []; // increasing heights ke indexes
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i]; // sentinel flush
    while (stack.length && h < heights[stack.at(-1)]) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack.at(-1) : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}
```

- Pop par — bar ka right boundary `i` (pehla chhota), left boundary naya stack top.
- Width — `i − left − 1`; stack khaali ho toh bar left edge tak extend.
- Sentinel `0` — end mein bache bars flush.

</details>

### Hard · Sliding window maximum

`nums = [1,3,-1,-3,5,3,6,7]`, `k = 3` → `[3,3,5,5,6,7]`.

<details>
<summary>Answer</summary>

```js
function maxSlidingWindow(nums, k) {
  const deque = []; // indexes, values decreasing
  let head = 0;
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length > head && nums[deque.at(-1)] <= nums[i]) deque.pop();
    deque.push(i);
    if (deque[head] <= i - k) head++; // expired front
    if (i >= k - 1) out.push(nums[deque[head]]);
  }
  return out;
}
```

- Monotonic deque — front hamesha current window ka max.
- Expiry — front index window se bahar ho toh hatao.
- `O(n)` — har index ek baar add/remove (head pointer se front pop `O(1)`).

</details>

## Sources — aur padhne ke liye

- [MIT algorithms materials](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/08-monotonic-stack-lab.md)
