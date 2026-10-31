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

> Revision target — User-visible delay ko network, JavaScript, layout aur rendering evidence se isolate karo.

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

## Example se samjho

- Scenario — List filter ko 20 ms computation aur 280 ms DOM/layout work lagta hai; interaction lag users ko clearly dikh raha hai.
- Reasoning — Trace rendered row count aur layout work inspect kare. Bounded rendering/virtualization relevant ho sakti hai; before/after same data aur device par compare karo.
- Catch — Sirf calculation memoize karne se 280 ms work disappear nahi; windowing mein focused row, keyboard movement aur scroll position ka contract preserve karo.

## Recall aur practice

- Sawal — Two servers ke p99 ka arithmetic mean whole service p99 kyun nahi?
- Jawaab — Percentiles nonlinear aur traffic weights different; merged distribution se target percentile calculate karo.
- Khud try karo — Slow catalog trace inspect karo; hero image priority, reserved dimensions, interaction long task aur keyboard-focus behavior before/after compare karo.

## Practice questions

### Easy · LCP image fast karo

Hero image Largest Contentful Paint hai aur slow hai. Kya karoge?

<details>
<summary>Answer</summary>

- Priority — `<img fetchpriority="high">`, aur hero ko lazy-load mat karo.
- Size — `srcset`/`sizes` se screen ke hisaab se image; modern format (AVIF/WebP).
- Discovery — image HTML mein directly ho (JS se baad mein inject nahi), ya `<link rel="preload">`.
- CLS — `width`/`height` attributes ya aspect-ratio.

</details>

### Medium · Click par UI freeze (INP)

Button click handler 400ms ka JS kaam karta hai. Interaction to Next Paint kharab hai. Fix options?

<details>
<summary>Answer</summary>

- Pehle feedback — turant visual state update, phir heavy kaam.
- Break up — kaam chunks mein, beech mein main thread ko yield (`await scheduler.yield()` jahan supported, warna `setTimeout`).
- Move — CPU-heavy parsing Web Worker mein.
- Measure — DevTools Performance long tasks aur field (RUM) INP p75.

</details>

### Medium · Cache headers set karo

Hashed JS/CSS files, `index.html`, aur `/api/me` response — headers kya honge?

<details>
<summary>Answer</summary>

- `app.3f9a1c.js` — `Cache-Control: public, max-age=31536000, immutable` (content hash = identity).
- `index.html` — `no-cache` (har baar revalidate, ETag se 304).
- `/api/me` — `private, no-store` (user data shared caches mein nahi).
- `Vary` — response header-dependent ho (e.g. `Accept-Encoding`) toh batao.

</details>

### Medium · Infinite scroll design

<details>
<summary>Answer</summary>

- Trigger — list end par sentinel + `IntersectionObserver`; scroll event polling nahi.
- Fetch — cursor pagination, in-flight dedupe, error par retry button.
- Memory — bahut items par virtualization.
- Navigation — detail page se wapas aane par scroll position aur loaded pages restore.
- A11y — "Load more" button fallback; footer reachable rehna chahiye.

</details>

### Hard · Performance regressions rokna

Har release ke baad site thodi slow hoti jaati hai. Process design karo.

<details>
<summary>Answer</summary>

- Budgets — JS bundle size, LCP/INP/CLS targets; CI mein bundle-size check aur lab test (Lighthouse) fail on regression.
- RUM — real users ke p75 metrics device/network segment ke saath; lab data alone misleading.
- Attribution — regression ko release/commit se jodo; feature flags se isolate.
- Aggregation — percentiles ko average mat karo; raw histograms se compute.

</details>

## Sources — aur padhne ke liye

- [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

- [Web Vitals](https://web.dev/articles/vitals)
- [WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Reduced motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/05-frontend-performance.md)
