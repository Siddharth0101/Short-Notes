# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Batch updates and connection pool sizing

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

## Isolation levels in practice

```java
connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
```

## Schema and query reasoning

```sql
SELECT id, title
FROM notes
WHERE owner_id = ? AND archived = false
ORDER BY updated_at DESC, id DESC
LIMIT 20;
```
