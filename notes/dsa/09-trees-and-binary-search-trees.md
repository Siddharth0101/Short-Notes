---
id: dsa-trees
title: Trees and binary search trees
track: dsa
order: 9
level: Intermediate
minutes: 1
summary: Tree — hierarchical nodes; root, child aur leaf.
tags: tree, bst, dfs, traversal, balancing
---

## Quick revision

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

## Research notes: Balance the height that controls lookup

- Sorted values insert karne par ordinary BST ek chain ban sakta hai.

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf)
- [Princeton's BST chapter](https://algs4.cs.princeton.edu/32bst/)
- [Balanced search trees](https://algs4.cs.princeton.edu/33balanced/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/09-trees-and-binary-search-trees.md)
