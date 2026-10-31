---
id: spring-validation-errors
title: Request DTOs validation and consistent API errors
track: spring-boot
order: 5
level: Intermediate
minutes: 2
summary: `@Valid` — bound input par validation trigger karta hai.
tags: spring, validation, errors
---

## Quick revision

> Revision target — Binding, field validation aur persisted business conflict ke error owners alag karo.

- `@Valid` — bound input par validation trigger karta hai.
- Constraint — `@NotNull`, `@Size` jaise rules DTO par rakho.
- Business validation — cross-record/state rules service/database mein enforce karo.
- `@RestControllerAdvice` — centralized exception-to-response mapping.
- Error response — stable code, safe message, field details aur correlation ID.
- Security — stack trace, SQL ya secret client ko mat bhejo.
- Nested validation — child DTO validation ke liye appropriate cascaded validation lagao.
- Constraint combination — size limit alone null reject nahi karta; requiredness separate define karo.
- Error taxonomy — validation, missing resource, conflict aur internal failure ke stable codes alag rakho.

### Edge cases aur reasoning

- Validation versus binding — malformed JSON/type conversion bean constraints se pehle fail ho sakti; consistent safe response mapping rakho.
- Cross-field DTO — start<=end jaise input relationship class-level/custom validation se; persisted invariant DB/service par bhi protect karo.
- Error stability — client ko machine-readable code do; localized/human message ko branching key mat banao.

## Example se samjho

- Scenario — Booking request mein start date end se later hai; alag request ka JSON malformed hai.
- Reasoning — Valid JSON ka reversed range cross-field validation reject kare; malformed JSON binding/parsing boundary par reject ho. Dono safe, stable error shape return karein.
- Catch — Client ko message text parse karwaane ke bajay error code do; input validation pass hone ke baad concurrent booking conflict phir bhi possible hai.

## Recall aur practice

- Sawal — @Size(min=1) ke saath nullable value reject automatically hogi?
- Jawaab — Normally null requiredness alag constraint se enforce; @NotNull/@NotBlank ka chosen type/semantics verify karo.
- Khud try karo — Date-range DTO validate karo; malformed JSON, null child, reversed range aur DB conflict ke stable safe error shapes verify karo.

## Practice questions

### Easy · Constraints ignore ho rahi hain

```java
record CreateUser(@NotBlank String name, @Email String email) {}
@PostMapping("/users") void create(@RequestBody CreateUser body) { ... }
```

Empty name bhi accept ho raha hai. Kyun?

<details>
<summary>Answer</summary>

- Missing `@Valid` — `@Valid @RequestBody CreateUser body` likho.
- Dependency — `spring-boot-starter-validation` classpath par honi chahiye.
- `@Email` — null allow karta hai; required ho toh `@NotBlank` bhi saath mein.

</details>

### Easy · `@NotNull` vs `@NotEmpty` vs `@NotBlank`

<details>
<summary>Answer</summary>

- `@NotNull` — sirf null reject; `""` aur `"  "` pass.
- `@NotEmpty` — null aur empty (`""`, empty list) reject; `"  "` pass.
- `@NotBlank` — strings ke liye; null, empty aur whitespace-only teeno reject.

</details>

### Medium · Nested objects validate nahi ho rahe

```java
record OrderRequest(@NotEmpty List<Item> items) {}
record Item(@NotBlank String sku, @Positive int qty) {}
```

`qty: -2` wala item pass ho raha hai.

<details>
<summary>Answer</summary>

- Cascade nahi hota — nested elements par validation ke liye `@Valid` chahiye.
- Fix — `record OrderRequest(@NotEmpty List<@Valid Item> items) {}`.
- Error path — field error `items[0].qty` jaisa aayega; client ko exact field dikha sakte ho.

</details>

### Medium · Consistent error response

Saari APIs ek format mein errors dein: validation par field list, unknown error par stack trace leak nahi.

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

- `ProblemDetail` — RFC 9457 standard shape (`type`, `title`, `status`, `detail`).
- Stable contract — clients `type`/error code par depend karein, message text par nahi.
- Security — internal exception messages/stack traces response mein nahi, logs mein (request id ke saath).

</details>

### Hard · Cross-field aur business validation

Booking request: `startDate` < `endDate`, aur email already registered na ho. Dono kahan validate karoge?

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

- Cross-field — DTO level (`@AssertTrue` ya custom class-level constraint); null case doosri constraint par chhodo.
- Business rule (unique email) — service mein, DB state chahiye; `409 Conflict`.
- Race — do requests ek saath check pass kar sakti hain; DB unique constraint final guard, uska violation bhi `409` mein map karo.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/05-validation-errors.md)
