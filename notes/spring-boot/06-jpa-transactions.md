---
id: java-jpa-transactions
title: JPA Hibernate and Spring transactions
track: spring-boot
order: 6
level: Advanced
minutes: 4
summary: JPA — persistence specification; Hibernate — implementation.
tags: jpa, hibernate, transactions, n-plus-one
visual: spring-proxy
---

## Quick revision

> Revision target — Managed state, SQL execution aur commit ko proxy-entered transaction se relate karo.

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

## Example se samjho

- Scenario — Two editors same entity version7 read karte hain. First edit commit se version8, second ab bhi version7 ke against save karta hai.
- Reasoning — Optimistic version check stale second write detect kare; UI conflict dikhakar latest data se merge/retry decide kare. Blind last-write overwrite avoid hota hai.
- Catch — Conflict ko same stale payload se endless retry mat karo; flush success bhi final commit success nahi, aur self-call proxy interception alag verify hoti hai.

## Recall aur practice

- Sawal — Inner failure catch karne se joined transaction ka rollback-only marker clear ho jaata hai?
- Jawaab — Nahi; outer commit rollback/UnexpectedRollbackException de sakta. Transaction boundaries aur failure policy explicitly redesign karo.
- Khud try karo — Order listing ka query count measure karo; no N+1, deterministic pagination aur two concurrent @Version edits mein one conflict verify karo.

## Practice questions

### Easy · N+1 query

```java
List<Order> orders = orderRepo.findAll();
orders.forEach(o -> System.out.println(o.getCustomer().getName()));
```

100 orders par kitni queries? Fix?

<details>
<summary>Answer</summary>

- Queries — 1 (orders) + 100 (har lazy customer) = 101.
- Fix — `@Query("select o from Order o join fetch o.customer")` ya `@EntityGraph(attributePaths = "customer")`.
- Alternative — DTO projection jo sirf zaroori columns select kare; ya `hibernate.default_batch_fetch_size`.
- Detect — SQL logging/statistics test mein query count assert karo.

</details>

### Easy · `LazyInitializationException`

Controller mein `order.getItems().size()` par `could not initialize proxy - no Session`. Kyun?

<details>
<summary>Answer</summary>

- Kyun — `items` lazy hai aur transaction/persistence context service method ke saath band ho chuka.
- Fix — service ke andar zaroori data load karke DTO return karo (fetch join/entity graph).
- Avoid — `FetchType.EAGER` sab jagah (har query bhaari) aur open-in-view par dependency.

</details>

### Medium · `@Transactional` laga phir bhi rollback nahi

```java
@Service
class ImportService {
    public void importAll(List<Row> rows) { rows.forEach(this::importOne); }
    @Transactional
    void importOne(Row row) { ... }
}
```

<details>
<summary>Answer</summary>

- Self-invocation — `this.importOne` proxy bypass karta hai; transaction start hi nahi hota.
- Visibility — non-public methods par proxy-based transactions reliably apply nahi hote.
- Fix — `@Transactional` ko public method par jo bahar se call ho, ya `importOne` alag bean mein.

</details>

### Medium · Checked exception par rollback nahi hua

`@Transactional` method `IOException` throw karta hai aur DB changes commit ho jaate hain. Kyun?

<details>
<summary>Answer</summary>

- Default rule — Spring rollback sirf `RuntimeException` aur `Error` par karta hai; checked exceptions par commit.
- Fix — `@Transactional(rollbackFor = IOException.class)` ya checked ko domain runtime exception mein wrap.
- Catch karke swallow kiya toh bhi rollback nahi — exception transaction boundary tak pahunchni chahiye.

</details>

### Medium · Concurrent edit aur `@Version`

Do users same product price update karte hain. Doosra pehle ko overwrite na kare — JPA mein kaise?

<details>
<summary>Answer</summary>

```java
@Entity
class Product {
    @Id Long id;
    @Version long version;
    BigDecimal price;
}
```

- Hibernate update — `UPDATE ... SET price=?, version=version+1 WHERE id=? AND version=?`.
- Conflict — 0 rows → `ObjectOptimisticLockingFailureException`; API `409 Conflict` ya fresh data ke saath retry.
- Pessimistic alternative — `@Lock(PESSIMISTIC_WRITE)` jab conflicts bahut frequent hon.

</details>

### Hard · `REQUIRES_NEW` aur "rollback-only"

Order placement ke beech audit log save karna hai jo order fail hone par bhi bachna chahiye. Aur ek doosre case mein error aata hai: `UnexpectedRollbackException: Transaction silently rolled back because it has been marked as rollback-only`. Dono samjhao.

<details>
<summary>Answer</summary>

- Audit — `@Transactional(propagation = REQUIRES_NEW)` alag bean mein; outer transaction suspend, audit apna commit karta hai, outer rollback use undo nahi karta.
- Cost — REQUIRES_NEW doosra DB connection leta hai; pool chhota ho toh deadlock/starvation possible.
- Rollback-only — inner `REQUIRED` method (same transaction) ne runtime exception throw kiya → poora transaction rollback-only mark hua. Outer ne catch karke commit try kiya → Spring `UnexpectedRollbackException` deta hai.
- Fix — failure ko catch karke continue karna hai toh inner ko alag transaction (`REQUIRES_NEW`) do ya exception transactional boundary se pehle handle karo.

</details>

## Sources — aur padhne ke liye

- [Spring Data JPA query/fetch contracts](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

- [Spring — propagation source](https://github.com/spring-projects/spring-framework/blob/main/framework-docs/modules/ROOT/pages/data-access/transaction/declarative/tx-propagation.adoc)

- [Spring transaction read-only hints](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)

- [Spring transaction semantics](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate user guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring Data JPA reference](https://docs.spring.io/spring-data/jpa/reference/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/06-jpa-transactions.md)
