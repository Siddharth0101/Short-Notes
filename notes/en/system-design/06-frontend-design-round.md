---
id: system-design-frontend-design-round
title: Frontend system design interview from requirements to failure
track: system-design
order: 6
level: Advanced
minutes: 5
summary: Frontend round — requirements → components/state → data flow → performance → failures.
tags: frontend, react, system-design, accessibility, caching
---

## Quick revision

> Revision target — Design a feature with state ownership, interaction contracts and recoverable failure paths.

- Frontend round — requirements → components/state → data flow → performance → failures.
- API contract — make the request shape, pagination, errors and cancellation clear.
- Search — debounce + request identity + empty/loading/error states.
- State — shareable data in the URL; transient interaction local; remote data in the server cache.
- Performance — measure the likely bottleneck; give a list/image/network budget.
- Accessibility — keyboard/focus behaviour is part of the design.
- Tradeoff — along with the choice, state the concrete cost of the rejected alternative.
- Capacity — quantify the rendered items, payload size, concurrent requests and memory budget.
- Recoverable UI — a retry action should preserve user input; resetting the whole page is not necessary.
- Observability plan — include the error rate, interaction latency and failed request correlation.

### Autocomplete

- Combobox — arrow navigation, Enter selects, Escape closes, and a labelled list.
- Empty/error — separate states for a blank query, no result and a failure.
- Composition input — avoid a premature search/selection on the intermediate text of IME typing.

### Social feed

- Feed — cursor pagination + dedupe; the ranking order needs a stable boundary.
- New posts — show an indicator; do not shift the reading position unexpectedly.
- Media — lazy loading + dimensions + thumbnails.
- Optimistic reaction — a local update, then server reconcile/rollback.
- Refresh — cancellation, a race guard and scroll restoration.
- Ranking — a relevance/freshness objective; a personalized cache/auth scope.
- Media pause — save resources by stopping off-screen video decoding/playback.

### Email client

- Mailbox — list/detail state; persist the selected folder/message through the URL.
- Optimistic action — archive/read labels locally; reconcile on failure.
- Attachments — upload progress, limits, safe storage and cancellation.
- Push — a new-message signal; fetch the authoritative data from the server.
- Draft — autosave/version conflicts and recovery of unsaved changes.
- Thread identity — the message ID and the conversation ID are separate; the scope of actions is clear.
- Attachment retry — reuse an already uploaded object; define duplicate upload cleanup/expiry.
- Offline mailbox — IndexedDB data + a cached shell; reconcile with the server on reconnect.
- Email outbox — retry with a stable send-operation ID; avoid a duplicate send.

### Email interaction

- Rich-text composer — sanitize stored/rendered HTML; separate lifecycles for attachments and the draft body.
- Keyboard shortcut — do not hijack typing in an editable field/IME; keep shortcuts discoverable and return focus.

### Edge cases and reasoning

- Product freshness — autocomplete results/feed counters/email send each have a distinct stale tolerance; do not blindly apply one universal TTL.
- Recoverable draft — do not treat a loading autosave as an empty draft; prevent overwriting saved text with an initial restoration gate and a write version.
- UI failure matrix — explicitly define the loading, partial failure, timeout, permission denial and retry outcome of each boundary.

## Understand it with an example

- Scenario — In an autocomplete, three suggestions are visible for the query "rea"; a keyboard user presses ArrowDown, then Escape.
- Reasoning — The active option should move by clear rules; Escape should close the popup and preserve the typed query. Distinguish the loading, empty and error states from selectable results.
- Catch — A passing mouse demo does not prove the keyboard flow; include IME composition, stale results and focus return in the acceptance walkthrough.

## Recall and practice

- Question — What is the risk if a retry of the Send button on an email send timeout creates a new operation ID?
- Answer — The first send may already have been accepted; prevent a duplicate mail with a stable operation ID/status reconciliation.
- Try it yourself — Defend an email client design; show the flow for a draft restore, an upload retry, a failed send, a keyboard shortcut and a mailbox conflict on reconnect.

## Practice questions

### Easy · UI failure matrix

Which states do you design for a data-driven screen?

<details>
<summary>Answer</summary>

- Loading (a skeleton, no layout shift), Empty (a helpful action), Error (retry + a message), Partial (some data, some failed), Offline, Permission denied, Stale data (a refreshing indicator).
- The copy, focus behaviour and analytics event for every state.

</details>

### Medium · Typeahead/autocomplete design

<details>
<summary>Answer</summary>

- Requests — debounce (~200ms), abort stale requests, cache recent queries.
- Ranking — on the server; the client highlights the matching text.
- A11y — the combobox pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, arrow keys, Enter, Esc.
- IME — do not run the search during composition events (Hindi/Japanese input).
- States — loading, no results, error; a minimum query length.

</details>

### Medium · News feed

<details>
<summary>Answer</summary>

- Pagination — cursor-based; dedupe duplicates by id.
- New posts — an "N new posts" banner at the top; the scroll position must not jump suddenly.
- Reactions — optimistic with rollback; reconcile the counts with the server.
- Media — lazy load, pause offscreen videos, reserved dimensions.
- Performance — virtualization, image sizes; prefetch the next page carefully.

</details>

### Medium · Email client compose

<details>
<summary>Answer</summary>

- Draft — autosave (debounced) to the server + local recovery; a stable `draftId`.
- Send — an outbox state: queued → sending → sent/failed; an undo-send window.
- Attachments — resumable/chunked upload, progress, a retry per file; block the send until the upload is done.
- Offline — composing is allowed, with a send queue; flush when online.

</details>

### Hard · Comment composer with mentions

Design a composer with `@` mentions, paste, draft recovery and double-post prevention.

<details>
<summary>Answer</summary>

- Mentions — a user search on `@` (debounced, permission-filtered); text + mention entities (ids) in the model, not only display names.
- Paste — sanitize the HTML or use plain text; sanitize server-side at rendering too.
- Draft — a local draft per thread, cleared on submit success.
- Submit — a client-generated id + an idempotent API; disable in the pending state.
- A11y — combobox semantics for the mention list, documented keyboard shortcuts.

</details>

## Sources — further reading

- [React state structure](https://react.dev/learn/choosing-the-state-structure)
- [WAI combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/06-frontend-design-round.md)
