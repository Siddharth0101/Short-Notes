---
id: spring-validation-errors
title: Request DTOs validation and consistent API errors
track: spring-boot
order: 5
level: Intermediate
minutes: 16
summary: Transport input business work se pehle validate karo; DB invariants aur authorization alag checks hain.
tags: spring, validation, errors
---

## Mental model — simple soch

HTTP boundary par incoming JSON ko trusted domain object mat samjho. Pehle shape aur field constraints validate karo, phir authorization aur business invariants enforce karo. Valid email ya nonblank title ka matlab user ko resource edit karne ka permission nahi mil gaya.

> **Core takeaway:** Transport input business work se pehle validate karo; DB invariants aur authorization alag checks hain.

## Validate a request DTO

Yeh Spring MVC excerpts hain; selected Boot version ki validation dependency chahiye. Boot 3+ jakarta.validation imports use karta hai. Public records separate application-package files mein rakho.

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLessonRequest(
    @NotBlank @Size(max = 120) String title
) {}
```

Controller-method excerpt: app mein injected LessonService aur defined LessonResponse DTO chahiye:

```java
@PostMapping("/api/lessons")
ResponseEntity<LessonResponse> create(
        @Valid @RequestBody CreateLessonRequest request) {
    LessonResponse result = lessons.create(request.title());
    return ResponseEntity.created(URI.create("/api/lessons/" + result.id()))
            .body(result);
}
```

Imports `org.springframework.web.bind.annotation`, `org.springframework.http.ResponseEntity`, `jakarta.validation.Valid`, `java.net.URI` se lo. Validation provider classpath par ho. Valid bound request ko normal method execution se pehle validate karta hai. Response DTO sirf public contract fields expose kare, whole persistence entity nahi.

## Distinguish failure paths

Malformed JSON message conversion mein fail; blank title wala valid JSON Bean Validation mein fail. Duplicate DB key field validation ke baad fail ho sakti hai. Concurrent requests existence check dono pass kar sakti hain; uniqueness ka final authority DB constraint hai.

Expected errors RestControllerAdvice/ExceptionHandler se centrally map karo. MVC argument/method validation signature ke hisaab se different exceptions de sakti hai. Relevant paths handle karo; every exception ko 400 mat banao. Unexpected defect server error/internal diagnostics deserve karta hai.

Public error mein stable code, safe message, field violations aur correlation ID rakho. SQL, stack trace ya rejected secrets expose mat karo. Inaccessible resource ke liye 403 ya deliberately indistinguishable 404 ka contract choose karo.

## Specify the HTTP contract

Creation success par 201 plus Location; is API policy mein malformed/invalid input 400, missing resource 404, known conflict 409. GET lesson create na kare. POST retry duplicate create kar sakti hai unless explicit idempotency design ho; validation retry problem solve nahi karti.

## Practice

Blank/absent title, 121-character title, malformed JSON aur valid title ke cases likho. Status aur service execute honi chahiye ya nahi batao. DB tak pahunchne wala duplicate-key case controlled conflict de.

## Revision and practice lab — khud karke samjho

**Recall:** Why does a unique-title existence check fail under concurrency?

**Apply:** Do requests same title absent dekhkar insert karti hain. Maximum ek durable row aur losing request ko useful response chahiye. Design karo.

> **Hint:** Read value reserve nahi karti; dono checks pass ho sakte hain.

**Answer guide — compare after attempting:** DB unique constraint enforce karo. Ek insert jeete; specifically recognized constraint failure ko documented conflict response mein map karo. Har integrity error ko same conflict mat bolo. Failed transaction mein further work continue mat karo.

**Exit check:** Explain why field validation, ownership checks and database constraints each remain necessary.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html).
