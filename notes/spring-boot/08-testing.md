---
id: spring-testing
title: Spring Boot unit slice and integration testing
track: spring-boot
order: 8
level: Intermediate
minutes: 3
summary: Unit test — service rule ko Spring context bina test karo.
tags: spring, testing, integration
---

## Quick revision

> Revision target — Har test type se kaunsi guarantee milti hai aur kaunsi nahi, clearly batao.

- Unit test — service rule ko Spring context bina test karo.
- Slice test — MVC/JPA jaise limited layer ka wiring/behavior.
- `@SpringBootTest` — broad application integration; cost zyada.
- Testcontainers — real service/database behavior ke tests.
- MockMvc — HTTP contract without full external server.
- Isolation — test data unique/clean rakho; parallel tests ek-doosre ko na tod dein.
- Rollback caveat — separate HTTP thread ka transaction test rollback se cover na ho.
- Context reuse — compatible cached test context suite fast karta hai; unnecessary full resets avoid.
- HTTP boundary — JSON shape, status aur validation errors assert; sirf service return value enough nahi.
- External stub — timeout/malformed response simulate; real integration ka substitute samajhkar use karo.

### Edge cases aur reasoning

- Proxy integration — plain unit instance se @Transactional/@Async advice prove nahi; managed bean entry ko suitable integration test se verify karo.
- Commit-time constraint — rollback test flush/commit bina DB violation miss kar sakta; expected database boundary explicitly exercise karo.
- Real dialect — in-memory substitute production DB locking/SQL semantics differ kar sakta; critical invariant real engine par test karo.

## Example se samjho

- Scenario — Service transfer test fake repository ke saath pass hai; real endpoint par second DB write fail hoti hai.
- Reasoning — Unit test business branching validate karta hai. Managed integration test real transaction boundary par debit rollback aur final stored balances verify kare.
- Catch — Plain `new Service(...)` instance transaction advice test nahi karta; HTTP thread ka work test-thread rollback mein automatically include assume mat karo.

## Recall aur practice

- Sawal — Service unit test successful ho toh transactional rollback configured hai, prove hota?
- Jawaab — Nahi; annotation interception aur transaction manager wiring managed integration boundary par check karo.
- Khud try karo — Rollback/unique constraint integration case likho; proxy call, flush/commit failure aur HTTP-thread data cleanup independently verify karo.

## Practice questions

### Easy · Kaunsa test type kab?

Pricing logic, controller validation, repository query, aur poora order flow — kaunsa test style?

<details>
<summary>Answer</summary>

- Pricing logic — plain JUnit unit test (no Spring); fastest.
- Controller — `@WebMvcTest` + MockMvc; web layer only, service mock.
- Repository query — `@DataJpaTest` real database (Testcontainers) ke saath.
- Full flow — `@SpringBootTest` kam aur important journeys ke liye.

</details>

### Medium · MockMvc se validation test

`POST /users` empty name par `400` aur field error de — test likho.

<details>
<summary>Answer</summary>

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean UserService service;

    @Test
    void rejectsBlankName() throws Exception {
        mvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"\",\"email\":\"a@b.com\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors[0].field").value("name"));
        verifyNoInteractions(service);
    }
}
```

- `@MockitoBean` — naye Boot versions mein `@MockBean` ki jagah.
- Assert — status, error body aur "service call nahi hua".

</details>

### Medium · `@Transactional` test pass, production fail

Test class par `@Transactional` hai (har test rollback). Test pass hota hai, par production mein unique constraint error aata hai. Kaise?

<details>
<summary>Answer</summary>

- Rollback — test commit kabhi nahi karta; kuch constraint checks/triggers flush ya commit par hi chalte hain, aur Hibernate bina flush SQL bhejta hi nahi.
- Fix — test mein `entityManager.flush()` karo, ya commit karne wala integration test.
- Aur — `REQUIRES_NEW` aur async threads ka kaam test transaction rollback se undo nahi hota; data leak hota hai.

</details>

### Medium · H2 mein pass, PostgreSQL mein fail

<details>
<summary>Answer</summary>

- Dialect — H2 PostgreSQL ka exact clone nahi: JSONB, `ILIKE`, locking, case sensitivity, functions alag.
- Fix — Testcontainers se real PostgreSQL:

```java
@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class OrderRepoTest {
    @Container @ServiceConnection
    static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");
}
```

- `@ServiceConnection` — container ka URL/credentials automatically wire.

</details>

### Hard · Test suite bahut slow

200 integration tests mein har test class nayi Spring context start karti hai (~8s). Kyun aur fix?

<details>
<summary>Answer</summary>

- Context cache — Spring same configuration wali context reuse karta hai; key mein active profiles, properties, aur mock beans ka set shamil hai.
- Cache bust — har class ke alag `@MockitoBean` combinations, `@TestPropertySource`, `@DirtiesContext`.
- Fix — common base class/config, mock sets standardize, `@DirtiesContext` hatao, slice tests zyada use karo.
- Verify — test logs mein context startup count gino.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/08-testing.md)
