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

```jsx
// Galat: onLoaded har render par naya function reference hai, isliye effect
// har render ke baad phir se fire hoga (aur exhaustive-deps lint isse flag karega)
function TopicView({ topicId, onLoaded }) {
  useEffect(() => {
    fetchTopic(topicId).then(onLoaded);
  }, [topicId, onLoaded]);
}

// Sahi option 1: parent onLoaded ko useCallback se stabilize kare
const handleLoaded = useCallback(data => setActiveTopic(data), []);

// Sahi option 2: agar callback truly optional hai, effect ke andar hi latest
// value ko ref se read karo taaki dependency list clean rahe
function TopicView({ topicId, onLoaded }) {
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => { onLoadedRef.current = onLoaded; });
  useEffect(() => {
    fetchTopic(topicId).then(data => onLoadedRef.current(data));
  }, [topicId]);
}
```

Dono fixes ka tradeoff samajhna zaroori hai: option 1 parent ko discipline maintain karne ko force karta hai, option 2 effect ko intentionally stale-callback-safe banata hai. Linter suppress karke sirf `[topicId]` likh dena (bina fix ke) sabse risky hai, kyunki `onLoaded` closure purani hi reh jaati hai aur silently wrong data ke saath call ho sakti hai.

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

Doosra common pattern debouncing ka hai, jisme timer ko ref mein rakha jaata hai taaki render trigger na ho:

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

`useEffect` browser paint ke baad asynchronously chalta hai; visual glitch (jaise flicker) avoid karna ho — measurement lekar turant DOM update karna ho — to `useLayoutEffect` use karo, jo paint se pehle synchronously chalta hai. Zyadatar synchronization cases (data fetch, subscriptions) ke liye `useEffect` hi sahi choice hai; `useLayoutEffect` sirf layout-measurement jaisi specific cases ke liye reserve karo, kyunki yeh paint block karta hai.

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

## Sources

[React synchronizing with effects](https://react.dev/learn/synchronizing-with-effects) setup/cleanup explain karta hai. [React you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect) unnecessary effects identify karta hai.
