---
id: system-design-consistency-limits
title: Consistency aur distributed rate limiting — guarantees pehle likho
track: system-design
order: 13
level: Advanced
minutes: 1
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

## Sources — aur padhne ke liye

- [Redis rate-limiter patterns](https://redis.io/docs/latest/commands/incr/)
- [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/13-consistency-limits.md)
