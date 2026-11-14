---
id: dsa-linear-structures
title: Linked lists stacks and queues
track: dsa
order: 2
level: Intermediate
minutes: 3
summary: Linked list — nodes linked by references; random access is O(n).
tags: linked-list, stack, queue, pointers, monotonic-stack
visual: linked-list-reversal
---

## Quick revision

> Revision target — Trace the order of pointer changes and the ownership of a queue/stack step by step.

- Linked list — nodes linked by references; random access is O(n).
- Singly list — a next pointer; doubly list — next + previous.
- Insert/delete — O(1) once you have the node/predecessor; the cost of finding it is separate.
- Stack — LIFO; push/pop at the top.
- Queue — FIFO; enqueue at the end, dequeue from the front.
- JS queue — use a head index/ring buffer; repeated `shift()` can shift elements.
- Reverse list — flip the links with previous/current/next pointers.
- Cycle detection — slow/fast pointers; if they meet there is a cycle.
- Edge cases — empty, one node, updating the head/tail.
- Sentinel node — a dummy head reduces the special cases of insert/delete.
- Deque — add/remove at both ends; useful in BFS and sliding-window patterns.
- Fast/slow gap — a fixed pointer gap for kth-from-end; define what an invalid k means.

### Linked-list pointers

- Middle node — the slow pointer moves one step, the fast one two.
- Doubly linked delete — update the links of both neighbours and the head/tail.

### Stack checks

- Parentheses — openers go on the stack; a closer needs a matching top.

### Edge cases and reasoning

- Queue retention — in a head-index queue, clear/compact the consumed slots; if references are retained, a long-lived queue's memory can grow.
- Reverse pointer safety — save next before overwriting current.next; otherwise the reachable link to the remaining list can be lost.
- List invariant — an empty list has both head and tail null; keep size/head/tail consistent after deleting the single node.

## Understand it with an example

- Scenario — While reversing the list A→B→C, current=A and previous=null.
- Reasoning — First save next=B; A.next=null; previous=A; current=B. In the next step B.next=A; the final head C gives C→B→A.
- Catch — If next is not saved before A.next is overwritten, the link to the remaining list can be lost; verify the final tail and an empty input too.

## Recall and practice

- Question — Is an O(1) delete of a known tail node always possible in a singly linked list?
- Answer — Without the predecessor the tail link cannot be updated; the next-node-copy trick does not work on the tail and also changes identity semantics.
- Try it yourself — Test a queue/list implementation through empty→one→many→empty; verify tail deletion, reversing twice and cleanup of consumed references.

## Practice questions

### Easy · Valid parentheses

`"({[]})"` is valid, `"(]"` and `"(("` are invalid. Write the function.

<details>
<summary>Answer</summary>

```js
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}
```

- Stack — last opened, first closed.
- End check — leftover openers (`"(("`) are invalid.
- `O(n)` time, `O(n)` space.

</details>

### Medium · Reverse a linked list

<details>
<summary>Answer</summary>

```js
function reverse(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next; // save first
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
```

- Order — change the pointer without saving `next` and the rest of the list is lost.
- Edge — an empty list and a single node work too.
- `O(n)` time, `O(1)` space.

</details>

### Medium · Detect a cycle and find the middle node

<details>
<summary>Answer</summary>

```js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow; // the second middle for an even length
}
```

- Floyd — if there is a cycle, fast catches slow inside the loop; `O(1)` space.
- Middle — fast is at the end, slow is in the middle.

</details>

### Medium · A queue built on array `shift()`

Why is `queue.shift()` slow in a BFS over 100,000 nodes? The fix?

<details>
<summary>Answer</summary>

- Why — `shift` moves the remaining elements one index forward → `O(n)` per dequeue → `O(n²)`.
- Fix — a head pointer:

```js
const queue = [start];
for (let head = 0; head < queue.length; head++) {
  const node = queue[head];
  for (const next of graph[node]) queue.push(next);
}
```

- Memory — in a very long queue slice off the processed part periodically, or use a circular buffer.

</details>

### Hard · Remove the nth node from the end

`removeNthFromEnd(head, n)` — in one pass, including the case where the head is removed.

<details>
<summary>Answer</summary>

```js
function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next; // n+1 gap
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}
```

- Sentinel (`dummy`) — no special case when the head is deleted.
- Gap — after `n + 1` steps `slow` stops at the node before the target.
- Assumption — `1 ≤ n ≤ length`; otherwise add a null check in the gap loop.

</details>

## Sources — further reading

- [Princeton stacks and queues](https://algs4.cs.princeton.edu/13stacks/)
- [MDN Array.prototype.shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

## Code practice

- [Examples — when you want to revise the code](../../../examples/dsa/02-linked-lists-stacks-and-queues.md)
