'use strict';

/**
 * ========================================================================
 * 02. WEB PERFORMANCE & CORE WEB VITALS [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * GOAL:
 * - Understand the critical web metrics Google uses for SEO & user experience.
 * - Identify bottlenecks, long tasks, render-blocking resources, and layout shifts.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     THE 3 CORE WEB VITALS (2026)                    │
 * │                                                                     │
 * │  1. LCP (Largest Contentful Paint)  ──► Target: < 2.5 seconds       │
 * │     Measures perceived loading speed of main content block.         │
 * │                                                                     │
 * │  2. INP (Interaction to Next Paint) ──► Target: < 200 milliseconds  │
 * │     Measures UI responsiveness & latency on click/tap/keypress.     │
 * │                                                                     │
 * │  3. CLS (Cumulative Layout Shift)   ──► Target: < 0.1 score         │
 * │     Measures unexpected visual layout shifts during page lifecycle. │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. OPTIMIZING LCP (LARGEST CONTENTFUL PAINT)
 * ========================================================================
 * What causes poor LCP?
 * - Slow server response times (High TTFB).
 * - Render-blocking JavaScript and CSS in `<head>`.
 * - Slow resource load times (huge uncompressed hero images).
 * - Client-side rendering waiting for JS bundle download + API fetch.
 *
 * HOW TO FIX:
 * 1. Preload Hero Image:
 *    `<link rel="preload" fetchpriority="high" as="image" href="/hero.webp" type="image/webp">`
 * 2. Serve modern formats: AVIF / WebP instead of PNG/JPEG (saves ~60% bytes).
 * 3. Use CDN Edge Caching (Cloudflare, Fastly, CloudFront).
 * 4. Inline Critical CSS and defer non-critical scripts (`defer` or `async`).
 */

/**
 * ========================================================================
 * 2. OPTIMIZING INP (INTERACTION TO NEXT PAINT)
 * ========================================================================
 * - INP measures the longest latency of user interactions throughout the page session.
 * - Any JS execution taking > 50ms blocks the browser main thread (Long Task)!
 *
 * STRATEGIES:
 * 1. Break up Long Tasks using `scheduler.yield()` or `setTimeout(..., 0)`.
 * 2. Offload heavy data processing, sorting, and parsing to Web Workers.
 * 3. React 18 `useTransition`: Keeps UI responsive while updating large lists.
 * 4. Debounce and throttle high-frequency events (scroll, resize, mousemove).
 */

// Simulation of Long Task Chunking (Non-blocking work)
async function simulateChunkedProcessing(totalItems) {
  console.log(`Processing ${totalItems} items without blocking main thread...`);
  const chunkSize = 100;
  let processed = 0;

  while (processed < totalItems) {
    const nextChunk = Math.min(chunkSize, totalItems - processed);
    // Simulate work
    processed += nextChunk;
    
    // Yield execution back to browser event loop
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  console.log(`✅ Completed processing ${processed} items cleanly!`);
}

simulateChunkedProcessing(300);

/**
 * ========================================================================
 * 3. OPTIMIZING CLS (CUMULATIVE LAYOUT SHIFT)
 * ========================================================================
 * What causes layout shifts?
 * - Images without explicit dimensions.
 * - Ads, embeds, or iframes loaded without reserved space.
 * - FOIT (Flash of Invisible Text) / FOUT (Flash of Unstyled Text) via web fonts.
 * - Dynamically injected DOM banners (e.g. "Subscribe to newsletter").
 *
 * FIXES:
 * 1. Always set `aspect-ratio: 16 / 9;` or `width` and `height` on images & videos.
 * 2. Reserve placeholder skeleton space for dynamic ads/promos.
 * 3. Use `font-display: optional` or `swap` with matching fallback font metrics.
 *
 * ========================================================================
 * 4. BROWSER RESOURCE HINTS CHEAT SHEET
 * ========================================================================
 * - `dns-prefetch`: Resolves DNS early for external API domains.
 * - `preconnect`: Resolves DNS + performs TLS TCP handshake early.
 * - `prefetch`: Fetches assets needed for FUTURE page navigation (low priority).
 * - `preload`: Tells browser to download HIGH PRIORITY asset for CURRENT page immediately.
 */
