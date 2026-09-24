/**
 * ## Quick revision
 *
 * - Requirements — users, core actions, scale aur constraints pehle clear karo.
 * - Functional — system kya kare; non-functional — latency, availability, durability jaise targets.
 * - QPS — requests per second; average ke saath peak factor bhi estimate karo.
 * - Concurrency — steady state mein roughly throughput × average latency.
 * - Storage — records × size × retention; indexes/replicas ka overhead jodo.
 * - SLO — measurable user-visible target; assumptions numbers ke saath bolo.
 * - Tradeoff — choice ka benefit, cost aur failure behavior explain karo.
 * - RADIO — Requirements → Architecture → Data model → Interface → Optimizations.
 * - Normalize — entity ID se records store; duplicate copies ka drift kam.
 * - Interface — API aur component input/output/events ka contract.
 * - Optimization — measured bottleneck, failure aur accessibility cases cover.
 * - Critical path — user action se useful response tak dependent steps identify.
 * - Failure domain — ek region/service/cache fail ho toh kaunsa feature unavailable hoga.
 * - Decision trigger — scale/freshness requirement badle toh architecture kab revisit karna hai, define.
 */

'use strict';


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
