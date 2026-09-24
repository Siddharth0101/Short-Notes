---
id: react-composition-styling
title: Composition reusable patterns and styling
track: react
order: 4
level: Intermediate
minutes: 1
summary: Composition — small components ko `children`/props se jodo.
tags: composition, patterns, css, accessibility, components
---

## Quick revision

- Composition — small components ko `children`/props se jodo.
- Container — data/control sambhalo; presentational component UI dikhaye.
- Compound components — related parts shared contract/state ke saath kaam karein.
- Controlled API — parent state own kare; uncontrolled API — component own kare.
- CSS Modules — class names scoped; global styles ka accidental clash kam.
- Tailwind — utility classes se style; repeated pattern ko readable rakho.
- Styled components — component ke saath styles; runtime/build tradeoff dekho.
- Accessibility — reusable component mein label, keyboard aur focus contract rakho.
- Render prop — function prop se caller ko rendering customize karne do.
- Prop spreading — internal/private props blindly DOM par forward mat karo.
- Component boundary — reusable API small rakho; har styling detail ko configuration prop mat banao.

## Sources — aur padhne ke liye

- [React passing JSX as children](https://react.dev/learn/passing-props-to-a-component)
- [React custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/04-composition-styling.md)
