---
id: java-maven-testing
title: Maven builds and useful Java tests
track: java
order: 12
level: Intermediate
minutes: 3
summary: Maven — dependencies, build lifecycle aur plugins manage karta hai.
tags: maven, junit, testing, build
---

## Quick revision

> Revision target — Build success ka scope samjho aur tests ko real behavior/failure boundaries se align karo.

- Maven — dependencies, build lifecycle aur plugins manage karta hai.
- `pom.xml` — project/build configuration.
- Lifecycle — compile → test → package → verify; phases earlier phases bhi chalati hain.
- Dependency scope — compile/test/runtime/provided ka classpath behavior alag.
- JUnit — behavior assertions; normal, boundary aur failure cases cover karo.
- Mockito — dependency behavior control; har internal call verify mat karo.
- Integration test — real database/HTTP boundary verify karo.
- Reproducible build — versions pin karo aur clean build verify karo.
- Dependency conflict — transitive versions inspect; effective dependency tree se winner samjho.
- Test double — fake simple implementation, stub canned result, mock interaction expectations.
- Build wrapper — project ka expected Maven version consistently run karne mein useful.

### Edge cases aur reasoning

- Test discovery — lifecycle phase aur plugin naming/config test execution decide; successful package se integration tests run hona assume mat karo.
- Runtime dependency — compile par absent provided dependency deployed runtime ko supply karni hogi; local test classpath production se differ kar sakta hai.
- Assertion intent — failure message/invariant meaningful rakho; implementation ke same calculation se expected result generate mat karo.

## Example se samjho

- Scenario — Discount rule valid coupon par price reduce karta hai; expired coupon par original total aur clear rejection chahiye.
- Reasoning — Unit test fixed inputs aur explicit expected totals assert kare; persistence-backed expiry lookup ka contract separate integration test cover kare.
- Catch — Mock call count pass hone se correct user total prove nahi hota; test discovery aur lifecycle command se intended tests actually run hue, verify karo.

## Recall aur practice

- Sawal — Maven package pass ho toh separately configured integration tests guaranteed run hue?
- Jawaab — Nahi; configured plugin/phases inspect karo. Failsafe-style integration verification ke liye verify phase commonly relevant hai.
- Khud try karo — Unit failure aur database integration failure intentional reproduce karo; expected lifecycle command dono ko detect kare aur dependency tree inspect karo.

## Practice questions

### Easy · Maven lifecycle

`mvn package` chalane par kaunse phases chalte hain? Tests skip kaise?

<details>
<summary>Answer</summary>

- Order — `validate → compile → test → package` (beech ke phases sahit).
- `mvn verify` — package ke baad integration tests (Failsafe) bhi.
- Skip — `-DskipTests` (compile hote hain, chalte nahi); `-Dmaven.test.skip=true` compile bhi skip. CI mein skip mat karo.

</details>

### Easy · Dependency scopes

JUnit, Lombok/servlet API, JDBC driver aur Spring Web — kaunsa scope?

<details>
<summary>Answer</summary>

- `test` — JUnit, Mockito; sirf test classpath.
- `provided` — servlet API (server deta hai); Lombok jaisa compile-time tool aksar `provided` + annotation processor config.
- `runtime` — JDBC driver; compile par zaroorat nahi, run par chahiye.
- `compile` (default) — Spring Web; har jagah.

</details>

### Medium · Runtime par `NoSuchMethodError`

Compile theek, par run par `NoSuchMethodError: com.fasterxml...`. Kya hua aur kaise fix?

<details>
<summary>Answer</summary>

- Cause — classpath par library ka doosra (purana) version aaya jo compile wale version se alag hai.
- Find — `mvn dependency:tree -Dincludes=com.fasterxml.jackson.core`.
- Maven rule — "nearest wins"; transitive version accidentally jeet sakta hai.
- Fix — `<dependencyManagement>` ya BOM (Spring Boot BOM) se version pin; zaroorat ho toh `<exclusions>`.

</details>

### Medium · Mockito se service test

`UserService.register(email)` email already exist kare toh `DuplicateEmailException` throw kare aur save na kare. Test likho.

<details>
<summary>Answer</summary>

```java
@Test
void rejectsDuplicateEmail() {
    UserRepository repo = mock(UserRepository.class);
    when(repo.existsByEmail("a@b.com")).thenReturn(true);
    UserService service = new UserService(repo);

    assertThrows(DuplicateEmailException.class, () -> service.register("a@b.com"));
    verify(repo, never()).save(any());
}
```

- Behaviour assert — exception aur "save nahi hua" dono.
- Over-mocking avoid — simple in-memory fake bhi kaafi ho sakta hai; mocks interaction-heavy code ke liye.
- Real DB query correctness ke liye alag integration test (Testcontainers).

</details>

### Hard · "Tests run: 0"

`mvn test` build success deta hai par `Tests run: 0`. Teen possible causes?

<details>
<summary>Answer</summary>

- Naming — Surefire default `*Test`, `*Tests`, `Test*`, `*TestCase` classes uthata hai; `UserSpec.java` skip.
- Engine mismatch — `org.junit.Test` (JUnit 4) import kiya par sirf JUnit Jupiter engine hai (ya ulta); vintage engine nahi.
- Old plugin — bahut purana Surefire JUnit 5 platform nahi samajhta; plugin version pin karo.
- Integration tests — `*IT` classes Failsafe se `mvn verify` mein chalte hain, `mvn test` mein nahi.
- Guard — CI mein expected test count ya `failIfNoTests` style check.

</details>

## Sources — aur padhne ke liye

- [Maven lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [JUnit user guide](https://docs.junit.org/current/user-guide/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/12-maven-testing.md)
