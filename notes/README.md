# Revision syllabus — subject chuno

Har subject easy foundation se advanced concepts tak jaata hai. Lesson 01 se number order follow karo; stage checkpoint khud complete karke aage badho. App, filenames aur index ka order same hai. Numbered source folders related examples/reference hain.

**Apna route chuno:** JavaScript → React → frontend system design; Java → Spring → backend system design. JS functions/arrays ke baad DSA start karo. Async/modules ke baad Node/MongoDB. Related subject padhkar interview playbook karo.

Instructor context aur lecture mapping ki limits [course coverage](COURSE_COVERAGE.md) mein padho.

Har chapter mein short Hinglish one-liners hain; code examples optional link par hain. Revision routine ke liye [study guide](STUDY_GUIDE.md) padho.

## JavaScript

[Is course ka syllabus kholo](javascript/README.md)

Pehle programming course ki zaroorat nahi. Lesson 01 se start karo.

### Stage 1: Language ki shuruaat

Variables se start karke ek waqt ek chhota concept samjho.

1. [Variables and assignment with let and const](javascript/01-js-variables.md)
2. [Value types operators and explicit conversion](javascript/02-js-types-operators.md)
3. [Decisions with if else and boolean logic](javascript/03-js-conditionals.md)
4. [Loops counters and accumulators](javascript/04-js-loops.md)
5. [Functions parameters arguments and return values](javascript/05-js-functions.md)
6. [Arrays objects and simple data modeling](javascript/06-js-arrays-objects.md)

**Stage checkpoint — khud karke dikhao:** Function, loop aur condition se lessons array ke total study minutes nikalo.

### Stage 2: Data aur scope samjho

Collections transform, input validate aur bindings/built-in utilities samjho.

7. [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md)
8. [Foundations checkpoint and reliable input handling](javascript/08-language-foundations.md)
9. [Execution contexts scope and closures](javascript/09-scope-closures.md)
10. [Numbers dates strings and regular expressions](javascript/10-numbers-dates-regex.md)

**Stage checkpoint — khud karke dikhao:** Closure explain karo aur accidental string concatenation ke bina validated calculation banao.

### Stage 3: Browser mein interactions banao

DOM manipulate karne se pehle HTML/CSS structure seekho.

11. [HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)
12. [DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Stage checkpoint — khud karke dikhao:** Keyboard-accessible list banao jiske actions delegation se handle hon.

### Stage 4: Objects aur design samjho

OOP project se pehle this receiver aur prototypes samjho.

13. [This binding prototypes and classes](javascript/13-this-prototypes-classes.md)
14. [OOP pillars and a banking mini-project](javascript/14-oop-and-mini-project.md)

**Stage checkpoint — khud karke dikhao:** Three call sites ka this explain karke small state-machine project implement karo.

### Stage 5: Async work aur delivery sambhalo

Promises/fetch se concurrency limits aur modules tak badho.

15. [Event loop promises and resilient fetching](javascript/15-async-event-loop.md)
16. [Async patterns and bounded concurrency](javascript/16-async-patterns.md)
17. [Modules web delivery and debugging](javascript/17-modules-tooling-debugging.md)

**Stage checkpoint — khud karke dikhao:** Failed request handle, active work cap aur browser tak app delivery explain karo.

### Stage 6: Code ka behavior verify karo

Modules aur async knowledge ko repeatable tests aur debugging workflow se verify karo.

18. [Testing aur debugging — bug ko repeatable proof banao](javascript/18-testing-workflow.md)

**Stage checkpoint — khud karke dikhao:** Boundary tests aur controlled async failure case run karke regression explain karo.

### Stage 7: Persistence aur collaboration samjho

Local data lifecycle, offline conflicts aur reviewed Git changes practice karo.

19. [Browser persistence aur offline behavior — save ka meaning clear karo](javascript/19-browser-persistence.md)
20. [Git workflow — working tree se reviewed commit tak](javascript/20-git-workflow.md)

**Stage checkpoint — khud karke dikhao:** Two-tab conflict policy aur staged/unstaged diff ka exact meaning explain karo.

## React

[Is course ka syllabus kholo](react/README.md)

Shuru karne se pehle: [Functions parameters arguments and return values](javascript/05-js-functions.md) · [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md) · [DOM events and browser interaction](javascript/12-dom-events-browser.md) · [Event loop promises and resilient fetching](javascript/15-async-event-loop.md).

### Stage 1: Pehle components samjho

JSX/props se start, phir state, rendering aur identity seekho.

1. [First React component JSX and props](react/01-react-jsx-props.md)
2. [State snapshots forms and immutable updates](react/02-state-forms.md)
3. [Components JSX and the render cycle](react/03-components-rendering.md)

**Stage checkpoint — khud karke dikhao:** Editable list mein drafts correct items ke saath attached rakho.

### Stage 2: UI reuse aur safe synchronization

Composition ke baad effects, refs aur custom hooks seekho.

4. [Composition reusable patterns and styling](react/04-composition-styling.md)
5. [Effects refs and reusable synchronization](react/05-effects-custom-hooks.md)

**Stage checkpoint — khud karke dikhao:** Reusable component extract karo aur cancellable effect cleanup karo.

### Stage 3: Complete application jodo

Navigation, shared state, server cache aur typed boundaries add karo.

6. [Routing nested layouts and URL state](react/06-routing-url-state.md)
7. [Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)
8. [Server state caching and Supabase integration](react/08-query-supabase.md)
9. [TypeScript contracts for React applications](react/09-typescript-contracts.md)

**Stage checkpoint — khud karke dikhao:** Clear cache identity aur validated API data wali routed page banao.

### Stage 4: Measure karke practice karo

Machine coding se pehle production behavior profile karo.

10. [Performance suspense and production quality](react/10-performance-production.md)
11. [React machine coding and identity bugs](react/11-machine-coding.md)

**Stage checkpoint — khud karke dikhao:** Stale-request protection, keyboard behavior aur ek measured improvement dikhao.

### Stage 5: User journey test karo

Forms, async screens aur accessibility ke observable contracts check karo.

12. [React testing — user behavior aur accessibility verify karo](react/12-testing-accessibility.md)

**Stage checkpoint — khud karke dikhao:** Accessible queries se form test likho aur browser-only checks separately identify karo.

## Java

[Is course ka syllabus kholo](java/README.md)

Pehle programming course ki zaroorat nahi. Lesson 01 se start karo.

### Stage 1: Pehla Java program likho

main run, variables declare, decisions, methods aur instances banao.

1. [First Java program variables and primitive types](java/01-java-first-program.md)
2. [Java operators decisions and loops](java/02-java-decisions-loops.md)
3. [Java methods arrays and strings](java/03-java-methods-arrays.md)
4. [Classes objects constructors and encapsulation](java/04-java-classes-constructors.md)
5. [Java foundations review and conversion edge cases](java/05-language-foundations.md)

**Stage checkpoint — khud karke dikhao:** Two independent objects aur array-processing method wala learner program compile karo.

### Stage 2: Reliable core model banao

Basic classes par OOP, collections, exceptions, streams aur memory reasoning build karo.

6. [Packages access control and interface boundaries](java/06-packages-interfaces.md)
7. [Objects OOP records and equality](java/07-object-model.md)
8. [Collections generics and choosing data structures](java/08-collections-generics.md)
9. [Exceptions resources files and time](java/09-exceptions-io-time.md)
10. [Lambdas streams and Optional](java/10-streams-lambdas.md)
11. [JVM memory garbage collection and diagnosis](java/11-jvm-memory.md)

**Stage checkpoint — khud karke dikhao:** Suitable collection choose, equality contract preserve aur owned resource close karo.

### Stage 3: Build, test aur data save karo

Database/SQL concurrency se pehle builds aur tests setup karo.

12. [Maven builds and useful Java tests](java/12-maven-testing.md)
13. [JDBC SQL and transaction boundaries](java/13-jdbc-sql.md)
14. [SQL joins windows and transaction races](java/14-sql-interview-lab.md)

**Stage checkpoint — khud karke dikhao:** JDBC operation test karo; join aur atomic inventory update explain karo.

### Stage 4: Concurrency aur resource limits samjho

Thread safety, virtual threads aur bounded resources seekho.

15. [Concurrency synchronization and virtual threads](java/15-concurrency.md)
16. [Java concurrency under real resource limits](java/16-concurrency-production.md)

**Stage checkpoint — khud karke dikhao:** Race-safe operation dikhao aur backpressure ki need explain karo.

### Stage 5: Types, schema aur object design evolve karo

Finite variants, metadata, compatible migrations aur invariant-based low-level design practice karo.

17. [Java type modeling — enums, sealed types aur annotations](java/17-type-metadata.md)
18. [SQL schema design aur safe migrations — data ka contract evolve karo](java/18-schema-migrations.md)
19. [Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Stage checkpoint — khud karke dikhao:** Immutable model, safe migration aur concurrent loan claim ka contract verify karo.

## Spring Boot

[Is course ka syllabus kholo](spring-boot/README.md)

Shuru karne se pehle: [Maven builds and useful Java tests](java/12-maven-testing.md) · [JDBC SQL and transaction boundaries](java/13-jdbc-sql.md) · [Java concurrency under real resource limits](java/16-concurrency-production.md).

### Stage 1: Application start aur configure karo

Boot startup, bean wiring aur typed config samjho.

1. [Spring Boot first application and project structure](spring-boot/01-first-application.md)
2. [Beans constructor injection and lifecycle](spring-boot/02-beans-di.md)
3. [Configuration properties profiles and startup failures](spring-boot/03-configuration.md)

**Stage checkpoint — khud karke dikhao:** App start karke missing bean/invalid setting diagnose karo.

### Stage 2: Clear HTTP boundary banao

DTOs, validation aur controlled errors ke saath REST endpoints banao.

4. [Spring dependency injection and REST APIs](spring-boot/04-spring-rest.md)
5. [Request DTOs validation and consistent API errors](spring-boot/05-validation-errors.md)

**Stage checkpoint — khud karke dikhao:** Successful creation aur rejected input ke documented responses dikhao.

### Stage 3: Business operations save aur secure karo

Transactions, persistence aur authorization boundaries apply karo.

6. [JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)
7. [Spring Security and reliable service boundaries](spring-boot/07-security-microservices.md)

**Stage checkpoint — khud karke dikhao:** Concurrent requests mein invariant bache aur unauthorized access reject ho, prove karo.

### Stage 4: Service verify aur operate karo

Boundaries test, telemetry inspect aur deployment capstone complete karo.

8. [Spring Boot unit slice and integration testing](spring-boot/08-testing.md)
9. [Observability with Actuator, metrics and tracing](spring-boot/09-observability-actuator.md)
10. [Package deploy and defend a Spring Boot capstone](spring-boot/10-deployment-capstone.md)

**Stage checkpoint — khud karke dikhao:** API acceptance cases run karke failed-deployment recovery defend karo.

### Stage 5: Background work aur cache operate karo

Proxy boundaries, scheduled jobs aur cache identity ko failure scenarios se connect karo.

11. [Spring background jobs aur caching — lifecycle aur ownership samjho](spring-boot/11-spring-background-cache.md)

**Stage checkpoint — khud karke dikhao:** Duplicate job aur stale cache recovery ka measurable contract do.

### Stage 6: Web runtime ko neeche tak trace karo

Servlet concurrency, forwarding aur view rendering ko Spring MVC se connect karo.

12. [Servlets, JSP aur Spring MVC — request ka underlying runtime](spring-boot/12-servlet-mvc.md)

**Stage checkpoint — khud karke dikhao:** Shared request-field race aur redirect attribute loss diagnose karo.

### Stage 7: Optional AI retrieval extension

Authorized retrieval, evidence quality aur model integration ki limits samjho.

13. [Spring AI aur RAG — retrieval, permissions aur answer evaluation](spring-boot/13-ai-retrieval.md)

**Stage checkpoint — khud karke dikhao:** Known, unsupported aur unauthorized questions ka evaluation contract do.

## Node & MongoDB

[Is course ka syllabus kholo](mongodb/README.md)

Shuru karne se pehle: [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md) · [Event loop promises and resilient fetching](javascript/15-async-event-loop.md) · [Modules web delivery and debugging](javascript/17-modules-tooling-debugging.md).

### Stage 1: Server request samjho

Node/HTTP ke baad Express routing aur errors seekho.

1. [Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)
2. [Express REST APIs middleware and errors](mongodb/02-express-rest-errors.md)

**Stage checkpoint — khud karke dikhao:** Request ko middleware se controlled response tak trace karo.

### Stage 2: Data ka model banao

Mongoose schema se pehle documents aur CRUD samjho.

3. [Documents CRUD and access-driven modeling](mongodb/03-documents-crud-modeling.md)
4. [Mongoose schemas validation and relationships](mongodb/04-mongoose-validation-relations.md)

**Stage checkpoint — khud karke dikhao:** Actual read pattern se embedding/references choose aur writes validate karo.

### Stage 3: Efficient queries likho

Indexes/aggregation ke baad plans aur bounded streaming inspect karo.

5. [Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)
6. [MongoDB query plans and Node streaming lab](mongodb/06-query-production-lab.md)

**Stage checkpoint — khud karke dikhao:** Tenant query ka winning plan explain aur large export stream karo.

### Stage 4: Secure karke deploy karo

Payments/uploads/deployment se pehle authentication/authorization add karo.

7. [Authentication authorization and secure boundaries](mongodb/07-auth-security.md)
8. [SSR uploads payments email and deployment](mongodb/08-production-integrations.md)

**Stage checkpoint — khud karke dikhao:** Unauthorized access reject aur duplicate webhook se safely recover karo.

### Stage 5: API lifecycle verify karo

Real HTTP testing, database isolation aur bounded shutdown practice karo.

9. [Node API testing aur graceful shutdown — request se resource cleanup tak](mongodb/09-testing-shutdown.md)

**Stage checkpoint — khud karke dikhao:** Parallel-safe request test aur in-flight shutdown acceptance cases run karo.

## Data structures & algorithms

[Is course ka syllabus kholo](dsa/README.md)

Shuru karne se pehle: [Functions parameters arguments and return values](javascript/05-js-functions.md) · [Arrays objects and simple data modeling](javascript/06-js-arrays-objects.md).

### Stage 1: Cost aur basic structures samjho

Patterns se pehle complexity, lists/stacks/queues aur hashing seekho.

1. [Complexity and problem solving](dsa/01-complexity-and-problem-solving.md)
2. [Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)
3. [Hash tables maps and sets](dsa/03-hash-tables-and-sets.md)

**Stage checkpoint — khud karke dikhao:** Array, queue ya map choose karke operation cost justify karo.

### Stage 2: Reusable problem-solving patterns seekho

Counters/pointers/search ke baad recursion aur sorting padho.

4. [Frequency counters and pointer patterns](dsa/04-problem-solving-patterns.md)
5. [Searching and binary search boundaries](dsa/05-searching-and-binary-search.md)
6. [Recursion and backtracking](dsa/06-recursion-and-backtracking.md)
7. [Sorting from elementary methods to divide and conquer](dsa/07-sorting-algorithms.md)

**Stage checkpoint — khud karke dikhao:** Code se pehle binary-search invariant aur recursive call trace karo.

### Stage 3: Ordered candidates aur hierarchy samjho

Stack invariant apply, phir trees/heaps, uske baad graphs seekho.

8. [Monotonic stacks and amortized reasoning](dsa/08-monotonic-stack-lab.md)
9. [Trees and binary search trees](dsa/09-trees-and-binary-search-trees.md)
10. [Heaps and priority queues](dsa/10-heaps-and-priority-queues.md)

**Stage checkpoint — khud karke dikhao:** Stack ka complexity bound prove aur heap-based top-k implement karo.

### Stage 4: Graphs aur DP solve karo

Queues, recursion, hashing/heaps se dependencies aur repeated subproblems samjho.

11. [Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)
12. [Dynamic programming from state to recurrence](dsa/12-dynamic-programming.md)

**Stage checkpoint — khud karke dikhao:** BFS/Dijkstra choose karo, phir DP state/recurrence derive karo.

### Stage 5: Advanced choices ko prove karo

Greedy/interval proofs aur trie, bitmask, range-query structures seekho.

13. [Greedy aur intervals — choice ka proof aur boundary ka contract](dsa/13-greedy-intervals.md)
14. [Tries, bitmasks aur range queries — advanced structures ka practical bridge](dsa/14-tries-range-bits.md)

**Stage checkpoint — khud karke dikhao:** Greedy ko brute-force oracle se compare karo aur Fenwick update trace karo.

## System design

[Is course ka syllabus kholo](system-design/README.md)

Shuru karne se pehle: [Performance suspense and production quality](react/10-performance-production.md) · [JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md) · [Java concurrency under real resource limits](java/16-concurrency-production.md).

### Stage 1: Design ki common foundation

Scaling/cache choose karne se pehle requirements/capacity clear karo.

1. [Requirements capacity and design interviews](system-design/01-requirements-capacity.md)
2. [Scaling caching replication and partitioning](system-design/02-scaling-caching.md)

**Stage checkpoint — khud karke dikhao:** Workload, latency, freshness aur correctness assumptions likho.

### Stage 2: React frontend architecture samjho

Frontend case se pehle rendering, state aur performance design karo.

3. [React architecture rendering and delivery](system-design/03-react-architecture.md)
4. [React state server data and cache consistency](system-design/04-react-data-state.md)
5. [Frontend performance accessibility and resilience](system-design/05-frontend-performance.md)
6. [Frontend system design interview from requirements to failure](system-design/06-frontend-design-round.md)

**Stage checkpoint — khud karke dikhao:** URL state, cache aur stale-request handling wala accessible catalog banao.

### Stage 3: Java backend architecture samjho

API/data boundaries ke baad messaging, reliability aur operations padho.

7. [Java backend API and data architecture](system-design/07-java-api-data.md)
8. [Messaging outbox retries and distributed workflows](system-design/08-messaging-reliability.md)
9. [Security observability and production operations](system-design/09-security-operations.md)
10. [Java backend design interview and reservation correctness](system-design/10-backend-design-round.md)

**Stage checkpoint — khud karke dikhao:** Reservation invariant, retry identity aur failure timeline explain karo.

### Stage 4: End-to-end case studies karo

Dono sides padhkar frontend/backend reasoning combine karo.

11. [Case study React storefront and Java checkout](system-design/11-commerce-case-study.md)
12. [Case study collaborative notes and real-time chat](system-design/12-realtime-case-study.md)

**Stage checkpoint — khud karke dikhao:** Checkout/reconnect failure mein durable state bachne ka flow trace karo.

### Stage 5: Distributed guarantees aur API contracts defend karo

Read consistency, global limits aur API styles ko workload/failure history se compare karo.

13. [Consistency aur distributed rate limiting — guarantees pehle likho](system-design/13-consistency-limits.md)
14. [REST, GraphQL aur gRPC — protocol se pehle contract choose karo](system-design/14-api-contracts.md)

**Stage checkpoint — khud karke dikhao:** Replica lag, limiter outage aur batch lookup failure ke expected outcomes define karo.

### Stage 6: OS aur networking fundamentals se diagnose karo

Request latency ko process, memory, network aur shared-resource layers mein trace karo.

15. [OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Stage checkpoint — khud karke dikhao:** DNS/TCP/TLS failure, pool wait aur unknown write outcome ko evidence se separate karo.

## Interview playbooks

[Is course ka syllabus kholo](interview/README.md)

Apne subject ke liye pehle yeh padho: [Modules web delivery and debugging](javascript/17-modules-tooling-debugging.md) · [React machine coding and identity bugs](react/11-machine-coding.md) · [Observability with Actuator, metrics and tracing](spring-boot/09-observability-actuator.md) · [SSR uploads payments email and deployment](mongodb/08-production-integrations.md) · [Dynamic programming from state to recurrence](dsa/12-dynamic-programming.md) · [Case study collaborative notes and real-time chat](system-design/12-realtime-case-study.md).

### Stage 1: Language interview practice karo

Jo language course complete kiya, uska playbook lo.

1. [JavaScript interview playbook](interview/01-javascript-playbook.md)
2. [Java backend interview playbook](interview/02-java-backend-playbook.md)

**Stage checkpoint — khud karke dikhao:** Answer dekhe bina output explain aur design choice defend karo.

### Stage 2: Application interview practice karo

Language se frontend aur database-backed scenarios par badho.

3. [React interview playbook](interview/03-react-playbook.md)
4. [MongoDB interview playbook](interview/04-mongodb-playbook.md)

**Stage checkpoint — khud karke dikhao:** Errors ke saath ek machine-coding/query-design drill complete karo.

### Stage 3: Algorithms aur architecture practice karo

Related DSA/design course ke baad yeh rounds karo.

5. [DSA problem solving interview playbook](interview/05-dsa-playbook.md)
6. [React and Java system design interview playbook](interview/06-system-design-playbook.md)

**Stage checkpoint — khud karke dikhao:** Coding mein invariant aur design mein measurable requirement batao.

## Related source examples

- [JavaScript](../01_JavaScript/README.md)
- [DSA](../02_Dsa/README.md)
- [Frontend aur React](../03_Frontend/README.md)
- [Node, databases aur Java](../04_Backend/README.md)
- [Interview playgrounds](../05_Interview/README.md)
- [System design](../06_System_Design/README.md)
