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
 * - Effect callback — async function directly mat do; andar async work start karke cleanup return karo.
 * - Ref DOM access — node commit ke baad available; unmount par null handle karo.
 * - Dependency identity — fresh object/function reference effect repeat kara sakti hai.
 */

'use strict';


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


// ❌ BAD: missing dependency
// useEffect(() => {
//     document.title = `${movieTitle}`; // movieTitle used but not in deps!
// }, []); // STALE: title never updates after first render

// ✅ GOOD:
// useEffect(() => {
//     document.title = `${movieTitle}`;
// }, [movieTitle]); // updates when movieTitle changes


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
