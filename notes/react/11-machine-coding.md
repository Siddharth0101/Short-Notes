---
id: react-machine-coding
title: React machine coding and identity bugs
track: react
order: 11
level: Advanced
minutes: 25
summary: Build a searchable interface while reasoning about state ownership and request races.
tags: machine-coding, identity, keys, requests, accessibility
visual: react-identity
---

## Mental model

Machine coding round mein working happy path sirf starting point hai. Strong solution has a small state model, clear component contracts, predictable identity and observable failure states. Write acceptance criteria before styling. For a search interface, clarify minimum query length, keyboard behavior, loading state, empty results and what happens when old responses arrive late.

## Model state before components

Keep input text separate from the selected result. A selected entity ID represents identity; a label is only presentation and may not be unique. Result data belongs to the query that produced it. Do not show results from query A under the heading for query B without an explicit stale-data indication.

For rows with editable drafts, use stable entity keys. Index keys associate state with position: after sorting or deleting, a draft can appear on another row. Random keys force remounts, losing input state and focus. Deliberately changing a key is useful when switching between independent editing sessions, provided losing the previous draft is intended.

## A latest-request guard

This hook illustrates request ownership; it is not a complete combobox or caching library.

```jsx
import { useEffect, useState } from 'react';

export function useResults(query) {
  const [state, setState] = useState({ query: '', status: 'idle', items: [] });
  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    if (!query.trim()) return () => { current = false; };
    async function load() {
      setState({ query, status: 'loading', items: [] });
      try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search failed');
        const items = await response.json(); // Validate the API shape in production.
        if (current) setState({ query, status: 'success', items });
      } catch (error) {
        if (current && !controller.signal.aborted) {
          setState({ query, status: 'error', items: [], message: error.message });
        }
      }
    }
    load();
    return () => { current = false; controller.abort(); };
  }, [query]);
  if (!query.trim()) return { status: 'idle', items: [] };
  return state.query === query ? state : { status: 'loading', items: [] };
}
```

The identity check prevents a one-render stale result before the next effect runs. Cleanup prevents an old request from committing after a new query owns the view. Abort saves unnecessary work where supported; the guard expresses correctness independently of cancellation timing.

## Acceptance checklist

Use a labeled input and real buttons. For a true combobox, implement the full relevant ARIA pattern, including active-option semantics and keyboard behavior; adding a role alone is incomplete. Handle IME composition before triggering selection on Enter. Announce status changes without announcing every keystroke unnecessarily.

## Practice

Build search with deterministic fake responses: A takes 900ms, AB takes 100ms. Verify AB remains visible. Delete the first editable row and ensure the second row keeps its own draft. Test network rejection, empty query, unmount during a request and duplicate labels. Explain which tests exercise behavior rather than component internals.

## Interview questions

**Is debounce enough to prevent stale results?** No. It reduces request frequency but does not guarantee completion order.

**When should a component key change intentionally?** When a new identity should receive fresh local state, such as switching recipients in a draft editor with an explicit discard policy.

## Capstone: searchable editable data table

Build a table with URL filters, stable row IDs, an editable draft, and a paginated request adapter. Start with twenty fake records and deterministic delayed responses. Then add loading, empty, error, and permission-denied states.

### Acceptance criteria

- Start editing a row, sort the table, and verify the draft remains attached to that record.
- Change filters during a slow request; the stale response must not replace the current result.
- Reload a shared URL and use browser back/forward: committed filters and page restore correctly.
- Every form field has a label. Sorting and editing work by keyboard, and focus returns sensibly after closing the editor.
- A failed optimistic update restores the appropriate prior state without discarding newer edits.
- Measure a specific expensive render before adding memoization or virtualization.

### Interview defense

Draw the owners of URL state, local draft state, and server data. Explain why copying all props into state creates synchronization work. Compare rendering ten thousand rows with windowing, including keyboard navigation and screen-reader tradeoffs. Deliver a short screen recording plus tests for identity, request races, and navigation; a static happy-path screenshot is insufficient evidence.

## Sources
[React identity and state](https://react.dev/learn/preserving-and-resetting-state) and [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) explain the relevant contracts.
