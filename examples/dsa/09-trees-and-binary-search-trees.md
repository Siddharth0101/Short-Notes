# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Traversal order

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

## Search and deletion

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

```text
Right rotation at y:

      y                    x
     / \                  / \
    x   C     ---->      A   y
   / \                      / \
  A   B                    B   C

Inorder dono taraf: A x B y C  — ordering invariant intact hai.
```

## Validate the whole subtree

```js
function isValidBST(node, lower = -Infinity, upper = Infinity) {
  if (node === null) return true;
  if (!(node.value > lower && node.value < upper)) return false;
  return isValidBST(node.left, lower, node.value)
    && isValidBST(node.right, node.value, upper);
}
```

## Lowest common ancestor: BST versus general tree

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

```js
function lcaTree(node, p, q) {
  if (node === null || node === p || node === q) return node;
  const left = lcaTree(node.left, p, q);
  const right = lcaTree(node.right, p, q);
  if (left !== null && right !== null) return node;  // dono sides mein mile = LCA
  return left !== null ? left : right;               // ek hi side se aaya
}
```
