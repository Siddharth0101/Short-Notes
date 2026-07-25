'use strict';

/**
 * ========================================================================
 * REACT ROUTER - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - React Router = client-side routing for SPA (Single Page Application).
 * - URL change hota hai but page RELOAD nahi hota — sirf component swap.
 *
 * HOW SPA ROUTING WORKS:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Traditional Website          │  SPA (React Router)          │
 * │  ──────────────────           │  ──────────────────          │
 * │  /about → Server request      │  /about → JS swaps component│
 * │  Full page reload             │  No page reload              │
 * │  Server renders HTML          │  Client renders component    │
 * │  Slow (network roundtrip)     │  Fast (instant swap)         │
 * └──────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. SETUP AND BASIC ROUTES
 * ========================================================================
 * NOTES:
 * - npm install react-router-dom
 * - BrowserRouter: entire app wrap karo.
 * - Routes: route definitions contain karo.
 * - Route: path + element mapping.
 *
 * ROUTE MATCHING:
 *   URL: /about  →  <Route path="/about" element={<About />} />
 *   URL: /       →  <Route index element={<Home />} />
 *   URL: /xyz    →  <Route path="*" element={<PageNotFound />} />
 */

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
//
// function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route index element={<Homepage />} />
//                 <Route path="product" element={<Product />} />
//                 <Route path="pricing" element={<Pricing />} />
//                 <Route path="app" element={<AppLayout />}>
//                     {/* Nested routes */}
//                     <Route index element={<Navigate replace to="cities" />} />
//                     <Route path="cities" element={<CityList />} />
//                     <Route path="cities/:id" element={<City />} />
//                     <Route path="countries" element={<CountryList />} />
//                 </Route>
//                 <Route path="login" element={<Login />} />
//                 <Route path="*" element={<PageNotFound />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }


/**
 * ========================================================================
 * 2. NAVIGATION — Link AND NavLink
 * ========================================================================
 * NOTES:
 * - <Link to="/about"> → simple navigation. No page reload.
 * - <NavLink to="/about"> → same as Link + active class auto-lagti hai.
 * - <a href="/about"> → ❌ NEVER use! Ye full page reload karega.
 *
 * NavLink ACTIVE STATE:
 * - By default "active" class lagta hai jab current route match kare.
 * - Custom styling: className function receive karta hai { isActive }.
 */

// import { NavLink } from 'react-router-dom';
//
// function Navbar() {
//     return (
//         <nav>
//             <NavLink to="/" className={({ isActive }) =>
//                 isActive ? 'nav-link active' : 'nav-link'
//             }>
//                 Home
//             </NavLink>
//             <NavLink to="/pricing">Pricing</NavLink>
//         </nav>
//     );
// }


/**
 * ========================================================================
 * 3. URL PARAMETERS
 * ========================================================================
 * NOTES:
 * - Dynamic segments: /cities/:id → id = URL parameter.
 * - useParams() hook se access karo.
 *
 * FLOW:
 *   Route:  <Route path="cities/:id" element={<City />} />
 *   URL:    /cities/73930385
 *                       ↓
 *   const { id } = useParams();  // id = '73930385'
 */

// import { useParams } from 'react-router-dom';
//
// function City() {
//     const { id } = useParams();
//     // fetch city data using id...
//     return <h2>City {id}</h2>;
// }


/**
 * ========================================================================
 * 4. QUERY STRINGS (SEARCH PARAMS)
 * ========================================================================
 * NOTES:
 * - URL: /app/cities?lat=40.46&lng=-3.7
 * - useSearchParams() = useState-like hook for URL query params.
 * - Global state that lives in the URL — shareable, bookmarkable.
 */

// import { useSearchParams } from 'react-router-dom';
//
// function Map() {
//     const [searchParams, setSearchParams] = useSearchParams();
//
//     const lat = searchParams.get('lat');
//     const lng = searchParams.get('lng');
//
//     return (
//         <div>
//             <p>Position: {lat}, {lng}</p>
//             <button onClick={() => setSearchParams({ lat: 23, lng: 50 })}>
//                 Change Position
//             </button>
//         </div>
//     );
// }


/**
 * ========================================================================
 * 5. PROGRAMMATIC NAVIGATION
 * ========================================================================
 * NOTES:
 * - useNavigate() hook → code se navigate karo (form submit ke baad, etc.).
 * - navigate('/path') → push to history.
 * - navigate(-1) → go back (like browser back button).
 * - <Navigate /> component → declarative redirect (JSX me).
 *
 * NAVIGATE vs REDIRECT:
 * ┌─────────────────────────┬─────────────────────────────────┐
 * │ useNavigate()           │ <Navigate /> component          │
 * │ ─────────────────────   │ ─────────────────────           │
 * │ Imperative (in code)    │ Declarative (in JSX)            │
 * │ After form submit       │ Default route redirect          │
 * │ navigate('/dashboard')  │ <Navigate replace to="cities" />│
 * └─────────────────────────┴─────────────────────────────────┘
 */

// import { useNavigate, Navigate } from 'react-router-dom';
//
// function Form() {
//     const navigate = useNavigate();
//
//     function handleSubmit(e) {
//         e.preventDefault();
//         // save data...
//         navigate('/app/cities');   // go to cities page
//     }
//
//     return <form onSubmit={handleSubmit}>...</form>;
// }
//
// // Declarative redirect (inside Route):
// <Route index element={<Navigate replace to="cities" />} />


/**
 * ========================================================================
 * 6. NESTED ROUTES AND Outlet
 * ========================================================================
 * NOTES:
 * - Nested routes: Route ke andar Route define karo.
 * - <Outlet /> = placeholder jahan nested route ka component render hoga.
 * - index route = default nested route (parent path pe).
 *
 * VISUAL:
 *   /app              → <AppLayout>         ← parent
 *     /app/cities      → <Outlet> = <CityList>    ← child renders here
 *     /app/cities/:id  → <Outlet> = <City>
 *     /app/countries   → <Outlet> = <CountryList>
 */

// import { Outlet } from 'react-router-dom';
//
// function AppLayout() {
//     return (
//         <div className="app">
//             <Sidebar>
//                 <Outlet />  {/* Nested route component renders here */}
//             </Sidebar>
//             <Map />
//         </div>
//     );
// }


/**
 * ========================================================================
 * 7. PROTECTED ROUTES PATTERN
 * ========================================================================
 * NOTES:
 * - Kuch routes sirf logged-in users ke liye accessible hone chahiye.
 * - ProtectedRoute component banao jo authentication check kare.
 * - Not authenticated → redirect to login.
 */

// function ProtectedRoute({ children }) {
//     const { isAuthenticated } = useAuth(); // custom hook / context
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         if (!isAuthenticated) navigate('/login');
//     }, [isAuthenticated, navigate]);
//
//     return isAuthenticated ? children : null;
// }
//
// // Usage in routes:
// <Route path="app" element={
//     <ProtectedRoute>
//         <AppLayout />
//     </ProtectedRoute>
// }>
