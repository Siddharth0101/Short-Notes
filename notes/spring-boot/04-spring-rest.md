---
id: java-spring-rest
title: Spring dependency injection and REST APIs
track: spring-boot
order: 4
level: Intermediate
minutes: 23
summary: DI collaborators deta hai; HTTP boundary request ko stable application contract mein translate karti hai.
tags: spring, rest, dependency-injection, validation
visual: request-flow
---

## Mental model — simple soch

Spring container application objects create aur wire karta hai. Spring Boot conventions, starters and conditional auto-configuration se setup simplify karta hai. Auto-configuration magic replacement nahi: dependencies, properties and registered beans conditions influence karte hain. Constructor injection component ki required collaborators explicit banata hai.

> **Core takeaway:** DI collaborators deta hai; HTTP boundary request ko stable application contract mein translate karti hai.

## Request flow

```text
HTTP request
  -> servlet filters and Spring Security
  -> DispatcherServlet
  -> controller + validation
  -> application service
  -> repository
  -> response serialization
```

Controller HTTP translate kare, service use case coordinate kare, repository persistence details own kare. Har tiny application mein unnecessary abstraction layers add mat karo, but transport and business rules ka separation maintain karo. Singleton bean default ka matlab shared instance hai, thread-safe instance automatically nahi. Request-specific mutable data singleton fields mein store mat karo. [Dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

## Compact controller example

```java
record CreateNote(@NotBlank @Size(max = 120) String title) {}
record NoteView(long id, String title) {}

@RestController
@RequestMapping("/api/notes")
class NoteController {
    private final NoteService service;
    NoteController(NoteService service) { this.service = service; }

    @PostMapping
    ResponseEntity<NoteView> create(@Valid @RequestBody CreateNote input) {
        NoteView created = service.create(input.title());
        return ResponseEntity
            .created(URI.create("/api/notes/" + created.id()))
            .body(created);
    }
}
```

Snippet Spring Web, validation imports and application-provided NoteService assume karta hai. Input DTO structural rules validate karta hai; ownership, uniqueness and permission checks business boundary par remain karte hain. Client-side validation usability hai, server validation authority hai.

## Bean scopes and circular dependencies

Default Spring bean scope singleton hai — container mein ek hi shared instance. Request-specific state ko is instance ke field mein store karna sabhi concurrent requests ke beech data leak kar sakta hai:

```java
@RestController
class BadCounter {
    private int requestCount; // shared mutable state across all requests — dangerous

    @GetMapping("/count")
    int increment() { return ++requestCount; }
}
```

Fix: request-scoped state ko method-local variable, database, ya explicit `@RequestScope`/`@SessionScope` bean mein rakho — singleton controller field mein nahi. Circular dependency (A ko B chahiye, B ko A chahiye construction ke liye) constructor injection ke saath compile time par nahi, application startup par `BeanCurrentlyInCreationException` ke saath fail hoti hai:

```java
@Service
class OrderService {
    private final NotificationService notifications;
    OrderService(NotificationService notifications) { this.notifications = notifications; }
}

@Service
class NotificationService {
    private final OrderService orders; // circular — Spring cannot construct either first
    NotificationService(OrderService orders) { this.orders = orders; }
}
```

Yeh startup failure actually helpful hai — field injection ke saath yeh silently proxy-based workaround se "solve" ho sakta tha, jo design smell ko hide kar deta. Real fix usually ek third component nikaalna hai jisme shared logic ho, ya event-based decoupling (`ApplicationEventPublisher`) use karna, taaki dono services ek dusre par direct compile-time dependency na rakhein.

## HTTP contract decisions

GET safe read operation hona chahiye. POST create/command represent kar sakta hai. PUT replacement semantics and PATCH partial update semantics clearly document karo. 201 creation, 204 body-free success, 400 invalid request, 404 missing resource and 409 conflict useful distinctions hain. Unauthorized resource existence hide karna threat model and product policy ka conscious decision hona chahiye.

Stable error schema banao with machine-readable code, safe message and field violations. `@RestControllerAdvice` consistent exception translation centralize kar sakta hai. Internal stack traces and SQL strings response mein expose mat karo. Pagination max size bound karo, sorting allowlist karo and request IDs traceability ke liye carry karo.

```java
@RestControllerAdvice
class ApiExceptionHandler {
    @ExceptionHandler(NoteNotFoundException.class)
    ResponseEntity<ErrorBody> notFound(NoteNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorBody("NOTE_NOT_FOUND", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorBody> invalid(MethodArgumentNotValidException e) {
        String detail = e.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ErrorBody("VALIDATION_FAILED", detail));
    }
}
```

Specific exception types ko specific handlers mein map karna generic `catch (Exception e)` se better hai — caller ko machine-readable `code` field milta hai jisse client logic (retry? show field error? redirect to login?) branch kar sakta hai. Handler order specificity se resolve hota hai: most-specific exception type ka handler pehle match hota hai.

## Configuration and AOP

Profiles environment-specific differences select kar sakte hain; secrets source code mein commit mat karo. External configuration validated startup failure de toh production surprise kam hoti hai. AOP proxies cross-cutting behavior like transactions apply karte hain; object ko manually `new` karna managed proxy bypass kar sakta hai. Container lifecycle aur proxy boundaries debugging ke key tools hain.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Controller class ka mutable field request-specific data store karne ke liye safe hai kyunki "har request apna khud ka data use karega". **Why it breaks:** Default bean scope singleton hai — ek hi controller instance saare concurrent requests serve karta hai. Do requests simultaneously aaye toh unka data field mein overwrite/interleave ho sakta hai. **Fix:** Request-specific data ko method parameters/local variables mein rakho, ya explicitly `@RequestScope` bean use karo jab session/request lifecycle ke saath scoped state genuinely chahiye ho.
- **Wrong assumption:** `@Transactional` annotated method ko same class ke andar directly call karne se transaction apply hoti hai. **Why it breaks:** Spring AOP default proxy-based hai — proxy sirf external calls (ek bean se doosre bean ka method call) intercept karta hai. Same object ke andar `this.someTransactionalMethod()` call karna proxy ko bypass kar deta hai, transaction advice apply hi nahi hoti. **Fix:** Transactional method ko alag bean mein extract karo aur usse inject karke call karo, ya `AopContext.currentProxy()` jaisa workaround use karo (generally avoid karna better hai).
- **Wrong assumption:** `@ExceptionHandler(Exception.class)` ek generic catch-all likhna sabse safe approach hai. **Why it breaks:** Yeh Spring ke apne internal exceptions (jaise `NoResourceFoundException` for missing static files, `HttpRequestMethodNotSupportedException`) ko bhi intercept kar sakta hai aur unhe wrong/generic status code de sakta hai, jabki framework already sensible default response deta. **Fix:** Specific known exceptions ke liye specific handlers likho; unexpected exceptions ke liye ek broad fallback handler sirf logging aur generic 500 response ke liye rakho, framework ke built-in handling ko override na karte hue jahan zaroorat na ho.

## In a real backend service

Production APIs mein `@RestControllerAdvice` se centralized error mapping consistent client experience deta hai — mobile app aur web frontend dono ek predictable `{code, message, fieldErrors}` shape expect kar sakte hain chahe backend internally kitne bhi different exception types throw kare. Singleton-scope bugs interview mein common hain kyunki local testing single-user single-request flow mein kabhi surface nahi hote — load testing ya production traffic mein hi visible hote hain, isliye concurrent-request tests likhna value-add hai.

## Interview questions — bolkar practice karo

**Spring versus Spring Boot?** Spring foundational container and framework capabilities deta hai. Boot opinionated configuration and operational packaging simplify karta hai, existing Spring semantics replace nahi karta.

**Why constructor injection?** Required dependencies clear hoti hain, fields final ban sakte hain, partially initialized objects avoid hote hain, and plain unit construction easy hoti hai.

**Why doesn't a self-invoked @Transactional method run in a transaction?** Spring AOP proxy-based hai: external caller proxy ke through method call karta hai, jahan advice (transaction, security, logging) apply hoti hai. Same class ke andar `this.method()` call directly target object par jaata hai, proxy ko bypass karke — isliye advice skip ho jaati hai.

## Practice

Create/list notes API design karo with validation, maximum page size and consistent errors. Two simultaneous users ke requests se verify karo ki singleton controller mein accidental shared request state nahi hai. Phir ek self-invocation `@Transactional` bug reproduce karo (method ko same class se call karke), aur method ko separate bean mein extract karke fix karo.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Controller ko negative quantity milti hai. Database logic controller mein daale bina flow aur response define karo.

> **Hint:** Input validation, business decision aur persistence ki responsibilities alag rakho.

**Answer guide — compare after attempting:** Boundary par validate karke documented client-error response do. Valid request use-case-owning service tak jaaye, jo persistence collaborators call kare. Invalid response test karo aur verify karo ki write attempt hi nahi hui.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
- [Spring MVC annotated controllers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
- [Spring Boot external configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
