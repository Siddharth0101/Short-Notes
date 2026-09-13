# Java & Spring — ordered course

[All courses](../README.md)

No prior programming course required. Start with lesson 01.

Each chapter includes a core takeaway and a revision lab with a challenge, hint, answer guide and exit check. Use the [study guide](../STUDY_GUIDE.md) for session plans and self-review.

## Stage 1: Write your first Java programs

Run main, declare variables, make decisions, write methods, and create instances.

1. [First Java program variables and primitive types](01-java-first-program.md)
2. [Java operators decisions and loops](02-java-decisions-loops.md)
3. [Java methods arrays and strings](03-java-methods-arrays.md)
4. [Classes objects constructors and encapsulation](04-java-classes-constructors.md)
5. [Java foundations review and conversion edge cases](05-language-foundations.md)

**Stage checkpoint:** Compile a learner program with two independent objects and a method that processes an array.

## Stage 2: Build a reliable core model

Extend basic classes with OOP, collections, exceptions, streams and memory reasoning.

6. [Objects OOP records and equality](06-object-model.md)
7. [Collections generics and choosing data structures](07-collections-generics.md)
8. [Exceptions resources files and time](08-exceptions-io-time.md)
9. [Lambdas streams and Optional](09-streams-lambdas.md)
10. [JVM memory garbage collection and diagnosis](10-jvm-memory.md)

**Stage checkpoint:** Choose a collection, preserve equality contracts and close an owned resource.

## Stage 3: Build test and persist

Set up builds and tests before database access and SQL concurrency exercises.

11. [Maven builds and useful Java tests](11-maven-testing.md)
12. [JDBC SQL and transaction boundaries](12-jdbc-sql.md)
13. [SQL joins windows and transaction races](13-sql-interview-lab.md)

**Stage checkpoint:** Test a JDBC operation and explain a join and an atomic inventory update.

## Stage 4: Create Spring applications

Move from dependency injection and REST to persistence and security.

14. [Spring dependency injection and REST APIs](14-spring-rest.md)
15. [JPA Hibernate and Spring transactions](15-jpa-transactions.md)
16. [Spring Security and reliable service boundaries](16-security-microservices.md)

**Stage checkpoint:** Implement a validated resource endpoint with a transaction and authorization boundary.

## Stage 5: Operate concurrent services

Study thread safety, resource limits and production signals after the application model.

17. [Concurrency synchronization and virtual threads](17-concurrency.md)
18. [Java concurrency under real resource limits](18-concurrency-production.md)
19. [Observability with Actuator, metrics and tracing](19-observability-actuator.md)

**Stage checkpoint:** Demonstrate a race-safe operation and distinguish pool wait from execution time.
