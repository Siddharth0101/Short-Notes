---
id: spring-deployment-capstone
title: Package deploy and defend a Spring Boot capstone
track: spring-boot
order: 10
level: Intermediate
minutes: 19
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

## Depth walkthrough — andar kya ho raha hai?

### Rolling release mein two application versions ek database share karti hain

Old version column title read karti hai, new version name use karna chahti hai. Direct rename old instances tod sakta hai. Expand phase mein compatible schema add, rollout/backfill verify, phir old usage disappear hone ke baad contract phase remove karo. Backfill resumable aur bounded ho; huge transaction lock pressure create kar sakti hai.

App rollback old binary restore karta hai, deleted database values nahi. Backup recovery, forward fix aur compatibility window alag tools hain. Release checklist mein migration behavior aur mixed-version requests include karo.

Shutdown par new traffic stop, in-flight work bounded drain aur owned resources close karo. Readiness routing decision aur liveness restart decision alag hain. Shared dependency outage par every instance restart karna recovery worsen kar sakta hai.

**Practice:** V1/V2 request matrix, interrupted backfill, failed new instance startup aur lost response during shutdown simulate karne ka plan likho. Capstone complete tab bolo jab API, persistence, auth, tests aur recovery behavior ka observable evidence ho; sirf successful local GET deployment readiness nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Required column drop hone ke baad application rollback alone kyun insufficient hai?

**Apply — khud try karo:** Old/new app versions overlap karti hain. title→heading migration design karo; rollout midway fail ho toh reads correct kaise rahengi?

> **Hint — chhota ishara:** Transition ke dauran dono versions ko compatible rakho.

**Answer guide — pehle khud karo, phir compare karo:** New column add, compatible writes, bounded backfill aur consistency verification ke baad reads switch karo. Rollback-compatible window rakho; baad mein old writes aur last mein old column remove karo. Concurrent writes coordinate karo taaki backfill newer value overwrite na kare. Yeh ek defensible design hai; no-lost-update aur tested recovery acceptance criteria hain.

**Exit check — aage badhne se pehle:** API, test evidence aur deployment failure timeline dikhao. Kaunse changes reverse ho sakte hain aur kahan data recovery chahiye, samjhao.

## Sources — aur padhne ke liye

[Official reference yahan padho](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html).

## Is concept ko aur practice karo

- [Spring background jobs aur caching — lifecycle aur ownership samjho](11-spring-background-cache.md)
- [SQL schema design aur safe migrations — data ka contract evolve karo](../java/18-schema-migrations.md)
