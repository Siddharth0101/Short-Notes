---
id: design-security-operations
title: Security observability and production operations
track: system-design
order: 9
level: Advanced
minutes: 3
summary: Trust boundary — har hop par identity, input aur permissions verify karo.
tags: security, observability, deployment, reliability
visual: request-flow
---

## Quick revision

> Revision target — Operational recovery ko verified restore evidence aur correct authorization boundaries se assess karo.

- Trust boundary — har hop par identity, input aur permissions verify karo.
- Authorization — resource/user/tenant relation check; ID guess karna permission nahi.
- Rate limit — unit, key, window aur failure policy define karo.
- Observability — correlated logs, metrics aur traces.
- SLO — reliability target; error budget allowed bad events/time ka allowance.
- Alert — user impact aur actionable response par focus.
- Cardinality — unbounded IDs metric labels mein mat rakho.
- Rollout — canary, health signal aur rollback trigger.
- Degradation — optional features shed karo; correctness-critical rules preserve.
- RTO/RPO — service restore time target / acceptable data-loss window.
- Backup restore — backup file hona enough nahi; restore path regularly verify.
- Error budget burn — allowable failure kitni fast consume ho rahi hai, alert severity usse align.

### Browser defenses

- CSP — script sources/execution restrict; encoding ka replacement nahi.
- Clickjacking — frame-ancestors policy se unauthorized embedding roko.

### Browser security

- XSS — untrusted HTML/script injection; context-aware escaping, sanitization aur CSP layers lagao.
- CSRF — auto-sent credentials ka misuse; suitable token, SameSite aur origin checks.
- CORS policy — allowed browser origins/read access; server authorization phir bhi mandatory.

### Edge cases aur reasoning

- Backup versus replica — replica logical delete/corruption replicate kar sakti; independently retained restorable backups aur tested recovery chahiye.
- SLO denominator — successful valid user events ka population define; excluded requests aur measurement window transparent rakho.
- Audit integrity — access-restricted append/retention policies; operational logs mein sensitive payload dump karna useful audit ka replacement nahi.

## Research notes: Turn an SLO into a concrete budget

- Target se pehle user-visible indicator choose karo.

## Example se samjho

- Scenario — Accidental delete primary par hua aur replica ne bhi delete apply kar diya; yesterday ka retained backup available hai.
- Reasoning — Replica failover deleted record restore nahi karega. Backup restore/recovery path ko isolated target par verify karo, phir authorized repair aur consistency checks plan karo.
- Catch — Backup existence recovery time ya acceptable data-loss window prove nahi; restore duration, missing writes aur access permissions exercise mein measure karo.

## Recall aur practice

- Sawal — 99.9% successful requests across1M eligible requests ka error allowance?
- Jawaab — 1000 bad requests; time-based SLO ka downtime allowance different denominator se calculate hoga.
- Khud try karo — Restore exercise plan likho; deleted record, corrupt primary, unavailable region aur stolen credential cases ke detection/RTO/RPO evidence do.

## Practice questions

### Easy · XSS, CSRF aur clickjacking ke defences

<details>
<summary>Answer</summary>

- XSS — output encoding (framework escaping), `innerHTML` avoid, Content-Security-Policy (`script-src` nonces), `HttpOnly` cookies.
- CSRF — `SameSite=Lax/Strict` cookies + CSRF tokens state-changing requests par.
- Clickjacking — `Content-Security-Policy: frame-ancestors 'none'` (ya allowlist); purana `X-Frame-Options: DENY`.

</details>

### Medium · API rate limit design

<details>
<summary>Answer</summary>

- Keys — authenticated user id; anonymous ke liye IP (+ device signals); expensive routes (login, search) ke alag limits.
- Algorithm — token bucket (bursts allowed) shared store (Redis) mein atomically.
- Response — `429 Too Many Requests` + `Retry-After`; client backoff kare.
- Observability — limited requests ka metric, false positives check.

</details>

### Medium · CPU alert vs SLO alert

On-call har raat CPU 80% alert se uthta hai, par users ko problem nahi hoti. Better alerting?

<details>
<summary>Answer</summary>

- SLO — user-facing: e.g. 99.9% requests success + < 300ms.
- Burn rate alerts — error budget tez kharch ho raha ho (e.g. 1 hour mein 2% budget) tab page.
- CPU — dashboard/ticket ke liye, page ke liye nahi (jab tak user impact na ho).
- Denominator — SLO mein health checks/bots exclude karo, warna numbers misleading.

</details>

### Medium · Replica hai, backup chahiye?

<details>
<summary>Answer</summary>

- Replica — galat `DELETE` ya corruption bhi turant replicate karta hai; HA ke liye hai, recovery ke liye nahi.
- Backup — point-in-time recovery (base backup + WAL), alag account/region, encryption.
- RPO/RTO — kitna data loss aur kitna downtime acceptable; backup frequency usse decide.
- Drill — restore regularly test karo; untested backup = no backup.

</details>

### Hard · Safe rollout aur graceful degradation

Naye recommendation service ka release; fail ho toh checkout down nahi hona chahiye.

<details>
<summary>Answer</summary>

- Rollout — feature flag + canary (1% → 10% → 50%), automatic rollback on SLO burn.
- Isolation — recommendations call par short timeout, circuit breaker, bulkhead (alag pool).
- Degradation — fail hone par section hide/cached defaults; checkout critical path recommendations par depend na kare.
- Observability — flag state ke saath metrics segment karo.

</details>

## Sources — aur padhne ke liye

- [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [Source yahan padho — Google SRE](https://sre.google/sre-book/service-level-objectives/)
- [Kubernetes container probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/09-security-operations.md)
