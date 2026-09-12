---
id: java-sql-interview-lab
title: SQL joins windows and transaction races
track: java
order: 13
level: Advanced
minutes: 25
summary: Solve reporting queries and concurrency failures behind Java APIs.
tags: sql, postgres, joins, windows, transactions
visual: transaction-race
---

## Mental model

SQL set-oriented hai: first decide what one output row represents. Most wrong joins come from mixing grains, such as one customer with many orders and many payments, then aggregating the multiplied result. Java mapping cannot repair an incorrect relational query.

Assume PostgreSQL with customers(id, name) and orders(id, customer_id, total, created_at). total is a decimal amount in one stated currency. Production schemas should make currency and nullability explicit.

## Top two orders per customer

```sql
WITH ranked AS (
  SELECT id, customer_id, total, created_at,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY total DESC, id ASC
         ) AS rn
  FROM orders
)
SELECT customer_id, id, total
FROM ranked
WHERE rn <= 2
ORDER BY customer_id, rn;
```

ROW_NUMBER selects at most two rows per customer. RANK or DENSE_RANK expresses a different tie contract and can return more rows. id makes equal totals deterministic. Window ordering does not guarantee final result ordering, so the outer ORDER BY remains necessary.

## Preserve customers without orders

```sql
SELECT c.id, COUNT(o.id) AS recent_orders
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.created_at >= TIMESTAMP '2026-01-01 00:00:00'
GROUP BY c.id;
```

COUNT(o.id) ignores the null-extended row. COUNT(*) would count it. Moving the date condition into WHERE removes customers without matching orders, changing the outer-join requirement. If timestamps represent real instants, use an agreed timezone-aware type and boundary; the literal here assumes a timestamp without timezone schema.

## A transaction is not a concurrency policy

Two buyers can both read stock = 1 and both decide to purchase. Prefer an atomic conditional update for this invariant:

```sql
UPDATE inventory
SET stock = stock - 1
WHERE product_id = $1 AND stock > 0
RETURNING stock;
```

Zero returned rows means no reservation occurred. Insert the reservation or order in the same transaction when they share a database boundary. A transaction wrapper around a read-then-write sequence does not automatically prevent every anomaly; isolation level and the statements themselves matter.

PostgreSQL Read Committed uses statement snapshots. Serializable transactions may abort and require retrying the complete transaction. External side effects such as emails must not be repeated blindly inside a retryable transaction. Use an outbox or other explicit handoff.

## Practice

Create fixtures for a customer with no orders, tied totals and two payments per order. Predict each query result before executing it. Explain why joining payments before summing order totals doubles values. Then run two concurrent reservation transactions for the last unit and assert exactly one succeeds; a sequential test cannot expose this race.

## Interview questions

**Why is DISTINCT a suspicious join fix?** It can hide a grain error while leaving aggregates wrong. Correct the relationship or pre-aggregate each one-to-many side.

**How do you make JPA pagination predictable?** Define a deterministic order, inspect generated SQL and avoid assuming collection fetch joins paginate parent rows cleanly.

## Sources

[PostgreSQL transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) and [window functions tutorial](https://www.postgresql.org/docs/18/tutorial-window.html) describe these query and concurrency rules.
