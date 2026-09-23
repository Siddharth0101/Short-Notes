---
id: java-maven-testing
title: Maven builds and useful Java tests
track: java
order: 12
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Maven lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [JUnit user guide](https://docs.junit.org/current/user-guide/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/12-maven-testing.md)
