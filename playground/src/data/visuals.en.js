// English text for the visual lab. Keys are visual ids; `frames[i]` overlays the i-th frame of
// the Hinglish original (title only where the original title is not already English).
// Structure (lanes, cells, code) is shared, so a visual can never drift between languages.
export const VISUALS_EN = {
  'event-loop': {
    description: 'Follow the call stack, microtasks and timer tasks one step at a time.',
    takeaway:
      'Synchronous code finishes first. At the microtask checkpoint the queue is drained, and only then can the next timer task run. 0 ms does not mean "run immediately".',
    frames: [
      { explanation: 'console.log("A") runs now. The script is on the call stack.' },
      {
        explanation:
          'The browser registers the timer. Once the delay completes, the callback becomes eligible in the task queue; it cannot interrupt the script.',
      },
      {
        explanation:
          'The .then callback of a resolved promise goes to the microtask queue, not straight onto the call stack.',
      },
      {
        explanation:
          'log D runs before either callback. The script is now complete and the stack is empty.',
      },
      {
        explanation:
          'At the microtask checkpoint, log C runs. Microtasks queued along the way are also drained before the next task.',
      },
      { explanation: 'Now the timer callback gets its chance. Final output: A → D → C → B.' },
    ],
  },
  closures: {
    description: 'See how a function remembers the variables of its lexical environment.',
    takeaway:
      'A closure keeps a live binding to the variable, not a frozen copy. Calling createCounter() again creates a separate environment.',
    frames: [
      {
        explanation:
          'createCounter creates its lexical environment. count is a local binding in that environment.',
      },
      {
        explanation:
          'The factory has returned, but the returned function still holds a link to that environment.',
      },
      {
        explanation:
          'The inner function reads and updates the count binding. This is not a new factory call.',
      },
      {
        explanation:
          'The same lexical environment is reused, so the value becomes 2 instead of resetting.',
      },
    ],
  },
  'react-render': {
    description: 'Tell apart a state update, a render, DOM changes and effects.',
    takeaway:
      'Render calculates the next UI. Commit applies the DOM changes that are needed. Not every render changes the DOM, and concurrent rendering work can be restarted or discarded.',
    frames: [
      {
        explanation:
          'The button shows 0 in the browser. The component’s current state snapshot is count = 0.',
      },
      {
        explanation:
          'The click handler enqueues an updater. The count snapshot of the running handler is not mutated.',
      },
      {
        explanation:
          'React processes the queued update and calls the function with the new state. Render must stay pure.',
      },
      {
        explanation:
          'React compares with the previous output and updates the text. The whole DOM is not recreated.',
      },
      {
        explanation:
          'The browser can paint the updated pixels. Passive effects run after commit; interaction effects may run before paint. Development Strict Mode adds extra checks.',
      },
    ],
  },
  'java-memory': {
    description: 'Trace references, aliases of one object, and reachability.',
    takeaway:
      'Assigning a reference copies the reference, not the object. An unreachable object becomes eligible for GC; immediate collection is not guaranteed. This is a simplified model of the JVM.',
    frames: [
      {
        explanation:
          'new Box(10) creates an object on the heap. The local reference a refers to that object.',
      },
      {
        explanation:
          'b = a copies the reference to the same object. No second Box object is created.',
      },
      {
        explanation:
          'After b.value = 20, a.value also observes 20, because both refer to one object.',
      },
      {
        explanation:
          'a = null removes only one reference. The object is still reachable through b.',
      },
      {
        explanation:
          'Assuming no other GC root reaches this object, the Box is now eligible for collection. When the GC actually runs is not decided by this example.',
      },
    ],
  },
  'request-flow': {
    description: 'Follow a request from React to a Java service and back to the response.',
    takeaway:
      'Every boundary has a role: authentication, validation, business rules, storage and serialization. A write must be designed to be idempotent before the network is allowed to retry it.',
    frames: [
      {
        explanation:
          'The client sets a loading state and sends an HTTPS request. Client validation is UX; server validation is still required.',
      },
      {
        explanation:
          'The configured security filters authenticate the credentials and check the applicable protections before the controller is called.',
      },
      {
        explanation:
          'DispatcherServlet finds the right handler. The controller validates the input DTO and calls the service.',
      },
      {
        explanation:
          'The service enforces business invariants. A properly proxied @Transactional boundary groups the database work into one transaction.',
      },
      {
        explanation:
          'On success the transaction commits and the response DTO is serialized. Exceptions need consistent mapping, and rollback rules depend on the transaction configuration.',
      },
    ],
  },
  caching: {
    description: 'Watch a cache miss, a hit, and invalidation after a write.',
    takeaway:
      'This is a serial happy-path example. A concurrent reader can refill a stale value even after invalidation. Choose versions, a TTL or stronger coordination to match the requirement.',
    frames: [
      {
        explanation:
          'The client asks for product:42. The cache misses, so the source of truth — the database — must be read.',
      },
      {
        explanation:
          'The database returned 500. Store it in the cache with a TTL and return it to the client.',
      },
      {
        explanation:
          'The next read of the same key can skip the database. Latency and database load both drop.',
      },
      {
        explanation:
          'The product price was updated to 600 in the database. After the successful write, invalidate the cached key.',
      },
      {
        explanation:
          'The next read fills in the new database value. In production, discuss races, stale reads, stampedes, TTL jitter and the failure policy.',
      },
    ],
  },
  'binary-search': {
    description: 'Shrink the search range and check every boundary.',
    takeaway:
      'Invariant: if the target is present, it lies inside [left, right]. The input must be sorted. Comparisons are O(log n) and extra space is O(1).',
  },
  sorting: {
    description: 'Watch every comparison and every swap of neighbouring elements.',
    takeaway:
      'After each complete pass, the maximum of the remaining elements has reached the end. Swapping only on > keeps equal elements in their relative order, so the algorithm stays stable.',
  },
  bfs: {
    description: 'Explore a graph with a cycle one layer of distance at a time.',
    takeaway:
      'Mark a vertex visited when you enqueue it. In an unweighted graph BFS gives the path with the fewest edges. A weighted graph needs a suitable algorithm; Dijkstra is one option for non-negative weights.',
  },
  'dynamic-programming': {
    description: 'Turn a repeated calculation into reusable subproblems.',
    takeaway:
      'First define the state, the recurrence, the base cases and the evaluation order. Fibonacci is a simple demo; ask the same questions in harder DP problems.',
  },
  'thread-sync': {
    description: 'See a lost update, then protect the shared update with a lock.',
    takeaway:
      'count++ is three steps: read, modify and write. Without synchronization both threads can read the same value and one increment is lost. A lock or AtomicInteger can make the shared update atomic; unrelated work does not become faster by itself.',
    frames: [
      {
        explanation:
          'count is 5 right now. Thread A and Thread B have both read it, but neither has written yet.',
      },
      {
        explanation:
          'Each thread computes 5 + 1 = 6 in its own local copy. Shared memory is still unchanged.',
      },
      {
        explanation:
          'A wrote 6, then B also wrote 6 (B never knew about A’s update). Two increments happened, but the result looks like one.',
      },
      {
        explanation:
          'Use a synchronized block or a ReentrantLock. Thread A took the lock; B blocks on the same lock until A releases it.',
      },
      {
        explanation:
          'As soon as the lock is released B gets its turn, reads the fresh value (6) and writes 7. The correct result is guaranteed.',
      },
    ],
  },
  'gc-sweep': {
    description: 'Use reachability to see which objects survive a collection.',
    takeaway:
      'Objects reachable from the GC roots are marked; unmarked objects can be swept. This is a conceptual model. Real collectors are implemented differently and the exact collection time is not guaranteed.',
    frames: [
      {
        explanation:
          'root, root.child and an orphan object are allocated on the heap. For now each one is reachable through some reference.',
      },
      {
        explanation:
          'After orphan = null no variable points to #3. The object is still on the heap, but it is now unreachable.',
      },
      {
        explanation:
          'The collector starts at the GC roots and traverses the reachable graph. #1 and #2 are marked; no path leads to #3.',
      },
      {
        explanation:
          'The collector reclaims the unmarked memory (#3). Marked objects are left untouched. The application does not decide the exact collection time.',
      },
      {
        explanation:
          'Some collectors also compact the surviving objects to keep them contiguous, reducing fragmentation and keeping future allocation fast.',
      },
    ],
  },
  'aggregation-pipeline': {
    description: 'Watch documents pass through match, group and sort.',
    takeaway:
      'Every stage takes the previous stage’s output. An early $match sends fewer documents onward, but move it only when the result keeps the same meaning. A filter on a group’s calculated total cannot be applied directly to the original documents.',
    frames: [
      { explanation: 'The orders collection holds documents with both paid and pending status.' },
      {
        explanation:
          'Only the status: "paid" documents reach the next stage. The pending document is dropped right here.',
      },
      {
        explanation:
          'Documents with the same _id (customerId) are combined into one group; the $sum accumulator maintains the total.',
      },
      {
        explanation:
          'The result is sorted by total in descending order. The original insertion order of the grouped documents is no longer relevant.',
      },
      {
        explanation:
          'Use explain("executionStats") to see which stage examines the most documents. The earlier $match sits in the pipeline, the less data is carried downstream; a supporting index on the $match field helps here too.',
      },
    ],
  },
  'recursion-stack': {
    description: 'Watch call frames being created and then removed as calls return.',
    takeaway:
      'Every recursive call has its own n and its own stack frame. The calls stop at the base case, then values return in reverse order. A wrong or missing base case can overflow the stack.',
    frames: [
      {
        explanation:
          'n = 4 and the base case (n <= 1) is false, so factorial(3) is called. The frame of factorial(4) waits on the stack.',
      },
      {
        explanation:
          'Each call pushes its own frame. On reaching factorial(1) the base case is true — no further call.',
      },
      {
        explanation:
          'factorial(1) returned 1. factorial(2) now computes 2 * 1 = 2 and pops its frame.',
      },
      { explanation: 'factorial(3) uses its child’s result (2) and returns 3 * 2 = 6.' },
      {
        explanation:
          'factorial(4) = 4 * 6 = 24. The stack is now empty. The depth was n, so this naive recursion uses O(n) space.',
      },
    ],
  },
  'outbox-pattern': {
    description: 'Save the data and the event together, then publish through a relay.',
    takeaway:
      'The business row and the event to be published are saved in the same local transaction. A relay crash or retry can publish a duplicate, so keep the consumer idempotent. This is an at-least-once pattern; exactly-once does not come for free.',
    frames: [
      {
        explanation:
          'The order row and the outbox event row are inserted inside the same ACID transaction. Both commit, or neither does.',
      },
      {
        explanation:
          'The order and its event now exist durably side by side. Application code does not have to track the broker’s success separately.',
      },
      {
        explanation:
          'A separate relay process reads pending outbox rows and publishes them to the broker. This is decoupled from the database write.',
      },
      {
        explanation:
          'The message was published, but the outbox row is still "pending" because the relay crashed before the update. On restart the relay will publish it again.',
      },
      {
        explanation:
          'A duplicate OrderCreated #42 can reach the consumer. The consumer checks a processed-IDs table or idempotency key and safely ignores the duplicate.',
      },
    ],
  },
  'context-flow': {
    description: 'See how consumers update when a shared context changes.',
    takeaway:
      'Context removes the need to pass props by hand at every level. When the provider’s value changes, the consumers of that context update. Non-consumers can still render because their parent rendered; Context does not skip them automatically. Split frequently changing values into separate contexts as needed.',
    frames: [
      {
        explanation:
          'The theme prop has to be passed by hand from App through Toolbar to ThemedButton, even though Toolbar never uses it.',
      },
      {
        explanation:
          'App exposes the value through ThemeContext.Provider. The components in between need to know nothing about this value.',
      },
      {
        explanation:
          'ThemedButton calls useContext(ThemeContext) and receives the value directly, bypassing Toolbar.',
      },
      {
        explanation:
          'The user toggles the theme. The Provider re-renders with a new value ("light").',
      },
      {
        title: 'Context consumers update',
        explanation:
          'ThemedButton and the other consumers receive the new value. Toolbar does not read the context, so it gets no direct context update. It can still render because its parent rendered; skipping needs a suitable bailout such as memo with equal props.',
        lanes: [
          { name: 'Toolbar', items: ['no direct context update; may render via its parent'] },
          { name: 'ThemedButton', items: ['re-renders with "light"'] },
        ],
      },
    ],
  },
  'mongo-index': {
    description: 'Compare scanning documents with an index lookup.',
    takeaway:
      'The sorted-array lookup is only a teaching example; MongoDB uses B-tree indexes. An index takes storage and adds work to every write. For real performance, read the explain plan.',
  },
  'react-identity': {
    description: 'See why a draft lands on the wrong row, and how stable keys fix it.',
    takeaway:
      'A key tells React the identity of siblings under the same parent. A stable entity ID keeps the right entity’s state through a reorder. Change the key and that component starts again with fresh state.',
    frames: [
      {
        title: 'Two rows — keys from position',
        explanation:
          'The Editors for A and B each hold their own local draft. Right now the keys are the positions 0 and 1.',
      },
      {
        title: 'Delete A from the data',
        explanation:
          'With A deleted, B became the first item. Its index key went from 1 to 0, even though the entity is still B.',
      },
      {
        title: 'The position key kept the wrong draft',
        explanation:
          'React reuses the Editor with key 0 for B. Its local draft state belongs to the old A editor, so the wrong draft is shown.',
      },
      {
        title: 'Replay with stable entity keys',
        explanation:
          'Now use the entity IDs A and B as keys. The example is the same; identity no longer depends on position.',
      },
      {
        title: 'Delete A again',
        explanation: 'Under the same parent, B’s key stays B, so its own local state survives.',
      },
    ],
  },
  'transaction-race': {
    description: 'Compare a read-then-write race with an atomic conditional claim.',
    takeaway:
      'Protect the invariant in the shared database. A transaction wrapper alone, or a lock inside one Java instance, does not solve every read-then-write race.',
    frames: [
      {
        title: 'One seat, two buyers',
        explanation:
          'The two requests arrived on different API instances. The shared database has stock = 1.',
      },
      {
        title: 'Both read the available stock',
        explanation:
          'Having run SELECT first, both callers see one seat available. Nobody has written yet.',
      },
      {
        title: 'Both wrote the zero they had calculated',
        explanation:
          'There is no extra invariant or conflict check. Both write their pre-calculated stock = 0 and create an order. One seat now has two bookings.',
      },
      {
        title: 'Reset: claim with one conditional statement',
        explanation:
          'Both run UPDATE ... WHERE stock > 0. This is a simplified model of PostgreSQL’s Read Committed row-update behaviour.',
      },
      {
        title: 'A claims the row; B waits',
        explanation:
          'A sets the stock to zero and writes the reservation in the same transaction. B has to wait to update this row concurrently.',
      },
      {
        title: 'B re-checks; its claim fails',
        explanation:
          'Once A commits, B re-checks the condition on the updated row. stock > 0 no longer matches; B returns "sold out".',
      },
    ],
  },
  'monotonic-stack': {
    description: 'Watch pending candidates leave the stack at most once each.',
    takeaway:
      'The total work of a nested loop can still be linear. Every index is pushed once and popped at most once. An equal temperature is not warmer, so it stays pending.',
  },
  'two-pointers': {
    description:
      'Move pointers in from both ends of a sorted array and discard one candidate per step.',
    takeaway:
      'Two pointers only works when an order (here, a sorted array) tells you which pointer is safe to move. Every step eliminates a candidate for good, so the work is O(n) instead of O(n²) pairs.',
  },
  'sliding-window': {
    description: 'Slide a fixed-size window: one value out, one in — never the whole sum again.',
    takeaway:
      'Only two values change when the window slides, so every window is updated in O(1). This is a fixed-size window; in a variable-size window you advance the left pointer when the condition breaks.',
  },
  dfs: {
    description: 'Follow one path to its end, then backtrack and take the next.',
    takeaway:
      'DFS needs a stack — in recursion, the call stack is that stack. A graph with cycles needs a visited set. If you need the shortest path, use BFS on an unweighted graph.',
  },
  'tree-traversal': {
    description: 'Left, node, right — and watch a BST hand back its values in sorted order.',
    takeaway:
      'Inorder = left subtree, node, right subtree. In a BST everything on the left is smaller and everything on the right is larger, so the inorder output is sorted. A skewed tree can have height n, and then the stack space is O(n).',
  },
  'linked-list-reversal': {
    description: 'Flip one link at a time with prev, curr and next.',
    takeaway:
      'You must save next before flipping the link, or the path to the rest of the list is lost. When the loop ends, prev is the new head — not curr.',
  },
  'heap-insert': {
    description: 'Append the new element, then compare with the parent and lift it.',
    takeaway:
      'A heap is not fully sorted — it only keeps the rule parent ≤ children. That is why insert and remove-min are O(log n) and peeking at the minimum is O(1). In the array, the children of index i sit at 2i + 1 and 2i + 2.',
  },
  'hash-collisions': {
    description: 'Watch keys land in buckets, collide, and form chains.',
    takeaway:
      'A hash table’s O(1) is an average, not a guarantee. A good hash spreads keys across buckets; a bad hash or a high load factor lengthens the chains and pushes lookups towards O(n). Java’s HashMap turns a very long bucket into a tree.',
  },
  'token-bucket': {
    description: 'Watch tokens refill, a burst go through, and a 429 on an empty bucket.',
    takeaway:
      'Capacity sets the burst size and the refill rate sets the long-run average. Decide first which key the limit applies to (user, IP, API key). In a distributed setup the read-modify-write must be atomic, or two servers will hand out the same token twice.',
  },
  'hoisting-tdz': {
    description: 'Follow var, let and a function declaration from creation to execution.',
    takeaway:
      'Declarations are registered at the start of their scope, but initialization is separate: var starts as undefined, let/const stay in the TDZ until their line, and a function declaration is ready with its whole body. A function expression follows the rule of its variable.',
    frames: [
      {
        title: 'Creation phase: bindings are registered',
        explanation:
          'Before any code runs, the engine registers the declarations of the scope. var gets undefined, the let binding exists but stays uninitialized, and the function declaration is fully ready.',
      },
      {
        explanation:
          'The binding a exists and its value is undefined for now. So there is no error — the value simply has not been assigned yet.',
      },
      {
        title: 'var a = 1 is assigned now',
        explanation: 'The declaration already happened; this line only performs the assignment.',
      },
      {
        title: 'console.log(b) is inside the TDZ',
        explanation:
          'The binding b exists, but reading it before the let b line is forbidden. The engine throws a ReferenceError, which is caught and logged here.',
      },
      {
        title: 'let b = 2: the TDZ ends',
        explanation:
          'b is initialized when its declaration line runs. From here on it reads like any normal variable.',
      },
      {
        title: 'sayHi() would work even before its declaration',
        explanation:
          'A function declaration is bound with its whole body during the creation phase, so it can be called from anywhere in the file.',
      },
    ],
  },
  'prototype-chain': {
    description: 'Watch a property being searched from the object up through its prototypes.',
    takeaway:
      'A read walks up the chain until the property is found or null is reached. A write (of a normal data property) always lands on the object itself — it does not change the prototype, it only shadows it. The class syntax is built on this same mechanism.',
    frames: [
      {
        title: 'Three objects, one chain',
        explanation:
          'The [[Prototype]] of dog is animal, and that of animal is Object.prototype. The chain ends at null.',
      },
      {
        explanation:
          'The engine checks the object’s own properties first. barks is on dog itself, so the lookup stops right here.',
      },
      {
        title: 'dog.eats — one level up',
        explanation:
          'dog has no eats. The engine follows [[Prototype]] to animal and finds the value there.',
      },
      {
        title: 'dog.toString — two levels up',
        explanation:
          'Neither dog nor animal has toString. The lookup reaches Object.prototype — which is why almost every object has these methods.',
      },
      {
        title: 'dog.fly — end of the chain, undefined',
        explanation:
          'fly was not found anywhere on the chain and the next prototype is null. Reading a missing property gives undefined, not an error.',
      },
      {
        explanation:
          'The assignment creates a new own property on dog. animal.eats is still true; dog’s own eats hides (shadows) it.',
      },
    ],
  },
  'debounce-throttle': {
    description: 'See on a timeline how debounce and throttle call for the same events.',
    takeaway:
      'Debounce waits for quiet — right for a search box. Throttle calls at a fixed rate during ongoing activity — right for scroll or resize. This is a trailing debounce and a leading throttle; the leading/trailing options of libraries change the behaviour.',
    frames: [
      {
        title: 't = 0 ms: the first event',
        explanation:
          'Debounce starts a 300 ms timer. The leading throttle runs the call immediately and opens a 300 ms window.',
      },
      {
        title: 't = 100 ms: the second event',
        explanation:
          'Debounce cancels the old timer and starts a new one. The throttle window is still open, so this event is dropped.',
      },
      {
        title: 't = 200 ms: the third event',
        explanation:
          'As long as events keep arriving, debounce never fires — its timer is reset every time.',
      },
      {
        title: 't = 300 ms: the fourth event',
        explanation:
          'It has been 300 ms since the last throttled call, so throttle calls again. The debounce timer is reset once more.',
      },
      {
        title: 't = 600 ms: debounce fires after the quiet',
        explanation:
          'No new event arrived for 300 ms. Debounce now makes one call — with the arguments of the latest event (#4).',
      },
      {
        title: 't = 900 ms: a single event',
        explanation:
          'Throttle calls immediately because the window has closed. Debounce will wait 300 ms again.',
      },
      {
        title: 't = 1200 ms: the final count',
        explanation:
          'There were 5 events. Debounce made 2 calls (one after each pause), throttle made 3 (at most one per 300 ms).',
      },
    ],
  },
  'effect-lifecycle': {
    description: 'Setup, skip and cleanup of an effect — from mount to unmount.',
    takeaway:
      'Think of an effect not through the component’s lifecycle but as starting and stopping synchronization: setup starts it, cleanup stops it. When a dependency changes, the cleanup with the old values runs first, then the setup with the new values.',
    frames: [
      {
        title: 'Mount: setup after commit',
        explanation:
          'React first renders and commits the DOM. After that the effect’s setup runs and connects to the "general" room.',
      },
      {
        title: 'Re-render, same dependency',
        explanation:
          'The component rendered again because of its parent, but roomId is the same. React compares the dependencies and skips the effect.',
      },
      {
        title: 'The dependency changed: cleanup first',
        explanation:
          'roomId became "travel". After the commit, React first runs the old effect’s cleanup with the old value.',
      },
      {
        title: 'Then setup with the new value',
        explanation:
          'After the cleanup, a new setup runs with the new roomId. Each render’s effect sees the values of its own render.',
      },
      {
        title: 'Unmount: the final cleanup',
        explanation:
          'The component left the screen. React runs the last effect’s cleanup so the connection is not left open.',
      },
      {
        title: 'The extra cycle of development Strict Mode',
        explanation:
          'In development, Strict Mode runs one extra setup → cleanup on mount. If the cleanup is right the user sees no difference; if they do, a cleanup is missing.',
      },
    ],
  },
  'navigation-stack': {
    description:
      'See how screen history changes on push, back, a tab switch, a deep link and replace.',
    takeaway:
      'A stack is a pile of plates: push puts a screen on top, back removes the top one. Each tab has its own pile, which stays as it was when you switch away. When arriving through a deep link, keep a screen below it with an initial route, and use replace where going back makes no sense (after login or payment).',
    frames: [
      {
        title: 'App opens on the Home tab',
        explanation:
          'The root has two tabs: Home and Orders. Each tab keeps its own history. Home is showing; the Orders stack holds only the list screen.',
      },
      {
        title: 'Switch to the Orders tab',
        explanation:
          'Switching tabs does not close Home — it waits behind, keeping its scroll position and state. The top screen of the Orders stack is now showing.',
      },
      {
        explanation:
          'The detail screen is placed on top of the stack. The list underneath is not unmounted, only covered. Back now means removing this top screen.',
      },
      {
        explanation:
          'The top screen is removed and unmounted. The list underneath shows again with the same state — it does not have to load again.',
      },
      {
        explanation:
          'The app was closed and a notification link opened the detail directly. Without the list underneath, back would close the app. An initial route puts the list below it in the stack.',
      },
      {
        explanation:
          'The session expired. replace swaps the top screen instead of adding a history entry — after logging in, back does not return to the expired detail.',
      },
    ],
  },
  'spring-proxy': {
    description:
      'See how a @Transactional call goes through the proxy — and why this.method() does not.',
    takeaway:
      'Spring implements @Transactional, @Async and @Cacheable with a proxy standing in front of the bean. A call from outside passes through the proxy; this.method() inside the class calls the real object directly and the advice is skipped. Put the transaction boundary on the method that is called from outside, or move the logic into a separate bean.',
    frames: [
      {
        title: 'Startup: the container creates a proxy',
        explanation:
          'Seeing a @Transactional method, Spring places a proxy in front of the real OrderService. What gets injected into the controller is the proxy, not the real object.',
      },
      {
        explanation:
          'The call passes through the proxy. The proxy first opens a transaction, then runs the real place().',
      },
      {
        title: 'A RuntimeException inside place()',
        explanation:
          'The exception travels back to the proxy. By default a runtime exception causes a rollback, so both the order and the stock change are undone.',
      },
      {
        explanation:
          'placeAll has no @Transactional, so the proxy forwards the call without a transaction.',
      },
      {
        title: 'this.place(order): a self-call',
        explanation:
          'From inside, this.place() calls the real object directly — the proxy never sees it, so @Transactional does nothing here. Each repository call commits on its own; if the third order fails, the first two are not undone.',
      },
      {
        title: 'Fix: put the boundary on the outer method',
        explanation:
          'Make placeAll @Transactional (or move place into a separate bean) so the call goes through the proxy. Now all the orders share one transaction: all commit or all roll back.',
      },
    ],
  },
  'stream-pipeline': {
    description: 'filter → map → findFirst: see elements pass one by one, and when the work stops.',
    takeaway:
      'A stream is lazy: intermediate operations only build the pipeline, and the terminal operation runs it. Each element goes through the whole pipeline one at a time, and a short-circuiting operation such as findFirst stops as soon as it has an answer. A stream can be consumed only once.',
    frames: [
      {
        title: 'The pipeline is built; nothing has run',
        explanation:
          'filter and map only add steps. Without a terminal operation (findFirst), not a single element is processed.',
      },
      {
        title: 'findFirst(): 5 comes in',
        explanation:
          'Elements go through the whole pipeline one by one, not stage by stage in a batch. 5 stops at the filter, because 5 > 10 is false.',
      },
      {
        title: '12 passes; map makes it 24',
        explanation:
          '12 > 10, so it moves on and map turns it into 24. findFirst has its first result.',
      },
      {
        title: 'Short-circuit: the rest are never touched',
        explanation:
          '8, 21 and 30 never reach the filter. On a large or infinite stream, this is the work that is saved.',
      },
      {
        title: 'Reuse the same stream? IllegalStateException',
        explanation:
          'A stream can be consumed only once; to run again, create a new stream from the source. The result is an Optional — handle the empty case with orElse or orElseThrow instead of get().',
      },
    ],
  },
  'reference-copy': {
    description:
      'See which of b = a, spread and structuredClone creates a new object and which shares an address.',
    takeaway:
      'A variable holds not the object but its address. b = a copies the address, spread copies only the outer level (inner arrays and objects stay shared), and structuredClone creates new objects at every level — it throws on functions and turns a class instance into a plain object.',
    frames: [
      {
        explanation:
          'Object #1 is created on the heap, and its tags array is a separate object #2. The variable a holds not the object but the address (reference) of #1.',
      },
      {
        explanation:
          'No new object is created. b gets the same address — a and b look at the same object.',
      },
      {
        explanation:
          'Spread creates a new outer object #3, but only the address of tags is copied — #2 is now shared by both objects. This is called a shallow copy.',
      },
      {
        explanation:
          'b and a are the same object #1, so a.name has become "Ravi" too. c is the separate object #3, so its name stays "Asha".',
      },
      {
        explanation:
          'c.tags is the same array #2 as a.tags — the shallow-copy trap. a.tags is now ["js", "react"] as well.',
      },
      {
        explanation:
          'A deep copy creates new objects at every level: #4 and its own array #5. Change anything in d now and a is not affected.',
      },
    ],
  },
  'sql-query-order': {
    description:
      'You write SELECT first, but the query starts at FROM — see the rows after each clause.',
    takeaway:
      'You write SELECT first, but the logical order is FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Row filters go in WHERE, group filters in HAVING; a SELECT alias works in ORDER BY but not in WHERE. The optimizer may reorder the actual work, but the result is always as if this logical order ran.',
    frames: [
      {
        explanation:
          'The query is written starting with SELECT, but the database first takes all the rows from FROM.',
      },
      {
        explanation:
          'Each row is checked on its own, before any grouping. o3 is cancelled, so it is removed. That is why an aggregate such as SUM cannot go in WHERE — the groups do not exist yet.',
      },
      {
        explanation: 'The remaining rows are grouped by customer, with a SUM for each group.',
      },
      {
        explanation: 'Now whole groups are filtered: B totals 200, so B is removed.',
      },
      {
        explanation:
          'The columns and the alias are created here. So the total alias does not work in WHERE (it did not exist yet), but it does work in ORDER BY.',
      },
      {
        explanation:
          'After sorting, the first two rows. A and C have the same total, so their order relative to each other is not guaranteed — for pagination add a tie-breaker: ORDER BY total DESC, customer_id.',
      },
    ],
  },
};

// A visual in the reader's language. Frame counts are fixed by the Hinglish original.
export function localizeVisual(visual, lang) {
  const english = lang === 'en' ? VISUALS_EN[visual.id] : null;
  if (!english) return visual;
  return {
    ...visual,
    description: english.description || visual.description,
    takeaway: english.takeaway || visual.takeaway,
    frames: visual.frames?.map((frame, index) => ({ ...frame, ...english.frames?.[index] })),
  };
}
