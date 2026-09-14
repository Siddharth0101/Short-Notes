---
id: react-effects-custom-hooks
title: Effects refs and reusable synchronization
track: react
order: 5
level: Intermediate
minutes: 31
summary: Effect external system se synchronization own karta hai; jo resource start kare uska cleanup bhi kare.
tags: effects, useEffect, useRef, custom-hooks, races
---

## Mental model — simple soch

Effect React tree ko external system se synchronize karta hai: network request, browser listener, timer, socket ya third-party widget. Effect ko general “state change ke baad code chalao” tool mat banao. Rendering se calculate hone wali value render mein calculate karo; button click ki action handler mein karo. Effect setup ke opposite cleanup ka mental checklist useful hai.

> **Core takeaway:** Effect external system se synchronization own karta hai; jo resource start kare uska cleanup bhi kare.

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

onLoaded dependency include karna correct hai. Identity badlegi toh synchronization restart hogi. Neeche research section samjhata hai ki dependency remove karna fix kyun nahi.

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

Effect timing neeche explain hai. Paint-blocking useLayoutEffect necessary visual measurement ke liye rakho.

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

## Interview questions — bolkar practice karo

**Q. Effect infinite loop kyun hota hai?** Effect state update karta hai, update dependency identity/value change karti hai, phir effect repeat hota hai. Dependency aur data model dono inspect karo.

**Q. Ref aur state ka difference?** State render schedule karti hai; ref mutation nahi. Ref stale-closure workaround ho sakti hai, lekin dependencies hide karne ka default solution nahi.

## Research notes: Effect timing depends on the trigger

useEffect unconditional after-paint hook nahi. Non-interaction effects mein React generally paint pehle allow karta hai; interaction-related effects paint se pehle bhi run ho sakte hain. Required pre-paint layout measurement useLayoutEffect mein hoti hai, jo painting block karta hai.

Dependencies change par old cleanup, phir new setup. Comparison Object.is se hoti hai. Same-looking fields ka new options object bhi sync restart karega; suitable ho toh primitive dependencies aur effect ke andar options creation use karo.

**Interview check:** Unstable callback include karna exhaustive-deps violate karta hai?

**Answer:** Nahi; dependency honestly declare hoti hai. Identity badlegi toh rerun expected hai. Churn ko ownership/appropriate stabilization se fix karo, required dependency delete karke nahi.

**Practice:** roomId do baar change karke setup/cleanup trace karo.

[Source yahan padho — React](https://react.dev/reference/react/useEffect). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** roomId A se B hota hai, phir component unmount hota hai. Subscribe/unsubscribe ka order batao.

> **Hint:** Har setup ka cleanup same room aur resource ke liye pair karo.

**Answer guide — compare after attempting:** A subscribe; B subscribe karne se pehle A cleanup; unmount par B cleanup. Effect se cleanup return karo aur reactive dependencies include karo. Development checks extra setup/cleanup cycle chala sakte hain, isliye cleanup actual subscription undo kare.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[React synchronizing with effects](https://react.dev/learn/synchronizing-with-effects) setup/cleanup explain karta hai. [React you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect) unnecessary effects identify karta hai.
