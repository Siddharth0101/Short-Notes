---
id: interview-mongodb
title: MongoDB interview playbook
track: interview
order: 4
level: Intermediate
minutes: 3
summary: Model — reads/writes aur growth se embedding/reference choose karo.
tags: mongodb, interview, indexes, schema, transactions
visual: mongo-index
---

## Quick revision

- Model — reads/writes aur growth se embedding/reference choose karo.
- Index — real filter/sort + explain evidence se justify.
- Transaction — single-document atomicity enough hai ya multi-document invariant hai?
- Mongoose — unique index validator nahi; middleware method-specific hota hai.
- Express — middleware order aur async error ownership explain karo.
- Security — object/tenant authorization har request par.
- Debug handoff — query, plan, timings aur smallest reproducible case do.
- Query answer — filter, projection, sort, index aur expected cardinality saath bolo.
- Webhook scenario — signature, durable receipt, dedupe aur repeated delivery trace.
- Failure scope — client retry, app rollback aur provider side effect alag identify.

### Quick answer checks

- Query plan answer — filter + index + examined/returned counts; sirf index name bolna enough nahi.
- API retry answer — timeout ke baad write ho chuki ho sakti hai; idempotency key/reconciliation explain karo.

### Edge cases aur reasoning

- Query reasoning sequence — read shape→growth bound→index→plan→write cost; index name first bolne se workload justification missing rahegi.
- Atomicity counterexample — single write atomic hone se separate read/write safe nahi; conditional predicate aur affected-count trace do.
- Validation boundaries — Mongoose rule, unique DB index aur API authorization different guards; each failure ka owner identify karo.

## Research notes: Justify the query from its workload

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Recall aur practice

- Sawal — Mongoose unique:true duplicate user rejection ko normal validation error kyun nahi banata?
- Jawaab — Database unique index enforce karta; duplicate-key error map karo, index readiness aur concurrent insert acceptance verify karo.
- Khud try karo — Tenant query aur last-stock update design karo; explain metrics, $inc validator caveat, duplicate webhook aur other-tenant rejection defend karo.

## Sources — aur padhne ke liye

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [explain results](https://www.mongodb.com/docs/manual/reference/explain-results/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/04-mongodb-playbook.md)
