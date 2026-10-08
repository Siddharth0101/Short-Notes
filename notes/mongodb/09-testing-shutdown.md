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

## Recall aur practice

- Sawal — HTTP server stop karne se background queue aur database cursor automatically close ho jayenge?
- Jawaab — Nahi; accepted work/resource owners explicitly drain/cancel/close karne honge, total deadline ke andar.
- Khud try karo — Shutdown test mein slow request, open cursor, stuck worker aur repeat signal do; bounded exit aur persisted accepted writes verify karo.

## Sources — aur padhne ke liye

- [Node HTTP server lifecycle](https://nodejs.org/api/http.html#serverclosecallback)
- [Node test cleanup](https://nodejs.org/api/test.html)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/09-testing-shutdown.md)
