'use strict';

/**
 * ========================================================================
 * DATABASE DESIGN AND SCHEMA - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Database design = tables, columns, relationships kaise organize karein.
 * - Good design = data integrity, minimal redundancy, efficient queries.
 * - Normalization data ko logically split karta hai.
 * - Denormalization performance ke liye intentionally duplicate karta hai.
 */


/**
 * ========================================================================
 * 1. NORMALIZATION — WHY? [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Normalization ka goal: data redundancy aur anomalies reduce karna.
 * - Without normalization → INSERT, UPDATE, DELETE anomalies aati hain.
 *
 * ANOMALIES:
 * - INSERT anomaly: Data insert nahi ho pata without unrelated data.
 *   Example: Student ka course record daalna hai but course instructor table me hi hai.
 * - UPDATE anomaly: Ek value change karna hai but 100 jagah update karna padta hai.
 *   Example: Instructor ka name 50 rows me duplicate hai, ek miss ho gaya.
 * - DELETE anomaly: Related data unintentionally delete ho jata hai.
 *   Example: Last student remove karne pe course info bhi chali gayi.
 *
 * Normalization = Split tables so each fact is stored ONCE.
 */


/**
 * ========================================================================
 * 2. NORMAL FORMS (1NF, 2NF, 3NF)
 * ========================================================================
 *
 * ┌──────────┬──────────────────────────────────────────────────────────────────┐
 * │ Form     │ Rule                                                             │
 * ├──────────┼──────────────────────────────────────────────────────────────────┤
 * │ 1NF      │ Har column me ATOMIC (single) value honi chahiye.                │
 * │          │ No repeating groups. No arrays in a single cell.                 │
 * │          │ ❌ tags = 'js, react, node' → ✅ Separate tags table             │
 * ├──────────┼──────────────────────────────────────────────────────────────────┤
 * │ 2NF      │ 1NF + No PARTIAL dependencies.                                  │
 * │          │ Non-key column should depend on the WHOLE primary key,           │
 * │          │ not just part of it.                                              │
 * │          │ Mainly applies to COMPOSITE primary keys.                        │
 * │          │ ❌ (student_id, course_id) → instructor_name                     │
 * │          │    instructor depends only on course_id, not student.            │
 * │          │ ✅ Move instructor to a separate courses table.                   │
 * ├──────────┼──────────────────────────────────────────────────────────────────┤
 * │ 3NF      │ 2NF + No TRANSITIVE dependencies.                               │
 * │          │ Non-key column should not depend on another non-key column.      │
 * │          │ ❌ employee → department_id → department_name                    │
 * │          │    department_name depends on department_id, not employee PK.    │
 * │          │ ✅ Move department_name to a departments table.                   │
 * └──────────┴──────────────────────────────────────────────────────────────────┘
 *
 * RULE OF THUMB:
 * - "Every non-key column must provide a fact about the KEY,
 *    the WHOLE key, and NOTHING BUT the key." (Codd's rule)
 * - Most real apps target 3NF. Beyond that (BCNF, 4NF, 5NF) is rarely needed.
 */


/**
 * ========================================================================
 * 3. DENORMALIZATION
 * ========================================================================
 * NOTES:
 * - Normalization ke opposite: intentionally data duplicate karna.
 * - Kab use karte hain?
 *   - Read-heavy apps where JOINs slow hain.
 *   - Reporting/analytics queries.
 *   - Caching (materialized views).
 * - Trade-off: Faster reads ←→ More complex writes + stale data risk.
 * - PostgreSQL me materialized views denormalization ka elegant form hai.
 */


/**
 * ========================================================================
 * 4. SCHEMA DESIGN PATTERNS [⚡ VISUAL]
 * ========================================================================
 *
 * INSTAGRAM-LIKE SCHEMA EXAMPLE (from Stephen Grider's course):
 *
 * ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
 * │   users     │     │    posts      │     │   comments   │
 * ├─────────────┤     ├──────────────┤     ├──────────────┤
 * │ id (PK)     │←────│ user_id (FK) │     │ id (PK)      │
 * │ username    │     │ id (PK)      │←────│ post_id (FK) │
 * │ email       │     │ caption      │     │ user_id (FK)─┤→ users
 * │ bio         │     │ lat          │     │ body         │
 * │ avatar      │     │ lng          │     │ created_at   │
 * │ created_at  │     │ created_at   │     └──────────────┘
 * └─────────────┘     └──────────────┘
 *          │                                     │
 *          │          ┌──────────────┐            │
 *          └─────────→│    likes     │←───────────┘
 *                     ├──────────────┤
 *                     │ id (PK)      │
 *                     │ user_id (FK) │
 *                     │ post_id (FK) │  ← polymorphic
 *                     │ comment_id   │  ← OR this (not both)
 *                     │ created_at   │
 *                     └──────────────┘
 *
 * DESIGN DECISIONS:
 * - users ← posts: One-to-Many (one user, many posts).
 * - posts ← comments: One-to-Many (one post, many comments).
 * - likes can be on posts OR comments (polymorphic association).
 */


/**
 * ========================================================================
 * 5. ALTER TABLE — MODIFY EXISTING TABLES
 * ========================================================================
 * NOTES:
 * - Table already bana hua hai aur change karna hai → ALTER TABLE.
 * - Columns add, drop, rename, type change sab kar sakte ho.
 * - Constraints add/drop bhi ALTER TABLE se hota hai.
 */

// -- Add a new column
// ALTER TABLE users ADD COLUMN phone VARCHAR(20);

// -- Drop a column
// ALTER TABLE users DROP COLUMN phone;

// -- Rename a column
// ALTER TABLE users RENAME COLUMN bio TO biography;

// -- Change column data type
// ALTER TABLE users ALTER COLUMN username TYPE TEXT;

// -- Set default value
// ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

// -- Drop default value
// ALTER TABLE users ALTER COLUMN created_at DROP DEFAULT;

// -- Set NOT NULL
// ALTER TABLE users ALTER COLUMN email SET NOT NULL;

// -- Drop NOT NULL
// ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

// -- Rename table
// ALTER TABLE users RENAME TO app_users;


/**
 * ========================================================================
 * 6. SERIAL vs GENERATED ALWAYS AS IDENTITY
 * ========================================================================
 * NOTES:
 * - SERIAL = old way. Internally sequence create karta hai.
 *   - Values manually override ho sakti hain (INSERT INTO ... VALUES(999, ...)).
 * - GENERATED ALWAYS AS IDENTITY = SQL standard, safer.
 *   - Manual override by default BLOCK hota hai.
 *   - OVERRIDING SYSTEM VALUE use karna padta hai force karne ke liye.
 * - Modern apps me IDENTITY prefer karo.
 */

// -- SERIAL (old way)
// CREATE TABLE products (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100)
// );

// -- IDENTITY (modern way)
// CREATE TABLE products (
//     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//     name VARCHAR(100)
// );

// -- GENERATED BY DEFAULT AS IDENTITY (allows manual override)
// CREATE TABLE products (
//     id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
//     name VARCHAR(100)
// );


/**
 * ========================================================================
 * 7. CUSTOM TYPES — ENUM
 * ========================================================================
 * NOTES:
 * - ENUM = predefined allowed values ka set.
 * - Column me sirf listed values hi insert ho sakti hain.
 * - Use karo jab values fixed hain (status, role, difficulty).
 * - Adding new values easy hai, removing is tricky.
 */

// CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
//
// CREATE TABLE diary (
//     id SERIAL PRIMARY KEY,
//     entry TEXT,
//     current_mood mood
// );
//
// INSERT INTO diary (entry, current_mood) VALUES ('Great day!', 'happy');
// INSERT INTO diary (entry, current_mood) VALUES ('Not so great', 'blah');  -- ❌ ERROR!

// -- Add new enum value
// ALTER TYPE mood ADD VALUE 'excited' AFTER 'happy';


/**
 * ========================================================================
 * 8. POLYMORPHIC ASSOCIATIONS
 * ========================================================================
 * NOTES:
 * - Ek table multiple different parent tables ko reference kare.
 * - Example: likes table jo posts AUR comments dono pe kaam kare.
 * - Problem: Foreign key constraint DONO tables pe nahi lag sakta ek column pe.
 *
 * APPROACHES:
 * 1. Separate FK columns (post_id OR comment_id, dusra NULL).
 * 2. Abstract/base table approach (single FK to a "likeable" table).
 * 3. Separate like tables (post_likes, comment_likes).
 *
 * Stephen Grider approach: COALESCE + CHECK constraint.
 */

// -- Approach 1: Separate nullable FK columns
// CREATE TABLE likes (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
//     comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
//     CHECK (
//         COALESCE((post_id)::BOOLEAN::INTEGER, 0) +
//         COALESCE((comment_id)::BOOLEAN::INTEGER, 0) = 1
//     )
//     -- Exactly ONE of post_id or comment_id must be set
// );

// -- Approach 3: Separate tables (cleanest, but more tables)
// CREATE TABLE post_likes (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
//     UNIQUE(user_id, post_id)
// );
//
// CREATE TABLE comment_likes (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
//     UNIQUE(user_id, comment_id)
// );


/**
 * ========================================================================
 * 9. GENERATED COLUMNS (COMPUTED COLUMNS)
 * ========================================================================
 * NOTES:
 * - GENERATED ALWAYS AS = column automatically compute hota hai.
 * - STORED = value disk pe store hota hai (update pe recalculate).
 * - VIRTUAL = PostgreSQL me sirf STORED supported hai (MySQL dono).
 * - Mongoose virtual jaisa concept, but database level pe.
 */

// CREATE TABLE rectangles (
//     id SERIAL PRIMARY KEY,
//     width NUMERIC NOT NULL,
//     height NUMERIC NOT NULL,
//     area NUMERIC GENERATED ALWAYS AS (width * height) STORED
// );

// INSERT INTO rectangles (width, height) VALUES (5, 10);
// SELECT * FROM rectangles;  -- area = 50 (automatically computed)


/**
 * ========================================================================
 * 10. TEMPORARY TABLES
 * ========================================================================
 * NOTES:
 * - TEMP table sirf current session tak exist karti hai.
 * - Session end ya connection close → table automatically delete.
 * - Intermediate results store karne ke liye useful.
 * - ON COMMIT DROP = transaction end pe delete.
 */

// CREATE TEMP TABLE active_users AS
// SELECT * FROM users WHERE last_login > '2024-01-01';
//
// SELECT * FROM active_users;  -- works in same session
// -- Session end → table gone


/**
 * ========================================================================
 * 11. SCHEMA DESIGN RULES
 * ========================================================================
 * - Normalize to 3NF for most applications.
 * - Denormalize only when READ performance is a proven bottleneck.
 * - Every table should have a PRIMARY KEY.
 * - Foreign keys ENFORCE karo — data integrity important hai.
 * - Use IDENTITY over SERIAL for new projects.
 * - ENUM use karo fixed value sets ke liye (status, role).
 * - Polymorphic associations ke liye separate tables cleanest approach hai.
 * - Naming convention: snake_case, plural table names (users, not user).
 * - Timestamps (created_at, updated_at) har table me rakho.
 */

const designRules = {
    normalize: '3NF for most apps',
    primaryKey: 'Every table MUST have a PK',
    foreignKey: 'FK constraints enforce integrity',
    identity: 'Use IDENTITY over SERIAL',
    naming: 'snake_case, plural table names',
    timestamps: 'Always add created_at, updated_at'
};

console.log('Schema design rules:', designRules);
