---
id: spring-configuration
title: Configuration properties profiles and startup failures
track: spring-boot
order: 3
level: Intermediate
minutes: 16
summary: Bind typed settings and diagnose environment overrides.
tags: spring, configuration, profiles
---

## Mental model

Same application artifact ko local aur production mein different settings chahiye. Configuration code ke bahar values supply karti hai; profiles related settings ya beans activate karte hain. Har issue ko profile bana dena unnecessary combinations create karta hai. Prefer a small explicit set of deployment inputs.

> **Core takeaway:** Bind related settings into a typed object and verify the effective value after overrides.

## Bind a small settings group

Application excerpt using Java 21 and Spring Boot's ConfigurationProperties support. Save the public record in its own file with your application's package declaration. Enable scanning by adding `@ConfigurationPropertiesScan` to the application class and its import from `org.springframework.boot.context.properties`.

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import java.time.Duration;

@ConfigurationProperties(prefix = "study")
public record StudyProperties(int pageSize, Duration requestTimeout) {
    public StudyProperties {
        if (pageSize < 1 || pageSize > 100) {
            throw new IllegalArgumentException("pageSize must be 1..100");
        }
        if (requestTimeout == null || requestTimeout.isNegative()
                || requestTimeout.isZero()) {
            throw new IllegalArgumentException("requestTimeout must be positive");
        }
    }
}
```

```text
# src/main/resources/application.properties
study.page-size=20
study.request-timeout=2s
```

Inject StudyProperties through a service constructor. The record groups related values and prevents arbitrary reassignment. The duration is only a value: an HTTP client will not automatically use it unless your client construction explicitly applies it.

## Trace an override

For ordinary launches, command-line options override environment variables, which override packaged configuration data. Boot has additional property sources for tests and other contexts; do not mistake this simplified example for the entire precedence list.

With the file above, `STUDY_PAGESIZE=40` supplies 40. Adding `--study.page-size=60` to the launch supplies 60. Boot's environment-variable conversion removes hyphens, replaces dots with underscores and uppercases the name. Inspect the effective configuration safely when debugging; avoid dumping secrets into logs.

## Profiles and secrets

Put local development settings in `application-local.properties` and activate local intentionally through `spring.profiles.active`. Keep sensible non-secret defaults in the base file. Do not commit database passwords or signing keys; inject them through your deployment's secret mechanism. A profile name alone provides no security boundary.

Fail startup for missing required settings instead of discovering them during a customer request. This example validates in the record constructor. Bean Validation can also validate configuration properties when its dependency and Validated annotation are configured. A typo that leaves a required value unset should produce a clear configuration failure.

## Practice

Run with page sizes 1, 100 and 101. Expect the first two to bind and the last to fail startup. Change request-timeout to 500ms and explain why the record carries a Duration instead of an ambiguous integer.

## Revision and practice lab

**Recall:** Does declaring a timeout property configure every outbound client?

**Apply:** The file says 20, the environment says 40 and the command line says 60. Determine the value, then remove the command-line override and predict the next launch.

> **Hint:** Trace sources in increasing precedence.

**Answer guide — compare after attempting:** The first launch uses 60 and the next uses 40. Both pass validation. A configured duration has no networking effect until client setup consumes it. Separate binding tests from behavior tests for that reason.

**Exit check:** Explain a safe way to diagnose an unexpected page size without printing credentials.

## Sources

[Official reference](https://docs.spring.io/spring-boot/reference/features/external-config.html).
