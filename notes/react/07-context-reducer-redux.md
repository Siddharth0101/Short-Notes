---
id: react-context-reducer-redux
title: Context reducers and Redux Toolkit
track: react
order: 7
level: Advanced
minutes: 1
summary: Local state — sirf component use kare toh paas rakho.
tags: context, reducer, redux, redux-toolkit, state-management
visual: context-flow
---

## Quick revision

- Local state — sirf component use kare toh paas rakho.
- Context — tree mein value share; changed value consumers rerender kara sakti hai.
- `useReducer` — action se next state; reducer pure rakho.
- Context split — unrelated fast-changing values alag providers mein rakho.
- Redux — predictable shared store; actions se state transitions.
- Redux Toolkit — reducers mein draft mutation syntax Immer handle karta hai.
- Selector — needed slice padho; unstable return references extra renders kara sakte hain.
- Server state — fetching/cache tool ko do; store mein duplicate copy se bacho.

## Sources — aur padhne ke liye

- [React scaling with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/07-context-reducer-redux.md)
