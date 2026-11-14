---
id: java-observability-actuator
title: Observability with Actuator, metrics and tracing
track: spring-boot
order: 9
level: Advanced
minutes: 3
summary: Actuator — operational endpoints such as health and metrics.
tags: actuator, observability, metrics, tracing, logging
---

## Quick revision

> Revision target — Diagnose a user symptom from the latency distribution, the request trace and resource saturation.

- Actuator — operational endpoints such as health/metrics.
- Liveness — does the process need a restart? Readiness — can it receive traffic?
- Metrics — measure rate, errors, latency and saturation.
- Trace — correlate the cross-service spans of a request.
- Logs — structured context; keep the request ID, not secrets.
- Cardinality — do not make a user/request ID an unbounded metric label.
- SLO — a user-visible reliability target; keep alerts actionable.
- Endpoint security — keep the exposure/auth of management endpoints explicit.
- Histogram — the latency distribution/percentiles; an average can hide the slow tail.
- Trace sampling — controls overhead/storage; plan for visibility of rare failures.
- Health dependency — do not restart the whole instance unnecessarily because an optional dependency is down.

### Edge cases and reasoning

- Probe storm — turning a shared downstream outage into a liveness failure on every instance can cause a restart storm; distinguish process health from dependency readiness.
- Latency scope — include server processing and pool/queue wait; end-user latency is not only the controller duration.
- Trace context trust — validate/bound external correlation headers; do not turn user-supplied IDs into unrestricted logs/metric labels.

## Understand it with an example

- Scenario — A request takes total900ms: DB connection wait750ms, query100ms, the remaining processing50ms.
- Reasoning — Optimizing the controller's business logic does not remove the main wait; inspect the pool wait, active connections and transaction duration. Compare the timings within the same request scope.
- Catch — Blindly increasing the pool size can add to database overload; an average alone hides the slow tail, and request IDs in metric labels bring unbounded cardinality.

## Recall and practice

- Question — If the average is 50ms, is a fast experience guaranteed for p99 users?
- Answer — No; the slow tail can hide in the average. Inspect histograms/percentiles, errors and saturation together.
- Try it yourself — Outline a dashboard for a slow-DB incident; identify pool wait, error rate, request latency and readiness, and give a secret-free trace example.

## Practice questions

### Easy · Liveness vs readiness

The database is down. Should the liveness probe fail, or readiness?

<details>
<summary>Answer</summary>

- Readiness — yes; take the instance out of traffic.
- Liveness — no; a restart will not bring the DB back, and instead all the pods end up in a restart loop (a probe storm).
- Liveness — fail only when the process itself is stuck/unrecoverable (a deadlock).

</details>

### Easy · Exposing Actuator endpoints

<details>
<summary>Answer</summary>

- Do not make them public — `env`, `heapdump`, `threaddump`, `configprops` can leak secrets/internal data.
- Config — `management.endpoints.web.exposure.include=health,info,prometheus`.
- Isolation — a separate management port/network and authentication.

</details>

### Medium · Memory explodes from metric tags

```java
meterRegistry.counter("orders.placed", "userId", userId).increment();
```

<details>
<summary>Answer</summary>

- Cardinality — every unique `userId` is a new time series; memory and monitoring cost explode.
- Fix — bounded tags (`status`, `paymentMethod`, `region`); per-user analysis belongs in logs/events.
- HTTP metrics — the URI template (`/orders/{id}`) in the tag, not the raw path.

</details>

### Medium · Average latency is fine, users are complaining

<details>
<summary>Answer</summary>

- Average — hides the slow tail (99 fast + 1 very slow).
- Percentiles — p95/p99 from a histogram (`management.metrics.distribution.percentiles-histogram.http.server.requests=true`).
- SLO — e.g. "99% requests < 300ms over 30 days"; alerting from the error budget.
- Scope — look endpoint by endpoint; fast endpoints such as health checks pull the average down.

</details>

### Hard · The traceId is missing in async work

Request logs have the traceId, but the logs from `@Async` and `CompletableFuture` do not. Why, and the fix?

<details>
<summary>Answer</summary>

- Why — trace context (and the MDC) is thread-local; a new thread does not get it automatically.
- Fix — a context-propagating executor: Micrometer context propagation (`ContextExecutorService` / a task decorator) or Spring's configured `TaskDecorator`.
- Trust — do not use trace headers from the public internet for security decisions; the server decides the sampling policy.

</details>

## Sources — further reading

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Micrometer concepts](https://docs.micrometer.io/micrometer/reference/concepts.html)
- [Spring Boot Kubernetes probes](https://docs.spring.io/spring-boot/reference/actuator/kubernetes-probes.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/09-observability-actuator.md)
