---
id: interview-react
title: React interview playbook
track: interview
order: 3
level: Intermediate
minutes: 3
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
- Render debugging — parent update, changed props, context aur local state triggers separate karo.
- Effect review — setup resource, reactive dependencies aur exact cleanup identify.
- Demo — mouse ke saath keyboard, empty state aur failed network bhi dikhao.

### Quick answer checks

- UI answer — state owner, identity, loading/error aur keyboard flow chhote example se explain karo.
- CSS answer — box, containing block, stacking context aur overflow inspect; random z-index guess mat karo.

### Edge cases aur reasoning

- State machine defense — loading/error/success plus draft ownership sketch; impossible boolean combinations aur stale response ka fix explain karo.
- Optimization evidence — changed prop/context identity aur measured bottleneck separate; render-count reduction user latency improvement automatically nahi.
- Accessible demo — label, focus aur keyboard acceptance show; screenshot visual correctness alone interaction contract prove nahi.

## Research notes: Demonstrate component behavior

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Recall aur practice

- Sawal — Search UI mein debounce ke saath stale-response question ka complete answer?
- Jawaab — Debounce start rate reduce; abort/latest identity completion race handle; empty/error states aur draft retention separately define karo.
- Khud try karo — 25-minute searchable list build; keyboard navigation, reordered row state, reversed fetches aur failure retry with preserved query demonstrate karo.

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [React state snapshots](https://react.dev/learn/state-as-a-snapshot)
- [effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [memo reference](https://react.dev/reference/react/memo)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/03-react-playbook.md)
