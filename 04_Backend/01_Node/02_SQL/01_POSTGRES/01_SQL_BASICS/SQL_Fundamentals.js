/**
 * ## Quick revision
 *
 * - Table — rows records hain, columns typed fields.
 * - SELECT/FROM — kaunse columns aur kis table se read karna hai.
 * - INSERT/UPDATE/DELETE — add/change/remove rows; UPDATE/DELETE ka WHERE check karo.
 * - Type — text, numeric, boolean, date/time workload ke hisaab se choose.
 * - Primary key — row ki unique non-null identity.
 * - NULL — unknown/missing value; `IS NULL` se check.
 * - ORDER BY — explicit ordering; bina iske row order guaranteed nahi.
 * - LIMIT — returned rows bound; stable ordering saath do.
 * - Parameters — values bind karo; identifiers ke liye allowlist chahiye.
 * - DDL/DML — schema define/alter karna aur rows read/write karna alag operations.
 * - Alias — query mein column/table ka readable local naam; underlying schema rename nahi hota.
 * - Parameter type — driver/database conversion ka contract; raw user string ko valid number assume mat karo.
 */

'use strict';


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


// -- All columns, all rows
// SELECT * FROM cities;

// -- Specific columns
// SELECT name, population FROM cities;

// -- Calculated column (population density)
// SELECT name, population / area AS population_density FROM cities;

// -- Alias with AS
// SELECT name AS city_name, country AS nation FROM cities;


// SELECT name, population, area, population / area AS density
// FROM cities;

// SELECT name, price, price * 0.9 AS discounted_price
// FROM products;


// SELECT CONCAT(name, ', ', country) AS full_location FROM cities;
// SELECT name || ' (' || country || ')' AS label FROM cities;
// SELECT UPPER(name) AS uppercase_name FROM cities;
// SELECT LENGTH(name) AS name_length FROM cities;


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


// DROP TABLE cities;
// DROP TABLE IF EXISTS cities;


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
