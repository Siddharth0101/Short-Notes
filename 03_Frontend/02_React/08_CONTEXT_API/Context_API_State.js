/**
 * ## Quick revision
 *
 * - Local state — sirf component use kare toh paas rakho.
 * - Context — tree mein value share; changed value consumers rerender kara sakti hai.
 * - `useReducer` — action se next state; reducer pure rakho.
 * - Context split — unrelated fast-changing values alag providers mein rakho.
 * - Redux — predictable shared store; actions se state transitions.
 * - Redux Toolkit — reducers mein draft mutation syntax Immer handle karta hai.
 * - Selector — needed slice padho; unstable return references extra renders kara sakte hain.
 * - Server state — fetching/cache tool ko do; store mein duplicate copy se bacho.
 * - Reducer action — event ka meaning express karo, jaise itemAdded; reducer ke andar network call nahi.
 * - Normalized store — entities ID se rakho; repeated nested copies ka update cost kam.
 * - Dispatch/context — value objects ki identity stable rakhna unnecessary notifications kam kar sakta hai.
 */

'use strict';


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
