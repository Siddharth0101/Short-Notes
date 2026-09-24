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

const q1_example = {
    tagOpening: "<p class='text'>",
    innerContent: "This whole structure is an element.",
    tagClosing: "</p>"
};

const q2_example = `<a href="https://google.com" target="_blank" class="nav-link" id="home-btn">Go to Google</a>`;

const q3_example = `<img src="hero.jpg" alt="Hero banner" width="800" height="400">
<input type="text" name="username" placeholder="Enter username">
<br>`;

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

const q5_example = `<!-- Multiple elements sharing class -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-danger">Delete</button>

<!-- Unique id per page -->
<header id="main-header">Navbar</header>`;

const q6_example = `<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <script src="app.js" defer></script>
</head>
<body>
  <img src="banner.webp" loading="lazy" alt="Banner" width="1200" height="600">
</body>`;

const q7_example = `<p>This is <b>bold text</b> for visual design.</p>
<p>This is <strong>CRITICAL WARNING</strong> for user safety.</p>

<p>He spoke in <i>Latin</i>.</p>
<p>I <em>love</em> coding! (Emphasis on love)</p>`;

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

const q9_example = `<iframe 
  src="https://example.com" 
  width="100%" 
  height="400" 
  title="Embedded Page"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy">
</iframe>`;

const q10_example = `.block-demo {
  display: block;        /* Full width, new line */
}
.inline-demo {
  display: inline;       /* Content width, ignores custom width/height */
}
.inline-block-demo {
  display: inline-block; /* Inline flow + customizable width/height */
}`;

const q11_example = `.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 100;
}`;


const q12_example = `<div style="position: relative; width: 300px; height: 200px; background: #333;">
  <span style="position: absolute; top: 10px; right: 10px; background: red; color: white;">
    Badge
  </span>
</div>`;

const q13_example = `.flex-container { display: flex; }`;

const q14_example = `.hidden-box { display: none; }
.invisible-box { visibility: hidden; }`;

const q15_example = `<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>`;

const q16_example = `<link rel="stylesheet" href="styles.css">`;

const q17_example = `<link rel="stylesheet" href="theme.css">
<a href="/login">Login</a>`;

const q18_example = `<script src="app.js" defer></script>`;

const q19_example = `document.querySelector('form').addEventListener('submit', (e) => e.preventDefault());`;

const q20_example = `element.addEventListener('click', (e) => console.log('Clicked!', e.target));`;

const q21_example = `<video controls src="movie.mp4"></video>`;

const q22_example = `<video controls width="640">
  <source src="movie.mp4" type="video/mp4">
</video>`;

const q23_example = `<article>
  <header><h1>Blog Title</h1></header>
  <p>Body text</p>
</article>`;

const q24_example = `<!DOCTYPE html>`;


const q25_example = `localStorage.setItem('theme', 'dark');`;

const q26_example = `<article><header><h1>Article Title</h1></header></article>`;

const q27_example = `<track src="subs.vtt" kind="subtitles">`;

const q28_example = `<img src="pic.jpg" draggable="true" ondragstart="event.dataTransfer.setData('text', event.target.id)">`;

const q29_example = `const worker = new Worker('worker.js');
worker.postMessage('start');`;

const q30_example = `img { width: 100%; height: 300px; object-fit: cover; }`;

const q31_example = `{ "name": "App", "start_url": "/", "display": "standalone" }`;

const q32_example = `sessionStorage.setItem('key', 'val');`;

const q33_example = `Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict`;

const q34_example = `#header { color: red; } /* (0,1,0,0) beats .nav .link (0,0,2,0) */`;


const q35_example = `* { box-sizing: border-box; }`;

const q36_example = `.center-container { display: flex; justify-content: center; align-items: center; }`;

const q37_example = `const shadow = element.attachShadow({ mode: 'open' });`;

const q38_example = `.triangle-up {
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid #3b82f6;
}`;

const q39_example = `.badge::before { content: '★ '; color: gold; }`;

const q40_example = `<button data-role="admin">Admin</button>`;

const q41_example = `.modal { position: fixed; z-index: 1000; }`;

const q42_example = `.screen-center { display: flex; justify-content: center; align-items: center; min-height: 100vh; }`;

const q43_example = `div > p { color: blue; }`;

const q44_example = `body { font-family: 'Inter', sans-serif; }`;
