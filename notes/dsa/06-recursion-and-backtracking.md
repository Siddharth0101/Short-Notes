---
id: dsa-recursion
title: Recursion and backtracking
track: dsa
order: 6
level: Intermediate
minutes: 1
summary: Recursion — function smaller subproblem ko call karta hai.
tags: recursion, backtracking, call-stack, subsets
visual: recursion-stack
---

## Quick revision

- Recursion — function smaller subproblem ko call karta hai.
- Base case — recursion rokne ka valid smallest case.
- Progress — har call base case ke paas jaaye.
- Call stack — pending calls memory leti hain; depth limit socho.
- Backtracking — choose → explore → undo.
- Pruning — impossible branch early skip; valid solutions lose na karo.
- Snapshot — result mein mutable path ki copy save karo.
- Memoization — same state ka computed result reuse karo.
- Complexity — branching factor aur depth se tree size estimate karo.

## Sources — aur padhne ke liye

- [Princeton recursion chapter](https://introcs.cs.princeton.edu/java/23recursion/)
- [MDN recursion error reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/06-recursion-and-backtracking.md)
