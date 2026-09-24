/**
 * ## Quick revision
 *
 * - Catalog — cache-friendly reads; checkout fresh authoritative validation maangta hai.
 * - Cart — user intent; price/stock guarantee nahi.
 * - Order identity — order, reservation, payment aur webhook IDs alag rakho.
 * - Reserve — atomic stock claim with expiry.
 * - Pay — provider idempotency key; unknown outcome par status reconcile.
 * - Webhook — signature + durable dedupe + state transition.
 * - Late payment — expired reservation par refund/re-reserve policy explicit rakho.
 * - Outbox — order change aur notification/event durable saath record.
 * - UI — pending/confirmed/failed state; browser redirect ko payment proof mat maano.
 * - Price snapshot — order mein accepted price/currency/version record; later catalog change old order na badle.
 * - Refund workflow — duplicate refund request ki identity aur reconciliation.
 * - Inventory release — failed/expired order ka stock once release; retry double increment na kare.
 */

'use strict';
// 1. PRODUCT LISTING PAGE (PLP) ARCHITECTURE
// 2. FACETED SEARCH & FILTER ARCHITECTURE


function buildFilterQueryString(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== null && value !== undefined && value !== '') {
      params.set(key, value);
    }
  });

  return params.toString();
}
// 3. SORTING STRATEGIES
// 4. PRODUCT DETAIL PAGE (PDP) ARCHITECTURE
// 5. CART ARCHITECTURE (OPTIMISTIC UPDATES)
// 6. SEO STRATEGY FOR E-COMMERCE
// 7. API CONTRACTS
// SIMULATION

// Filter query builder simulation
console.log('--- E-Commerce Filter Query Builder ---');
const filters = {
  category: 'phones',
  brand: ['apple', 'samsung'],
  minPrice: 500,
  maxPrice: 1500,
  rating: 4,
  sort: 'price_asc',
  page: 2,
};
const queryString = buildFilterQueryString(filters);
console.log('URL: /api/products?' + queryString);

// Cart optimistic update simulation
console.log('\n--- Cart Optimistic Update Flow ---');
const cart = { items: [], total: 0 };

function addToCartOptimistic(product) {
  // Step 1: Optimistic update (immediate)
  cart.items.push({ ...product, status: 'PENDING' });
  cart.total += product.price;
  console.log(`  [Optimistic] Added "${product.name}" — Cart total: ₹${cart.total} (${cart.items.length} items)`);

  // Step 2: Simulate API call
  const apiSuccess = Math.random() > 0.3; // 70% success rate
  if (apiSuccess) {
    const item = cart.items.find((i) => i.id === product.id);
    if (item) item.status = 'CONFIRMED';
    console.log(`  [Server] ✅ Confirmed "${product.name}" in cart`);
  } else {
    // Step 3: Revert on failure
    cart.items = cart.items.filter((i) => i.id !== product.id);
    cart.total -= product.price;
    console.log(`  [Server] ❌ Failed! Reverted "${product.name}" — Cart total: ₹${cart.total}`);
  }
}

addToCartOptimistic({ id: 1, name: 'iPhone 16 Pro', price: 119900 });
addToCartOptimistic({ id: 2, name: 'AirPods Pro', price: 24900 });

// Rendering strategy decision
console.log('\n--- Page Rendering Strategy ---');
const pages = [
  { page: 'Product Listing', strategy: 'SSR', reason: 'Dynamic filters, SEO needed' },
  { page: 'Product Detail', strategy: 'SSG + ISR', reason: 'Pre-render popular, revalidate hourly' },
  { page: 'Cart', strategy: 'CSR', reason: 'User-specific, no SEO' },
  { page: 'Checkout', strategy: 'CSR', reason: 'Private, no SEO, payment flow' },
  { page: 'Home Page', strategy: 'ISR (5 min)', reason: 'Fresh offers, good SEO' },
];
pages.forEach((p) => console.log(`  ${p.page}: ${p.strategy} — ${p.reason}`));
