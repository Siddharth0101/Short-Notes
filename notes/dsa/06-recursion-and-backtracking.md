---
id: dsa-recursion
title: Recursion and backtracking
track: dsa
order: 6
level: Intermediate
minutes: 3
summary: Recursion — function smaller subproblem ko call karta hai.
tags: recursion, backtracking, call-stack, subsets
visual: recursion-stack
---

## Quick revision

> Revision target — Recursion state, base case aur undo ko independent output snapshots se connect karo.

- Recursion — function smaller subproblem ko call karta hai.
- Base case — recursion rokne ka valid smallest case.
- Progress — har call base case ke paas jaaye.
- Call stack — pending calls memory leti hain; depth limit socho.
- Backtracking — choose → explore → undo.
- Pruning — impossible branch early skip; valid solutions lose na karo.
- Snapshot — result mein mutable path ki copy save karo.
- Memoization — same state ka computed result reuse karo.
- Complexity — branching factor aur depth se tree size estimate karo.
- Permutations/subsets — order matters / selection matters; duplicate handling accordingly.
- Visited undo — path-specific visited mark ko backtrack par release; global graph visited ka rule alag.
- Tail recursion — language/runtime optimization guaranteed na ho toh stack space still count karo.

### Edge cases aur reasoning

- Duplicate branches — sorted input mein same-depth equivalent choice skip; index-level reuse policy se valid repeated elements preserve karo.
- Output lower bound — n distinct items ke subsets 2^n; full materialized paths ki time/space output-size dependent, O(n) claim mat karo.
- Memo context — same index but different remaining budget/visited set different state; incomplete cache key wrong solution reuse karega.

## Example se samjho

- Scenario — Distinct `[A,B]` ke subsets choose/skip recursion se enumerate karne hain.
- Reasoning — Each index par skip/take; terminal paths `[]`, `[B]`, `[A]`, `[A,B]` ho sakte hain. Take ke baad return par pop next branch ko clean state deta hai.
- Catch — Saved path ki copy lo; same mutable reference se answers badlenge. Full subsets output ki cost exponential hai, recursion depth alone total space nahi batati.

## Recall aur practice

- Sawal — result.push(path) ke baad path.pop() se saved solutions kyun badal sakti hain?
- Jawaab — Same mutable array reference save hua; result mein path copy store karo.
- Khud try karo — Unique subsets of [1,1,2] generate karo; 6 distinct subsets, input unchanged aur each result independent array verify karo.

## Practice questions

### Easy · Recursive sum aur base case

```js
function sum(arr) {
  return arr[0] + sum(arr.slice(1));
}
```

<details>
<summary>Answer</summary>

- Bug — base case nahi; empty array par `undefined + ...` aur infinite recursion → `RangeError: Maximum call stack size exceeded`.
- Fix — `if (arr.length === 0) return 0;`.
- Cost — `slice` har level copy → `O(n²)`; index parameter pass karo: `sum(arr, i + 1)`.

</details>

### Medium · Saare subsets

`[1,2,3]` ke saare subsets.

<details>
<summary>Answer</summary>

```js
function subsets(nums) {
  const result = [];
  const path = [];
  (function backtrack(start) {
    result.push([...path]); // snapshot
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop(); // undo
    }
  })(0);
  return result;
}
```

- Snapshot — `path` reuse hota hai; copy na karo toh saare results empty dikhte hain.
- Output — `2^n` subsets; complexity `O(n · 2^n)` (copy cost).

</details>

### Medium · Duplicates ke saath permutations

`[1,1,2]` ke unique permutations.

<details>
<summary>Answer</summary>

```js
function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const result = [], path = [], used = Array(nums.length).fill(false);
  (function backtrack() {
    if (path.length === nums.length) return result.push([...path]);
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue; // duplicate branch
      used[i] = true; path.push(nums[i]);
      backtrack();
      used[i] = false; path.pop();
    }
  })();
  return result;
}
```

- Sort + skip — same value ko same position par do baar choose nahi karte.
- Output — `[[1,1,2],[1,2,1],[2,1,1]]`.

</details>

### Medium · Climbing stairs memoization

1 ya 2 steps; `n` steps tak pahunchne ke tareeke.

<details>
<summary>Answer</summary>

```js
function climb(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  const ways = climb(n - 1, memo) + climb(n - 2, memo);
  memo.set(n, ways);
  return ways;
}
```

- Bina memo — `O(2^n)`; memo ke saath `O(n)`.
- Iterative — do variables se `O(1)` space; bahut bade `n` par recursion depth bhi bachti hai.

</details>

### Hard · Grid mein word search

Board mein adjacent (up/down/left/right) letters se word ban sakta hai? Ek cell ek word mein ek hi baar.

<details>
<summary>Answer</summary>

```js
function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[i]) return false;
    const saved = board[r][c];
    board[r][c] = '#'; // visited
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = saved; // undo
    return found;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dfs(r, c, 0)) return true;
  return false;
}
```

- Visited undo — backtrack par cell restore, warna doosre paths block.
- Pruning — letter mismatch par turant return.
- Complexity — `O(R · C · 4^L)` worst case.

</details>

## Sources — aur padhne ke liye

- [Princeton recursion chapter](https://introcs.cs.princeton.edu/java/23recursion/)
- [MDN recursion error reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/06-recursion-and-backtracking.md)
