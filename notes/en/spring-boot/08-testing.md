---
id: spring-testing
title: Spring Boot unit slice and integration testing
track: spring-boot
order: 8
level: Intermediate
minutes: 3
summary: Unit test — test a service rule without a Spring context.
tags: spring, testing, integration
---

## Quick revision

> Revision target — State clearly which guarantee each test type gives you and which it does not.

- Unit test — test a service rule without a Spring context.
- Slice test — the wiring/behaviour of a limited layer such as MVC/JPA.
- `@SpringBootTest` — broad application integration; the cost is higher.
- Testcontainers — tests against real service/database behaviour.
- MockMvc — the HTTP contract without a full external server.
- Isolation — keep test data unique/clean; parallel tests must not break each other.
- Rollback caveat — a transaction on a separate HTTP thread is not covered by the test rollback.
- Context reuse — a compatible cached test context makes the suite fast; avoid unnecessary full resets.
- HTTP boundary — assert the JSON shape, status and validation errors; the service return value alone is not enough.
- External stub — simulates a timeout/malformed response; use it knowing it is a substitute for the real integration.

### Edge cases and reasoning

- Proxy integration — a plain unit instance does not prove @Transactional/@Async advice; verify the managed bean entry with a suitable integration test.
- Commit-time constraint — a rollback test can miss a DB violation without a flush/commit; exercise the expected database boundary explicitly.
- Real dialect — an in-memory substitute can differ from the production DB in locking/SQL semantics; test a critical invariant on the real engine.

## Understand it with an example

- Scenario — A service transfer test passes with a fake repository; on the real endpoint the second DB write fails.
- Reasoning — The unit test validates the business branching. A managed integration test should verify the debit rollback and the final stored balances at the real transaction boundary.
- Catch — A plain `new Service(...)` instance does not test transaction advice; do not assume the HTTP thread's work is automatically included in the test-thread rollback.

## Recall and practice

- Question — If the service unit test succeeds, does that prove transactional rollback is configured?
- Answer — No; check annotation interception and the transaction manager wiring at a managed integration boundary.
- Try it yourself — Write a rollback/unique constraint integration case; independently verify the proxy call, a flush/commit failure and the data cleanup of the HTTP thread.

## Practice questions

### Easy · Which test type when?

Pricing logic, controller validation, a repository query, and the whole order flow — which test style?

<details>
<summary>Answer</summary>

- Pricing logic — a plain JUnit unit test (no Spring); the fastest.
- Controller — `@WebMvcTest` + MockMvc; web layer only, with the service mocked.
- Repository query — `@DataJpaTest` with a real database (Testcontainers).
- Full flow — `@SpringBootTest` for a few important journeys.

</details>

### Medium · A validation test with MockMvc

`POST /users` with an empty name should return `400` and a field error — write the test.

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

- `@MockitoBean` — replaces `@MockBean` in newer Boot versions.
- Assert — the status, the error body and that "the service was not called".

</details>

### Medium · `@Transactional` test passes, production fails

The test class has `@Transactional` (every test rolls back). The test passes, but production throws a unique constraint error. How?

<details>
<summary>Answer</summary>

- Rollback — the test never commits; some constraint checks/triggers run only on flush or commit, and without a flush Hibernate does not even send the SQL.
- Fix — call `entityManager.flush()` in the test, or write an integration test that commits.
- Also — the work of `REQUIRES_NEW` and async threads is not undone by the test transaction rollback; data leaks.

</details>

### Medium · Passes on H2, fails on PostgreSQL

<details>
<summary>Answer</summary>

- Dialect — H2 is not an exact clone of PostgreSQL: JSONB, `ILIKE`, locking, case sensitivity and functions differ.
- Fix — a real PostgreSQL through Testcontainers:

```java
@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class OrderRepoTest {
    @Container @ServiceConnection
    static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");
}
```

- `@ServiceConnection` — wires the container's URL/credentials automatically.

</details>

### Hard · The test suite is very slow

In 200 integration tests every test class starts a new Spring context (~8s). Why, and the fix?

<details>
<summary>Answer</summary>

- Context cache — Spring reuses a context with the same configuration; the key includes the active profiles, properties and the set of mock beans.
- Cache bust — different `@MockitoBean` combinations per class, `@TestPropertySource`, `@DirtiesContext`.
- Fix — a common base class/config, standardized mock sets, remove `@DirtiesContext`, use more slice tests.
- Verify — count the context startups in the test logs.

</details>

## Sources — further reading

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/08-testing.md)
