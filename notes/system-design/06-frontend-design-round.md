---
id: system-design-frontend-design-round
title: Frontend system design interview from requirements to failure
track: system-design
order: 6
level: Advanced
minutes: 25
summary: Design a React catalog with accessible interaction and measurable delivery budgets.
tags: frontend, react, system-design, accessibility, caching
---

## Mental model

Frontend system design is the design of a user-visible distributed client. Browser storage, network, rendering, accessibility and API contracts all participate. Start with a user journey and make each architecture choice explain a requirement. A component diagram without loading, error and stale-data behavior is incomplete.

## Design brief and assumptions

Design a searchable learning catalog with shareable filters, paginated results and saved topics. Assume mobile browsers, unreliable networks and authenticated users. For an interview exercise, propose a 200ms local interaction budget and measure real devices before treating it as an achieved target. Clarify which pages need search-engine discoverability and which data is private.

Use URL parameters for shareable query and filters. Use local state for open panels and an unsaved input draft. Use a server-state cache for result pages and saved-topic mutations. Separate these ownership boundaries so browser Back restores a meaningful view without maintaining three competing copies of the same filter.

## Contract and component boundary

```text
CatalogRoute
  SearchForm       → query draft, submit, keyboard behavior
  FilterPanel      → URL filter updates
  ResultsRegion    → pending / error / empty / success
    TopicCard      → stable topic identity
    Pagination     → cursor tied to query and sort

GET /topics?q=...&category=...&cursor=...
→ { items, nextCursor, version }
```

A cache key includes every input that changes the response, including relevant user or tenant identity. Reset pagination when filters change. Abort obsolete requests and guard result ownership. A successful save can update one item immediately, then reconcile server truth; concurrent optimistic operations need operation-aware rollback rather than restoring an old whole-list snapshot.

## Rendering and accessibility

Choose server rendering for discoverable initial content when justified. Hydration expects matching initial markup and data; random IDs or browser-only state during the first render can create mismatches. Private data must not leak through shared caches.

Virtualization bounds mounted rows, but needs a deliberate keyboard and assistive-technology plan. Pagination can be simpler for a catalog. Preserve focus after a save or error and announce result updates appropriately. A search box is not automatically a combobox; add suggestion semantics only when the interaction actually implements them.

## Failure and measurement plan

Measure navigation delivery separately from interaction delay and API latency. Test a slow response, stale cached results, logout in another tab and a failed lazy chunk. Give users a recovery path that does not silently discard drafts. Bound persistent cache size and document whether offline access includes private content.

A CDN improves delivery of public static assets; it does not repair expensive client filtering or a blocking API. Add prefetch only when expected navigation benefit justifies bandwidth, especially on mobile. Report a specific before/after trace rather than a generic claim that memoization made the app fast.

## Practice

Spend five minutes clarifying requirements, ten on the API/state diagram, ten on race and failure cases, and five on measurement. Change the requirement to ten million searchable topics: move filtering to the backend, limit page size and explain query cancellation and cursor semantics. Then change it to a fully offline personal notebook and identify which decisions reverse.

## Interview questions

**Would microfrontends help?** Only if organizational ownership and independent delivery benefits justify integration, dependency and UX consistency costs.

**What is your first deep dive?** Choose the highest-risk user requirement, such as request races or large-list responsiveness, instead of listing every technology you know.

## Sources

[React state structure](https://react.dev/learn/choosing-the-state-structure) and [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) support the state and interaction contracts.
