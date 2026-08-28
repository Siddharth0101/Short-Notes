'use strict';

/**
 * ========================================================================
 * VALIDATION AND CONSTRAINTS - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Constraints = database level pe data integrity enforce karne ke rules.
 * - Application-level validation ke saath saath DB-level constraints bhi ZARURI hain.
 * - Agar constraint violate hota hai → INSERT/UPDATE fail with error.
 * - Defense in depth: app + DB dono pe validation rakho.
 */


/**
 * ========================================================================
 * 1. NOT NULL
 * ========================================================================
 * NOTES:
 * - Column me NULL value insert nahi hone deta.
 * - Required fields ke liye use karo.
 * - Default me columns NULL allowed hain (unless NOT NULL lagao).
 */

// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL,
//     bio TEXT                          -- NULL allowed (optional field)
// );

// INSERT INTO users (username) VALUES ('grider');  -- ❌ ERROR: email is NOT NULL


/**
 * ========================================================================
 * 2. UNIQUE
 * ========================================================================
 * NOTES:
 * - Column ki values duplicate nahi ho sakti.
 * - NULL values ko UNIQUE constraint affect nahi karta.
 *   (Multiple NULLs allowed hain unique column me — PostgreSQL behavior).
 * - Unique automatically ek index create karta hai (fast lookups).
 */

// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     phone VARCHAR(20) UNIQUE           -- NULL allowed, but non-null must be unique
// );

// INSERT INTO users (email) VALUES ('a@b.com');
// INSERT INTO users (email) VALUES ('a@b.com');  -- ❌ ERROR: duplicate key


/**
 * ========================================================================
 * 3. PRIMARY KEY
 * ========================================================================
 * NOTES:
 * - PRIMARY KEY = UNIQUE + NOT NULL.
 * - Har row ko uniquely identify karta hai.
 * - Ek table me sirf EK primary key allowed.
 * - Composite primary key bhi ho sakti hai (multiple columns).
 */

// -- Single column PK
// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL
// );

// -- Composite PK (multiple columns together form the key)
// CREATE TABLE enrollments (
//     student_id INTEGER REFERENCES students(id),
//     course_id INTEGER REFERENCES courses(id),
//     PRIMARY KEY (student_id, course_id)    -- combination unique honi chahiye
// );


/**
 * ========================================================================
 * 4. FOREIGN KEY
 * ========================================================================
 * NOTES:
 * - Referential integrity enforce karta hai.
 * - FK value ZARURI parent table ki PK me exist karni chahiye (ya NULL).
 * - ON DELETE / ON UPDATE actions define karo.
 * - Inline ya table-level dono tarike se define ho sakta hai.
 */

// -- Inline FK
// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200) NOT NULL,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
// );

// -- Table-level FK with name
// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200) NOT NULL,
//     user_id INTEGER,
//     CONSTRAINT fk_photos_user
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
// );


/**
 * ========================================================================
 * 5. DEFAULT
 * ========================================================================
 * NOTES:
 * - Column ki default value define karta hai jab INSERT me value na di jaaye.
 * - Functions bhi default value ho sakti hain (CURRENT_TIMESTAMP, NOW()).
 * - NULL insert karne pe DEFAULT USE NAHI HOTA — sirf omit karne pe hota hai.
 */

// CREATE TABLE posts (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(200) NOT NULL,
//     is_published BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     views INTEGER DEFAULT 0
// );

// INSERT INTO posts (title) VALUES ('My First Post');
// -- is_published = false, created_at = now, views = 0

// INSERT INTO posts (title, is_published) VALUES ('Draft', NULL);
// -- ⚠️ is_published = NULL (not false!) — NULL was explicitly given


/**
 * ========================================================================
 * 6. CHECK CONSTRAINT
 * ========================================================================
 * NOTES:
 * - Custom validation rule define karta hai.
 * - Expression true honi chahiye for INSERT/UPDATE to succeed.
 * - Complex business rules enforce karne ke liye powerful.
 * - Column-level ya table-level dono pe define ho sakta hai.
 */

// -- Column-level CHECK
// CREATE TABLE products (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     price NUMERIC CHECK (price > 0),
//     discount NUMERIC CHECK (discount >= 0 AND discount <= 100)
// );

// -- Table-level CHECK (multi-column)
// CREATE TABLE products (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     price NUMERIC NOT NULL,
//     sale_price NUMERIC,
//     CHECK (sale_price < price),               -- sale price must be less than price
//     CHECK (price > 0)
// );

// -- Named CHECK constraint
// CREATE TABLE events (
//     id SERIAL PRIMARY KEY,
//     start_date DATE NOT NULL,
//     end_date DATE NOT NULL,
//     CONSTRAINT valid_date_range CHECK (end_date >= start_date)
// );

// INSERT INTO products (name, price) VALUES ('Widget', -5);  -- ❌ CHECK violation


/**
 * ========================================================================
 * 7. MULTI-COLUMN UNIQUE CONSTRAINT
 * ========================================================================
 * NOTES:
 * - Individual columns duplicate ho sakti hain, but COMBINATION unique honi chahiye.
 * - Example: Ek user ek post pe sirf ek baar like kar sakta hai.
 * - Table-level UNIQUE constraint define karo.
 */

// CREATE TABLE likes (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
//     UNIQUE (user_id, post_id)    -- same user can't like same post twice
// );

// -- Named constraint
// CREATE TABLE follows (
//     id SERIAL PRIMARY KEY,
//     follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     CONSTRAINT unique_follow UNIQUE (follower_id, following_id),
//     CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
// );


/**
 * ========================================================================
 * 8. ADDING / DROPPING CONSTRAINTS (ALTER TABLE)
 * ========================================================================
 * NOTES:
 * - Existing table me constraints baad me add/remove kar sakte ho.
 * - Named constraints drop karna easier hai.
 * - Constraint add karte waqt existing data violate kare toh ERROR.
 */

// -- Add NOT NULL
// ALTER TABLE users ALTER COLUMN email SET NOT NULL;

// -- Drop NOT NULL
// ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

// -- Add UNIQUE constraint
// ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

// -- Drop UNIQUE constraint
// ALTER TABLE users DROP CONSTRAINT unique_email;

// -- Add CHECK constraint
// ALTER TABLE products ADD CONSTRAINT positive_price CHECK (price > 0);

// -- Drop CHECK constraint
// ALTER TABLE products DROP CONSTRAINT positive_price;

// -- Add FOREIGN KEY
// ALTER TABLE photos
// ADD CONSTRAINT fk_user
// FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

// -- Drop FOREIGN KEY
// ALTER TABLE photos DROP CONSTRAINT fk_user;


/**
 * ========================================================================
 * 9. EXCLUSION CONSTRAINTS (ADVANCED)
 * ========================================================================
 * NOTES:
 * - PostgreSQL specific. Overlap ya conflict prevent karte hain.
 * - Common use: date ranges overlap nahi hone chahiye.
 * - btree_gist extension enable karna padta hai.
 */

// CREATE EXTENSION IF NOT EXISTS btree_gist;
//
// CREATE TABLE room_bookings (
//     id SERIAL PRIMARY KEY,
//     room_id INTEGER NOT NULL,
//     booking_range DATERANGE NOT NULL,
//     EXCLUDE USING GIST (
//         room_id WITH =,
//         booking_range WITH &&     -- && = overlap operator
//     )
// );
// -- Same room ke overlapping bookings automatically block ho jayengi


/**
 * ========================================================================
 * 10. CONSTRAINT VALIDATION TABLE [⚡ VISUAL]
 * ========================================================================
 *
 * ┌─────────────────────┬──────────────────────────────────────────────────────┐
 * │ Constraint          │ What it Enforces                                     │
 * ├─────────────────────┼──────────────────────────────────────────────────────┤
 * │ NOT NULL            │ Column must have a value (no NULL)                   │
 * │ UNIQUE              │ No duplicate values (NULLs allowed)                  │
 * │ PRIMARY KEY         │ NOT NULL + UNIQUE (row identifier)                   │
 * │ FOREIGN KEY         │ Value must exist in referenced table                 │
 * │ DEFAULT             │ Auto-fill value when omitted in INSERT               │
 * │ CHECK               │ Custom boolean condition must be true                │
 * │ EXCLUSION           │ Prevents conflicting rows (e.g. overlaps)            │
 * │ UNIQUE(col1, col2)  │ Combination must be unique                          │
 * └─────────────────────┴──────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 11. CONSTRAINT RULES
 * ========================================================================
 * - Always name constraints (easier to drop/debug later).
 * - NOT NULL on required fields — never trust application alone.
 * - UNIQUE on emails, usernames etc.
 * - CHECK for business rules (price > 0, end_date >= start_date).
 * - FK constraints maintain referential integrity — always use.
 * - Multi-column UNIQUE for "one per" rules (one like per user per post).
 * - Add constraints AFTER initial data load causes error if data violates.
 * - Constraints are checked on INSERT, UPDATE (not SELECT).
 */

const constraintRules = {
    naming: 'Always name your constraints',
    notNull: 'Required fields must be NOT NULL',
    unique: 'Emails, usernames — UNIQUE',
    check: 'Business rules — CHECK (price > 0)',
    foreignKey: 'Referential integrity — always use FK',
    multiUnique: 'UNIQUE(col1, col2) for composite uniqueness'
};

console.log('Constraint rules:', constraintRules);
