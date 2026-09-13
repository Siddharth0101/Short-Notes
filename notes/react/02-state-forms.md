---
id: react-state-forms
title: State snapshots forms and immutable updates
track: react
order: 2
level: Foundation
minutes: 26
summary: State ownership, batching, updater functions, derived state aur controlled forms implement karo.
tags: state, forms, immutability, batching, derived-state
visual: react-render
---

## Mental model

Har render ko state ka snapshot milta hai. Setter current local variable ko turant change nahi karta; future render ke liye update queue karta hai. State ka owner woh closest common component hona chahiye jise value read/update karni hai. Jo value existing props/state se calculate ho sakti hai, uski duplicate state frequently unnecessary hoti hai.

> **Core takeaway:** A state setter schedules work; functional updates express changes relative to pending state.

## A controlled reading filter

```jsx
import { useState } from "react";

export default function ReadingFilter({ topics }) {
  const [query, setQuery] = useState("");
  const [onlyShort, setOnlyShort] = useState(false);
  const visible = topics.filter(topic =>
    topic.title.toLowerCase().includes(query.toLowerCase()) &&
    (!onlyShort || topic.minutes <= 15)
  );

  return (
    <>
      <label>
        Search
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={onlyShort}
          onChange={event => setOnlyShort(event.target.checked)} />
        Under 15 minutes
      </label>
      <p>{visible.length} topics</p>
    </>
  );
}
```

`visible` derived value hai. Isko effect mein calculate karke extra state set karoge to duplication aur extra render aa sakta hai. Controlled text input value string rakho; undefined se string transition controlled/uncontrolled warning la sakta hai. Checkbox ke liye value ke bajay checked state read karo. Number input ka event value string hota hai; form draft aur parsed domain value ke roles separate rakho.

Initial state calculate karna expensive ho — jaise localStorage parse karna ya large array filter karna — to plain value ke bajay initializer function pass karo:

```jsx
// Galat: JSON.parse har render par chalta hai, chahe result use ho ya na ho
const [drafts, setDrafts] = useState(JSON.parse(localStorage.getItem("drafts")) ?? []);

// Sahi: initializer function sirf first render par call hoti hai
const [drafts, setDrafts] = useState(() => JSON.parse(localStorage.getItem("drafts")) ?? []);
```

React sirf initial mount par is function ko invoke karta hai; baad ke renders mein cached state hi use hoti hai. Plain expression pass karne par expression har render par evaluate hoti hai, chahe uska result discard hi kyun na ho jaaye.

## Updates that depend on previous state

`setCount(count + 1)` ek snapshot se replacement calculate karta hai. Same handler mein teen baar likhne se teen increments guarantee nahi hote. `setCount(previous => previous + 1)` queued previous state par operation express karta hai. Updater pure hona chahiye. React batching multiple updates ko efficient render mein combine kar sakti hai; state reads ko synchronous variable mutation jaisa mat treat karo.

```jsx
function QuantityStepper({ initial = 1 }) {
  const [quantity, setQuantity] = useState(initial);

  function handleFastDoubleClick() {
    // Rapid double-click par dono calls same stale `quantity` closure use kar sakte hain
    setQuantity(quantity + 1);
    setQuantity(quantity + 1); // Galat: net effect sirf +1 hoga, +2 nahi
  }

  function handleFastDoubleClickFixed() {
    setQuantity(previous => previous + 1);
    setQuantity(previous => previous + 1); // Sahi: har call queued previous value par chain hoti hai
  }

  return <button onClick={handleFastDoubleClickFixed}>Add two</button>;
}
```

Object update ke liye `setProfile(previous => ({ ...previous, name }))` use karo. Nested address update karte waqt address object bhi copy karo. Array item update ke liye map, remove ke liye filter aur append ke liye spread useful hain. In-place sort/push previous state mutate kar sakte hain.

```jsx
// Galat: push previous array ko mutate karta hai, React ko naya reference nahi milta
function addBookmarkBroken(topicId) {
  setBookmarks(previous => {
    previous.push(topicId);
    return previous; // same reference — React re-render skip kar sakta hai
  });
}

// Sahi: spread se naya array banta hai, previous state untouched rehti hai
function addBookmark(topicId) {
  setBookmarks(previous => [...previous, topicId]);
}
```

Mutation ke baad bhi UI kabhi-kabhi visually update ho jaati hai kyunki koi doosra render trigger ho chuka hota hai — is wajah se bug intermittent lagta hai aur debug karna mushkil ho jaata hai. Reference equality par bharosa karne wale checks (jaise `memo` ya `useMemo` dependency) mutate kiya hua object/array ko "unchanged" samajh sakte hain.

## Forms and state structure

Submit handler mein preventDefault lagao jab browser navigation intentionally intercept kar rahe ho. Validation errors relevant field ke paas show karo aur `aria-describedby` se connect karo. `isSaving` aur request result UI ko disable/pending/success states mein express karte hain. Contradictory booleans ki jagah `status: "idle" | "saving" | "success" | "error"` often clearer model hai. Double submit ko UI aur server idempotency dono levels par address karo.

```jsx
function GoalForm({ onSave }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Title required hai");
      return;
    }
    setStatus("saving");
    setErrorMessage(null);
    try {
      await onSave({ title });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={event => setTitle(event.target.value)}
          aria-describedby={errorMessage ? "title-error" : undefined} />
      </label>
      {errorMessage && <p id="title-error" role="alert">{errorMessage}</p>}
      <button disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save goal"}
      </button>
    </form>
  );
}
```

Note karo ki failed save ke baad bhi `title` state form mein preserved rehti hai, kyunki error path mein `setTitle("")` kabhi call nahi hota. Isse user ko dobara pura form fill nahi karna padta — sirf issue fix karke retry karna hota hai.

Do dependent fields ho, jaise "country" select aur uske hisaab se "state/city" options, to dependent field ki value ko independent state mein rakhne ke bajaye ownership reducer ya combined object mein rakhna helpful hota hai, taaki inconsistent combination (jaise purana city naye country ke saath) accidentally set na ho.

## Gotchas

- `useState(expensiveInit())` har render par `expensiveInit()` call karta hai, chahe result sirf pehli baar use ho. Lazy initializer form `useState(() => expensiveInit())` use karo — function pass karo, uska result nahi.
- `setStatus` ke turant baad `status` read karna purani value degi, kyunki state variable us render ka snapshot hai. Naya value chahiye to usse ek local variable mein rakho aur dono jagah use karo.
- Controlled input ko `value={user.name}` dena jahan `user.name` kabhi `undefined` ho sakti hai, React ka "uncontrolled to controlled" warning trigger karta hai. Initial state mein hamesha `""` rakho, `undefined`/`null` nahi.
- Derived value ko state mein duplicate karna (jaise `total` ko `items` ke saath-saath state mein rakhna) do sources of truth banata hai jo desync ho jaate hain. Render ke waqt calculate karo; sirf tab memoize karo jab profiler actual cost dikhaye.
- Object state ko partially update karte waqt `setUser({ name })` baaki fields silently drop kar deta hai kyunki setter merge nahi karta, replace karta hai. `setUser(previous => ({ ...previous, name }))` use karo.

## Practice

Study goal form banao with title, minutes aur track. Blank title reject karo, pending state show karo aur failed save ke baad typed values preserve karo. Reset button implement karo. Explain karo ki `isValid` state rakhna necessary hai ya derived calculation enough hai. Ek quantity stepper banao jisme rapid double-click se do increments reliably apply hon, aur demonstrate karo ki plain `count + 1` version kaise ek increment "kho" deta hai.

## Interview questions

**Q. State lift kab karoge?** Jab siblings ko coordinated value chahiye; unnecessary global state banaane ki need nahi.

**Q. Mutation ke baad setter same object de to issue?** React equality checks update skip kar sakti hain, aur previous snapshots bhi corrupt ho jaate hain. New reference plus unchanged data preservation use karo.

## Research notes: Represent coherent request states

Independent booleans can allow contradictory loading and success states. Store a coherent status and derive display flags.

```jsx
const [request, setRequest] = useState({ status: 'idle' });
const busy = request.status === 'loading';
// setRequest({ status: 'success', data });
// setRequest({ status: 'error', message });
```

Store a selected ID instead of duplicating the selected record. Derive that record from the current collection so an edit cannot leave stale copies.

**Interview check:** Should every field be merged into one state object?

**Answer:** No. Group values that change together and keep independent values separate when clearer. The goal is coherent transitions and less synchronization, not a particular object count.

**Practice:** Draw allowed form transitions including retry and cancellation.

[Read the source — React](https://react.dev/learn/choosing-the-state-structure). Reviewed 13 September 2026; examples and exercises here are original.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** Starting at zero, call `setCount(count + 1)` twice in one click handler. Compare with calling `setCount(n => n + 1)` twice.

> **Hint:** Both direct expressions read the same render snapshot.

**Answer guide — compare after attempting:** The direct updates result in 1; functional updates result in 2. Each updater receives the pending result of the previous updater. Use this form when the next value depends on the previous one; keep updater functions pure.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[React state as a snapshot](https://react.dev/learn/state-as-a-snapshot) queued updates explain karta hai. [React choosing state structure](https://react.dev/learn/choosing-the-state-structure) derived state aur contradictory states discuss karta hai.
