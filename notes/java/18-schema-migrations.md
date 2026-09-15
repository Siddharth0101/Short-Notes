---
id: java-schema-migrations
title: SQL schema design aur safe migrations — data ka contract evolve karo
track: java
order: 18
level: Intermediate
minutes: 33
summary: Database constraints concurrent writers ke against invariants protect karti hain; migration mein old aur new app versions dono ka behavior socho.
tags: sql, normalization, constraints, migrations
---

## Mental model — simple soch

Class ki validation sirf us application path par chalti hai. Database ko scripts, workers aur doosri app instances bhi write kar sakti hain. Schema shared contract hai: primary key identity, foreign key relation aur constraints allowed values define karte hain. Migration us contract ko existing data aur running code ke saath safely badalne ka process hai.

> **Core takeaway:** Pehle invariant database mein express karo; phir schema change ko compatible, measurable steps mein deploy karo.

JDBC aur SQL query lab ke baad padho. Yeh PostgreSQL teaching schema hai. Scratch database mein run karo; production migration directly copy mat karo. Business assumption: ek learner ko ek course mein maximum one enrollment.

## Normalization se duplication ki problem dekho

Agar har enrollment row par course title aur instructor email repeat karoge, ek rename ko hundred rows update karni padengi. Kuch rows miss hui toh conflicting truth banta hai. Course ki identity/data `course` table mein aur enrollment relation alag rakho. Lekin historical invoice ka price current course price se compute mat karo; transaction-time price intentional snapshot ho sakta hai.

```sql
CREATE TABLE learner (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
CREATE TABLE course (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL CHECK (length(trim(title)) > 0)
);
CREATE TABLE enrollment (
  learner_id bigint NOT NULL REFERENCES learner(id),
  course_id bigint NOT NULL REFERENCES course(id),
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  PRIMARY KEY (learner_id, course_id)
);
```

Composite key exact pair ko unique rakhti hai. Same learner different courses mein ho sakta hai. `CHECK` aur `NOT NULL` ka purpose alag hai: PostgreSQL CHECK unknown/null result ko reject nahi karta, isliye required value ke liye NOT NULL bhi chahiye. Email uniqueness ka casing/normalization rule business ko decide karna hai; above text uniqueness apne-aap case-insensitive identity nahi banati.

Foreign key referential validity prove karti hai, ownership authorization nahi. User ko learner_id body se choose karke kisi aur ki enrollment create karne mat do. PostgreSQL foreign key referencing columns par index automatically nahi banati; actual lookup/delete workload se index choose karo. Composite primary key ka leading learner_id lookup covered ho sakta hai; course-centric query ke liye alag index useful ho sakta hai.

## Migration ko expand, backfill, contract mein baanto

Maan lo existing `learner.display_name` ko `preferred_name` banana hai aur old app abhi running hai. Direct rename old queries tod dega. Safer sequence:

1. New nullable column add karo; old column available rahe.
2. Compatible writer deploy karo jo required transition policy follow kare. Dual-write fail/partial write ka contract define karo; same-row atomic update helpful hai.
3. Existing data small resumable batches mein backfill karo. Concurrent writes ko overwrite na karo; missing target values ya version condition use karo.
4. Row counts, nulls aur representative values verify karo; reader switch karo.
5. Jab old readers/writers gone hon, tab old column remove karo. Destructive step ka backup/recovery plan alag ho.

Applied migration ko edit karke history rewrite mat karo. New corrective migration add karo. Migration tool, Hibernate auto-DDL aur manually executed schema scripts ko competing authorities mat banao. Boot setup mein Flyway/Liquibase jaise chosen mechanism aur selected version ke dependencies use karo; learning environment ka create-drop production strategy nahi hai.

## Locks, rollout aur rollback

Small-looking ALTER bhi lock le sakta hai; exact operation/version/table size matter karte hain. Staging mein representative data par duration aur blocked queries observe karo. Backfill ko ek giant transaction mein rakhne se long locks, WAL growth aur recovery cost badh sakti hai.

App binary rollback aur data rollback same operation nahi. New writes new schema par ho chuki hain toh old app ko data samajh aana chahiye. Roll-forward corrective migration kai cases mein safer hoti hai. Dropped values backup ke bina magically restore nahi hongi.

## Practice — database ko final guard banao

Do sessions same learner/course insert karein. Exactly one row bache aur duplicate outcome application mein controlled response bane. Missing learner insert foreign key se fail ho. Progress -1/101 aur null reject hon. Migration test empty schema ke saath previous released schema plus sample data se upgrade bhi run kare; fresh install pass hone se existing-data upgrade prove nahi hota.

## Depth walkthrough — andar kya ho raha hai?

### Normalization ko actual update anomaly se samjho

Orders table har row par customerAddress ki current copy store karti hai. Customer address update par many rows change karni padti hain aur partial update inconsistent copies bana sakti hai. Customer reference current profile ke liye useful hai. Lekin historical delivery address order-time snapshot ho toh intentional duplication correct ho sakti hai. “Har duplicate field wrong” normalization rule nahi.

Migration mein add nullable column → compatible app write/read → bounded backfill → verify → constraint tighten ek possible expand/contract flow hai. Concurrent writes backfill ke during old/new fields consistent rakhne ka strategy chahiye. Backfill finished once bolkar race ignore mat karo.

**Practice:** Mid-backfill process stop aur restart karo. Already processed rows duplicate harmful effect na dein. Old app instance new schema use kar sake aur rollback window documented ho. Destructive column removal ko application binary rollback se recoverable mat label karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Validation aur database constraint dono kyun chahiye?

**Apply — khud try karo:** Old app display_name read karti hai. New app preferred_name read karegi. No-downtime rollout ka order aur recovery do.

> **Hint — chhota ishara:** Mixed-version deployment ko normal case samjho; destructive cleanup last mein karo.

**Answer guide — pehle khud karo, phir compare karo:** Expand column, compatible writes, resumable backfill, verify, read switch, old versions retire, phir contract. Before destructive cleanup compatible app rollback possible hai; after removal explicit recovery plan chahiye.

**Exit check — aage badhne se pehle:** Fresh install aur upgrade-from-previous-schema dono ka acceptance result batao.

## Sources — aur padhne ke liye

[PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) aur [Spring Boot database initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html) padho.
