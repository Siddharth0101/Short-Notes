---
id: java-jdbc-sql
title: JDBC SQL and transaction boundaries
track: java
order: 13
level: Intermediate
minutes: 22
summary: Transaction related DB changes ko group karti hai; resource cleanup aur safe parameter binding phir bhi alag responsibilities hain.
tags: jdbc, sql, transactions, indexes
---

## Mental model — simple soch

JDBC Java application aur relational database ke beech standard interface hai. Connection transaction context carry karti hai; PreparedStatement parameterized SQL execute karta hai; ResultSet returned rows traverse karta hai. ORM use karne par bhi SQL, constraints and transaction semantics disappear nahi hote.

> **Core takeaway:** Transaction related DB changes ko group karti hai; resource cleanup aur safe parameter binding phir bhi alag responsibilities hain.

## Parameterized access

```java
static Optional<String> findTitle(DataSource source, long id)
        throws SQLException {
    String sql = "SELECT title FROM notes WHERE id = ?";
    try (Connection connection = source.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setLong(1, id);
        try (ResultSet rows = statement.executeQuery()) {
            return rows.next()
                ? Optional.of(rows.getString("title"))
                : Optional.empty();
        }
    }
}
```

Example assume karta hai title NOT NULL hai. Nullability database schema aur Java return type mein align karo. Bound parameters values ko SQL syntax se separate rakhte hain. Table names and sort directions generally parameters nahi ban sakte; user-selected identifiers allowlist se map karo.

## Atomic changes

Single business operation multiple statements involve kar sakti hai. Auto-commit default mode mein statements individually commit ho sakte hain. Explicit JDBC transaction mein auto-commit disable karke all statements run karo, success par commit, failure par rollback. Pool ko connection return karne se pehle library/pool ownership rules follow karo. [JDBC transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)

Money transfer ke liye two row updates ko transaction mein group karna necessary hai; sufficient design mein balance constraint, currency, affected-row checks and concurrent operation isolation bhi chahiye. Java double amount monetary exactness guarantee nahi deta. SQL DECIMAL or explicit minor-unit integer choose karo with clear rounding/range rules.

## Batch updates and connection pool sizing

Loop mein ek-ek row insert karna, har baar network round trip karta hai — bade datasets ke liye significant overhead:

```java
String sql = "INSERT INTO audit_log (event, occurred_at) VALUES (?, ?)";
try (Connection connection = source.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    connection.setAutoCommit(false);
    for (AuditEvent event : events) {
        statement.setString(1, event.name());
        statement.setTimestamp(2, Timestamp.from(event.occurredAt()));
        statement.addBatch();
    }
    statement.executeBatch(); // one round trip for the whole batch
    connection.commit();
}
```

`addBatch`/`executeBatch` multiple statements ko ek network round trip mein batch karta hai, jo high-latency connections par bada difference laata hai. Connection pool (jaise HikariCP) sizing ek common misconfiguration source hai: pool size ko "jitna zyada utna better" samajhna galat hai — database ke apne max connection limit aur available CPU cores usse zyada concurrent connections ko efficiently serve nahi kar paate, aur oversized pool actual throughput ko degrade kar sakta hai due to context switching aur lock contention on the database side. Standard starting heuristic: pool size ko database server ke available cores ke close range mein rakho, phir load test se tune karo.

## Isolation levels in practice

```java
connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
```

Default isolation level database-dependent hota hai (PostgreSQL/Oracle: READ COMMITTED; MySQL InnoDB: REPEATABLE READ). READ COMMITTED mein ek transaction sirf committed data dekhta hai, lekin same transaction ke andar do baar same row read karne se different values mil sakte hain (non-repeatable read) agar beech mein koi aur transaction commit kar de. Higher isolation (SERIALIZABLE) yeh anomalies prevent karta hai but throughput cost aur retry-on-conflict complexity ke saath. Isolation level ko business requirement ke against choose karo — har jagah SERIALIZABLE lagana default-safe nahi, unnecessary contention aur transaction retries la sakta hai.

## Schema and query reasoning

Primary key identity establish karti hai; unique constraint duplicates prevent karta hai; foreign key references protect karti hai. App-side "check then insert" concurrent duplicate requests se race kar sakta hai, isliye database constraint final authority rakho. Index write/storage cost ke exchange mein selected access patterns accelerate karta hai.

```sql
SELECT id, title
FROM notes
WHERE owner_id = ? AND archived = false
ORDER BY updated_at DESC, id DESC
LIMIT 20;
```

Index choice predicate selectivity, ordering and database capabilities pe depend karegi. Query plan inspect karo; every column pe independent index create karna automatic solution nahi. Pagination mein unique tie-breaker stable order deta hai. Large offsets increasingly rows skip kar sakte hain, so suitable cursor/keyset pagination evaluate karo.

## Common traps

N+1 database round trips high network latency mein expensive hote hain. Unbounded result loading memory exhaust kar sakti hai. Connection pool ko huge karna database throughput guaranteed improve nahi karta. Transaction ke andar slow HTTP calls locks and connections unnecessarily hold kar sakti hain. SQL exception code ko blindly retry mat karo; constraint violation usually transient nahi.

- **Wrong assumption:** Column names/sort direction ko user input se accept karke bhi PreparedStatement placeholder se bind kar sakte hain. **Why it breaks:** JDBC placeholders (`?`) sirf values bind kar sakte hain, SQL identifiers (table/column names, ORDER BY direction) nahi — un values ko directly string-concatenate karna padta hai, jo SQL injection ka path khol deta hai agar unvalidated user input directly wahan chala jaaye. **Fix:** User-selected sort column/direction ko ek fixed allowlist (enum/switch) ke against validate karo, phir allowlist se resolved literal string use karo — kabhi raw user input concatenate mat karo.
- **Wrong assumption:** `try { insert(); } catch (SQLException e) { retry(); }` sabhi database errors ke liye reasonable recovery hai. **Why it breaks:** Unique-constraint violation ek retry se apne aap fix nahi hogi — wahi duplicate row phir se insert karne ki koshish hogi aur phir fail hoga; sirf transient errors (connection drop, deadlock victim chosen by DB) retry se recover hote hain. **Fix:** SQLState/error code check karo — constraint violations ko user-facing "already exists" response mein translate karo, sirf genuinely transient errors ko bounded retry do.
- **Wrong assumption:** Batch insert ke andar ek row fail ho jaaye toh sirf wahi row skip hoke baaki commit ho jayenge. **Why it breaks:** Default JDBC batch execution mein ek statement fail hone par `BatchUpdateException` throw hoti hai aur transaction ka behavior driver-dependent hota hai — bina explicit per-row error handling ke, poori batch ka outcome ambiguous ho sakta hai. **Fix:** `getUpdateCounts()` se partial results inspect karo, ya critical batches ko chhote sub-batches mein split karke per-batch commit/rollback boundary rakho.

## In a real backend service

Registration/checkout flows mein unique-constraint race condition ek classic interview-worthy production bug hai: do concurrent requests same username/email check karte hain, dono "available" dekhte hain, dono insert try karte hain — database unique constraint hi final authority banta hai, aur application ko us constraint violation ko gracefully "already taken" response mein translate karna padta hai. Connection pool metrics (active connections, wait time, timeout count) production dashboards mein standard health signals hain jo slow queries ya undersized pool jaldi flag kar dete hain.

## Interview questions — bolkar practice karo

**PreparedStatement versus Statement?** PreparedStatement values bind karta hai, SQL injection risk reduce karta hai and database/driver-dependent planning reuse enable kar sakta hai. It does not sanitize dynamically concatenated SQL identifiers.

**What does isolation protect?** Concurrent transactions ka observable behavior constrain karta hai. Exact anomalies and guarantees chosen level plus database implementation par depend karte hain; transactions magically serial execution nahi banati.

**Why doesn't a bigger connection pool always mean better throughput?** Database server ke apne finite CPU cores aur max-connections limit hote hain. Pool ko database capacity se zyada bada banane se concurrent queries ke beech contention aur context-switching cost badh jaati hai, jo net throughput ko improve karne ki bajaye degrade kar sakta hai.

## Practice

Unique username registration implement karo and two concurrent identical requests test karo. One write intentionally fail karke rollback verify karo. Real database query plan se list endpoint ka index justify karo. Phir 500 rows ko one-by-one insert versus batch insert se compare karo aur round-trip count/latency difference measure karo.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Transfer mein ek row debit hui, doosri credit karte waqt failure aayi. Persisted balances kya hone chahiye? SQL injection kaise avoid karoge?

> **Hint:** Dono updates ek transaction mein aur values bound parameters se bhejo.

**Answer guide — compare after attempting:** Failure par rollback original balances restore kare; success par dono commit hon. Prepared statements se IDs/amount bind karo. Amount validate karo aur affected rows check karo. Sirf connection close karna deliberate commit/rollback ka substitute nahi hai.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [JDBC transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- [Prepared statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)
