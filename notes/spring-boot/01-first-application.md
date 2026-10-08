---
id: spring-boot-first-application
title: Spring Boot first application and project structure
track: spring-boot
order: 1
level: Intermediate
minutes: 2
summary: Spring — objects aur dependencies manage karta hai; Boot setup/configuration simplify karta hai.
tags: spring, boot, startup
---

## Quick revision

- Spring — objects aur dependencies manage karta hai; Boot setup/configuration simplify karta hai.
- Starter — related dependencies ka convenient bundle.
- `@SpringBootApplication` — configuration, auto-configuration aur component scan combine.
- Component scan — main class ke package/subpackages mein default scan.
- Auto-configuration — classpath/properties/beans ke hisaab se conditional setup.
- Startup failure — root cause padho: missing bean, port conflict ya invalid config.
- Application context — bean definitions, creation aur dependency wiring ka container.
- Embedded server — Boot web app apne process mein HTTP server run kar sakti hai.
- Condition report — auto-configuration kyun match/back off hui, startup diagnosis mein dekho.

### Edge cases aur reasoning

- Auto-config backoff — explicit user bean conditional default replace/back off kara sakta hai; dependency presence alone exact configuration prove nahi.
- Startup sequence — container readiness business-ready hone se alag; required migrations/dependencies ke readiness gate define karo.
- Package placement — main class bahut narrow package mein ho toh sibling beans miss; scan boundaries intentional rakho.

## Recall aur practice

- Sawal — Service class par annotation hai phir bhi bean missing kyun ho sakta hai?
- Jawaab — Class scan boundary/profile/condition ke bahar ho sakti hai; package placement aur condition report inspect karo.
- Khud try karo — Controller-service app start karo; missing bean, occupied port aur excluded profile ki failures ko root cause se distinguish karo.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://spring.io/guides/gs/spring-boot/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/01-first-application.md)
