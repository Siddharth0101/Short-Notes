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

## Recall aur practice

- Sawal — Body aur close dono throw karein toh try-with-resources kis error ko primary rakhega?
- Jawaab — Body exception primary; close exception suppressed list mein attach ho sakti hai, diagnostic mein dono inspect karo.
- Khud try karo — UTF-8 file reader banao; missing file, invalid path aur parse failure par resource cleanup; fixed Clock se expiry boundary verify karo.

## Sources — aur padhne ke liye

- [Exception guide](https://dev.java/learn/exceptions/)
- [Files API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)
- [Date and time API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/09-exceptions-io-time.md)
