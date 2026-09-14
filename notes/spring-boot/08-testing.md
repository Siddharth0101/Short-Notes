---
id: spring-testing
title: Spring Boot unit slice and integration testing
track: spring-boot
order: 8
level: Intermediate
minutes: 16
summary: Choose tests by the boundary and prove failures as well as success.
tags: spring, testing, integration
---

## Mental model

Test ka scope us failure ke according choose karo jo detect karna hai. Pure Java unit test business decisions check karta hai. MVC slice request binding aur HTTP responses check karti hai. Integration test wiring aur real infrastructure behavior check karta hai. Har test mein full application load karna coverage ka proof nahi hai.

> **Core takeaway:** Test each important boundary with the smallest setup that can expose its real failure.

## Start without Spring

JUnit Jupiter example. Place in src/test/java in a Maven project with JUnit support, such as the generated Boot test setup. This complete small example needs no application context or database.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PagePolicyTest {
    static int boundedSize(int requested) {
        if (requested < 1) throw new IllegalArgumentException("positive size required");
        return Math.min(requested, 100);
    }
    @Test void capsLargePages() { assertEquals(100, boundedSize(500)); }
    @Test void preservesSmallPages() { assertEquals(20, boundedSize(20)); }
    @Test void rejectsZero() {
        assertThrows(IllegalArgumentException.class, () -> boundedSize(0));
    }
}
```

Run `./mvnw test`. These assertions prove the three decisions, but they cannot prove the controller calls this policy. In an application, move the policy to production code and test that actual implementation rather than duplicating it in the test.

## Verify the web boundary

Use WebMvcTest for controller-focused testing with MockMvc, providing controlled collaborators for the service. Verify malformed input, field validation, response JSON and error advice. When security is present, configure an appropriate test identity and test rejection deliberately. An unexpected 401 can occur before the controller, so a status-only assertion may test the wrong layer.

Boot 4 reorganized focused testing modules and packages. Use the imports and test dependencies for your selected Boot version. Do not mix Boot 3 WebMvcTest import paths with a Boot 4 project. The official test reference explains the appropriate module layout; conceptually, the slice should load only the relevant web infrastructure.

## Test persistence and full requests

A repository slice helps verify mapping and query behavior. For PostgreSQL-specific SQL, locking and constraints, use a PostgreSQL test instance such as a managed Testcontainers database rather than assuming an in-memory substitute behaves identically.

A SpringBootTest with a random server port can exercise real HTTP, serialization and application wiring. Requests execute on server threads; a transaction around the test method does not automatically roll back a separate server request. Clean data explicitly, isolate test databases or design unique fixtures. Avoid assertions that depend on test execution order.

## Practice

Create a test plan for a lesson creation endpoint: one domain rule test, one invalid-request slice test, one unique-constraint database test and one HTTP success test. Name the bug each detects. Prefer observable outcomes over verifying every internal call.

## Revision and practice lab

**Recall:** Can a mocked repository prove a SQL unique constraint exists?

**Apply:** A random-port HTTP test leaves rows behind despite Transactional on the test. Explain the mechanism and make repeated runs independent.

> **Hint:** Compare the test thread with the server thread.

**Answer guide — compare after attempting:** The HTTP handler commits its own transaction on a different thread. Use an isolated database or explicit cleanup and unique fixture identifiers. Add a second run to verify isolation. A passing assertion with leftover state is not a reliable test suite.

**Exit check:** Choose the minimum valid test scope for malformed JSON, a business calculation and a row-lock race.

## Sources

[Official reference](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html).
