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

## Recall aur practice

- Sawal — Profile activate karne se secrets secure ho jaate hain?
- Jawaab — Nahi; profile config selection hai. Secret source, access, logging aur rotation separate controls hain.
- Khud try karo — Validated timeout/pool config banao; missing secret, negative timeout, explicit units aur conflicting property sources ka outcome verify karo.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/03-configuration.md)
