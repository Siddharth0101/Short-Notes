---
id: design-security-operations
title: Security observability and production operations
track: system-design
order: 9
level: Advanced
minutes: 3
summary: Trust boundary — verify identity, input and permissions at every hop.
tags: security, observability, deployment, reliability
visual: request-flow
---

## Quick revision

> Revision target — Assess operational recovery through verified restore evidence and correct authorization boundaries.

- Trust boundary — verify identity, input and permissions at every hop.
- Authorization — check the resource/user/tenant relation; guessing an ID is not permission.
- Rate limit — define the unit, key, window and failure policy.
- Observability — correlated logs, metrics and traces.
- SLO — a reliability target; the error budget is the allowance of bad events/time.
- Alert — focus on user impact and an actionable response.
- Cardinality — do not keep unbounded IDs in metric labels.
- Rollout — a canary, a health signal and a rollback trigger.
- Degradation — shed optional features; preserve correctness-critical rules.
- RTO/RPO — the target time to restore service / the acceptable data-loss window.
- Backup restore — having a backup file is not enough; verify the restore path regularly.
- Error budget burn — how fast the allowable failure is being consumed; align alert severity with it.

### Browser defenses

- CSP — restricts script sources/execution; not a replacement for encoding.
- Clickjacking — stop unauthorized embedding with a frame-ancestors policy.

### Browser security

- XSS — injection of untrusted HTML/script; apply layers of context-aware escaping, sanitization and CSP.
- CSRF — misuse of auto-sent credentials; a suitable token, SameSite and origin checks.
- CORS policy — the allowed browser origins/read access; server authorization is still mandatory.

### Edge cases and reasoning

- Backup versus replica — a replica can replicate a logical delete/corruption; you need independently retained restorable backups and tested recovery.
- SLO denominator — define the population of successful valid user events; keep the excluded requests and the measurement window transparent.
- Audit integrity — access-restricted append/retention policies; dumping sensitive payloads into operational logs is not a replacement for a useful audit.

## Research notes: Turn an SLO into a concrete budget

- Choose the user-visible indicator before the target.

## Understand it with an example

- Scenario — An accidental delete happened on the primary and the replica applied the delete too; yesterday's retained backup is available.
- Reasoning — A replica failover will not restore the deleted record. Verify the backup restore/recovery path on an isolated target, then plan the authorized repair and consistency checks.
- Catch — The existence of a backup does not prove the recovery time or the acceptable data-loss window; measure the restore duration, missing writes and access permissions in an exercise.

## Recall and practice

- Question — What is the error allowance for 99.9% successful requests across1M eligible requests?
- Answer — 1000 bad requests; the downtime allowance of a time-based SLO is calculated from a different denominator.
- Try it yourself — Write a restore exercise plan; give the detection/RTO/RPO evidence for a deleted record, a corrupt primary, an unavailable region and a stolen credential.

## Practice questions

### Easy · Defences for XSS, CSRF and clickjacking

<details>
<summary>Answer</summary>

- XSS — output encoding (framework escaping), avoid `innerHTML`, a Content-Security-Policy (`script-src` nonces), `HttpOnly` cookies.
- CSRF — `SameSite=Lax/Strict` cookies + CSRF tokens on state-changing requests.
- Clickjacking — `Content-Security-Policy: frame-ancestors 'none'` (or an allowlist); the older `X-Frame-Options: DENY`.

</details>

### Medium · API rate limit design

<details>
<summary>Answer</summary>

- Keys — the authenticated user id; the IP (+ device signals) for anonymous users; separate limits for expensive routes (login, search).
- Algorithm — a token bucket (bursts allowed), updated atomically in a shared store (Redis).
- Response — `429 Too Many Requests` + `Retry-After`; the client backs off.
- Observability — a metric for limited requests; check for false positives.

</details>

### Medium · CPU alert vs SLO alert

The on-call engineer is woken every night by a CPU 80% alert, but users have no problem. Better alerting?

<details>
<summary>Answer</summary>

- SLO — user-facing: e.g. 99.9% of requests succeed + < 300ms.
- Burn rate alerts — page when the error budget is being spent fast (e.g. 2% of the budget in 1 hour).
- CPU — for a dashboard/ticket, not for a page (unless there is user impact).
- Denominator — exclude health checks/bots from the SLO, otherwise the numbers mislead.

</details>

### Medium · There is a replica — do you need a backup?

<details>
<summary>Answer</summary>

- Replica — replicates a wrong `DELETE` or corruption immediately too; it is for HA, not for recovery.
- Backup — point-in-time recovery (base backup + WAL), a separate account/region, encryption.
- RPO/RTO — how much data loss and how much downtime is acceptable; that decides the backup frequency.
- Drill — test the restore regularly; an untested backup = no backup.

</details>

### Hard · Safe rollout and graceful degradation

The release of a new recommendation service; if it fails, checkout must not go down.

<details>
<summary>Answer</summary>

- Rollout — a feature flag + canary (1% → 10% → 50%), automatic rollback on SLO burn.
- Isolation — a short timeout on the recommendations call, a circuit breaker, a bulkhead (a separate pool).
- Degradation — on failure hide the section/use cached defaults; the critical checkout path must not depend on recommendations.
- Observability — segment the metrics by flag state.

</details>

## Sources — further reading

- [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [Source yahan padho — Google SRE](https://sre.google/sre-book/service-level-objectives/)
- [Kubernetes container probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/09-security-operations.md)
