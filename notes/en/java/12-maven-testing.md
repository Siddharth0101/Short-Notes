---
id: java-maven-testing
title: Maven builds and useful Java tests
track: java
order: 12
level: Intermediate
minutes: 3
summary: Maven — manages dependencies, the build lifecycle and plugins.
tags: maven, junit, testing, build
---

## Quick revision

> Revision target — Understand the scope of a build success and align tests with real behaviour/failure boundaries.

- Maven — manages dependencies, the build lifecycle and plugins.
- `pom.xml` — the project/build configuration.
- Lifecycle — compile → test → package → verify; a phase runs the earlier phases too.
- Dependency scope — compile/test/runtime/provided differ in classpath behaviour.
- JUnit — behaviour assertions; cover the normal, boundary and failure cases.
- Mockito — controls dependency behaviour; do not verify every internal call.
- Integration test — verify the real database/HTTP boundary.
- Reproducible build — pin versions and verify a clean build.
- Dependency conflict — inspect transitive versions; understand the winner from the effective dependency tree.
- Test double — a fake is a simple implementation, a stub a canned result, a mock interaction expectations.
- Build wrapper — useful for running the project's expected Maven version consistently.

### Edge cases and reasoning

- Test discovery — the lifecycle phase and plugin naming/config decide test execution; do not assume integration tests ran because package succeeded.
- Runtime dependency — a provided dependency absent at compile has to be supplied by the deployed runtime; the local test classpath can differ from production.
- Assertion intent — keep the failure message/invariant meaningful; do not generate the expected result with the implementation's own calculation.

## Understand it with an example

- Scenario — A discount rule reduces the price for a valid coupon; an expired coupon needs the original total and a clear rejection.
- Reasoning — A unit test should assert fixed inputs and explicit expected totals; a separate integration test should cover the contract of the persistence-backed expiry lookup.
- Catch — A passing mock call count does not prove the correct user total; verify from test discovery and the lifecycle command that the intended tests actually ran.

## Recall and practice

- Question — If Maven package passes, are separately configured integration tests guaranteed to have run?
- Answer — No; inspect the configured plugin/phases. The verify phase is commonly the relevant one for Failsafe-style integration verification.
- Try it yourself — Reproduce a unit failure and a database integration failure on purpose; the expected lifecycle command should detect both, and inspect the dependency tree.

## Practice questions

### Easy · Maven lifecycle

Which phases run when you run `mvn package`? How do you skip tests?

<details>
<summary>Answer</summary>

- Order — `validate → compile → test → package` (including the phases in between).
- `mvn verify` — integration tests (Failsafe) too, after package.
- Skip — `-DskipTests` (they compile, they do not run); `-Dmaven.test.skip=true` skips compiling too. Do not skip in CI.

</details>

### Easy · Dependency scopes

JUnit, Lombok/the servlet API, a JDBC driver and Spring Web — which scope?

<details>
<summary>Answer</summary>

- `test` — JUnit, Mockito; the test classpath only.
- `provided` — the servlet API (the server supplies it); a compile-time tool like Lombok is often `provided` + annotation processor config.
- `runtime` — the JDBC driver; not needed at compile, needed at run.
- `compile` (default) — Spring Web; everywhere.

</details>

### Medium · `NoSuchMethodError` at runtime

It compiles fine, but at run time `NoSuchMethodError: com.fasterxml...`. What happened and how do you fix it?

<details>
<summary>Answer</summary>

- Cause — a different (older) version of the library landed on the classpath than the one compiled against.
- Find — `mvn dependency:tree -Dincludes=com.fasterxml.jackson.core`.
- Maven rule — "nearest wins"; a transitive version can win by accident.
- Fix — pin the version through `<dependencyManagement>` or a BOM (the Spring Boot BOM); `<exclusions>` if needed.

</details>

### Medium · A service test with Mockito

`UserService.register(email)` should throw `DuplicateEmailException` and not save when the email already exists. Write the test.

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

- Assert behaviour — both the exception and "it was not saved".
- Avoid over-mocking — a simple in-memory fake can be enough too; mocks are for interaction-heavy code.
- A separate integration test (Testcontainers) for the correctness of the real DB query.

</details>

### Hard · "Tests run: 0"

`mvn test` reports build success but `Tests run: 0`. Three possible causes?

<details>
<summary>Answer</summary>

- Naming — by default Surefire picks up `*Test`, `*Tests`, `Test*`, `*TestCase` classes; `UserSpec.java` is skipped.
- Engine mismatch — you imported `org.junit.Test` (JUnit 4) but only the JUnit Jupiter engine is present (or the reverse); no vintage engine.
- Old plugin — a very old Surefire does not understand the JUnit 5 platform; pin the plugin version.
- Integration tests — `*IT` classes run through Failsafe in `mvn verify`, not in `mvn test`.
- Guard — an expected test count or a `failIfNoTests` style check in CI.

</details>

## Sources — further reading

- [Maven lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [JUnit user guide](https://docs.junit.org/current/user-guide/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/12-maven-testing.md)
