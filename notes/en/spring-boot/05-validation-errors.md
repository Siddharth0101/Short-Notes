---
id: spring-validation-errors
title: Request DTOs validation and consistent API errors
track: spring-boot
order: 5
level: Intermediate
minutes: 2
summary: `@Valid` — triggers validation on the bound input.
tags: spring, validation, errors
---

## Quick revision

> Revision target — Separate the error owners for binding, field validation and a persisted business conflict.

- `@Valid` — triggers validation on the bound input.
- Constraint — keep rules such as `@NotNull`, `@Size` on the DTO.
- Business validation — enforce cross-record/state rules in the service/database.
- `@RestControllerAdvice` — centralized exception-to-response mapping.
- Error response — a stable code, a safe message, field details and a correlation ID.
- Security — do not send a stack trace, SQL or a secret to the client.
- Nested validation — apply the appropriate cascaded validation to validate a child DTO.
- Constraint combination — a size limit alone does not reject null; define requiredness separately.
- Error taxonomy — keep separate stable codes for validation, a missing resource, a conflict and an internal failure.

### Edge cases and reasoning

- Validation versus binding — malformed JSON/type conversion can fail before bean constraints run; keep a consistent, safe response mapping.
- Cross-field DTO — an input relationship such as start<=end through class-level/custom validation; protect a persisted invariant in the DB/service too.
- Error stability — give the client a machine-readable code; do not make a localized/human message the branching key.

## Understand it with an example

- Scenario — In a booking request the start date is later than the end; a different request has malformed JSON.
- Reasoning — Cross-field validation should reject a reversed range in valid JSON; malformed JSON should be rejected at the binding/parsing boundary. Both should return a safe, stable error shape.
- Catch — Give the client an error code instead of making it parse message text; a concurrent booking conflict is still possible after input validation passes.

## Recall and practice

- Question — Will a nullable value be rejected automatically with @Size(min=1)?
- Answer — Normally null requiredness is enforced by a separate constraint; verify the chosen type/semantics of @NotNull/@NotBlank.
- Try it yourself — Validate a date-range DTO; verify stable, safe error shapes for malformed JSON, a null child, a reversed range and a DB conflict.

## Practice questions

### Easy · Constraints are being ignored

```java
record CreateUser(@NotBlank String name, @Email String email) {}
@PostMapping("/users") void create(@RequestBody CreateUser body) { ... }
```

Even an empty name is accepted. Why?

<details>
<summary>Answer</summary>

- Missing `@Valid` — write `@Valid @RequestBody CreateUser body`.
- Dependency — `spring-boot-starter-validation` must be on the classpath.
- `@Email` — allows null; if the field is required, add `@NotBlank` alongside it.

</details>

### Easy · `@NotNull` vs `@NotEmpty` vs `@NotBlank`

<details>
<summary>Answer</summary>

- `@NotNull` — rejects only null; `""` and `"  "` pass.
- `@NotEmpty` — rejects null and empty (`""`, an empty list); `"  "` passes.
- `@NotBlank` — for strings; rejects all three of null, empty and whitespace-only.

</details>

### Medium · Nested objects are not being validated

```java
record OrderRequest(@NotEmpty List<Item> items) {}
record Item(@NotBlank String sku, @Positive int qty) {}
```

An item with `qty: -2` is passing.

<details>
<summary>Answer</summary>

- No cascade — validating nested elements needs `@Valid`.
- Fix — `record OrderRequest(@NotEmpty List<@Valid Item> items) {}`.
- Error path — the field error will look like `items[0].qty`; you can show the client the exact field.

</details>

### Medium · Consistent error response

All APIs should return errors in one format: a field list on validation, no stack trace leak on an unknown error.

<details>
<summary>Answer</summary>

```java
@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalid(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
            .map(e -> Map.of("field", e.getField(), "message", e.getDefaultMessage()))
            .toList());
        return pd;
    }
    @ExceptionHandler(Exception.class)
    ProblemDetail unexpected(Exception ex) {
        log.error("Unhandled error", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}
```

- `ProblemDetail` — the RFC 9457 standard shape (`type`, `title`, `status`, `detail`).
- Stable contract — clients should depend on the `type`/error code, not on the message text.
- Security — internal exception messages/stack traces go in the logs (with a request id), not in the response.

</details>

### Hard · Cross-field and business validation

A booking request: `startDate` < `endDate`, and the email must not already be registered. Where do you validate each?

<details>
<summary>Answer</summary>

```java
record BookingRequest(@NotNull LocalDate startDate, @NotNull LocalDate endDate) {
    @AssertTrue(message = "endDate must be after startDate")
    boolean isRangeValid() {
        return startDate == null || endDate == null || endDate.isAfter(startDate);
    }
}
```

- Cross-field — at the DTO level (`@AssertTrue` or a custom class-level constraint); leave the null case to another constraint.
- Business rule (unique email) — in the service, since it needs DB state; `409 Conflict`.
- Race — two requests can pass the check at the same time; the DB unique constraint is the final guard, and map its violation to `409` too.

</details>

## Sources — further reading

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/05-validation-errors.md)
