---
id: react-context-reducer-redux
title: Context reducers and Redux Toolkit
track: react
order: 7
level: Advanced
minutes: 29
summary: Reducer state transitions centralize karta hai; context value consumers tak pahunchata hai.
tags: context, reducer, redux, redux-toolkit, state-management
visual: context-flow
---

## Mental model — simple soch

State management ka first decision library nahi, ownership aur lifetime hai. Local draft component mein, shared feature state common ancestor mein, URL state router mein aur server cache query layer mein rakho. Context tree ke deep consumers tak value distribute karta hai. Reducer event aur previous state se next state calculate karta hai. Redux shared store, subscriptions aur predictable event flow organize karta hai.

> **Core takeaway:** Reducer state transitions centralize karta hai; context value consumers tak pahunchata hai.

## Reducer as a state transition table

```js
export const initialSession = { status: "idle", topicId: null, minutes: 0 };

export function sessionReducer(state, action) {
  switch (action.type) {
    case "started":
      return { status: "running", topicId: action.topicId, minutes: 0 };
    case "minuteRecorded":
      if (state.status !== "running") return state;
      return { ...state, minutes: state.minutes + 1 };
    case "paused":
      return state.status === "running" ? { ...state, status: "paused" } : state;
    case "reset":
      return initialSession;
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
```

Reducer mein network calls, random values aur timer creation mat karo. Action event ko describe kare; component reducer internals manipulate na kare. `useReducer(sessionReducer, initialSession)` complex related local transitions ko organize karta hai. Context ke through state aur dispatch expose kar sakte ho. Provider ke outside consumer use ho to clear error dene wala custom hook useful hai.

## Wiring a reducer through context

Reducer state ko sirf ek component tak local rakhne ke bajaye, deep tree mein multiple consumers ko chahiye ho, to context provider ke through dispatch aur state expose karo:

```jsx
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSession);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// Deep child, bina prop drilling ke
function PauseButton() {
  const { state, dispatch } = useSession();
  if (state.status !== "running") return null;
  return <button onClick={() => dispatch({ type: "paused" })}>Pause</button>;
}
```

`useSession` hook context ko directly expose karne ke bajaye ek clear contract deta hai — provider missing ho to consumer ko turant descriptive error milta hai, `undefined` par silent crash nahi. Yeh pattern auth context, theme context aur feature-flag context sabme repeat hota hai.

## Context performance

Provider value identity change hone par us context ko read karne wale consumers update ho sakte hain. Context ko universal selective subscription system mat samjho. Unrelated high-frequency values split karna, state aur dispatch contexts separate karna aur ownership ko closer rakhna useful hai. Memoized provider object unnecessary identity changes reduce kar sakta hai, lekin actual context value change par consumers phir bhi update hote hain.

```jsx
// Galat: naya object literal har render par banta hai, isliye har consumer
// re-render hota hai chahe unke used fields unchanged hon
function SessionProviderBroken({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSession);
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}
```

`dispatch` ki identity useReducer se stable hoti hai, lekin `{ state, dispatch }` literal khud naya object hai har render par — isliye `useMemo` se wrap karna zaroori hai. Bade apps mein isse aage badhkar state aur dispatch ke liye do alag contexts banana common practice hai: jo consumer sirf action dispatch karte hain (jaise buttons) unhe state change par re-render hi nahi hona chahiye.

```jsx
const SessionStateContext = createContext(null);
const SessionDispatchContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSession);
  return (
    <SessionStateContext.Provider value={state}>
      <SessionDispatchContext.Provider value={dispatch}>
        {children}
      </SessionDispatchContext.Provider>
    </SessionStateContext.Provider>
  );
}
```

Ab `dispatch`-only consumer `SessionDispatchContext` subscribe karta hai, jiski identity kabhi change nahi hoti, isliye `state` change hone par woh re-render nahi hota.

## Redux Toolkit workflow

```js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: { ids: [] },
  reducers: {
    added(state, action) {
      if (!state.ids.includes(action.payload)) state.ids.push(action.payload);
    },
    removed(state, action) {
      state.ids = state.ids.filter(id => id !== action.payload);
    }
  }
});
export const { added, removed } = bookmarksSlice.actions;
export const store = configureStore({ reducer: { bookmarks: bookmarksSlice.reducer } });
```

RTK reducer drafts Immer ke through immutable next state produce karte hain; ordinary React state mein direct push safe nahi ban jaata. React Redux Provider store expose karta hai; useSelector selected value subscribe karta hai aur useDispatch actions bhejta hai. Async thunks pending/fulfilled/rejected lifecycle actions provide karte hain. Request cache ke liye RTK Query ya TanStack Query choose kar sakte ho; same server data ko multiple independent stores mein duplicate mat karo.

`useSelector` ko poora slice return karna avoid karo agar component ko sirf ek field chahiye — poore slice ka koi bhi field change hone par component re-render hoga:

```jsx
// Galat: poore bookmarks slice ka koi bhi field change hote hi re-render
const bookmarks = useSelector(state => state.bookmarks);

// Sahi: sirf jitna zaroori hai utna select karo
const bookmarkCount = useSelector(state => state.bookmarks.ids.length);
const isBookmarked = useSelector(state => state.bookmarks.ids.includes(topicId));
```

Selector ke andar naya array/object banate ho (jaise `.filter()` ya `.map()`), to har call par naya reference milega aur `useSelector` ka default reference-equality check unnecessary re-renders trigger karega; aise cases mein memoized selector (jaise Reselect ka `createSelector`) use karo.

## Gotchas

- Context provider value ko memoize kiye bina pass karna sabse common context performance bug hai — `useMemo` ya state/dispatch context split se fix karo.
- Reducer ke andar `state.items.push(...)` jaisi direct mutation likhna (bina Immer/RTK ke) ordinary `useReducer` mein silently wrong ho sakta hai, kyunki React reference equality se re-render decide karta hai.
- `useSelector` se poora nested object return karna aur phir component mein sirf ek field use karna unnecessary re-renders deta hai.
- Multiple unrelated pieces of global state ko ek hi giant context/store mein daal dena — isse ek chhoti si change (jaise sidebar toggle) pura tree re-render kara sakti hai jab tak splitting na ho.

## Where this shows up in a real app

Theme (dark/light mode) aur authenticated user jaise cross-cutting concerns typically context se distribute hote hain, kyunki inki update frequency low hoti hai aur almost har component ko access chahiye hota hai. Iske against, shopping cart jaisa high-frequency, deeply-interactive state — jahan quantity, coupons, aur multiple screens se concurrent updates aate hain — often Redux/RTK slice mein better fit hota hai kyunki usse middleware, devtools time-travel debugging aur predictable action log milta hai. Dono ek hi app mein saath reh sakte hain — decision per-feature basis par lo, "context vs Redux" ko globally ek hi answer mat maano.

## Practice

Reading session reducer ke invalid transitions test karo: idle state ko pause, paused state mein minute tick, double start. Bookmarks feature Redux slice se implement karo aur selector ko minimal data return karne do. Context provider ko state aur dispatch contexts mein split karo aur React DevTools Profiler se verify karo ki dispatch-only consumer ab state update par re-render nahi hota.

## Interview questions — bolkar practice karo

**Q. Context Redux replace kar deta hai?** Context distribution primitive hai; Redux external store subscriptions, middleware aur debugging workflow deta hai. App needs se decision lo.

**Q. RTK mein mutation-looking syntax allowed kyun?** Reducer ko Immer draft milta hai, jo updates ko immutable result mein convert karta hai. Draft ko reducer lifetime ke bahar retain mat karo.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Item ID se cart quantity increment action banao. Missing ID aur old state ka behavior define karo.

> **Hint:** State library choose karne se pehle transition rule likho.

**Answer guide — compare after attempting:** Items map karo; matching item ko incremented quantity ke new object se replace karo. Missing ID ko no-op ya explicit error define karo. Previous array/objects mutate mat karo. Reducer ko context/Redux wiring se independently test karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[React scaling with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context) shared state composition explain karta hai. [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start) store aur slice APIs ka reference hai.
