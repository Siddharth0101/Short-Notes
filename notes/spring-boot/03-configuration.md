---
id: spring-configuration
title: Configuration properties profiles and startup failures
track: spring-boot
order: 3
level: Intermediate
minutes: 16
summary: Related settings typed object mein bind karo; overrides ke baad effective value verify karo.
tags: spring, configuration, profiles
---

## Mental model — simple soch

Same application artifact ko local aur production mein different settings chahiye. Configuration code ke bahar values supply karti hai; profiles related settings ya beans activate karte hain. Har issue ko profile bana dena unnecessary combinations create karta hai. Prefer a small explicit set of deployment inputs.

> **Core takeaway:** Related settings typed object mein bind karo; overrides ke baad effective value verify karo.

## Bind a small settings group

Java 21 aur Boot ConfigurationProperties ka app excerpt hai. Public record separate file/application package mein rakho. Application class par `@ConfigurationPropertiesScan` aur `org.springframework.boot.context.properties` ka import add karo.

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

StudyProperties service constructor se inject karo. Record related values group aur arbitrary reassignment prevent karta hai. Duration sirf value hai; HTTP client setup explicitly apply karega tab effect hoga.

## Trace an override

Ordinary launch mein command-line environment ko, environment packaged config ko override karta hai. Tests/other contexts mein additional sources hain; yeh simplified list full precedence reference nahi.

Given file ke saath `STUDY_PAGESIZE=40` se 40; `--study.page-size=60` se 60 milega. Env conversion hyphens remove, dots ko underscores aur name uppercase karti hai. Debug mein effective config inspect karo bina secrets logs mein dump kiye.

## Profiles and secrets

Local settings application-local.properties mein aur profile `spring.profiles.active` se intentionally activate karo. Base mein sensible non-secret defaults rakho. Passwords/signing keys deployment secret mechanism se do. Profile name khud security boundary nahi.

Required setting missing ho toh startup fail karo, customer request tak wait nahi. Example record constructor validate karta hai. Correct dependency/Validated setup se Bean Validation bhi use kar sakte ho. Required value unset chhodne wali typo clear config failure de.

## Practice

Page sizes 1,100,101 run karo. First two bind, 101 startup fail hona chahiye. Timeout 500ms karke Duration versus ambiguous integer ka benefit samjhao.

## Revision and practice lab — khud karke samjho

**Recall:** Does declaring a timeout property configure every outbound client?

**Apply:** File mein 20, environment mein 40 aur command line mein 60 hai. Effective value batao; command-line override hata kar next launch predict karo.

> **Hint:** Sources ko lower se higher precedence mein trace karo.

**Answer guide — compare after attempting:** Pehle 60, phir 40 use hoga; dono validation pass karte hain. Configured duration tab tak networking behavior nahi badalti jab tak client setup use apply na kare. Isi liye binding aur actual behavior alag test karo.

**Exit check:** Explain a safe way to diagnose an unexpected page size without printing credentials.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://docs.spring.io/spring-boot/reference/features/external-config.html).
