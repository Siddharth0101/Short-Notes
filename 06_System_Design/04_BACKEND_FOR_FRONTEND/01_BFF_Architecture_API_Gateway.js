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
 * - BFF — frontend-specific aggregation/shape; gateway routing/auth/rate limits share kar sakta hai.
 * - Fan-out — independent calls bounded parallel; partial failure contract.
 * - Token translation — browser credentials ko internal identity se safely map.
 * - Caching — user/tenant scope + freshness; private payload mix mat karo.
 * - ETag/If-Match — resource version match ho tab update; lost-update conflict surface karo.
 * - Bulk endpoint — bounded batch size; partial success/error response contract clear.
 * - Read model — optimized query view; source write model se freshness/lag explicitly define.
 */

'use strict';


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
