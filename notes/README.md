# Course syllabus — start here

Each subject follows a prerequisite-based sequence. Read lesson 01, continue in number order, and complete each stage checkpoint. The app, filenames and this index share the same order. Original source folders remain reference material, not a second course sequence.

**Choose your route:** JavaScript → React → frontend system design; Java → Spring → backend system design. Begin DSA after JavaScript functions and arrays. Begin Node/MongoDB after JavaScript async and modules. Interview playbooks come after the corresponding subject.

See [course coverage](COURSE_COVERAGE.md) for instructor context and lecture-audit limits.

Each chapter includes a core takeaway and a revision lab with a challenge, hint, answer guide and exit check. Use the [study guide](STUDY_GUIDE.md) for session plans and self-review.

## JavaScript

[Open this course syllabus](javascript/README.md)

No prior programming course required. Start with lesson 01.

### Stage 1: Start with the language

Learn one small concept at a time, starting with variables.

1. [Variables and assignment with let and const](javascript/01-js-variables.md)
2. [Value types operators and explicit conversion](javascript/02-js-types-operators.md)
3. [Decisions with if else and boolean logic](javascript/03-js-conditionals.md)
4. [Loops counters and accumulators](javascript/04-js-loops.md)
5. [Functions parameters arguments and return values](javascript/05-js-functions.md)
6. [Arrays objects and simple data modeling](javascript/06-js-arrays-objects.md)

**Stage checkpoint:** Calculate the total study minutes for an array of lessons using a function, loop and condition.

### Stage 2: Work with data and scope

Transform collections, validate input, then understand bindings and built-in utilities.

7. [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md)
8. [Foundations checkpoint and reliable input handling](javascript/08-language-foundations.md)
9. [Execution contexts scope and closures](javascript/09-scope-closures.md)
10. [Numbers dates strings and regular expressions](javascript/10-numbers-dates-regex.md)

**Stage checkpoint:** Explain a closure and build a validated calculation without accidental string concatenation.

### Stage 3: Build browser interactions

Learn HTML/CSS structure before manipulating the DOM.

11. [HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)
12. [DOM events and browser interaction](javascript/12-dom-events-browser.md)

**Stage checkpoint:** Build a keyboard-accessible list with delegated actions.

### Stage 4: Understand objects and design

Learn receivers and prototypes before the OOP project.

13. [This binding prototypes and classes](javascript/13-this-prototypes-classes.md)
14. [OOP pillars and a banking mini-project](javascript/14-oop-and-mini-project.md)

**Stage checkpoint:** Explain this for three call sites and implement the small state-machine project.

### Stage 5: Handle asynchronous work and delivery

Progress from promises and fetching to concurrency limits and modules.

15. [Event loop promises and resilient fetching](javascript/15-async-event-loop.md)
16. [Async patterns and bounded concurrency](javascript/16-async-patterns.md)
17. [Modules web delivery and debugging](javascript/17-modules-tooling-debugging.md)

**Stage checkpoint:** Handle a failed request, cap concurrent work, and explain how the app reaches the browser.

## React

[Open this course syllabus](react/README.md)

Before starting: [Functions parameters arguments and return values](javascript/05-js-functions.md) · [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md) · [DOM events and browser interaction](javascript/12-dom-events-browser.md) · [Event loop promises and resilient fetching](javascript/15-async-event-loop.md).

### Stage 1: Components before architecture

Start with JSX and props, add state, then understand rendering and identity.

1. [First React component JSX and props](react/01-react-jsx-props.md)
2. [State snapshots forms and immutable updates](react/02-state-forms.md)
3. [Components JSX and the render cycle](react/03-components-rendering.md)

**Stage checkpoint:** Build an editable list whose drafts remain attached to the correct items.

### Stage 2: Reuse UI and synchronize safely

Learn composition, then effects, refs and custom hooks.

4. [Composition reusable patterns and styling](react/04-composition-styling.md)
5. [Effects refs and reusable synchronization](react/05-effects-custom-hooks.md)

**Stage checkpoint:** Extract a reusable component and clean up a cancellable effect.

### Stage 3: Connect a complete application

Add navigation, shared state, server-state caching and typed boundaries.

6. [Routing nested layouts and URL state](react/06-routing-url-state.md)
7. [Context reducers and Redux Toolkit](react/07-context-reducer-redux.md)
8. [Server state caching and Supabase integration](react/08-query-supabase.md)
9. [TypeScript contracts for React applications](react/09-typescript-contracts.md)

**Stage checkpoint:** Build a routed page with explicit cache identity and validated API data.

### Stage 4: Measure and practice

Profile production behavior before the machine-coding exercise.

10. [Performance suspense and production quality](react/10-performance-production.md)
11. [React machine coding and identity bugs](react/11-machine-coding.md)

**Stage checkpoint:** Demonstrate stale-request protection, keyboard behavior and one measured improvement.

## Java

[Open this course syllabus](java/README.md)

No prior programming course required. Start with lesson 01.

### Stage 1: Write your first Java programs

Run main, declare variables, make decisions, write methods, and create instances.

1. [First Java program variables and primitive types](java/01-java-first-program.md)
2. [Java operators decisions and loops](java/02-java-decisions-loops.md)
3. [Java methods arrays and strings](java/03-java-methods-arrays.md)
4. [Classes objects constructors and encapsulation](java/04-java-classes-constructors.md)
5. [Java foundations review and conversion edge cases](java/05-language-foundations.md)

**Stage checkpoint:** Compile a learner program with two independent objects and a method that processes an array.

### Stage 2: Build a reliable core model

Extend basic classes with OOP, collections, exceptions, streams and memory reasoning.

6. [Packages access control and interface boundaries](java/06-packages-interfaces.md)
7. [Objects OOP records and equality](java/07-object-model.md)
8. [Collections generics and choosing data structures](java/08-collections-generics.md)
9. [Exceptions resources files and time](java/09-exceptions-io-time.md)
10. [Lambdas streams and Optional](java/10-streams-lambdas.md)
11. [JVM memory garbage collection and diagnosis](java/11-jvm-memory.md)

**Stage checkpoint:** Choose a collection, preserve equality contracts and close an owned resource.

### Stage 3: Build test and persist

Set up builds and tests before database access and SQL concurrency exercises.

12. [Maven builds and useful Java tests](java/12-maven-testing.md)
13. [JDBC SQL and transaction boundaries](java/13-jdbc-sql.md)
14. [SQL joins windows and transaction races](java/14-sql-interview-lab.md)

**Stage checkpoint:** Test a JDBC operation and explain a join and an atomic inventory update.

### Stage 4: Reason about concurrency and resource limits

Understand thread safety, virtual threads and bounded resources.

15. [Concurrency synchronization and virtual threads](java/15-concurrency.md)
16. [Java concurrency under real resource limits](java/16-concurrency-production.md)

**Stage checkpoint:** Demonstrate a race-safe operation and explain where backpressure is needed.

## Spring Boot

[Open this course syllabus](spring-boot/README.md)

Before starting: [Maven builds and useful Java tests](java/12-maven-testing.md) · [JDBC SQL and transaction boundaries](java/13-jdbc-sql.md) · [Java concurrency under real resource limits](java/16-concurrency-production.md).

### Stage 1: Start and configure an application

Learn Boot startup, bean wiring and typed configuration.

1. [Spring Boot first application and project structure](spring-boot/01-first-application.md)
2. [Beans constructor injection and lifecycle](spring-boot/02-beans-di.md)
3. [Configuration properties profiles and startup failures](spring-boot/03-configuration.md)

**Stage checkpoint:** Start the application and diagnose a missing bean or invalid setting.

### Stage 2: Build a clear HTTP boundary

Create REST endpoints with DTOs, validation and controlled errors.

4. [Spring dependency injection and REST APIs](spring-boot/04-spring-rest.md)
5. [Request DTOs validation and consistent API errors](spring-boot/05-validation-errors.md)

**Stage checkpoint:** Demonstrate successful creation and rejected input with documented responses.

### Stage 3: Persist and secure business operations

Apply transactions, persistence and authorization boundaries.

6. [JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)
7. [Spring Security and reliable service boundaries](spring-boot/07-security-microservices.md)

**Stage checkpoint:** Prove an invariant survives concurrent requests and unauthorized access is rejected.

### Stage 4: Verify and operate the service

Test application boundaries, inspect telemetry and complete a deployment capstone.

8. [Spring Boot unit slice and integration testing](spring-boot/08-testing.md)
9. [Observability with Actuator, metrics and tracing](spring-boot/09-observability-actuator.md)
10. [Package deploy and defend a Spring Boot capstone](spring-boot/10-deployment-capstone.md)

**Stage checkpoint:** Run the API acceptance cases and defend a failed deployment recovery plan.

## Node & MongoDB

[Open this course syllabus](mongodb/README.md)

Before starting: [Objects arrays and modern data transformations](javascript/07-modern-data-collections.md) · [Event loop promises and resilient fetching](javascript/15-async-event-loop.md) · [Modules web delivery and debugging](javascript/17-modules-tooling-debugging.md).

### Stage 1: Understand the server request

Start with Node and HTTP, then learn Express routing and errors.

1. [Node runtime HTTP modules and streams](mongodb/01-node-runtime-http.md)
2. [Express REST APIs middleware and errors](mongodb/02-express-rest-errors.md)

**Stage checkpoint:** Trace a request through middleware to a controlled response.

### Stage 2: Store and model data

Learn documents and CRUD before introducing Mongoose schemas.

3. [Documents CRUD and access-driven modeling](mongodb/03-documents-crud-modeling.md)
4. [Mongoose schemas validation and relationships](mongodb/04-mongoose-validation-relations.md)

**Stage checkpoint:** Choose embedding or references for a concrete access pattern and validate writes.

### Stage 3: Query efficiently

Learn indexes and aggregation, then inspect query plans and bounded streaming.

5. [Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)
6. [MongoDB query plans and Node streaming lab](mongodb/06-query-production-lab.md)

**Stage checkpoint:** Explain the winning plan for a tenant-scoped query and stream a large export.

### Stage 4: Secure and ship

Add authentication and authorization before payment/upload/deployment integration.

7. [Authentication authorization and secure boundaries](mongodb/07-auth-security.md)
8. [SSR uploads payments email and deployment](mongodb/08-production-integrations.md)

**Stage checkpoint:** Reject unauthorized resource access and recover safely from a duplicate webhook.

## Data structures & algorithms

[Open this course syllabus](dsa/README.md)

Before starting: [Functions parameters arguments and return values](javascript/05-js-functions.md) · [Arrays objects and simple data modeling](javascript/06-js-arrays-objects.md).

### Stage 1: Understand cost and basic structures

Start with complexity, lists/stacks/queues, and hashing before pattern-based problems.

1. [Complexity and problem solving](dsa/01-complexity-and-problem-solving.md)
2. [Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)
3. [Hash tables maps and sets](dsa/03-hash-tables-and-sets.md)

**Stage checkpoint:** Choose an array, queue or map and justify operation costs.

### Stage 2: Learn reusable problem-solving patterns

Use familiar structures for counters, pointers and search; then introduce recursion and sorting.

4. [Frequency counters and pointer patterns](dsa/04-problem-solving-patterns.md)
5. [Searching and binary search boundaries](dsa/05-searching-and-binary-search.md)
6. [Recursion and backtracking](dsa/06-recursion-and-backtracking.md)
7. [Sorting from elementary methods to divide and conquer](dsa/07-sorting-algorithms.md)

**Stage checkpoint:** State a binary-search invariant and trace a recursive call before coding.

### Stage 3: Handle ordered candidates and hierarchies

Apply stack invariants, then learn trees and heaps before graphs.

8. [Monotonic stacks and amortized reasoning](dsa/08-monotonic-stack-lab.md)
9. [Trees and binary search trees](dsa/09-trees-and-binary-search-trees.md)
10. [Heaps and priority queues](dsa/10-heaps-and-priority-queues.md)

**Stage checkpoint:** Prove the stack bound and implement a heap-based top-k solution.

### Stage 4: Solve graph and dynamic-programming problems

Build on queues, recursion, hashing and heaps to reason about dependencies and repeated subproblems.

11. [Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)
12. [Dynamic programming from state to recurrence](dsa/12-dynamic-programming.md)

**Stage checkpoint:** Choose BFS versus Dijkstra, then derive a DP state and recurrence.

## System design

[Open this course syllabus](system-design/README.md)

Before starting: [Performance suspense and production quality](react/10-performance-production.md) · [JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md) · [Java concurrency under real resource limits](java/16-concurrency-production.md).

### Stage 1: Shared design foundations

Clarify requirements and capacity before choosing scaling and caching components.

1. [Requirements capacity and design interviews](system-design/01-requirements-capacity.md)
2. [Scaling caching replication and partitioning](system-design/02-scaling-caching.md)

**Stage checkpoint:** State workload, latency, freshness and correctness assumptions for a service.

### Stage 2: React frontend architecture

Design rendering, state and performance before the frontend interview case.

3. [React architecture rendering and delivery](system-design/03-react-architecture.md)
4. [React state server data and cache consistency](system-design/04-react-data-state.md)
5. [Frontend performance accessibility and resilience](system-design/05-frontend-performance.md)
6. [Frontend system design interview from requirements to failure](system-design/06-frontend-design-round.md)

**Stage checkpoint:** Design an accessible catalog with URL state, caching and stale-request handling.

### Stage 3: Java backend architecture

Design APIs and data boundaries, then messaging, reliability and operations.

7. [Java backend API and data architecture](system-design/07-java-api-data.md)
8. [Messaging outbox retries and distributed workflows](system-design/08-messaging-reliability.md)
9. [Security observability and production operations](system-design/09-security-operations.md)
10. [Java backend design interview and reservation correctness](system-design/10-backend-design-round.md)

**Stage checkpoint:** Explain a reservation invariant, retry identity and failure recovery timeline.

### Stage 4: End-to-end case studies

Combine frontend and backend reasoning only after studying both sides.

11. [Case study React storefront and Java checkout](system-design/11-commerce-case-study.md)
12. [Case study collaborative notes and real-time chat](system-design/12-realtime-case-study.md)

**Stage checkpoint:** Walk through checkout and real-time reconnection failures without losing durable state.

## Interview playbooks

[Open this course syllabus](interview/README.md)

Readiness references for the matching subject: [Modules web delivery and debugging](javascript/17-modules-tooling-debugging.md) · [React machine coding and identity bugs](react/11-machine-coding.md) · [Observability with Actuator, metrics and tracing](spring-boot/09-observability-actuator.md) · [SSR uploads payments email and deployment](mongodb/08-production-integrations.md) · [Dynamic programming from state to recurrence](dsa/12-dynamic-programming.md) · [Case study collaborative notes and real-time chat](system-design/12-realtime-case-study.md).

### Stage 1: Language interview practice

Use the playbook for the language you have finished studying.

1. [JavaScript interview playbook](interview/01-javascript-playbook.md)
2. [Java backend interview playbook](interview/02-java-backend-playbook.md)

**Stage checkpoint:** Explain an output question and defend a design choice without reading the answer.

### Stage 2: Application interview practice

Move from language reasoning to frontend and data-backed application scenarios.

3. [React interview playbook](interview/03-react-playbook.md)
4. [MongoDB interview playbook](interview/04-mongodb-playbook.md)

**Stage checkpoint:** Complete one machine-coding or query-design drill with error cases.

### Stage 3: Algorithms and architecture practice

Use these rounds after the corresponding DSA or design course.

5. [DSA problem solving interview playbook](interview/05-dsa-playbook.md)
6. [React and Java system design interview playbook](interview/06-system-design-playbook.md)

**Stage checkpoint:** State an invariant in a coding round and a measurable requirement in a design round.

## Existing source references

- [JavaScript](../01_JavaScript/README.md)
- [DSA](../02_Dsa/README.md)
- [Frontend and React](../03_Frontend/README.md)
- [Node, databases, and Java](../04_Backend/README.md)
- [Interview playgrounds](../05_Interview/README.md)
- [System design](../06_System_Design/README.md)
