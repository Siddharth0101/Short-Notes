---
id: react-state-forms
title: State snapshots forms and immutable updates
track: react
order: 2
level: Foundation
minutes: 1
summary: `useState` — component ki memory; setter next render schedule karta hai.
tags: state, forms, immutability, batching, derived-state
visual: react-render
---

## Quick revision

- `useState` — component ki memory; setter next render schedule karta hai.
- Snapshot — handler current render ki state dekhta hai.
- Functional update — old state se calculate ho toh `setN(n => n + 1)`.
- Batching — multiple updates saath process ho sakti hain; turant state variable change nahi hota.
- Object state — mutate mat karo; changed nesting tak nayi copies banao.
- Controlled input — `value` + `onChange`; checkbox mein `checked`.
- Derived state — existing props/state se calculate ho toh duplicate state mat rakho.
- Lift state — shared data nearest common parent mein rakho.
- Form — submit par validate; pending/error/success states clear rakho.
- Lazy initializer — `useState(() => initialValue)` se initialization calculation pass karo; initializer pure rakho.
- State replacement — hook setter object ko merge nahi karta; needed fields spread karo.
- Checkbox input — event.target.checked boolean deta hai; value alag property hai.

## Research notes: Represent coherent request states

- Independent loading/success booleans contradictory combination allow karti hain.

## Sources — aur padhne ke liye

- [Source yahan padho — React](https://react.dev/learn/choosing-the-state-structure)
- [React state snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React state as a snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React choosing state structure](https://react.dev/learn/choosing-the-state-structure)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/02-state-forms.md)
