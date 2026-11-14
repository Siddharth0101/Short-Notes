---
id: java-exceptions-io-time
title: Exceptions resources files and time
track: java
order: 9
level: Intermediate
minutes: 3
summary: Checked exception — catch it or declare it; unchecked — can be a runtime contract failure.
tags: exceptions, io, time, resources
---

## Quick revision

> Revision target — Keep resource cleanup after a failure, and date/expiry behaviour, deterministic.

- Checked exception — catch it or declare it; unchecked — can be a runtime contract failure.
- `throw` — raises an exception; `throws` — declares it in the method contract.
- Try-with-resources — closes AutoCloseable resources reliably.
- `finally` — cleanup; do not mask the original result with a return/throw.
- I/O — streams for bytes; a charset-aware reader/writer for text.
- Path/Files — filesystem operations; handle missing-file and permission errors.
- `Instant` — a timestamp; `LocalDate` — a date; `ZonedDateTime` — a date/time with a timezone.
- Exception handling — give useful context, do not log secrets, do not swallow a failure silently.
- Suppressed exception — a try-with-resources cleanup failure can be attached to the main exception.
- Charset — an explicit encoding for byte/text conversion; do not depend blindly on the platform default.
- Duration/Period — an elapsed time-based amount / a calendar date-based amount.

### Edge cases and reasoning

- Resource close order — try-with-resources closes in the reverse order of the declarations; inspect suppressed cleanup errors along with the primary error.
- Filesystem containment — normalize a user filename and verify the approved directory boundary; string concatenation is not enough to stop path traversal.
- Injected clock — a Clock dependency makes date/expiry tests deterministic; keep the timezone explicit.

## Understand it with an example

- Scenario — A report reader opens a file, an exception occurs while parsing, and the close operation fails too.
- Reasoning — Try-with-resources keeps the parse error as the primary one; the cleanup failure can be found in the suppressed diagnostics. The reader's close is still attempted.
- Catch — A new return/throw in finally can hide the original failure; preserve the useful cause, and do not dump sensitive file content into the logs.

## Recall and practice

- Question — If both the body and close throw, which error does try-with-resources keep as the primary one?
- Answer — The body's exception is primary; the close exception can be attached to the suppressed list, so inspect both when diagnosing.
- Try it yourself — Build a UTF-8 file reader; verify resource cleanup on a missing file, an invalid path and a parse failure, and the expiry boundary with a fixed Clock.

## Practice questions

### Easy · Checked vs unchecked

`Files.readString(path)` gives a compiler error, `Integer.parseInt(s)` does not. Why?

<details>
<summary>Answer</summary>

- `IOException` — checked; the caller has to `try/catch` it or declare `throws`.
- `NumberFormatException` — a `RuntimeException` (unchecked); declaring it is not required.
- Rule — recoverable external failures (I/O) are checked; programming/input bugs are often unchecked.

</details>

### Easy · try-with-resources

<details>
<summary>Answer</summary>

```java
try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
    return reader.readLine();
}
```

- Auto close — `close()` as soon as the block ends (normally or by exception); no need to write a `finally`.
- Requirement — the resource must be `AutoCloseable`.
- Multiple resources — they close in the reverse order of declaration.

</details>

### Medium · Suppressed exception

The resource's body throws `IllegalStateException` and `close()` throws `IOException`. Which exception does the caller get?

<details>
<summary>Answer</summary>

- Primary — the body's `IllegalStateException`.
- The one from `close()` — attached to the primary's `getSuppressed()`, not lost.
- In an old `try/finally` — the exception from `finally` overwrote the original; this is a big advantage of try-with-resources.

</details>

### Medium · `Period` vs `Duration` across DST

You have to schedule an event for "tomorrow at this same time", the timezone is `Europe/Berlin`, and a DST change falls in between. `plus(Duration.ofHours(24))` or `plus(Period.ofDays(1))`?

<details>
<summary>Answer</summary>

- `Period.ofDays(1)` on `ZonedDateTime` — a calendar day; the local time stays the same (e.g. 09:00 → 09:00).
- `Duration.ofHours(24)` — exactly 24 hours; on a DST day the local time can become 08:00 or 10:00.
- Store — timestamps as an `Instant` (UTC); a `ZonedDateTime` with the zone for user display/scheduling.

</details>

### Hard · Avoid path traversal

```java
Path file = Paths.get("/srv/uploads", request.getParameter("name"));
return Files.readAllBytes(file);
```

What happens with `name=../../etc/passwd`? Write a safe version.

<details>
<summary>Answer</summary>

```java
Path base = Paths.get("/srv/uploads").toRealPath();
Path target = base.resolve(name).normalize();
if (!target.startsWith(base)) throw new SecurityException("invalid path");
Path real = target.toRealPath(); // resolve the symlink
if (!real.startsWith(base)) throw new SecurityException("invalid path");
return Files.readAllBytes(real);
```

- Attack — `..` segments escape the base folder.
- `normalize` + `startsWith` — check at the `Path` level (not string `startsWith`, otherwise `/srv/uploads-old` would pass).
- Symlink — check the real path behind the link with `toRealPath`.
- Better — give the user a file id, not a name; the server maps the id to a path.

</details>

## Sources — further reading

- [Exception guide](https://dev.java/learn/exceptions/)
- [Files API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)
- [Date and time API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/09-exceptions-io-time.md)
