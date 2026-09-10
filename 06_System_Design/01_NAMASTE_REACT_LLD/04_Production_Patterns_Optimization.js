'use strict';

/**
 * ========================================================================
 * 04. PRODUCTION PATTERNS & CODE SPLITTING OPTIMIZATIONS [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 9 to 11)
 *
 * GOAL:
 * - Scalable production React patterns that prevent bloat, improve Core Web Vitals,
 *   and adhere to SOLID principles.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                   PRODUCTION CHUNKING & LAZY LOADING                │
 * │                                                                     │
 * │  Single Monolith Bundle (BAD)   ──► 6 MB JS on initial load!        │
 * │                                      Slow TTFB, high bounce rate.   │
 * │                                                                     │
 * │  Chunked On-Demand (GOOD)       ──► Core App: 120 KB                │
 * │                                     Cart Feature: 40 KB (on click)  │
 * │                                     Grocery Module: 180 KB (lazy)   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. CUSTOM HOOKS & SINGLE RESPONSIBILITY PRINCIPLE (EP 9)
 * ========================================================================
 * - A custom hook is simply a JavaScript utility function whose name starts
 *   with 'use' and which can call other React hooks.
 * - Decouples Business/Data logic from UI/Presentation layer.
 *
 * Example: useOnlineStatus
 * - Detects navigator.onLine changes.
 * - Shows an offline banner if user internet disconnects.
 */

// Simulated custom hook logic
function createUseOnlineStatusSimulator() {
  let isOnline = true;
  const listeners = [];

  return {
    getSnapshot: () => isOnline,
    setNetworkStatus: (status) => {
      isOnline = status;
      listeners.forEach((fn) => fn(isOnline));
    },
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const idx = listeners.indexOf(listener);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    }
  };
}

const networkTracker = createUseOnlineStatusSimulator();
const unsubscribe = networkTracker.subscribe((status) => {
  console.log(`[Network Event] Online Status Changed: ${status ? '🟢 CONNECTED' : '🔴 OFFLINE'}`);
});

console.log('--- Custom Hook Simulation ---');
console.log('Current status:', networkTracker.getSnapshot());
networkTracker.setNetworkStatus(false);
networkTracker.setNetworkStatus(true);
unsubscribe();

/**
 * ========================================================================
 * 2. CHUNKING / CODE SPLITTING / LAZY LOADING (EP 10)
 * ========================================================================
 * Other Names:
 * - Dynamic Bundling
 * - Code Splitting
 * - Chunking
 * - On-Demand Loading
 *
 * HOW TO IMPLEMENT IN REACT:
 * ```javascript
 * import { lazy, Suspense } from 'react';
 *
 * // Bundler creates a separate JS chunk (e.g. Grocery.chunk.js)
 * const Grocery = lazy(() => import('./components/Grocery'));
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route
 *         path="/grocery"
 *         element={
 *           <Suspense fallback={<ShimmerUI />}>
 *             <Grocery />
 *           </Suspense>
 *         }
 *       />
 *     </Routes>
 *   );
 * }
 * ```
 * ⚠️ GOTCHA: If you use React.lazy WITHOUT <Suspense>, React throws a runtime
 * error because rendering suspends while the JS bundle is in transit over the network!
 */

/**
 * ========================================================================
 * 3. HIGHER ORDER COMPONENTS (HOC) — EP 11
 * ========================================================================
 * - An HOC is a pure function that takes an existing component and returns
 *   an enhanced component with extra props or UI wrappers.
 * - Pattern: Input Component ──► Enhance ──► Output Component.
 * - Does NOT modify original component; wraps it cleanly.
 */

// HOC pattern simulation in plain JS
function withPromotedBadge(CardComponent) {
  return function PromotedCard(props) {
    return {
      type: 'div',
      badge: '🔥 BESTSELLER',
      original: CardComponent(props)
    };
  };
}

function BaseRestaurantCard(props) {
  return {
    name: props.name,
    rating: props.rating,
    cuisine: props.cuisine
  };
}

const PromotedRestaurantCard = withPromotedBadge(BaseRestaurantCard);
const renderedCard = PromotedRestaurantCard({ name: 'Meghana Foods', rating: 4.6, cuisine: 'Biryani' });

console.log('--- Higher Order Component Output ---');
console.log(renderedCard);

/**
 * ========================================================================
 * 4. CONTROLLED VS UNCONTROLLED COMPONENTS & LIFTING STATE UP
 * ========================================================================
 * - Controlled Component:
 *   - The component's state is controlled entirely by its parent via props.
 *   - Example: AccordionItem receives `isOpen={activeIndex === index}` and `onToggle={() => setActiveIndex(index)}`.
 *
 * - Uncontrolled Component:
 *   - The component maintains its own local state (e.g. `const [isOpen, setIsOpen] = useState(false)`).
 *   - The parent has NO control over whether it opens or closes.
 *
 * - Lifting State Up:
 *   - Moving state from sibling components up to their common parent so siblings
 *     stay in sync (e.g., only one accordion tab open at a time).
 */
