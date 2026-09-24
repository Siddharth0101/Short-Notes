/**
 * ## Quick revision
 *
 * - Schema-driven UI — validated config se known components render.
 * - Registry — allowed component type ko implementation se map.
 * - Version — client/server compatibility aur migration/defaults define.
 * - Unknown field/type — ignore/reject/fallback ka explicit policy.
 * - Validation — config data hai; raw scripts/HTML execute mat karo.
 * - Feature flag — rollout control; server authorization ka replacement nahi.
 * - Form schema — field constraints, dependencies aur accessible errors.
 * - State identity — stable config IDs; reorder par user input na kho.
 * - Config fallback — unsupported component par whole page crash ke bajay approved placeholder.
 * - Schema test — config fixtures ko renderer contract ke against validate karo.
 * - Config trust — hidden UI element permission enforcement nahi; server operation authorize kare.
 */

'use strict';
// 1. REAL-WORLD CONFIG API RESPONSE (SWIGGY-STYLE)
// 2. COMPONENT REGISTRY PATTERN
// 3. SCHEMA-DRIVEN FORMS (JSON Schema → React Form)
// 4. FEATURE FLAGS & A/B TESTING
// 5. DYNAMIC COMPONENT LOADING FROM CONFIG
// 6. VERSIONING & BACKWARD COMPATIBILITY
// SIMULATION: Config-Driven UI Engine

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
