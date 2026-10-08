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

## Recall aur practice

- Sawal — GraphQL request HTTP200 ho toh all requested fields successful guaranteed hain?
- Jawaab — Nahi; data ke saath errors/partial result ho sakta. Field-level error, auth aur retry contract handle karo.
- Khud try karo — Same catalog API REST/GraphQL/gRPC mein compare karo; pagination, authorization, deadline, partial error aur compatible field removal define karo.

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
