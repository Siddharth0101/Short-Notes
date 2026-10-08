---
id: java-maven-testing
title: Maven builds and useful Java tests
track: java
order: 12
level: Intermediate
minutes: 3
summary: Maven — dependencies, build lifecycle aur plugins manage karta hai.
tags: maven, junit, testing, build
---

## Quick revision

- Maven — dependencies, build lifecycle aur plugins manage karta hai.
- `pom.xml` — project/build configuration.
- Lifecycle — compile → test → package → verify; phases earlier phases bhi chalati hain.
- Dependency scope — compile/test/runtime/provided ka classpath behavior alag.
- JUnit — behavior assertions; normal, boundary aur failure cases cover karo.
- Mockito — dependency behavior control; har internal call verify mat karo.
- Integration test — real database/HTTP boundary verify karo.
- Reproducible build — versions pin karo aur clean build verify karo.
- Dependency conflict — transitive versions inspect; effective dependency tree se winner samjho.
- Test double — fake simple implementation, stub canned result, mock interaction expectations.
- Build wrapper — project ka expected Maven version consistently run karne mein useful.

### Edge cases aur reasoning

- Test discovery — lifecycle phase aur plugin naming/config test execution decide; successful package se integration tests run hona assume mat karo.
- Runtime dependency — compile par absent provided dependency deployed runtime ko supply karni hogi; local test classpath production se differ kar sakta hai.
- Assertion intent — failure message/invariant meaningful rakho; implementation ke same calculation se expected result generate mat karo.

## Recall aur practice

- Sawal — Maven package pass ho toh separately configured integration tests guaranteed run hue?
- Jawaab — Nahi; configured plugin/phases inspect karo. Failsafe-style integration verification ke liye verify phase commonly relevant hai.
- Khud try karo — Unit failure aur database integration failure intentional reproduce karo; expected lifecycle command dono ko detect kare aur dependency tree inspect karo.

## Sources — aur padhne ke liye

- [Maven lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [JUnit user guide](https://docs.junit.org/current/user-guide/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/12-maven-testing.md)
