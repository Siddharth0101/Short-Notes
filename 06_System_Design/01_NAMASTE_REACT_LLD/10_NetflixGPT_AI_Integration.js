'use strict';

/**
 * ========================================================================
 * 10. NETFLIX-GPT: AI INTEGRATION & TMDB [⚡ NAMASTE REACT EP 14-16]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Episodes 14, 15, 16)
 *
 * PROJECT OVERVIEW:
 * - A Netflix clone that integrates OpenAI's GPT API to revolutionize movie search.
 * - Instead of searching "Action movies", users search: "Funny retro movies from the 90s".
 * - GPT processes the natural language, returns a list of 5 movie names.
 * - The app then searches the TMDB (The Movie Database) API for those 5 exact movies
 *   and renders the Netflix-style rows.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   AI-DRIVEN SEARCH ARCHITECTURE                     │
 * │                                                                     │
 * │  [User Query: "Horror movies set in space"]                         │
 * │         │                                                           │
 * │         ▼                                                           │
 * │  ┌──────────────┐     prompt      ┌─────────────┐                   │
 * │  │  React App   │ ──────────────► │ OpenAI API  │                   │
 * │  │ (GPT Search) │ ◄────────────── │ (GPT-3.5)   │                   │
 * │  └──────┬───────┘   returns CSV   └─────────────┘                   │
 * │         │         "Alien, Sunshine, Event Horizon"                  │
 * │         │                                                           │
 * │         ▼                                                           │
 * │  ┌──────────────┐  Promise.all()  ┌─────────────┐                   │
 * │  │ TMDB Search  │ ──────────────► │  TMDB API   │                   │
 * │  │ Custom Hook  │ ◄────────────── │ (Movie Data)│                   │
 * │  └──────┬───────┘   returns JSON  └─────────────┘                   │
 * │         │                                                           │
 * │         ▼                                                           │
 * │  [Render Netflix Movie Rows]                                        │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. THIRD-PARTY API INTEGRATION (TMDB)
// ========================================================================

/**
 * BEST PRACTICES FOR EXTERNAL APIs:
 * 1. Store API Keys in `.env` (e.g., `REACT_APP_TMDB_KEY=your_key`).
 *    ⚠️ WARNING: React `.env` vars are bundled into the client build.
 *    For strict security, backend should proxy the requests.
 * 2. Abstract API calls into Custom Hooks or Utility files.
 * 3. Use standard options objects for fetch (Headers, Auth).
 *
 * ```javascript
 * export const API_OPTIONS = {
 *   method: 'GET',
 *   headers: {
 *     accept: 'application/json',
 *     Authorization: `Bearer ${process.env.REACT_APP_TMDB_READ_ACCESS_TOKEN}`,
 *   }
 * };
 *
 * // Custom Hook: Fetching Now Playing Movies
 * const useNowPlayingMovies = () => {
 *   const dispatch = useDispatch();
 *   const nowPlayingMovies = useSelector(store => store.movies.nowPlayingMovies);
 *
 *   useEffect(() => {
 *     // Memoization: Only fetch if we don't have it in Redux store!
 *     if (!nowPlayingMovies) getNowPlayingMovies();
 *   }, []);
 *
 *   const getNowPlayingMovies = async () => {
 *     const data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=1', API_OPTIONS);
 *     const json = await data.json();
 *     dispatch(addNowPlayingMovies(json.results));
 *   };
 * }
 * ```
 */


// ========================================================================
// 2. ORCHESTRATING OPENAI (GPT) WITH REACT
// ========================================================================

/**
 * PROMPT ENGINEERING FOR FRONTEND:
 * You must construct the prompt carefully so GPT returns exactly what your code expects (e.g., CSV).
 *
 * ```javascript
 * const handleGptSearchClick = async (searchText) => {
 *   // 1. Construct the rigid prompt
 *   const gptQuery =
 *     "Act as a Movie Recommendation system and suggest some movies for the query: " +
 *     searchText +
 *     ". Only give me names of 5 movies, comma separated like the example result ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
 *
 *   // 2. Call OpenAI API (Using official openai npm package)
 *   const gptResults = await openai.chat.completions.create({
 *     messages: [{ role: 'user', content: gptQuery }],
 *     model: 'gpt-3.5-turbo',
 *   });
 *
 *   if (!gptResults.choices) {
 *     // Handle error UI
 *     return;
 *   }
 *
 *   // "Andaz Apna Apna, Hera Pheri, Chupke Chupke, Jaane Bhi Do Yaaro, Padosan"
 *   const gptMoviesString = gptResults.choices[0]?.message?.content;
 *   const gptMoviesArray = gptMoviesString.split(", ");
 *
 *   // 3. For each movie, search TMDB API
 *   // `searchMovieTMDB` returns a Promise. We get an array of 5 Promises.
 *   const promiseArray = gptMoviesArray.map(movie => searchMovieTMDB(movie));
 *
 *   // 4. Resolve all promises simultaneously
 *   const tmdbResults = await Promise.all(promiseArray);
 *
 *   // 5. Dispatch to Redux Store
 *   dispatch(addGptMovieResult({ movieNames: gptMoviesArray, movieResults: tmdbResults }));
 * };
 * ```
 *
 * WHY Promise.all()?
 * - If we awaited inside the map/loop, it would take 5x longer (waterfall).
 * - `Promise.all()` fires all 5 TMDB API calls concurrently.
 */


// ========================================================================
// 3. MULTI-LANGUAGE SUPPORT (i18n)
// ========================================================================

/**
 * HOW TO IMPLEMENT A CONFIG-DRIVEN LANGUAGE SYSTEM:
 *
 * Step 1: Create a Language Constants file
 * ```javascript
 * const lang = {
 *   en: {
 *     search: "Search",
 *     gptSearchPlaceholder: "What would you like to watch today?",
 *   },
 *   hi: {
 *     search: "खोज",
 *     gptSearchPlaceholder: "आज आप क्या देखना चाहेंगे?",
 *   },
 *   es: {
 *     search: "Buscar",
 *     gptSearchPlaceholder: "¿Qué te gustaría ver hoy?",
 *   }
 * };
 * export default lang;
 * ```
 *
 * Step 2: Store selected language in Redux/Context
 * ```javascript
 * const configSlice = createSlice({
 *   name: "config",
 *   initialState: { lang: "en" },
 *   reducers: { changeLanguage: (state, action) => { state.lang = action.payload; } }
 * });
 * ```
 *
 * Step 3: Consume in UI
 * ```jsx
 * const GptSearchBar = () => {
 *   const langKey = useSelector(store => store.config.lang);
 *
 *   return (
 *     <input
 *       type="text"
 *       placeholder={lang[langKey].gptSearchPlaceholder}
 *     />
 *     <button>{lang[langKey].search}</button>
 *   );
 * };
 * ```
 */


// ========================================================================
// 4. SECURITY: HIDING API KEYS IN DEPLOYMENT
// ========================================================================

/**
 * ⚠️ NEVER COMMIT API KEYS TO GITHUB.
 *
 * 1. Create a `.env` file at the root.
 *    REACT_APP_OPENAI_KEY=sk-xxxx...
 *
 * 2. Add `.env` to `.gitignore`.
 *
 * 3. Access it in code:
 *    const openai = new OpenAI({
 *      apiKey: process.env.REACT_APP_OPENAI_KEY,
 *      dangerouslyAllowBrowser: true // Required if calling directly from React
 *    });
 *
 * DEPLOYMENT (Vercel / Netlify / Firebase):
 * - You must manually add these Environment Variables in the hosting provider's dashboard
 *   before triggering a production build.
 */

console.log('✅ NetflixGPT AI Integration Architecture module parsed successfully.');
