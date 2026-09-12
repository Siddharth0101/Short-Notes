---
id: react-performance-production
title: Performance suspense and production quality
track: react
order: 10
level: Advanced
minutes: 30
summary: Profile first, memoization boundaries choose karo aur slow networks aur failures ke liye UI prepare karo.
tags: performance, memoization, suspense, lazy, testing, production
visual: react-render
---

## Mental model

Performance ka target user experience hai: input quickly respond kare, content timely dikhe aur layout stable rahe. Re-render count alone performance score nahi hai. Network, bundle size, expensive calculation, DOM size aur layout work alag bottlenecks hain. Pehle profiler se actual slow interaction identify karo, phir us boundary par fix apply karo.

## Load an optional feature on demand

```jsx
import { lazy, Suspense, useState } from "react";

const ProgressChart = lazy(() => import("./ProgressChart.jsx"));

export default function StudyStats() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section>
      <button onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}>
        {expanded ? "Hide analytics" : "Show analytics"}
      </button>
      {expanded && (
        <Suspense fallback={<p role="status">Loading analytics…</p>}>
          <ProgressChart />
        </Suspense>
      )}
    </section>
  );
}
```

Lazy module ko default component export chahiye. Lazy declaration component ke outside rakho taaki render par identity reset na ho. Suspense compatible loading source ke liye fallback render karta hai; ordinary effect fetch automatically suspend nahi hoti. Chunk load failure handle karne ke liye suitable error boundary/recovery UI add karo. Boundary placement decide karta hai ki loading ke dauraan kitna existing content replace hoga.

## Memoization and responsiveness

`memo` unchanged props par component render skip kar sakta hai; state aur context updates still matter karte hain. `useMemo` calculated value cache karta hai aur `useCallback` function identity cache karta hai. Yeh correctness guarantees ya global caches nahi hain. Fresh object/function props memoization defeat kar sakte hain. Expensive comparator render se zyada costly ho sakta hai.

```jsx
const TopicRow = memo(function TopicRow({ topic, onSelect }) {
  return (
    <li>
      <span>{topic.title}</span>
      <button onClick={() => onSelect(topic.id)}>Open</button>
    </li>
  );
});

function TopicList({ topics }) {
  // Galat: har render par naya inline function banti hai, isliye har
  // TopicRow ko naya `onSelect` prop milta hai aur memo ka benefit defeat ho jaata hai
  return (
    <ul>
      {topics.map(topic => (
        <TopicRow key={topic.id} topic={topic} onSelect={id => console.log(id)} />
      ))}
    </ul>
  );
}

function TopicListFixed({ topics }) {
  // Sahi: stable identity, useCallback se
  const handleSelect = useCallback(id => console.log(id), []);
  return (
    <ul>
      {topics.map(topic => (
        <TopicRow key={topic.id} topic={topic} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

`memo` sirf shallow prop comparison karta hai. `topic` object khud bhi agar parent mein har render par naya reference banta ho (jaise `.map()` se transform hokar), to `memo` phir bhi useless ho jaayega — sirf function prop stabilize karna kaafi nahi hai agar data prop bhi unstable hai.

`useMemo` ka typical use case expensive derived calculation hai:

```jsx
function TopicBrowser({ topics, query }) {
  const filtered = useMemo(
    () => topics.filter(topic => topic.title.toLowerCase().includes(query.toLowerCase())),
    [topics, query]
  );
  return <TopicList topics={filtered} />;
}
```

Chhoti list (jaise 20 items) ke liye yeh `useMemo` wrapper often unnecessary hai — comparison cost khud memoization overhead se zyada nahi hoti. Bade dataset (thousands of rows) ya genuinely expensive calculation (sorting, aggregation) ke liye hi is pattern ka real benefit milta hai; measure karke decide karo, blanket rule follow mat karo.

React Compiler optional build integration hai jo eligible components/hooks ki memoization automate kar sakta hai. Existing course notes manual memoization teach karti hain; compiler enabled assume mat karo. Project setup verify karo aur profiling ke bina existing memoization bulk remove mat karo. Compiler Rules of React follow karne ki need replace nahi karta.

`useTransition` non-urgent state updates mark karta hai; async CPU-heavy loop ko separate thread par nahi bhejta. `useDeferredValue` slow result view ko urgent typing se lag karne deta hai. Large lists ke liye virtualization DOM nodes reduce karti hai; data fetch size aur keyboard/screen-reader behavior bhi design karna padta hai.

## Production habits and gotchas

Images ko correct size aur dimensions do. Route-level splitting, caching aur preloading measured use karo. Error boundaries rendering errors catch kar sakti hain, lekin arbitrary event-handler/async promise failures ko automatically catch nahi karti. Form pending/error states explicitly handle karo. Client validation UX hai; server validation authoritative hai.

Tests user-visible behavior verify karein: accessible name se button find karo, type karo, submit karo aur result assert karo. Pure calculations unit tests se, API boundaries integration tests se aur critical journeys browser tests se verify karo. Snapshot wall of markup ko complete correctness proof mat samjho.

React Testing Library se yeh principle code mein aisa dikhta hai:

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("shows an error when title is left blank", async () => {
  render(<GoalForm onSave={() => Promise.resolve()} />);
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: /save goal/i }));

  expect(screen.getByRole("alert")).toHaveTextContent(/title required/i);
});
```

Test `getByRole` se accessible name ke through element dhoondta hai, `data-testid` ya internal class name se nahi. Isse do fayde hain: test implementation detail (jaise internal div structure) se coupled nahi hota, aur agar `getByRole` fail hota hai to often iska matlab accessibility bhi missing hai — button ka koi discoverable role/name nahi hai. Yeh dono cheezein ek saath verify ho jaati hain.

## Gotchas

- `memo` ko poori list ke top-level component par lagana lekin har row ko fresh inline props dena — optimization silently no-op ho jaata hai aur profiler chalaye bina yeh pata bhi nahi chalta.
- Route-level code splitting mein `lazy(() => import(...))` ko render ke andar (component body mein) likhna — har render par naya lazy component banta hai aur React use "naya component type" samajh kar remount + refetch karta hai.
- Error boundary ko event handler ke andar throw hui error ke against bharosa karna — error boundaries sirf render-phase errors catch karte hain, async callback aur event handler ki try/catch khud likhni padti hai.
- Virtualization library lagane ke baad bhi poora dataset ek saath fetch karna — DOM node count kam hui, lekin network/memory cost wahi rahi; large lists ke liye server-side pagination bhi zaroori hota hai.

## Where this shows up in a real app

Ek learning-platform dashboard jisme sabhi enrolled courses, unka progress percentage aur recent activity ek hi page par dikhti hai, typing-heavy search box ke saath slow ho sakta hai agar poori list har keystroke par re-render ho. Real fix order typically yeh hota hai: pehle React Profiler se confirm karo ki bottleneck list rendering hai ya calculation; phir search input ki state ko sirf usi component tak localize karo jo use render karta hai; tab jaakar row-level `memo` ya virtualization consider karo. Seedhe memoization se shuru karna aksar wrong layer fix kar deta hai.

## Practice

Five-thousand-item list par typing profile karo. Pehle state localize karo, phir filtering calculation aur list rendering cost isolate karo. Ek optimization implement karke before/after same interaction compare karo. Slow connection aur failed chunk load scenario run karo.

## Interview questions

**Q. Har function useCallback mein wrap karoge?** Nahi. Stable identity valuable consumer/dependency ke liye useful ho sakti hai; unnecessary caching complexity add karti hai.

**Q. Suspense error boundary hai?** Nahi. Loading fallback aur error recovery different responsibilities hain, often neighboring boundaries se handled hoti hain.

## Sources

[React Compiler introduction](https://react.dev/learn/react-compiler/introduction) optional automatic memoization explain karta hai. [React Suspense reference](https://react.dev/reference/react/Suspense) supported loading behavior ka reference hai.
