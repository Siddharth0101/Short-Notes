---
id: react-performance-production
title: Performance suspense and production quality
track: react
order: 10
level: Advanced
minutes: 1
summary: Profiler — pehle slow render/interaction measure karo.
tags: performance, memoization, suspense, lazy, testing, production
visual: react-render
---

## Quick revision

- Profiler — pehle slow render/interaction measure karo.
- `memo` — same props par render skip kar sakta hai; state/context updates phir bhi aa sakti hain.
- `useMemo` — expensive calculation cache; correctness ispar depend mat karao.
- `useCallback` — function identity cache; har callback ko wrap karna zaroori nahi.
- Lazy loading — route/component code zaroorat par load karo.
- Suspense — supported suspending work ka fallback; normal effect fetch auto-handle nahi hota.
- Transition — non-urgent update mark; computation magically cheap nahi hoti.
- Virtualization — visible list window render; stable identity/accessibility preserve karo.
- Production — bundle, errors, accessibility aur real-user performance verify karo.
- Deferred value — expensive result ko lagging value se render; network requests automatically debounce nahi hoti.
- Bundle split — very tiny chunks bhi request overhead badha sakte hain; loading behavior measure karo.
- Render purity — memoization hataane par bhi component logically correct rehna chahiye.

## Research notes: Measure user experience as well as renders

- Is source review ke Core Web Vitals targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

## Sources — aur padhne ke liye

- [Source yahan padho — web.dev](https://web.dev/articles/vitals)
- [React Compiler introduction](https://react.dev/learn/react-compiler/introduction)
- [React Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/10-performance-production.md)
