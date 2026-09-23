# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Exception contracts

```java
static List<String> readTopics(Path path) throws IOException {
    try (var lines = Files.lines(path, StandardCharsets.UTF_8)) {
        return lines
            .map(String::strip)
            .filter(line -> !line.isEmpty())
            .toList();
    }
}
```

## Custom exceptions and chaining

```java
class NoteLoadException extends RuntimeException {
    NoteLoadException(long id, Throwable cause) {
        super("failed to load note " + id, cause);
    }
}

static Note load(long id) {
    try {
        return database.fetch(id);
    } catch (SQLException e) {
        throw new NoteLoadException(id, e); // original SQLException preserved as cause
    }
}
```

## Resource ownership

```java
try (var reader = Files.newBufferedReader(source);
     var writer = Files.newBufferedWriter(destination)) {
    reader.transferTo(writer);
} // writer closes first, then reader — reverse of declaration order
```

## Date and time

```java
static boolean isExpired(Instant issuedAt, Duration ttl, Clock clock) {
    return Instant.now(clock).isAfter(issuedAt.plus(ttl));
}

// production: isExpired(token.issuedAt(), Duration.ofMinutes(15), Clock.systemUTC());
// test: isExpired(fixedIssuedAt, Duration.ofMinutes(15), Clock.fixed(justAfterExpiry, ZoneOffset.UTC));
```
