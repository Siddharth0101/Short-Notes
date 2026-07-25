'use strict';

/**
 * ========================================================================
 * ADVANCED HOOKS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - useRef, useReducer, useMemo, useCallback.
 *
 * useReducer FLOW DIAGRAM:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                                                             │
 * │  Event ──→ dispatch({ type: 'ADD', payload: data })         │
 * │                                 │                           │
 * │                                 ▼                           │
 * │  reducer(currentState, action) ──→ Returns NEW State ──→ UI │
 * │                                                             │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. RULES OF HOOKS
 * ========================================================================
 * NOTES:
 * - Rule 1: Hooks SIRF TOP LEVEL pe call karo.
 *   ❌ Conditionals, loops, nested functions ke andar nahi.
 *   Why? React hooks ka order track karta hai. Order change = crash.
 *
 * - Rule 2: Hooks SIRF React functions me call karo.
 *   ✅ Function components.
 *   ✅ Custom hooks.
 *   ❌ Regular JS functions, class components.
 *
 * - ESLint plugin: eslint-plugin-react-hooks (CRA/Vite me built-in).
 */


/**
 * ========================================================================
 * 2. useRef VS useState
 * ========================================================================
 * NOTES:
 * ┌───────────────────────────┬─────────────────────────────────┐
 * │  useState                 │  useRef                         │
 * ├───────────────────────────┼─────────────────────────────────┤
 * │  Triggers re-render       │  Does NOT trigger re-render     │
 * │  Immutable updates        │  Mutable (.current property)    │
 * │  Async state updates      │  Synchronous current value      │
 * │  Use for UI state         │  Use for DOM nodes / timers     │
 * └───────────────────────────┴─────────────────────────────────┘
 */

// import { useRef, useEffect } from 'react';

function Search({ query, setQuery }) {
    const inputEl = useRef(null); // ref for DOM element

    // Focus input on mount:
    useEffect(function () {
        inputEl.current.focus();
    }, []);

    return (
        <input
            ref={inputEl}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
    );
}

// Mutable value example (timer ID):
function Timer() {
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef(null);

    function startTimer() {
        intervalRef.current = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(intervalRef.current);
    }

    return (
        <div>
            <p>{seconds}s</p>
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
        </div>
    );
}


/**
 * ========================================================================
 * 3. useReducer
 * ========================================================================
 * NOTES:
 * - useState ka advanced version.
 * - Complex state logic ke liye: multiple related state variables,
 *   state transitions jo ek dusre pe depend karein.
 *
 * PATTERN:
 * - const [state, dispatch] = useReducer(reducer, initialState);
 * - dispatch({ type: 'ACTION_NAME', payload: data });
 * - reducer(state, action) -> newState (pure function, no side effects).
 *
 * WHEN useReducer OVER useState:
 * - 3+ related state variables.
 * - Complex update logic.
 * - Next state purane state pe depend karta hai.
 * - State machine pattern chahiye.
 *
 * ANALOGY:
 * - useState = setState directly.
 * - useReducer = "kya hua" (action) dispatch karo, reducer decide kare "kya karna hai".
 */

// import { useReducer } from 'react';

const initialState = {
    count: 0,
    step: 1,
};

function reducer(state, action) {
    switch (action.type) {
        case 'inc':
            return { ...state, count: state.count + state.step };
        case 'dec':
            return { ...state, count: state.count - state.step };
        case 'setStep':
            return { ...state, step: action.payload };
        case 'reset':
            return initialState;
        default:
            throw new Error('Unknown action: ' + action.type);
    }
}

function CounterReducer() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'dec' })}>-</button>
            <button onClick={() => dispatch({ type: 'inc' })}>+</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
            <input
                type="range"
                min="1"
                max="10"
                value={state.step}
                onChange={e => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
            />
        </div>
    );
}


/**
 * ========================================================================
 * 4. useReducer — REAL WORLD EXAMPLE (Quiz App)
 * ========================================================================
 * NOTES:
 * - Complex state: status, questions, current index, answer, points, timer.
 * - Sab related hain -> useReducer perfect fit.
 */

// const quizInitialState = {
//     questions: [],
//     status: 'loading', // 'loading' | 'error' | 'ready' | 'active' | 'finished'
//     index: 0,
//     answer: null,
//     points: 0,
//     highscore: 0,
//     secondsRemaining: null,
// };
//
// function quizReducer(state, action) {
//     switch (action.type) {
//         case 'dataReceived':
//             return { ...state, questions: action.payload, status: 'ready' };
//         case 'dataFailed':
//             return { ...state, status: 'error' };
//         case 'start':
//             return { ...state, status: 'active', secondsRemaining: state.questions.length * 30 };
//         case 'newAnswer': {
//             const question = state.questions[state.index];
//             const isCorrect = action.payload === question.correctOption;
//             return {
//                 ...state,
//                 answer: action.payload,
//                 points: isCorrect ? state.points + question.points : state.points,
//             };
//         }
//         case 'nextQuestion':
//             return { ...state, index: state.index + 1, answer: null };
//         case 'finish':
//             return {
//                 ...state,
//                 status: 'finished',
//                 highscore: Math.max(state.points, state.highscore),
//             };
//         case 'tick':
//             return {
//                 ...state,
//                 secondsRemaining: state.secondsRemaining - 1,
//                 status: state.secondsRemaining === 0 ? 'finished' : state.status,
//             };
//         default:
//             throw new Error('Unknown action');
//     }
// }


/**
 * ========================================================================
 * 5. useMemo
 * ========================================================================
 * NOTES:
 * - useMemo = MEMOIZE a VALUE. Cache karta hai, re-calculate tab karta hai
 *   jab dependencies change hon.
 * - const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
 *
 * WHEN TO USE:
 * - Expensive calculations (sort large arrays, heavy math).
 * - Referential equality preserve karna (objects/arrays as dependencies).
 * - Pass as prop to memo() wrapped component.
 *
 * WHEN NOT TO USE:
 * - Simple calculations (overhead > benefit).
 * - Premature optimization (profile pehle!).
 */

// import { useMemo } from 'react';

function Dashboard({ items }) {
    // Expensive calculation memoized:
    const sortedItems = useMemo(() => {
        console.log('Sorting...'); // only runs when items change
        return [...items].sort((a, b) => a.value - b.value);
    }, [items]);

    // Preserving reference for child component:
    const chartData = useMemo(() => ({
        labels: items.map(i => i.name),
        values: items.map(i => i.value),
    }), [items]);

    return (
        <div>
            <ul>{sortedItems.map(i => <li key={i.id}>{i.name}</li>)}</ul>
        </div>
    );
}


/**
 * ========================================================================
 * 6. useCallback
 * ========================================================================
 * NOTES:
 * - useCallback = MEMOIZE a FUNCTION. Same function reference persist karta hai
 *   jab tak dependencies na change hon.
 * - const memoizedFn = useCallback(function() { ... }, [deps]);
 *
 * WHY NEEDED?
 * - Har render pe functions NAYA reference create karte hain.
 * - Agar memo() wrapped child ko function prop pass karte ho,
 *   naye reference se child unnecessarily re-render hoga.
 * - useCallback reference stable rakhta hai.
 *
 * RELATIONSHIP:
 * - useMemo(() => fn, [deps]) === useCallback(fn, [deps])
 * - useMemo values memoize karta hai, useCallback functions.
 */

// import { useCallback, memo } from 'react';

// const MovieList = memo(function MovieList({ movies, onSelectMovie }) {
//     return (
//         <ul>
//             {movies.map(movie => (
//                 <li key={movie.id} onClick={() => onSelectMovie(movie.id)}>
//                     {movie.title}
//                 </li>
//             ))}
//         </ul>
//     );
// });
//
// function App() {
//     const [movies, setMovies] = useState([]);
//     const [selectedId, setSelectedId] = useState(null);
//
//     // Without useCallback: new function every render -> MovieList re-renders!
//     // With useCallback: same reference -> MovieList skips re-render
//     const handleSelectMovie = useCallback(function (id) {
//         setSelectedId(id);
//     }, []); // no deps because setSelectedId is stable
//
//     return <MovieList movies={movies} onSelectMovie={handleSelectMovie} />;
// }


/**
 * ========================================================================
 * 7. WHICH HOOK WHEN? (DECISION GUIDE)
 * ========================================================================
 *
 * WHAT DO YOU NEED?                    HOOK
 * ──────────────────────────────────────────────────────
 * Simple state (1-2 variables):        useState
 * Complex related state:               useReducer
 * Side effects (fetch, timer, DOM):    useEffect
 * DOM element access:                  useRef
 * Persist value without re-render:     useRef
 * Memoize expensive calculation:       useMemo
 * Memoize function reference:          useCallback
 * Read context value:                  useContext
 * Global state (simple):              useContext + useReducer
 * Global state (complex):             Redux / Zustand
 *
 * OPTIMIZATION ORDER:
 * 1. Profile first (React DevTools Profiler).
 * 2. Identify slow renders.
 * 3. memo() on child components that re-render unnecessarily.
 * 4. useMemo/useCallback for props passed to memo() children.
 * 5. Move state down (closer to where it's used).
 * 6. Children as props pattern (composition).
 */
