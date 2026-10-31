---
id: spring-deployment-capstone
title: Package deploy and defend a Spring Boot capstone
track: spring-boot
order: 10
level: Intermediate
minutes: 3
summary: Artifact — same tested build ko environments mein promote karo.
tags: spring, deployment, capstone
---

## Quick revision

> Revision target — Deployment ko tested artifact, readiness aur accepted work ke drain se plan karo.

- Artifact — same tested build ko environments mein promote karo.
- Container — application + runtime package; secrets image mein mat bake karo.
- Configuration — environment se inject; startup par validate.
- Readiness — ready hone par hi traffic do.
- Graceful shutdown — traffic drain, in-flight wait aur resources close.
- Deployment — small rollout, health checks aur rollback plan.
- Capstone — validation, auth, transaction, duplicate retry aur recovery verify karo.
- Resource limits — container memory/CPU budget aur JVM/application usage align karo.
- Image tag — immutable version/digest se exact deployed artifact identify karo.
- Smoke check — release ke baad critical route + persistence + dependency path verify karo.

### Docker basics

- Image/container — packaged filesystem/runtime template aur uska running instance.
- Dockerfile — build recipe; smaller trusted base aur layered cache useful.
- Network — containers service names se communicate; localhost current container hai.
- Volume — container lifecycle se alag persistent data.
- Compose — related services/config/network local stack mein define.

### Edge cases aur reasoning

- Shutdown ordering — readiness withdraw/traffic drain ko termination grace se align; process kill se pehle accepted work ka bounded completion plan.
- Schema rollback boundary — app image rollback destructive migration undo nahi karta; old/new schema compatibility rollout se pehle verify karo.
- Container JVM budget — heap ke alawa metaspace/stacks/direct memory ke liye headroom; exact budget load evidence se choose karo.

## Example se samjho

- Scenario — New container process start hua, lekin required migration abhi incomplete hai; load balancer traffic bhejne ko ready hai.
- Reasoning — Readiness gate required initialization tak false rahe. Ready hone par traffic lo; shutdown par readiness withdraw karke in-flight work ko bounded completion do.
- Catch — Process alive hona business-ready hona nahi; optional dependency issue par unnecessary restart storm avoid karo aur old/new schema compatibility pehle verify karo.

## Recall aur practice

- Sawal — Old container image restore karne se dropped database column automatically aa jayega?
- Jawaab — Nahi; artifact aur data/schema independent lifecycles. Compatible migration ya separately rehearsed recovery chahiye.
- Khud try karo — Capstone release checklist run karo; invalid config, readiness delay, in-flight shutdown aur prior image with upgraded schema acceptance define karo.

## Practice questions

### Easy · Production Dockerfile

<details>
<summary>Answer</summary>

```dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY . .
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
RUN useradd --system app
USER app
COPY --from=build /src/target/app.jar /app/app.jar
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=70", "-jar", "/app/app.jar"]
```

- Multi-stage — final image mein JDK/source nahi, sirf JRE + jar.
- Non-root user — container escape ka impact kam.
- Tests — CI mein alag step mein chalao; image build mein skip theek hai.

</details>

### Easy · `:latest` tag se deploy

<details>
<summary>Answer</summary>

- Problem — kaunsa code chal raha hai pata nahi; rollback aur reproduce mushkil; nodes alag images pull kar sakte hain.
- Fix — immutable tag (git SHA/version) ya image digest (`@sha256:...`).

</details>

### Medium · Docker Compose mein DB connect nahi hota

App container `jdbc:postgresql://localhost:5432/shop` use karta hai aur fail hota hai.

<details>
<summary>Answer</summary>

- Kyun — container ke andar `localhost` app container khud hai.
- Fix — compose service name: `jdbc:postgresql://db:5432/shop`.
- Startup order — `depends_on: db: condition: service_healthy` + DB healthcheck; app mein bhi connection retry.

</details>

### Medium · Deploy par requests fail

Rolling deploy ke time kuch requests `502` deti hain. Graceful shutdown kaise karoge?

<details>
<summary>Answer</summary>

- Spring — `server.shutdown=graceful` (naye versions mein default) + `spring.lifecycle.timeout-per-shutdown-phase=20s`; in-flight requests finish hote hain.
- Kubernetes — SIGTERM par pehle readiness fail, load balancer ko hatane ka time (`preStop` sleep), `terminationGracePeriodSeconds` > shutdown timeout.
- Jobs — background workers ko bhi stop signal aur drain.

</details>

### Hard · Schema change ke saath safe deploy aur rollback

Release v2 `orders.status` column hatata hai. Deploy ke baad bug mila, v1 par rollback karna hai. Kya galat ho sakta hai aur sahi plan?

<details>
<summary>Answer</summary>

- Problem — v1 abhi bhi `status` padhta hai; column drop ho chuka toh app rollback se wapas nahi aayega.
- Plan — expand/contract: v2 sirf naya schema add kare aur purane ke saath compatible rahe; drop kai releases baad.
- Rule — app rollback code laata hai, data/schema nahi; har migration ko "N-1 version ke saath chalega?" test karo.
- Release — smoke check, staged rollout, monitoring, rollback steps pehle se likhe.

</details>

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/10-deployment-capstone.md)
