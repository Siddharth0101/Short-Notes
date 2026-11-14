---
id: java-jpa-transactions
title: JPA Hibernate and Spring transactions
track: spring-boot
order: 6
level: Advanced
minutes: 4
summary: JPA — the persistence specification; Hibernate — an implementation.
tags: jpa, hibernate, transactions, n-plus-one
---

## Quick revision

> Revision target — Relate managed state, SQL execution and commit to a transaction entered through the proxy.

- JPA — the persistence specification; Hibernate — an implementation.
- Entity — persistence identity/state; a different responsibility from a DTO.
- Persistence context — tracks managed entities and dirty checking.
- `@Transactional` — the transaction boundary; in the default proxy mode a self-call is not intercepted.
- Rollback — by default on unchecked exceptions/Error; configure the rules for checked exceptions.
- Lazy loading — accessing a relation outside the transaction/session can fail.
- N+1 — an extra query for every row; control it with a fetch plan/projection/batching.
- Optimistic lock — detects a stale update with `@Version`; it needs conflict handling.
- Pessimistic lock — locks rows; understand the cost of contention/deadlock.
- Constraint — enforce uniqueness/invariants in the database too.
- Flush/commit — a flush synchronizes the SQL; transaction durability is decided at commit.
- Read-only hint — an optimization hint; not a universal guarantee of write prevention.
- Propagation — join the caller's transaction or use a separate boundary; understand the resource/rollback effect of the chosen mode.

### Hibernate sessions

- SessionFactory — a heavyweight thread-safe factory; a Session is not a shared concurrent object.
- Session — the persistence context and unit-of-work operations.
- Entity state — transient, managed, detached, removed.
- First-level cache — the session context; the second-level cache is an optional shared layer.
- HQL — an entity-oriented query; distinct from a SQL table query.

### Propagation modes

- REQUIRED — joins an existing transaction; otherwise a new transaction, and joined scopes share the same physical transaction.
- Rollback-only — if an inner REQUIRED scope marks rollback, the outer commit can throw UnexpectedRollbackException; catching does not clear the marker.
- REQUIRES_NEW — suspends the outer one and runs an independent transaction; commit/rollback are separate, and it needs capacity for an extra connection.
- NESTED — savepoints inside the same physical transaction; it needs JDBC/transaction-manager support and has no independent commit.
- Joined isolation — on a default REQUIRED join the outer isolation/timeout applies; the inner annotation does not automatically create a new isolation.

### Edge cases and reasoning

- Merge result — merging a detached entity returns a managed copy; do not assume the original detached object is automatically managed.
- Bulk write context — a JPQL bulk update can bypass managed entity state/the normal lifecycle; inspect clear/refresh and the version contract.
- Collection fetch pagination — a to-many fetch join multiplies rows; inspect the provider's in-memory pagination/query limits and consider an IDs+fetch/projection strategy.

## Research notes: Trace the actual transaction entry point

- Default proxy transaction advice intercepts calls that cross the proxy.

## Understand it with an example

- Scenario — Two editors read the same entity at version7. The first edit commits to version8; the second still saves against version7.
- Reasoning — The optimistic version check should detect the stale second write; the UI shows the conflict and decides to merge/retry with the latest data. A blind last-write overwrite is avoided.
- Catch — Do not retry a conflict endlessly with the same stale payload; a successful flush is not a successful final commit either, and self-call proxy interception is verified separately.

## Recall and practice

- Question — Does catching an inner failure clear the rollback-only marker of the joined transaction?
- Answer — No; the outer commit can roll back/throw UnexpectedRollbackException. Redesign the transaction boundaries and the failure policy explicitly.
- Try it yourself — Measure the query count of an order listing; verify no N+1, deterministic pagination and one conflict from two concurrent @Version edits.

## Practice questions

### Easy · N+1 query

```java
List<Order> orders = orderRepo.findAll();
orders.forEach(o -> System.out.println(o.getCustomer().getName()));
```

How many queries for 100 orders? The fix?

<details>
<summary>Answer</summary>

- Queries — 1 (orders) + 100 (each lazy customer) = 101.
- Fix — `@Query("select o from Order o join fetch o.customer")` or `@EntityGraph(attributePaths = "customer")`.
- Alternative — a DTO projection that selects only the needed columns; or `hibernate.default_batch_fetch_size`.
- Detect — assert the query count in a test with SQL logging/statistics.

</details>

### Easy · `LazyInitializationException`

`order.getItems().size()` in the controller gives `could not initialize proxy - no Session`. Why?

<details>
<summary>Answer</summary>

- Why — `items` is lazy and the transaction/persistence context has already closed with the service method.
- Fix — load the needed data inside the service and return a DTO (fetch join/entity graph).
- Avoid — `FetchType.EAGER` everywhere (every query gets heavy) and a dependence on open-in-view.

</details>

### Medium · `@Transactional` is there but still no rollback

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

- Self-invocation — `this.importOne` bypasses the proxy; the transaction never even starts.
- Visibility — proxy-based transactions do not apply reliably to non-public methods.
- Fix — put `@Transactional` on a public method that is called from outside, or move `importOne` to a separate bean.

</details>

### Medium · No rollback on a checked exception

A `@Transactional` method throws `IOException` and the DB changes are committed. Why?

<details>
<summary>Answer</summary>

- Default rule — Spring rolls back only on `RuntimeException` and `Error`; it commits on checked exceptions.
- Fix — `@Transactional(rollbackFor = IOException.class)` or wrap the checked one in a domain runtime exception.
- If you catch and swallow it, there is no rollback either — the exception has to reach the transaction boundary.

</details>

### Medium · Concurrent edits and `@Version`

Two users update the price of the same product. The second must not overwrite the first — how in JPA?

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
- Conflict — 0 rows → `ObjectOptimisticLockingFailureException`; the API returns `409 Conflict` or retries with fresh data.
- Pessimistic alternative — `@Lock(PESSIMISTIC_WRITE)` when conflicts are very frequent.

</details>

### Hard · `REQUIRES_NEW` and "rollback-only"

In the middle of order placement you need to save an audit log that must survive even if the order fails. And in another case an error appears: `UnexpectedRollbackException: Transaction silently rolled back because it has been marked as rollback-only`. Explain both.

<details>
<summary>Answer</summary>

- Audit — `@Transactional(propagation = REQUIRES_NEW)` in a separate bean; the outer transaction is suspended, the audit commits on its own, and the outer rollback does not undo it.
- Cost — REQUIRES_NEW takes a second DB connection; with a small pool, deadlock/starvation is possible.
- Rollback-only — an inner `REQUIRED` method (same transaction) threw a runtime exception → the whole transaction was marked rollback-only. The outer one caught it and tried to commit → Spring throws `UnexpectedRollbackException`.
- Fix — if you want to catch the failure and continue, give the inner one a separate transaction (`REQUIRES_NEW`) or handle the exception before the transactional boundary.

</details>

## Sources — further reading

- [Spring Data JPA query/fetch contracts](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

- [Spring — propagation source](https://github.com/spring-projects/spring-framework/blob/main/framework-docs/modules/ROOT/pages/data-access/transaction/declarative/tx-propagation.adoc)

- [Spring transaction read-only hints](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)

- [Spring transaction semantics](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Hibernate user guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Spring Data JPA reference](https://docs.spring.io/spring-data/jpa/reference/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/06-jpa-transactions.md)
