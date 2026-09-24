# Primary sources

- Use — exact API behavior/caveat ke liye original source kholo.
- Notes — short Hinglish revision; full articles publisher ki site par.
- Version — framework upgrade par current docs dobara check karo.
- Source review — original selection 13 September 2026 ki hai.

## javascript

MDN se language/browser behavior verify karo: bindings, promises, modules, listener lifecycle aur semantic HTML par focus rakho.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| Live bindings versus snapshots | [Chapter mein samjho](javascript/09-scope-closures.md#research-notes-live-bindings-versus-snapshots) | [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) |
| Independent outcomes with allSettled | [Chapter mein samjho](javascript/16-async-patterns.md#research-notes-independent-outcomes-with-allsettled) | [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) |
| Own a listener lifecycle | [Chapter mein samjho](javascript/12-dom-events-browser.md#research-notes-own-a-listener-lifecycle) | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) |
| Imports are live read-only bindings | [Chapter mein samjho](javascript/17-modules-tooling-debugging.md#research-notes-imports-are-live-read-only-bindings) | [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) |
| Semantic HTML before custom interaction | [Chapter mein samjho](javascript/11-browser-foundations.md#research-notes-semantic-html-before-custom-interaction) | [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML) |

## react

React se state/synchronization, TanStack aur TypeScript se unke contracts, aur web.dev se profiling ka user-visible performance se connection samjho.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| Represent coherent request states | [Chapter mein samjho](react/02-state-forms.md#research-notes-represent-coherent-request-states) | [React](https://react.dev/learn/choosing-the-state-structure) |
| Effect timing depends on the trigger | [Chapter mein samjho](react/05-effects-custom-hooks.md#research-notes-effect-timing-depends-on-the-trigger) | [React](https://react.dev/reference/react/useEffect) |
| Freshness and retention are different clocks | [Chapter mein samjho](react/08-query-supabase.md#research-notes-freshness-and-retention-are-different-clocks) | [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) |
| Make omitted states visible to the compiler | [Chapter mein samjho](react/09-typescript-contracts.md#research-notes-make-omitted-states-visible-to-the-compiler) | [TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) |
| Measure user experience as well as renders | [Chapter mein samjho](react/10-performance-production.md#research-notes-measure-user-experience-as-well-as-renders) | [web.dev](https://web.dev/articles/vitals) |

## java

Oracle/Dev.java se language/library contracts, Spring se proxy transactions aur PostgreSQL se query-plan reasoning padho.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| A read-only view is not an immutable snapshot | [Chapter mein samjho](java/08-collections-generics.md#research-notes-a-read-only-view-is-not-an-immutable-snapshot) | [Oracle Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List)) |
| Keep the source when traversing twice | [Chapter mein samjho](java/10-streams-lambdas.md#research-notes-keep-the-source-when-traversing-twice) | [Dev.java](https://dev.java/learn/api/streams/) |
| Trace the actual transaction entry point | [Chapter mein samjho](spring-boot/06-jpa-transactions.md#research-notes-trace-the-actual-transaction-entry-point) | [Spring Framework](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) |
| Virtual threads still need task ownership | [Chapter mein samjho](java/16-concurrency-production.md#research-notes-virtual-threads-still-need-task-ownership) | [Dev.java](https://dev.java/learn/new-features/virtual-threads/) |
| Read estimates alongside actual query work | [Chapter mein samjho](java/14-sql-interview-lab.md#research-notes-read-estimates-alongside-actual-query-work) | [PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html) |

## mongodb

Node/Express se request aur streams ka lifecycle, MongoDB se modeling/atomicity aur OWASP se authorization checks samjho.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| Backpressure is a producer contract | [Chapter mein samjho](mongodb/01-node-runtime-http.md#research-notes-backpressure-is-a-producer-contract) | [Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams) |
| Return the promise that owns the request | [Chapter mein samjho](mongodb/02-express-rest-errors.md#research-notes-return-the-promise-that-owns-the-request) | [Express](https://expressjs.com/en/guide/error-handling/) |
| Model bounded growth and data ownership | [Chapter mein samjho](mongodb/03-documents-crud-modeling.md#research-notes-model-bounded-growth-and-data-ownership) | [MongoDB](https://www.mongodb.com/docs/manual/data-modeling/) |
| Match the version you actually read | [Chapter mein samjho](mongodb/05-indexes-aggregation-transactions.md#research-notes-match-the-version-you-actually-read) | [MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/) |
| Authorize both the action and its object | [Chapter mein samjho](mongodb/07-auth-security.md#research-notes-authorize-both-the-action-and-its-object) | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) |

## dsa

MIT 6.006 se amortization, balancing, shortest paths aur pseudopolynomial DP ki derivation samjho. Sirf complexity label yaad mat karo.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| Expected and amortized are different guarantees | [Chapter mein samjho](dsa/03-hash-tables-and-sets.md#research-notes-expected-and-amortized-are-different-guarantees) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/160b3b5f9da2e03815ca1e6ee0dba62a_MIT6_006F11_lec09.pdf) |
| Balance the height that controls lookup | [Chapter mein samjho](dsa/09-trees-and-binary-search-trees.md#research-notes-balance-the-height-that-controls-lookup) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/83cdd705cd418d10d9769b741e34a2b8_MIT6_006F11_lec06.pdf) |
| Negative edges in a DAG | [Chapter mein samjho](dsa/11-graphs-and-shortest-paths.md#research-notes-negative-edges-in-a-dag) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf) |
| Numeric magnitude can dominate DP | [Chapter mein samjho](dsa/12-dynamic-programming.md#research-notes-numeric-magnitude-can-dominate-dp) | [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf) |

## system-design

AWS/Google SRE operational tradeoffs samjhate hain; Supabase se database access policies aur frontend state ka relation padho.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| Budget retries across the call graph | [Chapter mein samjho](system-design/08-messaging-reliability.md#research-notes-budget-retries-across-the-call-graph) | [AWS Builders’ Library](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf) |
| Define behavior beyond capacity | [Chapter mein samjho](system-design/02-scaling-caching.md#research-notes-define-behavior-beyond-capacity) | [Google SRE](https://sre.google/sre-book/handling-overload/) |
| Client caches do not enforce database access | [Chapter mein samjho](system-design/04-react-data-state.md#research-notes-client-caches-do-not-enforce-database-access) | [Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| Turn an SLO into a concrete budget | [Chapter mein samjho](system-design/09-security-operations.md#research-notes-turn-an-slo-into-a-concrete-budget) | [Google SRE](https://sre.google/sre-book/service-level-objectives/) |

## interview

Employer guidance se assessment expectations samjho. Exercises original hain; specific employer ke questions ya frequency ka claim nahi hai.

| Topic | Yahan padho | Primary source |
| --- | --- | --- |
| Explain the contract before coding | [Chapter mein samjho](interview/01-javascript-playbook.md#research-notes-explain-the-contract-before-coding) | [Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics) |
| Defend a failure boundary | [Chapter mein samjho](interview/02-java-backend-playbook.md#research-notes-defend-a-failure-boundary) | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |
| Demonstrate component behavior | [Chapter mein samjho](interview/03-react-playbook.md#research-notes-demonstrate-component-behavior) | [Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics) |
| Justify the query from its workload | [Chapter mein samjho](interview/04-mongodb-playbook.md#research-notes-justify-the-query-from-its-workload) | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |
| Prove before optimizing | [Chapter mein samjho](interview/05-dsa-playbook.md#research-notes-prove-before-optimizing) | [Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics) |
| Expose assumptions and failure recovery | [Chapter mein samjho](interview/06-system-design-playbook.md#research-notes-expose-assumptions-and-failure-recovery) | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |

Links aur coverage checks ke liye yahi mapping [research-sources.json](research-sources.json) mein bhi hai.
