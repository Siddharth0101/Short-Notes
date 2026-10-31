---
id: java-spring-rest
title: Spring dependency injection and REST APIs
track: spring-boot
order: 4
level: Intermediate
minutes: 3
summary: `@RestController` — HTTP response body return karne wala controller.
tags: spring, rest, dependency-injection, validation
visual: request-flow
---

## Quick revision

> Revision target — HTTP shape aur business rule ko clear controller-service-persistence boundaries do.

- `@RestController` — HTTP response body return karne wala controller.
- Mapping — path + HTTP method se handler choose.
- DTO — external request/response shape; persistence entity directly expose mat karo.
- Controller — parse/validate/response; service — business rules; repository — persistence.
- Status — create 201, missing 404, invalid input 400 jaise contract clear rakho.
- Idempotency — repeated request ka side effect contract define karo.
- Pagination — bounded size aur stable ordering do.
- Content negotiation — Accept expected response type; Content-Type sent body ka type.
- Path/query/body — resource identity / filters / structured payload ko suitable binding se lo.
- Entity exposure — internal fields, lazy relations aur schema changes API contract leak kar sakte hain.

### Edge cases aur reasoning

- HTTP safe/idempotent — GET business state mutate na kare; PUT repeated desired state, POST operation identity ka retry contract document karo.
- Partial update — absent field aur explicit null distinguish; patch se unintended clearing/privileged field write prevent karo.
- Conditional write — version/If-Match contract stale edit reject kar sakta hai; last-writer-wins consciously choose karo.

## Example se samjho

- Scenario — Profile patch mein nickname field absent hai; doosri request mein nickname explicitly null hai.
- Reasoning — Absent ko unchanged aur null ko clear/reject ka agreed contract do. DTO parsing se service tak dono intents distinguish hone chahiye.
- Catch — Plain nullable field dono states merge kar sakta hai; client ko unintended data clearing se bachane ke liye partial-update representation deliberate rakho.

## Recall aur practice

- Sawal — HTTP client timeout par POST retry se duplicate order kaise ban sakta hai?
- Jawaab — First write commit hua ho sakta; same operation key aur stored result se retry dedupe/reconcile karo.
- Khud try karo — Create/update endpoint contract likho; valid 201, invalid 400, missing 404, stale-write conflict aur duplicate retry outcome verify karo.

## Practice questions

### Easy · Path, query aur body

`GET /users/42/orders?status=paid&page=2` aur `POST /users` (JSON body) ke liye controller signatures likho.

<details>
<summary>Answer</summary>

```java
@GetMapping("/users/{id}/orders")
Page<OrderDto> orders(@PathVariable long id,
                      @RequestParam(defaultValue = "all") String status,
                      @RequestParam(defaultValue = "0") int page) { ... }

@PostMapping("/users")
ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest body) { ... }
```

- Path — resource identity; Query — filter/sort/page; Body — create/update data.

</details>

### Easy · Sahi status codes

Create success, delete success, invalid input, missing resource, duplicate email — status batao.

<details>
<summary>Answer</summary>

- Create — `201 Created` + `Location: /users/42`.
- Delete — `204 No Content`.
- Invalid input — `400 Bad Request` (ya `422` agar team convention ho).
- Missing — `404 Not Found`.
- Duplicate — `409 Conflict`.

</details>

### Medium · Entity seedha return karna

```java
@GetMapping("/users/{id}")
User get(@PathVariable long id) { return repo.findById(id).orElseThrow(); }
```

`User` JPA entity hai. Kya problems ho sakti hain?

<details>
<summary>Answer</summary>

- Data leak — `passwordHash`, internal flags JSON mein chale jaate hain.
- Lazy loading — serialization ke time `LazyInitializationException` ya extra queries.
- Recursion — bidirectional relations (`user.orders.user...`) infinite JSON.
- Coupling — DB schema change = API break. Fix: response DTO/record map karo.

</details>

### Medium · POST retry se duplicate order

Mobile client timeout par `POST /orders` retry karta hai aur do orders ban jaate hain. API design fix?

<details>
<summary>Answer</summary>

- `Idempotency-Key` header — client har logical order ke liye unique key bheje.
- Server — key + request hash store kare; dobara aaye toh pehla response return, naya order nahi.
- Storage — key par unique constraint; expiry policy (e.g. 24h).
- PUT/DELETE — naturally idempotent hone chahiye; POST nahi hota.

</details>

### Hard · ETag se lost update rokna

Do admins same product edit karte hain; doosre ka save pehle ko silently overwrite kar deta hai. HTTP level fix?

<details>
<summary>Answer</summary>

```java
@GetMapping("/products/{id}")
ResponseEntity<ProductDto> get(@PathVariable long id) {
    Product p = service.get(id);
    return ResponseEntity.ok().eTag("\"" + p.getVersion() + "\"").body(ProductDto.from(p));
}

@PutMapping("/products/{id}")
ResponseEntity<ProductDto> update(@PathVariable long id,
                                  @RequestHeader("If-Match") String ifMatch,
                                  @Valid @RequestBody UpdateProduct body) {
    long expected = Long.parseLong(ifMatch.replace("\"", ""));
    return ResponseEntity.ok(service.update(id, expected, body)); // version mismatch → 412
}
```

- Flow — GET par version ETag mein; PUT par client `If-Match` bheje; mismatch par `412 Precondition Failed`.
- DB — `@Version` optimistic locking update ko atomic banata hai.
- Missing `If-Match` — `428 Precondition Required` se force kar sakte ho.

</details>

## Sources — aur padhne ke liye

- [Dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
- [Spring MVC annotated controllers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
- [Spring Boot external configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/04-spring-rest.md)
