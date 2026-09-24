/**
 * ## Quick revision
 *
 * - View — saved query; regular view data ki separate copy nahi.
 * - Materialized view — stored result; refresh/freshness strategy chahiye.
 * - Transaction — BEGIN → work → COMMIT; failure par ROLLBACK.
 * - ACID — atomicity, consistency, isolation, durability ke guarantees.
 * - Isolation — concurrent visibility/anomalies ka contract; level ke hisaab se change.
 * - Savepoint — transaction ke ek part tak rollback.
 * - CTE — WITH se named intermediate query.
 * - Recursive CTE — base + recursive step; cycle/termination guard rakho.
 * - Lock/deadlock — short transactions, consistent order aur retry policy.
 * - Read anomaly — isolation level ke hisaab se repeat reads aur concurrent writes ka outcome differ.
 * - Transaction duration — remote call ke liye locks unnecessarily hold mat karo.
 * - Recursive safety — maximum depth/cycle guard aur result bound define karo.
 */

'use strict';


// -- Create a view
// CREATE VIEW active_users AS
// SELECT id, username, email
// FROM users
// WHERE is_active = TRUE;

// -- Use the view like a table
// SELECT * FROM active_users;
// SELECT * FROM active_users WHERE username LIKE 'g%';

// -- View with JOIN
// CREATE VIEW user_post_counts AS
// SELECT u.username, COUNT(p.id) AS post_count
// FROM users AS u
// LEFT JOIN posts AS p ON p.user_id = u.id
// GROUP BY u.username;

// -- Replace existing view
// CREATE OR REPLACE VIEW active_users AS
// SELECT id, username, email, created_at
// FROM users
// WHERE is_active = TRUE;

// -- Drop view
// DROP VIEW active_users;
// DROP VIEW IF EXISTS active_users;


// -- Create materialized view
// CREATE MATERIALIZED VIEW monthly_revenue AS
// SELECT
//     DATE_TRUNC('month', order_date) AS month,
//     SUM(total) AS revenue
// FROM orders
// GROUP BY DATE_TRUNC('month', order_date)
// ORDER BY month;

// -- Query it (fast! reads cached data)
// SELECT * FROM monthly_revenue;

// -- Refresh when data changes
// REFRESH MATERIALIZED VIEW monthly_revenue;

// -- Refresh without locking reads (CONCURRENTLY needs unique index)
// CREATE UNIQUE INDEX idx_mr_month ON monthly_revenue (month);
// REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;

// -- Drop materialized view
// DROP MATERIALIZED VIEW monthly_revenue;


// -- Basic CTE
// WITH active_users AS (
//     SELECT id, username
//     FROM users
//     WHERE is_active = TRUE
// )
// SELECT username FROM active_users;

// -- CTE replacing a complex subquery
// WITH user_photo_counts AS (
//     SELECT user_id, COUNT(*) AS photo_count
//     FROM photos
//     GROUP BY user_id
// )
// SELECT u.username, upc.photo_count
// FROM users AS u
// JOIN user_photo_counts AS upc ON upc.user_id = u.id
// WHERE upc.photo_count > 5;

// -- Multiple CTEs chained
// WITH
//     active AS (
//         SELECT * FROM users WHERE is_active = TRUE
//     ),
//     popular AS (
//         SELECT user_id, COUNT(*) AS likes
//         FROM post_likes
//         GROUP BY user_id
//         HAVING COUNT(*) > 100
//     )
// SELECT a.username, p.likes
// FROM active AS a
// JOIN popular AS p ON p.user_id = a.id;


// -- Count from 1 to 10
// WITH RECURSIVE counter AS (
//     SELECT 1 AS val                          -- Base case
//     UNION ALL
//     SELECT val + 1 FROM counter WHERE val < 10  -- Recursive case
// )
// SELECT * FROM counter;

// -- Organization hierarchy (employee → manager chain)
// WITH RECURSIVE org_chart AS (
//     -- Base: CEO (no manager)
//     SELECT id, name, manager_id, 1 AS depth
//     FROM employees
//     WHERE manager_id IS NULL
//
//     UNION ALL
//
//     -- Recursive: employees under each person
//     SELECT e.id, e.name, e.manager_id, oc.depth + 1
//     FROM employees AS e
//     JOIN org_chart AS oc ON e.manager_id = oc.id
// )
// SELECT * FROM org_chart ORDER BY depth, name;

// -- Category tree (nested categories)
// WITH RECURSIVE category_tree AS (
//     SELECT id, name, parent_id, name AS path
//     FROM categories
//     WHERE parent_id IS NULL
//
//     UNION ALL
//
//     SELECT c.id, c.name, c.parent_id,
//            ct.path || ' > ' || c.name
//     FROM categories AS c
//     JOIN category_tree AS ct ON c.parent_id = ct.id
// )
// SELECT * FROM category_tree;


// -- Transfer money: debit from A, credit to B (both or nothing!)
// BEGIN;
//     UPDATE accounts SET balance = balance - 500 WHERE id = 1;
//     UPDATE accounts SET balance = balance + 500 WHERE id = 2;
// COMMIT;

// -- If something goes wrong, rollback
// BEGIN;
//     UPDATE accounts SET balance = balance - 500 WHERE id = 1;
//     -- Oops, error detected!
// ROLLBACK;
// -- No changes saved, balance unchanged


// BEGIN;
//     INSERT INTO orders (product, qty) VALUES ('Widget', 10);
//     SAVEPOINT before_discount;
//
//     UPDATE products SET price = price * 0.5 WHERE name = 'Widget';
//     -- Oops, 50% discount is too much!
//
//     ROLLBACK TO before_discount;
//     -- Only the UPDATE is undone, INSERT is still there
//
//     UPDATE products SET price = price * 0.9 WHERE name = 'Widget';
//     -- 10% discount instead
// COMMIT;


// SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
// BEGIN;
//     SELECT * FROM accounts WHERE id = 1;
//     -- ... other operations ...
// COMMIT;


// -- Row number per user's photos (ordered by created_at)
// SELECT user_id, url,
//     ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS photo_num
// FROM photos;

// -- Running total of order amounts
// SELECT order_date, amount,
//     SUM(amount) OVER (ORDER BY order_date) AS running_total
// FROM orders;

// -- Rank products by price within each category
// SELECT category, name, price,
//     RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
// FROM products;

// -- Previous order amount (LAG)
// SELECT order_date, amount,
//     LAG(amount, 1) OVER (ORDER BY order_date) AS prev_amount
// FROM orders;


// -- UNION: all unique cities from both queries
// SELECT name FROM indian_cities
// UNION
// SELECT name FROM asian_cities;

// -- UNION ALL: with duplicates (faster)
// SELECT name FROM indian_cities
// UNION ALL
// SELECT name FROM asian_cities;

// -- INTERSECT: cities in both lists
// SELECT name FROM indian_cities
// INTERSECT
// SELECT name FROM asian_cities;

// -- EXCEPT: Indian cities NOT in Asian cities list
// SELECT name FROM indian_cities
// EXCEPT
// SELECT name FROM asian_cities;


const viewsRules = {
    views: 'Abstraction + Security — saved queries',
    materializedViews: 'Cache expensive queries — REFRESH manually',
    cte: 'WITH clause — readable, modular query blocks',
    recursiveCte: 'Hierarchical data — ALWAYS add termination',
    transactions: 'BEGIN + COMMIT/ROLLBACK — ACID guarantee',
    isolation: 'READ COMMITTED default — sufficient for most apps'
};

console.log('Views/CTE/Transaction rules:', viewsRules);
