// Original questions and examples; canonical expansions avoid duplicate practice cards.
export const requestedQuestions = [
  {
    id: 'iq-added-html-elements',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'Are HTML tags and elements the same? How do attributes fit in?',
    answer:
      'A tag is markup syntax such as `<p>` or `</p>`. An element is the document structure represented by that markup, including its content and attributes. Attributes configure an element or provide metadata; they are written on its start tag.\n\n```html\n<p class="summary" lang="en">Study one concept.</p>\n```\n\nHere `p` is the element type, the two tags delimit it, and class/lang are attributes. DOM properties are a related runtime interface, not always an exact reflection of markup attributes.',
    followUp:
      "How do an input's value attribute and its current value property differ after typing?",
    tags: ['html', 'html-elements'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-void',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What are void elements, and do they have closing tags?',
    answer:
      'Void HTML elements cannot contain child content and must not have end tags. Examples include `img`, `input`, `br`, `hr`, `meta`, `link`, `source`, `track`, `area`, `base`, `col`, `embed`, and `wbr`.\n\n```html\n<img src="lesson.webp" alt="A learner drawing a graph">\n<input name="email" type="email">\n```\n\nThe slash in `<img />` does not give HTML a general self-closing-element mechanism. A non-void `<div />` does not behave like a closed div in HTML parsing.',
    followUp: 'Why can using `<script />` break the rest of an HTML document?',
    tags: ['html', 'html-void'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-lists',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do ordered, unordered, and description lists differ?',
    answer:
      'Use `ol` when sequence or ranking matters, `ul` when order is not the meaning, and `dl` for name/value or term/description groups. Styling bullets away does not remove list semantics.\n\n```html\n<ol><li>Read</li><li>Practice</li></ol>\n<ul><li>Java</li><li>React</li></ul>\n<dl><dt>Closure</dt><dd>A function with access to lexical bindings.</dd></dl>\n```\n\nUse li inside ol/ul; dl uses dt and dd. Multiple terms or descriptions can belong to a group where meaningful.',
    followUp:
      'Would a navigation menu require an ordered list merely because its links appear in a row?',
    tags: ['html', 'html-lists'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-id-class',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What is class, and how does it differ from id?',
    answer:
      'A class is a reusable space-separated token used for styling or selection; an element can have several. An id identifies one element within a document and should be unique there. IDs also support fragment navigation and label relationships.\n\n```html\n<label for="course-search">Find a course</label>\n<input id="course-search" class="field field-wide">\n```\n\nCSS uses `.field` for class selection and `#course-search` for the ID. Avoid styling everything with IDs because that increases specificity and makes reuse harder.',
    followUp: 'What breaks if two inputs have the same ID referenced by a label?',
    tags: ['html', 'html-id-class'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-emphasis',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do strong and b differ, and how do em and i differ?',
    answer:
      '`strong` marks importance, seriousness, or urgency; `b` draws attention without that extra importance. `em` expresses stress emphasis, while `i` marks text in an alternate voice or convention, such as a technical term. Browser bold/italic defaults are presentation, not their definitions.\n\n```html\n<p><strong>Save your draft before resetting.</strong></p>\n<p>I asked for <em>one</em> example.</p>\n<p>The term <i>lexical scope</i> describes lookup by source nesting.</p>\n```\n\nUse CSS when the requirement is purely visual.',
    followUp: 'How can moving em within a sentence change its meaning without changing any words?',
    tags: ['html', 'html-emphasis'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-document',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question:
      'What belongs in head and body, and how do header, nav, main, aside, and footer shape a page?',
    answer:
      '`head` contains document metadata such as title, charset, stylesheet links, and suitable scripts. `body` contains page content. A body-level header typically introduces the site/page; nav groups major navigation; main contains the dominant content; aside holds tangential content; footer contains closing information. Article is independently meaningful content; section is a thematic grouping, usually with a heading.\n\n```html\n<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Notes</title></head>\n<body><header><h1>Study notes</h1></header><nav aria-label="Main"><a href="/">Home</a></nav><main><article><h2>Closures</h2><p>One concept...</p></article></main><footer>About this collection</footer></body></html>\n```\n\nThese elements do not prescribe pixel positions; CSS controls layout.',
    followUp: 'When could an article contain its own header and footer?',
    tags: ['html', 'html-document'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-iframe',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Can one web page be embedded in another?',
    answer:
      'An iframe embeds another browsing context. Give it a descriptive title and a deliberately limited permission/sandbox policy. The embedded server can refuse framing through its security headers, and cross-origin rules normally prevent arbitrary access to its DOM.\n\n```html\n<iframe src="/demo.html" title="Binary search demonstration" loading="lazy"></iframe>\n```\n\nFor cross-origin cooperation, use a carefully checked postMessage contract rather than trying to bypass isolation. An iframe is heavier than an ordinary component.',
    followUp: 'Which checks should a message receiver perform on origin and payload?',
    tags: ['html', 'html-iframe'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-links',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question:
      "How does an anchor's href work, what do target values mean, and how is link different from a?",
    answer:
      'An anchor creates a navigable hyperlink through href. `_self` uses the current context, `_blank` opens a new context, `_parent` uses the parent, and `_top` uses the top-level context; a named target can reuse a named context. A `link` element describes a resource relationship, such as a stylesheet, and is usually placed in head.\n\n```html\n<link rel="stylesheet" href="/styles.css">\n<a href="/notes" target="_blank" rel="noopener">Open notes</a>\n<a href="#practice">Jump to practice</a>\n```\n\nUse a button for an action without navigation. Consider whether a new tab is actually helpful.',
    followUp: 'Why is href="#" a poor substitute for a real button action?',
    tags: ['html', 'html-links'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-scripts',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question:
      'When should scripts go in head or body, and how do defer, async, and modules change loading?',
    answer:
      'A classic external script without async/defer blocks parsing where encountered. Moving it near the end of body lets earlier markup parse first. Head plus defer downloads in parallel and executes deferred classic scripts after parsing in document order, before DOMContentLoaded. Async executes when ready, so dependencies cannot rely on document order. Module scripts are deferred by default unless async changes scheduling.\n\n```html\n<script src="/app.js" defer></script>\n<script type="module" src="/main.js"></script>\n```\n\nUse async for genuinely independent work; avoid loading the same application through both examples.',
    followUp:
      'Why can an async script fail when it immediately queries an element later in the document?',
    tags: ['html', 'html-scripts'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-forms',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do HTML forms work, and which default behaviors matter?',
    answer:
      'A form submits successful named controls to its action URL; method defaults to GET, and an omitted action targets the current document. A button inside a form defaults to submit unless its type says otherwise. Browser validation can stop invalid submission; disabled controls are not submitted. An Enter key can trigger implicit submission depending on the controls.\n\n```html\n<form action="/search" method="get">\n  <label for="q">Search</label><input id="q" name="q" required>\n  <button type="submit">Find</button>\n  <button type="button">Show help</button>\n</form>\n```\n\nA client submit handler can call preventDefault to implement an alternative flow; server validation remains necessary.',
    followUp: 'Why would removing name from the input make the submitted query disappear?',
    tags: ['html', 'html-forms'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-events',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How can HTML interactions be handled with JavaScript?',
    answer:
      "Inline event attributes exist, but addEventListener usually separates behavior cleanly, allows multiple listeners, and supports explicit cleanup. Use the event object to inspect the action; prefer semantic controls.\n\n```html\n<button id=\"practice\" type=\"button\">Practice</button>\n<script>\nconst button = document.querySelector('#practice');\nconst start = () => console.log('Starting a round');\nbutton.addEventListener('click', start);\n// On teardown: button.removeEventListener('click', start);\n</script>\n```\n\nRegister after the element exists. Use the same function identity when removing a listener.",
    followUp:
      'Why does removeEventListener with a freshly created arrow function not remove this listener?',
    tags: ['html', 'html-events'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-evolution',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What did HTML5 improve, and what were its major goals?',
    answer:
      'The HTML5 effort standardized interoperable parsing and web-application features while keeping compatibility with existing web content. Semantic landmarks, native audio/video, richer form controls, and canvas reduced reliance on custom markup or plugins. Modern HTML continues as a Living Standard; it is not a frozen list of new tags. Browser capabilities such as storage and workers belong to the broader web platform and should not all be described as HTML tags. Choose features for accessibility and behavior, then verify support for your audience.',
    followUp: 'Why is saying that HTML5 replaced JavaScript an incorrect conclusion?',
    tags: ['html', 'html-evolution'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-media',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do audio and video work, and what do source and track add?',
    answer:
      'Audio/video provide native playback; source offers candidate formats, and track supplies timed text such as captions through WebVTT. Controls expose playback UI. Autoplay is restricted by browser policy, so it is not a reliable prerequisite for understanding a page.\n\n```html\n<video controls preload="metadata" poster="preview.webp">\n  <source src="lesson.webm" type="video/webm">\n  <source src="lesson.mp4" type="video/mp4">\n  <track kind="captions" src="lesson-en.vtt" srclang="en" label="English" default>\n  <a href="lesson.mp4">Download the lesson</a>\n</video>\n```\n\nProvide meaningful captions/transcripts and consider network cost. Audio uses the same source-selection idea without visual frames.',
    followUp: 'Why does a fallback paragraph inside video not replace the need for captions?',
    tags: ['html', 'html-media'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-headings',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question:
      'What is the relationship between header and h1? Does HTML5 require an h1 inside every header?',
    answer:
      'Header groups introductory content; h1 is a heading rank. They are independent concepts: a header may include a logo, navigation, or heading, and an h1 does not require a header parent. Do not rely on the old proposed automatic section-outline algorithm to reinterpret multiple h1 elements. Use a clear top-level page heading and explicit h2/h3 hierarchy for subsections.\n\n```html\n<header><h1>Java revision</h1><p>Practice by topic</p></header>\n<main><section><h2>Collections</h2><h3>Hash maps</h3></section></main>\n```',
    followUp:
      'How would you verify that heading navigation makes sense without looking at font sizes?',
    tags: ['html', 'html-headings'],
    sources: [
      {
        title: 'Heading elements',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-drag',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'What does native drag-and-drop provide, and how can an image be draggable?',
    answer:
      "Drag-and-drop supports data transfer through drag events and DataTransfer. Images are generally draggable by default; set draggable explicitly when it is part of your contract. A drop target normally cancels dragover's default behavior to accept a drop.\n\n```html\n<img id=\"tile\" src=\"tile.webp\" alt=\"Graph lesson\" draggable=\"true\">\n<script>\ndocument.querySelector('#tile').addEventListener('dragstart', event => {\n  event.dataTransfer.setData('text/plain', 'lesson-graph');\n});\n</script>\n```\n\nValidate dropped data and offer a keyboard/touch-friendly alternative such as Move up/Move down buttons. Dragging is an enhancement, not the only route to an action.",
    followUp:
      'Why should a drop handler not trust HTML or a URL merely because it came from a drag event?',
    tags: ['html', 'html-drag'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-responsive-images',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'How do CSS sizing, srcset/sizes, and picture make images responsive?',
    answer:
      'CSS constrains layout; srcset plus sizes lets the browser choose a suitable source for the rendered width and pixel density; picture supports art direction or format alternatives. Include dimensions to reserve aspect ratio and avoid unexpected shifts.\n\n```html\n<img src="notes-800.webp" srcset="notes-400.webp 400w, notes-800.webp 800w" sizes="(max-width: 600px) 100vw, 600px" width="800" height="450" alt="Notes arranged by topic" style="max-width:100%;height:auto">\n```\n\nThe sizes value should reflect the actual layout. Use a picture/source media condition when a phone needs a different crop, not merely fewer bytes.',
    followUp: 'Why can width:100% still download an unnecessarily huge source image?',
    tags: ['html', 'html-responsive-images'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-manifest',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'What does an HTML5 manifest file mean today, and how is it different from AppCache?',
    answer:
      'The historical html manifest attribute configured Application Cache, an obsolete mechanism that should not be used for new work. A modern web app manifest is JSON describing application identity, icons, start URL, and display preferences; link it from head. It does not cache requests by itself.\n\n```html\n<link rel="manifest" href="/app.webmanifest">\n```\n\nA service worker can implement an explicit offline caching strategy. Define update behavior and offline limits separately from install metadata.',
    followUp: 'What would still fail offline if you added only a web app manifest?',
    tags: ['html', 'html-manifest'],
    sources: [
      {
        title: 'Web app manifest',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest',
      },
    ],
  },
  {
    id: 'iq-added-html-data',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What are data attributes and how are they accessed?',
    answer:
      "Custom data-* attributes attach small application-specific string values to elements without inventing invalid standard attributes. JavaScript exposes them through dataset with camel-cased names. They are visible to page scripts/users, so they are not a secret store.\n\n```html\n<button data-lesson-id=\"42\">Open lesson</button>\n<script>\nconst button = document.querySelector('[data-lesson-id]');\nconsole.log(button.dataset.lessonId); // '42', a string\n</script>\n```\n\nValidate and convert values when needed. Do not use data attributes as a substitute for accessible labels.",
    followUp:
      'How would data-max-count map to a dataset property, and how would you validate it as a number?',
    tags: ['html', 'html-data'],
    sources: [
      {
        title: 'HTML element reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
      },
    ],
  },
  {
    id: 'iq-added-html-shadow-dom',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'What is Shadow DOM? Give an original example and explain its limits.',
    answer:
      "Shadow DOM creates an encapsulated DOM subtree attached to a host, often used in web components. Its style scope helps isolate internals from page styles, while slots can project light-DOM content. It is different from React's render representation and is not a security boundary.\n\n```js\nconst host = document.createElement('div');\nconst shadow = host.attachShadow({mode: 'open'});\nshadow.innerHTML = '<style>p { color: teal; }</style><p>Local styling</p>';\ndocument.body.append(host);\n```\n\nThis browser example inserts only fixed trusted markup. Do not interpolate untrusted strings into innerHTML.",
    followUp:
      'How do composed events and inherited properties complicate the idea of complete isolation?',
    tags: ['html', 'html-shadow-dom'],
    sources: [
      {
        title: 'Using Shadow DOM',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM',
      },
    ],
  },
  {
    id: 'iq-added-css-display',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do inline, block, inline-block, flex, and grid display differ?',
    answer:
      'Display determines box generation and layout participation. In normal flow, block boxes generally start a new line, inline boxes participate in line layout, and inline-block participates inline while allowing box sizing. Flex and grid establish layouts for direct children, usually with block-level outer participation unless an inline variant is chosen. `display:none` generates no box. These are CSS behaviors, not permanent HTML-element categories; CSS can change the default. There is no useful fixed count of all display modes.\n\n```css\n.badge { display: inline-block; padding: .25rem .5rem; }\n.cards { display: grid; grid-template-columns: repeat(2, 1fr); }\n```',
    followUp:
      'Why does assigning width to an ordinary non-replaced inline span not behave like assigning width to a block?',
    tags: ['css', 'css-display'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-position',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'How do static, relative, absolute, fixed, and sticky positioning differ?',
    answer:
      "`position` is a CSS property, not an HTML attribute. Static follows normal flow; relative keeps its original space while offsets move its painted box. Absolute leaves normal flow and uses its containing block, often the nearest positioned ancestor. Fixed commonly uses the viewport, but ancestors such as transformed elements can establish its containing block. Sticky remains in flow and sticks at an inset within its scrolling constraints.\n\n```css\n.card { position: relative; }\n.badge { position: absolute; top: .5rem; right: .5rem; }\n.toolbar { position: sticky; top: 0; }\n```\n\nAbsolute positioning does not reserve the badge's original space.",
    followUp:
      'Why might sticky fail when the relevant ancestor has no room for the element to move?',
    tags: ['css', 'css-position'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-hidden',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do display:none, visibility:hidden, and opacity:0 differ?',
    answer:
      "Display:none removes the element's generated box, so its layout space disappears. Visibility:hidden normally retains layout space but hides the element and prevents normal interaction/focus. Opacity:0 keeps a transparent box that can still receive pointer events or focus unless you change those separately. Display:none and visibility:hidden also normally hide content from the accessibility tree.\n\n```css\n.removed { display: none; }\n.reserved { visibility: hidden; }\n.transparent { opacity: 0; }\n```\n\nChoose based on layout, interaction, and accessibility, not only appearance.",
    followUp: 'Why can an invisible opacity-zero overlay make visible buttons seem broken?',
    tags: ['css', 'css-hidden'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-stylesheets',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What is a stylesheet, and what are the three common ways to apply CSS in HTML?',
    answer:
      'A stylesheet is a collection of CSS rules. An external file is linked with link, an internal stylesheet lives in style, and inline declarations live in an element\'s style attribute. External CSS is reusable and cacheable; internal CSS can be page-specific; inline declarations are local but harder to manage at scale.\n\n```html\n<link rel="stylesheet" href="/site.css">\n<style>.note { padding: 1rem; }</style>\n<p class="note" style="color:teal">Practice daily</p>\n```\n\nCSS also offers imports and programmatic APIs; the three-way answer is a common organization model, not a complete count of mechanisms.',
    followUp:
      'Why does loading an external stylesheet later not automatically override every inline declaration?',
    tags: ['css', 'css-stylesheets'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-specificity',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'What is CSS specificity, and where does !important fit in the cascade?',
    answer:
      'Specificity compares selector weights after relevant cascade decisions such as origin, importance, and layer order. Compare ID selectors, then classes/attributes/pseudo-classes, then element/pseudo-element selectors lexicographically. Equal weights in the same cascade context use order of appearance. Inline styles have special precedence over normal stylesheet declarations; !important is a declaration flag, not an extra specificity digit.\n\n```css\np.note { color: teal; } /* 0 IDs, 1 class, 1 type */\n#intro { color: purple; } /* 1 ID wins in the same normal layer */\n```\n\n`:where()` contributes zero specificity; selectors like :is() take argument specificity. Prefer simpler selectors and deliberate layers over escalating !important.',
    followUp:
      'Why can a more specific selector still lose to a declaration in a higher-priority cascade layer?',
    tags: ['css', 'css-specificity'],
    sources: [
      {
        title: 'CSS specificity',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity',
      },
    ],
  },
  {
    id: 'iq-added-css-box',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What is the CSS box model, and how does box-sizing change width?',
    answer:
      "From inside outward, a box has content, padding, border, and margin. With content-box, width sizes the content; padding and border add to its border-box width. With border-box, declared width includes padding and border; margin remains outside.\n\n```css\n.card { width: 200px; padding: 20px; border: 2px solid; margin: 10px; }\n.compact { box-sizing: border-box; }\n```\n\nThe default card's border box is 244px wide. With border-box it is 200px and its content is 156px. Margins are not added inside the declared width.",
    followUp:
      'How do vertical margin collapsing and inline layout make naive total-height arithmetic misleading?',
    tags: ['css', 'css-box'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-center',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do you center a block inside another element or in the viewport?',
    answer:
      'For two-axis centering, make the parent flex and center on its main and cross axes. A definite available height or min-height is needed to see vertical centering. For horizontal centering alone, a narrower block can use auto inline margins.\n\n```html\n<main class="screen"><div class="card">Revision</div></main>\n<style>\nbody { margin: 0; }\n.screen { min-height: 100vh; min-height: 100dvh; display: flex; justify-content: center; align-items: center; }\n.card { width: min(90%, 24rem); padding: 1rem; box-sizing: border-box; }\n</style>\n```\n\nUse min-height rather than clipping growing content to a fixed height.',
    followUp:
      'What changes when flex-direction becomes column, and why does this example still center both axes?',
    tags: ['css', 'css-center'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-triangle',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'How can borders create a CSS triangle?',
    answer:
      'A zero-size box with thick borders shows triangular border regions. Make three sides transparent and give the remaining border a color. This is appropriate for decoration; meaningful icons still need an accessible name or accompanying text.\n\n```html\n<span class="triangle" aria-hidden="true"></span>\n<style>\n.triangle { display: inline-block; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 14px solid teal; }\n</style>\n```\n\nThe colored bottom border forms an upward-pointing triangle. SVG or clip-path may be easier for complex, scalable shapes.',
    followUp:
      'How would you make the triangle point right without rotating the whole surrounding layout?',
    tags: ['css', 'css-triangle'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-pseudo',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What are pseudo-elements, and how do they differ from pseudo-classes?',
    answer:
      "Pseudo-elements select a part of an element or a generated box, such as ::first-letter, ::before, ::after, and ::selection. Pseudo-classes select an element based on a state or relationship, such as :hover or :focus-visible.\n\n```css\n.required::after { content: ' *'; color: darkred; }\nbutton:focus-visible { outline: 3px solid teal; }\n```\n\nGenerated content should not be the only way to communicate essential information. For a required field, also use real labeling and the appropriate form semantics.",
    followUp:
      'Why is ::before not a dependable way to attach essential text to a void input element?',
    tags: ['css', 'css-pseudo'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-flex',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'What are the main flexbox container and item properties?',
    answer:
      'On the container: display:flex establishes the layout; flex-direction sets the main axis; flex-wrap allows lines; flex-flow combines both; justify-content distributes main-axis space; align-items aligns items on the cross axis; align-content distributes multiple lines; gap sets gutters. On items: order changes visual order; flex-grow distributes positive free space; flex-shrink distributes shrinkage weighted by basis; flex-basis sets the starting main size; flex combines these; align-self overrides alignment.\n\n```css\n.row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }\n.main { flex: 1 1 16rem; min-width: 0; }\n.tools { flex: 0 0 auto; }\n```\n\nVisual reordering does not automatically change reading or keyboard order.',
    followUp:
      'Why might a long unbreakable child require min-width:0 even when flex-shrink is enabled?',
    tags: ['css', 'css-flex'],
    sources: [
      {
        title: 'Flexbox basic concepts',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox',
      },
    ],
  },
  {
    id: 'iq-added-css-flex-lab',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Build a responsive header and an equal-width card row with flexbox.',
    answer:
      'This additional original exercise practices application layout beyond the two supplied image exercises. The header needs a brand on the left and wrapping actions on the right; cards should share space and wrap on narrow screens.\n\n```html\n<header class="bar"><strong>Shortnotes</strong><nav class="actions" aria-label="Main"><a href="/">Read</a><a href="/practice">Practice</a></nav></header>\n<section class="cards" aria-label="Courses"><article>JavaScript</article><article>React</article><article>Java</article></section>\n<style>\n.bar,.actions,.cards { display:flex; gap:1rem; flex-wrap:wrap; }\n.bar { justify-content:space-between; align-items:center; }\n.cards > article { flex:1 1 14rem; min-width:0; padding:1rem; border:1px solid; }\n</style>\n```\n\nCheck 320px width, long link labels, zoom, and keyboard order. Explain why the basis allows wrapping.',
    followUp:
      'How would you keep only the final card from stretching without hard-coding viewport widths?',
    tags: ['css', 'css-flex-lab'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-viewport',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What are vh and vw, and when do dynamic viewport units help?',
    answer:
      'One vw is one percent of the viewport width; one vh is one percent of its height reference. Mobile browser controls make the visible space change, so svh, lvh, and dvh distinguish small, large, and dynamic viewport heights. Prefer flexible min-height for screens that can grow.\n\n```css\n.page { min-height: 100vh; min-height: 100dvh; }\n.title { font-size: clamp(1.5rem, 4vw, 3rem); }\n```\n\nUsing 100vw for an ordinary block can cause horizontal overflow where the width includes scrollbar space; width:100% often fits the parent better.',
    followUp:
      'Why should viewport-based font sizing usually include sensible minimum and maximum values?',
    tags: ['css', 'css-viewport'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-fonts-float',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'Which property selects the font face, and when should float be used?',
    answer:
      "Font-family selects an ordered list of typefaces with a generic fallback. @font-face defines a downloadable font resource; font-weight and font-style select variants. Float is useful when text should wrap around media; flex/grid are usually clearer for whole-page or application layouts.\n\n```css\nbody { font-family: 'Study Sans', system-ui, sans-serif; }\n.article { display: flow-root; }\n.article img { float: inline-start; width: 8rem; margin-inline-end: 1rem; }\n```\n\nFlow-root establishes a formatting context that contains the float. The named custom font needs its own loaded definition if used.",
    followUp:
      'Why does float-based page layout require different clearing/containment reasoning from a flex row?',
    tags: ['css', 'css-fonts-float'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-selectors',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'What do div, p; div p; div ~ p; div + p; and div > p select?',
    answer:
      '`div, p` selects either type. `div p` selects p descendants at any depth. `div ~ p` selects p siblings after a div with the same parent. `div + p` selects a p immediately following a div sibling. `div > p` selects direct p children.\n\n```html\n<div><p>A</p><section><p>B</p></section></div>\n<p>C</p><p>D</p>\n```\n\nFor this fragment, descendants match A/B, direct children match A, adjacent siblings match C, and subsequent siblings match C/D. The comma list includes the div and all four paragraphs.',
    followUp: 'Would moving D into a section preserve its match for div ~ p?',
    tags: ['css', 'css-selectors'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-evolution',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'How do CSS2 and CSS3 differ? Is CSS3 one current version?',
    answer:
      'CSS2 was largely a single specification, with CSS2.1 clarifying its behavior. Later CSS development became modular: selectors, backgrounds, color, layout, and other modules advance at independent levels. Features often grouped under CSS3 include media queries, rounded borders, transitions, and richer selectors. Flexbox and grid have their own specifications. Calling a feature CSS3 is less useful than naming the module and checking its actual browser support. Use progressive enhancement when unsupported features would otherwise block basic use.',
    followUp: 'Why does a selector at Level 4 not imply every other CSS module is also at Level 4?',
    tags: ['css', 'css-evolution'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-css-assets',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'How would you optimize website asset loading without breaking the experience?',
    answer:
      'Measure the critical rendering path first. Ship appropriately sized/compressed images, subset fonts where suitable, compress and cache versioned static assets, and split optional code. Lazy-load below-the-fold images but prioritize a likely largest-contentful image. Use defer/modules for appropriate scripts; preload only resources proven critical.\n\n```html\n<img src="chart.webp" width="640" height="360" loading="lazy" alt="Topic completion chart">\n```\n\nThis example is for a noncritical image. Excessive preloads compete for bandwidth; smaller transfer size alone does not prove faster interaction.',
    followUp:
      'What would you inspect if JavaScript downloaded quickly but the page still remained unresponsive?',
    tags: ['css', 'css-assets'],
    sources: [
      {
        title: 'CSS reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference',
      },
    ],
  },
  {
    id: 'iq-added-js-loop-output',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Foundation',
    question:
      'What does a let loop with six delayed callbacks print? What if sample is never called?',
    answer:
      'Correct the casing to console.log and call the function; a definition alone prints nothing. In an ordinary run, invoking this schedules logs 0 through 5 after at least the requested delay. Each let iteration has its own binding.\n\n```js\nfunction sample() {\n  for (let i = 0; i <= 5; i++) setTimeout(() => console.log(i), 1000);\n}\nsample();\n```\n\nChanging let to var makes these callbacks share one function-scoped i, whose final value is 6. Delays are scheduling thresholds, not precise appointment times.',
    followUp: 'Why does using i < 5 change both the number of callbacks and the final var value?',
    tags: ['javascript', 'js-loop-output'],
    promptCode:
      '```js\nfunction sample() {\n  for (let i = 0; i <= 5; i++) {\n    setTimeout(() => console.log(i), 1000);\n  }\n}\nsample();\n```',
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-timer-order',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Foundation',
    question:
      'A timer logs a after two seconds and synchronous code logs b. How can a precede b without another timer?',
    answer:
      "Initially the output is b then a: the current script completes before the timer callback. Put both ordered operations in the existing callback, or await one promise that is resolved by that timer.\n\n```js\nsetTimeout(() => {\n  console.log('a');\n  console.log('b');\n}, 2000);\n```\n\nBoth now occur after the delay, in a/b order. If b must execute elsewhere, expose a completion promise instead of attempting to block the thread. Correct identifiers are setTimeout and console, with lowercase initials.",
    followUp: 'Can this guarantee execution at exactly 2000 milliseconds under a busy event loop?',
    tags: ['javascript', 'js-timer-order'],
    promptCode: "```js\nsetTimeout(() => console.log('a'), 2000);\nconsole.log('b');\n```",
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-promise-basics',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Foundation',
    question:
      'What are promises, what are their three states, and how do they compare with callbacks?',
    answer:
      'A callback is a function supplied for another operation to invoke; it can be synchronous or asynchronous and may be invoked many times by an event API. A promise represents one eventual settlement: pending, fulfilled, or rejected. It provides a composable result/error channel through then/catch/finally. Promise executors run synchronously; attached reactions run asynchronously.\n\n```js\nconst result = new Promise(resolve => resolve(21));\nresult.then(value => value * 2).then(console.log); // 42\n```\n\nResolved is not a fourth state: resolving with another pending promise can adopt its future outcome. Promises do not automatically cancel work or replace ongoing event subscriptions.',
    followUp:
      'Why can forgetting to return an inner promise break both sequencing and error handling?',
    tags: ['javascript', 'js-promise-basics'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-rejection-output',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Foundation',
    question: 'What is printed when a promise rejects with an object containing msg?',
    answer:
      "After repairing the supplied syntax, rejection skips the fulfillment handler and reaches catch. The output is Something went wrong. The catch callback below returns undefined, so the promise produced by catch fulfills with undefined unless another error is thrown.\n\n```js\nconst task = new Promise((resolve, reject) => {\n  reject({msg: 'Something went wrong'});\n});\ntask.then(value => console.log(value)).catch(error => console.log(error.msg));\n```\n\nAn Error object usually gives better stack information than a plain object. The original mismatched brackets/casing would cause a syntax or identifier error rather than this intended trace.",
    followUp: 'What changes if the catch handler throws a new Error after logging?',
    tags: ['javascript', 'js-rejection-output'],
    promptCode:
      "```js\nconst task = new Promise((resolve, reject) => {\n  reject({msg: 'Something went wrong'});\n});\ntask.then(value => console.log(value))\n  .catch(error => console.log(error.msg));\n```",
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-delay-output',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Intermediate',
    question:
      'After await delay(6000), a ten-second timer is scheduled and second is logged. What is the timeline?',
    answer:
      "Assume delay returns a promise settled by its timer and the code runs inside an async function or an ES module. After roughly six seconds, second logs and the ten-second timer has just been scheduled; first is eligible around sixteen seconds from the original start, not ten.\n\n```js\nconst delay = ms => new Promise(resolve => setTimeout(resolve, ms));\nasync function run() {\n  await delay(6000);\n  setTimeout(() => console.log('first'), 10000);\n  console.log('second');\n}\nrun();\n```\n\nActual execution can be later under load. An undefined delay helper or await in an unsupported syntactic context changes the problem into an error.",
    followUp:
      'What timeline results if the ten-second timer is scheduled before awaiting the six-second delay?',
    tags: ['javascript', 'js-delay-output'],
    promptCode:
      "```js\nconst delay = ms => new Promise(resolve => setTimeout(resolve, ms));\nasync function run() {\n  await delay(6000);\n  setTimeout(() => console.log('first'), 10000);\n  console.log('second');\n}\nrun();\n```",
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-await-timers',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Intermediate',
    question:
      'Why does await setTimeout not wait for the callback, and how do you repair the a/b/c/d/e example?',
    answer:
      "Assume ordinary browser timer APIs. setTimeout returns a handle, not a promise for completion. Await wraps that value and resumes through a microtask; it does not wait for the timer's callback. Corrected original code normally logs a, b, e, d, c with delays 1000 and 0.\n\n```js\nconst delay = ms => new Promise(resolve => setTimeout(resolve, ms));\nasync function fun1() {\n  console.log('a');\n  console.log('b');\n  await delay(1000); console.log('c');\n  await delay(0); console.log('d');\n  console.log('e');\n}\nfun1();\n```\n\nThe repaired version logs a, b, c, d, e. Await pauses this async function, not the entire JavaScript thread.",
    followUp:
      'Why is top-level await valid in ES modules even though ordinary non-async function bodies cannot use await?',
    tags: ['javascript', 'js-await-timers'],
    promptCode:
      "```js\n// Ordinary browser timers; predict before repairing.\nasync function fun1() {\n  console.log('a');\n  console.log('b');\n  await setTimeout(() => console.log('c'), 1000);\n  await setTimeout(() => console.log('d'), 0);\n  console.log('e');\n}\nfun1();\n```",
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-callback-hell',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-async-event-loop',
    level: 'Intermediate',
    question: 'What is callback hell, and when do async/await improve the design?',
    answer:
      'Deeply nested dependent callbacks mix success paths, repeated error handling, and control flow. Promises expose returnable operations; async/await lets a function express a dependent sequence with ordinary try/catch. Use it when you want to consume promise-based results clearly, while keeping independent work concurrent when appropriate.\n\n```js\n// Application excerpt: these three helpers return promises.\nasync function enroll(userId) {\n  const user = await loadUser(userId);\n  const course = await chooseCourse(user);\n  return saveEnrollment(user.id, course.id);\n}\n```\n\nA callback API must be correctly adapted first. Await does not convert arbitrary callback registration into completion waiting, and callbacks remain appropriate for repeated events.',
    followUp:
      'Which operations could run concurrently if choosing a course no longer depended on loading the user?',
    tags: ['javascript', 'js-callback-hell'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-node-nexttick',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Intermediate',
    question: 'What is process.nextTick, and how does it differ from setImmediate?',
    answer:
      "Both are Node-specific scheduling APIs. nextTick queues work for a next-tick checkpoint after the current JavaScript operation, before proceeding through ordinary event-loop phases. setImmediate runs in the check phase and permits the loop to progress. Recursive nextTick scheduling can starve I/O.\n\n```js\n// Run as a CommonJS .cjs file.\nprocess.nextTick(() => console.log('tick'));\nsetImmediate(() => console.log('immediate'));\nconsole.log('sync');\n// sync, tick, immediate\n```\n\nDo not generalize this into an unconditional ordering against every promise callback: ES-module evaluation and work already executing inside microtasks affect that comparison.",
    followUp:
      'Why is nextTick a poor mechanism for breaking a long CPU task into responsive chunks?',
    tags: ['node', 'node-nexttick'],
    sources: [
      {
        title: 'Node nextTick scheduling',
        url: 'https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick',
      },
    ],
  },
  {
    id: 'iq-added-node-immediate-output',
    track: 'mongodb',
    topic: 'node',
    noteId: 'mongo-node-runtime-http',
    level: 'Intermediate',
    question: 'What is the order of setImmediate, setTimeout(0), and synchronous logging in Node?',
    answer:
      "Correct the names to setImmediate, setTimeout, and console.log. Third logs first. At top-level, the relative order of the immediate and zero-delay timer is not a portable guarantee; it depends on timing and event-loop context.\n\n```js\n// Node script\nsetImmediate(() => console.log('first'));\nsetTimeout(() => console.log('second'), 0);\nconsole.log('third');\n```\n\nWhen both are scheduled inside an ordinary I/O callback, the immediate is expected before that newly scheduled timer. Specify the context instead of memorizing one output from one execution. Browser JavaScript does not provide standard setImmediate/process.nextTick APIs.",
    followUp:
      'How would you rewrite this as an I/O-callback experiment without claiming the top-level result is deterministic?',
    tags: ['node', 'node-immediate-output'],
    promptCode:
      "```js\n// Run in Node, not a browser.\nsetImmediate(() => console.log('first'));\nsetTimeout(() => console.log('second'), 0);\nconsole.log('third');\n```",
    sources: [
      {
        title: 'Node setImmediate scheduling',
        url: 'https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate',
      },
    ],
  },
  {
    id: 'iq-added-js-array-methods',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modern-data-collections',
    level: 'Foundation',
    question: 'How do forEach, map, filter, and reduce differ?',
    answer:
      'forEach performs a callback for each visited item and returns undefined; map builds transformed items; filter retains items passing a predicate; reduce carries an accumulator into the next step.\n\n```js\nconst minutes = [5, 10, 15];\nconsole.log(minutes.map(n => n * 2)); // [10,20,30]\nconsole.log(minutes.filter(n => n >= 10)); // [10,15]\nconsole.log(minutes.reduce((sum, n) => sum + n, 0)); // 30\nconsole.log(minutes.forEach(n => n + 1)); // undefined\n```\n\nNone of these examples mutate the array, but your callback can still mutate referenced objects. Use an explicit initial accumulator so an empty array has a defined reduction result.',
    followUp:
      'Why does forEach with an async callback not return a promise that waits for every callback?',
    tags: ['javascript', 'js-array-methods'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-object-enumeration',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modern-data-collections',
    level: 'Foundation',
    question: "How can you count an object's properties and print values without keys?",
    answer:
      "Ordinary objects have no general length property. Object.keys counts own enumerable string-keyed properties; Object.values returns their values; Object.entries returns key/value pairs. These do not include inherited or symbol-keyed properties. Reflect.ownKeys includes all own string and symbol keys, including non-enumerable ones.\n\n```js\nconst progress = {java: 3, react: 5};\nconsole.log(Object.keys(progress).length); // 2\nfor (const value of Object.values(progress)) console.log(value); // 3, 5\n```\n\nDefine which kind of property you mean before claiming an object's length.",
    followUp: 'Why could for...in print values that Object.values omits?',
    tags: ['javascript', 'js-object-enumeration'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-array-check',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modern-data-collections',
    level: 'Foundation',
    question: 'What does typeof return for an array, and how do you reliably detect arrays?',
    answer:
      "An array is an object, so typeof [] is 'object'. Use Array.isArray to test array identity; it works across realms such as iframes, unlike an instanceof Array check tied to one realm's constructor. Array-like values and typed arrays are separate categories.\n\n```js\nconsole.log(typeof []); // 'object'\nconsole.log(Array.isArray([])); // true\nconsole.log(Array.isArray({0: 'a', length: 1})); // false\nconsole.log(Array.isArray(new Uint8Array(2))); // false\n```\n\nHaving indexed properties and length is not proof of being an Array.",
    followUp: 'When would Array.from be useful even when Array.isArray returns false?',
    tags: ['javascript', 'js-array-check'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-es6',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modern-data-collections',
    level: 'Intermediate',
    question:
      'Explain ten ES2015 features with original examples, without mixing in later additions.',
    answer:
      "ES6 means ES2015. Ten useful features are block-scoped bindings, arrows, template literals, destructuring, default parameters, rest parameters, iterable spread, classes, modules, and promises.\n\n```js\nlet read = 0; const target = 3; // block-scoped bindings\nconst double = n => n * 2; // lexical-this arrow\nconst label = `Read ${read}/${target}`; // interpolation\nconst [first] = [8, 9]; // destructuring\nconst greet = (name = 'Learner') => name; // default\nconst count = (...items) => items.length; // rest\nconst copy = [...[1, 2]]; // iterable spread\nclass Lesson { constructor(id) { this.id = id; } }\nconst ready = Promise.resolve('ready');\n```\n\nFor the tenth feature, one module can `export const goal = 3;` and another can `import {goal} from './goal.js';`. These are separate module files. Async/await and object spread arrived later; do not label them ES2015. Defaults apply to undefined, not null, and spread is shallow.\n\nExplain each mechanism before presenting its syntax:\n\n1. **Bindings:** let allows reassignment, const does not; both follow block scope and temporal-dead-zone rules.\n2. **Arrows:** compact function expressions retain lexical this, useful for callbacks, but cannot serve as constructors.\n3. **Template literals:** interpolate expressions and preserve literal line breaks; they do not automatically sanitize HTML.\n4. **Destructuring:** extract named or positional values into bindings; missing fields may use explicit defaults.\n5. **Default parameters:** supply a value for an omitted or undefined argument; passing null does not activate the default.\n6. **Rest parameters:** collect remaining arguments into an actual array so normal array operations can be used.\n7. **Iterable spread:** expand iterable values into calls or arrays; copying an array still shares nested object references.\n8. **Classes:** organize constructor and prototype methods with class syntax; they still use the prototype model and class method bodies are strict.\n9. **Modules:** make imports/exports explicit and provide module scope; consumers observe live exported bindings.\n10. **Promises:** represent one eventual settlement and compose results/errors; constructing a promise does not make CPU work run in another thread.",
    followUp: 'Choose three features and explain one limitation or surprising behavior of each.',
    tags: ['javascript', 'js-es6'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-function-forms',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-functions',
    level: 'Foundation',
    question:
      'What is a function definition, and how do declarations, expressions, anonymous functions, and higher-order functions differ?',
    answer:
      'A definition supplies parameters and executable behavior; calling the function runs it with arguments. A declaration binds a name using declaration syntax; an expression produces a function value, which may be anonymous or named. A higher-order function accepts or returns functions.\n\n```js\nfunction square(n) { return n * n; } // declaration\nconst triple = function (n) { return n * 3; }; // anonymous expression\nfunction transform(value, operation) { return operation(value); }\nconsole.log(transform(4, square)); // 16\nconsole.log(transform(4, triple)); // 12\n```\n\nPassing square is different from passing square(4), which would pass the result. Callback describes a role, not a separate syntax.',
    followUp:
      'Why can a named function expression help with recursion and debugging while keeping its inner name local?',
    tags: ['javascript', 'js-function-forms'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-iife',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-functions',
    level: 'Intermediate',
    question: 'What is an IIFE, and when can one still be useful?',
    answer:
      'An immediately invoked function expression creates a function value and calls it at once. It can isolate temporary bindings or support an async entry point in a context without top-level await. Modules and block scope now solve many historical global-variable problems.\n\n```js\nconst initialTotal = (() => {\n  const minutes = [5, 10];\n  return minutes.reduce((sum, n) => sum + n, 0);\n})();\nconsole.log(initialTotal); // 15\n```\n\nThe temporary minutes binding is internal. An async IIFE returns a promise whose errors still need handling.',
    followUp:
      'Why can starting an IIFE immediately after another expression require a semicolon boundary?',
    tags: ['javascript', 'js-iife'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-memoization',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-functions',
    level: 'Intermediate',
    question: 'What is memoization? Implement it and explain when the cache is wrong.',
    answer:
      'Memoization reuses a function result for an input already evaluated. It is valid only if the key captures everything affecting the result and the cached outcome remains appropriate. This single-number example is intentionally narrower than a universal memoizer.\n\n```js\nfunction memoizeNumber(fn) {\n  const cache = new Map();\n  return n => {\n    if (!cache.has(n)) cache.set(n, fn(n));\n    return cache.get(n);\n  };\n}\nconst square = memoizeNumber(n => n * n);\nconsole.log(square(4), square(4)); // 16, 16\n```\n\nMap.has correctly handles cached zero/undefined values. Unbounded distinct inputs retain memory; mutable external dependencies make this cache stale.',
    followUp:
      'What eviction and key strategy would you need for a user-specific, asynchronous query?',
    tags: ['javascript', 'js-memoization'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-call-apply-bind',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-this-prototypes-classes',
    level: 'Intermediate',
    question: 'When should you use call, apply, or bind?',
    answer:
      "Call invokes a regular function with an explicit this and separate arguments. Apply invokes it with an explicit this and an array-like argument list. Bind returns a new function with a bound receiver and optionally leading arguments; it does not invoke immediately.\n\n```js\nfunction total(extra) { return this.minutes + extra; }\nconst learner = {minutes: 20};\nconsole.log(total.call(learner, 5)); // 25\nconsole.log(total.apply(learner, [7])); // 27\nconst later = total.bind(learner, 10);\nconsole.log(later()); // 30\n```\n\nThese methods cannot replace an arrow's lexical this. Store a bound callback if you later need its identity for removal.",
    followUp: 'Why do two independent bind calls create callbacks that are not strictly equal?',
    tags: ['javascript', 'js-call-apply-bind'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-create-objects',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-this-prototypes-classes',
    level: 'Foundation',
    question: 'What are three common ways to create objects, and what do prototype methods do?',
    answer:
      "Object literals create a direct record; Object.create selects a prototype; constructor functions/classes create instances with shared prototype behavior. There are more than three possible APIs, so this is a teaching grouping.\n\n```js\nconst literal = {title: 'Arrays'};\nconst behavior = {label() { return this.title; }};\nconst inherited = Object.create(behavior); inherited.title = 'Trees';\nclass Lesson { constructor(title) { this.title = title; } label() { return this.title; } }\nconsole.log(inherited.label(), new Lesson('Graphs').label()); // Trees Graphs\n```\n\nObject.prototype methods such as toString/isPrototypeOf are inherited behavior. Object.keys/create/hasOwn are static Object methods, not methods stored on every object's prototype. Null-prototype objects inherit none of Object.prototype.",
    followUp: 'Why is Object.hasOwn(obj, key) safer than assuming obj.hasOwnProperty is callable?',
    tags: ['javascript', 'js-create-objects'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-method-chaining',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-this-prototypes-classes',
    level: 'Intermediate',
    question: 'What is method chaining, and how is it different from a prototype chain?',
    answer:
      'Method chaining calls methods on the result of the previous method. A fluent mutable API often returns this; an immutable API may return a new value. A prototype chain instead governs inherited property lookup.\n\n```js\nconst progress = {\n  minutes: 0,\n  add(n) { this.minutes += n; return this; },\n  reset() { this.minutes = 0; return this; }\n};\nconsole.log(progress.add(5).add(10).minutes); // 15\n```\n\nThis example is intentionally mutable. Document validation and mutation rather than assuming fluent syntax makes the API safe.',
    followUp:
      'How would you rewrite add to return a fresh value, and how would that change aliasing behavior?',
    tags: ['javascript', 'js-method-chaining'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-pass-values',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-this-prototypes-classes',
    level: 'Foundation',
    question: 'Does JavaScript pass objects by reference? Show mutation versus reassignment.',
    answer:
      "JavaScript passes values. For objects, that value refers to an object, so caller and callee can reach the same mutable object. Reassigning the parameter does not reassign the caller's variable; calling this pass-by-reference without that distinction is misleading.\n\n```js\nfunction revise(note) {\n  note.done = true;\n  note = {done: false};\n}\nconst original = {done: false};\nrevise(original);\nconsole.log(original.done); // true\n```\n\nTo deliver a replacement object, return it and explicitly assign the returned value at the call site.",
    followUp:
      'What changes when you pass a number instead of an object to a function that reassigns its parameter?',
    tags: ['javascript', 'js-pass-values'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-null-types',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-types-operators',
    level: 'Foundation',
    question: 'How do null, undefined, NaN, and JavaScript value types differ?',
    answer:
      "Values have types; variables can later hold a value of another type. Primitive types are undefined, null, boolean, number, bigint, string, and symbol; objects form the other major category. Undefined often means absent/uninitialized-to-a-value; null is an explicit empty-value convention. NaN is a number value representing an invalid numeric result, not its own type.\n\n```js\nconsole.log(null === undefined); // false\nconsole.log(null == undefined); // true\nconsole.log(typeof null); // 'object', historical behavior\nconsole.log(typeof NaN); // 'number'\nconsole.log(Number.isNaN(Number('notes'))); // true\n```\n\nPrefer Number.isNaN for a noncoercing NaN check. The special null/undefined loose comparison does not mean they are identical.",
    followUp: 'Why does NaN === NaN return false, while Object.is(NaN, NaN) returns true?',
    tags: ['javascript', 'js-null-types'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-escape',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-types-operators',
    level: 'Foundation',
    question: 'What are escape sequences, and why are they used?',
    answer:
      "Escape sequences represent characters that would otherwise end a string or are awkward to write literally, such as quotes, newlines, tabs, and backslashes. The source representation and resulting characters are different layers.\n\n```js\nconst quoted = 'It\\'s time to study';\nconst folder = 'C:\\\\notes';\nconsole.log(quoted); // It's time to study\nconsole.log(folder); // C:\\notes\n```\n\nA backslash followed by n represents a newline in a normal string literal; a doubled backslash followed by n represents the visible characters backslash and n. Template literals can contain actual line breaks.",
    followUp:
      'Why do JSON strings, JavaScript source strings, and regular expressions require attention to different escaping layers?',
    tags: ['javascript', 'js-escape'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-break-continue',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-loops',
    level: 'Foundation',
    question: 'How do break and continue differ?',
    answer:
      'Break exits the nearest applicable loop (or switch); continue skips the rest of the current loop iteration and proceeds to its next iteration step. They do not return from the containing function.\n\n```js\nfor (const n of [1, 2, 3, 4, 5]) {\n  if (n === 2) continue;\n  if (n === 4) break;\n  console.log(n);\n}\n// 1, 3\n```\n\nIn a while loop, skipping an update with continue can create an infinite loop. In nested loops, unlabeled break affects only the nearest loop.',
    followUp: 'How would you stop processing entirely by returning from a function instead?',
    tags: ['javascript', 'js-break-continue'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-event-phases',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'How do capturing, bubbling, preventDefault, and stopPropagation differ?',
    answer:
      "Capture visits ancestors toward the target; bubbling visits ancestors away from it for events that bubble. StopPropagation stops further propagation but does not cancel the browser's default action. PreventDefault cancels a cancelable default action, but does not stop propagation; passive listeners cannot cancel it.\n\n```js\n// Browser excerpt: list is an existing element containing buttons.\nlist.addEventListener('click', event => {\n  const button = event.target.closest('button[data-id]');\n  if (button && list.contains(button)) console.log(button.dataset.id);\n});\nlist.addEventListener('click', () => console.log('capture'), {capture: true});\n```\n\nFor a button click, the ancestor capture listener runs before its bubble listener. stopImmediatePropagation additionally stops later listeners on the same target.",
    followUp: 'Why does stopPropagation on a link click not reliably prevent navigation?',
    tags: ['javascript', 'js-event-phases'],
    sources: [
      {
        title: 'JavaScript guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
  },
  {
    id: 'iq-added-js-browser-storage',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question:
      'When should you use localStorage, sessionStorage, IndexedDB, cookies, or an in-memory value?',
    answer:
      "LocalStorage is synchronous string storage scoped to origin and typically survives sessions; sessionStorage is also synchronous/string-based but scoped to origin and a page session, surviving reloads in that tab. IndexedDB supports asynchronous structured data and larger offline datasets. Memory is useful for temporary state. Cookies can accompany matching HTTP requests, making them useful for server sessions; they have size and policy constraints.\n\n```js\nlocalStorage.setItem('theme', 'dark');\nsessionStorage.setItem('draftTitle', 'Closures');\n```\n\nHandle unavailable storage/quota errors. For session cookies consider HttpOnly, Secure, SameSite, expiry, and CSRF policy; JavaScript-readable storage is exposed to injected scripts. Persistence is not a guarantee against user deletion or browser eviction.",
    followUp:
      'Why should a server session identifier not be chosen for localStorage just because it is convenient?',
    tags: ['javascript', 'js-browser-storage'],
    sources: [
      {
        title: 'Web Storage API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
      },
    ],
  },
  {
    id: 'iq-added-js-workers',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-dom-events-browser',
    level: 'Intermediate',
    question: 'What are Web Workers, and how do they communicate with the page?',
    answer:
      "Workers run scripts in another execution context, useful for CPU-heavy tasks without monopolizing the page's main JavaScript thread. They cannot directly access the page DOM; messages exchange structured-cloned or transferable data.\n\n```js\n// main.js, served over HTTP(S)\nconst worker = new Worker('./worker.js');\nworker.onmessage = event => console.log(event.data);\nworker.postMessage([3, 5]);\n// worker.js, a separate file\nself.onmessage = event => self.postMessage(event.data.reduce((a, b) => a + b, 0));\n```\n\nThe result is 8. Account for startup and transfer overhead, errors, stale requests, and termination; a worker is not automatically faster for tiny tasks.",
    followUp: 'When would transferring an ArrayBuffer be better than cloning a large payload?',
    tags: ['javascript', 'js-workers'],
    sources: [
      {
        title: 'Using Web Workers',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers',
      },
    ],
  },
  {
    id: 'iq-added-js-axios',
    track: 'javascript',
    topic: 'javascript',
    noteId: 'js-modules-tooling-debugging',
    level: 'Intermediate',
    question: 'When would you choose Axios over fetch or Node HTTP clients?',
    answer:
      "Axios provides conveniences such as interceptors, configured instances, response transformation, and status-based rejection by default. Fetch is a standard platform API available in browsers and modern Node; it normally fulfills on HTTP error status, so check response.ok. Node http/https are lower-level streaming primitives, while clients such as Got have their own Node-focused features. Popularity is not evidence that one is universally best.\n\n```js\nasync function loadNotes() {\n  const response = await fetch('/api/notes');\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n```\n\nChoose using runtime, cancellation, retry policy, bundle cost, and team needs. Neither library makes unsafe retries or authorization correct automatically.",
    followUp:
      'How would you centralize authentication/error policy without retrying a non-idempotent request blindly?',
    tags: ['javascript', 'js-axios'],
    sources: [
      {
        title: 'Axios introduction',
        url: 'https://axios-http.com/docs/intro',
      },
    ],
  },
  {
    id: 'iq-added-react-library',
    track: 'react',
    topic: 'react',
    noteId: 'react-jsx-props',
    level: 'Foundation',
    question:
      'What is React, how does a library differ from a framework, and when does React help over vanilla JavaScript?',
    answer:
      'React is a UI library: components describe output from props/state and React coordinates updates. A framework typically supplies a broader application structure and conventions for routing, data loading, and delivery. React can be used inside such a framework. Its component model helps coordinate complex changing interfaces; a small static page may need little or no React.\n\n```jsx\nfunction Progress({done, total}) {\n  return <p>{done} of {total} lessons</p>;\n}\n```\n\nThis is a React component excerpt. Changing its inputs updates its description; you do not manually locate and rewrite that paragraph. React is not inherently faster than every well-written DOM implementation.',
    followUp:
      'What additional choices are still needed to turn this UI library into a production application?',
    tags: ['react', 'react-library'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-jsx-babel',
    track: 'react',
    topic: 'react',
    noteId: 'react-jsx-props',
    level: 'Foundation',
    question: 'What is JSX, how does it run, why use className, and what does Babel do?',
    answer:
      "JSX is syntax for describing element trees in JavaScript; a build transform converts it to JavaScript calls understood by React's runtime. Browsers do not generally execute raw JSX. Babel is one possible transformation tool, but other compilers can transform JSX too; Babel is not React itself and transpilation is not a universal runtime polyfill. React DOM uses className as its conventional prop for CSS classes.\n\n```jsx\nconst title = 'Closures';\nconst heading = <h2 className=\"lesson-title\">{title}</h2>;\n```\n\nCurly braces contain expressions. React escapes ordinary string content; dangerouslySetInnerHTML is a separate trust-sensitive API. Avoid reducing className's explanation to an absolute claim that modern JavaScript can never use class as a property name.",
    followUp:
      'What is the difference between transforming new syntax and providing a missing runtime API?',
    tags: ['react', 'react-jsx-babel'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-props-children',
    track: 'react',
    topic: 'react',
    noteId: 'react-jsx-props',
    level: 'Foundation',
    question: 'How do props differ from state, and what is the children prop?',
    answer:
      'Props are inputs from a parent; state is data owned by a component whose updates can trigger renders. A child should not mutate received objects to change the parent\'s state. Children is the prop containing nested content, useful for reusable wrappers that should not know every content type.\n\n```jsx\nfunction Panel({title, children}) {\n  return <section><h2>{title}</h2>{children}</section>;\n}\nfunction App() {\n  return <Panel title="Practice"><p>Explain one closure.</p></Panel>;\n}\n```\n\nPanel owns the shell while its caller supplies content. Children can be various React nodes, not necessarily one element or always an array.',
    followUp: 'When would a named actions prop be clearer than putting all content into children?',
    tags: ['react', 'react-props-children'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-fragments',
    track: 'react',
    topic: 'react',
    noteId: 'react-jsx-props',
    level: 'Foundation',
    question: 'What are fragments, and what DOM element do they add?',
    answer:
      "A Fragment groups siblings in a React return value without adding a wrapper DOM element. It avoids extra boxes that might disturb flex/grid or invalidly wrap table/list structures. The short syntax cannot receive a key; use the explicit Fragment form for keyed groups.\n\n```jsx\nimport {Fragment} from 'react';\nfunction Glossary({items}) {\n  return <dl>{items.map(item => <Fragment key={item.id}><dt>{item.term}</dt><dd>{item.meaning}</dd></Fragment>)}</dl>;\n}\n```\n\nThe DOM contains dl, dt, and dd, with no fragment node. A real div is still appropriate when you need a layout box, semantics, or an event/attribute target.",
    followUp:
      'Why can replacing a div with a fragment alter a flex layout even when the visible text stays the same?',
    tags: ['react', 'react-fragments'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-usestate',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Foundation',
    question:
      'What does useState accept and return, and when should a value be state rather than a normal variable?',
    answer:
      "UseState accepts an initial value or initializer function and returns a two-item array: the current render's state and a setter. Local variables are recreated during render and changing them does not request a new render. Use state for changing information that affects output; derive cheap values from existing inputs instead of storing redundant copies.\n\n```jsx\nimport {useState} from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const doubled = count * 2;\n  return <button onClick={() => setCount(n => n + 1)}>{count} / {doubled}</button>;\n}\n```\n\nInitializers/updaters should be pure. Use a ref for persistent mutable data whose changes should not themselves request a render.",
    followUp:
      'Why does changing the initial-value argument after the first render not automatically reset existing state?',
    tags: ['react', 'react-usestate'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-communication',
    track: 'react',
    topic: 'react',
    noteId: 'react-state-forms',
    level: 'Intermediate',
    question: 'How do parent-to-child, child-to-parent, and sibling communication work?',
    answer:
      "Parents pass props down. Children report intent through callbacks passed as props; the parent updates owned state. Siblings can share state lifted to their closest appropriate common ancestor, which then passes each sibling the data/actions it needs.\n\n```jsx\nimport {useState} from 'react';\nfunction Editor({value, onChange}) {\n  return <input aria-label=\"Topic\" value={value} onChange={e => onChange(e.target.value)} />;\n}\nfunction Preview({value}) { return <p>{value}</p>; }\nfunction Workspace() {\n  const [topic, setTopic] = useState('Arrays');\n  return <><Editor value={topic} onChange={setTopic}/><Preview value={topic}/></>;\n}\n```\n\nProp drilling means passing data through layers that do not use it. Composition or context can reduce this, but direct props are often clearest for short paths.",
    followUp:
      'How would you avoid lifting a temporary input value to a global store unnecessarily?',
    tags: ['react', 'react-communication'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-render-lifecycle',
    track: 'react',
    topic: 'react',
    noteId: 'react-components-rendering',
    level: 'Intermediate',
    question:
      "What are DOM, virtual DOM, reconciliation, render, and commit? When is a function component's return evaluated?",
    answer:
      "The browser DOM is the live document. React's element descriptions are often called a virtual DOM; reconciliation compares descriptions using type, position, and keys to decide what work to perform. During render, React calls components and evaluates their return expressions. During commit, it applies the selected changes to the host DOM. Calling a component does not guarantee a DOM mutation or even that that render will commit.\n\n```jsx\nfunction Status({count}) {\n  const label = count > 0 ? 'Started' : 'New';\n  return <p>{label}</p>;\n}\n```\n\nChanging count from 1 to 2 can rerender this component while its displayed label stays Started. Rendering may be repeated, interrupted, or abandoned, so keep it pure.",
    followUp:
      'Why is a network write inside the component body unsafe even if a developer observes only one commit?',
    tags: ['react', 'react-render-lifecycle'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-rerender-triggers',
    track: 'react',
    topic: 'react',
    noteId: 'react-components-rendering',
    level: 'Intermediate',
    question:
      'When does a function component rerender, and what are its mount/update/unmount phases?',
    answer:
      "State updates can schedule renders; parent rendering normally renders children too unless React can skip them; a consumed context change or subscribed external-store change can also trigger work. A prop does not independently mutate the child: it arrives through a parent's new render. Equal-state updates and memoization may allow bailouts. Mount introduces an identity, updates preserve or replace it, and unmount removes it and cleans up owned effects.\n\n```jsx\nimport {useEffect} from 'react';\nfunction Room({id}) {\n  useEffect(() => {\n    console.log('setup', id);\n    return () => console.log('cleanup', id);\n  }, [id]);\n  return <p>Room {id}</p>;\n}\n```\n\nThis logs cleanup for the old committed id before the new setup, plus final cleanup on removal. It is a synchronization example, not an exact replacement for every historical class lifecycle method.",
    followUp:
      'Why can development Strict Mode show an extra setup/cleanup sequence without a user-visible unmount?',
    tags: ['react', 'react-rerender-triggers'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-hook-rules',
    track: 'react',
    topic: 'react',
    noteId: 'react-effects-custom-hooks',
    level: 'Intermediate',
    question:
      'What are Hooks, how do they differ from ordinary functions, and what are their rules?',
    answer:
      'Hooks let React components and custom hooks use React features such as state and effects. For ordinary hooks such as useState/useEffect, call them at the top level of function components or custom hooks, not in loops, branches, handlers, or ordinary utilities. Stable call order lets React associate hook state with the correct call across renders.\n\n```jsx\nfunction Summary({visible}) {\n  const [count, setCount] = useState(0); // useState imported from React\n  if (!visible) return null;\n  return <button onClick={() => setCount(n => n + 1)}>{count}</button>;\n}\n```\n\nThe hook must occur before the conditional return. The newer use API has documented exceptions permitting conditional/loop calls; do not apply that exception to useState/useEffect.',
    followUp:
      'Why is naming an ordinary utility useSomething insufficient to make conditional hook calls inside it safe?',
    tags: ['react', 'react-hook-rules'],
    sources: [
      {
        title: 'Rules of Hooks',
        url: 'https://react.dev/reference/rules/rules-of-hooks',
      },
    ],
  },
  {
    id: 'iq-added-react-effect-contract',
    track: 'react',
    topic: 'react',
    noteId: 'react-effects-custom-hooks',
    level: 'Intermediate',
    question: "What are useEffect's two arguments, what can it return, and when does cleanup run?",
    answer:
      "The first argument is setup logic for synchronization; it may return a cleanup function. The optional second argument lists reactive dependencies. Omitted dependencies mean after each relevant commit; an empty array describes no reactive dependencies; listed values are compared with Object.is. Cleanup runs before setup for changed dependencies and on unmount. Effects run on the client and should not be used to derive ordinary render data.\n\n```jsx\nuseEffect(() => {\n  const onResize = () => console.log(window.innerWidth);\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []); // useEffect imported; inside a component/custom hook\n```\n\nDo not make the effect callback async: its promise is not cleanup. Start asynchronous work inside it with an explicit cancellation/error policy. Timing relative to paint depends on the trigger; avoid an unconditional after-paint rule.",
    followUp:
      'How would a roomId-dependent subscription differ from this dependency-free browser listener?',
    tags: ['react', 'react-effect-contract'],
    sources: [
      {
        title: 'useEffect contract',
        url: 'https://react.dev/reference/react/useEffect',
      },
    ],
  },
  {
    id: 'iq-added-react-styling',
    track: 'react',
    topic: 'react',
    noteId: 'react-composition-styling',
    level: 'Foundation',
    question: 'What are common ways to style React components, and what tradeoffs do they have?',
    answer:
      'Options include ordinary stylesheets via className, CSS Modules for scoped class names, inline style objects for dynamic declarations, utility classes, and CSS-in-JS tools. Their runtime cost, scoping, extraction, and framework requirements vary. React itself does not require one of them.\n\n```jsx\nfunction Meter({percent}) {\n  const bounded = Math.max(0, Math.min(100, percent));\n  return <div className="meter"><span style={{display: \'block\', width: `${bounded}%`}}>Progress</span></div>;\n}\n```\n\nSupply the meter stylesheet in the application. Inline objects use camel-cased properties and cannot directly express stylesheet selectors such as :hover or media queries. Validate dynamic values at their boundary.',
    followUp:
      'When would a CSS custom property be cleaner than regenerating many inline declarations?',
    tags: ['react', 'react-styling'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-hoc',
    track: 'react',
    topic: 'react',
    noteId: 'react-composition-styling',
    level: 'Intermediate',
    question: 'What is a higher-order component, and how does it compare with a custom hook?',
    answer:
      'A higher-order component is a function that accepts a component and returns another component, usually wrapping rendering behavior or injecting props. A custom hook shares stateful logic without creating a wrapper component. Both should preserve a clear public contract.\n\n```jsx\nfunction withLoading(View) {\n  return function LoadingView({loading, ...props}) {\n    return loading ? <p role="status">Loading…</p> : <View {...props}/>;\n  };\n}\nfunction Lessons({items}) { return <ul>{items.map(x => <li key={x.id}>{x.title}</li>)}</ul>; }\nconst LoadableLessons = withLoading(Lessons);\n```\n\nCreate the wrapper outside another component\'s render so its identity stays stable. This simple wrapper does not promise to forward every ref or static property.',
    followUp: 'When would composition through children be simpler than introducing this HOC?',
    tags: ['react', 'react-hoc'],
    sources: [
      {
        title: 'React learning guide',
        url: 'https://react.dev/learn',
      },
    ],
  },
  {
    id: 'iq-added-react-router',
    track: 'react',
    topic: 'react',
    noteId: 'react-routing-url-state',
    level: 'Intermediate',
    question: 'What does React Router provide, and how should sibling routes share data?',
    answer:
      'React Router maps URLs to UI and coordinates navigation. Use it when different screens need addresses, nested layouts, parameters, or browser history. A router is not a general replacement for shared state: URL parameters suit shareable filters, a layout/context suits shared client state, and a server cache suits remote data.\n\n```jsx\n// Declarative React Router app excerpt\nimport {BrowserRouter, Routes, Route, Link, useParams} from \'react-router-dom\';\nfunction Lesson() { const {id} = useParams(); return <p>Lesson {id}</p>; }\nfunction App() { return <BrowserRouter><Link to="/lessons/42">Open</Link><Routes><Route path="/lessons/:id" element={<Lesson/>}/></Routes></BrowserRouter>; }\n```\n\nDo not add BrowserRouter inside an app already wrapped by one. Navigation state can carry contextual data, but direct visits/new links need an independent way to load essential data.',
    followUp:
      'How would a filter encoded in the URL behave differently from an unsaved editor draft during Back navigation?',
    tags: ['react', 'react-router'],
    sources: [
      {
        title: 'React Router declarative routing',
        url: 'https://reactrouter.com/start/declarative/routing',
      },
    ],
  },
  {
    id: 'iq-added-redux-purpose',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question:
      'What are Redux and Flux, and is Redux always better than Context or limited to React?',
    answer:
      'Flux describes a unidirectional data-flow architecture. Redux provides a store with dispatched actions and reducers computing next state; it can be used without React. Its core ideas are a central state tree per store, updates expressed as actions, and pure reducers. React Context distributes values; Redux adds a state-update model, subscriptions/selectors, middleware, and tooling. Neither is universally better. Keep transient local state local; use a shared store when coordination and tooling justify it. Server-state caches solve a related but different problem. Redux Toolkit is the normal starting point for new Redux code.',
    followUp:
      'What concrete requirements would justify Redux for an app already using context and a server-data cache?',
    tags: ['redux', 'redux-purpose'],
    sources: [
      {
        title: 'Redux fundamentals',
        url: 'https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow',
      },
    ],
  },
  {
    id: 'iq-added-redux-actions-reducers',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'What are Redux actions and reducers? Show initial state and a state transition.',
    answer:
      "An action describes an event with a type and usually a payload. A reducer receives previous state plus action and returns next state. Initial state handles the undefined input used during initialization. This plain reducer example makes immutable copying explicit.\n\n```js\nconst initialState = {minutes: 0};\nfunction reducer(state = initialState, action) {\n  switch (action.type) {\n    case 'study/added': return {...state, minutes: state.minutes + action.payload};\n    default: return state;\n  }\n}\nconsole.log(reducer(undefined, {type: 'study/added', payload: 5})); // {minutes:5}\n```\n\nRedux Toolkit createSlice lets case reducers use draft-mutation syntax through Immer; that is different from mutating a plain Redux state object.",
    followUp: 'Why must an unknown action return the existing state rather than undefined?',
    tags: ['redux', 'redux-actions-reducers'],
    sources: [
      {
        title: 'Writing Redux logic',
        url: 'https://redux.js.org/usage/structuring-reducers/initializing-state',
      },
    ],
  },
  {
    id: 'iq-added-redux-flow',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'What is the typical React/Redux data flow, and where should side effects go?',
    answer:
      'An interaction dispatches an action; middleware may inspect/handle it; the reducer computes next state; the store notifies subscribers; selectors read the needed data and React updates relevant UI. Reducers must not fetch, schedule timers, mutate external data, or generate unpredictable values such as fresh timestamps/random IDs. Put these effects in event logic, thunks, listener middleware, or other appropriate effect handlers and carry results in actions. Keep state/actions serializable by default to support debugging and persistence. Draft updates in Toolkit remain subject to reducer purity. Middleware wraps dispatch, not the reducer body.',
    followUp:
      'Why should a timestamp be created before dispatch and included in the action if replay must reproduce state?',
    tags: ['redux', 'redux-flow'],
    sources: [
      {
        title: 'Redux side effects approaches',
        url: 'https://redux.js.org/usage/side-effects-approaches',
      },
    ],
  },
  {
    id: 'iq-added-redux-store-api',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'What methods does a Redux store expose, and when are they useful?',
    answer:
      "getState reads the current tree. Dispatch submits an action through the installed dispatch pipeline. Subscribe registers a change listener and returns an unsubscribe function; read getState inside the listener. ReplaceReducer swaps the root reducer, useful for dynamic feature loading or development tooling. The observable interop API also exists; it is not normally needed in UI code.\n\n```js\n// Application excerpt: store was created with configureStore.\nconst unsubscribe = store.subscribe(() => console.log(store.getState()));\nstore.dispatch({type: 'study/added', payload: 5});\nunsubscribe();\n// store.replaceReducer(nextRootReducer) when deliberately changing reducer composition\n```\n\nSubscriptions report store updates, not a diff payload. Never mutate the object returned by getState.",
    followUp: 'Why must a subscription be removed when the owning integration is destroyed?',
    tags: ['redux', 'redux-store-api'],
    sources: [
      {
        title: 'Redux store API',
        url: 'https://redux.js.org/api/store',
      },
    ],
  },
  {
    id: 'iq-added-redux-connect',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'What does React Redux connect do, and how do modern hooks compare?',
    answer:
      "Connect is a higher-order function that subscribes a wrapper to the store and maps selected state and dispatch operations into component props. It works with function components too. New code often uses useSelector/useDispatch for a direct hooks interface; existing connect code is not automatically incorrect.\n\n```jsx\nimport {connect} from 'react-redux';\nfunction Total({minutes, add}) { return <button onClick={add}>{minutes}</button>; }\nconst ConnectedTotal = connect(\n  state => ({minutes: state.minutes}),\n  dispatch => ({add: () => dispatch({type:'study/added', payload:5})})\n)(Total);\n```\n\nThis application excerpt needs a Provider supplying a compatible store above it. Select only the data this view needs.",
    followUp:
      'How can returning a freshly allocated selector result on every call affect subscription-driven rendering?',
    tags: ['redux', 'redux-connect'],
    sources: [
      {
        title: 'React Redux connect',
        url: 'https://react-redux.js.org/api/connect',
      },
    ],
  },
  {
    id: 'iq-added-redux-outside',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question: 'How can code outside a React component access Redux state safely?',
    answer:
      "Ordinary integration code can use an explicitly supplied store's getState/dispatch; React hooks cannot be called from arbitrary utilities. Dependency injection makes the dependency visible and easier to test.\n\n```js\nfunction makeStudyService(store) {\n  return {\n    snapshot: () => store.getState().minutes,\n    add: minutes => store.dispatch({type:'study/added', payload:minutes})\n  };\n}\n```\n\nAvoid importing one global store into every module, particularly in server rendering where request-specific stores must not share user state. Values read once are snapshots; subscribe only when continuous observation is required and own its cleanup.",
    followUp:
      "Why could a module-level singleton store leak one server-rendered user's data into another request?",
    tags: ['redux', 'redux-outside'],
    sources: [
      {
        title: 'Redux FAQ on store access',
        url: 'https://redux.js.org/faq/code-structure',
      },
    ],
  },
  {
    id: 'iq-added-redux-middleware',
    track: 'react',
    topic: 'redux',
    noteId: 'react-context-reducer-redux',
    level: 'Intermediate',
    question:
      'What is Redux middleware? Show an example without putting asynchronous work in a reducer.',
    answer:
      'Middleware composes around dispatch and can log, transform, delay, or handle actions according to its contract. Calling next passes the action to the next middleware/base dispatch; store.dispatch re-enters the pipeline.\n\n```js\nconst audit = store => next => action => {\n  const before = store.getState().minutes;\n  const result = next(action);\n  const after = store.getState().minutes;\n  console.log({type: action.type, before, after});\n  return result;\n};\n// configureStore({reducer, middleware: getDefault => getDefault().concat(audit)})\n```\n\nThis excerpt assumes a minutes reducer. Preserve dispatch return values and do not log secrets. Thunk middleware handles function actions for asynchronous workflows while reducers remain synchronous and pure.',
    followUp:
      'Why can dispatching the same action unconditionally inside middleware create infinite recursion?',
    tags: ['redux', 'redux-middleware'],
    sources: [
      {
        title: 'Redux middleware',
        url: 'https://redux.js.org/understanding/history-and-design/middleware',
      },
    ],
  },
  {
    id: 'iq-added-spring-di',
    track: 'java',
    topic: 'spring',
    noteId: 'java-spring-rest',
    level: 'Intermediate',
    question:
      'How do constructor injection, component scanning, and explicit Bean definitions differ?',
    answer:
      'Dependency injection supplies collaborators instead of a class constructing them secretly. Component scanning discovers configured stereotype-annotated classes; explicit @Bean methods construct objects through configuration. Constructor injection makes required dependencies visible and supports immutable fields.\n\n```java\n// Spring application excerpt; interfaces/configuration supplied by the app.\n@Service\nclass LessonService {\n  private final LessonRepository repository;\n  LessonService(LessonRepository repository) { this.repository = repository; }\n}\n```\n\nIf multiple beans implement the same dependency, select deliberately with a qualifier or primary designation. A singleton bean is shared; injection does not automatically make its mutable state thread-safe.',
    followUp: 'How would you test LessonService without starting an entire Spring context?',
    tags: ['spring', 'spring-di'],
    sources: [
      {
        title: 'Spring reference',
        url: 'https://docs.spring.io/spring-framework/reference/',
      },
    ],
  },
  {
    id: 'iq-added-spring-autoconfig',
    track: 'java',
    topic: 'spring',
    noteId: 'java-spring-rest',
    level: 'Intermediate',
    question:
      'What does Spring Boot auto-configuration do, and how do you debug an unexpected bean?',
    answer:
      'Boot contributes configuration based on conditions such as classpath contents, properties, and existing beans. It supplies defaults rather than inferring your entire business design. Inspect the condition evaluation report, active profiles, property sources, and bean definitions before adding conflicting overrides. A custom bean can cause a matching auto-configuration path to back off where its conditions specify that behavior. Keep a small reproduction and inspect the actual active configuration rather than assuming every starter always installs the same objects.',
    followUp: 'How can a test profile accidentally hide a production configuration problem?',
    tags: ['spring', 'spring-autoconfig'],
    sources: [
      {
        title: 'Boot auto-configuration',
        url: 'https://docs.spring.io/spring-boot/reference/using/auto-configuration.html',
      },
    ],
  },
  {
    id: 'iq-added-spring-validation',
    track: 'java',
    topic: 'spring',
    noteId: 'java-spring-rest',
    level: 'Intermediate',
    question: 'How would you validate a REST request and return consistent errors in Spring?',
    answer:
      'Validate boundary DTOs, enforce business invariants in the service, and retain database constraints for concurrent correctness. @Valid can trigger Jakarta Bean Validation for a request body; controller advice can translate failures into a stable error contract without stack traces or secrets.\n\n```java\n// Spring MVC excerpt with validation dependency and imports.\nrecord AddMinutes(@jakarta.validation.constraints.Positive int minutes) {}\n@PostMapping("/minutes")\nvoid add(@jakarta.validation.Valid @RequestBody AddMinutes request) {\n  service.add(request.minutes());\n}\n```\n\nTest negative/zero input, malformed JSON, and a business conflict separately. Decide documented status codes and field errors; returning HTTP 200 with an error string makes clients harder to reason about.',
    followUp: 'Which checks belong in the database even when this DTO validation passes?',
    tags: ['spring', 'spring-validation'],
    sources: [
      {
        title: 'Spring reference',
        url: 'https://docs.spring.io/spring-framework/reference/',
      },
    ],
  },
  {
    id: 'iq-added-spring-nplusone',
    track: 'java',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: "What is JPA's N+1 query problem, and how do you fix it without breaking pagination?",
    answer:
      'Loading N parent rows and lazily touching each relation can issue one initial query plus N additional queries. Inspect actual SQL/query counts on representative requests. Depending on the access pattern, consider a projection, entity graph, fetch join, or batching. Fetch-joining a to-many collection can multiply result rows and complicate pagination; a two-step ID page followed by controlled fetching may fit better. Do not set every relation eager as a blanket fix: that can overfetch and still produce inefficient query plans.',
    followUp: 'What test would prove both correct page size and bounded query count?',
    tags: ['spring', 'spring-nplusone'],
    sources: [
      {
        title: 'Spring reference',
        url: 'https://docs.spring.io/spring-framework/reference/',
      },
    ],
  },
  {
    id: 'iq-added-spring-locking',
    track: 'java',
    topic: 'spring',
    noteId: 'java-jpa-transactions',
    level: 'Advanced',
    question: 'How do optimistic and pessimistic locking differ for competing updates?',
    answer:
      'Optimistic locking checks a version when writing; an outdated version causes a conflict instead of silently losing the other update. Pessimistic locking obtains database locks during the transaction, trading earlier serialization for waiting/deadlock risk.\n\n```java\n// JPA entity field excerpt\n@jakarta.persistence.Version\nprivate long version;\n```\n\nChoose according to contention and the invariant. Retry a conflicting operation only when safe, after re-reading and re-evaluating the business rule. A version field does not protect unrelated external effects or replace every database constraint.',
    followUp:
      'Why is automatically retrying a payment-related method after an optimistic conflict dangerous?',
    tags: ['spring', 'spring-locking'],
    sources: [
      {
        title: 'Spring reference',
        url: 'https://docs.spring.io/spring-framework/reference/',
      },
    ],
  },
  {
    id: 'iq-added-spring-test-scope',
    track: 'java',
    topic: 'spring',
    noteId: 'java-maven-testing',
    level: 'Intermediate',
    question:
      'When should you use a unit test, MVC slice, repository test, or full Spring integration test?',
    answer:
      'A unit test isolates ordinary business logic with supplied collaborators. An MVC slice checks mapping, validation, serialization, and controller behavior. A repository test checks persistence contracts; use a representative database when dialect/locking matters. A full-context integration test checks wiring and boundaries together at greater cost. Match scope to risk instead of replacing all tests with the largest context. For rollback and concurrent inventory behavior, use a real transaction/database boundary and concurrent callers, not mocks that always return success.',
    followUp: 'How could an in-memory test database miss a production SQL or isolation bug?',
    tags: ['spring', 'spring-test-scope'],
    sources: [
      {
        title: 'Spring reference',
        url: 'https://docs.spring.io/spring-framework/reference/',
      },
    ],
  },
  {
    id: 'iq-added-java-comparable',
    track: 'java',
    topic: 'java',
    noteId: 'java-collections-generics',
    level: 'Intermediate',
    question:
      'How do Comparable and Comparator differ, and how do you make ordering deterministic?',
    answer:
      "Comparable defines a type's natural order through compareTo; Comparator supplies an external ordering strategy, allowing multiple orders. Add a tie-breaker when deterministic results matter.\n\n```java\n// Java 17+ excerpt\nrecord Lesson(String id, int minutes) {}\nComparator<Lesson> order = Comparator.comparingInt(Lesson::minutes)\n    .thenComparing(Lesson::id);\n```\n\nImport java.util.Comparator. Avoid returning a.minutes - b.minutes because subtraction can overflow. Sorted sets/maps use ordering equality to identify keys, so inconsistency with equals requires careful documentation and can surprise callers.",
    followUp:
      'What happens if a TreeSet comparator ignores IDs for two lessons with equal minutes?',
    tags: ['java', 'java-comparable'],
    sources: [
      {
        title: 'Learn Java',
        url: 'https://dev.java/learn/',
      },
    ],
  },
  {
    id: 'iq-added-java-string-immutability',
    track: 'java',
    topic: 'java',
    noteId: 'java-methods-arrays',
    level: 'Foundation',
    question: 'Why are Strings immutable, and when should StringBuilder be used?',
    answer:
      'String operations produce values without changing the original String object, allowing safe sharing and stable value-based use as keys. A variable referring to a String can still be reassigned. StringBuilder is mutable and useful when repeatedly assembling text within one thread.\n\n```java\nString name = "Java";\nString upper = name.toUpperCase(java.util.Locale.ROOT);\nStringBuilder summary = new StringBuilder();\nfor (int i = 1; i <= 3; i++) summary.append(i).append(\' \');\nSystem.out.println(name); // Java\n```\n\nUse equals for content comparison. Avoid claiming every concatenation is slow: compilers/runtime optimize many simple expressions.',
    followUp:
      'Why is a shared mutable StringBuilder unsuitable for unsynchronized concurrent request processing?',
    tags: ['java', 'java-string-immutability'],
    sources: [
      {
        title: 'Learn Java',
        url: 'https://dev.java/learn/',
      },
    ],
  },
  {
    id: 'iq-added-dsa-intervals',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-patterns',
    level: 'Intermediate',
    question:
      'How do you merge overlapping intervals, and what must the boundary contract specify?',
    answer:
      'Sort intervals by start, then maintain the last merged interval. If the next interval overlaps under your chosen endpoint semantics, extend the end; otherwise append it. For closed intervals, [1,3] and [3,5] overlap; half-open intervals need a deliberate touching policy.\n\n```js\nfunction mergeClosed(intervals) {\n  const sorted = intervals.map(x => [...x]).sort((a,b) => a[0]-b[0]);\n  const result = [];\n  for (const [start,end] of sorted) {\n    const last = result.at(-1);\n    if (last && start <= last[1]) last[1] = Math.max(last[1], end);\n    else result.push([start,end]);\n  }\n  return result;\n}\n```\n\nAssume finite endpoints with start <= end. This avoids input mutation and takes O(n log n) time and O(n) storage. Test empty input, nesting, touching, and disjoint ranges.',
    followUp: 'What changes for half-open ranges where touching intervals should remain separate?',
    tags: ['dsa', 'dsa-intervals'],
    sources: [
      {
        title: 'Algorithms reference',
        url: 'https://algs4.cs.princeton.edu/home/',
      },
    ],
  },
  {
    id: 'iq-added-dsa-prefix-count',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-hashing',
    level: 'Intermediate',
    question: 'How do prefix frequencies count target-sum subarrays with negative numbers?',
    answer:
      'Let prefix be the sum through the current position. An earlier prefix equal to prefix-target identifies a subarray with the target sum. Store frequencies because the same prefix can occur multiple times.\n\n```js\nfunction countTarget(nums, target) {\n  const seen = new Map([[0,1]]);\n  let prefix = 0, count = 0;\n  for (const n of nums) {\n    prefix += n;\n    count += seen.get(prefix-target) ?? 0;\n    seen.set(prefix, (seen.get(prefix) ?? 0)+1);\n  }\n  return count;\n}\nconsole.log(countTarget([1,-1,1], 1)); // 3\n```\n\nExpected O(n) time/O(n) space under normal hash assumptions; Number arithmetic must stay within the intended exact range. Count matches before adding the current prefix to avoid counting empty subarrays when target is zero.',
    followUp: 'Why is the initial frequency of prefix zero set to one?',
    tags: ['dsa', 'dsa-prefix-count'],
    sources: [
      {
        title: 'Algorithms reference',
        url: 'https://algs4.cs.princeton.edu/home/',
      },
    ],
  },
  {
    id: 'iq-added-dsa-trie',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-trees',
    level: 'Intermediate',
    question: 'When would you choose a trie for prefix search rather than a hash set?',
    answer:
      'A trie shares paths for common prefixes and can locate a prefix by walking its characters before enumerating descendants. A hash set is excellent for exact membership but does not directly organize keys by prefix. For keys of length L, trie insertion/lookup visits O(L) character steps, with potentially large node/map overhead. Define Unicode normalization, case handling, and whether enumeration is bounded. For a tiny static word set, a sorted array plus binary search may be simpler and more compact.',
    followUp:
      'How would you return only the top five completions without traversing every descendant?',
    tags: ['dsa', 'dsa-trie'],
    sources: [
      {
        title: 'Algorithms reference',
        url: 'https://algs4.cs.princeton.edu/home/',
      },
    ],
  },
  {
    id: 'iq-added-dsa-lru',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-linear-structures',
    level: 'Advanced',
    question: 'Design an LRU cache with expected O(1) get and put. What invariants matter?',
    answer:
      'Combine a map from key to linked-list node with a doubly linked list ordered from most to least recently used. Get moves a hit to the front; put updates/moves an existing node or inserts a new one; overflow evicts the tail from both structures. Every map entry must reference exactly one live node and list size must equal map size. Sentinel nodes simplify empty/single-item cases. Space is O(capacity). Test capacity zero, replacement without growth, repeated hits, and eviction after a read.',
    followUp:
      'Why does a singly linked list make arbitrary hit promotion harder without extra predecessor bookkeeping?',
    tags: ['dsa', 'dsa-lru'],
    sources: [
      {
        title: 'Algorithms reference',
        url: 'https://algs4.cs.princeton.edu/home/',
      },
    ],
  },
  {
    id: 'iq-added-dsa-dijkstra-heap',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-graphs',
    level: 'Advanced',
    question:
      "Why can Dijkstra's priority queue contain stale entries, and how should they be handled?",
    answer:
      "A simpler implementation pushes a new distance entry whenever a path improves instead of decreasing an existing heap key. When popping, skip an entry whose distance differs from the current best distance. Finalize only an appropriate minimal-distance entry, under nonnegative edge weights. For A→B=10, A→C=1, C→B=1, B's entry 10 becomes stale after discovering distance 2. Account for duplicate heap entries in memory and runtime bounds; do not claim the heap always contains at most one entry per vertex.",
    followUp:
      'How do parallel edges and zero weights affect your tests, and why are negative edges a separate algorithm choice?',
    tags: ['dsa', 'dsa-dijkstra-heap'],
    sources: [
      {
        title: 'Algorithms reference',
        url: 'https://algs4.cs.princeton.edu/home/',
      },
    ],
  },
  {
    id: 'iq-added-dsa-dp-reconstruction',
    track: 'dsa',
    topic: 'dsa',
    noteId: 'dsa-dynamic-programming',
    level: 'Advanced',
    question: 'How can a DP return the chosen solution as well as its optimal value?',
    answer:
      'Keep predecessor/choice information or enough of the full table to trace decisions backward. For 0/1 knapsack, compare the chosen state with skipping the current item; when taking it, decrease capacity and move to the previous item row. A compressed array may retain the value while losing the history needed for straightforward reconstruction. Define tie-breaking if several solutions are optimal. Verify the reconstructed items obey the once-only rule and that their summed value equals the reported optimum.',
    followUp:
      'When could recomputation or divide-and-conquer reconstruction trade extra time for less memory?',
    tags: ['dsa', 'dsa-dp-reconstruction'],
    sources: [
      {
        title: 'Algorithms reference',
        url: 'https://algs4.cs.princeton.edu/home/',
      },
    ],
  },
  {
    id: 'iq-added-design-url-shortener',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-requirements-capacity',
    level: 'Intermediate',
    question: 'Design a URL shortener with collision handling and abuse controls.',
    answer:
      'Clarify creation/read rates, alias length, custom aliases, expiry, and ownership. Store a unique alias mapped to a validated destination. Generated collisions must be resolved using an atomic uniqueness check and a bounded retry strategy; custom-alias conflicts need a clear response. Cache popular redirects with an explicit expiry/invalidation policy. Choose redirect semantics according to whether destinations can change and should be cached. Limit creation abuse and validate schemes rather than blindly accepting arbitrary destinations. Estimate storage and hot-key traffic before proposing sharding.',
    followUp:
      'How would changing a previously cached destination interact with permanent redirects?',
    tags: ['system-design', 'design-url-shortener'],
    sources: [
      {
        title: 'AWS Builders Library',
        url: 'https://aws.amazon.com/builders-library/',
      },
    ],
  },
  {
    id: 'iq-added-design-upload',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-java-api-data',
    level: 'Advanced',
    question:
      'Design resumable uploads for large files without routing every byte through the application server.',
    answer:
      "Authenticate the request and create an upload session with size/type limits. Use object-storage multipart upload with short-lived scoped authorization where appropriate. Persist part/session identity so retries and reconnects can resume; verify completion/integrity before publishing a file reference. Keep incomplete objects private and expire abandoned sessions. Scan or process untrusted content before making it available according to the product's requirements. Signed URLs are capabilities, so constrain expiry and access rather than assuming obscurity protects them.",
    followUp:
      'How do you handle a successful storage completion when the API response to the client is lost?',
    tags: ['system-design', 'design-upload'],
    sources: [
      {
        title: 'AWS Builders Library',
        url: 'https://aws.amazon.com/builders-library/',
      },
    ],
  },
  {
    id: 'iq-added-design-notifications',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-messaging-reliability',
    level: 'Advanced',
    question: 'Design email/push notifications with preferences, retries, and deduplication.',
    answer:
      'Separate the business event from channel delivery. Persist an event or outbox record, resolve current recipient/channel preferences, enqueue bounded work, and track attempt identities/outcomes. Respect provider limits and retry transient failures with budgets/backoff. Deduplicate replayed events without preventing legitimately distinct notifications. Define user-visible status carefully: provider acceptance is not proof that a human read the message. Avoid logging sensitive message bodies and allow channel-specific unsubscribe rules.',
    followUp:
      'What should happen when a user opts out while a notification is waiting in the queue?',
    tags: ['system-design', 'design-notifications'],
    sources: [
      {
        title: 'AWS Builders Library',
        url: 'https://aws.amazon.com/builders-library/',
      },
    ],
  },
  {
    id: 'iq-added-design-disaster-recovery',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-security-operations',
    level: 'Advanced',
    question: 'How do RPO and RTO shape backup and disaster recovery design?',
    answer:
      'Recovery Point Objective describes tolerable data loss measured in time; Recovery Time Objective describes the targeted time to restore service. Choose backup frequency, replication, storage isolation, and recovery procedures to meet those goals under specific failure scenarios. A replica is not a substitute for backups because corruption or deletion can replicate. Exercise restores, verify data/application compatibility, and measure actual recovery rather than relying on successful backup job logs. Include credentials, dependencies, and DNS/client reconnection in the drill.',
    followUp:
      'Why can a zero-data-loss goal conflict with continuing writes during a network partition?',
    tags: ['system-design', 'design-disaster-recovery'],
    sources: [
      {
        title: 'AWS Builders Library',
        url: 'https://aws.amazon.com/builders-library/',
      },
    ],
  },
  {
    id: 'iq-added-design-cache-version',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-scaling-caching',
    level: 'Advanced',
    question: 'How can a delayed cache fill resurrect stale data after invalidation?',
    answer:
      'A reader misses the cache and reads version 1. A writer commits version 2 and invalidates the key. The old reader then fills the cache with version 1, resurrecting stale data. TTL bounds staleness only if that bound satisfies the product. Stronger approaches may use versioned keys, generation checks, or coordinated update/invalidation protocols; each requires careful race analysis. Draw the interleaving and define the freshness contract before claiming a deletion fixes all cache races.',
    followUp:
      'How would you prevent an older version from replacing a newer value without introducing a global lock?',
    tags: ['system-design', 'design-cache-version'],
    sources: [
      {
        title: 'AWS Builders Library',
        url: 'https://aws.amazon.com/builders-library/',
      },
    ],
  },
  {
    id: 'iq-added-design-multitenancy',
    track: 'system-design',
    topic: 'system-design',
    noteId: 'design-security-operations',
    level: 'Advanced',
    question: 'How do you isolate tenants across databases, caches, queues, and observability?',
    answer:
      "Derive tenant identity from trusted authentication context and carry it through authorization, queries, cache identity, and background jobs. Use database constraints or access policies where feasible as defense in depth; client-provided tenant IDs are not authority. Partition resource budgets to contain noisy neighbors, and keep logs/traces from exposing another tenant's data. Test cross-tenant reads, writes, cache hits, exported files, and replayed jobs. Stronger physical isolation changes cost and operations, so choose according to requirements.",
    followUp: 'Why is adding tenantId to every URL insufficient to establish tenant isolation?',
    tags: ['system-design', 'design-multitenancy'],
    sources: [
      {
        title: 'AWS Builders Library',
        url: 'https://aws.amazon.com/builders-library/',
      },
    ],
  },
  {
    id: 'iq-added-flex-image-one',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Recreate the four flex-direction layouts in the first supplied image.',
    answer:
      'In the supplied image, top-left is column; top-right is column-reverse; middle-left is row; bottom-left is row-reverse, assuming the ordinary left-to-right writing direction. Keep DOM order 1, 2, 3, 4 and change only flex-direction. Reverse values change visual progression, not DOM reading/tab order.\n\n```html\n<div class="demo column"><span>1</span><span>2</span><span>3</span><span>4</span></div>\n<style>\n.demo { display:flex; gap:6px; padding:4px; background:#12bdc1; width:280px; }\n.demo span { display:grid; place-items:center; flex:0 0 36px; width:36px; height:36px; background:#eee; }\n.column { flex-direction:column; }\n.column-reverse { flex-direction:column-reverse; }\n.row { flex-direction:row; }\n.row-reverse { flex-direction:row-reverse; }\n</style>\n```\n\nDuplicate the div and replace its direction class for each case. The reverse row packs 4,3,2,1 toward the right; the reversed column shows 4 at the top and 1 at the bottom with this content-sized container.',
    followUp:
      'How do RTL text direction and vertical writing modes change the physical interpretation of row and column?',
    tags: ['css', 'flexbox', 'image-exercise'],
    sources: [
      {
        title: 'Supplied layout reference',
        url: 'https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view',
      },
      {
        title: 'Flexbox alignment',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container',
      },
    ],
  },
  {
    id: 'iq-added-flex-image-two',
    track: 'javascript',
    topic: 'css',
    noteId: 'javascript-browser-foundations',
    level: 'Intermediate',
    question: 'Recreate the five wrapped-row align-content layouts in the second supplied image.',
    answer:
      'Reading left-to-right across the top row, the values are flex-start, center, and flex-end. The bottom row shows space-around on the left and space-between in the middle. Align-content distributes multiple flex lines along the cross axis; it needs wrapping and extra cross-axis space. It is different from aligning items inside one line.\n\n```html\n<div class="demo"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>\n<style>\n.demo { display:flex; flex-wrap:wrap; align-content:flex-start; gap:6px; box-sizing:border-box; width:220px; height:140px; padding:4px; background:#12bdc1; }\n.demo span { flex:0 0 28px; height:28px; display:grid; place-items:center; background:#eee; }\n</style>\n```\n\nSix items fit the first line and two wrap. Duplicate the container with each align-content value. Space-between puts the outer lines at opposite edges; space-around leaves half as much distributed space at each outer edge as between lines, before accounting for the fixed gap. The dimensions are original implementation choices matching the visual relationships, not measured source pixels.',
    followUp:
      'Why would align-content appear to do nothing with a single unwrapped row or a content-sized container height?',
    tags: ['css', 'flexbox', 'image-exercise'],
    sources: [
      {
        title: 'Supplied layout reference',
        url: 'https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view',
      },
      {
        title: 'Flexbox alignment',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container',
      },
    ],
  },
];

export const answerAdditions = {
  'iq-js-01':
    '\n\nHoisting describes observable declaration behavior, not physical movement of source code. A var binding is initialized to undefined before execution reaches its declaration; let/const remain uninitialized until evaluated. Function declarations and function expressions also differ.\n\n```js\nconsole.log(score); // undefined\nvar score = 2;\n{ const lesson = {done:false}; lesson.done = true; }\n// Reading a let/const binding before its initialization throws ReferenceError.\n```',
  'iq-js-02':
    '\n\n```js\nfunction makeTracker() {\n  let minutes = 0;\n  return amount => (minutes += amount);\n}\nconst a = makeTracker(), b = makeTracker();\nconsole.log(a(5), a(3), b(2)); // 5, 8, 2\n```\n\nEach factory call owns a separate binding. The first closure remembers the updated total; it does not hold a frozen copy of zero.',
  'iq-js-03':
    '\n\n```js\nconst lesson = {\n  minutes: 12,\n  callbacks() {\n    return {normal: function () { return this.minutes; }, arrow: () => this.minutes};\n  }\n};\nconst callbacks = lesson.callbacks();\nconsole.log(callbacks.normal.call({minutes:99})); // 99\nconsole.log(callbacks.arrow.call({minutes:99})); // 12\n```\n\nArrows also have no own arguments binding and cannot be called with new. Regular functions are appropriate when the receiver should come from the invocation.',
  'iq-js-13':
    '\n\n```js\nfunction* lessonIds() { yield 10; yield 20; return 30; }\nconst ids = lessonIds();\nconsole.log(ids.next()); // {value:10, done:false}\nconsole.log(ids.next()); // {value:20, done:false}\nconsole.log(ids.next()); // {value:30, done:true}\n```\n\nCalling the generator creates an iterator without running its body immediately. next resumes it up to yield/return. A for...of loop consumes yielded values but not the final return value. This is not automatically parallel or asynchronous execution.',
  'iq-js-16':
    '\n\n```js\nconst addMinutes = base => extra => base + extra;\nconst afterMorning = addMinutes(25);\nconsole.log(afterMorning(10)); // 35\n```\n\nThe two calls capture base and then supply extra. Currying organizes arguments into single-argument steps; partial application fixes some arguments, and is not necessarily the same transformation.',
  'iq-lab-03':
    "\n\nZ-index controls stack level within stacking contexts; it is useful for overlays, menus, sticky headers, and layered cards. It is not one global priority number. Positioned elements with non-auto z-index, opacity below 1, transforms, and other features can create contexts; flex/grid items can use z-index without being positioned.\n\n```css\n.panel { position: relative; z-index: 1; }\n.menu { position: absolute; z-index: 100; }\n.neighbor { position: relative; z-index: 2; }\n```\n\nA menu inside panel cannot simply outbid neighbor from its ancestor's lower context. Use a documented layer scale, inspect ancestors, and use an appropriate portal/top-layer primitive when warranted rather than escalating arbitrary numbers.",
  'iq-react-05':
    '\n\n```jsx\nimport {useRef, useState} from \'react\';\nfunction Controlled() {\n  const [name, setName] = useState(\'\');\n  return <input aria-label="Controlled name" value={name} onChange={e => setName(e.target.value)}/>;\n}\nfunction Uncontrolled() {\n  const input = useRef(null);\n  return <form onSubmit={e => {e.preventDefault(); console.log(input.current.value);}}>\n    <input aria-label="Uncontrolled name" ref={input} defaultValue="Learner"/><button>Read</button>\n  </form>;\n}\n```\n\nA controlled value must be kept consistent with its change handler. defaultValue sets the initial uncontrolled value; subsequent typing belongs to the DOM. Avoid switching one input between modes.',
  'iq-react-06':
    "\n\n```jsx\nimport {memo, useCallback, useMemo, useState} from 'react';\nconst Results = memo(function Results({items, onChoose}) {\n  return <ul>{items.map(x => <li key={x.id}><button onClick={() => onChoose(x.id)}>{x.title}</button></li>)}</ul>;\n});\nfunction Search({items, query}) {\n  const [selected, setSelected] = useState(null);\n  const visible = useMemo(() => items.filter(x => x.title.includes(query)), [items, query]);\n  const choose = useCallback(id => setSelected(id), []);\n  return <><Results items={visible} onChoose={choose}/><p>{selected}</p></>;\n}\n```\n\nUseMemo caches a calculated result; useCallback caches a function identity; memo can skip parent-driven component rendering when props compare equal. Stable identity alone is not correctness. Measure the relevant workload; state/context updates and unstable inputs can still cause work. Compiler-enabled builds may reduce the need for manual memoization.",
  'iq-react-07':
    "\n\n```jsx\nimport {createContext, useContext, useState} from 'react';\nconst ThemeContext = createContext('light');\nfunction Label() { return <p>{useContext(ThemeContext)}</p>; }\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return <ThemeContext.Provider value={theme}><button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Toggle</button><Label/></ThemeContext.Provider>;\n}\n```\n\nConsumers read the nearest provider. Context distributes the value and reacts when it changes; it does not prescribe reducers, middleware, or server-cache policy. Composition can often remove prop drilling before introducing another shared-state mechanism.",
  'iq-react-11':
    "\n\nUse a boundary around a recoverable region so a failed render can show fallback UI. For function-component applications, a maintained boundary wrapper or the framework's route-error facility can avoid writing a class in feature code. Ordinary event-handler failures and unrelated async callbacks need their own handling; boundaries do not catch every promise rejection. Error-boundary behavior remains relevant even in a hooks-first codebase. Define reset/retry behavior and log useful diagnostic context without exposing private data.",
  'iq-react-13':
    "\n\n```jsx\nimport {useEffect, useState} from 'react';\nfunction useOnline() {\n  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);\n  useEffect(() => {\n    const sync = () => setOnline(navigator.onLine);\n    sync();\n    window.addEventListener('online', sync); window.addEventListener('offline', sync);\n    return () => {window.removeEventListener('online', sync); window.removeEventListener('offline', sync);};\n  }, []);\n  return online;\n}\n```\n\nThis client-oriented hook shares behavior, not one global state cell. navigator.onLine is only a connectivity hint, not proof that your API is reachable; server-rendered hydration needs a deliberately consistent initial snapshot.",
  'iq-mongo-14':
    '\n\nAdditional failure check: TTL deletion is asynchronous, so an expired document can remain present after its logical expiry. Use the expiry timestamp in the authorization/query contract to reject expired sessions immediately; TTL is cleanup. Test the boundary while the expired document still exists. Define clock handling and renewal rules explicitly. Treat storage cleanup, authentication validity, and token expiry as related but separate concerns rather than making correctness depend on the background deletion schedule.',
  'iq-lab-14':
    '\n\nAdditional failure check: Streaming limits buffering, but only if producers respect backpressure. A pipeline coordinates transfer and error propagation/cleanup across streams. On client disconnect, stop the database cursor and owned downstream work instead of continuing a full export nobody can receive. If headers have already been sent, a later error cannot be converted into an ordinary JSON error response without corrupting the format. Define partial-download behavior and make retries explicit. Observe memory, cursor lifetime, and cancellation under slow or disconnected consumers.',
};

export const reusedChecklist = {
  'iq-js-01': 'let / var / const; hoisting (spelled hosting in the supplied list)',
  'iq-js-02': 'closures with an original example',
  'iq-js-03': 'arrow versus regular functions; this behavior',
  'iq-js-05': 'loose and strict equality',
  'iq-js-13': 'generator functions versus normal functions',
  'iq-js-15': 'event delegation through bubbling',
  'iq-js-16': 'function currying',
  'iq-lab-03': 'z-index purpose, stacking contexts, and best practices',
  'iq-react-01': 'state snapshots',
  'iq-react-02': 'stable keys and identity',
  'iq-react-03': 'when effects are appropriate; side effects versus derived values',
  'iq-react-05': 'controlled and uncontrolled components with code (repeated request)',
  'iq-react-06': 'useCallback, useMemo, React.memo differences and performance example',
  'iq-react-07': 'local state, Context, shared state, and context example',
  'iq-react-08': 'pure functions and pure rendering',
  'iq-react-11': 'error boundaries in a function-component application',
  'iq-react-12': 'performance techniques for large tables',
  'iq-react-13': 'custom hook with original implementation',
  'iq-react-15': 'choosing reducer state versus separate local state',
  'iq-mongo-14': 'MongoDB session expiry: reuse the existing TTL question',
  'iq-lab-14':
    'Node export cancellation and partial-output behavior: reuse the existing streaming question',
};
