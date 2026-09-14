---
id: spring-deployment-capstone
title: Package deploy and defend a Spring Boot capstone
track: spring-boot
order: 10
level: Intermediate
minutes: 16
summary: Reproducible artifact deploy karo; configuration, compatible schema changes aur failure recovery explicit rakho.
tags: spring, deployment, capstone
---

## Mental model — simple soch

Working locally ek milestone hai, deployment proof nahi. Build artifact, runtime configuration, database changes aur traffic handover sab coordinated hone chahiye. A deployment should preserve data and make failures visible. Is capstone mein existing lessons ko combine karke ek small notes API ship karne ka design aur verification complete karo.

> **Core takeaway:** Reproducible artifact deploy karo; configuration, compatible schema changes aur failure recovery explicit rakho.

## Package the application

Generated Maven project mein packaging se pehle verification run karo. Generated build ka configured Boot plugin executable jar banata hai. Launch mein actual artifact name use karo.

```text
./mvnw verify
java -jar target/study-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

Executable Boot jar dependencies ke saath embedded server start kar sakta hai; arbitrary plain jar mein yeh packaging zaroori nahi. Clean working directory se start karke check karo ki IDE classpath missing dependency hide nahi kar raha.

Container ke liye available daemon ke saath Boot build-image ya maintained Dockerfile lo. Compatible Java base pin, practical ho toh non-root user, secrets image ke bahar rakho. Layers rebuild efficient bana sakti hain; functional validation replace nahi karti.

## Coordinate data and traffic

Schema changes versioned migrations se karo. Code se pehle nullable column add mixed versions support kar sakta hai; old code ka read column drop karna nahi. Expand→migrate→contract compatible steps mein plan karo. Old jar restore karna destructive DB change reverse nahi karta.

Readiness: traffic dena chahiye? Liveness: restart appropriate hai? Har dependency outage ko liveness fail banane se restart storm ho sakta hai. Graceful shutdown mein requests finish ka time do; load par termination signal test karo. Process alive hona correct API serve ka proof nahi.

## Build the notes API

DTOs, validation, service transactions/persistence se create/list/get/update endpoints banao. Rows verified owner se scope karo. Page size bound, deterministic order/ID tie-breaker, conflicting updates ke optimistic versions aur stable errors add karo.

Operational note mein artifact ID, required config names, migration version, health checks aur rollback constraints rakho. Logs operation trace karein, tokens/private contents expose na karein. HTTP errors, pool wait aur slow query metrics separate rakho.

## Practice

Valid create, blank rejection, cross-owner denial, missing resource, two conflicting updates aur restart persistence demonstrate karo. Har case ka HTTP status aur durable DB outcome record karo; controller mocks alone enough nahi.

## Revision and practice lab — khud karke samjho

**Recall:** Why is an application rollback insufficient after dropping a required column?

**Apply:** Old/new app versions overlap karti hain. title→heading migration design karo; rollout midway fail ho toh reads correct kaise rahengi?

> **Hint:** Transition ke dauran dono versions ko compatible rakho.

**Answer guide — compare after attempting:** New column add, compatible writes, bounded backfill aur consistency verification ke baad reads switch karo. Rollback-compatible window rakho; baad mein old writes aur last mein old column remove karo. Concurrent writes coordinate karo taaki backfill newer value overwrite na kare. Yeh ek defensible design hai; no-lost-update aur tested recovery acceptance criteria hain.

**Exit check:** Present the API, its test evidence and a deployment failure timeline. Explain which changes are reversible and which require data recovery.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html).
