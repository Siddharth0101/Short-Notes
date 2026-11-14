---
id: mongodb-testing-shutdown
title: Node API testing and graceful shutdown — from a request to resource cleanup
track: mongodb
order: 9
level: Intermediate
minutes: 3
summary: HTTP test — verify the actual status, headers and response body.
tags: node, testing, shutdown, integration, resources
---

## Quick revision

> Revision target — Close accepted requests and open resources within one shared shutdown deadline.

- HTTP test — verify the actual status, headers and response body.
- Database test — isolated data/namespace; parallel tests must not break shared state.
- Failure test — bad input, unauthorized, duplicate and a dependency failure.
- Shutdown — stop new requests, give in-flight requests a bounded wait.
- Cleanup — close the HTTP server, database, cursors and workers.
- Deadline — a budget for forced termination; do not hang endlessly.
- Readiness — take the instance out of traffic when shutdown starts.
- Open handles — when tests hang, inspect the cleanup of server/timer/socket/DB connections.
- Readiness drain — a budget for finishing active requests after the load balancer has propagated the change.
- Shutdown repeat — cleanup is idempotent on a repeated signal; no new background work starts.

### Edge cases and reasoning

- Shutdown deadline shared — the server/DB/worker cleanup share the same remaining budget; a full timeout per resource stretches the total shutdown unexpectedly.
- Hard-exit data risk — process.exit can cut off pending writes/log flushes; define a force-exit policy after a bounded graceful cleanup.
- Signal race — a repeated shutdown trigger shares the same completion task; do not close resources twice or turn readiness back to true.

## Understand it with an example

- Scenario — The shutdown budget is 10s; the HTTP drain takes 6s, and after that the DB/worker cleanup is still pending.
- Reasoning — A 4s budget remains for the rest of the cleanup. Reject/drain new work; observe the completion or cancellation of resources, and a repeated signal shares the same shutdown task.
- Catch — Giving every cleanup a fresh 10s exceeds the total deadline; a closed server listener is not proof that the background work has completed.

## Recall and practice

- Question — Does stopping the HTTP server automatically close the background queue and the database cursor?
- Answer — No; the owners of the accepted work/resources must drain/cancel/close them explicitly, within the total deadline.
- Try it yourself — In a shutdown test give a slow request, an open cursor, a stuck worker and a repeated signal; verify a bounded exit and that accepted writes were persisted.

## Practice questions

### Easy · Test an Express app without a port

<details>
<summary>Answer</summary>

```js
// app.js
export const app = express();
// server.js
app.listen(process.env.PORT ?? 3000);

// app.test.js
import request from 'supertest';
const res = await request(app).get('/health');
assert.equal(res.status, 200);
```

- Split — `app` (the routes) and `listen` in separate files; tests run in parallel without port conflicts.

</details>

### Medium · "Jest did not exit"

The tests pass but the process does not end.

<details>
<summary>Answer</summary>

- Open handles — the DB connection, server, intervals or Redis clients were not closed.
- Fix — `afterAll(async () => { await mongoose.disconnect(); await server.close(); })`; clear the timers.
- Debug — `--detectOpenHandles`; `--forceExit` hides the symptom, it is not a fix.

</details>

### Medium · Graceful shutdown

Kubernetes sends SIGTERM. What should the Node API do?

<details>
<summary>Answer</summary>

```js
process.once('SIGTERM', async () => {
  ready = false;                       // readiness fail → naya traffic band
  const timer = setTimeout(() => process.exit(1), 25_000).unref();
  await new Promise((resolve) => server.close(resolve)); // in-flight finish
  await mongoose.disconnect();
  clearTimeout(timer);
  process.exit(0);
});
```

- Order — stop accepting → drain in-flight → close DB/queues → exit.
- Deadline — less than the platform's grace period; force exit if it hangs.
- Keep-alive connections — close idle sockets with `server.closeIdleConnections()` (Node 18.2+).

</details>

### Medium · Testing a DB outage

<details>
<summary>Answer</summary>

- Test — replace the repository/DB client with a failing fake (or stop the container in an integration test).
- Expect — the API returns `503` + a retryable error quickly; the request does not hang (timeouts are set).
- Health — readiness `false`, liveness fine.
- Recovery — when the DB comes back, requests work without a restart.

</details>

### Hard · Shutdown triggered twice

SIGINT arrived 2 seconds after SIGTERM; the shutdown handler ran twice, with `disconnect` twice + an error. A robust version?

<details>
<summary>Answer</summary>

```js
let shuttingDown;
function shutdown(signal) {
  shuttingDown ??= (async () => {
    log.info({ signal }, 'shutting down');
    ready = false;
    const deadline = setTimeout(() => {
      log.error('forced exit; in-flight work may be lost');
      process.exit(1);
    }, 25_000);
    deadline.unref();
    try {
      await new Promise((resolve) => server.close(resolve));
      await worker.stop(); // checkpoint/requeue the jobs
      await db.close();
      process.exitCode = 0;
    } finally {
      clearTimeout(deadline);
    }
  })();
  return shuttingDown;
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

- Idempotent — a shared promise; the second signal waits on the same shutdown.
- Shared deadline — not a separate timeout for each step, one total budget.
- Hard exit risk — in-flight writes/jobs are left incomplete; so jobs must be idempotent and requeue-able.

</details>

## Sources — further reading

- [Node HTTP server lifecycle](https://nodejs.org/api/http.html#serverclosecallback)
- [Node test cleanup](https://nodejs.org/api/test.html)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/mongodb/09-testing-shutdown.md)
