---
id: java-schema-migrations
title: SQL schema design aur safe migrations — data ka contract evolve karo
track: java
order: 18
level: Intermediate
minutes: 3
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

### Schema aur constraints

- Normalization — repeated facts separate karo, update anomalies kam karo.
- Denormalization — read speed ke liye duplication; sync cost accept karo.
- One-to-many — child foreign key; many-to-many — join table.
- Money/time — precise numeric aur clear timezone/instant contract choose karo.
- Natural/surrogate key — business identity / generated ID; both ki uniqueness aur change policy clear.
- Delete model — hard delete ya soft delete; unique constraints, filtering aur retention accordingly.
- Data grain — ek row exactly kya represent karti hai, schema se pehle define.
- NOT NULL — missing value reject.
- FOREIGN KEY — referenced row exist kare; delete/update action define karo.
- CHECK — row rule; NULL/unknown pass ho sakta hai, NOT NULL alag lagao.
- App validation — clear message; DB constraint — concurrent writes ke against final guard.
- Cross-row rule — plain row CHECK se arbitrary other rows safely enforce nahi hote; appropriate constraint/transaction choose.
- Constraint name — stable meaningful names se violations ko useful errors mein map karo.
- UNIQUE — duplicate key reject; NULL handling database/options par depend karti hai.
- DEFAULT — omitted field par value lagti hai; explicit NULL automatically replace nahi hota.
- Entity relation — entity independent concept; relation uska doosri entity se connection.
- Cascade delete — parent hatne par child delete, reject ya null ka rule consciously choose karo.

### Database test isolation

- Parallel tests — unique DB/schema/data keys; shared cleanup races avoid.
- Transactions — test rollback tabhi kaam kare jab operations same controlled boundary mein hon.
- Test database — production data se isolated; destructive reset target verify.
- Fixtures — minimum deterministic seed, per-test ownership.
- CI — migrations fresh database par aur existing schema upgrade path par verify.

### SQL roles aur permissions

- Role — login identity ya permission group.
- GRANT/REVOKE — object privileges do/hatao.
- Least privilege — app ko required tables/actions tak access.
- Schema privileges — schema access aur table access alag ho sakte hain.
- RLS — row policy se tenant/user isolation; privileged bypass samjho.
- Audit — who/what/when record; sensitive payload minimize.
- Role inheritance — effective access direct grants se zyada ho sakta hai; memberships audit karo.
- Owner privilege — object owner elevated operations kar sakta hai; app role ko owner banana thoughtfully choose.
- Parameterized SQL — values safely bind; ORDER BY/table identifier allowlist se choose.

### Schema types aur permissions

- ALTER TABLE — columns/constraints evolve; lock duration aur deployed clients ka compatibility check.
- Relational normal forms — 1NF scalar fields, 2NF no partial-key dependency, 3NF no transitive non-key dependency.
- JSONB — PostgreSQL structured JSON; query/index useful, relational constraints ka automatic substitute nahi.
- Polymorphic relation — type + ID se multiple tables reference karna foreign-key integrity complicate karta hai; explicit tables/constraints consider.

## Sources — aur padhne ke liye

- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Spring Boot database initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/18-schema-migrations.md)
