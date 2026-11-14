---
id: react-context-reducer-redux
title: Context reducers and Redux Toolkit
track: react
order: 7
level: Advanced
minutes: 3
summary: Local state — keep it close when only one component uses it.
tags: context, reducer, redux, redux-toolkit, state-management
visual: context-flow
---

## Quick revision

> Revision target — Choose the state owner; keep deterministic transitions in the reducer and result actions for async work.

- Local state — keep it close when only one component uses it.
- Context — shares a value across the tree; a changed value can rerender its consumers.
- `useReducer` — the next state from an action; keep the reducer pure.
- Context split — keep unrelated fast-changing values in separate providers.
- Redux — a predictable shared store; state transitions through actions.
- Redux Toolkit — Immer handles the draft-mutation syntax inside reducers.
- Selector — read the slice you need; unstable return references can cause extra renders.
- Server state — give it to a fetching/cache tool; avoid a duplicate copy in the store.
- Reducer action — express the meaning of the event, such as itemAdded; no network call inside the reducer.
- Normalized store — keep entities by ID; the update cost of repeated nested copies drops.
- Dispatch/context — keeping the identity of value objects stable can reduce unnecessary notifications.

### Redux flow

- Redux flow — dispatch an action → the reducer produces the next state → subscribed UI renders; no async side effect in the reducer.
- RTK draft — in a createSlice reducer the mutation-looking syntax acts on an Immer draft; do not mutate an arbitrary external object.
- Thunk — coordinates async work into pending/success/failure actions; handle a stale result/cancellation.

### Edge cases and reasoning

- Context memo limit — a memoized child can still rerender when the context it consumes changes; memo does not block a context subscription.
- Serializable state — avoid functions/DOM nodes in a shared persisted store; dates need an explicit serialization contract.
- Reducer invariant — keep selection/entity relationships valid after an action; clean up the selected ID of a deleted item.

## Understand it with an example

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

- Trace — the action describes the transition; the next state is built without mutating the old items array.
- Catch — do not start a request, a random ID or a timer inside the reducer; pass a prepared payload through the action.
- Check — the same state/action must give an equivalent result; an unknown action returns the original state.

## Recall and practice

- Question — How does fetching inside a pure reducer affect debugging and replay?
- Answer — The deterministic result for the same state/action breaks; do the work in an async effect/thunk and dispatch a result action.
- Try it yourself — Write a todo reducer; verify add/update/delete, the policy for an unknown action and a consistent state when the selected item is deleted.

## Practice questions

### Easy · The whole tree re-renders from a context value

```jsx
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
```

Why do all consumers re-render when the Provider's parent re-renders? The fix?

<details>
<summary>Answer</summary>

- Why — a new `{ user, setUser }` object on every render; context compares with `Object.is`, so every consumer updates.
- Fix — `const value = useMemo(() => ({ user, setUser }), [user]);`
- Even better — keep fast-changing data in a separate context (a state vs dispatch split), so only the consumers that need it update.

</details>

### Medium · A reducer that mutates state

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

- Bug — the same reference was returned; React may skip the update, and the old snapshots change too.
- Fix — `return { ...state, items: [...state.items, action.item] };`
- Unknown action — in dev, `throw new Error(\`Unknown action ${action.type}\`)` catches typos early.

</details>

### Medium · A `useSelector` that re-renders on every dispatch

```jsx
const done = useSelector((state) => state.todos.filter((t) => t.done));
```

Why does the component re-render on any unrelated action?

<details>
<summary>Answer</summary>

- Why — `filter` returns a new array every time; `useSelector` compares references, so every dispatch looks "changed".
- Fix — a memoized selector:

```js
const selectDone = createSelector([(state) => state.todos], (todos) => todos.filter((t) => t.done));
```

- Rule — return a raw slice from the selector, or memoized derived data; do not create new objects/arrays inline.

</details>

### Medium · Why normalized state?

Comments are nested in arrays inside posts. Why is editing one comment painful, and what would a normalized shape look like?

<details>
<summary>Answer</summary>

- Nested problem — an update has to copy the whole path; if the same entity lives in two places, they go out of sync.
- Normalized — `{ posts: { ids: [1], entities: { 1: { id: 1, commentIds: [7] } } }, comments: { ids: [7], entities: { 7: {...} } } }`.
- Benefits — `O(1)` lookup by id, an update in one place; RTK's `createEntityAdapter` provides the CRUD reducers and selectors.

</details>

### Hard · Cart reducer with invariants

Write a cart reducer: `add`, `remove`, `setQty`. Rules — a product appears only once, qty is `1–10`, and `setQty(0)` removes it.

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

- Invariants in the reducer — wherever the UI dispatches from, the rules are enforced in one place.
- Pure — no API calls/random; same input → same output, so it is easily testable.
- State placement — the theme in context, the product list in a server cache (Query), the cart in a reducer/store, a form input in local state.

</details>

## Sources — further reading

- [React scaling with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/07-context-reducer-redux.md)
