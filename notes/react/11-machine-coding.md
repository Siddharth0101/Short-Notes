---
id: react-machine-coding
title: React machine coding and identity bugs
track: react
order: 11
level: Advanced
minutes: 25
summary: Machine coding mein explicit states, stable identity aur edge cases ka visible handling important hai.
tags: machine-coding, identity, keys, requests, accessibility
visual: react-identity
---

## Mental model — simple soch

Machine coding round mein working happy path sirf starting point hai. Strong solution has a small state model, clear component contracts, predictable identity and observable failure states. Write acceptance criteria before styling. For a search interface, clarify minimum query length, keyboard behavior, loading state, empty results and what happens when old responses arrive late.

> **Core takeaway:** Machine coding mein explicit states, stable identity aur edge cases ka visible handling important hai.

## Model state before components

Input text aur selected result separate rakho. Entity ID identity hai; label presentation hai aur duplicate ho sakta hai. Result us query ka hai jisne produce kiya. Query B ke heading ke neeche A ka data dikhao toh explicit stale indication chahiye.

Editable rows ke stable entity keys rakho. Index keys position se state jodti hain, sorting/delete ke baad draft wrong row par ja sakta hai. Random keys remount karke input/focus lose karti hain. New independent editing session ke liye key deliberately badal sakte ho agar old draft discard intended ho.

## A latest-request guard

Yeh hook request ownership ka example hai; complete combobox/cache library nahi.

```jsx
import { useEffect, useState } from 'react';

export function useResults(query) {
  const [state, setState] = useState({ query: '', status: 'idle', items: [] });
  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    if (!query.trim()) return () => { current = false; };
    async function load() {
      setState({ query, status: 'loading', items: [] });
      try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search failed');
        const items = await response.json(); // Validate the API shape in production.
        if (current) setState({ query, status: 'success', items });
      } catch (error) {
        if (current && !controller.signal.aborted) {
          setState({ query, status: 'error', items: [], message: error.message });
        }
      }
    }
    load();
    return () => { current = false; controller.abort(); };
  }, [query]);
  if (!query.trim()) return { status: 'idle', items: [] };
  return state.query === query ? state : { status: 'loading', items: [] };
}
```

Identity check next effect se pehle one-render stale result rokta hai. Cleanup old request ko new query-owned view overwrite karne se rokta hai. Supported cancellation work bacha sakti hai; correctness guard cancellation timing se independent hai.

## Acceptance checklist

Labeled input aur real buttons lo. True combobox ke liye complete relevant ARIA/keyboard pattern implement karo; sirf role enough nahi. Enter selection se pehle IME composition handle karo. Status announce karo bina har keystroke unnecessarily announce kiye.

## Practice

Fake responses A=900ms, AB=100ms se test karo; AB visible rahe. First editable row delete par second ka draft same rahe. Rejection, empty query, request-during-unmount aur duplicate labels test karo. Kaunsa test behavior check karta hai, explain karo.

## Interview questions — bolkar practice karo

**Debounce stale results rokta hai?** Nahi. Frequency kam karta hai, completion order guarantee nahi.

**Key intentionally kab badle?** Jab new identity ko fresh local state chahiye, jaise explicit discard policy ke saath draft recipient switch karna.

## Capstone: searchable editable data table

URL filters, stable IDs, editable draft aur paginated adapter wali table banao. Twenty fake records/deterministic delay se start, phir loading/empty/error/permission-denied states add karo.

### Acceptance criteria

- Row edit karke sort karo; draft same record ka rahe.
- Slow request ke beech filter change; stale response current result replace na kare.
- Shared URL reload aur Back/Forward se committed filters/page restore hon.
- Har field label ho; sorting/editing keyboard se chale aur editor close par sensible focus return ho.
- Failed optimistic update appropriate prior state restore kare bina newer edits discard kiye.
- Memoization/virtualization se pehle specific expensive render measure karo.

### Interview defense

URL state, local draft aur server data ke owners draw karo. Props-to-state copies ka sync cost explain karo. Ten-thousand rows versus windowing mein keyboard/screen-reader tradeoffs compare karo. Identity/races/navigation tests aur short recording do; static happy-path screenshot enough evidence nahi.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Search A, phir B kiya. B pehle aur A baad mein return hota hai. Visible result aur deterministic test define karo.

> **Hint:** Test mein promise resolution ka order khud control karo.

**Answer guide — compare after attempting:** Sirf B visible rehna chahiye. Request identity ya equivalent stale-response protection rakho; supported ho toh cancellation bhi. Test mein B ko A se pehle resolve karo aur final query/result B assert karo. Purani failure bhi B ki success overwrite na kare.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye
[React identity and state](https://react.dev/learn/preserving-and-resetting-state) and [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) explain the relevant contracts.
