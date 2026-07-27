/**
 * ========================================================================
 * FRONTEND INTERVIEW MASTERCLASS: HTML & CSS QUESTIONS & ANSWERS (MAX DETAIL HINGLISH)
 * ========================================================================
 * NOTES:
 * - Direct, maximum-depth Hinglish answers for all 44 HTML & CSS interview questions.
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
 */


/**
 * ========================================================================
 * 1) Are HTML tags and elements the same thing?
 * ========================================================================
 * NO! HTML Tags aur HTML Elements related hain, par exact SAME nahi hain.
 * 
 * • HTML TAG: Angle brackets (<>) ke andar syntax delimiters jo element ki start ya end boundary mark karte hain (e.g. <p>, </p>, <div id="app">).
 * • HTML ELEMENT: Complete DOM Node structure — Opening Tag + Attributes + Inner Content + Closing Tag!
 * 
 * VISUAL SYNTAX ANATOMY:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                      HTML ELEMENT                           │
 * │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ │
 * │  │  Opening Tag │  │ Inner Content │  │   Closing Tag    │ │
 * │  │ <p class="x">│  │ Hello World!  │  │      </p>        │ │
 * │  └──────────────┘  └───────────────┘  └──────────────────┘ │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * DOM NODE REPRESENTATION IN JAVASCRIPT:
 * - Browser engine Jab HTML parse karta hai, to tag strings ko Object DOM Nodes me convert karta hai.
 * - Node.ELEMENT_NODE (nodeType = 1): Represents HTML Element (<p>).
 * - Node.TEXT_NODE (nodeType = 3): Represents inner text inside element.
 * 
 * INTERVIEW ME KYA BOLNA HAI (Core Difference):
 * - Tag sirf ek syntax marker/string delimiter hai.
 * - Element poora living DOM Node Object hai jisme content, properties, styling aur event listeners attach hote hain.
 * - Exception: Void elements (e.g. <img>, <input>) jinke andar content ya closing tag NAHI hota!
 */
const q1_example = `// 1. Tag Syntax String:
// "<p>" (Opening Tag) and "</p>" (Closing Tag)

// 2. Complete HTML Element String:
const elementHTML = '<p class="highlight" id="msg">Hello World!</p>';

// 3. DOM Node Object Creation in JavaScript:
const pElement = document.createElement('p'); // Creates an HTML Element Node
pElement.className = 'highlight';
pElement.id = 'msg';
pElement.textContent = 'Hello World!';
document.body.appendChild(pElement);`;


/**
 * ========================================================================
 * 2) What are tags and attributes in HTML?
 * ========================================================================
 * • TAGS: Angle brackets ke andar special keywords jo HTML DOM Structure build karte hain aur browser engine ko batate hain content ko KAISE parse & render karna hai (e.g. <h1>, <p>, <a>, <form>).
 * • ATTRIBUTES: Opening tag ke andar key-value pairs (name="value") jo element ko extra metadata, behaviors, styling, ya identifier hooks provide karte hain.
 * 
 * DETAILED ATTRIBUTE CATEGORIES:
 * 1. Global Attributes: Har element pe apply ho sakte hain.
 *    - id: Unique page identifier.
 *    - class: Reusable group styling class.
 *    - style: Inline CSS rules.
 *    - title: Tooltip text on hover.
 *    - tabindex: Keyboard navigation order control.
 *    - data-*: Custom application data attributes.
 *    - hidden, lang, dir, contenteditable.
 * 
 * 2. Media & Asset Attributes: Specific to media elements.
 *    - src, alt, href, target, rel, loading, poster, srcset, sizes.
 * 
 * 3. Form Control Attributes: Specific to input controls.
 *    - type, placeholder, value, name, min, max, pattern, autocomplete.
 * 
 * 4. Boolean Attributes: Attribute ki presence hi true hoti hai. Value dena optional hai.
 *    - disabled, required, readonly, checked, autofocus, multiple.
 * 
 * DOM ATTRIBUTES VS PROPERTIES DIFFERENCE:
 * - HTML Attribute: HTML source code me likha initial key-value string (e.g. input.getAttribute('value')).
 * - DOM Property: JS Memory me living object property jo user typing ke saath real-time updates hold karti hai (e.g. input.value).
 */
const q2_example = `<!-- 1. Tag: <a> with Global, Media & Security Attributes -->
<a href="https://developer.mozilla.org" 
   target="_blank" 
   rel="noopener noreferrer"
   class="btn btn-primary" 
   id="docs-link"
   title="Visit MDN Web Docs"
   data-analytics-id="link_123">
   Read Documentation
</a>

<!-- 2. Tag: <input> with Form & Boolean Attributes -->
<input type="text" name="username" value="JohnDoe" disabled required>`;


/**
 * ========================================================================
 * 3) What are void elements in HTML?
 * ========================================================================
 * Void elements (jinko self-closing ya empty elements bhi bolte hain) wo HTML elements hain jinke ANDAR koi text ya child nodes NAHI aa sakte, aur inka closing tag (</tagname>) NAHI hota!
 * 
 * COMPLETE LIST OF VOID ELEMENTS IN HTML5 (All 13 Elements):
 * ┌──────────────┬────────────────────────────────────────────────────────────────────────┐
 * │ Void Element │ Primary Purpose & Real-World Use Case                                  │
 * ├──────────────┼────────────────────────────────────────────────────────────────────────┤
 * │ <img>        │ Embeds image assets into document (<img src="a.jpg" alt="a">)          │
 * │ <input>      │ Form input control (<input type="text">)                               │
 * │ <br>         │ Line break in text flow                                                │
 * │ <hr>         │ Horizontal rule / thematic section break                               │
 * │ <meta>       │ Page metadata (charset, viewport, SEO tags, OpenGraph)                 │
 * │ <link>       │ External resources link (CSS stylesheets, favicons, fonts, preloads)   │
 * │ <source>     │ Media resources for <audio>, <video>, and <picture>                    │
 * │ <area>       │ Clickable region inside an image map (<map>)                           │
 * │ <base>       │ Base URL specifies relative links target                               │
 * │ <col>        │ Table column formatting property (<colgroup>)                          │
 * │ <embed>      │ External plugin container (PDFs, Flash legacy)                         │
 * │ <track>      │ Subtitles & text tracks for <video> and <audio>                        │
 * │ <wbr>        │ Word break opportunity (suggested line wrap point for long words)     │
 * └──────────────┴────────────────────────────────────────────────────────────────────────┘
 * 
 * INTERVIEW GOTCHAS:
 * 1. Trailing Slash Syntax (<img /> vs <img>): HTML5 parser me trailing slash <img /> optional / syntactic sugar hai XHTML legacy se. Both parse identically.
 * 2. Pseudo-Elements Trap (::before / ::after): Void elements pe CSS ::before aur ::after KAAM NAHI KARTE! Why? Kyunki void elements ke pass inner container content area nahi hota jahan pseudo-element insert ho sake!
 */
const q3_example = `<!-- Standard HTML5 Void Elements -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="styles.css">

<img src="avatar.webp" alt="User avatar" width="80" height="80">
<input type="email" name="email" placeholder="Enter email" required>
<hr>
<br>`;


/**
 * ========================================================================
 * 4) What are different types of lists in HTML? Explain the difference
 * ========================================================================
 * HTML me grouped items present karne ke liye 3 distinct list structures hain:
 * 
 * 1. Unordered List (<ul>):
 *    - Bullet points (discs, circles, squares) display karta hai.
 *    - Items ka sequential order matter NAHI karta (e.g. Navigation menus, feature bullet lists, tag lists).
 *    - Direct Child Tag: Strictly <li> (List Item).
 * 
 * 2. Ordered List (<ol>):
 *    - Sequential numbers, letters, ya Roman numerals display karta hai.
 *    - Items ka order IMPORTANT & SIGNIFICANT hota hai (e.g. Recipe steps, algorithm instructions, leaderboard rankings).
 *    - Attributes:
 *      • type="1|a|A|i|I": Numbering style (digits, lowercase/uppercase letters, Roman numerals).
 *      • start="5": Starting number index set karta hai.
 *      • reversed: Reverse order counting down karta hai.
 *    - Direct Child Tag: Strictly <li>.
 * 
 * 3. Description / Definition List (<dl>):
 *    - Key-Value term aur definition pairs represent karne ke liye use hota hai.
 *    - Direct Child Tags:
 *      • <dt>: Description Term (Key).
 *      • <dd>: Description Details (Value).
 *    - Perfect Use Cases: Glossaries, FAQs, Product technical specifications, Key-Value metadata lists.
 */
const q4_example = `<!-- 1. Unordered List (Navigation Menu) -->
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
  </ul>
</nav>

<!-- 2. Ordered List (Step-by-Step Instructions) -->
<ol type="1" start="1" reversed>
  <li>Finalize build deployment</li>
  <li>Execute test suite</li>
</ol>

<!-- 3. Description List (Technical Specifications) -->
<dl>
  <dt>CPU</dt>
  <dd>Apple M3 Max 16-Core</dd>
  <dt>RAM</dt>
  <dd>64GB Unified Memory</dd>
</dl>`;


/**
 * ========================================================================
 * 5) What is the "class" attribute in HTML? What is the difference between "id" and "class"?
 * ========================================================================
 * • CLASS Attribute: Non-unique group classifier hai. Same class name multiple elements pe share ki ja sakti hai shared CSS styling ya JS group event handling ke liye. Ek element me space-separated multiple classes laga sakte ho (class="btn btn-primary btn-lg").
 * 
 * • ID Attribute: Unique page identifier hai. Pure DOM document tree pe ID strictly UNIQUE honi chahiye. Ek element pe sirf EK ID assign ho sakti hai.
 * 
 * DETAILED 7-POINT COMPARISON MATRIX:
 * ┌─────────────────────┬────────────────────────────────────┬────────────────────────────────────┐
 * │ Feature / Property  │ class Attribute                    │ id Attribute                       │
 * ├─────────────────────┼────────────────────────────────────┼────────────────────────────────────┤
 * │ DOM Uniqueness      │ Non-unique. Multiple items share   │ MUST be unique across entire DOM   │
 * │ Multiple Values     │ Allowed (class="card dark active") │ Single value only (id="user-profile")│
 * │ CSS Selector        │ .classname (dot prefix)            │ #idname (hash prefix)              │
 * │ Specificity Weight  │ Weight: (0, 0, 1, 0)               │ Weight: (0, 1, 0, 0) (Much Higher!)│
 * │ JS Selection        │ getElementsByClassName(), queryAll │ getElementById(), querySelector    │
 * │ Anchor Hash Link    │ Cannot be target of URL hash (#)   │ Serves as hash target (#section-1) │
 * │ Form Label Binding  │ Cannot bind to <label for="...">   │ Directly binds via <label for="id">│
 * └─────────────────────┴────────────────────────────────────┴────────────────────────────────────┘
 * 
 * GOLDEN RULE FOR FRONTEND DEVELOPERS:
 * - CSS Styling ke liye HAMESHA CLASS use karo (reusable, modular, low specificity).
 * - ID ko CSS styling ke liye AVOID karo kyunki iska high specificity weight CSS overriding hard bana deta hai. ID ko sirf form label binding, unique URL hash anchors, aur JS singleton hooks ke liye rakho!
 */
const q5_example = `<!-- Reusable Class Styling -->
<button class="btn btn-primary btn-lg">Submit Form</button>
<button class="btn btn-danger btn-sm">Cancel</button>

<!-- Unique ID for Form Label & URL Anchor -->
<section id="contact-section">
  <form>
    <label for="user-email">Email Address:</label>
    <input type="email" id="user-email" name="email">
  </form>
</section>`;


/**
 * ========================================================================
 * 6) How to optimize website assets loading?
 * ========================================================================
 * Website speed & Core Web Vitals (LCP - Largest Contentful Paint, FID/INP - Input Responsiveness, CLS - Cumulative Layout Shift) improve karne ke 5 core techniques:
 * 
 * 1. IMAGE OPTIMIZATION & RESPONSIVE SWITCHING:
 *    - Next-Gen Formats: WebP & AVIF formats PNG/JPEG se 30-50% chhote hote hain.
 *    - Resolution Switching (srcset & sizes):
 *      • srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w" -> Browser ko image width descriptors (400w, 800w, 1200w) batata hai.
 *      • sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" -> Browser screen width + Device Pixel Ratio (DPR 2x/3x Retina) calculate karke EXACT optimal resolution image auto-download karta hai!
 *    - Art Direction (<picture> Element): Mobile ke liye square crop (<source media="(max-width: 600px)" srcset="mobile.jpg">) vs Desktop wide landscape.
 *    - Native Lazy Loading: <img loading="lazy"> -> Below-the-fold offscreen images scroll hone par fetch hongi. Hero images par loading="eager" lagao!
 *    - Layout Shift Prevention (CLS): Explicit width & height (e.g. width="800" height="450") & CSS aspect-ratio box dimensions reserve karta hai.
 * 
 * 2. SCRIPT LOADING STRATEGIES (defer vs async vs sync):
 *    - Sync <script src="...">: DOM parsing STOP ho jati hai, browser network fetch karta hai, execute karta hai, fir parse start karta hai (Blank White Screen!).
 *    - <script src="..." defer>: Background me parallel download, DOM parse hone ke BAAD strictly order me execute (BEST for app bundles like app.js!).
 *    - <script src="..." async>: Background me parallel download, download hote hi IMMEDIATELY execute (DOM parse pause, order NOT guaranteed - Analytics / Ads / Tracking ke liye!).
 * 
 * 3. RESOURCE HINTS (<head>):
 *    - <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>: High priority critical assets ko immediate fetch karne ka hint.
 *    - <link rel="preconnect" href="https://fonts.googleapis.com">: Early DNS lookup, TCP handshake, TLS negotiation establish karta hai remote servers ke saath.
 *    - <link rel="dns-prefetch" href="https://cdn.example.com">: Remote domain name lookup pehle se resolve kar leta hai.
 * 
 * 4. MINIFICATION & SERVER COMPRESSION:
 *    - CSS, JS, HTML minify (whitespace & comments remove).
 *    - Nginx/Cloudflare server pe Gzip / Brotli compression turn on (size ~70% reduce!).
 * 
 * 5. HTTP CACHING & CDN DELIVERY:
 *    - Static assets CDN edge servers se serve karo.
 *    - Cache-Control headers set karo (max-age=31536000, immutable).
 */
const q6_example = `<!-- 1. Resource Hints & Script Execution in <head> -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- App JS: Parallel fetch, executes after DOM parse in order -->
  <script src="/js/app.js" defer></script>

  <!-- Tracking JS: Parallel fetch, executes immediately ready hote hi -->
  <script src="https://analytics.com/track.js" async></script>
</head>

<body>
  <!-- 2. Responsive Image with srcset, sizes, lazy loading & CLS prevention -->
  <img 
    src="medium.jpg" 
    srcset="
      small.jpg 400w,
      medium.jpg 800w,
      large.jpg 1200w
    "
    sizes="
      (max-width: 600px) 100vw,
      (max-width: 900px) 50vw,
      33vw
    "
    alt="Optimized Banner Image" 
    loading="lazy"
    width="800" 
    height="450"
    style="aspect-ratio: 16/9; width: 100%; height: auto;"
  />

  <!-- 3. Art Direction via <picture> element -->
  <picture>
    <source media="(max-width: 600px)" srcset="hero-mobile-square.avif" type="image/avif">
    <source media="(min-width: 1024px)" srcset="hero-desktop-wide.avif" type="image/avif">
    <img src="hero-fallback.jpg" alt="Hero Section" loading="eager" width="1200" height="600">
  </picture>
</body>`;


/**
 * ========================================================================
 * 7) What is the difference between <strong>, <b> tags and <em>, <i> tags?
 * ========================================================================
 * Ye VISUAL FORMATTING vs SEMANTIC ACCESSIBILITY ka main difference hai!
 * 
 * 1. <b> VS <strong>:
 *    - <b> (Bring Attention To): Purely PRESENTATIONAL bold text. Document me visually bold dikhane ke liye bina kisi semantic importance ke (e.g. keywords in summary, product names). Screen readers ispe voice tone alter NAHI karte.
 *    - <strong> (Strong Importance): SEMANTIC importance, urgency, ya serious alert convey karta hai. Screen readers text ko higher volume aur emphasis ke saath padhte hain!
 * 
 * 2. <i> VS <em>:
 *    - <i> (Idiomatic Text): Purely PRESENTATIONAL italic text. Technical terms, foreign phrases (Latin phrases like ad hoc), book titles, ya internal thoughts dikhane ke liye. Screen readers pe voice inflection change NAHI hota.
 *    - <em> (Stress Emphasis): SEMANTIC emphasis. Sentence me verbal tone aur verbal stress introduce karta hai. Emphasized word ke change hone se sentence ka MEANING Badal jata hai!
 * 
 * SUMMARY MATRIX:
 * ┌──────────┬─────────────────────────┬────────────────────────────────────────────────────────┐
 * │ Tag      │ Primary Nature          │ Screen Reader & SEO Behavior                           │
 * ├──────────┼─────────────────────────┼────────────────────────────────────────────────────────┤
 * │ <b>      │ Presentational (Bold)   │ Visual bold only. NO voice tone change on screen reader│
 * │ <strong> │ Semantic (Importance)   │ Visual bold + Screen reader reads with higher volume   │
 * │ <i>      │ Presentational (Italic) │ Visual italic. Technical/foreign terms. NO voice change│
 * │ <em>     │ Semantic (Stress)       │ Visual italic + Screen reader alters verbal stress tone│
 * └──────────┴─────────────────────────┴────────────────────────────────────────────────────────┘
 */
const q7_example = `<!-- Presentational Bolding & Italics -->
<p>Available colors: <b>Red</b> and <b>Blue</b>.</p>
<p>The Latin term <i>ad hoc</i> means created for a task.</p>

<!-- Semantic Urgency & Verbal Stress Emphasis -->
<p><strong>ALERT:</strong> Do not turn off server power!</p>

<p>I <em>never</em> said she stole money. (Emphasizes "never")</p>
<p>I never said <em>she</em> stole money. (Emphasizes "she")</p>`;


/**
 * ========================================================================
 * 8) What is the significance of <head> and <body> tags in HTML?
 * ========================================================================
 * HTML Document 2 main architectural root elements me divided hota hai inside <html>:
 * 
 * 1. <head> TAG (Document Metadata Container):
 *    - Background instructions, metadata, configurations, external assets import, aur SEO tags hold karta hai.
 *    - Browser screen canvas viewport pe DIKHTA NAHI hai!
 *    - Crucial Child Tags inside <head>:
 *      • <title>: Browser tab bar title and Google Search SERP headline.
 *      • <meta charset="UTF-8">: Document character encoding (supports all international symbols & emojis).
 *      • <meta name="viewport" content="width=device-width, initial-scale=1.0">: Mobile responsive layout scaling.
 *      • <meta name="description">: SEO page summary snippet.
 *      • OpenGraph Meta (<meta property="og:title">): Social media preview cards (LinkedIn, Twitter, WhatsApp).
 *      • <link>: Stylesheets, favicons, web fonts, preloads, canonical URLs.
 *      • <script>: Application JS scripts.
 * 
 * 2. <body> TAG (Rendered Canvas Container):
 *    - Visual page payload hold karta hai jo browser window screen pe user ko directly render hota hai.
 *    - Crucial Child Tags inside <body>: <header>, <nav>, <main>, <article>, <section>, <footer>, <h1>-<h6>, <p>, <img>, <form>, <table>, <button>.
 */
const q8_example = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Metadata (Screen pe render NAHI hota) -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Frontend Interview Masterclass">
  <title>HTML & CSS Interview Masterclass</title>
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body>
  <!-- Visible Canvas (Screen pe render hota hai) -->
  <header><h1>Masterclass Guide</h1></header>
  <main><p>Rendered content paragraph.</p></main>
</body>
</html>`;


/**
 * ========================================================================
 * 9) Can we display a web page inside a web page or Is nesting of webpages possible?
 * ========================================================================
 * HAAN! <iframe> (Inline Frame) element se ek HTML webpage ke andar doosra external HTML webpage embed / nest kar sakte hain.
 * 
 * <iframe> KEY ATTRIBUTES & CONFIGURATIONS:
 * • src="https://example.com": Target document URL.
 * • width & height: Dimensions in px or %.
 * • title="Description": Screen reader accessibility ke liye MANDATORY description text!
 * • loading="lazy": Offscreen iframe load defer karta hai.
 * • sandbox: Strict security restrictions apply karta hai embedded iframe content pe:
 *   - sandbox="" (Strict: JavaScript, forms, same-origin storage, popups ALL BLOCKED!).
 *   - sandbox="allow-scripts allow-same-origin allow-forms": Selective permission flags.
 * 
 * CLICKJACKING ATTACK & SECURITY HEADERS:
 * Malicious websites aapki website ko invisible <iframe> me overlay karke user clicks hijack kar sakti hain (Clickjacking).
 * Websites block kar sakti hain iframe embedding using server HTTP headers:
 * 1. X-Frame-Options: DENY (Framing completely blocked) | SAMEORIGIN (Only same domain framing allowed).
 * 2. Content-Security-Policy: frame-ancestors 'none' (Modern CSP standard).
 */
const q9_example = `<!-- Embedded YouTube Video Player / Google Map Iframe -->
<iframe 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  width="560" 
  height="315" 
  title="YouTube video player" 
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  allowfullscreen>
</iframe>`;


/**
 * ========================================================================
 * 10) What are inline elements? What are block level elements? What is the difference between them?
 * ========================================================================
 * CSS visual formatting model me elements ke default rendering display behaviors:
 * 
 * 1. BLOCK-LEVEL ELEMENTS:
 *    - HAMESHA new line pe shuru hote hain.
 *    - Parent container ki full 100% width automatically occupy karte hain.
 *    - Custom width, height, top/bottom margins, aur top/bottom padding fully RESPECT karte hain.
 *    - Examples: <div>, <p>, <h1>-<h6>, <section>, <article>, <header>, <footer>, <ul>, <ol>, <form>, <table>.
 * 
 * 2. INLINE ELEMENTS:
 *    - New line pe start NAHI hote (text ke saath horizontal line flow me fit hote hain).
 *    - Sirf apni inner content text jitni width occupy karte hain.
 *    - Custom width aur height IGNORE karte hain! Top/bottom margins aur padding layout line-height height push NAHI kar sakte!
 *    - Examples: <span>, <a>, <strong>, <em>, <code>, <label>, <mark>, <small>.
 * 
 * 3. INLINE-BLOCK ELEMENTS (display: inline-block):
 *    - HYBRID BEHAVIOR! Text ki tarah horizontal line me flow karta hai, BUT custom width, height, vertical margins, aur padding fully SUPPORT karta hai!
 *    - Native Examples: <img>, <button>, <input>, <select>, <textarea>.
 * 
 * 5-POINT COMPARISON TABLE:
 * ┌─────────────────────────┬───────────────────────────────┬───────────────────────────────┬───────────────────────────────┐
 * │ Feature                 │ Block Elements                │ Inline Elements               │ Inline-Block Elements         │
 * ├─────────────────────────┼───────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
 * │ New Line Generation     │ ALWAYS starts on a new line   │ NO new line (flows inline)    │ NO new line (flows inline)    │
 * │ Width Occupation        │ 100% parent container width   │ Content width only            │ Content width only            │
 * │ Custom Width & Height   │ RESPECTED                     │ IGNORED!                      │ RESPECTED                     │
 * │ Vertical Margin/Padding │ Full layout push support      │ Top/Bottom push IGNORED       │ Full layout push support      │
 * │ Common Examples         │ <div>, <p>, <h1>, <section>   │ <span>, <a>, <strong>, <em>   │ <img>, <button>, <input>      │
 * └─────────────────────────┴───────────────────────────────┴───────────────────────────────┴───────────────────────────────┘
 */
const q10_example = `.block-element {
  display: block;
  width: 100%;
  padding: 16px;
}

.inline-element {
  display: inline;
  color: blue;
  /* width: 200px;  <-- IGNORED! */
  /* margin-top: 20px; <-- IGNORED! */
}

.inline-block-element {
  display: inline-block;
  width: 140px;      /* Respected! */
  height: 40px;      /* Respected! */
}`;


/**
 * ========================================================================
 * 11) Position attributes and exact differences (static, relative, absolute, fixed, sticky)
 * ========================================================================
 * CSS position property decide karti hai element layout me KAHAN placed hoga.
 * Offset properties (top, right, bottom, left) aur z-index TABHI kaam karte hain jab position static NAHI hai!
 * 
 * 1. static (Default):
 *    - Normal document flow order. top/left/right/bottom aur z-index properties IGNORED hote hain.
 * 
 * 2. relative:
 *    - Normal flow me space PRESERVED rehti hai (surrounding elements collapse nahi hote).
 *    - Apni ORIGINAL position se offset hota hai.
 *    - Absolute children ke liye ANCHOR parent (containing block) banta hai!
 * 
 * 3. absolute:
 *    - Normal document flow se REMOVED (0 space reserved, surrounding elements collapse hoke floor occupy kar lete hain).
 *    - Nearest non-static containing ancestor (relative/absolute/fixed) ke relative position hota hai. Agar koi non-static parent nahi milta to <html> root document se position hota hai.
 * 
 * 4. fixed:
 *    - Normal flow se REMOVED.
 *    - Browser VIEWPORT window ke relative fixed position hota hai. User scroll kare tab bhi same spot pe fixed rehta hai!
 * 
 * 5. sticky:
 *    - HYBRID BEHAVIOR! Normal scroll me relative ki tarah behave karta hai jab tak specified scroll threshold (e.g. top: 0) reach na ho. Threshold reach hote hi container boundary ke andar fixed act karne lagta hai!
 */
const q11_example = `/* 1. Relative Anchor Parent */
.card-parent {
  position: relative;
  width: 300px;
  height: 200px;
}

/* 2. Absolute Child Badge */
.badge-child {
  position: absolute;
  top: -10px;
  right: -10px;
}

/* 3. Fixed Navbar Header */
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* 4. Sticky Table Column Header */
.table-header-sticky {
  position: sticky;
  top: 0;
}`;


/**
 * ========================================================================
 * SECTION 2: POSITIONING, TARGET, FORMS, EVENTS & SEMANTIC HTML5
 * ========================================================================
 */


/**
 * ========================================================================
 * 12) What is the difference between position absolute and relative?
 * ========================================================================
 * MAIN DIFFERENCE: Document flow status aur reference origin point!
 * 
 * DETAILED COMPARISON TABLE:
 * ┌─────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────┐
 * │ Feature                 │ position: relative                       │ position: absolute                       │
 * ├─────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
 * │ Document Flow           │ Stays inside document flow               │ Completely REMOVED from layout flow      │
 * │ Layout Space            │ Original layout space is RESERVED        │ Zero space reserved (surrounding items collapse)│
 * │ Offset Base Point       │ Offsets relative to its OWN default spot │ Offsets relative to nearest non-static parent │
 * │ Containing Anchor Role  │ Serves as anchor parent for absolute kids│ Looks up DOM tree for nearest non-static │
 * └─────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
 */
const q12_example = `/* Relative Parent + Absolute Child Pattern (Avatar Status Dot) */
.avatar-container {
  position: relative; /* Anchor Parent */
  width: 64px;
  height: 64px;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;           /* Locked to bottom-right corner of avatar */
  width: 14px;
  height: 14px;
  background-color: #22c55e;
  border-radius: 50%;
}`;


/**
 * ========================================================================
 * 13) In how many ways can you display HTML elements?
 * ========================================================================
 * CSS display property outer & inner formatting context define karti hai:
 * 
 * • block: 100% width, new line (<div>, <p>).
 * • inline: Content width, same line (<span>, <a>).
 * • inline-block: Inline flow + custom width/height support.
 * • flex: 1-Dimensional Flexbox layout engine (rows OR columns).
 * • inline-flex: Flex container jo inline flow karta hai.
 * • grid: 2-Dimensional Grid layout engine (rows AND columns).
 * • inline-grid: Grid container jo inline flow karta hai.
 * • none: Completely removes element from DOM render tree (0 space).
 * • contents: Container box gayab, children direct parent me render hote hain.
 * • table / table-row / table-cell: Classic HTML table formatting emulator.
 */
const q13_example = `.container-flex { display: flex; gap: 16px; }
.container-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
.hidden-element  { display: none; }`;


/**
 * ========================================================================
 * 14) What is the difference between "display: none" and "visibility: hidden"?
 * ========================================================================
 * Dono element ko screen pe visual hide karte hain, par layout aur render engine execution me completely ALAG hain:
 * 
 * DETAILED COMPARISON TABLE:
 * ┌─────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────┐
 * │ Feature                 │ display: none                            │ visibility: hidden                       │
 * ├─────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
 * │ Layout Space            │ Completely REMOVED (0px width/height)    │ Space RESERVED (blank invisible box)     │
 * │ DOM Render Tree         │ Element removed from DOM render tree     │ Element stays in render tree (blank paint)│
 * │ Performance             │ Triggers REFLOW + REPAINT (Expensive!)   │ Triggers REPAINT only (Cheaper performance!)│
 * │ Child Visibility        │ Children CANNOT be made visible          │ Child visibility: visible CAN override!  │
 * │ Accessibility           │ Completely hidden from screen readers    │ Screen readers may still encounter space │
 * └─────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
 */
const q14_example = `.tab-inactive { display: none; }           /* 0px space */
.ghost-box { visibility: hidden; }       /* Space reserved */

/* Child override trick with visibility */
.parent-hidden { visibility: hidden; }
.parent-hidden .child { visibility: visible; } /* Child displays! */`;


/**
 * ========================================================================
 * 15) Target attribute in <a> tag: Permissible values & security
 * ========================================================================
 * Target attribute specifies link click karne par destination document KAHAN open hoga:
 * 
 * 1. PERMISSIBLE VALUES:
 *    • _self (Default): Same tab/frame me link open karta hai.
 *    • _blank: Nayi tab ya window me open karta hai.
 *    • _parent: Parent iframe container me open karta hai.
 *    • _top: Topmost full browser window me open karta hai (breaks out of frames).
 * 
 * 2. CRITICAL SECURITY WARNING (Tabnabbing Attack & Fix):
 *    target="_blank" bina precautions ke use karne par target page window.opener.location API se aapka original page malicious URL pe redirect kar sakta hai (Tabnabbing Phishing Attack!).
 *    FIX: HAMESHA target="_blank" ke saath rel="noopener noreferrer" lagao!
 *    - noopener: Target page ko window.opener access karne se block karta hai.
 *    - noreferrer: Destination site ko referrer header share nahi karta.
 */
const q15_example = `<!-- Secure External Anchor Link -->
<a href="https://external-website.com" 
   target="_blank" 
   rel="noopener noreferrer">
   Visit External Site Securely
</a>`;


/**
 * ========================================================================
 * 16) Ways to specify CSS styles for HTML elements:
 * ========================================================================
 * CSS styles apply karne ke 3 primary methods:
 * 
 * 1. INLINE STYLES (style="..." attribute inside tag):
 *    - Highest specificity weight (1, 0, 0, 0). Maintainability hard. Dynamic JS calculated styles ke liye use karo.
 * 
 * 2. INTERNAL STYLESHEET (<style> tag inside <head>):
 *    - Single HTML document scope. Prototypes & email templates ke liye use hota hai.
 * 
 * 3. EXTERNAL STYLESHEET (<link rel="stylesheet" href="...">):
 *    - BEST PRACTICE! External .css file import karo. Reusable across pages + browser HTTP cached!
 */
const q16_example = `<!-- 1. External Stylesheet (BEST PRACTICE) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal Stylesheet -->
<style>
  h1 { color: #1d4ed8; }
</style>

<!-- 3. Inline Style -->
<h1 style="color: #1d4ed8; font-size: 24px;">Title</h1>`;


/**
 * ========================================================================
 * 17) Difference between <link> tag and <a> tag:
 * ========================================================================
 * Dono external resources connect karte hain, par architectural roles completely ALAG hain:
 * 
 * DETAILED COMPARISON TABLE:
 * ┌────────────────────┬───────────────────────────────────────┬───────────────────────────────────────┐
 * │ Feature            │ <link> Element                        │ <a> Element                           │
 * ├────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
 * │ DOM Location       │ Must be inside <head>                 │ Must be inside <body>                 │
 * │ Interactive?       │ No. Invisible to user                 │ Yes. User click karke navigate karta  │
 * │ Element Type       │ Void Element (Self-closing)           │ Non-Void Element (Requires </a>)      │
 * │ Primary Attributes │ href, rel, as, type, crossorigin      │ href, target, download, rel           │
 * │ Purpose            │ Import CSS, favicons, fonts, preloads │ Hyperlink navigation to pages & files │
 * └────────────────────┴───────────────────────────────────────┴───────────────────────────────────────┘
 */
const q17_example = `<!-- <link> tag in <head> -->
<link rel="stylesheet" href="main.css">
<link rel="icon" href="favicon.ico">

<!-- <a> tag in <body> -->
<a href="/dashboard" class="nav-link">Dashboard</a>
<a href="/report.pdf" download>Download PDF</a>`;


/**
 * ========================================================================
 * 18) When to use scripts in head vs scripts in body?
 * ========================================================================
 * Script placement determines script download timing & DOM parser blocking:
 * 
 * 1. <script src="app.js"> in <head> (Bina attributes):
 *    - BAD PRACTICE! HTML parser pause hota hai, script network fetch hoti hai, execute hoti hai, fir HTML parse resume hota hai. Blank white screen during load!
 * 
 * 2. <script src="app.js" defer> in <head> (RECOMMENDED MODERN WAY!):
 *    - Background me parallel download. HTML DOM parse complete hone ke BAAD strictly order me execute hota hai (DOMContentLoaded). Execution order guaranteed!
 * 
 * 3. <script src="analytics.js" async> in <head>:
 *    - Background me parallel download. Ready hote hi IMMEDIATELY execute (DOM parse pause, order NOT guaranteed). Best for independent analytics/ads!
 * 
 * 4. Bottom of <body>:
 *    - Legacy approach before defer existed. DOM render ho jata hai, par download late start hota hai.
 */
const q18_example = `<head>
  <!-- Modern Best Practice: Defer for app bundle -->
  <script src="/js/bundle.js" defer></script>

  <!-- Async for tracking scripts -->
  <script src="https://analytics.com/track.js" async></script>
</head>`;


/**
 * ========================================================================
 * 19) Forms & Default Form Behaviors:
 * ========================================================================
 * <form> element user input data collect karke server backend ko transmit karta hai.
 * 
 * DEFAULT FORM BEHAVIORS (Critical SPA Knowledge):
 * 1. Full Page Reload: Submission pe browser action="" URL pe FULL PAGE RELOAD karta hai.
 * 2. Default Method GET: Default method GET hota hai (inputs ko URL query string me append karta hai ?email=val).
 * 3. Implicit Submit: Input me ENTER key press karne se form submit ho jata hai.
 * 4. Button Submit Default: <form> ke andar <button> default type="submit" hota hai.
 * 
 * SPA AJAX HANDLING (e.preventDefault()):
 * React/Vue/Vanilla JS SPAs me form submission ko e.preventDefault() se capture karke default page reload ROKTE hain, aur fetch() API se background request bhejte hain.
 */
const q19_example = `<form id="login-form">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Log In</button>
</form>

<script>
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop default browser page reload!
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    await fetch('/api/login', { method: 'POST', body: JSON.stringify(payload) });
  });
</script>`;


/**
 * ========================================================================
 * 20) How to handle events in HTML:
 * ========================================================================
 * User interactions (click, keypress, submit) capture karne ke 3 tarike:
 * 
 * 1. Inline Handlers (onclick="..."):
 *    - BAD PRACTICE! HTML + JS mix hota hai. Maintainability hard.
 * 
 * 2. DOM Property (element.onclick = fn):
 *    - Single handler limit (overwrite ho jata hai previous handler).
 * 
 * 3. addEventListener('click', fn) (MODERN STANDARD!):
 *    - BEST PRACTICE! Multiple independent listeners, bubbling/capturing phase control, removeEventListener support.
 */
const q20_example = `const btn = document.querySelector('#action-btn');

// Modern addEventListener Approach
btn.addEventListener('click', (event) => {
  console.log('Event Type:', event.type);
  console.log('Target Element:', event.target);
});`;


/**
 * ========================================================================
 * 21) Advantages of HTML5:
 * ========================================================================
 * HTML5 ke main modern features:
 * 
 * 1. Native Audio & Video: <video> aur <audio> tags (Flash plugins ki zaroorat khatam!).
 * 2. Semantic Layout Elements: <header>, <nav>, <main>, <article>, <section>, <footer> (Better SEO & Accessibility).
 * 3. Web Storage: localStorage (permanent) & sessionStorage (tab session) replace 4KB cookies for client caching (~5-10MB).
 * 4. Native Form Validation & Inputs: type="email|date|number|range|color" with browser native constraint validation.
 * 5. 2D Canvas & SVG: Native high-performance graphics rendering.
 * 6. Rich Web APIs: Web Workers (multithreading), WebSockets (real-time bidirection), Geolocation, Drag & Drop.
 */
const q21_example = `<main>
  <article>
    <video controls src="intro.mp4" width="400"></video>
    <input type="date" name="booking-date">
  </article>
</main>`;


/**
 * ========================================================================
 * 22) Including Audio and Video:
 * ========================================================================
 * HTML5 <video> aur <audio> tags with multi-format fallback sources:
 * 
 * KEY ATTRIBUTES:
 * • controls: Play/pause/volume native controls dikhata hai.
 * • autoplay: Autoplay shuru (Modern browsers require muted attribute!).
 * • muted: Sound off by default.
 * • loop: Continuous playback.
 * • poster="thumb.jpg": Video load hone se pehle preview thumbnail image.
 * • <source src="..." type="...">: Cross-browser fallback formats (MP4, WebM, OGG).
 */
const q22_example = `<video controls width="640" height="360" poster="preview.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <track src="subs.vtt" kind="subtitles" srclang="en" label="English">
</video>`;


/**
 * ========================================================================
 * 23) Semantic Elements:
 * ========================================================================
 * Semantic elements browser, developer, SEO, aur screen readers ko content ka MEANING and PURPOSE clearly convey karte hain.
 * 
 * COMPREHENSIVE SEMANTIC ELEMENTS REFERENCE (All 13 Tags):
 * ┌───────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
 * │ Semantic Tag      │ Definition & Exact Real-World Use Case                                                  │
 * ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 * │ <header>          │ Introductory container for page or section (logo, title, nav bar).                      │
 * │ <nav>             │ Container reserved strictly for primary document navigation link blocks.                 │
 * │ <main>            │ Central UNIQUE content of document. MUST appear only ONCE per page!                     │
 * │ <article>         │ Self-contained, reusable composition (blog post, news story, product card, comment).    │
 * │ <section>         │ Standalone thematic grouping of content with heading.                                   │
 * │ <aside>           │ Tangentially related sidebar content (related links, callout boxes, ads, author bio).   │
 * │ <footer>          │ Document or section footer (copyright, privacy terms, sitemap, social links).          │
 * │ <figure>          │ Self-contained media illustration (image, code snippet, diagram).                       │
 * │ <figcaption>      │ Caption title attached to a <figure> parent.                                            │
 * │ <time>            │ Machine-readable date/time representation (<time datetime="2026-07-27">).               │
 * │ <mark>            │ Highlighted text selection.                                                             │
 * │ <details>         │ Native collapsible disclosure widget (accordion trigger).                               │
 * │ <summary>         │ Visible heading label inside a <details> element.                                       │
 * └───────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘
 */
const q23_example = `<header>
  <nav><a href="/">Home</a></nav>
</header>
<main>
  <article>
    <header>
      <h2>Semantic HTML5 Guide</h2>
      <p>Published: <time datetime="2026-07-27">July 27, 2026</time></p>
    </header>
    <section>
      <p>Semantic markup improves SEO rankings and accessibility.</p>
    </section>
  </article>
</main>
<footer><p>&copy; 2026 Masterclass. All rights reserved.</p></footer>`;


/**
 * ========================================================================
 * 24) Significant goals of HTML5 specification:
 * ========================================================================
 * HTML5 Spec (WHATWG & W3C) ke 5 main goals:
 * 
 * 1. Flash/Plugins Eliminate: Native <video>, <audio>, <canvas> se third-party plugins drop karna.
 * 2. Standardize Error Parsing: Broken HTML ko saare browsers me identically handle karna.
 * 3. Mobile-First Capabilities: Viewport meta, touch events, offline storage.
 * 4. Improve Semantics & Accessibility: Native semantic elements + ARIA support.
 * 5. Empower SPAs: Rich Web APIs (Web Storage, Web Workers, WebSockets, History API).
 */
const q24_example = `<!DOCTYPE html>`;


/**
 * ========================================================================
 * SECTION 3: HTML5 STORAGE, MEDIA, APIS & CSS SPECIFICITY
 * ========================================================================
 */


/**
 * ========================================================================
 * 25) Web Storage in HTML5 (localStorage vs sessionStorage vs cookies):
 * ========================================================================
 * Client-side storage browser me data persist karne ke liye:
 * 
 * DETAILED COMPARISON MATRIX:
 * ┌──────────────────────┬────────────────────────────────────┬────────────────────────────────────┬────────────────────────────────────┐
 * │ Feature              │ localStorage                       │ sessionStorage                     │ Cookies                            │
 * ├──────────────────────┼────────────────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤
 * │ Storage Capacity     │ ~5 - 10 MB                         │ ~5 MB                              │ ~4 KB ONLY!                        │
 * │ Data Persistence     │ PERMANENT. Survives browser restart│ Temporary. Cleared when tab closes │ Configurable via Expires/Max-Age   │
 * │ Transmitted to Server│ NO! Purely client-side API         │ NO! Purely client-side API         │ YES! Sent on EVERY HTTP request    │
 * │ Accessible Across Tabs│ Shared across all tabs same origin │ Isolated to specific individual tab│ Shared across all tabs same origin │
 * │ Primary Use Case     │ Theme preferences, user settings   │ Form checkout wizard step data     │ Auth JWT Tokens (HttpOnly flag)    │
 * └──────────────────────┴────────────────────────────────────┴────────────────────────────────────┴────────────────────────────────────┘
 */
const q25_example = `// 1. localStorage (Persistent)
localStorage.setItem('theme', 'dark');
const userTheme = localStorage.getItem('theme'); // 'dark'

// 2. sessionStorage (Tab session lifetime)
sessionStorage.setItem('wizardStep', '3');

// 3. Cookie access in JS
document.cookie = "username=John; max-age=3600; path=/; Secure";`;


/**
 * ========================================================================
 * 26) <header> and <h1> relationship in HTML5:
 * ========================================================================
 * • HTML4 Legacy Rule: Strictly ONE <h1> per entire page.
 * • HTML5 Sectioning Rule: HTML5 sectioning elements (<article>, <section>) me localized <header> aur <h1> allowed hain.
 * 
 * BEST PRACTICE: Screen readers aur search engine SEO navigation ke liye page pe single root <h1> main headline maintenance standard recommendation hai.
 */
const q26_example = `<header><h1>Main Page Heading</h1></header>
<article>
  <header><h2>Article Section Title</h2></header>
</article>`;


/**
 * ========================================================================
 * 27) New Media Tags in HTML5:
 * ========================================================================
 * HTML5 native media elements:
 * 
 * • <video>: Video container with native playback controls.
 * • <audio>: Audio container for music/podcasts.
 * • <source>: Alternative media formats (MP4, WebM, OGG) fallback child tag.
 * • <track>: Subtitles aur closed captions text tracks.
 * • <picture>: Art direction responsive image switcher.
 * • <embed>: External application / PDF container.
 */
const q27_example = `<picture>
  <source media="(min-width: 1024px)" srcset="banner-large.webp">
  <source media="(min-width: 640px)" srcset="banner-medium.webp">
  <img src="banner-small.jpg" alt="Responsive Banner">
</picture>`;


/**
 * ========================================================================
 * 28) Drag and Drop in HTML5:
 * ========================================================================
 * HTML5 native Drag and Drop (DnD) API:
 * 
 * MECHANICS:
 * • Global attribute draggable="true" set karo element pe.
 * • Source Events: dragstart, dragend.
 * • Drop Zone Events: dragover (e.preventDefault() MANDATORY hai drop allow karne ke liye!), drop.
 * • DataTransfer payload: e.dataTransfer.setData('text/plain', id) aur e.dataTransfer.getData().
 */
const q28_example = `<div id="drag-card" draggable="true">Drag Me</div>
<div id="drop-zone">Drop Zone</div>

<script>
  const card = document.getElementById('drag-card');
  const dropZone = document.getElementById('drop-zone');

  card.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', e.target.id));
  dropZone.addEventListener('dragover', (e) => e.preventDefault());
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    dropZone.appendChild(document.getElementById(id));
  });
</script>`;


/**
 * ========================================================================
 * 29) Web Workers in HTML5:
 * ========================================================================
 * JS single main UI thread pe run karta hai. Heavy CPU tasks (large data parsing, calculations) main thread freeze/lag kar dete hain.
 * 
 * Web Workers background thread me JavaScript run karte hain, UI thread ko smooth rakhte hue!
 * 
 * LIMITATIONS:
 * • Worker thread ko DOM window/document ka access NAHI milta!
 * • Main thread ke saath postMessage() aur onmessage API se async communication hota hai.
 */
const q29_example = `// 1. main.js (Main UI Thread)
const worker = new Worker('calculator.js');
worker.postMessage({ numbers: [50, 100, 200] });
worker.onmessage = (event) => console.log('Worker Result:', event.data);

// 2. calculator.js (Worker Thread)
self.onmessage = (event) => {
  const sum = event.data.numbers.reduce((a, b) => a + b, 0);
  self.postMessage(sum);
};`;


/**
 * ========================================================================
 * 30) Responsive Image Approaches:
 * ========================================================================
 * Device screen resolution aur pixel density (DPR) ke according exact image serve karne ke 4 approaches:
 * 
 * 1. Fluid CSS Layout Scaling: img { max-width: 100%; height: auto; }
 * 2. Resolution Switching (srcset & sizes): Browser resolution check karke optimal asset file (400w, 800w, 1200w) automatic select & download karta hai.
 * 3. Art Direction (<picture> & <source media="...">): Mobile vs desktop ke liye completely cropped/different image compositions.
 * 4. CSS Aspect Crop (object-fit: cover|contain): Fixed container me image crop/fit.
 */
const q30_example = `<picture>
  <source media="(min-width: 1024px)" srcset="desktop.webp">
  <source media="(max-width: 639px)" srcset="mobile.webp">
  <img src="fallback.jpg" alt="Responsive Hero" style="width:100%; height:400px; object-fit:cover;">
</picture>`;


/**
 * ========================================================================
 * 31) Manifest File in HTML5:
 * ========================================================================
 * Web App Manifest (manifest.json) JSON config file hai jo mobile/desktop browsers ko batati hai ki web app ko Progressive Web App (PWA) ki tarah KAISE install karna hai.
 * 
 * KEY FIELDS:
 * • name & short_name: App titles for install prompt & home screen icon label.
 * • start_url: Launch URL.
 * • display: "standalone" (URL address bar remove karke native app feel deta hai!).
 * • icons: Home screen icon sizes array (192x192, 512x512).
 * • theme_color & background_color: Status bar & splash screen customization.
 */
const q31_example = `{
  "short_name": "Masterclass",
  "name": "Frontend Masterclass PWA",
  "icons": [{ "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" }],
  "start_url": "/?source=pwa",
  "display": "standalone",
  "theme_color": "#2563eb"
}`;


/**
 * ========================================================================
 * 32) LocalStorage vs SessionStorage:
 * ========================================================================
 * Dono client-side Web Storage APIs (~5MB limit) key-value strings store karte hain.
 * 
 * DIFFERENCE:
 * • localStorage: PERMANENT persistence (browser restart pe bhi cleared nahi hota jab tak manually clear na karo). Shared across same origin tabs.
 * • sessionStorage: TAB LIFETIME (tab close karte hi instantly erase ho jata hai). Isolated strictly to single tab context.
 */
const q32_example = `localStorage.setItem('theme', 'dark');
sessionStorage.setItem('wizardStep', '2');`;


/**
 * ========================================================================
 * 33) When to use cookies? (Cookies vs Web Storage)
 * ========================================================================
 * Cookies TAB use karo jab data HAR HTTP request header me server ko auto bhejna ho (e.g. Auth JWT Tokens, Session IDs).
 * 
 * COOKIES SECURITY FLAGS:
 * • HttpOnly: JavaScript (document.cookie) access block karta hai -> XSS token theft attack protection!
 * • Secure: Sirf HTTPS encrypted connection pe bhejta hai.
 * • SameSite=Strict / Lax: Cross-Site Request Forgery (CSRF) protection.
 * 
 * WHEN TO USE WHAT?:
 * - Auth Tokens & Session IDs -> HttpOnly Cookies!
 * - UI State, Client Caches, Themes -> localStorage!
 */
const q33_example = `// Server HTTP Response Header:
Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`;


/**
 * ========================================================================
 * 34) What is Specificity in CSS?
 * ========================================================================
 * Specificity algorithm hai jo decide karta hai ki jab multiple CSS selectors match karte hain ek element ko, to KAUNSA rule WINS karega.
 * 
 * SPECIFICITY TUPLE FORMULA (Inline, ID, Class, Element):
 * 1. Inline Styles: style="..." -> Weight (1, 0, 0, 0)
 * 2. ID Selectors: #header -> Weight (0, 1, 0, 0)
 * 3. Classes / Attributes / Pseudo-classes: .btn, [type="text"], :hover -> Weight (0, 0, 1, 0)
 * 4. Elements / Pseudo-elements: div, p, h1, ::before -> Weight (0, 0, 0, 1)
 * 
 * !important: Cascade calculation override karta hai. Production CSS me avoid karo!
 */
const q34_example = `/* (0, 0, 0, 1) */
p { color: black; }

/* (0, 0, 1, 1) - WINS over element rule! */
p.intro { color: blue; }

/* (0, 1, 0, 0) - WINS over class rule! */
#main-text { color: red; }`;


/**
 * ========================================================================
 * SECTION 4: CSS BOX MODEL, FLEXBOX & ADVANCED CSS
 * ========================================================================
 */


/**
 * ========================================================================
 * 35) CSS Box Model:
 * ========================================================================
 * CSS me har rendered element 4 layers ka rectangular box hai: Content -> Padding -> Border -> Margin.
 * 
 * BOX-SIZING PROPERTY:
 * • content-box (Default): Width SIRF content pe apply hoti hai. Padding aur border total width EXPAND karte hain!
 * • border-box (BEST PRACTICE!): Width me padding aur border INSIDE include hote hain. Outer width fixed rehti hai!
 */
const q35_example = `*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 24px;
  border: 2px solid #000;
  margin: 16px;
}`;


/**
 * ========================================================================
 * 36) Aligning Block Element Inside Another Element (Centering Techniques)
 * ========================================================================
 * Child element ko horizontal aur vertical center karne ke 4 modern strategies:
 * 
 * 1. Flexbox (Most Popular): display: flex; justify-content: center; align-items: center;
 * 2. CSS Grid (Shortest Code): display: grid; place-items: center;
 * 3. Auto Margins (Horizontal Block Center): margin: 0 auto;
 * 4. Absolute + Transform: position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
 */
const q36_example = `/* Flexbox Centering */
.parent-flex { display: flex; justify-content: center; align-items: center; }

/* Grid Centering */
.parent-grid { display: grid; place-items: center; }`;


/**
 * ========================================================================
 * 37) Shadow DOM Explanation
 * ========================================================================
 * Shadow DOM Web Components encapsulation feature hai jo element se hidden isolated DOM tree attach karta hai.
 * 
 * SCOPING RULE:
 * Shadow DOM ke andar CSS styles outer main document pe leak NAHI hote, aur main document ke global CSS styles Shadow DOM elements ko affect NAHI karte!
 */
const q37_example = `const host = document.getElementById('host');
const shadowRoot = host.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = \`
  <style> p { color: orange; font-weight: bold; } </style>
  <p>Isolated text inside Shadow DOM!</p>
\`;`;


/**
 * ========================================================================
 * 38) Building a Triangle in CSS
 * ========================================================================
 * Element ki width aur height 0px set karo, 3 sides transparent borders do, aur 1 side solid color border do!
 * 
 * WHY IT WORKS: CSS borders diagonal lines se meet karte hain. Jab content size 0 ho, to borders colored TRIANGLE shape me render hote hain!
 */
const q38_example = `.triangle-up {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #2563eb;
}`;


/**
 * ========================================================================
 * 39) Pseudo-elements (::before, ::after, etc.)
 * ========================================================================
 * Pseudo-elements HTML markup edit kiye bina CSS se virtual decorative content insert karte hain.
 * 
 * KEY PSEUDO-ELEMENTS:
 * ::before, ::after, ::first-letter, ::first-line, ::placeholder, ::selection.
 * 
 * MANDATORY RULE: ::before aur ::after me content: "" property ho tabs hi render honge!
 */
const q39_example = `.btn-download::before {
  content: "⬇ ";
  color: #22c55e;
}
::selection {
  background-color: #2563eb;
  color: white;
}`;


/**
 * ========================================================================
 * 40) Data Attributes (data-*)
 * ========================================================================
 * data-* attributes HTML elements pe custom metadata store karne ke liye use hote hain.
 * 
 * USAGE:
 * • JS me access: element.dataset.camelCaseName.
 * • CSS me target: attribute selector [data-role="admin"].
 */
const q40_example = `<button data-user-id="99" data-user-role="admin" id="user-btn">Profile</button>

<script>
  const btn = document.getElementById('user-btn');
  console.log(btn.dataset.userId);   // "99"
  console.log(btn.dataset.userRole); // "admin"
</script>

<style>
  [data-user-role="admin"] { border: 2px solid gold; }
</style>`;


/**
 * ========================================================================
 * 41) z-index & Stacking Context
 * ========================================================================
 * z-index 3D visual stacking order control karta hai Z-axis pe.
 * 
 * MANDATORY RULE: z-index TABHI kaam karta hai jab element position non-static hai (relative, absolute, fixed, sticky) ya flex/grid items!
 * 
 * Stacking Context: opacity < 1, transform, filter, ya z-index se naya stacking context banta hai. Child z-index depth parent stacking context ke inside restrict ho jati hai.
 */
const q41_example = `.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}`;


/**
 * ========================================================================
 * 42) Flexbox Properties & Layout Guide
 * ========================================================================
 * Flexbox 1-Dimensional layout engine hai (Main Axis aur Cross Axis).
 * 
 * PROPERTIES CHEATSHEET:
 * • Container Properties: flex-direction, flex-wrap, justify-content (Main Axis), align-items (Cross Axis), gap.
 * • Item Properties: flex-grow, flex-shrink, flex-basis, flex: grow shrink basis, align-self, order.
 */
const q42_example = `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.flex-item-grow {
  flex: 1 0 auto;
}`;


/**
 * ========================================================================
 * 43) CSS Selectors Combinator Reference
 * ========================================================================
 * Combinators selectors ke beech spatial relationship define karte hain:
 * 
 * • div, p : Comma Grouping (ALL <div> elements AND ALL <p> elements).
 * • div p  : Descendant Selector (ALL <p> inside <div> at ANY nesting depth).
 * • div > p: Child Selector (ONLY immediate direct child <p> of <div>).
 * • div + p: Adjacent Sibling (Selects single <p> immediately following <div>).
 * • div ~ p: General Sibling (Selects ALL <p> siblings that follow <div>).
 */
const q43_example = `article > p { font-size: 16px; }
h2 + p { margin-top: 0; }`;


/**
 * ========================================================================
 * 44) Viewport Units, Font-family Fallbacks, Float vs Flex/Grid, !important, CSS2 vs CSS3:
 * ========================================================================
 * Overview of Key Concepts:
 * 
 * 1. Viewport Units: 1vh = 1% height, 1vw = 1% width. Mobile URL address bar fix ke liye 100dvh (Dynamic Viewport Height) use karo!
 * 2. Font-Family Fallback Stacks: Left to right evaluate hota hai. Agar custom font install nahi hai to system fallback pe jata hai (font-family: 'Inter', system-ui, sans-serif).
 * 3. Float vs Modern Flexbox/Grid: float images ke around text wrap karne ke liye tha. Columns ke liye float misuse hota tha Clearfix hacks (clear: both) ke saath. Modern Flexbox & Grid ne float layouts replace kar diye.
 * 4. !important Rule: Specificity calculation override karta hai. CSS unmaintainable banata hai. Production me avoid karo!
 * 5. CSS2 vs CSS3: CSS2 single monolithic spec tha; CSS3 ne independent modular sub-specs (Flexbox, Grid, Animations, Transitions, Media Queries) introduced kiye.
 */
const q44_example = `:root {
  --primary-color: #2563eb;
  --font-stack: 'Inter', system-ui, sans-serif;
}
.hero-screen {
  min-height: 100dvh;
  font-family: var(--font-stack);
}`;
