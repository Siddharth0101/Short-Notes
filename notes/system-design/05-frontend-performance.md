---
id: design-frontend-performance
title: Frontend performance accessibility and resilience
track: system-design
order: 5
level: Intermediate
minutes: 1
summary: LCP — main content kab dikha; INP — interaction responsiveness; CLS — layout shift.
tags: performance, accessibility, web-vitals, react
visual: react-render
---

## Quick revision

- LCP — main content kab dikha; INP — interaction responsiveness; CLS — layout shift.
- Measure — real-user percentiles + lab traces; average alone enough nahi.
- Budget — JS, images, network aur main-thread work ki limits.
- Images — right size/format, dimensions reserve, below-fold lazy loading.
- Long task — work split/yield; heavy CPU worker mein move kar sakte ho.
- Virtualization — visible list window; focus/keyboard behavior preserve.
- Resilience — slow/error state aur usable retry/fallback.
- Accessibility — keyboard, semantic roles, labels aur focus flow.

## Sources — aur padhne ke liye

- [Web Vitals](https://web.dev/articles/vitals)
- [WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Reduced motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/05-frontend-performance.md)
