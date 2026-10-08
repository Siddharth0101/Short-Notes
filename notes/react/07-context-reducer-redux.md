---
id: react-context-reducer-redux
title: Context reducers and Redux Toolkit
track: react
order: 7
level: Advanced
minutes: 3
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
- Reducer action — event ka meaning express karo, jaise itemAdded; reducer ke andar network call nahi.
- Normalized store — entities ID se rakho; repeated nested copies ka update cost kam.
- Dispatch/context — value objects ki identity stable rakhna unnecessary notifications kam kar sakta hai.

### Redux flow

- Redux flow — dispatch action → reducer next state → subscribed UI render; reducer mein async side effect nahi.
- RTK draft — createSlice reducer mein mutation-looking syntax Immer draft par; arbitrary external object mutate mat karo.
- Thunk — async work coordinate karke pending/success/failure actions; stale result/cancellation handle karo.

### Edge cases aur reasoning

- Context memo limit — memoized child apne consumed context change par rerender kar sakta hai; memo context subscription ko block nahi karta.
- Serializable state — shared persisted store mein functions/DOM nodes avoid; dates ko explicit serialization contract chahiye.
- Reducer invariant — action ke baad selection/entity relationships valid rakho; deleted item ka selected ID cleanup karo.

## Recall aur practice

- Sawal — Pure reducer ke andar fetch karna debugging aur replay ko kaise affect karta hai?
- Jawaab — Same state/action ka deterministic result tootega; async effect/thunk se work karo aur result action dispatch karo.
- Khud try karo — Todo reducer likho; add/update/delete, unknown action policy aur selected item delete par consistent state verify karo.

## Sources — aur padhne ke liye

- [React scaling with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/07-context-reducer-redux.md)
