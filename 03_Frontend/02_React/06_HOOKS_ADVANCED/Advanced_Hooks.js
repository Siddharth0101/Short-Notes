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
