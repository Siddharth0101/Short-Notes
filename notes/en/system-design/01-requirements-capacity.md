---
id: design-requirements-capacity
title: Requirements capacity and design interviews
track: system-design
order: 1
level: Foundation
minutes: 4
summary: Requirements — first make the users, core actions, scale and constraints clear.
tags: requirements, capacity, interviews, tradeoffs
visual: request-flow
---

## Quick revision

> Revision target — Estimate workload numbers with explicit units, average/peak and retention assumptions.

- Requirements — first make the users, core actions, scale and constraints clear.
- Functional — what the system does; non-functional — targets such as latency, availability, durability.
- QPS — requests per second; estimate the peak factor along with the average.
- Concurrency — in steady state, roughly throughput × average latency.
- Storage — records × size × retention; add the overhead of indexes/replicas.
- SLO — a measurable user-visible target; state assumptions with numbers.
- Tradeoff — explain the benefit, the cost and the failure behaviour of a choice.
- Percentile — p99 says 99% of requests finish within that latency; an average hides the tail.
- Availability math — serial required dependencies can reduce the combined success probability.
- Growth estimate — the present peak plus retention, traffic growth and safety headroom.

### HLD interview framework

- HLD — system boundaries/data flow; LLD — components/classes and detailed contracts.
- Quality — latency, availability, accessibility, security and freshness targets.
- Tech choice — justify it from the workload and the tradeoff; a tool name alone is not an answer.
- Components — props/events, ownership, reuse, theming and the keyboard contract.
- Data model — entities, IDs, relations and normalization.
- API — input/output/error, pagination, auth, timeout and idempotency.
- Protocol — REST/GraphQL/gRPC; SSE/WebSocket for realtime as needed.
### Delivery and design decisions

- Operations — logs/metrics/traces, safe rollout and rollback.
- Internationalization — translated messages; dates/currency/direction from the locale.
- Experiment — feature flags + a success metric; permission rules unchanged.
- Interview — requirement → architecture → data/API → bottleneck → failure recovery.
- Critical path — identify the dependent steps from the user action to a useful response.
- Failure domain — which feature becomes unavailable if one region/service/cache fails.
- Decision trigger — define when to revisit the architecture if the scale/freshness requirement changes.
- RADIO — Requirements → Architecture → Data model → Interface → Optimizations.
- Normalize — store records by entity ID; less drift between duplicate copies.

### Edge cases and reasoning

- Little's law scope — in a stable system L=lambda×W holds for average quantities; do not call peak QPS×p99 an exact concurrency law.
- Unit conversion — average QPS from daily traffic/86400; label the bytes versus bits and decimal GB versus GiB assumptions.
- Latency budget allocation — split the end-to-end deadline across network, queue and dependency work; tail dependencies can be correlated.

## Understand it with an example

- Scenario — Assume 2 million events a day, 500 bytes per event, and 30 days of retention; index/replica overhead is excluded for now.
- Reasoning — The average is about 23 events/s; raw daily storage is 1 billion bytes, that is a decimal 1 GB. Thirty days of raw storage will be 30 GB.
- Catch — The average arrival rate does not tell you the burst capacity; add the budget for the peak factor, payload variation, indexes and replicas separately.

## Recall and practice

- Question — At 100 requests/s and an average total latency0.2s, how much work is in flight on average?
- Answer — Roughly20 in steady state; provided queue+service time is included and the measured population is the same. Peak/tail needs extra analysis.
- Try it yourself — Give a QPS/storage estimate for 1M requests/day, a 5×peak and a 2KB record; show retention, replica/index overhead and the assumptions explicitly.

## Practice questions

### Easy · Estimate the QPS

10 million daily active users, each making ~20 requests a day. Average and peak QPS?

<details>
<summary>Answer</summary>

- Daily — `10M × 20 = 200M` requests.
- Average — `200M / 86,400 ≈ 2,300 QPS`.
- Peak — traffic is not flat through the day; a 3–5× factor → plan for ~7k–12k QPS.
- Work out the read/write split too (e.g. 90/10) — the design differs for each.

</details>

### Easy · Availability math

99.9% and 99.99% — how much monthly downtime is each? Two serial dependencies, both 99.9% — what is the combined figure?

<details>
<summary>Answer</summary>

- 99.9% — ~43.8 min/month.
- 99.99% — ~4.4 min/month.
- Serial — `0.999 × 0.999 ≈ 0.998` → 99.8%; every critical dependency lowers availability.
- Parallel redundancy — `1 − (0.001 × 0.001)`, if the failures are independent.

</details>

### Medium · Storage estimate

A photo app: 1M uploads/day, 2 MB on average, 3 replicas, 5 years of retention.

<details>
<summary>Answer</summary>

- Daily raw — `1M × 2 MB = 2 TB/day`.
- Yearly — `~730 TB`; 5 years — `~3.65 PB`.
- Replicas — `× 3` → ~11 PB (add thumbnails/metadata separately).
- Takeaway — object storage + lifecycle tiers (hot → cold); only metadata in the DB.

</details>

### Medium · Concurrency from Little's law

A service handles 2,000 RPS with an average latency of 200ms. How many requests are in flight at one time? What does it mean for thread pool sizing?

<details>
<summary>Answer</summary>

- `L = λ × W = 2000 × 0.2 = 400` concurrent requests (average).
- Blocking threads model — you need at least ~400 threads/connections, with headroom for peak and tail latency.
- If latency rises (a slow DB → 1s), the same RPS means 2000 in flight → pools exhaust; hence timeouts and load shedding.

</details>

### Hard · The first 5 minutes of a design round

"Design a URL shortener." What do you ask and what do you write in the first 5 minutes?

<details>
<summary>Answer</summary>

- Functional — shorten, redirect, a custom alias? expiry? analytics?
- Non-functional — the read:write ratio (~100:1), redirect latency (p99 < 50ms?), availability, abuse prevention.
- Scale — e.g. 100M new URLs/month → ~40 writes/s, ~4k reads/s; 5 years of storage.
- Output — a 3–4 line requirement summary + the API (`POST /urls`, `GET /{code}`) + what is out of scope.
- Then — a high-level diagram, the data model, a deep dive (ID generation, caching, hot keys).

</details>

## Sources — further reading

- [Google SRE service objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE handling overload](https://sre.google/sre-book/handling-overload/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/01-requirements-capacity.md)
