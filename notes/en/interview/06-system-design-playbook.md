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

> Revision target — Assess a design through its assumptions, its decision triggers and one complete failure/recovery story.

- Design round — requirements → estimate → APIs/data → architecture → bottlenecks → failure.
- Assumption — state a number/constraint explicitly; do not silently invent it.
- Frontend — state ownership, request races, cache, accessibility and performance.
- Backend — the invariant, transactions, idempotency and recovery.
- Scale — choose a cache/partition/queue for the actual bottleneck.
- Failure — walk through a timeout, a duplicate, a partial commit and a reconnect.
- Tradeoff — the benefit + the cost + when the decision would change.
- Decision record — write the choice, the reason and the revisit trigger briefly.
- Bottleneck defense — identify the first resource to saturate if the load doubles.
- Design alternatives — compare two options using the given constraints; not a decision by tool popularity.
- Recovery story — detect the failure → isolate → repair → reconcile → verify.

### Quick answer checks

- Design numbers — label units/assumptions; calculate rough QPS, storage and a peak multiplier.
- Recovery answer — connect the source of truth, replay/deduplication and RTO/RPO to the failure scenario.

### Project and behavioural answers

- STAR — Situation → Task → Action → Result; keep the context short, and your own action and the outcome clear.
- Story bank — keep examples of impact, conflict, ambiguity and learning ready from 3–5 real projects.
- Ownership answer — along with what the team did, state your specific decision/action; do not give invented impact numbers.
- Reflection — after the result, say in one short point what you learned and what you would change next time.

### Edge cases and reasoning

- Guarantee vocabulary — define latest/read-your-writes/eventual through exact operations/a failure history; a strong word alone is not an answer.
- Design review evidence — after the happy path, a timeline for duplicate, timeout, partition and recovery; identify the durable truth and the owner of each action.
- Personal improvement record — separate observed incorrect reasoning from self-confidence; plan the next recall date yourself, and do not assume automation is implemented.

## Research notes: Expose assumptions and failure recovery

- In the linked Microsoft technical guidance, testing and problem-solving are part of the assessment too.

## Understand it with an example

- Scenario — For an image upload product the proposal starts with full database sharding, but the workload and retention numbers are still unknown.
- Reasoning — First clarify the file size, daily uploads, read/write ratio, privacy and retention; derive the likely bottleneck from storage/transfer estimates, then justify the choices.
- Catch — A complex diagram is not capacity evidence; label an uncertain number as an assumption and explain at which measured threshold you would revisit the design.

## Recall and practice

- Question — Which boundary would you make clear in order to defend an exactly-once processing claim?
- Answer — Separate message delivery, the durable consumer effect and the external side effect; explain the atomic dedupe scope, retention and the crash history.
- Try it yourself — Run a 45-minute design round; write up the workload units, API/data, the bottleneck, failure recovery and a measured-tradeoff review of two choices.

## Practice questions

### Easy · STAR story outline

"Tell me about a production incident you handled."

<details>
<summary>Answer</summary>

- Situation — the system + impact numbers (e.g. checkout errors at 8% for 20 min).
- Task — your responsibility (on-call, owner).
- Action — what you checked, what decision you took (a rollback), whom you coordinated with.
- Result — the recovery time, the root cause, the prevention (a test/alert), and what you learned.
- Ownership — be clear about "I" vs "we"; be honest about mistakes too.

</details>

### Medium · Defend a database choice

"Why PostgreSQL, why not MongoDB?"

<details>
<summary>Answer</summary>

- From the requirements — relational data (orders ↔ payments ↔ inventory), multi-row transactions, constraints, reporting joins.
- Trade-off — the effort of schema migrations; JSONB for flexible fields.
- Revisit trigger — "if the data becomes mostly document-shaped and isolated per tenant, or the write scale outgrows a single primary, then re-evaluate."
- Avoid — an opinion like "Postgres is the best" without a requirement.

</details>

### Medium · "Traffic grew 10x" — how do you respond?

<details>
<summary>Answer</summary>

- The bottleneck first — which component breaks first (DB writes? the cache hit rate? connection pools?), with numbers.
- Stateless tier — scale horizontally; DB — read replicas/caching for reads, partitioning for writes.
- Protection — rate limits, queues for async work, load shedding.
- State the cost/complexity trade-off; a trigger metric for every change.

</details>

### Medium · A story about a mistake (ownership)

<details>
<summary>Answer</summary>

- Without blame — "I shipped a migration without a backfill test, and writes failed for 15 min."
- Action — detect, roll back/fix forward, communicate.
- Learning → a system change — a migration rehearsal in CI, an expand/contract checklist.
- What interviewers look for — accountability and prevention, not a perfect record.

</details>

### Hard · The time plan for a 45-minute design round

<details>
<summary>Answer</summary>

- 0–5 — requirements + scale numbers (written down).
- 5–10 — the APIs and the core data model.
- 10–20 — the high-level architecture (client, edge, services, storage, async).
- 20–35 — 2 deep dives (the interviewer's interest or the riskiest part: consistency, hot keys, idempotency).
- 35–42 — failures: what breaks, how to detect it, how to recover; security basics.
- 42–45 — a summary of trade-offs and "next steps if there were more time".
- A checkpoint at the end of every section: "Should I go deeper in this direction?"

</details>

## Sources — further reading

- [Yangshun Tay — behavioral preparation](https://www.techinterviewhandbook.org/behavioral-interview/)

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [AWS safe retries and idempotency](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [AWS transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/interview/06-system-design-playbook.md)
