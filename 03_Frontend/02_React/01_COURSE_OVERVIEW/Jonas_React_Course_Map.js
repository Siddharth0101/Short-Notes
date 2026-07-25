'use strict';

/**
 * ========================================================================
 * JONAS REACT COURSE MAP - SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "The Ultimate React Course" follow karta hai.
 * - Projects: Pizza Menu, Far Away, usePopcorn, Eat-N-Split, WorldWise,
 *   Fast React Pizza, The Wild Oasis.
 * - Ye notes original short summary hain; course ka transcript/copy nahi.
 */


/**
 * ========================================================================
 * 1. COURSE FLOW
 * ========================================================================
 * NOTES:
 * - React fundamentals: components, JSX, props, state, events.
 * - Thinking in React: state management, data flow.
 * - Effects and data fetching: useEffect, cleanup, custom hooks.
 * - React Router for SPA routing.
 * - Context API for global state.
 * - Performance optimization: memo, useMemo, useCallback, code splitting.
 * - Redux and Redux Toolkit for large-scale state.
 * - Advanced patterns: compound components, render props, HOCs.
 * - Real-world project patterns and best practices.
 */


/**
 * ========================================================================
 * 2. WHAT YOU SHOULD BE ABLE TO BUILD
 * ========================================================================
 * NOTES:
 * - Single Page Applications with client-side routing.
 * - Component-based UIs with reusable patterns.
 * - Forms with controlled elements and validation.
 * - Data fetching with loading/error states.
 * - Global state management (Context + useReducer / Redux Toolkit).
 * - Performant apps: lazy loading, memoization, bundle optimization.
 * - Full-stack ready: connect React frontend to any backend API.
 */


/**
 * ========================================================================
 * 3. REACT PROJECT ARCHITECTURE
 * ========================================================================
 * NOTES:
 * - src/
 *   ├── components/    -> reusable UI components.
 *   ├── pages/         -> page-level components (route targets).
 *   ├── contexts/      -> React context providers.
 *   ├── hooks/         -> custom hooks.
 *   ├── services/      -> API calls, external services.
 *   ├── utils/         -> helper functions.
 *   ├── styles/        -> CSS modules / global styles.
 *   ├── App.jsx        -> main app component, routing.
 *   └── main.jsx       -> entry point, render to DOM.
 *
 * GOLDEN RULES:
 * - Component = UI + logic for that UI.
 * - Props = data down. Events = actions up.
 * - State = data that changes over time and triggers re-render.
 */


/**
 * ========================================================================
 * 4. CORE CONCEPTS ROADMAP
 * ========================================================================
 * NOTES:
 * - Components: building blocks. Function that returns JSX.
 * - JSX: HTML-like syntax in JS. Compiled by Babel/SWC.
 * - Props: read-only data parent -> child.
 * - State: internal data that triggers re-render on change.
 * - Events: user interactions (click, submit, change).
 * - Effects: side effects (data fetch, DOM manipulation, subscriptions).
 * - Hooks: functions that hook into React features (useState, useEffect, etc.).
 * - Context: pass data through tree without prop drilling.
 * - Refs: access DOM elements or persist values without re-render.
 * - Routing: URL-based navigation without page reload.
 * - State Management: local (useState), lifted, context, Redux.
 */


/**
 * ========================================================================
 * 5. IMPORTANT PACKAGES
 * ========================================================================
 * NOTES:
 * - react              -> core library (components, hooks, JSX).
 * - react-dom           -> DOM rendering (ReactDOM.createRoot).
 * - react-router-dom    -> client-side routing.
 * - @reduxjs/toolkit    -> modern Redux (createSlice, configureStore).
 * - react-redux         -> Redux React bindings (useSelector, useDispatch).
 * - react-query / @tanstack/react-query -> server state management.
 * - react-hook-form     -> performant form handling.
 * - styled-components   -> CSS-in-JS.
 * - react-icons         -> icon library.
 * - react-hot-toast     -> notification toasts.
 * - recharts            -> React charting library.
 * - date-fns            -> date utility functions.
 * - supabase            -> backend as a service (used in Wild Oasis).
 */


/**
 * ========================================================================
 * 6. SKILL CHECKLIST
 * ========================================================================
 * React basics          -> components, JSX, props, state, events, lists, forms
 * State management      -> useState, lifting state, derived state, controlled elements
 * Component patterns    -> composition, children, reusability, splitting components
 * Effects               -> useEffect, dependency array, cleanup, data fetching
 * Custom hooks          -> extract reusable stateful logic
 * Refs                  -> useRef for DOM access and mutable values
 * Advanced hooks        -> useReducer, useMemo, useCallback
 * Routing               -> React Router v6, nested routes, URL params, loaders
 * Context API           -> useContext, provider, context + useReducer
 * Performance           -> memo, lazy loading, Suspense, code splitting
 * Redux                 -> store, slices, dispatch, async thunks, RTK
 * Patterns              -> compound components, render props, HOC
 */
