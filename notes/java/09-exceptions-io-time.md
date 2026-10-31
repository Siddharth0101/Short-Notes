---
id: java-exceptions-io-time
title: Exceptions resources files and time
track: java
order: 9
level: Intermediate
minutes: 3
summary: Checked exception — catch ya declare; unchecked — runtime contract failure ho sakti hai.
tags: exceptions, io, time, resources
---

## Quick revision

> Revision target — Failure ke baad resource cleanup aur date/expiry behavior deterministic rakho.

- Checked exception — catch ya declare; unchecked — runtime contract failure ho sakti hai.
- `throw` — exception bhejo; `throws` — method contract mein declare karo.
- Try-with-resources — AutoCloseable resources reliably close karo.
- `finally` — cleanup; return/throw se original result mask mat karo.
- I/O — bytes ke liye streams; text ke liye charset-aware reader/writer.
- Path/Files — filesystem operations; missing file aur permission errors handle karo.
- `Instant` — timestamp; `LocalDate` — date; `ZonedDateTime` — timezone ke saath date/time.
- Exception handling — useful context do, secrets log mat karo, failure silently swallow mat karo.
- Suppressed exception — try-with-resources cleanup failure main exception ke saath attach ho sakti hai.
- Charset — byte/text conversion mein explicit encoding; platform default par blind depend mat karo.
- Duration/Period — elapsed time-based amount / calendar date-based amount.

### Edge cases aur reasoning

- Resource close order — try-with-resources declarations ke reverse order mein close; primary error ke saath suppressed cleanup errors inspect karo.
- Filesystem containment — user filename normalize karke approved directory boundary verify; string concatenation path traversal rokne ke liye enough nahi.
- Injected clock — Clock dependency se date/expiry tests deterministic; timezone explicit rakho.

## Example se samjho

- Scenario — Report reader file kholta hai, parse ke waqt exception aati hai, aur close operation bhi fail hota hai.
- Reasoning — Try-with-resources parse error ko primary rakhta hai; cleanup failure suppressed diagnostics mein mil sakti hai. Reader close attempt phir bhi hota hai.
- Catch — Finally mein naya return/throw original failure chhupa sakta hai; useful cause preserve karo, sensitive file content logs mein mat dump karo.

## Recall aur practice

- Sawal — Body aur close dono throw karein toh try-with-resources kis error ko primary rakhega?
- Jawaab — Body exception primary; close exception suppressed list mein attach ho sakti hai, diagnostic mein dono inspect karo.
- Khud try karo — UTF-8 file reader banao; missing file, invalid path aur parse failure par resource cleanup; fixed Clock se expiry boundary verify karo.

## Practice questions

### Easy · Checked vs unchecked

`Files.readString(path)` par compiler error aata hai, `Integer.parseInt(s)` par nahi. Kyun?

<details>
<summary>Answer</summary>

- `IOException` — checked; caller ko `try/catch` ya `throws` declare karna padta hai.
- `NumberFormatException` — `RuntimeException` (unchecked); declare zaroori nahi.
- Rule — recoverable external failures (I/O) checked; programming/input bugs aksar unchecked.

</details>

### Easy · try-with-resources

<details>
<summary>Answer</summary>

```java
try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
    return reader.readLine();
}
```

- Auto close — block khatam (normal ya exception) hote hi `close()`; `finally` likhne ki zaroorat nahi.
- Requirement — resource `AutoCloseable` ho.
- Multiple resources — declaration ke ulte order mein close hote hain.

</details>

### Medium · Suppressed exception

Resource ka body `IllegalStateException` throw karta hai aur `close()` `IOException`. Caller ko kaunsa exception milega?

<details>
<summary>Answer</summary>

- Primary — body ka `IllegalStateException`.
- `close()` wala — primary ke `getSuppressed()` mein attach hota hai, lost nahi hota.
- Purane `try/finally` mein — `finally` ka exception original ko overwrite kar deta tha; try-with-resources ka yeh bada fayda hai.

</details>

### Medium · `Period` vs `Duration` across DST

Ek event "kal isi time" schedule karna hai, timezone `Europe/Berlin`, aur beech mein DST change hai. `plus(Duration.ofHours(24))` ya `plus(Period.ofDays(1))`?

<details>
<summary>Answer</summary>

- `Period.ofDays(1)` on `ZonedDateTime` — calendar day; local time same rehta hai (e.g. 09:00 → 09:00).
- `Duration.ofHours(24)` — exact 24 hours; DST din par local time 08:00 ya 10:00 ho sakta hai.
- Store — timestamps `Instant` (UTC) mein; user display/scheduling ke liye zone ke saath `ZonedDateTime`.

</details>

### Hard · Path traversal se bacho

```java
Path file = Paths.get("/srv/uploads", request.getParameter("name"));
return Files.readAllBytes(file);
```

`name=../../etc/passwd` par kya hoga? Safe version likho.

<details>
<summary>Answer</summary>

```java
Path base = Paths.get("/srv/uploads").toRealPath();
Path target = base.resolve(name).normalize();
if (!target.startsWith(base)) throw new SecurityException("invalid path");
Path real = target.toRealPath(); // symlink resolve karo
if (!real.startsWith(base)) throw new SecurityException("invalid path");
return Files.readAllBytes(real);
```

- Attack — `..` segments base folder se bahar nikal jaate hain.
- `normalize` + `startsWith` — `Path` level par check (string `startsWith` nahi, warna `/srv/uploads-old` pass ho jaata).
- Symlink — `toRealPath` se link ke peeche ka asli path check.
- Better — user ko file id do, naam nahi; server id se path map kare.

</details>

## Sources — aur padhne ke liye

- [Exception guide](https://dev.java/learn/exceptions/)
- [Files API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)
- [Date and time API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/09-exceptions-io-time.md)
