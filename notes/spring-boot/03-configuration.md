---
id: spring-configuration
title: Configuration properties profiles and startup failures
track: spring-boot
order: 3
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/features/external-config.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/03-configuration.md)
