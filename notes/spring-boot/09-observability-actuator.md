---
id: java-observability-actuator
title: Observability with Actuator, metrics and tracing
track: spring-boot
order: 9
level: Advanced
minutes: 1
summary: Actuator — health/metrics jaise operational endpoints.
tags: actuator, observability, metrics, tracing, logging
---

## Quick revision

- Actuator — health/metrics jaise operational endpoints.
- Liveness — process ko restart chahiye? Readiness — traffic receive kar sakta hai?
- Metrics — rate, errors, latency aur saturation measure karo.
- Trace — request ke cross-service spans correlate karo.
- Logs — structured context; request ID rakho, secrets nahi.
- Cardinality — user/request ID ko unbounded metric label mat banao.
- SLO — user-visible reliability target; actionable alerts rakho.
- Endpoint security — management endpoints ka exposure/auth explicit rakho.

## Sources — aur padhne ke liye

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Micrometer concepts](https://docs.micrometer.io/micrometer/reference/concepts.html)
- [Spring Boot Kubernetes probes](https://docs.spring.io/spring-boot/reference/actuator/kubernetes-probes.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/09-observability-actuator.md)
