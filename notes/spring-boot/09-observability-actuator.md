---
id: java-observability-actuator
title: Observability with Actuator, metrics and tracing
track: spring-boot
order: 9
level: Advanced
minutes: 3
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
- Histogram — latency distribution/percentiles; average slow tail hide kar sakta hai.
- Trace sampling — overhead/storage control; rare failures ki visibility plan karo.
- Health dependency — optional dependency down hone se unnecessarily poora instance restart mat karao.

### Edge cases aur reasoning

- Probe storm — shared downstream outage ko every instance liveness failure banaana restart storm de sakta; process health ko dependency readiness se distinguish karo.
- Latency scope — server processing aur pool/queue wait include; end-user latency sirf controller duration nahi.
- Trace context trust — external correlation headers validate/bound; user-supplied IDs ko unrestricted logs/metric labels mat banao.

## Recall aur practice

- Sawal — Average 50ms ho toh p99 users ko fast experience guaranteed hai?
- Jawaab — Nahi; slow tail average mein hide ho sakti. Histogram/percentiles, errors aur saturation together inspect karo.
- Khud try karo — DB slow incident ka dashboard outline banao; pool wait, error rate, request latency aur readiness identify, secret-free trace example do.

## Sources — aur padhne ke liye

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Micrometer concepts](https://docs.micrometer.io/micrometer/reference/concepts.html)
- [Spring Boot Kubernetes probes](https://docs.spring.io/spring-boot/reference/actuator/kubernetes-probes.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/09-observability-actuator.md)
