---
id: system-design-api-contracts
title: REST, GraphQL and gRPC — choose the contract before the protocol
track: system-design
order: 14
level: Advanced
minutes: 3
summary: REST — resources + HTTP semantics; caching, status codes and conditional requests are useful.
tags: api, graphql, grpc, rest, batching
---

## Quick revision

> Revision target — Along with the protocol, build an explicit contract for the result, authorization, deadline and compatibility.

- REST — resources + HTTP semantics; caching/status/conditional requests are useful.
- GraphQL — a client-selected shape; it needs resolver batching and query cost limits.
- N+1 — per-item resolver calls; use request-scoped batching/caching.
- GraphQL auth — a policy at each resource/field boundary; endpoint access alone is not enough.
- gRPC — typed protobuf contracts; useful for internal RPC/streaming.
- Contract evolution — backward-compatible field/status/schema changes.
- Deadline — propagate the client budget downstream; cancellation is cooperative.
- Idempotency — every protocol needs a duplicate-effect contract for write retries.
- API version — even an additive field can affect strict clients; test compatibility.
- Retry signal — an appropriate status + retry timing on overload; the client respects a retry budget.
- Pagination token — validate/sign an opaque cursor as needed; a user-supplied cursor must not bypass authorization.

### Edge cases and reasoning

- GraphQL batch isolation — a DataLoader-style cache lives in the request/auth scope; a global cache can leak permission results between different users.
- Protobuf compatibility — reserve removed field numbers, do not reuse them; test a change in field meaning/type against the contract of older readers.
- Error transport distinction — an HTTP200 GraphQL response can carry field errors/partial data; the client inspects the application result separately.

## Understand it with an example

- Scenario — A product query fetches 20 items; each item's owner resolver separately requests the same data source.
- Reasoning — Naive execution makes one product-list call plus up to 20 owner calls. Request-scoped batching can combine duplicate owner IDs; preserve the result-to-ID mapping.
- Catch — Batching does not bypass permissions; each requested resource must be authorized. A shared global result cache can mix the private owner details of different users.

## Recall and practice

- Question — If a GraphQL request returns HTTP200, are all the requested fields guaranteed to have succeeded?
- Answer — No; there can be errors/a partial result alongside the data. Handle the field-level error, auth and retry contract.
- Try it yourself — Compare the same catalog API in REST/GraphQL/gRPC; define pagination, authorization, the deadline, a partial error and a compatible field removal.

## Practice questions

### Easy · REST, GraphQL or gRPC?

A public partner API, a mobile app whose screens ask for different data shapes, and internal service-to-service high-throughput calls.

<details>
<summary>Answer</summary>

- Public partner API — REST (caching, tooling, simple auth, wide compatibility).
- Mobile multi-shape — GraphQL (client chooses fields, fewer round trips) — with query cost limits.
- Internal high-throughput — gRPC (Protobuf, streaming, deadlines, typed contracts).

</details>

### Medium · GraphQL N+1

The query `posts { author { name } }` makes 101 DB queries for 100 posts.

<details>
<summary>Answer</summary>

- Cause — every `author` resolver fetches separately.
- Fix — DataLoader: batch the ids within one request into `WHERE id IN (...)`, with a per-request cache.
- Isolation — create the DataLoader per request; a global cache can leak data/permissions between users.
- Limits — query depth/complexity limits.

</details>

### Medium · Evolving a Protobuf schema

<details>
<summary>Answer</summary>

- Safe — add new fields with new numbers; old clients ignore unknown fields.
- Never — change the type/meaning of an existing field number or reuse a deleted number.
- Delete — `reserved 4; reserved "old_name";`.
- Required semantics — in proto3 everything is optional-ish; validation is at the application level.

</details>

### Medium · When should you retry?

<details>
<summary>Answer</summary>

- Retryable — `429` (respect Retry-After), `503`, network timeouts, gRPC `UNAVAILABLE`; for idempotent operations or with an idempotency key.
- Not — `400`, `401/403`, `404`, `409` business conflicts, gRPC `INVALID_ARGUMENT`.
- Deadline — propagate the caller's overall deadline downstream (gRPC deadlines), with retries inside that same budget.
- Amplification — if every layer retries 3 times that is 3³ calls; concentrate retries in one layer.

</details>

### Hard · Pagination token design

<details>
<summary>Answer</summary>

- Opaque cursor — the sort key of the last item (e.g. `createdAt`, `id`) + a filter hash, base64/encrypted or signed.
- Tamper — verify the signature/HMAC; `400` on an invalid token.
- Filter change — a filter hash in the token; reject on a mismatch (not wrong results).
- Evolution — a version in the token; an expiry policy.
- Clients — must not parse the token; the contract is only "send it for the next page".

</details>

## Sources — further reading

- [GraphQL response and errors](https://graphql.org/learn/response/)
- [GraphQL HTTP transport and partial responses](https://graphql.org/learn/serving-over-http/)
- [Protobuf field-number compatibility](https://protobuf.dev/programming-guides/proto3/)

- [GraphQL queries](https://graphql.org/learn/queries/)
- [authorization](https://graphql.org/learn/authorization/)
- [DataLoader](https://github.com/graphql/dataloader)
- [gRPC lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/14-api-contracts.md)
