/**
 * ## Quick revision
 *
 * - Node.js — JavaScript runtime; I/O async ho sakti hai, heavy JS event loop block karta hai.
 * - Event loop — callbacks schedule; worker pool aur OS kuch async work handle karte hain.
 * - HTTP — method, URL, headers aur body se request; status/headers/body se response.
 * - Module — ESM `import/export`; CommonJS `require/module.exports`.
 * - Stream — chunks mein data; poori file memory mein lena zaroori nahi.
 * - Backpressure — slow consumer ho toh producer ko slow/pause karo.
 * - Buffer — binary bytes; text decode karte waqt encoding sahi rakho.
 * - Environment — config validate karo; secrets client/logs mein leak mat karo.
 * - EventEmitter — listeners synchronous call ho sakte hain; emit ko automatic async mat samjho.
 * - Client disconnect — abandoned response ke database/stream work ko cancel/close karo.
 * - CPU saturation — event-loop delay measure; heavy computation ko bounded worker execution do.
 */

'use strict';
