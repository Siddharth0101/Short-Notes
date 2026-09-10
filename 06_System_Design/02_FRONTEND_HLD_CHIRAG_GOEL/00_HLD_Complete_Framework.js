'use strict';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ██  COMPLETE HLD (HIGH LEVEL DESIGN) FRAMEWORK  ██
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOURCE: Chirag Goel — Chakde System Design (English Subtitle) Ep. 2
 * VIDEO : "Cracking Frontend System Design Interview | Front-end | HLD vs LLD"
 *
 * This file contains EVERY SINGLE NOTE from the video — every bullet point,
 * every table, every sub-point. Nothing is left out.
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │                      HLD (HIGH LEVEL DESIGN) SECTIONS                     │
 * │                                                                            │
 * │  1. Requirements (Functional + Non-Functional)                             │
 * │  2. Scoping (Prioritization) (Functional + Non-Functional)                 │
 * │  3. Tech Choices                                                           │
 * │  4. Component Architecture                                                 │
 * │  5. Data API & Protocols & Implementation                                  │
 * └────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ SECTION 1: REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │                           REQUIREMENTS                                     │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  FUNCTIONAL REQUIREMENTS                                                   │
 * │  ─────────────────────────                                                 │
 * │  - B2B/B2C                                                                 │
 * │  - Module level thinking                                                   │
 * │      - User management                                                     │
 * │      - Help & Support                                                      │
 * │      - Account management                                                  │
 * │      - Payment gateway                                                     │
 * │      - Product listing                                                     │
 * │      - Cart Page                                                           │
 * │      - Subscription/Pricing                                                │
 * │  - Features/module                                                         │
 * │                                                                            │
 * │  NON-FUNCTIONAL REQUIREMENTS                                               │
 * │  ───────────────────────────                                               │
 * │  - Mobile/Desktop First                                                    │
 * │  - Responsive/Adaptive                                                     │
 * │  - Location/Devices/Internet                                               │
 * │  - Accessibility                                                           │
 * │  - Asset Optimization (CSS/JS/Images)                                      │
 * │  - Performance                                                             │
 * │      ( FCP, LCP, TTI, CLÜ )                                                │
 * │  - CSR/SSR                                                                 │
 * │  - Authentication/Authorization                                            │
 * │  - Security                                                                │
 * │  - SEO                                                                     │
 * │  - Caching                                                                 │
 * │  - Offline Support                                                         │
 * │  - Micro-Frontend                                                          │
 * │  - Logging & Monitoring                                                    │
 * │  - A/B testing                                                             │
 * │  - Testing                                                                 │
 * │  - Internationalization (i18n)                                             │
 * │      Localization (i10n)                                                   │
 * │  - Versioning                                                              │
 * │  - PWA                                                                     │
 * │  - CI/CD Pipeline                                                          │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

const REQUIREMENTS = {
  functional: {
    description: 'What features does the user interact with?',
    points: [
      'B2B/B2C — Identify whether the product is Business-to-Business or Business-to-Consumer',
      'Module level thinking — Break the app into logical modules:',
      '    - User management',
      '    - Help & Support',
      '    - Account management',
      '    - Payment gateway',
      '    - Product listing',
      '    - Cart Page',
      '    - Subscription/Pricing',
      'Features/module — List features per module (e.g., search, filter, sort within product listing)',
    ],
  },

  nonFunctional: {
    description: 'How should the system behave? Quality attributes & constraints.',
    points: [
      'Mobile/Desktop First — Which platform takes priority?',
      'Responsive/Adaptive — Should the layout adapt fluidly or serve different layouts?',
      'Location/Devices/Internet — Geo-based constraints, device types, network speeds',
      'Accessibility — WCAG compliance, screen readers, keyboard navigation',
      'Asset Optimization (CSS/JS/Images) — Minification, compression, lazy loading',
      'Performance — Core Web Vitals: FCP, LCP, TTI, CLS',
      'CSR/SSR — Client-Side Rendering vs Server-Side Rendering decision',
      'Authentication/Authorization — Login flows, OAuth, JWT, role-based access',
      'Security — XSS, CSRF, CORS, CSP headers',
      'SEO — Search engine optimization, meta tags, structured data',
      'Caching — Browser cache, CDN cache, service worker cache',
      'Offline Support — Service workers, offline-first architecture',
      'Micro-Frontend — Breaking monolith into independently deployable micro-apps',
      'Logging & Monitoring — Error tracking, analytics, performance monitoring',
      'A/B testing — Feature flags, experiment frameworks',
      'Testing — Unit, Integration, E2E, Visual regression testing',
      'Internationalization (i18n) — Multi-language support',
      'Localization (l10n) — Regional formatting (dates, currencies, RTL layouts)',
      'Versioning — API versioning, app version management',
      'PWA — Progressive Web App capabilities (install, push notifications)',
      'CI/CD Pipeline — Automated build, test, deploy pipelines',
    ],
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// ██ SECTION 2: SCOPING (PRIORITIZATION)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │                      SCOPING (PRIORITIZATION)                              │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  After listing all requirements, PRIORITIZE what to focus on in the        │
 * │  interview. You can't cover everything in 45 minutes. Scope down!          │
 * │                                                                            │
 * │  FUNCTIONAL (Scoped Down)                                                  │
 * │  ────────────────────────                                                  │
 * │  - B2B/B2C                                                                 │
 * │  - Module level thinking                                                   │
 * │      - Product Listing                                                     │
 * │      - Cart Page                                                           │
 * │  - Features/module                                                         │
 * │      - Search                                                              │
 * │      - Listing                                                             │
 * │      - Product Detail                                                      │
 * │      - Add Item to Cart                                                    │
 * │      - Add Item to Wishlist                                                │
 * │      - Cart List                                                           │
 * │      - Add/Remove Cart Items                                               │
 * │                                                                            │
 * │  NON-FUNCTIONAL (Scoped Down)                                              │
 * │  ──────────────────────────                                                │
 * │  - Desktop                                                                 │
 * │  - Responsive                                                              │
 * │  - Accessibility                                                           │
 * │  - Asset Optimization (CSS/JS/Images)                                      │
 * │  - Performance                                                             │
 * │      ( FCP, LCP, TTI, CLÜ )                                                │
 * │  - CSR/SSR                                                                 │
 * │  - Caching                                                                 │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

const SCOPING = {
  functional: {
    description: 'Prioritized functional requirements for the interview scope',
    points: [
      'B2B/B2C',
      'Module level thinking:',
      '    - Product Listing',
      '    - Cart Page',
      'Features/module:',
      '    - Search',
      '    - Listing',
      '    - Product Detail',
      '    - Add Item to Cart',
      '    - Add Item to Wishlist',
      '    - Cart List',
      '    - Add/Remove Cart Items',
    ],
  },

  nonFunctional: {
    description: 'Prioritized non-functional requirements for the interview scope',
    points: [
      'Desktop',
      'Responsive',
      'Accessibility',
      'Asset Optimization (CSS/JS/Images)',
      'Performance (FCP, LCP, TTI, CLS)',
      'CSR/SSR',
      'Caching',
    ],
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// ██ SECTION 3: TECH CHOICES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │                            TECH CHOICES                                    │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  - Library/Framework                                                       │
 * │  - State Management                                                        │
 * │  - Folder structure                                                        │
 * │  - Packages                                                                │
 * │  - Dependencies (Canvas/SVG, WebRTC)                                       │
 * │  - Design System                                                           │
 * │  - Build Tools (Webpack, Rollup, Parcel)                                   │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

const TECH_CHOICES = {
  description: 'Technology decisions you need to make and justify',
  points: [
    {
      choice: 'Library/Framework',
      examples: 'React, Angular, Vue, Svelte, Next.js, Remix',
      tip: 'Justify based on project needs — SSR support, ecosystem, team expertise',
    },
    {
      choice: 'State Management',
      examples: 'Redux Toolkit, Zustand, Jotai, React Query, Context API, MobX',
      tip: 'Pick based on app complexity — Context for simple, Redux/Zustand for complex',
    },
    {
      choice: 'Folder Structure',
      examples: 'Feature-based, Domain-driven, Atomic Design folder structure',
      tip: 'Organize by feature/module for scalability, not by file type',
    },
    {
      choice: 'Packages',
      examples: 'Axios, React Hook Form, Zod, date-fns, lodash-es',
      tip: 'Prefer tree-shakable, lightweight packages',
    },
    {
      choice: 'Dependencies',
      examples: 'Canvas/SVG for graphics, WebRTC for video/audio',
      tip: 'Mention specialized deps only when the problem demands them',
    },
    {
      choice: 'Design System',
      examples: 'Custom DS, Material UI, Ant Design, Chakra UI, Radix + Tailwind',
      tip: 'Discuss design tokens, theming, and consistent component library',
    },
    {
      choice: 'Build Tools',
      examples: 'Webpack, Rollup, Parcel, Vite, esbuild, Turbopack',
      tip: 'Vite for dev speed, Webpack for mature ecosystem, Rollup for libraries',
    },
  ],
};


// ═══════════════════════════════════════════════════════════════════════════════
// ██ SECTION 4: COMPONENT ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │                        COMPONENT ARCHITECTURE                              │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  - Routing                                                                 │
 * │  - Component Hierarchy                                                     │
 * │  - Data Sharing                                                            │
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────┐                           │
 * │  │            COMPONENT TREE DIAGRAM             │                          │
 * │  │                                               │                          │
 * │  │           ┌─────────┐                         │                          │
 * │  │           │   App   │                         │                          │
 * │  │           └────┬────┘                         │                          │
 * │  │      ┌─────────┼─────────┐                    │                          │
 * │  │  ┌───┴───┐ ┌───┴───┐ ┌──┴───┐                │                          │
 * │  │  │Header │ │Content│ │Footer│                 │                          │
 * │  │  └───────┘ └───┬───┘ └──────┘                 │                          │
 * │  │          ┌─────┼─────┐                        │                          │
 * │  │      ┌───┴──┐┌─┴──┐┌┴────┐                   │                          │
 * │  │      │Sidebar││Main││Right│                   │                          │
 * │  │      └──────┘└────┘└─────┘                    │                          │
 * │  └─────────────────────────────────────────────┘                           │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

const COMPONENT_ARCHITECTURE = {
  description: 'How components are organized, nested, and communicate',
  keyAreas: [
    {
      area: 'Routing',
      details: [
        'Define URL routes and map them to page-level components',
        'Nested routing for sub-pages (e.g., /products/:id)',
        'Protected/private routes for authenticated pages',
        'Lazy loading routes with React.lazy() + Suspense',
        'Route-based code splitting for performance',
      ],
    },
    {
      area: 'Component Hierarchy',
      details: [
        'App → Header, Content, Footer (Top-level layout)',
        'Content → Sidebar, Main, RightPanel',
        'Break down into Atoms, Molecules, Organisms (Atomic Design)',
        'Smart (Container) vs Dumb (Presentational) components',
        'Identify reusable vs page-specific components',
      ],
    },
    {
      area: 'Data Sharing',
      details: [
        'Props: Parent → Child (direct data passing)',
        'Context API: Avoid prop drilling for cross-cutting concerns (theme, auth, locale)',
        'State Management: Global store (Redux/Zustand) for shared state across distant components',
        'Event Emitters / Pub-Sub: For loosely coupled communication',
        'URL State: Query params for shareable/bookmarkable state (filters, pagination)',
      ],
    },
  ],
};


// ═══════════════════════════════════════════════════════════════════════════════
// ██ SECTION 5: DATA API & PROTOCOLS & IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │                   DATA API & PROTOCOLS & IMPLEMENTATION                     │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────────────────┐   │
 * │  │                        PROTOCOLS                                    │   │
 * │  │                                                                     │   │
 * │  │  - Rest/Graph/RPF/SSE/GraphQL                                       │   │
 * │  │  - JSON/Protocol Buffers                                            │   │
 * │  └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────────────────┐   │
 * │  │                   IMPLEMENTATION DETAILS                            │   │
 * │  │                                                                     │   │
 * │  │  - Pagination/Infinite Scroll                                       │   │
 * │  │  - Debouncing/Throttling                                            │   │
 * │  └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────────────────┐   │
 * │  │                          APIs                                       │   │
 * │  │                                                                     │   │
 * │  │  - getProductList()                                                 │   │
 * │  │  - getProductDetail()                                               │   │
 * │  │  - addProductToCart()                                                │   │
 * │  └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────────────────┐   │
 * │  │                      DATA MODELING                                  │   │
 * │  │                                                                     │   │
 * │  │  - URL                                                              │   │
 * │  │  - Method                                                           │   │
 * │  │  - Request (query params, body)                                     │   │
 * │  │  - Response (Data, Error)                                           │   │
 * │  │  - Status Code                                                      │   │
 * │  └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────────────────┐   │
 * │  │                        COMPONENT                                    │   │
 * │  │                                                                     │   │
 * │  │  - state/props                                                      │   │
 * │  │  - Event Handling                                                   │   │
 * │  │  - Customization Support                                            │   │
 * │  │  - Theming                                                          │   │
 * │  │  - Reusable                                                         │   │
 * │  │  - Data Source                                                      │   │
 * │  └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

const DATA_API_PROTOCOLS = {
  protocols: {
    description: 'Communication protocols between client and server',
    points: [
      'REST — Standard HTTP methods (GET, POST, PUT, DELETE) with JSON payloads',
      'GraphQL — Query exactly the data you need, no over-fetching/under-fetching',
      'gRPC/RPC — Remote Procedure Calls, binary protocol, high performance',
      'SSE (Server-Sent Events) — Unidirectional server→client streaming (AI tokens, live scores)',
      'WebSockets — Bidirectional full-duplex (chat, multiplayer, live collaboration)',
      'JSON — Standard data interchange format, human-readable',
      'Protocol Buffers (Protobuf) — Binary serialization, smaller payload, faster parsing',
    ],
  },

  implementationDetails: {
    description: 'Core implementation patterns for data handling',
    points: [
      {
        pattern: 'Pagination/Infinite Scroll',
        details: [
          'Cursor-based pagination (scalable, no skipping inconsistency)',
          'Offset-based pagination (simple, good for small datasets)',
          'Infinite scroll with Intersection Observer API',
          'Virtual scrolling / Windowing (react-window, react-virtuoso) for 10K+ items',
        ],
      },
      {
        pattern: 'Debouncing/Throttling',
        details: [
          'Debounce: Wait for user to STOP typing before firing API call (search input)',
          'Throttle: Fire at most once every N ms (scroll events, resize events)',
          'requestAnimationFrame: Sync with browser paint cycle (animations, drag)',
        ],
      },
    ],
  },

  apis: {
    description: 'Example API contracts for an e-commerce system',
    endpoints: [
      {
        name: 'getProductList()',
        method: 'GET',
        url: '/api/products',
        request: '{ query: { page, limit, category, sortBy, search } }',
        response: '{ data: Product[], pagination: { total, page, limit, hasNext } }',
        statusCodes: '200 OK, 400 Bad Request, 500 Internal Server Error',
      },
      {
        name: 'getProductDetail()',
        method: 'GET',
        url: '/api/products/:id',
        request: '{ params: { id } }',
        response: '{ data: { id, title, description, price, images[], variants[], reviews[] } }',
        statusCodes: '200 OK, 404 Not Found, 500 Internal Server Error',
      },
      {
        name: 'addProductToCart()',
        method: 'POST',
        url: '/api/cart/items',
        request: '{ body: { productId, quantity, variantId } }',
        response: '{ data: { cartId, items[], totalPrice }, error: null }',
        statusCodes: '201 Created, 400 Bad Request, 401 Unauthorized, 409 Conflict',
      },
    ],
  },

  dataModeling: {
    description: 'How to model every API call — the 5 key parts',
    model: [
      'URL — The endpoint path (/api/products, /api/cart)',
      'Method — HTTP verb (GET, POST, PUT, PATCH, DELETE)',
      'Request — query params (for GET) + body (for POST/PUT)',
      'Response — { Data (success payload), Error (error payload) }',
      'Status Code — 200, 201, 400, 401, 403, 404, 500',
    ],
  },

  component: {
    description: 'Component-level design considerations (LLD thinking within HLD)',
    points: [
      'state/props — What data does the component own (state) vs receive (props)?',
      'Event Handling — onClick, onChange, onSubmit, keyboard events, custom events',
      'Customization Support — Render props, slots, composition, children pattern',
      'Theming — CSS variables / design tokens for dark mode, brand themes',
      'Reusable — Generic enough to use across multiple pages/features',
      'Data Source — Where does the component get its data? (API, store, props, URL)',
    ],
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// ██ COMPLETE HLD CHECKLIST TABLE (FROM THE VIDEO)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌──────────────────────────────────────────────────────────────────────────────────────┐
 * │                        COMPLETE HLD INTERVIEW CHECKLIST                              │
 * ├───────┬──────────────────────────────┬───────────────────────────────────────────────┤
 * │ Step  │ Section                      │ What to Cover                                 │
 * ├───────┼──────────────────────────────┼───────────────────────────────────────────────┤
 * │  1    │ Requirements                 │ Functional (B2B/B2C, modules, features)       │
 * │       │                              │ Non-Functional (perf, a11y, security, i18n…)  │
 * ├───────┼──────────────────────────────┼───────────────────────────────────────────────┤
 * │  2    │ Scoping (Prioritization)     │ Narrow down to 2-3 core modules               │
 * │       │                              │ Pick top NFRs relevant to the problem          │
 * ├───────┼──────────────────────────────┼───────────────────────────────────────────────┤
 * │  3    │ Tech Choices                 │ Library/Framework, State Mgmt, Build Tools     │
 * │       │                              │ Folder structure, Packages, Design System      │
 * │       │                              │ Dependencies (Canvas/SVG, WebRTC)              │
 * ├───────┼──────────────────────────────┼───────────────────────────────────────────────┤
 * │  4    │ Component Architecture       │ Routing, Component Hierarchy, Data Sharing     │
 * │       │                              │ Draw the component tree diagram                │
 * ├───────┼──────────────────────────────┼───────────────────────────────────────────────┤
 * │  5    │ Data API & Protocols         │ Protocols (REST/GraphQL/SSE/WebSocket)          │
 * │       │ & Implementation             │ Data Modeling (URL, Method, Request, Response)  │
 * │       │                              │ APIs (getProductList, getProductDetail, etc.)   │
 * │       │                              │ Implementation (Pagination, Debounce/Throttle)  │
 * │       │                              │ Component (state/props, events, theming, etc.)  │
 * └───────┴──────────────────────────────┴───────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ DETAILED NON-FUNCTIONAL REQUIREMENTS TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
 * │                       NON-FUNCTIONAL REQUIREMENTS — DETAILED BREAKDOWN                       │
 * ├──────────────────────────┬─────────────────────────────────────────────────────────────────── ┤
 * │ NFR Category             │ Details                                                           │
 * ├──────────────────────────┼───────────────────────────────────────────────────────────────────┤
 * │ Mobile/Desktop First     │ Which platform takes priority for layout & interactions?          │
 * │ Responsive/Adaptive      │ Fluid grids + media queries (responsive) vs separate layouts      │
 * │ Location/Devices/Internet│ Geo constraints, device capabilities, network speed handling      │
 * │ Accessibility            │ WCAG 2.1 AA, screen readers, keyboard nav, focus management      │
 * │ Asset Optimization       │ Minify CSS/JS, compress images (WebP/AVIF), tree shaking          │
 * │ Performance              │ FCP (First Contentful Paint), LCP, TTI (Time to Interactive),    │
 * │                          │ CLS (Cumulative Layout Shift)                                    │
 * │ CSR/SSR                  │ Client-Side vs Server-Side Rendering strategy                     │
 * │ Auth                     │ Authentication (who are you?) & Authorization (what can you do?)  │
 * │ Security                 │ XSS prevention, CSRF tokens, CORS config, CSP headers            │
 * │ SEO                      │ Meta tags, Open Graph, structured data, SSR for crawlers          │
 * │ Caching                  │ HTTP cache headers, CDN, Service Worker cache, in-memory cache    │
 * │ Offline Support          │ Service Workers, IndexedDB, offline-first PWA                     │
 * │ Micro-Frontend           │ Module Federation, independent deploys, shared dependencies       │
 * │ Logging & Monitoring     │ Sentry/Datadog, error boundaries, performance metrics, RUM        │
 * │ A/B Testing              │ Feature flags (LaunchDarkly, Unleash), experiment frameworks      │
 * │ Testing                  │ Unit (Jest/Vitest), Integration (RTL), E2E (Cypress/Playwright)  │
 * │ i18n / l10n              │ react-intl, next-intl, ICU message format, RTL layout support     │
 * │ Versioning               │ Semantic versioning, API version headers, backward compatibility  │
 * │ PWA                      │ manifest.json, Service Worker, install prompts, push notifs       │
 * │ CI/CD Pipeline           │ GitHub Actions, automated tests, lint, build, preview deploys     │
 * └──────────────────────────┴───────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ TECH CHOICES COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────────────────┐
 * │                           TECH CHOICES — COMPARISON TABLE                              │
 * ├──────────────────┬────────────────────────┬────────────────────────────────────────────┤
 * │ Category         │ Options                │ When to Choose                             │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ Library/Framework│ React, Vue, Angular,   │ React: ecosystem + community               │
 * │                  │ Svelte, Next.js, Remix │ Next.js: SSR/SSG needed                    │
 * │                  │                        │ Angular: enterprise, opinionated            │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ State Management │ Redux Toolkit, Zustand,│ RTK: complex global state + devtools        │
 * │                  │ Jotai, Context, MobX   │ Zustand: simpler API, less boilerplate      │
 * │                  │                        │ Context: simple cross-cutting concerns       │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ Folder Structure │ Feature-based, Domain, │ Feature-based: scales well with team size   │
 * │                  │ Atomic, Layered        │ Domain: matches business logic boundaries   │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ Packages         │ Axios, React Hook Form,│ Pick lightweight, tree-shakable packages    │
 * │                  │ Zod, date-fns, lodash  │ Avoid heavy deps for simple tasks           │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ Dependencies     │ Canvas/SVG, WebRTC,    │ Canvas: high-perf graphics, games           │
 * │                  │ D3, Three.js           │ WebRTC: peer-to-peer video/audio            │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ Design System    │ Custom, MUI, Ant, Radix│ Custom: full control over brand identity    │
 * │                  │ Chakra, Shadcn         │ MUI/Ant: fast prototyping, enterprise       │
 * ├──────────────────┼────────────────────────┼────────────────────────────────────────────┤
 * │ Build Tools      │ Webpack, Vite, Rollup, │ Vite: fast dev, HMR                        │
 * │                  │ Parcel, esbuild, Turbo │ Webpack: mature, plugin ecosystem           │
 * │                  │                        │ Rollup: library bundling                    │
 * └──────────────────┴────────────────────────┴────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ DATA MODELING TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────────────────────┐
 * │                          DATA MODELING — API CONTRACT TEMPLATE                             │
 * ├──────────────────┬────────────────────────────────────────────────────────────────────────┤
 * │ Field            │ Description                                                            │
 * ├──────────────────┼────────────────────────────────────────────────────────────────────────┤
 * │ URL              │ The API endpoint path (e.g., /api/products, /api/cart/items)            │
 * │ Method           │ HTTP verb — GET, POST, PUT, PATCH, DELETE                               │
 * │ Request          │ query params (for GET), body (for POST/PUT)                             │
 * │ Response         │ Data (success payload) + Error (error message/code)                     │
 * │ Status Code      │ 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized,                │
 * │                  │ 403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error            │
 * └──────────────────┴────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ PROTOCOLS COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────────────────┐
 * │                          PROTOCOLS COMPARISON TABLE                                    │
 * ├──────────────┬───────────────┬────────────────┬───────────────────────────────────────┤
 * │ Protocol     │ Direction     │ Format         │ Best Use Case                         │
 * ├──────────────┼───────────────┼────────────────┼───────────────────────────────────────┤
 * │ REST         │ Req ◄──► Res  │ JSON           │ Standard CRUD APIs                    │
 * │ GraphQL      │ Req ◄──► Res  │ JSON           │ Complex data, avoid over/under-fetch  │
 * │ gRPC/RPC     │ Req ◄──► Res  │ Protocol Buffers│ Microservices, high throughput        │
 * │ SSE          │ Svr ──► Client│ text/event-stream│ AI streaming, live scores, stock     │
 * │ WebSockets   │ Svr ◄──►Client│ Binary/Text    │ Chat, multiplayer, collaboration      │
 * │ WebRTC       │ Peer◄──► Peer │ UDP/SCTP       │ Video/Audio calls, screen share       │
 * └──────────────┴───────────────┴────────────────┴───────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ COMPONENT DESIGN TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────────────────┐
 * │                       COMPONENT DESIGN CONSIDERATIONS TABLE                            │
 * ├───────────────────────┬────────────────────────────────────────────────────────────────┤
 * │ Aspect                │ What to Think About                                            │
 * ├───────────────────────┼────────────────────────────────────────────────────────────────┤
 * │ state/props           │ What does the component own (internal state) vs receive         │
 * │                       │ from parent (props)? Controlled vs Uncontrolled?                │
 * ├───────────────────────┼────────────────────────────────────────────────────────────────┤
 * │ Event Handling        │ User interactions — onClick, onChange, onSubmit, onKeyDown      │
 * │                       │ Custom events, event delegation, event bubbling                 │
 * ├───────────────────────┼────────────────────────────────────────────────────────────────┤
 * │ Customization Support │ Render props, compound components, slots, children pattern      │
 * │                       │ Allow consumers to override default behavior                    │
 * ├───────────────────────┼────────────────────────────────────────────────────────────────┤
 * │ Theming               │ CSS variables (design tokens), dark/light mode toggle           │
 * │                       │ Support brand reskinning without code changes                   │
 * ├───────────────────────┼────────────────────────────────────────────────────────────────┤
 * │ Reusable              │ Generic enough for multiple contexts                            │
 * │                       │ Well-defined API with sensible defaults                         │
 * ├───────────────────────┼────────────────────────────────────────────────────────────────┤
 * │ Data Source            │ Where data comes from — API fetch, global store, parent props   │
 * │                       │ URL query params, local storage, service worker cache            │
 * └───────────────────────┴────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ QUICK REFERENCE: HLD FLOW DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │              HLD INTERVIEW FLOW (Chirag Goel's Approach)                   │
 * │                                                                            │
 * │   ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐           │
 * │   │ Requirements │────►│    Scoping       │────►│ Tech Choices │           │
 * │   │ (Func + NFR) │     │ (Prioritization)│     │              │           │
 * │   └──────────────┘     └─────────────────┘     └──────┬───────┘           │
 * │                                                        │                   │
 * │                                                        ▼                   │
 * │   ┌──────────────────────────────┐     ┌──────────────────────────────┐   │
 * │   │    Component Architecture    │◄────│   Data API & Protocols       │   │
 * │   │  - Routing                   │     │   & Implementation           │   │
 * │   │  - Component Hierarchy       │     │  - Protocols                 │   │
 * │   │  - Data Sharing              │     │  - Implementation Details    │   │
 * │   │                              │     │  - APIs                      │   │
 * │   │  ┌───────────────────────┐   │     │  - Data Modeling             │   │
 * │   │  │    Component Tree     │   │     │  - Component                 │   │
 * │   │  │    (Draw Diagram!)    │   │     │                              │   │
 * │   │  └───────────────────────┘   │     └──────────────────────────────┘   │
 * │   └──────────────────────────────┘                                        │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ KEY INTERVIEW TIPS FROM CHIRAG GOEL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * INTERVIEW TIPS (from the video):
 *
 * 1. ALWAYS start with Requirements — Don't jump into architecture directly.
 * 2. Ask clarifying questions — B2B or B2C? Mobile first or desktop first?
 * 3. Scope down aggressively — You can't cover everything in 45 minutes.
 *    Pick 2-3 core modules and focus deeply on them.
 * 4. Draw diagrams — Interviewers love visual component hierarchies.
 * 5. Justify every tech choice — Don't just say "React". Say WHY React.
 * 6. Talk about trade-offs — Every decision has pros and cons. Discuss them.
 * 7. Cover NFRs proactively — Performance, accessibility, security, caching.
 *    These differentiate senior candidates from mid-level.
 * 8. Define API contracts — Show you think about the frontend-backend boundary.
 * 9. Component thinking — state/props, event handling, customization, theming,
 *    reusability, and data source.
 * 10. Treat the interviewer as a teammate — Think out loud, explain your reasoning.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ██ EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Consolidating all sections for programmatic reference
const HLD_COMPLETE_FRAMEWORK = {
  section1_requirements: REQUIREMENTS,
  section2_scoping: SCOPING,
  section3_techChoices: TECH_CHOICES,
  section4_componentArchitecture: COMPONENT_ARCHITECTURE,
  section5_dataApiProtocols: DATA_API_PROTOCOLS,
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('██ HLD COMPLETE FRAMEWORK — Chirag Goel (Chakde System Design)');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Sections loaded:', Object.keys(HLD_COMPLETE_FRAMEWORK).length);
console.log('All 5 HLD sections ready for interview revision!');
