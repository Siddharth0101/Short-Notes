---
id: react-components-rendering
title: Components JSX and the render cycle
track: react
order: 3
level: Foundation
minutes: 2
summary: Render — next UI calculate; commit — DOM updates apply.
tags: components, jsx, props, rendering, keys
visual: react-render
---

## Quick revision

- Render — next UI calculate; commit — DOM updates apply.
- Reconciliation — type, position aur key se identity match hoti hai.
- Stable key — item ID use karo; random key har render remount kar sakti hai.
- State reset — component type/key badalne se local state reset ho sakti hai.
- Conditional UI — `0 && <Item />` zero dikha sakta hai.
- Strict Mode — development mein extra checks; render/effect ko safe rakho.
- Class lifecycle — mount/update/unmount; Hooks mein responsibilities ke hisaab se socho.
- Error boundary — descendant render errors ke fallback; har async/event error nahi pakadti.
- Nested component definition — parent render ke andar component type define karna state reset kara sakta hai.
- Same-value update — React Object.is comparison se redundant state update skip kar sakta hai.
- Portal — DOM location badalti hai; context aur React event propagation parent tree follow karte hain.

### Class lifecycle

- Mount — constructor → render → componentDidMount; children commit before parent didMount.
- Update — render ke baad componentDidUpdate; repeated state update se loop avoid.
- Unmount — componentWillUnmount mein owned listeners/timers cleanup.
- `super(props)` — constructor mein props ko parent tak pass karo.
- Update guard — componentDidUpdate mein setState condition ke bina infinite update loop ho sakta hai.
- Derived data — props se calculate ho toh extra duplicated class state avoid.
- Snapshot lifecycle — DOM mutation se pehle measurement aur after-update adjustment ka ownership clear.

## Sources — aur padhne ke liye

- [React thinking in React](https://react.dev/learn/thinking-in-react)
- [React preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/03-components-rendering.md)
