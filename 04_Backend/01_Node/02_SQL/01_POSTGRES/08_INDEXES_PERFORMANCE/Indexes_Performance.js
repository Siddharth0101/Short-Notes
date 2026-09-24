/**
 * ## Quick revision
 *
 * - Index — extra lookup structure; read speed ke badle write/storage cost.
 * - B-tree — equality/range/order mein common; har index B-tree nahi.
 * - Compound index — column order query ke predicates/order se match.
 * - Partial index — selected rows only; query predicate compatible ho.
 * - Expression index — indexed expression se matching query useful ho sakti hai.
 * - GIN/GiST — specialized search/operator classes ke liye.
 * - EXPLAIN — plan estimate; ANALYZE query execute karke actual timings deta hai.
 * - Index-only scan — covering columns ke saath visibility conditions bhi matter.
 * - Selectivity — bahut rows return ho toh sequential scan reasonable ho sakta hai.
 * - Write amplification — extra indexes har write par maintenance badhate hain; unused indexes review karo.
 * - Sort support — index ordering tabhi useful jab query predicates/direction compatible hon.
 * - Plan evidence — rows estimated vs actual ka large mismatch statistics/data-skew issue signal kar sakta hai.
 */

'use strict';


// -- Basic index
// CREATE INDEX idx_users_username ON users (username);

// -- Index with IF NOT EXISTS
// CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

// -- Drop index
// DROP INDEX idx_users_username;
// DROP INDEX IF EXISTS idx_users_username;


// -- Composite index on country + population
// CREATE INDEX idx_cities_country_pop ON cities (country, population);

// -- This uses the index: ✅
// SELECT * FROM cities WHERE country = 'India';
// SELECT * FROM cities WHERE country = 'India' AND population > 5000000;

// -- This does NOT use the index efficiently: ❌
// SELECT * FROM cities WHERE population > 5000000;
// -- (population is NOT the leftmost column)


// CREATE UNIQUE INDEX idx_users_email_unique ON users (email);

// -- Same as adding UNIQUE constraint:
// ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);


// -- See the plan without executing
// EXPLAIN SELECT * FROM users WHERE username = 'grider';

// -- See the plan WITH actual execution stats
// EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'grider';

// -- EXAMPLE OUTPUT (simplified):
// -- Index Scan using idx_users_username on users
// --   Index Cond: (username = 'grider')
// --   Planning Time: 0.1 ms
// --   Execution Time: 0.05 ms


// -- Hash index
// CREATE INDEX idx_users_email_hash ON users USING HASH (email);

// -- GIN index for JSONB
// CREATE INDEX idx_posts_metadata ON posts USING GIN (metadata);

// -- GiST index for geometric data
// CREATE INDEX idx_locations_point ON locations USING GIST (coordinates);

// -- BRIN index for large time-series data
// CREATE INDEX idx_logs_created ON logs USING BRIN (created_at);


// -- Index only on active users (not all users)
// CREATE INDEX idx_active_users ON users (username) WHERE is_active = TRUE;

// -- Index only on recent orders
// CREATE INDEX idx_recent_orders ON orders (created_at)
// WHERE created_at > '2024-01-01';

// -- This query uses the partial index: ✅
// SELECT * FROM users WHERE username = 'grider' AND is_active = TRUE;


// -- Index on lowercased email (case-insensitive search fast)
// CREATE INDEX idx_users_email_lower ON users (LOWER(email));

// -- This uses the expression index: ✅
// SELECT * FROM users WHERE LOWER(email) = 'grider@example.com';

// -- This does NOT use it: ❌
// SELECT * FROM users WHERE email = 'grider@example.com';
// -- (original column, not the expression)


// -- Covering index: both queried and selected columns are in the index
// CREATE INDEX idx_users_covering ON users (username) INCLUDE (email);

// -- This can do Index Only Scan: ✅
// SELECT username, email FROM users WHERE username = 'grider';


// SELECT indexrelname, idx_scan
// FROM pg_stat_user_indexes
// WHERE idx_scan = 0
// ORDER BY pg_relation_size(indexrelid) DESC;
// -- idx_scan = 0 means index was NEVER used → candidate for dropping


const indexRules = {
    autoIndex: 'PK and UNIQUE auto-indexed',
    fkIndex: 'Manually index FK columns',
    measure: 'EXPLAIN ANALYZE before adding index',
    partial: 'Partial index for subset queries',
    expression: 'Expression index for function-based queries',
    compositeOrder: 'Leftmost column in composite index matters',
    cleanup: 'Drop unused indexes periodically'
};

console.log('Index rules:', indexRules);
