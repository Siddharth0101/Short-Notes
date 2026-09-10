'use strict';

/**
 * ========================================================================
 * 01. BACKEND FOR FRONTEND (BFF) & API GATEWAYS [⚡ FULLSTACK SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel & Distributed Systems Core
 *
 * THE ANTI-PATTERN: DIRECT CLIENT-TO-MICROSERVICES
 * - Web/Mobile client makes 8 separate HTTP calls to User Service, Cart Service,
 *   Catalog Service, Recommendations, Reviews, Inventory, Shipping, and Ads.
 * - Result: 8 round-trips over cellular network, high battery drain, massive latency.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   BFF (BACKEND FOR FRONTEND) PATTERN                │
 * │                                                                     │
 * │   [Web Client]     [Mobile Client]                                  │
 * │        │                 │                                          │
 * │        ▼                 ▼                                          │
 * │   ┌──────────┐      ┌──────────┐                                    │
 * │   │ Web BFF  │      │Mobile BFF│  ◄── Shapes payload tailored to UI │
 * │   └────┬─────┘      └────┬─────┘                                    │
 * │        └───────┬─────────┘                                          │
 * │                ▼                                                    │
 * │   ┌─────────────────────────────┐                                   │
 * │   │    Internal API Gateway     │                                   │
 * │   └────────────┬────────────────┘                                   │
 * │        ┌───────┼───────┐                                            │
 * │        ▼       ▼       ▼                                            │
 * │     [User]  [Order] [Catalog] (Microservices via gRPC / Internal)   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. RESPONSIBILITIES OF A BFF LAYER
 * ========================================================================
 * 1. Data Aggregation: Calls multiple backend microservices concurrently and joins data.
 * 2. Overfetching Reduction: Filters out sensitive internal fields (hashed passwords, internal audit logs).
 * 3. Protocol Translation: Talks gRPC / Protobuf internally with services, returns JSON to browser.
 * 4. Tailored Responses: Desktop gets rich multi-column widgets; Mobile gets compact streamlined payloads.
 * 5. Token Orchestration: Translates browser session cookies to internal JWT / OAuth tokens.
 */

// Simulated BFF Aggregator Function
async function webBffDashboardHandler(userId) {
  console.log(`[BFF] Aggregating microservice calls for User #${userId}...`);

  // Simulating concurrent internal microservice fetch via Promise.all
  const [userProfile, orders, recommendations] = await Promise.all([
    Promise.resolve({ id: userId, name: 'Sidd', tier: 'Gold' }),
    Promise.resolve([{ orderId: 881, total: 420 }, { orderId: 882, total: 150 }]),
    Promise.resolve(['MacBook Pro M3', 'AirPods Pro'])
  ]);

  // Transform and shape specifically for React Dashboard UI
  return {
    user: { name: userProfile.name, isVip: userProfile.tier === 'Gold' },
    activeOrderCount: orders.length,
    recentPurchasesTotal: orders.reduce((sum, o) => sum + o.total, 0),
    topPicks: recommendations
  };
}

async function runBffTest() {
  console.log('--- BFF Service Aggregator Output ---');
  const payload = await webBffDashboardHandler(101);
  console.log('Clean payload sent to React frontend:', payload);
}

runBffTest();
