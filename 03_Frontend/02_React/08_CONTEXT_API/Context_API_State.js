'use strict';

/**
 * ========================================================================
 * CONTEXT API & STATE MANAGEMENT - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Context API = prop drilling ke bina deeply nested components ko data dene ka tarika.
 * - Context + useReducer = lightweight Redux alternative.
 *
 * PROP DRILLING vs CONTEXT:
 * ┌─────────────────────────────────┬─────────────────────────────────┐
 * │  PROP DRILLING ❌               │  CONTEXT API ✅                 │
 * │  ───────────────                │  ────────────                   │
 * │  App → Page → Layout →         │  Provider wraps tree            │
 * │  Sidebar → List → Item         │  Any child reads directly       │
 * │  (6 levels of passing!)        │  (useContext hook)              │
 * └─────────────────────────────────┴─────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. CREATING AND PROVIDING CONTEXT
 * ========================================================================
 * NOTES:
 * - createContext() → context object banao.
 * - <Context.Provider value={...}> → value provide karo.
 * - Provider ko component tree me upar wrap karo jahan se data chahiye.
 *
 * FLOW:
 *   createContext() → Provider wraps tree → useContext() reads value
 *        ↓                    ↓                      ↓
 *    Create box         Fill the box            Open the box
 */

// import { createContext, useContext, useState } from 'react';
//
// // 1. CREATE context:
// const PostContext = createContext();
//
// // 2. PROVIDE context (wrap tree):
// function PostProvider({ children }) {
//     const [posts, setPosts] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//
//     const value = {
//         posts,
//         onAddPost: (post) => setPosts(prev => [...prev, post]),
//         searchQuery,
//         setSearchQuery,
//     };
//
//     return (
//         <PostContext.Provider value={value}>
//             {children}
//         </PostContext.Provider>
//     );
// }


/**
 * ========================================================================
 * 2. CONSUMING CONTEXT
 * ========================================================================
 * NOTES:
 * - useContext(MyContext) → context ki current value read karo.
 * - Koi bhi nested component directly access kar sakta hai.
 * - Custom hook banao for cleaner code.
 */

// 3. CONSUME context (any child):
// function usePosts() {
//     const context = useContext(PostContext);
//     if (context === undefined)
//         throw new Error('PostContext was used outside PostProvider');
//     return context;
// }
//
// function SearchBar() {
//     const { searchQuery, setSearchQuery } = usePosts();
//     return (
//         <input
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             placeholder="Search posts..."
//         />
//     );
// }
//
// function PostList() {
//     const { posts } = usePosts();
//     return posts.map(post => <p key={post.id}>{post.title}</p>);
// }


/**
 * ========================================================================
 * 3. CONTEXT + useReducer (Mini Redux)
 * ========================================================================
 * NOTES:
 * - Simple state → Context + useState.
 * - Complex state → Context + useReducer.
 * - This combo = "poor man's Redux" — chhoti/medium apps ke liye perfect.
 *
 * ARCHITECTURE:
 * ┌──────────────────────────────────────────────────────────────┐
 * │                     CONTEXT PROVIDER                         │
 * │  ┌─────────────────────────────────────────────────────┐    │
 * │  │  useReducer(reducer, initialState)                    │    │
 * │  │      ↓                    ↓                           │    │
 * │  │    state                dispatch                      │    │
 * │  │      ↓                    ↓                           │    │
 * │  │  <Context.Provider value={{ state, dispatch }}>       │    │
 * │  └─────────────────────────────────────────────────────┘    │
 * │                           ↓                                  │
 * │       Child components useContext() se access karte hain     │
 * │       dispatch({ type: 'ACTION' }) se state update           │
 * └──────────────────────────────────────────────────────────────┘
 */

// import { createContext, useContext, useReducer } from 'react';
//
// const AuthContext = createContext();
//
// const initialState = {
//     user: null,
//     isAuthenticated: false,
// };
//
// function reducer(state, action) {
//     switch (action.type) {
//         case 'login':
//             return { ...state, user: action.payload, isAuthenticated: true };
//         case 'logout':
//             return { ...state, user: null, isAuthenticated: false };
//         default:
//             throw new Error('Unknown action');
//     }
// }
//
// function AuthProvider({ children }) {
//     const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);
//
//     function login(email, password) {
//         if (email === 'admin@test.com' && password === 'qwerty') {
//             dispatch({ type: 'login', payload: { name: 'Admin', email } });
//         }
//     }
//
//     function logout() {
//         dispatch({ type: 'logout' });
//     }
//
//     return (
//         <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
//
// function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error('useAuth must be used within AuthProvider');
//     return context;
// }


/**
 * ========================================================================
 * 4. WHEN TO USE CONTEXT
 * ========================================================================
 * NOTES:
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  STATE TYPE          │  SOLUTION                               │
 * ├──────────────────────┼─────────────────────────────────────────┤
 * │  Local UI state      │  useState in component                  │
 * │  Few levels deep     │  Props (it's fine!)                     │
 * │  Prop drilling (5+)  │  Context API                            │
 * │  Complex + frequent  │  Redux / Zustand                        │
 * │  Server data         │  React Query / SWR                      │
 * │  URL state           │  React Router (useSearchParams)         │
 * └──────────────────────┴─────────────────────────────────────────┘
 *
 * CONTEXT LIMITATIONS:
 * - Context value change → ALL consumers re-render (even if they don't use changed part).
 * - Very frequent updates (typing, dragging) → performance issue.
 * - Solution for perf: split contexts, memoize, or use Redux/Zustand.
 */


/**
 * ========================================================================
 * 5. CONTEXT BEST PRACTICES
 * ========================================================================
 * NOTES:
 * - 1 concern = 1 context (AuthContext, ThemeContext, CartContext).
 * - Custom Provider component banao (state logic encapsulate karo).
 * - Custom hook banao (useAuth, useTheme) — never raw useContext.
 * - Error throw karo agar context Provider ke bahar use ho.
 * - TypeScript me context type define karo.
 *
 * FILE STRUCTURE:
 *   src/contexts/
 *   ├── AuthContext.jsx      → createContext + AuthProvider + useAuth
 *   ├── CitiesContext.jsx    → createContext + CitiesProvider + useCities
 *   └── ThemeContext.jsx     → createContext + ThemeProvider + useTheme
 *
 * USAGE IN APP:
 *   <AuthProvider>
 *       <CitiesProvider>
 *           <BrowserRouter>
 *               <App />
 *           </BrowserRouter>
 *       </CitiesProvider>
 *   </AuthProvider>
 */
