# External notes comparison — 28 September 2026

- Scope — 108 existing chapters ka inventory recheck; 26 selected public references se useful missing topics compare kiye.
- Result — 20 chapters mein 94 new Hinglish points; main revision total 1,845.
- Style — har new point 28 words ya kam; small topic groups, source links chapter ke end mein.
- Authors — Yangshun Tay ka Tech Interview Handbook, Donne Martin ka System Design Primer aur Ilya Kantor ka javascript.info.
- Verification — API details React, Oracle, Spring, Node, MongoDB, PostgreSQL, MDN aur OWASP docs se; math ke liye CP-Algorithms bhi.
- Selection — revision-useful missing concepts include kiye; external courses ka full mirror ya har possible interview topic ka claim nahi.
- Existing coverage — basic arrays/graphs/DP, closures, React state, Java OOP, REST, JPA, indexes aur reliability notes pehle se present.
- References — neeche exact source-to-chapter mapping; notes original Hinglish summaries hain, copied articles nahi.

| Chapter | Added topics | Points | Reference |
| --- | --- | ---: | --- |
| [Complexity and problem solving](dsa/01-complexity-and-problem-solving.md) | Math shortcuts | 7 | [Yangshun Tay — math cheatsheet](https://www.techinterviewhandbook.org/algorithms/math/), [CP-Algorithms — Euclidean algorithm](https://cp-algorithms.com/algebra/euclid-algorithm.html), [CP-Algorithms — prime sieve](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html) |
| [Frequency counters and pointer patterns](dsa/04-problem-solving-patterns.md) | Matrix patterns | 5 | [Yangshun Tay — matrix cheatsheet](https://www.techinterviewhandbook.org/algorithms/matrix/) |
| [Tries, bitmasks aur range queries — advanced structures ka practical bridge](dsa/14-tries-range-bits.md) | Bit tricks | 3 | [Yangshun Tay — binary cheatsheet](https://www.techinterviewhandbook.org/algorithms/binary/) |
| [React and Java system design interview playbook](interview/06-system-design-playbook.md) | Project aur behavioral answers | 4 | [Yangshun Tay — behavioral preparation](https://www.techinterviewhandbook.org/behavioral-interview/) |
| [Collections generics and choosing data structures](java/08-collections-generics.md) | Concurrent collections | 3 | [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html) |
| [JDBC SQL and transaction boundaries](java/13-jdbc-sql.md) | PostgreSQL isolation | 5 | [PostgreSQL — transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html) |
| [Concurrency synchronization and virtual threads](java/15-concurrency.md) | Explicit locks | 4 | [Oracle — ReentrantLock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html) |
| [Java concurrency under real resource limits](java/16-concurrency-production.md) | Task coordination | 5 | [Oracle — concurrent utilities](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html) |
| [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md) | Weak collections; Iteration protocol | 7 | [javascript.info — WeakMap/WeakSet](https://javascript.info/weakmap-weakset), [javascript.info — iterables](https://javascript.info/iterable) |
| [This binding prototypes and classes](javascript/13-this-prototypes-classes.md) | Proxy aur Reflect | 4 | [javascript.info — Proxy/Reflect](https://javascript.info/proxy) |
| [Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md) | Async context aur stream limits | 4 | [Node — AsyncLocalStorage](https://nodejs.org/api/async_context.html), [Node — stream buffering](https://nodejs.org/api/stream.html) |
| [Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md) | Read guarantees; Array indexes | 8 | [MongoDB — isolation and consistency](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/), [MongoDB — read preference](https://www.mongodb.com/docs/manual/core/read-preference/), [MongoDB — multikey indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/) |
| [Authentication authorization and secure boundaries](mongodb/07-auth-security.md) | Server-side URL safety | 4 | [OWASP — SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) |
| [State snapshots forms and immutable updates](react/02-state-forms.md) | React 19 form Actions | 5 | [React — useActionState](https://react.dev/reference/react/useActionState), [React — useOptimistic](https://react.dev/reference/react/useOptimistic) |
| [Composition reusable patterns and styling](react/04-composition-styling.md) | Container-based responsiveness | 3 | [MDN — container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) |
| [Effects refs and reusable synchronization](react/05-effects-custom-hooks.md) | Effect Events | 3 | [React — useEffectEvent](https://react.dev/reference/react/useEffectEvent) |
| [JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md) | Propagation modes | 5 | [Spring — propagation source](https://github.com/spring-projects/spring-framework/blob/main/framework-docs/modules/ROOT/pages/data-access/transaction/declarative/tx-propagation.adoc) |
| [Scaling caching replication and partitioning](system-design/02-scaling-caching.md) | Cache write policies; Traffic aur failover | 6 | [Donne Martin — System Design Primer](https://github.com/donnemartin/system-design-primer) |
| [React architecture rendering and delivery](system-design/03-react-architecture.md) | Server Components | 4 | [React — Server Components](https://react.dev/reference/rsc/server-components) |
| [Frontend performance accessibility and resilience](system-design/05-frontend-performance.md) | HTTP cache directives | 5 | [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) |

## Whole-repo verification

- `node scripts/check-revision.mjs` — 108 chapters, 142 mapped source files, 444 interview answers aur short-note rules.
- `npm run check --prefix playground` — revision, generated curriculum/interviews, app tests, lint aur production build.
- Prior notes — comparison ke pehle wale 1,751 bullets retained; chapter IDs/order/routes stable.
- Reading time — changed chapters ke revision text ke hisaab se minutes refresh kiye.
