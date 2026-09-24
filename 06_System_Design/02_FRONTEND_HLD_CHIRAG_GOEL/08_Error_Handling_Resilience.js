/**
 * ## Quick revision
 *
 * - LCP — main content kab dikha; INP — interaction responsiveness; CLS — layout shift.
 * - Measure — real-user percentiles + lab traces; average alone enough nahi.
 * - Budget — JS, images, network aur main-thread work ki limits.
 * - Images — right size/format, dimensions reserve, below-fold lazy loading.
 * - Long task — work split/yield; heavy CPU worker mein move kar sakte ho.
 * - Virtualization — visible list window; focus/keyboard behavior preserve.
 * - Resilience — slow/error state aur usable retry/fallback.
 * - Accessibility — keyboard, semantic roles, labels aur focus flow.
 * - Error boundary — render failures ka UI fallback; async handler errors alag catch.
 * - Retry — bounded backoff + jitter; non-idempotent write blindly repeat nahi.
 * - Circuit breaker — repeated dependency failure par short-circuit aur recovery probe.
 * - Bulkhead — ek failing feature baaki capacity exhaust na kare.
 * - Fallback — stale data/read-only/partial UI with clear status.
 * - Monitoring — error fingerprint + request context; private data redact.
 * - Latency waterfall — dependent requests sequential round trips add karte hain; safe batching/parallelism choose.
 * - Performance regression — release ke before/after same device/network cohort compare.
 * - Skeleton layout — final content ka approximate size reserve; fake spinner alone layout shift nahi rokta.
 */

'use strict';
// 1. REACT ERROR BOUNDARIES (Class Components ONLY!)
// 2. RETRY LOGIC WITH EXPONENTIAL BACKOFF


async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const baseDelay = 1000;
  const maxDelay = 10000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  [Fetch] Attempt ${attempt + 1}/${maxRetries + 1} — ${url}`);

      // Simulated fetch (replace with actual fetch in production)
      if (attempt < 2) throw new Error('Simulated 503 Service Unavailable');

      console.log(`  [Fetch] ✅ Success on attempt ${attempt + 1}`);
      return { data: { status: 'ok' }, attempt: attempt + 1 };
    } catch (error) {
      if (attempt === maxRetries) {
        console.log(`  [Fetch] ❌ All ${maxRetries + 1} attempts failed. Giving up.`);
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.floor(Math.random() * 500);
      const totalDelay = delay + jitter;

      console.log(`  [Fetch] ⚠️ Failed. Retrying in ${totalDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Simulated delay
    }
  }
}
// 3. CIRCUIT BREAKER PATTERN FOR FRONTEND


class CircuitBreaker {
  constructor({ failureThreshold = 3, cooldownMs = 10000 } = {}) {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.lastFailureTime = null;
  }

  async execute(requestFn) {
    if (this.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.cooldownMs) {
        console.log(`  [Circuit Breaker] OPEN — Blocking request. Cooldown: ${Math.ceil((this.cooldownMs - timeSinceLastFailure) / 1000)}s remaining`);
        throw new Error('Circuit breaker is OPEN. Request blocked.');
      }
      // Cooldown expired → transition to HALF-OPEN
      this.state = 'HALF-OPEN';
      console.log('  [Circuit Breaker] Transitioning to HALF-OPEN — testing one request...');
    }

    try {
      const result = await requestFn();

      // Success → reset circuit
      if (this.state === 'HALF-OPEN') {
        console.log('  [Circuit Breaker] Test request succeeded! Closing circuit.');
      }
      this.state = 'CLOSED';
      this.failureCount = 0;
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.state === 'HALF-OPEN' || this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        console.log(`  [Circuit Breaker] OPENING circuit after ${this.failureCount} failures.`);
      }

      throw error;
    }
  }
}
// 4. GRACEFUL DEGRADATION & FALLBACK UI STRATEGIES
// 5. GLOBAL ERROR HANDLERS
// 6. LOGGING & MONITORING INTEGRATION
// 7. HTTP ERROR STATUS CODES REFERENCE
// SIMULATION: Error Handling Patterns

console.log('--- Retry with Exponential Backoff Simulation ---');
fetchWithRetry('/api/products')
  .then((result) => console.log('  Final result:', result))
  .catch((err) => console.log('  Final error:', err.message));

console.log('\n--- Circuit Breaker Simulation ---');
const breaker = new CircuitBreaker({ failureThreshold: 2, cooldownMs: 5000 });

async function simulateCircuitBreaker() {
  const failingRequest = () => Promise.reject(new Error('Server down'));
  const successRequest = () => Promise.resolve({ data: 'ok' });

  // Attempt 1 — fails
  try { await breaker.execute(failingRequest); } catch (e) { /* expected */ }
  console.log(`  State after fail 1: ${breaker.state}`);

  // Attempt 2 — fails → circuit opens
  try { await breaker.execute(failingRequest); } catch (e) { /* expected */ }
  console.log(`  State after fail 2: ${breaker.state}`);

  // Attempt 3 — blocked by open circuit
  try { await breaker.execute(successRequest); } catch (e) {
    console.log(`  Blocked: ${e.message}`);
  }
  console.log(`  State: ${breaker.state}`);
}

simulateCircuitBreaker();

// Fallback UI state machine
console.log('\n--- UI State Machine (Loading → Success/Error/Empty) ---');
const UI_STATES = ['LOADING', 'SUCCESS', 'ERROR', 'EMPTY', 'OFFLINE'];
UI_STATES.forEach((state) => {
  const fallbacks = {
    LOADING: '🔄 Shimmer/Skeleton placeholder',
    SUCCESS: '✅ Render data normally',
    ERROR: '❌ Error message + Retry button + cached data',
    EMPTY: '📭 Empty state illustration + CTA button',
    OFFLINE: '📴 Offline banner + cached content from Service Worker',
  };
  console.log(`  ${state}: ${fallbacks[state]}`);
});
