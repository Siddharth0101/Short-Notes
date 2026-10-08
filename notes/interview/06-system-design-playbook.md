---
id: interview-system-design
title: React and Java system design interview playbook
track: interview
order: 6
level: Advanced
minutes: 4
summary: Design round — requirements → estimate → APIs/data → architecture → bottlenecks → failure.
tags: system-design, interview, react, java, architecture
visual: outbox-pattern
---

## Quick revision

- Design round — requirements → estimate → APIs/data → architecture → bottlenecks → failure.
- Assumption — number/constraint explicitly bolo; silently invent mat karo.
- Frontend — state ownership, request races, cache, accessibility aur performance.
- Backend — invariant, transaction, idempotency aur recovery.
- Scale — actual bottleneck par cache/partition/queue choose karo.
- Failure — timeout, duplicate, partial commit aur reconnect walkthrough.
- Tradeoff — benefit + cost + kab decision change hoga.
- Decision record — choice, reason aur revisit trigger short likho.
- Bottleneck defense — load double ho toh first saturated resource identify.
- Design alternatives — do options compare using given constraints; tool popularity se decision nahi.
- Recovery story — failure detect → isolate → repair → reconcile → verify.

### Quick answer checks

- Design numbers — units/assumptions label karo; rough QPS, storage aur peak multiplier calculate karo.
- Recovery answer — source of truth, replay/deduplication aur RTO/RPO ko failure scenario se connect karo.

### Project aur behavioral answers

- STAR — Situation → Task → Action → Result; context short, apna action aur outcome clear.
- Story bank — 3–5 real projects se impact, conflict, ambiguity aur learning examples ready rakho.
- Ownership answer — team ne kya kiya ke saath tumhara specific decision/action bolo; invented impact numbers mat do.
- Reflection — result ke baad kya seekha aur next time kya badloge, ek short point mein bolo.

### Edge cases aur reasoning

- Guarantee vocabulary — latest/read-your-writes/eventual ko exact operations/failure history se define; strong word alone answer nahi.
- Design review evidence — happy path ke baad duplicate, timeout, partition aur recovery timeline; durable truth aur action owner identify karo.
- Personal improvement record — observed incorrect reasoning aur self-confidence separate; next recall date khud plan, automation implemented assume mat karo.

## Research notes: Expose assumptions and failure recovery

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Recall aur practice

- Sawal — Exactly-once processing claim defend karne ke liye kaunsi boundary clear karoge?
- Jawaab — Message delivery, durable consumer effect aur external side effect separate; atomic dedupe scope, retention aur crash history explain karo.
- Khud try karo — 45-minute design round run karo; workload units, API/data, bottleneck, failure recovery aur two choices ki measured tradeoff review likho.

## Sources — aur padhne ke liye

- [Yangshun Tay — behavioral preparation](https://www.techinterviewhandbook.org/behavioral-interview/)

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [AWS safe retries and idempotency](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [AWS transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/06-system-design-playbook.md)
