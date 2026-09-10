'use strict';

/**
 * ========================================================================
 * CASE STUDY 06: E-COMMERCE PRODUCT PAGE (AMAZON / FLIPKART) [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design) + Interview Case Studies
 *
 * REQUIREMENTS:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  FUNCTIONAL REQUIREMENTS                                           │
 * │  ──────────────────────────                                        │
 * │  - Product Listing Page (PLP): Grid of products with filters       │
 * │  - Product Detail Page (PDP): Full product info, images, reviews   │
 * │  - Search with autocomplete                                        │
 * │  - Filters (category, price range, rating, brand) — faceted search │
 * │  - Sorting (price low-high, rating, newest, popularity)            │
 * │  - Pagination / Infinite scroll                                    │
 * │  - Add to Cart / Add to Wishlist                                   │
 * │  - Image gallery with zoom & carousel                              │
 * │  - Variant selection (size, color)                                  │
 * │                                                                     │
 * │  NON-FUNCTIONAL REQUIREMENTS                                       │
 * │  ──────────────────────────                                        │
 * │  - LCP < 2.5s on product listing page                              │
 * │  - SEO optimized (SSR/SSG for product pages)                       │
 * │  - Responsive (mobile-first grid)                                  │
 * │  - Performance under flash sale traffic (10x burst)                │
 * │  - Accessibility (screen reader for product info)                  │
 * │  - Offline cart persistence                                        │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. PRODUCT LISTING PAGE (PLP) ARCHITECTURE
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                    PLP COMPONENT TREE                               │
 * │                                                                     │
 * │   ┌──────────────────────────────────────────────┐                  │
 * │   │                 ProductListPage               │                 │
 * │   ├──────────┬──────────────────────┬─────────────┤                 │
 * │   │ FilterBar│    ProductGrid       │ SortDropdown│                 │
 * │   │          │ ┌──────┐ ┌──────┐   │             │                 │
 * │   │ Category │ │Card 1│ │Card 2│   │  Relevance  │                 │
 * │   │ Price    │ └──────┘ └──────┘   │  Price ↑↓   │                 │
 * │   │ Rating   │ ┌──────┐ ┌──────┐   │  Rating     │                 │
 * │   │ Brand    │ │Card 3│ │Card 4│   │  Newest     │                 │
 * │   │          │ └──────┘ └──────┘   │             │                 │
 * │   └──────────┴──────────────────────┴─────────────┘                │
 * │                                                                     │
 * │   ┌──────────────────────────────────────────────┐                  │
 * │   │           Pagination / Load More              │                 │
 * │   └──────────────────────────────────────────────┘                  │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * DATA FLOW:
 * 1. URL query params store all filter/sort/page state (shareable, bookmarkable)
 *    /products?category=electronics&brand=apple&sort=price_asc&page=2
 * 2. On filter change → update URL → fetch new data → render grid
 * 3. Use useSearchParams for URL state management
 */


// ========================================================================
// 2. FACETED SEARCH & FILTER ARCHITECTURE
// ========================================================================

/**
 * FACETED SEARCH:
 * - Backend returns available filter options WITH COUNT for each.
 * - Counts update dynamically based on currently applied filters.
 *
 * API: GET /api/products?category=phones&brand=apple&minPrice=500
 * Response:
 * ```json
 * {
 *   "products": [...],
 *   "facets": {
 *     "category": [
 *       { "value": "phones", "count": 45, "selected": true },
 *       { "value": "tablets", "count": 12 },
 *       { "value": "accessories", "count": 89 }
 *     ],
 *     "brand": [
 *       { "value": "apple", "count": 45, "selected": true },
 *       { "value": "samsung", "count": 32 }
 *     ],
 *     "priceRange": [
 *       { "value": "0-500", "count": 5 },
 *       { "value": "500-1000", "count": 28 },
 *       { "value": "1000+", "count": 12 }
 *     ]
 *   },
 *   "totalResults": 45,
 *   "page": 1,
 *   "totalPages": 3
 * }
 * ```
 *
 * FILTER STATE MANAGEMENT:
 * - Store ALL filter state in URL query params (not React state!)
 * - Benefits: Shareable links, browser back/forward works, bookmarkable
 * - Use debounce on price range slider (don't fire API on every drag pixel)
 */

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


// ========================================================================
// 3. SORTING STRATEGIES
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │               SORTING OPTIONS TABLE                                 │
 * ├──────────────────┬────────────────┬─────────────────────────────────┤
 * │ Sort Option      │ API Parameter  │ Backend Implementation          │
 * ├──────────────────┼────────────────┼─────────────────────────────────┤
 * │ Relevance        │ sort=relevance │ Elasticsearch score / ML rank   │
 * │ Price: Low → High│ sort=price_asc │ ORDER BY price ASC              │
 * │ Price: High → Low│ sort=price_desc│ ORDER BY price DESC             │
 * │ Rating           │ sort=rating    │ ORDER BY avg_rating DESC        │
 * │ Newest First     │ sort=newest    │ ORDER BY created_at DESC        │
 * │ Popularity       │ sort=popular   │ ORDER BY view_count DESC        │
 * │ Discount         │ sort=discount  │ ORDER BY discount_pct DESC      │
 * └──────────────────┴────────────────┴─────────────────────────────────┘
 *
 * CLIENT-SIDE vs SERVER-SIDE SORTING:
 * - Server-side: ALWAYS for paginated data (can't sort 10,000 items client-side)
 * - Client-side: Only if ALL data is already loaded (rare, small datasets)
 */


// ========================================================================
// 4. PRODUCT DETAIL PAGE (PDP) ARCHITECTURE
// ========================================================================

/**
 * PDP COMPONENT HIERARCHY:
 * ```
 * ProductDetailPage
 * ├── BreadcrumbNav            (/home > electronics > phones > iPhone 16)
 * ├── ImageGallery
 * │   ├── MainImage            (zoomable on hover/pinch)
 * │   ├── ThumbnailStrip       (click to switch main image)
 * │   └── FullScreenModal      (lightbox on click)
 * ├── ProductInfo
 * │   ├── ProductTitle
 * │   ├── RatingStars + ReviewCount
 * │   ├── Price + Discount
 * │   ├── VariantSelector      (Size, Color dropdowns)
 * │   ├── QuantitySelector
 * │   ├── AddToCartButton      (optimistic, shows loading state)
 * │   ├── AddToWishlistButton
 * │   └── DeliveryEstimate     (based on pincode)
 * ├── ProductDescription       (collapsible, HTML rich text)
 * ├── SpecificationTable       (key-value pairs)
 * ├── ReviewsSection
 * │   ├── RatingDistribution   (5★: 60%, 4★: 25%, ...)
 * │   ├── ReviewFilters        (Most Recent, Most Helpful, Rating)
 * │   └── ReviewList           (paginated, with images)
 * └── RelatedProducts          (horizontal scroll carousel)
 * ```
 *
 * IMAGE GALLERY:
 * - Desktop: Hover-to-zoom (magnifier lens following cursor)
 * - Mobile: Pinch-to-zoom (touch gesture handlers)
 * - Lazy load all images except the first (LCP image)
 * - Use srcset for responsive image sizes
 * - Preload the first image: <link rel="preload" as="image" href="first.webp">
 */


// ========================================================================
// 5. CART ARCHITECTURE (OPTIMISTIC UPDATES)
// ========================================================================

/**
 * CART FLOW:
 * 1. User clicks "Add to Cart"
 * 2. OPTIMISTICALLY update cart count badge immediately (don't wait for API)
 * 3. Send POST /api/cart/items { productId, quantity, variantId }
 * 4. If API succeeds → cart confirmed (already showing correct state)
 * 5. If API fails → REVERT optimistic update, show error toast
 *
 * CART DATA MODEL:
 * ```javascript
 * const cartState = {
 *   items: [
 *     {
 *       cartItemId: 'ci_001',
 *       productId: 'prod_456',
 *       name: 'iPhone 16 Pro',
 *       image: 'iphone16.webp',
 *       price: 119900,
 *       quantity: 1,
 *       variant: { color: 'Desert Titanium', storage: '256GB' },
 *       maxQuantity: 5,          // Stock limit
 *     }
 *   ],
 *   subtotal: 119900,
 *   deliveryFee: 0,
 *   discount: 5000,
 *   total: 114900,
 *   itemCount: 1,
 * };
 * ```
 *
 * PERSISTENCE:
 * - Guest users: Cart stored in localStorage + synced to server on login
 * - Logged-in users: Cart stored on server + cached locally
 * - Cart merge on login: Combine guest cart with server cart (handle conflicts)
 */


// ========================================================================
// 6. SEO STRATEGY FOR E-COMMERCE
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                   E-COMMERCE SEO STRATEGY TABLE                             │
 * ├──────────────────────┬──────────────────────────────────────────────────────┤
 * │ Page Type            │ Rendering Strategy                                    │
 * ├──────────────────────┼──────────────────────────────────────────────────────┤
 * │ Product Listing (PLP)│ SSR (dynamic filters, pagination)                    │
 * │ Product Detail (PDP) │ SSG + ISR (pre-render popular, revalidate every 1hr) │
 * │ Cart / Checkout      │ CSR only (no SEO needed, user-specific)              │
 * │ Home Page            │ ISR (revalidate every 5 min for fresh offers)        │
 * │ Category Pages       │ SSG (relatively static)                              │
 * │ Blog / Help          │ SSG (fully static content)                           │
 * └──────────────────────┴──────────────────────────────────────────────────────┘
 *
 * STRUCTURED DATA (JSON-LD):
 * ```html
 * <script type="application/ld+json">
 * {
 *   "@context": "https://schema.org/",
 *   "@type": "Product",
 *   "name": "iPhone 16 Pro",
 *   "image": "https://example.com/iphone16.jpg",
 *   "offers": {
 *     "@type": "Offer",
 *     "price": "1199.00",
 *     "priceCurrency": "USD",
 *     "availability": "https://schema.org/InStock"
 *   },
 *   "aggregateRating": {
 *     "@type": "AggregateRating",
 *     "ratingValue": "4.6",
 *     "reviewCount": "2847"
 *   }
 * }
 * </script>
 * ```
 */


// ========================================================================
// 7. API CONTRACTS
// ========================================================================

/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │                     E-COMMERCE API CONTRACTS                                 │
 * ├───────────────────────┬────────┬─────────────────────────────────────────────┤
 * │ API                   │ Method │ Description                                 │
 * ├───────────────────────┼────────┼─────────────────────────────────────────────┤
 * │ /api/products         │ GET    │ List with filters, sort, pagination          │
 * │ /api/products/:id     │ GET    │ Full product detail + variants + reviews     │
 * │ /api/products/search  │ GET    │ Autocomplete search (debounced)              │
 * │ /api/cart             │ GET    │ Get current user's cart                      │
 * │ /api/cart/items       │ POST   │ Add item to cart                             │
 * │ /api/cart/items/:id   │ PATCH  │ Update quantity                              │
 * │ /api/cart/items/:id   │ DELETE │ Remove item from cart                        │
 * │ /api/wishlist         │ GET    │ Get wishlist items                           │
 * │ /api/wishlist/:prodId │ POST   │ Add to wishlist                              │
 * │ /api/reviews/:prodId  │ GET    │ Get product reviews (paginated)              │
 * │ /api/reviews/:prodId  │ POST   │ Submit a review                              │
 * └───────────────────────┴────────┴─────────────────────────────────────────────┘
 */


// ========================================================================
// SIMULATION
// ========================================================================

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
