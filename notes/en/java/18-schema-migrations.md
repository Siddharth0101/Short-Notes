---
id: java-schema-migrations
title: SQL schema design and safe migrations — evolve the data contract
track: java
order: 18
level: Intermediate
minutes: 6
summary: Migration — track a schema change in a versioned file.
tags: sql, normalization, constraints, migrations
---

## Quick revision

> Revision target — Plan a schema change together with old writers, existing rows and a recoverable rollout.

- Migration — track a schema change in a versioned file.
- Flyway/Liquibase — manage the history/checksum of applied changes.
- Applied migration — in a shared environment, write a new migration instead of editing it.
- Expand-contract — first a compatible addition, then move data/code, and remove the old field last.
- Backfill — update data in batches; monitor locks/load.
- Constraint — clean the existing data, then validate/enforce.
- Rollback — plan schema/data loss separately from an app rollback.
- Migration lock — concurrent deployers must not apply the same change; verify the tool's coordination.
- Forward fix — a new corrective migration can be better than a destructive rollback.
- Compatibility test — both the old and the new application must work on the shared schema of the rollout.

### Schema and constraints

- Normalization — separate repeated facts and reduce update anomalies.
- Denormalization — duplication for read speed; accept the sync cost.
- One-to-many — a child foreign key; many-to-many — a join table.
- Money/time — choose a precise numeric type and a clear timezone/instant contract.
- Natural/surrogate key — business identity / a generated ID; be clear about the uniqueness and change policy of both.
- Delete model — hard delete or soft delete; unique constraints, filtering and retention follow from it.
- Data grain — define exactly what one row represents, before the schema.
- NOT NULL — rejects a missing value.
- FOREIGN KEY — the referenced row must exist; define the delete/update action.
- CHECK — a row rule; NULL/unknown can pass, so apply NOT NULL separately.
- App validation — a clear message; DB constraint — the final guard against concurrent writes.
- Cross-row rule — a plain row CHECK cannot safely enforce rules over arbitrary other rows; choose an appropriate constraint/transaction.
- Constraint name — stable meaningful names let you map violations to useful errors.
- UNIQUE — rejects a duplicate key; NULL handling depends on the database/options.
- DEFAULT — the value is applied to an omitted field; an explicit NULL is not replaced automatically.
- Entity relation — an entity is an independent concept; a relation is its connection to another entity.
- Cascade delete — consciously choose the rule for a child when its parent is removed: delete, reject or null.

### Database test isolation

- Parallel tests — unique DB/schema/data keys; avoid shared cleanup races.
- Transactions — a test rollback works only when the operations are in the same controlled boundary.
- Test database — isolated from production data; verify the target of a destructive reset.
- Fixtures — a minimal deterministic seed, with per-test ownership.
- CI — verify migrations on a fresh database and on the upgrade path of an existing schema.

### SQL roles and permissions

- Role — a login identity or a permission group.
- GRANT/REVOKE — give/remove object privileges.
- Least privilege — the app has access only to the required tables/actions.
- Schema privileges — schema access and table access can be separate.
- RLS — tenant/user isolation through a row policy; understand the privileged bypass.
- Audit — record who/what/when; minimize the sensitive payload.
- Role inheritance — effective access can be more than the direct grants; audit the memberships.
- Owner privilege — the object owner can perform elevated operations; choose thoughtfully whether the app role is the owner.
- Parameterized SQL — binds values safely; choose an ORDER BY/table identifier from an allowlist.

### Schema types and permissions

- ALTER TABLE — evolves columns/constraints; check the lock duration and the compatibility of deployed clients.
- Relational normal forms — 1NF scalar fields, 2NF no partial-key dependency, 3NF no transitive non-key dependency.
- JSONB — PostgreSQL structured JSON; useful to query/index, not an automatic substitute for relational constraints.
- Polymorphic relation — referencing multiple tables by type + ID complicates foreign-key integrity; consider explicit tables/constraints.

### Edge cases and reasoning

- Unique claim — a pre-insert SELECT does not prevent a concurrent duplicate; a unique constraint and conflict handling are the final guard.
- Online index limits — lock/load behaviour is database/version-specific; PostgreSQL CREATE INDEX CONCURRENTLY does not run inside an ordinary transaction block.
- Backfill resumability — keep a stable batch key/checkpoint; on restart skip completed records safely and account for incompatible old writes.

## Understand it with an example

- Scenario — You have to add normalized_email to the Customer table; the old app writes only email and the existing rows contain duplicates.
- Reasoning — Add a compatible field, update the writers, backfill in resumable batches, resolve the duplicates, then enforce the intended constraint.
- Catch — Enforcing the constraint first can break old writes or historical rows; rolling back the deployed image will not restore lost data automatically.

## Recall and practice

- Question — Why can adding a new NOT NULL column immediately break the rollout of the old app?
- Answer — Old writers omit the field; enforce requiredness only after a compatible default/nullable expansion, a backfill and upgrading the writers.
- Try it yourself — Write an email normalization migration plan; verify duplicate historical data, parallel old/new writers, a restartable backfill and rollback compatibility.

## Practice questions

### Easy · Editing an applied migration

`V3__add_index.sql` has already run on production. You fixed a typo in it and deployed again. What will Flyway do?

<details>
<summary>Answer</summary>

- Result — validation fails: a checksum mismatch; the app will not start.
- Rule — applied migrations are immutable; write a new `V4__...` for the fix.
- `repair` — only when the checksum metadata is genuinely wrong; not as a shortcut for a schema change.

</details>

### Easy · Why constraints in the DB, and not only in the app?

<details>
<summary>Answer</summary>

- Multiple writers — scripts, admin tools and other services can bypass app validation.
- Races — two concurrent requests can both pass the app check and create a duplicate; the `UNIQUE` index is the final guard.
- Types — `NOT NULL`, `CHECK (amount >= 0)`, `FOREIGN KEY`; app validation is only for good error messages.

</details>

### Medium · Renaming a column without downtime

`users.fullname` has to become `full_name`, with a rolling deploy (old and new code will run together).

<details>
<summary>Answer</summary>

- Expand — add the new column `full_name`; the app writes to both columns and reads from the new one (falling back to the old).
- Backfill — `full_name = fullname` in batches wherever it is NULL.
- Switch — all instances on the new code; use only `full_name`.
- Contract — drop `fullname` in a later release.
- Why not a direct `RENAME` — the old instances would break immediately.

</details>

### Medium · A `NOT NULL` column on a large table

`orders`, with 50 million rows, needs a `source` column that is NOT NULL. The safe steps?

<details>
<summary>Answer</summary>

- Add nullable — `ALTER TABLE orders ADD COLUMN source text;` (fast).
- App — write the value in new rows.
- Backfill — small batches (e.g. 10k rows) + a pause; resumable (an id range or `WHERE source IS NULL`).
- Enforce — in PostgreSQL `CHECK (source IS NOT NULL) NOT VALID`, then `VALIDATE CONSTRAINT`, then `SET NOT NULL`.
- Note — in PostgreSQL 11+ adding it with a constant `DEFAULT` does not rewrite the table either.

</details>

### Hard · An index on a production table without blocking writes

<details>
<summary>Answer</summary>

```sql
SET lock_timeout = '5s';
CREATE INDEX CONCURRENTLY orders_customer_created_idx ON orders (customer_id, created_at DESC);
```

- `CONCURRENTLY` — writes keep running (a normal `CREATE INDEX` blocks writes); but it is slow and does two table scans.
- Transaction — `CONCURRENTLY` does not run inside a transaction block; mark that migration non-transactional in Flyway.
- Failure — an `INVALID` index is left behind; `DROP INDEX CONCURRENTLY` and retry.
- Verify — that the plan uses it, through `EXPLAIN`, and monitor write latency/locks.

</details>

## Sources — further reading

- [PostgreSQL concurrent index caveats](https://www.postgresql.org/docs/current/sql-createindex.html)

- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Spring Boot database initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/java/18-schema-migrations.md)
