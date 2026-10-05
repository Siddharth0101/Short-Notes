# Interviewer architecture audit

Reviewed agent orchestration, provider transport, tool validation, prompt context, durable memory, MongoDB commits, API boundaries, and browser recovery. This is a local single-learner application, not a production-readiness certification.

## Improvements implemented

- Bound aggregate model context to 180,000 serialized characters per call, tool execution to 12 calls per turn, and each tool result to 24,000 characters. Existing six-round, eight-call-batch, and 90-second limits still apply. Character budgets are not exact token or money budgets. Traces now include prompt character counts without recording additional content.
- Limit current-session assessment context to 16,000 characters while preserving the latest observations. Oversized recent code history includes a clearly marked excerpt instead of silently removing all conversational history. The current submitted answer/code is preserved separately.
- Include the full most recent interviewer question, original phase, and specialist when an answer arrives. This lets a newly selected specialist evaluate an answer to the prior round before continuing.
- Reject inherited object-property names in tool arguments. Only explicit AgentError instances can expose messages/status through the HTTP boundary; unexpected storage/provider errors are sanitized even if they have a status property.
- Break same-timestamp assessment ties using numeric assessment order, so attempt 11 does not sort before attempt 9 and resurrect an older mistake.

## Existing strengths verified

The hub owns phase selection; role-scoped tools cannot run shell commands or arbitrary code. Model tools cannot directly write other memories. Working copies commit only after successful turns. MongoDB stores the transcript, assessments, and request identity in one atomic document; stale concurrent writes are rejected. Insert-only migration preserves original IDs and backups. Subject and learner namespaces filter history, and database secrets remain server-only. UI tests cover retry identity, ambiguous errors, pause/resume, drafts, and voice fallbacks.

## Remaining work and limits

1. Public deployment requires actual authentication and ownership enforcement, HTTPS, distributed rate limits and spend quotas. The configured learner namespace is not authentication. MongoDB credentials previously shared in chat should be replaced with a strong, dedicated credential before deployment; rotation requires the owner's action.
2. Retrieval currently matches normalized topic labels and scans projected assessments for a subject. Large histories need indexed concept IDs and database-side aggregation; semantic retrieval should be evaluated before adding embeddings. No claim of exhaustive recall or spaced-repetition scheduling.
3. Assessment correctness and repeated-question choice remain model judgments. Add a curated interview-quality evaluation set covering wrong premises, partial answers, corrections, adversarial answers and topic drift, with human-reviewed expected behavior. Deterministic regression tests do not prove teaching quality.
4. Add learner-facing controls for deleting/exporting stored memory and a documented retention policy. Do not silently auto-delete existing history during an upgrade.
5. Full-hour microphone, accessibility, browser compatibility, and latency testing remain needed. Browser speech recognition is not a streaming realtime voice agent. Submitted code is reviewed, not executed; execution would require a separately isolated sandbox.
6. MongoDB's document-size ceiling, growing history, output rendering policy, and session-creation retry identity deserve follow-up before high-volume use. Existing per-turn limits do not impose a daily monetary budget.

## Verification

Run `npm run check` in `playground/` after installing both package locks. `npm run db:check` separately verifies Atlas using synthetic records in a unique learner namespace and cleans only those records. Regression coverage includes bounded contexts and retrieval loops, cross-phase question continuity, schema edge cases, safe API errors, deterministic memory ordering, persistence, isolation, migration, retries and stale writes.
