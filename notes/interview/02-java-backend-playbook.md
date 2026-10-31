---
id: interview-java
title: Java backend interview playbook
track: interview
order: 2
level: Advanced
minutes: 3
summary: Java equality — `==` reference; `.equals()` logical value, contract implementation par depend.
tags: java, interview, spring, concurrency, transactions
visual: thread-sync
---

## Quick revision

> Revision target — Java/backend answer mein exact failure boundary aur observable verification do.

- Java equality — `==` reference; `.equals()` logical value, contract implementation par depend.
- Hash key — equals/hashCode consistent; key mutate mat karo.
- Concurrency — shared state aur exact atomic boundary identify karo.
- `volatile` — visibility; multi-step increment atomic nahi.
- Transaction — rule + isolation + rollback/retry boundary explain karo.
- JPA — N+1, lazy loading aur optimistic-lock conflicts recognize karo.
- Incident — symptom, evidence, cause, fix aur verification batao.
- Design — interface se responsibilities split; failure path bhi explain karo.
- Transaction scenario — exactly kaunse writes ek saath commit/rollback honge, list karo.
- Concurrency trace — do callers ke interleaving se race demonstrate karo.
- Pool debugging — active, idle, waiting aur query timings se bottleneck separate.

### Quick answer checks

- Java answer — value/reference, thread visibility aur transaction boundary ko code example se distinguish karo.
- SQL answer — nulls, duplicates, ties aur concurrent updates pehle clarify; result shape verify karo.

### Edge cases aur reasoning

- Incident timeline — exact interleaving/query/commit chronology do; model/library blame se pehle reproduced evidence aur counterexample dikhao.
- Production qualifier — thread-safe single operation aur transaction-wide invariant distinguish; throughput gain resource capacity se substantiate karo.
- Failure honesty — unknown commit ko failed write mat label; retry, reconciliation aur duplicate receipt ka concrete path batao.

## Research notes: Defend a failure boundary

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Example se samjho

- Scenario — Incident mein API latency badhi hai; database query 40 ms aur connection acquisition wait 900 ms measure hoti hai.
- Reasoning — Answer pool wait ko symptom ke main part se connect kare; active connections, long transactions aur request concurrency inspect karne ka next step do.
- Catch — Evidence ke bina database slow ya threads kam claim mat karo; larger pool database saturation badha sakta hai. Fix ka load-test result aur remaining limit bolo.

## Recall aur practice

- Sawal — Stock check+decrement race answer mein interviewer ko kaunsa evidence doge?
- Jawaab — Two-thread interleaving, nonnegative invariant violation, chosen conditional atomic write aur concurrent acceptance result.
- Khud try karo — 20-minute round: equality key bug, pool-wait incident aur last-stock claim solve; normal, concurrent aur lost-response cases explain karo.

## Practice questions

### Easy · `equals`/`hashCode` answer structure

<details>
<summary>Answer</summary>

- Contract — equal objects ka same hashCode; reflexive, symmetric, transitive, consistent.
- Failure — sirf `equals` override → HashSet/HashMap duplicates/miss.
- Fields — same fields dono mein; mutable fields key mein mat rakho.
- Modern — `record` auto-generate karta hai.

</details>

### Medium · "Production mein API slow hai" — answer kaise do?

<details>
<summary>Answer</summary>

- Scope — kaunsa endpoint, kab se, kitne users, p50 vs p99, deploy/traffic change?
- Evidence — metrics (latency breakdown), traces, logs, DB slow query log, pool wait, GC.
- Hypotheses — 2–3 likely causes, har ek ko confirm/reject karne ka data.
- Mitigate — rollback/feature flag/scale out; phir root cause fix aur regression test.
- Structure — timeline: detect → mitigate → diagnose → fix → prevent.

</details>

### Medium · `@Transactional` rollback nahi hua — debug answer

<details>
<summary>Answer</summary>

- Proxy — method public hai aur bean ke bahar se call hua? (self-invocation bypass).
- Exception type — checked exception par default commit; `rollbackFor`.
- Swallowed — catch karke log kiya aur aage nahi phenka.
- Different transaction — `REQUIRES_NEW` ya async thread.
- Proof — logs mein transaction start/commit (`logging.level.org.springframework.transaction=DEBUG`).

</details>

### Medium · `HashMap` vs `ConcurrentHashMap` answer

<details>
<summary>Answer</summary>

- `HashMap` — single thread ya externally synchronized; concurrent writes data corrupt kar sakte hain.
- `ConcurrentHashMap` — thread-safe, fine-grained locking/CAS; `null` keys/values allowed nahi.
- Compound ops — `computeIfAbsent`, `merge` atomic per key; `get` phir `put` atomic nahi.
- Iterators — weakly consistent, `ConcurrentModificationException` nahi.

</details>

### Hard · Notification service design (quick)

Users ko email/SMS/push notifications; per-user rate limit, retries, aur preferences.

<details>
<summary>Answer</summary>

- API — `POST /notifications` (idempotency key) → DB + outbox.
- Pipeline — queue → channel workers (email/SMS/push) with retries/backoff, DLQ.
- Preferences — user opt-outs, quiet hours check before send.
- Limits — per-user/channel token bucket; provider rate limits.
- Tracking — status per attempt; dedupe on provider callbacks.
- Trade-offs — at-least-once delivery → rare duplicates; idempotency keys provider ko pass.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Java concurrency package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
- [HashMap contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [virtual threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Spring transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/02-java-backend-playbook.md)
