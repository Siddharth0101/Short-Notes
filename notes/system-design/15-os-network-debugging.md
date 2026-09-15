---
id: system-design-os-network-debugging
title: OS aur networking interviews — slow request ko layer-wise diagnose karo
track: system-design
order: 15
level: Intermediate
minutes: 33
summary: Process, threads, memory aur network layers ko observable symptoms se connect karo; timeout ko failed business operation ka proof mat samjho.
tags: os, networking, tcp, dns, tls, debugging
---

## Mental model — simple soch

Browser spinner se database tak ek request multiple resources use karti hai. “Server slow” symptom hai, diagnosis nahi. DNS, connection, TLS, proxy queue, application CPU, DB-pool wait, SQL aur response transfer ko separate timings mein socho. Har layer ko apni responsibility aur evidence ke saath explain karna interview mein useful hai.

> **Core takeaway:** Pehle latency kahan spend ho rahi hai locate karo; phir us resource ka bottleneck aur failure contract test karo.

HTTP/tooling, concurrency, capacity planning aur observability chapters prerequisites hain. OS implementation details platform-specific ho sakti hain. Yahan general model aur original troubleshooting scenarios hain; arbitrary production commands run karne ki checklist nahi.

## Process, thread aur waiting ka farq

Process address space/resource boundary deta hai; same process ke threads memory/resources share kar sakte hain aur apna execution state/stack rakhte hain. Sharing communication easy banati hai, lekin races bhi possible hain. “Threads always cheaper/faster” absolute rule nahi: workload, runtime aur resource cost measure karo.

CPU-bound task actual computation mein busy hai. I/O-bound task network/disk completion wait karta hai. More threads CPU cores magically increase nahi karti. Context switching, lock contention aur queueing overhead badh sakte hain. Async I/O wait ke dauran resource sharing improve kar sakti hai; CPU-heavy JSON parse ko async function label karne se computation disappear nahi hoti.

Mutex exclusive ownership deta hai; semaphore limited concurrent admissions represent kar sakti hai. Race wrong interleaving hai; deadlock circular waiting se progress stop karta hai; starvation mein some work indefinitely wait karta hai despite others progressing. Deadlock resolve karne ke liye consistent lock order, smaller critical sections ya deliberate timeout/retry policy evaluate karo.

## Memory number ko label ke saath padho

Heap language-managed objects ka region ho sakta hai; process memory mein stacks, direct/native buffers, mapped pages aur runtime overhead bhi ho sakta hai. Heap stable ho aur resident memory badhe toh native/direct allocations aur thread count inspect karo. Har growing memory graph GC leak nahi. Virtual address reservation aur actually resident physical pages same metric nahi.

Paging/demand loading virtual memory ko physical resources se map karti hai. Page fault necessarily application crash nahi; required page load/mapping ho sakti hai. Heavy paging latency badha sakti hai. Container memory limit process ki configured heap se alag total-memory constraint impose kar sakti hai.

## URL se response tak timeline

```text
name resolution -> connection setup -> TLS (HTTPS)
  -> request bytes -> proxy/app queue
  -> handler CPU + downstream waits
  -> response headers/body -> client parse/render
```

Cache/reused connection ki wajah se har request fresh DNS/TLS handshake nahi karti. DNS hostname ko address discovery mein help karta hai; HTTP status generate karne wala application layer alag hai. DNS success se port reachable, certificate valid ya API authorized prove nahi hota.

TCP reliable ordered byte stream deta hai, application messages ki boundaries nahi. Sender ne two writes kiye toh receiver ko exactly two reads milenge guarantee nahi. Length prefix/delimiter/protocol parser se framing handle karo. Retransmission/drop recovery transport concern hai; TCP acknowledgment business transaction commit ka proof nahi.

TLS channel encryption/authentication support karta hai; wrong-tenant authorization bug solve nahi karta. Certificate validation bypass karke diagnosis “fix” mat karo; hostname, trust chain aur configured endpoint inspect karo. HTTP/3 QUIC use karta hai; every HTTP request ko TCP handshake story se describe mat karo.

## Original incident drills

| Symptom | First hypothesis | Evidence/next check |
| --- | --- | --- |
| SQL 10 ms, API 2 s | Connection-pool wait ya app queue | Separate acquire/query timing |
| CPU low, p99 high | I/O/lock wait; average load hides hot instance | Wait stacks, per-instance queue |
| CPU high, all routes stall | Event-loop blocking/heavy calculation | CPU profile, payload size |
| Heap stable, RSS grows | Native buffers/threads/mappings | Native allocation/thread trends |
| DNS resolves, connect refused | Listener/port/service path | Correct address/port and service readiness |
| Response timeout after write | Outcome unknown | Stable operation ID/status lookup |

Load balancer readiness change instantly all routers tak propagate nahi hota. Drain plan ko transition traffic handle karni hogi. Keep-alive request reuse aur WebSocket upgrade ka connection lifetime different hai. Deadline caller wait bound karti hai; server already commit kar chuka ho sakta hai.

## Practice — estimate aur diagnosis

Illustrative stable workload: 200 requests/s aur average total time 0.25 s. Little's Law ke assumptions par average in-flight ≈ 50. Yeh 200 concurrent requests ka claim nahi; arrival rate aur concurrency units alag hain. Latency double ho aur arrivals same rahein toh average in-flight double ho sakti hai, queue/pool pressure badhega.

Apni investigation mein hypothesis, observation aur next experiment separately likho. “More replicas” se single hot database row ya shared quota automatically solve nahi hoti. Reproducible controlled load aur resource metrics se decision justify karo.

## Depth walkthrough — andar kya ho raha hai?

### Slow request ko layer-wise eliminate karo

Browser wait 2 seconds, SQL execution 20 ms. Isse “database unrelated” conclude mat karo: connection acquisition mein 1.5 seconds wait ho sakti hai jo SQL timer include nahi karta. End-to-end trace mein DNS/connect/TLS, server queue, pool wait, query, downstream aur response transfer separately measure karo.

Low CPU ka matlab spare useful capacity guaranteed nahi. Threads lock, disk/network I/O ya scarce connection ka wait kar sakti hain. CPU high ho toh profile mein actual hot stack identify karo; just adding replicas shared database bottleneck worsen kar sakta hai.

TCP ordered byte stream hai: one write one read correspond karna guarantee nahi. Application length-prefix/delimiter framing se complete message reconstruct kare aur maximum frame size validate kare. TLS encryption framing policy ka replacement nahi.

**Practice:** Incident report mein observed symptom, competing hypotheses, discriminating measurement aur verified change likho. Timeout increase karna symptoms delay kar sakta hai; root bottleneck/resource leak fix nahi. Request rate aur average duration se average in-flight estimate karo, p99 se same Little's Law substitution mat karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Low CPU ke saath slow API kyun possible hai?

**Apply — khud try karo:** Client timeout hua, server ka order committed hai. Safe retry response design karo.

> **Hint — chhota ishara:** Transport failure aur business outcome alag hain.

**Answer guide — pehle khud karo, phir compare karo:** Stable operation ID se authoritative status retrieve/reconcile karo. Blind new order retry duplicate create kar sakti hai. Idempotency record aur deadline/cancellation policy define karo.

**Exit check — aage badhne se pehle:** DNS, TCP, TLS aur application authorization mein har layer kya prove karti hai?

## Sources — aur padhne ke liye

[OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) se processes, virtualization aur concurrency ke primary teaching chapters padho. [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) aur [TCP specification](https://www.rfc-editor.org/rfc/rfc9293.html) layer contracts explain karte hain.
