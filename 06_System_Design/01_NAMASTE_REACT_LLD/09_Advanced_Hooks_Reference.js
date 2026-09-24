/**
 * ## Quick revision
 *
 * - `useEffect` — external system ke saath sync; render calculation ke liye nahi.
 * - Dependencies — effect mein used reactive values list karo; linter ko ignore mat karo.
 * - Cleanup — next setup se pehle aur unmount par old listener/timer/connection hatao.
 * - `[]` — changing reactive dependency nahi; development checks setup repeat kar sakte hain.
 * - `useRef` — renders ke beech mutable value; update se rerender nahi hota.
 * - Stale closure — old render ki values capture; dependencies/updater se solve karo.
 * - Fetch race — abort + latest-result guard se old response ignore karo.
 * - Custom Hook — stateful logic reuse; har call ka state separate hota hai.
 * - `useLayoutEffect` — paint se pehle layout work; blocking ka cost dhyaan rakho.
 * - Profiler — pehle slow render/interaction measure karo.
 * - `memo` — same props par render skip kar sakta hai; state/context updates phir bhi aa sakti hain.
 * - `useMemo` — expensive calculation cache; correctness ispar depend mat karao.
 * - `useCallback` — function identity cache; har callback ko wrap karna zaroori nahi.
 * - Lazy loading — route/component code zaroorat par load karo.
 * - Suspense — supported suspending work ka fallback; normal effect fetch auto-handle nahi hota.
 * - Transition — non-urgent update mark; computation magically cheap nahi hoti.
 * - Virtualization — visible list window render; stable identity/accessibility preserve karo.
 * - Production — bundle, errors, accessibility aur real-user performance verify karo.
 * - Hook order — ordinary Hooks ko loops/conditions mein call mat karo; each render ka order stable rakho.
 * - Ref/closure — latest mutable ref aur render snapshot alag semantics; callback ko kaunsi value chahiye decide.
 * - Imperative handle — parent ko narrow operations expose; component internals ka poora control mat do.
 */

'use strict';
// 1. useRef — MUTABLE CONTAINER & DOM ACCESS
// 2. useMemo — MEMOIZE EXPENSIVE COMPUTATIONS
// 3. useCallback — MEMOIZE FUNCTION REFERENCES
// 4. useReducer — COMPLEX STATE WITH DISPATCH/ACTIONS
// 5. useId — SSR-SAFE UNIQUE ID GENERATION
// 6. useContext — ACCESS CONTEXT WITHOUT PROP DRILLING
// 7. CUSTOM HOOKS — EXTRACT REUSABLE STATEFUL LOGIC
// SIMULATION: Advanced Hooks Behavior

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
