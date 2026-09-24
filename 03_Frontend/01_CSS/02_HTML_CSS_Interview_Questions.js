/**
 * ## Quick revision
 *
 * - Tag/element — tag markup boundary; element content/attributes wala parsed node.
 * - Attributes — element ki extra settings; DOM properties live state represent kar sakti hain.
 * - Void element — img/input jaise elements ke child content aur closing tag nahi.
 * - Lists — ul unordered, ol ordered, dl term/description pairs.
 * - Class/id — class reuse hoti hai; id document mein unique rakho.
 * - Assets — right-size images, caching, compression aur critical-resource priority.
 * - strong/em — importance/emphasis; b/i ka semantic purpose alag, sirf visual equivalent mat samjho.
 * - head/body — metadata/resources head mein; page content body mein.
 * - iframe — doosra document embed; sandbox, permissions aur framing policy check.
 * - Display — block naya block box, inline text flow, inline-block inline placement + box sizing.
 * - Position — static normal; relative offset; absolute out-of-flow; fixed viewport/containing block; sticky scroll threshold.
 * - relative/absolute — relative ki normal space bachi rehti; absolute normal flow se nikalta hai.
 * - Display modes — block, inline, inline-block, flex, grid aur none se layout contract choose.
 * - Hide — display:none layout se hataata; visibility:hidden space rakhta, normally interaction/focus nahi.
 * - Target — _self current, _blank new context; rel=noopener opener relationship control karta hai.
 * - CSS placement — inline, style block ya linked stylesheet; cascade phir bhi apply hoti hai.
 * - link/a — link external resource relationship; a user navigation hyperlink.
 * - Scripts — classic defer parse ke baad ordered; async ready hote hi; modules default deferred.
 * - Form — associated labels, field names aur correct button type; submit/validation behavior handle.
 * - Events — addEventListener; target clicked node, currentTarget current listener ka node.
 * - HTML platform — semantic structure, native forms/media aur related browser APIs.
 * - Audio/video — native controls, formats, captions aur autoplay restrictions handle.
 * - Semantics — nav/main/article/section ka meaningful use; styling ke liye random semantic tag nahi.
 * - HTML goals — interoperable parsing, structured content aur browser features ka common contract.
 * - Storage — local/session strings; cookies matching HTTP requests ke saath ja sakti hain.
 * - header/h1 — header container hai; heading rank document hierarchy se choose.
 * - Media tags — audio/video/source/track; formats aur caption fallback.
 * - Drag/drop — drag data transfer; keyboard/touch alternative bhi do.
 * - Worker — background JS; direct DOM access nahi, messages se communicate.
 * - Responsive image — srcset/sizes resolution, picture art direction/format selection.
 * - Manifest — app install metadata; offline caching service worker ka separate kaam.
 * - local/session — origin persistence / tab session; storage failure aur quota handle.
 * - Cookie — server-visible session credential; Secure/HttpOnly/SameSite flow ke hisaab se.
 * - Specificity — cascade origin/layer/importance ke baad selector weight, phir source order.
 * - Box model — content + padding + border; border-box mein declared width ke andar ye included.
 * - Centering — flex/grid alignment; block width ho toh auto margins; desired axis clear karo.
 * - Shadow DOM — DOM/style encapsulation; security boundary nahi.
 * - CSS triangle — zero-size box ki transparent borders + ek colored border.
 * - Pseudo-element — ::before/::after generated boxes; content/accessibility impact socho.
 * - data-* — custom attributes; dataset se string values access.
 * - z-index — local stacking context ke andar order; high value parent context se escape nahi karta.
 * - Flexbox — main/cross axes; justify main par, align cross par; grow/shrink/basis sizing control.
 * - Combinators — space descendant, > child, + adjacent sibling, ~ following sibling.
 * - CSS choices — rem/root, em/context, vw/vh viewport; fallback fonts, modern layout aur !important ka scope samjho.
 * - Disabled field — normal form submission mein value include nahi hoti; readonly control ka behavior alag.
 * - Button default — form ke andar button ka default submit ho sakta hai; non-submit action par type=button.
 * - CSS custom property — var() fallback missing/invalid variable cases handle; property ki final validity phir bhi matter.
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


const q3_example = `<!-- Standard HTML5 Void Elements -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="styles.css">

<img src="avatar.webp" alt="User avatar" width="80" height="80">
<input type="email" name="email" placeholder="Enter email" required>
<hr>
<br>`;


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


const q7_example = `<!-- Presentational Bolding & Italics -->
<p>Available colors: <b>Red</b> and <b>Blue</b>.</p>
<p>The Latin term <i>ad hoc</i> means created for a task.</p>

<!-- Semantic Urgency & Verbal Stress Emphasis -->
<p><strong>ALERT:</strong> Do not turn off server power!</p>

<p>I <em>never</em> said she stole money. (Emphasizes "never")</p>
<p>I never said <em>she</em> stole money. (Emphasizes "she")</p>`;


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


const q13_example = `.container-flex { display: flex; gap: 16px; }
.container-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
.hidden-element  { display: none; }`;


const q14_example = `.tab-inactive { display: none; }           /* 0px space */
.ghost-box { visibility: hidden; }       /* Space reserved */

/* Child override trick with visibility */
.parent-hidden { visibility: hidden; }
.parent-hidden .child { visibility: visible; } /* Child displays! */`;


const q15_example = `<!-- Secure External Anchor Link -->
<a href="https://external-website.com" 
   target="_blank" 
   rel="noopener noreferrer">
   Visit External Site Securely
</a>`;


const q16_example = `<!-- 1. External Stylesheet (BEST PRACTICE) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal Stylesheet -->
<style>
  h1 { color: #1d4ed8; }
</style>

<!-- 3. Inline Style -->
<h1 style="color: #1d4ed8; font-size: 24px;">Title</h1>`;


const q17_example = `<!-- <link> tag in <head> -->
<link rel="stylesheet" href="main.css">
<link rel="icon" href="favicon.ico">

<!-- <a> tag in <body> -->
<a href="/dashboard" class="nav-link">Dashboard</a>
<a href="/report.pdf" download>Download PDF</a>`;


const q18_example = `<head>
  <!-- Modern Best Practice: Defer for app bundle -->
  <script src="/js/bundle.js" defer></script>

  <!-- Async for tracking scripts -->
  <script src="https://analytics.com/track.js" async></script>
</head>`;


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


const q20_example = `const btn = document.querySelector('#action-btn');

// Modern addEventListener Approach
btn.addEventListener('click', (event) => {
  console.log('Event Type:', event.type);
  console.log('Target Element:', event.target);
});`;


const q21_example = `<main>
  <article>
    <video controls src="intro.mp4" width="400"></video>
    <input type="date" name="booking-date">
  </article>
</main>`;


const q22_example = `<video controls width="640" height="360" poster="preview.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <track src="subs.vtt" kind="subtitles" srclang="en" label="English">
</video>`;


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


const q24_example = `<!DOCTYPE html>`;


const q25_example = `// 1. localStorage (Persistent)
localStorage.setItem('theme', 'dark');
const userTheme = localStorage.getItem('theme'); // 'dark'

// 2. sessionStorage (Tab session lifetime)
sessionStorage.setItem('wizardStep', '3');

// 3. Cookie access in JS
document.cookie = "username=John; max-age=3600; path=/; Secure";`;


const q26_example = `<header><h1>Main Page Heading</h1></header>
<article>
  <header><h2>Article Section Title</h2></header>
</article>`;


const q27_example = `<picture>
  <source media="(min-width: 1024px)" srcset="banner-large.webp">
  <source media="(min-width: 640px)" srcset="banner-medium.webp">
  <img src="banner-small.jpg" alt="Responsive Banner">
</picture>`;


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


const q29_example = `// 1. main.js (Main UI Thread)
const worker = new Worker('calculator.js');
worker.postMessage({ numbers: [50, 100, 200] });
worker.onmessage = (event) => console.log('Worker Result:', event.data);

// 2. calculator.js (Worker Thread)
self.onmessage = (event) => {
  const sum = event.data.numbers.reduce((a, b) => a + b, 0);
  self.postMessage(sum);
};`;


const q30_example = `<picture>
  <source media="(min-width: 1024px)" srcset="desktop.webp">
  <source media="(max-width: 639px)" srcset="mobile.webp">
  <img src="fallback.jpg" alt="Responsive Hero" style="width:100%; height:400px; object-fit:cover;">
</picture>`;


const q31_example = `{
  "short_name": "Masterclass",
  "name": "Frontend Masterclass PWA",
  "icons": [{ "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" }],
  "start_url": "/?source=pwa",
  "display": "standalone",
  "theme_color": "#2563eb"
}`;


const q32_example = `localStorage.setItem('theme', 'dark');
sessionStorage.setItem('wizardStep', '2');`;


const q33_example = `// Server HTTP Response Header:
Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`;


const q34_example = `/* (0, 0, 0, 1) */
p { color: black; }

/* (0, 0, 1, 1) - WINS over element rule! */
p.intro { color: blue; }

/* (0, 1, 0, 0) - WINS over class rule! */
#main-text { color: red; }`;


const q35_example = `*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 24px;
  border: 2px solid #000;
  margin: 16px;
}`;


const q36_example = `/* Flexbox Centering */
.parent-flex { display: flex; justify-content: center; align-items: center; }

/* Grid Centering */
.parent-grid { display: grid; place-items: center; }`;


const q37_example = `const host = document.getElementById('host');
const shadowRoot = host.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = \`
  <style> p { color: orange; font-weight: bold; } </style>
  <p>Isolated text inside Shadow DOM!</p>
\`;`;


const q38_example = `.triangle-up {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #2563eb;
}`;


const q39_example = `.btn-download::before {
  content: "⬇ ";
  color: #22c55e;
}
::selection {
  background-color: #2563eb;
  color: white;
}`;


const q40_example = `<button data-user-id="99" data-user-role="admin" id="user-btn">Profile</button>

<script>
  const btn = document.getElementById('user-btn');
  console.log(btn.dataset.userId);   // "99"
  console.log(btn.dataset.userRole); // "admin"
</script>

<style>
  [data-user-role="admin"] { border: 2px solid gold; }
</style>`;


const q41_example = `.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}`;


const q42_example = `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.flex-item-grow {
  flex: 1 0 auto;
}`;


const q43_example = `article > p { font-size: 16px; }
h2 + p { margin-top: 0; }`;


const q44_example = `:root {
  --primary-color: #2563eb;
  --font-stack: 'Inter', system-ui, sans-serif;
}
.hero-screen {
  min-height: 100dvh;
  font-family: var(--font-stack);
}`;
