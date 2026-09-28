---
id: java-jdbc-sql
title: JDBC SQL and transaction boundaries
track: java
order: 13
level: Intermediate
minutes: 3
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

### SQL basics aur filtering

- Table — rows records hain, columns typed fields.
- SELECT/FROM — kaunse columns aur kis table se read karna hai.
- INSERT/UPDATE/DELETE — add/change/remove rows; UPDATE/DELETE ka WHERE check karo.
- Type — text, numeric, boolean, date/time workload ke hisaab se choose.
- Primary key — row ki unique non-null identity.
- ORDER BY — explicit ordering; bina iske row order guaranteed nahi.
- LIMIT — returned rows bound; stable ordering saath do.
- DDL/DML — schema define/alter karna aur rows read/write karna alag operations.
- Alias — query mein column/table ka readable local naam; underlying schema rename nahi hota.
- Parameter type — driver/database conversion ka contract; raw user string ko valid number assume mat karo.
### SQL filtering

- AND/OR/NOT — conditions combine; parentheses se grouping clear karo.
- BETWEEN — dono boundaries included.
- IN — listed values se membership; NULL ke saath NOT IN ka catch samjho.
- LIKE — `%` any-length, `_` single-character wildcard.
- ILIKE — PostgreSQL case-insensitive pattern match.
- LIMIT/OFFSET — result slice; deep OFFSET costly ho sakta hai.
- DISTINCT — duplicate selected rows hataata hai.
- Escaped wildcard — literal %/_ search ho toh LIKE escape rule apply karo.
- NULL ordering — same sort direction ke saath null placement explicitly decide karo.
- SQL transaction — BEGIN → statements → COMMIT; failure par ROLLBACK.
- WHERE predicate — sirf true rows retain; NULL comparison unknown ho sakti hai.
- SQL NULL — IS NULL/IS NOT NULL use; = NULL true nahi hota.

### SQL commands

- RETURNING — supported write ke affected row/ID same statement se lo.
- DELETE/TRUNCATE/DROP — rows by condition / all rows without WHERE / table object hataana; constraints aur transaction rules verify karo.
- SQL strings — CONCAT ya || join; UPPER/LOWER case, LENGTH length; NULL behavior chosen function se check.

### PostgreSQL isolation

- Read Committed — har statement ka fresh snapshot; same transaction ki do SELECTs different committed data de sakti hain.
- Repeatable Read — first data statement ka snapshot reuse; PostgreSQL mein phantoms bhi blocked, serialization anomalies phir bhi possible.
- Serializable — committed outcome serial execution jaisa; serialization failure par poori transaction retry karo.
- Read Uncommitted in PG — PostgreSQL mein Read Committed jaisa behave; dirty reads enable nahi hote.
- Sequence gaps — nextval ka increment rollback se undo nahi; IDs contiguous hone ka assumption mat rakho.

## Sources — aur padhne ke liye

- [PostgreSQL — transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

- [JDBC transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- [Prepared statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/13-jdbc-sql.md)
