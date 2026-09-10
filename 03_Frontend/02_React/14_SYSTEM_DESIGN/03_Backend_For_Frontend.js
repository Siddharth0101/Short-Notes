'use strict';

/**
 * ========================================================================
 * BACKEND SYSTEM DESIGN FOR FRONTEND ENGINEERS [⚡ VISUAL]
 * ========================================================================
 * SOURCE: Chirag Goel - Chakde System Design
 *
 * Ye concepts har frontend engineer ko pata hone chahiye
 * for system design interviews.
 */


/**
 * ========================================================================
 * 1. DATABASES — SQL vs NoSQL
 * ========================================================================
 *
 * SQL (Relational):
 * - Tables with rows & columns. Strict schema. Relationships via JOINs.
 * - ACID: Atomicity, Consistency, Isolation, Durability.
 * - Examples: PostgreSQL, MySQL, SQLite.
 * - Use when: Fixed schema, complex joins, transactions (banking, e-commerce).
 *
 * NoSQL (Document Store):
 * - Flexible schema. JSON-like documents. Nested data.
 * - BASE: Basically Available, Soft state, Eventual consistency.
 * - Examples: MongoDB, DynamoDB, Firestore.
 * - Use when: Flexible schema, rapid iteration, huge scale (social media, IoT).
 *
 * ┌───────────────┬───────────────────┬───────────────────────┐
 * │ Factor        │ SQL               │ NoSQL                 │
 * ├───────────────┼───────────────────┼───────────────────────┤
 * │ Schema        │ Fixed, strict     │ Flexible, dynamic     │
 * │ Relationships │ JOINs (complex)   │ Embedded/denormalized │
 * │ Consistency   │ Strong (ACID)     │ Eventual (BASE)       │
 * │ Scaling       │ Vertical (bigger) │ Horizontal (more)     │
 * │ Query         │ SQL language      │ API-specific          │
 * │ Best for      │ Banking, ERP      │ Social, gaming, IoT   │
 * └───────────────┴───────────────────┴───────────────────────┘
 *
 *
 * CAP THEOREM (Distributed Systems):
 * - You can only guarantee 2 out of 3:
 *   C (Consistency): Every read gets most recent write
 *   A (Availability): Every request gets a response
 *   P (Partition Tolerance): System works despite network failures
 *
 * - P is MANDATORY in distributed systems (networks fail).
 * - Choose: CP (consistent but may be unavailable) — MongoDB, Redis
 *           AP (available but may be stale) — Cassandra, DynamoDB
 */


/**
 * ========================================================================
 * 2. CACHING
 * ========================================================================
 *
 * CACHE LEVELS:
 * ┌─────────────────┬─────────────────────────────────────────┐
 * │ Level           │ What                                    │
 * ├─────────────────┼─────────────────────────────────────────┤
 * │ Browser Cache   │ HTTP headers (Cache-Control, ETag)      │
 * │ CDN Cache       │ Edge servers globally (CloudFront)      │
 * │ App Cache       │ In-memory (Redis, Memcached)            │
 * │ DB Cache        │ Query result cache                      │
 * └─────────────────┴─────────────────────────────────────────┘
 *
 * CACHE STRATEGIES:
 *
 * 1. CACHE-ASIDE (Most Common):
 *    App checks cache → Miss → Read DB → Write to cache → Return
 *    const data = await cache.get(key);
 *    if (!data) { data = await db.query(key); await cache.set(key, data, 60); }
 *
 * 2. WRITE-THROUGH:
 *    App writes to cache → Cache writes to DB → Return
 *    (Slower writes, but cache always consistent)
 *
 * 3. WRITE-BEHIND:
 *    App writes to cache → Return immediately → Cache writes to DB later (async)
 *    (Fast writes, risk of data loss if cache crashes)
 *
 * CACHE INVALIDATION (Hardest Problem):
 * - TTL (Time to Live): auto-expire after N seconds
 * - Event-based: invalidate on data change event
 * - Versioned keys: user:v2:123 → increment version on change
 *
 * REDIS:
 * - In-memory data store. Used for caching, sessions, rate limiting, pub/sub.
 * - SET key value EX 3600 → set with 1 hour TTL
 * - GET key → get value
 * - INCR rate:user:123 → rate limiting counter
 */


/**
 * ========================================================================
 * 3. LOAD BALANCING
 * ========================================================================
 *
 * Without:  All traffic → 1 server → crash 💀
 * With:     Traffic → Load Balancer → distributes to N servers
 *
 *            ┌──────────────┐
 *            │ Load Balancer│
 *            └──────┬───────┘
 *         ┌─────────┼─────────┐
 *         ▼         ▼         ▼
 *    Server 1   Server 2   Server 3   (~33% each)
 *
 * ALGORITHMS:
 * - Round Robin: 1→2→3→1→2→3 (equal distribution)
 * - Least Connections: send to server with fewest active connections
 * - IP Hash: same user IP → same server (session affinity)
 * - Weighted: server with more resources gets more traffic
 *
 * Tools: Nginx, HAProxy, AWS ALB
 */


/**
 * ========================================================================
 * 4. MESSAGE QUEUES
 * ========================================================================
 *
 * Without queue (synchronous):
 * User uploads image → resize → compress → upload CDN → "Done!" (30 sec wait 😡)
 *
 * With queue (asynchronous):
 * User uploads image → put job in queue → "Upload successful!" (instant ✅)
 * Queue → Worker resize → compress → upload CDN (background, user doesn't wait)
 *
 * POPULAR:
 * - Kafka: high throughput event streaming (Netflix, LinkedIn)
 * - RabbitMQ: traditional message broker with routing
 * - AWS SQS: managed queue service
 * - Redis Pub/Sub: lightweight, in-memory
 *
 * USE CASES:
 * - Email/SMS notifications
 * - Image/video processing
 * - Analytics event ingestion
 * - Order processing
 * - Microservice communication
 */


/**
 * ========================================================================
 * 5. SCALABILITY
 * ========================================================================
 *
 * VERTICAL (Scale UP):
 * ┌──────────┐  →  ┌────────────────┐
 * │ 4 CPU    │     │ 32 CPU         │
 * │ 8 GB RAM │     │ 128 GB RAM     │
 * └──────────┘     └────────────────┘
 * Bigger machine. Has a ceiling. Expensive.
 *
 * HORIZONTAL (Scale OUT):
 * ┌──────────┐  →  ┌────┐ ┌────┐ ┌────┐ ┌────┐
 * │ 1 Server │     │ S1 │ │ S2 │ │ S3 │ │ S4 │
 * └──────────┘     └────┘ └────┘ └────┘ └────┘
 * More machines. Unlimited scale. Needs stateless design.
 *
 *
 * DATABASE SHARDING:
 * - Split data across multiple databases.
 * - User 1-25M → Shard 1 | User 25M-50M → Shard 2 | etc.
 * - Each shard handles only a fraction of queries.
 *
 *
 * RATE LIMITING:
 * - Protect APIs from abuse.
 * - 100 requests per minute per user.
 * - Exceeded? → 429 Too Many Requests.
 * - Implementation: Redis counter with TTL.
 */

function checkRateLimit(userId) {
    const now = Date.now();
    const windowMs = 60 * 1000;  // 1 minute window
    const maxRequests = 100;

    // In production, use Redis:
    // INCR rate:{userId}
    // EXPIRE rate:{userId} 60

    // Simplified in-memory version:
    // if (!rateLimiter.has(userId)) { rateLimiter.set(userId, { count: 1, start: now }); return true; }
    // const entry = rateLimiter.get(userId);
    // if (now - entry.start > windowMs) { reset; return true; }
    // if (entry.count >= maxRequests) { return false; } // 429!
    // entry.count++; return true;
}


/**
 * ========================================================================
 * 6. INTERVIEW CHEATSHEET
 * ========================================================================
 *
 * SYSTEM DESIGN (HLD) QUESTIONS:
 * ┌────┬──────────────────────┬─────────────────────────────────────┐
 * │ #  │ Problem              │ Key Focus                           │
 * ├────┼──────────────────────┼─────────────────────────────────────┤
 * │ 1  │ Design Netflix       │ Video streaming, ABR, CDN, lazy load│
 * │ 2  │ Design WhatsApp      │ WebSocket, E2E encryption, offline  │
 * │ 3  │ Design Google Search │ Autocomplete, caching, CDN          │
 * │ 4  │ Design Twitter Feed  │ Infinite scroll, real-time, fan-out │
 * │ 5  │ Design Google Docs   │ CRDT/OT, collaboration, conflicts   │
 * │ 6  │ Design Figma         │ Canvas, collaboration, undo/redo    │
 * │ 7  │ Design Amazon        │ Product list, cart, checkout         │
 * │ 8  │ Design Gmail         │ Threading, search, offline, push    │
 * │ 9  │ Design Uber/Maps     │ Geolocation, real-time tracking     │
 * │ 10 │ Design Instagram     │ Image optimization, stories, scroll │
 * └────┴──────────────────────┴─────────────────────────────────────┘
 *
 * MACHINE CODING (LLD) QUESTIONS:
 * ┌────┬──────────────────────┬─────────────────────────────────────┐
 * │ #  │ Problem              │ Key Concepts                        │
 * ├────┼──────────────────────┼─────────────────────────────────────┤
 * │ 1  │ Autocomplete         │ Debounce, cache, keyboard nav       │
 * │ 2  │ Infinite Scroll      │ Intersection Observer, pagination   │
 * │ 3  │ Kanban Board         │ Drag & Drop, state management       │
 * │ 4  │ Star Rating          │ Controlled component, hover state   │
 * │ 5  │ Modal / Dialog       │ Portal, focus trap, a11y            │
 * │ 6  │ Accordion            │ Compound components, animation      │
 * │ 7  │ Multi-Select         │ Checkbox, search, keyboard          │
 * │ 8  │ Carousel             │ Auto-play, swipe, lazy load         │
 * │ 9  │ File Explorer        │ Recursion, expand/collapse          │
 * │ 10 │ Form Builder         │ Dynamic rendering, validation       │
 * │ 11 │ Tic-Tac-Toe          │ State machine, win detection        │
 * │ 12 │ Toast Notifications  │ Portal, auto-dismiss, queue         │
 * │ 13 │ Pagination           │ Page calc, URL sync                 │
 * │ 14 │ Image Gallery        │ Grid, lightbox, keyboard nav        │
 * │ 15 │ Stopwatch/Timer      │ setInterval, cleanup, useEffect     │
 * └────┴──────────────────────┴─────────────────────────────────────┘
 */
