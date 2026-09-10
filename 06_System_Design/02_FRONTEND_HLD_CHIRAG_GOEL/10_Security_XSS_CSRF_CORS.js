'use strict';

/**
 * ========================================================================
 * 10. SECURITY: XSS, CSRF, CLICKJACKING & CORS [⚡ FRONTEND HLD]
 * ========================================================================
 * SOURCE: Namaste Frontend System Design (Chirag Goel & Akshay Saini)
 *
 * The internet is hostile. A frontend system design is incomplete without
 * understanding common attack vectors and how the browser protects users.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                COMMON WEB ATTACKS & DEFENSES                        │
 * ├──────────────┬────────────────────────┬─────────────────────────────┤
 * │ Attack       │ Mechanism              │ Primary Defense             │
 * ├──────────────┼────────────────────────┼─────────────────────────────┤
 * │ XSS          │ Injecting malicious JS │ Escape data, CSP, HttpOnly  │
 * │ CSRF         │ Forged request via auth│ Anti-CSRF tokens, SameSite  │
 * │ Clickjacking │ Transparent <iframe>   │ X-Frame-Options, CSP        │
 * │ MITM         │ Intercepting network   │ HTTPS (TLS), HSTS           │
 * └──────────────┴────────────────────────┴─────────────────────────────┘
 */


// ========================================================================
// 1. XSS (Cross-Site Scripting)
// ========================================================================

/**
 * THE ATTACK:
 * Attacker injects malicious JavaScript into the webpage, which executes
 * in the victim's browser. The script can steal localStorage tokens, cookies,
 * or perform actions on behalf of the user.
 *
 * Types of XSS:
 * 1. Stored XSS: Malicious script is saved in DB (e.g., in a comment). Everyone who views it gets attacked.
 * 2. Reflected XSS: Malicious script is embedded in URL (`?q=<script>...`) and reflected by server.
 * 3. DOM-based XSS: Vulnerability is purely client-side (e.g., using `innerHTML` with URL params).
 *
 * DEFENSES:
 * 1. React auto-escapes string variables: `<div>{userInput}</div>` is safe.
 *    (But NEVER use `dangerouslySetInnerHTML` with unsanitized user input!)
 *
 * 2. Content Security Policy (CSP):
 *    A HTTP header that restricts WHERE scripts can be loaded from.
 *    `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com`
 *    (Disallows inline `<script>` tags entirely).
 *
 * 3. HttpOnly Cookies:
 *    If storing auth tokens in cookies, set `HttpOnly` flag.
 *    This prevents `document.cookie` from accessing the token via JavaScript,
 *    killing the attacker's ability to steal it via XSS.
 */


// ========================================================================
// 2. CSRF (Cross-Site Request Forgery)
// ========================================================================

/**
 * THE ATTACK:
 * You are logged into Bank.com (session cookie exists).
 * You visit Evil.com. Evil.com contains a hidden form that POSTs to `Bank.com/transfer?amt=1000`.
 * Because the browser automatically attaches the Bank.com cookies to the request,
 * the Bank thinks YOU made the transfer.
 *
 * DEFENSES:
 * 1. SameSite Cookie Attribute (Modern default):
 *    `Set-Cookie: session=xyz; SameSite=Lax`
 *    Browser refuses to send the cookie if the request originates from a different domain (Evil.com).
 *    (Strict = never send cross-site, Lax = send only on top-level navigations, None = send always).
 *
 * 2. Anti-CSRF Tokens (Synchronizer Token Pattern):
 *    - Server generates a unique, random token on page load.
 *    - Server expects this exact token in a hidden form field or Custom HTTP Header
 *      on the POST request.
 *    - Evil.com cannot read the token due to Same-Origin Policy (SOP), so its forged
 *      POST request fails validation on the server.
 */


// ========================================================================
// 3. CLICKJACKING & IFRAMES
// ========================================================================

/**
 * THE ATTACK:
 * Evil.com embeds Bank.com in an invisible (opacity: 0) `<iframe>`.
 * Evil.com puts a button saying "Win an iPhone!" directly over the invisible "Transfer Funds" button of the iframe.
 * User clicks "Win iPhone" but actually clicks "Transfer Funds".
 *
 * DEFENSES:
 * 1. X-Frame-Options Header:
 *    `X-Frame-Options: DENY` (Nobody can embed me)
 *    `X-Frame-Options: SAMEORIGIN` (Only my own domain can embed me)
 *
 * 2. CSP frame-ancestors:
 *    `Content-Security-Policy: frame-ancestors 'none';` (Modern equivalent)
 */


// ========================================================================
// 4. CORS (Cross-Origin Resource Sharing)
// ========================================================================

/**
 * THE CONCEPT:
 * - Browsers enforce the Same-Origin Policy (SOP): A script on Domain A cannot read data from Domain B.
 * - CORS is a mechanism that allows the SERVER to explicitly relax SOP.
 * - Note: CORS protects the *browser client*, not the server (Postman/cURL ignore CORS).
 *
 * HOW IT WORKS (Preflight Request):
 * For non-simple requests (like POST with JSON, or custom headers), the browser
 * automatically sends an HTTP `OPTIONS` request first.
 *
 * Browser: OPTIONS /api/data
 *          Origin: https://frontend.com
 *
 * Server:  200 OK
 *          Access-Control-Allow-Origin: https://frontend.com
 *          Access-Control-Allow-Methods: GET, POST, OPTIONS
 *
 * Browser: Great, server allows it. Now I will send the actual POST request.
 *
 * COMMON FIXES TO CORS ERRORS:
 * - Backend must configure `Access-Control-Allow-Origin`.
 * - For dev: Use a proxy in Webpack/Vite.
 */

console.log('✅ Security (XSS, CSRF, CORS) module parsed successfully.');
