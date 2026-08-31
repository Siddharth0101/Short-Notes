'use strict';

/**
 * ========================================================================
 * SQL FUNDAMENTALS - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - SQL = Structured Query Language — relational databases ke saath kaam karne ki language.
 * - PostgreSQL open-source, powerful, production-grade relational DB hai.
 * - Data tables me store hota hai — rows (records) aur columns (fields).
 * - SQL is DECLARATIVE — hum batate hain KYA chahiye, HOW nahi.
 */


/**
 * ========================================================================
 * 1. DATABASE TERMINOLOGY [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Database → Collection of related tables.
 * - Table → Rows + Columns ka grid. Ek entity represent karta hai (users, orders).
 * - Row → Ek single record (a specific user, a specific order).
 * - Column → Ek property/field (name, email, price).
 *
 * SQL vs MONGO (COMPARISON):
 * - Database    → Database
 * - Table       → Collection
 * - Row         → Document
 * - Column      → Field
 * - Schema      → Dynamic (Mongo) vs Fixed (SQL)
 * - JOIN        → $lookup / populate
 * - SQL Query   → Mongoose/Aggregation method
 */


/**
 * ========================================================================
 * 2. DATA TYPES IN POSTGRESQL
 * ========================================================================
 * NOTES:
 * - Har column ka ek fixed data type hota hai — strict typing.
 * - Wrong type insert karne pe error aata hai (unlike NoSQL).
 *
 * COMMON DATA TYPES:
 * ┌──────────────────────┬──────────────────────────────────────────────────┐
 * │ Type                 │ Description                                      │
 * ├──────────────────────┼──────────────────────────────────────────────────┤
 * │ INTEGER / INT        │ Whole numbers (-2B to +2B)                       │
 * │ SMALLINT             │ Small whole numbers (-32K to +32K)               │
 * │ BIGINT               │ Very large whole numbers                         │
 * │ SERIAL               │ Auto-incrementing integer (auto ID)              │
 * │ NUMERIC(p,s)         │ Exact decimal (precision, scale)                 │
 * │ REAL / FLOAT4        │ 4-byte floating point                            │
 * │ DOUBLE PRECISION     │ 8-byte floating point                            │
 * │ VARCHAR(n)           │ Variable-length string, max n chars              │
 * │ CHAR(n)              │ Fixed-length string, padded to n chars           │
 * │ TEXT                 │ Unlimited length string                          │
 * │ BOOLEAN              │ true / false                                     │
 * │ DATE                 │ Date only (YYYY-MM-DD)                           │
 * │ TIMESTAMP            │ Date + Time                                      │
 * │ TIMESTAMPTZ          │ Date + Time + Timezone                           │
 * │ JSON / JSONB         │ JSON data (JSONB is binary, faster queries)      │
 * │ UUID                 │ Universally unique identifier                    │
 * │ BYTEA                │ Binary data (images, files)                      │
 * └──────────────────────┴──────────────────────────────────────────────────┘
 *
 * RULES:
 * - ID ke liye SERIAL ya GENERATED ALWAYS AS IDENTITY prefer karo.
 * - Price/money ke liye NUMERIC use karo, FLOAT nahi (rounding issues).
 * - Unlimited text ke liye TEXT use karo, VARCHAR bhi chal jata hai.
 */


/**
 * ========================================================================
 * 3. CREATE TABLE
 * ========================================================================
 * NOTES:
 * - Table banana ke liye CREATE TABLE statement use hoti hai.
 * - Column name, data type, aur optional constraints define karte hain.
 * - IF NOT EXISTS clause safe hai — table already exist kare toh error nahi aata.
 */

// CREATE TABLE cities (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(50) NOT NULL,
//     country VARCHAR(50),
//     population INTEGER,
//     area INTEGER
// );

// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     bio TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


/**
 * ========================================================================
 * 4. INSERT INTO
 * ========================================================================
 * NOTES:
 * - Rows add karne ke liye INSERT INTO use hota hai.
 * - Column order match hona chahiye VALUES ke saath.
 * - Multiple rows ek saath insert ho sakte hain (comma-separated).
 * - RETURNING clause inserted row ka data wapas deta hai.
 */

// -- Single row insert
// INSERT INTO cities (name, country, population, area)
// VALUES ('Delhi', 'India', 16787941, 1484);

// -- Multiple rows insert
// INSERT INTO cities (name, country, population, area)
// VALUES
//     ('Tokyo', 'Japan', 13960000, 2191),
//     ('Shanghai', 'China', 22125000, 6341),
//     ('Sao Paulo', 'Brazil', 12330000, 1521);

// -- RETURNING clause
// INSERT INTO cities (name, country, population, area)
// VALUES ('London', 'UK', 8982000, 1572)
// RETURNING *;


/**
 * ========================================================================
 * 5. SELECT — READING DATA
 * ========================================================================
 * NOTES:
 * - SELECT data retrieve karne ka primary statement hai.
 * - * means all columns.
 * - Specific columns comma se separate karo.
 * - Calculated/computed columns bhi select me likh sakte ho.
 */

// -- All columns, all rows
// SELECT * FROM cities;

// -- Specific columns
// SELECT name, population FROM cities;

// -- Calculated column (population density)
// SELECT name, population / area AS population_density FROM cities;

// -- Alias with AS
// SELECT name AS city_name, country AS nation FROM cities;


/**
 * ========================================================================
 * 6. CALCULATED COLUMNS (MATH IN SELECT)
 * ========================================================================
 * NOTES:
 * - SQL me SELECT ke andar math operations direct likh sakte ho.
 * - Result me ek new computed column ban jata hai.
 * - Ye computed column DB me store NAHI hota — sirf query result me dikhta hai.
 * - AS keyword se readable alias do computed column ko.
 *
 * MATH OPERATORS:
 * - +   Addition
 * - -   Subtraction
 * - *   Multiplication
 * - /   Division (integer division if both operands are integer)
 * - %   Modulo (remainder)
 * - ^   Exponent (power)
 * - |/  Square root
 * - @   Absolute value
 */

// SELECT name, population, area, population / area AS density
// FROM cities;

// SELECT name, price, price * 0.9 AS discounted_price
// FROM products;


/**
 * ========================================================================
 * 7. STRING OPERATORS AND FUNCTIONS
 * ========================================================================
 * NOTES:
 * - SQL me strings manipulate karne ke liye operators aur functions hain.
 * - || (double pipe) = string concatenation operator.
 * - Functions case-insensitive hain (UPPER, upper, Upper sab same).
 *
 * COMMON STRING FUNCTIONS:
 * ┌─────────────────────────────┬────────────────────────────────────────────┐
 * │ Function                    │ Description                                │
 * ├─────────────────────────────┼────────────────────────────────────────────┤
 * │ CONCAT(s1, s2, ...)         │ Strings join karta hai                     │
 * │ ||                          │ Concatenation operator                     │
 * │ UPPER(str)                  │ Uppercase me convert                       │
 * │ LOWER(str)                  │ Lowercase me convert                       │
 * │ LENGTH(str)                 │ String ki length                           │
 * │ TRIM(str)                   │ Leading/trailing whitespace remove         │
 * │ SUBSTRING(str FROM s FOR l) │ Substring extract (position s, length l)   │
 * │ REPLACE(str, from, to)      │ Replace occurrences                        │
 * │ POSITION(sub IN str)        │ First occurrence ka position (1-indexed)   │
 * │ LEFT(str, n)                │ First n characters                         │
 * │ RIGHT(str, n)               │ Last n characters                          │
 * │ INITCAP(str)                │ Title Case me convert                      │
 * └─────────────────────────────┴────────────────────────────────────────────┘
 */

// SELECT CONCAT(name, ', ', country) AS full_location FROM cities;
// SELECT name || ' (' || country || ')' AS label FROM cities;
// SELECT UPPER(name) AS uppercase_name FROM cities;
// SELECT LENGTH(name) AS name_length FROM cities;


/**
 * ========================================================================
 * 8. UPDATE
 * ========================================================================
 * NOTES:
 * - Existing rows modify karne ke liye UPDATE use hota hai.
 * - WHERE clause ZARURI hai — bina WHERE sab rows update ho jayengi!
 * - SET clause me updated values define karo.
 * - RETURNING updated row(s) wapas de sakta hai.
 */

// -- Update single row
// UPDATE cities
// SET population = 17000000
// WHERE name = 'Delhi';

// -- Update multiple columns
// UPDATE cities
// SET population = 18000000, area = 1500
// WHERE name = 'Delhi';

// -- Update with calculation
// UPDATE cities
// SET population = population * 1.1
// WHERE country = 'India';

// -- RETURNING updated data
// UPDATE cities
// SET population = 20000000
// WHERE name = 'Tokyo'
// RETURNING *;


/**
 * ========================================================================
 * 9. DELETE
 * ========================================================================
 * NOTES:
 * - Rows hatane ke liye DELETE use hota hai.
 * - WHERE clause ZARURI hai — bina WHERE sab rows delete ho jayengi!
 * - RETURNING deleted row(s) wapas de sakta hai.
 * - TRUNCATE TABLE sab rows hatata hai but table structure rakhta hai (faster than DELETE).
 */

// -- Delete specific row
// DELETE FROM cities WHERE name = 'Sao Paulo';

// -- Delete with condition
// DELETE FROM cities WHERE population < 1000000;

// -- RETURNING deleted data
// DELETE FROM cities WHERE name = 'London' RETURNING *;

// -- Delete ALL rows (dangerous!)
// DELETE FROM cities;

// -- Truncate (faster for deleting all rows)
// TRUNCATE TABLE cities;


/**
 * ========================================================================
 * 10. DROP TABLE
 * ========================================================================
 * NOTES:
 * - Puri table delete karne ke liye DROP TABLE.
 * - Table + data + indexes + constraints sab hatt jata hai.
 * - IF EXISTS safe hai — table na ho toh error nahi deta.
 */

// DROP TABLE cities;
// DROP TABLE IF EXISTS cities;


/**
 * ========================================================================
 * 11. pgAdmin AND psql
 * ========================================================================
 * NOTES:
 * - pgAdmin: PostgreSQL ka GUI tool (browser-based).
 *   - Server connect, databases browse, queries run, results view.
 *   - Query Tool me SQL likhte aur execute karte hain.
 * - psql: Command line PostgreSQL client.
 *   - Terminal se directly SQL queries run kar sakte ho.
 *
 * COMMON psql COMMANDS:
 * - \l           → List all databases
 * - \c dbname    → Connect to a database
 * - \dt          → List all tables in current database
 * - \d tablename → Describe a table (columns, types, constraints)
 * - \q           → Quit psql
 * - \i file.sql  → Execute SQL from a file
 * - \x           → Toggle expanded display (vertical output)
 */


/**
 * ========================================================================
 * 12. SQL STATEMENT ORDER
 * ========================================================================
 * NOTES:
 * - SQL statements ka ek specific order hota hai.
 * - Ye order follow karna ZARURI hai warna syntax error aata hai.
 *
 * STATEMENT ORDER:
 * ┌─────┬──────────────────────────────────────────────────────┐
 * │  #  │ Clause                                               │
 * ├─────┼──────────────────────────────────────────────────────┤
 * │  1  │ SELECT columns (kya chahiye)                         │
 * │  2  │ FROM table (kahaan se)                               │
 * │  3  │ JOIN ... ON (kaise jodo)                             │
 * │  4  │ WHERE condition (filter rows BEFORE grouping)        │
 * │  5  │ GROUP BY column (group karo)                         │
 * │  6  │ HAVING condition (filter AFTER grouping)             │
 * │  7  │ ORDER BY column (sort karo)                          │
 * │  8  │ LIMIT / OFFSET (kitne rows chahiye)                  │
 * └─────┴──────────────────────────────────────────────────────┘
 *
 * EXECUTION ORDER (DB internally):
 * FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
 * (Note: SELECT me diya gaya alias WHERE me use NAHI kar sakte
 *  because WHERE pehle execute hota hai)
 */


/**
 * ========================================================================
 * 13. SQL vs NoSQL — WHEN TO USE WHAT [⚡ VISUAL]
 * ========================================================================
 * ┌────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 * │ Feature            │ SQL (PostgreSQL)                  │ NoSQL (MongoDB)                  │
 * ├────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 * │ Data Structure     │ Fixed schema, tables              │ Flexible schema, documents       │
 * │ Relationships      │ JOINs (strong relational)         │ Embed or reference               │
 * │ Query Language     │ SQL (standardized)                │ MongoDB query API / Aggregation  │
 * │ Transactions       │ ACID compliant (strong)           │ Multi-doc transactions (newer)   │
 * │ Scaling            │ Vertical (scale up)               │ Horizontal (scale out / sharding)│
 * │ Schema Changes     │ ALTER TABLE (migration needed)    │ Just add fields (flexible)       │
 * │ Best For           │ Complex queries, relationships    │ Rapid prototyping, flexible data │
 * │ Examples           │ Banking, e-commerce, ERP          │ CMS, real-time apps, IoT         │
 * └────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * RULE OF THUMB:
 * - Highly relational data with complex queries → SQL (PostgreSQL).
 * - Flexible, rapidly changing data with simple lookups → NoSQL (MongoDB).
 * - Many modern apps use BOTH (polyglot persistence).
 */


/**
 * ========================================================================
 * 14. POSTGRESQL SETUP SUMMARY
 * ========================================================================
 * NOTES:
 * - PostgreSQL install karo (Homebrew/Installer/Docker).
 * - pgAdmin GUI ya psql CLI se connect karo.
 * - Default port: 5432.
 * - Default superuser: postgres.
 * - Connection string format:
 *   postgresql://username:password@host:port/database
 *
 * NODE.JS CONNECTION (pg library):
 */

// const { Pool } = require('pg');
//
// const pool = new Pool({
//     host: 'localhost',
//     port: 5432,
//     database: 'mydb',
//     user: 'postgres',
//     password: 'secret'
// });
//
// const res = await pool.query('SELECT * FROM cities');
// console.log(res.rows);

const sqlVsMongo = {
    table: 'Collection',
    row: 'Document',
    column: 'Field',
    join: 'Embed / $lookup / populate'
};

console.log('SQL vs Mongo mapping:', sqlVsMongo);
