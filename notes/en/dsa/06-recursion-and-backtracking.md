---
id: dsa-recursion
title: Recursion and backtracking
track: dsa
order: 6
level: Intermediate
minutes: 3
summary: Recursion — a function calls itself on a smaller subproblem.
tags: recursion, backtracking, call-stack, subsets
visual: recursion-stack
---

## Quick revision

> Revision target — Connect the recursion state, the base case and the undo step to independent output snapshots.

- Recursion — a function calls itself on a smaller subproblem.
- Base case — the valid smallest case that stops the recursion.
- Progress — every call must move closer to the base case.
- Call stack — pending calls take memory; think about the depth limit.
- Backtracking — choose → explore → undo.
- Pruning — skip an impossible branch early; do not lose valid solutions.
- Snapshot — save a copy of the mutable path in the result.
- Memoization — reuse the computed result of the same state.
- Complexity — estimate the tree size from the branching factor and depth.
- Permutations/subsets — order matters / selection matters; handle duplicates accordingly.
- Visited undo — release a path-specific visited mark on backtrack; the rule for a global graph visited set is different.
- Tail recursion — when the language/runtime does not guarantee the optimization, still count the stack space.

### Edge cases and reasoning

- Duplicate branches — in sorted input skip an equivalent choice at the same depth; preserve valid repeated elements through the index-level reuse policy.
- Output lower bound — n distinct items have 2^n subsets; the time/space of fully materialized paths depends on the output size, so do not claim O(n).
- Memo context — the same index with a different remaining budget/visited set is a different state; an incomplete cache key reuses a wrong solution.

## Understand it with an example

- Scenario — Enumerate the subsets of distinct `[A,B]` with choose/skip recursion.
- Reasoning — At each index skip/take; the terminal paths can be `[]`, `[B]`, `[A]`, `[A,B]`. Popping on return after a take gives the next branch a clean state.
- Catch — Take a copy of the saved path; with the same mutable reference the answers will change. The cost of the full subsets output is exponential; recursion depth alone does not give the total space.

## Recall and practice

- Question — Why can path.pop() after result.push(path) change the saved solutions?
- Answer — The same mutable array reference was saved; store a copy of the path in the result.
- Try it yourself — Generate the unique subsets of [1,1,2]; verify 6 distinct subsets, an unchanged input and that each result is an independent array.

## Practice questions

### Easy · Recursive sum and the base case

```js
function sum(arr) {
  return arr[0] + sum(arr.slice(1));
}
```

<details>
<summary>Answer</summary>

- Bug — no base case; on an empty array `undefined + ...` and infinite recursion → `RangeError: Maximum call stack size exceeded`.
- Fix — `if (arr.length === 0) return 0;`.
- Cost — `slice` copies at every level → `O(n²)`; pass an index parameter: `sum(arr, i + 1)`.

</details>

### Medium · All subsets

All the subsets of `[1,2,3]`.

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

- Snapshot — `path` is reused; without a copy every result shows up empty.
- Output — `2^n` subsets; the complexity is `O(n · 2^n)` (the copy cost).

</details>

### Medium · Permutations with duplicates

The unique permutations of `[1,1,2]`.

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

- Sort + skip — the same value is not chosen twice for the same position.
- Output — `[[1,1,2],[1,2,1],[2,1,1]]`.

</details>

### Medium · Climbing stairs memoization

1 or 2 steps; the number of ways to reach `n` steps.

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

- Without memo — `O(2^n)`; with memo `O(n)`.
- Iterative — `O(1)` space with two variables; for a very large `n` it also avoids the recursion depth.

</details>

### Hard · Word search in a grid

Can the word be formed from adjacent (up/down/left/right) letters on the board? A cell is used only once per word.

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

- Visited undo — restore the cell on backtrack, otherwise other paths are blocked.
- Pruning — return immediately on a letter mismatch.
- Complexity — `O(R · C · 4^L)` in the worst case.

</details>

## Sources — further reading

- [Princeton recursion chapter](https://introcs.cs.princeton.edu/java/23recursion/)
- [MDN recursion error reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/06-recursion-and-backtracking.md)
