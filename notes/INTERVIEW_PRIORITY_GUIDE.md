# Interview priority guide — Hinglish mein samjho, solve karo, explain karo

Yeh repo ka focused final-revision route hai. **52 selected technical questions: 40 existing canonical questions reuse aur 12 gap-focused additions.** Answers neeche hain; pehle khud attempt karo. Full bank aur syllabus broader learning ke liye hain. “Priority” curriculum ke liye editorial selection hai, kisi company ka leaked/exact question bank ya measured frequency ranking nahi.

## Official guidance se priority kaise choose ki?

Amazon ki published preparation topics mein programming, data structures/algorithms, object-oriented design, databases, distributed computing, OS aur internet fundamentals hain. Isliye LLD aur OS/networking ko dedicated worked chapters diya. Role-specific scope recruiter se verify karo. [Amazon official topics](https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)

Microsoft ki guidance problem-solving, design, executable coding aur testing par emphasis deti hai; boundaries/error cases explain karna bhi important hai. Is guide mein sirf definition nahi, contract, failure case aur verification practice bhi hai. [Microsoft technical interview guidance](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)

Interview format, allowed tools, language aur role specialization alag ho sakte hain. AI/ML research ya network-engineering specialist interview ko is full-stack syllabus se fully covered mat samjho. Company name dekhkar answer ratne ke bajay actual job requirements map karo.

## Apne role ka route chuno

| Target | Pehle kya ready ho | Phir depth kahan badhao |
| --- | --- | --- |
| Frontend | JS async/closures, HTML/CSS/accessibility, React state/effects/keys, DSA | Machine coding, request races, testing, rendering/cache boundaries |
| Java backend | Java collections/equality/concurrency, SQL, REST/JPA/security, DSA | LLD, atomic writes, migrations, pool limits, system design |
| Node/backend | JS event loop, HTTP/streams, Mongo modeling/indexes/auth, DSA | Duplicate webhooks, bounded concurrency, shutdown aur recovery |
| General SWE | Strong language + core DSA + tests + OOP/OS/network fundamentals | Role-specific design aur project deep dive |
| Experienced SWE | Upar ka relevant base | Capacity, failure ownership, cross-team decisions, observed impact |

## Har technical answer ka structure

1. **Contract:** Input/output, constraints, identity aur assumptions clear karo.
2. **Simple baseline:** Correct brute force ya simple architecture pehle batao.
3. **Mechanism:** Invariant/state ownership se explain karo ki approach kyun kaam karti hai.
4. **Cost/tradeoff:** Runtime, memory, resource/consistency cost include karo.
5. **Verification:** Normal, empty/boundary, duplicate/concurrent aur failure case choose karo.
6. **Follow-up:** Requirement badle toh kaunsa part badlega? Guess ko assumption label karo.

“Map O(1)” ke baad expected hash behavior aur memory bolo. “Use Redis” ke baad atomic operation, shared budget aur outage policy bolo. “React memo” ke baad actual measured render cause bolo. Answer guide ko exact speech script mat banao.

## Coding prompts — question se implementation tak

| Drill | Related reading | Pass hone ka observable evidence |
| --- | --- | --- |
| Anagram/permutation window | [Patterns](dsa/04-problem-solving-patterns.md) | Empty/duplicate/emoji input; same symbol semantics aur honest conversion cost |
| Target-sum subarray count | [Patterns](dsa/04-problem-solving-patterns.md) | Signed values, prefix zero seed, frequency instead of boolean |
| Linked-list reversal/cycle | [Linear structures](dsa/02-linked-lists-stacks-and-queues.md) | Empty/single list, pointers preserved, cycle termination contract |
| Binary search boundary | [Search](dsa/05-searching-and-binary-search.md) | Missing target, duplicate boundary, shrinking interval proof |
| LRU cache | [Hashing](dsa/03-hash-tables-and-sets.md) | Update counts as access, capacity edge, list/map invariant |
| Graph traversal/dependencies | [Graphs](dsa/11-graphs-and-shortest-paths.md) | Cycle/disconnected nodes, correct visited timing, weighted-edge limitation |
| DP value + explanation | [DP](dsa/12-dynamic-programming.md) | State meaning, recurrence, base/evaluation order; 0/1 reuse rule |
| Searchable editable table | [React machine coding](react/11-machine-coding.md) | Stable row identity, latest request, keyboard path, retry |
| Concurrent loan claim | [LLD](java/19-low-level-design.md) | One copy/one active loan; old return cannot release new loan |

## Suggested 14-session final revision

Yeh session plan hai, interview-clear guarantee ya fixed calendar deadline nahi. Prerequisite weak ho toh syllabus par wapas jao; full beginner course ko 14 sessions mein compress mat karo.

| Sessions | Kaam | Deliverable |
| --- | --- | --- |
| 1–2 | Language/output tracing aur personal mistake list | 3 traced examples + corrected assumptions |
| 3–4 | Hashing, pointers/window, binary search | 3 implementations + independent expected results |
| 5–6 | Lists/trees/graphs/DP | 2 timed problems + edge cases/proof |
| 7–8 | Apne role ka frontend ya backend round | One machine-coding/API drill + failure test |
| 9–10 | SQL/concurrency/LLD ya frontend state/performance | State diagram, runnable piece, one race scenario |
| 11–12 | Design + OS/network diagnosis | Capacity estimate, bottleneck evidence, recovery plan |
| 13 | Project/behavioral mock | 3 real stories, contribution aur learning clear |
| 14 | Mixed mock aur weak-topic retry | Rubric-based next revision list |

## Behavioral aur project questions — original practice

**1. Kisi disagreement ko kaise resolve kiya?** Situation, shared goal, actual disagreement, tumhara action aur result batao. Strong answer doosre viewpoint ko fairly explain karta hai, evidence/experiment deta hai aur decision ka tradeoff accept karta hai. Sirf “maine convince kar diya” enough nahi. Follow-up: tum galat hote toh kaunsa evidence opinion badalta?

**2. Apni mistake ya failed approach batao.** Real incident/project lo. Tumhari responsibility, impact, immediate mitigation aur prevention explain karo. Team ko blame mat karo; invented outage/metric bhi mat banao. Practice simulation ho toh wahi label karo. Follow-up: correction ka test ya rollout evidence kya tha?

**3. Ambiguous requirement mein kaise proceed kiya?** Missing assumptions identify, stakeholder questions prioritize aur reversible small slice choose karo. Accepted contract record karo. Strong answer batata hai kaunsi uncertainty resolve hui aur kaunsi consciously pending rahi. Follow-up: deadline pressure mein kya cut kiya aur kyun?

**4. Customer impact versus technical perfection ka tradeoff?** User problem aur constraints pehle, options phir. Measured impact available ho toh baseline/time window do; nahi ho toh observed behavior/demo batao. Unsupported percentage use mat karo. Follow-up: deferred technical debt kab revisit karoge?

**5. Project mein exactly tumne kya own kiya?** Architecture/team output aur personal work separate karo. One feature ke request/data flow, failure case, hardest decision aur verification explain karo. Technology list ko contribution mat samjho. Follow-up: aaj rebuild karte toh kya change karte?

**6. Feedback mila aur approach badli?** Specific feedback, first reaction, revised action aur result batao. STAR (Situation, Task, Action, Result) organization tool hai; memorized dramatic story nahi. Result ke baad learning aur next application bata sakte ho. Follow-up: behavior change ka concrete example kya hai?

## Self-review — honest readiness check

Har attempt ko 0/1/2 do: concept, implementation/decision, testing/failure, explanation. 0 = unclear, 1 = hint chahiye, 2 = independently explain/reproduce. Unresolved correctness error ho toh total score ke bawajood topic revisit karo. Time pressure mein incomplete ho toh working part, missing part aur next step clearly communicate karo.

Original sources aur version assumptions related chapters mein hain. Neeche selected answers existing app bank se synchronized hain; bank mein edit hoga toh guide bhi regenerate karni hogi.

Review date: 2026-09-15. Full bank: 444 questions. Priority set: 52.

## Selected questions — seedha topic par jao

### JavaScript

- [Closure kya hai aur kahan useful hai?](#iq-js-02)
- [Regular aur arrow function ka this kaise decide hota hai?](#iq-js-03)
- [Sync code, promise callbacks aur timers kis order mein chalte hain?](#iq-js-04)
- [Promise.all aur allSettled kab choose karoge?](#iq-js-07)
- [Old search response ko new result overwrite karne se kaise rokoge?](#iq-js-10)
- [Maximum three active operations wala ordered async map banao. Tests kya prove karein?](#iq-lab-02)
- [Dropdown ka z-index 999999 hai phir bhi peeche hai. Debug kaise?](#iq-lab-03)
- [Clickable div mouse se chalta hai; button ke comparison mein kya missing hai?](#iq-lab-04)
### React

- [List mein stable keys kyun important hain?](#iq-react-02)
- [useEffect kab appropriate hai?](#iq-react-03)
- [memo, useMemo aur useCallback kab help karte hain?](#iq-react-06)
- [Safe optimistic updates kaise design karoge?](#iq-react-09)
- [50,000-row table responsive kaise banaoge?](#iq-react-12)
- [Good component test kya assert kare aur kya avoid kare?](#iq-react-20)
- [TanStack Query object key order aur manually JSON-stringified keys mein kya nuance hai?](#iq-final-12)
### Java

- [==, equals aur hashCode ka relation kya hai?](#iq-java-02)
- [volatile aur synchronized mein difference kya hai?](#iq-java-07)
- [Virtual threads kaunsi problem solve karti hain?](#iq-java-10)
- [Har customer ke two largest orders deterministic tie policy ke saath nikalo.](#iq-lab-11)
- [Rolling deployment mein column rename ko compatible steps mein kaise karoge?](#iq-coverage-08)
- [LLD mein class diagram se pehle physical copy aur book title kyun separate karoge?](#iq-final-01)
- [LoanStore interface ka implementation method signatures match karke bhi invalid kaise ho sakta hai?](#iq-final-02)
- [Old return request new borrow ko clear na kare: LLD mein kaunsi identity chahiye?](#iq-final-03)
- [Clock inject karna test trick se zyada design improvement kyun hai?](#iq-final-04)
### Spring Boot

- [Transactional ki guarantee aur common traps kya hain?](#iq-java-09)
- [JPA N+1 kya hai; pagination tode bina fix kaise?](#iq-added-spring-nplusone)
- [Competing updates mein optimistic/pessimistic locks ka difference?](#iq-added-spring-locking)
- [Transactional HTTP test DB rows chhod kyun sakta hai?](#iq-spring-testing)
### Node & MongoDB

- [MongoDB mein reference ke bajay embed kab karoge?](#iq-mongo-01)
- [Compound index mein field order kyun matter karta hai?](#iq-mongo-03)
- [Read concern, write concern aur read preference ka difference kya hai?](#iq-mongo-08)
- [Two instances duplicate payment webhook process karti hain. Double update kaise roko?](#iq-scenario-12)
- [Valid token se other user order ID access ho raha hai. Missing check?](#iq-scenario-26)
### Data structures & algorithms

- [Binary search correct terminate hoti hai, prove kaise karoge?](#iq-dsa-04)
- [BFS shortest path kab deta hai?](#iq-dsa-06)
- [Singly linked list constant extra space mein reverse kaise karoge?](#iq-dsa-08)
- [Nested monotonic-stack loop linear kaise ho sakta hai?](#iq-dsa-12)
- [Topological sort cycle kaise detect karta hai aur kahan useful hai?](#iq-dsa-17)
- [Prefix frequencies negative values ke target-sum subarrays kaise count karti hain?](#iq-added-dsa-prefix-count)
- [Expected O(1) LRU get/put design karo; invariants kya?](#iq-added-dsa-lru)
- [for...of characters count kare aur window string[index] use kare toh emoji case kyun fail ho sakta hai?](#iq-final-11)
### System design

- [System design interview start kaise karoge?](#iq-design-01)
- [Transactional outbox kyun use karte hain?](#iq-design-06)
- [Timeout, retry aur circuit breaker saath kaise work karte hain?](#iq-design-07)
- [Chat reconnect mein gaps/duplicates bina recovery kaise?](#iq-scenario-18)
- [RPO/RTO backup/disaster recovery ko kaise shape karte hain?](#iq-added-design-disaster-recovery)
- [SQL 10 ms hai, HTTP response 2 seconds: database ko blame karne se pehle kya measure karoge?](#iq-final-05)
- [TCP sender ke two writes receiver ke two reads kyun guarantee nahi karte?](#iq-final-06)
- [DNS resolve success ke baad bhi HTTPS call fail: layers ka diagnosis order kya hai?](#iq-final-07)
- [Heap stable lekin process RSS grow ho rahi hai: next hypotheses kya hain?](#iq-final-08)
- [Low CPU ke saath huge p99 latency aur growing queue kaise possible hai?](#iq-final-09)
- [200 requests/sec aur 250 ms average latency ko concurrency mein kaise translate karoge?](#iq-final-10)

## iq-js-02

**Closure kya hai aur kahan useful hai?**

[Pehle concept padho: Execution contexts scope and closures](javascript/09-scope-closures.md)

**Answer — reasoning samjho:**

- Closure function ko uske lexical environment ke bindings access karne deta hai, even jab outer function return ho chuka ho.
- Private counters, callbacks aur function factories mein useful hai
- captured bindings live hote hain, automatically frozen copies nahi.

- Har factory call ki apni binding hai.
- Pehla closure updated total yaad rakhta hai
- zero ki frozen copy nahi.
- Isliye a ki do calls ek total badhati hain, jabki b ka counter alag shuru hota hai.

```js
function makeTracker() {
  let minutes = 0;
  return amount => (minutes += amount);
}
const a = makeTracker(), b = makeTracker();
console.log(a(5), a(3), b(2)); // 5, 8, 2
```

**Follow-up — khud explain karo:** Closure expected se zyada memory kaise retain kar sakta hai?

## iq-js-03

**Regular aur arrow function ka this kaise decide hota hai?**

[Pehle concept padho: This binding prototypes and classes](javascript/13-this-prototypes-classes.md)

**Answer — reasoning samjho:**

- Regular function ka this call-site se decide hota hai: object method call, explicit call/apply/bind, constructor call, ya plain call.
- Arrow function apna this create nahi karta
- surrounding lexical scope ka this use karta hai, isliye bind se uska this replace nahi hota.

- Arrow ka apna arguments binding nahi hota aur use new ke saath call nahi kar sakte.
- Jab this invocation ke receiver se aana chahiye, regular function use karo.
- Example mein call normal ka this badalta hai, arrow ka lexical this nahi.

```js
const lesson = {
  minutes: 12,
  callbacks() {
    return {normal: function () { return this.minutes; }, arrow: () => this.minutes};
  }
};
const callbacks = lesson.callbacks();
console.log(callbacks.normal.call({minutes:99})); // 99
console.log(callbacks.arrow.call({minutes:99})); // 12
```

**Follow-up — khud explain karo:** Object method directly setTimeout ko doge toh kya hoga?

## iq-js-04

**Sync code, promise callbacks aur timers kis order mein chalte hain?**

[Pehle concept padho: Event loop promises and resilient fetching](javascript/15-async-event-loop.md)

**Answer — reasoning samjho:**

- Current synchronous execution pehle complete hota hai.
- Browser event loop phir microtask checkpoint par queued promise reactions drain karta hai
- eligible timer callback aage kisi task mein run hota hai, aur zero delay exact execution time guarantee nahi karta.

**Follow-up — khud explain karo:** Repeated microtasks rendering delay kar sakti hain?

## iq-js-07

**Promise.all aur allSettled kab choose karoge?**

[Pehle concept padho: Async patterns and bounded concurrency](javascript/16-async-patterns.md)

**Answer — reasoning samjho:**

- Promise.all tab useful hai jab sab results successful chahiye
- koi input reject hote hi combined promise reject hota hai.
- allSettled har input ka final outcome deta hai, aur dono mein remaining operations automatically cancel nahi hote.

**Follow-up — khud explain karo:** 1000 requests process karte waqt concurrency limit kaise rakhoge?

## iq-js-10

**Old search response ko new result overwrite karne se kaise rokoge?**

[Pehle concept padho: Event loop promises and resilient fetching](javascript/15-async-event-loop.md)

**Answer — reasoning samjho:**

- Har request ke saath sequence ID ya cleanup-owned active flag rakho aur sirf latest request ka result apply karo.
- AbortController unnecessary fetch ko cancel karne mein help karta hai, lekin stale-result guard phir bhi useful hai jab cancellation late ho ya downstream work cancelable na ho.

**Follow-up — khud explain karo:** Request replace ho toh loading/error state kya kare?

## iq-lab-02

**Maximum three active operations wala ordered async map banao. Tests kya prove karein?**

[Pehle concept padho: Async patterns and bounded concurrency](javascript/16-async-patterns.md)

**Answer — reasoning samjho:**

- Input index ke result slots allocate karo.
- Maximum three workers await se pehle synchronously next index claim karein
- previous mapper settle hone par next item lein.
- Fail-fast ya settle-all contract pehle decide karo.
- Reversed completion, rejection, empty input, invalid limit aur peak active calls test karo.
- Input result order aur completion order alag guarantees hain.

**Follow-up — khud explain karo:** Abort ke baad new jobs rok kar unstarted slots ka result kaise clear rakhoge?

## iq-lab-03

**Dropdown ka z-index 999999 hai phir bhi peeche hai. Debug kaise?**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Answer — reasoning samjho:**

- Pehle ancestor stacking contexts dekho.
- Dropdown apne context ke andar compete karta hai
- sibling ancestor poore subtree se upar ho sakta hai.
- Positioned z-index, transform, opacity inspect karo.
- Overlay ko deliberate top-level layer ya suitable platform primitive mein rakho.
- Sirf number badhane ke bajay clipping, focus aur positioning bhi verify karo.

- z-index apne stacking context ke andar stack level control karta hai: menus, overlays aur sticky headers mein kaam aata hai.
- Positioned element ka non-auto z-index, opacity below 1 ya transform naya context bana sakta hai.
- Flex/grid items bina position ke bhi z-index use kar sakte hain.
- Neeche panel ka context neighbor se neeche hai, isliye andar menu ka 100 neighbor ke 2 ko globally beat nahi karta.
- Ancestors inspect karo, consistent layer scale rakho aur zaroorat par suitable portal ya top-layer primitive chuno.

```css
.panel { position: relative; z-index: 1; }
.menu { position: absolute; z-index: 100; }
.neighbor { position: relative; z-index: 2; }
```

**Follow-up — khud explain karo:** Stack order change ke baad bhi overflow clipping kyun reh sakti hai?

## iq-lab-04

**Clickable div mouse se chalta hai; button ke comparison mein kya missing hai?**

[Pehle concept padho: HTML CSS and browser rendering essentials](javascript/11-browser-foundations.md)

**Answer — reasoning samjho:**

- Native button keyboard activation, focusability aur accessibility semantics deta hai.
- Action ke liye button, accessible name aur form ke andar intended type do.
- Role alone keyboard implement nahi karta.
- Enter, Space, disabled behavior aur visible focus test karo.
- Navigation location badalti hai toh anchor use karo
- extra custom interaction code ki need kam hogi.

**Follow-up — khud explain karo:** New page navigation ho toh element choice kya hogi?

## iq-react-02

**List mein stable keys kyun important hain?**

[Pehle concept padho: Components JSX and the render cycle](react/03-components-rendering.md)

**Answer — reasoning samjho:**

- Keys React ko siblings ke beech identity track karne mein help karte hain, taaki reorder ke baad correct state preserve ho.
- Array index dynamic insert/delete/reorder mein wrong identity map kar sakta hai
- render ke waqt random key banana har baar remount kara sakta hai.

**Follow-up — khud explain karo:** Key intentionally badalkar form reset kab karoge?

## iq-react-03

**useEffect kab appropriate hai?**

[Pehle concept padho: Effects refs and reusable synchronization](react/05-effects-custom-hooks.md)

**Answer — reasoning samjho:**

- Effect component ko external systems, jaise subscription, browser API ya network synchronization, se sync karta hai.
- Render se calculate hone wali value ko usually directly derive karo
- effect dependencies mein reactive inputs include karo aur setup ka matching cleanup do.

**Follow-up — khud explain karo:** Sirf props state mein copy karne wali effect kaise hataoge?

## iq-react-06

**memo, useMemo aur useCallback kab help karte hain?**

[Pehle concept padho: Performance suspense and production quality](react/10-performance-production.md)

**Answer — reasoning samjho:**

- memo unchanged props par component rendering skip karne ka optimization deta hai
- useMemo calculation result aur useCallback function identity cache karta hai.
- Ye correctness tools nahi hain: actual rendering cost profile karo, aur unstable object props ya context updates se cache benefit disappear ho sakta hai.

- useMemo calculated result cache karta hai
- useCallback function identity cache karta hai
- memo equal props par parent ki wajah se hone wala render skip kar sakta hai.
- Stable identity correctness ka substitute nahi.
- Relevant workload measure karo: state/context updates aur unstable inputs ab bhi kaam karwa sakte hain.
- Compiler-enabled build mein manual memoization ki zaroorat kam ho sakti hai.

```jsx
import {memo, useCallback, useMemo, useState} from 'react';
const Results = memo(function Results({items, onChoose}) {
  return <ul>{items.map(x => <li key={x.id}><button onClick={() => onChoose(x.id)}>{x.title}</button></li>)}</ul>;
});
function Search({items, query}) {
  const [selected, setSelected] = useState(null);
  const visible = useMemo(() => items.filter(x => x.title.includes(query)), [items, query]);
  const choose = useCallback(id => setSelected(id), []);
  return <><Results items={visible} onChoose={choose}/><p>{selected}</p></>;
}
```

**Follow-up — khud explain karo:** Excess memoization ki overhead/readability cost kya hai?

## iq-react-09

**Safe optimistic updates kaise design karoge?**

[Pehle concept padho: Server state caching and Supabase integration](react/08-query-supabase.md)

**Answer — reasoning samjho:**

- Pehle pending local change show karo, request identity aur previous server state track karo, phir success par authoritative response reconcile karo.
- Failure par rollback ya explicit retry state do
- overlapping mutations mein purani failure se newer success overwrite nahi honi chahiye.

**Follow-up — khud explain karo:** Server idempotency optimistic retries easy kaise karti hai?

## iq-react-12

**50,000-row table responsive kaise banaoge?**

[Pehle concept padho: React machine coding and identity bugs](react/11-machine-coding.md)

**Answer — reasoning samjho:**

- Pehle measure karo ki bottleneck network, computation, DOM size ya rerenders hai.
- Server pagination/filtering, row virtualization, stable row identity aur expensive work ka caching/worker execution combine kar sakte ho
- keyboard navigation, focus aur screen-reader behavior ko virtualized design mein verify karo.

**Follow-up — khud explain karo:** Variable row heights virtualization ko kaise badalti hain?

## iq-react-20

**Good component test kya assert kare aur kya avoid kare?**

[Pehle concept padho: React testing — user behavior aur accessibility verify karo](react/12-testing-accessibility.md)

**Answer — reasoning samjho:**

- Test user-visible behavior assert kare — screen par kya text/role dikhta hai, click ke baad kya change hota hai — internal state variable names ya component implementation details par nahi.
- Testing Library queries (role/text-based) is discipline ko encourage karte hain
- brittle snapshot-only tests refactors ko unnecessarily break kar dete hain.

**Follow-up — khud explain karo:** Passing snapshot test accessibility regression kaise miss kar sakta hai?

## iq-java-02

**==, equals aur hashCode ka relation kya hai?**

[Pehle concept padho: Objects OOP records and equality](java/07-object-model.md)

**Answer — reasoning samjho:**

- References ke liye == identity compare karta hai
- equals logical equality define kar sakta hai.
- Equal objects ka hashCode same hona zaroori hai, lekin same hash code se equality prove nahi hoti
- hash collections ke keys mein mutable equality fields avoid karo.

**Follow-up — khud explain karo:** Compatible hashCode bina equals override karne se kya tootega?

## iq-java-07

**volatile aur synchronized mein difference kya hai?**

[Pehle concept padho: Concurrency synchronization and virtual threads](java/15-concurrency.md)

**Answer — reasoning samjho:**

- volatile reads/writes visibility aur ordering guarantees dete hain, lekin count++ jaise read-modify-write ko atomic nahi banate.
- synchronized mutual exclusion aur happens-before relationship deta hai
- atomic classes simple atomic updates ke liye alternative hain.

**Follow-up — khud explain karo:** Volatile counter increments lose kyun kar sakta hai?

## iq-java-10

**Virtual threads kaunsi problem solve karti hain?**

[Pehle concept padho: Java concurrency under real resource limits](java/16-concurrency-production.md)

**Answer — reasoning samjho:**

- Virtual threads many concurrent tasks jo mostly blocking I/O wait karte hain unko simpler thread-per-task style mein scale karne mein help karte hain.
- Ye CPU cores increase nahi karte aur downstream connection pools ki limits remove nahi karte
- resource limits, runtime version behavior aur measurement important hain.

**Follow-up — khud explain karo:** Limited dependency ke around semaphore phir bhi kyun chahiye?

## iq-lab-11

**Har customer ke two largest orders deterministic tie policy ke saath nikalo.**

[Pehle concept padho: SQL joins windows and transaction races](java/14-sql-interview-lab.md)

**Answer — reasoning samjho:**

- ROW_NUMBER window customer se partition karo
- amount descending plus stable unique tie-breaker order do.
- Outer query/CTE mein row number<=2 filter karo.
- Ties same rank share karni hon tab RANK/DENSE_RANK lo
- output two se zyada ho sakta hai.
- Final ORDER BY alag add karo kyunki window ordering final rows sort guarantee nahi karti.

**Follow-up — khud explain karo:** Saare tied orders include karne hon toh kya badlega?

## iq-coverage-08

**Rolling deployment mein column rename ko compatible steps mein kaise karoge?**

[Pehle concept padho: SQL schema design aur safe migrations — data ka contract evolve karo](java/18-schema-migrations.md)

**Answer — reasoning samjho:**

- New column add, compatible writer deploy, resumable backfill, data verify aur reads switch karo.
- Old binaries retire hone ke baad old column remove karo.
- Backfill concurrent writes overwrite na kare.
- App rollback aur data restoration alag plans hain
- destructive step ko ordinary binary rollback reversible nahi banata.

**Follow-up — khud explain karo:** Fresh-schema migration test ke alawa kaunsa upgrade fixture test chahiye?

## iq-java-09

**Transactional ki guarantee aur common traps kya hain?**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Answer — reasoning samjho:**

- Spring transaction advice configured transaction manager ke through participating resource operations ko transaction boundary deta hai.
- Default proxy mode mein self-invocation advice bypass kar sakti hai, aur ordinary defaults RuntimeException/Error par rollback karte hain
- external HTTP calls same database transaction ka atomic part nahi ban jaate.

**Follow-up — khud explain karo:** DB change ke baad event reliably kaise publish karoge?

## iq-added-spring-nplusone

**JPA N+1 kya hai; pagination tode bina fix kaise?**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Answer — reasoning samjho:**

- N parents load karke lazy relations touch karne par 1+N queries aa sakti hain.
- Actual SQL/count inspect karo.
- Access pattern se projection, entity graph, fetch join ya batching choose karo.
- To-many fetch join rows multiply karke pagination complicate karti hai
- IDs page then controlled fetch useful ho sakta hai.
- Every relation eager blanket fix overfetch/inefficient plans la sakta hai.

**Follow-up — khud explain karo:** Correct page size aur bounded query count ka test kya hoga?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-added-spring-locking

**Competing updates mein optimistic/pessimistic locks ka difference?**

[Pehle concept padho: JPA Hibernate and Spring transactions](spring-boot/06-jpa-transactions.md)

**Answer — reasoning samjho:**

- Optimistic version check stale write ko conflict deta hai, silent lost update nahi.
- Pessimistic DB locks earlier serialize karte hain, wait/deadlock cost ke saath.
- Contention/invariant se choose karo.
- Conflict retry safe ho tab fresh read/business reevaluation ke baad karo.
- Version field external payment effects ya every DB constraint protect nahi karta.
- Payment method blind retry duplicate charge la sakti hai.

```java
// JPA entity field excerpt
@jakarta.persistence.Version
private long version;
```

**Follow-up — khud explain karo:** Optimistic conflict par payment method blindly retry risky kyun?

[Spring reference](https://docs.spring.io/spring-framework/reference/)

## iq-spring-testing

**Transactional HTTP test DB rows chhod kyun sakta hai?**

[Pehle concept padho: Spring Boot unit slice and integration testing](spring-boot/08-testing.md)

**Answer — reasoning samjho:**

- Real HTTP request separate server thread/transaction mein chalti hai.
- Test thread rollback server commit undo nahi karta.
- Isolated fixtures, test DB ya explicit cleanup use karo
- suite order par depend mat karo.
- PostgreSQL locks/constraints prove karne ke liye PostgreSQL-backed test lo, in-memory substitute identical semantics guarantee nahi karti.

**Follow-up — khud explain karo:** In-memory DB PostgreSQL locking prove kar sakti hai?

## iq-mongo-01

**MongoDB mein reference ke bajay embed kab karoge?**

[Pehle concept padho: Documents CRUD and access-driven modeling](mongodb/03-documents-crud-modeling.md)

**Answer — reasoning samjho:**

- Jo data saath read/update hota hai aur bounded size rakhta hai usko embed karna useful ho sakta hai.
- Independent lifecycle, shared entities ya unbounded growth ho to references better ho sakte hain
- access patterns, document-size limits aur update frequency se decision justify karo.

**Follow-up — khud explain karo:** Customer mein har order embed karoge?

## iq-mongo-03

**Compound index mein field order kyun matter karta hai?**

[Pehle concept padho: Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)

**Answer — reasoning samjho:**

- Compound index fields specified order mein sort hote hain, isliye leading prefixes aur sort/range needs query usefulness affect karte hain.
- Equality, sort, range guideline starting point hai
- actual predicate selectivity aur explain plan se validate karo.

**Follow-up — khud explain karo:** {team:1,createdAt:-1} team-specific newest-first queries support karega?

## iq-mongo-08

**Read concern, write concern aur read preference ka difference kya hai?**

[Pehle concept padho: Indexes aggregation geospatial queries and transactions](mongodb/05-indexes-aggregation-transactions.md)

**Answer — reasoning samjho:**

- Write concern acknowledgement aur requested durability conditions control karta hai
- read concern read data ki consistency/isolation properties affect karta hai.
- Read preference decide karta hai reads kaunse replica-set members ko target karein
- secondary routing automatically fresh reads guarantee nahi karta.

**Follow-up — khud explain karo:** Read-after-write workflow mein kya change karoge?

## iq-scenario-12

**Two instances duplicate payment webhook process karti hain. Double update kaise roko?**

[Pehle concept padho: SSR uploads payments email and deployment](mongodb/08-production-integrations.md)

**Answer — reasoning samjho:**

- Unique provider event ID durably store aur business transition dedup record ke saath atomic rakho.
- Webhook authenticate, order association validate aur durable handling ke baad ack karo.
- In-memory Set instances/restarts mein fail hai.
- Replay-safe effects aur reconciliation evidence rakho.
- Commit ke baad response lost ho toh repeated event existing outcome pehchaan kar no-op kare.

**Follow-up — khud explain karo:** Commit ke baad HTTP success se pehle crash ho toh?

[Technical reference](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

## iq-scenario-26

**Valid token se other user order ID access ho raha hai. Missing check?**

[Pehle concept padho: Authentication authorization and secure boundaries](mongodb/07-auth-security.md)

**Answer — reasoning samjho:**

- Authentication caller identify karti hai
- object-level authorization is order ka access decide karti hai.
- Verified user/tenant se query/policy scope karo
- privileged role exceptions explicit hon.
- Body userId ownership ka proof nahi.
- Cross-user read/write, privileged allowed case aur revoked membership test karo
- ID badalne par private data/mutation leak nahi honi chahiye.

**Follow-up — khud explain karo:** Cross-user, privileged aur revoked-membership integration cases kya honge?

## iq-dsa-04

**Binary search correct terminate hoti hai, prove kaise karoge?**

[Pehle concept padho: Searching and binary search boundaries](dsa/05-searching-and-binary-search.md)

**Answer — reasoning samjho:**

- Pehle invariant define karo, jaise answer current half-open interval mein hai aur outside boundaries resolved hain.
- Har update interval strictly shrink kare aur invariant preserve kare
- termination par empty unknown interval desired boundary identify karta hai.

**Follow-up — khud explain karo:** Duplicates ka first occurrence return kaise karoge?

## iq-dsa-06

**BFS shortest path kab deta hai?**

[Pehle concept padho: Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)

**Answer — reasoning samjho:**

- Unweighted ya equal-weight graph mein BFS increasing edge-count layers explore karta hai, isliye first discovery minimum edges deta hai.
- Unequal nonnegative weights ke liye standard BFS minimum total weight guarantee nahi karta
- Dijkstra appropriate ho sakta hai.

**Follow-up — khud explain karo:** Visited enqueue par kyun mark karein, dequeue par kyun nahi?

## iq-dsa-08

**Singly linked list constant extra space mein reverse kaise karoge?**

[Pehle concept padho: Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)

**Answer — reasoning samjho:**

- previous, current aur saved next pointers maintain karo
- next ko overwrite karne se pehle save karke current link reverse karo.
- Har node ek baar process hota hai, so O(n) time aur O(1) auxiliary space
- list wrapper ka tail bhi update karna pad sakta hai.

**Follow-up — khud explain karo:** Input mein cycle possible ho toh kya badlega?

## iq-dsa-12

**Nested monotonic-stack loop linear kaise ho sakta hai?**

[Pehle concept padho: Monotonic stacks and amortized reasoning](dsa/08-monotonic-stack-lab.md)

**Answer — reasoning samjho:**

- Ek element stack mein once push aur at most once pop hota hai.
- Inner while ke operations poore algorithm mein total O(n) hain, isliye har outer iteration ko n cost assign karna loose aur misleading hoga.

**Follow-up — khud explain karo:** Next greater versus greater-or-equal mein pop condition kya hogi?

## iq-dsa-17

**Topological sort cycle kaise detect karta hai aur kahan useful hai?**

[Pehle concept padho: Graph traversal and shortest paths](dsa/11-graphs-and-shortest-paths.md)

**Answer — reasoning samjho:**

- Kahn’s algorithm har node ka in-degree count karke zero-in-degree nodes ko queue karta hai
- jab queue khaali ho jaaye lekin processed node count total nodes se kam ho, toh remaining subgraph contains a cycle
- some remaining nodes may only be downstream of that cycle.
- DFS-based variant recursion stack mein "currently visiting" node dobara mile to back edge detect karta hai.
- Yeh exact mechanism build systems (Maven/Gradle dependency graph), task schedulers, aur module bundlers mein circular-dependency errors raise karta hai.

**Follow-up — khud explain karo:** Visited aur current recursion stack mein hone ka difference kya hai?

## iq-added-dsa-prefix-count

**Prefix frequencies negative values ke target-sum subarrays kaise count karti hain?**

[Pehle concept padho: Hash tables maps and sets](dsa/03-hash-tables-and-sets.md)

**Answer — reasoning samjho:**

- Current prefix s aur earlier prefix s-target ka difference target subarray deta hai.
- Same prefix multiple baar ho sakta hai, frequencies rakho.
- Initial zero frequency one empty-prefix start represent karti hai.
- Matches current prefix insert se pehle count karo, warna zero-target empty subarray count ho sakta hai.
- Normal hashing par expected O(n) time/space
- Number exact-range limits respect karo.

```js
function countTarget(nums, target) {
  const seen = new Map([[0,1]]);
  let prefix = 0, count = 0;
  for (const n of nums) {
    prefix += n;
    count += seen.get(prefix-target) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0)+1);
  }
  return count;
}
console.log(countTarget([1,-1,1], 1)); // 3
```

**Follow-up — khud explain karo:** Initial prefix zero ki count one kyun?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-added-dsa-lru

**Expected O(1) LRU get/put design karo; invariants kya?**

[Pehle concept padho: Linked lists stacks and queues](dsa/02-linked-lists-stacks-and-queues.md)

**Answer — reasoning samjho:**

- Map key→node aur doubly linked list MRU→LRU order combine karo.
- Get hit front move
- put existing update/move ya new insert
- overflow tail dono structures se remove.
- Every map entry exactly one live node, map/list sizes equal.
- Sentinels empty/single cases simplify.
- O(capacity) space
- zero capacity, update-without-growth, repeated hit aur read-after-eviction order test karo.

**Follow-up — khud explain karo:** Singly linked list mein arbitrary hit promote karna harder kyun?

[Algorithms reference](https://algs4.cs.princeton.edu/home/)

## iq-design-01

**System design interview start kaise karoge?**

[Pehle concept padho: Requirements capacity and design interviews](system-design/01-requirements-capacity.md)

**Answer — reasoning samjho:**

- Core user flows, scope, scale, latency/freshness targets aur failure expectations clarify karke measurable assumptions likho.
- Phir API/data model aur simple end-to-end path banao
- components tab add karo jab specific requirement unko justify kare.

**Follow-up — khud explain karo:** Notification service se pehle kaunse three questions puchoge?

## iq-design-06

**Transactional outbox kyun use karte hain?**

[Pehle concept padho: Messaging outbox retries and distributed workflows](system-design/08-messaging-reliability.md)

**Answer — reasoning samjho:**

- Database update aur message publish separate systems mein ho to ek succeed aur doosra fail ho sakta hai.
- Same database transaction mein business row aur outbox row likho, phir relay publish kare
- duplicates possible rehte hain, isliye consumers idempotent banao.

**Follow-up — khud explain karo:** Per-entity event order preserve kaise karoge?

## iq-design-07

**Timeout, retry aur circuit breaker saath kaise work karte hain?**

[Pehle concept padho: Messaging outbox retries and distributed workflows](system-design/08-messaging-reliability.md)

**Answer — reasoning samjho:**

- Timeout caller ka waiting budget bound karta hai
- retry transient failure se recover kar sakta hai
- circuit breaker repeatedly failing dependency ko calls temporarily limit karta hai.
- Retry budget, jitter, backoff aur idempotency zaroori hain taaki outage mein amplified traffic na bane.

**Follow-up — khud explain karo:** End-to-end deadline downstream calls mein kaise baantoge?

## iq-scenario-18

**Chat reconnect mein gaps/duplicates bina recovery kaise?**

[Pehle concept padho: Case study collaborative notes and real-time chat](system-design/12-realtime-case-study.md)

**Answer — reasoning samjho:**

- Stable message IDs aur conversation sequence/cursor durably store karo.
- Last acknowledged position se retained events replay, IDs se dedup karo.
- Cursor retention se bahar ho toh resync path do.
- Replay/live handoff mein overlap dedup aur gap prevent karo.
- Ordering scope explicit ho
- global total order separate aur often expensive requirement hai.

**Follow-up — khud explain karo:** Replay aur live stream overlap kaise handle karoge?

## iq-added-design-disaster-recovery

**RPO/RTO backup/disaster recovery ko kaise shape karte hain?**

[Pehle concept padho: Security observability and production operations](system-design/09-security-operations.md)

**Answer — reasoning samjho:**

- RPO tolerable data loss time mein, RTO service restore target duration hai.
- Backup frequency/replication/isolation/procedure failure scenarios ke according choose.
- Replica backup substitute nahi: corruption/delete replicate ho sakta hai.
- Restore drills, data/app compatibility aur actual recovery time measure karo
- successful backup log enough nahi.
- Credentials, dependencies, DNS/client reconnect include karo.
- Partition tradeoff target ke saath explicit ho.

**Follow-up — khud explain karo:** Partition mein continuing writes aur zero-data-loss goal conflict kyun kar sakte hain?

[AWS Builders Library](https://aws.amazon.com/builders-library/)

## iq-final-01

**LLD mein class diagram se pehle physical copy aur book title kyun separate karoge?**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Answer — reasoning samjho:**

- Title catalog concept hai
- physical copy actual borrowable unit.
- Three copies of same title parallel borrow ho sakti hain, same copy ka one active loan invariant hai.
- Wrong identity choose karoge toh ya unnecessary rejection hogi ya duplicate lending.
- Pehle operations/state/ownership likho, phir classes choose karo.

**Follow-up — khud explain karo:** Parking-space type aur individual parking spot mein same identity distinction kaise apply hogi?

## iq-final-02

**LoanStore interface ka implementation method signatures match karke bhi invalid kaise ho sakta hai?**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Answer — reasoning samjho:**

- Interface ka contract atomic claim aur expected-loan release hai.
- Non-atomic find-then-save same signatures ke saath concurrent duplicate loans allow kare toh behavioral substitution fail hai.
- DB implementation ko constraints/atomic operations chahiye
- type compatibility alone invariant preserve nahi karti.

**Follow-up — khud explain karo:** In-memory fake pass hone ke baad real DB mein kaunsa concurrency test run karoge?

## iq-final-03

**Old return request new borrow ko clear na kare: LLD mein kaunsi identity chahiye?**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Answer — reasoning samjho:**

- Copy ID alone enough nahi.
- Each loan ki unique identity rakho
- release current loan ko expected loan ID/version se atomically match kare.
- Return A success, borrow B, phir duplicate return A aaye toh B bache.
- API layer member authorization separately enforce kare
- opaque ID alone permission proof nahi.

**Follow-up — khud explain karo:** Distributed store mein conditional delete/update ka success outcome kaise map karoge?

## iq-final-04

**Clock inject karna test trick se zyada design improvement kyun hai?**

[Pehle concept padho: Low-level design — requirements se classes aur invariants tak](java/19-low-level-design.md)

**Answer — reasoning samjho:**

- Business operation ka time source explicit dependency banta hai.
- Fixed clock se timestamps/boundaries repeatably verify hote hain
- real sleeps avoid hote hain.
- Service system clock construction se coupled nahi rehti.
- Production mein business instant aur duration measurement clock ki distinct needs bhi samjho.

**Follow-up — khud explain karo:** System wall clock backward move ho toh elapsed-time deadline ke liye kya choose karoge?

## iq-final-05

**SQL 10 ms hai, HTTP response 2 seconds: database ko blame karne se pehle kya measure karoge?**

[Pehle concept padho: OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Answer — reasoning samjho:**

- Connection acquire wait, application queue, external calls, serialization aur response transfer separately time karo.
- SQL timer connection milne ke baad start hota ho toh pool wait hide ho sakti hai.
- Per-instance p95/p99 aur wait stacks compare karo
- aggregate average hot instance mask kar sakti hai.

**Follow-up — khud explain karo:** Pool size badhane se throughput improve hone ke bajay contention kab badhegi?

## iq-final-06

**TCP sender ke two writes receiver ke two reads kyun guarantee nahi karte?**

[Pehle concept padho: OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Answer — reasoning samjho:**

- TCP ordered reliable byte stream hai, application message framing protocol nahi.
- Reads partial message ya multiple messages combine kar sakti hain.
- Length-prefix/delimiter parser incomplete buffer preserve kare aur bounded size validate kare.
- Transport ACK business transaction commit ka acknowledgment nahi.

**Follow-up — khud explain karo:** Length prefix huge ya truncated ho toh parser ka resource/error contract kya hoga?

## iq-final-07

**DNS resolve success ke baad bhi HTTPS call fail: layers ka diagnosis order kya hai?**

[Pehle concept padho: OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Answer — reasoning samjho:**

- Name resolution sirf address discovery ka hissa prove karti hai.
- Correct address/port, connection reachability, TLS hostname/trust chain, proxy route aur application authorization separately inspect karo.
- Certificate validation bypass ko fix mat bolo
- exact failed stage/error aur configuration verify karo.

**Follow-up — khud explain karo:** Reused keep-alive connection par har request fresh DNS/TLS timings kyun nahi hongi?

## iq-final-08

**Heap stable lekin process RSS grow ho rahi hai: next hypotheses kya hain?**

[Pehle concept padho: OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Answer — reasoning samjho:**

- Native/direct buffers, thread stacks, memory-mapped pages aur runtime allocations inspect karo.
- Heap graph total process memory nahi.
- Resident pages aur virtual address reservations alag metrics hain
- container limit total relevant memory par apply ho sakti hai.
- Allocation/thread trends aur payload concurrency correlate karo.

**Follow-up — khud explain karo:** Har memory increase ko garbage-collector leak bolna incomplete kyun hai?

## iq-final-09

**Low CPU ke saath huge p99 latency aur growing queue kaise possible hai?**

[Pehle concept padho: OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Answer — reasoning samjho:**

- Requests I/O, locks, connection-pool slots ya downstream service ka wait kar rahi ho sakti hain.
- Low average CPU free useful capacity ka proof nahi.
- Queue age, blocked stacks, pool wait aur per-instance load dekho.
- Work conservation aur limits samajhkar bounded admission/timeout policy choose karo.

**Follow-up — khud explain karo:** More app replicas single hot database row ka bottleneck kyun necessarily solve nahi karti?

## iq-final-10

**200 requests/sec aur 250 ms average latency ko concurrency mein kaise translate karoge?**

[Pehle concept padho: OS aur networking interviews — slow request ko layer-wise diagnose karo](system-design/15-os-network-debugging.md)

**Answer — reasoning samjho:**

- Stable-system Little's Law assumptions mein average in-flight L=lambda×W=200×0.25=50.
- RPS arrival rate hai, concurrent requests count nahi.
- Average law p99 guarantee nahi
- unstable growing queues mein same steady-state inference blindly mat lagao.
- Latency double aur arrivals same ho toh average concurrency roughly double ho sakti hai.

**Follow-up — khud explain karo:** Same arrival rate par pool wait badhne se memory aur timeout pressure kaise badhega?

## iq-final-11

**for...of characters count kare aur window string[index] use kare toh emoji case kyun fail ho sakta hai?**

[Pehle concept padho: Frequency counters and pointer patterns](dsa/04-problem-solving-patterns.md)

**Answer — reasoning samjho:**

- for...of Unicode code points iterate karta hai
- ordinary string indexing UTF-16 code units deta hai.
- Emoji do units ho sakti hai, isliye pattern counts aur window symbols disagree karte hain.
- Dono ko Array.from se code-point arrays banao, ya clearly code-unit contract choose karo.
- Conversion ki O(n+m) memory bhi count karo.

**Follow-up — khud explain karo:** Combining marks aur user-perceived grapheme clusters ko code points normalize automatically karte hain?

## iq-final-12

**TanStack Query object key order aur manually JSON-stringified keys mein kya nuance hai?**

[Pehle concept padho: Server state caching and Supabase integration](react/08-query-supabase.md)

**Answer — reasoning samjho:**

- TanStack Query serializable object keys ko deterministic hash karti hai
- same object properties ka insertion order identity change nahi karta.
- Array element order matter karta hai.
- Custom cache mein JSON.stringify ko raw key banana object ordering issue laa sakta hai.
- Library contract padho, irrelevant canonicalization mat add karo
- actual query parameters/tenant identity include karo.

**Follow-up — khud explain karo:** Raw search lowercase normalize karna case-sensitive backend par correctness kyun badal sakta hai?
