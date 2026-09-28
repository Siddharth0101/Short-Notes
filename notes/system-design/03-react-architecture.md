---
id: design-react-architecture
title: React architecture rendering and delivery
track: system-design
order: 3
level: Intermediate
minutes: 2
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
- Edge HTML — personalized response shared-cache mein user scope bina store mat karo.
- Route split — critical route code pehle; prefetch useful links without flooding network.
- Server/client boundary — secrets aur trusted validation server par; interactive state client par.

### Config aur design systems

- Schema test — config fixtures ko renderer contract ke against validate karo.
- Design token — shared colors/spacing/type values; theme mein centrally update.
- Micro-frontend — independent ownership/deploy; duplicate dependencies, consistency aur runtime integration cost.
- Module federation — runtime module sharing; version/security/fallback contract chahiye.
- Schema-driven UI — validated config se known components render.
- Registry — allowed component type ko implementation se map.
- Version — client/server compatibility aur migration/defaults define.
- Unknown field/type — ignore/reject/fallback ka explicit policy.
- Form schema — field constraints, dependencies aur accessible errors.
- State identity — stable config IDs; reorder par user input na kho.

### Server Components

- Server Component — component code browser ko ship nahi hota; build ya request ke waqt server environment mein run.
- RSC interactivity — useState jaise interactive Hooks client component mein; server component usko compose kar sakta hai.
- `use client` — client module boundary declare; interactive component ko server-rendered content ke saath compose karo.
- `use server` — Server Functions ka directive; Server Components ko mark karne ka directive nahi.

## Sources — aur padhne ke liye

- [React — Server Components](https://react.dev/reference/rsc/server-components)

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [hydrateRoot reference](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/03-react-architecture.md)
