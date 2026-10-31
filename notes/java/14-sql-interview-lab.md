---
id: java-sql-interview-lab
title: SQL joins windows and transaction races
track: java
order: 14
level: Advanced
minutes: 5
summary: WHERE — grouping se pehle rows filter; HAVING — groups filter.
tags: sql, postgres, joins, windows, transactions
visual: transaction-race
---

## Quick revision

> Revision target — Query ko NULL, duplicate rows, tie order aur actual plan ke against check karo.

- WHERE — grouping se pehle rows filter; HAVING — groups filter.
- GROUP BY — per-key aggregates; selected non-aggregated columns ka rule samjho.
- LEFT JOIN — left rows preserve; right-column WHERE filter unmatched rows hata sakta hai.
- NULL — `IS NULL` use karo; `= NULL` true nahi hota.
- COUNT — `COUNT(*)` rows; `COUNT(column)` non-null values.
- Window function — rows collapse kiye bina rank/running totals.
- Composite index — column order query ke filter/sort se match karo.
- EXPLAIN — estimated plan; ANALYZE actual execution bhi karta hai.
- Pagination — stable sort + tie-breaker; deep pages par keyset useful.
- `UNION`/`UNION ALL` — duplicate rows remove / preserve; deduplication ka extra cost.
- `ROW_NUMBER`/`RANK` — unique sequence / ties ko same rank aur next rank mein gap.
- `EXISTS` — matching row ki existence; NOT IN ke null semantics se alag.

### Joins aur query shape

- INNER JOIN — matching rows; LEFT JOIN — saari left rows preserve.
- RIGHT/FULL JOIN — right / dono sides ke unmatched rows bhi preserve.
- CROSS JOIN — Cartesian product; rows multiply hoti hain.
- SELF JOIN — same table ko aliases se join.
- Join condition — missing/wrong condition duplicates ya huge result bana sakti hai.
- Semi-join pattern — parent once chahiye toh EXISTS; normal join multiple child matches se parent repeat karta hai.
- Anti-join pattern — missing related rows ke liye NOT EXISTS ka clear null-safe contract.
- Join cardinality — one-to-one assume karne se pehle key uniqueness verify karo.

### Grouping aur windows

- Aggregate — COUNT, SUM, AVG, MIN, MAX rows ko summarize karte hain.
- DISTINCT aggregate — repeated values count/sum se hata sakte ho.
- GROUPING SETS/ROLLUP — multiple aggregation levels ek query mein.
- Aggregate filter — alag conditions ke counts same grouping mein conditional aggregate se nikalo.
- Join inflation — child rows multiply hon toh sum/count overcount; correct grain par aggregate karo.
- Window order — ties ke liye deterministic tie-breaker; result display order separately define karo.
- Empty aggregate — COUNT zero; SUM/AVG jaise aggregates no rows par NULL de sakte hain.
- SQL conditional — CASE branches; COALESCE first non-null value; NULLIF equal values par NULL.
- DENSE_RANK — ties same rank; next distinct rank mein gap nahi.
- Window frame — PARTITION BY group, ORDER BY sequence; ROWS/RANGE frame running result badal sakta hai.

### Subqueries

- Scalar subquery — zero rows par NULL, one row par value, multiple rows par error.
- Derived table — FROM mein query result ko relation banao.
- Correlated query — outer row ko refer; actual cost query plan se dekho.
- NOT IN + NULL — unexpected unknown result; null behavior verify.
- ANY/ALL — comparison kisi / sab returned values se.

### Edge cases aur reasoning

- Keyset tie-breaker — cursor complete order tuple rakhe, jaise created_at+id; timestamp alone equal-time rows skip/repeat kara sakta hai.
- Top per group — ROW_NUMBER partition+deterministic order se one row; RANK/DENSE_RANK ties ke contract ke liye choose karo.
- Write plan caution — EXPLAIN ANALYZE INSERT/UPDATE/DELETE actual writes karta hai; isolated data aur transaction boundaries ke saath inspect karo.

## Research notes: Read estimates alongside actual query work

- EXPLAIN plan batata hai; EXPLAIN ANALYZE query execute bhi karta hai.

## Example se samjho

- Scenario — Customers A aur B hain; sirf A ke two orders10 aur20 hain. Report mein dono customers aur order total chahiye.
- Reasoning — Customers se LEFT JOIN karke group karo; A total30, B ka missing aggregate COALESCE se0. Count orders ke liye non-null child ID count karo.
- Catch — COUNT(*) B ki placeholder joined row bhi count karega; child filter WHERE mein daalne se B poori tarah disappear ho sakta hai.

## Recall aur practice

- Sawal — LEFT JOIN ke baad WHERE child.active=true unmatched parents kyun remove karta hai?
- Jawaab — Unmatched child value NULL hai; WHERE only true retain karta. Parent preservation chahiye toh intended child condition ON mein rakho.
- Khud try karo — Customers including zero orders ka total query likho; no child, multiple children, NULL amount aur equal-time cursor cases verify karo.

## Practice questions

### Easy · `LEFT JOIN` jo inner join ban gaya

```sql
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';
```

Bina order wale customers kyun gayab hain?

<details>
<summary>Answer</summary>

- Kyun — unmatched rows mein `o.status` NULL hai; `WHERE` NULL ko filter kar deta hai.
- Fix — condition `ON` mein: `LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'`.
- Rule — right table ki filter `ON` mein, result ki filter `WHERE` mein.

</details>

### Easy · `COUNT` ke teen roop

`COUNT(*)`, `COUNT(email)`, `COUNT(DISTINCT email)` mein farq?

<details>
<summary>Answer</summary>

- `COUNT(*)` — saari rows.
- `COUNT(email)` — non-NULL emails.
- `COUNT(DISTINCT email)` — unique non-NULL emails.
- Empty group — `COUNT` `0` deta hai, par `SUM`/`AVG` `NULL` (use `COALESCE(SUM(x), 0)`).

</details>

### Medium · Har department ke top 2 salaries

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

- `DENSE_RANK` — ties same rank, gap nahi; "top 2 distinct salaries".
- `ROW_NUMBER` — exactly 2 rows per department (ties arbitrary, tie-breaker column do).
- Window `WHERE` mein directly use nahi hota, isliye subquery/CTE.

</details>

### Medium · `NOT IN` aur NULL

```sql
SELECT name FROM employees
WHERE id NOT IN (SELECT manager_id FROM employees);
```

Ek bhi `manager_id` NULL ho toh result kya hoga?

<details>
<summary>Answer</summary>

- Result — zero rows. `id NOT IN (1, NULL)` → `id <> 1 AND id <> NULL` → UNKNOWN.
- Fix — `NOT EXISTS`:

```sql
SELECT e.name FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM employees m WHERE m.manager_id = e.id);
```

- Ya subquery mein `WHERE manager_id IS NOT NULL`.

</details>

### Medium · Join se SUM double ho gaya

```sql
SELECT o.id, SUM(o.amount) AS total, COUNT(i.id) AS items
FROM orders o JOIN order_items i ON i.order_id = o.id
GROUP BY o.id;
```

`total` order amount ka multiple kyun aa raha hai?

<details>
<summary>Answer</summary>

- Join inflation — har order row har item ke liye repeat hoti hai; 3 items → `amount` 3 baar sum.
- Fix — pehle items aggregate karo, phir join:

```sql
SELECT o.id, o.amount AS total, COALESCE(i.items, 0) AS items
FROM orders o
LEFT JOIN (SELECT order_id, COUNT(*) AS items FROM order_items GROUP BY order_id) i
  ON i.order_id = o.id;
```

</details>

### Hard · Keyset pagination

Feed `ORDER BY created_at DESC LIMIT 20 OFFSET 100000` slow hai aur naye posts aane par duplicates dikhte hain. Better query aur index?

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

- OFFSET cost — DB ko pehle 100000 rows padh kar phenkni padti hain.
- Keyset — last seen `(created_at, id)` se aage; index se seedha seek.
- Tie-breaker `id` — same timestamp par rows skip/duplicate nahi.
- Trade-off — random page number jump nahi; "next/previous" style.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
- [window functions](https://www.postgresql.org/docs/18/tutorial-window.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/14-sql-interview-lab.md)
