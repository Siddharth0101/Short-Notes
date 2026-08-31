'use strict';

/**
 * ========================================================================
 * SECURITY, ROLES AND PERMISSIONS - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - PostgreSQL ka robust role-based access control (RBAC) system hai.
 * - Roles = users + groups. Har role ke permissions define hote hain.
 * - SQL injection sabse common aur dangerous security vulnerability hai.
 * - Defense in depth: app-level + DB-level security dono chahiye.
 */


/**
 * ========================================================================
 * 1. ROLES IN POSTGRESQL
 * ========================================================================
 * NOTES:
 * - PostgreSQL me USER aur GROUP dono "ROLE" hain.
 * - Role = permissions ka set + login capability.
 * - Superuser (postgres) = unlimited access (dangerous, use sparingly).
 * - Application ke liye LIMITED permissions wala separate role banao.
 *
 * ROLE ATTRIBUTES:
 * ┌─────────────────────┬──────────────────────────────────────────────────┐
 * │ Attribute           │ Meaning                                          │
 * ├─────────────────────┼──────────────────────────────────────────────────┤
 * │ LOGIN               │ Can connect to DB (like a user)                   │
 * │ SUPERUSER           │ All permissions, bypass all checks                │
 * │ CREATEDB            │ Can create new databases                          │
 * │ CREATEROLE          │ Can create/manage other roles                     │
 * │ REPLICATION          │ Can initiate streaming replication                │
 * │ PASSWORD 'xxx'      │ Set login password                                │
 * │ VALID UNTIL 'date'  │ Password expiry date                              │
 * │ CONNECTION LIMIT n  │ Max concurrent connections                        │
 * └─────────────────────┴──────────────────────────────────────────────────┘
 */

// -- Create a user role (with login)
// CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';

// -- Create a role without login (group role)
// CREATE ROLE readonly_group;

// -- Create superuser (use carefully!)
// CREATE ROLE admin_user WITH LOGIN PASSWORD 'admin_pass' SUPERUSER;

// -- Modify role
// ALTER ROLE app_user WITH CREATEDB;

// -- Drop role
// DROP ROLE app_user;

// -- List all roles
// SELECT rolname, rolsuper, rolcanlogin FROM pg_roles;

// -- psql command
// \du    -- List all roles


/**
 * ========================================================================
 * 2. GRANT — GIVE PERMISSIONS
 * ========================================================================
 * NOTES:
 * - GRANT specific privileges deta hai roles ko.
 * - Table-level, schema-level, database-level permissions ho sakte hain.
 * - ALL PRIVILEGES = sab permissions ek saath.
 * - WITH GRANT OPTION = ye role further grant kar sakta hai.
 *
 * TABLE PRIVILEGES:
 * ┌──────────────┬───────────────────────────────────────┐
 * │ Privilege    │ Allows                                │
 * ├──────────────┼───────────────────────────────────────┤
 * │ SELECT       │ Read data (query)                     │
 * │ INSERT       │ Add new rows                          │
 * │ UPDATE       │ Modify existing rows                  │
 * │ DELETE       │ Remove rows                           │
 * │ TRUNCATE     │ Empty the table                       │
 * │ REFERENCES   │ Create FK referencing this table      │
 * │ TRIGGER      │ Create triggers on this table         │
 * │ ALL          │ All of the above                      │
 * └──────────────┴───────────────────────────────────────┘
 */

// -- Grant SELECT on a table
// GRANT SELECT ON users TO app_user;

// -- Grant multiple privileges
// GRANT SELECT, INSERT, UPDATE ON posts TO app_user;

// -- Grant ALL on a table
// GRANT ALL PRIVILEGES ON users TO admin_role;

// -- Grant on ALL tables in a schema
// GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_group;

// -- Grant with ability to re-grant
// GRANT SELECT ON users TO team_lead WITH GRANT OPTION;

// -- Grant role membership (add user to group)
// GRANT readonly_group TO app_user;
// -- Now app_user inherits all permissions of readonly_group


/**
 * ========================================================================
 * 3. REVOKE — REMOVE PERMISSIONS
 * ========================================================================
 * NOTES:
 * - REVOKE previously granted permissions hatata hai.
 * - REVOKE ke baad role wo operation nahi kar payega.
 */

// -- Revoke INSERT permission
// REVOKE INSERT ON posts FROM app_user;

// -- Revoke ALL
// REVOKE ALL PRIVILEGES ON users FROM app_user;

// -- Revoke role membership
// REVOKE readonly_group FROM app_user;

// -- Revoke from PUBLIC (all users)
// REVOKE ALL ON users FROM PUBLIC;


/**
 * ========================================================================
 * 4. DEFAULT PRIVILEGES
 * ========================================================================
 * NOTES:
 * - ALTER DEFAULT PRIVILEGES future me banne wali tables pe auto-apply hota hai.
 * - Current tables pe affect NAHI karta — sirf NEW tables pe.
 * - Schema me naye tables bante rahe aur permissions auto-set ho jaaye.
 */

// -- Future tables in public schema automatically get SELECT for app_user
// ALTER DEFAULT PRIVILEGES IN SCHEMA public
// GRANT SELECT ON TABLES TO app_user;

// -- Future sequences (auto-increment) usage
// ALTER DEFAULT PRIVILEGES IN SCHEMA public
// GRANT USAGE ON SEQUENCES TO app_user;


/**
 * ========================================================================
 * 5. SCHEMA-LEVEL SECURITY
 * ========================================================================
 * NOTES:
 * - PostgreSQL me schema = namespace (logical grouping of tables).
 * - Default schema = "public". Custom schemas bana sakte ho.
 * - Schema-level permissions se poore group of tables control hote hain.
 * - USAGE privilege schema me objects access karne ke liye ZARURI hai.
 */

// -- Create a schema
// CREATE SCHEMA app_schema;

// -- Grant USAGE on schema (required to access any object inside)
// GRANT USAGE ON SCHEMA app_schema TO app_user;

// -- Grant SELECT on all tables in schema
// GRANT SELECT ON ALL TABLES IN SCHEMA app_schema TO app_user;

// -- Create table inside custom schema
// CREATE TABLE app_schema.settings (
//     id SERIAL PRIMARY KEY,
//     key VARCHAR(100) NOT NULL,
//     value TEXT
// );


/**
 * ========================================================================
 * 6. ROW-LEVEL SECURITY (RLS)
 * ========================================================================
 * NOTES:
 * - Row-Level Security = rows per-user filter karna DATABASE level pe.
 * - Policy define karti hai ki kaunsa user kaunsi rows access kar sakta hai.
 * - Multi-tenant apps ke liye powerful.
 * - Steps:
 *   1. RLS enable karo table pe.
 *   2. Policy create karo (USING clause = read filter, WITH CHECK = write filter).
 *   3. Superuser RLS bypass karta hai (unless forced).
 */

// -- Enable RLS on table
// ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

// -- Policy: users can only see their own posts
// CREATE POLICY user_posts_policy ON posts
//     FOR SELECT
//     USING (user_id = current_setting('app.current_user_id')::INTEGER);

// -- Policy: users can only INSERT their own posts
// CREATE POLICY user_insert_policy ON posts
//     FOR INSERT
//     WITH CHECK (user_id = current_setting('app.current_user_id')::INTEGER);

// -- Policy: users can only UPDATE their own posts
// CREATE POLICY user_update_policy ON posts
//     FOR UPDATE
//     USING (user_id = current_setting('app.current_user_id')::INTEGER)
//     WITH CHECK (user_id = current_setting('app.current_user_id')::INTEGER);

// -- Set the current user in session (from your app)
// SET app.current_user_id = '42';

// -- Drop policy
// DROP POLICY user_posts_policy ON posts;

// -- Disable RLS
// ALTER TABLE posts DISABLE ROW LEVEL SECURITY;


/**
 * ========================================================================
 * 7. SQL INJECTION — THE #1 SECURITY THREAT [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - SQL Injection = attacker SQL code inject karta hai user input me.
 * - Application user input ko directly SQL me concatenate kare toh vulnerable.
 * - Result: Data leak, data delete, auth bypass, full DB compromise.
 *
 * VULNERABLE CODE EXAMPLE:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ // ❌ NEVER DO THIS! String concatenation with user input!         │
 * │ const query = `SELECT * FROM users WHERE id = ${req.params.id}`;   │
 * │                                                                     │
 * │ // Attacker sends: id = "1; DROP TABLE users; --"                   │
 * │ // Final query: SELECT * FROM users WHERE id = 1; DROP TABLE users; │
 * │ // 💀 Table deleted!                                                │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * SAFE CODE EXAMPLE:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ // ✅ PARAMETERIZED QUERY (placeholder $1, $2, etc.)               │
 * │ const query = 'SELECT * FROM users WHERE id = $1';                  │
 * │ const result = await pool.query(query, [req.params.id]);            │
 * │                                                                     │
 * │ // Input is treated as DATA, never as SQL code.                     │
 * │ // Attacker's "1; DROP TABLE users" becomes just a string value.    │
 * └──────────────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 8. PARAMETERIZED QUERIES (PREPARED STATEMENTS)
 * ========================================================================
 * NOTES:
 * - ALWAYS parameterized queries use karo. NEVER string concatenation.
 * - Node.js pg library me $1, $2, $3... placeholders use hote hain.
 * - ORM (Sequelize, Prisma, Knex) automatically parameterize karti hain.
 * - Prepared statements = query plan cache + SQL injection prevention.
 */

// -- PostgreSQL prepared statement (native SQL)
// PREPARE find_user (INTEGER) AS
//     SELECT * FROM users WHERE id = $1;
// EXECUTE find_user(42);

// -- Node.js pg library (parameterized)
// const { Pool } = require('pg');
// const pool = new Pool({ /* config */ });
//
// // ✅ SAFE: parameterized query
// const result = await pool.query(
//     'SELECT * FROM users WHERE email = $1 AND is_active = $2',
//     [userEmail, true]
// );
//
// // ✅ SAFE: INSERT with parameters
// await pool.query(
//     'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
//     [username, email]
// );


/**
 * ========================================================================
 * 9. CONNECTION SECURITY
 * ========================================================================
 * NOTES:
 * - pg_hba.conf file controls WHO can connect, from WHERE, HOW.
 * - SSL/TLS connections encrypt data in transit.
 * - Environment variables me credentials rakho (code me nahi!).
 * - Connection pooling use karo (PgBouncer, node-pg Pool).
 *
 * BEST PRACTICES:
 * - Separate roles for different app components.
 * - Application role ko sirf MINIMUM required permissions do.
 * - Superuser sirf admin tasks ke liye (never in app code).
 * - Password rotation periodically karo.
 * - SSL = required for production connections.
 */

// -- Node.js with SSL
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: 5432,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     ssl: { rejectUnauthorized: true }
// });


/**
 * ========================================================================
 * 10. AUDIT LOGGING (TRACKING CHANGES)
 * ========================================================================
 * NOTES:
 * - Important tables pe changes track karna security aur debugging ke liye.
 * - Trigger + audit table pattern common hai.
 * - WHO changed WHAT and WHEN — ye information log karo.
 */

// CREATE TABLE audit_log (
//     id SERIAL PRIMARY KEY,
//     table_name VARCHAR(100) NOT NULL,
//     operation VARCHAR(10) NOT NULL,     -- INSERT, UPDATE, DELETE
//     old_data JSONB,
//     new_data JSONB,
//     changed_by VARCHAR(100),
//     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- Trigger function
// CREATE OR REPLACE FUNCTION log_changes() RETURNS TRIGGER AS $$
// BEGIN
//     INSERT INTO audit_log (table_name, operation, old_data, new_data, changed_by)
//     VALUES (
//         TG_TABLE_NAME,
//         TG_OP,
//         CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::JSONB ELSE NULL END,
//         CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::JSONB ELSE NULL END,
//         current_user
//     );
//     RETURN COALESCE(NEW, OLD);
// END;
// $$ LANGUAGE plpgsql;

// -- Attach trigger to a table
// CREATE TRIGGER users_audit
//     AFTER INSERT OR UPDATE OR DELETE ON users
//     FOR EACH ROW EXECUTE FUNCTION log_changes();


/**
 * ========================================================================
 * 11. SECURITY RULES
 * ========================================================================
 * - NEVER string concatenation with user input → SQL injection.
 * - ALWAYS use parameterized queries ($1, $2 placeholders).
 * - Application role ko MINIMUM privileges do (principle of least privilege).
 * - Superuser role SIRF admin tasks ke liye.
 * - Credentials environment variables me rakho, code me NAHI.
 * - SSL/TLS ZARURI hai production connections ke liye.
 * - Row-Level Security multi-tenant apps me use karo.
 * - Audit logging sensitive tables pe enable karo.
 * - Default privileges set karo for future tables.
 * - Regular password rotation aur access reviews.
 */

const securityRules = {
    injection: 'NEVER concatenate user input — parameterize!',
    leastPrivilege: 'Minimum permissions for app roles',
    credentials: 'Environment variables, never in code',
    ssl: 'SSL/TLS required for production',
    rls: 'Row-Level Security for multi-tenant apps',
    audit: 'Log changes on sensitive tables'
};

console.log('Security rules:', securityRules);
