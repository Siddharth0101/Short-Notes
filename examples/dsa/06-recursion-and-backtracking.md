# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Write the contract first

```js
function sumFrom(nums, i = 0) {
  if (i === nums.length) return 0;
  return nums[i] + sumFrom(nums, i + 1);
}
// sumFrom([2, 5, 1])
// 2 + (5 + (1 + 0)) = 8
```

## Trace the stack, don't just trust it

```text
push  sumFrom(i=0)   -> needs nums[0] + sumFrom(1)
push  sumFrom(i=1)   -> needs nums[1] + sumFrom(2)
push  sumFrom(i=2)   -> needs nums[2] + sumFrom(3)
push  sumFrom(i=3)   -> base case, returns 0        <- deepest frame
pop   sumFrom(i=2)   returns 1 + 0 = 1
pop   sumFrom(i=1)   returns 5 + 1 = 6
pop   sumFrom(i=0)   returns 2 + 6 = 8              <- final answer
```

```js
function sumFromTail(nums, i = 0, acc = 0) {
  if (i === nums.length) return acc;
  return sumFromTail(nums, i + 1, acc + nums[i]); // return ke baad kuch pending nahi
}
```

## Recursion trees and repeated subproblems

```js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(5) ka tree:
//                 fib(5)
//            /              \
//        fib(4)            fib(3)
//        /     \           /     \
//    fib(3)   fib(2)   fib(2)   fib(1)
//    /   \     /   \    /   \
// fib(2) f(1) f(1) f(0) f(1) f(0)
```

```js
function fibMemo(n, cache = new Map()) {
  if (n < 2) return n;
  if (cache.has(n)) return cache.get(n);
  const value = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  cache.set(n, value);
  return value;
}
```

## Backtracking explores choices

```js
function subsets(values) {
  const result = [];
  const chosen = [];
  function visit(index) {
    if (index === values.length) {
      result.push([...chosen]);
      return;
    }
    visit(index + 1); // exclude
    chosen.push(values[index]);
    visit(index + 1); // include
    chosen.pop(); // restore the caller's state
  }
  visit(0);
  return result;
}
```

## Common variants

```js
function permutations(values) {
  const a = [...values].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
  const result = [];
  const path = [];
  const used = new Array(a.length).fill(false);

  function visit() {
    if (path.length === a.length) {
      result.push([...path]);            // snapshot, warna sab entries same reference
      return;
    }
    for (let i = 0; i < a.length; i++) {
      if (used[i]) continue;
      // Equal values ke group mein hamesha leftmost unused wala hi choose karo.
      if (i > 0 && a[i] === a[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(a[i]);
      visit();
      path.pop();                        // undo: caller ki state restore
      used[i] = false;                   // undo: dono cheezein restore karni hain
    }
  }

  visit();
  return result;
}
// permutations([1, 1, 2]) -> [[1,1,2],[1,2,1],[2,1,1]] — 6 nahi, 3
```

```js
function countNQueens(n) {
  const cols = new Set();
  const diag = new Set();       // row - col, identifies one diagonal
  const anti = new Set();       // row + col, identifies the other diagonal
  let count = 0;

  function placeRow(row) {
    if (row === n) { count++; return; }
    for (let col = 0; col < n; col++) {
      const d = row - col;
      const a = row + col;
      if (cols.has(col) || diag.has(d) || anti.has(a)) continue; // prune
      cols.add(col); diag.add(d); anti.add(a);
      placeRow(row + 1);
      cols.delete(col); diag.delete(d); anti.delete(a);          // undo all three
    }
  }

  placeRow(0);
  return count;
}
```

## Recursion versus iteration

```js
// Recursive DFS on a tree — depth ke saath stack overflow kar sakta hai.
function depthRecursive(node) {
  if (node === null) return 0;
  return 1 + Math.max(depthRecursive(node.left), depthRecursive(node.right));
}

// Explicit-stack version: heap memory use hoti hai, runtime call stack nahi.
function depthIterative(root) {
  if (root === null) return 0;
  const stack = [{ node: root, depth: 1 }];
  let best = 0;
  while (stack.length > 0) {
    const { node, depth } = stack.pop();
    best = Math.max(best, depth);
    if (node.left) stack.push({ node: node.left, depth: depth + 1 });
    if (node.right) stack.push({ node: node.right, depth: depth + 1 });
  }
  return best;
}
```
