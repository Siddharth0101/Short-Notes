import { advancedVisuals } from './advancedVisuals.js';

const lane = (name, items) => ({ name, items });
const frame = (title, explanation, lanes) => ({ title, explanation, lanes });
export const VISUALS = [
  {
    id: 'event-loop',
    name: 'The event loop',
    track: 'javascript',
    description: 'Follow the call stack, microtasks, and timer tasks.',
    icon: 'code',
    source: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model',
    code: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
    takeaway:
      'Synchronous code finishes first. At the microtask checkpoint, microtasks drain before the next timer task. A 0 ms timer does not run immediately.',
    frames: [
      frame(
        'Run the synchronous script',
        'console.log("A") abhi execute hota hai. Script is on the call stack.',
        [
          lane('Call stack', ['script', 'log A']),
          lane('Microtasks', []),
          lane('Timer tasks', []),
          lane('Console', ['A']),
        ],
      ),
      frame(
        'Schedule the timer',
        'Browser timer register karta hai. Delay complete hone par callback task queue mein eligible hoga; it cannot interrupt the script.',
        [
          lane('Call stack', ['script', 'setTimeout']),
          lane('Microtasks', []),
          lane('Timer tasks', ['log B (eligible after timer)']),
          lane('Console', ['A']),
        ],
      ),
      frame(
        'Queue a promise reaction',
        'Resolved promise ka .then callback microtask queue mein jaata hai, call stack par immediately nahi.',
        [
          lane('Call stack', ['script']),
          lane('Microtasks', ['log C']),
          lane('Timer tasks', ['log B']),
          lane('Console', ['A']),
        ],
      ),
      frame(
        'Finish synchronous code',
        'log D runs before either callback. Ab script complete ho gaya aur stack empty hai.',
        [
          lane('Call stack', []),
          lane('Microtasks', ['log C']),
          lane('Timer tasks', ['log B']),
          lane('Console', ['A', 'D']),
        ],
      ),
      frame(
        'Drain the microtask queue',
        'Microtask checkpoint par log C execute hota hai. Newly queued microtasks bhi next task se pehle drain hote hain.',
        [
          lane('Call stack', ['log C']),
          lane('Microtasks', []),
          lane('Timer tasks', ['log B']),
          lane('Console', ['A', 'D', 'C']),
        ],
      ),
      frame(
        'Run the eligible timer task',
        'Ab timer callback ko chance milta hai. Final output A → D → C → B.',
        [
          lane('Call stack', ['log B']),
          lane('Microtasks', []),
          lane('Timer tasks', []),
          lane('Console', ['A', 'D', 'C', 'B']),
        ],
      ),
    ],
  },
  {
    id: 'closures',
    name: 'Closures & memory',
    track: 'javascript',
    description: 'See how a function remembers its lexical environment.',
    icon: 'code',
    source: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    code: 'function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = createCounter();\nconsole.log(next()); // 1\nconsole.log(next()); // 2',
    takeaway:
      'Closure variable ki live binding retain karta hai, frozen copy nahi. A second createCounter() call creates a separate environment.',
    frames: [
      frame(
        'Call the factory',
        'createCounter apna lexical environment banata hai. count usi environment ki local binding hai.',
        [
          lane('Call stack', ['createCounter()']),
          lane('Lexical environment', ['count = 0']),
          lane('Global bindings', []),
        ],
      ),
      frame(
        'Return the inner function',
        'Factory return ho gayi, lekin returned function ka environment se link retained hai.',
        [
          lane('Call stack', []),
          lane('Retained environment', ['count = 0']),
          lane('Global bindings', ['next → function → environment']),
        ],
      ),
      frame(
        'Call next once',
        'Inner function count binding ko read aur update karta hai. Yeh naya factory call nahi hai.',
        [
          lane('Call stack', ['next()']),
          lane('Retained environment', ['count = 1']),
          lane('Output', ['1']),
        ],
      ),
      frame(
        'Call next again',
        'Same lexical environment reuse hota hai. Isliye value reset hone ke bajay 2 ho jaati hai.',
        [
          lane('Call stack', ['next()']),
          lane('Retained environment', ['count = 2']),
          lane('Output', ['1', '2']),
        ],
      ),
    ],
  },
  {
    id: 'react-render',
    name: 'React render & commit',
    track: 'react',
    description: 'Separate state updates, rendering, DOM work, and effects.',
    icon: 'react',
    source: 'https://react.dev/learn/render-and-commit',
    code: 'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>\n    {count}\n  </button>;\n}',
    takeaway:
      'Render calculates the next UI. Commit applies required DOM changes. A render does not necessarily change the DOM; concurrent rendering may restart or discard work.',
    frames: [
      frame(
        'Start with committed UI',
        'Button browser mein 0 display kar raha hai. Component state ka current snapshot count = 0 hai.',
        [
          lane('State snapshot', ['count = 0']),
          lane('Render output', ['<button>0</button>']),
          lane('Actual DOM', ['button: 0']),
        ],
      ),
      frame(
        'An event queues an update',
        'Click handler updater enqueue karta hai. Current running handler ka count snapshot mutate nahi hota.',
        [
          lane('Update queue', ['c => c + 1']),
          lane('Current snapshot', ['count = 0']),
          lane('Actual DOM', ['button: 0']),
        ],
      ),
      frame(
        'React renders the component',
        'React queued update process karke function ko new state ke saath call karta hai. Render must stay pure.',
        [
          lane('New state', ['count = 1']),
          lane('New render output', ['<button>1</button>']),
          lane('Actual DOM', ['button: 0']),
        ],
      ),
      frame(
        'Commit the necessary change',
        'React previous output se compare karke text update karta hai. Pura DOM recreate nahi hota.',
        [
          lane('New state', ['count = 1']),
          lane('Commit', ['update button text']),
          lane('Actual DOM', ['button: 1']),
        ],
      ),
      frame(
        'Browser paint and effect scheduling',
        'Browser updated pixels paint kar sakta hai. Passive effects run after commit; interaction effects may run before paint. Development Strict Mode adds extra checks.',
        [
          lane('Committed state', ['count = 1']),
          lane('Browser', ['paint updated button']),
          lane('Effects', ['cleanup/setup when dependencies change']),
        ],
      ),
    ],
  },
  {
    id: 'java-memory',
    name: 'Java references & the heap',
    track: 'java',
    description: 'Trace aliases, objects, and reachability.',
    icon: 'coffee',
    source: 'https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html',
    code: 'Box a = new Box(10);\nBox b = a;\nb.value = 20;\na = null;\nb = null;',
    takeaway:
      'Reference assignment copies a reference, not the object. Unreachable objects become eligible for GC; collection is not immediate or guaranteed at a particular time. This is a conceptual JVM model.',
    frames: [
      frame(
        'Allocate an object',
        'new Box(10) heap object create karta hai. Local reference a us object ko refer karti hai.',
        [lane('Method locals', ['a → object #1']), lane('Heap', ['#1 Box { value: 10 }'])],
      ),
      frame(
        'Copy the reference',
        'b = a same object ka reference copy karta hai. Dusra Box object create nahi hua.',
        [
          lane('Method locals', ['a → object #1', 'b → object #1']),
          lane('Heap', ['#1 Box { value: 10 }']),
        ],
      ),
      frame(
        'Mutate through an alias',
        'b.value = 20 ke baad a.value bhi 20 observe karega, because both refer to one object.',
        [
          lane('Method locals', ['a → object #1', 'b → object #1']),
          lane('Heap', ['#1 Box { value: 20 }']),
        ],
      ),
      frame(
        'Remove one reference',
        'a = null only ek reference remove karta hai. b se object abhi bhi reachable hai.',
        [
          lane('Method locals', ['a = null', 'b → object #1']),
          lane('Heap', ['#1 reachable via b']),
        ],
      ),
      frame(
        'Remove the final reference',
        'Assuming no other GC root reaches this object, Box ab collection ke liye eligible hai. GC kab run hoga is example se decide nahi hota.',
        [
          lane('Method locals', ['a = null', 'b = null']),
          lane('Heap', ['#1 unreachable / GC eligible']),
        ],
      ),
    ],
  },
  {
    id: 'request-flow',
    name: 'A Spring API request',
    track: 'system-design',
    description: 'Follow one request from React to a Java service and back.',
    icon: 'layers',
    source: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html',
    code: 'React → HTTP → Security filters\n  → DispatcherServlet → Controller\n  → Service (@Transactional)\n  → Repository → Database\n  ← DTO ← HTTP response ← React',
    takeaway:
      'Each boundary has a job: authenticate, validate, enforce business rules, persist, and serialize. Network retries need explicit idempotency design for writes.',
    frames: [
      frame(
        'React sends a request',
        'Client loading state set karta hai aur HTTPS request send karta hai. Client validation is UX; server validation still zaroori hai.',
        [
          lane('React', ['POST /orders']),
          lane('Java application', ['waiting']),
          lane('Database', ['idle']),
        ],
      ),
      frame(
        'Security filters inspect it',
        'Configured security filters authenticate credentials and enforce applicable protections before controller invocation.',
        [
          lane('React', ['loading']),
          lane('Security filters', ['authentication', 'access policy']),
          lane('Database', ['idle']),
        ],
      ),
      frame(
        'Dispatch and validate',
        'DispatcherServlet correct handler find karta hai. Controller input DTO validate karta hai aur service ko call karta hai.',
        [
          lane('DispatcherServlet', ['resolve handler']),
          lane('Controller', ['validate request DTO']),
          lane('Database', ['idle']),
        ],
      ),
      frame(
        'Execute the business operation',
        'Service business invariants enforce karta hai. Properly proxied @Transactional boundary database work ko transaction mein group karti hai.',
        [
          lane('Service', ['check inventory', 'create order']),
          lane('Repository', ['parameterized persistence']),
          lane('Database', ['transaction in progress']),
        ],
      ),
      frame(
        'Commit and return a response',
        'Success par commit hota hai; response DTO serialize hota hai. Exceptions need consistent mapping, and rollback rules depend on transaction configuration.',
        [
          lane('Database', ['commit']),
          lane('HTTP response', ['201 + order DTO']),
          lane('React', ['render success / update cache']),
        ],
      ),
    ],
  },
  {
    id: 'caching',
    name: 'Cache-aside & invalidation',
    track: 'system-design',
    description: 'Watch a cache miss, a hit, and a write invalidate data.',
    icon: 'database',
    source: 'https://redis.io/docs/latest/develop/get-started/data-store/',
    code: 'value = cache.get(key)\nif value is missing:\n  value = database.read(key)\n  cache.set(key, value, ttl)\nreturn value\n\n// On a successful write:\ndatabase.update(key, newValue)\ncache.delete(key)',
    takeaway:
      'This serial happy-path trace is not a consistency guarantee. A concurrent reader can repopulate stale data after invalidation; use versions, appropriate TTLs, or stronger coordination when required.',
    frames: [
      frame(
        'Request a missing cache key',
        'Client product:42 request karta hai. Cache miss milta hai, so source of truth database ko read karna hoga.',
        [
          lane('Client', ['GET product:42']),
          lane('Cache', ['empty / MISS']),
          lane('Database', ['price = 500']),
        ],
      ),
      frame(
        'Read and populate',
        'Database se 500 aaya. Cache mein TTL ke saath store karo aur client ko return karo.',
        [
          lane('Client', ['price = 500']),
          lane('Cache', ['product:42 = 500 + TTL']),
          lane('Database', ['read completed']),
        ],
      ),
      frame(
        'Next request hits the cache',
        'Same key ke next read par database skip ho sakta hai. Latency aur DB load reduce hote hain.',
        [
          lane('Client', ['price = 500']),
          lane('Cache', ['HIT → 500']),
          lane('Database', ['no read needed']),
        ],
      ),
      frame(
        'A write changes the truth',
        'Product price database mein 600 update hua. Successful write ke baad cached key invalidate karo.',
        [
          lane('Writer', ['update price = 600']),
          lane('Cache', ['delete product:42']),
          lane('Database', ['price = 600']),
        ],
      ),
      frame(
        'The next miss refills fresh data',
        'Next read new database value fill karta hai. Production mein races, stale reads, stampedes, TTL jitter aur failure policy discuss karo.',
        [
          lane('Client', ['price = 600']),
          lane('Cache', ['product:42 = 600 + TTL']),
          lane('Database', ['price = 600']),
        ],
      ),
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary search',
    track: 'dsa',
    description: 'Shrink the search space. Check every boundary.',
    icon: 'search',
    code: 'while (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (a[mid] === target) return mid;\n  if (a[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;',
    takeaway:
      'Invariant: if target exists, it is inside [left, right]. Input must be sorted. O(log n) comparisons and O(1) auxiliary space.',
  },
  {
    id: 'sorting',
    name: 'Bubble sort',
    track: 'dsa',
    description: 'Follow real comparisons and adjacent swaps.',
    icon: 'network',
    code: 'for (let end = a.length - 1; end > 0; end--) {\n  let swapped = false;\n  for (let j = 0; j < end; j++) {\n    if (a[j] > a[j + 1]) {\n      [a[j], a[j + 1]] = [a[j + 1], a[j]];\n      swapped = true;\n    }\n  }\n  if (!swapped) break;\n}',
    takeaway:
      'After every full pass, the largest remaining element reaches the end. Swap only on > to keep this algorithm stable.',
  },
  {
    id: 'bfs',
    name: 'Breadth-first search',
    track: 'dsa',
    description: 'Explore a cyclic graph, one distance layer at a time.',
    icon: 'network',
    code: 'const queue = [start];\nconst seen = new Set([start]);\nfor (let head = 0; head < queue.length; head++) {\n  const node = queue[head];\n  for (const next of graph[node]) {\n    if (!seen.has(next)) {\n      seen.add(next);\n      queue.push(next);\n    }\n  }\n}',
    takeaway:
      'Mark visited on enqueue. BFS gives shortest paths by edge count in unweighted graphs. Weighted edges need a suitable algorithm such as Dijkstra for nonnegative weights.',
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic programming',
    track: 'dsa',
    description: 'Turn repeated work into reusable subproblems.',
    icon: 'layers',
    code: 'const dp = [0, 1];\nfor (let i = 2; i <= n; i++) {\n  dp[i] = dp[i - 1] + dp[i - 2];\n}\nreturn dp[n];',
    takeaway:
      'Define the state, recurrence, base cases, and evaluation order. Fibonacci is a simple demo; the same process applies to many harder DP problems.',
  },
  {
    id: 'thread-sync',
    name: 'Threads racing a shared counter',
    track: 'java',
    description: 'See a lost update happen, then watch a lock fix it.',
    icon: 'network',
    source: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html',
    code: 'class Counter {\n  private int count = 0;\n  void increment() { count++; }\n}\n// Two threads call increment() concurrently.',
    takeaway:
      'count++ read-modify-write teen steps hai. Interleaved without synchronization, two threads can read the same value and one increment gets lost. A lock (or AtomicInteger) makes the sequence indivisible; it does not make unrelated work faster.',
    frames: [
      frame(
        'Both threads read the same value',
        'count abhi 5 hai. Thread A aur Thread B dono ne read kiya, lekin abhi tak koi likha nahi.',
        [
          lane('Shared memory', ['count = 5']),
          lane('Thread A', ['read count → 5']),
          lane('Thread B', ['read count → 5']),
        ],
      ),
      frame(
        'Both compute the same next value',
        'Har thread apne local copy mein 5 + 1 = 6 compute karta hai. Abhi tak shared memory unchanged hai.',
        [
          lane('Shared memory', ['count = 5']),
          lane('Thread A', ['local = 6']),
          lane('Thread B', ['local = 6']),
        ],
      ),
      frame(
        'Without a lock: one update is lost',
        'A ne 6 likha, phir B ne bhi 6 likha (B ko A ka update pata hi nahi tha). Do increments hue, lekin result sirf ek increment jaisa hai.',
        [
          lane('Shared memory', ['count = 6  (expected 7)']),
          lane('Thread A', ['wrote 6']),
          lane('Thread B', ['wrote 6 (overwrote A)']),
        ],
      ),
      frame(
        'With a lock: B must wait',
        'synchronized block ya ReentrantLock use karo. Thread A ne lock liya; B same lock par block ho jaata hai jab tak A release na kare.',
        [
          lane('Lock', ['held by Thread A']),
          lane('Thread A', ['read 5 → write 6 → unlock']),
          lane('Thread B', ['waiting for lock']),
        ],
      ),
      frame(
        'B proceeds on the updated value',
        'Lock release hote hi B ko turn milta hai aur ab woh fresh value (6) read karke 7 likhta hai. Correct result guaranteed hai.',
        [
          lane('Lock', ['released, then held by Thread B']),
          lane('Shared memory', ['count = 7']),
          lane('Thread B', ['read 6 → write 7 → unlock']),
        ],
      ),
    ],
  },
  {
    id: 'gc-sweep',
    name: 'Mark and sweep garbage collection',
    track: 'java',
    description: 'Watch reachability decide what survives a collection.',
    icon: 'coffee',
    source:
      'https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html',
    code: 'Node root = new Node("root");\nroot.child = new Node("child");\nNode orphan = new Node("orphan");\norphan = null; // no more references to it',
    takeaway:
      'GC roots (stack locals, static fields) se traverse karke jo reachable hai woh marked hota hai. Unmarked objects sweep ho jaate hain. This is a conceptual model — real collectors (generational, concurrent) differ in mechanism, and collection timing is never guaranteed.',
    frames: [
      frame(
        'Allocate objects on the heap',
        'root, root.child, aur ek orphan object heap par allocate hote hain. Abhi sab kisi na kisi reference se pahunch-ne-yogya hain.',
        [lane('GC roots', ['root (stack)']), lane('Heap', ['#1 root', '#2 child', '#3 orphan'])],
      ),
      frame(
        'Drop the last reference to one object',
        'orphan = null ke baad #3 ko koi variable point nahi karta. Object abhi bhi heap mein hai, but ab unreachable hai.',
        [
          lane('GC roots', ['root (stack)']),
          lane('Heap', ['#1 root', '#2 child', '#3 orphan (no referrer)']),
        ],
      ),
      frame(
        'Mark phase: traverse from roots',
        'Collector GC roots se start karke reachable graph traverse karta hai. #1 aur #2 mark ho jaate hain; #3 tak koi path nahi hai.',
        [
          lane('GC roots', ['root (stack)']),
          lane('Marked', ['#1 root', '#2 child']),
          lane('Unmarked', ['#3 orphan']),
        ],
      ),
      frame(
        'Sweep phase: reclaim the unmarked',
        'Unmarked memory (#3) collector reclaim karta hai. Marked objects untouched rehte hain. Exact collection time application se decide nahi hota.',
        [lane('Heap after sweep', ['#1 root', '#2 child']), lane('Reclaimed', ['#3 orphan freed'])],
      ),
      frame(
        'Compact (in collectors that compact)',
        'Kuch collectors surviving objects ko contiguous rakhne ke liye compact bhi karte hain, fragmentation kam karke future allocation fast rakhte hain.',
        [lane('Heap after compaction', ['#1 root', '#2 child (compacted)'])],
      ),
    ],
  },
  {
    id: 'aggregation-pipeline',
    name: 'An aggregation pipeline',
    track: 'mongodb',
    description: 'Follow documents through match, group, and sort stages.',
    icon: 'database',
    source: 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/',
    code: 'db.orders.aggregate([\n  { $match: { status: "paid" } },\n  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },\n  { $sort: { total: -1 } },\n]);',
    takeaway:
      'Har stage previous stage ka output leta hai aur next stage ko document stream deta hai — Array.prototype.map/filter/reduce chaining jaisa. Stage order matters: $match jitna jaldi lagao utna better, kyunki baad ke stages ko kam documents process karne padte hain.',
    frames: [
      frame(
        'Start with the raw collection',
        'orders collection mein paid aur pending dono status ke documents hain.',
        [
          lane('Input documents', [
            '{cust: A, status: paid, amount: 40}',
            '{cust: A, status: paid, amount: 25}',
            '{cust: B, status: pending, amount: 90}',
            '{cust: B, status: paid, amount: 60}',
          ]),
        ],
      ),
      frame(
        '$match filters the stream',
        'Sirf status: "paid" documents next stage tak pahunchte hain. pending document yahi drop ho jaata hai.',
        [
          lane('After $match', [
            '{cust: A, amount: 40}',
            '{cust: A, amount: 25}',
            '{cust: B, amount: 60}',
          ]),
          lane('Dropped', ['{cust: B, status: pending}']),
        ],
      ),
      frame(
        '$group collapses by customer',
        'Same _id (customerId) waale documents ek group mein combine hote hain; $sum accumulator total maintain karta hai.',
        [lane('After $group', ['{_id: A, total: 65}', '{_id: B, total: 60}'])],
      ),
      frame(
        '$sort orders the final result',
        'total descending order mein sort hota hai. Grouped documents ka ab koi original insertion order relevant nahi hai.',
        [lane('Final output', ['{_id: A, total: 65}', '{_id: B, total: 60}'])],
      ),
      frame(
        'Check the execution plan',
        'explain("executionStats") se dekho kaunsa stage sabse zyada documents examine karta hai. $match ko pipeline mein jitna pehle rakho utna kam data downstream carry hota hai; a supporting index on the $match field helps here too.',
        [
          lane('Metrics', [
            'input: 4 documents',
            'after $match: 3 documents',
            'after $group: 2 documents',
          ]),
        ],
      ),
    ],
  },
  {
    id: 'recursion-stack',
    name: 'The call stack during recursion',
    track: 'dsa',
    description: 'Watch frames stack up, then unwind with return values.',
    icon: 'layers',
    code: 'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nfactorial(4);',
    takeaway:
      'Har recursive call ka apna stack frame hota hai with its own n. Calls tab tak stack hote hain jab tak base case na mile; phir returns stack ko reverse order mein unwind karte hain, multiplying as they go. Missing/wrong base case → stack overflow.',
    frames: [
      frame(
        'Call factorial(4)',
        'n = 4, base case (n <= 1) false hai, so factorial(3) call hoti hai. factorial(4) ka frame stack par wait kar raha hai.',
        [lane('Call stack (top → bottom)', ['factorial(4), n=4 — waiting for factorial(3)'])],
      ),
      frame(
        'Keep calling until the base case',
        'Har call apna frame push karta hai. factorial(1) tak pahunchte hi base case true ho jaata hai — koi further call nahi.',
        [
          lane('Call stack (top → bottom)', [
            'factorial(1), n=1 — returns 1',
            'factorial(2), n=2 — waiting',
            'factorial(3), n=3 — waiting',
            'factorial(4), n=4 — waiting',
          ]),
        ],
      ),
      frame(
        'Unwind: factorial(2) resolves',
        'factorial(1) ne 1 return kiya. factorial(2) ab 2 * 1 = 2 compute karke apna frame pop karta hai.',
        [
          lane('Call stack (top → bottom)', [
            'factorial(2) returns 2 * 1 = 2',
            'factorial(3), n=3 — waiting',
            'factorial(4), n=4 — waiting',
          ]),
        ],
      ),
      frame(
        'Unwind: factorial(3) resolves',
        'factorial(3) apne child ka result (2) use karke 3 * 2 = 6 return karta hai.',
        [
          lane('Call stack (top → bottom)', [
            'factorial(3) returns 3 * 2 = 6',
            'factorial(4), n=4 — waiting',
          ]),
        ],
      ),
      frame(
        'factorial(4) returns the final answer',
        'factorial(4) = 4 * 6 = 24. Stack ab empty hai. Depth n thi, isliye space complexity O(n) hai is naive recursion ke liye.',
        [lane('Call stack', ['empty']), lane('Result', ['factorial(4) = 24'])],
      ),
    ],
  },
  {
    id: 'outbox-pattern',
    name: 'The transactional outbox',
    track: 'system-design',
    description: 'Persist a write and its event together, then relay safely.',
    icon: 'network',
    source: 'https://microservices.io/patterns/data/transactional-outbox.html',
    code: "db.transaction(() => {\n  orders.insert(order);\n  outbox.insert({ type: 'OrderCreated', payload: order });\n});\n// A separate relay polls the outbox and publishes, then marks it sent.",
    takeaway:
      'Database row aur "event to publish" same local transaction mein likhe jaate hain, so they cannot disagree. Relay crash/retry duplicate publish kar sakta hai — consumer ko idempotent/dedupe rehna hoga. This gives at-least-once delivery, not automatic exactly-once.',
    frames: [
      frame(
        'One transaction writes both rows',
        'Order row aur outbox event row same ACID transaction ke andar insert hote hain. Dono commit hote hain ya koi bhi nahi.',
        [
          lane('Database transaction', [
            'orders: insert order #42',
            'outbox: insert OrderCreated #42',
          ]),
          lane('Message broker', ['idle']),
        ],
      ),
      frame(
        'Commit succeeds atomically',
        'Order aur uska event ab durably saath-saath exist karte hain. Application code ko broker ka independent success track nahi karna padta.',
        [
          lane('Database', ['orders: #42 committed', 'outbox: #42 pending']),
          lane('Message broker', ['idle']),
        ],
      ),
      frame(
        'A relay polls and publishes',
        'Separate relay process pending outbox rows read karke broker ko publish karta hai. Yeh database write se decoupled hai.',
        [
          lane('Outbox', ['#42 pending → publishing']),
          lane('Message broker', ['receiving OrderCreated #42']),
        ],
      ),
      frame(
        'Relay crashes before marking sent',
        'Publish ho chuka, lekin outbox row abhi "pending" hi hai kyunki relay crash ho gaya update se pehle. Restart par relay isse dobara publish karega.',
        [
          lane('Outbox', ['#42 still marked pending']),
          lane('Message broker', ['already has one copy of #42']),
        ],
      ),
      frame(
        'Consumer must deduplicate',
        'Duplicate OrderCreated #42 consumer tak pahunch sakta hai. Consumer ek processed-IDs table/idempotency key check karke duplicate ko safely ignore karta hai.',
        [
          lane('Message broker', ['delivers #42 twice']),
          lane('Consumer', ['processed #42 once', 'second delivery: already seen, skip']),
        ],
      ),
    ],
  },
  {
    id: 'context-flow',
    name: 'Context vs. prop drilling',
    track: 'react',
    description: 'See who re-renders when shared state changes.',
    icon: 'react',
    source: 'https://react.dev/learn/passing-data-deeply-with-context',
    code: 'const ThemeContext = createContext("light");\nfunction Toolbar() {\n  return <ThemedButton />; // no theme prop needed\n}\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Save</button>;\n}',
    takeaway:
      'Context un components ko skip kar deta hai jo value use nahi karte — no manual prop passing through every level. But jab context value change hoti hai, har consuming component re-render hota hai, chahe woh value ka wahi hissa use kare ya nahi; large frequently-changing state ke liye isse memoized selectors ya state-management library se split karo.',
    frames: [
      frame(
        'Without context: prop drilling',
        'theme prop App se Toolbar se hote hue ThemedButton tak manually pass karna padta hai, even though Toolbar khud use nahi karta.',
        [
          lane('App', ['theme = "dark"']),
          lane('Toolbar (passthrough only)', ['receives theme, forwards it']),
          lane('ThemedButton', ['receives theme, uses it']),
        ],
      ),
      frame(
        'With context: a Provider wraps the tree',
        'App ThemeContext.Provider se value expose karta hai. Beech ke components ko is value ke baare mein kuch pata hone ki zaroorat nahi.',
        [
          lane('Provider', ['value = "dark"']),
          lane('Toolbar', ['renders children, no prop needed']),
          lane('ThemedButton', ['not yet reading context']),
        ],
      ),
      frame(
        'A descendant reads the context',
        'ThemedButton useContext(ThemeContext) call karta hai aur directly value receive karta hai, Toolbar ko bypass karke.',
        [
          lane('Provider', ['value = "dark"']),
          lane('Toolbar', ['unaffected — does not read context']),
          lane('ThemedButton', ['useContext → "dark"']),
        ],
      ),
      frame(
        'The Provider value changes',
        'User theme toggle karta hai. Provider ek naya value ("light") ke saath re-render hota hai.',
        [lane('Provider', ['value changes: "dark" → "light"'])],
      ),
      frame(
        'Every consumer re-renders — non-consumers do not',
        'ThemedButton (aur koi bhi aur consumer) re-render hota hai naye value ke saath. Toolbar, jo context read hi nahi karta, re-render skip kar sakta hai (props/state unchanged rehne par).',
        [
          lane('Toolbar', ['no re-render needed']),
          lane('ThemedButton', ['re-renders with "light"']),
        ],
      ),
    ],
  },
  {
    id: 'mongo-index',
    name: 'Database index lookup',
    track: 'mongodb',
    description: 'Compare scanning documents with seeking an index.',
    icon: 'database',
    source: 'https://www.mongodb.com/docs/manual/indexes/',
    code: 'db.products.createIndex({ sku: 1 });\ndb.products.find({ sku: 42 })\n  .explain("executionStats");\n// Compare totalKeysExamined, totalDocsExamined,\n// nReturned, and the winning plan.',
    takeaway:
      'The sorted lookup is a teaching analogy. MongoDB uses B-tree indexes, not this array algorithm. Indexes cost storage and write work; inspect real explain plans for actual performance.',
  },
  ...advancedVisuals,
];
