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

> Revision target — User symptom ko latency distribution, request trace aur resource saturation se diagnose karo.

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

## Example se samjho

- Scenario — Request total900ms hai: DB connection wait750ms, query100ms, baaki processing50ms.
- Reasoning — Controller business logic optimize karne se main wait nahi mit-ta; pool wait, active connections aur transaction duration inspect karo. Timings same request scope mein compare karo.
- Catch — Pool size blindly increase karna database overload badha sakta hai; average alone slow tail hide karta, request IDs metric labels mein unbounded cardinality laate hain.

## Recall aur practice

- Sawal — Average 50ms ho toh p99 users ko fast experience guaranteed hai?
- Jawaab — Nahi; slow tail average mein hide ho sakti. Histogram/percentiles, errors aur saturation together inspect karo.
- Khud try karo — DB slow incident ka dashboard outline banao; pool wait, error rate, request latency aur readiness identify, secret-free trace example do.

## Practice questions

### Easy · Liveness vs readiness

Database down hai. Liveness probe fail karna chahiye ya readiness?

<details>
<summary>Answer</summary>

- Readiness — haan; instance ko traffic se hatao.
- Liveness — nahi; restart se DB wapas nahi aayega, ulta saare pods restart loop mein (probe storm).
- Liveness — sirf process khud stuck/unrecoverable ho (deadlock) tab fail.

</details>

### Easy · Actuator endpoints expose karna

<details>
<summary>Answer</summary>

- Public mat karo — `env`, `heapdump`, `threaddump`, `configprops` secrets/internal data leak kar sakte hain.
- Config — `management.endpoints.web.exposure.include=health,info,prometheus`.
- Isolation — alag management port/network aur authentication.

</details>

### Medium · Metric tags se memory explode

```java
meterRegistry.counter("orders.placed", "userId", userId).increment();
```

<details>
<summary>Answer</summary>

- Cardinality — har unique `userId` naya time series; memory aur monitoring cost explode.
- Fix — bounded tags (`status`, `paymentMethod`, `region`); per-user analysis logs/events mein.
- HTTP metrics — URI template (`/orders/{id}`) tag mein, raw path nahi.

</details>

### Medium · Average latency theek, users complain kar rahe hain

<details>
<summary>Answer</summary>

- Average — slow tail chhupa deta hai (99 fast + 1 bahut slow).
- Percentiles — p95/p99 histogram se (`management.metrics.distribution.percentiles-histogram.http.server.requests=true`).
- SLO — e.g. "99% requests < 300ms over 30 days"; error budget se alerting.
- Scope — endpoint-wise dekho; health checks jaise fast endpoints average ko neeche kheench lete hain.

</details>

### Hard · Async kaam mein traceId gayab

Request logs mein traceId hai, par `@Async` aur `CompletableFuture` wale logs mein nahi. Kyun aur fix?

<details>
<summary>Answer</summary>

- Kyun — trace context (aur MDC) thread-local hota hai; naya thread usse automatically nahi paata.
- Fix — context-propagating executor: Micrometer context propagation (`ContextExecutorService` / task decorator) ya Spring ka configured `TaskDecorator`.
- Trust — public internet se aaye trace headers ko security decisions ke liye use mat karo; sampling policy server decide kare.

</details>

## Sources — aur padhne ke liye

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Micrometer concepts](https://docs.micrometer.io/micrometer/reference/concepts.html)
- [Spring Boot Kubernetes probes](https://docs.spring.io/spring-boot/reference/actuator/kubernetes-probes.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/09-observability-actuator.md)
