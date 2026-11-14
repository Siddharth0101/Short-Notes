---
id: java-sql-interview-lab
title: SQL joins windows and transaction races
track: java
order: 14
level: Advanced
minutes: 5
summary: WHERE — filters rows before grouping; HAVING — filters groups.
tags: sql, postgres, joins, windows, transactions
visual: transaction-race
---

## Quick revision

> Revision target — Check a query against NULLs, duplicate rows, tie order and the actual plan.

- WHERE — filters rows before grouping; HAVING — filters groups.
- GROUP BY — per-key aggregates; understand the rule for selected non-aggregated columns.
- LEFT JOIN — preserves left rows; a WHERE filter on a right column can remove the unmatched rows.
- NULL — use `IS NULL`; `= NULL` is never true.
- COUNT — `COUNT(*)` counts rows; `COUNT(column)` counts non-null values.
- Window function — ranks/running totals without collapsing rows.
- Composite index — match the column order to the query's filter/sort.
- EXPLAIN — the estimated plan; ANALYZE also actually executes it.
- Pagination — a stable sort + a tie-breaker; keyset is useful for deep pages.
- `UNION`/`UNION ALL` — remove / preserve duplicate rows; deduplication has an extra cost.
- `ROW_NUMBER`/`RANK` — a unique sequence / the same rank for ties and a gap in the next rank.
- `EXISTS` — the existence of a matching row; different from the null semantics of NOT IN.

### Joins and query shape

- INNER JOIN — matching rows; LEFT JOIN — preserves all left rows.
- RIGHT/FULL JOIN — also preserve the unmatched rows of the right / both sides.
- CROSS JOIN — a Cartesian product; rows multiply.
- SELF JOIN — joins the same table through aliases.
- Join condition — a missing/wrong condition can produce duplicates or a huge result.
- Semi-join pattern — EXISTS when you want the parent once; a normal join repeats the parent for multiple child matches.
- Anti-join pattern — the clear null-safe contract of NOT EXISTS for missing related rows.
- Join cardinality — verify key uniqueness before assuming one-to-one.

### Grouping and windows

- Aggregate — COUNT, SUM, AVG, MIN, MAX summarize rows.
- DISTINCT aggregate — lets you remove repeated values from a count/sum.
- GROUPING SETS/ROLLUP — multiple aggregation levels in one query.
- Aggregate filter — get counts for different conditions in the same grouping with a conditional aggregate.
- Join inflation — when child rows multiply, a sum/count overcounts; aggregate at the correct grain.
- Window order — a deterministic tie-breaker for ties; define the result display order separately.
- Empty aggregate — COUNT is zero; aggregates such as SUM/AVG can return NULL on no rows.
- SQL conditional — CASE branches; COALESCE is the first non-null value; NULLIF gives NULL for equal values.
- DENSE_RANK — ties share a rank; no gap in the next distinct rank.
- Window frame — PARTITION BY is the group, ORDER BY the sequence; a ROWS/RANGE frame can change a running result.

### Subqueries

- Scalar subquery — NULL on zero rows, the value on one row, an error on multiple rows.
- Derived table — turns a query result into a relation in FROM.
- Correlated query — refers to the outer row; read the actual cost from the query plan.
- NOT IN + NULL — an unexpected unknown result; verify the null behaviour.
- ANY/ALL — a comparison against any / all of the returned values.

### Edge cases and reasoning

- Keyset tie-breaker — the cursor should hold the complete order tuple, such as created_at+id; a timestamp alone can skip/repeat equal-time rows.
- Top per group — one row through ROW_NUMBER with a partition+deterministic order; choose RANK/DENSE_RANK for the contract on ties.
- Write plan caution — EXPLAIN ANALYZE of an INSERT/UPDATE/DELETE performs the actual writes; inspect it with isolated data and transaction boundaries.

## Research notes: Read estimates alongside actual query work

- EXPLAIN shows the plan; EXPLAIN ANALYZE also executes the query.

## Understand it with an example

- Scenario — There are customers A and B; only A has two orders, of10 and20. The report needs both customers and the order total.
- Reasoning — LEFT JOIN from customers and group; A's total is30, and B's missing aggregate becomes0 through COALESCE. To count orders, count the non-null child ID.
- Catch — COUNT(*) will also count B's placeholder joined row; putting the child filter in WHERE can make B disappear entirely.

## Recall and practice

- Question — Why does WHERE child.active=true after a LEFT JOIN remove the unmatched parents?
- Answer — The unmatched child value is NULL; WHERE retains only true. To preserve the parents, keep the intended child condition in ON.
- Try it yourself — Write a totals query for customers including those with zero orders; verify the cases of no child, multiple children, a NULL amount and an equal-time cursor.

## Practice questions

### Easy · A `LEFT JOIN` that became an inner join

```sql
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';
```

Why are the customers without an order missing?

<details>
<summary>Answer</summary>

- Why — `o.status` is NULL in the unmatched rows; `WHERE` filters NULL out.
- Fix — the condition in `ON`: `LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'`.
- Rule — a filter on the right table goes in `ON`, a filter on the result goes in `WHERE`.

</details>

### Easy · The three forms of `COUNT`

The difference between `COUNT(*)`, `COUNT(email)` and `COUNT(DISTINCT email)`?

<details>
<summary>Answer</summary>

- `COUNT(*)` — all rows.
- `COUNT(email)` — non-NULL emails.
- `COUNT(DISTINCT email)` — unique non-NULL emails.
- Empty group — `COUNT` gives `0`, but `SUM`/`AVG` give `NULL` (use `COALESCE(SUM(x), 0)`).

</details>

### Medium · The top 2 salaries of every department

<details>
<summary>Answer</summary>

```sql
SELECT department_id, name, salary
FROM (
  SELECT e.*, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
  FROM employees e
) ranked
WHERE rnk <= 2;
```

- `DENSE_RANK` — ties share a rank, no gap; "the top 2 distinct salaries".
- `ROW_NUMBER` — exactly 2 rows per department (ties are arbitrary, so give a tie-breaker column).
- A window cannot be used directly in `WHERE`, hence the subquery/CTE.

</details>

### Medium · `NOT IN` and NULL

```sql
SELECT name FROM employees
WHERE id NOT IN (SELECT manager_id FROM employees);
```

What is the result if even one `manager_id` is NULL?

<details>
<summary>Answer</summary>

- Result — zero rows. `id NOT IN (1, NULL)` → `id <> 1 AND id <> NULL` → UNKNOWN.
- Fix — `NOT EXISTS`:

```sql
SELECT e.name FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM employees m WHERE m.manager_id = e.id);
```

- Or `WHERE manager_id IS NOT NULL` in the subquery.

</details>

### Medium · The join doubled the SUM

```sql
SELECT o.id, SUM(o.amount) AS total, COUNT(i.id) AS items
FROM orders o JOIN order_items i ON i.order_id = o.id
GROUP BY o.id;
```

Why is `total` coming out as a multiple of the order amount?

<details>
<summary>Answer</summary>

- Join inflation — every order row repeats for every item; 3 items → `amount` is summed 3 times.
- Fix — aggregate the items first, then join:

```sql
SELECT o.id, o.amount AS total, COALESCE(i.items, 0) AS items
FROM orders o
LEFT JOIN (SELECT order_id, COUNT(*) AS items FROM order_items GROUP BY order_id) i
  ON i.order_id = o.id;
```

</details>

### Hard · Keyset pagination

The feed's `ORDER BY created_at DESC LIMIT 20 OFFSET 100000` is slow and shows duplicates when new posts arrive. A better query and index?

<details>
<summary>Answer</summary>

```sql
SELECT id, created_at, title
FROM posts
WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
-- index: CREATE INDEX posts_feed_idx ON posts (created_at DESC, id DESC);
```

- OFFSET cost — the DB has to read the first 100000 rows and throw them away.
- Keyset — continue from the last seen `(created_at, id)`; a direct seek through the index.
- Tie-breaker `id` — no skipped/duplicate rows at the same timestamp.
- Trade-off — no jump to a random page number; a "next/previous" style.

</details>

## Sources — further reading

- [Source yahan padho — PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
- [window functions](https://www.postgresql.org/docs/18/tutorial-window.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/14-sql-interview-lab.md)
