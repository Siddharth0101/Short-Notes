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

## Recall aur practice

- Sawal — Known tail node ko singly linked list mein O(1) delete always possible hai?
- Jawaab — Predecessor bina tail link update nahi kar sakte; next-node-copy trick tail par nahi aur identity semantics bhi change karti.
- Khud try karo — Queue/list implementation empty→one→many→empty test karo; tail deletion, reverse twice aur consumed-reference cleanup verify karo.

## Sources — aur padhne ke liye

- [Princeton stacks and queues](https://algs4.cs.princeton.edu/13stacks/)
- [MDN Array.prototype.shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/02-linked-lists-stacks-and-queues.md)
