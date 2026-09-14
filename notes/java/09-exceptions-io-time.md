---
id: java-exceptions-io-time
title: Exceptions resources files and time
track: java
order: 9
level: Intermediate
minutes: 17
summary: Resource ka owner decide karta hai use kaun close karega; exception aane par bhi cleanup hona chahiye.
tags: exceptions, io, time, resources
---

## Mental model — simple soch

Exception ek failed operation ka structured signal hai. Caller ko decide karna hota hai ki recover karna possible hai, retry meaningful hai, ya error translate karke boundary par return karna hai. Har catch block mein print karke continue karna failure ko success jaisa bana deta hai. Resource cleanup correctness ka part hai, garbage collector ka replacement task nahi.

> **Core takeaway:** Resource ka owner decide karta hai use kaun close karega; exception aane par bhi cleanup hona chahiye.

## Exception contracts

Checked exceptions catch ya declare karne padte hain. RuntimeException subclasses unchecked hain. Checked ka matlab recoverable aur unchecked ka matlab programmer bug automatically nahi; API designer contract choose karta hai. `throw` exception raise karta hai, `throws` method signature mein possibility declare karta hai. Catch most-specific exceptions pehle rakho. Original cause preserve karo so debugging mein root failure lost na ho. [Exception guide](https://dev.java/learn/exceptions/)

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

`Files.lines` lazy stream hai jo open file resource hold karta hai; try-with-resources zaroori hai. Huge file ke liye `.toList()` saari lines retain karega, isliye streaming consumer better ho sakta hai. File API choose karte waqt memory budget aur file size dono reason karo.

## Custom exceptions and chaining

Domain-specific exception caller ko meaningful recovery option deta hai, generic `RuntimeException` se better. Exception class mein `cause`-accepting constructor rakho aur exception translate karte waqt hamesha usi ko use karo:

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

Agar naya exception original cause attach kiye bina throw hota, log mein sirf "failed to load note" dikhega — root SQL error (constraint violation? timeout? connection refused?) lost ho jayega. `getCause()` chain hamesha preserve karo jab exception translate/wrap karo.

## Resource ownership

Try-with-resources `AutoCloseable` resources ko reverse declaration order mein close karta hai. Main body aur close dono fail hon toh close failure suppressed exception ho sakti hai. Streams from in-memory collections normally resource-backed nahi hote; file streams alag case hain. Borrowed JDBC connection ka close pool ko return kar sakta hai, physical TCP close zaroori nahi.

```java
try (var reader = Files.newBufferedReader(source);
     var writer = Files.newBufferedWriter(destination)) {
    reader.transferTo(writer);
} // writer closes first, then reader — reverse of declaration order
```

Multiple resources ek try-with-resources mein declare karne se dono guaranteed close hote hain even if `transferTo` throw kare beech mein — manual nested try/finally likhne se yeh guarantee easily miss ho jaati hai, especially jab pehla resource close karna bhool jaate hain kyunki dusre resource ki exception pehle throw ho jaati hai.

Exception ko har layer mein log mat karo. Boundary par request ID ke saath once log karo; inner layer domain context add kar sakti hai. Passwords, tokens aur personal content error messages mein include mat karo. User-facing response actionable ho, internal stack trace server logs mein rahe.

## Date and time

`Instant` timeline point represent karta hai. `LocalDate` calendar date hai, timezone nahi. `LocalDateTime` ko global instant samajhna ambiguous hai because daylight-saving transitions gaps aur duplicates create kar sakte hain. `ZonedDateTime` zone rules include karta hai. Elapsed durations ke liye `Duration`, calendar date differences ke liye `Period` use karo.

Business deadline calculation mein injected `Clock` use karoge toh deterministic tests easy honge. Wall-clock timestamp event reporting ke liye useful hai; operation duration measure karne ke liye monotonic `System.nanoTime()` difference use karo.

```java
static boolean isExpired(Instant issuedAt, Duration ttl, Clock clock) {
    return Instant.now(clock).isAfter(issuedAt.plus(ttl));
}

// production: isExpired(token.issuedAt(), Duration.ofMinutes(15), Clock.systemUTC());
// test: isExpired(fixedIssuedAt, Duration.ofMinutes(15), Clock.fixed(justAfterExpiry, ZoneOffset.UTC));
```

`Clock` inject karne se expiry test ko real 15-minute wait ki zaroorat nahi; fixed clock se boundary (exactly at expiry, one second before/after) deterministically test ho sakti hai. Same design database "created at" timestamps aur scheduled-job logic mein bhi repeat hota hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `LocalDateTime.now()` ko directly database mein store karke different timezone ke servers/clients ke saath consistently compare kiya ja sakta hai. **Why it breaks:** `LocalDateTime` mein timezone information hi nahi hoti; ek server IST mein aur dusra UTC mein `now()` call kare toh dono values direct comparison mein galat honge, aur daylight-saving transition wale din same local time do baar ya kabhi bhi occur nahi karti. **Fix:** Storage aur cross-system comparison ke liye `Instant` (ya UTC `ZonedDateTime`) use karo; `LocalDateTime` sirf timezone-agnostic user-facing display/input ke liye rakho.
- **Wrong assumption:** Do dates ke beech din count karne ke liye `Duration` sahi tool hai. **Why it breaks:** `Duration` exact elapsed time (seconds/nanos) measure karta hai, calendar-aware nahi hota. Daylight-saving transition wale din `Duration.between(startOfDay, endOfDay)` 24 hours nahi dega — 23 ya 25 hours de sakta hai. **Fix:** Calendar date differences (days, months, years) ke liye `Period` use karo; sirf elapsed wall-clock/instant duration ke liye `Duration`.
- **Wrong assumption:** `catch (Exception e) { log.error(e); }` likh dena failure ko "handle" kar deta hai. **Why it breaks:** Yeh sirf exception ko swallow karta hai — caller ko pata hi nahi chalta ki operation fail hui, aur code aage successful path jaisa continue karta hai, potentially inconsistent state ke saath. **Fix:** Ya toh exception ko meaningful recovery ke saath handle karo, ya translate karke re-throw karo; silent swallow sirf tab acceptable hai jab failure genuinely optional/best-effort ho (jaise analytics event).

## In a real backend service

Payment/order APIs mein exception translation exactly is pattern se dikhti hai: repository layer ka `SQLException`/`DataAccessException` service layer mein domain exception (`OrderNotFoundException`, `InsufficientStockException`) mein wrap hota hai, aur `@RestControllerAdvice` (chapter 10) usse HTTP status mein map karta hai. Cause chain preserve karna production debugging mein root cause ke liye critical hota hai — sirf top-level message se root SQL/network issue identify karna mushkil hota hai.

## Interview questions — bolkar practice karo

**Does finally always run?** Ordinary control flow mein usually yes, lekin JVM termination, crash ya abrupt process kill cleanup guarantee nahi deta. Finally se return karna original return/exception suppress kar sakta hai, isliye avoid karo.

**Why not catch Exception everywhere?** Broad catch intended recovery ko unclear karta hai aur unrelated failures hide kar sakta hai. Catch wahan karo jahan recovery, translation ya final reporting meaningful ho.

**Why is Instant preferred over LocalDateTime for storage?** `Instant` timezone-independent single point on the timeline hai, isliye alag timezones ke servers/clients same value ko consistently interpret karte hain. `LocalDateTime` ambiguous hoti hai without an attached zone, especially daylight-saving transitions ke around.

## Practice

UTF-8 file importer banao. Invalid row number ke saath error report karo. Fixed Clock se midnight-boundary test likho, phir Europe/Berlin daylight-saving day par 24-hour duration aur one-day calendar addition compare karo. Phir ek token-expiry checker likho jo injected `Clock` use kare, aur teen tests likho: expiry se pehle, exactly at expiry, aur expiry ke baad.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** File read karte waqt beech mein exception aa gayi. Owned reader close kaise hoga aur caller ko failure kaise pata chalega?

> **Hint:** Aisa construct use karo jo normal aur exceptional exit dono par cleanup kare.

**Answer guide — compare after attempting:** Reader try-with-resources mein kholo. Exception propagate karo ya meaningful context ke saath wrap karo. Success aur failure dono paths check karo. Exception chupakar fake complete result mat do. Caller-owned resource tabhi close karo jab contract ownership transfer karta ho.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Exception guide](https://dev.java/learn/exceptions/)
- [Files API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)
- [Date and time API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)
