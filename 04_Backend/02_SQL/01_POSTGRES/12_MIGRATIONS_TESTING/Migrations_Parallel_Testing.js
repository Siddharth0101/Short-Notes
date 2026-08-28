'use strict';

/**
 * ========================================================================
 * MIGRATIONS & FAST PARALLEL TESTING - SHORT NOTES (Stephen Grider)
 * ========================================================================
 * NOTES:
 * - Migrations: DB schema changes (CREATE, ALTER tables) ko version control me track karna.
 * - Parallel Testing: Test suites (e.g. Jest) concurrently DB ko hit karte hain,
 *   jisse data collisions ho sakte hain. Dynamic schemas/databases fix this.
 */


/**
 * ========================================================================
 * 1. WHAT ARE MIGRATIONS? [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - DB schema (tables, columns) time ke sath change hota hai.
 * - Migrations = step-by-step SQL scripts jo DB ko ek version se dusre me le jate hain.
 * - UP script: Applies the change (e.g., CREATE TABLE).
 * - DOWN script: Reverts the change (e.g., DROP TABLE).
 *
 * ┌───────────────┬──────────────────────────────┬──────────────────────────────┐
 * │ Migration File│ UP Script                    │ DOWN Script (Rollback)       │
 * ├───────────────┼──────────────────────────────┼──────────────────────────────┤
 * │ 01_users.sql  │ CREATE TABLE users (...)     │ DROP TABLE users;            │
 * │ 02_posts.sql  │ CREATE TABLE posts (...)     │ DROP TABLE posts;            │
 * │ 03_add_bio.sql│ ALTER TABLE users ADD bio... │ ALTER TABLE users DROP bio...│
 * └───────────────┴──────────────────────────────┴──────────────────────────────┘
 */


/**
 * ========================================================================
 * 2. NODE-PG-MIGRATE
 * ========================================================================
 * NOTES:
 * - Grider's course uses `node-pg-migrate` (a popular npm package for migrations).
 * - Migrations folder me timestamps ke saath files generate hoti hain.
 * - DB me `pgmigrations` naam ki table banti hai track karne ke liye ki 
 *   kaunse migrations run ho chuke hain.
 */

// // Terminal commands:
// // npm run migrate create add-users-table
// // npm run migrate up
// // npm run migrate down

// // Example Migration File (created by node-pg-migrate)
// exports.up = (pgm) => {
//     pgm.sql(`
//         CREATE TABLE users (
//             id SERIAL PRIMARY KEY,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             username VARCHAR(30) NOT NULL
//         );
//     `);
// };
//
// exports.down = (pgm) => {
//     pgm.sql(`DROP TABLE users;`);
// };


/**
 * ========================================================================
 * 3. THE PARALLEL TESTING PROBLEM
 * ========================================================================
 * NOTES:
 * - Testing tools like Jest concurrent (parallel) test runners use karte hain (for speed).
 * - Agar 10 test files ek hi waqt pe same Database me INSERT/DELETE kar rahi hain:
 *   - Test A inserts a user.
 *   - Test B deletes all users (DB cleanup).
 *   - Test A checks if user exists → FAILS (flaky test).
 * - Single global database pe tests run karna unreliable hai.
 */


/**
 * ========================================================================
 * 4. SOLUTION: DYNAMIC SCHEMAS PER TEST RUNNER
 * ========================================================================
 * NOTES:
 * - Fast parallel testing achieve karne ka tarika: Har test worker ko ek FRESH, ISOLATED
 *   environment do.
 * - Approach: Tests start hone se pehle multiple DB SCHEMAS create karo.
 * - Jest provides `process.env.JEST_WORKER_ID` (1, 2, 3, etc.).
 *
 * HOW IT WORKS:
 * 1. Global Setup (runs once): Create base schema, run migrations.
 * 2. Test Setup (runs per worker): Create a clone of base schema named `test_schema_1`, `test_schema_2`.
 * 3. App Code: Dynamically points `search_path` to the worker's schema.
 * 4. Global Teardown: Drop all test schemas.
 */

// // Example logic inside Jest Setup:
// // (This is a simplified version of the logic Grider teaches)
//
// const workerId = process.env.JEST_WORKER_ID;
// const schemaName = `test_${workerId}`;
//
// beforeAll(async () => {
//     // 1. Create a fresh schema for this specific Jest worker
//     await pool.query(`CREATE SCHEMA ${schemaName}`);
//
//     // 2. Set search_path so queries go to this schema instead of 'public'
//     await pool.query(`SET search_path TO ${schemaName}, public`);
//
//     // 3. Run migrations on this specific schema
//     // (In practice, we usually clone a template schema to save time)
// });
//
// afterAll(async () => {
//     // 4. Drop the schema after test file completes
//     await pool.query(`DROP SCHEMA ${schemaName} CASCADE`);
// });


/**
 * ========================================================================
 * 5. POSTGRESQL SEARCH_PATH
 * ========================================================================
 * NOTES:
 * - `search_path` PostgreSQL ko batata hai kis order me schemas dhundne hain.
 * - Default: `"$user", public`
 * - Agar `search_path` change karke `test_1` kar diya:
 *   - `SELECT * FROM users` → PostgreSQL pehle `test_1.users` check karega.
 * - Ye mechanism transparently API code ko bina change kiye different schemas 
 *   pe point karne ki taqat deta hai.
 */

// // Setting search_path for a specific connection
// await pool.query('SET search_path TO test_1, public');

// // Now any generic query hits 'test_1' schema
// const { rows } = await pool.query('SELECT * FROM users');


/**
 * ========================================================================
 * 6. ALTERNATIVE TEST ISOLATION: TRANSACTIONS
 * ========================================================================
 * NOTES:
 * - Dusra common approach (faster than schema creation):
 *   1. Har test ke start me `BEGIN` karo.
 *   2. Test run karo (INSERT/UPDATE).
 *   3. Test end pe `ROLLBACK` kar do.
 * - Pros: Extremely fast. DB state completely reset ho jata hai.
 * - Cons: App code me already manual transactions hue toh nested transactions 
 *   (savepoints) manage karna complex ho jata hai.
 */


/**
 * ========================================================================
 * 7. MIGRATIONS & TESTING RULES
 * ========================================================================
 * - NEVER modify DB tables manually in production (always use migration files).
 * - UP and DOWN scripts hamesha likho (easy rollback).
 * - Tests ko kabhi fixed global database pe parallel run mat karo.
 * - Use `search_path` trick and dynamic schemas (e.g., `test_1`, `test_2`) for fast parallel DB tests.
 * - Production deployments ka pehla step hamesha `npm run migrate up` hona chahiye.
 */

const migrationTestingRules = {
    migrations: 'Track schema changes in version control (UP/DOWN scripts)',
    pgMigrate: 'Use tools like node-pg-migrate',
    parallelTesting: 'Use JEST_WORKER_ID to create isolated schemas',
    searchPath: 'SET search_path to redirect queries transparently'
};

console.log('Migrations & Testing rules:', migrationTestingRules);
