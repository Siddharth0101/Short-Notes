'use strict';

/**
 * ========================================================================
 * 09. ADVANCED HOOKS REFERENCE — COMPLETE GUIDE [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React + Namaste Frontend System Design)
 *
 * HOOKS COVERED IN THIS FILE:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     HOOKS QUICK REFERENCE TABLE                     │
 * ├──────────────┬──────────────────────────────────────────────────────┤
 * │ Hook         │ Purpose                                              │
 * ├──────────────┼──────────────────────────────────────────────────────┤
 * │ useRef       │ Mutable container, DOM references, no re-render      │
 * │ useMemo      │ Memoize expensive computation results                │
 * │ useCallback  │ Memoize function references for stable identity      │
 * │ useReducer   │ Complex state logic with dispatch/actions             │
 * │ useId        │ SSR-safe unique ID generation                        │
 * │ useContext   │ Access Context value without prop drilling            │
 * │ Custom Hooks │ Extract reusable stateful logic                      │
 * └──────────────┴──────────────────────────────────────────────────────┘
 *
 * RULES OF HOOKS (RECAP):
 * 1. Only call hooks at the TOP LEVEL — never inside if/for/while/nested fn.
 * 2. Only call hooks from React function components or custom hooks.
 * 3. WHY? Because React tracks hooks via a positional linked list on Fiber.
 *    If order changes between renders, hook state gets misaligned = BUGS!
 */


// ========================================================================
// 1. useRef — MUTABLE CONTAINER & DOM ACCESS
// ========================================================================

/**
 * useRef returns a mutable ref object: { current: initialValue }
 *
 * THREE USE CASES:
 *
 * USE CASE 1: Direct DOM Access (focus, scroll, measure)
 * ```jsx
 * function SearchBar() {
 *   const inputRef = useRef(null);
 *
 *   useEffect(() => {
 *     inputRef.current.focus();     // Auto-focus on mount
 *   }, []);
 *
 *   return <input ref={inputRef} placeholder="Search..." />;
 * }
 * ```
 *
 * USE CASE 2: Store mutable values WITHOUT triggering re-render
 * ```jsx
 * function StopWatch() {
 *   const [time, setTime] = useState(0);
 *   const timerRef = useRef(null);          // Persists across renders!
 *
 *   function start() {
 *     timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
 *   }
 *
 *   function stop() {
 *     clearInterval(timerRef.current);       // Access timer ID without re-render
 *   }
 *
 *   return <div>{time}s <button onClick={start}>Start</button></div>;
 * }
 * ```
 *
 * USE CASE 3: Track previous value
 * ```jsx
 * function usePrevious(value) {
 *   const ref = useRef();
 *   useEffect(() => {
 *     ref.current = value;
 *   });
 *   return ref.current;    // Returns value from PREVIOUS render
 * }
 * ```
 *
 * ⚠️ KEY DIFFERENCE: useState vs useRef
 * ┌──────────────────┬─────────────────────────────────────────────┐
 * │ Feature          │ useState           │ useRef                 │
 * ├──────────────────┼────────────────────┼────────────────────────┤
 * │ Triggers render? │ YES (on set)       │ NO (mutate .current)   │
 * │ Returns          │ [value, setter]    │ { current: value }     │
 * │ Survives render? │ Yes                │ Yes                    │
 * │ Use for          │ UI-visible data    │ Internal tracking      │
 * └──────────────────┴────────────────────┴────────────────────────┘
 */


// ========================================================================
// 2. useMemo — MEMOIZE EXPENSIVE COMPUTATIONS
// ========================================================================

/**
 * useMemo caches the RESULT of a computation. Only recomputes when
 * dependencies change.
 *
 * ```jsx
 * const expensiveResult = useMemo(() => {
 *   return heavyComputation(data);    // Only runs when `data` changes
 * }, [data]);
 * ```
 *
 * WHEN TO USE useMemo:
 * 1. Filtering/Sorting large arrays (10,000+ items)
 * 2. Complex mathematical calculations
 * 3. Derived data from props/state (e.g., total cart price)
 * 4. Creating objects/arrays passed as props to child components
 *    (prevents unnecessary child re-renders due to referential inequality)
 *
 * ```jsx
 * function ProductList({ products, searchQuery }) {
 *   // ✅ Filtered list is memoized — only recomputes when products or query change
 *   const filteredProducts = useMemo(() => {
 *     console.log('Filtering 10,000 products...');
 *     return products.filter(p =>
 *       p.name.toLowerCase().includes(searchQuery.toLowerCase())
 *     );
 *   }, [products, searchQuery]);
 *
 *   return filteredProducts.map(p => <ProductCard key={p.id} product={p} />);
 * }
 * ```
 *
 * ⚠️ WHEN NOT TO USE useMemo:
 * - Simple computations (a + b, string concatenation)
 * - The overhead of memoization itself is more expensive than recomputing
 * - React docs: "Write code that works without useMemo, then add it for optimization"
 */


// ========================================================================
// 3. useCallback — MEMOIZE FUNCTION REFERENCES
// ========================================================================

/**
 * useCallback caches a FUNCTION DEFINITION. Returns the same function
 * reference across renders unless dependencies change.
 *
 * WHY DO YOU NEED IT?
 * In JavaScript, functions are OBJECTS. Every render creates a NEW function object.
 * Even if the function body is identical, the reference is different!
 *
 * ```jsx
 * function Parent() {
 *   const [count, setCount] = useState(0);
 *
 *   // ❌ WITHOUT useCallback: handleClick is a NEW function object every render!
 *   // This causes <ExpensiveChild /> to re-render even though its behavior didn't change.
 *   const handleClick = () => console.log('Clicked!');
 *
 *   // ✅ WITH useCallback: Same function reference unless dependencies change.
 *   const handleClickMemo = useCallback(() => {
 *     console.log('Clicked!');
 *   }, []);
 *
 *   return (
 *     <>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(c => c + 1)}>Increment</button>
 *       <ExpensiveChild onClick={handleClickMemo} />
 *     </>
 *   );
 * }
 *
 * // Child wrapped with React.memo — only re-renders if props actually change
 * const ExpensiveChild = React.memo(({ onClick }) => {
 *   console.log('ExpensiveChild rendered!');
 *   return <button onClick={onClick}>Do Something</button>;
 * });
 * ```
 *
 * RELATIONSHIP: useMemo vs useCallback
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ useMemo(() => fn, deps)    →  Caches the RESULT of calling fn      │
 * │ useCallback(fn, deps)      →  Caches the FUNCTION fn itself        │
 * │                                                                     │
 * │ useCallback(fn, deps) === useMemo(() => fn, deps)  // Equivalent!  │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 4. useReducer — COMPLEX STATE WITH DISPATCH/ACTIONS
// ========================================================================

/**
 * When state logic is COMPLEX (multiple sub-values, conditional transitions,
 * or state depends on previous state in non-trivial ways), useReducer is
 * cleaner than multiple useState calls.
 *
 * PATTERN: Inspired by Redux — dispatch(action) → reducer → newState
 *
 * ```jsx
 * const initialState = { count: 0, step: 1 };
 *
 * function counterReducer(state, action) {
 *   switch (action.type) {
 *     case 'INCREMENT':
 *       return { ...state, count: state.count + state.step };
 *     case 'DECREMENT':
 *       return { ...state, count: state.count - state.step };
 *     case 'SET_STEP':
 *       return { ...state, step: action.payload };
 *     case 'RESET':
 *       return initialState;
 *     default:
 *       throw new Error(`Unknown action: ${action.type}`);
 *   }
 * }
 *
 * function Counter() {
 *   const [state, dispatch] = useReducer(counterReducer, initialState);
 *
 *   return (
 *     <div>
 *       <p>Count: {state.count} (step: {state.step})</p>
 *       <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
 *       <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
 *       <button onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })}>Step=5</button>
 *       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * WHEN TO USE useReducer vs useState:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ Scenario                              │ Use                        │
 * ├───────────────────────────────────────┼────────────────────────────┤
 * │ Simple value (boolean, string, number)│ useState                   │
 * │ Related state transitions (form steps)│ useReducer                 │
 * │ State depends on previous state       │ useReducer                 │
 * │ Multiple sub-values in one object     │ useReducer                 │
 * │ State shared with Context             │ useReducer + useContext     │
 * └───────────────────────────────────────┴────────────────────────────┘
 */


// ========================================================================
// 5. useId — SSR-SAFE UNIQUE ID GENERATION
// ========================================================================

/**
 * useId generates a unique ID that is STABLE between server and client renders.
 * Perfect for connecting form labels to inputs, ARIA attributes, etc.
 *
 * ```jsx
 * function EmailField() {
 *   const id = useId();
 *
 *   return (
 *     <div>
 *       <label htmlFor={id}>Email</label>
 *       <input id={id} type="email" />
 *     </div>
 *   );
 * }
 * ```
 *
 * WHY NOT USE Math.random() or Date.now()?
 * - SSR: Server generates ID "abc123", client generates "xyz789" → HYDRATION MISMATCH!
 * - useId generates the SAME ID on both server and client.
 *
 * MULTIPLE IDS IN ONE COMPONENT:
 * ```jsx
 * function LoginForm() {
 *   const id = useId();
 *   return (
 *     <form>
 *       <label htmlFor={`${id}-email`}>Email</label>
 *       <input id={`${id}-email`} type="email" />
 *
 *       <label htmlFor={`${id}-password`}>Password</label>
 *       <input id={`${id}-password`} type="password" />
 *     </form>
 *   );
 * }
 * ```
 */


// ========================================================================
// 6. useContext — ACCESS CONTEXT WITHOUT PROP DRILLING
// ========================================================================

/**
 * PROBLEM: Prop drilling — passing data through 5+ levels of components
 *          that don't even use the data, just pass it through.
 *
 * SOLUTION: Context API — Create a "global" data store accessible from any
 *           component without passing props.
 *
 * ```jsx
 * // 1. Create Context
 * const UserContext = createContext({ name: 'Guest', isLoggedIn: false });
 *
 * // 2. Provide Context (wraps subtree)
 * function App() {
 *   const [user, setUser] = useState({ name: 'Sidd', isLoggedIn: true });
 *   return (
 *     <UserContext.Provider value={{ user, setUser }}>
 *       <Header />
 *       <MainContent />
 *     </UserContext.Provider>
 *   );
 * }
 *
 * // 3. Consume Context (anywhere inside Provider subtree)
 * function ProfileIcon() {
 *   const { user } = useContext(UserContext);
 *   return <span>Welcome, {user.name}!</span>;
 * }
 * ```
 *
 * ⚠️ CONTEXT PERFORMANCE TRAP:
 * - When Context value changes, ALL consuming components re-render!
 * - Even if they only use a small part of the value!
 * - SOLUTION: Split into multiple contexts (ThemeContext, AuthContext, CartContext)
 *   or use state management library (Redux, Zustand) for high-frequency updates.
 *
 * BEST USE CASES FOR CONTEXT:
 * - Theme (dark/light mode)
 * - Current authenticated user
 * - Locale/Language (i18n)
 * - Feature flags
 *
 * BAD USE CASES FOR CONTEXT:
 * - High-frequency updates (typing, cart item count, stock prices)
 * - Large state objects (use Redux/Zustand instead)
 */


// ========================================================================
// 7. CUSTOM HOOKS — EXTRACT REUSABLE STATEFUL LOGIC
// ========================================================================

/**
 * RULES FOR CUSTOM HOOKS:
 * 1. Name MUST start with "use" (useOnlineStatus, useFetch, useDebounce).
 * 2. Can call other hooks (useState, useEffect, useRef, etc.).
 * 3. Each component calling the custom hook gets its OWN copy of the state.
 * 4. Custom hooks are for LOGIC reuse, not UI reuse (that's components).
 *
 * EXAMPLE 1: useOnlineStatus
 * ```jsx
 * function useOnlineStatus() {
 *   const [isOnline, setIsOnline] = useState(navigator.onLine);
 *
 *   useEffect(() => {
 *     const goOnline = () => setIsOnline(true);
 *     const goOffline = () => setIsOnline(false);
 *
 *     window.addEventListener('online', goOnline);
 *     window.addEventListener('offline', goOffline);
 *
 *     return () => {
 *       window.removeEventListener('online', goOnline);
 *       window.removeEventListener('offline', goOffline);
 *     };
 *   }, []);
 *
 *   return isOnline;
 * }
 *
 * // Usage:
 * function StatusBar() {
 *   const isOnline = useOnlineStatus();
 *   return <div>{isOnline ? '🟢 Online' : '🔴 Offline'}</div>;
 * }
 * ```
 *
 * EXAMPLE 2: useFetch (Generic data fetching)
 * ```jsx
 * function useFetch(url) {
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState(null);
 *
 *   useEffect(() => {
 *     const controller = new AbortController();
 *
 *     async function fetchData() {
 *       try {
 *         setLoading(true);
 *         const res = await fetch(url, { signal: controller.signal });
 *         if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *         const json = await res.json();
 *         setData(json);
 *       } catch (err) {
 *         if (err.name !== 'AbortError') setError(err);
 *       } finally {
 *         setLoading(false);
 *       }
 *     }
 *
 *     fetchData();
 *     return () => controller.abort();   // Cleanup on unmount
 *   }, [url]);
 *
 *   return { data, loading, error };
 * }
 *
 * // Usage:
 * function RestaurantMenu() {
 *   const { resId } = useParams();
 *   const { data, loading, error } = useFetch(`/api/restaurants/${resId}`);
 *
 *   if (loading) return <ShimmerUI />;
 *   if (error) return <ErrorBanner message={error.message} />;
 *   return <MenuList items={data.menu} />;
 * }
 * ```
 *
 * EXAMPLE 3: useDebounce
 * ```jsx
 * function useDebounce(value, delayMs) {
 *   const [debouncedValue, setDebouncedValue] = useState(value);
 *
 *   useEffect(() => {
 *     const timer = setTimeout(() => setDebouncedValue(value), delayMs);
 *     return () => clearTimeout(timer);
 *   }, [value, delayMs]);
 *
 *   return debouncedValue;
 * }
 * ```
 */


// ========================================================================
// SIMULATION: Advanced Hooks Behavior
// ========================================================================

// --- useReducer simulation ---
function simulateUseReducer(reducer, initialState) {
  let state = initialState;
  function dispatch(action) {
    state = reducer(state, action);
    console.log(`  [Dispatch] ${action.type} → New State:`, JSON.stringify(state));
  }
  return [() => state, dispatch];
}

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload], count: state.count + 1 };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
        count: state.count - 1
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.payload ? { ...t, done: !t.done } : t))
      };
    default:
      return state;
  }
};

console.log('--- useReducer Simulation ---');
const [getState, dispatch] = simulateUseReducer(todoReducer, { todos: [], count: 0 });
dispatch({ type: 'ADD_TODO', payload: { id: 1, text: 'Learn useReducer', done: false } });
dispatch({ type: 'ADD_TODO', payload: { id: 2, text: 'Build portfolio', done: false } });
dispatch({ type: 'TOGGLE_TODO', payload: 1 });
dispatch({ type: 'REMOVE_TODO', payload: 2 });

// --- useMemo simulation ---
console.log('\n--- useMemo Simulation (Expensive Filter) ---');
function simulateExpensiveFilter(items, query) {
  console.log(`  [useMemo] Computing filter for "${query}" across ${items.length} items...`);
  return items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
}

const products = ['MacBook Pro', 'iPhone 16', 'iPad Air', 'AirPods Pro', 'iMac', 'Mac Mini'];
const filtered = simulateExpensiveFilter(products, 'mac');
console.log('  Filtered results:', filtered);

// --- useRef simulation ---
console.log('\n--- useRef Simulation (Timer ID Storage) ---');
const timerRef = { current: null };
timerRef.current = 'timer_42';
console.log('  Timer stored in ref (no re-render triggered):', timerRef.current);
timerRef.current = 'timer_99';
console.log('  Timer updated in ref (still no re-render):', timerRef.current);

// --- useId simulation ---
console.log('\n--- useId Simulation (SSR-safe ID) ---');
let idCounter = 0;
function simulateUseId() {
  idCounter++;
  return `:r${idCounter}:`;
}
const emailId = simulateUseId();
const passwordId = simulateUseId();
console.log(`  Email field ID: ${emailId}`);
console.log(`  Password field ID: ${passwordId}`);
console.log(`  <label htmlFor="${emailId}">Email</label>`);
console.log(`  <input id="${emailId}" type="email" />`);
