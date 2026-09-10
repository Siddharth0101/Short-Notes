'use strict';

/**
 * ========================================================================
 * 01. FRONTEND SYSTEM DESIGN: THE R.A.D.I.O. FRAMEWORK [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Chakde System Design / Frontend System Design)
 *
 * WHAT IS FRONTEND SYSTEM DESIGN?
 * - Not just coding a button or form.
 * - Structuring a resilient, performant, accessible, scalable web architecture
 *   serving millions of users across varied network speeds and device capabilities.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │               THE 45-MINUTE INTERVIEW PACING STRATEGY               │
 * │                                                                     │
 * │  00 - 05 min : R - Requirements & Clarifications                   │
 * │  05 - 15 min : A - High-Level Architecture & Component Flow         │
 * │  15 - 25 min : D - Data Model & State Stores                        │
 * │  25 - 35 min : I - Interface & Network API Contracts                │
 * │  35 - 45 min : O - Optimizations, Edge Cases, Security & Deep Dive │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. R — REQUIREMENTS (FUNCTIONAL VS NON-FUNCTIONAL)
 * ========================================================================
 * ALWAYS ask clarifying questions before drawing any diagram!
 *
 * 1. Functional Requirements:
 *    - What core features does the user interact with?
 *    - Example (E-Commerce): Browse products, search & filter, cart, checkout, orders.
 *
 * 2. Non-Functional Requirements:
 *    - Performance: LCP < 2.5s, FID/INP < 200ms, CLS < 0.1.
 *    - Network constraints: Graceful degradation on 3G / Offline.
 *    - Device constraints: Mobile-first responsive web design.
 *    - Scale: 10M daily active users, burst traffic during sales.
 *    - Accessibility (a11y): WCAG 2.1 AA compliant, screen reader, keyboard navigation.
 *    - Security: XSS sanitization, CSRF tokens, strict CSP.
 *    - Internationalization (i18n): Multi-language, RTL layout (Arabic/Hebrew).
 */

/**
 * ========================================================================
 * 2. A — ARCHITECTURE (LAYERED FRONTEND ARCHITECTURE)
 * ========================================================================
 * Production frontend applications follow 4 distinct separation-of-concern layers:
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  1. PRESENTATION LAYER (UI Components, Design System, CSS)          │
 * │     - Pure components, accessible semantic HTML, layout wrappers.   │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  2. APPLICATION / STATE LAYER (Context, Redux Toolkit, Zustand)    │
 * │     - Global state, cache, business logic, selectors.               │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  3. NETWORK / SERVICE LAYER (API Client, Interceptors, WebSockets)  │
 * │     - Axios / Fetch wrapper, retry logic, auth token refresh.       │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  4. PERSISTENCE LAYER (LocalStorage, IndexedDB, Service Worker)    │
 * │     - Offline drafts, LRU cache, session persistence.               │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// Simulation of Layered Architecture Orchestrator
class FrontendArchitectureLayer {
  constructor() {
    this.cache = new Map();
  }

  // Network & Persistence Layer
  async fetchWithCache(url, ttlMs = 5000) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < ttlMs) {
      console.log(`[Storage Layer] Returning cached response for ${url}`);
      return cached.data;
    }

    console.log(`[Network Layer] Making fresh HTTP request to ${url}`);
    const simulatedData = { id: 1, title: 'MacBook Pro M3', price: 1999 };
    this.cache.set(url, { data: simulatedData, timestamp: Date.now() });
    return simulatedData;
  }
}

const appEngine = new FrontendArchitectureLayer();

async function runDemo() {
  console.log('--- Layered Architecture Flow ---');
  await appEngine.fetchWithCache('/api/product/1');
  await appEngine.fetchWithCache('/api/product/1'); // Hits cache
}

runDemo();

/**
 * ========================================================================
 * 3. D — DATA MODEL (NORMALIZATION PATTERN)
 * ========================================================================
 * NEVER store deeply nested API data directly in state!
 *
 * ❌ UNNORMALIZED STATE (Duplicate entries, update nightmares):
 *   { posts: [ { id: 1, author: { id: 9, name: 'Sidd' } }, { id: 2, author: { id: 9, name: 'Sidd' } } ] }
 *
 * ✅ NORMALIZED STATE (Relational, single source of truth):
 *   {
 *     entities: {
 *       users: { '9': { id: '9', name: 'Sidd' } },
 *       posts: { '1': { id: '1', authorId: '9' }, '2': { id: '2', authorId: '9' } }
 *     },
 *     ids: ['1', '2']
 *   }
 */
