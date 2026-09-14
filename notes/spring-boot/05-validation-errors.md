---
id: spring-validation-errors
title: Request DTOs validation and consistent API errors
track: spring-boot
order: 5
level: Intermediate
minutes: 16
summary: Separate malformed input business rules and authorization failures.
tags: spring, validation, errors
---

## Mental model

HTTP boundary par incoming JSON ko trusted domain object mat samjho. Pehle shape aur field constraints validate karo, phir authorization aur business invariants enforce karo. Valid email ya nonblank title ka matlab user ko resource edit karne ka permission nahi mil gaya.

> **Core takeaway:** Validate transport input before business work, and keep database invariants and authorization as separate checks.

## Validate a request DTO

Application excerpts for Spring MVC with the validation dependency selected for your Boot version. Boot 3+ uses jakarta.validation imports. Each public record belongs in its own file with the application package declaration.

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLessonRequest(
    @NotBlank @Size(max = 120) String title
) {}
```

Controller method excerpt; requires an injected LessonService and a LessonResponse DTO defined by your application:

```java
@PostMapping("/api/lessons")
ResponseEntity<LessonResponse> create(
        @Valid @RequestBody CreateLessonRequest request) {
    LessonResponse result = lessons.create(request.title());
    return ResponseEntity.created(URI.create("/api/lessons/" + result.id()))
            .body(result);
}
```

Use imports from `org.springframework.web.bind.annotation`, `org.springframework.http.ResponseEntity`, `jakarta.validation.Valid` and `java.net.URI`. The validation provider must be on the classpath. Valid triggers validation of the bound request before normal method execution. The response DTO deliberately exposes only contract fields, not the whole persistence entity.

## Distinguish failure paths

Malformed JSON fails during message conversion. Well-formed JSON with a blank title fails Bean Validation. A duplicate unique database key can fail after field validation; concurrent requests can both pass an application-level existence check. The database constraint remains authoritative for uniqueness.

Map expected failures centrally using RestControllerAdvice and ExceptionHandler. In MVC, argument validation and method validation may raise different exceptions depending on the method signature. Handle the relevant paths instead of catching every exception and returning 400. Unexpected defects deserve a server error and internal diagnostics.

A useful public error schema has a stable code, safe message, field violations and a correlation identifier. Do not return SQL text, stack traces or rejected secret values. Choose and document whether inaccessible resources return 403 or a deliberately indistinguishable 404.

## Specify the HTTP contract

Use 201 with a Location header when creation succeeds. Use 400 for this API's malformed or invalid input policy, 404 for a missing resource and 409 for a known state conflict. A GET must not create a lesson as a side effect. A retry of POST may duplicate creation unless you design a separate idempotency mechanism; validation does not solve retries.

## Practice

Write request cases for blank title, absent title, 121 characters, malformed JSON and a valid title. For each, state the status and whether the service should execute. Add a duplicate-key case that reaches the database and receives a controlled conflict.

## Revision and practice lab

**Recall:** Why does a unique-title existence check fail under concurrency?

**Apply:** Two requests check that a title is absent, then both insert it. Require at most one durable row and a useful response for the loser.

> **Hint:** The reads do not reserve the value.

**Answer guide — compare after attempting:** Enforce the unique constraint in the database. One insertion succeeds; translate the specifically recognized constraint failure into the documented conflict response. Do not classify every integrity failure as the same conflict, and do not continue using a failed transaction.

**Exit check:** Explain why field validation, ownership checks and database constraints each remain necessary.

## Sources

[Official reference](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html).
