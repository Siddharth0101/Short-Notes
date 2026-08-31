'use strict';

/**
 * ========================================================================
 * FILTERING, SORTING AND OPERATORS - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - WHERE clause rows filter karta hai — sirf matching rows return hoti hain.
 * - ORDER BY rows sort karta hai.
 * - LIMIT/OFFSET pagination ke liye use hote hain.
 * - SQL me NULL ek special value hai — comparison operators se handle nahi hota.
 */


/**
 * ========================================================================
 * 1. WHERE — BASIC FILTERING
 * ========================================================================
 * NOTES:
 * - WHERE clause SELECT, UPDATE, DELETE sab me kaam karta hai.
 * - Condition true hone wali rows hi return hoti hain.
 * - String values single quotes me likhte hain ('value'), double quotes nahi.
 */

// SELECT * FROM cities WHERE country = 'India';
// SELECT * FROM cities WHERE population > 10000000;
// SELECT name, area FROM cities WHERE area < 2000;


/**
 * ========================================================================
 * 2. COMPARISON OPERATORS
 * ========================================================================
 * ┌──────────┬──────────────────────────────────────────┐
 * │ Operator │ Meaning                                  │
 * ├──────────┼──────────────────────────────────────────┤
 * │ =        │ Equal to                                 │
 * │ <> or != │ Not equal to                             │
 * │ >        │ Greater than                             │
 * │ <        │ Less than                                │
 * │ >=       │ Greater than or equal to                 │
 * │ <=       │ Less than or equal to                    │
 * └──────────┴──────────────────────────────────────────┘
 *
 * NOTES:
 * - <> aur != dono same kaam karte hain (not equal).
 * - Strings pe bhi comparison chal sakta hai (alphabetical order).
 */

// SELECT * FROM cities WHERE population <> 0;
// SELECT * FROM cities WHERE area >= 1500;
// SELECT * FROM products WHERE price <= 100;


/**
 * ========================================================================
 * 3. COMPOUND CONDITIONS — AND, OR, NOT
 * ========================================================================
 * NOTES:
 * - AND: Dono conditions true honi chahiye.
 * - OR: Koi ek condition true honi chahiye.
 * - NOT: Condition ka ulta (negate).
 * - Parentheses () se precedence control karo — important hai!
 * - AND ki precedence OR se zyada hoti hai.
 */

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


/**
 * ========================================================================
 * 4. IN OPERATOR
 * ========================================================================
 * NOTES:
 * - IN = shorthand for multiple OR conditions.
 * - List me se koi bhi match kare toh row select hoti hai.
 * - NOT IN = list me se koi bhi match NA kare.
 * - Subquery ke saath bhi use hota hai (later section).
 */

// -- Instead of: country = 'India' OR country = 'Japan' OR country = 'China'
// SELECT * FROM cities
// WHERE country IN ('India', 'Japan', 'China');

// -- NOT IN
// SELECT * FROM cities
// WHERE country NOT IN ('India', 'Japan');


/**
 * ========================================================================
 * 5. BETWEEN
 * ========================================================================
 * NOTES:
 * - BETWEEN inclusive range check hai (start AND end dono included).
 * - Numbers, dates, strings pe kaam karta hai.
 * - NOT BETWEEN = range ke bahar wale.
 */

// SELECT * FROM cities
// WHERE population BETWEEN 1000000 AND 10000000;

// SELECT * FROM orders
// WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

// -- NOT BETWEEN
// SELECT * FROM cities
// WHERE area NOT BETWEEN 1000 AND 2000;


/**
 * ========================================================================
 * 6. LIKE AND ILIKE — PATTERN MATCHING
 * ========================================================================
 * NOTES:
 * - LIKE pattern matching ke liye use hota hai.
 * - % = zero or more characters (wildcard).
 * - _ = exactly one character.
 * - LIKE case-sensitive hai.
 * - ILIKE case-insensitive hai (PostgreSQL specific).
 *
 * PATTERNS:
 * - 'A%'    → starts with A
 * - '%a'    → ends with a
 * - '%an%'  → contains 'an'
 * - '_a%'   → second character is 'a'
 * - '___'   → exactly 3 characters
 */

// -- Starts with 'D'
// SELECT * FROM cities WHERE name LIKE 'D%';

// -- Contains 'an' (case-insensitive)
// SELECT * FROM cities WHERE name ILIKE '%an%';

// -- Second character is 'o'
// SELECT * FROM cities WHERE name LIKE '_o%';

// -- NOT LIKE
// SELECT * FROM cities WHERE name NOT LIKE '%City%';


/**
 * ========================================================================
 * 7. NULL HANDLING
 * ========================================================================
 * NOTES:
 * - NULL = unknown/missing value. Ye empty string ya 0 NAHI hai!
 * - NULL ko = se compare NAHI kar sakte (NULL = NULL → NULL, not true).
 * - IS NULL / IS NOT NULL use karo.
 * - COALESCE NULL ko default value se replace karta hai.
 * - NULLIF do values equal ho toh NULL return karta hai.
 *
 * RULE:
 * - NULL ke saath koi bhi math/comparison → NULL result.
 * - WHERE clause me NULL rows automatically exclude ho jati hain.
 */

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


/**
 * ========================================================================
 * 8. ORDER BY — SORTING
 * ========================================================================
 * NOTES:
 * - ORDER BY result rows sort karta hai.
 * - ASC = ascending (default, chhota se bada).
 * - DESC = descending (bada se chhota).
 * - Multiple columns se sort: pehle column 1, tie ho toh column 2.
 * - NULL values default me last aati hain (NULLS FIRST/LAST override).
 */

// -- Ascending (default)
// SELECT * FROM cities ORDER BY population;

// -- Descending
// SELECT * FROM cities ORDER BY population DESC;

// -- Multiple sort columns
// SELECT * FROM cities
// ORDER BY country ASC, population DESC;

// -- NULLS FIRST / NULLS LAST
// SELECT * FROM users ORDER BY bio NULLS FIRST;


/**
 * ========================================================================
 * 9. LIMIT AND OFFSET — PAGINATION
 * ========================================================================
 * NOTES:
 * - LIMIT = kitni rows return karni hain (max count).
 * - OFFSET = kitni rows skip karni hain (starting point).
 * - Pagination formula: OFFSET = (page - 1) * limit.
 * - OFFSET without ORDER BY unpredictable hai — always sort pehle!
 *
 * EXAMPLE PAGINATION:
 * - Page 1: LIMIT 10 OFFSET 0
 * - Page 2: LIMIT 10 OFFSET 10
 * - Page 3: LIMIT 10 OFFSET 20
 */

// -- First 5 rows
// SELECT * FROM cities ORDER BY population DESC LIMIT 5;

// -- Skip 10, get next 5 (page 3 with pageSize=5)
// SELECT * FROM cities ORDER BY population DESC LIMIT 5 OFFSET 10;


/**
 * ========================================================================
 * 10. DISTINCT
 * ========================================================================
 * NOTES:
 * - DISTINCT duplicate rows hatata hai result se.
 * - SELECT DISTINCT column — unique values.
 * - DISTINCT ON (PostgreSQL specific) — per-group first row.
 */

// -- Unique countries
// SELECT DISTINCT country FROM cities;

// -- Distinct combinations
// SELECT DISTINCT country, name FROM cities;

// -- DISTINCT ON (PostgreSQL): first city per country (alphabetically)
// SELECT DISTINCT ON (country) country, name, population
// FROM cities
// ORDER BY country, name;


/**
 * ========================================================================
 * 11. CASE EXPRESSION (CONDITIONAL LOGIC)
 * ========================================================================
 * NOTES:
 * - CASE SQL ka if-else hai.
 * - SELECT, WHERE, ORDER BY — kahin bhi use ho sakta hai.
 * - WHEN condition THEN result.
 * - ELSE default value (optional, bina ELSE ke NULL aata hai).
 * - END se CASE block close hota hai.
 */

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


/**
 * ========================================================================
 * 12. TYPE CASTING
 * ========================================================================
 * NOTES:
 * - PostgreSQL me type cast karne ke do tarike hain:
 *   1. CAST(value AS type) — SQL standard.
 *   2. value::type — PostgreSQL shorthand (::).
 * - Useful jab data type mismatch ho ya formatting chahiye.
 */

// SELECT CAST('100' AS INTEGER);
// SELECT '100'::INTEGER;
// SELECT CAST(3.7 AS INTEGER);         -- Result: 3 (truncated)
// SELECT NOW()::DATE;                  -- Current date only
// SELECT 100::TEXT || ' units';        -- '100 units'


/**
 * ========================================================================
 * 13. GREATEST AND LEAST
 * ========================================================================
 * NOTES:
 * - GREATEST: given values me se sabse bada return karta hai.
 * - LEAST: given values me se sabse chhota return karta hai.
 * - Multiple columns compare karne me useful.
 */

// SELECT GREATEST(10, 20, 30);    -- 30
// SELECT LEAST(10, 20, 30);       -- 10

// -- Ensure minimum price of 100
// SELECT name, GREATEST(price, 100) AS adjusted_price FROM products;

// -- Ensure maximum discount of 50
// SELECT name, LEAST(discount, 50) AS capped_discount FROM products;


/**
 * ========================================================================
 * 14. FILTERING RULES
 * ========================================================================
 * - WHERE row-level filter hai (GROUP BY se PEHLE).
 * - HAVING group-level filter hai (GROUP BY ke BAAD).
 * - NULL comparisons me IS NULL / IS NOT NULL use karo, = nahi.
 * - Always ORDER BY with LIMIT/OFFSET use karo (predictable results).
 * - LIKE case-sensitive hai, ILIKE case-insensitive (PostgreSQL).
 * - IN list me NULL include karne se unexpected results aa sakte hain.
 * - BETWEEN inclusive hai dono ends pe.
 */

const filteringRules = {
    where: 'Row-level filter (before GROUP BY)',
    having: 'Group-level filter (after GROUP BY)',
    nullCheck: 'Use IS NULL / IS NOT NULL',
    pagination: 'Always ORDER BY with LIMIT/OFFSET',
    like: 'LIKE = case-sensitive, ILIKE = case-insensitive'
};

console.log('Filtering rules:', filteringRules);
