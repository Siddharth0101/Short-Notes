# Curated internet notes and source map

Reviewed 13 September 2026. These selections cover every course in this notebook. “Best” here means useful for this curriculum: primary documentation for exact behavior, university notes for algorithm reasoning, and engineering publications for production tradeoffs. It is an editorial selection, not an exhaustive ranking of the internet.

The linked chapters contain concise original explanations, worked examples, interview checks with answers, and drills. Full source articles remain on their publishers’ sites. Framework behavior is version-sensitive; use the documented version and check the source when upgrading. MIT’s 2011 notes are selected for durable algorithmic reasoning, not modern framework APIs.

## How to use these notes

1. Follow the existing course syllabus and open the research section in its related chapter.
2. Predict the example, answer the interview check, and try the failure case before reading the answer.
3. Read the primary source for API caveats or a complete derivation.
4. Record the counterexample that changed your understanding.

## javascript

MDN is the core language/browser reference; focus on bindings, promise contracts, modules, listener ownership and semantic HTML.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| Live bindings versus snapshots | [Chapter section](javascript/09-scope-closures.md#research-notes-live-bindings-versus-snapshots) | [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) |
| Independent outcomes with allSettled | [Chapter section](javascript/16-async-patterns.md#research-notes-independent-outcomes-with-allsettled) | [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) |
| Own a listener lifecycle | [Chapter section](javascript/12-dom-events-browser.md#research-notes-own-a-listener-lifecycle) | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) |
| Imports are live read-only bindings | [Chapter section](javascript/17-modules-tooling-debugging.md#research-notes-imports-are-live-read-only-bindings) | [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) |
| Semantic HTML before custom interaction | [Chapter section](javascript/11-browser-foundations.md#research-notes-semantic-html-before-custom-interaction) | [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML) |

## react

React explains state and synchronization; TanStack and TypeScript document their own behavior; web.dev connects profiling to user-visible performance.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| Represent coherent request states | [Chapter section](react/02-state-forms.md#research-notes-represent-coherent-request-states) | [React](https://react.dev/learn/choosing-the-state-structure) |
| Effect timing depends on the trigger | [Chapter section](react/05-effects-custom-hooks.md#research-notes-effect-timing-depends-on-the-trigger) | [React](https://react.dev/reference/react/useEffect) |
| Freshness and retention are different clocks | [Chapter section](react/08-query-supabase.md#research-notes-freshness-and-retention-are-different-clocks) | [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) |
| Make omitted states visible to the compiler | [Chapter section](react/09-typescript-contracts.md#research-notes-make-omitted-states-visible-to-the-compiler) | [TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) |
| Measure user experience as well as renders | [Chapter section](react/10-performance-production.md#research-notes-measure-user-experience-as-well-as-renders) | [web.dev](https://web.dev/articles/vitals) |

## java

Oracle and Dev.java cover language/library contracts. Spring defines proxy transaction behavior, and PostgreSQL provides query-plan reasoning.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| A read-only view is not an immutable snapshot | [Chapter section](java/08-collections-generics.md#research-notes-a-read-only-view-is-not-an-immutable-snapshot) | [Oracle Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List)) |
| Keep the source when traversing twice | [Chapter section](java/10-streams-lambdas.md#research-notes-keep-the-source-when-traversing-twice) | [Dev.java](https://dev.java/learn/api/streams/) |
| Trace the actual transaction entry point | [Chapter section](spring-boot/06-jpa-transactions.md#research-notes-trace-the-actual-transaction-entry-point) | [Spring Framework](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) |
| Virtual threads still need task ownership | [Chapter section](java/16-concurrency-production.md#research-notes-virtual-threads-still-need-task-ownership) | [Dev.java](https://dev.java/learn/new-features/virtual-threads/) |
| Read estimates alongside actual query work | [Chapter section](java/14-sql-interview-lab.md#research-notes-read-estimates-alongside-actual-query-work) | [PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html) |

## mongodb

Node and Express cover request/stream ownership; MongoDB covers modeling and atomicity; OWASP supplies authorization checks.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| Backpressure is a producer contract | [Chapter section](mongodb/01-node-runtime-http.md#research-notes-backpressure-is-a-producer-contract) | [Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams) |
| Return the promise that owns the request | [Chapter section](mongodb/02-express-rest-errors.md#research-notes-return-the-promise-that-owns-the-request) | [Express](https://expressjs.com/en/guide/error-handling/) |
| Model bounded growth and data ownership | [Chapter section](mongodb/03-documents-crud-modeling.md#research-notes-model-bounded-growth-and-data-ownership) | [MongoDB](https://www.mongodb.com/docs/manual/data-modeling/) |
| Match the version you actually read | [Chapter section](mongodb/05-indexes-aggregation-transactions.md#research-notes-match-the-version-you-actually-read) | [MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/) |
| Authorize both the action and its object | [Chapter section](mongodb/07-auth-security.md#research-notes-authorize-both-the-action-and-its-object) | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |

## dsa

MIT 6.006 provides derivations for amortization, balancing, shortest paths and pseudopolynomial DP, beyond memorized complexity labels.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| Expected and amortized are different guarantees | [Chapter section](dsa/03-hash-tables-and-sets.md#research-notes-expected-and-amortized-are-different-guarantees) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf) |
| Balance the height that controls lookup | [Chapter section](dsa/09-trees-and-binary-search-trees.md#research-notes-balance-the-height-that-controls-lookup) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf) |
| Negative edges in a DAG | [Chapter section](dsa/11-graphs-and-shortest-paths.md#research-notes-negative-edges-in-a-dag) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf) |
| Numeric magnitude can dominate DP | [Chapter section](dsa/12-dynamic-programming.md#research-notes-numeric-magnitude-can-dominate-dp) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf) |

## system-design

AWS and Google SRE explain operational tradeoffs; Supabase documents how database access policies interact with frontend state.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| Budget retries across the call graph | [Chapter section](system-design/08-messaging-reliability.md#research-notes-budget-retries-across-the-call-graph) | [AWS Builders’ Library](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf) |
| Define behavior beyond capacity | [Chapter section](system-design/02-scaling-caching.md#research-notes-define-behavior-beyond-capacity) | [Google SRE](https://sre.google/sre-book/handling-overload/) |
| Client caches do not enforce database access | [Chapter section](system-design/04-react-data-state.md#research-notes-client-caches-do-not-enforce-database-access) | [Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| Turn an SLO into a concrete budget | [Chapter section](system-design/09-security-operations.md#research-notes-turn-an-slo-into-a-concrete-budget) | [Google SRE](https://sre.google/sre-book/service-level-objectives/) |

## interview

Employer guidance is used for assessment expectations. All exercises are original; no question-frequency or employer-question claims are made.

| Added topic | Read in this notebook | Primary source |
| --- | --- | --- |
| Explain the contract before coding | [Chapter section](interview/01-javascript-playbook.md#research-notes-explain-the-contract-before-coding) | [Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics) |
| Defend a failure boundary | [Chapter section](interview/02-java-backend-playbook.md#research-notes-defend-a-failure-boundary) | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |
| Demonstrate component behavior | [Chapter section](interview/03-react-playbook.md#research-notes-demonstrate-component-behavior) | [Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics) |
| Justify the query from its workload | [Chapter section](interview/04-mongodb-playbook.md#research-notes-justify-the-query-from-its-workload) | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |
| Prove before optimizing | [Chapter section](interview/05-dsa-playbook.md#research-notes-prove-before-optimizing) | [Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics) |
| Expose assumptions and failure recovery | [Chapter section](interview/06-system-design-playbook.md#research-notes-expose-assumptions-and-failure-recovery) | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |

The source map is also recorded in [research-sources.json](research-sources.json) for link and coverage validation.
