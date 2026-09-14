# Spring Boot — ordered course

[All courses](../README.md)

Before starting: [Maven builds and useful Java tests](../java/12-maven-testing.md) · [JDBC SQL and transaction boundaries](../java/13-jdbc-sql.md) · [Java concurrency under real resource limits](../java/16-concurrency-production.md).

Each chapter includes a core takeaway and a revision lab with a challenge, hint, answer guide and exit check. Use the [study guide](../STUDY_GUIDE.md) for session plans and self-review.

## Stage 1: Start and configure an application

Learn Boot startup, bean wiring and typed configuration.

1. [Spring Boot first application and project structure](01-first-application.md)
2. [Beans constructor injection and lifecycle](02-beans-di.md)
3. [Configuration properties profiles and startup failures](03-configuration.md)

**Stage checkpoint:** Start the application and diagnose a missing bean or invalid setting.

## Stage 2: Build a clear HTTP boundary

Create REST endpoints with DTOs, validation and controlled errors.

4. [Spring dependency injection and REST APIs](04-spring-rest.md)
5. [Request DTOs validation and consistent API errors](05-validation-errors.md)

**Stage checkpoint:** Demonstrate successful creation and rejected input with documented responses.

## Stage 3: Persist and secure business operations

Apply transactions, persistence and authorization boundaries.

6. [JPA Hibernate and Spring transactions](06-jpa-transactions.md)
7. [Spring Security and reliable service boundaries](07-security-microservices.md)

**Stage checkpoint:** Prove an invariant survives concurrent requests and unauthorized access is rejected.

## Stage 4: Verify and operate the service

Test application boundaries, inspect telemetry and complete a deployment capstone.

8. [Spring Boot unit slice and integration testing](08-testing.md)
9. [Observability with Actuator, metrics and tracing](09-observability-actuator.md)
10. [Package deploy and defend a Spring Boot capstone](10-deployment-capstone.md)

**Stage checkpoint:** Run the API acceptance cases and defend a failed deployment recovery plan.
