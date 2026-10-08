---
id: design-frontend-performance
title: Frontend performance accessibility and resilience
track: system-design
order: 5
level: Intermediate
minutes: 6
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
- Latency waterfall — dependent requests sequential round trips add karte hain; safe batching/parallelism choose.
- Performance regression — release ke before/after same device/network cohort compare.
- Skeleton layout — final content ka approximate size reserve; fake spinner alone layout shift nahi rokta.

### Assets aur resilience

- Worker — background JS; direct DOM access nahi, messages se communicate.
- srcset/sizes — browser ko suitable resolution choose karne do.
- picture — format/art-direction ke conditional sources.
- Fonts — needed subsets/weights only; fallback metrics aur display strategy.
- Resource hints — preload critical resource, preconnect known origin; overuse contention badhata hai.
- Critical CSS — above-fold styles early; rest controlled loading.
- Compression — transfer size aur decode/render cost dono measure karo.
- Decode cost — compressed bytes small hone ke bawajood huge image dimensions memory/CPU cost badha sakti hain.
- Asset identity — content hash se cache busting; old asset URLs rollout ke dauran available rakho.
- Circuit breaker — repeated dependency failure par short-circuit aur recovery probe.
- Bulkhead — ek failing feature baaki capacity exhaust na kare.
- Fallback — stale data/read-only/partial UI with clear status.
- Below-fold lazy — off-screen images defer; LCP hero ko unnecessarily lazy mat karo.

### Windowed lists

- Infinite scroll — next page fetch; virtualization — visible rows hi render.
- Fixed row window — start=floor(scrollTop/rowHeight); viewport count=ceil(height/rowHeight).
- Overscan — viewport ke aas-paas extra rows; flicker/memory tradeoff.
- Spacer — total height preserve; rendered window ko correct offset.
- Variable rows — measured heights/prefix offsets; fixed-height formula enough nahi.
- Sentinel — IntersectionObserver se next fetch; in-flight guard aur end state.
- Scroll anchor — data prepend/row resize par same visible item position maintain.
- Fetch dedupe — sentinel repeated trigger kare toh same cursor ka duplicate request guard.

### Video delivery

- HLS/DASH — video segments + manifest; bandwidth ke hisaab se bitrate switch.
- Seek — target segment load; obsolete fetch/work cancel.
- Watch analytics — actual playback intervals measure; retries dedupe.
- Startup metric — first playable frame ka time; full download time se alag.
- Rebuffer ratio — playback ke comparison mein stalled time; quality switch decision se relate karo.
- Segment identity — cache key mein content/version/rendition; wrong variant mix mat karo.
- Playback buffer — startup wait versus stall risk; prefetch bounded rakho.
- Video CDN — segments near users; signed access aur cache policy ka contract.
- Video accessibility — captions, keyboard controls aur clear loading/error states.

### HTTP cache directives

- no-cache — response store ho sakta hai; normal HTTP reuse se pehle server revalidation chahiye.
- no-store — response cache mein store mat karo; pehle se cached copy automatically delete nahi hoti.
- private cache — personalized response shared cache mein store na ho; browser cache allowed.
- Vary — selected request headers ko cache key ka part banao, jaise Accept-Language.
- Immutable asset — content-hashed URL + long max-age + immutable; content change ho toh URL bhi badlo.

### Edge cases aur reasoning

- Percentile aggregation — instance p99 values average karna global p99 nahi; compatible histograms/raw population aggregate karo.
- Interaction attribution — slow INP ko handler, render, layout aur queued main-thread work trace se separate; network duration alone explanation nahi.
- Prefetch budget — likelihood, connection/data saver aur priority consider; speculative work critical assets se bandwidth compete na kare.

## Recall aur practice

- Sawal — Two servers ke p99 ka arithmetic mean whole service p99 kyun nahi?
- Jawaab — Percentiles nonlinear aur traffic weights different; merged distribution se target percentile calculate karo.
- Khud try karo — Slow catalog trace inspect karo; hero image priority, reserved dimensions, interaction long task aur keyboard-focus behavior before/after compare karo.

## Sources — aur padhne ke liye

- [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

- [Web Vitals](https://web.dev/articles/vitals)
- [WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Reduced motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/05-frontend-performance.md)
