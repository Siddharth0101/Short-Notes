'use strict';

/**
 * ========================================================================
 * 08. ERROR HANDLING, RESILIENCE & MONITORING [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design) + Production Best Practices
 *
 * WHY ERROR HANDLING IS A SYSTEM DESIGN TOPIC:
 * - In interviews, mentioning error handling shows PRODUCTION MATURITY.
 * - A beautiful app that crashes silently on API failure = TERRIBLE UX.
 * - Senior engineers design for the UNHAPPY PATH, not just the happy path.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                ERROR HANDLING LAYERS IN FRONTEND                    │
 * │                                                                     │
 * │  Layer 1: Component Level  → Error Boundaries (React)              │
 * │  Layer 2: Network Level    → Retry Logic, Timeout, AbortController │
 * │  Layer 3: Global Level     → window.onerror, unhandledrejection    │
 * │  Layer 4: Monitoring Level → Sentry, LogRocket, Datadog RUM        │
 * │  Layer 5: UX Level         → Fallback UI, Empty States, Toasts     │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. REACT ERROR BOUNDARIES (Class Components ONLY!)
// ========================================================================

/**
 * WHAT IS AN ERROR BOUNDARY?
 * - A special React component that CATCHES JavaScript errors in its child
 *   component tree during rendering, lifecycle methods, and constructors.
 * - Prevents the ENTIRE app from crashing — shows a fallback UI instead.
 * - ⚠️ STILL requires class components in 2026! No hook equivalent exists.
 *
 * WHAT ERROR BOUNDARIES CATCH:
 * ✅ Errors during rendering (return statement)
 * ✅ Errors in lifecycle methods
 * ✅ Errors in constructors of child components
 *
 * WHAT ERROR BOUNDARIES DO NOT CATCH:
 * ❌ Event handlers (use try-catch inside onClick, etc.)
 * ❌ Asynchronous code (setTimeout, fetch .catch, Promises)
 * ❌ Server-side rendering errors
 * ❌ Errors thrown in the Error Boundary itself
 *
 * ```jsx
 * class ErrorBoundary extends React.Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = { hasError: false, error: null };
 *   }
 *
 *   // Called during RENDER phase — update state to show fallback UI
 *   static getDerivedStateFromError(error) {
 *     return { hasError: true, error };
 *   }
 *
 *   // Called during COMMIT phase — log error to monitoring service
 *   componentDidCatch(error, errorInfo) {
 *     console.error('[ErrorBoundary] Caught:', error);
 *     console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
 *
 *     // Send to Sentry / LogRocket / Datadog
 *     logErrorToService(error, errorInfo);
 *   }
 *
 *   render() {
 *     if (this.state.hasError) {
 *       return (
 *         <div className="error-fallback">
 *           <h2>Something went wrong</h2>
 *           <p>{this.state.error?.message}</p>
 *           <button onClick={() => this.setState({ hasError: false })}>
 *             Try Again
 *           </button>
 *         </div>
 *       );
 *     }
 *     return this.props.children;
 *   }
 * }
 *
 * // USAGE — Wrap around risky component subtrees:
 * <ErrorBoundary>
 *   <ProductList />             // If this crashes, fallback shows
 * </ErrorBoundary>
 *
 * <ErrorBoundary>
 *   <PaymentForm />             // Separate boundary — isolated failure
 * </ErrorBoundary>
 * ```
 *
 * BEST PRACTICE: Use MULTIPLE error boundaries around logical sections,
 * not just one at the root. If the sidebar crashes, the main content should still work!
 */


// ========================================================================
// 2. RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ========================================================================

/**
 * WHEN NETWORK REQUESTS FAIL:
 * - Don't just show "Error" and give up!
 * - Retry the request with increasing delays (exponential backoff).
 * - Add jitter (random variation) to prevent thundering herd problem
 *   (all clients retrying at the exact same moment after an outage).
 *
 * FORMULA:
 * delay = min(baseDelay * 2^attempt + randomJitter, maxDelay)
 *
 * Example delays:
 * Attempt 1: 1000ms + jitter
 * Attempt 2: 2000ms + jitter
 * Attempt 3: 4000ms + jitter
 * Attempt 4: 8000ms + jitter (capped at maxDelay)
 */

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


// ========================================================================
// 3. CIRCUIT BREAKER PATTERN FOR FRONTEND
// ========================================================================

/**
 * INSPIRED BY ELECTRICAL CIRCUIT BREAKERS:
 * - If an API fails repeatedly, STOP making requests for a cooldown period.
 * - Prevents hammering a down server (which slows recovery).
 * - After cooldown, send ONE test request (half-open state).
 * - If test succeeds, resume normal operation. If fails, re-open circuit.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │              CIRCUIT BREAKER STATE MACHINE                          │
 * │                                                                     │
 * │   ┌────────┐     failure threshold    ┌────────┐                   │
 * │   │ CLOSED │ ──────────────────────► │  OPEN  │                    │
 * │   │(Normal)│                          │(Block) │                    │
 * │   └────┬───┘                          └───┬────┘                    │
 * │        ▲                                  │ cooldown timer          │
 * │        │ test request succeeds            ▼                         │
 * │        │                          ┌──────────────┐                  │
 * │        └───────────────────────── │  HALF-OPEN   │                  │
 * │                                   │ (Test 1 req) │                  │
 * │          test request fails ──►   └──────────────┘                  │
 * │          re-open circuit                                            │
 * └─────────────────────────────────────────────────────────────────────┘
 */

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


// ========================================================================
// 4. GRACEFUL DEGRADATION & FALLBACK UI STRATEGIES
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                   FALLBACK UI STRATEGY TABLE                                │
 * ├─────────────────────┬───────────────────────────────────────────────────────┤
 * │ Scenario            │ Fallback Strategy                                     │
 * ├─────────────────────┼───────────────────────────────────────────────────────┤
 * │ API Loading         │ Skeleton/Shimmer UI (matches content shape)           │
 * │ API Error (temp)    │ Retry button + error message + cached data if avail   │
 * │ API Error (persist) │ "Service unavailable" page + support link             │
 * │ Empty Data          │ Empty state illustration + CTA ("Add your first...")  │
 * │ Component Crash     │ Error Boundary fallback + "Try Again" button          │
 * │ Network Offline     │ Offline banner + serve cached content from SW         │
 * │ Slow Network        │ Progressive loading (text first, images lazy)          │
 * │ Feature Not Support │ Feature detection + polyfill or alternative UI         │
 * └─────────────────────┴───────────────────────────────────────────────────────┘
 *
 * IMPLEMENTATION EXAMPLE:
 * ```jsx
 * function ProductList() {
 *   const { data, loading, error } = useFetch('/api/products');
 *
 *   if (loading) return <ProductListSkeleton />;       // Shimmer UI
 *   if (error)   return <ErrorState onRetry={refetch} message={error.message} />;
 *   if (data.length === 0) return <EmptyState icon="📦" title="No products yet" />;
 *
 *   return data.map(p => <ProductCard key={p.id} product={p} />);
 * }
 * ```
 */


// ========================================================================
// 5. GLOBAL ERROR HANDLERS
// ========================================================================

/**
 * CATCH UNHANDLED ERRORS AT THE TOP LEVEL:
 *
 * ```javascript
 * // 1. Synchronous JS errors (uncaught throw, reference errors)
 * window.onerror = function (message, source, lineno, colno, error) {
 *   sendToMonitoring({
 *     type: 'js-error',
 *     message,
 *     source,
 *     lineno,
 *     colno,
 *     stack: error?.stack,
 *   });
 *   return true; // Prevents default browser error logging
 * };
 *
 * // 2. Unhandled Promise rejections
 * window.addEventListener('unhandledrejection', (event) => {
 *   sendToMonitoring({
 *     type: 'unhandled-promise',
 *     reason: event.reason?.message || event.reason,
 *     stack: event.reason?.stack,
 *   });
 * });
 *
 * // 3. Resource loading failures (images, scripts, stylesheets)
 * window.addEventListener('error', (event) => {
 *   if (event.target !== window) {
 *     sendToMonitoring({
 *       type: 'resource-error',
 *       tagName: event.target.tagName,
 *       src: event.target.src || event.target.href,
 *     });
 *   }
 * }, true); // Capture phase to catch resource errors!
 * ```
 */


// ========================================================================
// 6. LOGGING & MONITORING INTEGRATION
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                   MONITORING TOOLS COMPARISON TABLE                         │
 * ├──────────────────┬──────────────────────────────────────────────────────────┤
 * │ Tool             │ Strength                                                 │
 * ├──────────────────┼──────────────────────────────────────────────────────────┤
 * │ Sentry           │ Error tracking, stack traces, release tracking, breadcrumbs│
 * │ LogRocket        │ Session replay (watch exactly what user saw/did)          │
 * │ Datadog RUM      │ Real User Monitoring, Core Web Vitals, APM integration   │
 * │ New Relic        │ Full-stack observability, distributed tracing             │
 * │ Google Analytics │ User behavior, page views, events, conversions           │
 * │ Web Vitals (lib) │ Lightweight CWV reporting (LCP, INP, CLS)                │
 * └──────────────────┴──────────────────────────────────────────────────────────┘
 *
 * SENTRY SETUP EXAMPLE:
 * ```javascript
 * import * as Sentry from '@sentry/react';
 *
 * Sentry.init({
 *   dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
 *   environment: 'production',
 *   release: 'my-app@1.2.3',
 *   integrations: [
 *     Sentry.browserTracingIntegration(),
 *     Sentry.replayIntegration(),      // Session replay
 *   ],
 *   tracesSampleRate: 0.1,             // 10% of transactions
 *   replaysSessionSampleRate: 0.01,    // 1% of sessions
 * });
 *
 * // Sentry Error Boundary (auto-reports to Sentry dashboard)
 * <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
 *   <App />
 * </Sentry.ErrorBoundary>
 * ```
 *
 * WEB VITALS REPORTING:
 * ```javascript
 * import { onLCP, onINP, onCLS } from 'web-vitals';
 *
 * function sendToAnalytics({ name, value, id }) {
 *   navigator.sendBeacon('/api/vitals', JSON.stringify({ name, value, id }));
 * }
 *
 * onLCP(sendToAnalytics);
 * onINP(sendToAnalytics);
 * onCLS(sendToAnalytics);
 * ```
 */


// ========================================================================
// 7. HTTP ERROR STATUS CODES REFERENCE
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                   HTTP ERROR CODES — FRONTEND REFERENCE                     │
 * ├─────────┬──────────────────────┬────────────────────────────────────────────┤
 * │ Code    │ Name                 │ Frontend Action                            │
 * ├─────────┼──────────────────────┼────────────────────────────────────────────┤
 * │ 400     │ Bad Request          │ Show form validation errors                │
 * │ 401     │ Unauthorized         │ Redirect to login page                     │
 * │ 403     │ Forbidden            │ Show "Access Denied" message               │
 * │ 404     │ Not Found            │ Show 404 page or "Resource not found"      │
 * │ 408     │ Request Timeout      │ Show timeout error + retry button          │
 * │ 409     │ Conflict             │ Show conflict resolution UI                │
 * │ 422     │ Unprocessable Entity │ Show field-level validation errors         │
 * │ 429     │ Too Many Requests    │ Show rate limit message + retry-after      │
 * │ 500     │ Internal Server Error│ Generic error page + retry + report        │
 * │ 502     │ Bad Gateway          │ "Servers are busy" + auto-retry            │
 * │ 503     │ Service Unavailable  │ "Under maintenance" page + ETA if known    │
 * │ 504     │ Gateway Timeout      │ "Slow response" + retry button             │
 * └─────────┴──────────────────────┴────────────────────────────────────────────┘
 */


// ========================================================================
// SIMULATION: Error Handling Patterns
// ========================================================================

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
