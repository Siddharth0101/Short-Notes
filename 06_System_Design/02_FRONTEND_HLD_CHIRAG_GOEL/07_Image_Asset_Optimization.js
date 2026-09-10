'use strict';

/**
 * ========================================================================
 * 07. IMAGE, FONT & ASSET OPTIMIZATION [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design) + Web Performance Best Practices
 *
 * WHY DOES THIS MATTER?
 * - Images account for ~50% of a typical webpage's total weight.
 * - A single unoptimized hero image (3 MB PNG) can destroy your LCP score.
 * - Optimized assets = faster loads = better SEO = lower bounce rates.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                  IMAGE FORMAT COMPARISON TABLE                      │
 * ├──────────┬───────────┬─────────┬────────────┬───────────────────────┤
 * │ Format   │ Type      │ Quality │ Size (vs   │ Browser Support       │
 * │          │           │         │ JPEG)      │                       │
 * ├──────────┼───────────┼─────────┼────────────┼───────────────────────┤
 * │ JPEG     │ Lossy     │ Good    │ Baseline   │ Universal ✅           │
 * │ PNG      │ Lossless  │ Best    │ 2-5x larger│ Universal ✅           │
 * │ GIF      │ Lossless  │ Low     │ Variable   │ Universal ✅           │
 * │ WebP     │ Both      │ Great   │ ~30% less  │ 97%+ browsers ✅       │
 * │ AVIF     │ Both      │ Best    │ ~50% less  │ 92%+ browsers ⚠️      │
 * │ SVG      │ Vector    │ Infinite│ Tiny (<5KB)│ Universal ✅           │
 * └──────────┴───────────┴─────────┴────────────┴───────────────────────┘
 *
 * RULE OF THUMB:
 * - Photographs/Hero images → AVIF (with WebP fallback)
 * - Icons, logos, illustrations → SVG
 * - Animated clips (short) → WebP animated or MP4 <video>
 * - Never use PNG for photographs, never use JPEG for icons!
 */


// ========================================================================
// 1. RESPONSIVE IMAGES: srcset & sizes
// ========================================================================

/**
 * THE PROBLEM:
 * - A 2400px wide hero image is overkill on a 375px wide iPhone screen.
 * - User wastes data downloading 1.5 MB when a 200 KB version would suffice.
 *
 * THE SOLUTION: srcset tells the browser what image sizes are available.
 *              sizes tells the browser how wide the image will display.
 *              The browser picks the optimal one automatically!
 *
 * ```html
 * <img
 *   src="hero-800.jpg"
 *   srcset="
 *     hero-400.jpg   400w,
 *     hero-800.jpg   800w,
 *     hero-1200.jpg  1200w,
 *     hero-2400.jpg  2400w
 *   "
 *   sizes="
 *     (max-width: 600px) 100vw,
 *     (max-width: 1200px) 50vw,
 *     33vw
 *   "
 *   alt="Hero banner showing product showcase"
 *   width="1200"
 *   height="600"
 *   loading="lazy"
 *   decoding="async"
 * />
 * ```
 *
 * HOW THE BROWSER DECIDES:
 * 1. Reads `sizes` to know: "On mobile, image takes 100vw (full width)"
 * 2. Checks device width (375px) and DPR (2x Retina) → needs 750px image
 * 3. Picks `hero-800.jpg` from srcset (closest match ≥ 750px)
 * 4. Downloads ONLY that version. Saves 80% bandwidth vs 2400px!
 */


// ========================================================================
// 2. <picture> ELEMENT — ART DIRECTION & FORMAT FALLBACK
// ========================================================================

/**
 * <picture> gives FULL control over which image to load based on:
 * - Screen width (art direction: different crop on mobile vs desktop)
 * - Browser format support (AVIF → WebP → JPEG fallback chain)
 *
 * ```html
 * <picture>
 *   <!-- AVIF (best compression, newest) -->
 *   <source
 *     type="image/avif"
 *     srcset="hero-desktop.avif 1200w, hero-mobile.avif 600w"
 *     sizes="(max-width: 768px) 100vw, 50vw"
 *   />
 *   <!-- WebP (great compression, wide support) -->
 *   <source
 *     type="image/webp"
 *     srcset="hero-desktop.webp 1200w, hero-mobile.webp 600w"
 *     sizes="(max-width: 768px) 100vw, 50vw"
 *   />
 *   <!-- JPEG fallback (universal, last resort) -->
 *   <img
 *     src="hero-desktop.jpg"
 *     alt="Product showcase banner"
 *     width="1200"
 *     height="600"
 *     loading="lazy"
 *   />
 * </picture>
 * ```
 *
 * ART DIRECTION (Different crops per device):
 * ```html
 * <picture>
 *   <source media="(max-width: 768px)" srcset="hero-mobile-crop.jpg" />
 *   <source media="(min-width: 769px)" srcset="hero-desktop-wide.jpg" />
 *   <img src="hero-desktop-wide.jpg" alt="Hero" />
 * </picture>
 * ```
 */


// ========================================================================
// 3. LAZY LOADING IMAGES
// ========================================================================

/**
 * NATIVE LAZY LOADING (Simplest approach):
 * ```html
 * <img src="product.webp" loading="lazy" alt="Product image" />
 * ```
 * - Browser defers loading until image is near the viewport.
 * - ⚠️ Do NOT lazy-load above-the-fold images (hero, LCP element)!
 *   Use `loading="eager"` or `fetchpriority="high"` for LCP images.
 *
 * INTERSECTION OBSERVER (Custom lazy loading):
 * ```jsx
 * function LazyImage({ src, alt }) {
 *   const imgRef = useRef(null);
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   useEffect(() => {
 *     const observer = new IntersectionObserver(
 *       ([entry]) => {
 *         if (entry.isIntersecting) {
 *           setIsVisible(true);
 *           observer.unobserve(entry.target);
 *         }
 *       },
 *       { rootMargin: '200px' }    // Start loading 200px before visible
 *     );
 *
 *     if (imgRef.current) observer.observe(imgRef.current);
 *     return () => observer.disconnect();
 *   }, []);
 *
 *   return (
 *     <img
 *       ref={imgRef}
 *       src={isVisible ? src : 'placeholder-blur.jpg'}
 *       alt={alt}
 *     />
 *   );
 * }
 * ```
 *
 * BLUR-UP TECHNIQUE (Medium/Instagram style):
 * 1. Inline a tiny 20px wide base64 blurred image as placeholder.
 * 2. When full image loads, cross-fade from blur to sharp.
 * 3. CSS: `filter: blur(20px)` on placeholder, transition to `filter: blur(0)`.
 */


// ========================================================================
// 4. CDN IMAGE TRANSFORMATION SERVICES
// ========================================================================

/**
 * Instead of pre-generating every image variant at build time,
 * use CDN services that transform images ON-THE-FLY via URL params:
 *
 * CLOUDINARY:
 * Original:  https://res.cloudinary.com/demo/image/upload/v1/hero.jpg
 * Resized:   https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,f_auto,q_auto/v1/hero.jpg
 *
 * URL PARAMETERS:
 * - w_400     → Width 400px
 * - h_300     → Height 300px
 * - c_fill    → Crop mode: fill container (center crop)
 * - f_auto    → Auto-detect best format (AVIF for Chrome, WebP for Safari, JPEG fallback)
 * - q_auto    → Auto-select quality (balance between size and visual quality)
 *
 * IMGIX: Similar URL-based transforms.
 * CLOUDFLARE IMAGE RESIZING: Built into Cloudflare CDN.
 *
 * SWIGGY/ZOMATO PATTERN:
 * - API returns a cloudinaryImageId (e.g., "abc123xyz")
 * - Frontend constructs the URL with desired dimensions:
 *   `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_264,h_288,c_fill/${cloudinaryImageId}`
 */


// ========================================================================
// 5. CRITICAL RENDERING PATH & PRPL PATTERN
// ========================================================================

/**
 * CRITICAL RENDERING PATH:
 * The sequence browser follows to render first pixel:
 *
 * 1. HTML downloaded → DOM Tree constructed
 * 2. CSS downloaded → CSSOM Tree constructed
 * 3. DOM + CSSOM merged → Render Tree
 * 4. Layout (compute positions/sizes) → Paint (pixels on screen)
 *
 * RENDER-BLOCKING RESOURCES:
 * - CSS in <head> is render-blocking by default (browser won't paint until CSSOM ready)
 * - Synchronous JS in <head> blocks HTML parsing AND rendering!
 *
 * FIXES:
 * 1. Inline critical CSS (above-the-fold styles) directly in <head>
 * 2. Defer non-critical CSS: <link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
 * 3. JS: Use `defer` (download parallel, execute after HTML parsed) or `async` (download parallel, execute immediately)
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │              SCRIPT LOADING STRATEGIES COMPARISON                   │
 * ├──────────────────┬────────────────────────────────────────────────── ┤
 * │ Strategy         │ Behavior                                         │
 * ├──────────────────┼────────────────────────────────────────────────── ┤
 * │ <script>         │ Blocks HTML parsing. Downloads + executes inline. │
 * │ <script defer>   │ Downloads in parallel. Executes AFTER HTML parsed.│
 * │                  │ Maintains script order. Best for app bundles.      │
 * │ <script async>   │ Downloads in parallel. Executes AS SOON AS ready. │
 * │                  │ No guaranteed order. Best for analytics/ads.       │
 * │ type="module"    │ Deferred by default. Supports ES module imports.  │
 * └──────────────────┴──────────────────────────────────────────────────┘
 *
 *
 * PRPL PATTERN (Google's Performance Pattern):
 * - P — Push (Preload) critical resources for initial route
 * - R — Render the initial route as fast as possible
 * - P — Pre-cache remaining routes' assets using Service Worker
 * - L — Lazy-load remaining routes on demand
 */


// ========================================================================
// 6. FONT OPTIMIZATION
// ========================================================================

/**
 * PROBLEMS WITH WEB FONTS:
 * - FOIT (Flash of Invisible Text): Text disappears while font downloads.
 * - FOUT (Flash of Unstyled Text): System font shown, then swaps to web font (jarring shift).
 * - CLS impact: Font swap can cause layout shift if fallback font has different metrics.
 *
 * SOLUTIONS:
 *
 * 1. font-display CSS property:
 * ```css
 * @font-face {
 *   font-family: 'Inter';
 *   src: url('/fonts/Inter.woff2') format('woff2');
 *   font-display: swap;       // Show fallback immediately, swap when ready
 *   // font-display: optional;   // Best for CLS — only use if cached
 * }
 * ```
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │              FONT-DISPLAY VALUES COMPARISON                         │
 * ├──────────────┬──────────────────────────────────────────────────────┤
 * │ Value        │ Behavior                                            │
 * ├──────────────┼──────────────────────────────────────────────────────┤
 * │ auto         │ Browser default (usually block)                     │
 * │ block        │ Invisible text for 3s, then swap (FOIT)             │
 * │ swap         │ Fallback shown immediately, swaps when ready (FOUT) │
 * │ fallback     │ Brief invisible (100ms), then fallback, swap if fast│
 * │ optional     │ Brief invisible, uses cached font or stays fallback │
 * │              │ Best for CLS! No swap if not cached.                │
 * └──────────────┴──────────────────────────────────────────────────────┘
 *
 * 2. Preload critical fonts:
 * ```html
 * <link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />
 * ```
 *
 * 3. Self-host fonts (don't use Google Fonts CDN for privacy + performance):
 *    - Download .woff2 files
 *    - Serve from same domain = no extra DNS lookup or connection
 *
 * 4. Variable fonts: ONE font file supports all weights (100-900).
 *    Instead of downloading 4 separate files (Regular, Medium, Bold, Black),
 *    one variable font file covers everything. Saves ~60% total font weight.
 *
 * 5. Subset fonts: Only include characters you need.
 *    English-only site? Remove Cyrillic, Greek, Vietnamese ranges.
 *    Tool: `glyphhanger` or Google Fonts `&text=` parameter.
 */


// ========================================================================
// 7. RESOURCE HINTS CHEAT SHEET (COMPLETE)
// ========================================================================

/**
 * ┌──────────────────────────────────────────────────────────────────────────────────────┐
 * │                     RESOURCE HINTS — COMPLETE REFERENCE TABLE                        │
 * ├──────────────────┬──────────────────────────────────────────────────────────────────── ┤
 * │ Hint             │ What It Does                                                       │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────┤
 * │ dns-prefetch     │ Resolves DNS only for external domain. Cheapest hint.              │
 * │                  │ <link rel="dns-prefetch" href="https://api.example.com" />         │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────┤
 * │ preconnect       │ DNS + TCP + TLS handshake for external domain. Saves ~100-300ms.   │
 * │                  │ <link rel="preconnect" href="https://fonts.googleapis.com" />      │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────┤
 * │ prefetch         │ Fetch resource for FUTURE page navigation (low priority).          │
 * │                  │ <link rel="prefetch" href="/next-page-bundle.js" />                │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────┤
 * │ preload          │ Fetch resource for CURRENT page (high priority). Must be used soon.│
 * │                  │ <link rel="preload" href="/hero.avif" as="image" />                │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────┤
 * │ prerender        │ Speculatively render an ENTIRE page in background (Chrome).        │
 * │                  │ <link rel="prerender" href="/likely-next-page" />                  │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────┤
 * │ fetchpriority    │ Signal priority to browser for specific resources.                 │
 * │                  │ <img fetchpriority="high" src="/hero.jpg" /> (LCP image)           │
 * │                  │ <img fetchpriority="low" src="/footer-logo.jpg" />                 │
 * └──────────────────┴────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// SIMULATION: Image Optimization Decision Engine
// ========================================================================

function selectOptimalImage({ deviceWidth, dpr, formatSupport, isAboveFold }) {
  const neededWidth = deviceWidth * dpr;

  // Format selection (best available)
  let format;
  if (formatSupport.includes('avif')) format = 'avif';
  else if (formatSupport.includes('webp')) format = 'webp';
  else format = 'jpeg';

  // Size selection from srcset
  const availableSizes = [400, 800, 1200, 2400];
  const selectedSize = availableSizes.find((s) => s >= neededWidth) || availableSizes[availableSizes.length - 1];

  // Loading strategy
  const loading = isAboveFold ? 'eager' : 'lazy';
  const fetchPriority = isAboveFold ? 'high' : 'auto';

  return {
    url: `https://cdn.example.com/hero-${selectedSize}.${format}`,
    width: selectedSize,
    format,
    loading,
    fetchPriority,
    estimatedSavingsVsPNG: format === 'avif' ? '~50%' : format === 'webp' ? '~30%' : '0%',
  };
}

console.log('--- Image Optimization Decision Engine ---\n');

// Mobile phone (iPhone 15, 390px width, 3x Retina)
const mobileImage = selectOptimalImage({
  deviceWidth: 390,
  dpr: 3,
  formatSupport: ['avif', 'webp', 'jpeg'],
  isAboveFold: true,
});
console.log('📱 Mobile (390px @3x):', mobileImage);

// Desktop (1920px, 1x DPR, older browser)
const desktopImage = selectOptimalImage({
  deviceWidth: 1920,
  dpr: 1,
  formatSupport: ['webp', 'jpeg'],
  isAboveFold: false,
});
console.log('🖥️ Desktop (1920px @1x):', desktopImage);

// Low-end device (320px, 1x, no modern formats)
const lowEndImage = selectOptimalImage({
  deviceWidth: 320,
  dpr: 1,
  formatSupport: ['jpeg'],
  isAboveFold: true,
});
console.log('📟 Low-end (320px @1x):', lowEndImage);

// Font loading strategy
console.log('\n--- Font Loading Strategy ---');
const fontStrategies = [
  { font: 'Inter (primary)', strategy: 'preload + font-display: swap', reason: 'Critical for LCP text' },
  { font: 'Fira Code (code)', strategy: 'font-display: optional', reason: 'Non-critical, avoid CLS' },
  { font: 'Noto Sans Arabic', strategy: 'subset + preload', reason: 'Only load Arabic chars for RTL pages' },
];
fontStrategies.forEach((f) => console.log(`  ${f.font}: ${f.strategy} — ${f.reason}`));
