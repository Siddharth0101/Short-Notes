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

## Recall aur practice

- Sawal — Root10, left5, left ka right12 local child checks pass kare toh valid BST hai?
- Jawaab — Nahi; 12 root ke left subtree mein 10 se smaller hona chahiye. Ancestor bounds carry karo.
- Khud try karo — BST validator/delete test karo; empty, skewed, ancestor violation, duplicate policy aur two-child root deletion verify karo.

## Sources — aur padhne ke liye

- [Source yahan padho — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf)
- [Princeton's BST chapter](https://algs4.cs.princeton.edu/32bst/)
- [Balanced search trees](https://algs4.cs.princeton.edu/33balanced/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/09-trees-and-binary-search-trees.md)
