/**
 * ## Quick revision
 *
 * - Layers — controller contract, service rules, repository persistence.
 * - Transaction — business invariant ko atomic database boundary mein rakho.
 * - Constraint — uniqueness/foreign-key/check se invalid state database par roko.
 * - Idempotency key — same operation retry ka same durable result.
 * - Pagination — stable order + bounded size; large feeds mein cursor useful.
 * - Pool — DB connections scarce resource; wait time aur saturation monitor karo.
 * - Outbox — business write aur event row same transaction mein.
 * - Migration — compatible rollout; old/new versions coexist kar sakein.
 * - ETag/If-Match — resource version match ho tab update; lost-update conflict surface karo.
 * - Bulk endpoint — bounded batch size; partial success/error response contract clear.
 * - Read model — optimized query view; source write model se freshness/lag explicitly define.
 */

'use strict';


function checkRateLimit(userId) {
    const now = Date.now();
    const windowMs = 60 * 1000;  // 1 minute window
    const maxRequests = 100;

    // In production, use Redis:
    // INCR rate:{userId}
    // EXPIRE rate:{userId} 60

    // Simplified in-memory version:
    // if (!rateLimiter.has(userId)) { rateLimiter.set(userId, { count: 1, start: now }); return true; }
    // const entry = rateLimiter.get(userId);
    // if (now - entry.start > windowMs) { reset; return true; }
    // if (entry.count >= maxRequests) { return false; } // 429!
    // entry.count++; return true;
}
