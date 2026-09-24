---
id: java-jdbc-sql
title: JDBC SQL and transaction boundaries
track: java
order: 13
level: Intermediate
minutes: 1
summary: JDBC — Java se database connection, statement aur result handling.
tags: jdbc, sql, transactions, indexes
---

## Quick revision

- JDBC — Java se database connection, statement aur result handling.
- PreparedStatement — values bind karo; SQL string concatenation se injection risk.
- Connection pool — connections reuse; pool size database capacity se align karo.
- Transaction — related writes atomic commit/rollback unit mein rakho.
- Auto-commit — har statement separately commit ho sakta hai.
- JOIN — related rows jodo; one-to-many se result rows multiply ho sakti hain.
- Index — reads fast kar sakta hai; writes/storage ka cost badhta hai.
- Resources — connection, statement aur result set close karo.
- Batch update — repeated statements group; batch size aur partial failure handle karo.
- Generated keys — inserted ID driver/database supported API se lo; SELECT MAX(id) concurrency-safe nahi.
- Connection lifetime — transaction ke statements same connection par; finally mein pool ko release.

## Sources — aur padhne ke liye

- [JDBC transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- [Prepared statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/13-jdbc-sql.md)
