---
id: system-design-api-contracts
title: REST, GraphQL aur gRPC — protocol se pehle contract choose karo
track: system-design
order: 14
level: Advanced
minutes: 1
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

## Sources — aur padhne ke liye

- [GraphQL queries](https://graphql.org/learn/queries/)
- [authorization](https://graphql.org/learn/authorization/)
- [DataLoader](https://github.com/graphql/dataloader)
- [gRPC lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/14-api-contracts.md)
