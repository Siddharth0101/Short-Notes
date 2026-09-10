'use strict';

/**
 * ========================================================================
 * 03. RENDERING PATTERNS: CSR, SSR, SSG, ISR & RSC [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * ARCHITECTURAL DECISION:
 * - Where does HTML generation happen? On the Server or on the Client Browser?
 * - When does generation happen? At Build Time, Request Time, or Background Interval?
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     RENDERING PATTERNS COMPARISON                   │
 * ├──────────┬───────────────────┬──────────────┬────────────┬──────────┤
 * │ Pattern  │ HTML Generated At │ TTFB         │ Server Cost│ SEO Rank │
 * ├──────────┼───────────────────┼──────────────┼────────────┼──────────┤
 * │ CSR      │ Client Browser    │ Fast (empty) │ Zero ($0)  │ Poor/OK  │
 * │ SSR      │ Server on Request │ Slower (wait)│ High ($$$) │ Best     │
 * │ SSG      │ CI/CD Build Time  │ Ultra Fast   │ Zero CDN   │ Best     │
 * │ ISR      │ Build + Background│ Ultra Fast   │ Minimal    │ Best     │
 * │ RSC      │ Server (No JS sent│ Fast stream  │ Moderate   │ Best     │
 * └──────────┴───────────────────┴──────────────┴────────────┴──────────┘
 */

/**
 * ========================================================================
 * 1. CLIENT-SIDE RENDERING (CSR)
 * ========================================================================
 * - Browser downloads minimal blank HTML: `<div id="root"></div>`.
 * - Browser downloads large JavaScript bundle (bundle.js).
 * - React boots up, executes JS, calls APIs, and injects HTML into DOM.
 * - PROS: Rich interactive transitions, cheap static hosting (S3, Netlify).
 * - CONS: Poor initial load speed on slow 3G devices, weak SEO for search crawlers.
 */

/**
 * ========================================================================
 * 2. SERVER-SIDE RENDERING (SSR)
 * ========================================================================
 * - On EVERY user HTTP request, Node server executes React component tree.
 * - Server compiles full HTML string via `renderToString()` and sends it to browser.
 * - Browser displays full HTML immediately (fast FCP).
 * - HYDRATION: Browser then downloads React JS bundle to attach event listeners
 *   (onClick, onChange) to the existing HTML markup.
 * - PROS: Excellent SEO, fast First Contentful Paint.
 * - CONS: Higher server CPU usage, time to first byte depends on backend API latency.
 */

/**
 * ========================================================================
 * 3. STATIC SITE GENERATION (SSG) & ISR
 * ========================================================================
 * - SSG (Static Site Generation):
 *   - HTML is pre-rendered at BUILD TIME for all static pages (e.g. blog, docs).
 *   - Uploaded directly to CDN edge servers worldwide.
 *   - Downside: If you have 500,000 product pages, build takes hours!
 *
 * - ISR (Incremental Static Regeneration - Next.js pattern):
 *   - Best of both worlds! Pre-render pages on demand in the background.
 *   - `revalidate: 60` (Serve stale static page while regenerating fresh HTML in background every 60s).
 */

// Simulated ISR Cache Revalidation Logic
class ISRSimulator {
  constructor(revalidateSeconds = 5) {
    this.cache = new Map();
    this.revalidateMs = revalidateSeconds * 1000;
  }

  async getPage(slug) {
    const cached = this.cache.get(slug);
    const now = Date.now();

    if (!cached) {
      console.log(`[ISR Build] Generating fresh static HTML for ${slug}`);
      const page = { html: `<html><body>Page ${slug}</body></html>`, generatedAt: now };
      this.cache.set(slug, page);
      return page.html;
    }

    // Check if stale
    if (now - cached.generatedAt > this.revalidateMs) {
      console.log(`[ISR Background] Serving STALE page to user, triggering background revalidation for ${slug}...`);
      // Background regeneration
      setTimeout(() => {
        this.cache.set(slug, { html: `<html><body>Page ${slug} - Updated at ${new Date().toISOString()}</body></html>`, generatedAt: Date.now() });
        console.log(`[ISR Background] Revalidation complete for ${slug}!`);
      }, 50);
      return cached.html;
    }

    console.log(`[ISR CDN Cache Hit] Serving fresh cached page for ${slug}`);
    return cached.html;
  }
}

const isr = new ISRSimulator(1);
async function testISR() {
  console.log('--- ISR Workflow Simulation ---');
  await isr.getPage('/product/iphone-16');
  await isr.getPage('/product/iphone-16'); // cache hit
}
testISR();

/**
 * ========================================================================
 * 4. REACT SERVER COMPONENTS (RSC)
 * ========================================================================
 * - RSC components run ONLY on the server.
 * - Their JavaScript dependencies (e.g. huge markdown parsers, heavy date libraries)
 *   are NEVER sent over the wire to the browser bundle!
 * - Directly access server databases and files without exposing public REST endpoints.
 * - Client components (`'use client'`) are only used where user interactivity
 *   (state, effects, event handlers) is strictly needed.
 */
