// Original interview scenarios, with references for the underlying concepts.
export const scenarioQuestions = [
  {
    id: 'iq-scenario-01',
    track: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Advanced',
    question: 'Calculation Promise.then mein hai phir bhi spinner freeze kyun?',
    answer:
      'Promise callback bhi same JS thread par chalti hai. Long calculation other work block karti hai; endless microtasks rendering delay bhi kar sakti hain. Substantial CPU work worker ko do ya bounded host-yielding tasks mein split karo. Total runtime ke saath responsiveness measure karo. Input change par old worker results ki ownership guard/cancellation policy rakho.',
    followUp: 'Inputs badalne par old worker result kaise cancel/ignore karoge?',
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
    question: 'A phir AB type par stale A kabhi visible na ho: flow design karo.',
    answer:
      'Har request ko increasing ID do; sirf current ID result commit kare. Old fetch abort karke work bachao, lekin later JSON/async processing ke liye ID guard bhi rakho. Cancellation ko real error se alag dikhao. Loading sirf current request clear kare; old completion nayi request ka spinner/result overwrite na kare.',
    followUp: 'Fetch cancel se pehle resolve lekin JSON baad mein finish ho toh?',
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
    question: 'Removed widget memory mein hai; handler investigate kaise karoge?',
    answer:
      'Heap snapshot ki retaining path dekho. Long-lived target listener closure aur captured widget data reachable rakh sakta hai. Exact callback remove ya listener lifecycle abort karo; owned timers bhi clear. Repeated mount/remove ke baad retained instances compare karo. Har closure leak hai assume mat karo; new arrow original callback identity nahi hai.',
    followUp: 'New arrow function se removeEventListener kyun fail hota hai?',
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
    question: 'Filtered props Effect se state mein copy ho rahi hain. Simplify kaise?',
    answer:
      'Filtered list render mein derive karo; state mein user-controlled filter rakho. Extra props→state synchronization cycle hat jaati hai. Calculation expensive measure ho tab memoize karo. External subscription jaisi synchronization mein Effect appropriate hai. Filter remote ho toh async request identity/loading/error aur stale-response handling bhi chahiye, sirf local derivation enough nahi.',
    followUp: 'Filter remote server par chale toh kya badlega?',
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
    question: 'Sorted editable table ka draft wrong row mein: diagnosis kya hai?',
    answer:
      'Index key state ko position se jodti hai. Sorting position ka record badalti hai, isliye draft other record par dikh sakta hai. Stable record IDs use karo; drafts row-local ya ID-keyed external store mein own karo. Active draft ke saath sort/delete test karo. Intentionally new editor identity ki key hi badlo, unrelated rows reset na karo.',
    followUp: 'New record ka editor reset karte hue other rows ka state kaise bachao?',
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
    question: 'Strict Mode two active socket listeners dikha raha hai. Effect guarantee kya ho?',
    answer:
      'Setup ek subscription own kare aur cleanup exactly wahi remove kare. Development extra setup-cleanup missing cleanup expose kar sakti hai. Cycle ke baad one listener, unmount ke baad zero verify karo. Ref se second setup suppress karna defect hide karta hai. Room change mein old room unsubscribe ke baad new room subscribe hona chahiye.',
    followUp: 'Connected room ID badle toh cleanup kaise hogi?',
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
    question: 'HashMap customer key hai lekin update ke baad get null: kyun?',
    answer:
      "Insertion ke baad equals/hashCode fields change hui toh lookup different bucket search kar sakta hai. Stable immutable key identity aur consistent equals/hashCode rakho. Mutable Customer ke bajay customer ID key better hai. Small mutation reproduction se prove karo. Unmodifiable map wrapper entries modification rokta hai, referenced customer object's fields automatically freeze nahi karta.",
    followUp: 'Unmodifiable map view customer-key mutation rokta hai?',
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
    question: 'Two checkouts stock=1 read karti hain. Both success kaise rokoge?',
    answer:
      'Write mein invariant include karo: stock positive ho tab decrement, affected rows check; ya suitable locking/version transaction use karo. Transaction wrapper alone read-modify-write serialize guarantee nahi. Conflict retry behavior define aur external payment long-held DB lock ke bahar rakho. Stable purchase identity se retry previous reservation recover kare, stock dobara decrement nahi.',
    followUp: 'Retry ko pehle ki reservation kaise pata chalegi?',
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
    question: 'Concurrency badhane par DB timeouts badhe. Pehle kya change karoge?',
    answer:
      'Arrival rate, connection wait, query duration aur pool utilization compare karo. DB work downstream capacity ke according bound, deadlines enforce, excess reject ya bounded queue karo. More request threads more DB capacity nahi banati. Pool blindly badhane se pehle slow queries/transaction scope fix karo. Acquisition wait aur execution latency separate metrics rakho.',
    followUp: 'Pool wait versus SQL execution kaunsi metrics se separate karoge?',
    tags: ['concurrency', 'backpressure', 'connections'],
  },
  {
    id: 'iq-scenario-10',
    track: 'mongodb',
    noteId: 'mongo-node-runtime-http',
    level: 'Advanced',
    question: 'Async Node endpoint huge JSON parse karke other requests stall kyun karta hai?',
    answer:
      'Async syntax synchronous JSON parse ko event loop se bahar nahi bhejti. Payload size aur per-request computation bound karo. Heavy CPU ke liye bounded worker submission queue consider karo. CPU/event-loop delay/request latency measure karke DB waiting se distinguish karo. Worker count limited ho lekin queue unlimited ho toh memory/latency overload phir bhi possible hai.',
    followUp: 'Unlimited input queue ke saath worker pool bhi overload kyun hoga?',
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
      'Tenant feed tenantId filter, createdAt/_id sort karti hai. Index/cursor design karo.',
    answer:
      'tenantId leading equality aur matching directions mein createdAt/_id sort ka compound index try karo. Last pair cursor aur lexicographic boundary lo; ID timestamp ties break karta hai. Representative tenants ka actual plan/examined keys/docs verify karo. Index write/storage cost deta hai. Concurrent inserts cursor ko strict snapshot nahi banate; desired consistency explicitly define karo.',
    followUp: 'Concurrent inserts mein cursor strict snapshot se kaise alag hai?',
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
      'Two instances duplicate payment webhook process karti hain. Double update kaise roko?',
    answer:
      'Unique provider event ID durably store aur business transition dedup record ke saath atomic rakho. Webhook authenticate, order association validate aur durable handling ke baad ack karo. In-memory Set instances/restarts mein fail hai. Replay-safe effects aur reconciliation evidence rakho. Commit ke baad response lost ho toh repeated event existing outcome pehchaan kar no-op kare.',
    followUp: 'Commit ke baad HTTP success se pehle crash ho toh?',
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
    question: 'Negative numbers par exact-sum shrinking window kyun fail?',
    answer:
      'Usual shrinking rule nonnegative values mein add=sum badhe, remove=sum ghate par depend hai. Negatives direction todte hain. Arbitrary integer target-subarray count ke liye earlier prefix sums ki frequencies rakho; initial zero prefix include karo. Current prefix s par earlier s-target count add karo, phir s record karo, taaki valid start positions sahi gini jaayein.',
    followUp: '[1,-1,1], target 1 ka prefix-map trace aur total subarrays batao.',
    tags: ['sliding-window', 'prefix-sum', 'invariants'],
  },
  {
    id: 'iq-scenario-14',
    track: 'dsa',
    noteId: 'dsa-graphs',
    level: 'Advanced',
    question: 'Node first discovery par final karna kab valid hai?',
    answer:
      'Unweighted BFS layer order mein discovery minimum edge count establish karti hai. Weighted Dijkstra mein discovery enough nahi; priority queue se minimum current-distance entry nikle tab finalize, stale skip karo. Standard proof nonnegative weights maangti hai. Graph model pehle define karo: A→B=10 aur A→C→B=1+1 first-discovery weighted mistake dikhaata hai.',
    followUp: 'Three-node weighted counterexample do jahan later path shorter ho.',
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
    question: 'Same 1D knapsack array accidentally different problem kaise solve kar sakti hai?',
    answer:
      '0/1 knapsack mein capacities descending update current item ko same iteration mein reuse hone se rokti hai. Ascending newly updated state read karke unbounded reuse solve kar sakti hai. Weight2/value3/capacity4 mein ascending 6 dega; 0/1 answer 3 hai. Memory optimize se pehle state meaning batao aur small exhaustive reference se compare karo.',
    followUp: 'Weight 2/value 3/capacity 4 se difference dikhao.',
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
    question: 'Create-order commit ke baad timeout: client retry kya kare?',
    answer:
      'Caller-scoped idempotency key intent/payload se bind karo. Key aur state change atomic record; duplicate par saved outcome return karo. Different payload reuse reject aur retention define karo. Concurrent duplicates unique-key/transaction se coordinate hon. Timeout uncertain outcome hai, no-side-effect proof nahi; fresh key bana kar blindly create repeat mat karo.',
    followUp: 'Same-key identical requests concurrently aayein toh kya hoga?',
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
    question: 'Hot cache expire, thousands DB hits: recovery design karo.',
    answer:
      'Refresh coalesce karo, expiries spread aur refresh concurrency cap karo. Product allow kare toh bounded stale data serve karte hue one refresh chalao. Refresher ka timeout/failure policy rakho. DB protection cold/unavailable cache ke liye size karo, normal hit rate ke liye hi nahi. Inventory jaise authoritative decisions stale hint se confirm mat karo.',
    followUp: 'Kaunsa data stale serve nahi karoge aur UI kya bolegi?',
    tags: ['caching', 'resilience', 'stampede'],
  },
  {
    id: 'iq-scenario-18',
    track: 'system-design',
    noteId: 'design-realtime-case-study',
    level: 'Advanced',
    question: 'Chat reconnect mein gaps/duplicates bina recovery kaise?',
    answer:
      'Stable message IDs aur conversation sequence/cursor durably store karo. Last acknowledged position se retained events replay, IDs se dedup karo. Cursor retention se bahar ho toh resync path do. Replay/live handoff mein overlap dedup aur gap prevent karo. Ordering scope explicit ho; global total order separate aur often expensive requirement hai.',
    followUp: 'Replay aur live stream overlap kaise handle karoge?',
    tags: ['websocket', 'replay', 'ordering'],
  },
  {
    id: 'iq-scenario-19',
    track: 'javascript',
    noteId: 'js-conditionals',
    level: 'Intermediate',
    question: 'Fallback mein || ke bajay ?? kab use karoge?',
    answer:
      "|| every falsy value par fallback karta hai: 0,false,'' bhi. ?? sirf null/undefined par fallback karta hai. Valid zero bachana ho toh nullish fallback plus explicit numeric validation lo. NaN nullish nahi, isliye Number.isNaN/finite check alag chahiye. Missing aur invalid values ka contract clear rakho; convenient fallback data error hide na kare.",
    followUp: 'Zero allow karke NaN separately reject kaise karoge?',
    tags: ['conditionals', 'coercion'],
  },
  {
    id: 'iq-scenario-20',
    track: 'javascript',
    noteId: 'js-loops',
    level: 'Intermediate',
    question: 'Array remove karte hue index increment matches skip kyun karta hai?',
    answer:
      'Removal later elements left shift karti hai. Next i++ current position mein shift hua element skip karta hai. Index mutation mein backwards iterate karo ya filtered new result banao. Adjacent removable items se trace karo. Original array identity preserve karni hai ya new array allowed hai, caller contract define karo; filter extra result storage leta hai.',
    followUp: 'Adjacent removable values trace aur filter/in-place space compare karo.',
    tags: ['loops', 'arrays'],
  },
  {
    id: 'iq-scenario-21',
    track: 'react',
    noteId: 'react-jsx-props',
    level: 'Intermediate',
    question: 'Child prop object mutate kare toh problem kyun?',
    answer:
      'Props render ka read-only input hain. Object mutate karne se parent/shared data scheduled update ke bina badal sakta hai aur pure-render assumptions toot sakti hain. Callback se owner ko update request do. Changed nested path ke new objects banao; untouched siblings preserve karo. Isse updates traceable aur sharing predictable rehti hai.',
    followUp: 'Nested field update mein unrelated sibling objects kaise preserve karoge?',
    tags: ['props', 'jsx'],
  },
  {
    id: 'iq-scenario-22',
    track: 'react',
    noteId: 'react-routing-url-state',
    level: 'Intermediate',
    question: 'Product search ki kaunsi state URL mein rahegi?',
    answer:
      'Committed query, filters, sort/page jaise shareable navigation URL mein rakho. Temporary typing/focus local rahe agar navigation ke across preserve nahi chahiye. URL values parse/validate, incompatible page reset aur reload/Back/Forward test karo. Har keystroke history flood kare toh draft local ya history replace policy use karo; committed navigation deliberate entry bana sakti hai.',
    followUp: 'Har keystroke history entry ke bajay replace kab better hai?',
    tags: ['routing', 'url'],
  },
  {
    id: 'iq-scenario-23',
    track: 'react',
    noteId: 'react-query-supabase',
    level: 'Intermediate',
    question: 'Two tenants ek-doosre ka client cache dekhte hain. Kya inspect karoge?',
    answer:
      'Query key mein tenant/user aur all result-affecting inputs check karo. Identity change par sensitive caches partition/clear karo; old in-flight response ko new view mein commit mat hone do. Client isolation UX/cached-data boundary hai; backend every request independently tenant-authorize kare. Direct request UI bypass kar sakti hai, isliye cache key authorization substitute nahi.',
    followUp: 'Old request pending ho tab account switch test kaise?',
    tags: ['query', 'cache', 'supabase'],
  },
  {
    id: 'iq-scenario-24',
    track: 'java',
    noteId: 'java-language-foundations',
    level: 'Intermediate',
    question: 'int multiplication long ko assign karke bhi overflow kyun?',
    answer:
      'Dono operands int hon toh multiplication assignment se pehle int mein hoti hai. Pehle operand promote karo, jaise `1L * count * price`. Overflow reject chahiye toh checked arithmetic choose karo. Already overflowed intermediate ko long banana mathematical result restore nahi karta. Long bhi insufficient ho toh bounds/domain ke hisaab se bigger representation chahiye.',
    followUp: 'Correct result long range se bhi bada ho toh?',
    tags: ['types', 'casting'],
  },
  {
    id: 'iq-scenario-25',
    track: 'java',
    noteId: 'java-maven-testing',
    level: 'Intermediate',
    question: 'Test alone pass, Maven suite mein fail: debug kaise?',
    answer:
      'Shared rows, fixed ports, static mutable state, time assumptions aur cleanup order inspect karo. Same suite config reproduce; har resource isolate karo. Unique fixtures aur explicit lifecycle cleanup prefer karo. Parallel DB tests separate schemas/databases ya nonconflicting fixtures use karein. Sleeps race hide karte hain, correctness establish nahi; first interfering resource ka evidence nikalo.',
    followUp: 'Parallel DB integration tests independent kaise rakhoge?',
    tags: ['maven', 'testing'],
  },
  {
    id: 'iq-scenario-26',
    track: 'mongodb',
    noteId: 'mongo-auth-security',
    level: 'Intermediate',
    question: 'Valid token se other user order ID access ho raha hai. Missing check?',
    answer:
      'Authentication caller identify karti hai; object-level authorization is order ka access decide karti hai. Verified user/tenant se query/policy scope karo; privileged role exceptions explicit hon. Body userId ownership ka proof nahi. Cross-user read/write, privileged allowed case aur revoked membership test karo; ID badalne par private data/mutation leak nahi honi chahiye.',
    followUp: 'Cross-user, privileged aur revoked-membership integration cases kya honge?',
    tags: ['auth', 'authorization'],
  },
];
