'use strict';

/**
 * ========================================================================
 * 02. API PARADIGMS: REST VS GRAPHQL VS GRPC [⚡ FULLSTACK SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Distributed Systems & Chirag Goel Case Studies
 *
 * COMPARISON KO WORKLOAD KE SAATH PADHO:
 * - REST HTTP resource contracts use karta hai; representation JSON-only nahi.
 * - GraphQL client fields select karta hai, lekin expensive resolvers/N+1 ab bhi possible hain.
 * - GraphQL queries HTTP GET ya POST se serve ho sakti hain; cache strategy explicit chahiye.
 * - gRPC commonly HTTP/2 + Protocol Buffers use karta hai; browser gRPC-Web path alag evaluate karo.
 * - Binary payload se total latency guaranteed kam nahi; backend work measure karo.
 * - Structured course: notes/system-design/14-api-contracts.md
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
// Teaching helper: batching only; no memoization, per-key errors, or cancellation.
// batchLoadFn sync/async ho sakta hai; result keys ke order aur length mein ho.
class SimpleDataLoader {
  constructor(batchLoadingFunction) {
    this.batchLoadFn = batchLoadingFunction;
    this.queue = [];
    this.scheduled = false;
  }

  load(key) {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      if (this.scheduled) return;
      this.scheduled = true;
      Promise.resolve().then(async () => {
        const batch = this.queue;
        this.queue = [];
        this.scheduled = false;
        try {
          const results = await this.batchLoadFn(batch.map(item => item.key));
          if (!Array.isArray(results) || results.length !== batch.length) {
            throw new Error('Batch result must match input key count');
          }
          batch.forEach((item, index) => item.resolve(results[index]));
        } catch (error) {
          batch.forEach(item => item.reject(error));
        }
      });
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
