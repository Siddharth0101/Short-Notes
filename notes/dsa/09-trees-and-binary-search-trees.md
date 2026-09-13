---
id: dsa-trees
title: Trees and binary search trees
track: dsa
order: 9
level: Intermediate
minutes: 34
summary: Tree traversal, BST ordering, deletion, and balance ko invariants ke through samjho.
tags: tree, bst, dfs, traversal, balancing
---

## Mental model

Tree ek hierarchy hai: root se children tak links jaate hain, aur ordinary rooted tree mein har non-root node ka ek parent hota hai. Binary tree mein at most two children hote hain. **Binary search tree** extra ordering rule add karta hai: left subtree ke saare keys smaller, right subtree ke saare keys larger. Duplicate handling ka rule separately choose karo, jaise node mein count rakhna.

Tree ki height longest root-to-leaf path se related hai. Interview mein convention batao: neeche empty tree ki height 0 aur leaf ki height 1 use kar rahe hain. Balanced tree aur complete tree same concept nahi: complete tree last level tak left-to-right filled hota hai, balancing mainly height bound maintain karta hai.

> **Core takeaway:** A BST property constrains whole subtrees, not just immediate children.

## Traversal order

| Traversal | Order | Useful for |
| --- | --- | --- |
| Preorder DFS | Node, left, right | Shape-aware serialization with null markers |
| Inorder DFS | Left, node, right | Sorted keys from a BST |
| Postorder DFS | Left, right, node | Heights, subtree totals, bottom-up deletion |
| Level-order BFS | One depth at a time | Minimum depth, level grouping |

```js
function inorder(root) {
  const values = [];
  const stack = [];
  let current = root;
  while (current !== null || stack.length > 0) {
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    values.push(current.value);
    current = current.right;
  }
  return values;
}
```

Har node once push/pop hota hai, isliye O(n) time. Stack O(h) space leta hai, output array O(n). BST ordering valid ho to result sorted hoga; arbitrary binary tree ke liye nahi.

### Level-order BFS with level boundaries

```js
function levelOrder(root) {
  if (root === null) return [];
  const levels = [];
  let queue = [root];
  while (queue.length > 0) {
    const next = [];
    const values = [];
    for (const node of queue) {       // is level ke saare nodes
      values.push(node.value);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    levels.push(values);
    queue = next;                     // poora level ek saath swap
  }
  return levels;
}
```

Level boundaries maintain karne ke do standard tarike hain: loop entry par `queue.length` snapshot lena (`const size = queue.length`), ya upar jaisa do alag arrays rakhna. Dono correct hain; galti tab hoti hai jab tum ek hi array par `while (queue.length)` chalao aur andar push bhi karte raho — tab level boundary gayab ho jaati hai aur "har level ka average" jaise questions galat aate hain.

O(n) time, O(w) space jahan `w` maximum level width hai. Complete tree mein `w` roughly n/2 hai, so worst-case space O(n) — DFS ke O(h) se zyada. Yeh ek real trade-off hai: BFS wide trees par zyada memory leti hai, DFS deep trees par.

### Bottom-up postorder: compute two things at once

Ek bahut common interview shape hai: har node par child results chahiye. Diameter (longest path between any two nodes) isko clean dikhata hai:

```js
function diameter(root) {
  let best = 0;   // answer, kisi bhi node par ho sakta hai

  function height(node) {
    if (node === null) return 0;
    const left = height(node.left);
    const right = height(node.right);
    // Is node se guzarne wala longest path = left height + right height.
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);  // parent ko sirf height chahiye
  }

  height(root);
  return best;
}
```

Design insight yeh hai: recursive function **parent ko ek cheez return karta hai (height)** aur **answer ko side mein accumulate karta hai (best)**. Answer ko return karne ki koshish karoge toh recurrence banegi hi nahi — kyunki kisi node ka diameter uske children ke diameters se directly nahi banta, usme "is node se guzarne wala path" bhi consider karna padta hai.

Yahi pattern "balanced hai ya nahi", "maximum path sum", "largest BST subtree" sab mein repeat hota hai: **bottom-up mein ek compact summary return karo, global answer alag track karo.** Har node ek baar visit hota hai, so O(n) time aur O(h) stack space.

## Search and deletion

Search mein target node se smaller ho to left, larger ho to right jao. Insertion bhi same path follow karke missing child position fill karta hai. Cost O(h): balanced height mein O(log n), sorted insertion se degenerate chain mein O(n). “BST always logarithmic” bolna incorrect hai.

Deletion ke three cases hain: leaf ko remove karo; one-child node ko uske child se replace karo; two-child node ko inorder successor, yani right subtree ke minimum, se replace karke successor ki old location delete karo. Agar subtree counts store kar rahe ho to changed path par counts update karna zaroori hai. AVL/red-black trees rotations aur extra invariants se bounded height maintain karte hain.

```js
function deleteKey(node, key) {
  if (node === null) return null;
  if (key < node.value) { node.left = deleteKey(node.left, key); return node; }
  if (key > node.value) { node.right = deleteKey(node.right, key); return node; }

  // Mil gaya. Teen cases:
  if (node.left === null) return node.right;   // leaf bhi yahin cover hota hai
  if (node.right === null) return node.left;

  // Two children: inorder successor = right subtree ka minimum.
  let successor = node.right;
  while (successor.left !== null) successor = successor.left;
  node.value = successor.value;                 // value copy karo
  node.right = deleteKey(node.right, successor.value); // purani jagah se hatao
  return node;
}
```

"Return the (possibly new) subtree root, and let the parent reassign" wala pattern yahan bhi wahi kaam karta hai jo linked list mein dummy head karta tha — parent pointer ko manually fix karne ki zaroorat hi nahi rehti, aur root deletion apne aap handle ho jaata hai.

Successor **kyun** correct replacement hai: woh right subtree ka minimum hai, isliye left subtree ke saare keys se bada hai (poora right subtree left se bada hai) aur right subtree ke baaki saare keys se chhota hai. Dono BST constraints exactly satisfy hote hain. Predecessor (left subtree ka maximum) equally valid hai; hamesha ek hi side choose karte rehna tree ko slowly imbalance kar sakta hai, isliye kuch implementations alternate karti hain.

Successor ke paas left child kabhi nahi hota (warna woh minimum nahi hota), so uska apna deletion one-child case hai — recursion safely terminate karti hai. Cost O(h).

### Why balance matters, and what rotations actually do

BST operations ka cost O(h) hai, n nahi. Sorted data insert karne par (`1, 2, 3, 4, 5`) tree ek right-leaning chain ban jaata hai: h = n, aur har operation O(n) — effectively ek linked list jiska koi advantage nahi. Yeh **most common real input** hai (timestamps, auto-increment IDs, sorted imports), isliye yeh corner case nahi hai.

Self-balancing trees har insert/delete ke baad **rotations** se height ko O(log n) mein rakhte hain. Rotation ek local pointer rearrangement hai jo inorder order preserve karta hai:

```text
Right rotation at y:

      y                    x
     / \                  / \
    x   C     ---->      A   y
   / \                      / \
  A   B                    B   C

Inorder dono taraf: A x B y C  — ordering invariant intact hai.
```

Yehi property rotations ko safe banati hai: shape badalta hai, sorted order nahi. AVL trees har node par height difference ≤ 1 enforce karte hain (strictly balanced, faster lookups). Red-black trees weaker invariant rakhte hain (longest path shortest ka at most double), isliye kam rotations karte hain — insert/delete-heavy workloads par better. Yeh trade-off library design mein dikhta hai: read-heavy structures AVL-style choose karte hain, mutation-heavy red-black.

JavaScript mein built-in balanced BST nahi hai. Sorted-key operations ke liye options hain: `Map` + separately maintained sorted array, ya ek library. Interview mein "main yahan TreeMap use karta" bolna theek hai, lekin batao ki JavaScript mein woh built-in nahi hai — isse language-level honesty dikhti hai.

## Validate the whole subtree

```js
function isValidBST(node, lower = -Infinity, upper = Infinity) {
  if (node === null) return true;
  if (!(node.value > lower && node.value < upper)) return false;
  return isValidBST(node.left, lower, node.value)
    && isValidBST(node.right, node.value, upper);
}
```

Example finite numeric, unique keys assume karta hai. Har descendant ko ancestor constraints obey karne honge. Sirf immediate child compare karne se root 10 ke left subtree mein 12 chhup sakta hai. Validation O(n) time, O(h) call-stack space hai.

Ek alternative validation hai inorder traversal chalakar check karna ki sequence strictly increasing hai. Woh bhi correct hai aur ek achhi cross-check technique hai — **do independent methods ka agreement** correctness ka strong evidence hai, khaaskar jab tum code run nahi kar sakte. Range-based version early exit kar sakta hai (pehla violation milte hi `false`), inorder version ko poora scan chahiye jab tak tum running-previous check inline na karo.

## Lowest common ancestor: BST versus general tree

BST mein LCA ordering se directly nikal aata hai, bina poora tree scan kiye:

```js
function lcaBST(root, p, q) {
  let node = root;
  while (node !== null) {
    if (p < node.value && q < node.value) node = node.left;        // dono left mein
    else if (p > node.value && q > node.value) node = node.right;  // dono right mein
    else return node;   // split point (ya ek value node par hi hai) = LCA
  }
  return null;
}
```

Reasoning: jis pehle node par `p` aur `q` alag directions mein jaate hain (ya ek unme se node hi hai), wahi unka lowest common ancestor hai — usse neeche koi bhi node dono ko contain nahi kar sakta. O(h) time, O(1) space.

General binary tree mein ordering nahi hai, so search karna padta hai:

```js
function lcaTree(node, p, q) {
  if (node === null || node === p || node === q) return node;
  const left = lcaTree(node.left, p, q);
  const right = lcaTree(node.right, p, q);
  if (left !== null && right !== null) return node;  // dono sides mein mile = LCA
  return left !== null ? left : right;               // ek hi side se aaya
}
```

O(n) time, O(h) space. Do versions ka contrast hi asli lesson hai: **BST ka ordering invariant search space ko O(h) tak collapse kar deta hai**, jabki bina invariant ke poora tree dekhna padta hai. Yeh comparison interview mein poochha jaata hai ki "BST hone se kya farak padta hai" — answer yeh hai ki har node par ek subtree provably discard ho jaata hai.

`lcaTree` ek assumption par chalta hai: dono nodes tree mein present hain. Ek absent ho toh yeh doosre ko return kar dega, jo galat hai. Production version ko presence flags bhi track karne padte hain — yeh contract explicitly clarify karna chahiye.

## Common mistakes

- **Wrong assumption:** BST operations O(log n) hain. **Why it breaks:** Yeh sirf **balanced** BST par sach hai. Plain BST mein sorted input (timestamps, auto-increment IDs — real data ka sabse common shape) ek degenerate chain banata hai jahan h = n aur har operation O(n) ho jaata hai. **Fix:** Hamesha "O(h), jo balanced tree mein O(log n) hai" bolo, aur batao ki balance kaise maintain hoga — self-balancing structure (AVL/red-black) ya randomized insertion order.
- **Wrong assumption:** BST validate karne ke liye har node ko apne direct children se compare karna kaafi hai. **Why it breaks:** BST constraint poore subtree par lagti hai, sirf immediate child par nahi. `root = 10`, `root.left = 5`, `root.left.right = 12` mein har parent-child pair locally valid hai, lekin 12 root ke left subtree mein hai aur 10 se bada hai — invalid BST jo local check pass kar jaata hai. **Fix:** Har recursive call mein `(lower, upper)` bounds propagate karo, ya inorder traversal ka strictly-increasing hona verify karo.
- **Wrong assumption:** `isValidBST` mein `-Infinity`/`Infinity` sentinels har input par safe hain. **Why it breaks:** Agar tree mein genuinely `Infinity` value ho, ya `NaN` ho (jahan har comparison `false` hai), ya keys numbers na hokar strings/objects hon, toh yeh sentinels wrong answers dete hain. **Fix:** Bounds ko `null` se initialize karo aur `lower === null || node.value > lower` check karo — yeh value domain par koi assumption nahi karta. Aur key type ka contract upfront clarify karo.
- **Wrong assumption:** Recursive tree traversal production ke liye theek hai kyunki trees "usually shallow" hote hain. **Why it breaks:** Skewed tree (ya adversarial nested JSON) par depth n tak ja sakti hai aur `RangeError: Maximum call stack size exceeded` milta hai. Yeh ek known denial-of-service vector hai jab tree user input se banti ho. **Fix:** Explicit stack wala iterative traversal likho, ya depth limit enforce karo. O(h) space ko complexity mein explicitly mention karo.
- **Wrong assumption:** Two-child node delete karte waqt koi bhi descendant se replace kar sakte hain. **Why it breaks:** Replacement ko **dono** BST constraints satisfy karne hain — left subtree ke sab se bada aur right subtree ke sab se chhota. Sirf inorder successor (right subtree ka minimum) ya predecessor (left subtree ka maximum) yeh property rakhte hain; koi arbitrary descendant ordering todh dega. **Fix:** Successor/predecessor hi use karo, aur uski purani position se usse recursively delete karo (woh at most one-child case hoga).
- **Wrong assumption:** Preorder values se binary tree uniquely reconstruct ho jaata hai. **Why it breaks:** Structure information missing hai — `[1, 2]` ka matlab "2 left child hai" ya "2 right child hai", dono possible hain. **Fix:** Null markers ke saath serialize karo (`[1, 2, null, null, null]`), ya do traversals do (preorder + inorder, unique keys ke saath), ya BST ho toh ordering se structure derive karo. Serialization format ko contract ka part banao.

## Where this shows up in real systems

Database indexes trees ka sabse bada production use hain, lekin woh binary nahi — **B-trees/B+ trees** hain. Reason storage hardware hai: disk/SSD ek page (typically 4–16 KB) ek saath padhta hai, isliye per-node fanout hazaaron keys tak rakha jaata hai aur height 3–4 levels mein billions of rows cover kar leti hai. Binary tree usi data ke liye ~30+ levels leta, matlab ~30 random disk reads. Yehi "height × cost per level" wali analysis structure choice decide karti hai.

File systems (ext4, btrfs, NTFS) directory indexes ke liye B-trees use karte hain; in-memory sorted maps ke liye C++ `std::map` red-black tree hai aur Java ka `TreeMap` bhi. Log-structured databases (LevelDB, RocksDB, Cassandra) LSM trees use karti hain, jahan writes memory ke sorted structure mein jaati hain aur periodically disk par merge hoti hain — sorting aur merging ka chapter 05 wala reasoning wahan directly lagta hai.

Tree traversal ka roz ka use compilers aur tooling mein hai: ASTs par postorder traversal se type checking aur code generation hoti hai (child results chahiye parent se pehle — exactly wahi bottom-up pattern jo diameter mein tha), DOM traversal, aur React ka reconciliation. Trie (prefix tree) autocomplete, routing tables aur spell-checkers mein aati hai. Aur Merkle trees — jahan har parent apne children ke hashes ka hash hai — Git, blockchain aur distributed replication mein efficient difference detection ke liye use hote hain, jo phir se ek bottom-up postorder computation hi hai.

## Practice and answer

**Prompt:** Root 10, left child 5, right child 15; node 5 ka right child 12 hai. Valid BST?

**Answer:** Nahi. 12 apne parent 5 se larger hai, lekin root 10 ke left subtree mein hone ke kaaran 10 se smaller bhi hona chahiye.

**Prompt:** Tree values ko sirf preorder mein store karke arbitrary binary tree reconstruct kar sakte hain?

**Answer:** Generally nahi. Structure ambiguous hai; null-child markers ya another appropriate traversal/structural information chahiye. BST-specific ordering aur unique keys additional information provide kar sakte hain.

**Prompt:** Ek BST mein `1, 2, 3, …, 1000` is order mein insert kiye. Height kya hogi aur lookup ka cost?

**Answer:** Height 1000 — har naya key previous se bada hai, so sab right children ban jaate hain aur tree ek chain hai. Lookup O(n), effectively linked list. Yeh isliye important hai kyunki sorted insertion order real data mein sabse common hai (timestamps, IDs), corner case nahi. Fixes: self-balancing tree use karo, ya insertion order shuffle karo, ya ek array + binary search rakho agar data static hai.

**Prompt:** Tree "balanced" hai ya nahi check karna hai. Har node par `height(left)` aur `height(right)` compute karne wala solution kyun O(n²) ho sakta hai?

**Answer:** Kyunki har node par `height()` apne poore subtree ko dobara traverse karta hai — skewed tree par yeh `n + (n−1) + … = Θ(n²)` ban jaata hai. Fix bottom-up single pass hai: recursive function height return kare aur saath hi ek sentinel (jaise `-1`) se "yeh subtree unbalanced hai" signal kare, taaki parent turant propagate kar de. Ek hi traversal, O(n) time. Yeh wahi "child results reuse karo, recompute mat karo" idea hai jo DP ka core hai.

**Prompt:** Inorder traversal se BST validate karna aur bounds-based recursion — dono correct hain. Interview mein kya bologe?

**Answer:** Dono O(n) hain, dono O(h) space lete hain. Bounds version pehla violation milte hi early exit karta hai aur explicitly dikhata hai ki constraint poore subtree par lagti hai. Inorder version conceptually simple hai aur ek independent cross-check deta hai. Asli value dono ko mention karne mein hai: jab code run nahi kar sakte, do independent methods ka same answer dena correctness ka strongest available evidence hai.

## Research notes: Balance the height that controls lookup

Sorted insertion can turn an ordinary BST into a chain. Search depends on height; ordering alone does not guarantee logarithmic lookup.

AVL trees constrain subtree-height differences. Rotations restore balance while preserving in-order key order. Update height metadata in dependency order.

Original trace: insert 10, 20, 30. A rotation puts 20 above 10 and 30, preserving the sorted traversal.

**Interview check:** Why can rotation change the root without breaking search order?

**Answer:** It rearranges local links while preserving ordering among affected subtrees. Show that each subtree stays on the correct side of its new ancestors.

**Practice:** Trace an insertion requiring a double rotation and verify heights.

[Read the source — MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** A tree has root 10, left child 5, and 5's right child 12. Each local edge looks plausible. Is the tree a valid BST?

> **Hint:** The left subtree inherits an upper bound from the root.

**Answer guide — compare after attempting:** It is invalid because 12 lies in 10's left subtree. Validate with inherited lower/upper bounds or an equivalent global-order check. Define a duplicate-key policy explicitly. Testing only each parent and its children misses this violation.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Source check

[Princeton's BST chapter](https://algs4.cs.princeton.edu/32bst/) ordering, height-dependent operations aur successor deletion explain karta hai. [Balanced search trees](https://algs4.cs.princeton.edu/33balanced/) height guarantees ko extend karta hai.
