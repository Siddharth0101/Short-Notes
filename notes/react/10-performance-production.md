---
id: react-performance-production
title: Performance suspense and production quality
track: react
order: 10
level: Advanced
minutes: 3
summary: Profiler — pehle slow render/interaction measure karo.
tags: performance, memoization, suspense, lazy, testing, production
visual: react-render
---

## Quick revision

> Revision target — Slow interaction ko measure karo; render cost, network delay aur large JS work ka fix alag choose karo.

- Profiler — pehle slow render/interaction measure karo.
- `memo` — same props par render skip kar sakta hai; state/context updates phir bhi aa sakti hain.
- `useMemo` — expensive calculation cache; correctness ispar depend mat karao.
- `useCallback` — function identity cache; har callback ko wrap karna zaroori nahi.
- Lazy loading — route/component code zaroorat par load karo.
- Suspense — supported suspending work ka fallback; normal effect fetch auto-handle nahi hota.
- Transition — non-urgent update mark; computation magically cheap nahi hoti.
- Virtualization — visible list window render; stable identity/accessibility preserve karo.
- Production — bundle, errors, accessibility aur real-user performance verify karo.
- Deferred value — expensive result ko lagging value se render; network requests automatically debounce nahi hoti.
- Bundle split — very tiny chunks bhi request overhead badha sakte hain; loading behavior measure karo.
- Render purity — memoization hataane par bhi component logically correct rehna chahiye.

### Edge cases aur reasoning

- Transition input — controlled text-input update urgent rakho; expensive result update ko transition/deferred value se separate karo.
- Memo dependency cost — fresh object dependency calculation cache har render invalidate kar sakti hai; dependency contract pehle inspect karo.
- Suspense error split — pending fallback aur rejected work ka error boundary different responsibilities; retry identity define karo.

## Research notes: Measure user experience as well as renders

- Is source review ke Core Web Vitals targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

## Example se samjho

- Scenario — search ke har keystroke par 5,000 rows filter/render hoti hain aur typing delay feel hota hai.
- Investigation — same dataset/device par input latency aur render duration measure; expensive filter aur expensive row rendering ko separately identify karo.
- Decision — visible rows limit/virtualize karna rendering cost reduce kar sakta hai; heavy computation ke liye worker/chunking ka trade-off alag hai.
- Catch — memoization changing dependencies par calculation phir karegi; transition heavy synchronous JS ko worker thread par nahi bhejta.
- Check — optimization ke baad same interaction repeat karo; result correctness, keyboard use aur loading feedback bhi preserve hon.

## Recall aur practice

- Sawal — startTransition CPU-heavy synchronous calculation ko background thread par chala deta hai?
- Jawaab — Nahi; marked React update scheduling change hoti hai. Heavy JS phir bhi main thread block kare toh worker/chunking consider karo.
- Khud try karo — Large filtered list profile karo; typing latency aur render duration before/after record karo, keyboard selection aur error retry preserve karo.

## Practice questions

### Easy · `memo` ke baad bhi re-render

```jsx
const Row = memo(function Row({ item, onSelect, style }) { ... });
<Row item={item} onSelect={() => select(item.id)} style={{ padding: 8 }} />
```

Parent har render par `Row` re-render kyun hota hai?

<details>
<summary>Answer</summary>

- Kyun — inline arrow aur inline object har render par naye references; `memo` shallow compare fail.
- Fix — `onSelect={handleSelect}` (stable via `useCallback`) aur `item.id` row ke andar use karo; static style ko component ke bahar constant banao.
- Pehle measure — React Profiler se confirm karo ki yeh render actually slow hai.

</details>

### Medium · `useMemo` kab useful hai?

```jsx
const visible = useMemo(() => products.filter((p) => p.name.includes(query)), [products, query]);
```

Yeh kab sahi hai aur kab bekaar?

<details>
<summary>Answer</summary>

- Sahi — filter/sort bada aur measurable slow hai, ya result memoized child ko prop jaata hai (stable reference chahiye).
- Bekaar — chhoti list, sasta calculation; dependency compare aur memory ka cost bhi lagta hai.
- Correctness — `useMemo` sirf optimization; code bina iske bhi sahi chalna chahiye.

</details>

### Medium · Route-level code splitting

Admin page bada hai aur sirf kuch users use karte hain. Lazy load karo, loading aur load failure dono handle karo.

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

- `lazy` — module default export component dena chahiye.
- Suspense — chunk aane tak fallback; Error boundary — network/deploy ke baad missing chunk.
- `lazy` ko component ke andar mat banao; har render naya component type banega.

</details>

### Medium · Typing ke saath 10k items filter

Search input har keystroke par lag karta hai kyunki 10,000 rows filter hoti hain. Input responsive kaise rakhoge?

<details>
<summary>Answer</summary>

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => filterRows(rows, deferredQuery), [rows, deferredQuery]);
const stale = query !== deferredQuery;
```

- `useDeferredValue` — input turant update; heavy list background priority par purane value ke saath dikhti hai.
- Stale hint — `stale` par list ko halka dim karo.
- Agar list render hi slow hai — virtualization bhi lagao; deferral sirf priority badalta hai, kaam kam nahi karta.

</details>

### Hard · 50,000 rows ka virtualization

Fixed `rowHeight = 40` ke saath ek simple windowed list ka logic likho.

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

- Idea — DOM mein sirf visible + overscan rows; spacer total scroll height rakhta hai.
- Cost — ~25 DOM rows, 50,000 nahi.
- Trade-offs — browser find-in-page aur screen readers off-screen rows nahi dekhte; variable heights ke liye measuring library (TanStack Virtual) use karo.

</details>

## Sources — aur padhne ke liye

- [React useTransition](https://react.dev/reference/react/useTransition)

- [Source yahan padho — web.dev](https://web.dev/articles/vitals)
- [React Compiler introduction](https://react.dev/learn/react-compiler/introduction)
- [React Suspense reference](https://react.dev/reference/react/Suspense)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/10-performance-production.md)
