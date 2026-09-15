---
id: java-sql-interview-lab
title: SQL joins windows and transaction races
track: java
order: 14
level: Advanced
minutes: 28
summary: LEFT JOIN unmatched left rows bachata hai, lekin baad ka WHERE filter unhe phir hata sakta hai.
tags: sql, postgres, joins, windows, transactions
visual: transaction-race
---

## Mental model — simple soch

SQL set-oriented hai: first decide what one output row represents. Join errors aksar row ka meaning mix karne se aati hain: one customer ke many orders aur many payments join karke multiplied result aggregate kar diya jaata hai. Java mapping cannot repair an incorrect relational query.

PostgreSQL assume karo: customers(id,name), orders(id,customer_id,total,created_at). total ek specified currency ka decimal amount hai. Production schema mein currency aur nullability explicit rakho.

> **Core takeaway:** LEFT JOIN unmatched left rows bachata hai, lekin baad ka WHERE filter unhe phir hata sakta hai.

## Top two orders per customer

```sql
WITH ranked AS (
  SELECT id, customer_id, total, created_at,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY total DESC, id ASC
         ) AS rn
  FROM orders
)
SELECT customer_id, id, total
FROM ranked
WHERE rn <= 2
ORDER BY customer_id, rn;
```

ROW_NUMBER per customer maximum two rows choose karta hai. RANK/DENSE_RANK ka tie contract alag hai aur zyada rows de sakta hai. Equal totals par id deterministic tie-breaker hai. Window ka ordering final result sort guarantee nahi karta; outer ORDER BY bhi chahiye.

## Preserve customers without orders

```sql
SELECT c.id, COUNT(o.id) AS recent_orders
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.created_at >= TIMESTAMP '2026-01-01 00:00:00'
GROUP BY c.id;
```

COUNT(o.id) NULL-extended row ignore karta hai; COUNT(*) use count karega. Date condition WHERE mein move karne se no-matching-order customers hat jaate hain. Real instants store hon toh agreed timezone-aware type/boundary lo; yahan literal timestamp-without-timezone schema assume karta hai.

## A transaction is not a concurrency policy

Do buyers stock=1 read karke dono purchase decide kar sakte hain. Is invariant ke liye atomic conditional update use karo:

```sql
UPDATE inventory
SET stock = stock - 1
WHERE product_id = $1 AND stock > 0
RETURNING stock;
```

Zero returned rows ka matlab reservation nahi hui. Same DB boundary ho toh reservation/order usi transaction mein insert karo. Read-then-write ko transaction wrap kar dena har anomaly automatically nahi rokta; isolation aur actual statements matter karte hain.

PostgreSQL Read Committed statement snapshots use karta hai. Serializable transaction abort ho sakti hai; complete transaction retry karni pad sakti hai. Email jaise external effects retry mein blindly repeat mat karo; outbox ya explicit handoff rakho.

## Practice

No-order customer, tied totals aur per-order two payments ke fixtures banao. Query run se pehle output predict karo. Payments join ke baad order total sum double kyun hota hai, samjhao. Last unit ke liye two concurrent reservations chalao; exactly one success assert karo. Sequential test yeh race expose nahi karta.

## Interview questions — bolkar practice karo

**DISTINCT se join fix suspicious kyun hai?** Row-grain bug hide ho sakta hai aur aggregate phir bhi wrong reh sakta hai. Relationship correct karo ya har one-to-many side pre-aggregate karo.

**JPA pagination predictable kaise banegi?** Deterministic order define karo, generated SQL dekho aur collection fetch join parent pagination cleanly karega, yeh assume mat karo.

## Research notes: Read estimates alongside actual query work

EXPLAIN plan batata hai; EXPLAIN ANALYZE query execute bhi karta hai. Estimated/actual row counts aur repeated work compare karo.

```sql
-- Local fixture with realistic tenant sizes:
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at FROM orders
WHERE tenant_id = 7
ORDER BY created_at DESC, id DESC
LIMIT 25;
```

Most rows chahiye hon toh sequential scan reasonable ho sakta hai. Large estimation mismatch poor scan/join choice indicate kar sakti hai. Write par ANALYZE actual write karega; disposable fixtures par experiment karo.

**Interview check:** Plan node cheap dikhe toh loops kyun inspect karein?

**Answer:** Cheap work bahut baar repeat hokar total cost dominate kar sakta hai. Per-loop timing ko execution count aur parent plan ke saath padho.

**Practice:** Tiny tenant aur most-rows-owning tenant ke plans compare karo.

[Source yahan padho — PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Join se pehle har row ka meaning likho

Customer C ke 2 orders aur 3 payments hain. Dono child tables ko independently customer_id par join karoge toh 2×3=6 combinations mil sakti hain. Order amounts aggregation mein repeat honge. DISTINCT ko random patch lagane ke bajay intended grain define karo: one row per customer, per order ya per payment?

Customer totals chahiye toh orders aur payments ko separately per-customer aggregate karke resulting one-row summaries join kar sakte ho. Payment actual order belong karti ho toh correct relationship order_id ho sakta hai. Schema relation aur asked result dono inspect karo.

LEFT JOIN ke baad child filter WHERE mein lagao toh null-extended rows remove ho sakti hain; “customers without orders bhi chahiye” contract toot sakta hai. Filter ON mein ya aggregate conditional expression mein rakhne ka decision semantics se karo.

**Practice:** One customer zero orders, one two orders, duplicate timestamps aur null optional fields ka tiny dataset banao. Expected rows haath se likho, phir query run karo. Window function ranking ke tie behavior ko ROW_NUMBER/RANK/DENSE_RANK choice se explain karo; sirf syntax correct hona enough nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Customers A aur B hain; sirf A ka ek paid order hai. Dono ko paid-order count ke saath return karo. Paid-status condition kahan rakho?

> **Hint — chhota ishara:** Joined order par WHERE condition B ki NULL wali row remove kar sakti hai.

**Answer guide — pehle khud karo, phir compare karo:** Status condition JOIN ke ON mein rakho, customer identity se group karo aur non-null order ID count karo. A=1, B=0 milega. COUNT(*) B ki preserved row ko bhi 1 ginega; woh matching orders ki count nahi hai.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[PostgreSQL transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) aur [window functions](https://www.postgresql.org/docs/18/tutorial-window.html) mein query/concurrency rules padho.
