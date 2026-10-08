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

## Recall aur practice

- Sawal — @Size(min=1) ke saath nullable value reject automatically hogi?
- Jawaab — Normally null requiredness alag constraint se enforce; @NotNull/@NotBlank ka chosen type/semantics verify karo.
- Khud try karo — Date-range DTO validate karo; malformed JSON, null child, reversed range aur DB conflict ke stable safe error shapes verify karo.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/05-validation-errors.md)
