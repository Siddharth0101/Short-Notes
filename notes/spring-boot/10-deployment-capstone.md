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

## Recall aur practice

- Sawal — Old container image restore karne se dropped database column automatically aa jayega?
- Jawaab — Nahi; artifact aur data/schema independent lifecycles. Compatible migration ya separately rehearsed recovery chahiye.
- Khud try karo — Capstone release checklist run karo; invalid config, readiness delay, in-flight shutdown aur prior image with upgraded schema acceptance define karo.

## Sources — aur padhne ke liye

- [Official reference yahan padho](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/10-deployment-capstone.md)
