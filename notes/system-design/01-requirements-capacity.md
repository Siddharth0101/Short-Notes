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

> Revision target — Workload ke numbers ko explicit units, average/peak aur retention assumptions se estimate karo.

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

## Example se samjho

- Scenario — Daily 2 million events, har event 500 bytes, aur 30 din retention assume karo; index/replica overhead abhi exclude hai.
- Reasoning — Average lagbhag 23 events/s; raw daily storage 1 billion bytes, yani decimal 1 GB. Thirty-day raw storage 30 GB hoga.
- Catch — Average arrival burst capacity nahi batata; peak factor, payload variation, indexes aur replicas ka budget separately add karo.

## Recall aur practice

- Sawal — 100 requests/s aur average total latency0.2s par average in-flight work kitna?
- Jawaab — Steady-state roughly20; queue+service time included ho aur measured population same ho. Peak/tail ke liye extra analysis chahiye.
- Khud try karo — 1M requests/day, 5×peak aur 2KB record ka QPS/storage estimate do; retention, replica/index overhead aur assumptions explicitly show karo.

## Practice questions

### Easy · QPS estimate karo

10 million daily active users, har user din mein ~20 requests. Average aur peak QPS?

<details>
<summary>Answer</summary>

- Daily — `10M × 20 = 200M` requests.
- Average — `200M / 86,400 ≈ 2,300 QPS`.
- Peak — traffic din bhar flat nahi; 3–5× factor → ~7k–12k QPS plan karo.
- Read/write split bhi nikalo (e.g. 90/10) — design dono ke liye alag hota hai.

</details>

### Easy · Availability math

99.9% aur 99.99% monthly downtime kitna? Do serial dependencies, dono 99.9%, toh combined?

<details>
<summary>Answer</summary>

- 99.9% — ~43.8 min/month.
- 99.99% — ~4.4 min/month.
- Serial — `0.999 × 0.999 ≈ 0.998` → 99.8%; har critical dependency availability ghatati hai.
- Parallel redundancy — `1 − (0.001 × 0.001)`, agar failures independent hon.

</details>

### Medium · Storage estimate

Photo app: 1M uploads/day, average 2 MB, 3 replicas, 5 saal retention.

<details>
<summary>Answer</summary>

- Daily raw — `1M × 2 MB = 2 TB/day`.
- Yearly — `~730 TB`; 5 saal — `~3.65 PB`.
- Replicas — `× 3` → ~11 PB (thumbnails/metadata alag add karo).
- Takeaway — object storage + lifecycle tiers (hot → cold); DB mein sirf metadata.

</details>

### Medium · Little's law se concurrency

Service 2,000 RPS handle karti hai, average latency 200ms. Ek time par kitni requests in-flight? Thread pool sizing par asar?

<details>
<summary>Answer</summary>

- `L = λ × W = 2000 × 0.2 = 400` concurrent requests (average).
- Blocking threads model — kam se kam ~400 threads/connections chahiye, peak aur tail latency ke liye headroom.
- Latency badhi (DB slow → 1s) toh same RPS par 2000 in-flight → pools exhaust; isliye timeouts aur load shedding.

</details>

### Hard · Design round ke pehle 5 minute

"URL shortener design karo." Pehle 5 minute mein kya poochoge aur kya likhoge?

<details>
<summary>Answer</summary>

- Functional — shorten, redirect, custom alias? expiry? analytics?
- Non-functional — read:write ratio (~100:1), redirect latency (p99 < 50ms?), availability, abuse prevention.
- Scale — e.g. 100M new URLs/month → ~40 writes/s, ~4k reads/s; 5 saal storage.
- Output — 3–4 line requirement summary + API (`POST /urls`, `GET /{code}`) + kya out of scope hai.
- Phir — high-level diagram, data model, deep-dive (ID generation, caching, hot keys).

</details>

## Sources — aur padhne ke liye

- [Google SRE service objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE handling overload](https://sre.google/sre-book/handling-overload/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/01-requirements-capacity.md)
