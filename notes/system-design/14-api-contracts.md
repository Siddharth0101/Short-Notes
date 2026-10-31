---
id: system-design-api-contracts
title: REST, GraphQL aur gRPC — protocol se pehle contract choose karo
track: system-design
order: 14
level: Advanced
minutes: 3
summary: REST — resources + HTTP semantics; caching/status/conditional requests useful.
tags: api, graphql, grpc, rest, batching
---

## Quick revision

> Revision target — Protocol ke saath result, authorization, deadline aur compatibility ka explicit contract banao.

- REST — resources + HTTP semantics; caching/status/conditional requests useful.
- GraphQL — client-selected shape; resolver batching aur query cost limits chahiye.
- N+1 — per-item resolver calls; request-scoped batching/cache use karo.
- GraphQL auth — each resource/field boundary par policy; endpoint access alone enough nahi.
- gRPC — typed protobuf contracts; internal RPC/streaming ke liye useful.
- Contract evolution — backward-compatible fields/status/schema changes.
- Deadline — client budget downstream propagate; cancellation cooperative hai.
- Idempotency — write retries ka duplicate-effect contract har protocol mein chahiye.
- API version — additive field bhi strict clients ko affect kar sakta hai; compatibility test karo.
- Retry signal — overload par appropriate status + retry timing; client retry budget respect kare.
- Pagination token — opaque cursor validate/sign as needed; user-supplied cursor authorization bypass na kare.

### Edge cases aur reasoning

- GraphQL batch isolation — DataLoader-style cache request/auth scope mein; global cache permission results different users ke beech leak kar sakti.
- Protobuf compatibility — removed field numbers reserve, reuse mat karo; field meaning/type evolution older readers ke contract se test karo.
- Error transport distinction — HTTP200 GraphQL response mein field errors/partial data ho sakti; client application result separately inspect kare.

## Example se samjho

- Scenario — Product query 20 items laati hai; har item ka owner resolver separately same data source ko request karta hai.
- Reasoning — Naive execution one product-list call plus up to 20 owner calls karegi. Request-scoped batching duplicate owner IDs combine kar sakti hai; result-to-ID mapping preserve karo.
- Catch — Batching permissions bypass nahi karti; each requested resource authorized ho. Shared global result cache different users ki private owner details mix kar sakti hai.

## Recall aur practice

- Sawal — GraphQL request HTTP200 ho toh all requested fields successful guaranteed hain?
- Jawaab — Nahi; data ke saath errors/partial result ho sakta. Field-level error, auth aur retry contract handle karo.
- Khud try karo — Same catalog API REST/GraphQL/gRPC mein compare karo; pagination, authorization, deadline, partial error aur compatible field removal define karo.

## Practice questions

### Easy · REST, GraphQL ya gRPC?

Public partner API, mobile app jiske screens alag-alag data shapes maangti hain, aur internal service-to-service high-throughput calls.

<details>
<summary>Answer</summary>

- Public partner API — REST (caching, tooling, simple auth, wide compatibility).
- Mobile multi-shape — GraphQL (client chooses fields, fewer round trips) — query cost limits ke saath.
- Internal high-throughput — gRPC (Protobuf, streaming, deadlines, typed contracts).

</details>

### Medium · GraphQL N+1

`posts { author { name } }` query 100 posts par 101 DB queries karti hai.

<details>
<summary>Answer</summary>

- Cause — har `author` resolver alag fetch.
- Fix — DataLoader: ek request ke andar ids batch karke `WHERE id IN (...)`, per-request cache.
- Isolation — DataLoader per request banao; global cache users ke beech data/permissions leak kar sakta hai.
- Limits — query depth/complexity limits.

</details>

### Medium · Protobuf schema evolve karna

<details>
<summary>Answer</summary>

- Safe — naye fields naye numbers ke saath add; purane clients unknown fields ignore karte hain.
- Never — existing field number ka type/meaning badalna ya deleted number reuse karna.
- Delete — `reserved 4; reserved "old_name";`.
- Required semantics — proto3 mein sab optional-ish; validation application level par.

</details>

### Medium · Retry kab karna chahiye?

<details>
<summary>Answer</summary>

- Retryable — `429` (Retry-After respect), `503`, network timeouts, gRPC `UNAVAILABLE`; idempotent operations ya idempotency key ke saath.
- Not — `400`, `401/403`, `404`, `409` business conflicts, gRPC `INVALID_ARGUMENT`.
- Deadline — caller ka overall deadline downstream propagate (gRPC deadlines), retries usi budget mein.
- Amplification — har layer 3 retries kare toh 3³ calls; retries ek layer par concentrate.

</details>

### Hard · Pagination token design

<details>
<summary>Answer</summary>

- Opaque cursor — last item ki sort key (e.g. `createdAt`, `id`) + filter hash, base64/encrypted ya signed.
- Tamper — signature/HMAC verify; invalid token par `400`.
- Filter change — token mein filter hash; mismatch par reject (galat results nahi).
- Evolution — token mein version; expiry policy.
- Clients — token ko parse na karein; contract sirf "next page ke liye bhejo".

</details>

## Sources — aur padhne ke liye

- [GraphQL response and errors](https://graphql.org/learn/response/)
- [GraphQL HTTP transport and partial responses](https://graphql.org/learn/serving-over-http/)
- [Protobuf field-number compatibility](https://protobuf.dev/programming-guides/proto3/)

- [GraphQL queries](https://graphql.org/learn/queries/)
- [authorization](https://graphql.org/learn/authorization/)
- [DataLoader](https://github.com/graphql/dataloader)
- [gRPC lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/14-api-contracts.md)
