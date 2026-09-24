/**
 * ## Quick revision
 *
 * - Aggregate — COUNT, SUM, AVG, MIN, MAX rows ko summarize karte hain.
 * - COUNT(*) — rows; COUNT(column) — non-null values.
 * - GROUP BY — per-key groups; aggregates har group par.
 * - WHERE — grouping se pehle row filter; HAVING — grouping ke baad group filter.
 * - NULL — most aggregates ignore; empty set ka result function par depend.
 * - DISTINCT aggregate — repeated values count/sum se hata sakte ho.
 * - Window — rank/running totals ke saath original rows preserve.
 * - GROUPING SETS/ROLLUP — multiple aggregation levels ek query mein.
 * - Aggregate filter — alag conditions ke counts same grouping mein conditional aggregate se nikalo.
 * - Join inflation — child rows multiply hon toh sum/count overcount; correct grain par aggregate karo.
 * - Window order — ties ke liye deterministic tie-breaker; result display order separately define karo.
 */

'use strict';


// SELECT COUNT(*) FROM photos;                         -- Total rows
// SELECT COUNT(user_id) FROM photos;                   -- Non-null user_ids
// SELECT COUNT(DISTINCT user_id) FROM photos;           -- Unique users with photos
// SELECT SUM(population) FROM cities;                   -- Total population
// SELECT AVG(area) FROM cities;                          -- Average area
// SELECT MIN(price) FROM products;                       -- Cheapest product
// SELECT MAX(price) FROM products;                       -- Most expensive product


// -- Count photos per user
// SELECT user_id, COUNT(*) AS photo_count
// FROM photos
// GROUP BY user_id;

// -- Population per country
// SELECT country, SUM(population) AS total_population
// FROM cities
// GROUP BY country;

// -- Multiple columns in GROUP BY
// SELECT country, difficulty, COUNT(*) AS tour_count
// FROM tours
// GROUP BY country, difficulty;


// -- Users jinhone 2 se zyada photos upload ki
// SELECT user_id, COUNT(*) AS photo_count
// FROM photos
// GROUP BY user_id
// HAVING COUNT(*) > 2;

// -- Countries with total population > 50 million
// SELECT country, SUM(population) AS total_pop
// FROM cities
// GROUP BY country
// HAVING SUM(population) > 50000000;


// -- Cities in Asia, group by country, only countries with avg population > 5M
// SELECT country, COUNT(*) AS city_count, AVG(population) AS avg_pop
// FROM cities
// WHERE continent = 'Asia'
// GROUP BY country
// HAVING AVG(population) > 5000000
// ORDER BY avg_pop DESC;


// -- Each user ka photo count (including users with 0 photos)
// SELECT u.username, COUNT(p.id) AS photo_count
// FROM users AS u
// LEFT JOIN photos AS p ON p.user_id = u.id
// GROUP BY u.username
// ORDER BY photo_count DESC;

// -- Each user ka total comment count across all their photos
// SELECT u.username, COUNT(c.id) AS comment_count
// FROM users AS u
// JOIN photos AS p ON p.user_id = u.id
// JOIN comments AS c ON c.photo_id = p.id
// GROUP BY u.username;


// SELECT
//     COUNT(*) AS total_rows,
//     COUNT(user_id) AS non_null_users,
//     COUNT(DISTINCT user_id) AS unique_users
// FROM photos;


// SELECT ROUND(AVG(population), 2) AS avg_pop FROM cities;
// SELECT TRUNC(AVG(price), 2) AS avg_price FROM products;
// SELECT CEIL(4.1);   -- 5
// SELECT FLOOR(4.9);  -- 4


const aggregateRules = {
    nullHandling: 'Aggregates ignore NULL (except COUNT(*))',
    groupByRule: 'Non-aggregated columns must be in GROUP BY',
    whereVsHaving: 'WHERE = row filter, HAVING = group filter',
    countStar: 'COUNT(*) counts all rows including NULL',
    countColumn: 'COUNT(col) counts only non-NULL values'
};

console.log('Aggregate rules:', aggregateRules);
