---
id: interview-system-design
title: React and Java system design interview playbook
track: interview
order: 6
level: Advanced
minutes: 4
summary: Design round — requirements → estimate → APIs/data → architecture → bottlenecks → failure.
tags: system-design, interview, react, java, architecture
visual: outbox-pattern
---

## Quick revision

> Revision target — Design ko assumptions, decision triggers aur one complete failure/recovery story se assess karo.

- Design round — requirements → estimate → APIs/data → architecture → bottlenecks → failure.
- Assumption — number/constraint explicitly bolo; silently invent mat karo.
- Frontend — state ownership, request races, cache, accessibility aur performance.
- Backend — invariant, transaction, idempotency aur recovery.
- Scale — actual bottleneck par cache/partition/queue choose karo.
- Failure — timeout, duplicate, partial commit aur reconnect walkthrough.
- Tradeoff — benefit + cost + kab decision change hoga.
- Decision record — choice, reason aur revisit trigger short likho.
- Bottleneck defense — load double ho toh first saturated resource identify.
- Design alternatives — do options compare using given constraints; tool popularity se decision nahi.
- Recovery story — failure detect → isolate → repair → reconcile → verify.

### Quick answer checks

- Design numbers — units/assumptions label karo; rough QPS, storage aur peak multiplier calculate karo.
- Recovery answer — source of truth, replay/deduplication aur RTO/RPO ko failure scenario se connect karo.

### Project aur behavioral answers

- STAR — Situation → Task → Action → Result; context short, apna action aur outcome clear.
- Story bank — 3–5 real projects se impact, conflict, ambiguity aur learning examples ready rakho.
- Ownership answer — team ne kya kiya ke saath tumhara specific decision/action bolo; invented impact numbers mat do.
- Reflection — result ke baad kya seekha aur next time kya badloge, ek short point mein bolo.

### Edge cases aur reasoning

- Guarantee vocabulary — latest/read-your-writes/eventual ko exact operations/failure history se define; strong word alone answer nahi.
- Design review evidence — happy path ke baad duplicate, timeout, partition aur recovery timeline; durable truth aur action owner identify karo.
- Personal improvement record — observed incorrect reasoning aur self-confidence separate; next recall date khud plan, automation implemented assume mat karo.

## Research notes: Expose assumptions and failure recovery

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Example se samjho

- Scenario — Image upload product ke liye proposal full database sharding se start hota hai, lekin workload aur retention numbers abhi unknown hain.
- Reasoning — Pehle file size, daily uploads, read/write ratio, privacy aur retention clarify karo; storage/transfer estimates se likely bottleneck nikalo, phir choices justify karo.
- Catch — Complex diagram capacity evidence nahi; uncertain number ko assumption label karo aur explain karo kis measured threshold par design revisit karoge.

## Recall aur practice

- Sawal — Exactly-once processing claim defend karne ke liye kaunsi boundary clear karoge?
- Jawaab — Message delivery, durable consumer effect aur external side effect separate; atomic dedupe scope, retention aur crash history explain karo.
- Khud try karo — 45-minute design round run karo; workload units, API/data, bottleneck, failure recovery aur two choices ki measured tradeoff review likho.

## Practice questions

### Easy · STAR story outline

"Ek production incident batao jo tumne handle kiya."

<details>
<summary>Answer</summary>

- Situation — system + impact numbers (e.g. checkout errors 8%, 20 min).
- Task — tumhari responsibility (on-call, owner).
- Action — kya check kiya, kya decision liya (rollback), kisse coordinate kiya.
- Result — recovery time, root cause, prevention (test/alert), aur tumne kya seekha.
- Ownership — "maine" vs "humne" clear; mistakes bhi honestly.

</details>

### Medium · Database choice defend karo

"PostgreSQL kyun, MongoDB kyun nahi?"

<details>
<summary>Answer</summary>

- Requirements se — relational data (orders ↔ payments ↔ inventory), multi-row transactions, constraints, reporting joins.
- Trade-off — schema migrations ka effort; JSONB flexible fields ke liye.
- Revisit trigger — "agar data mostly document-shaped aur per-tenant isolated ho jaaye, ya write scale single primary se bahar jaaye, toh re-evaluate."
- Avoid — "Postgres best hai" jaisa opinion bina requirement ke.

</details>

### Medium · "Traffic 10x ho gaya" — kaise respond karoge?

<details>
<summary>Answer</summary>

- Bottleneck pehle — kaunsa component pehle tootega (DB writes? cache hit rate? connection pools?) numbers ke saath.
- Stateless tier — horizontal scale; DB — read replicas/caching for reads, partitioning for writes.
- Protection — rate limits, queues for async work, load shedding.
- Cost/complexity trade-off bolo; har change ka trigger metric.

</details>

### Medium · Galti wali story (ownership)

<details>
<summary>Answer</summary>

- Bina blame — "Maine migration bina backfill test ke ship ki, 15 min writes fail hue."
- Action — detect, rollback/forward fix, communicate.
- Learning → system change — CI mein migration rehearsal, expand/contract checklist.
- Interviewers dekhte hain — accountability aur prevention, perfect record nahi.

</details>

### Hard · 45-minute design round ka time plan

<details>
<summary>Answer</summary>

- 0–5 — requirements + scale numbers (likh kar).
- 5–10 — APIs aur core data model.
- 10–20 — high-level architecture (client, edge, services, storage, async).
- 20–35 — 2 deep dives (interviewer ke interest ya sabse risky part: consistency, hot keys, idempotency).
- 35–42 — failures: kya tootega, kaise detect, kaise recover; security basics.
- 42–45 — trade-offs summary aur "next steps agar aur time hota".
- Har section ke end mein checkpoint: "Kya main is direction mein deep jaun?"

</details>

## Sources — aur padhne ke liye

- [Yangshun Tay — behavioral preparation](https://www.techinterviewhandbook.org/behavioral-interview/)

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [AWS safe retries and idempotency](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [AWS transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/06-system-design-playbook.md)
