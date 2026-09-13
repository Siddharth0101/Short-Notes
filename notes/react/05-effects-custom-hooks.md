---
id: react-effects-custom-hooks
title: Effects refs and reusable synchronization
track: react
order: 5
level: Intermediate
minutes: 31
summary: Effects ko external synchronization ke liye use karo aur stale requests, listeners aur closures clean up karo.
tags: effects, useEffect, useRef, custom-hooks, races
---

## Mental model

Effect React tree ko external system se synchronize karta hai: network request, browser listener, timer, socket ya third-party widget. Effect ko general “state change ke baad code chalao” tool mat banao. Rendering se calculate hone wali value render mein calculate karo; button click ki action handler mein karo. Effect setup ke opposite cleanup ka mental checklist useful hai.

> **Core takeaway:** An effect owns synchronization with an external system and must release what it starts.

## A cancellable data effect

```jsx
import { useEffect, useState } from "react";

export function useTopic(id) {
  const [result, setResult] = useState({ status: "loading", data: null });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setResult({ status: "loading", data: null });
    async function load() {
      try {
        const response = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = await response.json();
        if (active) setResult({ status: "success", data });
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setResult({ status: "error", data: null, error });
        }
      }
    }
    load();
    return () => { active = false; controller.abort(); };
  }, [id]);
  return result;
}
```

Id change par previous cleanup run hota hai, phir new setup. Abort unnecessary request work reduce kar sakta hai; active flag old result ko commit hone se guard karta hai. Example effect basics teach karta hai; caching, deduplication, retries aur route preloading ke liye router/query library often better boundary hai.

## Dependencies and closures

Effect apne render ki bindings capture karta hai. Dependency array mein effect ke used reactive values include karo. Missing dependency stale behavior create kar sakti hai. Linter suppress karne se actual dependency disappear nahi hoti. Object/function har render mein create ho rahe hain to dependency identity change hogi; creation effect ke andar move karna ya responsibility redesign karna helpful ho sakta hai.

Including `onLoaded` in dependencies is correct. If its identity changes, synchronization restarts. The research notes below explain why removing it is not the fix.

Empty dependency array ka meaning component lifetime ke saath setup hai, universal "exactly once" guarantee nahi. Development Strict Mode extra setup-cleanup cycle chala sakta hai. Cleanup real resource undo kare: listener remove, connection disconnect, timer clear. Effect callback itself async mat banao, kyunki async function promise return karta hai aur effect cleanup function expect karta hai.

## Refs and custom hooks

Ref mutable container hai jiska update render trigger nahi karta. DOM focus, timeout id aur non-rendering imperative handles ke liye useful hai. Screen par visible value change honi chahiye to state use karo. Render ke dauraan arbitrary ref mutation purity break kar sakti hai. Custom hook ka name `use` se start karo aur hooks top level par call karo; conditions aur loops hook ordering disrupt kar sakte hain.

Ek reusable synchronization hook jo browser storage ko component state ke saath jodta hai:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full ya disabled ho sakta hai; silently ignore karna UX ke liye safe hai
    }
  }, [key, value]);

  return [value, setValue];
}
```

`useLocalStorage("theme", "light")` call karne wale har component ko normal `useState` jaisa hi API milta hai, lekin persistence internally handled hai. Yeh pattern illustrate karta hai ki custom hook stateful logic ko reuse karta hai — har caller apni independent state instance leta hai, storage key same ho tab bhi.

Debouncing example mein timeout handle Effect closure mein local hai; cleanup usi timer ko cancel karta hai:

```jsx
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId); // Har keystroke par purana timer cancel hota hai
  }, [value, delayMs]);
  return debounced;
}
```

Yahan cleanup critical hai: agar `clearTimeout` na ho, to fast typing ke dauraan multiple stale timeouts queue ho jaayenge aur search request se zyada baar fire hogi.

Effect timing is explained in the research notes below. Reserve paint-blocking `useLayoutEffect` for necessary visual measurement.

## Gotchas

- Dependency array se ek value isliye hata dena ki effect "bahut baar chal raha hai" bug ko chhupata hai, fix nahi karta — effect us stale value ko forever capture kar leta hai. Asli fix usually functional updater, `useRef`, ya effect ko chhote effects mein todna hai.
- Object ya array ko dependency mein dena har render par naya reference banata hai, isliye effect har render par dobara chalta hai. Primitive values (`user.id`) par depend karo, ya object ko `useMemo` se stabilize karo.
- Async function ko directly `useEffect(async () => …)` pass karna galat hai — woh promise return karta hai, cleanup function nahi. Effect ke andar ek async function define karke usse call karo, aur cleanup alag se return karo.
- Cleanup ko sirf unmount ka kaam samajhna common galti hai: cleanup **har** dependency change par bhi chalta hai, naye effect run se pehle. Isi wajah se subscription switch aur stale-request cancellation kaam karte hain.
- Jo kaam user action ka seedha result hai (form submit, button click par analytics) usse effect mein rakhna usse indirect aur duplicate-prone bana deta hai. Usse event handler mein rakho; effect sirf external system ke saath synchronization ke liye hai.
- Strict Mode development mein effects ko deliberately mount → cleanup → mount karta hai. Agar isse "double request" jaisa problem dikhe, to woh missing cleanup ka signal hai, Strict Mode ka bug nahi.

## Practice

Topic id rapidly switch karo with network throttling. Confirm karo ki old response latest page overwrite nahi karti. Window resize hook likho aur unmount par cleanup verify karo. Derived filtered list wala effect remove karke direct calculation banao. `useDebouncedValue` ko search input ke saath jodo aur verify karo ki debounce delay ke andar typed characters extra network request trigger nahi karte. `useLocalStorage` hook ko do tabs mein test karo aur observe karo ki storage sync automatically cross-tab nahi hoti (uske liye `storage` event alag se sunna padega).

## Where this shows up in a real app

Chat ya notifications feature mein WebSocket connection effect ke andar open hoti hai aur cleanup mein close hoti hai. User jab conversation switch karta hai (id dependency change hoti hai), to purani connection close honi chahiye taaki purani room ke messages naye UI mein leak na karein. Yehi pattern analytics "page viewed" event ke liye bhi common hai — effect route change par ek baar fire ho, duplicate na ho, aur unmount par pending call cancel ho sake.

## Interview questions

**Q. Effect infinite loop kyun hota hai?** Effect state update karta hai, update dependency identity/value change karti hai, phir effect repeat hota hai. Dependency aur data model dono inspect karo.

**Q. Ref aur state ka difference?** State render schedule karti hai; ref mutation nahi. Ref stale-closure workaround ho sakti hai, lekin dependencies hide karne ka default solution nahi.

## Research notes: Effect timing depends on the trigger

`useEffect` is not an unconditional after-paint hook. React generally allows paint first for non-interaction Effects; interaction-related Effects may run before paint. Necessary layout measurement before paint belongs in `useLayoutEffect`, which blocks painting.

Dependency changes run old cleanup before new setup. Dependencies use `Object.is`. A new options object can restart synchronization even when its fields look equal; prefer primitive dependencies and create connection options inside the Effect when appropriate.

**Interview check:** Does including an unstable callback violate exhaustive-deps?

**Answer:** No. Including it declares the dependency correctly. If its identity changes, rerunning follows that declaration. Fix unnecessary churn through ownership or appropriate stabilization rather than removing a needed dependency.

**Practice:** Trace setup and cleanup as roomId changes twice.

[Read the source — React](https://react.dev/reference/react/useEffect). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** A subscription effect runs again when roomId changes. Describe the expected subscribe/unsubscribe sequence for room A, then B, then unmount.

> **Hint:** Pair each setup with cleanup for the same room and resource.

**Answer guide — compare after attempting:** Subscribe to A; clean up A before subscribing to B; clean up B on unmount. Return cleanup from the effect and include reactive dependencies. Development checks can exercise an additional setup/cleanup cycle, so cleanup must actually undo the subscription.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[React synchronizing with effects](https://react.dev/learn/synchronizing-with-effects) setup/cleanup explain karta hai. [React you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect) unnecessary effects identify karta hai.
