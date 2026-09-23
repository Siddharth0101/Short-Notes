---
id: mongodb-testing-shutdown
title: Node API testing aur graceful shutdown — request se resource cleanup tak
track: mongodb
order: 9
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Node HTTP server lifecycle](https://nodejs.org/api/http.html#serverclosecallback)
- [Node test cleanup](https://nodejs.org/api/test.html)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/09-testing-shutdown.md)
