'use strict';

/**
 * ========================================================================
 * AGGREGATION AND GROUPING - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Aggregate functions multiple rows ka data COMBINE karke ek value deti hain.
 * - GROUP BY rows ko groups me divide karta hai, phir har group pe aggregate run hota hai.
 * - HAVING groups ko filter karta hai (WHERE rows filter karta hai).
 */


/**
 * ========================================================================
 * 1. AGGREGATE FUNCTIONS [⚡ VISUAL]
 * ========================================================================
 *
 * ┌──────────────────┬──────────────────────────────────────────────────────┐
 * │ Function         │ Description                                          │
 * ├──────────────────┼──────────────────────────────────────────────────────┤
 * │ COUNT(*)         │ Total number of rows                                 │
 * │ COUNT(column)    │ Non-NULL values count in that column                 │
 * │ COUNT(DISTINCT c)│ Unique non-NULL values count                         │
 * │ SUM(column)      │ Total sum of numeric column                          │
 * │ AVG(column)      │ Average of numeric column                            │
 * │ MIN(column)      │ Minimum value                                        │
 * │ MAX(column)      │ Maximum value                                        │
 * └──────────────────┴──────────────────────────────────────────────────────┘
 *
 * NOTES:
 * - COUNT(*) = sab rows count karta hai (NULL bhi).
 * - COUNT(column) = sirf non-NULL rows count karta hai.
 * - SUM/AVG sirf numeric columns pe kaam karte hain.
 * - MIN/MAX strings pe bhi kaam karte hain (alphabetical order).
 * - Aggregate functions NULL values IGNORE karte hain (except COUNT(*)).
 */

// SELECT COUNT(*) FROM photos;                         -- Total rows
// SELECT COUNT(user_id) FROM photos;                   -- Non-null user_ids
// SELECT COUNT(DISTINCT user_id) FROM photos;           -- Unique users with photos
// SELECT SUM(population) FROM cities;                   -- Total population
// SELECT AVG(area) FROM cities;                          -- Average area
// SELECT MIN(price) FROM products;                       -- Cheapest product
// SELECT MAX(price) FROM products;                       -- Most expensive product


/**
 * ========================================================================
 * 2. GROUP BY
 * ========================================================================
 * NOTES:
 * - GROUP BY rows ko categories me divide karta hai.
 * - Har group pe aggregate function separately run hota hai.
 * - SELECT me sirf 2 cheezein allowed hain:
 *   1. Grouped column(s).
 *   2. Aggregate function results.
 *   ❌ Non-grouped, non-aggregated columns SELECT me NAHI likh sakte!
 * - GROUP BY ek ya multiple columns pe ho sakta hai.
 */

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


/**
 * ========================================================================
 * 3. GROUP BY IMPORTANT RULE ⚠️
 * ========================================================================
 * NOTES:
 * - Agar SELECT me aggregate function use ho raha hai toh:
 *   - Har non-aggregated column GROUP BY me HONA chahiye.
 *   - Otherwise error: "column must appear in GROUP BY clause"
 *
 * VALID:
 *   SELECT country, COUNT(*) FROM cities GROUP BY country;    ✅
 *
 * INVALID:
 *   SELECT country, name, COUNT(*) FROM cities GROUP BY country;  ❌
 *   (name grouped nahi hai aur aggregated bhi nahi)
 */


/**
 * ========================================================================
 * 4. HAVING — FILTER GROUPS
 * ========================================================================
 * NOTES:
 * - HAVING groups ko filter karta hai — aggregate result pe condition.
 * - WHERE vs HAVING:
 *   - WHERE: Individual ROWS filter karta hai (GROUP BY se PEHLE).
 *   - HAVING: GROUPS filter karta hai (GROUP BY ke BAAD).
 * - HAVING me aggregate functions use kar sakte ho, WHERE me NAHI.
 *
 * EXECUTION ORDER:
 * FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
 */

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


/**
 * ========================================================================
 * 5. WHERE + GROUP BY + HAVING TOGETHER
 * ========================================================================
 * NOTES:
 * - WHERE pehle rows filter karta hai.
 * - GROUP BY filtered rows ko group karta hai.
 * - HAVING grouped results ko filter karta hai.
 * - ORDER BY final result sort karta hai.
 *
 * FLOW:
 * All rows → WHERE (filter rows) → GROUP BY (group) → HAVING (filter groups) → SELECT → ORDER BY
 */

// -- Cities in Asia, group by country, only countries with avg population > 5M
// SELECT country, COUNT(*) AS city_count, AVG(population) AS avg_pop
// FROM cities
// WHERE continent = 'Asia'
// GROUP BY country
// HAVING AVG(population) > 5000000
// ORDER BY avg_pop DESC;


/**
 * ========================================================================
 * 6. AGGREGATE WITH JOIN
 * ========================================================================
 * NOTES:
 * - JOIN aur GROUP BY combine karke powerful analysis ho sakti hai.
 * - Pehle tables join karo, phir group karo, phir aggregate karo.
 */

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


/**
 * ========================================================================
 * 7. COUNT(*) vs COUNT(column) vs COUNT(DISTINCT)
 * ========================================================================
 * NOTES:
 * - COUNT(*) = sab rows (NULL values bhi counted).
 * - COUNT(column) = sirf rows jahan column NOT NULL hai.
 * - COUNT(DISTINCT column) = unique non-NULL values ki count.
 *
 * EXAMPLE:
 * Data: user_id = [1, 1, 2, NULL, 3, 3, 3]
 * - COUNT(*)              → 7 (sab rows)
 * - COUNT(user_id)        → 6 (NULL excluded)
 * - COUNT(DISTINCT user_id) → 3 (unique: 1, 2, 3)
 */

// SELECT
//     COUNT(*) AS total_rows,
//     COUNT(user_id) AS non_null_users,
//     COUNT(DISTINCT user_id) AS unique_users
// FROM photos;


/**
 * ========================================================================
 * 8. ROUNDING AND FORMATTING AGGREGATES
 * ========================================================================
 * NOTES:
 * - AVG often long decimal deta hai.
 * - ROUND(value, decimal_places) se precision control karo.
 * - TRUNC decimal truncate karta hai (round nahi).
 * - CEIL / FLOOR ceiling/floor integers.
 */

// SELECT ROUND(AVG(population), 2) AS avg_pop FROM cities;
// SELECT TRUNC(AVG(price), 2) AS avg_price FROM products;
// SELECT CEIL(4.1);   -- 5
// SELECT FLOOR(4.9);  -- 4


/**
 * ========================================================================
 * 9. AGGREGATE RULES
 * ========================================================================
 * - Aggregate functions NULL ignore karte hain (except COUNT(*)).
 * - SELECT me aggregate + non-aggregate mix karna hai toh GROUP BY ZARURI hai.
 * - WHERE me aggregate functions NAHI likh sakte — HAVING use karo.
 * - WHERE rows filter (before grouping), HAVING groups filter (after grouping).
 * - ORDER BY me aggregate function likh sakte ho.
 * - COUNT(column) vs COUNT(*): column wala NULL skip karta hai.
 * - GROUP BY ke bina aggregate function POORI table pe ek value deta hai.
 */

const aggregateRules = {
    nullHandling: 'Aggregates ignore NULL (except COUNT(*))',
    groupByRule: 'Non-aggregated columns must be in GROUP BY',
    whereVsHaving: 'WHERE = row filter, HAVING = group filter',
    countStar: 'COUNT(*) counts all rows including NULL',
    countColumn: 'COUNT(col) counts only non-NULL values'
};

console.log('Aggregate rules:', aggregateRules);
