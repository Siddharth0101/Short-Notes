---
id: interview-mongodb
title: MongoDB interview playbook
track: interview
order: 4
level: Intermediate
minutes: 1
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

## Research notes: Justify the query from its workload

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Sources — aur padhne ke liye

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [compound indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- [explain results](https://www.mongodb.com/docs/manual/reference/explain-results/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/04-mongodb-playbook.md)
