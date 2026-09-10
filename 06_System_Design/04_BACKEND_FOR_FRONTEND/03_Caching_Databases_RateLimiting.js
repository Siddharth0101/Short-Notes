'use strict';

/**
 * ========================================================================
 * 03. CACHING STRATEGIES, RATE LIMITING & DATABASES [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Fullstack System Design & High Scale Architectures
 *
 * THE 5 LAYERS OF CACHING:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  1. Browser HTTP Cache (Cache-Control, ETag, Service Worker)        │
 * │  2. CDN Edge Cache (Cloudflare, Akamai - 50-100ms closer to user)   │
 * │  3. Reverse Proxy Cache (Nginx, Varnish)                            │
 * │  4. Distributed In-Memory Cache (Redis, Memcached - < 2ms latency)  │
 * │  5. Database Buffer Pool & Query Cache                              │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. CACHE STRATEGIES: CACHE-ASIDE VS WRITE-THROUGH
 * ========================================================================
 *
 * 1. CACHE-ASIDE (LAZY LOADING) — Most Common:
 *    - App looks in Redis cache first.
 *    - If Cache Hit: return data.
 *    - If Cache Miss: read from SQL database, write into Redis with TTL, return data.
 *
 * 2. WRITE-THROUGH:
 *    - App writes to Redis AND Database simultaneously.
 *    - High data consistency, but slightly slower writes.
 *
 * 3. WRITE-BEHIND (WRITE-BACK):
 *    - App writes to Redis immediately; Redis asynchronously flushes writes to DB in batches.
 *    - Ultra fast writes; risk of data loss if Redis crashes before flush.
 */

/**
 * ========================================================================
 * 2. RATE LIMITING: THE TOKEN BUCKET ALGORITHM
 * ========================================================================
 * - Used by Stripe, GitHub, and Amazon AWS to protect APIs from DDoS attacks.
 * - Rules:
 *   - Bucket has capacity of N tokens (e.g. 5 tokens).
 *   - Refills at fixed rate (e.g. 1 token per second).
 *   - Each incoming request costs 1 token.
 *   - If tokens > 0: request allowed, decrement token.
 *   - If tokens == 0: reject request with HTTP 429 Too Many Requests!
 */

// Production Token Bucket Rate Limiter simulation
class TokenBucketRateLimiter {
  constructor(capacity, refillRatePerSecond) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRatePerSecond;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return { allowed: true, remainingTokens: Math.floor(this.tokens) };
    }
    return { allowed: false, remainingTokens: Math.floor(this.tokens), retryAfterMs: 1000 };
  }
}

const limiter = new TokenBucketRateLimiter(3, 1);

console.log('--- Token Bucket Rate Limiter Simulation ---');
console.log('Request 1:', limiter.tryConsume());
console.log('Request 2:', limiter.tryConsume());
console.log('Request 3:', limiter.tryConsume());
console.log('Request 4 (Burst exhausted):', limiter.tryConsume()); // Rejected!
