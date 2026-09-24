/**
 * ## Quick revision
 *
 * - Migration — versioned schema change; applied shared file ko edit mat karo.
 * - Expand-contract — old/new app versions compatible rakhkar schema evolve.
 * - Parallel tests — unique DB/schema/data keys; shared cleanup races avoid.
 * - Transactions — test rollback tabhi kaam kare jab operations same controlled boundary mein hon.
 * - Test database — production data se isolated; destructive reset target verify.
 * - Fixtures — minimum deterministic seed, per-test ownership.
 * - Cleanup — failure par bhi resources/data release.
 * - CI — migrations fresh database par aur existing schema upgrade path par verify.
 * - Seed identity — deterministic fixture IDs parallel runs mein clash na karein; namespace per worker.
 * - Migration verification — fresh install aur populated old schema upgrade dono paths.
 * - Data loss — destructive change se pehle recovery/backup restore path verify.
 */

'use strict';


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


// // Setting search_path for a specific connection
// await pool.query('SET search_path TO test_1, public');

// // Now any generic query hits 'test_1' schema
// const { rows } = await pool.query('SELECT * FROM users');


const migrationTestingRules = {
    migrations: 'Track schema changes in version control (UP/DOWN scripts)',
    pgMigrate: 'Use tools like node-pg-migrate',
    parallelTesting: 'Use JEST_WORKER_ID to create isolated schemas',
    searchPath: 'SET search_path to redirect queries transparently'
};

console.log('Migrations & Testing rules:', migrationTestingRules);
