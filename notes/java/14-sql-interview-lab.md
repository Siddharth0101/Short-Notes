---
id: java-sql-interview-lab
title: SQL joins windows and transaction races
track: java
order: 14
level: Advanced
minutes: 1
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

## Research notes: Read estimates alongside actual query work

- EXPLAIN plan batata hai; EXPLAIN ANALYZE query execute bhi karta hai.

## Sources — aur padhne ke liye

- [Source yahan padho — PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
- [window functions](https://www.postgresql.org/docs/18/tutorial-window.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/14-sql-interview-lab.md)
