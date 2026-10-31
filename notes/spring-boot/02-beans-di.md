---
id: spring-beans-di
title: Beans constructor injection and lifecycle
track: spring-boot
order: 2
level: Intermediate
minutes: 4
summary: Bean — Spring container ka managed object.
tags: spring, beans, dependency-injection
---

## Quick revision

> Revision target — Dependency ownership aur proxy boundary ko request isolation se connect karo.

- Bean — Spring container ka managed object.
- DI — dependencies bahar se milti hain; khud har jagah `new` nahi karte.
- Constructor injection — required dependencies explicit aur testable.
- Singleton scope — container mein ek instance; automatically thread-safe nahi.
- `@Qualifier`/`@Primary` — multiple matching beans mein selection clear karo.
- Lifecycle — initialization aur destruction callbacks resource ownership se match karo.
- Circular dependency — responsibilities/design split karo.
- `@Bean` — factory method ka returned object container manage karta hai.
- Prototype scope — har container lookup par naya instance; injected singleton automatically har call par refresh nahi karta.
- Optional dependency — absence valid ho tab explicit optional/provider contract; required bean ko silently hide mat karo.

### AOP aur proxies

- AOP — logging/transactions jaise cross-cutting work business method se separate.
- Aspect — related advice + pointcuts ka group.
- Join point — interception location; Spring AOP mein method execution.
- Pointcut — kin methods par advice lagegi.
- Advice — before, after, after-returning, after-throwing ya around.
- Around — proceed call aur result/error handling consciously karo.
- Limits — proxy type/final/private method restrictions samjho.
- Exception advice — logging ke baad original exception preserve; swallow karna caller/transaction behavior badalta hai.
- Proxy identity — injected bean proxy ho sakta hai; implementation-class assumptions avoid.
- Aspect test — external bean call aur internal self-call ka interception difference verify karo.
- Advice ordering — multiple aspects ka order security/transaction behavior badal sakta hai; explicit rakho.

### Edge cases aur reasoning

- Prototype destruction — container prototype instance ka complete destruction lifecycle own nahi karta; acquired resources caller ko release karne pad sakte hain.
- Singleton mutable state — request-specific field concurrent requests mix kar sakta hai; stateless service/local variables prefer karo.
- Proxy entry — this.method() usual proxy AOP bypass; collaborator bean boundary ya supported weaving model se interception intentional banao.

## Example se samjho

- Scenario — Singleton CheckoutService mein `currentCustomer` field har request overwrite karti hai; A aur B requests overlap hoti hain.
- Reasoning — A field set kare, B overwrite kare, A later read kare toh B ka customer mil sakta hai. Request data method parameter/local variable mein rakho.
- Catch — Spring-managed singleton automatically thread-safe nahi; shared reusable dependency aur per-request mutable state ka ownership alag rakho.

## Recall aur practice

- Sawal — Singleton mein injected prototype field har HTTP request par new instance banega?
- Jawaab — Nahi; injection time ka instance stored hai. Per-use lookup/provider aur cleanup ownership define karo.
- Khud try karo — Two implementations with qualifier wire karo; singleton request isolation aur externally invoked versus self-invoked advice trace verify karo.

## Practice questions

### Easy · Constructor injection kyun?

```java
@Service
class OrderService {
    @Autowired private PaymentClient client;
}
```

<details>
<summary>Answer</summary>

- Problems — field `final` nahi ho sakta, dependency hidden, unit test mein `new OrderService()` ke baad `null`.
- Better:

```java
@Service
class OrderService {
    private final PaymentClient client;
    OrderService(PaymentClient client) { this.client = client; }
}
```

- Single constructor — `@Autowired` likhne ki zaroorat nahi; required dependencies compile time par clear.

</details>

### Easy · Same type ke do beans

`EmailSender` interface ke do beans hain: `SmtpSender`, `SesSender`. Startup `NoUniqueBeanDefinitionException` deta hai. Fix?

<details>
<summary>Answer</summary>

- `@Primary` — default choice ek bean par.
- `@Qualifier("sesSender")` — injection point par specific bean.
- Sab chahiye — `List<EmailSender>` ya `Map<String, EmailSender>` inject karo (strategy selection).

</details>

### Medium · Singleton mein request data

```java
@RestController
class CartController {
    private final List<String> items = new ArrayList<>();
    @PostMapping("/cart") void add(@RequestBody String item) { items.add(item); }
}
```

Production mein kya hoga?

<details>
<summary>Answer</summary>

- Singleton — ek hi controller instance saare users aur threads share karte hain.
- Bugs — ek user ka cart doosre ko dikhta hai, aur `ArrayList` concurrent writes par corrupt ho sakti hai.
- Fix — beans stateless rakho; cart DB/session/cache mein user key ke saath.

</details>

### Medium · Aspect internal call par nahi chala

`@Timed` custom aspect `OrderService.place()` par laga hai. `controller → service.place()` par log aata hai, par `service.placeAll()` andar se `this.place()` call kare toh nahi. Kyun?

<details>
<summary>Answer</summary>

- Proxy — Spring AOP bean ke bahar ek proxy banata hai; advice sirf proxy se guzarne wali calls par chalti hai.
- `this.place()` — target object ka direct call, proxy bypass.
- Fix — logic doosre bean mein move karo (best), ya design badlo. Same rule `@Transactional`, `@Async`, `@Cacheable` par lagta hai.

</details>

### Hard · Circular dependency

`OrderService` constructor mein `InventoryService` leta hai aur `InventoryService` `OrderService`. Startup fail hota hai. Kyun, aur sahi fix?

<details>
<summary>Answer</summary>

- Kyun — constructor injection mein dono ko pehle doosra chahiye; Boot 2.6+ circular references by default allow nahi karta.
- Design fix — shared logic teesre component mein nikalo (e.g. `StockPolicy`) jise dono use karein; ya one direction mein event publish karo (`ApplicationEventPublisher`).
- Last resort — `@Lazy` ek side par; cycle chhupa deta hai, khatam nahi karta.
- Signal — cycle aksar batata hai ki responsibilities mix hain.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/02-beans-di.md)
