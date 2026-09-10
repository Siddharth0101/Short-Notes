'use strict';

/**
 * ========================================================================
 * 02. API PARADIGMS: REST VS GRAPHQL VS GRPC [⚡ FULLSTACK SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Distributed Systems & Chirag Goel Case Studies
 *
 * PARADIGMS BREAKDOWN:
 * ┌──────────────┬──────────────────┬─────────────────┬─────────────────┐
 * │ Feature      │ REST             │ GraphQL         │ gRPC            │
 * ├──────────────┼──────────────────┼─────────────────┼─────────────────┤
 * │ Data Format  │ JSON / XML       │ JSON            │ Protocol Buffer │
 * │ Network Base │ HTTP/1.1 or 2    │ HTTP (POST)     │ HTTP/2 only     │
 * │ Fetch Model  │ Multiple URIs    │ Single Endpoint │ Remote Function │
 * │ Over-fetching│ Common           │ Zero (precise)  │ Minimal binary  │
 * │ Caching      │ Easy (HTTP GET)  │ Complex (POST)  │ Complex         │
 * │ Streaming    │ Polling / SSE    │ Subscriptions   │ Bidirectional   │
 * └──────────────┴──────────────────┴─────────────────┴─────────────────┘
 */

/**
 * ========================================================================
 * 1. THE GRAPHQL N+1 PROBLEM & DATALOADER SOLUTION
 * ========================================================================
 * SCENARIO:
 * - Query fetches 100 Posts and each post's Author.
 * - Naive execution:
 *   - 1 query for 100 posts: `SELECT * FROM posts LIMIT 100`
 *   - 100 separate queries for each author: `SELECT * FROM users WHERE id = ...`
 *   - Total = 1 + 100 = 101 database roundtrips! (Kills the database).
 *
 * FIX: DataLoader (Batching & In-Memory Memoization)
 * - DataLoader waits for the current tick of the event loop.
 * - Batches all 100 user IDs into a SINGLE query:
 *   `SELECT * FROM users WHERE id IN (1, 2, 3, ... 100);`
 */

// Simulated DataLoader batching in single event loop tick
class SimpleDataLoader {
  constructor(batchLoadingFunction) {
    this.batchLoadFn = batchLoadingFunction;
    this.queue = [];
    this.scheduled = false;
  }

  load(key) {
    return new Promise((resolve) => {
      this.queue.push({ key, resolve });

      if (!this.scheduled) {
        this.scheduled = true;
        // Batch queue in microtask tick
        Promise.resolve().then(() => {
          const keys = this.queue.map((item) => item.key);
          const currentQueue = [...this.queue];
          this.queue = [];
          this.scheduled = false;

          console.log(`[DataLoader Batch Query] Batched ${keys.length} keys in 1 call:`, keys);
          const results = this.batchLoadFn(keys);
          currentQueue.forEach((item, index) => {
            item.resolve(results[index]);
          });
        });
      }
    });
  }
}

const userLoader = new SimpleDataLoader((keys) => {
  // Simulates single batched SQL query
  return keys.map((id) => ({ id, name: `User_${id}` }));
});

console.log('--- DataLoader N+1 Prevention Simulation ---');
userLoader.load(1).then((u) => console.log('Resolved user 1:', u));
userLoader.load(2).then((u) => console.log('Resolved user 2:', u));
userLoader.load(3).then((u) => console.log('Resolved user 3:', u));
