'use strict';

/**
 * ========================================================================
 * FRONTEND SYSTEM DESIGN - HLD FOUNDATIONS [⚡ VISUAL]
 * ========================================================================
 * SOURCE: Chirag Goel - Chakde System Design + Namaste React
 *
 * WHAT IS SYSTEM DESIGN?
 * - Architecture, components, data flow, interfaces define karna.
 * - "Build me a Netflix" → actual blueprint kaise banaoge.
 *
 * TWO TYPES:
 * ┌────────────────────────────┬─────────────────────────────────┐
 * │    HLD (High-Level)        │    LLD (Low-Level)              │
 * ├────────────────────────────┼─────────────────────────────────┤
 * │ Architecture diagram       │ Component hierarchy             │
 * │ Data flow                  │ Component API (props, state)    │
 * │ API contracts              │ Actual code implementation      │
 * │ Tech stack choices         │ State management details        │
 * │ Scalability plan           │ Event handling                  │
 * │ Caching strategy           │ Error handling in components    │
 * │ Security model             │ Accessibility implementation    │
 * └────────────────────────────┴─────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. R.A.D.I.O. FRAMEWORK (Interview Structure)
 * ========================================================================
 * NOTES:
 * - Har frontend system design question ko is framework se approach karo.
 * - Interview me 5-7 min Requirements pe spend karo.
 *
 * R.A.D.I.O:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  R = Requirements   (Functional + Non-Functional)          │
 * │  A = Architecture   (High-Level Design / Diagram)          │
 * │  D = Data Model     (Data shapes flowing through app)      │
 * │  I = Interface      (API Design - endpoints, contracts)    │
 * │  O = Optimizations  (Performance, Security, a11y)          │
 * └─────────────────────────────────────────────────────────────┘
 *
 * EXAMPLE — Design Netflix:
 *
 * R (Requirements):
 *   FUNCTIONAL: Browse, Search, Play video, Continue watching, Profiles
 *   NON-FUNCTIONAL: < 2s load, no buffering, multi-device, millions users
 *
 * A (Architecture):
 *   Client → CDN (assets) → API Gateway → Microservices
 *   Rendering: SSR initial load, CSR for navigation
 *
 * D (Data Model):
 *   User: { id, name, email, plan, watchList, continueWatching }
 *   Content: { id, title, type, genres, rating, thumbnail, trailer }
 *
 * I (Interface):
 *   GET /api/browse → home page content rows
 *   GET /api/search?q= → search results
 *   GET /api/stream/:id → stream URL + subtitles
 *
 * O (Optimizations):
 *   Lazy load rows, image CDN, video preloading, service worker cache
 */


/**
 * ========================================================================
 * 2. RENDERING STRATEGIES
 * ========================================================================
 * NOTES:
 *
 * CSR (Client-Side Rendering):
 * - Server blank HTML + JS bhejta hai. Browser JS download → execute → render.
 * - SEO: ❌ Bad | Used by: React default, Vue, Angular
 * |---HTML----|----JS Download----|----Execute----|--Render--|
 *
 * SSR (Server-Side Rendering):
 * - Server pe React run → full HTML generate → browser ko bhejo → hydrate.
 * - SEO: ✅ Great | Used by: Next.js, Remix
 * |---HTML (content ready)---|----Hydration (attach events)----|
 *
 * SSG (Static Site Generation):
 * - Build time pe pages generate. CDN se serve. Fastest possible.
 * - SEO: ✅ | Used for: Blogs, docs, landing pages
 *
 * ISR (Incremental Static Regeneration):
 * - SSG + background re-generation after stale.
 * - getStaticProps({ revalidate: 60 }) → regenerate every 60s
 *
 * ┌────────────┬────────┬──────────┬───────────────┬─────────────────────┐
 * │ Strategy   │  SEO   │  Speed   │  Dynamic?     │  Use Case           │
 * ├────────────┼────────┼──────────┼───────────────┼─────────────────────┤
 * │ CSR        │  ❌    │  Slow    │  ✅ Fully     │  Dashboards, SPAs   │
 * │ SSR        │  ✅    │  Fast    │  ✅ Dynamic   │  E-commerce, social │
 * │ SSG        │  ✅    │  ⚡ Max  │  ❌ Static    │  Blogs, docs        │
 * │ ISR        │  ✅    │  ⚡ Fast │  🔄 Semi      │  Product pages      │
 * └────────────┴────────┴──────────┴───────────────┴─────────────────────┘
 *
 * HYDRATION:
 * Server HTML → JS loads → React attaches events to existing DOM nodes.
 * If server HTML ≠ React output → HYDRATION MISMATCH error.
 */


/**
 * ========================================================================
 * 3. COMMUNICATION PROTOCOLS
 * ========================================================================
 *
 * ┌───────────┬──────────────────┬───────────────┬──────────────────────┐
 * │ Protocol  │ Direction        │ Real-time?    │ Use Case             │
 * ├───────────┼──────────────────┼───────────────┼──────────────────────┤
 * │ REST      │ Request-Response │ ❌            │ CRUD operations      │
 * │ GraphQL   │ Request-Response │ ❌            │ Complex data needs   │
 * │ WebSocket │ Bidirectional    │ ✅            │ Chat, gaming, collab │
 * │ SSE       │ Server → Client  │ ✅            │ Notifications, feeds │
 * │ Long Poll │ Request-Response │ ~✅           │ Fallback for WS      │
 * └───────────┴──────────────────┴───────────────┴──────────────────────┘
 *
 * REST: GET/POST/PUT/PATCH/DELETE. Status codes: 200/201/400/401/404/500.
 * GraphQL: One endpoint, client asks exactly what it needs. No over-fetching.
 * WebSocket: const ws = new WebSocket("wss://..."); ws.onmessage, ws.send()
 * SSE: const es = new EventSource("/api/stream"); es.onmessage
 */


/**
 * ========================================================================
 * 4. PERFORMANCE OPTIMIZATION
 * ========================================================================
 *
 * NETWORK:
 * - dns-prefetch → resolve DNS early
 * - preconnect → DNS + TCP + TLS early
 * - prefetch → download for FUTURE navigation (low priority)
 * - preload → download for CURRENT page (high priority)
 * - Gzip/Brotli compression (60-80% size reduction)
 * - CDN for static assets
 * - Cache-Control headers (max-age for hashed assets)
 *
 * DEBOUNCING vs THROTTLING:
 * Typing: r...e...a...c...t...(stops)
 * Debounce: .........................*  (fires ONCE at end)
 * Throttle: *........*........*.....*  (fires PERIODICALLY)
 * Debounce → search input. Throttle → scroll events.
 *
 * ASSETS:
 * - Code splitting: React.lazy() + Suspense
 * - Tree shaking: dead code removal (automatic by bundler)
 * - defer script loading (best for app code)
 * - Images: WebP/AVIF format, srcset, loading="lazy"
 * - Fonts: font-display: swap, preload critical fonts
 *
 * CORE WEB VITALS:
 * ┌──────────────┬───────────────┬───────────────────────────┐
 * │     LCP      │     INP       │         CLS               │
 * │ Loading      │ Interactivity │ Visual Stability          │
 * ├──────────────┼───────────────┼───────────────────────────┤
 * │ Good: < 2.5s │ Good: < 200ms │ Good: < 0.1              │
 * │ Poor: > 4s   │ Poor: > 500ms │ Poor: > 0.25             │
 * └──────────────┴───────────────┴───────────────────────────┘
 * LCP: optimize hero image, SSR, remove render-blocking
 * INP: break long JS tasks, web workers, debounce
 * CLS: set width/height on images, reserve ad space, aspect-ratio
 */

function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}


/**
 * ========================================================================
 * 5. WEB ARCHITECTURE
 * ========================================================================
 *
 * N-TIER:
 * 1-Tier: Client + App + DB on one machine
 * 2-Tier: Client ←→ Server+DB
 * 3-Tier: Client ←→ App Server ←→ Database
 * N-Tier: Client → CDN → API Gateway → Microservices → DB/Cache/Queue
 *
 * MICRO-FRONTEND:
 * - Break large frontend into independently deployable pieces.
 * - Each team owns a section: Header=TeamA, Products=TeamB.
 * - Module Federation (Webpack 5), Single-SPA, iframes.
 *
 * BFF (Backend for Frontend):
 * - Dedicated backend tailored per frontend platform.
 * - Web BFF → rich data. Mobile BFF → lightweight data.
 */


/**
 * ========================================================================
 * 6. SECURITY
 * ========================================================================
 *
 * JWT: header.payload.signature → server creates on login, client sends with requests
 * OAuth 2.0: "Login with Google" → redirect → consent → auth code → token exchange
 * XSS: React escapes {} automatically. Never use dangerouslySetInnerHTML.
 * CSRF: SameSite cookies + CSRF tokens
 * CORS: Server must add Access-Control-Allow-Origin header
 */


/**
 * ========================================================================
 * 7. ACCESSIBILITY & DESIGN PATTERNS
 * ========================================================================
 *
 * a11y:
 * - Semantic HTML: <header>, <nav>, <main>, <article> instead of <div>
 * - ARIA: aria-label, aria-expanded, aria-live, role attributes
 * - Keyboard: Tab navigation, Escape to close, arrow keys for lists
 * - Color: 4.5:1 contrast ratio (WCAG AA)
 *
 * PATTERNS:
 * - Compound Components: Accordion + AccordionItem (shared context)
 * - HOC: function(Component) → EnhancedComponent
 * - Custom Hooks: useOnlineStatus(), useFetch() (preferred)
 * - State Machine: idle → loading → success/error (no impossible states)
 * - Micro-frontends: independently deployable UI pieces
 */
