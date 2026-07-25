'use strict';

/**
 * ========================================================================
 * REACT PERFORMANCE - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Performance optimization = unnecessary re-renders rokna.
 * - React by default fast hai. Premature optimization AVOID karo.
 * - Profile PEHLE, optimize BAAD me.
 *
 * RE-RENDER TRIGGER:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Component re-renders when:                                  │
 * │  1. Its STATE changes           (useState/useReducer)        │
 * │  2. Its PROPS change            (parent passes new value)    │
 * │  3. PARENT re-renders           (children auto re-render)    │
 * │  4. CONTEXT value changes       (useContext consumer)        │
 * │                                                              │
 * │  Re-render ≠ DOM update!                                     │
 * │  React diffs virtual DOM → only changed parts update DOM.    │
 * └──────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. OPTIMIZATION TOOLS OVERVIEW
 * ========================================================================
 * NOTES:
 *
 * ┌───────────────────┬──────────────────────────────────────────┐
 * │ Tool              │ Purpose                                  │
 * ├───────────────────┼──────────────────────────────────────────┤
 * │ memo()            │ Skip re-render if props unchanged        │
 * │ useMemo()         │ Cache expensive calculation result       │
 * │ useCallback()     │ Cache function reference                 │
 * │ React.lazy()      │ Code splitting (load on demand)          │
 * │ Suspense          │ Fallback UI while lazy loading           │
 * │ children prop     │ Composition to avoid re-renders          │
 * │ key prop          │ Force reset or optimize list rendering   │
 * └───────────────────┴──────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 2. memo() — MEMOIZE COMPONENTS
 * ========================================================================
 * NOTES:
 * - memo(Component) → component sirf tab re-render hoga jab PROPS change hon.
 * - Parent re-render hone par bhi memo wrapped child SKIP karega.
 * - Props shallow comparison se check hote hain (===).
 *
 * WHEN TO USE:
 * - Component frequently re-renders with same props.
 * - Component expensive render logic hai.
 * - List items jo parent state se unrelated hain.
 *
 * WHEN NOT TO USE:
 * - Simple/light components (overhead > benefit).
 * - Props har render pe change hote hain anyway.
 *
 * ⚠️ TRAP:
 * - Object/array/function as prop → har render pe NAYA reference → memo useless!
 * - Solution: useMemo/useCallback se wrap karo.
 */

// import { memo } from 'react';
//
// const MovieList = memo(function MovieList({ movies, onSelect }) {
//     console.log('MovieList rendered'); // check when it renders
//     return (
//         <ul>
//             {movies.map(m => (
//                 <li key={m.id} onClick={() => onSelect(m.id)}>{m.title}</li>
//             ))}
//         </ul>
//     );
// });


/**
 * ========================================================================
 * 3. useMemo + useCallback WITH memo()
 * ========================================================================
 * NOTES:
 * - memo() akele kaam NAHI karega agar props me object/function pass ho.
 * - Har render pe naya object = naya reference = memo fail.
 *
 * COMBO PATTERN:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Parent Component:                                           │
 * │  const data = useMemo(() => expensiveCalc(x), [x]);         │
 * │  const handler = useCallback((id) => { ... }, []);          │
 * │                                                              │
 * │  <MemoizedChild data={data} onAction={handler} />           │
 * │       ↓                                                      │
 * │  memo() checks: data same ref? ✅ handler same ref? ✅     │
 * │  Result: SKIP re-render! 🎉                                  │
 * └──────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 4. CHILDREN AS PROPS (Composition Trick)
 * ========================================================================
 * NOTES:
 * - State change sirf us component ko re-render karta hai jisme state hai.
 * - Trick: state wale component ke andar children prop se doosre components pass karo.
 * - Children already created hain BEFORE parent re-renders → re-render skip!
 *
 * BEFORE (slow — Counter re-renders everything):
 *   function Counter() {
 *       const [count, setCount] = useState(0);
 *       return <div> <HeavyComponent /> <button>+</button> </div>;
 *   }
 *
 * AFTER (fast — HeavyComponent doesn't re-render):
 *   function Counter({ children }) {
 *       const [count, setCount] = useState(0);
 *       return <div> {children} <button>+</button> </div>;
 *   }
 *   <Counter> <HeavyComponent /> </Counter>
 */


/**
 * ========================================================================
 * 5. CODE SPLITTING & LAZY LOADING
 * ========================================================================
 * NOTES:
 * - Default: sab code EK bundle me → slow initial load.
 * - Code splitting: routes/components ko ALAG bundles me tod do.
 * - React.lazy() → component dynamically import karo (jab zaroorat ho).
 * - Suspense → loading state dikhao jab tak component load ho.
 *
 * BUNDLE FLOW:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Without Splitting:                                          │
 * │  main.js (2MB) ──→ User downloads EVERYTHING upfront        │
 * │                                                              │
 * │  With Splitting:                                             │
 * │  main.js (200KB) ──→ Initial load (fast!)                   │
 * │  about.chunk.js   ──→ Loaded when /about visited            │
 * │  dashboard.chunk  ──→ Loaded when /dashboard visited        │
 * └──────────────────────────────────────────────────────────────┘
 */

// import { lazy, Suspense } from 'react';
//
// // Lazy load pages:
// const Homepage = lazy(() => import('./pages/Homepage'));
// const Product = lazy(() => import('./pages/Product'));
// const Pricing = lazy(() => import('./pages/Pricing'));
// const AppLayout = lazy(() => import('./pages/AppLayout'));
//
// function App() {
//     return (
//         <BrowserRouter>
//             <Suspense fallback={<SpinnerFullPage />}>
//                 <Routes>
//                     <Route index element={<Homepage />} />
//                     <Route path="product" element={<Product />} />
//                     <Route path="pricing" element={<Pricing />} />
//                     <Route path="app" element={<AppLayout />} />
//                 </Routes>
//             </Suspense>
//         </BrowserRouter>
//     );
// }


/**
 * ========================================================================
 * 6. OPTIMIZATION CHECKLIST
 * ========================================================================
 * NOTES:
 *
 * STEP-BY-STEP OPTIMIZATION APPROACH:
 *
 * 1. PROFILE FIRST
 *    └→ React DevTools Profiler → find slow renders
 *
 * 2. PREVENT UNNECESSARY RE-RENDERS
 *    ├→ Move state down (closer to where used)
 *    ├→ Children as props pattern (composition)
 *    ├→ memo() on heavy child components
 *    └→ useMemo/useCallback for props to memo'd children
 *
 * 3. REDUCE RENDER COST
 *    ├→ useMemo for expensive calculations
 *    └→ Avoid creating objects/arrays in render
 *
 * 4. IMPROVE PERCEIVED SPEED
 *    ├→ React.lazy + Suspense (code splitting)
 *    ├→ Skeleton screens instead of spinners
 *    └→ Optimistic UI updates
 *
 * DON'T OPTIMIZE:
 * - Simple components with few children
 * - Components that SHOULD re-render (state changed, makes sense)
 * - Before measuring (premature optimization = root of all evil)
 */
