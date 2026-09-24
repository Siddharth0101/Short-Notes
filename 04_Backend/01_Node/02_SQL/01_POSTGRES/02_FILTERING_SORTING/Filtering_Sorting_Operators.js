/**
 * ## Quick revision
 *
 * - WHERE — rows ko predicate se filter.
 * - AND/OR/NOT — conditions combine; parentheses se grouping clear karo.
 * - BETWEEN — dono boundaries included.
 * - IN — listed values se membership; NULL ke saath NOT IN ka catch samjho.
 * - LIKE — `%` any-length, `_` single-character wildcard.
 * - ILIKE — PostgreSQL case-insensitive pattern match.
 * - NULL — comparisons unknown de sakte hain; `IS NULL`/`IS NOT NULL`.
 * - ORDER BY — ASC/DESC aur tie-breaker; null placement explicit kar sakte ho.
 * - LIMIT/OFFSET — result slice; deep OFFSET costly ho sakta hai.
 * - DISTINCT — duplicate selected rows hataata hai.
 * - Escaped wildcard — literal %/_ search ho toh LIKE escape rule apply karo.
 * - NULL ordering — same sort direction ke saath null placement explicitly decide karo.
 * - Predicate grouping — AND/OR precedence surprise de sakti hai; intent parentheses se clear.
 */

'use strict';


// SELECT * FROM cities WHERE country = 'India';
// SELECT * FROM cities WHERE population > 10000000;
// SELECT name, area FROM cities WHERE area < 2000;


// SELECT * FROM cities WHERE population <> 0;
// SELECT * FROM cities WHERE area >= 1500;
// SELECT * FROM products WHERE price <= 100;


// -- AND: both must be true
// SELECT * FROM cities
// WHERE country = 'India' AND population > 5000000;

// -- OR: either can be true
// SELECT * FROM cities
// WHERE country = 'India' OR country = 'Japan';

// -- NOT: negate condition
// SELECT * FROM cities
// WHERE NOT country = 'India';

// -- Parentheses for clarity
// SELECT * FROM cities
// WHERE (country = 'India' OR country = 'Japan') AND population > 5000000;


// -- Instead of: country = 'India' OR country = 'Japan' OR country = 'China'
// SELECT * FROM cities
// WHERE country IN ('India', 'Japan', 'China');

// -- NOT IN
// SELECT * FROM cities
// WHERE country NOT IN ('India', 'Japan');


// SELECT * FROM cities
// WHERE population BETWEEN 1000000 AND 10000000;

// SELECT * FROM orders
// WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

// -- NOT BETWEEN
// SELECT * FROM cities
// WHERE area NOT BETWEEN 1000 AND 2000;


// -- Starts with 'D'
// SELECT * FROM cities WHERE name LIKE 'D%';

// -- Contains 'an' (case-insensitive)
// SELECT * FROM cities WHERE name ILIKE '%an%';

// -- Second character is 'o'
// SELECT * FROM cities WHERE name LIKE '_o%';

// -- NOT LIKE
// SELECT * FROM cities WHERE name NOT LIKE '%City%';


// -- Find rows where bio is missing
// SELECT * FROM users WHERE bio IS NULL;

// -- Find rows where bio exists
// SELECT * FROM users WHERE bio IS NOT NULL;

// -- COALESCE: first non-null value return karta hai
// SELECT name, COALESCE(bio, 'No bio available') AS bio FROM users;

// -- COALESCE with multiple fallbacks
// SELECT COALESCE(phone, email, 'No contact') AS contact FROM users;

// -- NULLIF: returns NULL if both values are equal
// SELECT NULLIF(population, 0) AS safe_population FROM cities;
// -- Useful for avoiding division by zero:
// SELECT population / NULLIF(area, 0) AS density FROM cities;


// -- Ascending (default)
// SELECT * FROM cities ORDER BY population;

// -- Descending
// SELECT * FROM cities ORDER BY population DESC;

// -- Multiple sort columns
// SELECT * FROM cities
// ORDER BY country ASC, population DESC;

// -- NULLS FIRST / NULLS LAST
// SELECT * FROM users ORDER BY bio NULLS FIRST;


// -- First 5 rows
// SELECT * FROM cities ORDER BY population DESC LIMIT 5;

// -- Skip 10, get next 5 (page 3 with pageSize=5)
// SELECT * FROM cities ORDER BY population DESC LIMIT 5 OFFSET 10;


// -- Unique countries
// SELECT DISTINCT country FROM cities;

// -- Distinct combinations
// SELECT DISTINCT country, name FROM cities;

// -- DISTINCT ON (PostgreSQL): first city per country (alphabetically)
// SELECT DISTINCT ON (country) country, name, population
// FROM cities
// ORDER BY country, name;


// SELECT name, population,
//     CASE
//         WHEN population > 20000000 THEN 'Mega City'
//         WHEN population > 10000000 THEN 'Large City'
//         WHEN population > 5000000  THEN 'Medium City'
//         ELSE 'Small City'
//     END AS city_category
// FROM cities;

// -- CASE in ORDER BY
// SELECT * FROM cities
// ORDER BY
//     CASE country
//         WHEN 'India' THEN 1
//         WHEN 'Japan' THEN 2
//         ELSE 3
//     END;


// SELECT CAST('100' AS INTEGER);
// SELECT '100'::INTEGER;
// SELECT CAST(3.7 AS INTEGER);         -- Result: 3 (truncated)
// SELECT NOW()::DATE;                  -- Current date only
// SELECT 100::TEXT || ' units';        -- '100 units'


// SELECT GREATEST(10, 20, 30);    -- 30
// SELECT LEAST(10, 20, 30);       -- 10

// -- Ensure minimum price of 100
// SELECT name, GREATEST(price, 100) AS adjusted_price FROM products;

// -- Ensure maximum discount of 50
// SELECT name, LEAST(discount, 50) AS capped_discount FROM products;


const filteringRules = {
    where: 'Row-level filter (before GROUP BY)',
    having: 'Group-level filter (after GROUP BY)',
    nullCheck: 'Use IS NULL / IS NOT NULL',
    pagination: 'Always ORDER BY with LIMIT/OFFSET',
    like: 'LIKE = case-sensitive, ILIKE = case-insensitive'
};

console.log('Filtering rules:', filteringRules);
