'use strict';

/**
 * ========================================================================
 * VIEWS, TRANSACTIONS AND CTEs - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Views = saved queries jo virtual table ki tarah kaam karti hain.
 * - CTEs (Common Table Expressions) = readable, reusable query blocks (WITH clause).
 * - Transactions = multiple operations ko ek atomic unit banana.
 * - Ye sab SQL ke powerful features hain jo real apps me heavily use hote hain.
 */


/**
 * ========================================================================
 * 1. VIEWS — VIRTUAL TABLES
 * ========================================================================
 * NOTES:
 * - VIEW = saved SQL query. Data store NAHI karta, sirf query definition save hota hai.
 * - Jab VIEW query karo → underlying query har baar execute hoti hai.
 * - Complex queries ko simple naam de do → clean aur reusable.
 * - Security: Users ko direct table access nahi dena, sirf VIEW dikhana.
 * - Views ke through INSERT/UPDATE possible hai (simple views me).
 */

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


/**
 * ========================================================================
 * 2. MATERIALIZED VIEWS
 * ========================================================================
 * NOTES:
 * - Materialized View = query result CACHE karke disk pe STORE karta hai.
 * - Regular view har baar re-execute hoti hai. Materialized view cached result deti hai.
 * - FAST reads but data STALE ho sakta hai (auto-refresh nahi hota).
 * - REFRESH MANUALLY karna padta hai jab fresh data chahiye.
 * - Reporting, dashboards, analytics ke liye perfect.
 *
 * REGULAR VIEW vs MATERIALIZED VIEW:
 * ┌─────────────────────┬──────────────────────────┬──────────────────────────┐
 * │ Feature             │ Regular View              │ Materialized View        │
 * ├─────────────────────┼──────────────────────────┼──────────────────────────┤
 * │ Data Storage        │ No (runs query each time) │ Yes (cached on disk)     │
 * │ Read Speed          │ Depends on query           │ Fast (pre-computed)      │
 * │ Data Freshness      │ Always current              │ Stale until REFRESH      │
 * │ Index Support       │ No                          │ Yes                      │
 * │ Use Case            │ Simple abstraction          │ Expensive queries        │
 * └─────────────────────┴──────────────────────────┴──────────────────────────┘
 */

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


/**
 * ========================================================================
 * 3. CTE — COMMON TABLE EXPRESSIONS (WITH clause)
 * ========================================================================
 * NOTES:
 * - CTE = WITH clause se temporary named result set define karna.
 * - Query ko readable, modular blocks me todte hain.
 * - CTE sirf us single query ke scope me exist karta hai.
 * - Subquery ka cleaner, more readable alternative.
 * - Multiple CTEs comma se chain kar sakte ho.
 */

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


/**
 * ========================================================================
 * 4. RECURSIVE CTE
 * ========================================================================
 * NOTES:
 * - WITH RECURSIVE = CTE apne aap ko reference karke iterate karta hai.
 * - Hierarchical data ke liye perfect: org charts, categories, comments.
 * - Two parts:
 *   1. Base case (non-recursive — starting rows).
 *   2. Recursive case (UNION ALL — previous result reference karke expand).
 * - TERMINATION: Jab recursive part 0 rows return kare → stop.
 * - ⚠️ Infinite loop se bachne ke liye LIMIT ya depth column use karo.
 */

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


/**
 * ========================================================================
 * 5. TRANSACTIONS — ATOMIC OPERATIONS
 * ========================================================================
 * NOTES:
 * - Transaction = multiple SQL statements ka ek atomic unit.
 * - ACID properties:
 *   A = Atomicity: Sab succeed ya sab fail (partial nahi).
 *   C = Consistency: DB valid state me rahega.
 *   I = Isolation: Concurrent transactions ek dusre ko affect nahi karte.
 *   D = Durability: Commit ke baad data permanently saved.
 *
 * COMMANDS:
 * - BEGIN: Transaction start karo.
 * - COMMIT: Changes permanently save karo.
 * - ROLLBACK: Changes undo karo (transaction cancel).
 */

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


/**
 * ========================================================================
 * 6. SAVEPOINT
 * ========================================================================
 * NOTES:
 * - SAVEPOINT transaction ke andar ek checkpoint hai.
 * - ROLLBACK TO savepoint_name: partial undo (puri transaction cancel nahi).
 * - RELEASE savepoint: savepoint remove karo (memory free).
 * - Complex transactions me intermediate checkpoints ke liye useful.
 */

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


/**
 * ========================================================================
 * 7. TRANSACTION ISOLATION LEVELS [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Isolation level define karta hai ki concurrent transactions ek dusre ka data
 *   kitna dekh sakte hain.
 * - Higher isolation = more safety but slower performance.
 *
 * ┌────────────────────────┬──────────┬──────────────────┬──────────────┬───────────┐
 * │ Isolation Level        │ Dirty    │ Non-Repeatable   │ Phantom      │ Speed     │
 * │                        │ Read     │ Read             │ Read         │           │
 * ├────────────────────────┼──────────┼──────────────────┼──────────────┼───────────┤
 * │ READ UNCOMMITTED       │ Possible │ Possible         │ Possible     │ Fastest   │
 * │ READ COMMITTED (PG     │ No       │ Possible         │ Possible     │ Fast      │
 * │ default)               │          │                  │              │           │
 * │ REPEATABLE READ        │ No       │ No               │ Possible*    │ Moderate  │
 * │ SERIALIZABLE           │ No       │ No               │ No           │ Slowest   │
 * └────────────────────────┴──────────┴──────────────────┴──────────────┴───────────┘
 *
 * * PostgreSQL's REPEATABLE READ also prevents phantom reads (stronger than SQL standard).
 *
 * PROBLEM DEFINITIONS:
 * - Dirty Read: Uncommitted data dusre transaction ko dikhna.
 * - Non-Repeatable Read: Same row ko do baar read karo, different values.
 * - Phantom Read: Same query do baar run karo, different number of rows.
 *
 * PostgreSQL default: READ COMMITTED (practical for most apps).
 */

// SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
// BEGIN;
//     SELECT * FROM accounts WHERE id = 1;
//     -- ... other operations ...
// COMMIT;


/**
 * ========================================================================
 * 8. WINDOW FUNCTIONS (BONUS)
 * ========================================================================
 * NOTES:
 * - Window functions = aggregate jaisi but rows ko GROUP nahi karti.
 * - Har row apna value rakhti hai + window ke across calculated value bhi milta hai.
 * - OVER() clause define karta hai "window" (scope of rows for computation).
 * - PARTITION BY = groups define karo (like GROUP BY but rows preserved).
 * - ORDER BY inside OVER = window ke andar sort.
 *
 * COMMON WINDOW FUNCTIONS:
 * - ROW_NUMBER(): sequential number per partition
 * - RANK(): same values ko same rank (gaps allowed)
 * - DENSE_RANK(): same values ko same rank (no gaps)
 * - LAG(col, n): n rows peeche ki value
 * - LEAD(col, n): n rows aage ki value
 * - SUM/AVG/COUNT OVER(): running aggregate
 */

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


/**
 * ========================================================================
 * 9. UNION, INTERSECT, EXCEPT
 * ========================================================================
 * NOTES:
 * - Set operations: do queries ke results combine/compare karte hain.
 * - UNION: dono results merge (duplicates removed).
 * - UNION ALL: dono results merge (duplicates RAKHTA hai — faster).
 * - INTERSECT: sirf common rows (dono me exist kare).
 * - EXCEPT: pehli query ke rows minus dusri query ke rows.
 * - Column count aur types match ZARURI hai dono queries me.
 */

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


/**
 * ========================================================================
 * 10. VIEWS, CTE AND TRANSACTION RULES
 * ========================================================================
 * - Views security aur abstraction ke liye use karo.
 * - Materialized views expensive queries ko cache karo — REFRESH mat bhoolna.
 * - CTEs complex queries ko readable banate hain — subquery se prefer karo.
 * - Recursive CTEs me always termination condition rakho.
 * - Transactions me related operations group karo — ACID guarantee.
 * - SAVEPOINT partial rollback ke liye use karo.
 * - Default isolation READ COMMITTED — most apps ke liye sufficient.
 * - SERIALIZABLE sirf critical financial/inventory ops ke liye.
 * - Window functions aggregate results chahiye per-row basis pe toh use karo.
 */

const viewsRules = {
    views: 'Abstraction + Security — saved queries',
    materializedViews: 'Cache expensive queries — REFRESH manually',
    cte: 'WITH clause — readable, modular query blocks',
    recursiveCte: 'Hierarchical data — ALWAYS add termination',
    transactions: 'BEGIN + COMMIT/ROLLBACK — ACID guarantee',
    isolation: 'READ COMMITTED default — sufficient for most apps'
};

console.log('Views/CTE/Transaction rules:', viewsRules);
