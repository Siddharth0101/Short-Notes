---
id: spring-boot-first-application
title: Spring Boot first application and project structure
track: spring-boot
order: 1
level: Intermediate
minutes: 2
summary: Spring — manages objects and their dependencies; Boot simplifies setup and configuration.
tags: spring, boot, startup
---

## Quick revision

> Revision target — Understand startup as a flow of the classpath, the scan boundary and conditional bean wiring.

- Spring — manages objects and their dependencies; Boot simplifies setup/configuration.
- Starter — a convenient bundle of related dependencies.
- `@SpringBootApplication` — combines configuration, auto-configuration and component scan.
- Component scan — by default scans the main class's package and its subpackages.
- Auto-configuration — conditional setup based on the classpath/properties/beans.
- Startup failure — read the root cause: a missing bean, a port conflict or invalid config.
- Application context — the container for bean definitions, creation and dependency wiring.
- Embedded server — a Boot web app can run the HTTP server inside its own process.
- Condition report — shows why an auto-configuration matched or backed off; look at it when diagnosing startup.

### Edge cases and reasoning

- Auto-config backoff — an explicit user bean can replace a conditional default or make it back off; the presence of a dependency alone does not prove the exact configuration.
- Startup sequence — container readiness is different from being business-ready; define a readiness gate for required migrations/dependencies.
- Package placement — if the main class sits in a very narrow package, sibling beans are missed; keep scan boundaries intentional.

## Understand it with an example

- Scenario — The main class is in package `app.web` and the service is in package `app.service`; the controller cannot find the service bean.
- Reasoning — The default scan looks at the main package and its subpackages; a sibling service package can be missed. Keeping the main class in the common parent `app` is a clear structure.
- Catch — The presence of an annotation alone does not prove bean creation; inspect the profile, conditions and explicit scan settings too. Take the root cause of the error from the startup log.

## Recall and practice

- Question — Why can a bean be missing even though the service class has the annotation?
- Answer — The class can be outside the scan boundary/profile/condition; inspect the package placement and the condition report.
- Try it yourself — Start a controller-service app; tell the failures of a missing bean, an occupied port and an excluded profile apart by their root cause.

## Practice questions

### Easy · Why is the controller returning 404?

The main class is `com.shop.app.ShopApplication` and the controller is `com.shop.api.ProductController`. `/products` returns 404.

<details>
<summary>Answer</summary>

- Why — `@SpringBootApplication` scans only its own package (`com.shop.app`) and sub-packages; `com.shop.api` is a sibling.
- Fix — keep the main class in the root package `com.shop` (recommended), or use `scanBasePackages = "com.shop"`.
- Check — whether the mapping shows up in the startup log/`/actuator/mappings`.

</details>

### Easy · What is inside `@SpringBootApplication`?

<details>
<summary>Answer</summary>

- `@SpringBootConfiguration` — this class is a configuration source (like `@Configuration`).
- `@EnableAutoConfiguration` — configures defaults (DataSource, web server, Jackson) by looking at the classpath and existing beans.
- `@ComponentScan` — finds `@Component`, `@Service`, `@RestController` etc. under this package.

</details>

### Medium · "Failed to configure a DataSource"

The app stops starting as soon as you add `spring-boot-starter-data-jpa`: `'url' attribute is not specified`. Why, and what are the options?

<details>
<summary>Answer</summary>

- Why — once the JPA starter is on the classpath, Boot wants to auto-configure a DataSource; it found neither a URL nor an embedded DB.
- Fix — provide `spring.datasource.url/username/password` + the driver dependency.
- Or — if you really do not need a DB, remove the dependency (an exclusion is the last resort).
- Debug — the condition evaluation report from `--debug`: which auto-config ran or was skipped, and why.

</details>

### Medium · Defined your own `DataSource` bean, settings ignored

You defined `@Bean DataSource dataSource()` yourself. Now `spring.datasource.hikari.maximum-pool-size` has no effect. Why?

<details>
<summary>Answer</summary>

- Back-off — Boot's auto-config is `@ConditionalOnMissingBean`; as soon as it finds your bean, Boot does not create its own bean (or its property binding).
- Fix — if you do not need the custom bean, remove it; if you do, bind it yourself: `@ConfigurationProperties("spring.datasource.hikari")` on the bean method.
- Lesson — replacing auto-config is all-or-nothing; try properties/customizers first.

</details>

### Hard · Where do you write one-time work at startup?

You need to warm a cache and ensure a default admin user exists. Which do you choose from `@PostConstruct`, `ApplicationRunner` and `ApplicationReadyEvent`?

<details>
<summary>Answer</summary>

- `@PostConstruct` — only that bean's own initialization; other beans/transactions/proxies may not be ready yet, so do no heavy work.
- `ApplicationRunner` — the context is fully ready, roughly before the server starts; fine for idempotent setup (an admin user upsert). If it fails, startup fails.
- `ApplicationReadyEvent` — the app is ready for traffic; for background warmup (async).
- Multi-instance — every instance will run it; make it idempotent or use a DB lock/lease.

</details>

## Sources — further reading

- [Official reference yahan padho](https://spring.io/guides/gs/spring-boot/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/01-first-application.md)
