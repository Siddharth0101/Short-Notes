---
id: spring-configuration
title: Configuration properties profiles and startup failures
track: spring-boot
order: 3
level: Intermediate
minutes: 2
summary: Configuration — values code se alag properties/environment mein rakho.
tags: spring, configuration, profiles
---

## Quick revision

> Revision target — Typed configuration ko startup validation, explicit units aur safe diagnosis se reliable banao.

- Configuration — values code se alag properties/environment mein rakho.
- `@ConfigurationProperties` — related settings typed object mein bind karo.
- Validation — invalid required setting par startup fail karao.
- Profile — environment-specific configuration group; secret storage nahi.
- Precedence — same key multiple sources mein ho toh winning source inspect karo.
- Secrets — source control/logs se door, approved secret store/environment se lo.
- Config binding — string value se typed conversion fail ho toh actual property name/value source inspect karo.
- Feature flag — behavior enable/disable; authorization policy ka substitute nahi.
- Default value — harmless config mein useful; missing critical secret ko fake default se mask mat karo.

### Edge cases aur reasoning

- Unit-bearing config — timeout/duration aur data-size ki unit explicit; raw number ka default interpretation accidental operational bug bana sakta hai.
- Immutable deployment config — startup-loaded properties runtime edit se automatically refresh nahi; refresh support/ownership separately define karo.
- Safe diagnostics — invalid key/source identify karo, secret value expose nahi; actuator/config logging bhi credentials leak kar sakti hai.

## Example se samjho

- Scenario — External timeout setting `-5s` milti hai; app ke remote calls ko positive bounded timeout chahiye.
- Reasoning — Configuration bind karke startup par validity check karo; invalid property name/source report karo. Valid `2s` timeout ka unit unambiguous rakhta hai.
- Catch — Critical invalid setting ko silent fallback se hide mat karo; diagnostics mein token/password value print kiye bina correction ka context do.

## Recall aur practice

- Sawal — Profile activate karne se secrets secure ho jaate hain?
- Jawaab — Nahi; profile config selection hai. Secret source, access, logging aur rotation separate controls hain.
- Khud try karo — Validated timeout/pool config banao; missing secret, negative timeout, explicit units aur conflicting property sources ka outcome verify karo.

## Practice questions

### Easy · Kaunsi value jeetegi?

`application.yml` mein `server.port: 8080`, environment variable `SERVER_PORT=9090`, aur command line `--server.port=7070`. App kis port par chalegi?

<details>
<summary>Answer</summary>

- `7070` — command-line arguments environment variables se upar, env vars packaged `application.yml` se upar.
- Practical — image ek hi rakho, environment-specific values env/secret se do.
- Debug — `/actuator/env` (secured) se property source dikhta hai.

</details>

### Easy · Secrets kahan?

<details>
<summary>Answer</summary>

- Nahi — git mein committed `application.yml`.
- Haan — environment variables, Kubernetes secrets, Vault/secret manager, mounted files (`spring.config.import=optional:configtree:/run/secrets/`).
- Logs — config values print karte waqt secrets mask karo.

</details>

### Medium · Typed config with validation

`app.payment.base-url` (required) aur `app.payment.timeout` (default 5s) ko type-safe bind karo; galat config par startup hi fail ho.

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

- Fail fast — missing URL deploy ke time pata chalta hai, pehli request par nahi.
- `Duration` — `5s`, `500ms` jaise units; plain `5` ka matlab ambiguous nahi rehta (Duration ka default unit milliseconds hai).
- Immutable record — runtime mein koi config badal nahi sakta.

</details>

### Medium · Profiles ka sahi use

<details>
<summary>Answer</summary>

- Files — `application-dev.yml`, `application-prod.yml`; activate `SPRING_PROFILES_ACTIVE=prod`.
- Use — environment differences (URLs, log levels, mock vs real beans `@Profile("dev")`).
- Avoid — code mein `if (profile == prod)` business logic; prod-only paths test hi nahi hote.
- Feature flags — profiles static deploy-time hain; runtime toggles ke liye flag service.

</details>

### Hard · Env variable binding aur units

`app.retry-count` aur `app.cache.max-size: 10MB` ko Kubernetes env se override karna hai. Env var names kya honge, aur `max-size` ko kaunsa type do?

<details>
<summary>Answer</summary>

- Names — dots → `_`, dashes hatao, uppercase: `APP_RETRYCOUNT`, `APP_CACHE_MAXSIZE`.
- Type — `DataSize` (`10MB`, `512KB`); `Duration` for time; plain `long` hone par unit confusion.
- Safe diagnostics — startup par effective non-secret config log karo; secrets nahi.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/03-configuration.md)
