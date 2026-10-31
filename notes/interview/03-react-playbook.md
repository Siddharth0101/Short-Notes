---
id: interview-react
title: React interview playbook
track: interview
order: 3
level: Intermediate
minutes: 3
summary: State — snapshot hai; previous value se update ho toh functional setter.
tags: react, interview, effects, state, performance
visual: react-render
---

## Quick revision

> Revision target — State identity aur asynchronous UI behavior ko working interaction example se defend karo.

- State — snapshot hai; previous value se update ho toh functional setter.
- Key — stable sibling identity; reorder mein index key state mismatch kara sakti hai.
- Effect — external sync; dependencies aur cleanup ka reason bolo.
- Performance — profiler evidence; memoization ko default fix mat bolo.
- Server cache — query key, invalidation aur auth scope define karo.
- Machine coding — state model → working flow → edge cases → keyboard/error checks.
- Testing — user-visible behavior; implementation calls par unnecessary coupling nahi.
- Render debugging — parent update, changed props, context aur local state triggers separate karo.
- Effect review — setup resource, reactive dependencies aur exact cleanup identify.
- Demo — mouse ke saath keyboard, empty state aur failed network bhi dikhao.

### Quick answer checks

- UI answer — state owner, identity, loading/error aur keyboard flow chhote example se explain karo.
- CSS answer — box, containing block, stacking context aur overflow inspect; random z-index guess mat karo.

### Edge cases aur reasoning

- State machine defense — loading/error/success plus draft ownership sketch; impossible boolean combinations aur stale response ka fix explain karo.
- Optimization evidence — changed prop/context identity aur measured bottleneck separate; render-count reduction user latency improvement automatically nahi.
- Accessible demo — label, focus aur keyboard acceptance show; screenshot visual correctness alone interaction contract prove nahi.

## Research notes: Demonstrate component behavior

- Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

## Example se samjho

- Scenario — Editable rows A aur B hain; user B mein draft likhta hai, phir list reverse hoti hai. Rows ko array index keys mili hui hain.
- Reasoning — Index-based identity position par state retain kar sakti hai, jis se draft wrong item ke saath dikhe. Stable item ID ko key do aur reorder ke baad correct draft assert karo.
- Catch — Key siblings ke beech identity hai, global business uniqueness ka substitute nahi; key change intentional reset bhi kar sakta hai. Screenshot alone draft ownership verify nahi karta.

## Recall aur practice

- Sawal — Search UI mein debounce ke saath stale-response question ka complete answer?
- Jawaab — Debounce start rate reduce; abort/latest identity completion race handle; empty/error states aur draft retention separately define karo.
- Khud try karo — 25-minute searchable list build; keyboard navigation, reordered row state, reversed fetches aur failure retry with preserved query demonstrate karo.

## Practice questions

### Easy · "Keys kyun chahiye?" ka strong answer

<details>
<summary>Answer</summary>

- Identity — key React ko batata hai ki kaunsa item kaunsa hai, taaki state aur DOM sahi item ke saath rahe.
- Bug example — index keys + delete → input values galat rows mein.
- Rule — stable unique id; index sirf static lists mein.
- Bonus — key badal kar component reset kar sakte ho.

</details>

### Medium · Effect review karo

```jsx
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((r) => r.json())
    .then(setResults);
  window.addEventListener('resize', onResize);
});
```

Issues batao.

<details>
<summary>Answer</summary>

- Dependencies — array nahi, har render par chalega; `[query]` chahiye (aur `onResize` alag effect).
- Race — purani query ka response baad mein aa sakta hai; abort/ignore flag.
- Cleanup — resize listener kabhi remove nahi → leak/duplicates.
- Encoding — `encodeURIComponent(query)`.
- Errors — `res.ok` check aur error state.

</details>

### Medium · 60-minute machine coding plan

<details>
<summary>Answer</summary>

- 0–5 min — requirements, edge cases, acceptance checks confirm.
- 5–10 — state shape aur component tree sketch.
- 10–40 — core flow working end-to-end (ugly is fine).
- 40–50 — edge cases (empty/error/loading), keyboard/a11y basics.
- 50–60 — cleanup, explain trade-offs, kya aur karte (tests, perf).
- Har checkpoint par demo-able state; perfection se pehle working.

</details>

### Medium · Performance answer with evidence

"Aapne React app fast kaise kiya?"

<details>
<summary>Answer</summary>

- Measure — Profiler/RUM se slow interaction pehchana (e.g. filter 800ms).
- Cause — 5k rows har keystroke re-render.
- Fix — `useDeferredValue` + virtualization + memoized rows.
- Result — numbers ke saath (800ms → 60ms INP p75), aur trade-off (find-in-page limitation).
- Avoid — "maine har jagah useMemo laga diya".

</details>

### Hard · Multi-step checkout ko state machine se model karo

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

- Defend — impossible states (double submit during `processing`) ban hi nahi sakte.
- UI — step se button states derive; URL sync optional.
- Tests — har transition aur invalid event ka unit test.

</details>

## Sources — aur padhne ke liye

- [Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- [React state snapshots](https://react.dev/learn/state-as-a-snapshot)
- [effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [memo reference](https://react.dev/reference/react/memo)

## Code practice

- [Examples — jab code revise karna ho](../../examples/interview/03-react-playbook.md)
