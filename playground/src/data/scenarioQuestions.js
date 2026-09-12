// Original interview scenarios, with references for the underlying concepts.
export const scenarioQuestions = [
  {
    id: 'iq-scenario-01',
    track: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Advanced',
    question:
      'A progress spinner freezes although the calculation is wrapped in Promise.resolve().then(). Why?',
    answer:
      'Promise callbacks still execute JavaScript on the same thread. A long calculation blocks other work; repeatedly queuing microtasks can also delay rendering. Move substantial CPU work to a worker or split it into bounded tasks that yield to the host. Measure responsiveness as well as total execution time.',
    followUp: 'How would you cancel a worker result after the user changes inputs?',
    tags: ['event-loop', 'microtasks', 'performance'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model',
      },
    ],
  },
  {
    id: 'iq-scenario-02',
    track: 'javascript',
    noteId: 'javascript-async-patterns',
    level: 'Advanced',
    question:
      'Design a search request flow where typing A then AB must never show the stale A result.',
    answer:
      'Assign each request a monotonically increasing identity and only commit the current identity. Abort the old fetch to reduce wasted work, but retain the identity guard for later async processing. Treat cancellation separately from genuine errors; clear loading only for the current request.',
    followUp:
      'What happens if the first fetch resolves before cancellation but its JSON processing finishes later?',
    tags: ['async', 'requests', 'race-conditions'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
      },
    ],
  },
  {
    id: 'iq-scenario-03',
    track: 'javascript',
    noteId: 'js-scope-closures',
    level: 'Advanced',
    question: 'A removed widget stays in memory. How would you investigate its event handler?',
    answer:
      'Inspect a heap snapshot retaining path. A listener on a long-lived target can retain its closure and the widget data captured by that closure. Remove the exact callback or abort its listener lifecycle; clear owned timers too. Compare retained instances after repeated mount/remove cycles instead of assuming every closure leaks.',
    followUp: 'Why does removeEventListener fail when passed a newly created arrow function?',
    tags: ['closures', 'memory', 'events'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener',
      },
    ],
  },
  {
    id: 'iq-scenario-04',
    track: 'react',
    noteId: 'react-effects-custom-hooks',
    level: 'Advanced',
    question:
      'A filtered list uses an Effect to copy filtered props into state. How would you simplify it?',
    answer:
      'Derive the filtered list during render, keeping only the user-controlled filter in state. This avoids an extra state synchronization cycle. Memoize the calculation only when measured cost justifies it. Effects are appropriate when synchronizing with an external system, such as a subscription.',
    followUp: 'What changes if the filter operation must run on a remote server?',
    tags: ['effects', 'state', 'rendering'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://react.dev/learn/you-might-not-need-an-effect',
      },
    ],
  },
  {
    id: 'iq-scenario-05',
    track: 'react',
    noteId: 'react-machine-coding',
    level: 'Advanced',
    question:
      'A sorted editable table moves a typed draft into the wrong row. What is your diagnosis?',
    answer:
      'Index keys associate component state with a position. Sorting changes which record occupies that position, so a draft can appear on another record. Use stable record IDs as keys, define whether drafts belong to the row or an external editor store, and test sorting while a draft is active.',
    followUp:
      'How should a deliberately new record reset the editor without resetting unrelated rows?',
    tags: ['keys', 'identity', 'state'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://react.dev/learn/preserving-and-resetting-state',
      },
    ],
  },
  {
    id: 'iq-scenario-06',
    track: 'react',
    noteId: 'react-effects-custom-hooks',
    level: 'Advanced',
    question: 'Strict Mode exposes two active socket listeners. What should the Effect guarantee?',
    answer:
      'Setup must own a subscription and cleanup must remove that same subscription. React can run an extra setup-cleanup cycle in development to expose missing cleanup. Verify only one listener remains after that cycle and none after unmount. A ref that suppresses the second setup hides the ownership defect.',
    followUp: 'How would your cleanup change when the room ID changes while connected?',
    tags: ['effects', 'cleanup', 'strict-mode'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://react.dev/learn/synchronizing-with-effects',
      },
    ],
  },
  {
    id: 'iq-scenario-07',
    track: 'java',
    noteId: 'java-collections-generics',
    level: 'Advanced',
    question:
      'A HashMap contains a customer key but get(customer) returns null after an update. Explain.',
    answer:
      'If fields used by equals or hashCode change after insertion, lookup can search a different bucket. Model keys with stable immutable identity, and keep equals and hashCode consistent. Prefer a customer ID key when the customer object is mutable. Reproduce with a small mutation test before changing the collection.',
    followUp: 'Does wrapping the map in an unmodifiable view prevent mutation of the customer key?',
    tags: ['hashmap', 'equality', 'collections'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://dev.java/learn/api/collections-framework/',
      },
    ],
  },
  {
    id: 'iq-scenario-08',
    track: 'java',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'Two checkout requests both read stock = 1. How do you prevent both succeeding?',
    answer:
      'Make the invariant part of the write: decrement only when stock is positive and check affected rows, or use appropriate locking/version checks within a transaction. A transaction alone does not automatically serialize the read-modify-write sequence. Define retry behavior for conflicts and keep external payment calls outside long-held database locks.',
    followUp: 'How will a retry know whether the earlier checkout already reserved stock?',
    tags: ['transactions', 'concurrency', 'sql'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://www.postgresql.org/docs/18/sql-set-transaction.html',
      },
    ],
  },
  {
    id: 'iq-scenario-09',
    track: 'java',
    noteId: 'java-concurrency-production',
    level: 'Advanced',
    question:
      'After increasing request concurrency, database timeout rates rise. What would you change first?',
    answer:
      'Compare arrival rate, connection wait time, query duration, and pool utilization. Bound concurrent database work to the downstream capacity, enforce deadlines, and reject or queue excess work with a limit. More request threads do not create database capacity; fix slow queries and transaction scope before enlarging the pool blindly.',
    followUp: 'What metric distinguishes connection-pool waiting from slow SQL execution?',
    tags: ['concurrency', 'backpressure', 'connections'],
  },
  {
    id: 'iq-scenario-10',
    track: 'mongodb',
    noteId: 'mongo-node-runtime-http',
    level: 'Advanced',
    question:
      'An async Node endpoint parses a huge JSON payload and stalls unrelated requests. Why?',
    answer:
      'Async syntax does not move synchronous JSON parsing off the event loop. Bound payload size and avoid unbounded per-request computation. For substantial CPU work, consider workers with a bounded submission queue. Measure event-loop delay and CPU alongside request latency to separate computation from database waiting.',
    followUp: 'Why can a worker pool still overload the service if its input queue is unlimited?',
    tags: ['node', 'event-loop', 'backpressure'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop',
      },
    ],
  },
  {
    id: 'iq-scenario-11',
    track: 'mongodb',
    noteId: 'mongodb-query-production-lab',
    level: 'Advanced',
    question:
      'A tenant activity feed filters by tenantId and sorts by createdAt and _id. Propose an index and pagination strategy.',
    answer:
      'Try a compound index starting with tenantId followed by the sort fields in matching directions. Use the last createdAt and _id as a cursor with a matching lexicographic boundary. The ID breaks timestamp ties. Validate the actual plan and examined keys/documents with representative tenant sizes; indexes also cost storage and write work.',
    followUp: 'How do concurrent inserts affect cursor pagination compared with a strict snapshot?',
    tags: ['indexes', 'pagination', 'query-plan'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/',
      },
    ],
  },
  {
    id: 'iq-scenario-12',
    track: 'mongodb',
    noteId: 'mongo-production-integrations',
    level: 'Advanced',
    question:
      'A payment webhook is delivered twice while two server instances process it. What prevents a duplicate order update?',
    answer:
      'Persist a unique provider event identity and apply the business transition atomically with its deduplication record. Authenticate the webhook, validate its association to the order, and acknowledge only after durable handling. An in-memory set fails across instances and restarts. Make side effects replay-safe and retain enough evidence for reconciliation.',
    followUp: 'What if the process crashes after committing but before returning HTTP success?',
    tags: ['webhooks', 'idempotency', 'transactions'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/',
      },
    ],
  },
  {
    id: 'iq-scenario-13',
    track: 'dsa',
    noteId: 'dsa-patterns',
    level: 'Advanced',
    question:
      'Why does a shrinking sliding window fail for exact target sums when negative numbers are allowed?',
    answer:
      'Its usual shrinking rule relies on monotonic behavior: adding grows the sum and removing shrinks it for nonnegative values. Negatives break that reasoning. For counting arbitrary integer subarrays with a target sum, use prefix sums and frequencies of earlier prefix sums, including an initial zero prefix.',
    followUp: 'For [1, -1, 1] and target 1, trace the prefix map and count all valid subarrays.',
    tags: ['sliding-window', 'prefix-sum', 'invariants'],
  },
  {
    id: 'iq-scenario-14',
    track: 'dsa',
    noteId: 'dsa-graphs',
    level: 'Advanced',
    question:
      'A shortest-path solution marks a node final the first time it is discovered. When is that valid?',
    answer:
      'For unweighted BFS, discovery in layer order establishes minimum edge count. For weighted Dijkstra, discovery alone is insufficient; finalize the minimum-distance entry removed from the priority queue, skipping stale entries. Its standard correctness argument requires nonnegative edge weights. State which graph model you are solving before choosing the algorithm.',
    followUp: 'Give a three-node graph where first discovery produces a longer weighted route.',
    tags: ['bfs', 'dijkstra', 'graph'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
      },
    ],
  },
  {
    id: 'iq-scenario-15',
    track: 'dsa',
    noteId: 'dsa-dynamic-programming',
    level: 'Advanced',
    question:
      'How can the same one-dimensional knapsack array accidentally solve a different problem?',
    answer:
      'With 0/1 knapsack, descending capacity order prevents the current item from being reused in the same iteration. Ascending order can consume the newly updated state and implements unbounded reuse. Explain what each state means before optimizing memory, and compare the optimized solution against a small exhaustive oracle.',
    followUp:
      'Use a single item of weight 2 and value 3 with capacity 4 to demonstrate the difference.',
    tags: ['dynamic-programming', 'knapsack', 'invariants'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
      },
    ],
  },
  {
    id: 'iq-scenario-16',
    track: 'system-design',
    noteId: 'design-messaging-reliability',
    level: 'Advanced',
    question: 'A create-order API times out after committing. What should a client retry do?',
    answer:
      'Reuse a caller-scoped idempotency key bound to the request intent. Atomically record the key with the state change and return the recorded outcome on a duplicate. Reject reuse with a different payload and define retention. A timeout leaves the outcome uncertain; it is not evidence that no side effect occurred.',
    followUp: 'What happens when two identical requests with the same key arrive concurrently?',
    tags: ['idempotency', 'retries', 'transactions'],
    sources: [
      {
        title: 'Technical reference',
        url: 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/',
      },
    ],
  },
  {
    id: 'iq-scenario-17',
    track: 'system-design',
    noteId: 'design-scaling-caching',
    level: 'Advanced',
    question:
      'A hot cache entry expires and thousands of requests hit the database. Design a recovery path.',
    answer:
      'Coalesce concurrent refreshes, spread expiry times, and cap refresh work. If the product allows it, serve bounded stale data while one request refreshes. Keep a timeout and failure policy for the refresher. Size protection for the database when the cache is completely unavailable, not only for normal hit rates.',
    followUp: 'Which data would you refuse to serve stale, and how would the UI communicate that?',
    tags: ['caching', 'resilience', 'stampede'],
  },
  {
    id: 'iq-scenario-18',
    track: 'system-design',
    noteId: 'design-realtime-case-study',
    level: 'Advanced',
    question:
      'A chat client reconnects after missing messages. How do you recover without gaps or duplicates?',
    answer:
      'Persist messages with stable identities and a conversation sequence or cursor. Reconnect from the last acknowledged position, replay retained events, and deduplicate by message identity. If the cursor is outside retention, return a resynchronization path. Define ordering scope explicitly; a global total order is a separate and usually more expensive requirement.',
    followUp: 'How would you handle replay arriving while new live messages are already streaming?',
    tags: ['websocket', 'replay', 'ordering'],
  },
  {
    id: 'iq-scenario-19',
    track: 'javascript',
    noteId: 'js-conditionals',
    level: 'Intermediate',
    question: 'When should a fallback use ?? instead of ||?',
    answer:
      'The || operator falls back for any falsy value, including 0, false, and an empty string. The ?? operator falls back only for null or undefined. For a valid numeric zero, use nullish handling plus explicit validation instead of silently replacing the value.',
    followUp: 'How would you separately reject NaN while allowing zero?',
    tags: ['conditionals', 'coercion'],
  },
  {
    id: 'iq-scenario-20',
    track: 'javascript',
    noteId: 'js-loops',
    level: 'Intermediate',
    question:
      'A loop removes items from an array while incrementing its index. Why can it skip matches?',
    answer:
      'Removing an element shifts later elements left, but the next increment advances past the element that shifted into the current position. Iterate backward when mutating by index, or construct a filtered result. Specify whether preserving the original array identity matters to callers.',
    followUp:
      'Trace adjacent removable values and compare the space cost of filter with in-place removal.',
    tags: ['loops', 'arrays'],
  },
  {
    id: 'iq-scenario-21',
    track: 'react',
    noteId: 'react-jsx-props',
    level: 'Intermediate',
    question: 'Why is changing a prop object inside a child component a problem?',
    answer:
      'Props describe the input for a render and should be treated as read-only. Mutating the object can change shared parent data without a scheduled state update and undermine render assumptions. Ask the owner to update state through a callback, creating new objects for the changed path.',
    followUp: 'How would you update one nested field without replacing unrelated sibling objects?',
    tags: ['props', 'jsx'],
  },
  {
    id: 'iq-scenario-22',
    track: 'react',
    noteId: 'react-routing-url-state',
    level: 'Intermediate',
    question: 'Which parts of a product-search screen belong in the URL?',
    answer:
      'Put shareable navigation state such as committed query, filters, sort, and page in the URL. Keep transient input or focus local when it need not survive navigation. Parse and validate URL values, reset incompatible pagination when filters change, and test reload plus back/forward navigation.',
    followUp: 'When would replace history be preferable to adding an entry for every keystroke?',
    tags: ['routing', 'url'],
  },
  {
    id: 'iq-scenario-23',
    track: 'react',
    noteId: 'react-query-supabase',
    level: 'Intermediate',
    question:
      'Two tenants see cached data from each other in a client session. What do you inspect?',
    answer:
      'Check whether the query key includes tenant identity and every input that changes the result. Clear or partition sensitive caches when identity changes. Cache separation is only a UI concern; the backend must still enforce tenant access for every request, including direct requests outside the UI.',
    followUp: 'How would you test account switching while the old request is still in flight?',
    tags: ['query', 'cache', 'supabase'],
  },
  {
    id: 'iq-scenario-24',
    track: 'java',
    noteId: 'java-language-foundations',
    level: 'Intermediate',
    question: 'Why can assigning an int multiplication to long still produce an overflowed result?',
    answer:
      'If both operands are int, multiplication is evaluated using int arithmetic before assignment to long. Promote an operand first, such as 1L * count * price, and choose checked arithmetic when overflow must fail. Widening an already overflowed intermediate cannot recover the mathematical result.',
    followUp: 'What changes when even the correct result exceeds the long range?',
    tags: ['types', 'casting'],
  },
  {
    id: 'iq-scenario-25',
    track: 'java',
    noteId: 'java-maven-testing',
    level: 'Intermediate',
    question:
      'An integration test passes alone but fails in the full Maven suite. How do you debug it?',
    answer:
      'Look for shared database rows, fixed ports, mutable static state, time assumptions, and order-dependent cleanup. Reproduce with the same suite configuration and isolate each test resource. Prefer unique fixture identifiers and explicit lifecycle cleanup; adding sleeps usually masks the race without establishing correctness.',
    followUp:
      'How would you keep database integration tests independent when they run concurrently?',
    tags: ['maven', 'testing'],
  },
  {
    id: 'iq-scenario-26',
    track: 'mongodb',
    noteId: 'mongo-auth-security',
    level: 'Intermediate',
    question:
      'A valid user token can read another user’s order by changing its ID. What check is missing?',
    answer:
      'Authentication identifies the caller; object-level authorization decides whether that caller may access this order. Scope the query or policy check to the authenticated user and tenant, with explicit exceptions for authorized roles. Never trust a user ID supplied in the request body as proof of ownership.',
    followUp:
      'What integration tests cover horizontal access, privileged access, and a deleted membership?',
    tags: ['auth', 'authorization'],
  },
];
