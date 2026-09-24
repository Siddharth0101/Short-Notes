/**
 * ## Quick revision
 *
 * - CSR — browser UI render; initial JS/data cost.
 * - SSR — server HTML; hydration se client interaction attach.
 * - SSG — build-time HTML; fresh data ke liye rebuild/update strategy.
 * - ISR — cached pages revalidate; stale content window define karo.
 * - Hydration — server/client initial output match hona chahiye.
 * - CDN — assets/content user ke paas; cache key aur invalidation sahi rakho.
 * - Architecture — routes/features boundaries; shared components ka clear contract.
 * - BFF — frontend ke needs ke hisaab se backend aggregation.
 * - Edge HTML — personalized response shared-cache mein user scope bina store mat karo.
 * - Route split — critical route code pehle; prefetch useful links without flooding network.
 * - Server/client boundary — secrets aur trusted validation server par; interactive state client par.
 */

'use strict';


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
