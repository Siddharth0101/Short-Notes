---
id: interview-dsa
title: DSA problem solving interview playbook
track: interview
order: 5
level: Intermediate
minutes: 3
summary: Start — input/output, constraints aur edge cases clarify karo.
tags: dsa, interview, problem-solving, complexity, practice
visual: dynamic-programming
---

## Quick revision

- Start — input/output, constraints aur edge cases clarify karo.
- Brute force — correct baseline aur complexity bolo.
- Optimize — repeated work identify; pattern blindly apply mat karo.
- Invariant — loop/recursion ke har step par kya true rehta hai.
- Complexity — time + extra space + recursion stack; input variables define karo.
- Verify — empty, singleton, duplicates, extremes aur normal example.
- Tradeoff — sorting mutates? extra memory? streaming input? contract check karo.
- Think aloud — next decision aur reason bolo; har typed character narrate karna zaroori nahi.
- Counterexample — proposed pattern ko negative/duplicate/extreme input se challenge.
- Incomplete solution — working part, remaining bug aur next step honestly batao.

### Quick answer checks

- Pattern selection — sorted data, monotonicity, negative values aur required output se pattern choose karo.
- Code review — bounds, duplicates, visited timing, overflow aur auxiliary space check karo.

### Edge cases aur reasoning

- Solution proof steps — invariant initially true, each step preserves, termination se desired result; sample dry-run proof ka replacement nahi.
- Hint ownership — hint ke baad apna state/invariant derive aur next unseen case solve; copied code ko independent performance evidence mat maano.
- Complexity assumptions — output materialization, sorting mutation, integer range aur heap duplicates qualify; separate n,m dimensions preserve karo.

## Research notes: Prove before optimizing

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Recall aur practice

- Sawal — Binary search explanation mein sorted input ke alawa kaunsa correctness evidence chahiye?
- Jawaab — Candidate interval invariant, each branch safe elimination, progress/termination aur missing/duplicate answer contract.
- Khud try karo — 30-minute drill: brute force, optimized invariant, code, tests; empty, duplicate, extreme aur counterexample cases ke time/space justify karo.

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [Princeton's analysis](https://algs4.cs.princeton.edu/14analysis/)
- [graph traversal reference](https://algs4.cs.princeton.edu/41graph/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/05-dsa-playbook.md)
