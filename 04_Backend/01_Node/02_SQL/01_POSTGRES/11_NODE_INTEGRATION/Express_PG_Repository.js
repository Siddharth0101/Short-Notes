/**
 * ## Quick revision
 *
 * - Pool — PostgreSQL connections reuse; bounded size rakho.
 * - Repository — SQL/data access encapsulate; controller HTTP contract own kare.
 * - Query — `$1`, `$2` placeholders se values bind.
 * - Transaction — same checked-out client par BEGIN/work/COMMIT.
 * - Cleanup — catch mein rollback, finally mein client release.
 * - Error mapping — unique conflict/missing row ko stable HTTP response mein map.
 * - Pagination — bounded limit + stable order; tenant predicate mandatory.
 * - Test — real database constraints aur rollback behavior verify.
 * - Affected rows — update count zero ho toh missing/stale version distinguish karne ka contract.
 * - Error after commit — response fail hone par write already durable; retry identity same rakho.
 * - Pool timeout — connection wait ko request deadline ke andar bound karo.
 */

'use strict';


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


// ❌ DANGEROUS (SQL INJECTION RISK):
// const query = `SELECT * FROM users WHERE username = '${req.body.username}'`;
// await pool.query(query);

// ✅ SAFE (PARAMETERIZED):
// const query = 'SELECT * FROM users WHERE username = $1';
// const { rows } = await pool.query(query, [req.body.username]);


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


// // BAD: Client ko created data wapas nahi bhej sakte
// await pool.query('INSERT INTO users (username) VALUES ($1)', ['sidd']);
//
// // GOOD: Get the full created row back (with DB generated ID)
// const { rows } = await pool.query(
//     'INSERT INTO users (username) VALUES ($1) RETURNING *',
//     ['sidd']
// );
// res.send(rows[0]);


const nodePgRules = {
    sqlInjection: 'Always use parameterized queries ($1, $2)',
    pool: 'Use Pool, not single Client for APIs',
    repository: 'Abstract SQL logic into Repo classes',
    returning: 'Use RETURNING * to get inserted/updated records back'
};

console.log('Node.js PG Integration rules:', nodePgRules);
