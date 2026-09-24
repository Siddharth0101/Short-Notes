---
id: system-design-frontend-design-round
title: Frontend system design interview from requirements to failure
track: system-design
order: 6
level: Advanced
minutes: 1
summary: Frontend round — requirements → components/state → data flow → performance → failures.
tags: frontend, react, system-design, accessibility, caching
---

## Quick revision

- Frontend round — requirements → components/state → data flow → performance → failures.
- API contract — request shape, pagination, errors aur cancellation clear karo.
- Search — debounce + request identity + empty/loading/error states.
- State — URL shareable data; local transient interaction; server cache remote data.
- Performance — measure likely bottleneck; list/image/network budget do.
- Accessibility — keyboard/focus behavior design ka part hai.
- Tradeoff — choice ke saath rejected alternative ka concrete cost bolo.
- Capacity — rendered items, payload size, concurrent requests aur memory budget quantify.
- Recoverable UI — retry action user input preserve kare; whole page reset zaroori nahi.
- Observability plan — error rate, interaction latency aur failed request correlation include.

## Sources — aur padhne ke liye

- [React state structure](https://react.dev/learn/choosing-the-state-structure)
- [WAI combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/06-frontend-design-round.md)
