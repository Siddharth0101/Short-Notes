---
id: interview-system-design
title: React and Java system design interview playbook
track: interview
order: 6
level: Advanced
minutes: 1
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

## Research notes: Expose assumptions and failure recovery

- Linked Microsoft technical guidance mein testing aur problem-solving bhi assessment ka part hain.

## Sources — aur padhne ke liye

- [Source yahan padho — Microsoft Careers](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [AWS safe retries and idempotency](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [AWS transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/06-system-design-playbook.md)
