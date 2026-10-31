---
id: dsa-linear-structures
title: Linked lists stacks and queues
track: dsa
order: 2
level: Intermediate
minutes: 3
summary: Linked list — nodes references se linked; random access O(n).
tags: linked-list, stack, queue, pointers, monotonic-stack
---

## Quick revision

> Revision target — Pointer changes ka order aur queue/stack ownership step-by-step trace karo.

- Linked list — nodes references se linked; random access O(n).
- Singly list — next pointer; doubly list — next + previous.
- Insert/delete — node/predecessor milne par O(1); dhoondhne ka cost alag.
- Stack — LIFO; push/pop top se.
- Queue — FIFO; enqueue end, dequeue front.
- JS queue — head index/ring buffer use karo; repeated `shift()` shifting kar sakta hai.
- Reverse list — previous/current/next pointers se links palto.
- Cycle detection — slow/fast pointers; meet karein toh cycle.
- Edge cases — empty, one node, head/tail update.
- Sentinel node — dummy head se insert/delete ke special cases kam hote hain.
- Deque — dono ends par add/remove; BFS aur sliding-window patterns mein useful.
- Fast/slow gap — kth-from-end ke liye fixed pointer gap; invalid k define karo.

### Linked-list pointers

- Middle node — slow pointer one step, fast two steps.
- Doubly linked delete — dono neighbors ke links aur head/tail update karo.

### Stack checks

- Parentheses — opening stack mein; closing ko matching top chahiye.

### Edge cases aur reasoning

- Queue retention — head-index queue mein consumed slots clear/compact; references retained rahen toh long-lived queue memory grow kar sakti.
- Reverse pointer safety — current.next overwrite se pehle next save; remaining list ka reachable link warna lose ho sakta hai.
- List invariant — empty list head/tail both null; single deletion ke baad size/head/tail consistent rakho.

## Example se samjho

- Scenario — A→B→C list reverse karte waqt current=A, previous=null hai.
- Reasoning — Pehle next=B save; A.next=null; previous=A; current=B. Next step B.next=A banega; final head C se C→B→A milega.
- Catch — A.next overwrite karne se pehle next save nahi kiya toh remaining list ka link lose ho sakta hai; final tail aur empty input bhi verify karo.

## Recall aur practice

- Sawal — Known tail node ko singly linked list mein O(1) delete always possible hai?
- Jawaab — Predecessor bina tail link update nahi kar sakte; next-node-copy trick tail par nahi aur identity semantics bhi change karti.
- Khud try karo — Queue/list implementation empty→one→many→empty test karo; tail deletion, reverse twice aur consumed-reference cleanup verify karo.

## Practice questions

### Easy · Valid parentheses

`"({[]})"` valid, `"(]"` aur `"(("` invalid. Function likho.

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
- End check — bache hue openers (`"(("`) invalid.
- `O(n)` time, `O(n)` space.

</details>

### Medium · Linked list reverse karo

<details>
<summary>Answer</summary>

```js
function reverse(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next; // pehle save
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
```

- Order — `next` save kiye bina pointer badla toh baaki list kho jaati hai.
- Edge — empty list aur single node bhi kaam karte hain.
- `O(n)` time, `O(1)` space.

</details>

### Medium · Cycle detect aur middle node

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
  return slow; // even length par second middle
}
```

- Floyd — cycle ho toh fast slow ko loop ke andar pakad leta hai; `O(1)` space.
- Middle — fast end par, slow beech mein.

</details>

### Medium · Array `shift()` wali queue

BFS mein `queue.shift()` 1 lakh nodes par slow kyun hai? Fix?

<details>
<summary>Answer</summary>

- Kyun — `shift` baaki elements ko ek index aage khiskata hai → `O(n)` per dequeue → `O(n²)`.
- Fix — head pointer:

```js
const queue = [start];
for (let head = 0; head < queue.length; head++) {
  const node = queue[head];
  for (const next of graph[node]) queue.push(next);
}
```

- Memory — bahut lambi queue mein processed part periodically slice karo, ya circular buffer.

</details>

### Hard · End se nth node remove karo

`removeNthFromEnd(head, n)` — ek pass mein, head remove hone wala case bhi.

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

- Sentinel (`dummy`) — head delete hone par special case nahi.
- Gap — `n + 1` steps se `slow` target ke pichle node par rukta hai.
- Assumption — `1 ≤ n ≤ length`; warna gap loop mein null check.

</details>

## Sources — aur padhne ke liye

- [Princeton stacks and queues](https://algs4.cs.princeton.edu/13stacks/)
- [MDN Array.prototype.shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/02-linked-lists-stacks-and-queues.md)
