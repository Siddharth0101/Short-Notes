---
id: java-jpa-transactions
title: JPA Hibernate and Spring transactions
track: spring-boot
order: 6
level: Advanced
minutes: 4
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

### Hibernate sessions

- SessionFactory — heavyweight thread-safe factory; Session shared concurrent object nahi.
- Session — persistence context aur unit-of-work operations.
- Entity state — transient, managed, detached, removed.
- First-level cache — session context; second-level cache optional shared layer.
- HQL — entity-oriented query; SQL table query se distinction.

### Propagation modes

- REQUIRED — existing transaction join; nahi ho toh nayi transaction, joined scopes same physical transaction share karte hain.
- Rollback-only — inner REQUIRED scope rollback mark kare toh outer commit UnexpectedRollbackException de sakta hai, catch karna marker clear nahi karta.
- REQUIRES_NEW — outer suspend karke independent transaction; commit/rollback alag, extra connection ki capacity chahiye.
- NESTED — same physical transaction mein savepoints; JDBC/transaction-manager support chahiye, independent commit nahi.
- Joined isolation — default REQUIRED join par outer isolation/timeout apply; inner annotation automatically naya isolation nahi banati.

### Edge cases aur reasoning

- Merge result — detached entity merge managed copy return karta hai; original detached object automatically managed assume mat karo.
- Bulk write context — JPQL bulk update managed entity state/normal lifecycle se bypass ho sakta; clear/refresh aur version contract inspect karo.
- Collection fetch pagination — to-many fetch join rows multiply; provider in-memory pagination/query limits inspect, IDs+fetch/projection strategy consider karo.

## Research notes: Trace the actual transaction entry point

- Default proxy transaction advice proxy-crossing calls intercept karti hai.

## Recall aur practice

- Sawal — Inner failure catch karne se joined transaction ka rollback-only marker clear ho jaata hai?
- Jawaab — Nahi; outer commit rollback/UnexpectedRollbackException de sakta. Transaction boundaries aur failure policy explicitly redesign karo.
- Khud try karo — Order listing ka query count measure karo; no N+1, deterministic pagination aur two concurrent @Version edits mein one conflict verify karo.

## Sources — aur padhne ke liye

- [Spring Data JPA query/fetch contracts](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

- [Spring — propagation source](https://github.com/spring-projects/spring-framework/blob/main/framework-docs/modules/ROOT/pages/data-access/transaction/declarative/tx-propagation.adoc)

- [Spring transaction read-only hints](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)

- [Spring transaction semantics](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Source yahan padho — Spring Framework](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate user guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring Data JPA reference](https://docs.spring.io/spring-data/jpa/reference/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/06-jpa-transactions.md)
