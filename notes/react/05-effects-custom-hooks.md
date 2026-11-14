---
id: react-effects-custom-hooks
title: Effects refs and reusable synchronization
track: react
order: 5
level: Intermediate
minutes: 4
summary: `useEffect` — external system ke saath sync; render calculation ke liye nahi.
tags: effects, useEffect, useRef, custom-hooks, races
visual: effect-lifecycle
---

## Quick revision

> Revision target — External synchronization ka owner define karo; setup, dependency change aur cleanup ko one lifecycle samjho.

- `useEffect` — external system ke saath sync; render calculation ke liye nahi.
- Dependencies — effect mein used reactive values list karo; linter ko ignore mat karo.
- Cleanup — next setup se pehle aur unmount par old listener/timer/connection hatao.
- `[]` — changing reactive dependency nahi; development checks setup repeat kar sakte hain.
- `useRef` — renders ke beech mutable value; update se rerender nahi hota.
- Stale closure — old render ki values capture; dependencies/updater se solve karo.
- Fetch race — abort + latest-result guard se old response ignore karo.
- Custom Hook — stateful logic reuse; har call ka state separate hota hai.
- `useLayoutEffect` — paint se pehle layout work; blocking ka cost dhyaan rakho.
- Effect callback — async function directly mat do; andar async work start karke cleanup return karo.
- Ref DOM access — node commit ke baad available; unmount par null handle karo.
- Dependency identity — fresh object/function reference effect repeat kara sakti hai.

### Hook rules

- Hook order — ordinary Hooks ko loops/conditions mein call mat karo; each render ka order stable rakho.
- Imperative handle — parent ko narrow operations expose; component internals ka poora control mat do.

### External subscriptions

- useSyncExternalStore — external store ka subscribe + stable snapshot contract; SSR par compatible server snapshot do.

### Effect Events

- `useEffectEvent` — Effect ke event logic mein latest committed props/state padho, bina us logic se resubscription trigger kiye.
- Effect Event boundary — Effects/Effect Events se call karo; render ya child props ke through use mat karo.
- Effect Event dependencies — event function dependency mein nahi; actual reactive dependencies hatane ka shortcut bhi nahi.

### Edge cases aur reasoning

- Subscription symmetry — setup ne jo resource own kiya cleanup usi instance ko dispose kare; latest global handle par depend mat karo.
- Event versus effect — user ke explicit purchase/submit ko event/action mein rakho; render-derived effect se duplicate write ho sakti hai.
- Snapshot stability — useSyncExternalStore getSnapshot unchanged data par same value/reference de; every read fresh object loop kara sakta hai.

## Research notes: Effect timing depends on the trigger

- useEffect unconditional after-paint hook nahi.

## Example se samjho

```jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  onResize();
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

- Setup — component mein `setWidth` stable `useState` setter hai; effect browser resize subscription own karta hai.
- Trace — setup listener attach karta, cleanup exactly wahi callback remove karta hai.
- Catch — props/state read karne lago toh dependency contract dobara review karo; empty array stale values ka automatic fix nahi.
- Check — mount/unmount repeat karke duplicate listeners aur post-cleanup updates inspect karo.

## Recall aur practice

- Sawal — Dependency badalte hi old fetch cleanup ka useful guarantee kya hai?
- Jawaab — Previous effect ka cleanup next setup se pehle run; abort/ignore guard purane result ko current UI par commit hone se rokta hai.
- Khud try karo — Rapid user-ID switch simulate karo; slow old response ignored, old subscription disposed aur unmount par remaining resources released verify karo.

## Practice questions

### Easy · Dependency array ka matlab

`useEffect(fn)`, `useEffect(fn, [])` aur `useEffect(fn, [id])` — teeno kab chalte hain aur cleanup kab hota hai?

<details>
<summary>Answer</summary>

- No array — har commit ke baad.
- `[]` — mount par ek baar; cleanup unmount par.
- `[id]` — mount par aur jab bhi `id` badle; naya effect chalne se pehle purana cleanup.
- Dev Strict Mode — mount → cleanup → mount extra cycle, taaki missing cleanup pakda jaaye.

</details>

### Easy · Development mein fetch do baar

`useEffect(() => { fetch('/api/user') }, [])` development mein do requests bhejta hai. Bug hai?

<details>
<summary>Answer</summary>

- Expected — React Strict Mode dev mein effects ko ek extra setup+cleanup cycle deta hai; production mein ek baar.
- Sahi response — Strict Mode band mat karo; cleanup likho (abort ya ignore flag) taaki duplicate harmless ho.
- Better — data fetching ke liye framework loader ya TanStack Query jaisi library jo caching/dedupe karti hai.

</details>

### Medium · Interval par count 1 par atak gaya

```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);
```

<details>
<summary>Answer</summary>

- Stale closure — effect sirf pehle render ka `count = 0` dekhta hai; har tick `setCount(1)`.
- Fix — `setCount((c) => c + 1)`; ab dependency mein `count` ki zaroorat nahi.
- Alternative — `[count]` dependency deta hai par har second interval recreate hota hai.

</details>

### Medium · Fetch race in effect

`userId` jaldi-jaldi badalta hai; kabhi purane user ka profile naye ke upar aa jaata hai. Effect fix karo.

<details>
<summary>Answer</summary>

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser)
    .catch((error) => {
      if (error.name !== 'AbortError') setError(error);
    });
  return () => controller.abort();
}, [userId]);
```

- Cleanup — `userId` badalte hi purani request abort; uska result state tak nahi pahunchta.
- Alternative — `let ignore = false` flag, cleanup mein `ignore = true`, aur set se pehle check.

</details>

### Hard · `useMediaQuery` with `useSyncExternalStore`

Hook banao jo CSS media query ka current match return kare, change par update ho, aur server rendering par crash na kare.

<details>
<summary>Answer</summary>

```jsx
function useMediaQuery(query) {
  const subscribe = useCallback(
    (notify) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // server snapshot
  );
}
```

- Kyun ye hook — external (browser) store ke saath tearing-free sync; effect + state wala version ek render late hota hai.
- `useCallback` — `subscribe` stable rahe, warna har render par resubscribe.
- Snapshot — primitive boolean return karo; har call par naya object diya toh infinite re-render.

</details>

## Sources — aur padhne ke liye

- [React — useEffectEvent](https://react.dev/reference/react/useEffectEvent)

- [Source yahan padho — React](https://react.dev/reference/react/useEffect)
- [Effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [useSyncExternalStore contract](https://react.dev/reference/react/useSyncExternalStore)
- [React you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/05-effects-custom-hooks.md)
