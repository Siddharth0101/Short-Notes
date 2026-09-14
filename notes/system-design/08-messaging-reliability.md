---
id: design-messaging-reliability
title: Messaging outbox retries and distributed workflows
track: system-design
order: 8
level: Advanced
minutes: 28
summary: Reliable delivery ke liye replay-safe consumers aur bounded retries chahiye; message dobara aa sakta hai.
tags: messaging, outbox, idempotency, sagas
visual: outbox-pattern
---

## Mental model — simple soch

Network call timeout ambiguous hai: operation server par complete hui ya nahi, caller sure nahi ho sakta. Queue reliable handoff help karti hai, but business correctness automatically guarantee nahi karti. Design har step ke before/after crash scenario se validate karo.

> **Core takeaway:** Reliable delivery ke liye replay-safe consumers aur bounded retries chahiye; message dobara aa sakta hai.

## The dual-write problem

Order database commit ke baad broker publish fail hua toh order exists but notification absent. Broker publish pehle kiya aur database rollback hua toh event nonexistent order describe karega. Transactional outbox business row and event row same database transaction mein persist karta hai; relay committed events asynchronously publish karta hai. Relay crash duplicate publish de sakta hai. [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

```text
single database transaction
  update order status
  insert outbox(event_id, aggregate_id, version, payload)
          |
        commit
          |
relay -> broker -> consumer transaction
                    insert processed_event(event_id UNIQUE)
                    apply business update
```

Processed marker aur local business write same consumer transaction mein hone chahiye. Marker first separately commit kiya toh crash work skip kara sakta hai. Business update first separately commit kiya toh retry duplicate effect create kar sakti hai. External payment/email side effect ke liye destination idempotency support or durable state machine chahiye; local transaction external world ko atomic nahi banati.

### Consumer idempotency concretely

```java
@Transactional
public void handle(OrderPaidEvent event) {
    try {
        // Unique constraint on event_id — yeh hi asli dedupe mechanism hai
        processedEvents.insert(event.id(), Instant.now());
    } catch (DuplicateKeyException alreadyHandled) {
        return; // Safe skip: pichhli baar business write commit ho chuki thi
    }
    shipments.createFor(event.orderId());   // same transaction
    // commit: dono saath, ya dono nahi
}
```

Do cheezein yahan load-bearing hain. Ek, dedupe ka source of truth database constraint hai, in-memory `Set` ya cache nahi — process restart ke baad in-memory dedupe khali hota hai aur pehla replay duplicate create kar deta hai. Do, `processed_events` table ko grow hone se rokna padta hai: event IDs ko retention window (jaise 7 days) ke saath rakho aur purani rows periodically delete karo. Window broker ke maximum redelivery window se lamba hona chahiye, warna ek bahut late redelivery duplicate ban jaayegi.

Agar side effect external hai (email bhejnaa, payment charge karna), toh local transaction usse cover nahi karti. Us case mein state machine chahiye:

```text
insert processed_event + set notification_state = 'pending'   [commit]
                     |
       external call with provider idempotency key
                     |
set notification_state = 'sent' with provider message id       [commit]
```

Beech mein crash hua toh recovery job `pending` rows dhoondhta hai aur same idempotency key se retry karta hai — provider duplicate suppress karta hai. Bina is state ke, crash ya toh email skip kara deta hai ya duplicate bhejta hai, aur tumhe pata bhi nahi chalta ki kaun sa hua.

## Delivery and ordering

At-most-once duplicate reduce karta hai but message loss possible hai. At-least-once retries delivery improve karti hain but duplicates expect karo. "Exactly once" phrase ka boundary specify karo: broker log, processing transaction or external business side effect? All three interchangeable nahi hain.

Ordering usually partition or aggregate key scope mein practical hoti hai. Event version number stale updates reject or buffer karne mein help karta hai. Global ordering throughput and availability constrain kar sakti hai. Poison message repeatedly fail kare toh bounded attempts, dead-letter handling and investigation workflow chahiye; silently discard mat karo.

## Backpressure and retry budgets

Assume 2,000 events/s arrive and worker fleet 1,500/s process karti hai. Backlog 500/s grow karega, approximately 1.8 million events per hour. Queue durable hone se overload disappear nahi hota. Scale workers if downstream capacity permits, reduce intake or defer noncritical work. Oldest-message age user-facing delay reveal karta hai.

Retry exponential backoff plus jitter se synchronized retry storms reduce karo. Retry budget end-to-end rakho: three layers each three attempts can amplify one user request into 27 downstream attempts. Circuit breaker dependency failure par attempts reduce karta hai; bulkhead resources isolate karta hai.

### Backlog drain time — sabse useful single number

Backlog size se zyada important yeh hai ki usse khatam hone mein kitna time lagega, kyunki wahi user-visible delay hai:

```text
backlog        = 1,800,000 events
worker rate    = 1,500/s
arrival rate   = 2,000/s  (abhi bhi aa rahe hain)

drain rate = 1,500 - 2,000 = -500/s  -> kabhi drain nahi hoga
```

Yeh pehla realization hai: agar arrival rate service rate se zyada hai, backlog infinite grow karta hai, chahe queue kitni bhi durable ho. Ab maan lo arrival normal ho gayi (800/s):

```text
drain rate = 1,500 - 800 = 700/s
drain time = 1,800,000 / 700 ≈ 2,571 s ≈ 43 minutes
```

Matlab ek 1-hour incident ke baad bhi 43 minutes tak users ko delayed notifications milti rahengi. Agar SLA "order confirmation within 2 minutes" hai toh yeh violation hai, aur uska fix incident ke waqt nahi ho sakta — capacity headroom pehle se chahiye. Rule of thumb: workers ko peak arrival rate ke 2x par size karo, average par nahi, taaki backlog recovery reasonable time mein ho.

Backlog measure karte waqt count ke bajaye **oldest message age** primary metric banao. Count alone deceptive hai (10 lakh chhote events 100 heavy events se kam problematic ho sakte hain), lekin oldest-message-age seedha user experience batata hai: "sabse purana pending event 12 minutes purana hai" actionable hai.

### Retry amplification aur budgets

Nested retries multiply hote hain, add nahi:

```text
browser retry (2) × gateway retry (3) × service retry (3) = 18 attempts
ek user click se 18 downstream calls, jab dependency already struggling hai
```

Aur yeh sabse bura tab hota hai jab dependency slow hai, down nahi — kyunki timeouts fire hote hain, retries jaate hain, aur dependency ko original load ka 18x milta hai exactly us waqt jab wo sabse kamzor hai. Yeh metastable failure hai: load hatne ke baad bhi system recover nahi karta kyunki retry traffic khud load banaye rakhta hai.

Defenses, priority order mein:

- **Retry sirf ek layer par.** Usually wo layer jo failure ke sabse kareeb hai. Baaki layers fail-fast karein. Yeh sabse effective single rule hai.
- **Retry budget, not retry count.** Client ko allow karo ki wo total requests ka maximum 10% retries ke roop mein bheje. Success rate girne par retries automatically ruk jaati hain — yeh per-request retry limits se structurally better hai.
- **Deadline propagation.** Original request ka deadline (jaise 2 s) har hop par forward karo. Agar 1.9 s already beet chuke hain toh downstream call karne ka koi matlab nahi — usse turant fail karo aur capacity bachao.
- **Circuit breaker.** Consecutive failures ke baad calls band karke fast-fail karo, phir periodically ek probe request se recovery check karo. Breaker ka main kaam dependency ko recover hone ka space dena hai.

### Dead-letter queue ka operational contract

DLQ ek folder nahi hai jahan messages jaake bhool jaate hain; wo ek queue hai jiska owner, alert aur replay procedure hona chahiye. Minimum contract:

| Question | Answer hona chahiye |
| --- | --- |
| Kitne attempts ke baad DLQ? | Fixed number (jaise 5) with exponential backoff |
| DLQ non-empty hone par kya hota hai? | Alert fires, owning team ko page/ticket |
| Message mein kya context hai? | Original payload, failure reason, attempt count, timestamps |
| Replay kaise hoga? | Ek documented tool jo selected messages wapas main queue mein daale |
| Replay safe kyun hai? | Consumer idempotent hai, isliye duplicate replay harmless hai |

Poison message ka classic case: ek malformed event jo har baar exception throw karta hai. Bina DLQ ke wo message queue ke head par baithkar sab kuch block kar deta hai (ordered queue mein) ya infinitely retry hokar capacity kha jaata hai. Isliye "bounded attempts phir DLQ" default hona chahiye, optional feature nahi. Aur DLQ se replay karne se pehle root cause fix karna zaroori hai, warna messages seedha wapas DLQ mein aa jaayenge.

## Sagas and compensation

Distributed checkout reserve inventory, charge payment and create shipment involve kar sakta hai. Saga local transactions coordinate karti hai; failure compensation release inventory or request refund ho sakta hai. Compensation time reverse nahi karta: email unsend nahi ho sakti, refund processing delay ho sakti hai. User-visible pending/failed states first-class banao.

Saga design karte waqt steps ko deliberately order karo: sabse zyada reversible cheezein pehle, sabse kam reversible baad mein. Inventory reservation easily release ho jaati hai, payment refund ho sakta hai (delay ke saath), lekin email aur third-party webhook irreversible hain. Isliye notification hamesha aakhri step hona chahiye — agar wo pehle bhej diya aur payment fail hua, toh tumne user ko ek order confirm kar diya jo exist nahi karta.

```text
reserve inventory  (compensate: release)         <- easily reversible
charge payment     (compensate: refund)          <- reversible with delay/cost
create shipment    (compensate: cancel if unshipped)
send confirmation  (compensate: none possible)   <- last, always
```

Orchestration versus choreography ka practical tradeoff: choreography (har service event sunkar next step trigger kare) coupling kam dikhta hai, lekin poora workflow kahin likha hua nahi hota — debug karne ke liye 5 services ke logs jodne padte hain aur "yeh order abhi kahan atka hai" ka koi single jawab nahi milta. Orchestration (ek coordinator explicit state machine chalaye) ek central dependency add karta hai, lekin uske paas har saga instance ka current state aur history hoti hai. Multi-step business workflow ke liye orchestration usually better choice hai kyunki operability workflow ki length ke saath zyada matter karti hai.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** Broker "exactly-once" support karta hai, isliye consumer ko idempotent banane ki zaroorat nahi. **Why it breaks:** Broker ka exactly-once usually *uske apne log ke andar* hota hai (producer dedupe plus transactional read-process-write within the same broker). Jaise hi consumer koi external effect karta hai — database write kisi aur system mein, HTTP call, email — wo guarantee khatam ho jaati hai, kyunki broker us side effect ka part nahi hai. **Fix:** Consumer ko hamesha idempotent design karo; broker ki guarantee ko optimization maano, correctness ka basis nahi.
- **Wrong assumption:** Queue add karne se overload problem solve ho jaati hai kyunki requests ab buffer ho jaayengi. **Why it breaks:** Queue arrival rate aur service rate ke beech ka mismatch absorb nahi karti, wo usse *latency mein convert* karti hai. Agar consumers permanently slow hain toh queue infinitely badhti hai aur users ko ek aisi request ka wait milta hai jo shayad ab relevant hi nahi rahi. Queue ke bina fast failure aksar better user experience hai. **Fix:** Queue ke saath hamesha bounded size, admission control (queue full par reject), aur ek maximum useful age (usse purane messages drop ya DLQ) define karo.
- **Wrong assumption:** Event ordering guaranteed hai kyunki producer ne unhe order mein bheja tha. **Why it breaks:** Ordering typically sirf ek partition ke andar hoti hai. Agar events different partitions par distribute hue (default round-robin key), toh `OrderCreated` aur `OrderCancelled` alag partitions par jaakar reverse order mein process ho sakte hain — aur consumer ek cancelled order ko active bana dega. Retries aur redelivery bhi order todhte hain. **Fix:** Related events ko same partition key par bhejo (jaise `orderId`), aur uske upar version/sequence number rakho taaki out-of-order update ko consumer reject ya buffer kar sake.
- **Wrong assumption:** Retry ko infinite rakhna safe hai kyunki eventually to succeed karega hi. **Why it breaks:** Permanent failures (malformed payload, deleted resource, permission revoked) kabhi succeed nahi karenge — wo forever CPU, connections aur log volume consume karte rahenge, aur ek badi poison batch consumer throughput ko permanently degrade kar deti hai. Saath hi unbounded retries dependency ko recover hone ka space nahi dete. **Fix:** Errors ko retryable aur non-retryable mein classify karo, bounded attempts rakho, aur baaki DLQ mein bhejo jahan human decide kare.
- **Wrong assumption:** Outbox pattern lagane ke baad message delivery guaranteed aur single ho jaati hai. **Why it breaks:** Outbox sirf ek problem solve karta hai — business write aur event intent ko atomically record karna. Relay publish ke baad aur outbox row mark karne se pehle crash kar sakta hai, matlab wahi event dobara publish hoga. Delivery at-least-once hi rehti hai. **Fix:** Outbox ko consumer-side dedupe ke saath pair karo; dono milkar end-to-end effectively-once behavior dete hain, akela outbox nahi.
- **Wrong assumption:** Consumer lag zero hai toh system healthy hai. **Why it breaks:** Lag zero iska bhi matlab ho sakta hai ki producer ne publish karna hi band kar diya (upstream outage), ya consumer messages ko silently fail karke acknowledge kar raha hai. Dono cases mein dashboard green dikhta hai aur business process ruk chuka hota hai. **Fix:** Lag ke saath throughput aur success rate dono monitor karo, aur expected-volume floor par alert lagao ("last 10 minutes mein zero orders processed" bhi ek alert hai).

## Interview questions — bolkar practice karo

**Does outbox guarantee one email?** Nahi. It solves atomic business-data/event recording; relay and consumer duplicates still possible hain. Email provider idempotency or notification state tracking required ho sakti hai.

**What should you retry?** Transient failures where operation safe or idempotent hai. Validation failures and permanent permission denial retry karna wasted load hai.

**Synchronous call kab async event se replace karoge?** Jab caller ko result ka turant intezaar nahi karna hai aur work ka failure user ke primary action ko fail nahi karna chahiye — jaise order place hone ke baad email bhejna, search index update karna, analytics record karna. Agar caller ko result chahiye response dene ke liye (payment authorization, inventory check), toh async karna sirf complexity add karta hai kyunki phir tumhe polling ya callback banana padega. Test yeh hai: "agar yeh step 5 minute late ho jaaye toh business consequence kya hai?" Koi nahi — async karo. User confused ho jaayega — sync rakho.

**Ek consumer 10x slow ho gaya — pehle kya karoge?** Pehle confirm karunga ki slowness consumer mein hai ya uski dependency mein — aksar database ya downstream API slow hoti hai aur consumer sirf wait kar raha hota hai. Uske baad immediate mitigation: agar work parallelizable hai toh consumer instances badhao, lekin sirf tab jab downstream us extra concurrency ko handle kar sakti ho — warna tum bottleneck ko aur zor se hit karoge. Agar downstream hi bottleneck hai toh opposite karna padta hai: intake throttle karo aur non-critical event types ko temporarily defer karo taaki critical events ka lag control mein rahe. Saath saath oldest-message-age track karunga taaki pata rahe ki recovery ho rahi hai ya nahi.

**At-least-once ke saath user ko duplicate email kaise nahi jaayegi?** Delivery layer par duplicate rokna possible nahi hai, isliye dedupe effect ke sabse kareeb rakhta hoon: notification ke liye ek natural idempotency key banao (jaise `orderId + "order_confirmation"`), usse ek `notifications` table mein unique constraint ke saath insert karo, aur email tabhi bhejo jab insert succeed kare. Provider ko bhi wahi key idempotency header mein do. Isse chahe event 5 baar deliver ho, insert ek hi baar succeed karega aur baaki attempts no-op ho jaayenge.

## Practice

Consumer ko database commit ke immediately baad crash karao and same event replay karo. Notification duplicate prevent karne ki mechanism explain karo. One-hour backlog drain time derive karo at different worker throughput.

Phir retry amplification measure karo: teen nested layers banao jinme har ek 3 attempts karti hai, downstream ko artificially fail karao, aur actual request count gino. Uske baad "retry only at one layer" policy lagakar dobara gino. Last mein poison message inject karo (ek event jiska payload schema violate karta hai) aur verify karo ki wo bounded attempts ke baad DLQ mein jaata hai, queue block nahi karta — phir DLQ se replay tool likhkar test karo ki fix ke baad wo cleanly process ho jaata hai.

## Research notes: Budget retries across the call graph

Dependency already struggle kar rahi ho tab retries aur capacity leti hain. Three layers × maximum three attempts each se 27 leaf attempts ho sakti hain. Attempt count mein original call included hai ya nahi, clear karo.

Retry boundary choose, attempts cap, end-to-end deadline honor aur jitter se retries spread karo. Timed-out write already commit ho sakti hai; operation semantics respect karo.

**Interview check:** Exponential backoff bina jitter burst kyun bana sakta hai?

**Answer:** Saath fail hue clients next attempt bhi saath schedule kar sakte hain. Random delay spread karti hai; limits/budget phir bhi chahiye kyunki wait capacity nahi banata.

**Practice:** 900ms ko two attempts, waits aur network overhead mein allocate karo.

[Source yahan padho — AWS Builders’ Library](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Consumer order update commit karke acknowledgement se pehle crash karta hai. Redelivery aur safe response explain karo.

> **Hint:** Broker ko apne aap nahi pata ki business effect commit ho chuka hai.

**Answer guide — compare after attempting:** Message dobara expect karo. Durable processed-message ID aur business update coordinate karo taaki replay no-op ho; phir ack karo. Retries bound karo, poison messages isolate karo. External side effect ko apni idempotency strategy chahiye; in-memory dedup enough nahi.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

- [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Timeouts retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Saga orchestration](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html)
