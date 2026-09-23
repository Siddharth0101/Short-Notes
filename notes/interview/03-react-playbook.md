---
id: interview-react
title: React interview playbook
track: interview
order: 3
level: Intermediate
minutes: 1
summary: State — snapshot hai; previous value se update ho toh functional setter.
tags: react, interview, effects, state, performance
visual: react-render
---

## Quick revision

- State — snapshot hai; previous value se update ho toh functional setter.
- Key — stable sibling identity; reorder mein index key state mismatch kara sakti hai.
- Effect — external sync; dependencies aur cleanup ka reason bolo.
- Performance — profiler evidence; memoization ko default fix mat bolo.
- Server cache — query key, invalidation aur auth scope define karo.
- Machine coding — state model → working flow → edge cases → keyboard/error checks.
- Testing — user-visible behavior; implementation calls par unnecessary coupling nahi.

## Research notes: Demonstrate component behavior

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [React state snapshots](https://react.dev/learn/state-as-a-snapshot)
- [effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [memo reference](https://react.dev/reference/react/memo)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/03-react-playbook.md)
