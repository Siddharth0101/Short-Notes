---
id: system-design-consistency-limits
title: Consistency aur distributed rate limiting — guarantees pehle likho
track: system-design
order: 13
level: Advanced
minutes: 3
summary: Strong consistency — defined operation model ke hisaab se latest ordered state.
tags: consistency, rate-limiting, token-bucket, distributed
---

## Quick revision

> Revision target — Consistency aur rate-limit claims ko operation scope, clock aur atomic decision boundary do.

- Strong consistency — defined operation model ke hisaab se latest ordered state.
- Eventual consistency — writes rukne par replicas converge; immediate freshness nahi.
- Read-your-writes — apne write ke baad old value na dikhe; routing/version strategy chahiye.
- Replica lag — stale reads possible; critical reads primary/appropriate consistency se.
- CAP — network partition ke waqt consistency/availability tradeoff; normal-time universal toggle nahi.
- Token bucket — refillable tokens; rate + burst capacity control.
- Distributed limiter — shared atomic decision ya explicit approximate limit.
- Fail-open/closed — limiter outage par availability/security tradeoff decide.
- Quorum — read/write set overlap useful; alone linearizability ka complete proof nahi.
- Clock skew — client timestamps ko total global order ka unquestioned proof mat samjho.
- Monotonic reads — user ko previously seen version se older state na dikhe; routing/version tracking chahiye.

### Edge cases aur reasoning

- Linearizability — operation invocation/response ke beech atomic point aur real-time order preserve; serializability transactions ka different guarantee hai.
- Consensus scope — Raft replicated log ko leader/majority se agree karata; partitioned minority committed writes progress nahi kar sakti under safety contract.
- Token refill atomicity — refill+consume same decision boundary; distributed clocks/time source aur burst cap consistent rakho.
- Limiter scope — per-instance100rps with ten instances global100rps nahi; shared decision/partitioned quota ya approximate guarantee explicitly state karo.
- Partition availability — CAP availability har non-failing node request ko response require karti; ordinary uptime percentage se definition different.

## Example se samjho

- Scenario — Token bucket capacity 5, refill 2 tokens/s hai. Initially full bucket se five requests same instant tokens consume karti hain.
- Reasoning — Sixth immediate request reject/wait policy follow karegi. Agle one second mein two tokens refill; elapsed time aur consume ek atomic state update mein account hon.
- Catch — Refill cap 5 hi rahe; idle time unlimited burst credit nahi deta. Independent per-instance buckets global limit ko enforce nahi karte.

## Recall aur practice

- Sawal — Har replica per-user100rps allow kare, ten replicas ho toh global maximum exactly100rps hai?
- Jawaab — Nahi; independent counters potentially1000rps allow. Global coordinated quota ya bounded approximate contract chahiye.
- Khud try karo — Linearizable claim aur global limiter ke partition cases trace karo; minority writes, clock skew, retry aur fail-open/closed policy justify karo.

## Practice questions

### Easy · Strong ya eventual?

Bank balance, like count, product description, inventory at checkout — har ek ke liye kya chahiye?

<details>
<summary>Answer</summary>

- Bank balance — strong (linearizable writes/reads at decision point).
- Like count — eventual; thoda stale chalega.
- Product description — eventual (cache OK).
- Inventory at checkout — strong at reservation step; listing page par eventual.

</details>

### Medium · Token bucket implement karo

Per user 10 requests/second, burst 20. Multi-instance setup.

<details>
<summary>Answer</summary>

- State — `tokens`, `lastRefill` per key Redis mein.
- Refill — `tokens = min(capacity, tokens + elapsed × rate)`; request par `tokens >= 1` toh `-1`.
- Atomicity — read-refill-decrement ek Lua script/atomic op mein, warna concurrent requests limit todte hain.
- Time — Redis server time use karo (clock skew avoid).

</details>

### Medium · Limiter down: fail-open ya fail-closed?

<details>
<summary>Answer</summary>

- Fail-open — limiter down par requests allow; availability priority (normal APIs).
- Fail-closed — deny; security-sensitive (login brute force, expensive paid APIs).
- Middle — local in-memory fallback limits per instance.
- Decide per route aur document karo.

</details>

### Medium · CAP ko sahi bolo

<details>
<summary>Answer</summary>

- CAP — network partition ke dauran system ya toh consistency (kuch requests reject) ya availability (stale/conflicting responses) choose karta hai.
- "2 of 3 pick karo" misleading — partition ke bina dono mil sakte hain; trade-off latency vs consistency bhi (PACELC).
- Interview — specific operation ke liye bolo: "partition mein checkout writes reject karenge, catalog reads stale serve karenge."

</details>

### Hard · Distributed lock aur fencing token

Worker A ne lease lock liya, GC pause hua, lease expire; Worker B ne lock liya; A jaag kar purana data likh deta hai.

<details>
<summary>Answer</summary>

- Problem — lease time-based hai; holder ko pata nahi ki lock chala gaya.
- Fencing token — lock service har grant par badhta number de (33, 34...); storage sirf greater-or-equal token wale writes accept kare; A ka token 33 reject.
- Storage cooperation zaroori — sirf lock service se safety nahi.
- Better — jahan possible, DB conditional updates/unique constraints se correctness, lock sirf efficiency ke liye.

</details>

## Sources — aur padhne ke liye

- [Raft original consensus paper](https://raft.github.io/raft.pdf)

- [Redis rate-limiter patterns](https://redis.io/docs/latest/commands/incr/)
- [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/13-consistency-limits.md)
