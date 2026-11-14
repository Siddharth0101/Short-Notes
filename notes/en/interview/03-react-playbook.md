---
id: interview-react
title: React interview playbook
track: interview
order: 3
level: Intermediate
minutes: 3
summary: State — it is a snapshot; use the functional setter when updating from the previous value.
tags: react, interview, effects, state, performance
visual: react-render
---

## Quick revision

> Revision target — Defend state identity and asynchronous UI behaviour with a working interaction example.

- State — it is a snapshot; use the functional setter when updating from the previous value.
- Key — a stable sibling identity; with a reorder, an index key can cause a state mismatch.
- Effect — external sync; state the reason for the dependencies and the cleanup.
- Performance — profiler evidence; do not call memoization the default fix.
- Server cache — define the query key, invalidation and auth scope.
- Machine coding — state model → working flow → edge cases → keyboard/error checks.
- Testing — user-visible behaviour; no unnecessary coupling to implementation calls.
- Render debugging — separate the triggers: a parent update, changed props, context and local state.
- Effect review — identify the setup resource, the reactive dependencies and the exact cleanup.
- Demo — besides the mouse, show the keyboard, the empty state and a failed network too.

### Quick answer checks

- UI answer — explain the state owner, identity, loading/error and the keyboard flow with a small example.
- CSS answer — inspect the box, the containing block, the stacking context and overflow; do not guess a random z-index.

### Edge cases and reasoning

- State machine defense — sketch loading/error/success plus draft ownership; explain the fix for impossible boolean combinations and a stale response.
- Optimization evidence — separate a changed prop/context identity from the measured bottleneck; a lower render count is not automatically better user latency.
- Accessible demo — show label, focus and keyboard acceptance; visual correctness in a screenshot alone does not prove the interaction contract.

## Research notes: Demonstrate component behavior

- The linked Amazon guidance focuses on applying fundamentals to problems; merely memorizing details is not the learning goal.

## Understand it with an example

- Scenario — There are editable rows A and B; the user writes a draft in B, then the list is reversed. The rows were given array-index keys.
- Reasoning — An index-based identity can retain state at a position, so the draft shows with the wrong item. Give a stable item ID as the key and assert the correct draft after the reorder.
- Catch — A key is identity among siblings, not a substitute for global business uniqueness; changing a key can also be an intentional reset. A screenshot alone does not verify draft ownership.

## Recall and practice

- Question — What is a complete answer to the stale-response question for a search UI with debounce?
- Answer — Debounce reduces the start rate; abort/a latest identity handles the completion race; define the empty/error states and draft retention separately.
- Try it yourself — Build a searchable list in 25 minutes; demonstrate keyboard navigation, row state after a reorder, reversed fetches and a failure retry that preserves the query.

## Practice questions

### Easy · A strong answer to "why do we need keys?"

<details>
<summary>Answer</summary>

- Identity — a key tells React which item is which, so state and DOM stay with the right item.
- Bug example — index keys + a delete → input values in the wrong rows.
- Rule — a stable unique id; an index only for static lists.
- Bonus — you can reset a component by changing its key.

</details>

### Medium · Review an effect

```jsx
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((r) => r.json())
    .then(setResults);
  window.addEventListener('resize', onResize);
});
```

Name the issues.

<details>
<summary>Answer</summary>

- Dependencies — there is no array, so it runs on every render; it needs `[query]` (and a separate effect for `onResize`).
- Race — the response of an old query can arrive later; use an abort/ignore flag.
- Cleanup — the resize listener is never removed → a leak/duplicates.
- Encoding — `encodeURIComponent(query)`.
- Errors — a `res.ok` check and an error state.

</details>

### Medium · A 60-minute machine coding plan

<details>
<summary>Answer</summary>

- 0–5 min — confirm the requirements, edge cases and acceptance checks.
- 5–10 — sketch the state shape and the component tree.
- 10–40 — the core flow working end-to-end (ugly is fine).
- 40–50 — edge cases (empty/error/loading), keyboard/a11y basics.
- 50–60 — cleanup, explain trade-offs, what else you would do (tests, perf).
- A demo-able state at every checkpoint; working before perfect.

</details>

### Medium · Performance answer with evidence

"How did you make the React app fast?"

<details>
<summary>Answer</summary>

- Measure — identified the slow interaction with the Profiler/RUM (e.g. a filter taking 800ms).
- Cause — 5k rows re-rendered on every keystroke.
- Fix — `useDeferredValue` + virtualization + memoized rows.
- Result — with numbers (800ms → 60ms INP p75), and the trade-off (the find-in-page limitation).
- Avoid — "I added useMemo everywhere".

</details>

### Hard · Model a multi-step checkout as a state machine

<details>
<summary>Answer</summary>

```js
const transitions = {
  cart: { NEXT: 'address' },
  address: { NEXT: 'payment', BACK: 'cart' },
  payment: { SUBMIT: 'processing', BACK: 'address' },
  processing: { SUCCESS: 'done', FAILURE: 'payment' },
  done: {},
};
function reducer(state, event) {
  const next = transitions[state.step][event.type];
  if (!next) return state; // invalid event ignore
  return { ...state, step: next, error: event.error ?? null };
}
```

- Defend — impossible states (a double submit during `processing`) cannot even be constructed.
- UI — derive the button states from the step; URL sync is optional.
- Tests — a unit test for every transition and invalid event.

</details>

## Sources — further reading

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [React state snapshots](https://react.dev/learn/state-as-a-snapshot)
- [effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [memo reference](https://react.dev/reference/react/memo)

## Code practice

- [Examples — when you want to revise the code](../../../examples/interview/03-react-playbook.md)
