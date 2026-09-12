export const advancedQuestions = [
  {
    id: 'iq-lab-01',
    track: 'javascript',
    level: 'Advanced',
    question: 'Why can Promise.all reject while network requests are still running?',
    answer:
      'Promise.all observes input outcomes; it does not cancel their operations. Its returned promise rejects when an input rejects, while already-started requests can still finish and cause side effects. Pass a shared AbortSignal to cooperative operations when cancellation is appropriate, and preserve an explicit policy for partial success. A cancellation request cannot prove a server write never happened.',
    followUp: 'How would your answer change for an allSettled-style batch?',
    tags: ['promises', 'cancellation'],
    noteId: 'javascript-async-patterns',
  },
  {
    id: 'iq-lab-02',
    track: 'javascript',
    level: 'Advanced',
    question:
      'Implement an ordered async map with at most three active operations. What must the tests prove?',
    answer:
      'Allocate result slots by input index and let at most three workers claim the next index synchronously before awaiting a mapper. Each worker starts another item only after its previous item settles. Define fail-fast versus settle-all behavior before implementation. Test out-of-order completion, mapper rejection, empty input and invalid limits while tracking peak active calls. Result order and completion order are separate contracts.',
    followUp: 'How would you stop new work after abort without leaving ambiguous result slots?',
    tags: ['concurrency', 'machine-coding'],
    noteId: 'javascript-async-patterns',
  },
  {
    id: 'iq-lab-03',
    track: 'javascript',
    level: 'Advanced',
    question:
      'A dropdown has z-index 999999 but remains behind another panel. How do you debug it?',
    answer:
      'Inspect ancestor stacking contexts first. The dropdown can only compete inside its context, and a sibling ancestor context may sit above the entire subtree. Look for positioned z-index, transforms, opacity and other context creators. Move the overlay to a deliberate top-level layer or use an appropriate platform primitive; then verify clipping, focus and positioning rather than only increasing the number.',
    followUp: 'Why might overflow clipping remain even after changing stacking order?',
    tags: ['css', 'stacking-context'],
    noteId: 'javascript-browser-foundations',
  },
  {
    id: 'iq-lab-04',
    track: 'javascript',
    level: 'Advanced',
    question: 'A clickable div works with a mouse. What is missing compared with a button?',
    answer:
      'A native button provides keyboard activation, focusability and accessibility semantics. Prefer a button when the action is a button, give it an accessible name and specify type when inside a form. A role alone does not implement keyboard behavior. Verify Enter, Space, disabled behavior and focus indication, and keep navigation as a link when it changes location.',
    followUp: 'How does the choice change when the element navigates to a new page?',
    tags: ['html', 'accessibility'],
    noteId: 'javascript-browser-foundations',
  },
  {
    id: 'iq-lab-05',
    track: 'react',
    level: 'Advanced',
    question:
      'Deleting the first editable row moves its draft into the next row. Explain the root cause.',
    answer:
      'Index keys preserve component identity by sibling position. After deletion, React can reuse the first position for a different entity while retaining that component state. Use stable entity IDs as keys and decide whether draft ownership belongs to a row or a map keyed by entity ID. Random keys instead remount every row, which loses drafts and focus rather than fixing identity.',
    followUp: 'When is resetting state through a changed key desirable?',
    tags: ['keys', 'identity'],
    noteId: 'react-machine-coding',
  },
  {
    id: 'iq-lab-06',
    track: 'react',
    level: 'Advanced',
    question:
      'Search for A, then AB. A returns last and replaces AB. Why did debounce not fix this?',
    answer:
      'Debounce controls when requests begin, not the order in which they finish. Associate state with query identity, clean up the old request and prevent an obsolete result from committing. AbortController can reduce work but a current-request guard expresses ownership explicitly. Also avoid displaying old-query data during the render before a new effect runs. Test with deterministic inverted delays.',
    followUp: 'How would you intentionally show stale results without misleading the user?',
    tags: ['requests', 'effects'],
    noteId: 'react-machine-coding',
  },
  {
    id: 'iq-lab-07',
    track: 'react',
    level: 'Advanced',
    question: 'Why is a loading/data/error object weaker than a discriminated union?',
    answer:
      'Independent optional fields admit contradictory states, such as loading false with neither data nor error, or success with stale failure details. A status-discriminated union ties each branch to the fields it actually permits. A switch narrows the branch and an exhaustive never check exposes missing cases when the model grows. Runtime responses still need validation before entering the typed model.',
    followUp: 'How would you represent refreshing with old data as a valid state?',
    tags: ['typescript', 'state'],
    noteId: 'react-typescript-contracts',
  },
  {
    id: 'iq-lab-08',
    track: 'react',
    level: 'Advanced',
    question: 'Does casting JSON to Topic[] validate the response?',
    answer:
      'No. Type assertions change what the compiler assumes and are erased from runtime JavaScript. Treat external data as unknown, validate its shape through executable parsing, then return a trusted type or a controlled error. Test nulls, mixed arrays and missing fields. Validation policy should specify whether extra fields are accepted, and how incompatible API changes appear to the user.',
    followUp: 'What bug can a wrongly implemented type predicate introduce?',
    tags: ['typescript', 'validation'],
    noteId: 'react-typescript-contracts',
  },
  {
    id: 'iq-lab-09',
    track: 'java',
    level: 'Advanced',
    question: 'Will virtual threads solve a service blocked on a twenty-connection database pool?',
    answer:
      'They can lower the cost of waiting threads but cannot create database capacity. Thousands of waiting requests may still exhaust latency budgets and memory elsewhere. Measure pool wait, query duration and active work; use admission limits and deadlines, then tune SQL and pool sizing against database capacity. State the JDK version because runtime scheduling details vary across releases.',
    followUp: 'Which metric distinguishes pool starvation from a slow individual query?',
    tags: ['virtual-threads', 'pools'],
    noteId: 'java-concurrency-production',
  },
  {
    id: 'iq-lab-10',
    track: 'java',
    level: 'Advanced',
    question: 'Where should you release a semaphore permit when acquisition can time out?',
    answer:
      'Release only after acquisition succeeds, normally in a finally block surrounding the protected operation. Releasing after a failed or interrupted acquisition increases permits incorrectly and breaks the bound. An acquisition deadline only limits waiting for admission; the protected operation needs its own timeout. Clarify whether the limit is per instance or globally coordinated.',
    followUp: 'What happens to the concurrency guarantee after deploying five instances?',
    tags: ['concurrency', 'semaphore'],
    noteId: 'java-concurrency-production',
  },
  {
    id: 'iq-lab-11',
    track: 'java',
    level: 'Advanced',
    question: 'Return each customer’s two largest orders, including a deterministic tie policy.',
    answer:
      'Partition a ROW_NUMBER window by customer and order by amount descending plus a stable unique tie-breaker. Filter row numbers to at most two in an outer query or CTE. Use RANK or DENSE_RANK only when the requirement asks for ties to share rank, since that can return more than two rows. Add a final ORDER BY because window order alone does not order output.',
    followUp: 'How does the result change if all tied orders must be included?',
    tags: ['sql', 'windows'],
    noteId: 'java-sql-interview-lab',
  },
  {
    id: 'iq-lab-12',
    track: 'java',
    level: 'Advanced',
    question: 'Why can moving a predicate from ON to WHERE break a LEFT JOIN report?',
    answer:
      'ON determines which child rows match before null extension; WHERE filters the resulting rows afterward. A WHERE condition on an unmatched child field commonly rejects the null-extended row, losing parents with no children. Put the child eligibility predicate in ON when such parents must remain, and count a non-null child key rather than COUNT(*) to represent zero matches.',
    followUp: 'How would joining two independent child collections distort SUM?',
    tags: ['sql', 'joins'],
    noteId: 'java-sql-interview-lab',
  },
  {
    id: 'iq-lab-13',
    track: 'mongodb',
    level: 'Advanced',
    question:
      'Your query returns twenty rows but examines a million documents. What would you inspect?',
    answer:
      'Inspect the winning plan, filter selectivity, sort stage, examined keys and documents, and index prefixes. Design an index for the actual equality, ordering and range pattern, then compare representative tenants and data distributions. A limit does not guarantee little work if the server must scan or sort first. Account for additional write and storage costs before adding the index.',
    followUp: 'Why might a plan that works for a small tenant fail for the largest tenant?',
    tags: ['indexes', 'explain'],
    noteId: 'mongodb-query-production-lab',
  },
  {
    id: 'iq-lab-14',
    track: 'mongodb',
    level: 'Advanced',
    question: 'How would you export a large MongoDB result through Node without buffering it all?',
    answer:
      'Read incrementally from a database cursor and write through a backpressure-aware pipeline. Avoid toArray or building the entire CSV string first. Close the cursor and streams on errors and client disconnect, enforce authorization and export limits, and decide how partial output is handled. Streaming bounds buffering within cooperating stages; it does not remove the need for admission control.',
    followUp: 'How would you verify that a slow client does not cause unbounded memory growth?',
    tags: ['streams', 'backpressure'],
    noteId: 'mongodb-query-production-lab',
  },
  {
    id: 'iq-lab-15',
    track: 'mongodb',
    level: 'Advanced',
    question: 'Can a find-then-insert check enforce a unique username under concurrent requests?',
    answer:
      'No. Two requests can both observe absence and insert unless the database enforces uniqueness. Create an appropriate unique index and handle duplicate-key errors as a defined application outcome. Normalize names according to a stated policy before storage or use an appropriate index collation. Validation improves error messages but is not a substitute for the race-safe constraint.',
    followUp: 'How should uniqueness work when usernames are scoped to a tenant?',
    tags: ['uniqueness', 'races'],
    noteId: 'mongodb-query-production-lab',
  },
  {
    id: 'iq-lab-16',
    track: 'mongodb',
    level: 'Advanced',
    question: 'Why does createdAt alone make an unreliable pagination cursor?',
    answer:
      'Multiple documents can share a timestamp, so an anchor with only createdAt cannot distinguish rows at the boundary. Use a deterministic pair such as createdAt and _id and a matching lexicographic continuation predicate. Preserve BSON types and filter context in the cursor, and authorize every request independently. Concurrent edits to sort keys can still move records across pages, so state the consistency contract.',
    followUp: 'Does a signed cursor eliminate the need to check tenant authorization?',
    tags: ['pagination', 'indexing'],
    noteId: 'mongodb-query-production-lab',
  },
  {
    id: 'iq-lab-17',
    track: 'dsa',
    level: 'Advanced',
    question: 'A loop contains a while that pops a stack. How can total time still be linear?',
    answer:
      'Count operations across the entire algorithm: if each index is pushed once and popped at most once, there are at most n pushes and n pops. One outer iteration may be expensive, but aggregate work is linear. Prove the permanent-elimination invariant first; if an item can be reinserted repeatedly, the same bound may not hold. This is amortized analysis, not random-input average-case analysis.',
    followUp: 'What change to the algorithm would invalidate that accounting?',
    tags: ['amortized', 'stack'],
    noteId: 'dsa-monotonic-stack-lab',
  },
  {
    id: 'iq-lab-18',
    track: 'dsa',
    level: 'Advanced',
    question: 'Why does daily temperatures use a strict greater-than comparison and store indices?',
    answer:
      'The answer asks for the first strictly warmer future day. Equal temperatures cannot resolve a waiting day, so they remain candidates. Indices preserve duplicate identities and allow today minus previous to produce the waiting distance. The stack retains unresolved days in non-increasing temperature order, and each popped day is resolved by its first warmer successor.',
    followUp: 'What changes when the requirement becomes warmer-or-equal?',
    tags: ['monotonic-stack', 'invariants'],
    noteId: 'dsa-monotonic-stack-lab',
  },
  {
    id: 'iq-lab-19',
    track: 'dsa',
    level: 'Advanced',
    question: 'Why is a monotonic deque more suitable than a stack for sliding-window maximum?',
    answer:
      'Dominated candidates leave from the back as new values arrive, while expired indices leave from the front when the window advances. A deque supports both operations efficiently. Store indices for expiration checks and maintain decreasing candidate values. Each index enters and exits at most once, yielding linear total time with a window-bounded candidate structure.',
    followUp: 'How do duplicates affect whether you remove less-than or less-than-or-equal values?',
    tags: ['deque', 'sliding-window'],
    noteId: 'dsa-monotonic-stack-lab',
  },
  {
    id: 'iq-lab-20',
    track: 'dsa',
    level: 'Advanced',
    question: 'How would you test an optimized algorithm when the invariant seems correct?',
    answer:
      'Build a simple independent reference implementation for small inputs and compare many boundary and generated cases. For daily temperatures, scan forward from every index until the first warmer value. Include duplicates, monotone sequences, empty arrays and negative values if allowed. Compare outputs, verify input mutation contracts and retain the smallest failing example. A slow oracle is useful because test inputs are intentionally small.',
    followUp: 'Why should the oracle avoid using the same stack logic as the optimized solution?',
    tags: ['testing', 'correctness'],
    noteId: 'dsa-monotonic-stack-lab',
  },
  {
    id: 'iq-lab-21',
    track: 'system-design',
    level: 'Advanced',
    question:
      'Design a React catalog whose filters survive refresh and browser Back. Where does state live?',
    answer:
      'Put shareable filters and sort in URL parameters, transient drafts and panels in local state, and remote results in a server-state cache keyed by all response-changing inputs. Reset pagination when filters change and restore state from the URL during navigation. Keep user or tenant identity in private cache boundaries and define whether stale data can be displayed during refetch.',
    followUp: 'What changes when the notebook must work fully offline?',
    tags: ['frontend', 'state'],
    noteId: 'system-design-frontend-design-round',
  },
  {
    id: 'iq-lab-22',
    track: 'system-design',
    level: 'Advanced',
    question:
      'How would you structure a frontend design round for a ten-million-item searchable catalog?',
    answer:
      'Clarify search semantics, freshness, accessibility and device constraints before drawing components. Use server-side search and bounded pages rather than downloading the dataset. Define cancellation, stable cursors, loading and error states, query identity and cache isolation. Measure delivery and interaction separately. Discuss SSR for discoverable content and a keyboard-safe presentation strategy before choosing virtualization.',
    followUp: 'Which requirement would justify prefetching, and how would you bound its cost?',
    tags: ['frontend', 'scale'],
    noteId: 'system-design-frontend-design-round',
  },
  {
    id: 'iq-lab-23',
    track: 'system-design',
    level: 'Advanced',
    question:
      'Payment succeeds, the response is lost, and a reservation expires. What should the Java API do?',
    answer:
      'Treat the payment outcome as unknown until reconciled through a stable provider operation ID or trusted event. Model reservation transitions explicitly and arbitrate confirmation versus expiration atomically. Apply a defined late-payment policy such as refund or capacity reacquisition. Retrying with a fresh payment identity risks charging twice. Preserve durable evidence linking the reservation and payment so recovery is auditable.',
    followUp: 'Which transition should win when expiration and confirmation occur simultaneously?',
    tags: ['backend', 'payments'],
    noteId: 'system-design-backend-design-round',
  },
  {
    id: 'iq-lab-24',
    track: 'system-design',
    level: 'Advanced',
    question: 'How do you prevent two Java API instances from selling the same final seat?',
    answer:
      'Place the invariant in a shared authoritative boundary, such as a conditional update or enforceable unique constraint within a transaction. A local synchronized block protects only one process. Tie reservation creation to that successful claim and handle contention as a normal application outcome. Cache availability only as a hint; validate at reservation time. Test genuinely concurrent writers against the real database semantics.',
    followUp: 'How would the design change for a temporary hold that later expires?',
    tags: ['backend', 'transactions'],
    noteId: 'system-design-backend-design-round',
  },
];
