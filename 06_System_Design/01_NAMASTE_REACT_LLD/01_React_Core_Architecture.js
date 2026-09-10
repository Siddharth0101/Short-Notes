'use strict';

/**
 * ========================================================================
 * 01. REACT CORE ARCHITECTURE & BEHIND THE SCENES [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 1 to 4)
 *
 * CORE PHILOSOPHY:
 * - React is a lightweight JavaScript library focused purely on the View layer.
 * - At its core, React is just JavaScript manipulating the DOM declaratively.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     THE REACT PIPELINE                              │
 * │                                                                     │
 * │   JSX Syntax              Babel Transpiler         React Element    │
 * │  <h1 id="t">Hi</h1>  ───► React.createElement ───►  Plain JS Object │
 * │                                                          │          │
 * │                                                          ▼          │
 * │   Real Browser DOM   ◄─── ReactDOM.createRoot  ◄─── Fiber Tree      │
 * │   <h1>Hi</h1>             (DOM Commit Phase)       (Virtual DOM)    │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. REACT WITHOUT ANY BUNDLER OR JSX (EP 1: INCEPTION)
 * ========================================================================
 * - React can run with just 2 CDN script tags in an index.html:
 *   1. react.production.min.js (core react algorithms & createElement)
 *   2. react-dom.production.min.js (browser DOM renderer)
 * - React.createElement takes 3 parameters:
 *   1. Tag Name ('div', 'h1', 'span', or Component)
 *   2. Props Object ({ id: 'header', className: 'title' })
 *   3. Children (string, number, or nested React elements)
 *
 * WHAT IS A REACT ELEMENT?
 * - It is NOT an HTML node!
 * - It is a plain JavaScript Object with $$typeof: Symbol(react.element),
 *   type, key, ref, and props.
 */

// Simulation of React.createElement under the hood
function simulateCreateElement(type, props, ...children) {
  return {
    $$typeof: Symbol.for('react.element'),
    type: type,
    key: props?.key || null,
    ref: props?.ref || null,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children
    }
  };
}

const headingElement = simulateCreateElement('h1', { id: 'heading', className: 'hero-title' }, 'Namaste React!');
console.log('--- React Element Simulation ---');
console.log('Type of element:', typeof headingElement);
console.log('Element Object:', headingElement);

/**
 * ========================================================================
 * 2. WHAT DOES A BUNDLER (PARCEL / VITE) ACTUALLY DO? (EP 2)
 * ========================================================================
 * Production applications require a bundler. Parcel / Vite / Webpack do:
 * 1. Dev Server & HMR (Hot Module Replacement) via WebSocket
 * 2. File Watching Algorithm (C++ based in Parcel)
 * 3. Minification & Dead Code Elimination (Tree Shaking)
 * 4. Image Optimization & Asset Hashing (cache busting)
 * 5. Differential Bundling (modern bundles for Chrome/Safari, polyfills for legacy)
 * 6. HTTPS local testing & Zero Config bundling
 * 7. Transpilation via Babel / esbuild (JSX to JS)
 */

/**
 * ========================================================================
 * 3. JSX IS NOT HTML! (EP 3: LAYING THE FOUNDATION)
 * ========================================================================
 * - JSX is NOT HTML inside JavaScript!
 * - JSX is an XML-like syntax extension for JavaScript.
 * - Browsers DO NOT understand JSX natively!
 * - Babel transpiles JSX before it reaches the browser JS engine:
 *
 *   <div className="card"><h1>Hello</h1></div>
 *                     │
 *                     ▼ (Babel AST Transpilation)
 *   React.createElement('div', { className: 'card' },
 *       React.createElement('h1', null, 'Hello')
 *   )
 *                     │
 *                     ▼
 *   JavaScript Object (Virtual DOM node)
 *                     │
 *                     ▼
 *   ReactDOM renders to real HTML DOM node
 *
 * SANITIZATION:
 * - JSX escapes any values embedded in {} before rendering.
 * - Prevents Cross-Site Scripting (XSS) attacks by default!
 */

/**
 * ========================================================================
 * 4. REACT ELEMENT VS FUNCTIONAL COMPONENT
 * ========================================================================
 * - React Element: Plain JS Object (e.g. const title = <h1>Namaste</h1>)
 * - React Component: A JS function that returns JSX/React Element.
 *   - Name MUST start with capital letter.
 *   - Called as <Header /> or Header().
 *   - Component Composition: Composing components inside components.
 */

// Pure JS demonstration of Component Composition
function Title() {
  return simulateCreateElement('h2', { className: 'sub-title' }, 'Deep Frontend Mastery');
}

function HeaderComponent() {
  return simulateCreateElement(
    'header',
    { className: 'main-header' },
    simulateCreateElement('h1', null, 'Akshay Saini Namaste React Architecture'),
    Title()
  );
}

const renderedHeader = HeaderComponent();
console.log('--- Component Composition Output ---');
console.log('Header props children:', renderedHeader.props.children);
