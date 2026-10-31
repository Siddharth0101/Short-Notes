---
id: mongodb-testing-shutdown
title: Node API testing aur graceful shutdown — request se resource cleanup tak
track: mongodb
order: 9
level: Intermediate
minutes: 3
summary: HTTP test — actual status, headers aur response body verify karo.
tags: node, testing, shutdown, integration, resources
---

## Quick revision

> Revision target — Accepted requests aur open resources ko one shared shutdown deadline ke andar close karo.

- HTTP test — actual status, headers aur response body verify karo.
- Database test — isolated data/namespace; parallel tests shared state na tod dein.
- Failure test — bad input, unauthorized, duplicate aur dependency failure.
- Shutdown — new requests roko, in-flight requests ko bounded wait do.
- Cleanup — HTTP server, database, cursors aur workers close karo.
- Deadline — force termination ka budget; endlessly hang mat karo.
- Readiness — shutdown start par traffic se hatao.
- Open handles — tests hang hon toh server/timer/socket/DB connection cleanup inspect.
- Readiness drain — load balancer propagation ke baad active requests finish karne ka budget.
- Shutdown repeat — repeated signal par cleanup idempotent; new background work start na ho.

### Edge cases aur reasoning

- Shutdown deadline shared — server/DB/worker cleanup ko same remaining budget; per-resource full timeout total shutdown unexpectedly stretch karta hai.
- Hard-exit data risk — process.exit pending writes/log flush cut kar sakta; bounded graceful cleanup ke baad force-exit policy define karo.
- Signal race — repeated shutdown trigger same completion task share; closing resources twice ya readiness wapas true mat karo.

## Example se samjho

- Scenario — Shutdown budget10s hai; HTTP drain6s leta hai, uske baad DB/worker cleanup pending hai.
- Reasoning — Remaining cleanup ke liye4s budget bachta hai. New work reject/drain karo; resources ka completion ya cancellation observe karo, repeated signal same shutdown task share kare.
- Catch — Har cleanup ko fresh10s dene se total deadline exceed hogi; server listener close hona background work complete hone ka proof nahi.

## Recall aur practice

- Sawal — HTTP server stop karne se background queue aur database cursor automatically close ho jayenge?
- Jawaab — Nahi; accepted work/resource owners explicitly drain/cancel/close karne honge, total deadline ke andar.
- Khud try karo — Shutdown test mein slow request, open cursor, stuck worker aur repeat signal do; bounded exit aur persisted accepted writes verify karo.

## Practice questions

### Easy · Express app ko port ke bina test karo

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

- Split — `app` (routes) aur `listen` alag files; tests port conflict ke bina parallel.

</details>

### Medium · "Jest did not exit"

Tests pass hote hain par process khatam nahi hota.

<details>
<summary>Answer</summary>

- Open handles — DB connection, server, intervals, Redis clients band nahi hue.
- Fix — `afterAll(async () => { await mongoose.disconnect(); await server.close(); })`; timers clear.
- Debug — `--detectOpenHandles`; `--forceExit` symptom chhupata hai, fix nahi.

</details>

### Medium · Graceful shutdown

Kubernetes SIGTERM bhejta hai. Node API ko kya karna chahiye?

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
- Deadline — platform grace period se kam; hang hone par force exit.
- Keep-alive connections — `server.closeIdleConnections()` (Node 18.2+) se idle sockets band.

</details>

### Medium · DB down hone ka test

<details>
<summary>Answer</summary>

- Test — repository/DB client ko failing fake se replace karo (ya container stop karo integration mein).
- Expect — API `503` + retryable error jaldi de; request hang na ho (timeouts set).
- Health — readiness `false`, liveness theek.
- Recovery — DB wapas aaye toh bina restart requests chal jaayein.

</details>

### Hard · Shutdown do baar trigger hua

SIGTERM ke 2 second baad SIGINT bhi aaya; shutdown handler do baar chala aur `disconnect` twice + error. Robust version?

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
      await worker.stop(); // jobs ko checkpoint/requeue
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

- Idempotent — shared promise; doosra signal same shutdown ka wait kare.
- Shared deadline — har step ka alag timeout nahi, total budget ek.
- Hard exit risk — in-flight writes/jobs adhoore; isliye jobs idempotent aur requeue-able.

</details>

## Sources — aur padhne ke liye

- [Node HTTP server lifecycle](https://nodejs.org/api/http.html#serverclosecallback)
- [Node test cleanup](https://nodejs.org/api/test.html)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/09-testing-shutdown.md)
