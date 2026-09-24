/**
 * ## Quick revision
 *
 * - Foreign key — referenced row relation enforce karta hai.
 * - One-to-many — child par parent key; many-to-many — junction table.
 * - INNER JOIN — matching rows; LEFT JOIN — saari left rows preserve.
 * - RIGHT/FULL JOIN — right / dono sides ke unmatched rows bhi preserve.
 * - CROSS JOIN — Cartesian product; rows multiply hoti hain.
 * - SELF JOIN — same table ko aliases se join.
 * - Join condition — missing/wrong condition duplicates ya huge result bana sakti hai.
 * - LEFT JOIN trap — right-field WHERE filter unmatched rows remove kar sakta hai.
 * - Cascade — parent deletion ka child behavior consciously choose karo.
 * - Semi-join pattern — parent once chahiye toh EXISTS; normal join multiple child matches se parent repeat karta hai.
 * - Anti-join pattern — missing related rows ke liye NOT EXISTS ka clear null-safe contract.
 * - Join cardinality — one-to-one assume karne se pehle key uniqueness verify karo.
 */

'use strict';


// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL
// );

// -- Modern way (SQL standard)
// CREATE TABLE users (
//     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//     username VARCHAR(50) NOT NULL
// );


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


// SELECT photos.id, photos.url, users.username
// FROM photos
// JOIN users ON users.id = photos.user_id;

// -- With aliases
// SELECT p.id, p.url, u.username
// FROM photos AS p
// JOIN users AS u ON u.id = p.user_id;


// SELECT u.username, p.url
// FROM users AS u
// JOIN photos AS p ON p.user_id = u.id;


// SELECT u.username, p.url
// FROM users AS u
// LEFT JOIN photos AS p ON p.user_id = u.id;

// -- Find users with NO photos
// SELECT u.username
// FROM users AS u
// LEFT JOIN photos AS p ON p.user_id = u.id
// WHERE p.id IS NULL;


// SELECT u.username, p.url
// FROM users AS u
// RIGHT JOIN photos AS p ON p.user_id = u.id;


// SELECT u.username, p.url
// FROM users AS u
// FULL JOIN photos AS p ON p.user_id = u.id;


// SELECT u.username, p.url
// FROM users AS u
// CROSS JOIN photos AS p;

// -- Implicit cross join (comma syntax)
// SELECT u.username, p.url
// FROM users AS u, photos AS p;


// SELECT u.username, p.url, c.body AS comment
// FROM users AS u
// JOIN photos AS p ON p.user_id = u.id
// JOIN comments AS c ON c.photo_id = p.id;

// -- Many-to-many: students → enrollments → courses
// SELECT s.name, c.title
// FROM students AS s
// JOIN enrollments AS e ON e.student_id = s.id
// JOIN courses AS c ON c.id = e.course_id;


// -- Employees table where manager_id references same table
// SELECT e.name AS employee, m.name AS manager
// FROM employees AS e
// LEFT JOIN employees AS m ON e.manager_id = m.id;


// -- Automatically joins on columns with same name in both tables
// SELECT * FROM users NATURAL JOIN photos;
// -- ⚠️ Not recommended — use explicit JOIN ON instead


// -- If both tables have 'user_id' column
// SELECT * FROM photos JOIN users USING (user_id);

// -- Equivalent to:
// SELECT * FROM photos JOIN users ON photos.user_id = users.user_id;


const joinTypes = {
    inner: 'Matching rows from both tables',
    left: 'All from left + matching from right',
    right: 'All from right + matching from left',
    full: 'All from both tables',
    cross: 'Cartesian product (every row with every row)',
    self: 'Table joined with itself'
};

console.log('JOIN types:', joinTypes);
