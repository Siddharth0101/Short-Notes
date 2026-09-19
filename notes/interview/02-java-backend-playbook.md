---
id: interview-java
title: Java backend interview playbook
track: interview
order: 2
level: Advanced
minutes: 35
summary: Backend answer ko concurrency aur failures ke beech business rule bachana chahiye, jaise ek seat do logon ko na mile.
tags: java, interview, spring, concurrency, transactions
visual: thread-sync
---

## Mental model — simple soch

Backend interview mein local code correctness aur concurrent system behavior dono matter karte hain. Method single request mein correct ho sakta hai lekin two requests ke interleaving mein invariant break kar sakta hai. Answer mein language rule, resource boundary aur failure outcome clearly separate karo.

> **Core takeaway:** Backend answer ko concurrency aur failures ke beech business rule bachana chahiye, jaise ek seat do logon ko na mile.

## Representative questions and answers

**Is Java pass-by-reference?** Nahi, Java pass-by-value hai. Object argument reference value ki copy pass karta hai: same object mutate ho sakta hai, but local parameter reassignment caller ki variable ko replace nahi karta.

**Why must equals and hashCode agree?** Hash collection bucket locate karne ke liye hash aur actual match ke liye equality use karti hai. Equal objects ka same hash required hai. Key insert karne ke baad equality/hash-relevant fields mutate karne se lookup expected bucket miss kar sakta hai; immutable keys simplify reasoning.

**Does volatile make increment safe?** Visibility safe bana sakta hai, but `count++` read-modify-write sequence hai. Two threads same old value read karke one increment lose kar sakte hain. AtomicInteger increment operation ya appropriate lock use karo; multiple-variable invariant ko separate atomic variables automatically protect nahi karte.

**Does @Transactional make every operation atomic?** Configured transaction manager participating resources manage karta hai. Database transaction ke andar external email/HTTP request successful ho jaye aur DB rollback ho, email undo nahi hoti. Default proxy mode mein self-invocation interception bypass kar sakti hai; rollback rules aur transaction boundary verify karo.

**What causes an N+1 query problem in JPA, and how do you fix it?** List endpoint ek query se parent entities fetch karta hai, phir har entity ka lazy-loaded relation access karne par ek-ek alag query trigger hoti hai — total N+1 round trips. Local testing mein 3-4 rows ke saath yeh invisible rehta hai, but production mein hazaaron rows ke saath list endpoint suddenly slow ho jaata hai. Fix screen ki exact zaroorat par depend karta hai: DTO projection sirf needed columns fetch kare, fetch join ek query mein relation bhi laa de, ya entity graph declaratively fetch plan specify kare. Har relation ko EAGER kar dena bhi solution nahi hai — over-fetching aur unrelated extra queries de sakta hai.

**Two threads transferring money between the same two accounts in opposite directions — what can go wrong?** Agar thread A `synchronized(accountX)` ke andar `synchronized(accountY)` acquire karne ki koshish kare, aur simultaneously thread B `synchronized(accountY)` ke andar `synchronized(accountX)` acquire karne ki koshish kare, dono ek dusre ka lock hold karke doosre ka wait karte reh jaate hain — classic deadlock, dono threads forever stuck. Fix consistent lock ordering hai: hamesha locks ko ek fixed order mein acquire karo (jaise account ID se sort karke chhota ID pehle), taaki dono directions ka transfer same sequence follow kare aur circular wait structurally impossible ho jaaye.

**A URL like `/api/orders/{orderId}` only checks `hasRole("USER")` — is that enough authorization?** Nahi. Role check sirf confirm karta hai ki request authenticated hai aur user ke paas ek generic permission level hai — yeh check nahi karta ki `orderId` genuinely usi user ka hai. User A login karke URL mein user B ka `orderId` daal sakta hai aur agar sirf role check ho, data leak ho jaata hai — yeh IDOR (insecure direct object reference) vulnerability class hai. Fix resource-level ownership check hai: `@PreAuthorize` se path variable ko authenticated principal se compare karo, ya service/repository query khud current user ke ID se scope karo, sirf coarse role check par mat ruko.

**A singleton @RestController stores per-request data in an instance field — what breaks?** Spring bean default scope singleton hai — container mein ek hi controller instance saare concurrent requests serve karta hai. Instance field mein request-specific data store karna do simultaneous requests ke beech data ko overwrite/interleave kar sakta hai, jisse ek user ko doosre user ka data dikh sakta hai. Yeh bug local single-request testing mein kabhi surface nahi hota, sirf concurrent load ke saath dikhta hai. Fix: request-specific state ko method-local variables mein rakho, ya explicitly `@RequestScope` bean use karo jab genuinely request-lifecycle-scoped state chahiye ho.

## Coding drill

Concurrent frequency counter implement karo. Below map concurrent access aur per-key update handle karta hai.

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

class Metrics {
    private final ConcurrentHashMap<String, LongAdder> counts =
        new ConcurrentHashMap<>();

    void record(String name) {
        counts.computeIfAbsent(name, ignored -> new LongAdder()).increment();
    }

    long count(String name) {
        LongAdder value = counts.get(name);
        return value == null ? 0 : value.sum();
    }
}
```

LongAdder high-contention counters ke liye useful hai, lekin concurrent updates ke dauran `sum()` atomic snapshot nahi hota. Financial/account invariant ko is relaxed read model se implement mat karo. Bounded metric names chahiye; unbounded user-controlled labels memory grow kar sakte hain.

## Production scenario

**Prompt:** Traffic double hote hi p99 latency 200 ms se 5 s ho gayi. CPU 35% hai.

**Answer:** Low CPU se system healthy prove nahi hota. DB/HTTP connection pools, queue time, dependency latency aur blocked threads inspect karo. Traces se wait location identify karo; pool increase tabhi karo jab downstream capacity support karti ho. Admission control, timeouts aur query fixes ho sakte hain, lekin evidence se choose karo.

Virtual threads blocking-task concurrency ko help kar sakte hain, CPU capacity ya database connections ko magically increase nahi karte. Java version specify karo aur runtime-specific implementation behavior ko broad eternal rule mat banao.

## Self-review rubric

Java semantics, collection contract, concurrency proof, transaction scope aur diagnosis ko separately 0–2 score do. High-quality concurrency answer ek failing interleaving dikha sakta hai. High-quality performance answer metric se bottleneck tak reasoning dikhata hai, random tuning flags nahi.

## Practice and answer

**Prompt:** `containsKey(k)` false then `put(k, v)` safe deduplication hai on ConcurrentHashMap?

**Answer:** Individual calls thread-safe hain, combined check-then-act atomic nahi. `putIfAbsent` jaise atomic operation choose karo. Process restart aur multiple application instances survive karne wali deduplication ke liye durable shared uniqueness strategy chahiye.

## Assessed mock: Java backend concurrency round

**Prompt:** Stock reservation endpoint design karo; conditional DB update ya version check likho.

**Round structure:** 5 minute requirements/assumptions clear karo, 20 minute core flow implement/draw karo, 10 minute failures inspect karo, aur 5 minute tradeoffs defend karo. Yeh practice timings hain; kisi company ke exact interview format ka claim nahi.

**Failure injection:** Last unit ke liye do transactions chalao; commit ke baad first HTTP response lose karwao.

**Strong-answer evidence:** Enforced invariant, real transaction boundary, bounded retries aur measurable contention dikhao.

Correctness, concrete example, failure handling aur tradeoff reasoning ko 0–2 score do. 0=missing/incorrect; 1=plausible par untested; 2=trace, test ya invariant se demonstrated. Total achha ho lekin correctness gap ho toh revision abhi bhi chahiye.

Round ke baad first approach todne wala smallest counterexample likho, fix karo aur notes dekhe bina change bolkar samjhao. Mock repeat karne se pehle chapter ke answer-reveal questions se focused revision karo.

## Research notes: Defend a failure boundary

Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

**Original practice round:** Do local account records ke beech transfer design karo. Classes choose karne se pehle atomicity, insufficient funds aur duplicate requests define karo.

**Failure injection:** Debit aur credit ke beech failure inject karo, phir request repeat karo.

**Evidence to bring:** Durable balances aur request identity inspect karo. HTTP success alone correct transaction boundary ka proof nahi hai.

Employer source assessment approach ka reference hai. Yeh exercise original practice hai; reported company question nahi.

**Interview check:** Attempt ke baad is round ko review kaise karoge?

**Answer:** First failing example save karo, wrong assumption batao aur fix se behavior kaise badla dikhao. Jo demonstrate kiya aur jo extra time mein investigate karoge, unhe clearly identify karo.

**Practice:** Different failure ke saath repeat karo aur reasoning bolte jao.

[Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Concurrency answer mein exact shared state aur atomic operation bolo

“Thread-safe collection use karunga” tab incomplete hai jab business operation find-then-update ke multiple steps mein split hai. One copy one loan ya one seat one reservation invariant state karo. Same process ke lock aur multiple instances ke DB constraint/transaction boundary distinguish karo.

SQL question mein row grain, index workload aur isolation assumption bolo. API failure mein known rejection aur unknown committed outcome alag recover karo. Thread count, pool count aur throughput ko interchangeable numbers mat banao.

**Mock drill:** Two requests same key process karein, winner commit ke baad response lose ho. Durable state, loser response aur retry result timeline explain karo. Tests overlapping operations create karein; sequential double call concurrency proof nahi. Interview answer ko [LLD worked chapter](../java/19-low-level-design.md) se connect karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Paanch minute mein last-item purchase endpoint defend karo. Concurrent request aur failed payment include karo; DB transaction provider ki payment rollback kar degi, yeh assume mat karo.

> **Hint — chhota ishara:** Inventory reservation aur external payment lifecycle ko alag state transitions mein dekho.

**Answer guide — pehle khud karo, phir compare karo:** Atomic reservation, stable idempotent purchase ID, durable status aur payment reconciliation/compensation explain karo. Har failure par kaunsa state save reh gaya, trace karo. Concurrent test mein sirf ek reservation jeete; replay test mein duplicate charge request na ho.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[Java concurrency package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html), [HashMap contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html), [virtual threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html), aur [Spring transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) official references hain.

## Ownership aur incident explanation

Original prompt: “Deployment ke baad duplicate enrollment aayi. Incident mein tumhari responsibility kya thi?” Blame list ki jagah impact, containment, diagnosis aur durable correction bolo. App ka pre-check concurrent writers ko serialize nahi karta; database unique constraint aur controlled conflict response ko verification ke saath explain karo.

Evidence packet mein same learner/course ke two concurrent requests, successful row count, error translation aur rollout assumptions do. Real incident experience nahi hai toh clearly practice simulation bolo. Improvement metric tabhi quote karo jab measurement ya recorded observation ho.

**Practice:** Schema migration ke risk par teammate disagrees. Do-minute response do. **Answer guide:** Unki concern restate karo, mixed-version deployment ki requirement agree karo, direct rename versus expand/backfill/contract compare karo aur smallest staging experiment propose karo. “Meri approach best hai” ke bajay acceptance criteria par agreement banao. Explain karo ki old app rollback aur dropped-data recovery alag problems hain.

[Schema migrations](../java/18-schema-migrations.md) aur [type modeling](../java/17-type-metadata.md) se concrete examples lo.

## Machine coding — implementation round bhi karo

[Machine coding practice bank](../MACHINE_CODING_PRACTICE.md) mein apne subject ke do P1 rounds se shuru karo. Prompt ke acceptance checks answer reveal se pehle attempt karo; timebox ke baad demo, scorecard aur interviewer follow-up complete karo. Java backend ke liye Java aur Spring Boot, MongoDB ke liye Node aur MongoDB, frontend ke liye HTML/CSS aur React/Redux ke rounds bhi lo.
