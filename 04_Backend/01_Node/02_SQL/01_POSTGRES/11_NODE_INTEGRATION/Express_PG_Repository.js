'use strict';

/**
 * ========================================================================
 * NODE.JS INTEGRATION & REPOSITORY PATTERN - SHORT NOTES (Stephen Grider)
 * ========================================================================
 * NOTES:
 * - PostgreSQL ko Node.js se connect karne ke liye 'pg' library (node-postgres) use hoti hai.
 * - Connection Pooling ZARURI hai for performance.
 * - SQL Queries ko controllers me likhna BAD PRACTICE hai.
 * - Repository Pattern (Data Access Object) query logic ko app logic se alag karta hai.
 */


/**
 * ========================================================================
 * 1. CONNECTION POOLING (THE 'pg' LIBRARY)
 * ========================================================================
 * NOTES:
 * - Har DB query ke liye naya connection banana expensive (slow) hota hai.
 * - Pool ek set of connections maintain karta hai (e.g., 10 connections).
 * - App pool se connection leti hai, query run karti hai, aur wapas pool me daal deti hai.
 * - NEVER use single `Client` in production APIs (use `Pool`).
 */

// const { Pool } = require('pg');
//
// const pool = new Pool({
//     host: 'localhost',
//     port: 5432,
//     database: 'socialnetwork',
//     user: 'postgres',
//     password: 'password'
// });
//
// // Simple query via pool
// const { rows } = await pool.query('SELECT * FROM users');


/**
 * ========================================================================
 * 2. PARAMETERIZED QUERIES (PREVENTING SQL INJECTION)
 * ========================================================================
 * NOTES:
 * - Node.js me user input ko NEVER string concatenation (`` / +) se SQL me daalo.
 * - ALWAYS use parameterized queries with $1, $2.
 * - 'pg' library automatically input sanitize karti hai before sending to DB.
 */

// ❌ DANGEROUS (SQL INJECTION RISK):
// const query = `SELECT * FROM users WHERE username = '${req.body.username}'`;
// await pool.query(query);

// ✅ SAFE (PARAMETERIZED):
// const query = 'SELECT * FROM users WHERE username = $1';
// const { rows } = await pool.query(query, [req.body.username]);


/**
 * ========================================================================
 * 3. THE REPOSITORY PATTERN (DATA ACCESS OBJECT) [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Problem: Controllers me raw SQL strings likhne se code messy aur hard to test ho jata hai.
 * - Solution: Repository Pattern.
 * - Repository = Ek class/object jo sirf aur sirf us specific table ke DB operations handle karta hai.
 *
 * ARCHITECTURE:
 * ┌───────────────┐      ┌─────────────────┐      ┌─────────────┐
 * │   Controller  │ ──── │ User Repository │ ──── │ PostgreSQL  │
 * │ (App Logic)   │      │ (SQL Logic)     │      │ Database    │
 * └───────────────┘      └─────────────────┘      └─────────────┘
 * - Controller doesn't know about SQL. It just calls repo.findById().
 * - Repository doesn't know about HTTP req/res. It just runs SQL.
 */


/**
 * ========================================================================
 * 4. IMPLEMENTING A REPOSITORY
 * ========================================================================
 * NOTES:
 * - Har table (e.g., users) ka apna repository banate hain.
 * - Classes me static methods ya instance methods use kar sakte hain.
 */

// -- src/repos/user-repo.js
// const pool = require('../pool');
//
// class UserRepo {
//     static async find() {
//         const { rows } = await pool.query('SELECT * FROM users;');
//         return rows;
//     }
//
//     static async findById(id) {
//         const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
//         return rows[0];
//     }
//
//     static async insert(username, bio) {
//         const { rows } = await pool.query(
//             'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *;',
//             [username, bio]
//         );
//         return rows[0];
//     }
//
//     static async count() {
//         const { rows } = await pool.query('SELECT COUNT(*) FROM users;');
//         return parseInt(rows[0].count);
//     }
// }
//
// module.exports = UserRepo;


/**
 * ========================================================================
 * 5. USING REPOSITORY IN EXPRESS CONTROLLER
 * ========================================================================
 * NOTES:
 * - Controller ekdum clean ho jata hai.
 * - Error handling middleware me bhejna asaan hai.
 */

// -- src/routes/users.js
// const express = require('express');
// const UserRepo = require('../repos/user-repo');
// const router = express.Router();
//
// router.get('/users/:id', async (req, res) => {
//     const user = await UserRepo.findById(req.params.id);
//     if (!user) {
//         return res.status(404).send('User not found');
//     }
//     res.send(user);
// });
//
// router.post('/users', async (req, res) => {
//     const { username, bio } = req.body;
//     const user = await UserRepo.insert(username, bio);
//     res.status(201).send(user);
// });


/**
 * ========================================================================
 * 6. POOL SETUP BEST PRACTICES (SINGLETON PATTERN)
 * ========================================================================
 * NOTES:
 * - Ek hi App me multiple pools nahi banane chahiye.
 * - Pool ko ek separate file me initialize karo aur export karo (Singleton).
 * - App startup pe connect karo.
 */

// -- src/pool.js
// const { Pool } = require('pg');
//
// class PoolWrapper {
//     pool = null;
//
//     connect(options) {
//         this.pool = new Pool(options);
//         // Test connection
//         return this.pool.query('SELECT 1 + 1;');
//     }
//
//     close() {
//         return this.pool.end();
//     }
//
//     // Proxy query method
//     query(sql, params) {
//         return this.pool.query(sql, params);
//     }
// }
//
// module.exports = new PoolWrapper();


/**
 * ========================================================================
 * 7. RETURNING KEYWORD IN NODE.JS
 * ========================================================================
 * NOTES:
 * - INSERT, UPDATE, DELETE queries by default data return NAHI karti Postgres me.
 * - Node.js ko inserted/updated data wapas chahiye toh RETURNING * likhna ZARURI hai.
 * - Bina RETURNING ke, `rows` array empty aayega.
 */

// // BAD: Client ko created data wapas nahi bhej sakte
// await pool.query('INSERT INTO users (username) VALUES ($1)', ['sidd']);
//
// // GOOD: Get the full created row back (with DB generated ID)
// const { rows } = await pool.query(
//     'INSERT INTO users (username) VALUES ($1) RETURNING *',
//     ['sidd']
// );
// res.send(rows[0]);


/**
 * ========================================================================
 * 8. NODE.JS INTEGRATION RULES
 * ========================================================================
 * - NEVER use string concatenation for SQL — always $1, $2 placeholders.
 * - Use Connection Pool, single Client nahi.
 * - Controllers me SQL queries mat likho.
 * - Repository Pattern follow karo (Data layer ko API layer se alag rakho).
 * - INSERT/UPDATE/DELETE me RETURNING clause add karo agar result chahiye.
 * - Singleton pool wrapper banake use karo throughout the app.
 */

const nodePgRules = {
    sqlInjection: 'Always use parameterized queries ($1, $2)',
    pool: 'Use Pool, not single Client for APIs',
    repository: 'Abstract SQL logic into Repo classes',
    returning: 'Use RETURNING * to get inserted/updated records back'
};

console.log('Node.js PG Integration rules:', nodePgRules);
