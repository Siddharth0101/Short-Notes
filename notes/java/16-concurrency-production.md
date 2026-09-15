---
id: java-concurrency-production
title: Java concurrency under real resource limits
track: java
order: 16
level: Advanced
minutes: 28
summary: Zyada tasks banane se DB connections ya downstream service ki capacity automatically nahi badhti.
tags: java, concurrency, virtual-threads, executors, backpressure
---

## Mental model — simple soch

Threads execution schedule karte hain; they do not create database connections, CPU cores or downstream capacity. Service thousands concurrent requests accept karke bhi sirf twenty usable database connections rakh sakti hai. Scarce resource access explicitly bound karo; scheduler automatically protect karega, assume mat karo.

> **Core takeaway:** Zyada tasks banane se DB connections ya downstream service ki capacity automatically nahi badhti.

## Choose the bottleneck first

CPU-bound work ke concurrency level ko available cores aur measurement se choose karo. Blocking I/O mein more concurrent tasks, including Java 21+ virtual threads, useful ho sakti hain; remote capacity phir bhi limited hai. Virtual threads waiting cheaper banati hain, individual SQL query faster nahi.

synchronized pinning ke liye har JDK par ek blanket rule mat lagao. Newer JDKs mein runtime behavior badla hai. Deployed version batao aur locking replace karne se pehle profile karo. Scheduling details kuch bhi hon, correctness/contention ke liye critical sections chhote rakho.

## Bound admission independently

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

final class PartnerGateway {
    private final Semaphore permits = new Semaphore(20);

    String load() throws InterruptedException {
        if (!permits.tryAcquire(100, TimeUnit.MILLISECONDS)) {
            throw new IllegalStateException("Partner capacity exhausted");
        }
        try {
            return callPartnerWithTimeout();
        } finally {
            permits.release();
        }
    }

    private String callPartnerWithTimeout() {
        // Teaching stub: real client must configure connection and request deadlines.
        return "response";
    }
}
```

Permit sirf successful acquisition ke baad release karo. finally normal return aur exception dono mein cleanup karta hai. Admission timeout slot ka wait bound karta hai, subsequent network call ko nahi. Multiple app instances hon toh yeh twenty calls per instance hai, global twenty nahi.

## Failure ownership

Future cancellation interruption request kar sakti hai; code ko cooperate karna hota hai. Caller give-up ke baad bhi DB query/external server continue kar sakta hai. InterruptedException propagate nahi kar sakte toh usually interrupt status restore karke work abort/return karo. Interruption swallow karke endless retry mat chalao.

CompletableFuture composition easy karti hai, lekin async stage ka executor matter karta hai. Shared pool par blocking calls unrelated work delay kar sakti hain. Executor ownership, deadline propagation aur unused sibling work ka cancellation behavior define karo.

## Practice

Limit three ke against fifty simulated callers chalao. Atomics se current/max active count rakho. Ek call throw karwao aur check karo later callers permit le sakein. Waiter interrupt karne par count galat na badhe. Slow dependency mein admission rejection aur execution timeout alag metrics se samjhao.

## Interview questions — bolkar practice karo

**Virtual threads pool kyun nahi?** Woh inexpensive per-task threads ke liye bani hain. Scarce resources ko separately pool/limit karo. Virtual-thread-per-task ka matlab unlimited external work nahi.

**volatile se count++ atomic hota hai?** Nahi. Visibility read/add/write ko ek atomic operation nahi banati. Suitable synchronization ya atomic counter use karo.

## Research notes: Virtual threads still need task ownership

Virtual threads har blocking task ke liye dedicated platform thread ke bina many tasks support karti hain. CPU work faster ya downstream capacity larger nahi hoti. Task owner, deadline aur cancellation policy define karo.

Interruption cooperative hai. Suitable ho toh InterruptedException propagate karo; warna status restore karke deliberately exit karo. Catch karke forever continue karna cancellation defeat karta hai.

Virtual threads Java 21 se non-preview hain. Pinning behavior JDK-dependent hai; deployed runtime ki guidance follow karo.

**Interview check:** Ten thousand virtual threads twenty DB connections ko overload kyun kar sakti hain?

**Answer:** Connections aur DB execution scarce hain. Resource admission bound, waiting measure aur deadlines enforce karo. Cheap waiting threads downstream throughput nahi badhati.

**Practice:** Blocked task cancel karke verify karo ki uska har owned resource release hua.

[Source yahan padho — Dev.java](https://dev.java/learn/new-features/virtual-threads/). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Request count, thread count aur resource count alag hain

Application 1,000 requests receive karti hai lekin database 20 useful concurrent operations handle kar sakta hai. More threads waiters badha sakti hain; database throughput automatically 50× nahi hota. Queue wait, acquisition timeout, execution time aur end-to-end deadline separately observe karo.

Request cancel hone par downstream operation cooperate kare toh resource jaldi release ho sakti hai. Future cancel return hone ko database transaction definitely stopped mat samjho. Connection/permit finally boundary mein release ho; failure path capacity permanently leak na kare.

Task ownership ke liye caller ko pata ho kaunse child jobs start hue aur kis deadline tak wait karna hai. Fire-and-forget exception lose kar sakta hai. Background work truly durable chahiye toh in-memory executor process crash survive nahi karta.

**Practice:** 20 permits, 25 tasks: maximum 20 active, 5 waiting/rejected policy ke hisaab se. One task throw kare, permit release verify karo. One timeout ho, late completion ka visible result define karo. Low CPU with high latency par queue/pool metrics dekhna thread count blindly badhane se zyada diagnostic hai.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** 100 request tasks aur 10-connection DB pool hai. Tasks badhane se pehle kya measure karoge?

> **Hint — chhota ishara:** Connection ke wait time ko query execution time se alag dekho.

**Answer guide — pehle khud karo, phir compare karo:** Pool acquisition wait, active connections, query latency, timeouts aur throughput measure karo. Ek waqt maximum 10 tasks connections hold kar sakti hain. Admission bound aur deadlines rakho. Tasks badhane se wait badh sakta hai bina completed work badhe.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Oracle virtual threads guide](https://docs.oracle.com/en/java/javase/26/core/virtual-threads.html) runtime-specific guidance deti hai. [Semaphore API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html) mein acquisition behavior padho.
