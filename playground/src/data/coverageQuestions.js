// Original questions linked to the repo coverage additions.
export const coverageQuestions = [
  {
    id: 'iq-coverage-01',
    track: 'javascript',
    noteId: 'javascript-testing-workflow',
    level: 'Intermediate',
    question:
      'Cart test mein expected total same production loop se calculate karna weak kyun hai?',
    answer:
      "- Dono implementations same mistake repeat kar sakti hain.\n- Expected 125×2 + 50×3 = 400 independently derive karo.\n- Empty cart, invalid quantity aur mutation cases separate contracts check karte hain\n- line coverage alone assertions ki quality nahi batati.",
    followUp: 'Agar function sirf first cart item return kare toh kaunsa test pakdega?',
    tags: ['coverage-practice', 'workflow'],
  },
  {
    id: 'iq-coverage-02',
    track: 'javascript',
    noteId: 'javascript-testing-workflow',
    level: 'Intermediate',
    question: 'Slow A aur fast B request ka test bina sleep ke kaise reproduce karoge?',
    answer:
      "- Controlled deferred promises do.\n- A start, B start, B resolve, phir A resolve karo.\n- Final visible/state result B hi hona chahiye.\n- Async completion await karo.\n- Actual network timeout par depend karne se test timing-dependent aur flaky ho sakta hai.",
    followUp: 'Unmount ke baad request resolve ho toh kaunsa resource contract check karoge?',
    tags: ['coverage-practice', 'workflow'],
  },
  {
    id: 'iq-coverage-03',
    track: 'react',
    noteId: 'react-testing-accessibility',
    level: 'Intermediate',
    question: 'React test mein accessible label query CSS class selector se kab zyada useful hai?',
    answer:
      "- Label query user-facing accessible name ka contract protect karti hai.\n- Internal styling class rename se user behavior nahi badalta.\n- Form input ko name se find, type aur submit karke visible status assert karo\n- hook state/setter calls ko implementation detail samjho.",
    followUp: 'jsdom mein passing test keyboard focus aur real CSS layout ka full proof kyun nahi?',
    tags: ['coverage-practice', 'accessibility'],
  },
  {
    id: 'iq-coverage-04',
    track: 'react',
    noteId: 'react-testing-accessibility',
    level: 'Intermediate',
    question: 'Form API fail hone par retry test mein kya observe karoge?',
    answer:
      "- Typed input bacha rahe, useful error aaye aur retry enabled ho.\n- Pending state ki duplicate submission policy verify karo.\n- First controlled rejection ke baad next controlled success par confirmation aaye.\n- Internal useState ko mock karne se real interaction behavior hide ho sakta hai.",
    followUp: 'Optimistic UI ho toh failed response par kaunsa extra assertion chahiye?',
    tags: ['coverage-practice', 'accessibility'],
  },
  {
    id: 'iq-coverage-05',
    track: 'java',
    noteId: 'java-type-metadata',
    level: 'Intermediate',
    question: 'Record mein List.copyOf ke baad bhi mutable element ka data badal sakta hai?',
    answer:
      "- Haan.\n- Copy list membership ko isolate karti hai, element objects ko recursively clone nahi.\n- Mutable element reference shared ho toh uske field ka change record se bhi dikhega.\n- Immutable element value types ya deliberate deep copy chahiye.\n- Strings wali list mein element immutability already useful hai.",
    followUp: 'Array ko record component banane par generated equality ko kaise verify karoge?',
    tags: ['coverage-practice', 'metadata'],
  },
  {
    id: 'iq-coverage-06',
    track: 'java',
    noteId: 'java-type-metadata',
    level: 'Intermediate',
    question: 'Apna @Audited annotation likhne se audit log automatically kyun nahi banta?',
    answer:
      "- Annotation metadata hai.\n- Compiler processor, runtime inspector ya framework interceptor ko usse read karke action implement karna hoga.\n- Runtime reflection ke liye runtime retention chahiye\n- target allowed placement define karta hai.\n- Proxy framework mein invocation ko proxy boundary cross karni pad sakti hai.",
    followUp: 'Typed interface enough ho toh reflection default choice kyun nahi hona chahiye?',
    tags: ['coverage-practice', 'metadata'],
  },
  {
    id: 'iq-coverage-07',
    track: 'java',
    noteId: 'java-schema-migrations',
    level: 'Intermediate',
    question: 'NOT NULL ke bina CHECK(progress BETWEEN 0 AND 100) null reject karega?',
    answer:
      "- PostgreSQL CHECK expression false hone par violation hai\n- null/unknown result constraint satisfy kar sakta hai.\n- Required progress ke liye NOT NULL plus range CHECK rakho.\n- API validation helpful hai, lekin scripts aur concurrent writers ke liye database constraint final shared guard hai.",
    followUp: 'Foreign key valid learner prove kare toh kya request authorized bhi hai?',
    tags: ['coverage-practice', 'migrations'],
  },
  {
    id: 'iq-coverage-08',
    track: 'java',
    noteId: 'java-schema-migrations',
    level: 'Intermediate',
    question: 'Rolling deployment mein column rename ko compatible steps mein kaise karoge?',
    answer:
      "- New column add, compatible writer deploy, resumable backfill, data verify aur reads switch karo.\n- Old binaries retire hone ke baad old column remove karo.\n- Backfill concurrent writes overwrite na kare.\n- App rollback aur data restoration alag plans hain\n- destructive step ko ordinary binary rollback reversible nahi banata.",
    followUp: 'Fresh-schema migration test ke alawa kaunsa upgrade fixture test chahiye?',
    tags: ['coverage-practice', 'migrations'],
  },
  {
    id: 'iq-coverage-09',
    track: 'spring-boot',
    noteId: 'spring-background-cache',
    level: 'Advanced',
    question:
      'Do Spring replicas same @Scheduled job run karein toh duplicate kaise handle karoge?',
    answer:
      "- Scheduler per process trigger de sakta hai.\n- Shared durable job ID aur atomic claim/lease use karo\n- completion record aur idempotent side effect rakho.\n- Lease expiry ke baad stale worker ab bhi alive ho sakta hai, isliye ownership/version checks important hain.\n- External provider idempotency absent ho toh duplicate-free delivery assume mat karo.",
    followUp: 'Worker side effect ke baad completion save karne se pehle crash kare toh kya hoga?',
    tags: ['coverage-practice', 'cache'],
  },
  {
    id: 'iq-coverage-10',
    track: 'spring-boot',
    noteId: 'spring-background-cache',
    level: 'Advanced',
    question: 'Tenant cache key mein sirf courseId rakhna dangerous kab hai?',
    answer:
      "- Tenants ke local course IDs overlap kar sakte hain.\n- Cached response wrong tenant ko mil sakta hai.\n- Key mein tenant plus resource identity do aur cache-hit path par authorization maintain karo.\n- Invalidation/TTL freshness policy hai\n- identity aur permission ki galti TTL se solve nahi hoti.",
    followUp: 'Commit ke baad eviction ke bawajood stale reader cache refill kaise kar sakta hai?',
    tags: ['coverage-practice', 'cache'],
  },
  {
    id: 'iq-coverage-11',
    track: 'mongodb',
    noteId: 'mongodb-testing-shutdown',
    level: 'Intermediate',
    question: 'Node integration tests mein listen(0) aur server factory kyun useful hain?',
    answer:
      "- Factory import ko listening side effect se alag rakhti hai.\n- Port zero OS se free port leta hai, parallel tests fixed port ke liye compete nahi karte.\n- Real HTTP response ka status, body aur headers verify karo, phir cleanup register karke server close karo.",
    followUp: 'Real database tests shared collection clear karein toh kaunsi race aa sakti hai?',
    tags: ['coverage-practice', 'shutdown'],
    topic: 'node',
  },
  {
    id: 'iq-coverage-12',
    track: 'mongodb',
    noteId: 'mongodb-testing-shutdown',
    level: 'Intermediate',
    question: 'SIGTERM par DB pool turant close karne se active requests kyun fail ho sakti hain?',
    answer:
      "- In-flight handlers DB use kar rahe ho sakte hain.\n- Pehle readiness/new work drain karo, server close initiate karke active work ko bounded grace do, phir owned pool close karo.\n- Deadline/hung work policy explicit rakho\n- upgraded sockets aur background jobs ka lifecycle separately manage karo.",
    followUp: 'Repeated shutdown signals par cleanup ko idempotent kaise rakhoge?',
    tags: ['coverage-practice', 'shutdown'],
    topic: 'node',
  },
  {
    id: 'iq-coverage-13',
    track: 'dsa',
    noteId: 'dsa-greedy-intervals',
    level: 'Intermediate',
    question: 'Earliest finish meeting rule weighted profit objective solve kyun nahi karta?',
    answer:
      "- Proof meeting count preserve karta hai, total profit nahi.\n- One long meeting profit 100 aur three compatible short meetings total 30 ho sakti hain.\n- Weighted variant mein sorted intervals, compatible predecessor aur take/skip DP use kar sakte ho\n- objective badla toh proof dobara chahiye.",
    followUp: 'Maximum count ke exchange argument ko apne words mein explain karo.',
    tags: ['coverage-practice', 'intervals'],
  },
  {
    id: 'iq-coverage-14',
    track: 'dsa',
    noteId: 'dsa-greedy-intervals',
    level: 'Intermediate',
    question: 'Half-open meetings ke same-time events mein end pehle kyun process karte hain?',
    answer:
      "- [1,4) time 4 ko occupy nahi karti, isliye [4,6) usi room mein start ho sakti hai.\n- Start pehle count karoge toh artificial overlap peak aa sakti hai.\n- Closed endpoints ya zero-duration semantics different ho toh ordering/validation contract adjust karo.",
    followUp: '[1,4), [4,6), [2,5) ke liye minimum rooms aur selected count kya hain?',
    tags: ['coverage-practice', 'intervals'],
  },
  {
    id: 'iq-coverage-15',
    track: 'dsa',
    noteId: 'dsa-tries-range-bits',
    level: 'Intermediate',
    question: 'Trie path present hone se exact word present kyun prove nahi hota?',
    answer:
      "- Path ca, car aur care ka shared prefix ho sakta hai.\n- Exact membership ke liye terminal marker chahiye.\n- car delete karte waqt care ka path preserve karo.\n- Prefix lookup ke baad suggestions enumerate karne ka cost output size par depend karega.",
    followUp: 'Large autocomplete response ko bounded kaise rakhoge?',
    tags: ['coverage-practice', 'bits'],
  },
  {
    id: 'iq-coverage-16',
    track: 'dsa',
    noteId: 'dsa-tries-range-bits',
    level: 'Intermediate',
    question: 'Fenwick add API se value assign karte waqt delta kyun calculate karte hain?',
    answer:
      "- Stored blocks mein increment propagate hota hai.\n- Old value 1 ko 6 karna hai toh delta 5 do, 6 nahi.\n- Assignment API current value separately track kar sakti hai.\n- Half-open range [l,r) ka sum prefix(r)−prefix(l) hai\n- min aggregate ke liye aisi subtraction generally valid nahi.",
    followUp:
      'JavaScript bitwise operators ki width huge index/mask design ko kaise affect karti hai?',
    tags: ['coverage-practice', 'bits'],
  },
  {
    id: 'iq-coverage-17',
    track: 'system-design',
    noteId: 'system-design-consistency-limits',
    level: 'Advanced',
    question: 'Three local token buckets ka capacity 10 global capacity 10 kyun nahi hai?',
    answer:
      "- Har replica independent 10 initial credits rakhti hai, cluster 30 tak burst admit kar sakta hai.\n- Strict global budget ke liye shared atomic check-and-consume ya bounded quota allocation chahiye.\n- Store outage, quota redistribution aur hot-key load ke tradeoffs bhi define karo.",
    followUp: 'Limiter store timeout par login aur browse endpoints ki fallback policy same hogi?',
    tags: ['coverage-practice', 'limits'],
  },
  {
    id: 'iq-coverage-18',
    track: 'system-design',
    noteId: 'system-design-consistency-limits',
    level: 'Advanced',
    question: 'Read-your-writes aur atomic stock decrement alag guarantees kyun hain?',
    answer:
      "- Read-your-writes caller ko apni confirmed update observe karne deta hai.\n- Lekin two callers dono current stock=1 dekhkar separate writes karein toh race ab bhi possible hai.\n- Stock invariant conditional atomic update ya suitable transaction policy protect karti hai\n- fresh read alone enough nahi.",
    followUp:
      'Replica lag mein UI confirmed update disappear na dikhaye, kaunsa contract choose karoge?',
    tags: ['coverage-practice', 'limits'],
  },
];
