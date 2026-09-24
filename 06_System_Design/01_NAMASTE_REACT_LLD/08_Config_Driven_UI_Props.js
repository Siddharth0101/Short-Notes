/**
 * ## Quick revision
 *
 * - Component — props se UI return karne wala function.
 * - JSX — JS mein UI syntax; expressions `{}` ke andar.
 * - Props — parent se input; child mutate nahi karta.
 * - Children — nested content ko composition ke liye pass karo.
 * - Render — pure calculation; network/DOM side effects render mein mat chalao.
 * - Capital name — custom component `<Card />`; lowercase tag native element.
 * - Fragment — extra DOM wrapper bina elements group karo.
 * - Key — siblings ki stable identity; array position se bachna jab list badalti ho.
 * - Render — next UI calculate; commit — DOM updates apply.
 * - Reconciliation — type, position aur key se identity match hoti hai.
 * - Stable key — item ID use karo; random key har render remount kar sakti hai.
 * - State reset — component type/key badalne se local state reset ho sakti hai.
 * - Conditional UI — `0 && <Item />` zero dikha sakta hai.
 * - Strict Mode — development mein extra checks; render/effect ko safe rakho.
 * - Class lifecycle — mount/update/unmount; Hooks mein responsibilities ke hisaab se socho.
 * - Error boundary — descendant render errors ke fallback; har async/event error nahi pakadti.
 * - Config-driven UI — validated data se registered components choose karo.
 * - Unknown type — safe fallback; config se arbitrary code execute mat karo.
 * - Schema — version + defaults; old clients ka compatibility contract rakho.
 * - Config fallback — unsupported component par whole page crash ke bajay approved placeholder.
 * - Schema test — config fixtures ko renderer contract ke against validate karo.
 * - Config trust — hidden UI element permission enforcement nahi; server operation authorize kare.
 */

'use strict';
// 1. PROPS — THE FUNDAMENTAL DATA FLOW IN REACT
// 2. CONFIG-DRIVEN UI PATTERN (SWIGGY / FLIPKART STYLE)
// 3. CONDITIONAL RENDERING PATTERNS
// 4. LISTS, KEYS & WHY UNIQUE KEYS MATTER
// 5. SHIMMER UI — LOADING STATE PATTERN
// 6. OPTIONAL CHAINING & NULLISH COALESCING IN PROPS
// SIMULATION: Config-Driven UI Renderer

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
