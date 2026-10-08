---
id: design-scaling-caching
title: Scaling caching replication and partitioning
track: system-design
order: 2
level: Advanced
minutes: 4
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

### Cache write policies

- Write-through — cache layer DB write synchronously complete karti hai; write latency badhti hai.
- Write-behind — cache write pehle, DB later; flush se pehle crash ho toh data loss ka risk.
- Refresh-ahead — expiry se pehle likely-needed entries refresh; galat prediction extra backend work karati hai.

### Traffic aur failover

- Active-passive — ek instance traffic serve, standby failure par takeover; detection/startup se recovery delay.
- Active-active — multiple instances traffic serve; shared state aur concurrent-write conflicts handle karo.
- L4/L7 balancer — transport IP/port se route / HTTP path/header jaise application details se route.

### Edge cases aur reasoning

- Cache fill race — reader old data fetch kare, writer invalidate kare, reader stale cache refill; version/fencing/fill coordination contract chahiye.
- Hot-key fanout — sharding uniform keys distribute karta, one hot key automatically split nahi; request coalescing/replicas/domain partition evaluate karo.
- Overload queue — arrival sustained capacity se higher ho toh queue grows; admission limits/load shedding, deadline-aware rejection define karo.

## Research notes: Define behavior beyond capacity

- Requests ki cost different ho toh sirf count capacity achhe se describe nahi karti.

## Recall aur practice

- Sawal — Write ke baad cache delete karne se stale read impossible ho jaata hai?
- Jawaab — Nahi; in-flight old reader stale value refill kar sakta. Versioned entries/fill coordination ya bounded staleness ka explicit guarantee chahiye.
- Khud try karo — Cache-aside race timeline aur cache outage fallback likho; DB protected, stampede bounded aur private cache scope correct verify karo.

## Sources — aur padhne ke liye

- [Donne Martin — System Design Primer](https://github.com/donnemartin/system-design-primer)

- [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [Source yahan padho — Google SRE](https://sre.google/sre-book/handling-overload/)
- [PostgreSQL replication](https://www.postgresql.org/docs/current/high-availability.html)
- [Amazon Builders Library caching challenges](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/02-scaling-caching.md)
