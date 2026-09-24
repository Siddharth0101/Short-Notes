/**
 * ## Quick revision
 *
 * - Vertical scaling — ek machine bigger; horizontal — more instances.
 * - Load balancer — traffic distribute; health aur overload behavior define karo.
 * - Stateless service — request state shared store/client contract mein; replicas simpler.
 * - Cache-aside — miss par DB read aur cache fill.
 * - TTL — staleness window; exact consistency guarantee nahi.
 * - Invalidation — writes par cache update/delete; races handle karo.
 * - Stampede — same miss par duplicate work; coalescing, jitter ya refresh control.
 * - Replication — copies for reads/availability; lag ho sakta hai.
 * - Partitioning — data split; key skew aur hot partitions socho.
 * - Strong consistency — defined operation model ke hisaab se latest ordered state.
 * - Eventual consistency — writes rukne par replicas converge; immediate freshness nahi.
 * - Read-your-writes — apne write ke baad old value na dikhe; routing/version strategy chahiye.
 * - Replica lag — stale reads possible; critical reads primary/appropriate consistency se.
 * - CAP — network partition ke waqt consistency/availability tradeoff; normal-time universal toggle nahi.
 * - Token bucket — refillable tokens; rate + burst capacity control.
 * - Distributed limiter — shared atomic decision ya explicit approximate limit.
 * - Fail-open/closed — limiter outage par availability/security tradeoff decide.
 * - Hot key — ek popular key/shard bottleneck; replication, splitting ya coalescing consider.
 * - Negative cache — not-found result briefly cache; creation ke baad staleness rule chahiye.
 * - Consistent hashing — membership change par limited keys remap; balancing replicas/virtual nodes se improve.
 */

'use strict';


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
