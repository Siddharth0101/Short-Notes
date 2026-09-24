---
id: java-jpa-transactions
title: JPA Hibernate and Spring transactions
track: spring-boot
order: 6
level: Advanced
minutes: 1
summary: JPA — persistence specification; Hibernate — implementation.
tags: jpa, hibernate, transactions, n-plus-one
---

## Quick revision

- JPA — persistence specification; Hibernate — implementation.
- Entity — persistence identity/state; DTO se alag responsibility.
- Persistence context — managed entities aur dirty checking track karta hai.
- `@Transactional` — transaction boundary; default proxy mode mein self-call intercept nahi hoti.
- Rollback — default unchecked exceptions/Error par; checked exception rules configure karo.
- Lazy loading — transaction/session ke bahar relation access fail kar sakta hai.
- N+1 — har row par extra query; fetch plan/projection/batch se control karo.
- Optimistic lock — `@Version` se stale update detect; conflict handling chahiye.
- Pessimistic lock — rows lock; contention/deadlock ka cost samjho.
- Constraint — uniqueness/invariant database mein bhi enforce karo.
- Flush/commit — flush SQL synchronize karta hai; transaction durability commit par decide hoti hai.
- Read-only hint — optimization hint hai; write prevention ka universal guarantee nahi.
- Propagation — caller ki transaction join ya separate boundary; chosen mode ka resource/rollback effect samjho.

## Research notes: Trace the actual transaction entry point

- Default proxy transaction advice proxy-crossing calls intercept karti hai.

## Sources — aur padhne ke liye

- [Spring transaction read-only hints](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)

- [Spring transaction semantics](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Source yahan padho — Spring Framework](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate user guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring Data JPA reference](https://docs.spring.io/spring-data/jpa/reference/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/06-jpa-transactions.md)
