# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Wiring a reducer through context

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

## Context performance

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

```jsx
// Galat: poore bookmarks slice ka koi bhi field change hote hi re-render
const bookmarks = useSelector(state => state.bookmarks);

// Sahi: sirf jitna zaroori hai utna select karo
const bookmarkCount = useSelector(state => state.bookmarks.ids.length);
const isBookmarked = useSelector(state => state.bookmarks.ids.includes(topicId));
```
