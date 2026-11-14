---
id: react-effects-custom-hooks
title: Effects refs and reusable synchronization
track: react
order: 5
level: Intermediate
minutes: 4
summary: `useEffect` — sync with an external system; not for render calculations.
tags: effects, useEffect, useRef, custom-hooks, races
visual: effect-lifecycle
---

## Quick revision

> Revision target — Define who owns an external synchronization; understand setup, a dependency change and cleanup as one lifecycle.

- `useEffect` — sync with an external system; not for render calculations.
- Dependencies — list the reactive values used in the effect; do not ignore the linter.
- Cleanup — remove the old listener/timer/connection before the next setup and on unmount.
- `[]` — no changing reactive dependency; development checks can still repeat the setup.
- `useRef` — a mutable value across renders; updating it does not cause a rerender.
- Stale closure — captures the values of an old render; solve it with dependencies/an updater.
- Fetch race — ignore an old response with abort + a latest-result guard.
- Custom Hook — reuses stateful logic; every call has its own separate state.
- `useLayoutEffect` — layout work before paint; mind the cost of blocking.
- Effect callback — do not pass an async function directly; start the async work inside and return a cleanup.
- Ref DOM access — the node is available after commit; handle null on unmount.
- Dependency identity — a fresh object/function reference can make the effect repeat.

### Hook rules

- Hook order — do not call ordinary Hooks in loops/conditions; keep the order stable on every render.
- Imperative handle — expose narrow operations to the parent; do not hand over full control of the component's internals.

### External subscriptions

- useSyncExternalStore — the subscribe + stable snapshot contract for an external store; provide a compatible server snapshot for SSR.

### Effect Events

- `useEffectEvent` — read the latest committed props/state in an Effect's event logic without that logic triggering a resubscription.
- Effect Event boundary — call it from Effects/Effect Events; do not use it in render or pass it through child props.
- Effect Event dependencies — the event function is not a dependency; nor is it a shortcut for removing real reactive dependencies.

### Edge cases and reasoning

- Subscription symmetry — cleanup must dispose the same instance of the resource that setup owned; do not depend on the latest global handle.
- Event versus effect — keep the user's explicit purchase/submit in an event/action; a render-derived effect can cause a duplicate write.
- Snapshot stability — useSyncExternalStore's getSnapshot must return the same value/reference for unchanged data; a fresh object on every read can cause a loop.

## Research notes: Effect timing depends on the trigger

- useEffect is not an unconditional after-paint hook.

## Understand it with an example

```jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  onResize();
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

- Setup — in the component, `setWidth` is a stable `useState` setter; the effect owns the browser resize subscription.
- Trace — setup attaches the listener, and cleanup removes exactly that same callback.
- Catch — once you start reading props/state, review the dependency contract again; an empty array is not an automatic fix for stale values.
- Check — repeat mount/unmount and inspect for duplicate listeners and post-cleanup updates.

## Recall and practice

- Question — As soon as a dependency changes, what useful guarantee does the old fetch's cleanup give?
- Answer — The previous effect's cleanup runs before the next setup; an abort/ignore guard stops the old result from being committed to the current UI.
- Try it yourself — Simulate rapid user-ID switches; verify that a slow old response is ignored, the old subscription is disposed and remaining resources are released on unmount.

## Practice questions

### Easy · What the dependency array means

`useEffect(fn)`, `useEffect(fn, [])` and `useEffect(fn, [id])` — when does each run, and when does cleanup happen?

<details>
<summary>Answer</summary>

- No array — after every commit.
- `[]` — once on mount; cleanup on unmount.
- `[id]` — on mount and whenever `id` changes; the old cleanup runs before the new effect.
- Dev Strict Mode — an extra mount → cleanup → mount cycle, so a missing cleanup is caught.

</details>

### Easy · The fetch runs twice in development

`useEffect(() => { fetch('/api/user') }, [])` sends two requests in development. Is it a bug?

<details>
<summary>Answer</summary>

- Expected — in dev, React Strict Mode gives effects one extra setup+cleanup cycle; in production it runs once.
- The right response — do not turn Strict Mode off; write a cleanup (an abort or an ignore flag) so the duplicate is harmless.
- Better — for data fetching use a framework loader or a library like TanStack Query that handles caching/dedupe.

</details>

### Medium · The count stuck at 1 on an interval

```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);
```

<details>
<summary>Answer</summary>

- Stale closure — the effect only sees `count = 0` from the first render; every tick calls `setCount(1)`.
- Fix — `setCount((c) => c + 1)`; now `count` is not needed in the dependencies.
- Alternative — a `[count]` dependency works, but the interval is recreated every second.

</details>

### Medium · Fetch race in effect

`userId` changes quickly; sometimes the old user's profile lands on top of the new one. Fix the effect.

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

- Cleanup — as soon as `userId` changes the old request is aborted; its result never reaches state.
- Alternative — a `let ignore = false` flag, `ignore = true` in cleanup, and a check before setting.

</details>

### Hard · `useMediaQuery` with `useSyncExternalStore`

Build a hook that returns the current match of a CSS media query, updates on change, and does not crash during server rendering.

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

- Why this hook — tearing-free sync with an external (browser) store; the effect + state version is one render late.
- `useCallback` — keeps `subscribe` stable; otherwise it resubscribes on every render.
- Snapshot — return a primitive boolean; return a new object on every call and you get an infinite re-render.

</details>

## Sources — further reading

- [React — useEffectEvent](https://react.dev/reference/react/useEffectEvent)

- [Source yahan padho — React](https://react.dev/reference/react/useEffect)
- [Effect synchronization](https://react.dev/learn/synchronizing-with-effects)
- [useSyncExternalStore contract](https://react.dev/reference/react/useSyncExternalStore)
- [React you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/05-effects-custom-hooks.md)
