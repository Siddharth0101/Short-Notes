/**
 * ## Quick revision
 *
 * - Router — URL ko screen/layout se map karta hai.
 * - Path param — resource identity; query param — filters, sort aur page.
 * - Nested route — shared layout ke andar child route render.
 * - URL state — shareable/bookmarkable state URL mein rakho.
 * - Navigation — link use karo; button action ke liye.
 * - Loader — route data fetch; error/pending handling define karo.
 * - Protected route — UI guard hai; backend authorization phir bhi chahiye.
 * - Back/forward — URL se state derive karo, duplicate local copy drift na kare.
 * - Replace navigation — current history entry replace; push nayi entry banata hai.
 * - 404 handling — unknown route aur resource-not-found ko useful fallback do.
 * - URL encoding — user values encode karo; raw text ko path/query mein concatenate mat karo.
 */

'use strict';
// 1. REACT ROUTER V6 SETUP — createBrowserRouter + RouterProvider
// 2. <Link> VS <a> TAG — WHY ANCHOR TAGS BREAK SPAs
// 3. NESTED ROUTES & THE <Outlet /> PATTERN
// 4. DYNAMIC ROUTES & useParams
// 5. useSearchParams — URL QUERY STATE
// 6. useNavigate — PROGRAMMATIC NAVIGATION
// 7. PROTECTED / PRIVATE ROUTES
// 8. ERROR HANDLING WITH errorElement & useRouteError
// 9. ROUTE-BASED CODE SPLITTING (LAZY LOADING ROUTES)
// SIMULATION: Simple Client-Side Router

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
