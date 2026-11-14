---
id: react-performance-production
title: Performance suspense and production quality
track: react
order: 10
level: Advanced
minutes: 3
summary: Profiler — first measure the slow render or interaction.
tags: performance, memoization, suspense, lazy, testing, production
visual: react-render
---

## Quick revision

> Revision target — Measure the slow interaction; choose separate fixes for render cost, network delay and heavy JS work.

- Profiler — first measure the slow render/interaction.
- `memo` — can skip a render when props are the same; state/context updates can still arrive.
- `useMemo` — caches an expensive calculation; do not make correctness depend on it.
- `useCallback` — caches a function identity; not every callback needs wrapping.
- Lazy loading — load route/component code when it is needed.
- Suspense — a fallback for supported suspending work; a normal effect fetch is not handled automatically.
- Transition — marks a non-urgent update; the computation does not magically get cheaper.
- Virtualization — render the visible window of a list; preserve stable identity/accessibility.
- Production — verify the bundle, errors, accessibility and real-user performance.
- Deferred value — render an expensive result from a lagging value; network requests are not debounced automatically.
- Bundle split — very tiny chunks can also add request overhead; measure the loading behaviour.
- Render purity — the component must stay logically correct even with the memoization removed.

### Edge cases and reasoning

- Transition input — keep a controlled text-input update urgent; separate the expensive result update with a transition/deferred value.
- Memo dependency cost — a fresh object dependency can invalidate the calculation cache on every render; inspect the dependency contract first.
- Suspense error split — the pending fallback and the error boundary for rejected work are different responsibilities; define the retry identity.

## Research notes: Measure user experience as well as renders

- The Core Web Vitals targets from this source review: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

## Understand it with an example

- Scenario — every keystroke in search filters/renders 5,000 rows and typing feels delayed.
- Investigation — measure input latency and render duration on the same dataset/device; identify the expensive filter and the expensive row rendering separately.
- Decision — limiting/virtualizing the visible rows can reduce rendering cost; the trade-off of a worker/chunking for heavy computation is a separate one.
- Catch — memoization recalculates when its dependencies change; a transition does not move heavy synchronous JS to a worker thread.
- Check — repeat the same interaction after the optimization; result correctness, keyboard use and loading feedback must be preserved too.

## Recall and practice

- Question — Does startTransition run a CPU-heavy synchronous calculation on a background thread?
- Answer — No; the scheduling of the marked React update changes. If heavy JS still blocks the main thread, consider a worker/chunking.
- Try it yourself — Profile a large filtered list; record typing latency and render duration before/after, and preserve keyboard selection and error retry.

## Practice questions

### Easy · Re-rendering even after `memo`

```jsx
const Row = memo(function Row({ item, onSelect, style }) { ... });
<Row item={item} onSelect={() => select(item.id)} style={{ padding: 8 }} />
```

Why does `Row` re-render on every render of the parent?

<details>
<summary>Answer</summary>

- Why — the inline arrow and the inline object are new references on every render; the shallow compare of `memo` fails.
- Fix — `onSelect={handleSelect}` (stable via `useCallback`) and use `item.id` inside the row; make the static style a constant outside the component.
- Measure first — confirm with the React Profiler that this render is actually slow.

</details>

### Medium · When is `useMemo` useful?

```jsx
const visible = useMemo(() => products.filter((p) => p.name.includes(query)), [products, query]);
```

When is this right, and when is it pointless?

<details>
<summary>Answer</summary>

- Right — the filter/sort is large and measurably slow, or the result goes as a prop to a memoized child (it needs a stable reference).
- Pointless — a small list, a cheap calculation; comparing dependencies and the memory have a cost too.
- Correctness — `useMemo` is only an optimization; the code must work correctly without it.

</details>

### Medium · Route-level code splitting

The Admin page is large and only a few users use it. Lazy-load it and handle both loading and a load failure.

<details>
<summary>Answer</summary>

```jsx
const AdminPage = lazy(() => import('./AdminPage.jsx'));

<ErrorBoundary fallback={<p>Page load nahi hua. Refresh karo.</p>}>
  <Suspense fallback={<Spinner />}>
    <AdminPage />
  </Suspense>
</ErrorBoundary>;
```

- `lazy` — the module's default export must be the component.
- Suspense — the fallback until the chunk arrives; Error boundary — a network failure, or a chunk missing after a deploy.
- Do not create `lazy` inside a component; every render would create a new component type.

</details>

### Medium · Filtering 10k items while typing

The search input lags on every keystroke because 10,000 rows are filtered. How do you keep the input responsive?

<details>
<summary>Answer</summary>

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => filterRows(rows, deferredQuery), [rows, deferredQuery]);
const stale = query !== deferredQuery;
```

- `useDeferredValue` — the input updates immediately; the heavy list renders at background priority with the old value.
- Stale hint — dim the list slightly while `stale`.
- If rendering the list itself is slow — add virtualization too; deferral only changes the priority, it does not reduce the work.

</details>

### Hard · Virtualizing 50,000 rows

Write the logic of a simple windowed list with a fixed `rowHeight = 40`.

<details>
<summary>Answer</summary>

```jsx
function VirtualList({ rows, rowHeight = 40, height = 480, overscan = 5 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(rows.length, Math.ceil((scrollTop + height) / rowHeight) + overscan);
  return (
    <div style={{ height, overflowY: 'auto' }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: rows.length * rowHeight, position: 'relative' }}>
        {rows.slice(start, end).map((row, i) => (
          <div key={row.id} style={{ position: 'absolute', top: (start + i) * rowHeight, height: rowHeight }}>
            {row.label}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- Idea — only the visible + overscan rows are in the DOM; a spacer keeps the total scroll height.
- Cost — ~25 DOM rows, not 50,000.
- Trade-offs — browser find-in-page and screen readers do not see off-screen rows; use a measuring library (TanStack Virtual) for variable heights.

</details>

## Sources — further reading

- [React useTransition](https://react.dev/reference/react/useTransition)

- [Source yahan padho — web.dev](https://web.dev/articles/vitals)
- [React Compiler introduction](https://react.dev/learn/react-compiler/introduction)
- [React Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/10-performance-production.md)
