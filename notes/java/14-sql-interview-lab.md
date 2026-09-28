---
id: java-sql-interview-lab
title: SQL joins windows and transaction races
track: java
order: 14
level: Advanced
minutes: 3
summary: WHERE — grouping se pehle rows filter; HAVING — groups filter.
tags: sql, postgres, joins, windows, transactions
visual: transaction-race
---

## Quick revision

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

## Research notes: Read estimates alongside actual query work

- EXPLAIN plan batata hai; EXPLAIN ANALYZE query execute bhi karta hai.

## Sources — aur padhne ke liye

- [Source yahan padho — PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
- [window functions](https://www.postgresql.org/docs/18/tutorial-window.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/14-sql-interview-lab.md)
