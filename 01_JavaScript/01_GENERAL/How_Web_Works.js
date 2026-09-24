/**
 * ## Quick revision
 *
 * - Process — isolated address space; thread — process ke resources share karta hai.
 * - Context switch — execution change ka overhead; zyada threads always faster nahi.
 * - Memory — heap, native buffers aur file descriptors sab limits rakhte hain.
 * - DNS — hostname resolve; TCP — connection; TLS — encrypted authenticated channel.
 * - HTTP latency — DNS/connect/TLS/server/transfer phases alag measure karo.
 * - Pool wait — slow request ka reason CPU nahi, resource queue bhi ho sakti hai.
 * - Timeout — write hua ya nahi unclear ho sakta hai; retry idempotent banao.
 * - Debug — symptoms → layer → evidence → smallest experiment.
 * - Client/server — browser request bhejta hai, server response deta hai.
 * - URL — scheme, host, port, path, query aur fragment; fragment HTTP request mein nahi jaata.
 * - DNS — domain ko address se resolve karo; caching se repeat lookup bach sakta hai.
 * - HTTPS — HTTP over TLS; traffic encrypt aur server identity verify hoti hai.
 * - HTTP methods — GET read, POST process/create, PUT replace, PATCH partial update, DELETE remove.
 * - Status — 2xx success, 3xx redirect, 4xx request issue, 5xx server issue.
 * - Headers/body — metadata headers mein; content body mein.
 * - Cookie — browser matching requests ke saath bhejta hai; session server-side state se link ho sakti hai.
 * - CORS — browser cross-origin reads control karta hai; server authorization phir bhi chahiye.
 * - Cache — browser/CDN/server par reuse; freshness aur invalidation ka rule chahiye.
 * - Page load — DNS → connection/TLS → HTTP → HTML/CSS/JS → layout/paint.
 * - HTTP validators — ETag/Last-Modified se unchanged resource revalidate kar sakte ho.
 * - Connection reuse — repeated handshakes ka cost bachao; idle/connection limits define karo.
 * - URL fragment — browser-side identifier; HTTP request target mein fragment nahi bheja jaata.
 */

'use strict';


// HTTP REQUEST EXAMPLE (Visual):
// ┌─────────────────────────────────────────────┐
// │ POST /api/users HTTP/1.1                    │  ← Request Line
// │                                             │
// │ Host: api.example.com                       │  ← Headers
// │ Content-Type: application/json              │
// │ Authorization: Bearer my-token-here         │
// │                                             │
// │ {                                           │  ← Body
// │   "name": "Siddharth",                      │
// │   "email": "sidd@gmail.com"                 │
// │ }                                           │
// └─────────────────────────────────────────────┘


// HTTP RESPONSE EXAMPLE (Visual):
// ┌─────────────────────────────────────────────┐
// │ HTTP/1.1 200 OK                             │  ← Status Line
// │                                             │
// │ Content-Type: application/json              │  ← Headers
// │ Cache-Control: no-cache                     │
// │                                             │
// │ {                                           │  ← Body
// │   "status": "success",                      │
// │   "data": {                                 │
// │     "id": 1,                                │
// │     "name": "Siddharth"                     │
// │   }                                         │
// │ }                                           │
// └─────────────────────────────────────────────┘
