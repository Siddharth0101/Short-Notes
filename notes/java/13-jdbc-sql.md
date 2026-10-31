---
id: java-jdbc-sql
title: JDBC SQL and transaction boundaries
track: java
order: 13
level: Intermediate
minutes: 6
summary: JDBC — Java se database connection, statement aur result handling.
tags: jdbc, sql, transactions, indexes
---

## Quick revision

> Revision target — SQL resource ownership aur multi-write transaction ko ek business invariant se jodo.

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

### Edge cases aur reasoning

- SQL identifiers — placeholders values bind karte hain; table/column/sort direction ko trusted allowlist se choose karo.
- Pool state reset — auto-commit/isolation/read-only changes release se pehle reset/provider contract verify; next borrower ko stale settings na milen.
- Unknown commit — connection loss ke waqt commit succeed hua ya nahi unclear; blind write retry ke bajay operation identity/reconciliation chahiye.

## Example se samjho

- Scenario — A ka balance100, B ka40; transfer30 mein A debit successful, B credit fail hota hai.
- Reasoning — Same connection ki transaction rollback par balances100/40 rahenge; successful commit par70/70. Total140 invariant dono outcomes mein bachta hai.
- Catch — Auto-commit ya different connections se debit independently durable ho sakta hai; timeout after commit ke liye operation identity/reconciliation alag chahiye.

## Recall aur practice

- Sawal — PreparedStatement mein ORDER BY ? user-chosen column ko safely replace karega?
- Jawaab — Parameter value bind hoti hai, SQL identifier nahi; allowed column names ko fixed query fragments se map karo.
- Khud try karo — Account transfer same connection/transaction par likho; insufficient funds, second-write failure aur duplicate operation ID par invariant verify karo.

## Practice questions

### Easy · SQL injection

```java
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
ResultSet rs = statement.executeQuery(sql);
```

`email = "' OR '1'='1"` par kya hoga? Fix?

<details>
<summary>Answer</summary>

- Attack — query `WHERE email = '' OR '1'='1'` ban jaati hai → saare users.
- Fix:

```java
try (PreparedStatement ps = conn.prepareStatement("SELECT id, email FROM users WHERE email = ?")) {
    ps.setString(1, email);
    try (ResultSet rs = ps.executeQuery()) { /* ... */ }
}
```

- Placeholders — values data rehti hain, SQL code nahi. Table/column names bind nahi hote; unke liye allowlist.

</details>

### Easy · `NULL` comparison

```sql
SELECT * FROM users WHERE phone = NULL;
SELECT COUNT(*), COUNT(phone) FROM users;
```

<details>
<summary>Answer</summary>

- Pehli query — 0 rows; `NULL = NULL` unknown hai, true nahi. `WHERE phone IS NULL` likho.
- `COUNT(*)` — saari rows; `COUNT(phone)` — sirf non-null phones.
- Three-valued logic — `TRUE`, `FALSE`, `UNKNOWN`; `WHERE` sirf `TRUE` rows rakhta hai.

</details>

### Medium · JDBC transaction se transfer

Do accounts ke beech transfer likho jo dono updates ek saath commit kare ya kuch nahi.

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

- Conditional debit — `balance >= ?` check aur update ek atomic statement mein; read-then-write race nahi.
- Row count — 0 rows = rule toota → rollback.
- Pool — connection wapas pool mein jaati hai; pool usually autocommit reset karta hai, par manually restore karna safe habit hai.

</details>

### Medium · Lost update

Do requests ek saath stock `10` padhte hain, dono `9` likhte hain. Do fixes batao.

<details>
<summary>Answer</summary>

- Atomic update — `UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0`; row count se success check.
- Pessimistic lock — transaction mein `SELECT stock FROM products WHERE id = ? FOR UPDATE`, phir update.
- Optimistic — `version` column: `UPDATE ... SET stock = ?, version = version + 1 WHERE id = ? AND version = ?`; 0 rows par retry.
- Isolation note — PostgreSQL default Read Committed is race ko apne aap nahi rokta.

</details>

### Hard · Connection pool exhaustion

Load par requests `Connection is not available, request timed out after 30000ms` deti hain, jabki DB CPU low hai. Causes aur fixes?

<details>
<summary>Answer</summary>

- Leak — error path par connection close nahi hui; try-with-resources use karo, HikariCP `leakDetectionThreshold` on karo.
- Long transactions — transaction ke andar HTTP call/file upload connection pakad kar rakhta hai; external work transaction ke bahar.
- Pool sizing — pool size × app instances DB `max_connections` se kam; bada pool hamesha fast nahi.
- Commit unknown — commit timeout par result pata nahi; client retry ke liye idempotency key ya status check rakho.

</details>

## Sources — aur padhne ke liye

- [PostgreSQL — transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

- [JDBC transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- [Prepared statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/13-jdbc-sql.md)
