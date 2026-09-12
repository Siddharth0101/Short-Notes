---
id: interview-java
title: Java backend interview playbook
track: interview
order: 2
level: Advanced
minutes: 32
summary: Java fundamentals ko collections, concurrency, Spring transactions, and production diagnosis se connect karo.
tags: java, interview, spring, concurrency, transactions
visual: thread-sync
---

## Mental model

Backend interview mein local code correctness aur concurrent system behavior dono matter karte hain. Method single request mein correct ho sakta hai lekin two requests ke interleaving mein invariant break kar sakta hai. Answer mein language rule, resource boundary aur failure outcome clearly separate karo.

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

Each 0–2 score: Java semantics, collection contract, concurrency proof, transaction scope, diagnosis. High-quality concurrency answer ek failing interleaving dikha sakta hai. High-quality performance answer metric se bottleneck tak reasoning dikhata hai, random tuning flags nahi.

## Practice and answer

**Prompt:** `containsKey(k)` false then `put(k, v)` safe deduplication hai on ConcurrentHashMap?

**Answer:** Individual calls thread-safe hain, combined check-then-act atomic nahi. `putIfAbsent` jaise atomic operation choose karo. Process restart aur multiple application instances survive karne wali deduplication ke liye durable shared uniqueness strategy chahiye.

## Assessed mock: Java backend concurrency round

**Prompt:** Design a stock reservation endpoint and write the conditional database update or version check.

**Round structure:** Spend 5 minutes clarifying requirements and assumptions, 20 minutes implementing or drawing the core flow, 10 minutes investigating failures, and 5 minutes defending tradeoffs. These are practice targets, not a claim about any company's interview format.

**Failure injection:** Run two transactions against one remaining unit; lose the first HTTP response after commit.

**Strong-answer evidence:** An enforced invariant, a real transaction boundary, bounded retries, and observable contention.

Score each dimension from 0 to 2: correctness, concrete example, failure handling, and tradeoff reasoning. Zero means missing or incorrect; one means plausible but untested; two means demonstrated with a trace, test, or explicit invariant. A high total with a correctness gap still needs revision.

After the round, write the smallest counterexample that broke your first approach, repair it, and explain the change aloud without notes. Use the chapter's answer-reveal questions for focused revision before repeating the mock.

## Source check
[Java concurrency package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html), [HashMap contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html), [virtual threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html), aur [Spring transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) official references hain.
