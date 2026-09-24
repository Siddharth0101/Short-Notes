---
id: design-requirements-capacity
title: Requirements capacity and design interviews
track: system-design
order: 1
level: Foundation
minutes: 1
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

## Sources — aur padhne ke liye

- [Google SRE service objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE handling overload](https://sre.google/sre-book/handling-overload/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/01-requirements-capacity.md)
