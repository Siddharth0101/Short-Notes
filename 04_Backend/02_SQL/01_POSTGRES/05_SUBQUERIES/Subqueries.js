'use strict';

/**
 * ========================================================================
 * SUBQUERIES - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Subquery = query ke andar query (nested query / inner query).
 * - Subquery pehle execute hota hai, uska result outer query use karti hai.
 * - Subqueries SELECT, FROM, WHERE, HAVING — kahin bhi use ho sakte hain.
 * - Subquery hamesha parentheses () me likhi jaati hai.
 */


/**
 * ========================================================================
 * 1. SUBQUERY IN WHERE
 * ========================================================================
 * NOTES:
 * - Most common use case: WHERE condition me dynamic value chahiye.
 * - Pehle inner query run hoti hai, phir uska result outer WHERE me use hota hai.
 * - Scalar subquery (single value) ke saath =, >, < operators use karo.
 * - Multi-row subquery ke saath IN, ANY, ALL operators use karo.
 */

// -- Products priced above average
// SELECT name, price
// FROM products
// WHERE price > (SELECT AVG(price) FROM products);

// -- Users who have posted at least one photo
// SELECT username
// FROM users
// WHERE id IN (SELECT DISTINCT user_id FROM photos);

// -- Cities more populated than 'Delhi'
// SELECT name, population
// FROM cities
// WHERE population > (SELECT population FROM cities WHERE name = 'Delhi');


/**
 * ========================================================================
 * 2. SUBQUERY RETURN TYPES
 * ========================================================================
 *
 * ┌─────────────────────────┬──────────────────────────────────────────────────────┐
 * │ Return Type             │ Use With                                             │
 * ├─────────────────────────┼──────────────────────────────────────────────────────┤
 * │ Scalar (single value)   │ =, >, <, >=, <=, <> operators                       │
 * │ Single column, many     │ IN, NOT IN, ANY, ALL operators                       │
 * │ rows                    │                                                      │
 * │ Many columns, many      │ EXISTS, FROM clause (derived table)                  │
 * │ rows                    │                                                      │
 * └─────────────────────────┴──────────────────────────────────────────────────────┘
 *
 * RULE:
 * - Scalar subquery expected jagah pe multi-row subquery doge toh ERROR aayega.
 * - Hamesha check karo subquery kya return kar rahi hai.
 */


/**
 * ========================================================================
 * 3. IN WITH SUBQUERY
 * ========================================================================
 * NOTES:
 * - IN subquery = "kya value is list me hai?"
 * - Subquery ek column ki multiple rows return karni chahiye.
 * - NOT IN = "kya value is list me NAHI hai?"
 * - ⚠️ NOT IN me agar subquery NULL return kare toh result EMPTY hota hai!
 *   (NULL ke saath koi bhi comparison unknown hota hai).
 */

// -- Users who have posted comments
// SELECT * FROM users
// WHERE id IN (SELECT user_id FROM comments);

// -- Users who have NOT posted any comments
// SELECT * FROM users
// WHERE id NOT IN (
//     SELECT user_id FROM comments WHERE user_id IS NOT NULL
// );
// -- ⚠️ user_id IS NOT NULL filter important hai NOT IN me!


/**
 * ========================================================================
 * 4. SUBQUERY IN SELECT (SCALAR SUBQUERY)
 * ========================================================================
 * NOTES:
 * - SELECT clause me subquery se computed column add kar sakte ho.
 * - Ye subquery SCALAR honi chahiye (ek value return kare).
 * - Har row ke liye subquery execute hoti hai (can be slow!).
 */

// -- Each product with the overall max price shown alongside
// SELECT name, price,
//     (SELECT MAX(price) FROM products) AS max_price
// FROM products;

// -- Each product's price as a ratio of the average
// SELECT name, price,
//     price / (SELECT AVG(price) FROM products) AS price_ratio
// FROM products;


/**
 * ========================================================================
 * 5. SUBQUERY IN FROM (DERIVED TABLE)
 * ========================================================================
 * NOTES:
 * - FROM clause me subquery ka result ek temporary table ki tarah kaam karta hai.
 * - Ise "derived table" ya "inline view" kehte hain.
 * - Derived table ko ALIAS dena ZARURI hai.
 * - Complex transformations ke liye useful.
 */

// -- Average of photo counts per user
// SELECT AVG(photo_count) AS avg_photos_per_user
// FROM (
//     SELECT user_id, COUNT(*) AS photo_count
//     FROM photos
//     GROUP BY user_id
// ) AS user_photo_counts;

// -- Top 5 most active users' details
// SELECT u.username, sub.photo_count
// FROM users AS u
// JOIN (
//     SELECT user_id, COUNT(*) AS photo_count
//     FROM photos
//     GROUP BY user_id
//     ORDER BY photo_count DESC
//     LIMIT 5
// ) AS sub ON sub.user_id = u.id;


/**
 * ========================================================================
 * 6. EXISTS AND NOT EXISTS
 * ========================================================================
 * NOTES:
 * - EXISTS check karta hai ki subquery koi row return karti hai ya nahi.
 * - EXISTS = TRUE agar subquery me at least 1 row aaye.
 * - NOT EXISTS = TRUE agar subquery me 0 rows aayein.
 * - EXISTS IN se FASTER ho sakta hai large datasets pe.
 * - NOT EXISTS NULL-safe hai (NOT IN ki tarah NULL issue nahi).
 */

// -- Users who have at least one photo
// SELECT u.username
// FROM users AS u
// WHERE EXISTS (
//     SELECT 1 FROM photos AS p WHERE p.user_id = u.id
// );

// -- Users who have NO photos (NULL-safe alternative to NOT IN)
// SELECT u.username
// FROM users AS u
// WHERE NOT EXISTS (
//     SELECT 1 FROM photos AS p WHERE p.user_id = u.id
// );


/**
 * ========================================================================
 * 7. ANY AND ALL
 * ========================================================================
 * NOTES:
 * - ANY / SOME: condition kisi EK value ke saath true ho toh overall true.
 * - ALL: condition SARI values ke saath true ho toh overall true.
 * - Ye multi-row subquery ke saath comparison operators use karte hain.
 *
 * ┌──────────────┬──────────────────────────────────────────────────────────┐
 * │ Expression   │ Meaning                                                  │
 * ├──────────────┼──────────────────────────────────────────────────────────┤
 * │ > ANY (...)  │ Greater than the SMALLEST value in the list              │
 * │ > ALL (...)  │ Greater than the LARGEST value in the list               │
 * │ = ANY (...)  │ Equal to ANY value in list (same as IN)                  │
 * │ <> ALL (...) │ Not equal to ALL values (same as NOT IN)                 │
 * └──────────────┴──────────────────────────────────────────────────────────┘
 */

// -- Products more expensive than ANY product in 'Electronics' category
// SELECT name, price FROM products
// WHERE price > ANY (
//     SELECT price FROM products WHERE category = 'Electronics'
// );

// -- Products more expensive than ALL products in 'Books' category
// SELECT name, price FROM products
// WHERE price > ALL (
//     SELECT price FROM products WHERE category = 'Books'
// );


/**
 * ========================================================================
 * 8. CORRELATED SUBQUERIES
 * ========================================================================
 * NOTES:
 * - Normal subquery independently run hoti hai (ek baar).
 * - Correlated subquery OUTER query ki har row ke liye bar bar run hoti hai.
 * - Correlated subquery outer table ke column ko reference karti hai.
 * - Slow ho sakti hai large tables pe (N times execute hoti hai).
 * - EXISTS naturally correlated hoti hai.
 */

// -- Employees earning more than their department's average
// SELECT e.name, e.salary, e.department
// FROM employees AS e
// WHERE e.salary > (
//     SELECT AVG(salary)
//     FROM employees
//     WHERE department = e.department    -- outer query reference!
// );

// -- Most recent order per customer (correlated)
// SELECT * FROM orders AS o1
// WHERE o1.order_date = (
//     SELECT MAX(o2.order_date)
//     FROM orders AS o2
//     WHERE o2.customer_id = o1.customer_id    -- correlated!
// );


/**
 * ========================================================================
 * 9. LATERAL JOIN
 * ========================================================================
 * NOTES:
 * - LATERAL = subquery jo outer query ki current row ko reference kar sake.
 * - Normal FROM subquery me outer columns access nahi kar sakte — LATERAL se kar sakte ho.
 * - Correlated subquery ka FROM-clause version.
 * - Very powerful for "top N per group" queries.
 * - PostgreSQL specific feature (MySQL me nahi tha, ab hai).
 */

// -- Top 2 most expensive products per category
// SELECT c.name AS category, p.name, p.price
// FROM categories AS c,
// LATERAL (
//     SELECT name, price
//     FROM products
//     WHERE products.category_id = c.id     -- outer reference!
//     ORDER BY price DESC
//     LIMIT 2
// ) AS p;


/**
 * ========================================================================
 * 10. SUBQUERY vs JOIN — WHEN TO USE WHAT
 * ========================================================================
 *
 * ┌────────────────────────┬────────────────────────────────────────────────────┐
 * │ Subquery               │ JOIN                                               │
 * ├────────────────────────┼────────────────────────────────────────────────────┤
 * │ Filtering (WHERE/      │ Combining data from multiple tables               │
 * │ HAVING) ke liye best   │ in the result set                                  │
 * ├────────────────────────┼────────────────────────────────────────────────────┤
 * │ Single value compute   │ Multiple columns from related                     │
 * │ (avg, max, count)      │ tables chahiye                                     │
 * ├────────────────────────┼────────────────────────────────────────────────────┤
 * │ EXISTS for checking    │ Aggregation across joined                         │
 * │ existence              │ data needed                                        │
 * ├────────────────────────┼────────────────────────────────────────────────────┤
 * │ Readability (sometimes │ Performance (usually faster                        │
 * │ clearer logic)         │ than correlated subqueries)                        │
 * └────────────────────────┴────────────────────────────────────────────────────┘
 *
 * RULE: Most subqueries can be rewritten as JOINs.
 * Optimizer often handles both similarly, but JOINs are generally preferred for performance.
 */


/**
 * ========================================================================
 * 11. SUBQUERY RULES
 * ========================================================================
 * - Subquery hamesha parentheses () me likho.
 * - Scalar subquery = operators (=, >, <) ke saath use karo.
 * - Multi-row subquery IN, ANY, ALL, EXISTS ke saath.
 * - NOT IN me NULL se bachne ke liye IS NOT NULL filter lagao.
 * - NOT EXISTS NULL-safe hai — prefer karo NOT IN pe.
 * - FROM me subquery ko alias dena ZARURI hai.
 * - Correlated subquery slow hoti hai — large data pe JOIN prefer karo.
 * - LATERAL JOIN = correlated subquery in FROM clause.
 */

const subqueryRules = {
    parentheses: 'Always wrap in ()',
    scalar: 'Use with =, >, < operators',
    multiRow: 'Use with IN, ANY, ALL, EXISTS',
    notInNull: 'NOT IN fails with NULL — add IS NOT NULL filter',
    notExists: 'NULL-safe alternative to NOT IN',
    fromAlias: 'Derived tables need an alias',
    correlated: 'Runs per outer row — can be slow'
};

console.log('Subquery rules:', subqueryRules);
