---
id: system-design-consistency-limits
title: Consistency aur distributed rate limiting — guarantees pehle likho
track: system-design
order: 13
level: Advanced
minutes: 33
summary: Replica freshness, atomic decisions aur overload policy ko separate contracts banao; local limiter ko global guarantee mat bolo.
tags: consistency, rate-limiting, token-bucket, distributed
---

## Mental model — simple soch

Distributed system mein “database update ho gaya” ke baad bhi har reader same value turant nahi dekh sakta. Aur “har instance 100 requests allow karta hai” ka matlab poora cluster 100 allow karta hai nahi. Dono problems mein common question hai: decision ka authoritative state kahan hai, kaun atomic update karta hai aur failure ke waqt kya promise bachta hai?

> **Core takeaway:** Guarantee ko client-visible history aur failure scenario se explain karo; sirf consistency label ya limiter algorithm ka naam enough nahi.

Requirements, caching, messaging aur case studies ke baad yeh design extension padho. Pehle required behavior define karo: profile photo thodi stale ho sakti hai; last seat double-sell nahi honi chahiye. Same app ke har operation ko same consistency/cost tradeoff dena zaroori nahi.

## Read-after-write ko timeline mein dekho

A primary par name update karta hai; write acknowledge hoti hai. Agla read lagging replica se old name return karta hai. Eventual replication mein yeh possible history ho sakti hai. UI ko apni successful write disappear hoti dikh rahi hai. Choices: authoritative read path, minimum-version/session token, ya confirmed response se local cache update plus deliberate reconciliation.

Local UI update doosre device ko fresh data guarantee nahi deta. “Eventually” ka fixed maximum delay tabhi claim karo jab system ka documented bound ho. Monotonic reads ka matlab user ko version 12 dekhne ke baad version 11 na dikhana; read-your-writes apni writes reflect karne ka separate requirement hai.

Strong read akeli read-then-write race solve nahi karti: dono callers latest stock=1 read kar sakte hain. Atomic conditional update ya appropriate transaction/isolation policy invariant protect kare. Single-item atomicity ko multi-item transaction guarantee mat samjho. Product-specific guarantees operation, index aur topology ke hisaab se differ karti hain.

Network partition mein coordination unavailable ho sakti hai. Operation ko stale answer dena, wait/fail karna ya limited local allowance dena business decision hai. CAP ko normal operation mein “bas koi two choose karo” shortcut se replace mat karo; partition ke waqt conflicting guarantees ka concrete example do.

## Rate limiter ka contract

Identity authenticated user/tenant/API key ho sakti hai; IP shared NAT users ko unfairly group kar sakta hai. Policy mein sustained rate, burst capacity, request cost aur rejection response define karo. Expensive export aur cheap metadata request ko same cost dena overload control ko weak kar sakta hai.

Fixed window simple hai, lekin boundary ke just before/after almost double burst aa sakta hai. Sliding log accurate recent count deta hai, storage zyada ho sakti hai. Token bucket capacity C tak credits accumulate karta hai aur rate R se refill hota hai. Burst C possible hai; long-run admission refill se bounded hoti hai.

## Token bucket ka original local model

Below single-process, synchronous teaching function hai. Times milliseconds aur nondecreasing monotonic clock se aate hain. Inputs finite aur valid hone chahiye. Storage/network/clock-distribution is snippet ke scope mein nahi.

```js
function consume(bucket, now, capacity, perSecond, cost = 1) {
  if (![bucket.tokens, bucket.at, now, capacity, perSecond, cost].every(Number.isFinite) ||
      capacity <= 0 || perSecond <= 0 || cost <= 0 || cost > capacity || now < bucket.at ||
      bucket.tokens < 0 || bucket.tokens > capacity) throw new RangeError('Invalid bucket');
  const tokens = Math.min(capacity, bucket.tokens + (now - bucket.at) * perSecond / 1000);
  const allowed = tokens >= cost;
  return {
    allowed,
    bucket: { tokens: allowed ? tokens - cost : tokens, at: now },
    retryMs: allowed ? 0 : Math.ceil((cost - tokens) * 1000 / perSecond),
  };
}
let state = { tokens: 2, at: 0 };
for (const now of [0, 0, 0, 500, 1000]) {
  const result = consume(state, now, 2, 1);
  state = result.bucket;
  console.log(result.allowed);
}
// true, true, false, false, true
```

Rejected request par bhi returned refill state persist ki hai. Capacity refill ko cap karti hai; idle rehkar infinite burst collect nahi hota. Retry estimate future competing requests ignore karta hai, reservation nahi hai. Production mein floating arithmetic/units ki precision policy choose karo.

## Cluster mein atomic admission

Five replicas ke independent C=100 buckets total burst up to 500 allow kar sakte hain. Global limit chahiye toh shared atomic check-and-consume ya carefully allocated local quotas chahiye. Redis mein separate GET, decision, SET race-prone hai. Fixed-window INCR aur expiry ke beech crash window bhi consider karo; server-side atomic operation/script ka design official pattern se verify karo.

Shared store unavailable ho toh fail-open, fail-closed ya bounded emergency quota choose karo. Login-abuse protection aur noncritical browse endpoint same fallback demand nahi karte. Hot tenant key bottleneck, key cardinality/expiry, retry storms aur trusted identity source bhi design ka part hain. Rate limiting fraud prevention, authorization aur downstream backpressure ka complete replacement nahi.

## Practice — failure table banao

Store timeout, clock going backward, duplicated request, rolling restart aur one hot tenant ke liye expected response likho. 429 ke saath actionable retry guidance do, lekin internal identity/cache key leak mat karo. Accepted/rejected counts, store latency aur fallback-mode duration observe karo. Test concurrency mein accepted total ko claimed global bound se compare karo.

## Depth walkthrough — andar kya ho raha hai?

### Limiter decision ka unit aur scope pehle define karo

100 requests/minute per user aur maximum 10 concurrent operations different contracts hain. Token bucket burst allow kar sakti hai; fixed window boundary par back-to-back windows unexpected burst permit kar sakti hain. Rate accepted requests count karti hai ya attempts, choose karo.

Two instances independently local counter use karein toh global limit aggregate exceed ho sakti hai. Shared store atomic operation coordinate kar sakti hai; store unavailable ho toh fail-open/fail-closed tradeoff availability/security impact se derive karo. Client identity trusted source se aani chahiye.

**Practice:** Burst, idle refill, clock movement aur distributed simultaneous requests trace karo. Denied request retry hint semantics define karo. Consistency choice resource-specific hai: stale public catalog acceptable ho sakti hai, one remaining seat claim atomic invariant maangti hai. Blanket “eventual consistency everywhere” useful design answer nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Fresh read ke baad bhi two writers stock oversell kaise kar sakte hain?

**Apply — khud try karo:** Three independent replicas capacity 10 aur refill 1/sec use karti hain. Kya global burst 10 enforce hota hai?

> **Hint — chhota ishara:** Har replica ke initial credits count karo.

**Answer guide — pehle khud karo, phir compare karo:** Nahi, initial cluster burst 30 tak ho sakta hai. Strict global 10 ke liye coordinated atomic state ya total allocated credits 10 ki quota scheme chahiye. Quota transfer/failover aur temporary underutilization ki policy define karo.

**Exit check — aage badhne se pehle:** Store failure par chosen endpoint ka fail-open/closed decision business impact ke saath defend karo.

## Sources — aur padhne ke liye

[Redis rate-limiter patterns](https://redis.io/docs/latest/commands/incr/) aur [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) se product-specific guarantees compare karo.
