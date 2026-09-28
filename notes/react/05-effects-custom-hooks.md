---
id: react-effects-custom-hooks
title: Effects refs and reusable synchronization
track: react
order: 5
level: Intermediate
minutes: 2
summary: `useEffect` — external system ke saath sync; render calculation ke liye nahi.
tags: effects, useEffect, useRef, custom-hooks, races
---

## Quick revision

- `useEffect` — external system ke saath sync; render calculation ke liye nahi.
- Dependencies — effect mein used reactive values list karo; linter ko ignore mat karo.
- Cleanup — next setup se pehle aur unmount par old listener/timer/connection hatao.
- `[]` — changing reactive dependency nahi; development checks setup repeat kar sakte hain.
- `useRef` — renders ke beech mutable value; update se rerender nahi hota.
- Stale closure — old render ki values capture; dependencies/updater se solve karo.
- Fetch race — abort + latest-result guard se old response ignore karo.
- Custom Hook — stateful logic reuse; har call ka state separate hota hai.
- `useLayoutEffect` — paint se pehle layout work; blocking ka cost dhyaan rakho.
- Effect callback — async function directly mat do; andar async work start karke cleanup return karo.
- Ref DOM access — node commit ke baad available; unmount par null handle karo.
- Dependency identity — fresh object/function reference effect repeat kara sakti hai.

### Hook rules

- Hook order — ordinary Hooks ko loops/conditions mein call mat karo; each render ka order stable rakho.
- Imperative handle — parent ko narrow operations expose; component internals ka poora control mat do.

### External subscriptions

- useSyncExternalStore — external store ka subscribe + stable snapshot contract; SSR par compatible server snapshot do.

### Effect Events

- `useEffectEvent` — Effect ke event logic mein latest committed props/state padho, bina us logic se resubscription trigger kiye.
- Effect Event boundary — Effects/Effect Events se call karo; render ya child props ke through use mat karo.
- Effect Event dependencies — event function dependency mein nahi; actual reactive dependencies hatane ka shortcut bhi nahi.

## Research notes: Effect timing depends on the trigger

- useEffect unconditional after-paint hook nahi.

## Sources — aur padhne ke liye

- [React — useEffectEvent](https://react.dev/reference/react/useEffectEvent)

- [Source yahan padho — React](https://react.dev/reference/react/useEffect)
- [Effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [useSyncExternalStore contract](https://react.dev/reference/react/useSyncExternalStore)
- [React synchronizing with effects](https://react.dev/learn/synchronizing-with-effects)
- [React you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/05-effects-custom-hooks.md)
