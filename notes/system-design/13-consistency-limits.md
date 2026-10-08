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

## Recall aur practice

- Sawal — Har replica per-user100rps allow kare, ten replicas ho toh global maximum exactly100rps hai?
- Jawaab — Nahi; independent counters potentially1000rps allow. Global coordinated quota ya bounded approximate contract chahiye.
- Khud try karo — Linearizable claim aur global limiter ke partition cases trace karo; minority writes, clock skew, retry aur fail-open/closed policy justify karo.

## Sources — aur padhne ke liye

- [Raft original consensus paper](https://raft.github.io/raft.pdf)

- [Redis rate-limiter patterns](https://redis.io/docs/latest/commands/incr/)
- [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/13-consistency-limits.md)
