/**
 * ## Quick revision
 *
 * - NOT NULL — missing value reject.
 * - UNIQUE — duplicate keys reject; NULL behavior DB/options se confirm karo.
 * - PRIMARY KEY — unique + non-null row identity.
 * - FOREIGN KEY — referenced row exist kare; delete/update action define karo.
 * - CHECK — row rule; NULL/unknown pass ho sakta hai, NOT NULL alag lagao.
 * - DEFAULT — omitted field ki default value; explicit NULL ko automatically replace nahi karta.
 * - App validation — clear message; DB constraint — concurrent writes ke against final guard.
 * - Migration — existing bad rows clean/validate karke constraint add karo.
 * - Cross-row rule — plain row CHECK se arbitrary other rows safely enforce nahi hote; appropriate constraint/transaction choose.
 * - Race guard — app pre-check pass hone ke baad concurrent insert ho sakta hai; database uniqueness final guard.
 * - Constraint name — stable meaningful names se violations ko useful errors mein map karo.
 */

'use strict';


// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL,
//     bio TEXT                          -- NULL allowed (optional field)
// );

// INSERT INTO users (username) VALUES ('grider');  -- ❌ ERROR: email is NOT NULL


// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     phone VARCHAR(20) UNIQUE           -- NULL allowed, but non-null must be unique
// );

// INSERT INTO users (email) VALUES ('a@b.com');
// INSERT INTO users (email) VALUES ('a@b.com');  -- ❌ ERROR: duplicate key


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


const constraintRules = {
    naming: 'Always name your constraints',
    notNull: 'Required fields must be NOT NULL',
    unique: 'Emails, usernames — UNIQUE',
    check: 'Business rules — CHECK (price > 0)',
    foreignKey: 'Referential integrity — always use FK',
    multiUnique: 'UNIQUE(col1, col2) for composite uniqueness'
};

console.log('Constraint rules:', constraintRules);
