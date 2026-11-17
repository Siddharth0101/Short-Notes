---
id: spring-beans-di
title: Beans constructor injection and lifecycle
track: spring-boot
order: 2
level: Intermediate
minutes: 4
summary: Bean — an object managed by the Spring container.
tags: spring, beans, dependency-injection
visual: spring-proxy
---

## Quick revision

> Revision target — Connect dependency ownership and the proxy boundary to request isolation.

- Bean — an object managed by the Spring container.
- DI — dependencies are supplied from outside; you do not call `new` everywhere yourself.
- Constructor injection — required dependencies are explicit and testable.
- Singleton scope — one instance in the container; not automatically thread-safe.
- `@Qualifier`/`@Primary` — make the selection clear among multiple matching beans.
- Lifecycle — match initialization and destruction callbacks to resource ownership.
- Circular dependency — split the responsibilities/design.
- `@Bean` — the container manages the object returned by the factory method.
- Prototype scope — a new instance on every container lookup; one injected into a singleton does not refresh automatically on every call.
- Optional dependency — an explicit optional/provider contract when absence is valid; do not silently hide a required bean.

### AOP and proxies

- AOP — keeps cross-cutting work such as logging/transactions separate from the business method.
- Aspect — a group of related advice + pointcuts.
- Join point — the interception location; in Spring AOP, a method execution.
- Pointcut — which methods the advice applies to.
- Advice — before, after, after-returning, after-throwing or around.
- Around — handle the proceed call and the result/error consciously.
- Limits — understand the proxy type/final/private method restrictions.
- Exception advice — preserve the original exception after logging; swallowing it changes the caller/transaction behaviour.
- Proxy identity — the injected bean can be a proxy; avoid implementation-class assumptions.
- Aspect test — verify the difference in interception between an external bean call and an internal self-call.
- Advice ordering — the order of multiple aspects can change security/transaction behaviour; keep it explicit.

### Edge cases and reasoning

- Prototype destruction — the container does not own the complete destruction lifecycle of a prototype instance; the caller may have to release acquired resources.
- Singleton mutable state — a request-specific field can mix up concurrent requests; prefer a stateless service/local variables.
- Proxy entry — this.method() bypasses the usual proxy AOP; make interception intentional with a collaborator bean boundary or a supported weaving model.

## Understand it with an example

- Scenario — A `currentCustomer` field in the singleton CheckoutService is overwritten on every request; requests A and B overlap.
- Reasoning — If A sets the field, B overwrites it and A reads it later, A can get B's customer. Keep request data in a method parameter/local variable.
- Catch — A Spring-managed singleton is not automatically thread-safe; keep the ownership of a shared reusable dependency and of per-request mutable state separate.

## Recall and practice

- Question — Will a prototype field injected into a singleton become a new instance on every HTTP request?
- Answer — No; the instance from injection time is stored. Define a per-use lookup/provider and the cleanup ownership.
- Try it yourself — Wire two implementations with a qualifier; verify singleton request isolation and the trace of externally invoked versus self-invoked advice.

## Practice questions

### Easy · Why constructor injection?

```java
@Service
class OrderService {
    @Autowired private PaymentClient client;
}
```

<details>
<summary>Answer</summary>

- Problems — the field cannot be `final`, the dependency is hidden, and in a unit test it is `null` after `new OrderService()`.
- Better:

```java
@Service
class OrderService {
    private final PaymentClient client;
    OrderService(PaymentClient client) { this.client = client; }
}
```

- Single constructor — no need to write `@Autowired`; required dependencies are clear at compile time.

</details>

### Easy · Two beans of the same type

The `EmailSender` interface has two beans: `SmtpSender`, `SesSender`. Startup throws `NoUniqueBeanDefinitionException`. The fix?

<details>
<summary>Answer</summary>

- `@Primary` — the default choice, on one bean.
- `@Qualifier("sesSender")` — a specific bean at the injection point.
- Need all of them — inject a `List<EmailSender>` or `Map<String, EmailSender>` (strategy selection).

</details>

### Medium · Request data in a singleton

```java
@RestController
class CartController {
    private final List<String> items = new ArrayList<>();
    @PostMapping("/cart") void add(@RequestBody String item) { items.add(item); }
}
```

What will happen in production?

<details>
<summary>Answer</summary>

- Singleton — all users and threads share the same single controller instance.
- Bugs — one user's cart shows up for another, and the `ArrayList` can be corrupted by concurrent writes.
- Fix — keep beans stateless; the cart goes in a DB/session/cache with a user key.

</details>

### Medium · The aspect did not run on an internal call

A custom `@Timed` aspect is applied to `OrderService.place()`. The log appears for `controller → service.place()`, but not when `service.placeAll()` calls `this.place()` from inside. Why?

<details>
<summary>Answer</summary>

- Proxy — Spring AOP creates a proxy around the bean; advice runs only on calls that pass through the proxy.
- `this.place()` — a direct call on the target object, bypassing the proxy.
- Fix — move the logic to another bean (best), or change the design. The same rule applies to `@Transactional`, `@Async`, `@Cacheable`.

</details>

### Hard · Circular dependency

`OrderService` takes `InventoryService` in its constructor and `InventoryService` takes `OrderService`. Startup fails. Why, and what is the right fix?

<details>
<summary>Answer</summary>

- Why — with constructor injection each needs the other first; Boot 2.6+ does not allow circular references by default.
- Design fix — pull the shared logic out into a third component (e.g. `StockPolicy`) that both use; or publish an event in one direction (`ApplicationEventPublisher`).
- Last resort — `@Lazy` on one side; it hides the cycle, it does not remove it.
- Signal — a cycle often tells you that responsibilities are mixed.

</details>

## Sources — further reading

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/02-beans-di.md)
