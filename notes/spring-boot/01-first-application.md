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

> Revision target — Startup ko classpath, scan boundary aur conditional bean wiring ka flow samjho.

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

## Example se samjho

- Scenario — Main class package `app.web` mein, service package `app.service` mein hai; controller ko service bean nahi mil rahi.
- Reasoning — Default scan main package aur subpackages dekhti hai; sibling service package miss ho sakta hai. Main class common parent `app` mein rakhna ek clear structure hai.
- Catch — Annotation presence alone bean creation prove nahi; profile, conditions aur explicit scan settings bhi inspect karo. Error ka root cause startup log se lo.

## Recall aur practice

- Sawal — Service class par annotation hai phir bhi bean missing kyun ho sakta hai?
- Jawaab — Class scan boundary/profile/condition ke bahar ho sakti hai; package placement aur condition report inspect karo.
- Khud try karo — Controller-service app start karo; missing bean, occupied port aur excluded profile ki failures ko root cause se distinguish karo.

## Practice questions

### Easy · Controller 404 kyun de raha hai?

Main class `com.shop.app.ShopApplication` mein hai aur controller `com.shop.api.ProductController` mein. `/products` par 404 aata hai.

<details>
<summary>Answer</summary>

- Kyun — `@SpringBootApplication` apne package (`com.shop.app`) aur sub-packages hi scan karta hai; `com.shop.api` sibling hai.
- Fix — main class ko root package `com.shop` mein rakho (recommended), ya `scanBasePackages = "com.shop"`.
- Check — startup log/`/actuator/mappings` mein mapping dikh rahi hai ya nahi.

</details>

### Easy · `@SpringBootApplication` ke andar kya hai?

<details>
<summary>Answer</summary>

- `@SpringBootConfiguration` — yeh class configuration source hai (`@Configuration` jaisa).
- `@EnableAutoConfiguration` — classpath aur existing beans dekh kar defaults (DataSource, web server, Jackson) configure.
- `@ComponentScan` — is package ke neeche `@Component`, `@Service`, `@RestController` etc. dhundhna.

</details>

### Medium · "Failed to configure a DataSource"

`spring-boot-starter-data-jpa` add karte hi app start nahi hoti: `'url' attribute is not specified`. Kyun, aur options?

<details>
<summary>Answer</summary>

- Kyun — JPA starter classpath par aate hi Boot DataSource auto-configure karna chahta hai; URL aur embedded DB dono nahi mile.
- Fix — `spring.datasource.url/username/password` + driver dependency do.
- Ya — sach mein DB nahi chahiye toh dependency hatao (exclusion last resort).
- Debug — `--debug` se condition evaluation report: kaunsi auto-config kyun chali ya skip hui.

</details>

### Medium · Apna `DataSource` bean banaya, settings ignore hui

Tumne `@Bean DataSource dataSource()` khud define kiya. Ab `spring.datasource.hikari.maximum-pool-size` ka koi effect nahi. Kyun?

<details>
<summary>Answer</summary>

- Back-off — Boot ki auto-config `@ConditionalOnMissingBean` hai; tumhara bean milte hi Boot apna bean (aur uski property binding) nahi banata.
- Fix — custom bean nahi chahiye toh hata do; chahiye toh khud bind karo: `@ConfigurationProperties("spring.datasource.hikari")` on the bean method.
- Lesson — auto-config replace karna sab-ya-kuch hai; pehle properties/customizers try karo.

</details>

### Hard · Startup par one-time kaam kahan likhoge?

Cache warm karna hai aur default admin user ensure karna hai. `@PostConstruct`, `ApplicationRunner`, `ApplicationReadyEvent` mein se kya choose karoge?

<details>
<summary>Answer</summary>

- `@PostConstruct` — sirf us bean ki apni initialization; doosre beans/transactions/proxies abhi ready na bhi hon, heavy kaam mat karo.
- `ApplicationRunner` — context poora ready, server start se pehle-ish; idempotent setup (admin user upsert) ke liye theek. Fail hua toh startup fail.
- `ApplicationReadyEvent` — app traffic ke liye ready; background warmup (async) ke liye.
- Multi-instance — har instance chalayega; idempotent banao ya DB lock/lease.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://spring.io/guides/gs/spring-boot/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/01-first-application.md)
