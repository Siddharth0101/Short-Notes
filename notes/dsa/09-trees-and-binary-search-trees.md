---
id: dsa-trees
title: Trees and binary search trees
track: dsa
order: 9
level: Intermediate
minutes: 3
summary: Tree — hierarchical nodes; root, child aur leaf.
tags: tree, bst, dfs, traversal, balancing
---

## Quick revision

> Revision target — Tree shape, ancestor bounds aur traversal order ko runtime/space se jodo.

- Tree — hierarchical nodes; root, child aur leaf.
- BST — left keys smaller, right larger; duplicate policy explicit rakho.
- Search — O(height); balanced O(log n), skewed O(n).
- DFS — preorder root-left-right; inorder left-root-right; postorder left-right-root.
- BFS — queue se level-wise traverse; width ke hisaab se memory.
- BST validation — ancestor lower/upper bounds pass karo; sirf child compare enough nahi.
- Delete — leaf remove; one child replace; two children mein successor/predecessor.
- Balance — rotations order preserve karke height control karti hain.
- LCA — BST mein values se direction; general tree mein subtree results combine.
- Postorder — height/diameter jaise child results se parent answer banao.
- Tree height — nodes vs edges convention choose; empty-tree base case usi se match.
- Subtree size — child sizes + 1; order-statistics queries mein useful augmentation.
- Serialization — null markers/shape preserve; values alone tree uniquely reconstruct nahi karte.

### Traversal order

- DFS orders — preorder root-left-right; inorder left-root-right; postorder left-right-root.
- Tree traversal cost — n nodes visit O(n); DFS stack O(height), BFS queue O(max width).

### Edge cases aur reasoning

- Diameter convention — node ka leftHeight+rightHeight path edges count de sakta with node-height base; height/answer units consistent rakho.
- BST successor rule — two-child delete mein successor node/value movement ka identity/duplicate policy maintain; subtree link cleanup na bhoolo.
- Deep-tree safety — skewed tree recursive traversal call stack exhaust kar sakti; iterative stack same O(height) space se avoid kara sakta.

## Research notes: Balance the height that controls lookup

- Sorted values insert karne par ordinary BST ek chain ban sakta hai.

## Example se samjho

- Scenario — Root8, left4, right12, aur4 ka right6 ho; inorder traverse karna hai.
- Reasoning — Left subtree4,6; phir8; phir12: output `[4,6,8,12]`. Valid BST mein chosen duplicate policy ke hisaab se ordered traversal milta hai.
- Catch — Same values skewed chain mein bhi ho sakti hain; ordered output balanced height prove nahi karta. Search cost O(height) hi explain karo.

## Recall aur practice

- Sawal — Root10, left5, left ka right12 local child checks pass kare toh valid BST hai?
- Jawaab — Nahi; 12 root ke left subtree mein 10 se smaller hona chahiye. Ancestor bounds carry karo.
- Khud try karo — BST validator/delete test karo; empty, skewed, ancestor violation, duplicate policy aur two-child root deletion verify karo.

## Practice questions

### Easy · Traversal orders

Tree: root `1`, left `2` (children `4`, `5`), right `3`. Preorder, inorder, postorder, level order?

<details>
<summary>Answer</summary>

- Preorder (root, left, right) — `1 2 4 5 3`.
- Inorder (left, root, right) — `4 2 5 1 3`.
- Postorder (left, right, root) — `4 5 2 3 1`.
- Level order — `1 2 3 4 5`.
- BST mein inorder sorted order deta hai.

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

- Convention — empty tree `0`, single node `1` (nodes count). Edges count convention mein `-1`/`0`; interview mein clarify karo.
- Deep skewed tree — recursion stack overflow; iterative BFS safer.

</details>

### Medium · Valid BST

Common wrong solution: sirf `node.left.val < node.val < node.right.val` check. Kyun galat, aur sahi?

<details>
<summary>Answer</summary>

```js
function isValidBST(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (node.val <= low || node.val >= high) return false;
  return isValidBST(node.left, low, node.val) && isValidBST(node.right, node.val, high);
}
```

- Galat kyun — `5 → left 3 → right 7`: local check pass, par 7 root 5 ke left subtree mein hai.
- Bounds — har node ko ancestors se aayi range mein hona chahiye.
- Duplicates policy — yahan strict; problem ke hisaab se `<=` adjust.

</details>

### Medium · Level order traversal

Har level ki values alag array mein.

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

- Har iteration ek poora level; naya array next level.
- `O(n)` time, `O(width)` space.

</details>

### Hard · Lowest common ancestor (binary tree)

`p` aur `q` dono tree mein hain. Unka LCA dhundo. BST ho toh shortcut?

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

- Logic — dono sides se kuch mila toh current node split point hai; ek side se mila toh woh upar pass.
- Assumption — dono nodes exist karte hain; warna extra found-flags chahiye.
- BST shortcut — dono chhote toh left jao, dono bade toh right, warna current node: `O(h)`.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf)
- [Princeton's BST chapter](https://algs4.cs.princeton.edu/32bst/)
- [Balanced search trees](https://algs4.cs.princeton.edu/33balanced/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/09-trees-and-binary-search-trees.md)
