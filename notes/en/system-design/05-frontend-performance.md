---
id: design-frontend-performance
title: Frontend performance accessibility and resilience
track: system-design
order: 5
level: Intermediate
minutes: 6
summary: LCP — when the main content appeared; INP — interaction responsiveness; CLS — layout shift.
tags: performance, accessibility, web-vitals, react
visual: react-render
---

## Quick revision

> Revision target — Isolate a user-visible delay using network, JavaScript, layout and rendering evidence.

- LCP — when the main content appeared; INP — interaction responsiveness; CLS — layout shift.
- Measure — real-user percentiles + lab traces; an average alone is not enough.
- Budget — limits on JS, images, network and main-thread work.
- Images — the right size/format, reserved dimensions, lazy loading below the fold.
- Long task — split the work/yield; heavy CPU work can move to a worker.
- Virtualization — a window of the visible list; preserve focus/keyboard behaviour.
- Resilience — a slow/error state and a usable retry/fallback.
- Accessibility — keyboard, semantic roles, labels and focus flow.
- Latency waterfall — dependent requests add sequential round trips; choose safe batching/parallelism.
- Performance regression — compare the same device/network cohort before/after a release.
- Skeleton layout — reserve the approximate size of the final content; a fake spinner alone does not prevent layout shift.

### Assets and resilience

- Worker — background JS; no direct DOM access, it communicates through messages.
- srcset/sizes — let the browser choose a suitable resolution.
- picture — conditional sources for format/art direction.
- Fonts — only the needed subsets/weights; fallback metrics and a display strategy.
- Resource hints — preload a critical resource, preconnect to a known origin; overuse increases contention.
- Critical CSS — above-the-fold styles early; controlled loading for the rest.
- Compression — measure both the transfer size and the decode/render cost.
- Decode cost — even when the compressed bytes are small, huge image dimensions can raise the memory/CPU cost.
- Asset identity — cache busting through a content hash; keep old asset URLs available during the rollout.
- Circuit breaker — short-circuit on repeated dependency failure, with a recovery probe.
- Bulkhead — one failing feature must not exhaust the rest of the capacity.
- Fallback — stale data/read-only/partial UI with a clear status.
- Below-fold lazy — defer off-screen images; do not lazy-load the LCP hero unnecessarily.

### Windowed lists

- Infinite scroll — fetches the next page; virtualization — renders only the visible rows.
- Fixed row window — start=floor(scrollTop/rowHeight); viewport count=ceil(height/rowHeight).
- Overscan — extra rows around the viewport; a flicker/memory tradeoff.
- Spacer — preserves the total height; gives the rendered window the correct offset.
- Variable rows — measured heights/prefix offsets; the fixed-height formula is not enough.
- Sentinel — the next fetch from an IntersectionObserver; an in-flight guard and an end state.
- Scroll anchor — keep the same visible item in position on a data prepend/row resize.
- Fetch dedupe — if the sentinel triggers repeatedly, guard against a duplicate request for the same cursor.

### Video delivery

- HLS/DASH — video segments + a manifest; the bitrate switches according to bandwidth.
- Seek — load the target segment; cancel obsolete fetches/work.
- Watch analytics — measure the actual playback intervals; dedupe retries.
- Startup metric — the time to the first playable frame; different from the full download time.
- Rebuffer ratio — stalled time compared with playback; relate it to the quality switch decision.
- Segment identity — content/version/rendition in the cache key; do not mix the wrong variant.
- Playback buffer — startup wait versus stall risk; keep the prefetch bounded.
- Video CDN — segments near users; a contract for signed access and cache policy.
- Video accessibility — captions, keyboard controls and clear loading/error states.

### HTTP cache directives

- no-cache — the response can be stored; it needs server revalidation before normal HTTP reuse.
- no-store — do not store the response in a cache; an already cached copy is not deleted automatically.
- private cache — a personalized response must not be stored in a shared cache; the browser cache is allowed.
- Vary — makes selected request headers part of the cache key, such as Accept-Language.
- Immutable asset — a content-hashed URL + a long max-age + immutable; when the content changes, change the URL too.

### Edge cases and reasoning

- Percentile aggregation — averaging instance p99 values is not the global p99; aggregate compatible histograms/the raw population.
- Interaction attribution — separate a slow INP into handler, render, layout and queued main-thread work from a trace; network duration alone is not the explanation.
- Prefetch budget — consider likelihood, connection/data saver and priority; speculative work must not compete with critical assets for bandwidth.

## Understand it with an example

- Scenario — A list filter takes 20 ms of computation and 280 ms of DOM/layout work; the interaction lag is clearly visible to users.
- Reasoning — The trace should inspect the rendered row count and the layout work. Bounded rendering/virtualization can be relevant; compare before/after on the same data and device.
- Catch — Memoizing only the calculation does not make the 280 ms of work disappear; in windowing, preserve the contract for the focused row, keyboard movement and scroll position.

## Recall and practice

- Question — Why is the arithmetic mean of two servers' p99 not the whole service's p99?
- Answer — Percentiles are nonlinear and the traffic weights differ; calculate the target percentile from the merged distribution.
- Try it yourself — Inspect a slow catalog trace; compare the hero image priority, reserved dimensions, the interaction long task and keyboard-focus behaviour before/after.

## Practice questions

### Easy · Make the LCP image fast

The hero image is the Largest Contentful Paint and it is slow. What do you do?

<details>
<summary>Answer</summary>

- Priority — `<img fetchpriority="high">`, and do not lazy-load the hero.
- Size — an image sized for the screen through `srcset`/`sizes`; a modern format (AVIF/WebP).
- Discovery — the image should be directly in the HTML (not injected later by JS), or use `<link rel="preload">`.
- CLS — `width`/`height` attributes or an aspect-ratio.

</details>

### Medium · The UI freezes on click (INP)

A button click handler does 400ms of JS work. Interaction to Next Paint is poor. The fix options?

<details>
<summary>Answer</summary>

- Feedback first — update the visual state immediately, then do the heavy work.
- Break up — the work in chunks, yielding to the main thread in between (`await scheduler.yield()` where supported, otherwise `setTimeout`).
- Move — CPU-heavy parsing into a Web Worker.
- Measure — long tasks in DevTools Performance and the field (RUM) INP p75.

</details>

### Medium · Set the cache headers

Hashed JS/CSS files, `index.html`, and the `/api/me` response — what will the headers be?

<details>
<summary>Answer</summary>

- `app.3f9a1c.js` — `Cache-Control: public, max-age=31536000, immutable` (content hash = identity).
- `index.html` — `no-cache` (revalidate every time, a 304 through the ETag).
- `/api/me` — `private, no-store` (user data stays out of shared caches).
- `Vary` — declare it when the response depends on a header (e.g. `Accept-Encoding`).

</details>

### Medium · Infinite scroll design

<details>
<summary>Answer</summary>

- Trigger — a sentinel at the end of the list + `IntersectionObserver`; no scroll event polling.
- Fetch — cursor pagination, in-flight dedupe, a retry button on error.
- Memory — virtualization for very many items.
- Navigation — restore the scroll position and loaded pages on returning from a detail page.
- A11y — a "Load more" button fallback; the footer must stay reachable.

</details>

### Hard · Preventing performance regressions

The site gets a little slower after every release. Design a process.

<details>
<summary>Answer</summary>

- Budgets — JS bundle size, LCP/INP/CLS targets; a bundle-size check in CI and a lab test (Lighthouse) that fails on regression.
- RUM — real users' p75 metrics with a device/network segment; lab data alone is misleading.
- Attribution — tie a regression to a release/commit; isolate it with feature flags.
- Aggregation — do not average percentiles; compute them from raw histograms.

</details>

## Sources — further reading

- [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

- [Web Vitals](https://web.dev/articles/vitals)
- [WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Reduced motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/05-frontend-performance.md)
