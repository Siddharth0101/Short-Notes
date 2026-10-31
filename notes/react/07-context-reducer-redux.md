---
id: react-context-reducer-redux
title: Context reducers and Redux Toolkit
track: react
order: 7
level: Advanced
minutes: 3
summary: Local state — sirf component use kare toh paas rakho.
tags: context, reducer, redux, redux-toolkit, state-management
visual: context-flow
---

## Quick revision

> Revision target — State owner choose karo; reducer mein deterministic transitions aur async work ke result actions rakho.

- Local state — sirf component use kare toh paas rakho.
- Context — tree mein value share; changed value consumers rerender kara sakti hai.
- `useReducer` — action se next state; reducer pure rakho.
- Context split — unrelated fast-changing values alag providers mein rakho.
- Redux — predictable shared store; actions se state transitions.
- Redux Toolkit — reducers mein draft mutation syntax Immer handle karta hai.
- Selector — needed slice padho; unstable return references extra renders kara sakte hain.
- Server state — fetching/cache tool ko do; store mein duplicate copy se bacho.
- Reducer action — event ka meaning express karo, jaise itemAdded; reducer ke andar network call nahi.
- Normalized store — entities ID se rakho; repeated nested copies ka update cost kam.
- Dispatch/context — value objects ki identity stable rakhna unnecessary notifications kam kar sakta hai.

### Redux flow

- Redux flow — dispatch action → reducer next state → subscribed UI render; reducer mein async side effect nahi.
- RTK draft — createSlice reducer mein mutation-looking syntax Immer draft par; arbitrary external object mutate mat karo.
- Thunk — async work coordinate karke pending/success/failure actions; stale result/cancellation handle karo.

### Edge cases aur reasoning

- Context memo limit — memoized child apne consumed context change par rerender kar sakta hai; memo context subscription ko block nahi karta.
- Serializable state — shared persisted store mein functions/DOM nodes avoid; dates ko explicit serialization contract chahiye.
- Reducer invariant — action ke baad selection/entity relationships valid rakho; deleted item ka selected ID cleanup karo.

## Example se samjho

```js
function reducer(state, action) {
  switch (action.type) {
    case "added":
      return { ...state, items: [...state.items, action.item] };
    case "cleared":
      return { ...state, items: [] };
    default:
      return state;
  }
}
```

- Trace — action transition describe karta hai; old items array mutate kiye bina next state banti hai.
- Catch — reducer ke andar request, random ID ya timer start mat karo; prepared payload ko action se pass karo.
- Check — same state/action se equivalent result aaye; unknown action original state return kare.

## Recall aur practice

- Sawal — Pure reducer ke andar fetch karna debugging aur replay ko kaise affect karta hai?
- Jawaab — Same state/action ka deterministic result tootega; async effect/thunk se work karo aur result action dispatch karo.
- Khud try karo — Todo reducer likho; add/update/delete, unknown action policy aur selected item delete par consistent state verify karo.

## Practice questions

### Easy · Context value se poora tree re-render

```jsx
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
```

Provider ka parent re-render ho toh saare consumers kyun re-render hote hain? Fix?

<details>
<summary>Answer</summary>

- Kyun — har render par naya `{ user, setUser }` object; context `Object.is` se compare karta hai, isliye har consumer update hota hai.
- Fix — `const value = useMemo(() => ({ user, setUser }), [user]);`
- Aur behtar — fast-changing data ko alag context mein rakho (state vs dispatch split), taaki sirf zaroori consumers update hon.

</details>

### Medium · Reducer jo state mutate karta hai

```jsx
function reducer(state, action) {
  if (action.type === 'add') {
    state.items.push(action.item);
    return state;
  }
  return state;
}
```

<details>
<summary>Answer</summary>

- Bug — same reference return hua; React update skip kar sakta hai aur purane snapshots bhi badal jaate hain.
- Fix — `return { ...state, items: [...state.items, action.item] };`
- Unknown action — dev mein `throw new Error(\`Unknown action ${action.type}\`)` typos jaldi pakadta hai.

</details>

### Medium · `useSelector` jo har dispatch par re-render karata hai

```jsx
const done = useSelector((state) => state.todos.filter((t) => t.done));
```

Kisi bhi unrelated action par component re-render kyun hota hai?

<details>
<summary>Answer</summary>

- Kyun — `filter` har baar naya array deta hai; `useSelector` reference compare karta hai, toh har dispatch "changed" lagta hai.
- Fix — memoized selector:

```js
const selectDone = createSelector([(state) => state.todos], (todos) => todos.filter((t) => t.done));
```

- Rule — selector se raw slice return karo ya memoized derived data; naye objects/arrays inline mat banao.

</details>

### Medium · Normalized state kyun?

Posts ke andar comments nested arrays mein hain. Ek comment edit karne mein pain kyun hai, aur normalized shape kaisi dikhegi?

<details>
<summary>Answer</summary>

- Nested problem — update ke liye poora path copy karna padta hai; same entity do jagah ho toh out of sync.
- Normalized — `{ posts: { ids: [1], entities: { 1: { id: 1, commentIds: [7] } } }, comments: { ids: [7], entities: { 7: {...} } } }`.
- Fayde — `O(1)` lookup by id, ek jagah update; RTK ka `createEntityAdapter` CRUD reducers aur selectors deta hai.

</details>

### Hard · Cart reducer with invariants

Cart reducer likho: `add`, `remove`, `setQty`. Rules — product ek hi baar, qty `1–10`, `setQty(0)` remove kare.

<details>
<summary>Answer</summary>

```js
function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((line) => line.id === action.id);
      if (existing) return cartReducer(state, { type: 'setQty', id: action.id, qty: existing.qty + 1 });
      return [...state, { id: action.id, qty: 1 }];
    }
    case 'remove':
      return state.filter((line) => line.id !== action.id);
    case 'setQty': {
      if (action.qty <= 0) return cartReducer(state, { type: 'remove', id: action.id });
      const qty = Math.min(10, Math.floor(action.qty));
      return state.map((line) => (line.id === action.id ? { ...line, qty } : line));
    }
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
```

- Invariants reducer mein — UI kahin se bhi dispatch kare, rules ek jagah enforce.
- Pure — no API calls/random; same input → same output, isliye easily testable.
- State placement — theme context mein, product list server cache (Query) mein, cart reducer/store mein, form input local state mein.

</details>

## Sources — aur padhne ke liye

- [React scaling with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/07-context-reducer-redux.md)
