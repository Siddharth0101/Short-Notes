---
id: spring-deployment-capstone
title: Package deploy and defend a Spring Boot capstone
track: spring-boot
order: 10
level: Intermediate
minutes: 16
summary: Ship a notes API with explicit recovery and verification criteria.
tags: spring, deployment, capstone
---

## Mental model

Working locally ek milestone hai, deployment proof nahi. Build artifact, runtime configuration, database changes aur traffic handover sab coordinated hone chahiye. A deployment should preserve data and make failures visible. Is capstone mein existing lessons ko combine karke ek small notes API ship karne ka design aur verification complete karo.

> **Core takeaway:** Deploy a reproducible artifact with explicit configuration, compatible schema changes and observable recovery.

## Package the application

From the generated Maven project, run verification before packaging. The Boot Maven plugin produces an executable application jar when configured by the generated build. Use your actual artifact name in the launch command.

```text
./mvnw verify
java -jar target/study-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

An executable Boot jar includes application dependencies and can start its embedded server. An arbitrary plain jar may not contain that packaging. Confirm the produced artifact starts from a clean working directory so accidental IDE classpath settings do not hide missing dependencies.

For a container, either use the Boot build-image support with an available container daemon or a deliberately maintained Dockerfile. Pin a suitable Java runtime base for the chosen application version, run with a non-root identity where practical, and keep secrets outside the image. Layering can improve rebuild efficiency but does not replace functional validation.

## Coordinate data and traffic

Manage schema changes through versioned migrations. Adding a nullable column before deploying code that writes it can support mixed old/new versions; dropping a column still read by the old version cannot. Plan expand, migrate and contract as separate compatible steps. Restoring the old jar does not reverse a destructive database change.

Readiness determines whether a process should receive traffic; liveness asks whether restarting it is appropriate. Making every external outage a liveness failure can cause restart storms. Configure shutdown so the orchestrator gives requests time to finish, and test a termination signal under load. A container process being alive alone is not evidence that the API can serve correctly.

## Build the notes API

Implement create, list, get and update endpoints using DTOs, validation, service transactions and persistence. Scope rows to the authenticated owner. Bound page sizes and use a deterministic order with an ID tie-breaker. Add optimistic version handling for conflicting updates and a stable error response.

Keep a small operational note with the artifact identity, required configuration names, migration version, health checks and rollback constraints. Record logs that help trace an operation without exposing tokens or private note contents. Use metrics to distinguish HTTP errors, database pool wait and slow queries.

## Practice

Demonstrate a valid create, rejected blank title, forbidden cross-owner access, missing resource, two conflicting updates and persistence across restart. For each case, record the observed HTTP status and durable database outcome. Do not claim success using only controller mocks.

## Revision and practice lab

**Recall:** Why is an application rollback insufficient after dropping a required column?

**Apply:** Design a title-to-heading migration while old and new application versions overlap. Include a failure halfway through rollout and explain how reads stay correct.

> **Hint:** Keep both versions compatible during the transition.

**Answer guide — compare after attempting:** Add the new column, introduce compatible writes, backfill in bounded batches, and verify consistency before moving reads. Maintain a rollback-compatible window before removing old writes and finally dropping the old column. Coordinate concurrent writes with the backfill so it cannot overwrite newer values. This is one defensible design; acceptance requires no lost updates and a tested failure recovery path.

**Exit check:** Present the API, its test evidence and a deployment failure timeline. Explain which changes are reversible and which require data recovery.

## Sources

[Official reference](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html).
