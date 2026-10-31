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

> Revision target — Cache aur queue ko backend protection, acceptable staleness aur measurable capacity se connect karo.

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

## Example se samjho

- Scenario — Popular key expire hote hi 200 requests aati hain; har miss same expensive database query start kar sakta hai.
- Reasoning — Per-key in-flight request coalescing ek fill share kara sakti hai. Waiters ke deadlines aur fill failure par retry/rejection ka bounded rule rakho.
- Catch — Ek process ka guard multiple instances ke across global coordination nahi; cache outage par all traffic DB ko bhejna overload multiply kar sakta hai.

## Recall aur practice

- Sawal — Write ke baad cache delete karne se stale read impossible ho jaata hai?
- Jawaab — Nahi; in-flight old reader stale value refill kar sakta. Versioned entries/fill coordination ya bounded staleness ka explicit guarantee chahiye.
- Khud try karo — Cache-aside race timeline aur cache outage fallback likho; DB protected, stampede bounded aur private cache scope correct verify karo.

## Practice questions

### Easy · Stateless service aur sessions

App servers ko horizontally scale karna hai, par login session server memory mein hai. Kya options hain?

<details>
<summary>Answer</summary>

- Sticky sessions — simple, par node marne par session gayab aur load uneven.
- Shared store — Redis jaisa session store; servers stateless.
- Token-based — signed token client ke paas (revocation design zaroori).
- Goal — koi bhi instance koi bhi request serve kar sake.

</details>

### Medium · Cache-aside aur invalidation order

Product update par DB aur cache dono kaise update karoge? "Pehle cache delete, phir DB update" mein kya race hai?

<details>
<summary>Answer</summary>

- Read — cache miss → DB se padho → cache mein set (TTL ke saath).
- Write — DB update, phir cache key delete (set nahi).
- Race (delete pehle) — delete ke baad, DB update se pehle koi read purana value cache kar deta hai → stale cache TTL tak.
- Mitigation — DB update ke baad delete, short TTL, aur zaroorat ho toh delayed second delete / version check.

</details>

### Medium · Hot key

Celebrity ka profile itna popular hai ki ek Redis shard CPU 100% par hai.

<details>
<summary>Answer</summary>

- Local cache — app instances mein chhota in-process cache (seconds TTL) → shard tak requests kam.
- Key replication — `profile:123#0..9` copies alag shards par; read random copy, write sab update/invalidate.
- Request coalescing — miss par ek hi fetch, baaki wait.
- Detect — per-key metrics/sampling se hot keys pehchano.

</details>

### Medium · Consistent hashing kyun?

`hash(key) % N` se 10 cache nodes chal rahe hain. Ek node add karne par kya hota hai?

<details>
<summary>Answer</summary>

- Modulo — `N` badalte hi almost saari keys naye node par map → massive cache miss storm.
- Consistent hashing — ring par keys aur nodes; node add/remove par sirf ~`1/N` keys move.
- Virtual nodes — har physical node ke kai points → load evenly distribute.

</details>

### Hard · Read replica aur read-your-writes

User profile update karta hai, page refresh par purana naam dikhta hai (reads replicas se). Fix?

<details>
<summary>Answer</summary>

- Cause — async replication lag; write primary par, read lagging replica se.
- Option 1 — user ke write ke baad kuch seconds uske reads primary par route.
- Option 2 — write ka LSN/version client session mein; replica tabhi use jab woh us position tak pahunch chuki ho.
- Option 3 — UI mein optimistic updated value dikhao (cosmetic, guarantee nahi).
- Monitor — replication lag metric aur alert.

</details>

## Sources — aur padhne ke liye

- [Donne Martin — System Design Primer](https://github.com/donnemartin/system-design-primer)

- [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [Source yahan padho — Google SRE](https://sre.google/sre-book/handling-overload/)
- [PostgreSQL replication](https://www.postgresql.org/docs/current/high-availability.html)
- [Amazon Builders Library caching challenges](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/02-scaling-caching.md)
