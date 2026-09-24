/**
 * ## Quick revision
 *
 * - REST — resources + HTTP semantics; caching/status/conditional requests useful.
 * - GraphQL — client-selected shape; resolver batching aur query cost limits chahiye.
 * - N+1 — per-item resolver calls; request-scoped batching/cache use karo.
 * - GraphQL auth — each resource/field boundary par policy; endpoint access alone enough nahi.
 * - gRPC — typed protobuf contracts; internal RPC/streaming ke liye useful.
 * - Contract evolution — backward-compatible fields/status/schema changes.
 * - Deadline — client budget downstream propagate; cancellation cooperative hai.
 * - Idempotency — write retries ka duplicate-effect contract har protocol mein chahiye.
 * - API version — additive field bhi strict clients ko affect kar sakta hai; compatibility test karo.
 * - Retry signal — overload par appropriate status + retry timing; client retry budget respect kare.
 * - Pagination token — opaque cursor validate/sign as needed; user-supplied cursor authorization bypass na kare.
 */

'use strict';


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
