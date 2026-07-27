/**
 * ========================================================================
 * FRONTEND INTERVIEW MASTERCLASS: COMPLETE HTML & CSS QUESTIONS & ANSWERS
 * ========================================================================
 * NOTES:
 * - Direct answers for all HTML & CSS interview questions.
 * - Organized into 4 core sections:
 *   1. HTML Core & Elements (Q1 - Q11)
 *   2. Positioning, Target, Forms, Events & Semantic HTML5 (Q12 - Q24)
 *   3. HTML5 Storage, Media, APIs, CSS Specificity & Layout (Q25 - Q34)
 *   4. Box Model, Positioning, Flexbox, Selectors & Advanced CSS (Q35 - Q44)
 */

/**
 * ========================================================================
 * SECTION 1: HTML CORE & ELEMENTS
 * ========================================================================
 * 
 * 1) Are the HTML tags and elements the same thing?
 * ------------------------------------------------------------------------
 * NO, HTML tags and HTML elements are related but NOT the exact same thing.
 * 
 * • HTML Tag: A tag is the markup syntax delimiter used to declare the start or end of an element.
 *   - Opening Tag: <p>
 *   - Closing Tag: </p>
 * 
 * • HTML Element: An element is the complete structure, comprising the opening tag, attributes, inner content (text or nested elements), and closing tag.
 * 
 * Visual Syntax Anatomy:
 * +-------------------------------------------------------------+
 * |                     HTML ELEMENT                            |
 * |  +----------------+  +--------------+  +-----------------+  |
 * |  |  Opening Tag   |  | Inner Content|  |   Closing Tag   |  |
 * |  |  <p id="main"> |  | Hello World! |  |       </p>      |  |
 * |  +----------------+  +--------------+  +-----------------+  |
 * +-------------------------------------------------------------+
 */
const q1_example = {
    tagOpening: "<p class='text'>",
    innerContent: "This whole structure is an element.",
    tagClosing: "</p>"
};

/**
 * 2) What are tags and attributes in HTML?
 * ------------------------------------------------------------------------
 * • Tags: Structural markup boundaries enclosed in angle brackets (<tagname>) that tell the browser how to parse and render content.
 * • Attributes: Special key-value pairs written inside an element's opening tag to provide additional metadata, behavior, or configuration.
 * 
 * Common Attribute Categories:
 * 1. Global Attributes: id, class, style, title, lang, dir, hidden, data-*
 * 2. Media & Asset Attributes: src, alt, href, target, loading, controls
 * 3. Form Attributes: type, value, placeholder, required, disabled, readonly, pattern
 */
const q2_example = `<a href="https://google.com" target="_blank" class="nav-link" id="home-btn">Go to Google</a>`;

/**
 * 3) What are void elements in HTML?
 * ------------------------------------------------------------------------
 * Void elements (also known as self-closing or empty elements) are HTML elements that CANNOT contain any child content or closing tag. They only consist of a start tag.
 * 
 * List of Standard Void Elements:
 * • <img>      (Image element)
 * • <input>    (Form input)
 * • <br>       (Line break)
 * • <hr>       (Horizontal thematic break)
 * • <meta>     (Document metadata)
 * • <link>     (External resource link)
 * • <source>   (Media source for audio/video)
 * • <area>     (Image map clickable area)
 * • <base>     (Base URL for relative links)
 * • <param>    (Object parameter)
 */
const q3_example = `<img src="hero.jpg" alt="Hero banner" width="800" height="400">
<input type="text" name="username" placeholder="Enter username">
<br>`;

/**
 * 4) What are different types of lists in HTML? Explain the difference between each one of them
 * ------------------------------------------------------------------------
 * HTML provides 3 distinct list types:
 * 
 * 1. Unordered List (<ul>):
 *    - Displays items with bullet points (discs, circles, squares).
 *    - Order of list items does NOT matter.
 *    - Child element: <li> (List Item).
 * 
 * 2. Ordered List (<ol>):
 *    - Displays items with sequential numbers, letters, or Roman numerals.
 *    - Order of list items IS significant.
 *    - Attributes: type="1|a|A|i|I", start="5", reversed.
 *    - Child element: <li>.
 * 
 * 3. Description / Definition List (<dl>):
 *    - Displays key-value term and definition pairs.
 *    - Child elements: <dt> (Description Term) and <dd> (Description Details).
 */
const q4_example = `<!-- 1. Unordered List -->
<ul>
  <li>HTML5</li>
  <li>CSS3</li>
</ul>

<!-- 2. Ordered List -->
<ol type="1" start="1">
  <li>First Step</li>
  <li>Second Step</li>
</ol>

<!-- 3. Description List -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
</dl>`;

/**
 * 5) What is the "class" attribute in HTML? Difference between "id" and "class"?
 * ------------------------------------------------------------------------
 * • class Attribute: A non-unique identifier assigned to elements to group them for shared CSS styling or JavaScript selection. Multiple elements can share the exact same class name.
 * 
 * Key Differences Table:
 * +-------------------+-----------------------------------+------------------------------------+
 * | Feature           | class                             | id                                 |
 * +-------------------+-----------------------------------+------------------------------------+
 * | Uniqueness        | Multiple elements can share class | Must be UNIQUE on the entire page  |
 * | Usage             | Group styling & shared components | Unique element targeting & anchors |
 * | CSS Selector      | .classname (dot)                  | #idname (hash)                     |
 * | Multiple Values   | Allowed (class="btn primary lg")  | Only ONE id per element            |
 * | CSS Specificity   | Weight: (0, 0, 1, 0)              | Weight: (0, 1, 0, 0) (Higher!)    |
 * | JS Access Method  | getElementsByClassName(), queryAll| getElementById()                   |
 * +-------------------+-----------------------------------+------------------------------------+
 */
const q5_example = `<!-- Multiple elements sharing class -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-danger">Delete</button>

<!-- Unique id per page -->
<header id="main-header">Navbar</header>`;

/**
 * 6) How to optimize website assets loading?
 * ------------------------------------------------------------------------
 * Asset loading optimization is crucial for fast initial page render (Core Web Vitals):
 * 
 * 1. Image Optimization:
 *    - Use modern web formats (WebP, AVIF instead of PNG/JPEG).
 *    - Add native lazy loading: <img loading="lazy">.
 *    - Use responsive srcset and <picture> for proper screen resolutions.
 * 
 * 2. Script Loading Optimization:
 *    - Use async for independent tracking scripts.
 *    - Use defer for DOM-dependent application scripts (downloads in parallel, executes in order after DOM parse).
 * 
 * 3. Resource Hints (<head>):
 *    - <link rel="preload" href="font.woff2" as="font" crossorigin>: Fetch critical assets immediately.
 *    - <link rel="preconnect" href="https://api.example.com">: Establish early TCP/TLS handshake.
 *    - <link rel="dns-prefetch" href="https://cdn.domain.com">: Resolve DNS beforehand.
 * 
 * 4. Minification & Compression:
 *    - Minify CSS, JS, HTML.
 *    - Enable Gzip / Brotli compression on web server.
 * 
 * 5. Caching & CDNs:
 *    - Set HTTP Cache-Control headers (Cache-Control: max-age=31536000, immutable).
 *    - Serve static assets via Content Delivery Network (CDN).
 */
const q6_example = `<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <script src="app.js" defer></script>
</head>
<body>
  <img src="banner.webp" loading="lazy" alt="Banner" width="1200" height="600">
</body>`;

/**
 * 7) What is the difference between <strong>, <b> tags and <em>, <i> tags?
 * ------------------------------------------------------------------------
 * • <b> vs <strong>:
 *   - <b> (Bring Attention): Stylistic bolding without extra semantic importance.
 *   - <strong> (Strong Importance): Semantic importance or urgency. Screen readers pronounce this text with higher emphasis/volume.
 * 
 * • <i> vs <em>:
 *   - <i> (Idiomatic Text): Physical italic formatting for technical terms, foreign words, taxonomy, or thoughts.
 *   - <em> (Emphasized Text): Semantic stress emphasis. Altering where <em> is placed changes the verbal meaning of a sentence.
 * 
 * Summary:
 * - <b> and <i> are VISUAL ONLY (presentational).
 * - <strong> and <em> are SEMANTIC (convey structure & meaning to screen readers/SEO).
 */
const q7_example = `<p>This is <b>bold text</b> for visual design.</p>
<p>This is <strong>CRITICAL WARNING</strong> for user safety.</p>

<p>He spoke in <i>Latin</i>.</p>
<p>I <em>love</em> coding! (Emphasis on love)</p>`;

/**
 * 8) What is the significance of <head> and <body> tags in HTML?
 * ------------------------------------------------------------------------
 * 1. <head> Tag (Metadata Container):
 *    - Contains non-rendered metadata about the document.
 *    - Holds document title (<title>), character encoding (<meta charset="UTF-8">), responsive viewport config, CSS stylesheets (<link>), SEO meta tags, and scripts.
 *    - NOT rendered directly inside the browser viewport canvas.
 * 
 * 2. <body> Tag (Rendered Content Container):
 *    - Holds all visible content displayed directly to the user on the screen.
 *    - Contains headings, paragraphs, images, videos, forms, buttons, tables, and structural layout containers (<div>, <header>, <main>, <footer>).
 */
const q8_example = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Interview Masterclass</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Visible Heading</h1>
  <p>Visible Paragraph Content</p>
</body>
</html>`;

/**
 * 9) Can we display a web page inside a web page or Is nesting of webpages possible?
 * ------------------------------------------------------------------------
 * YES! Nesting a web page inside another web page is done using the HTML <iframe> (Inline Frame) element.
 * 
 * Key Attributes of <iframe>:
 * • src: URL of the web page to embed.
 * • width / height: Frame dimensions.
 * • title: Accessibility description for screen readers.
 * • loading="lazy": Defers loading until scrolled into view.
 * • sandbox: Restricts permissions (disables scripts, forms, popups for security).
 * 
 * Security Constraints:
 * • Websites can block being embedded inside an <iframe> using HTTP response headers:
 *   - X-Frame-Options: DENY | SAMEORIGIN
 *   - Content-Security-Policy: frame-ancestors 'none' or 'self'
 */
const q9_example = `<iframe 
  src="https://example.com" 
  width="100%" 
  height="400" 
  title="Embedded Page"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy">
</iframe>`;

/**
 * 10) What are inline elements? What are block level elements? What is the difference?
 * ------------------------------------------------------------------------
 * 1. Block-Level Elements:
 *    - Always start on a NEW line.
 *    - Automatically expand to take 100% of available container width.
 *    - Respect width, height, margin, and padding (top/bottom/left/right).
 *    - Examples: <div>, <p>, <h1>-<h6>, <section>, <article>, <ul>, <li>, <form>.
 * 
 * 2. Inline Elements:
 *    - Do NOT start on a new line (flow side-by-side with text).
 *    - Only take up as much width as their inner content requires.
 *    - IGNORE width and height properties! Top and bottom margin/padding do NOT affect layout line height.
 *    - Examples: <span>, <a>, <strong>, <em>, <img>, <label>, <code>.
 * 
 * 3. Inline-Block (display: inline-block):
 *    - Hybrid behavior! Flows inline like text, BUT respects width, height, margins, and paddings!
 */
const q10_example = `.block-demo {
  display: block;        /* Full width, new line */
}
.inline-demo {
  display: inline;       /* Content width, ignores custom width/height */
}
.inline-block-demo {
  display: inline-block; /* Inline flow + customizable width/height */
}`;

/**
 * 11) Position attributes and exact differences (static, relative, absolute, fixed, sticky)
 * ------------------------------------------------------------------------
 * 1. static (Default): Normal document flow. Top/left/right/bottom/z-index ignored.
 * 2. relative: Shifted relative to its OWN normal flow position. Space preserved.
 * 3. absolute: Removed from flow. Positioned relative to nearest non-static ancestor.
 * 4. fixed: Removed from flow. Positioned relative to browser VIEWPORT.
 * 5. sticky: Toggles between relative and fixed based on scroll position within container.
 */
const q11_example = `.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 100;
}`;


/**
 * ========================================================================
 * SECTION 2: POSITIONING, TARGET, FORMS, EVENTS & SEMANTIC HTML5
 * ========================================================================
 * 
 * 12) Difference between position absolute and relative
 * ------------------------------------------------------------------------
 * +--------------------------+------------------------------------------+--------------------------------------------+
 * | Property                 | position: relative                       | position: absolute                         |
 * +--------------------------+------------------------------------------+--------------------------------------------+
 * | Document Flow            | Remains inside normal flow               | Removed completely from normal flow        |
 * | Layout Space             | Original layout space is KEPT & reserved | Takes ZERO space (surrounding items collapse)|
 * | Reference Origin         | Relative to its OWN default position     | Relative to nearest non-static ancestor   |
 * | Parent Container Anchor  | Can act as container for absolute kids   | Searches up DOM tree for non-static parent |
 * +--------------------------+------------------------------------------+--------------------------------------------+
 */
const q12_example = `<div style="position: relative; width: 300px; height: 200px; background: #333;">
  <span style="position: absolute; top: 10px; right: 10px; background: red; color: white;">
    Badge
  </span>
</div>`;

/**
 * 13) In how many ways can you display HTML elements?
 * ------------------------------------------------------------------------
 * display: block | inline | inline-block | flex | inline-flex | grid | inline-grid | none | table | contents
 */
const q13_example = `.flex-container { display: flex; }`;

/**
 * 14) Difference between "display: none" and "visibility: hidden"?
 * ------------------------------------------------------------------------
 * • display: none -> Removed from layout flow, 0px space, triggers REFLOW & REPAINT.
 * • visibility: hidden -> Visual opacity 0, layout space KEPT, triggers REPAINT only.
 */
const q14_example = `.hidden-box { display: none; }
.invisible-box { visibility: hidden; }`;

/**
 * 15) Target attribute in <a> tag:
 * ------------------------------------------------------------------------
 * • target="_self" (Default): Same tab.
 * • target="_blank": New tab (pair with rel="noopener noreferrer").
 * • target="_parent": Parent frame.
 * • target="_top": Full window top frame.
 */
const q15_example = `<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>`;

/**
 * 16) Ways to specify CSS styles for HTML elements:
 * ------------------------------------------------------------------------
 * 1. Inline styles (style="")
 * 2. Internal stylesheet (<style> in <head>)
 * 3. External stylesheet (<link rel="stylesheet" href="...">)
 */
const q16_example = `<link rel="stylesheet" href="styles.css">`;

/**
 * 17) Difference between <link> tag and <a> tag:
 * ------------------------------------------------------------------------
 * • <link>: Head metadata resource link. Void element. Non-clickable.
 * • <a>: Body clickable hyperlink. Non-void element. Interactive.
 */
const q17_example = `<link rel="stylesheet" href="theme.css">
<a href="/login">Login</a>`;

/**
 * 18) When to use scripts in head vs scripts in body?
 * ------------------------------------------------------------------------
 * • <script src="app.js" defer></script> in <head>: Downloads in background, executes in order after DOM parse.
 * • <script src="tracking.js" async></script> in <head>: Downloads in background, executes immediately when ready.
 * • <script src="main.js"></script> at </body>: Historical fallback before defer/async.
 */
const q18_example = `<script src="app.js" defer></script>`;

/**
 * 19) Forms & Default Form Behaviors:
 * ------------------------------------------------------------------------
 * • Creation: <form action="/api" method="POST"> <input name="user"/> <button type="submit">Submit</button> </form>
 * • Defaults: Page reload on submit, GET appends query string, ENTER key triggers submit. Prevent via e.preventDefault().
 */
const q19_example = `document.querySelector('form').addEventListener('submit', (e) => e.preventDefault());`;

/**
 * 20) How to handle events in HTML:
 * ------------------------------------------------------------------------
 * 1. Inline (onclick="")
 * 2. DOM Property (element.onclick = fn)
 * 3. addEventListener('click', fn) (Modern standard)
 */
const q20_example = `element.addEventListener('click', (e) => console.log('Clicked!', e.target));`;

/**
 * 21) Advantages of HTML5:
 * ------------------------------------------------------------------------
 * Semantic elements, native <audio>/<video>, Web Storage (localStorage/sessionStorage), Canvas/SVG, Web Workers, WebSockets, Geolocation, Drag & Drop.
 */
const q21_example = `<video controls src="movie.mp4"></video>`;

/**
 * 22) Including Audio and Video:
 * ------------------------------------------------------------------------
 * Use <video controls poster="..."> and <audio controls> with nested <source> tags.
 */
const q22_example = `<video controls width="640">
  <source src="movie.mp4" type="video/mp4">
</video>`;

/**
 * 23) Semantic Elements:
 * ------------------------------------------------------------------------
 * <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>, <figure>, <figcaption>, <time>, <mark>.
 */
const q23_example = `<article>
  <header><h1>Blog Title</h1></header>
  <p>Body text</p>
</article>`;

/**
 * 24) Significant goals of HTML5 specification:
 * ------------------------------------------------------------------------
 * Eliminate third-party plugins (Flash), standardize browser parsing/error handling, mobile-first performance, rich Web APIs, enhanced accessibility.
 */
const q24_example = `<!DOCTYPE html>`;


/**
 * ========================================================================
 * SECTION 3: HTML5 STORAGE, MEDIA, APIS & CSS SPECIFICITY
 * ========================================================================
 * 
 * 25) Web Storage in HTML5:
 * ------------------------------------------------------------------------
 * • localStorage: Persistent across browser restarts, ~5-10MB limit.
 * • sessionStorage: Tab session lifetime (cleared when tab closes), ~5MB.
 * • Cookies: Sent on every HTTP request header, ~4KB.
 */
const q25_example = `localStorage.setItem('theme', 'dark');`;

/**
 * 26) <header> and <h1> relationship in HTML5:
 * ------------------------------------------------------------------------
 * HTML5 allows multiple <header> elements and localized <h1> tags inside sectioning containers (<article>, <section>).
 */
const q26_example = `<article><header><h1>Article Title</h1></header></article>`;

/**
 * 27) New Media Tags in HTML5:
 * ------------------------------------------------------------------------
 * <video>, <audio>, <source>, <track>, <picture>, <embed>.
 */
const q27_example = `<track src="subs.vtt" kind="subtitles">`;

/**
 * 28) Drag and Drop in HTML5:
 * ------------------------------------------------------------------------
 * Set draggable="true" on image and handle dragstart event.
 */
const q28_example = `<img src="pic.jpg" draggable="true" ondragstart="event.dataTransfer.setData('text', event.target.id)">`;

/**
 * 29) Web Workers:
 * ------------------------------------------------------------------------
 * Background multithreading in JavaScript to prevent main UI thread blocking.
 */
const q29_example = `const worker = new Worker('worker.js');
worker.postMessage('start');`;

/**
 * 30) Responsive Image Approaches:
 * ------------------------------------------------------------------------
 * 1. Fluid CSS: img { max-width: 100%; height: auto; }
 * 2. <picture> element with <source media="(min-width: 768px)" srcset="...">
 * 3. srcset and sizes attributes on <img>
 * 4. CSS object-fit: cover|contain
 */
const q30_example = `img { width: 100%; height: 300px; object-fit: cover; }`;

/**
 * 31) Manifest File in HTML5:
 * ------------------------------------------------------------------------
 * Web App Manifest (manifest.json) for Progressive Web Apps (PWA icons, colors, display mode).
 */
const q31_example = `{ "name": "App", "start_url": "/", "display": "standalone" }`;

/**
 * 32) LocalStorage vs SessionStorage:
 * ------------------------------------------------------------------------
 * LocalStorage persists permanently; SessionStorage clears when tab closes.
 */
const q32_example = `sessionStorage.setItem('key', 'val');`;

/**
 * 33) When to use cookies?:
 * ------------------------------------------------------------------------
 * Authentication session tokens (HttpOnly, Secure, SameSite=Strict) and data needed by backend server on HTTP request headers.
 */
const q33_example = `Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict`;

/**
 * 34) What is Specificity in CSS?
 * ------------------------------------------------------------------------
 * Specificity Formula: (Inline, ID, Class, Element)
 * 1. Inline Style: style="" -> (1, 0, 0, 0)
 * 2. ID Selector: #nav -> (0, 1, 0, 0)
 * 3. Class / Attribute / Pseudo-class: .btn, [type="text"], :hover -> (0, 0, 1, 0)
 * 4. Element / Pseudo-element: div, p, ::before -> (0, 0, 0, 1)
 */
const q34_example = `#header { color: red; } /* (0,1,0,0) beats .nav .link (0,0,2,0) */`;


/**
 * ========================================================================
 * SECTION 4: CSS BOX MODEL, FLEXBOX & ADVANCED CSS
 * ========================================================================
 * 
 * 35) Box Model in CSS:
 * ------------------------------------------------------------------------
 * Content -> Padding -> Border -> Margin.
 * box-sizing: border-box includes padding & border inside specified width.
 */
const q35_example = `* { box-sizing: border-box; }`;

/**
 * 36) Aligning Block Element Inside Another Element:
 * ------------------------------------------------------------------------
 * Flexbox: display: flex; justify-content: center; align-items: center;
 * Grid: display: grid; place-items: center;
 * Margin: margin: 0 auto;
 */
const q36_example = `.center-container { display: flex; justify-content: center; align-items: center; }`;

/**
 * 37) Shadow DOM:
 * ------------------------------------------------------------------------
 * Encapsulated DOM tree isolated from main document CSS and scripts.
 */
const q37_example = `const shadow = element.attachShadow({ mode: 'open' });`;

/**
 * 38) Building a Triangle in CSS:
 * ------------------------------------------------------------------------
 * 0px width/height element with transparent borders on 3 sides and color on 1 side.
 */
const q38_example = `.triangle-up {
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid #3b82f6;
}`;

/**
 * 39) Pseudo-elements:
 * ------------------------------------------------------------------------
 * ::before, ::after, ::first-letter, ::first-line, ::placeholder, ::selection.
 */
const q39_example = `.badge::before { content: '★ '; color: gold; }`;

/**
 * 40) Data Attributes:
 * ------------------------------------------------------------------------
 * Custom data-* attributes on HTML elements accessed via element.dataset in JS or [data-*] in CSS.
 */
const q40_example = `<button data-role="admin">Admin</button>`;

/**
 * 41) z-index & Stacking Context:
 * ------------------------------------------------------------------------
 * Controls 3D z-axis stacking depth for positioned elements (relative, absolute, fixed, sticky) or flex/grid items.
 */
const q41_example = `.modal { position: fixed; z-index: 1000; }`;

/**
 * 42) Flexbox Centering & Properties:
 * ------------------------------------------------------------------------
 * Container: flex-direction, flex-wrap, justify-content, align-items, gap.
 * Items: flex-grow, flex-shrink, flex-basis, flex, align-self, order.
 */
const q42_example = `.screen-center { display: flex; justify-content: center; align-items: center; min-height: 100vh; }`;

/**
 * 43) CSS Selectors Combinator Reference:
 * ------------------------------------------------------------------------
 * • div, p  : Comma grouping (ALL divs AND ALL ps).
 * • div p   : Descendant selector (ALL ps inside div at ANY depth).
 * • div > p : Direct child selector (ONLY immediate ps of div).
 * • div + p : Adjacent sibling selector (single p immediately after div).
 * • div ~ p : General sibling selector (ALL ps following div).
 */
const q43_example = `div > p { color: blue; }`;

/**
 * 44) Viewport Units & Revision Resources:
 * ------------------------------------------------------------------------
 * • VH/VW: Viewport height / width percentage.
 * • !important: Overrides cascade specificity calculation.
 * • Resources: JavaTpoint & InterviewBit CSS interview questions.
 */
const q44_example = `body { font-family: 'Inter', sans-serif; }`;
