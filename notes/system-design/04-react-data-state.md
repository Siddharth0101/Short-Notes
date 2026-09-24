---
id: design-react-data-state
title: React state server data and cache consistency
track: system-design
order: 4
level: Intermediate
minutes: 1
summary: State owner — local UI, URL, shared client aur server data alag pehchano.
tags: react, state, caching, optimistic-ui
visual: caching
---

## Quick revision

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

## Research notes: Client caches do not enforce database access

- RLS React UI bypass karne par bhi access constrain karti hai.

## Sources — aur padhne ke liye

- [When Effects are unnecessary](https://react.dev/learn/you-might-not-need-an-effect)
- [Official query-key rules](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Source yahan padho — Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## Code practice

- [Examples — jab code revise karna ho](../../examples/system-design/04-react-data-state.md)
