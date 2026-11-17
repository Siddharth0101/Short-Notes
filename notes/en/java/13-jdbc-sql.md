---
id: java-jdbc-sql
title: JDBC SQL and transaction boundaries
track: java
order: 13
level: Intermediate
minutes: 6
summary: JDBC — database connection, statement and result handling from Java.
tags: jdbc, sql, transactions, indexes
visual: sql-query-order
---

## Quick revision

> Revision target — Tie SQL resource ownership and a multi-write transaction to one business invariant.

- JDBC — database connection, statement and result handling from Java.
- PreparedStatement — bind the values; SQL string concatenation risks injection.
- Connection pool — reuses connections; align the pool size with database capacity.
- Transaction — keep related writes in one atomic commit/rollback unit.
- Auto-commit — every statement can be committed separately.
- JOIN — combines related rows; a one-to-many can multiply result rows.
- Index — can speed up reads; the cost of writes/storage goes up.
- Resources — close the connection, statement and result set.
- Batch update — groups repeated statements; handle the batch size and partial failure.
- Generated keys — take the inserted ID from the API the driver/database supports; SELECT MAX(id) is not concurrency-safe.
- Connection lifetime — a transaction's statements run on the same connection; release it to the pool in finally.

### SQL basics and filtering

- Table — rows are records, columns are typed fields.
- SELECT/FROM — which columns to read and from which table.
- INSERT/UPDATE/DELETE — add/change/remove rows; check the WHERE of an UPDATE/DELETE.
- Type — choose text, numeric, boolean, date/time according to the workload.
- Primary key — the unique non-null identity of a row.
- ORDER BY — explicit ordering; without it the row order is not guaranteed.
- LIMIT — bounds the returned rows; pair it with a stable ordering.
- DDL/DML — defining/altering the schema and reading/writing rows are separate operations.
- Alias — a readable local name for a column/table in a query; the underlying schema is not renamed.
- Parameter type — the contract of driver/database conversion; do not assume a raw user string is a valid number.
### SQL filtering

- AND/OR/NOT — combine conditions; make the grouping clear with parentheses.
- BETWEEN — both boundaries are included.
- IN — membership in the listed values; understand the catch of NOT IN with NULL.
- LIKE — `%` is an any-length wildcard, `_` a single-character one.
- ILIKE — a PostgreSQL case-insensitive pattern match.
- LIMIT/OFFSET — a slice of the result; a deep OFFSET can be costly.
- DISTINCT — removes duplicate selected rows.
- Escaped wildcard — apply the LIKE escape rule when searching for a literal %/_.
- NULL ordering — decide the null placement explicitly along with the sort direction.
- SQL transaction — BEGIN → statements → COMMIT; ROLLBACK on failure.
- WHERE predicate — retains only true rows; a NULL comparison can be unknown.
- SQL NULL — use IS NULL/IS NOT NULL; = NULL is never true.

### SQL commands

- RETURNING — get the affected row/ID of a supported write from the same statement.
- DELETE/TRUNCATE/DROP — rows by condition / all rows without WHERE / removing the table object; verify the constraints and transaction rules.
- SQL strings — join with CONCAT or ||; UPPER/LOWER for case, LENGTH for length; check NULL behaviour for the chosen function.

### PostgreSQL isolation

- Read Committed — a fresh snapshot for every statement; two SELECTs in the same transaction can return different committed data.
- Repeatable Read — reuses the snapshot of the first data statement; in PostgreSQL phantoms are blocked too, but serialization anomalies are still possible.
- Serializable — the committed outcome is like a serial execution; on a serialization failure retry the whole transaction.
- Read Uncommitted in PG — behaves like Read Committed in PostgreSQL; dirty reads are not enabled.
- Sequence gaps — the increment of nextval is not undone by a rollback; do not assume IDs are contiguous.

### Edge cases and reasoning

- SQL identifiers — placeholders bind values; choose a table/column/sort direction from a trusted allowlist.
- Pool state reset — reset auto-commit/isolation/read-only changes before release, or verify the provider contract; the next borrower must not get stale settings.
- Unknown commit — on a connection loss it is unclear whether the commit succeeded; you need operation identity/reconciliation instead of a blind write retry.

## Understand it with an example

- Scenario — A has a balance100, B has40; in a transfer30 the debit of A succeeds and the credit of B fails.
- Reasoning — On a rollback of the same connection's transaction the balances stay100/40; on a successful commit they are70/70. The total140 invariant survives in both outcomes.
- Catch — With auto-commit or different connections the debit can become durable independently; a timeout after commit needs operation identity/reconciliation separately.

## Recall and practice

- Question — Will ORDER BY ? in a PreparedStatement safely substitute a user-chosen column?
- Answer — A parameter binds a value, not an SQL identifier; map the allowed column names to fixed query fragments.
- Try it yourself — Write an account transfer on the same connection/transaction; verify the invariant for insufficient funds, a second-write failure and a duplicate operation ID.

## Practice questions

### Easy · SQL injection

```java
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
ResultSet rs = statement.executeQuery(sql);
```

What happens with `email = "' OR '1'='1"`? The fix?

<details>
<summary>Answer</summary>

- Attack — the query becomes `WHERE email = '' OR '1'='1'` → all users.
- Fix:

```java
try (PreparedStatement ps = conn.prepareStatement("SELECT id, email FROM users WHERE email = ?")) {
    ps.setString(1, email);
    try (ResultSet rs = ps.executeQuery()) { /* ... */ }
}
```

- Placeholders — values stay data, not SQL code. Table/column names cannot be bound; use an allowlist for them.

</details>

### Easy · `NULL` comparison

```sql
SELECT * FROM users WHERE phone = NULL;
SELECT COUNT(*), COUNT(phone) FROM users;
```

<details>
<summary>Answer</summary>

- First query — 0 rows; `NULL = NULL` is unknown, not true. Write `WHERE phone IS NULL`.
- `COUNT(*)` — all rows; `COUNT(phone)` — only non-null phones.
- Three-valued logic — `TRUE`, `FALSE`, `UNKNOWN`; `WHERE` keeps only the `TRUE` rows.

</details>

### Medium · A transfer with a JDBC transaction

Write a transfer between two accounts that commits both updates together or nothing.

<details>
<summary>Answer</summary>

```java
try (Connection conn = dataSource.getConnection()) {
    conn.setAutoCommit(false);
    try (PreparedStatement debit = conn.prepareStatement(
             "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?");
         PreparedStatement credit = conn.prepareStatement(
             "UPDATE accounts SET balance = balance + ? WHERE id = ?")) {
        debit.setBigDecimal(1, amount); debit.setLong(2, from); debit.setBigDecimal(3, amount);
        if (debit.executeUpdate() != 1) throw new IllegalStateException("insufficient funds");
        credit.setBigDecimal(1, amount); credit.setLong(2, to);
        if (credit.executeUpdate() != 1) throw new IllegalStateException("unknown account");
        conn.commit();
    } catch (Exception e) {
        conn.rollback();
        throw e;
    }
}
```

- Conditional debit — the `balance >= ?` check and the update in one atomic statement; no read-then-write race.
- Row count — 0 rows = the rule was broken → rollback.
- Pool — the connection goes back to the pool; the pool usually resets autocommit, but restoring it manually is a safe habit.

</details>

### Medium · Lost update

Two requests read stock `10` at the same time and both write `9`. Give two fixes.

<details>
<summary>Answer</summary>

- Atomic update — `UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0`; check success from the row count.
- Pessimistic lock — `SELECT stock FROM products WHERE id = ? FOR UPDATE` in a transaction, then update.
- Optimistic — a `version` column: `UPDATE ... SET stock = ?, version = version + 1 WHERE id = ? AND version = ?`; retry on 0 rows.
- Isolation note — PostgreSQL's default Read Committed does not stop this race by itself.

</details>

### Hard · Connection pool exhaustion

Under load, requests fail with `Connection is not available, request timed out after 30000ms`, while DB CPU is low. Causes and fixes?

<details>
<summary>Answer</summary>

- Leak — the connection was not closed on an error path; use try-with-resources and turn on HikariCP `leakDetectionThreshold`.
- Long transactions — an HTTP call/file upload inside a transaction holds on to the connection; keep external work outside the transaction.
- Pool sizing — pool size × app instances must be less than the DB `max_connections`; a bigger pool is not always faster.
- Commit unknown — on a commit timeout the result is unknown; keep an idempotency key or a status check for the client retry.

</details>

## Sources — further reading

- [PostgreSQL — transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

- [JDBC transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- [Prepared statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/13-jdbc-sql.md)
