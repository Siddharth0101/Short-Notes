---
id: design-react-data-state
title: React state server data and cache consistency
track: system-design
order: 4
level: Intermediate
minutes: 4
summary: State owner — tell local UI, URL, shared client and server data apart.
tags: react, state, caching, optimistic-ui
visual: caching
---

## Quick revision

> Revision target — Tie the owner of UI state, URL state and remote data to stale-response handling.

- State owner — tell local UI, URL, shared client and server data apart.
- URL — make filters/sort/page shareable.
- Query cache — the resource, filters and auth scope in the key.
- Freshness — decide staleTime and invalidation from the product requirement.
- Optimistic update — provisional UI; keep a rollback/conflict path.
- Race — do not let an old request/result overwrite the new selection.
- Logout — clear the private cache or isolate it by user scope.
- Offline — define the identity and conflict resolution of queued writes.
- Optimistic concurrency — reject stale writes with a version/ETag; define the conflict UI.
- Cache identity — the same endpoint with a different locale/currency/permissions needs a key to match.
- Cross-tab state — coordinate logout/preferences; do not treat the local copy as universal truth.

### AI search UI

- AI search — prompt → server model call → validated results → catalog lookup → UI.
- Model output — resolve recommended titles to real catalog IDs; handle a hallucinated item.
- Usage budget — per-user request/token limits; repeated clicks must not make duplicate paid calls.
- Prompt history — keep sensitive user data to a minimum; an explicit retention policy.
- Provider secret — it can become public in the browser bundle/environment; keep the model key on the server.

### Edge cases and reasoning

- Offline dependency — reconcile the temporary ID of a queued create with the stable server ID for dependent edits; define the order/dependency failure policy.
- Optimistic rollback scope — the snapshot of an old failed mutation must not replace newer successful state; use a per-operation delta/version rebase.
- Server version authority — align the returned version/cache state with the user-visible guarantee; under replica lag a stale refetch must not overwrite a successful mutation.

## Research notes: Client caches do not enforce database access

- RLS constrains access even when the React UI is bypassed.

## Understand it with an example

- Scenario — A user searches query A first, then B. B's result arrives first, and A's late response completes afterwards.
- Reasoning — Bind the visible results to the identity of the current query B; A's completion must not overwrite B's screen. An error/retry should also show in the context of its associated query.
- Catch — Debounce lowers the request frequency; it does not solve the ordering of responses that have already started. Verifying the current request identity along with cancellation is a useful guard.

## Recall and practice

- Question — Why can sending an offline note create and the next edit in parallel on reconnect fail?
- Answer — The edit has no durable note ID/version yet; resolve the queue dependency and the temp-ID mapping before sending.
- Try it yourself — Write an offline create→edit→retry trace; verify the draft is preserved on a duplicate operation, a logout, a conflicting remote edit and a stale replica refetch.

## Practice questions

### Easy · Where do you keep the state?

Search filters, the logged-in user's profile (from an API), a modal open/close, the theme preference, a form draft.

<details>
<summary>Answer</summary>

- Filters — the URL (shareable, back/forward).
- Profile — the server cache (TanStack Query).
- Modal — local component state.
- Theme — context + localStorage.
- Form draft — local state (+ optional sessionStorage recovery).

</details>

### Medium · A data leak on logout

After a logout another user logs in and the first user's orders show for a second.

<details>
<summary>Answer</summary>

- Cause — the in-memory query cache/global store was not cleared.
- Fix — on logout call `queryClient.clear()`, reset the stores, clear user-scoped storage keys; the user id in query keys.
- Cross-tab — log out + clear the other tabs too through a `BroadcastChannel`/`storage` event.
- In-flight requests — abort them, so the old user's response is not written into the new session.

</details>

### Medium · A version conflict on an optimistic update

After an optimistic rename the server returns `409` (version mismatch). Do you roll back the whole list?

<details>
<summary>Answer</summary>

- Scope — roll back only that item; the other successful optimistic changes stay untouched.
- Server authority — fetch the fresh item and show it, and tell the user about the conflict ("someone else changed it").
- Version — an `expectedVersion` in every mutation; the server does a conditional update.

</details>

### Medium · AI search in the frontend

Product search needs an "AI answer" feature. What are the rules for the architecture?

<details>
<summary>Answer</summary>

- Secret — the model provider key only on the server; the browser calls a server proxy.
- Limits — a per-user rate limit and usage budget; degrade on abuse.
- Streaming — stream from the server, and the UI supports cancel/abort.
- Output untrusted — do not inject model text as HTML; sanitize markdown, validate links.
- Fallback — normal search results if the AI fails.

</details>

### Hard · An offline-first notes app

How will offline edits sync, and how do you handle conflicts?

<details>
<summary>Answer</summary>

- Local first — notes + a mutation queue in IndexedDB (client-generated ids).
- Sync — when online, send the queue in order; every mutation is idempotent (a mutation id) and the server dedupes.
- Versioning — a server version for every note; a policy on conflict: last-write-wins (simple), a field-level merge, or both versions shown to the user.
- Rich text collaboration — a CRDT; a version check is enough for normal notes.
- UX — show the "Saved locally / Synced / Conflict" states.

</details>

## Sources — further reading

- [When Effects are unnecessary](https://react.dev/learn/you-might-not-need-an-effect)
- [Official query-key rules](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Source yahan padho — Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## Code practice

- [Examples — when you want to revise the code](../../../examples/system-design/04-react-data-state.md)
