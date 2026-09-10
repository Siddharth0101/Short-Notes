'use strict';

/**
 * ========================================================================
 * 09. CONFIG-DRIVEN UI & SCHEMA-DRIVEN ARCHITECTURE [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Chakde System Design) + Namaste Frontend System Design
 *
 * WHAT IS CONFIG-DRIVEN UI?
 * - The backend API controls WHAT the frontend renders and HOW.
 * - The frontend becomes a "rendering engine" — it doesn't decide layout,
 *   the server-sent JSON configuration does.
 * - Used at massive scale by: Swiggy, Uber, Airbnb, Netflix, Spotify.
 *
 * WHY?
 * 1. No frontend deployment needed to change UI.
 * 2. A/B testing different layouts without code changes.
 * 3. City/Country specific customization from one codebase.
 * 4. Feature rollouts to % of users via feature flags.
 * 5. Marketing team can change banner/promo without engineering.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │           CONFIG-DRIVEN UI ARCHITECTURE FLOW                       │
 * │                                                                     │
 * │   ┌─────────────┐    ┌───────────────┐    ┌──────────────────┐     │
 * │   │ CMS / Admin │───►│  Backend API  │───►│  React Frontend  │    │
 * │   │ Dashboard   │    │  (per city,   │    │  Component       │    │
 * │   │             │    │   per user,   │    │  Registry +      │    │
 * │   │             │    │   per A/B)    │    │  Dynamic Render  │    │
 * │   └─────────────┘    └───────────────┘    └──────────────────┘    │
 * │                                                                     │
 * │   Config decides:                                                   │
 * │   - Which sections appear (carousel, grid, banner)                  │
 * │   - Section order (carousel first in Delhi, grid first in Mumbai)   │
 * │   - Section data (different restaurants, different offers)           │
 * │   - Section styling (card size, number of columns)                  │
 * │   - Feature flags (show payment option X for 10% of users)          │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. REAL-WORLD CONFIG API RESPONSE (SWIGGY-STYLE)
// ========================================================================

/**
 * ```json
 * {
 *   "statusCode": 200,
 *   "data": {
 *     "pageType": "HOME",
 *     "cards": [
 *       {
 *         "cardType": "carousel",
 *         "header": { "title": "What's on your mind?" },
 *         "imageGridCards": {
 *           "info": [
 *             { "id": "750", "imageId": "biryani_icon.png", "link": "/category/biryani" },
 *             { "id": "751", "imageId": "pizza_icon.png", "link": "/category/pizza" }
 *           ]
 *         }
 *       },
 *       {
 *         "cardType": "restaurantGrid",
 *         "header": { "title": "Top restaurant chains in Bangalore" },
 *         "gridElements": {
 *           "restaurants": [
 *             {
 *               "id": "65797",
 *               "name": "Meghana Foods",
 *               "cloudinaryImageId": "abc123",
 *               "avgRating": 4.6,
 *               "costForTwo": "₹300 for two",
 *               "cuisines": ["Biryani", "North Indian"],
 *               "deliveryTime": "25 min",
 *               "promoted": true
 *             }
 *           ]
 *         }
 *       },
 *       {
 *         "cardType": "offerBanner",
 *         "data": {
 *           "text": "60% OFF up to ₹120",
 *           "couponCode": "WELCOME60",
 *           "bgColor": "#FF5722",
 *           "expiresAt": "2026-12-31"
 *         }
 *       }
 *     ]
 *   }
 * }
 * ```
 */


// ========================================================================
// 2. COMPONENT REGISTRY PATTERN
// ========================================================================

/**
 * The frontend maintains a MAP of cardType → React Component.
 * When the config arrives, it loops through cards and renders dynamically.
 *
 * ```jsx
 * import CarouselSection from './sections/CarouselSection';
 * import RestaurantGrid from './sections/RestaurantGrid';
 * import OfferBanner from './sections/OfferBanner';
 * import BrandBanner from './sections/BrandBanner';
 * import CategoryScroller from './sections/CategoryScroller';
 *
 * // Component Registry — maps config cardType to React components
 * const COMPONENT_REGISTRY = {
 *   carousel: CarouselSection,
 *   restaurantGrid: RestaurantGrid,
 *   offerBanner: OfferBanner,
 *   brandBanner: BrandBanner,
 *   categoryScroller: CategoryScroller,
 * };
 *
 * function ConfigDrivenPage({ apiConfig }) {
 *   return (
 *     <div className="page-container">
 *       {apiConfig.cards.map((card, index) => {
 *         const Component = COMPONENT_REGISTRY[card.cardType];
 *
 *         if (!Component) {
 *           // Unknown card type — skip gracefully (forward compatibility!)
 *           console.warn(`Unknown cardType: "${card.cardType}" — skipping`);
 *           return null;
 *         }
 *
 *         return <Component key={`${card.cardType}-${index}`} config={card} />;
 *       })}
 *     </div>
 *   );
 * }
 * ```
 *
 * FORWARD COMPATIBILITY:
 * - When backend adds a NEW cardType (e.g., "videoReels"), old frontends
 *   simply skip it without crashing. Zero downtime!
 * - New frontend version adds "videoReels" to the registry → works automatically.
 */


// ========================================================================
// 3. SCHEMA-DRIVEN FORMS (JSON Schema → React Form)
// ========================================================================

/**
 * USE CASE: Admin panels, CMS, dynamic settings pages, surveys.
 * Instead of hardcoding every form, define forms as JSON schema.
 *
 * ```json
 * {
 *   "formId": "user-profile",
 *   "title": "Edit Profile",
 *   "fields": [
 *     {
 *       "name": "fullName",
 *       "type": "text",
 *       "label": "Full Name",
 *       "required": true,
 *       "placeholder": "Enter your name",
 *       "validation": { "minLength": 2, "maxLength": 50 }
 *     },
 *     {
 *       "name": "email",
 *       "type": "email",
 *       "label": "Email Address",
 *       "required": true,
 *       "validation": { "pattern": "^[^@]+@[^@]+\\.[^@]+$" }
 *     },
 *     {
 *       "name": "role",
 *       "type": "select",
 *       "label": "Role",
 *       "options": [
 *         { "value": "admin", "label": "Admin" },
 *         { "value": "editor", "label": "Editor" },
 *         { "value": "viewer", "label": "Viewer" }
 *       ]
 *     },
 *     {
 *       "name": "bio",
 *       "type": "textarea",
 *       "label": "Bio",
 *       "rows": 4,
 *       "validation": { "maxLength": 500 }
 *     },
 *     {
 *       "name": "notifications",
 *       "type": "checkbox",
 *       "label": "Enable email notifications"
 *     }
 *   ],
 *   "submitAction": { "method": "PUT", "url": "/api/users/:id/profile" }
 * }
 * ```
 *
 * FORM RENDERER:
 * ```jsx
 * const FIELD_COMPONENTS = {
 *   text: TextInput,
 *   email: EmailInput,
 *   select: SelectDropdown,
 *   textarea: TextArea,
 *   checkbox: Checkbox,
 *   radio: RadioGroup,
 *   date: DatePicker,
 *   file: FileUpload,
 * };
 *
 * function SchemaForm({ schema }) {
 *   const [formData, setFormData] = useState({});
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <h2>{schema.title}</h2>
 *       {schema.fields.map((field) => {
 *         const FieldComponent = FIELD_COMPONENTS[field.type];
 *         if (!FieldComponent) return null;
 *         return (
 *           <FieldComponent
 *             key={field.name}
 *             config={field}
 *             value={formData[field.name] || ''}
 *             onChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}
 *           />
 *         );
 *       })}
 *       <button type="submit">Save</button>
 *     </form>
 *   );
 * }
 * ```
 */


// ========================================================================
// 4. FEATURE FLAGS & A/B TESTING
// ========================================================================

/**
 * FEATURE FLAGS:
 * - Boolean toggles controlled from server that enable/disable features.
 * - Used for gradual rollouts, kill switches, and A/B experiments.
 *
 * HOW IT WORKS:
 * ```json
 * // Backend returns user's feature flags:
 * {
 *   "features": {
 *     "newCheckoutFlow": true,        // 10% rollout, this user is in
 *     "darkModeToggle": true,         // Fully rolled out
 *     "aiRecommendations": false,     // Not yet enabled for this user
 *     "videoReviews": false           // Kill switch OFF after bug found
 *   }
 * }
 * ```
 *
 * ```jsx
 * import { useFeatureFlag } from './hooks/useFeatureFlag';
 *
 * function CheckoutPage() {
 *   const showNewCheckout = useFeatureFlag('newCheckoutFlow');
 *
 *   return showNewCheckout
 *     ? <NewCheckoutFlow />
 *     : <LegacyCheckoutFlow />;
 * }
 * ```
 *
 * A/B TESTING INTEGRATION:
 * - Feature flag service sends variant info: { variant: 'A' | 'B' | 'control' }
 * - Frontend renders different UI based on variant
 * - Analytics tracks conversion rates per variant
 * - Winner is rolled out to 100%
 *
 * POPULAR FEATURE FLAG SERVICES:
 * ┌──────────────────┬───────────────────────────────────────────────┐
 * │ Service          │ Key Feature                                   │
 * ├──────────────────┼───────────────────────────────────────────────┤
 * │ LaunchDarkly     │ Enterprise, real-time flag updates via SSE    │
 * │ Unleash (OSS)    │ Self-hosted, open source                     │
 * │ Split.io         │ A/B testing focused + feature flags           │
 * │ Flagsmith (OSS)  │ Open source, REST + SDK, feature analytics    │
 * │ Firebase Remote  │ Google ecosystem, mobile + web                │
 * │ Statsig          │ Data-driven, auto-analysis of experiments     │
 * └──────────────────┴───────────────────────────────────────────────┘
 */


// ========================================================================
// 5. DYNAMIC COMPONENT LOADING FROM CONFIG
// ========================================================================

/**
 * ADVANCED: Load components LAZILY based on config (code splitting per section).
 *
 * ```jsx
 * const LAZY_REGISTRY = {
 *   carousel: lazy(() => import('./sections/CarouselSection')),
 *   restaurantGrid: lazy(() => import('./sections/RestaurantGrid')),
 *   offerBanner: lazy(() => import('./sections/OfferBanner')),
 *   videoReels: lazy(() => import('./sections/VideoReels')),
 * };
 *
 * function ConfigDrivenPage({ apiConfig }) {
 *   return (
 *     <div>
 *       {apiConfig.cards.map((card, index) => {
 *         const LazyComponent = LAZY_REGISTRY[card.cardType];
 *         if (!LazyComponent) return null;
 *
 *         return (
 *           <Suspense key={index} fallback={<SectionSkeleton type={card.cardType} />}>
 *             <LazyComponent config={card} />
 *           </Suspense>
 *         );
 *       })}
 *     </div>
 *   );
 * }
 * ```
 *
 * BENEFIT: If user never scrolls to "videoReels" section,
 * that component's JavaScript bundle is NEVER downloaded!
 */


// ========================================================================
// 6. VERSIONING & BACKWARD COMPATIBILITY
// ========================================================================

/**
 * CONFIG VERSIONING STRATEGIES:
 *
 * 1. Version field in config:
 *    { "version": "2.1", "cards": [...] }
 *    Frontend checks version and maps to correct renderer.
 *
 * 2. Graceful fallback for unknown fields:
 *    - Always use optional chaining: card?.newField?.value
 *    - Skip unknown cardTypes (don't crash!)
 *    - Default values for missing fields
 *
 * 3. Backend sends config compatible with oldest active frontend:
 *    - Frontend v3 handles cardTypes A, B, C, D
 *    - Frontend v2 handles cardTypes A, B, C
 *    - Backend sends all 4; v2 skips D gracefully
 *
 * ANTI-PATTERN:
 * ❌ Frontend v2 crashes when it sees unknown cardType "D"
 * ✅ Frontend v2 logs warning and renders remaining known types
 */


// ========================================================================
// SIMULATION: Config-Driven UI Engine
// ========================================================================

// Simulate API config response for different cities
const CITY_CONFIGS = {
  bangalore: {
    pageType: 'HOME',
    cards: [
      { cardType: 'carousel', data: { title: "What's on your mind?", items: ['Biryani', 'Pizza', 'Dosa', 'Chinese'] } },
      { cardType: 'offerBanner', data: { text: '60% OFF | Code: WELCOME60', bgColor: '#FF5722' } },
      { cardType: 'restaurantGrid', data: { title: 'Top Chains in Bangalore', restaurants: ['Meghana Foods', 'KFC', 'Pizza Hut'] } },
    ],
  },
  delhi: {
    pageType: 'HOME',
    cards: [
      { cardType: 'offerBanner', data: { text: 'Free Delivery on first 3 orders!', bgColor: '#4CAF50' } },
      { cardType: 'restaurantGrid', data: { title: 'Popular in Delhi NCR', restaurants: ['Haldiram', 'Bikanervala', 'Dominos'] } },
      { cardType: 'carousel', data: { title: 'Cuisines near you', items: ['Chole Bhature', 'Butter Chicken', 'Paratha'] } },
      { cardType: 'videoReels', data: { title: 'Food Reels' } }, // New type — old frontends skip this
    ],
  },
};

// Component registry
const RENDERER_REGISTRY = {
  carousel: (data) => console.log(`  📸 [Carousel] ${data.title}: ${data.items.join(' | ')}`),
  offerBanner: (data) => console.log(`  🏷️  [Offer] ${data.text} (bg: ${data.bgColor})`),
  restaurantGrid: (data) => console.log(`  🍽️  [Grid] ${data.title}: ${data.restaurants.join(', ')}`),
  // videoReels is NOT in registry — simulates old frontend version
};

function renderConfigDrivenPage(city) {
  const config = CITY_CONFIGS[city];
  if (!config) { console.log(`  ❌ No config for city: ${city}`); return; }

  console.log(`\n  📍 Rendering ${city.toUpperCase()} homepage (${config.cards.length} sections):`);
  config.cards.forEach((card) => {
    const renderer = RENDERER_REGISTRY[card.cardType];
    if (renderer) {
      renderer(card.data);
    } else {
      console.log(`  ⚠️  [Unknown] cardType "${card.cardType}" — skipped (forward compatibility)`);
    }
  });
}

console.log('--- Config-Driven UI Engine Simulation ---');
renderConfigDrivenPage('bangalore');
renderConfigDrivenPage('delhi');

// Feature flag simulation
console.log('\n--- Feature Flag Simulation ---');
const USER_FLAGS = {
  newCheckoutFlow: true,
  darkModeToggle: true,
  aiRecommendations: false,
  videoReviews: false,
};

Object.entries(USER_FLAGS).forEach(([flag, enabled]) => {
  console.log(`  ${enabled ? '✅' : '❌'} ${flag}: ${enabled ? 'ENABLED' : 'DISABLED'}`);
});

// Schema-driven form field rendering
console.log('\n--- Schema-Driven Form Rendering ---');
const formSchema = [
  { name: 'fullName', type: 'text', label: 'Full Name', required: true },
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'role', type: 'select', label: 'Role', options: ['Admin', 'Editor', 'Viewer'] },
  { name: 'bio', type: 'textarea', label: 'Bio', required: false },
  { name: 'notifications', type: 'checkbox', label: 'Enable notifications' },
];

formSchema.forEach((field) => {
  const requiredMarker = field.required ? ' *' : '';
  console.log(`  <${field.type}> ${field.label}${requiredMarker}`);
});
