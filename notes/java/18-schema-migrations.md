---
id: java-schema-migrations
title: SQL schema design aur safe migrations — data ka contract evolve karo
track: java
order: 18
level: Intermediate
minutes: 6
summary: Migration — schema change ko versioned file mein track karo.
tags: sql, normalization, constraints, migrations
---

## Quick revision

> Revision target — Schema change ko old writers, existing rows aur recoverable rollout ke saath plan karo.

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

### Edge cases aur reasoning

- Unique claim — pre-insert SELECT se concurrent duplicate prevent nahi; unique constraint aur conflict handling final guard hain.
- Online index limits — lock/load behavior database/version-specific; PostgreSQL CREATE INDEX CONCURRENTLY ordinary transaction block mein run nahi hota.
- Backfill resumability — stable batch key/checkpoint rakho; restart par completed records safely skip aur incompatible old writes account karo.

## Example se samjho

- Scenario — Customer table mein normalized_email add karna hai; old app sirf email write karti hai aur existing rows mein duplicates hain.
- Reasoning — Compatible field add karo, writers update karo, resumable batches se backfill, duplicates resolve, phir intended constraint enforce karo.
- Catch — Constraint pehle enforce karna old writes ya historical rows ko tod sakta hai; deployed image rollback lost data automatically restore nahi karega.

## Recall aur practice

- Sawal — New NOT NULL column ko immediately add karna old app rollout ko kyun tod sakta hai?
- Jawaab — Old writers field omit karte hain; compatible default/nullable expansion, backfill aur writers upgrade ke baad requiredness enforce karo.
- Khud try karo — Email normalization migration plan likho; duplicate historical data, parallel old/new writers, restartable backfill aur rollback compatibility verify karo.

## Practice questions

### Easy · Applied migration edit karna

`V3__add_index.sql` production par chal chuki hai. Tumne usme typo fix karke dobara deploy kiya. Flyway kya karega?

<details>
<summary>Answer</summary>

- Result — validation fail: checksum mismatch; app start nahi hogi.
- Rule — applied migrations immutable; fix ke liye naya `V4__...` likho.
- `repair` — sirf tab jab sach mein checksum metadata galat ho; schema change ke shortcut ke liye nahi.

</details>

### Easy · Constraints DB mein kyun, sirf app mein kyun nahi?

<details>
<summary>Answer</summary>

- Multiple writers — scripts, admin tools, doosri services app validation bypass kar sakte hain.
- Races — do concurrent requests dono app check pass karke duplicate bana sakte hain; `UNIQUE` index final guard hai.
- Types — `NOT NULL`, `CHECK (amount >= 0)`, `FOREIGN KEY`; app validation sirf achhe error messages ke liye.

</details>

### Medium · Column rename bina downtime

`users.fullname` ko `full_name` karna hai, rolling deploy ke saath (purana aur naya code saath chalega).

<details>
<summary>Answer</summary>

- Expand — naya column `full_name` add; app dono columns mein likhe, naye se padhe (fallback purana).
- Backfill — batches mein `full_name = fullname` jahan NULL.
- Switch — saare instances naye code par; sirf `full_name` use.
- Contract — baad ke release mein `fullname` drop.
- Kyun nahi direct `RENAME` — purane instances turant toot jaayenge.

</details>

### Medium · Bade table par `NOT NULL` column

50 million rows wale `orders` mein `source` column chahiye jo NOT NULL ho. Safe steps?

<details>
<summary>Answer</summary>

- Add nullable — `ALTER TABLE orders ADD COLUMN source text;` (fast).
- App — naye rows mein value likho.
- Backfill — chhote batches (e.g. 10k rows) + pause; resumable (id range ya `WHERE source IS NULL`).
- Enforce — PostgreSQL mein `CHECK (source IS NOT NULL) NOT VALID`, phir `VALIDATE CONSTRAINT`, phir `SET NOT NULL`.
- Note — PostgreSQL 11+ mein constant `DEFAULT` ke saath add bhi table rewrite nahi karta.

</details>

### Hard · Production table par index bina writes block kiye

<details>
<summary>Answer</summary>

```sql
SET lock_timeout = '5s';
CREATE INDEX CONCURRENTLY orders_customer_created_idx ON orders (customer_id, created_at DESC);
```

- `CONCURRENTLY` — writes chalte rehte hain (normal `CREATE INDEX` writes block karta hai); par slow hai aur do table scans karta hai.
- Transaction — `CONCURRENTLY` transaction block ke andar nahi chalta; Flyway mein us migration ko non-transactional mark karo.
- Failure — `INVALID` index bach jaata hai; `DROP INDEX CONCURRENTLY` karke retry.
- Verify — `EXPLAIN` se plan use ho raha hai, aur write latency/locks monitor.

</details>

## Sources — aur padhne ke liye

- [PostgreSQL concurrent index caveats](https://www.postgresql.org/docs/current/sql-createindex.html)

- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Spring Boot database initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/java/18-schema-migrations.md)
