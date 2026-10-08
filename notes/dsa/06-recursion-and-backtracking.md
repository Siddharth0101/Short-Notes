---
id: dsa-recursion
title: Recursion and backtracking
track: dsa
order: 6
level: Intermediate
minutes: 3
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
- Permutations/subsets — order matters / selection matters; duplicate handling accordingly.
- Visited undo — path-specific visited mark ko backtrack par release; global graph visited ka rule alag.
- Tail recursion — language/runtime optimization guaranteed na ho toh stack space still count karo.

### Edge cases aur reasoning

- Duplicate branches — sorted input mein same-depth equivalent choice skip; index-level reuse policy se valid repeated elements preserve karo.
- Output lower bound — n distinct items ke subsets 2^n; full materialized paths ki time/space output-size dependent, O(n) claim mat karo.
- Memo context — same index but different remaining budget/visited set different state; incomplete cache key wrong solution reuse karega.

## Recall aur practice

- Sawal — result.push(path) ke baad path.pop() se saved solutions kyun badal sakti hain?
- Jawaab — Same mutable array reference save hua; result mein path copy store karo.
- Khud try karo — Unique subsets of [1,1,2] generate karo; 6 distinct subsets, input unchanged aur each result independent array verify karo.

## Sources — aur padhne ke liye

- [Princeton recursion chapter](https://introcs.cs.princeton.edu/java/23recursion/)
- [MDN recursion error reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion)

## Code practice

- [Examples — jab code revise karna ho](../../examples/dsa/06-recursion-and-backtracking.md)
