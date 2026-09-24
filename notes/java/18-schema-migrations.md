---
id: java-schema-migrations
title: SQL schema design aur safe migrations — data ka contract evolve karo
track: java
order: 18
level: Intermediate
minutes: 1
summary: Migration — schema change ko versioned file mein track karo.
tags: sql, normalization, constraints, migrations
---

## Quick revision

- Migration — schema change ko versioned file mein track karo.
- Flyway/Liquibase — applied changes ka history/checksum manage karte hain.
- Applied migration — shared environment mein edit karne ke bajay nayi migration banao.
- Expand-contract — pehle compatible addition, phir data/code move, last mein old field hatao.
- Backfill — batches mein data update; locks/load monitor karo.
- Constraint — existing data clean karke validate/enforce karo.
- Rollback — schema/data loss ko app rollback se alag plan karo.
- Migration lock — concurrent deployers same change apply na karein; tool coordination verify.
- Forward fix — destructive rollback se better nayi corrective migration ho sakti hai.
- Compatibility test — old/new application dono rollout ke shared schema par kaam karein.

## Sources — aur padhne ke liye

- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Spring Boot database initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/18-schema-migrations.md)
