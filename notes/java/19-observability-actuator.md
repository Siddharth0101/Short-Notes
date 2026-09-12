---
id: java-observability-actuator
title: Observability with Actuator, metrics and tracing
track: java
order: 19
level: Advanced
minutes: 18
summary: Health checks, metrics aur distributed tracing se production service ka andar dekho.
tags: actuator, observability, metrics, tracing, logging
---

## Mental model

Ek service "working" hai ya nahi, yeh sirf uske apne process ke andar se pata nahi chalta — usse externally observable banana padta hai. Observability teen pillars par khadi hoti hai: logs (kya hua, discrete events), metrics (kitna/kitni baar, aggregated numbers over time), aur traces (ek request ka poora journey multiple services ke through). Spring Boot Actuator health/metrics endpoints ready-made deta hai; production readiness ka matlab hai in signals ko correctly configure karna, sirf feature ko "on" kar dena nahi.

## Health checks: liveness versus readiness

```java
@Component
class DatabaseHealthIndicator implements HealthIndicator {
    private final DataSource dataSource;
    DatabaseHealthIndicator(DataSource dataSource) { this.dataSource = dataSource; }

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(2)
                ? Health.up().withDetail("database", "reachable").build()
                : Health.down().withDetail("database", "not responding").build();
        } catch (SQLException e) {
            return Health.down(e).build();
        }
    }
}
```

Actuator `/actuator/health` endpoint registered `HealthIndicator` beans ko aggregate karta hai. Kubernetes jaisa orchestrator do alag questions poochta hai: **liveness** ("kya process itna stuck/broken hai ki restart karna chahiye?") aur **readiness** ("kya yeh instance abhi traffic serve karne ke liye ready hai?"). Inhe conflate karna dangerous hai — agar database temporarily unreachable ho aur liveness check usse "down" report kare, orchestrator service ko baar-baar restart karega jab restart se database wapas nahi aayega; readiness check usi signal ko sahi tarike se use karega taaki traffic us instance par route na ho jab tak dependency wapas na aaye, bina unnecessary restart ke. Spring Boot `management.endpoint.health.probes.enabled=true` se in dono ko `/actuator/health/liveness` aur `/actuator/health/readiness` par separately expose kar sakta hai.

## Metrics with Micrometer

```java
@Service
class OrderService {
    private final Counter ordersCreated;
    private final Timer checkoutTimer;

    OrderService(MeterRegistry registry) {
        this.ordersCreated = Counter.builder("orders.created").register(registry);
        this.checkoutTimer = Timer.builder("orders.checkout.duration").register(registry);
    }

    Order checkout(Cart cart) {
        return checkoutTimer.record(() -> {
            Order order = createOrder(cart);
            ordersCreated.increment();
            return order;
        });
    }
}
```

Micrometer ek vendor-neutral facade hai — same code Prometheus, Datadog ya CloudWatch mein se kisi ko bhi metrics export kar sakta hai, backend switch karne par business code change nahi karna padta. `Counter` sirf badhta hai (total orders created), `Timer` duration distribution track karta hai (p50/p95/p99 latency), aur `Gauge` current value snapshot deta hai (jaise active connections). Metric names aur tags consistent rakhna important hai — high-cardinality tags (jaise raw user ID ko tag bana dena) metrics backend ko overload kar sakte hain kyunki har unique tag combination apna alag time series banata hai.

## Structured logging and correlation IDs

```java
@Component
class CorrelationIdFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {
        String correlationId = Optional.ofNullable(request.getHeader("X-Correlation-Id"))
            .orElse(UUID.randomUUID().toString());
        MDC.put("correlationId", correlationId);
        try {
            response.setHeader("X-Correlation-Id", correlationId);
            chain.doFilter(request, response);
        } finally {
            MDC.clear(); // must run even on exception — same discipline as chapter 6's ThreadLocal cleanup
        }
    }
}
```

`MDC` (Mapped Diagnostic Context) SLF4J ka thread-local-backed mechanism hai jo current request ka context (correlation ID, user ID) log pattern mein automatically inject karta hai bina har log statement mein manually pass kiye. Yeh chapter 6 ke ThreadLocal cleanup discipline ka hi ek concrete application hai: pooled thread agla unrelated request serve karega, isliye `finally` block mein `MDC.clear()` zaroori hai warna correlation ID cross-request leak ho sakta hai. Distributed tracing (Micrometer Tracing + Zipkin/Jaeger) isi correlation ID concept ko multiple services ke across extend karta hai — ek trace ID poore request journey (gateway to order-service to notification-worker) ko jodta hai, taaki ek slow request ko sirf logs se nahi, ek unified timeline se debug kiya ja sake.

## Common mistakes

- **Wrong assumption:** Liveness aur readiness probe ko same health check se serve karna theek hai — "service ya toh healthy hai ya nahi". **Why it breaks:** Ek temporary downstream dependency failure (database slow, cache unreachable) readiness ke liye valid "not ready" signal hai, but liveness ke liye nahi — process khud crash nahi hua, restart karne se problem solve nahi hogi, balki restart loop create ho sakta hai jab dependency recover hone mein thoda time le. **Fix:** Liveness ko sirf process-level health (deadlock, unrecoverable state) ke liye rakho; readiness mein external dependencies check karo.
- **Wrong assumption:** `/actuator/**` endpoints ko default configuration ke saath production mein expose karna safe hai. **Why it breaks:** Kuch actuator endpoints (jaise `/actuator/env`, `/actuator/heapdump`) sensitive configuration values aur memory contents expose kar sakte hain — bina authentication/authorization ke publicly accessible hone par yeh credentials leak ya information disclosure vulnerability ban sakta hai. **Fix:** Sirf zaroori endpoints (`health`, `info`, `metrics`) expose karo (`management.endpoints.web.exposure.include`), aur actuator endpoints ko bhi Spring Security se authenticate/authorize karo jaise kisi normal API ko karte.
- **Wrong assumption:** High-cardinality tags (jaise raw user ID ya request path with IDs) metrics mein daalna zyada detail dene ke liye acha idea hai. **Why it breaks:** Har unique tag-value combination metrics backend mein apna alag time series banata hai — lakhon unique user IDs tag banane se metrics storage explode ho sakta hai aur query performance degrade ho sakti hai, jise "cardinality explosion" bolte hain. **Fix:** High-cardinality values ko logs/traces mein rakho (jahan per-event storage acceptable hai), metrics tags ko bounded low-cardinality dimensions (status code, endpoint template, region) tak limit karo.

## In a real backend service

Production incident response mein yeh teeno signals ek saath use hote hain: metrics dashboard se pehle symptom dikhta hai (p99 latency spike, error rate badha), traces se pata chalta hai kaunsi service/call slow hai, aur logs (correlation ID se filtered) us specific request ka exact failure detail dete hain. Kubernetes readiness probes rolling deployments ko safe banate hain — naya pod tab tak traffic nahi paata jab tak uska readiness check pass na ho, isliye ek slow-starting application (JIT warmup, connection pool initialization) bina readiness probe ke deployment ke turant baad failed requests serve kar sakti hai.

## Interview questions

**What's the difference between a liveness and a readiness probe?** Liveness poochta hai "kya process itna broken hai ki restart chahiye" — fail hone par orchestrator container restart karta hai. Readiness poochta hai "kya yeh instance abhi traffic handle karne ke liye ready hai" — fail hone par orchestrator sirf traffic route karna rok deta hai, restart nahi karta. Dono ko same check se serve karna galat restart loops create kar sakta hai.

**Why use a vendor-neutral metrics facade like Micrometer instead of calling a vendor SDK directly?** Business code metrics-backend-agnostic rehta hai — Prometheus se Datadog switch karne par sirf configuration/dependency change hoti hai, application code same rehta hai. Yeh wahi abstraction principle hai jo SLF4J logging backends ke saath karta hai.

**Why must MDC be cleared after each request?** Application servers threads ko pool karke reuse karte hain. MDC thread-local storage use karta hai, isliye agar ek request ke baad `MDC.clear()` na kiya jaaye, agla unrelated request usi pooled thread par chalne par pichhle request ka correlation ID/context dikha sakta hai — logs cross-request context ke saath corrupt ho jaate hain.

## Practice

Ek `HealthIndicator` likho jo external HTTP dependency (jaise payment gateway) ko ping kare, aur usse readiness probe mein include karo but liveness mein nahi — reasoning likho ki kyun. Phir ek checkout flow par `Counter` aur `Timer` add karo, load test chalao, aur p95 latency dekho. Last mein correlation-ID filter likho, do concurrent requests simulate karo, aur verify karo ki dono ke logs alag-alag correlation IDs carry karte hain bina cross-contamination ke.

## Capstone: observable inventory reservation API

Implement reserve, confirm, and release operations around an explicit reservation state machine. Store inventory and reservation transitions durably. Decide how reservation expiry interacts with a concurrent confirmation before writing the endpoint.

### Acceptance criteria

- With one item left and twenty simultaneous reservation attempts, at most one succeeds and stock never becomes negative.
- Repeating a request with its idempotency key returns the same logical reservation; key reuse with changed intent is rejected.
- Confirmation racing expiry has a defined winner enforced at the write boundary.
- A database integration test exercises the actual isolation/locking strategy with separate concurrent transactions.
- Metrics separate HTTP time, pool wait, and query time. Traces connect the request to its database operation without leaking credentials.
- A slow downstream dependency has a deadline and bounded concurrency. Document what the caller observes on overload.

### Interview defense

Explain the invariant, transaction boundary, and recovery after a commit followed by a lost response. Compare a conditional update, pessimistic lock, and optimistic version check. Provide measured conflict and latency results under contention. A successful HTTP response alone does not prove race safety.

## Sources
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Micrometer concepts](https://docs.micrometer.io/micrometer/reference/concepts.html)
- [Spring Boot Kubernetes probes](https://docs.spring.io/spring-boot/reference/actuator/kubernetes-probes.html)
