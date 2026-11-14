---
id: spring-deployment-capstone
title: Package deploy and defend a Spring Boot capstone
track: spring-boot
order: 10
level: Intermediate
minutes: 3
summary: Artifact — promote the same tested build across environments.
tags: spring, deployment, capstone
---

## Quick revision

> Revision target — Plan a deployment around a tested artifact, readiness and the drain of accepted work.

- Artifact — promote the same tested build across environments.
- Container — the application + runtime package; do not bake secrets into the image.
- Configuration — inject it from the environment; validate at startup.
- Readiness — give traffic only once it is ready.
- Graceful shutdown — drain traffic, wait for in-flight work and close resources.
- Deployment — a small rollout, health checks and a rollback plan.
- Capstone — verify validation, auth, transactions, duplicate retries and recovery.
- Resource limits — align the container memory/CPU budget with JVM/application usage.
- Image tag — identify the exact deployed artifact by an immutable version/digest.
- Smoke check — after a release, verify a critical route + persistence + the dependency path.

### Docker basics

- Image/container — a packaged filesystem/runtime template and its running instance.
- Dockerfile — the build recipe; a smaller trusted base and a layered cache are useful.
- Network — containers communicate by service names; localhost is the current container.
- Volume — persistent data separate from the container lifecycle.
- Compose — defines related services/config/network as a local stack.

### Edge cases and reasoning

- Shutdown ordering — align readiness withdrawal/traffic drain with the termination grace period; plan a bounded completion of accepted work before the process is killed.
- Schema rollback boundary — an app image rollback does not undo a destructive migration; verify old/new schema compatibility before the rollout.
- Container JVM budget — headroom beyond the heap for metaspace/stacks/direct memory; choose the exact budget from load evidence.

## Understand it with an example

- Scenario — The new container process has started, but a required migration is still incomplete; the load balancer is ready to send traffic.
- Reasoning — The readiness gate should stay false until the required initialization is done. Take traffic once ready; on shutdown, withdraw readiness and give in-flight work a bounded completion.
- Catch — A live process is not a business-ready one; avoid an unnecessary restart storm on an optional dependency issue, and verify old/new schema compatibility first.

## Recall and practice

- Question — Will a dropped database column come back automatically when the old container image is restored?
- Answer — No; the artifact and the data/schema have independent lifecycles. You need a compatible migration or a separately rehearsed recovery.
- Try it yourself — Run a capstone release checklist; define acceptance for invalid config, a readiness delay, an in-flight shutdown and a prior image with an upgraded schema.

## Practice questions

### Easy · Production Dockerfile

<details>
<summary>Answer</summary>

```dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY . .
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
RUN useradd --system app
USER app
COPY --from=build /src/target/app.jar /app/app.jar
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=70", "-jar", "/app/app.jar"]
```

- Multi-stage — no JDK/source in the final image, only the JRE + jar.
- Non-root user — a smaller impact from a container escape.
- Tests — run them in a separate step in CI; skipping them in the image build is fine.

</details>

### Easy · Deploying from the `:latest` tag

<details>
<summary>Answer</summary>

- Problem — you do not know which code is running; rollback and reproduction are hard; nodes can pull different images.
- Fix — an immutable tag (git SHA/version) or an image digest (`@sha256:...`).

</details>

### Medium · The DB will not connect in Docker Compose

The app container uses `jdbc:postgresql://localhost:5432/shop` and fails.

<details>
<summary>Answer</summary>

- Why — inside a container, `localhost` is the app container itself.
- Fix — the compose service name: `jdbc:postgresql://db:5432/shop`.
- Startup order — `depends_on: db: condition: service_healthy` + a DB healthcheck; connection retries in the app too.

</details>

### Medium · Requests fail on deploy

During a rolling deploy some requests return `502`. How do you shut down gracefully?

<details>
<summary>Answer</summary>

- Spring — `server.shutdown=graceful` (the default in newer versions) + `spring.lifecycle.timeout-per-shutdown-phase=20s`; in-flight requests finish.
- Kubernetes — on SIGTERM fail readiness first, allow time for the load balancer to remove the pod (a `preStop` sleep), and `terminationGracePeriodSeconds` > the shutdown timeout.
- Jobs — a stop signal and a drain for background workers too.

</details>

### Hard · A safe deploy and rollback with a schema change

Release v2 removes the `orders.status` column. A bug is found after the deploy and you have to roll back to v1. What can go wrong, and what is the right plan?

<details>
<summary>Answer</summary>

- Problem — v1 still reads `status`; once the column is dropped, an app rollback will not bring it back.
- Plan — expand/contract: v2 only adds the new schema and stays compatible with the old one; the drop comes several releases later.
- Rule — an app rollback brings back code, not data/schema; test every migration with "will it run with version N-1?".
- Release — a smoke check, a staged rollout, monitoring, and rollback steps written in advance.

</details>

## Sources — further reading

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/10-deployment-capstone.md)
