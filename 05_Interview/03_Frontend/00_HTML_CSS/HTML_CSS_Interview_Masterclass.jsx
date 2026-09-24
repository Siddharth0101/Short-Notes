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

import React, { useState } from 'react';

// HTML/CSS — short Hinglish revision cards
// Formatted to strictly align with site theme CSS design tokens (var(--bg), var(--bg-card), var(--accent), etc.)
export default function HTMLCSSInterviewMasterclass() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCard, setOpenCard] = useState(null);

  // Simulators state
  const [triangleColor, setTriangleColor] = useState('#3b82f6');
  const [triangleSize, setTriangleSize] = useState(60);
  const [boxSizing, setBoxSizing] = useState('border-box');

  const questions = [
    // SECTION 1: HTML BASICS & CORE CONCEPTS
    {
      id: 1,
      category: 'html-core',
      question: '1) Are the HTML tags and elements the same thing?',
      answer: "Tag/element — tag markup boundary; element content/attributes wala parsed node.",
      example: `// 1. Tag Syntax String:
// "<p>" (Opening Tag) and "</p>" (Closing Tag)

// 2. Complete HTML Element String:
const elementHTML = '<p class="highlight" id="msg">Hello World!</p>';

// 3. DOM Node Object Creation in JavaScript:
const pElement = document.createElement('p'); // Creates an HTML Element Node
pElement.className = 'highlight';
pElement.id = 'msg';
pElement.textContent = 'Hello World!';
document.body.appendChild(pElement);`
    },
    {
      id: 2,
      category: 'html-core',
      question: '2) What are tags and attributes in HTML?',
      answer: "Attributes — element ki extra settings; DOM properties live state represent kar sakti hain.",
      example: `<!-- 1. Tag: <a> with Global, Media & Security Attributes -->
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
<input type="text" name="username" value="JohnDoe" disabled required>`
    },
    {
      id: 3,
      category: 'html-core',
      question: '3) What are void elements in HTML?',
      answer: "Void element — img/input jaise elements ke child content aur closing tag nahi.",
      example: `<!-- Standard HTML5 Void Elements -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="styles.css">

<img src="avatar.webp" alt="User avatar" width="80" height="80">
<input type="email" name="email" placeholder="Enter email" required>
<hr>
<br>`
    },
    {
      id: 4,
      category: 'html-core',
      question: '4) What are different types of lists in HTML? Explain the difference between each one of them',
      answer: "Lists — ul unordered, ol ordered, dl term/description pairs.",
      example: `<!-- 1. Unordered List (Navigation Menu) -->
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
</dl>`
    },
    {
      id: 5,
      category: 'html-core',
      question: '5) What is the "class" attribute in HTML? What is the difference between the "id" and "class" attributes?',
      answer: "Class/id — class reuse hoti hai; id document mein unique rakho.",
      example: `<!-- Reusable Class Styling -->
<button class="btn btn-primary btn-lg">Submit Form</button>
<button class="btn btn-danger btn-sm">Cancel</button>

<!-- Unique ID for Form Label & URL Anchor -->
<section id="contact-section">
  <form>
    <label for="user-email">Email Address:</label>
    <input type="email" id="user-email" name="email">
  </form>
</section>`
    },
    {
      id: 6,
      category: 'html-core',
      question: '6) How to optimize website assets loading?',
      answer: "Assets — right-size images, caching, compression aur critical-resource priority.",
      example: `<!-- 1. Resource Hints & Script Execution in <head> -->
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
</body>`
    },
    {
      id: 7,
      category: 'html-core',
      question: '7) What is the difference between <strong>, <b> tags and <em>, <i> tags?',
      answer: "strong/em — importance/emphasis; b/i ka semantic purpose alag, sirf visual equivalent mat samjho.",
      example: `<!-- Presentational Bolding & Italics -->
<p>Available colors: <b>Red</b> and <b>Blue</b>.</p>
<p>The Latin term <i>ad hoc</i> means created for a task.</p>

<!-- Semantic Urgency & Verbal Stress Emphasis -->
<p><strong>ALERT:</strong> Do not turn off server power!</p>

<p>I <em>never</em> said she stole money. (Emphasizes "never")</p>
<p>I never said <em>she</em> stole money. (Emphasizes "she")</p>`
    },
    {
      id: 8,
      category: 'html-core',
      question: '8) What is the significance of <head> and <body> tags in HTML?',
      answer: "head/body — metadata/resources head mein; page content body mein.",
      example: `<!DOCTYPE html>
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
</html>`
    },
    {
      id: 9,
      category: 'html-core',
      question: '9) Can we display a web page inside a web page or Is nesting of webpages possible?',
      answer: "iframe — doosra document embed; sandbox, permissions aur framing policy check.",
      example: `<!-- Embedded YouTube Video Player / Google Map Iframe -->
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
</iframe>`
    },
    {
      id: 10,
      category: 'html-core',
      question: '10) What are inline elements? What are block level elements? What is the difference between them?',
      answer: "Display — block naya block box, inline text flow, inline-block inline placement + box sizing.",
      example: `.block-element {
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
}`
    },
    {
      id: 11,
      category: 'html-core',
      question: '11) Position attributes and exact differences (static, relative, absolute, fixed, sticky)',
      answer: "Position — static normal; relative offset; absolute out-of-flow; fixed viewport/containing block; sticky scroll threshold.",
      example: `/* 1. Relative Anchor Parent */
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
}`
    },

    // SECTION 2: ADVANCED POSITIONING, FORMS, TARGET & SEMANTIC HTML5
    {
      id: 12,
      category: 'positioning-forms',
      question: '12) What is the difference between position absolute and relative?',
      answer: "relative/absolute — relative ki normal space bachi rehti; absolute normal flow se nikalta hai.",
      example: `/* Relative Parent + Absolute Child Pattern (Avatar Status Dot) */
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
}`
    },
    {
      id: 13,
      category: 'positioning-forms',
      question: '13) In how many ways can you display HTML elements?',
      answer: "Display modes — block, inline, inline-block, flex, grid aur none se layout contract choose.",
      example: `.container-flex { display: flex; gap: 16px; }
.container-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
.hidden-element  { display: none; }`
    },
    {
      id: 14,
      category: 'positioning-forms',
      question: '14) What is the difference between "display: none" and "visibility: hidden"?',
      answer: "Hide — display:none layout se hataata; visibility:hidden space rakhta, normally interaction/focus nahi.",
      example: `.tab-inactive { display: none; }           /* 0px space */
.ghost-box { visibility: hidden; }       /* Space reserved */

/* Child override trick with visibility */
.parent-hidden { visibility: hidden; }
.parent-hidden .child { visibility: visible; } /* Child displays! */`
    },
    {
      id: 15,
      category: 'positioning-forms',
      question: '15) Target attribute in <a> tag: Permissible values & security',
      answer: "Target — _self current, _blank new context; rel=noopener opener relationship control karta hai.",
      example: `<!-- Secure External Anchor Link -->
<a href="https://external-website.com" 
   target="_blank" 
   rel="noopener noreferrer">
   Visit External Site Securely
</a>`
    },
    {
      id: 16,
      category: 'positioning-forms',
      question: '16) Ways to specify CSS styles for HTML elements:',
      answer: "CSS placement — inline, style block ya linked stylesheet; cascade phir bhi apply hoti hai.",
      example: `<!-- 1. External Stylesheet (BEST PRACTICE) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal Stylesheet -->
<style>
  h1 { color: #1d4ed8; }
</style>

<!-- 3. Inline Style -->
<h1 style="color: #1d4ed8; font-size: 24px;">Title</h1>`
    },
    {
      id: 17,
      category: 'positioning-forms',
      question: '17) Difference between <link> tag and <a> tag:',
      answer: "link/a — link external resource relationship; a user navigation hyperlink.",
      example: `<!-- <link> tag in <head> -->
<link rel="stylesheet" href="main.css">
<link rel="icon" href="favicon.ico">

<!-- <a> tag in <body> -->
<a href="/dashboard" class="nav-link">Dashboard</a>
<a href="/report.pdf" download>Download PDF</a>`
    },
    {
      id: 18,
      category: 'positioning-forms',
      question: '18) When to use scripts in head vs scripts in body?',
      answer: "Scripts — classic defer parse ke baad ordered; async ready hote hi; modules default deferred.",
      example: `<head>
  <!-- Modern Best Practice: Defer for app bundle -->
  <script src="/js/bundle.js" defer></script>

  <!-- Async for tracking scripts -->
  <script src="https://analytics.com/track.js" async></script>
</head>`
    },
    {
      id: 19,
      category: 'positioning-forms',
      question: '19) Forms & Default Form Behaviors:',
      answer: "Form — associated labels, field names aur correct button type; submit/validation behavior handle.",
      example: `<form id="login-form">
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
</script>`
    },
    {
      id: 20,
      category: 'positioning-forms',
      question: '20) How to handle events in HTML:',
      answer: "Events — addEventListener; target clicked node, currentTarget current listener ka node.",
      example: `const btn = document.querySelector('#action-btn');

// Modern addEventListener Approach
btn.addEventListener('click', (event) => {
  console.log('Event Type:', event.type);
  console.log('Target Element:', event.target);
});`
    },
    {
      id: 21,
      category: 'positioning-forms',
      question: '21) Advantages of HTML5:',
      answer: "HTML platform — semantic structure, native forms/media aur related browser APIs.",
      example: `<main>
  <article>
    <video controls src="intro.mp4" width="400"></video>
    <input type="date" name="booking-date">
  </article>
</main>`
    },
    {
      id: 22,
      category: 'positioning-forms',
      question: '22) Including Audio and Video:',
      answer: "Audio/video — native controls, formats, captions aur autoplay restrictions handle.",
      example: `<video controls width="640" height="360" poster="preview.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <track src="subs.vtt" kind="subtitles" srclang="en" label="English">
</video>`
    },
    {
      id: 23,
      category: 'positioning-forms',
      question: '23) Semantic Elements:',
      answer: "Semantics — nav/main/article/section ka meaningful use; styling ke liye random semantic tag nahi.",
      example: `<header>
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
<footer><p>&copy; 2026 Masterclass. All rights reserved.</p></footer>`
    },
    {
      id: 24,
      category: 'positioning-forms',
      question: '24) Significant goals of HTML5 specification:',
      answer: "HTML goals — interoperable parsing, structured content aur browser features ka common contract.",
      example: `<!DOCTYPE html>`
    },

    // SECTION 3: HTML5 STORAGE, MEDIA, APIS & CSS SPECIFICITY
    {
      id: 25,
      category: 'storage-css-basics',
      question: '25) Web Storage in HTML5 (localStorage vs sessionStorage vs cookies):',
      answer: "Storage — local/session strings; cookies matching HTTP requests ke saath ja sakti hain.",
      example: `// 1. localStorage (Persistent)
localStorage.setItem('theme', 'dark');
const userTheme = localStorage.getItem('theme'); // 'dark'

// 2. sessionStorage (Tab session lifetime)
sessionStorage.setItem('wizardStep', '3');

// 3. Cookie access in JS
document.cookie = "username=John; max-age=3600; path=/; Secure";`
    },
    {
      id: 26,
      category: 'storage-css-basics',
      question: '26) <header> and <h1> relationship in HTML5:',
      answer: "header/h1 — header container hai; heading rank document hierarchy se choose.",
      example: `<header><h1>Main Page Heading</h1></header>
<article>
  <header><h2>Article Section Title</h2></header>
</article>`
    },
    {
      id: 27,
      category: 'storage-css-basics',
      question: '27) New Media Tags in HTML5:',
      answer: "Media tags — audio/video/source/track; formats aur caption fallback.",
      example: `<picture>
  <source media="(min-width: 1024px)" srcset="banner-large.webp">
  <source media="(min-width: 640px)" srcset="banner-medium.webp">
  <img src="banner-small.jpg" alt="Responsive Banner">
</picture>`
    },
    {
      id: 28,
      category: 'storage-css-basics',
      question: '28) Drag and Drop in HTML5:',
      answer: "Drag/drop — drag data transfer; keyboard/touch alternative bhi do.",
      example: `<div id="drag-card" draggable="true">Drag Me</div>
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
</script>`
    },
    {
      id: 29,
      category: 'storage-css-basics',
      question: '29) Web Workers in HTML5:',
      answer: "Worker — background JS; direct DOM access nahi, messages se communicate.",
      example: `// 1. main.js (Main UI Thread)
const worker = new Worker('calculator.js');
worker.postMessage({ numbers: [50, 100, 200] });
worker.onmessage = (event) => console.log('Worker Result:', event.data);

// 2. calculator.js (Worker Thread)
self.onmessage = (event) => {
  const sum = event.data.numbers.reduce((a, b) => a + b, 0);
  self.postMessage(sum);
};`
    },
    {
      id: 30,
      category: 'storage-css-basics',
      question: '30) Responsive Image Approaches:',
      answer: "Responsive image — srcset/sizes resolution, picture art direction/format selection.",
      example: `<picture>
  <source media="(min-width: 1024px)" srcset="desktop.webp">
  <source media="(max-width: 639px)" srcset="mobile.webp">
  <img src="fallback.jpg" alt="Responsive Hero" style="width:100%; height:400px; object-fit:cover;">
</picture>`
    },
    {
      id: 31,
      category: 'storage-css-basics',
      question: '31) Manifest File in HTML5:',
      answer: "Manifest — app install metadata; offline caching service worker ka separate kaam.",
      example: `{
  "short_name": "Masterclass",
  "name": "Frontend Masterclass PWA",
  "icons": [{ "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" }],
  "start_url": "/?source=pwa",
  "display": "standalone",
  "theme_color": "#2563eb"
}`
    },
    {
      id: 32,
      category: 'storage-css-basics',
      question: '32) LocalStorage vs SessionStorage:',
      answer: "local/session — origin persistence / tab session; storage failure aur quota handle.",
      example: `localStorage.setItem('theme', 'dark');
sessionStorage.setItem('wizardStep', '2');`
    },
    {
      id: 33,
      category: 'storage-css-basics',
      question: '33) When to use cookies? (Cookies vs Web Storage)',
      answer: "Cookie — server-visible session credential; Secure/HttpOnly/SameSite flow ke hisaab se.",
      example: `// Server HTTP Response Header:
Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`
    },
    {
      id: 34,
      category: 'storage-css-basics',
      question: '34) What is Specificity in CSS?',
      answer: "Specificity — cascade origin/layer/importance ke baad selector weight, phir source order.",
      example: `/* (0, 0, 0, 1) */
p { color: black; }

/* (0, 0, 1, 1) - WINS over element rule! */
p.intro { color: blue; }

/* (0, 1, 0, 0) - WINS over class rule! */
#main-text { color: red; }`
    },

    // SECTION 4: CSS BOX MODEL, FLEXBOX & ADVANCED CSS
    {
      id: 35,
      category: 'box-flexbox-advanced',
      question: '35) Box Model in CSS:',
      answer: "Box model — content + padding + border; border-box mein declared width ke andar ye included.",
      example: `*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 24px;
  border: 2px solid #000;
  margin: 16px;
}`
    },
    {
      id: 36,
      category: 'box-flexbox-advanced',
      question: '36) Aligning Block Element Inside Another Element (Centering Techniques)',
      answer: "Centering — flex/grid alignment; block width ho toh auto margins; desired axis clear karo.",
      example: `/* Flexbox Centering */
.parent-flex { display: flex; justify-content: center; align-items: center; }

/* Grid Centering */
.parent-grid { display: grid; place-items: center; }`
    },
    {
      id: 37,
      category: 'box-flexbox-advanced',
      question: '37) Shadow DOM Explanation',
      answer: "Shadow DOM — DOM/style encapsulation; security boundary nahi.",
      example: `const host = document.getElementById('host');
const shadowRoot = host.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = \`
  <style> p { color: orange; font-weight: bold; } </style>
  <p>Isolated text inside Shadow DOM!</p>
\`;`
    },
    {
      id: 38,
      category: 'box-flexbox-advanced',
      question: '38) Building a Triangle in CSS',
      answer: "CSS triangle — zero-size box ki transparent borders + ek colored border.",
      example: `.triangle-up {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #2563eb;
}`
    },
    {
      id: 39,
      category: 'box-flexbox-advanced',
      question: '39) Pseudo-elements (::before, ::after, etc.)',
      answer: "Pseudo-element — ::before/::after generated boxes; content/accessibility impact socho.",
      example: `.btn-download::before {
  content: "⬇ ";
  color: #22c55e;
}
::selection {
  background-color: #2563eb;
  color: white;
}`
    },
    {
      id: 40,
      category: 'box-flexbox-advanced',
      question: '40) Data Attributes (data-*)',
      answer: "data-* — custom attributes; dataset se string values access.",
      example: `<button data-user-id="99" data-user-role="admin" id="user-btn">Profile</button>

<script>
  const btn = document.getElementById('user-btn');
  console.log(btn.dataset.userId);   // "99"
  console.log(btn.dataset.userRole); // "admin"
</script>

<style>
  [data-user-role="admin"] { border: 2px solid gold; }
</style>`
    },
    {
      id: 41,
      category: 'box-flexbox-advanced',
      question: '41) z-index & Stacking Context',
      answer: "z-index — local stacking context ke andar order; high value parent context se escape nahi karta.",
      example: `.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}`
    },
    {
      id: 42,
      category: 'box-flexbox-advanced',
      question: '42) Flexbox Properties & Layout Guide',
      answer: "Flexbox — main/cross axes; justify main par, align cross par; grow/shrink/basis sizing control.",
      example: `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.flex-item-grow {
  flex: 1 0 auto;
}`
    },
    {
      id: 43,
      category: 'box-flexbox-advanced',
      question: '43) CSS Selectors Combinator Reference',
      answer: "Combinators — space descendant, > child, + adjacent sibling, ~ following sibling.",
      example: `article > p { font-size: 16px; }
h2 + p { margin-top: 0; }`
    },
    {
      id: 44,
      category: 'box-flexbox-advanced',
      question: '44) Viewport Units, Font-family Fallbacks, Float vs Flex/Grid, !important, CSS2 vs CSS3:',
      answer: "CSS choices — rem/root, em/context, vw/vh viewport; fallback fonts, modern layout aur !important ka scope samjho.",
      example: `:root {
  --primary-color: #2563eb;
  --font-stack: 'Inter', system-ui, sans-serif;
}
.hero-screen {
  min-height: 100dvh;
  font-family: var(--font-stack);
}`
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions (44)' },
    { id: 'html-core', label: 'HTML Core' },
    { id: 'positioning-forms', label: 'Forms & Positioning' },
    { id: 'storage-css-basics', label: 'Storage & Specificity' },
    { id: 'box-flexbox-advanced', label: 'Box Model & Flexbox' }
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesTab = activeTab === 'all' || q.category === activeTab;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <div style={styles.headerBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px' }}>🎯</span>
          <h1 style={styles.title}>HTML & CSS Interview Masterclass</h1>
        </div>
        <p style={styles.subtitle}>
          Complete masterclass covering 44 essential HTML & CSS frontend developer interview questions with maximum-depth Hinglish explanations, code examples, comparison tables, and visual interactive sandboxes.
        </p>
      </div>

      {/* Interactive Simulators Section */}
      <div style={styles.simulatorsSection}>
        <h3 style={styles.sectionHeader}>⚡ Interactive CSS Simulators & Toolkits</h3>
        <div style={styles.simulatorsGrid}>
          {/* Simulator 1: Triangle Builder */}
          <div style={styles.simCard}>
            <h4 style={styles.simTitle}>▲ CSS Triangle Generator (Q38)</h4>
            <p style={styles.simSub}>Adjust size and color to build a CSS border triangle:</p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '12px 0' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Size:</label>
              <input
                type="range"
                min="20"
                max="100"
                value={triangleSize}
                onChange={(e) => setTriangleSize(Number(e.target.value))}
              />
              <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{triangleSize}px</span>
              
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '12px' }}>Color:</label>
              <input
                type="color"
                value={triangleColor}
                onChange={(e) => setTriangleColor(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '6px' }}>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${triangleSize / 2}px solid transparent`,
                  borderRight: `${triangleSize / 2}px solid transparent`,
                  borderBottom: `${triangleSize}px solid ${triangleColor}`,
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Simulator 2: Box Sizing Visualizer */}
          <div style={styles.simCard}>
            <h4 style={styles.simTitle}>📦 Box Model Sizing Simulator (Q35)</h4>
            <p style={styles.simSub}>Toggle box-sizing mode to observe container dimension shifts:</p>
            <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
              <button
                onClick={() => setBoxSizing('content-box')}
                style={boxSizing === 'content-box' ? styles.activeSimBtn : styles.simBtn}
              >
                content-box
              </button>
              <button
                onClick={() => setBoxSizing('border-box')}
                style={boxSizing === 'border-box' ? styles.activeSimBtn : styles.simBtn}
              >
                border-box (Standard)
              </button>
            </div>
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
              <div
                style={{
                  boxSizing: boxSizing,
                  width: '200px',
                  padding: '20px',
                  border: '4px solid #ef4444',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: '0 auto',
                  transition: 'all 0.3s ease'
                }}
              >
                Specified Width: 200px
                <br />
                Padding: 20px | Border: 4px
                <br />
                <span style={{ color: boxSizing === 'content-box' ? '#ef4444' : '#22c55e' }}>
                  Rendered Width: {boxSizing === 'content-box' ? '248px ⚠️' : '200px ✅'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.tabsRow}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={activeTab === cat.id ? styles.activeTabBtn : styles.tabBtn}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div style={styles.searchBox}>
          <span style={{ marginRight: '8px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Accordion Questions List */}
      <div style={styles.questionsList}>
        {filteredQuestions.length === 0 ? (
          <div style={styles.noResults}>No matching interview questions found.</div>
        ) : (
          filteredQuestions.map((q) => {
            const isOpen = openCard === q.id;
            return (
              <div key={q.id} style={styles.accordionCard}>
                <button
                  onClick={() => setOpenCard(isOpen ? null : q.id)}
                  style={styles.accordionHeader}
                >
                  <span style={styles.questionTitle}>{q.question}</span>
                  <span style={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div style={styles.accordionBody}>
                    <pre style={styles.answerText}>{q.answer}</pre>
                    {q.example && (
                      <div style={styles.exampleContainer}>
                        <div style={styles.exampleHeader}>CODE SNIPPET / IMPLEMENTATION EXAMPLE:</div>
                        <pre style={styles.exampleCode}>{q.example}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
    color: 'var(--text-primary)',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  headerBanner: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  },
  simulatorsSection: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px'
  },
  sectionHeader: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--accent)'
  },
  simulatorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px'
  },
  simCard: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '16px'
  },
  simTitle: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  simSub: {
    margin: 0,
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  simBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    cursor: 'pointer'
  },
  activeSimBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid var(--accent)',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer'
  },
  controlsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  tabsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tabBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeTabBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid var(--accent)',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '6px 12px',
    minWidth: '260px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '13px',
    width: '100%'
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  accordionCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    color: 'var(--text-primary)'
  },
  questionTitle: {
    fontSize: '15px',
    fontWeight: '600'
  },
  chevron: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginLeft: '12px'
  },
  accordionBody: {
    padding: '0 20px 20px 20px',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--bg)'
  },
  answerText: {
    margin: '16px 0 0 0',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '13px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    color: 'var(--text-primary)'
  },
  exampleContainer: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)'
  },
  exampleHeader: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--accent)',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  },
  exampleCode: {
    margin: 0,
    fontFamily: 'Fira Code, monospace',
    fontSize: '12px',
    color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap'
  },
  noResults: {
    padding: '32px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '8px'
  }
};
