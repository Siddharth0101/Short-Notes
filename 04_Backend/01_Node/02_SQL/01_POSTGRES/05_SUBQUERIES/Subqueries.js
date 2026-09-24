/**
 * ## Quick revision
 *
 * - Scalar subquery — single value; extra rows par error ho sakta hai.
 * - Derived table — FROM mein query result ko relation banao.
 * - IN — returned values mein membership; EXISTS — koi matching row hai?
 * - Correlated query — outer row ko refer; actual cost query plan se dekho.
 * - NOT EXISTS — missing relationship find karne ka useful pattern.
 * - NOT IN + NULL — unexpected unknown result; null behavior verify.
 * - ANY/ALL — comparison kisi / sab returned values se.
 * - CTE — named subquery; automatically faster ya always materialized assume mat karo.
 * - Scalar cardinality — zero rows par scalar subquery NULL de sakti hai; missing result handle karo.
 * - EXISTS projection — existence matters, selected column value nahi.
 * - Rewrite choice — correlated query vs join ka actual plan compare; syntax alone performance proof nahi.
 */

'use strict';


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


// -- Users who have posted comments
// SELECT * FROM users
// WHERE id IN (SELECT user_id FROM comments);

// -- Users who have NOT posted any comments
// SELECT * FROM users
// WHERE id NOT IN (
//     SELECT user_id FROM comments WHERE user_id IS NOT NULL
// );
// -- ⚠️ user_id IS NOT NULL filter important hai NOT IN me!


// -- Each product with the overall max price shown alongside
// SELECT name, price,
//     (SELECT MAX(price) FROM products) AS max_price
// FROM products;

// -- Each product's price as a ratio of the average
// SELECT name, price,
//     price / (SELECT AVG(price) FROM products) AS price_ratio
// FROM products;


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
