---
id: java-exceptions-io-time
title: Exceptions resources files and time
track: java
order: 9
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Exception guide](https://dev.java/learn/exceptions/)
- [Files API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)
- [Date and time API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/09-exceptions-io-time.md)
