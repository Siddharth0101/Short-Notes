'use strict';

/**
 * ========================================================================
 * EFFECTS & DATA FETCHING - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - useEffect handles side effects outside React render logic.
 *
 * EFFECT LIFECYCLE & CLEANUP FLOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                                                             │
 * │  Component Mounts ──→ Render UI ──→ Run Effect (after paint)│
 * │                                            │                │
 * │  Props/State Changes                       ▼                │
 * │  Render New UI ──→ Run Cleanup ──→ Run New Effect           │
 * │                       │                                     │
 * │  Component Unmounts ──┴──→ Run Final Cleanup                │
 * │                                                             │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. WHAT IS A SIDE EFFECT?
 * ========================================================================
 * NOTES:
 * - Render logic me side effects NAHI hone chahiye:
 *   - No API calls.
 *   - No timers.
 *   - No DOM manipulation.
 *   - No state updates of other components.
 *
 * - Side effects 2 jagah ho sakte hain:
 *   1. Event handlers (onClick, onSubmit) — preferred for user-triggered actions.
 *   2. useEffect — for effects that should run on mount/update/unmount.
 *
 * RULE: Event handler me ho sakta hai toh wahi karo. useEffect last resort.
 */


/**
 * ========================================================================
 * 2. useEffect DEPENDENCY ARRAY MATRIX
 * ========================================================================
 * NOTES:
 * ┌───────────────────────────┬─────────────────────────────────┐
 * │ Dependency Array          │ When Effect Runs?               │
 * ├───────────────────────────┼─────────────────────────────────┤
 * │ useEffect(fn, [a, b])     │ On mount + when a or b changes  │
 * │ useEffect(fn, [])         │ ONLY on mount (first render)    │
 * │ useEffect(fn)             │ On EVERY render (avoid!)        │
 * └───────────────────────────┴─────────────────────────────────┘
 */

// import { useState, useEffect } from 'react';

function MovieApp() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('inception');

    useEffect(
        function () {
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError('');

                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=YOUR_KEY&s=${query}`
                    );

                    if (!res.ok) throw new Error('Something went wrong');

                    const data = await res.json();
                    if (data.Response === 'False') throw new Error('Movie not found');

                    setMovies(data.Search);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError('');
                return;
            }

            fetchMovies();
        },
        [query] // re-run when query changes
    );

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!isLoading && !error && movies.map(m => <p key={m.imdbID}>{m.Title}</p>)}
        </div>
    );
}


/**
 * ========================================================================
 * 3. CLEANUP FUNCTION
 * ========================================================================
 * NOTES:
 * - useEffect ka return function = CLEANUP function.
 * - Cleanup tab run hota hai:
 *   1. Component UNMOUNT hone se pehle.
 *   2. NEXT effect run hone se PEHLE (previous effect clean up).
 *
 * WHEN TO CLEANUP:
 * - HTTP request cancel (AbortController).
 * - Timer clear (clearTimeout, clearInterval).
 * - Event listener remove.
 * - Subscription unsubscribe.
 *
 * WHY?
 * - Memory leaks prevent karna.
 * - Race conditions avoid karna (purana slow request naye se pehle resolve ho jaye).
 * - Stale data prevent karna.
 */

function MovieDetails({ selectedId }) {
    const [movie, setMovie] = useState({});

    useEffect(
        function () {
            const controller = new AbortController();

            async function getMovieDetails() {
                try {
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=YOUR_KEY&i=${selectedId}`,
                        { signal: controller.signal } // connect abort signal
                    );
                    const data = await res.json();
                    setMovie(data);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error(err.message);
                    }
                }
            }

            getMovieDetails();

            // CLEANUP: abort previous request when selectedId changes
            return function () {
                controller.abort();
            };
        },
        [selectedId]
    );

    return <div>{movie.Title}</div>;
}


/**
 * ========================================================================
 * 4. useEffect DEPENDENCY ARRAY RULES
 * ========================================================================
 * NOTES:
 * - EVERY state variable and prop jo effect ke andar use ho -> dependency me daalo.
 * - Function bhi dependency hai agar effect ke andar call ho rahi hai
 *   (unless function component ke bahar defined hai ya useCallback se wrapped hai).
 *
 * COMMON MISTAKES:
 * - Dependency bhoolna -> stale closures (purani values use hoti rehti hain).
 * - Object/array as dependency -> har render pe naya reference -> infinite loop!
 *   Solution: primitive values destructure karo, ya useMemo use karo.
 * - setState ko dependency me daalna zaruri NAHI hai (React guarantees stable reference).
 *
 * LINTING:
 * - eslint-plugin-react-hooks: exhaustive-deps rule enable karo.
 * - KABHI suppress mat karo bina samjhe.
 */

// ❌ BAD: missing dependency
// useEffect(() => {
//     document.title = `${movieTitle}`; // movieTitle used but not in deps!
// }, []); // STALE: title never updates after first render

// ✅ GOOD:
// useEffect(() => {
//     document.title = `${movieTitle}`;
// }, [movieTitle]); // updates when movieTitle changes


/**
 * ========================================================================
 * 5. DATA FETCHING PATTERNS
 * ========================================================================
 * NOTES:
 * - LOADING STATE: fetch shuru hone pe true, end pe false.
 * - ERROR STATE: catch me error set karo.
 * - CONDITIONAL RENDERING: loading, error, data — teeno states handle karo.
 * - RACE CONDITION: AbortController ya cleanup flag use karo.
 *
 * FETCH PATTERN (Jonas style):
 * 1. Set loading = true, error = ''.
 * 2. try: fetch, check res.ok, parse JSON, setData.
 * 3. catch: setError.
 * 4. finally: setLoading = false.
 * 5. cleanup: abort controller.
 */

// Alternative: boolean flag cleanup (simpler but less robust):
// useEffect(() => {
//     let ignore = false;
//
//     async function fetchData() {
//         const res = await fetch(url);
//         const data = await res.json();
//         if (!ignore) setData(data); // only set if not stale
//     }
//
//     fetchData();
//     return () => { ignore = true; }; // cleanup: mark as stale
// }, [url]);


/**
 * ========================================================================
 * 6. CUSTOM HOOKS
 * ========================================================================
 * NOTES:
 * - Custom hook = function jo "use" se start hoti hai aur React hooks use karti hai.
 * - Reusable STATEFUL LOGIC extract karne ka tarika.
 * - UI nahi return karti (component nahi hai), state/data return karti hai.
 * - Har call ka apna independent state hota hai (shared nahi).
 *
 * NAMING: useMovies, useLocalStorageState, useGeoLocation, useKey.
 *
 * WHEN TO CREATE:
 * - Jab same hook logic 2+ components me repeat ho rahi hai.
 * - Jab component me bahut zyada hooks hain -> logic extract karo.
 */

function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(
        function () {
            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError('');
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=YOUR_KEY&s=${query}`,
                        { signal: controller.signal }
                    );
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    if (data.Response === 'False') throw new Error('Not found');
                    setMovies(data.Search);
                } catch (err) {
                    if (err.name !== 'AbortError') setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError('');
                return;
            }

            fetchMovies();
            return () => controller.abort();
        },
        [query]
    );

    return { movies, isLoading, error };
}

// Usage in component:
// function App() {
//     const [query, setQuery] = useState('');
//     const { movies, isLoading, error } = useMovies(query);
//     // ... render
// }


/**
 * ========================================================================
 * 7. useLocalStorageState (Custom Hook Example)
 * ========================================================================
 * NOTES:
 * - localStorage ke saath useState sync karna — common pattern.
 * - Initial value localStorage se read karo.
 * - State change hone par localStorage me save karo.
 */

function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(value));
        },
        [value, key]
    );

    return [value, setValue];
}

// Usage:
// const [watched, setWatched] = useLocalStorageState([], 'watched');
// Ab watched list page refresh ke baad bhi persist karega.


/**
 * ========================================================================
 * 8. useKey (Custom Hook Example — Keyboard Shortcuts)
 * ========================================================================
 * NOTES:
 * - Keypress events ke liye reusable hook.
 * - Event listener add on mount, remove on unmount (cleanup).
 */

function useKey(key, action) {
    useEffect(
        function () {
            function callback(e) {
                if (e.code.toLowerCase() === key.toLowerCase()) {
                    action();
                }
            }

            document.addEventListener('keydown', callback);
            return () => document.removeEventListener('keydown', callback);
        },
        [key, action]
    );
}

// Usage:
// useKey('Escape', handleCloseMovie);
// useKey('Enter', handleSearch);
