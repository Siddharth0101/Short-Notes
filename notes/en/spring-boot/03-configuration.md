---
id: spring-configuration
title: Configuration properties profiles and startup failures
track: spring-boot
order: 3
level: Intermediate
minutes: 2
summary: Configuration — keep values out of the code, in properties or the environment.
tags: spring, configuration, profiles
---

## Quick revision

> Revision target — Make typed configuration reliable with startup validation, explicit units and safe diagnosis.

- Configuration — keep values out of the code, in properties/the environment.
- `@ConfigurationProperties` — bind related settings into a typed object.
- Validation — make startup fail on an invalid required setting.
- Profile — a group of environment-specific configuration; not secret storage.
- Precedence — when the same key is in multiple sources, inspect which source wins.
- Secrets — keep them away from source control/logs; take them from an approved secret store/the environment.
- Config binding — if the typed conversion from a string value fails, inspect the actual property name/value source.
- Feature flag — enables/disables behaviour; not a substitute for authorization policy.
- Default value — useful for harmless config; do not mask a missing critical secret with a fake default.

### Edge cases and reasoning

- Unit-bearing config — make the unit of a timeout/duration and a data size explicit; the default interpretation of a raw number can become an accidental operational bug.
- Immutable deployment config — properties loaded at startup do not refresh automatically on a runtime edit; define refresh support/ownership separately.
- Safe diagnostics — identify the invalid key/source without exposing the secret value; actuator/config logging can leak credentials too.

## Understand it with an example

- Scenario — An external timeout setting arrives as `-5s`; the app's remote calls need a positive bounded timeout.
- Reasoning — Bind the configuration and check validity at startup; report the invalid property name/source. A valid `2s` timeout keeps the unit unambiguous.
- Catch — Do not hide a critical invalid setting behind a silent fallback; give context for the correction in diagnostics without printing the token/password value.

## Recall and practice

- Question — Do secrets become secure by activating a profile?
- Answer — No; a profile is config selection. The secret source, access, logging and rotation are separate controls.
- Try it yourself — Build a validated timeout/pool config; verify the outcome for a missing secret, a negative timeout, explicit units and conflicting property sources.

## Practice questions

### Easy · Which value wins?

`server.port: 8080` in `application.yml`, the environment variable `SERVER_PORT=9090`, and `--server.port=7070` on the command line. Which port will the app run on?

<details>
<summary>Answer</summary>

- `7070` — command-line arguments rank above environment variables, and env vars above the packaged `application.yml`.
- Practical — keep a single image and supply environment-specific values from env/secrets.
- Debug — `/actuator/env` (secured) shows the property source.

</details>

### Easy · Where do secrets go?

<details>
<summary>Answer</summary>

- No — an `application.yml` committed to git.
- Yes — environment variables, Kubernetes secrets, Vault/a secret manager, mounted files (`spring.config.import=optional:configtree:/run/secrets/`).
- Logs — mask secrets when printing config values.

</details>

### Medium · Typed config with validation

Bind `app.payment.base-url` (required) and `app.payment.timeout` (default 5s) type-safely; wrong config should fail at startup itself.

<details>
<summary>Answer</summary>

```java
@Validated
@ConfigurationProperties("app.payment")
public record PaymentProperties(
        @NotNull URI baseUrl,
        @DefaultValue("5s") Duration timeout) {}

// @EnableConfigurationProperties(PaymentProperties.class) ya @ConfigurationPropertiesScan
```

- Fail fast — a missing URL is found at deploy time, not on the first request.
- `Duration` — units such as `5s`, `500ms`; the meaning of a plain `5` is no longer ambiguous (the default unit of Duration is milliseconds).
- Immutable record — nobody can change the config at runtime.

</details>

### Medium · Using profiles the right way

<details>
<summary>Answer</summary>

- Files — `application-dev.yml`, `application-prod.yml`; activate with `SPRING_PROFILES_ACTIVE=prod`.
- Use — environment differences (URLs, log levels, mock vs real beans `@Profile("dev")`).
- Avoid — `if (profile == prod)` business logic in code; prod-only paths never get tested.
- Feature flags — profiles are static and deploy-time; use a flag service for runtime toggles.

</details>

### Hard · Env variable binding and units

`app.retry-count` and `app.cache.max-size: 10MB` have to be overridden from the Kubernetes env. What will the env var names be, and which type do you give `max-size`?

<details>
<summary>Answer</summary>

- Names — dots → `_`, remove dashes, uppercase: `APP_RETRYCOUNT`, `APP_CACHE_MAXSIZE`.
- Type — `DataSize` (`10MB`, `512KB`); `Duration` for time; with a plain `long` there is unit confusion.
- Safe diagnostics — log the effective non-secret config at startup; not the secrets.

</details>

## Sources — further reading

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/03-configuration.md)
