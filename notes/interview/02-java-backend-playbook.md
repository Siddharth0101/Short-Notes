---
id: interview-java
title: Java backend interview playbook
track: interview
order: 2
level: Advanced
minutes: 1
summary: Java equality — `==` reference; `.equals()` logical value, contract implementation par depend.
tags: java, interview, spring, concurrency, transactions
visual: thread-sync
---

## Quick revision

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

## Research notes: Defend a failure boundary

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Sources — aur padhne ke liye

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Java concurrency package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
- [HashMap contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [virtual threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Spring transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/02-java-backend-playbook.md)
