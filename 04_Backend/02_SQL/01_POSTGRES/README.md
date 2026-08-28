# PostgreSQL Short Notes

Stephen Grider's SQL and PostgreSQL: The Complete Developer's Guide — short notes.

These files follow the same style as the MongoDB/Jonas notes in this repo:
short Hinglish explanations, important rules, and compact SQL examples inside JS comment blocks.

## Suggested Reading Order

1. `01_SQL_BASICS/SQL_Fundamentals.js`
2. `02_FILTERING_SORTING/Filtering_Sorting_Operators.js`
3. `03_RELATIONSHIPS_JOINS/Relationships_Joins.js`
4. `04_AGGREGATION_GROUPING/Aggregation_Grouping.js`
5. `05_SUBQUERIES/Subqueries.js`
6. `06_DATABASE_DESIGN/Database_Design_Schema.js`
7. `07_VALIDATION_CONSTRAINTS/Validation_Constraints.js`
8. `08_INDEXES_PERFORMANCE/Indexes_Performance.js`
9. `09_VIEWS_TRANSACTIONS/Views_Transactions_CTE.js`
10. `10_SECURITY_ROLES/Security_Roles_Permissions.js`
11. `11_NODE_INTEGRATION/Express_PG_Repository.js`
12. `12_MIGRATIONS_TESTING/Migrations_Parallel_Testing.js`
13. `13_DATABASE_INTERNALS/Database_Internals.js`

## Main Coverage

- SQL basics, CRUD, data types, PostgreSQL setup (pgAdmin, psql)
- Filtering, sorting, comparison operators, NULL handling
- Primary/foreign keys, relationships, all JOIN types, ON DELETE
- Aggregate functions, GROUP BY, HAVING
- Scalar/correlated subqueries, EXISTS, ANY/ALL, LATERAL JOIN
- Normalization (1NF–3NF), schema design, ALTER TABLE, polymorphic associations
- Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT, multi-column
- Indexes (B-Tree, GIN, partial), EXPLAIN ANALYZE, query performance
- Views, materialized views, CTEs, recursive CTEs, transactions, isolation levels
- Roles, GRANT/REVOKE, row-level security, SQL injection prevention
- Node.js API integration (pg pool), Parameterized Queries, Repository Pattern
- Schema migrations (node-pg-migrate) and fast parallel testing strategies
- Database Internals (Heap files, 8KB Pages, Tuples, CTID, Buffer Pool, MVCC)
