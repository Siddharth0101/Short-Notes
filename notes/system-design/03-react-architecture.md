---
id: design-react-architecture
title: React architecture rendering and delivery
track: system-design
order: 3
level: Intermediate
minutes: 1
summary: CSR — browser UI render; initial JS/data cost.
tags: react, architecture, ssr, hydration, cdn
visual: react-render
---

## Quick revision

- CSR — browser UI render; initial JS/data cost.
- SSR — server HTML; hydration se client interaction attach.
- SSG — build-time HTML; fresh data ke liye rebuild/update strategy.
- ISR — cached pages revalidate; stale content window define karo.
- Hydration — server/client initial output match hona chahiye.
- CDN — assets/content user ke paas; cache key aur invalidation sahi rakho.
- Architecture — routes/features boundaries; shared components ka clear contract.
- BFF — frontend ke needs ke hisaab se backend aggregation.

## Sources — aur padhne ke liye

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [hydrateRoot reference](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/03-react-architecture.md)
