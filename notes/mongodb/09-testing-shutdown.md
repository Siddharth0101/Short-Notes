---
id: mongodb-testing-shutdown
title: Node API testing aur graceful shutdown — request se resource cleanup tak
track: mongodb
order: 9
level: Intermediate
minutes: 33
summary: HTTP contract ko real local requests se test karo; shutdown mein new work roko aur owned resources bounded order mein close karo.
tags: node, testing, shutdown, integration, resources
---

## Mental model — simple soch

Server sirf route functions ka collection nahi hai. Socket, database pool, background jobs aur active requests uske owned resources hain. Test ko prove karna hai ki valid request sahi response deti hai aur failure/shutdown mein resources leak nahi hote. Graceful shutdown restaurant closing jaisa hai: naye orders band, existing orders ka bounded completion, phir kitchen close.

> **Core takeaway:** App construction aur listening separate rakho, taaki test isolated server start aur reliably close kar sake.

Node runtime, Express error handling aur production chapter ke baad padho. Neeche Node 22.12+ built-in HTTP aur test runner use hue hain; external package nahi chahiye. Dono files same folder mein rakho, phir `node --test server.test.mjs` run karo. Real database integration next step hai, is demo mein database mock bhi nahi hai.

## Import karna server start karna nahi hona chahiye

```js
// server.mjs
import { createServer } from 'node:http';
export function makeServer() {
  return createServer((req, res) => {
    const found = req.method === 'GET' && req.url === '/health';
    res.writeHead(found ? 200 : 404, { 'content-type': 'application/json' });
    res.end(JSON.stringify(found ? { ok: true } : { error: 'not_found' }));
  });
}
```

```js
// server.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeServer } from './server.mjs';

test('HTTP response ka status, format aur body verify hote hain', async (t) => {
  const server = makeServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const ok = await fetch(`${base}/health`);
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await ok.json(), { ok: true });
  const missing = await fetch(`${base}/missing`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: 'not_found' });
});
```

Port 0 OS ko free ephemeral port choose karne deta hai; parallel tests fixed 3000 ke liye fight nahi karte. Response body consume ki hai aur cleanup registered hai. Route callback directly call karne se HTTP serialization, headers aur wiring verify nahi hoti; yeh test local socket boundary cross karta hai.

## Real persistence test ki boundary

Mongoose validation test database unique index exist karta hai yeh prove nahi karta. Isolated real MongoDB test environment mein schema/index preparation await karo. Same unique value ke concurrent inserts mein expected successful write count aur error response check karo. Transactions use kar rahe ho toh supported deployment topology, jaise configured replica set, chahiye; standalone substitute enough nahi.

Each test ko unique database/fixtures ya reliable cleanup do. Production database URI ko test default mat rakho. Parallel tests same collection clear karein toh ek doosre ke fixtures delete kar sakte hain. Time, queue delivery aur external payment dependency control karo, lekin database atomicity ko fake se prove mat bolo.

## Shutdown ka deliberate order

SIGTERM handler ka plan: draining flag set karo, readiness fail karo, new background claims stop karo, HTTP server par close initiate karo. Existing requests ko finish karne ka grace period do; uske baad owned DB pool aur workers close karo. Deadline cross ho toh forced termination policy implement karo aur unfinished durable jobs recoverable rakho.

Readiness change instantly har load balancer tak propagate nahi hota; draining process new incoming work ko controlled unavailable response bhi de sakta hai. `server.close()` new connections stop karta hai aur active requests ke completion ka wait karta hai. Modern Node idle keep-alive connections bhi handle karta hai; chosen version check karo. Upgraded WebSocket connections ki ownership separately manage karo.

DB pool pehle close kar doge toh in-flight request beech mein fail hogi. Har signal par cleanup dobara run karne se race ho sakti hai: one shared shutdown promise/idempotent handler rakho. Unlimited wait graceful nahi; request, job aur process deadlines bounded hon.

## Practice — failure injection

Slow request start karo, phir draining initiate karo. Verify existing request policy ke mutabik finish hoti hai, new work accept nahi hota aur process deadline follow hoti hai. Hung external call ke saath repeat karo. Test sirf process exit na dekhe: accepted operation ka durable outcome bhi inspect karo.

## Depth walkthrough — andar kya ho raha hai?

### Shutdown ko state machine ki tarah design karo

Running → draining → closed lifecycle lo. Signal aate hi repeated shutdown request idempotently handle karo. New work admit karna stop, owned in-flight operations bounded deadline tak wait, phir dependencies close. Database pool pehle close karke handlers ko drain karoge toh accepted requests beech mein fail ho sakti hain.

Long-lived socket ya never-finishing request deadline prevent kar sakti hai. Drain timeout ke baad forced termination policy explicit ho; “sab requests definitely complete” guarantee nahi. Durable job acknowledged kab hoti hai, process crash recovery us point par depend karegi.

Tests imported app factory ko in-memory dependencies de sakte hain; actual listener/port lifecycle integration test separately verify kare. Signal handler directly test process kill na kare; shutdown function ki behavior testable boundary rakho.

**Practice:** Active request, failing DB close aur repeated signal inject karo. New request rejected/routed away, active request documented policy follow aur close operation duplicate side effect na kare. Clean process exit logs useful hain, but lost acknowledged work ka recovery check alag hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Handler unit test aur real local HTTP test ka caught bug alag kaise hai?

**Apply — khud try karo:** Shutdown mein DB close pehle hota hai aur 500 responses aati hain. Correct sequence aur test do.

> **Hint — chhota ishara:** Active requests DB ko abhi use kar sakti hain.

**Answer guide — pehle khud karo, phir compare karo:** New work stop/readiness drain, HTTP active work ko bounded grace, phir DB close. Slow request se verify karo ki grace ke andar success ho. Deadline ke baad explicit cancellation/termination behavior aur retry/idempotency contract check karo.

**Exit check — aage badhne se pehle:** Ek leaked handle aur ek shared-fixture race ko diagnose karne ka next step batao.

## Sources — aur padhne ke liye

[Node HTTP server lifecycle](https://nodejs.org/api/http.html#serverclosecallback), [Node test cleanup](https://nodejs.org/api/test.html) aur [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/) padho.

## Related extension — aur samjho

- [Git workflow — working tree se reviewed commit tak](../javascript/20-git-workflow.md)
