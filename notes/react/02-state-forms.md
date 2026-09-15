---
id: react-state-forms
title: State snapshots forms and immutable updates
track: react
order: 2
level: Foundation
minutes: 29
summary: State setter update schedule karta hai; functional updater pending state se next value nikalta hai.
tags: state, forms, immutability, batching, derived-state
visual: react-render
---

## Mental model — simple soch

Har render ko state ka snapshot milta hai. Setter current local variable ko turant change nahi karta; future render ke liye update queue karta hai. State ka owner woh closest common component hona chahiye jise value read/update karni hai. Jo value existing props/state se calculate ho sakti hai, uski duplicate state frequently unnecessary hoti hai.

> **Core takeaway:** State setter update schedule karta hai; functional updater pending state se next value nikalta hai.

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

## Interview questions — bolkar practice karo

**Q. State lift kab karoge?** Jab siblings ko coordinated value chahiye; unnecessary global state banaane ki need nahi.

**Q. Mutation ke baad setter same object de to issue?** React equality checks update skip kar sakti hain, aur previous snapshots bhi corrupt ho jaate hain. New reference plus unchanged data preservation use karo.

## Research notes: Represent coherent request states

Independent loading/success booleans contradictory combination allow karti hain. Coherent status store karo aur display flags derive karo.

```jsx
const [request, setRequest] = useState({ status: 'idle' });
const busy = request.status === 'loading';
// setRequest({ status: 'success', data });
// setRequest({ status: 'error', message });
```

Selected record duplicate store karne ke bajay selected ID rakho. Current collection se record derive karo taaki edits ke baad stale copy na bache.

**Interview check:** Kya har field ek state object mein merge karni chahiye?

**Answer:** Nahi. Saath badalne wali values group karo; independent values separate rakhna clearer ho toh waise rakho. Goal coherent transitions aur less synchronization hai, fixed object count nahi.

**Practice:** Form ke allowed transitions mein retry/cancellation bhi draw karo.

[Source yahan padho — React](https://react.dev/learn/choosing-the-state-structure). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Ek event ke updates ko queue ki tarah trace karo

Count 0 wale render ke handler mein `setCount(count + 1)` do baar call karo: dono expressions 1 calculate karti hain. Same handler mein `setCount(n => n + 1)` do baar ho toh updates previous queued result use karti hain: 0→1→2. Setter existing closure ki count binding rewrite nahi karta. [React state snapshot](https://react.dev/learn/state-as-a-snapshot).

Controlled numeric input mein raw text aur validated number ko alag socho. User field clear kare toh raw value '' hona normal editing state hai. Har keystroke `Number('')` ko 0 bana doge toh blank/required state disappear ho jaayegi. Raw string edit hone do, submit/appropriate boundary par validate aur parse karo.

State shape impossible combinations reduce kare. `isLoading=true` aur `isSuccess=true` ek saath possible hon toh booleans contradictory UI bana sakti hain. Status idle/loading/success/error aur relevant payload ka model clearer hai. Derived filtered list ko duplicate state mein rakhne se source/query change par synchronization bug aa sakta hai.

**Practice:** Submit blank, zero, valid number aur slow failure. Pending state mein duplicate action policy define karo. Server error par draft retain ho; success ke baad reset intentional ho. UI event aur server acknowledgement ka state transition table likho.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Zero se start karke ek click handler mein `setCount(count + 1)` do baar call karo. `setCount(n => n + 1)` do baar se compare karo.

> **Hint — chhota ishara:** Dono direct expressions same render snapshot padhti hain.

**Answer guide — pehle khud karo, phir compare karo:** Direct updates se 1, functional updates se 2 milega. Har updater ko previous updater ka pending result milta hai. Next value previous value par depend ho toh functional form use karo; updater pure rakho.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[React state as a snapshot](https://react.dev/learn/state-as-a-snapshot) queued updates explain karta hai. [React choosing state structure](https://react.dev/learn/choosing-the-state-structure) derived state aur contradictory states discuss karta hai.
