'use strict';

/**
 * ========================================================================
 * 07. REACT ROUTER & SPA NAVIGATION [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 6, 7)
 *
 * THE CORE PROBLEM:
 * - Traditional Multi-Page Apps (MPA): Every link click = full page reload from server.
 *   - Browser fetches entirely new HTML, re-downloads CSS/JS, flickers white.
 * - Single Page Application (SPA): Only the component area swaps.
 *   - HTML shell stays static, JavaScript handles navigation client-side.
 *   - NO full-page reloads = instant, silky-smooth transitions.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │              MPA VS SPA NAVIGATION COMPARISON                       │
 * ├──────────────────┬──────────────────────┬───────────────────────────┤
 * │ Feature          │ MPA (Traditional)    │ SPA (React Router)        │
 * ├──────────────────┼──────────────────────┼───────────────────────────┤
 * │ Page Transition  │ Full reload (white)  │ Instant component swap    │
 * │ Network          │ New HTML + CSS + JS   │ Only JSON data (API)      │
 * │ Browser History  │ Built-in             │ History API (pushState)   │
 * │ SEO              │ Excellent (SSR HTML) │ Needs SSR/Prerendering    │
 * │ User Experience  │ Flicker, slow        │ App-like, fast            │
 * └──────────────────┴──────────────────────┴───────────────────────────┘
 */


// ========================================================================
// 1. REACT ROUTER V6 SETUP — createBrowserRouter + RouterProvider
// ========================================================================

/**
 * MODERN REACT ROUTER SETUP (v6.4+):
 * ```jsx
 * import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
 *
 * // Define routes as a configuration object (data-router pattern)
 * const appRouter = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <AppLayout />,
 *     errorElement: <ErrorPage />,
 *     children: [
 *       { path: '/',         element: <HomePage /> },
 *       { path: '/about',    element: <AboutPage /> },
 *       { path: '/contact',  element: <ContactPage /> },
 *       {
 *         path: '/restaurants/:resId',
 *         element: <RestaurantMenu />,
 *       },
 *     ],
 *   },
 * ]);
 *
 * // Mount the router
 * const root = ReactDOM.createRoot(document.getElementById('root'));
 * root.render(<RouterProvider router={appRouter} />);
 * ```
 *
 * KEY CONCEPTS:
 * - createBrowserRouter: Creates a router using the browser History API.
 * - RouterProvider: Renders the router at the top of your component tree.
 * - Outlet: A placeholder where child route components render inside parent layouts.
 * - errorElement: Catches routing errors (404) and renders a fallback page.
 */


// ========================================================================
// 2. <Link> VS <a> TAG — WHY ANCHOR TAGS BREAK SPAs
// ========================================================================

/**
 * ❌ NEVER USE <a href="/about"> IN A REACT SPA!
 *    - <a> tag triggers a FULL PAGE RELOAD.
 *    - The browser sends a brand new HTTP request to the server.
 *    - Entire React app re-initializes, all state is lost, CSS re-parsed.
 *    - You lose the SPA experience completely.
 *
 * ✅ ALWAYS USE <Link to="/about"> FROM react-router-dom!
 *    - <Link> internally calls `history.pushState()`.
 *    - Only the URL bar updates — NO HTTP request, NO reload.
 *    - React Router matches the new URL and renders the matching component.
 *    - All existing state (cart, user session) is preserved.
 *
 * ✅ FOR ACTIVE STYLING, USE <NavLink>:
 *    - <NavLink> adds an `active` CSS class automatically to the currently active route.
 *    - Perfect for navigation bars and sidebars.
 *
 * ```jsx
 * <NavLink
 *   to="/about"
 *   className={({ isActive }) => isActive ? 'nav-active' : 'nav-link'}
 * >
 *   About Us
 * </NavLink>
 * ```
 */


// ========================================================================
// 3. NESTED ROUTES & THE <Outlet /> PATTERN
// ========================================================================

/**
 * WHAT IS <Outlet />?
 * - <Outlet /> is a React Router component that acts as a "slot" or placeholder.
 * - It renders whichever child route matches the current URL.
 *
 * LAYOUT PATTERN:
 * ```jsx
 * function AppLayout() {
 *   return (
 *     <div className="app">
 *       <Header />           // Always visible
 *       <Outlet />           // Child route renders HERE
 *       <Footer />           // Always visible
 *     </div>
 *   );
 * }
 * ```
 *
 * EXAMPLE ROUTE HIERARCHY:
 * - URL: /              → AppLayout > HomePage (renders inside Outlet)
 * - URL: /about         → AppLayout > AboutPage (renders inside Outlet)
 * - URL: /restaurants/5 → AppLayout > RestaurantMenu (renders inside Outlet)
 *
 * The Header and Footer NEVER re-render or remount on navigation!
 * Only the Outlet content changes. This is the beauty of SPA routing.
 */


// ========================================================================
// 4. DYNAMIC ROUTES & useParams
// ========================================================================

/**
 * DYNAMIC ROUTES:
 * - Define a route parameter with `:paramName` syntax:
 *   `{ path: '/restaurants/:resId', element: <RestaurantMenu /> }`
 *
 * - The colon (:) tells React Router this is a VARIABLE segment.
 * - URL `/restaurants/42` matches and sets resId = "42".
 *
 * useParams HOOK:
 * ```jsx
 * import { useParams } from 'react-router-dom';
 *
 * function RestaurantMenu() {
 *   const { resId } = useParams();   // "42"
 *
 *   useEffect(() => {
 *     fetchRestaurantData(resId);     // Fetch data for this specific restaurant
 *   }, [resId]);
 *
 *   return <h1>Restaurant #{resId}</h1>;
 * }
 * ```
 *
 * IMPORTANT:
 * - useParams returns STRINGS, not numbers. Always parseInt() if needed.
 * - When resId changes (user navigates to different restaurant), the component
 *   re-renders with the new value.
 */


// ========================================================================
// 5. useSearchParams — URL QUERY STATE
// ========================================================================

/**
 * useSearchParams manages URL query parameters (?key=value&key2=value2).
 * Makes state shareable via URL — users can bookmark filtered views!
 *
 * ```jsx
 * import { useSearchParams } from 'react-router-dom';
 *
 * function ProductListPage() {
 *   const [searchParams, setSearchParams] = useSearchParams();
 *
 *   const category = searchParams.get('category') || 'all';
 *   const sortBy = searchParams.get('sort') || 'price';
 *   const page = parseInt(searchParams.get('page') || '1');
 *
 *   function handleCategoryChange(newCategory) {
 *     setSearchParams({
 *       category: newCategory,
 *       sort: sortBy,
 *       page: '1',           // Reset to page 1 on filter change
 *     });
 *   }
 *
 *   return <div>Category: {category}, Sort: {sortBy}, Page: {page}</div>;
 * }
 * ```
 *
 * URL: /products?category=electronics&sort=price&page=2
 *
 * USE CASES:
 * - Filter/Sort state in product listings
 * - Search query persistence
 * - Pagination state
 * - Tab selection (shareable)
 */


// ========================================================================
// 6. useNavigate — PROGRAMMATIC NAVIGATION
// ========================================================================

/**
 * Navigate programmatically (not from a link click):
 *
 * ```jsx
 * import { useNavigate } from 'react-router-dom';
 *
 * function LoginPage() {
 *   const navigate = useNavigate();
 *
 *   async function handleLogin(credentials) {
 *     const success = await loginUser(credentials);
 *     if (success) {
 *       navigate('/dashboard');          // Forward navigation
 *       // navigate('/dashboard', { replace: true });  // Replace history entry
 *       // navigate(-1);                 // Go back (like browser back button)
 *       // navigate(-2);                 // Go back 2 pages
 *     }
 *   }
 * }
 * ```
 *
 * PASSING STATE VIA NAVIGATION:
 * ```jsx
 * navigate('/checkout', { state: { cartItems, totalAmount } });
 *
 * // In CheckoutPage:
 * import { useLocation } from 'react-router-dom';
 * const { state } = useLocation();
 * console.log(state.cartItems, state.totalAmount);
 * ```
 */


// ========================================================================
// 7. PROTECTED / PRIVATE ROUTES
// ========================================================================

/**
 * PATTERN: Wrap private pages so only authenticated users can access them.
 *
 * ```jsx
 * function ProtectedRoute({ children }) {
 *   const { isLoggedIn } = useAuth();     // Custom hook checking auth state
 *
 *   if (!isLoggedIn) {
 *     return <Navigate to="/login" replace />;
 *   }
 *
 *   return children;
 * }
 *
 * // Usage in router config:
 * {
 *   path: '/dashboard',
 *   element: (
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   ),
 * }
 * ```
 *
 * KEY POINTS:
 * - <Navigate to="/login" replace /> performs a redirect.
 * - `replace` ensures the user can't press Back to return to the protected page.
 * - Always check auth on EVERY route render, not just on mount.
 */


// ========================================================================
// 8. ERROR HANDLING WITH errorElement & useRouteError
// ========================================================================

/**
 * ```jsx
 * import { useRouteError } from 'react-router-dom';
 *
 * function ErrorPage() {
 *   const error = useRouteError();
 *
 *   return (
 *     <div className="error-page">
 *       <h1>Oops! Something went wrong</h1>
 *       <p>{error?.status} — {error?.statusText}</p>
 *       <p>{error?.data || error?.message}</p>
 *     </div>
 *   );
 * }
 *
 * // In router config:
 * createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <AppLayout />,
 *     errorElement: <ErrorPage />,      // Catches 404, loader errors, etc.
 *     children: [...],
 *   }
 * ]);
 * ```
 *
 * TYPES OF ERRORS CAUGHT:
 * 1. 404 — URL doesn't match any route
 * 2. Loader errors — Data fetching failed in route loader
 * 3. Render errors — Component threw during rendering
 */


// ========================================================================
// 9. ROUTE-BASED CODE SPLITTING (LAZY LOADING ROUTES)
// ========================================================================

/**
 * Combine React.lazy with React Router for route-level code splitting:
 *
 * ```jsx
 * import { lazy, Suspense } from 'react';
 *
 * const AboutPage = lazy(() => import('./pages/About'));
 * const GroceryPage = lazy(() => import('./pages/Grocery'));
 *
 * const appRouter = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <AppLayout />,
 *     children: [
 *       { path: '/', element: <HomePage /> },           // Eagerly loaded
 *       {
 *         path: '/about',
 *         element: (
 *           <Suspense fallback={<ShimmerUI />}>
 *             <AboutPage />                              // Lazy loaded chunk
 *           </Suspense>
 *         ),
 *       },
 *       {
 *         path: '/grocery',
 *         element: (
 *           <Suspense fallback={<ShimmerUI />}>
 *             <GroceryPage />                            // Lazy loaded chunk
 *           </Suspense>
 *         ),
 *       },
 *     ],
 *   },
 * ]);
 * ```
 *
 * RESULT:
 * - Main bundle: ~120 KB (only contains HomePage + shell)
 * - About.chunk.js: ~30 KB (downloaded only when user navigates to /about)
 * - Grocery.chunk.js: ~180 KB (downloaded only when user navigates to /grocery)
 */


// ========================================================================
// SIMULATION: Simple Client-Side Router
// ========================================================================

class SimpleRouter {
  constructor() {
    this.routes = new Map();
    this.currentPath = '/';
  }

  addRoute(path, component) {
    this.routes.set(path, component);
  }

  navigate(path) {
    if (!this.routes.has(path)) {
      console.log(`[Router] 404 — No route found for "${path}"`);
      return null;
    }
    this.currentPath = path;
    const component = this.routes.get(path);
    console.log(`[Router] Navigated to "${path}" → Rendering: ${component}`);
    return component;
  }

  getCurrentRoute() {
    return { path: this.currentPath, component: this.routes.get(this.currentPath) };
  }
}

// Dynamic route matching simulation
function matchDynamicRoute(pattern, url) {
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');

  if (patternParts.length !== urlParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = urlParts[i];
    } else if (patternParts[i] !== urlParts[i]) {
      return null;
    }
  }
  return params;
}

const router = new SimpleRouter();
router.addRoute('/', 'HomePage');
router.addRoute('/about', 'AboutPage');
router.addRoute('/contact', 'ContactPage');

console.log('--- React Router SPA Navigation Simulation ---');
router.navigate('/');
router.navigate('/about');
router.navigate('/contact');
router.navigate('/nonexistent');

console.log('\n--- Dynamic Route Parameter Extraction ---');
const params1 = matchDynamicRoute('/restaurants/:resId', '/restaurants/42');
console.log('URL: /restaurants/42 → params:', params1);

const params2 = matchDynamicRoute('/users/:userId/posts/:postId', '/users/7/posts/301');
console.log('URL: /users/7/posts/301 → params:', params2);

const params3 = matchDynamicRoute('/about', '/contact');
console.log('URL: /contact vs pattern /about → params:', params3);
