---
id: dsa-trees
title: Trees and binary search trees
track: dsa
order: 9
level: Intermediate
minutes: 3
summary: Tree — hierarchical nodes; root, child and leaf.
tags: tree, bst, dfs, traversal, balancing
visual: tree-traversal
---

## Quick revision

> Revision target — Connect the tree's shape, the ancestor bounds and the traversal order to runtime/space.

- Tree — hierarchical nodes; root, child and leaf.
- BST — left keys are smaller, right keys larger; keep the duplicate policy explicit.
- Search — O(height); O(log n) when balanced, O(n) when skewed.
- DFS — preorder root-left-right; inorder left-root-right; postorder left-right-root.
- BFS — traverse level by level with a queue; memory depends on the width.
- BST validation — pass down ancestor lower/upper bounds; comparing only with the child is not enough.
- Delete — remove a leaf; replace a node with one child; use the successor/predecessor for two children.
- Balance — rotations control the height while preserving order.
- LCA — in a BST the values give the direction; in a general tree combine the subtree results.
- Postorder — build the parent's answer from child results, as for height/diameter.
- Tree height — choose the nodes vs edges convention; the empty-tree base case must match it.
- Subtree size — child sizes + 1; a useful augmentation for order-statistics queries.
- Serialization — preserve null markers/the shape; values alone do not reconstruct a tree uniquely.

### Traversal order

- DFS orders — preorder root-left-right; inorder left-root-right; postorder left-right-root.
- Tree traversal cost — visiting n nodes is O(n); the DFS stack is O(height), the BFS queue O(max width).

### Edge cases and reasoning

- Diameter convention — a node's leftHeight+rightHeight can give the path's edge count with a node-height base; keep the height/answer units consistent.
- BST successor rule — in a two-child delete, maintain the identity/duplicate policy for moving the successor node/value; do not forget the subtree link cleanup.
- Deep-tree safety — a recursive traversal of a skewed tree can exhaust the call stack; an iterative stack avoids that with the same O(height) space.

## Research notes: Balance the height that controls lookup

- Inserting sorted values can turn an ordinary BST into a chain.

## Understand it with an example

- Scenario — Root 8, left 4, right 12, and 4 has a right child 6; traverse inorder.
- Reasoning — The left subtree gives 4,6; then 8; then 12: the output is `[4,6,8,12]`. A valid BST gives an ordered traversal according to the chosen duplicate policy.
- Catch — The same values can also sit in a skewed chain; an ordered output does not prove a balanced height. Explain the search cost as O(height).

## Recall and practice

- Question — Root 10, left 5, and the left's right child 12 pass the local child checks — is it a valid BST?
- Answer — No; 12 is in the root's left subtree and should be smaller than 10. Carry the ancestor bounds.
- Try it yourself — Test a BST validator/delete; verify empty, skewed, an ancestor violation, the duplicate policy and deleting a root with two children.

## Practice questions

### Easy · Traversal orders

Tree: root `1`, left `2` (children `4`, `5`), right `3`. Preorder, inorder, postorder, level order?

<details>
<summary>Answer</summary>

- Preorder (root, left, right) — `1 2 4 5 3`.
- Inorder (left, root, right) — `4 2 5 1 3`.
- Postorder (left, right, root) — `4 5 2 3 1`.
- Level order — `1 2 3 4 5`.
- In a BST, inorder gives the sorted order.

</details>

### Easy · Max depth

<details>
<summary>Answer</summary>

```js
function maxDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}
```

- Convention — an empty tree is `0`, a single node `1` (counting nodes). In the edge-count convention they are `-1`/`0`; clarify it in an interview.
- Deep skewed tree — the recursion can overflow the stack; an iterative BFS is safer.

</details>

### Medium · Valid BST

A common wrong solution checks only `node.left.val < node.val < node.right.val`. Why is it wrong, and what is right?

<details>
<summary>Answer</summary>

```js
function isValidBST(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (node.val <= low || node.val >= high) return false;
  return isValidBST(node.left, low, node.val) && isValidBST(node.right, node.val, high);
}
```

- Why it is wrong — `5 → left 3 → right 7`: the local check passes, but 7 is in the left subtree of root 5.
- Bounds — every node must lie in the range handed down by its ancestors.
- Duplicates policy — strict here; adjust to `<=` according to the problem.

</details>

### Medium · Level order traversal

The values of each level in a separate array.

<details>
<summary>Answer</summary>

```js
function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  let queue = [root];
  while (queue.length) {
    levels.push(queue.map((node) => node.val));
    queue = queue.flatMap((node) => [node.left, node.right].filter(Boolean));
  }
  return levels;
}
```

- Each iteration is one whole level; a new array for the next level.
- `O(n)` time, `O(width)` space.

</details>

### Hard · Lowest common ancestor (binary tree)

Both `p` and `q` are in the tree. Find their LCA. Is there a shortcut for a BST?

<details>
<summary>Answer</summary>

```js
function lca(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lca(root.left, p, q);
  const right = lca(root.right, p, q);
  if (left && right) return root;
  return left ?? right;
}
```

- Logic — if something is found on both sides, the current node is the split point; if only on one side, pass that up.
- Assumption — both nodes exist; otherwise extra found-flags are needed.
- BST shortcut — go left if both are smaller, right if both are larger, otherwise the current node: `O(h)`.

</details>

## Sources — further reading

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf)
- [Princeton's BST chapter](https://algs4.cs.princeton.edu/32bst/)
- [Balanced search trees](https://algs4.cs.princeton.edu/33balanced/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/09-trees-and-binary-search-trees.md)
