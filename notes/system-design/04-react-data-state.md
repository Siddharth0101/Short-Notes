---
id: design-react-data-state
title: React state server data and cache consistency
track: system-design
order: 4
level: Intermediate
minutes: 4
summary: State owner — local UI, URL, shared client aur server data alag pehchano.
tags: react, state, caching, optimistic-ui
visual: caching
---

## Quick revision

> Revision target — UI state, URL state aur remote data ke owner ko stale-response handling se jodo.

- State owner — local UI, URL, shared client aur server data alag pehchano.
- URL — filters/sort/page ko shareable banao.
- Query cache — key mein resource, filters aur auth scope.
- Freshness — staleTime aur invalidation product requirement se decide.
- Optimistic update — provisional UI; rollback/conflict path rakho.
- Race — old request/result ko new selection overwrite na karne do.
- Logout — private cache clear ya user scope se isolate.
- Offline — queued writes ki identity aur conflict resolution define karo.
- Optimistic concurrency — version/ETag se stale writes reject; conflict UI define.
- Cache identity — same endpoint but different locale/currency/permissions ho toh key bhi accordingly.
- Cross-tab state — logout/preferences coordination; local copy ko universal truth mat samjho.

### AI search UI

- AI search — prompt → server model call → validated results → catalog lookup → UI.
- Model output — recommended titles ko real catalog IDs se resolve; hallucinated item handle.
- Usage budget — per-user request/token limits; repeated clicks duplicate paid calls na karein.
- Prompt history — sensitive user data minimum rakho; retention policy explicit.
- Provider secret — browser bundle/environment mein public ho sakta hai; model key server par rakho.

### Edge cases aur reasoning

- Offline dependency — queued create ka temporary ID dependent edits ke stable server ID se reconcile; order/dependency failure policy define karo.
- Optimistic rollback scope — old failed mutation ka snapshot newer successful state replace na kare; per-operation delta/version rebase use karo.
- Server version authority — returned version/cache state user-visible guarantee se align; replica lag par successful mutation ko stale refetch overwrite na kare.

## Research notes: Client caches do not enforce database access

- RLS React UI bypass karne par bhi access constrain karti hai.

## Example se samjho

- Scenario — User pehle query A, phir B search karta hai. B ka result pehle aata hai, A ka late response baad mein complete hota hai.
- Reasoning — Visible results current query B ki identity se bind rakho; A ki completion B ki screen overwrite na kare. Error/retry bhi associated query ke context mein dikhna chahiye.
- Catch — Debounce request frequency kam karta hai, already-started response ordering solve nahi. Cancellation ke saath current request identity verify karna useful guard hai.

## Recall aur practice

- Sawal — Offline note create aur next edit reconnect par parallel send karna kyun fail ho sakta?
- Jawaab — Edit ko durable note ID/version nahi mila; queue dependency aur temp-ID mapping resolve karke send karo.
- Khud try karo — Offline create→edit→retry trace likho; duplicate operation, logout, conflicting remote edit aur stale replica refetch par draft preserve verify karo.

## Practice questions

### Easy · State kahan rakhoge?

Search filters, logged-in user ka profile (API se), modal open/close, theme preference, form draft.

<details>
<summary>Answer</summary>

- Filters — URL (shareable, back/forward).
- Profile — server cache (TanStack Query).
- Modal — local component state.
- Theme — context + localStorage.
- Form draft — local state (+ optional sessionStorage recovery).

</details>

### Medium · Logout par data leak

Logout ke baad doosra user login karta hai aur pehle user ke orders ek second ke liye dikhte hain.

<details>
<summary>Answer</summary>

- Cause — in-memory query cache/global store clear nahi hua.
- Fix — logout par `queryClient.clear()`, stores reset, user-scoped storage keys clear; query keys mein user id.
- Cross-tab — `BroadcastChannel`/`storage` event se doosre tabs bhi logout + clear.
- In-flight requests — abort, taaki purane user ka response naye session mein na likhe.

</details>

### Medium · Optimistic update par version conflict

Optimistic rename ke baad server `409` (version mismatch) deta hai. Poori list rollback karoge?

<details>
<summary>Answer</summary>

- Scope — sirf us item ka rollback; baaki successful optimistic changes untouched.
- Server authority — fresh item fetch karke dikhao, user ko conflict batao ("kisi aur ne change kiya").
- Version — har mutation mein `expectedVersion`; server conditional update kare.

</details>

### Medium · Frontend mein AI search

Product search par "AI answer" feature chahiye. Architecture mein kya rules?

<details>
<summary>Answer</summary>

- Secret — model provider key sirf server par; browser server proxy ko call kare.
- Limits — per-user rate limit aur usage budget; abuse par degrade.
- Streaming — server se stream, UI cancel/abort support kare.
- Output untrusted — model text ko HTML ki tarah inject mat karo; markdown sanitize, links validate.
- Fallback — AI fail ho toh normal search results.

</details>

### Hard · Offline-first notes app

Offline edits sync kaise honge aur conflicts kaise handle karoge?

<details>
<summary>Answer</summary>

- Local first — IndexedDB mein notes + mutation queue (client-generated ids).
- Sync — online par queue order mein bhejo; har mutation idempotent (mutation id), server dedupe kare.
- Versioning — har note ka server version; conflict par policy: last-write-wins (simple), field-level merge, ya user ko dono versions.
- Rich text collaboration — CRDT; normal notes ke liye version check kaafi.
- UX — "Saved locally / Synced / Conflict" states dikhao.

</details>

## Sources — aur padhne ke liye

- [When Effects are unnecessary](https://react.dev/learn/you-might-not-need-an-effect)
- [Official query-key rules](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Source yahan padho — Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/04-react-data-state.md)
