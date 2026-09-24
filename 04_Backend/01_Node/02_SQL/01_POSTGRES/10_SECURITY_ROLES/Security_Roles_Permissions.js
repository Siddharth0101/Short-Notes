/**
 * ## Quick revision
 *
 * - Role — login identity ya permission group.
 * - GRANT/REVOKE — object privileges do/hatao.
 * - Least privilege — app ko required tables/actions tak access.
 * - Schema privileges — schema access aur table access alag ho sakte hain.
 * - RLS — row policy se tenant/user isolation; privileged bypass samjho.
 * - SQL injection — values parameterize; dynamic identifiers allowlist.
 * - Secrets — DB credentials repository/logs se bahar.
 * - Audit — who/what/when record; sensitive payload minimize.
 * - Role inheritance — effective access direct grants se zyada ho sakta hai; memberships audit karo.
 * - Owner privilege — object owner elevated operations kar sakta hai; app role ko owner banana thoughtfully choose.
 * - Parameterized SQL — values safely bind; ORDER BY/table identifier allowlist se choose.
 */

'use strict';


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


// -- Revoke INSERT permission
// REVOKE INSERT ON posts FROM app_user;

// -- Revoke ALL
// REVOKE ALL PRIVILEGES ON users FROM app_user;

// -- Revoke role membership
// REVOKE readonly_group FROM app_user;

// -- Revoke from PUBLIC (all users)
// REVOKE ALL ON users FROM PUBLIC;


// -- Future tables in public schema automatically get SELECT for app_user
// ALTER DEFAULT PRIVILEGES IN SCHEMA public
// GRANT SELECT ON TABLES TO app_user;

// -- Future sequences (auto-increment) usage
// ALTER DEFAULT PRIVILEGES IN SCHEMA public
// GRANT USAGE ON SEQUENCES TO app_user;


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


// -- Node.js with SSL
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: 5432,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     ssl: { rejectUnauthorized: true }
// });


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


const securityRules = {
    injection: 'NEVER concatenate user input — parameterize!',
    leastPrivilege: 'Minimum permissions for app roles',
    credentials: 'Environment variables, never in code',
    ssl: 'SSL/TLS required for production',
    rls: 'Row-Level Security for multi-tenant apps',
    audit: 'Log changes on sensitive tables'
};

console.log('Security rules:', securityRules);
