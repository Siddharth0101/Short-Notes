'use strict';

/**
 * ========================================================================
 * 08. CONFIG-DRIVEN UI, PROPS & CONDITIONAL RENDERING [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 4, 5)
 *
 * WHAT IS CONFIG-DRIVEN UI?
 * - The UI is NOT hardcoded in the frontend code.
 * - A backend API sends a JSON configuration that TELLS the frontend:
 *   "Show carousel here, show grid there, show offers banner on top."
 * - The same app can look COMPLETELY DIFFERENT for different users, cities,
 *   or countries — all controlled by the backend config!
 *
 * REAL-WORLD EXAMPLES:
 * - Swiggy: Different restaurant layouts, offers, and carousels per city.
 * - Flipkart: Different homepage layouts for Delhi vs Mumbai during sales.
 * - Netflix: Different row categories per user (personalized recommendations).
 * - Uber: Different ride options per location (auto-rickshaw in India, not in USA).
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │              CONFIG-DRIVEN UI ARCHITECTURE                          │
 * │                                                                     │
 * │   ┌──────────┐     ┌──────────────────┐     ┌──────────────────┐   │
 * │   │ Backend  │────►│  JSON Config API  │────►│  React Frontend  │  │
 * │   │ (per city│     │ {                 │     │  Maps config to  │  │
 * │   │  per user│     │   layout: "grid", │     │  components      │  │
 * │   │  per A/B)│     │   cards: [...],   │     │  dynamically     │  │
 * │   │          │     │   offers: [...]   │     │                  │  │
 * │   └──────────┘     │ }                 │     └──────────────────┘  │
 * │                     └──────────────────┘                           │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. PROPS — THE FUNDAMENTAL DATA FLOW IN REACT
// ========================================================================

/**
 * WHAT ARE PROPS?
 * - Props (short for "properties") are the mechanism for passing data
 *   from a PARENT component to a CHILD component.
 * - Props are READ-ONLY. A child can NEVER modify its own props.
 * - Props flow ONE-WAY: Parent → Child (Unidirectional data flow).
 *
 * HOW REACT DELIVERS PROPS:
 * When you write:
 *   <RestaurantCard name="KFC" rating={4.5} cuisine="Chicken" />
 *
 * React internally calls:
 *   RestaurantCard({ name: "KFC", rating: 4.5, cuisine: "Chicken" })
 *
 * The component receives ONE OBJECT containing all props.
 *
 * DESTRUCTURING PROPS (BEST PRACTICE):
 * ```jsx
 * // ❌ Without destructuring (verbose):
 * function RestaurantCard(props) {
 *   return <h2>{props.name} — {props.rating}</h2>;
 * }
 *
 * // ✅ With destructuring (clean):
 * function RestaurantCard({ name, rating, cuisine }) {
 *   return <h2>{name} — {rating} — {cuisine}</h2>;
 * }
 *
 * // ✅ Nested destructuring for complex data:
 * function RestaurantCard({ info: { name, avgRating, cloudinaryImageId, costForTwo } }) {
 *   return (
 *     <div>
 *       <h3>{name}</h3>
 *       <p>Rating: {avgRating} ⭐</p>
 *       <p>{costForTwo}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * PASSING FUNCTIONS AS PROPS:
 * ```jsx
 * function Parent() {
 *   const [count, setCount] = useState(0);
 *   return <Child onIncrement={() => setCount(c => c + 1)} count={count} />;
 * }
 *
 * function Child({ onIncrement, count }) {
 *   return <button onClick={onIncrement}>Count: {count}</button>;
 * }
 * ```
 */


// ========================================================================
// 2. CONFIG-DRIVEN UI PATTERN (SWIGGY / FLIPKART STYLE)
// ========================================================================

/**
 * HOW IT WORKS:
 *
 * Step 1: Backend sends a JSON config based on user's city/device/A-B group:
 * ```json
 * {
 *   "layout": "grid",
 *   "sections": [
 *     {
 *       "type": "carousel",
 *       "data": {
 *         "title": "Today's Offers",
 *         "items": [{ "image": "offer1.jpg" }, { "image": "offer2.jpg" }]
 *       }
 *     },
 *     {
 *       "type": "restaurantGrid",
 *       "data": {
 *         "title": "Top Restaurants Near You",
 *         "restaurants": [
 *           { "id": 1, "name": "KFC", "rating": 4.2, "cuisines": ["Chicken", "Burger"] },
 *           { "id": 2, "name": "Dominos", "rating": 4.5, "cuisines": ["Pizza"] }
 *         ]
 *       }
 *     },
 *     {
 *       "type": "banner",
 *       "data": { "text": "Free delivery on orders above ₹199", "bgColor": "#FF6B00" }
 *     }
 *   ]
 * }
 * ```
 *
 * Step 2: React frontend maps config to components:
 * ```jsx
 * const componentMap = {
 *   carousel: CarouselSection,
 *   restaurantGrid: RestaurantGridSection,
 *   banner: BannerSection,
 *   categoryScroller: CategoryScrollerSection,
 * };
 *
 * function HomePage({ config }) {
 *   return (
 *     <div>
 *       {config.sections.map((section, index) => {
 *         const Component = componentMap[section.type];
 *         if (!Component) return null;   // Skip unknown section types
 *         return <Component key={index} data={section.data} />;
 *       })}
 *     </div>
 *   );
 * }
 * ```
 *
 * BENEFITS:
 * 1. No frontend deployment needed to change UI layout.
 * 2. A/B test different layouts by sending different configs.
 * 3. City-specific customization (Bangalore vs Delhi different offers).
 * 4. Easy feature rollouts (enable new section for 10% of users).
 */


// ========================================================================
// 3. CONDITIONAL RENDERING PATTERNS
// ========================================================================

/**
 * 5 WAYS TO CONDITIONALLY RENDER IN REACT:
 *
 * 1. IF-ELSE (Early return):
 * ```jsx
 * function Greeting({ isLoggedIn }) {
 *   if (!isLoggedIn) return <LoginButton />;
 *   return <Dashboard />;
 * }
 * ```
 *
 * 2. TERNARY OPERATOR (Inline):
 * ```jsx
 * {isLoggedIn ? <Dashboard /> : <LoginButton />}
 * ```
 *
 * 3. LOGICAL AND (Show or nothing):
 * ```jsx
 * {hasError && <ErrorBanner message={errorMsg} />}
 * {cartItems.length > 0 && <CartBadge count={cartItems.length} />}
 * ```
 * ⚠️ TRAP: `{count && <Badge />}` — If count is 0, React renders "0" on screen!
 *    FIX: Use `{count > 0 && <Badge />}` instead.
 *
 * 4. SWITCH/CASE (Multiple conditions):
 * ```jsx
 * function StatusIcon({ status }) {
 *   switch (status) {
 *     case 'loading': return <Spinner />;
 *     case 'error':   return <ErrorIcon />;
 *     case 'success': return <CheckIcon />;
 *     default:        return null;
 *   }
 * }
 * ```
 *
 * 5. NULLISH RENDERING (Hide component):
 * ```jsx
 * function Tooltip({ show, text }) {
 *   if (!show) return null;    // React renders nothing
 *   return <div className="tooltip">{text}</div>;
 * }
 * ```
 */


// ========================================================================
// 4. LISTS, KEYS & WHY UNIQUE KEYS MATTER
// ========================================================================

/**
 * RENDERING LISTS:
 * ```jsx
 * function RestaurantList({ restaurants }) {
 *   return (
 *     <div className="restaurant-grid">
 *       {restaurants.map((restaurant) => (
 *         <RestaurantCard key={restaurant.id} info={restaurant} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * WHY KEYS?
 * - React uses keys to identify which items have changed, been added, or removed.
 * - Without keys, React has to re-render the ENTIRE list from scratch.
 * - With unique keys, React can efficiently diff and update only changed items.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     KEY USAGE RULES TABLE                           │
 * ├─────────────────────┬───────────┬───────────────────────────────────┤
 * │ Key Type            │ Safe?     │ Reason                            │
 * ├─────────────────────┼───────────┼───────────────────────────────────┤
 * │ Database ID (res.id)│ ✅ BEST   │ Unique, stable across re-renders  │
 * │ UUID / Nanoid       │ ✅ Good   │ Unique, but generates new each    │
 * │                     │           │ render if not stored!              │
 * │ Array Index         │ ⚠️ Risky  │ Breaks on sort, filter, prepend!  │
 * │ Math.random()       │ ❌ NEVER  │ New key = component destroyed!    │
 * │ No key at all       │ ❌ NEVER  │ React throws warning, bad perf    │
 * └─────────────────────┴───────────┴───────────────────────────────────┘
 *
 * INDEX AS KEY DISASTER SCENARIO:
 * Original: [{id: 1, name: "KFC"}, {id: 2, name: "Dominos"}]
 * Keys:     [0, 1]
 *
 * After prepending new item:
 * [{id: 3, name: "Pizza Hut"}, {id: 1, name: "KFC"}, {id: 2, name: "Dominos"}]
 * Keys: [0, 1, 2]
 *
 * React thinks:
 * - Key 0 changed from "KFC" to "Pizza Hut" → Re-render KFC card!
 * - Key 1 changed from "Dominos" to "KFC" → Re-render Dominos card!
 * - Key 2 is new "Dominos" → Create new card.
 *
 * Result: All 3 cards re-rendered instead of just inserting 1. State corruption possible!
 */


// ========================================================================
// 5. SHIMMER UI — LOADING STATE PATTERN
// ========================================================================

/**
 * SHIMMER UI (SKELETON SCREENS):
 * - Instead of showing a spinner/loader, show a placeholder layout
 *   that MATCHES the shape of the actual content.
 * - Users perceive the page as loading FASTER (psychological effect).
 *
 * IMPLEMENTATION PATTERN:
 * ```jsx
 * function RestaurantList() {
 *   const [restaurants, setRestaurants] = useState([]);
 *   const [isLoading, setIsLoading] = useState(true);
 *
 *   useEffect(() => {
 *     fetchRestaurants().then(data => {
 *       setRestaurants(data);
 *       setIsLoading(false);
 *     });
 *   }, []);
 *
 *   if (isLoading) {
 *     return <ShimmerUI />;     // Renders 8-12 gray placeholder cards
 *   }
 *
 *   return (
 *     <div className="grid">
 *       {restaurants.map(r => <RestaurantCard key={r.id} info={r} />)}
 *     </div>
 *   );
 * }
 * ```
 *
 * CSS SHIMMER ANIMATION:
 * ```css
 * .shimmer-card {
 *   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
 *   background-size: 200% 100%;
 *   animation: shimmer 1.5s infinite;
 * }
 *
 * @keyframes shimmer {
 *   0%   { background-position: -200% 0; }
 *   100% { background-position: 200% 0; }
 * }
 * ```
 *
 * WHO USES SHIMMER UI?
 * - Facebook, LinkedIn, YouTube, Swiggy, Zomato, Instagram.
 */


// ========================================================================
// 6. OPTIONAL CHAINING & NULLISH COALESCING IN PROPS
// ========================================================================

/**
 * When dealing with API data that might be undefined or null:
 *
 * ```jsx
 * // ❌ CRASHES if restaurant or info is undefined:
 * <h2>{restaurant.info.name}</h2>
 *
 * // ✅ SAFE with optional chaining:
 * <h2>{restaurant?.info?.name ?? 'Unknown Restaurant'}</h2>
 *
 * // ✅ Default props with destructuring:
 * function RestaurantCard({ name = 'N/A', rating = 0, cuisines = [] }) {
 *   return (
 *     <div>
 *       <h3>{name}</h3>
 *       <p>{rating} ⭐ | {cuisines.join(', ') || 'Multi-Cuisine'}</p>
 *     </div>
 *   );
 * }
 * ```
 */


// ========================================================================
// SIMULATION: Config-Driven UI Renderer
// ========================================================================

const API_CONFIG = {
  city: 'Bangalore',
  layout: 'grid',
  sections: [
    {
      type: 'carousel',
      data: { title: 'Best Offers 🔥', items: ['50% OFF on Dominos', 'Free Delivery on KFC', 'Buy 1 Get 1 Pizza'] }
    },
    {
      type: 'restaurantGrid',
      data: {
        title: 'Top Restaurants Near You',
        restaurants: [
          { id: 101, name: 'Meghana Foods', rating: 4.6, costForTwo: '₹300', cuisines: ['Biryani', 'Chinese'] },
          { id: 102, name: 'KFC', rating: 4.2, costForTwo: '₹400', cuisines: ['Chicken', 'Burger'] },
          { id: 103, name: 'Pizza Hut', rating: 4.0, costForTwo: '₹350', cuisines: ['Pizza', 'Italian'] }
        ]
      }
    },
    {
      type: 'banner',
      data: { text: '🎉 Free delivery on orders above ₹199', bgColor: '#FF6B00' }
    }
  ]
};

// Component renderers
const SECTION_RENDERERS = {
  carousel: (data) => {
    console.log(`  📸 [Carousel] "${data.title}" — ${data.items.length} slides`);
    data.items.forEach((item, i) => console.log(`     Slide ${i + 1}: ${item}`));
  },
  restaurantGrid: (data) => {
    console.log(`  🍽️  [Grid] "${data.title}" — ${data.restaurants.length} restaurants`);
    data.restaurants.forEach((r) => {
      console.log(`     ${r.name} | ${r.rating}⭐ | ${r.costForTwo} | ${r.cuisines.join(', ')}`);
    });
  },
  banner: (data) => {
    console.log(`  📢 [Banner] ${data.text} (bg: ${data.bgColor})`);
  }
};

// Render config-driven UI
console.log('--- Config-Driven UI Rendering Simulation ---');
console.log(`City: ${API_CONFIG.city} | Layout: ${API_CONFIG.layout}\n`);

API_CONFIG.sections.forEach((section) => {
  const renderer = SECTION_RENDERERS[section.type];
  if (renderer) {
    renderer(section.data);
  } else {
    console.log(`  ⚠️ Unknown section type: "${section.type}" — skipped`);
  }
  console.log('');
});

// Key comparison demonstration
console.log('--- Key Assignment Comparison ---');
const items = ['Apple', 'Banana', 'Cherry'];
console.log('✅ Stable keys (database IDs):', items.map((item, i) => ({ key: `fruit_${i + 100}`, value: item })));
console.log('⚠️ Index keys (fragile):', items.map((item, i) => ({ key: i, value: item })));
