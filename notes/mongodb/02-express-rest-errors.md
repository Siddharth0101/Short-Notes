---
id: mongo-express-rest-errors
title: Express REST APIs middleware and errors
track: mongodb
order: 2
level: Intermediate
minutes: 4
summary: Express — routing aur middleware ka HTTP framework.
tags: express, rest, middleware, errors, validation, pagination
visual: request-flow
---

## Quick revision

- Express — routing aur middleware ka HTTP framework.
- Middleware — order matters; response bhejo ya `next()` se control do.
- Route — method + path + handler; input ki type/range validate karo.
- Express 5 — returned rejected Promise error flow mein jaati hai; detached async work alag handle karo.
- Error handler — `(err, req, res, next)`; routes ke baad register karo.
- Double response — send ke baad execution/control flow rokna ya return karna socho.
- REST — resource URL, consistent methods/status aur bounded pagination.
- Error response — safe message/code; stack trace client ko nahi.
- 404 handler — unmatched route response; thrown exception se alag flow.
- Body limit — parser/upload payload bound karo; unlimited request memory risk.
- Middleware continuation — next() ke baad current JS execution automatically return nahi hoti.

### Data-access boundary

- Repository — SQL/data access encapsulate; controller HTTP contract own kare.
- Error mapping — unique conflict/missing row ko stable HTTP response mein map.
- Test — real database constraints aur rollback behavior verify.
- Affected rows — update count zero ho toh missing/stale version distinguish karne ka contract.
- Error after commit — response fail hone par write already durable; retry identity same rakho.
- Pool timeout — connection wait ko request deadline ke andar bound karo.

### PostgreSQL integration

- pg pool — bounded PostgreSQL connections reuse; acquired client finally mein release.
- pg values — $1/$2 placeholders values bind karte; dynamic identifiers allowlist karo.
- pg transaction — BEGIN, queries, COMMIT same checked-out client par; error par ROLLBACK.
- Tenant pagination — bounded limit, stable order aur server-verified tenant predicate saath rakho.

### Edge cases aur reasoning

- Headers-sent error — response start ho chuka ho toh error middleware next(err) se delegate; second JSON response mat bhejo.
- Proxy trust — trust proxy ko actual trusted hops/config se match; forged forwarding headers client identity/rate limit bypass kara sakte hain.
- Body parser order — signed webhook ke raw bytes normal JSON parser se pehle preserve; parsed/reserialized payload equivalent signature input nahi.

## Research notes: Return the promise that owns the request

- Express 5 returned handler promise ki rejection forward karta hai.

## Recall aur practice

- Sawal — Returned async route aur detached setTimeout callback error Express 5 mein same way handle honge?
- Jawaab — Nahi; returned handler Promise reject forward hota, detached callback ko explicit error ownership/forwarding chahiye.
- Khud try karo — API pipeline test karo; invalid body, rejected route Promise, unknown route aur headers-sent failure par one response/cleanup verify karo.

## Sources — aur padhne ke liye

- [Source yahan padho — Express](https://expressjs.com/en/guide/error-handling/)
- [Express error handling](https://expressjs.com/en/guide/error-handling/)
- [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/mongodb/02-express-rest-errors.md)
