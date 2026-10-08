---
id: design-requirements-capacity
title: Requirements capacity and design interviews
track: system-design
order: 1
level: Foundation
minutes: 4
summary: Requirements — users, core actions, scale aur constraints pehle clear karo.
tags: requirements, capacity, interviews, tradeoffs
visual: request-flow
---

## Quick revision

- Requirements — users, core actions, scale aur constraints pehle clear karo.
- Functional — system kya kare; non-functional — latency, availability, durability jaise targets.
- QPS — requests per second; average ke saath peak factor bhi estimate karo.
- Concurrency — steady state mein roughly throughput × average latency.
- Storage — records × size × retention; indexes/replicas ka overhead jodo.
- SLO — measurable user-visible target; assumptions numbers ke saath bolo.
- Tradeoff — choice ka benefit, cost aur failure behavior explain karo.
- Percentile — p99 batata hai 99% requests us latency tak; average tail ko hide karta hai.
- Availability math — serial required dependencies combined success probability reduce kar sakti hain.
- Growth estimate — present peak ke saath retention, traffic growth aur safety headroom.

### HLD interview framework

- HLD — system boundaries/data flow; LLD — components/classes aur detailed contracts.
- Quality — latency, availability, accessibility, security aur freshness targets.
- Tech choice — workload aur tradeoff se justify; tool name alone answer nahi.
- Components — props/events, ownership, reuse, theming aur keyboard contract.
- Data model — entities, IDs, relations aur normalization.
- API — input/output/error, pagination, auth, timeout aur idempotency.
- Protocol — REST/GraphQL/gRPC; realtime ke liye SSE/WebSocket as needed.
### Delivery aur design decisions

- Operations — logs/metrics/traces, safe rollout aur rollback.
- Internationalization — translated messages; locale se dates/currency/direction.
- Experiment — feature flags + success metric; permission rules unchanged.
- Interview — requirement → architecture → data/API → bottleneck → failure recovery.
- Critical path — user action se useful response tak dependent steps identify.
- Failure domain — ek region/service/cache fail ho toh kaunsa feature unavailable hoga.
- Decision trigger — scale/freshness requirement badle toh architecture kab revisit karna hai, define.
- RADIO — Requirements → Architecture → Data model → Interface → Optimizations.
- Normalize — entity ID se records store; duplicate copies ka drift kam.

### Edge cases aur reasoning

- Little's law scope — stable system mein L=lambda×W average quantities; peak QPS×p99 ko exact concurrency law mat bolo.
- Unit conversion — daily traffic/86400 se average QPS; bytes versus bits, decimal GB versus GiB assumptions label karo.
- Latency budget allocation — end-to-end deadline ko network, queue aur dependency work mein split; tail dependencies correlated ho sakti hain.

## Recall aur practice

- Sawal — 100 requests/s aur average total latency0.2s par average in-flight work kitna?
- Jawaab — Steady-state roughly20; queue+service time included ho aur measured population same ho. Peak/tail ke liye extra analysis chahiye.
- Khud try karo — 1M requests/day, 5×peak aur 2KB record ka QPS/storage estimate do; retention, replica/index overhead aur assumptions explicitly show karo.

## Sources — aur padhne ke liye

- [Google SRE service objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE handling overload](https://sre.google/sre-book/handling-overload/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/01-requirements-capacity.md)
