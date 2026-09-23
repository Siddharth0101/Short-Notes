# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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
