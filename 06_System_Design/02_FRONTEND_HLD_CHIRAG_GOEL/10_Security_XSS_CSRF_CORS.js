/**
 * ## Quick revision
 *
 * - Trust boundary — har hop par identity, input aur permissions verify karo.
 * - Authorization — resource/user/tenant relation check; ID guess karna permission nahi.
 * - Rate limit — unit, key, window aur failure policy define karo.
 * - Observability — correlated logs, metrics aur traces.
 * - SLO — reliability target; error budget allowed bad events/time ka allowance.
 * - Alert — user impact aur actionable response par focus.
 * - Cardinality — unbounded IDs metric labels mein mat rakho.
 * - Rollout — canary, health signal aur rollback trigger.
 * - Degradation — optional features shed karo; correctness-critical rules preserve.
 * - XSS — stored, reflected ya DOM injection; context-aware escaping/sanitization.
 * - CSRF — auto-sent credentials ka misuse; suitable tokens/SameSite/origin checks.
 * - CSP — script sources/execution restrict; encoding ka replacement nahi.
 * - Clickjacking — frame-ancestors policy se unauthorized embedding roko.
 * - HttpOnly/Secure — JS cookie reads block / HTTPS-only send; all attacks ka complete fix nahi.
 * - RTO/RPO — service restore time target / acceptable data-loss window.
 * - Backup restore — backup file hona enough nahi; restore path regularly verify.
 * - Error budget burn — allowable failure kitni fast consume ho rahi hai, alert severity usse align.
 */

'use strict';
// 1. XSS (Cross-Site Scripting)
// 2. CSRF (Cross-Site Request Forgery)
// 3. CLICKJACKING & IFRAMES
// 4. CORS (Cross-Origin Resource Sharing)


console.log('✅ Security (XSS, CSRF, CORS) module parsed successfully.');
