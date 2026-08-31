'use strict';

/**
 * ========================================================================
 * RELATIONSHIPS AND JOINS - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Relational databases ka power relationships me hai.
 * - Tables ek dusre se PRIMARY KEY aur FOREIGN KEY se connect hote hain.
 * - JOIN = multiple tables ka data combine karke ek result banana.
 * - SQL me data ko NORMALIZE karte hain — duplication avoid karna.
 */


/**
 * ========================================================================
 * 1. PRIMARY KEY
 * ========================================================================
 * NOTES:
 * - Primary Key ek column (ya column combination) hai jo har row ko UNIQUELY identify karta hai.
 * - Rules:
 *   1. UNIQUE hona chahiye (duplicate nahi).
 *   2. NOT NULL hona chahiye (empty nahi).
 *   3. Ek table me sirf EK primary key ho sakti hai.
 * - SERIAL PRIMARY KEY = auto-incrementing integer ID (most common).
 * - GENERATED ALWAYS AS IDENTITY = modern, SQL-standard alternative to SERIAL.
 */

// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL
// );

// -- Modern way (SQL standard)
// CREATE TABLE users (
//     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//     username VARCHAR(50) NOT NULL
// );


/**
 * ========================================================================
 * 2. FOREIGN KEY
 * ========================================================================
 * NOTES:
 * - Foreign Key ek column hai jo DUSRI table ki PRIMARY KEY ko reference karta hai.
 * - Ye relationship establish karta hai — "ye row us table ki kaunsi row se related hai."
 * - Foreign key REFERENTIAL INTEGRITY enforce karta hai:
 *   - Agar referenced row exist nahi karti → INSERT fail hota hai.
 *   - Orphan records (dangling references) nahi ban sakte.
 * - Ek table me MULTIPLE foreign keys ho sakte hain.
 */

// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200) NOT NULL,
//     user_id INTEGER REFERENCES users(id)
// );

// -- Explicit foreign key constraint name
// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200) NOT NULL,
//     user_id INTEGER,
//     CONSTRAINT fk_user
//         FOREIGN KEY (user_id) REFERENCES users(id)
// );


/**
 * ========================================================================
 * 3. RELATIONSHIP TYPES [⚡ VISUAL]
 * ========================================================================
 *
 * ┌────────────────────┬──────────────────────────────────────────────────────────────┐
 * │ Relationship       │ Description & Example                                        │
 * ├────────────────────┼──────────────────────────────────────────────────────────────┤
 * │ ONE-TO-ONE (1:1)   │ Ek row dusri table ki ek hi row se related.                  │
 * │                    │ Example: User ↔ Profile (ek user ka ek profile)              │
 * │                    │ FK + UNIQUE constraint on FK column.                         │
 * ├────────────────────┼──────────────────────────────────────────────────────────────┤
 * │ ONE-TO-MANY (1:N)  │ Ek row dusri table ki BAHUT rows se related.                 │
 * │                    │ Example: User → Photos (ek user ke multiple photos)          │
 * │                    │ FK in "many" table pointing to "one" table's PK.             │
 * │                    │ MOST COMMON relationship in SQL databases.                   │
 * ├────────────────────┼──────────────────────────────────────────────────────────────┤
 * │ MANY-TO-MANY (M:N) │ Dono tables ke rows ek dusre ki multiple rows se related.    │
 * │                    │ Example: Students ↔ Courses (many students in many courses)  │
 * │                    │ Needs a JOIN TABLE (junction/bridge/pivot table).             │
 * │                    │ Join table me DONO tables ke foreign keys hote hain.          │
 * └────────────────────┴──────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 4. ONE-TO-MANY EXAMPLE
 * ========================================================================
 * NOTES:
 * - "Many" side wali table me FK hota hai.
 * - Example: Ek user ke bahut photos → photos table me user_id FK.
 */

// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL
// );
//
// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200) NOT NULL,
//     user_id INTEGER REFERENCES users(id)
// );
//
// INSERT INTO users (username) VALUES ('grider'), ('jonas');
// INSERT INTO photos (url, user_id) VALUES ('photo1.jpg', 1), ('photo2.jpg', 1), ('photo3.jpg', 2);


/**
 * ========================================================================
 * 5. MANY-TO-MANY EXAMPLE
 * ========================================================================
 * NOTES:
 * - Many-to-many ke liye JOIN TABLE banana padta hai.
 * - Join table sirf foreign keys rakhti hai (dono parent tables ke).
 * - Optional: join table me extra fields bhi ho sakte hain (e.g. enrolled_at).
 */

// CREATE TABLE students (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL
// );
//
// CREATE TABLE courses (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(200) NOT NULL
// );
//
// -- Join table (bridge table)
// CREATE TABLE enrollments (
//     id SERIAL PRIMARY KEY,
//     student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
//     course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
//     enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(student_id, course_id)    -- prevent duplicate enrollment
// );


/**
 * ========================================================================
 * 6. ON DELETE OPTIONS [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jab parent row delete ho, toh child rows ka kya hoga?
 * - ON DELETE clause ye behavior define karta hai.
 *
 * ┌─────────────────────┬───────────────────────────────────────────────────────────┐
 * │ Option              │ Behavior                                                  │
 * ├─────────────────────┼───────────────────────────────────────────────────────────┤
 * │ ON DELETE RESTRICT  │ Parent delete BLOCK kar deta hai agar child rows hain.    │
 * │                     │ Error throw hota hai. (Most strict / safest)              │
 * ├─────────────────────┼───────────────────────────────────────────────────────────┤
 * │ ON DELETE NO ACTION │ Same as RESTRICT (default behavior).                     │
 * │                     │ Difference: deferred constraints me slightly different.   │
 * ├─────────────────────┼───────────────────────────────────────────────────────────┤
 * │ ON DELETE CASCADE   │ Parent delete hone pe child rows BHI automatically       │
 * │                     │ delete ho jati hain. Use carefully!                       │
 * ├─────────────────────┼───────────────────────────────────────────────────────────┤
 * │ ON DELETE SET NULL  │ Parent delete hone pe child FK column NULL ho jata hai.   │
 * │                     │ Child row survive karti hai but orphaned.                 │
 * ├─────────────────────┼───────────────────────────────────────────────────────────┤
 * │ ON DELETE SET       │ Parent delete hone pe child FK specified default value    │
 * │ DEFAULT             │ pe set ho jata hai.                                       │
 * └─────────────────────┴───────────────────────────────────────────────────────────┘
 */

// -- CASCADE: user delete → all their photos also deleted
// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200),
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
// );

// -- SET NULL: user delete → photos stay but user_id becomes NULL
// CREATE TABLE photos (
//     id SERIAL PRIMARY KEY,
//     url VARCHAR(200),
//     user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
// );


/**
 * ========================================================================
 * 7. JOIN — COMBINING TABLES
 * ========================================================================
 * NOTES:
 * - JOIN multiple tables ka data ek result me merge karta hai.
 * - ON clause define karta hai KIS BASIS pe rows match karni hain.
 * - Most common: FK column = PK column.
 * - Table alias (AS) readability ke liye use karo.
 */

// SELECT photos.id, photos.url, users.username
// FROM photos
// JOIN users ON users.id = photos.user_id;

// -- With aliases
// SELECT p.id, p.url, u.username
// FROM photos AS p
// JOIN users AS u ON u.id = p.user_id;


/**
 * ========================================================================
 * 8. JOIN TYPES [⚡ VISUAL]
 * ========================================================================
 *
 * Imagine two tables: users (left) and photos (right).
 * Some users have photos, some don't. Some photos have no valid user_id.
 *
 * ┌───────────────────────┬─────────────────────────────────────────────────────────────┐
 * │ JOIN Type             │ What it returns                                             │
 * ├───────────────────────┼─────────────────────────────────────────────────────────────┤
 * │ INNER JOIN (JOIN)     │ Sirf MATCHING rows dono tables se.                          │
 * │                       │ No match = row excluded.                                    │
 * │                       │ Most commonly used JOIN.                                    │
 * ├───────────────────────┼─────────────────────────────────────────────────────────────┤
 * │ LEFT JOIN             │ LEFT table ki SARI rows + right se matching.                │
 * │ (LEFT OUTER JOIN)     │ Right me match nahi → NULL values aati hain.                │
 * │                       │ "Give me ALL users, with their photos if they have any."    │
 * ├───────────────────────┼─────────────────────────────────────────────────────────────┤
 * │ RIGHT JOIN            │ RIGHT table ki SARI rows + left se matching.                │
 * │ (RIGHT OUTER JOIN)    │ Left me match nahi → NULL values aati hain.                 │
 * │                       │ "Give me ALL photos, with user info if available."          │
 * ├───────────────────────┼─────────────────────────────────────────────────────────────┤
 * │ FULL JOIN             │ DONO tables ki SARI rows.                                   │
 * │ (FULL OUTER JOIN)     │ Match nahi → NULL on the unmatched side.                    │
 * │                       │ "Give me everything from both tables."                      │
 * ├───────────────────────┼─────────────────────────────────────────────────────────────┤
 * │ CROSS JOIN            │ CARTESIAN PRODUCT — har row har row ke saath.                │
 * │                       │ 5 users × 3 photos = 15 rows. Rarely used directly.        │
 * └───────────────────────┴─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 9. INNER JOIN
 * ========================================================================
 * NOTES:
 * - Default JOIN type (JOIN = INNER JOIN).
 * - Sirf wahi rows aati hain jahan DONO tables me match ho.
 * - Agar user ka koi photo nahi → us user ki row nahi aayegi.
 * - Agar photo ka user_id invalid → us photo ki row nahi aayegi.
 */

// SELECT u.username, p.url
// FROM users AS u
// JOIN photos AS p ON p.user_id = u.id;


/**
 * ========================================================================
 * 10. LEFT JOIN
 * ========================================================================
 * NOTES:
 * - LEFT table (FROM ke baad wali) ki SARI rows aati hain.
 * - RIGHT table se match ho toh data aata hai, nahi toh NULL.
 * - Use case: "All users, even if they have no photos."
 */

// SELECT u.username, p.url
// FROM users AS u
// LEFT JOIN photos AS p ON p.user_id = u.id;

// -- Find users with NO photos
// SELECT u.username
// FROM users AS u
// LEFT JOIN photos AS p ON p.user_id = u.id
// WHERE p.id IS NULL;


/**
 * ========================================================================
 * 11. RIGHT JOIN
 * ========================================================================
 * NOTES:
 * - RIGHT table (JOIN ke baad wali) ki SARI rows aati hain.
 * - LEFT table se match ho toh data aata hai, nahi toh NULL.
 * - LEFT JOIN reverse karke RIGHT JOIN ban jata hai (interchangeable).
 * - Practice me LEFT JOIN zyada popular hai.
 */

// SELECT u.username, p.url
// FROM users AS u
// RIGHT JOIN photos AS p ON p.user_id = u.id;


/**
 * ========================================================================
 * 12. FULL JOIN
 * ========================================================================
 * NOTES:
 * - DONO tables ki SARI rows aati hain.
 * - Match ho → combined row. Match na ho → NULL on unmatched side.
 * - LEFT JOIN + RIGHT JOIN ka combination.
 */

// SELECT u.username, p.url
// FROM users AS u
// FULL JOIN photos AS p ON p.user_id = u.id;


/**
 * ========================================================================
 * 13. CROSS JOIN
 * ========================================================================
 * NOTES:
 * - CARTESIAN PRODUCT — har left row har right row ke saath pair hoti hai.
 * - ON clause NAHI hota.
 * - Result size = left_rows × right_rows.
 * - Rarely needed directly. Useful for generating combinations.
 */

// SELECT u.username, p.url
// FROM users AS u
// CROSS JOIN photos AS p;

// -- Implicit cross join (comma syntax)
// SELECT u.username, p.url
// FROM users AS u, photos AS p;


/**
 * ========================================================================
 * 14. MULTIPLE JOINS
 * ========================================================================
 * NOTES:
 * - Ek query me multiple tables JOIN kar sakte ho.
 * - Har JOIN ka apna ON clause hota hai.
 * - Chain karo: A JOIN B ON ... JOIN C ON ...
 */

// SELECT u.username, p.url, c.body AS comment
// FROM users AS u
// JOIN photos AS p ON p.user_id = u.id
// JOIN comments AS c ON c.photo_id = p.id;

// -- Many-to-many: students → enrollments → courses
// SELECT s.name, c.title
// FROM students AS s
// JOIN enrollments AS e ON e.student_id = s.id
// JOIN courses AS c ON c.id = e.course_id;


/**
 * ========================================================================
 * 15. SELF JOIN
 * ========================================================================
 * NOTES:
 * - Table apne aap se JOIN hota hai.
 * - Use case: hierarchical data (employees → manager), followers, comments → replies.
 * - Aliases ZARURI hain (same table ko alag naam dena padta hai).
 */

// -- Employees table where manager_id references same table
// SELECT e.name AS employee, m.name AS manager
// FROM employees AS e
// LEFT JOIN employees AS m ON e.manager_id = m.id;


/**
 * ========================================================================
 * 16. NATURAL JOIN (USE WITH CAUTION)
 * ========================================================================
 * NOTES:
 * - NATURAL JOIN automatically same-named columns pe join karta hai.
 * - Convenient lagta hai but DANGEROUS — column names change ho toh query break ho jati hai.
 * - Production me AVOID karo. Always explicit ON clause likho.
 */

// -- Automatically joins on columns with same name in both tables
// SELECT * FROM users NATURAL JOIN photos;
// -- ⚠️ Not recommended — use explicit JOIN ON instead


/**
 * ========================================================================
 * 17. USING CLAUSE
 * ========================================================================
 * NOTES:
 * - Jab dono tables me FK column ka naam SAME ho, ON ke bajaye USING use kar sakte ho.
 * - Cleaner syntax but less flexible than ON.
 */

// -- If both tables have 'user_id' column
// SELECT * FROM photos JOIN users USING (user_id);

// -- Equivalent to:
// SELECT * FROM photos JOIN users ON photos.user_id = users.user_id;


/**
 * ========================================================================
 * 18. JOIN RULES
 * ========================================================================
 * - INNER JOIN = default, matching rows only.
 * - LEFT JOIN = sab left rows + matching right (NULL for no match).
 * - Many-to-many = join table banana padta hai.
 * - ON DELETE CASCADE carefully use karo — cascading deletes dangerous hain.
 * - Always explicit ON clause likho, NATURAL JOIN avoid karo.
 * - Self JOIN ke liye aliases mandatory hain.
 * - Multiple JOINs chain kar sakte ho ek query me.
 */

const joinTypes = {
    inner: 'Matching rows from both tables',
    left: 'All from left + matching from right',
    right: 'All from right + matching from left',
    full: 'All from both tables',
    cross: 'Cartesian product (every row with every row)',
    self: 'Table joined with itself'
};

console.log('JOIN types:', joinTypes);
