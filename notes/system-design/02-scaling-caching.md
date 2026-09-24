---
id: design-scaling-caching
title: Scaling caching replication and partitioning
track: system-design
order: 2
level: Advanced
minutes: 1
summary: Vertical scaling — ek machine bigger; horizontal — more instances.
tags: caching, scaling, replication, sharding
visual: caching
---

## Quick revision

- Vertical scaling — ek machine bigger; horizontal — more instances.
- Load balancer — traffic distribute; health aur overload behavior define karo.
- Stateless service — request state shared store/client contract mein; replicas simpler.
- Cache-aside — miss par DB read aur cache fill.
- TTL — staleness window; exact consistency guarantee nahi.
- Invalidation — writes par cache update/delete; races handle karo.
- Stampede — same miss par duplicate work; coalescing, jitter ya refresh control.
- Replication — copies for reads/availability; lag ho sakta hai.
- Partitioning — data split; key skew aur hot partitions socho.
- Hot key — ek popular key/shard bottleneck; replication, splitting ya coalescing consider.
- Negative cache — not-found result briefly cache; creation ke baad staleness rule chahiye.
- Consistent hashing — membership change par limited keys remap; balancing replicas/virtual nodes se improve.

## Research notes: Define behavior beyond capacity

- Requests ki cost different ho toh sirf count capacity achhe se describe nahi karti.

## Sources — aur padhne ke liye

- [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [Source yahan padho — Google SRE](https://sre.google/sre-book/handling-overload/)
- [PostgreSQL replication](https://www.postgresql.org/docs/current/high-availability.html)
- [Amazon Builders Library caching challenges](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/02-scaling-caching.md)
