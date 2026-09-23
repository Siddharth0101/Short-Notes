---
id: react-components-rendering
title: Components JSX and the render cycle
track: react
order: 3
level: Foundation
minutes: 1
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

## Sources — aur padhne ke liye

- [React thinking in React](https://react.dev/learn/thinking-in-react)
- [React preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/03-components-rendering.md)
