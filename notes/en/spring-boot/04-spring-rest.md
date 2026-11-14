---
id: java-spring-rest
title: Spring dependency injection and REST APIs
track: spring-boot
order: 4
level: Intermediate
minutes: 3
summary: `@RestController` — a controller that returns the HTTP response body.
tags: spring, rest, dependency-injection, validation
visual: request-flow
---

## Quick revision

> Revision target — Give the HTTP shape and the business rule clear controller-service-persistence boundaries.

- `@RestController` — a controller that returns the HTTP response body.
- Mapping — the handler is chosen by path + HTTP method.
- DTO — the external request/response shape; do not expose the persistence entity directly.
- Controller — parse/validate/respond; service — business rules; repository — persistence.
- Status — keep the contract clear, such as 201 for create, 404 for missing, 400 for invalid input.
- Idempotency — define the side-effect contract of a repeated request.
- Pagination — give a bounded size and a stable ordering.
- Content negotiation — Accept is the expected response type; Content-Type is the type of the body sent.
- Path/query/body — take resource identity / filters / a structured payload through the suitable binding.
- Entity exposure — internal fields, lazy relations and schema changes can leak into the API contract.

### Edge cases and reasoning

- HTTP safe/idempotent — GET must not mutate business state; document PUT as a repeated desired state and the retry contract of a POST's operation identity.
- Partial update — distinguish an absent field from an explicit null; prevent unintended clearing/privileged field writes through a patch.
- Conditional write — a version/If-Match contract can reject a stale edit; choose last-writer-wins consciously.

## Understand it with an example

- Scenario — In a profile patch the nickname field is absent; in another request the nickname is explicitly null.
- Reasoning — Give an agreed contract: absent means unchanged, null means clear/reject. Both intents should stay distinguishable from DTO parsing through to the service.
- Catch — A plain nullable field can merge the two states; keep the partial-update representation deliberate to protect the client from unintended data clearing.

## Recall and practice

- Question — How can a POST retry after an HTTP client timeout create a duplicate order?
- Answer — The first write may have committed; dedupe/reconcile the retry with the same operation key and the stored result.
- Try it yourself — Write a create/update endpoint contract; verify a valid 201, an invalid 400, a missing 404, a stale-write conflict and the outcome of a duplicate retry.

## Practice questions

### Easy · Path, query and body

Write the controller signatures for `GET /users/42/orders?status=paid&page=2` and `POST /users` (JSON body).

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

### Easy · The right status codes

Create success, delete success, invalid input, a missing resource, a duplicate email — name the status.

<details>
<summary>Answer</summary>

- Create — `201 Created` + `Location: /users/42`.
- Delete — `204 No Content`.
- Invalid input — `400 Bad Request` (or `422` if that is the team convention).
- Missing — `404 Not Found`.
- Duplicate — `409 Conflict`.

</details>

### Medium · Returning the entity directly

```java
@GetMapping("/users/{id}")
User get(@PathVariable long id) { return repo.findById(id).orElseThrow(); }
```

`User` is a JPA entity. What problems can there be?

<details>
<summary>Answer</summary>

- Data leak — `passwordHash` and internal flags go out in the JSON.
- Lazy loading — a `LazyInitializationException` or extra queries at serialization time.
- Recursion — bidirectional relations (`user.orders.user...`) give infinite JSON.
- Coupling — a DB schema change = an API break. Fix: map to a response DTO/record.

</details>

### Medium · A duplicate order from a POST retry

A mobile client retries `POST /orders` on a timeout and two orders are created. The API design fix?

<details>
<summary>Answer</summary>

- `Idempotency-Key` header — the client sends a unique key for each logical order.
- Server — stores the key + request hash; if it arrives again, it returns the first response, not a new order.
- Storage — a unique constraint on the key; an expiry policy (e.g. 24h).
- PUT/DELETE — should be naturally idempotent; POST is not.

</details>

### Hard · Preventing a lost update with an ETag

Two admins edit the same product; the second save silently overwrites the first. The HTTP-level fix?

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

- Flow — the version goes in the ETag on GET; the client sends `If-Match` on PUT; on a mismatch, `412 Precondition Failed`.
- DB — `@Version` optimistic locking makes the update atomic.
- Missing `If-Match` — you can force it with `428 Precondition Required`.

</details>

## Sources — further reading

- [Dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
- [Spring MVC annotated controllers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
- [Spring Boot external configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/04-spring-rest.md)
