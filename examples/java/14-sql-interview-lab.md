# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Preserve customers without orders

```sql
SELECT c.id, COUNT(o.id) AS recent_orders
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.created_at >= TIMESTAMP '2026-01-01 00:00:00'
GROUP BY c.id;
```

## A transaction is not a concurrency policy

```sql
UPDATE inventory
SET stock = stock - 1
WHERE product_id = $1 AND stock > 0
RETURNING stock;
```

## Research notes: Read estimates alongside actual query work

```sql
-- Local fixture with realistic tenant sizes:
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at FROM orders
WHERE tenant_id = 7
ORDER BY created_at DESC, id DESC
LIMIT 25;
```
