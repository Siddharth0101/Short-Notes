'use strict';

/**
 * ========================================================================
 * INDEXES AND PERFORMANCE - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - Index = data structure jo queries FAST banata hai (like book ka index page).
 * - Without index → Full Table Scan (sequential scan — sab rows check).
 * - With index → Index Scan (direct jump to matching rows).
 * - Trade-off: Faster reads ←→ Slower writes (INSERT/UPDATE/DELETE).
 * - PostgreSQL default index type = B-Tree.
 */


/**
 * ========================================================================
 * 1. HOW INDEXES WORK [⚡ VISUAL]
 * ========================================================================
 *
 * WITHOUT INDEX (Full Table Scan / Seq Scan):
 * ┌─────────────────────────────────────────────────────────┐
 * │ Query: SELECT * FROM users WHERE username = 'grider';  │
 * │                                                         │
 * │ DB checks: Row 1 → Row 2 → Row 3 → ... → Row 1M       │
 * │ Every single row checked! O(n) time.                    │
 * └─────────────────────────────────────────────────────────┘
 *
 * WITH INDEX (Index Scan / B-Tree):
 * ┌─────────────────────────────────────────────────────────┐
 * │ Query: SELECT * FROM users WHERE username = 'grider';  │
 * │                                                         │
 * │ B-Tree: Root → Branch → Leaf → Pointer to exact row    │
 * │ Logarithmic search! O(log n) time.                      │
 * │ 1M rows → ~20 comparisons instead of 1M.               │
 * └─────────────────────────────────────────────────────────┘
 *
 * NOTES:
 * - B-Tree = Balanced Tree. Sorted structure.
 * - Leaf nodes actual data ka pointer (row location/heap tuple) rakhte hain.
 * - PostgreSQL automatically PK aur UNIQUE columns pe index banata hai.
 */


/**
 * ========================================================================
 * 2. CREATE INDEX
 * ========================================================================
 * NOTES:
 * - CREATE INDEX manually index create karta hai.
 * - Frequently queried/filtered columns pe index banao.
 * - Index naam convention: idx_tablename_columnname.
 * - IF NOT EXISTS safe hai — already exist kare toh error nahi.
 */

// -- Basic index
// CREATE INDEX idx_users_username ON users (username);

// -- Index with IF NOT EXISTS
// CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

// -- Drop index
// DROP INDEX idx_users_username;
// DROP INDEX IF EXISTS idx_users_username;


/**
 * ========================================================================
 * 3. MULTI-COLUMN INDEX (COMPOSITE INDEX)
 * ========================================================================
 * NOTES:
 * - Ek index me multiple columns ho sakti hain.
 * - Column ORDER matters! Left-most column pehle hona chahiye query me.
 * - (A, B) index → A alone ke liye bhi kaam karega, but B alone ke liye NAHI.
 * - Use karo jab queries hamesha same columns together filter karti hain.
 */

// -- Composite index on country + population
// CREATE INDEX idx_cities_country_pop ON cities (country, population);

// -- This uses the index: ✅
// SELECT * FROM cities WHERE country = 'India';
// SELECT * FROM cities WHERE country = 'India' AND population > 5000000;

// -- This does NOT use the index efficiently: ❌
// SELECT * FROM cities WHERE population > 5000000;
// -- (population is NOT the leftmost column)


/**
 * ========================================================================
 * 4. UNIQUE INDEX
 * ========================================================================
 * NOTES:
 * - UNIQUE constraint internally ek unique index create karta hai.
 * - Explicitly bhi UNIQUE index bana sakte ho.
 * - Duplicate values insert karne pe error aayega.
 */

// CREATE UNIQUE INDEX idx_users_email_unique ON users (email);

// -- Same as adding UNIQUE constraint:
// ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);


/**
 * ========================================================================
 * 5. EXPLAIN AND EXPLAIN ANALYZE
 * ========================================================================
 * NOTES:
 * - EXPLAIN query execution plan dikhata hai (bina run kiye).
 * - EXPLAIN ANALYZE query ACTUALLY run karke real timing dikhata hai.
 * - Query optimizer kaise plan bana raha hai ye samajhne ke liye use karo.
 * - Production pe EXPLAIN ANALYZE carefully use karo (query actually execute hota hai!).
 *
 * KEY TERMS IN EXPLAIN OUTPUT:
 * ┌────────────────────────┬──────────────────────────────────────────────────┐
 * │ Term                   │ Meaning                                          │
 * ├────────────────────────┼──────────────────────────────────────────────────┤
 * │ Seq Scan               │ Full table scan (no index used)                  │
 * │ Index Scan             │ Index se rows find kar raha hai                  │
 * │ Index Only Scan        │ Sirf index se data aa raha hai (fastest!)        │
 * │ Bitmap Index Scan      │ Multiple index results combine kar raha hai      │
 * │ Hash Join              │ Hash table se join kar raha hai                  │
 * │ Nested Loop            │ Nested iteration (small tables)                  │
 * │ Sort                   │ Sorting operation                                │
 * │ cost=                  │ Estimated cost (arbitrary units)                 │
 * │ rows=                  │ Estimated number of rows                         │
 * │ actual time=           │ Real execution time (ms) [ANALYZE only]          │
 * │ actual rows=           │ Real row count [ANALYZE only]                    │
 * └────────────────────────┴──────────────────────────────────────────────────┘
 */

// -- See the plan without executing
// EXPLAIN SELECT * FROM users WHERE username = 'grider';

// -- See the plan WITH actual execution stats
// EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'grider';

// -- EXAMPLE OUTPUT (simplified):
// -- Index Scan using idx_users_username on users
// --   Index Cond: (username = 'grider')
// --   Planning Time: 0.1 ms
// --   Execution Time: 0.05 ms


/**
 * ========================================================================
 * 6. WHEN TO INDEX [⚡ VISUAL]
 * ========================================================================
 *
 * ┌─────────────────────────────┬─────────────────────────────────────────────────┐
 * │ ✅ INDEX KARO               │ ❌ INDEX MAT KARO                               │
 * ├─────────────────────────────┼─────────────────────────────────────────────────┤
 * │ WHERE clause me frequently  │ Small tables (few hundred rows)                │
 * │ used columns                │ — full scan faster than index overhead          │
 * ├─────────────────────────────┼─────────────────────────────────────────────────┤
 * │ JOIN conditions (FK columns)│ Columns with very LOW selectivity               │
 * │                             │ (e.g. boolean: true/false — 50% match)          │
 * ├─────────────────────────────┼─────────────────────────────────────────────────┤
 * │ ORDER BY columns            │ Tables with heavy INSERT/UPDATE/DELETE          │
 * │                             │ — index maintenance overhead zyada hota hai     │
 * ├─────────────────────────────┼─────────────────────────────────────────────────┤
 * │ High selectivity columns    │ Columns rarely used in WHERE/JOIN/ORDER BY     │
 * │ (unique or near-unique)     │                                                 │
 * └─────────────────────────────┴─────────────────────────────────────────────────┘
 *
 * RULE:
 * - Start WITHOUT indexes. Add them when EXPLAIN ANALYZE shows Seq Scan on large tables.
 * - Measure before and after. Don't blindly index everything.
 */


/**
 * ========================================================================
 * 7. INDEX TYPES IN POSTGRESQL
 * ========================================================================
 *
 * ┌───────────────────┬────────────────────────────────────────────────────────────┐
 * │ Index Type        │ Best For                                                   │
 * ├───────────────────┼────────────────────────────────────────────────────────────┤
 * │ B-Tree (default)  │ Equality (=) and range (<, >, BETWEEN) queries.            │
 * │                   │ Most common. Works with ORDER BY.                          │
 * ├───────────────────┼────────────────────────────────────────────────────────────┤
 * │ Hash              │ Only equality (=) queries. Slightly faster than B-Tree     │
 * │                   │ for pure equality, but can't do range queries.             │
 * ├───────────────────┼────────────────────────────────────────────────────────────┤
 * │ GIN               │ Full-text search, JSONB, array contains (@>),              │
 * │ (Generalized      │ tsvector queries. Handles "contains" type operations.      │
 * │ Inverted Index)   │                                                            │
 * ├───────────────────┼────────────────────────────────────────────────────────────┤
 * │ GiST              │ Geometric data, range types, full-text search,             │
 * │ (Generalized      │ nearest-neighbor queries. Used for exclusion constraints.  │
 * │ Search Tree)      │                                                            │
 * ├───────────────────┼────────────────────────────────────────────────────────────┤
 * │ BRIN               │ Very large tables where data is physically sorted          │
 * │ (Block Range Index)│ (e.g. timestamp columns in append-only tables).           │
 * │                   │ Extremely small index size.                                │
 * └───────────────────┴────────────────────────────────────────────────────────────┘
 */

// -- Hash index
// CREATE INDEX idx_users_email_hash ON users USING HASH (email);

// -- GIN index for JSONB
// CREATE INDEX idx_posts_metadata ON posts USING GIN (metadata);

// -- GiST index for geometric data
// CREATE INDEX idx_locations_point ON locations USING GIST (coordinates);

// -- BRIN index for large time-series data
// CREATE INDEX idx_logs_created ON logs USING BRIN (created_at);


/**
 * ========================================================================
 * 8. PARTIAL INDEX
 * ========================================================================
 * NOTES:
 * - Partial index = sirf kuch rows pe index (WHERE condition ke saath).
 * - Smaller index size → faster maintenance, less disk space.
 * - Use karo jab ek specific subset frequently query hota hai.
 */

// -- Index only on active users (not all users)
// CREATE INDEX idx_active_users ON users (username) WHERE is_active = TRUE;

// -- Index only on recent orders
// CREATE INDEX idx_recent_orders ON orders (created_at)
// WHERE created_at > '2024-01-01';

// -- This query uses the partial index: ✅
// SELECT * FROM users WHERE username = 'grider' AND is_active = TRUE;


/**
 * ========================================================================
 * 9. EXPRESSION INDEX (FUNCTIONAL INDEX)
 * ========================================================================
 * NOTES:
 * - Expression ya function ke result pe index bana sakte ho.
 * - Useful jab query me function apply hota hai (LOWER, UPPER, etc.).
 * - Bina expression index ke, LOWER(email) pe query full scan karega.
 */

// -- Index on lowercased email (case-insensitive search fast)
// CREATE INDEX idx_users_email_lower ON users (LOWER(email));

// -- This uses the expression index: ✅
// SELECT * FROM users WHERE LOWER(email) = 'grider@example.com';

// -- This does NOT use it: ❌
// SELECT * FROM users WHERE email = 'grider@example.com';
// -- (original column, not the expression)


/**
 * ========================================================================
 * 10. INDEX ONLY SCAN (COVERING INDEX)
 * ========================================================================
 * NOTES:
 * - Agar query me jo columns chahiye woh SAB index me hain →
 *   DB ko table (heap) pe jaane ki zarurat nahi — sirf index se answer de sakta hai.
 * - Fastest possible scan type.
 * - INCLUDE clause se extra columns index me add kar sakte ho without affecting sort order.
 */

// -- Covering index: both queried and selected columns are in the index
// CREATE INDEX idx_users_covering ON users (username) INCLUDE (email);

// -- This can do Index Only Scan: ✅
// SELECT username, email FROM users WHERE username = 'grider';


/**
 * ========================================================================
 * 11. INDEX OVERHEAD
 * ========================================================================
 * NOTES:
 * - Har index disk space leta hai.
 * - INSERT/UPDATE/DELETE pe index bhi update hota hai → write slower.
 * - Too many indexes → write performance degrade.
 * - Unused indexes identify aur drop karo.
 *
 * CHECK UNUSED INDEXES:
 */

// SELECT indexrelname, idx_scan
// FROM pg_stat_user_indexes
// WHERE idx_scan = 0
// ORDER BY pg_relation_size(indexrelid) DESC;
// -- idx_scan = 0 means index was NEVER used → candidate for dropping


/**
 * ========================================================================
 * 12. INDEX AND PERFORMANCE RULES
 * ========================================================================
 * - PK aur UNIQUE columns pe index AUTO banta hai — manually mat banao.
 * - FK columns pe index manually banao (JOIN performance).
 * - EXPLAIN ANALYZE se pehle measure karo, phir index decide karo.
 * - Small tables me index overhead > benefit. Skip karo.
 * - Partial index use karo agar sirf subset query hota hai.
 * - Expression index banao agar query me function apply hota hai.
 * - Composite index me column order matters — leftmost column pehle.
 * - Unused indexes periodically identify aur drop karo.
 * - VACUUM and ANALYZE regularly run karo — optimizer ko stats chahiye.
 */

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
