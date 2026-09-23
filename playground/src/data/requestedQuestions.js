// Original questions and examples; canonical expansions avoid duplicate practice cards.
export const requestedQuestions = [
  {
    id: 'iq-added-html-elements',
    track: 'javascript',
    topic: 'html',
    noteId: 'javascript-browser-foundations',
    level: 'Foundation',
    question: 'HTML tag/element same hain? Attributes ka role kya hai?',
    answer:
      "- Tag markup syntax hai, jaise `<p>`/`</p>`\n- element us markup se represented structure hai including content/attributes.\n- Attributes start tag par configuration/metadata dete hain.\n- Neeche p element type aur class/lang attributes hain.\n- DOM properties runtime interface hain\n- har property markup attribute ka exact mirror nahi.\n- Input typing se current value change hoti hai, original value attribute necessarily nahi.\n\n```html\n<p class=\"summary\" lang=\"en\">Study one concept.</p>\n```",
    followUp: 'Typing ke baad input value attribute/current property ka difference kya hai?',
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
    question: 'Void elements kya hain; closing tags hote hain?',
    answer:
      "- Void elements child content/end tag nahi rakhte.\n- img,input,br,hr,meta,link,source,track,area,base,col,embed,wbr examples hain.\n- `<img />` ka slash HTML mein general self-closing mechanism nahi banata.\n- Non-void `<div />` parsed closed div nahi hai.\n- Isliye script jaisa non-void tag proper closing tag maangta hai\n- warna baaki markup wrong parse ho sakta hai.\n\n```html\n<img src=\"lesson.webp\" alt=\"A learner drawing a graph\">\n<input name=\"email\" type=\"email\">\n```",
    followUp: '`<script />` rest HTML document kyun tod sakta hai?',
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
    question: 'Ordered, unordered aur description lists ka difference?',
    answer:
      "- Sequence/rank important ho toh ol\n- order meaning na ho toh ul\n- term-description/name-value group ke liye dl.\n- ol/ul ke andar li, dl mein dt/dd use karo.\n- Bullets CSS se hide karne par semantics nahi hatati.\n- Meaningful group mein multiple terms/descriptions ho sakte hain.\n- Menu visually row mein hone se ordered-list semantics automatically required nahi hoti.\n\n```html\n<ol><li>Read</li><li>Practice</li></ol>\n<ul><li>Java</li><li>React</li></ul>\n<dl><dt>Closure</dt><dd>A function with access to lexical bindings.</dd></dl>\n```",
    followUp: 'Menu links row mein hain, isliye ol required hai?',
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
    question: 'class aur id ka difference kya hai?',
    answer:
      "- class reusable space-separated tokens hain\n- element multiple classes rakh sakta hai.\n- id document mein unique element identity hai\n- fragment navigation aur label association mein use hoti hai.\n- CSS .field class, #course-search ID select karta hai.\n- Har styling ID se karne par specificity/reuse cost badhti hai.\n- Duplicate label-target IDs accessibility association ambiguous bana sakte hain.\n\n```html\n<label for=\"course-search\">Find a course</label>\n<input id=\"course-search\" class=\"field field-wide\">\n```",
    followUp: 'Label referenced ID two inputs share karein toh kya tootega?',
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
    question: 'strong/b aur em/i ka difference kya hai?',
    answer:
      "- strong importance/seriousness/urgency dikhata hai\n- b extra importance bina attention deta hai.\n- em stress emphasis, i alternate voice/convention jaise technical term mark karta hai.\n- Default bold/italic style definition nahi.\n- Sirf visual style chahiye toh CSS lo.\n- em kis word par hai usse spoken stress aur intended meaning badal sakta hai, words same rehkar bhi.\n\n```html\n<p><strong>Save your draft before resetting.</strong></p>\n<p>I asked for <em>one</em> example.</p>\n<p>The term <i>lexical scope</i> describes lookup by source nesting.</p>\n```",
    followUp: 'Same words mein em position change meaning kaise badal sakti hai?',
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
    question: 'head/body mein kya aata hai; header/nav/main/aside/footer ka role?',
    answer:
      "- head metadata: title, charset, CSS links, suitable scripts.\n- body actual page content.\n- header introduction, nav major navigation, main dominant content, aside related-tangential content, footer closing info.\n- article independently meaningful unit\n- section thematic grouping usually heading ke saath.\n- Article apna header/footer rakh sakta hai.\n- Yeh semantic roles pixel position prescribe nahi karte\n- layout CSS decide karti hai.\n\n```html\n<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><title>Notes</title></head>\n<body><header><h1>Study notes</h1></header><nav aria-label=\"Main\"><a href=\"/\">Home</a></nav><main><article><h2>Closures</h2><p>One concept...</p></article></main><footer>About this collection</footer></body></html>\n```",
    followUp: 'Article ka apna header/footer kab ho sakta hai?',
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
    question: 'Ek webpage doosri mein embed kaise karoge?',
    answer:
      "- iframe separate browsing context embed karta hai.\n- Descriptive title aur deliberate limited sandbox/permissions do.\n- Embedded server security headers se framing refuse kar sakta hai\n- cross-origin rules arbitrary DOM access rokti hain.\n- Cooperation postMessage contract se karo: expected origin/source aur payload validate karo.\n- Iframe ordinary component se heavier hai\n- isolation bypass karne ki approach mat lo.\n\n```html\n<iframe src=\"/demo.html\" title=\"Binary search demonstration\" loading=\"lazy\"></iframe>\n```",
    followUp: 'Message receiver origin/payload ke kaunse checks kare?',
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
    question: 'href/target kaise work karte hain aur link versus a kya hai?',
    answer:
      "- Anchor href navigation banata hai. _self current, _blank new, _parent parent, _top top-level context\n- named target existing named context reuse kar sakta hai.\n- link element stylesheet jaisi resource relationship batata hai, usually head mein hota hai.\n- Navigation bina action ke liye button lo.\n- New tab user ke liye useful hai ya nahi, deliberately decide karo.\n\n```html\n<link rel=\"stylesheet\" href=\"/styles.css\">\n<a href=\"/notes\" target=\"_blank\" rel=\"noopener\">Open notes</a>\n<a href=\"#practice\">Jump to practice</a>\n```",
    followUp: 'Action ke liye href="#" weak substitute kyun hai?',
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
    question: 'Scripts head/body mein kab; defer/async/modules loading kaise badalte hain?',
    answer:
      "- Classic external script without async/defer encountered position par parsing block karta hai.\n- Body-end se earlier DOM pehle parse hota hai.\n- Head+defer parallel download, parse ke baad document-order execution, DOMContentLoaded se pehle.\n- async ready hote hi execute, order guarantee nahi.\n- Modules default deferred hain unless async scheduling badle.\n- Independent work ke liye async\n- same app dono example ways se load mat karo.\n\n```html\n<script src=\"/app.js\" defer></script>\n<script type=\"module\" src=\"/main.js\"></script>\n```",
    followUp: 'Async script later DOM element query karke fail kyun ho sakti hai?',
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
    question: 'HTML forms aur important defaults kaise work karte hain?',
    answer:
      "- Form successful named controls action URL ko submit karta hai.\n- Default method GET\n- omitted action current document.\n- Form button default submit, unless type specify karo.\n- Disabled controls submit nahi hote\n- browser validation submission rok sakti hai.\n- Enter implicit submit controls par depend hai.\n- Client preventDefault alternative flow de sakta hai, lekin server validation phir bhi required hai.\n\n```html\n<form action=\"/search\" method=\"get\">\n  <label for=\"q\">Search</label><input id=\"q\" name=\"q\" required>\n  <button type=\"submit\">Find</button>\n  <button type=\"button\">Show help</button>\n</form>\n```",
    followUp: 'Input ka name hatane par submitted query kyun disappear hogi?',
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
    question: 'HTML interaction JavaScript se kaise handle karoge?',
    answer:
      "- Inline event attributes possible hain\n- addEventListener behavior separate, multiple listeners aur cleanup support karta hai.\n- Semantic control use karo aur element exist hone ke baad listener register karo.\n- Event object se action inspect karo.\n- Remove ke liye same callback identity chahiye\n- fresh arrow same body hone par bhi different function hai.\n- Owner destroy par cleanup karo.\n\n```html\n<button id=\"practice\" type=\"button\">Practice</button>\n<script>\nconst button = document.querySelector('#practice');\nconst start = () => console.log('Starting a round');\nbutton.addEventListener('click', start);\n// On teardown: button.removeEventListener('click', start);\n</script>\n```",
    followUp: 'Fresh arrow se listener removal kyun nahi hoga?',
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
    question: 'HTML5 ke major goals/improvements kya the?',
    answer:
      "- HTML5 effort ne compatible parsing aur web-app features standardize kiye: semantic landmarks, native audio/video, richer forms, canvas.\n- Existing content compatibility important thi.\n- Modern HTML Living Standard hai, frozen new-tags list nahi.\n- Storage/workers broader web platform hain, HTML tags nahi.\n- Features accessibility/behavior se choose aur audience support verify karo.\n- HTML5 JavaScript replace nahi karta\n- structure aur behavior complementary hain.",
    followUp: 'HTML5 ne JavaScript replace kiya, yeh claim wrong kyun?',
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
    question: 'audio/video kaise work karte hain; source/track kya add karte hain?',
    answer:
      "- audio/video native playback, source candidate formats, track WebVTT captions jaise timed text deta hai.\n- controls playback UI expose karta hai.\n- Autoplay browser policy se restricted hai\n- page understanding us par depend na ho.\n- Meaningful captions/transcripts aur network cost consider karo.\n- Video fallback text unsupported player ke liye hai\n- supported playback mein speech captions ki need phir bhi hai.\n\n```html\n<video controls preload=\"metadata\" poster=\"preview.webp\">\n  <source src=\"lesson.webm\" type=\"video/webm\">\n  <source src=\"lesson.mp4\" type=\"video/mp4\">\n  <track kind=\"captions\" src=\"lesson-en.vtt\" srclang=\"en\" label=\"English\" default>\n  <a href=\"lesson.mp4\">Download the lesson</a>\n</video>\n```",
    followUp: 'Fallback paragraph captions replace kyun nahi karta?',
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
    question: 'header/h1 ka relation kya hai; har header mein h1 required hai?',
    answer:
      "- header introductory content group karta hai\n- h1 heading rank hai.\n- Header logo/nav/heading rakh sakta hai\n- h1 ko header parent required nahi.\n- Old proposed automatic outline algorithm par multiple h1 reinterpret karne ke liye rely mat karo.\n- Clear page heading aur explicit h2/h3 hierarchy lo.\n- Heading navigation meaning se test karo, font sizes se nahi.\n\n```html\n<header><h1>Java revision</h1><p>Practice by topic</p></header>\n<main><section><h2>Collections</h2><h3>Hash maps</h3></section></main>\n```",
    followUp: 'Font size dekhe bina heading navigation kaise verify karoge?',
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
    question: 'Native drag-drop kya deta hai; image draggable kaise?',
    answer:
      "- Drag events/DataTransfer data transfer dete hain.\n- Images generally default draggable hain\n- contract mein explicit draggable rakho.\n- Drop accept karne ke liye normally dragover default cancel karo.\n- Dropped HTML/URL validate karo\n- event se aane par trusted nahi bante.\n- Keyboard/touch alternative, jaise Move up/down, do.\n- Dragging enhancement ho, action ka only accessible route nahi.\n\n```html\n<img id=\"tile\" src=\"tile.webp\" alt=\"Graph lesson\" draggable=\"true\">\n<script>\ndocument.querySelector('#tile').addEventListener('dragstart', event => {\n  event.dataTransfer.setData('text/plain', 'lesson-graph');\n});\n</script>\n```",
    followUp: 'Drag event ka HTML/URL automatically trusted kyun nahi?',
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
    question: 'CSS sizing, srcset/sizes/picture responsive images kaise banate hain?',
    answer:
      "- CSS layout size, srcset/sizes suitable width-density source selection, picture alternate crop/format choose karne mein help karte hain.\n- Width/height se aspect-ratio space reserve karke shifts roko.\n- sizes actual rendered layout reflect kare.\n- Phone ka crop alag chahiye toh picture media lo\n- sirf fewer bytes nahi.\n- width:100% alone downloaded source size optimize nahi karta.\n\n```html\n<img src=\"notes-800.webp\" srcset=\"notes-400.webp 400w, notes-800.webp 800w\" sizes=\"(max-width: 600px) 100vw, 600px\" width=\"800\" height=\"450\" alt=\"Notes arranged by topic\" style=\"max-width:100%;height:auto\">\n```",
    followUp: 'width:100% par bhi huge image download kyun ho sakti hai?',
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
    question: 'Web app manifest aur old AppCache ka difference kya hai?',
    answer:
      "- Old html manifest attribute Application Cache configure karta tha\n- AppCache obsolete hai.\n- Modern web app manifest JSON mein app identity/icons/start URL/display preferences deta hai aur head se link hota hai.\n- Woh requests cache nahi karta.\n- Offline caching ke liye service-worker strategy, update behavior aur offline limits alag define karo.\n- Install metadata aur offline guarantee same nahi.\n\n```html\n<link rel=\"manifest\" href=\"/app.webmanifest\">\n```",
    followUp: 'Sirf manifest add karke offline mein kya fail rahega?',
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
    question: 'Data attributes kya hain aur access kaise karte hain?',
    answer:
      "- data-* small app-specific string values valid custom attributes mein rakhta hai.\n- dataset camelCase naam deta hai: data-max-count→dataset.maxCount.\n- Scripts/users inhe read kar sakte hain, secrets store mat karo.\n- Required values validate/convert karo\n- blank aur malformed number alag handle karo.\n- Data attribute accessible label ka substitute nahi hai\n- UI semantics separately rakho.\n\n```html\n<button data-lesson-id=\"42\">Open lesson</button>\n<script>\nconst button = document.querySelector('[data-lesson-id]');\nconsole.log(button.dataset.lessonId); // '42', a string\n</script>\n```",
    followUp: 'data-max-count ka dataset naam aur numeric validation kya hogi?',
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
    question: 'Shadow DOM kya hai? Example aur limits samjhao.',
    answer:
      "- Shadow DOM host se attached encapsulated subtree hai, often web components mein.\n- Style scope internals isolate karta hai\n- slots light-DOM content project karte hain.\n- React render representation se alag aur security boundary nahi.\n- Composed events/inherited CSS boundaries cross kar sakte hain.\n- Example fixed trusted markup use karta hai\n- untrusted string innerHTML mein interpolate mat karo.\n\n```js\nconst host = document.createElement('div');\nconst shadow = host.attachShadow({mode: 'open'});\nshadow.innerHTML = '<style>p { color: teal; }</style><p>Local styling</p>';\ndocument.body.append(host);\n```",
    followUp:
      'Composed events/inherited properties complete isolation claim ko kaise limit karte hain?',
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
    question: 'inline, block, inline-block, flex aur grid ka difference?',
    answer:
      "- display box generation/layout participation decide karta hai.\n- Normal block new line, inline line flow, inline-block inline participation plus box sizing deta hai.\n- Flex/grid direct children layout banate hain\n- outer display normally block, inline variants possible.\n- display:none no box.\n- Yeh permanent HTML categories nahi, CSS behavior hai.\n- Modes ki fixed count ratne se better exact layout contract samjho.\n\n```css\n.badge { display: inline-block; padding: .25rem .5rem; }\n.cards { display: grid; grid-template-columns: repeat(2, 1fr); }\n```",
    followUp: 'Normal inline span par width block jaisa kyun behave nahi karti?',
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
    question: 'static, relative, absolute, fixed, sticky ka difference?',
    answer:
      "- position CSS property hai.\n- static normal flow\n- relative original space preserve karke visually offset.\n- absolute flow se bahar aur containing block, often positioned ancestor, use karta hai.\n- fixed commonly viewport, lekin transformed ancestor containing block ban sakta hai.\n- sticky flow mein rehta aur scroll constraints/inset par stick karta hai.\n- Absolute badge original space reserve nahi karta.\n\n```css\n.card { position: relative; }\n.badge { position: absolute; top: .5rem; right: .5rem; }\n.toolbar { position: sticky; top: 0; }\n```",
    followUp: 'Ancestor mein movement room na ho toh sticky kyun fail dikhega?',
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
    question: 'display:none, visibility:hidden, opacity:0 ka difference?',
    answer:
      "- display:none generated box/layout space hataata hai.\n- visibility:hidden generally space rakhta par visibility/normal interaction/focus hataata hai.\n- opacity:0 transparent box rakhta jo separately disabled na ho toh pointer/focus receive kar sakta hai.\n- First two generally accessibility tree se bhi hide hote hain.\n- Choice mein layout, interaction aur accessibility teeno dekho\n- transparent overlay clicks block kar sakti hai.\n\n```css\n.removed { display: none; }\n.reserved { visibility: hidden; }\n.transparent { opacity: 0; }\n```",
    followUp: 'Invisible opacity-zero overlay visible buttons block kyun kar sakti hai?',
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
    question: 'Stylesheet kya hai aur HTML mein CSS apply karne ke three ways?',
    answer:
      "- Stylesheet CSS rules ka collection hai.\n- External link reusable/cacheable file\n- internal style page-specific\n- inline style element-local but scale par harder maintain.\n- CSS imports/programmatic APIs bhi hain\n- “three ways” common organization model hai, exhaustive mechanism count nahi.\n- Later external CSS normal inline declaration automatically override nahi karti\n- full cascade precedence apply hoti hai.\n\n```html\n<link rel=\"stylesheet\" href=\"/site.css\">\n<style>.note { padding: 1rem; }</style>\n<p class=\"note\" style=\"color:teal\">Practice daily</p>\n```",
    followUp: 'Later external stylesheet har inline declaration override kyun nahi karti?',
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
    question: 'Specificity kya hai aur !important cascade mein kahan fit hota hai?',
    answer:
      "- Specificity se pehle origin, importance aur layer order decide hota hai.\n- Phir IDs, class/attribute/pseudo-class, element/pseudo-element weights lexicographically compare karo.\n- Same context/equal weight mein later wins.\n- Inline normal stylesheet se special precedence rakhta hai\n- !important flag hai, extra specificity digit nahi. :where zero\n- :is arguments ki specificity leta hai.\n- Simple selectors/layers prefer karo.\n\n```css\np.note { color: teal; } /* 0 IDs, 1 class, 1 type */\n#intro { color: purple; } /* 1 ID wins in the same normal layer */\n```",
    followUp: 'More-specific selector higher-priority layer se kyun haar sakta hai?',
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
    question: 'Box model aur box-sizing width ko kaise affect karte hain?',
    answer:
      "- Andar se content→padding→border→margin.\n- content-box width sirf content, padding/border extra.\n- border-box width content+padding+border include, margin outside.\n- Example default card border-box width 244px\n- border-box mode mein total 200px aur content 156px.\n- Margins declared width ke andar nahi aati.\n- Vertical height mein margin collapse/inline behavior simple addition ko affect kar sakte hain.\n\n```css\n.card { width: 200px; padding: 20px; border: 2px solid; margin: 10px; }\n.compact { box-sizing: border-box; }\n```",
    followUp: 'Margin collapsing/inline layout simple total-height arithmetic kyun todte hain?',
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
    question: 'Element ko parent/viewport mein center kaise karoge?',
    answer:
      "- Two-axis centering ke liye flex parent mein justify-content aur align-items center karo.\n- Vertical centering dikhne ke liye available height/min-height chahiye.\n- Sirf horizontal narrower block ko margin-inline:auto de sakte ho.\n- Growing content clip na ho isliye min-height useful hai.\n- flex-direction axes swap karega\n- dono axes center hain toh center result preserve rahega.\n\n```html\n<main class=\"screen\"><div class=\"card\">Revision</div></main>\n<style>\nbody { margin: 0; }\n.screen { min-height: 100vh; min-height: 100dvh; display: flex; justify-content: center; align-items: center; }\n.card { width: min(90%, 24rem); padding: 1rem; box-sizing: border-box; }\n</style>\n```",
    followUp: 'flex-direction column par axes kya badlenge; example phir bhi center kyun hai?',
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
    question: 'Borders se CSS triangle kaise banta hai?',
    answer:
      "- Zero-size box ke thick borders triangular regions banate hain.\n- Three borders transparent, remaining colored rakho.\n- Colored bottom border upward triangle deta hai\n- right-pointing ke liye left border color karo aur others adjust karo.\n- Decoration ke liye suitable\n- meaningful icon ka accessible name/text bhi chahiye.\n- Complex scalable shape mein SVG/clip-path clearer ho sakta hai.\n\n```html\n<span class=\"triangle\" aria-hidden=\"true\"></span>\n<style>\n.triangle { display: inline-block; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 14px solid teal; }\n</style>\n```",
    followUp: 'Whole layout rotate kiye bina triangle right-pointing kaise banega?',
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
    question: 'Pseudo-element aur pseudo-class ka difference?',
    answer:
      "- Pseudo-elements element part/generated box select karte hain: ::first-letter, ::before, ::after, ::selection.\n- Pseudo-classes state/relationship select karti hain, jaise :hover/:focus-visible.\n- Essential information sirf generated content mein mat rakho.\n- Required form field real label aur form semantics se express karo.\n- Void input ke before/after par dependable essential text attach karna reliable approach nahi.\n\n```css\n.required::after { content: ' *'; color: darkred; }\nbutton:focus-visible { outline: 3px solid teal; }\n```",
    followUp: 'Void input par essential text ke liye ::before reliable kyun nahi?',
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
    question: 'Flex container/item ki main properties kya hain?',
    answer:
      "- Container: display:flex layout\n- direction main axis\n- wrap multiple lines\n- flow shorthand\n- justify main-axis space\n- align-items cross-axis items\n- align-content multiple lines\n- gap gutters.\n- Item: order visual order\n- grow positive space\n- shrink basis-weighted shrinkage\n- basis starting main size\n- flex shorthand\n- align-self individual alignment.\n- Visual reorder reading/keyboard order automatically nahi badalta.\n- Long child ko min-width:0 chahiye ho sakta hai.\n\n```css\n.row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }\n.main { flex: 1 1 16rem; min-width: 0; }\n.tools { flex: 0 0 auto; }\n```",
    followUp: 'flex-shrink ke baad bhi long child ko min-width:0 kyun chahiye ho sakta hai?',
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
    question: 'Flexbox se responsive header aur equal-width cards banao.',
    answer:
      "- Yeh supplied images se alag original layout exercise hai.\n- Header mein brand left, wrapping actions right\n- cards available space share aur narrow screen par wrap karein.\n- Neeche basis/grow se layout banti hai\n- browser width fixed assumptions mat rakho.\n- 320px, long link labels, zoom aur keyboard order test karo.\n- Last card stretch rule ko deliberate item styling se choose karo.\n\n```html\n<header class=\"bar\"><strong>Shortnotes</strong><nav class=\"actions\" aria-label=\"Main\"><a href=\"/\">Read</a><a href=\"/practice\">Practice</a></nav></header>\n<section class=\"cards\" aria-label=\"Courses\"><article>JavaScript</article><article>React</article><article>Java</article></section>\n<style>\n.bar,.actions,.cards { display:flex; gap:1rem; flex-wrap:wrap; }\n.bar { justify-content:space-between; align-items:center; }\n.cards > article { flex:1 1 14rem; min-width:0; padding:1rem; border:1px solid; }\n</style>\n```",
    followUp: 'Viewport hard-code bina sirf last card ka stretching kaise rokoge?',
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
    question: 'vh/vw kya hain; dynamic viewport units kab useful hain?',
    answer:
      "- 1vw viewport width ka 1%\n- 1vh height reference ka 1%.\n- Mobile controls visible space badalti hain\n- svh/lvh/dvh small/large/dynamic viewport heights distinguish karte hain.\n- Growing screens par flexible min-height prefer karo.\n- Ordinary block ka 100vw scrollbar space include karke horizontal overflow la sakta hai\n- width:100% parent fit karta hai.\n- Font scaling sensible min/max se bound karo.\n\n```css\n.page { min-height: 100vh; min-height: 100dvh; }\n.title { font-size: clamp(1.5rem, 4vw, 3rem); }\n```",
    followUp: 'Viewport font size mein sensible min/max kyun chahiye?',
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
    question: 'Font face kaunsi property choose karti hai; float kab use karein?',
    answer:
      "- font-family ordered typeface list plus generic fallback choose karta hai. @font-face downloadable resource define\n- weight/style variants choose karte hain.\n- Text ko image ke around wrap karna ho toh float useful\n- full app layout mein flex/grid often clearer.\n- flow-root float contain karne ka formatting context deta hai.\n- Custom named font tab milega jab uski definition/resource load ho.\n\n```css\nbody { font-family: 'Study Sans', system-ui, sans-serif; }\n.article { display: flow-root; }\n.article img { float: inline-start; width: 8rem; margin-inline-end: 1rem; }\n```",
    followUp: 'Float layout ko flex se different clearing/containment kyun chahiye?',
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
    question: 'div, p; div p; div ~ p; div + p; div > p kya select karte hain?',
    answer:
      "- `div, p` dono types\n- `div p` any-depth p descendants\n- `div ~ p` same-parent later p siblings\n- `div + p` immediately-next p sibling\n- `div > p` direct p children select karta hai.\n- Example descendants A/B, direct A, adjacent C, later C/D\n- comma div plus all four p leta hai.\n- D ko nested section mein move karoge toh same-parent sibling relation tootegi.\n\n```html\n<div><p>A</p><section><p>B</p></section></div>\n<p>C</p><p>D</p>\n```",
    followUp: 'D ko section mein move karne par div ~ p match rahega?',
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
    question: 'CSS2/CSS3 ka difference; kya CSS3 single current version hai?',
    answer:
      "- CSS2 largely single spec thi, CSS2.1 ne behavior clarify kiya.\n- Later CSS modular hai: selectors/color/layout/background independent levels par evolve karte hain.\n- Media queries, rounded borders, transitions often CSS3 bucket mein bolte hain\n- flex/grid ki own specs hain.\n- Module name/support check meaningful hai.\n- Unsupported enhancement se basic use block na ho, progressive enhancement rakho.",
    followUp: 'Selectors Level 4 ka matlab every module Level 4 kyun nahi?',
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
    question: 'UX preserve karke asset loading optimize kaise karoge?',
    answer:
      "- Pehle critical rendering path measure karo.\n- Suitable sized/compressed images, useful font subsets, compressed/cacheable versioned assets aur optional code splitting use karo.\n- Below-fold image lazy, likely LCP image priority.\n- Appropriate defer/modules\n- proven-critical resources hi preload.\n- Example noncritical image ka hai.\n- Excess preload bandwidth compete karta hai\n- small transfer size alone responsive interaction prove nahi karti.\n\n```html\n<img src=\"chart.webp\" width=\"640\" height=\"360\" loading=\"lazy\" alt=\"Topic completion chart\">\n```",
    followUp: 'JS download fast lekin page unresponsive: kya inspect karoge?',
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
    question: 'Six delayed callbacks wala let loop kya print karega? sample call na ho toh?',
    answer:
      "- console.log casing repair karke function call karo\n- definition alone nothing print karti hai.\n- Ordinary run mein requested delay ke baad 0–5 eligible logs hain.\n- Har let iteration ki binding alag.\n- var karne par shared function-scoped i ki final value 6 sab callbacks dekhengi.\n- Delay earliest scheduling threshold hai, exact appointment time nahi\n- i<5 se count/final value badalti hai.\n\n```js\nfunction sample() {\n  for (let i = 0; i <= 5; i++) setTimeout(() => console.log(i), 1000);\n}\nsample();\n```",
    followUp: 'i<5 se callback count/final var value dono kyun badlenge?',
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
    question: 'Timer a ko 2s baad, sync code b log karta hai. Extra timer bina a pehle kaise?',
    answer:
      "- Original mein b then a, kyunki script timer se pehle finish hoti hai.\n- Existing callback mein ordered operations rakho ya us timer ki completion promise await karo.\n- Neeche dono delay ke baad a,b order mein hain.\n- b elsewhere chahiye toh completion promise expose karo\n- thread block mat karo.\n- Correct names setTimeout/console lowercase hain\n- exact 2000ms guarantee nahi.\n\n```js\nsetTimeout(() => {\n  console.log('a');\n  console.log('b');\n}, 2000);\n```",
    followUp: 'Busy event loop par exact 2000ms guarantee kar sakte ho?',
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
    question: 'Promises kya hain, three states aur callbacks se comparison kya hai?',
    answer:
      "- Callback invoke karne ke liye supplied function hai\n- sync/async ya events mein repeatedly call ho sakti hai.\n- Promise one eventual outcome hai: pending/fulfilled/rejected\n- then/catch/finally composable channel dete hain.\n- Executor sync, reactions async.\n- Resolved fourth state nahi: pending promise adopt ho sakti hai.\n- Promises automatic cancellation/ongoing subscriptions replace nahi karti\n- inner promise return karo taaki chain complete work observe kare.\n\n```js\nconst result = new Promise(resolve => resolve(21));\nresult.then(value => value * 2).then(console.log); // 42\n```",
    followUp: 'Inner promise return bhoolne se sequencing/errors kyun tootenge?',
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
    question: 'Promise msg-object se reject ho toh kya print hoga?',
    answer:
      "- Syntax repair ke baad rejection fulfillment handler skip karke catch tak jaati hai.\n- Output `Something went wrong` hai.\n- Catch callback undefined return karta hai, toh catch-produced promise undefined se fulfill hoti hai unless new error throw ho.\n- Error object better stack context deta hai.\n- Original brackets/casing galat hon toh intended trace se pehle syntax/identifier error aa sakti hai.\n\n```js\nconst task = new Promise((resolve, reject) => {\n  reject({msg: 'Something went wrong'});\n});\ntask.then(value => console.log(value)).catch(error => console.log(error.msg));\n```",
    followUp: 'Catch log ke baad new Error throw kare toh kya badlega?',
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
    question: 'await delay(6000) ke baad ten-second timer aur second log: timeline kya hai?',
    answer:
      "- Assume delay timer-settled promise hai aur async function/ES module mein run hai.\n- Around 6s par second log aur ten-second timer schedule\n- first original start se around 16s eligible hai, 10s nahi.\n- Load par later run ho sakta hai.\n- Helper undefined ya await invalid context ho toh timing puzzle ke bajay error hai.\n- Timer pehle schedule hota toh windows overlap karti.\n\n```js\nconst delay = ms => new Promise(resolve => setTimeout(resolve, ms));\nasync function run() {\n  await delay(6000);\n  setTimeout(() => console.log('first'), 10000);\n  console.log('second');\n}\nrun();\n```",
    followUp: 'Ten-second timer six-second await se pehle schedule ho toh?',
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
    question: 'await setTimeout callback wait kyun nahi karta; a/b/c/d/e repair kaise?',
    answer:
      "- Ordinary browser setTimeout handle deta hai, completion promise nahi.\n- Await handle ko wrap karke microtask se resume karta hai\n- callback ka wait nahi.\n- Corrected original normally a,b,e,d,c deta hai for 1000/0 delays.\n- Repaired promise-based version a,b,c,d,e hai.\n- Await is async function pause karta hai, whole thread nahi.\n- ES module top-level await valid context hai.\n\n```js\nconst delay = ms => new Promise(resolve => setTimeout(resolve, ms));\nasync function fun1() {\n  console.log('a');\n  console.log('b');\n  await delay(1000); console.log('c');\n  await delay(0); console.log('d');\n  console.log('e');\n}\nfun1();\n```",
    followUp: 'ES module mein top-level await valid, normal function mein kyun nahi?',
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
    question: 'Callback hell kya hai; async/await design kab improve karte hain?',
    answer:
      "- Nested dependent callbacks success/error/control-flow mix kar deti hain.\n- Promises returnable operations, async/await try/catch ke saath dependent sequence readable banate hain.\n- Independent operations suitable ho toh concurrent rakho.\n- Callback API ko pehle correctly adapt karo\n- await arbitrary registration ko completion wait nahi banata.\n- Repeated events ke liye callbacks appropriate hain\n- every callback promise mein replace karna goal nahi.\n\n```js\n// Application excerpt: these three helpers return promises.\nasync function enroll(userId) {\n  const user = await loadUser(userId);\n  const course = await chooseCourse(user);\n  return saveEnrollment(user.id, course.id);\n}\n```",
    followUp: 'Course selection user load se independent ho toh kya parallel chalega?',
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
    question: 'process.nextTick aur setImmediate ka difference?',
    answer:
      "- Dono Node-specific scheduling APIs hain.\n- nextTick current JS operation ke baad checkpoint mein ordinary event-loop phases se pehle queued work chalata hai.\n- setImmediate check phase mein loop progress allow karta hai.\n- Recursive nextTick I/O starve kar sakta hai.\n- Promise order ki blanket guarantee mat banao: ES-module evaluation aur already-running microtasks context badalte hain.\n- Browser standard APIs nahi hain.\n\n```js\n// Run as a CommonJS .cjs file.\nprocess.nextTick(() => console.log('tick'));\nsetImmediate(() => console.log('immediate'));\nconsole.log('sync');\n// sync, tick, immediate\n```",
    followUp: 'Long CPU task responsive chunks ke liye nextTick weak kyun hai?',
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
    question: 'Node mein setImmediate, setTimeout(0), sync log ka order?',
    answer:
      "- Names setImmediate,setTimeout,console.log correct karo.\n- Third sync log pehle.\n- Top-level immediate versus zero-timer order portable guarantee nahi\n- timing/context par depend hai.\n- Ordinary I/O callback ke andar dono schedule hon toh immediate newly-scheduled timer se pehle expected hai.\n- Ek observed run memorize mat karo.\n- Browser mein standard setImmediate/process.nextTick available nahi.\n\n```js\n// Node script\nsetImmediate(() => console.log('first'));\nsetTimeout(() => console.log('second'), 0);\nconsole.log('third');\n```",
    followUp: 'Top-level deterministic claim bina I/O-callback experiment kaise banaoge?',
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
    question: 'forEach/map/filter/reduce ka difference kya hai?',
    answer:
      "- forEach visited items par callback chala kar undefined\n- map transformed array\n- filter matching items\n- reduce accumulated result deta hai.\n- Examples input array mutate nahi karte, lekin callback referenced objects mutate kar sakta hai.\n- Explicit initial accumulator se empty reduce defined rahega.\n- Async forEach callback promises ignore hoti hain\n- sequence ke liye for...of, concurrent wait ke liye map/combinator lo.\n\n```js\nconst minutes = [5, 10, 15];\nconsole.log(minutes.map(n => n * 2)); // [10,20,30]\nconsole.log(minutes.filter(n => n >= 10)); // [10,15]\nconsole.log(minutes.reduce((sum, n) => sum + n, 0)); // 30\nconsole.log(minutes.forEach(n => n + 1)); // undefined\n```",
    followUp: 'Async forEach all-callback completion promise kyun nahi return karta?',
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
    question: 'Object properties count aur values-only print kaise?',
    answer:
      "- Ordinary object ki universal length nahi.\n- Object.keys own enumerable string keys\n- values unki values\n- entries pairs deta hai.\n- Inherited/symbol properties exclude hoti hain.\n- Reflect.ownKeys all own strings/symbols, non-enumerable bhi include karta hai.\n- Pehle property category define karo.\n- for...in inherited enumerable strings visit kar sakta hai, isliye Object.values se result different ho sakta hai.\n\n```js\nconst progress = {java: 3, react: 5};\nconsole.log(Object.keys(progress).length); // 2\nfor (const value of Object.values(progress)) console.log(value); // 3, 5\n```",
    followUp: 'for...in Object.values se extra values kyun de sakta hai?',
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
    question: 'Array ka typeof kya hai; reliable detection kaise?',
    answer:
      "- Array object hai, isliye typeof []='object'.\n- Array.isArray actual array detect aur cross-realm iframe arrays bhi support karta hai\n- instanceof Array particular realm constructor se tied hai.\n- Array-like aur typed arrays separate categories hain.\n- Indexed properties/length enough proof nahi.\n- Array.from iterable/array-like ko actual array convert karne mein useful hai jab isArray false ho.\n\n```js\nconsole.log(typeof []); // 'object'\nconsole.log(Array.isArray([])); // true\nconsole.log(Array.isArray({0: 'a', length: 1})); // false\nconsole.log(Array.isArray(new Uint8Array(2))); // false\n```",
    followUp: 'Array.isArray false ho tab Array.from kab useful hai?',
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
    question: 'Ten ES2015 features examples se samjhao; later features mix mat karo.',
    answer:
      "- ES6=ES2015.\n- Ten features: block bindings, arrows, templates, destructuring, defaults, rest parameters, iterable spread, classes, modules, promises.\n- Neeche code dry-run karo.\n- Module feature ke liye separate files mein `export const goal=3` aur `import {goal} from './goal.js'` lo.\n- Async/await aur object spread later additions hain.\n\n- 1.\n- let reassign ho sakta, const nahi\n- dono block scope/TDZ follow karte hain.\n- 2.\n- Arrow lexical this rakhti hai, constructor nahi banti.\n- 3.\n- Template expressions/newlines allow karti hai, HTML sanitize nahi.\n- 4.\n- Destructuring named/positional values nikalti hai\n- missing ke defaults explicit hon.\n- 5.\n- Parameter default omitted/undefined par, null par nahi.\n- 6.\n- Rest remaining arguments ka actual array banata hai.\n- 7.\n- Iterable spread calls/arrays expand\n- nested references shared rehti hain.\n- 8.\n- Class constructor/prototype methods organize karti hai\n- method bodies strict hain.\n- 9.\n- Modules scope/dependencies aur live exported bindings dete hain.\n- 10.\n- Promise one outcome compose karti hai\n- CPU ko another thread nahi bhejti.\n\n```js\nlet read = 0; const target = 3; // block-scoped bindings\nconst double = n => n * 2; // lexical-this arrow\nconst label = `Read ${read}/${target}`; // interpolation\nconst [first] = [8, 9]; // destructuring\nconst greet = (name = 'Learner') => name; // default\nconst count = (...items) => items.length; // rest\nconst copy = [...[1, 2]]; // iterable spread\nclass Lesson { constructor(id) { this.id = id; } }\nconst ready = Promise.resolve('ready');\n```",
    followUp: 'Three features ki ek-ek limitation/surprise batao.',
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
      'Function definition, declaration, expression, anonymous aur higher-order ka difference?',
    answer:
      "- Definition parameters/behavior likhti hai\n- call arguments ke saath execute karti hai.\n- Declaration named binding banati hai\n- expression function value produce karti hai, named ya anonymous.\n- Higher-order function functions accept/return karti hai.\n- square pass karna function deta hai\n- square(4) pass karna result deta hai.\n- Callback role hai, separate syntax nahi.\n- Named expression inner name se recursion/debugging help karti hai.\n\n```js\nfunction square(n) { return n * n; } // declaration\nconst triple = function (n) { return n * 3; }; // anonymous expression\nfunction transform(value, operation) { return operation(value); }\nconsole.log(transform(4, square)); // 16\nconsole.log(transform(4, triple)); // 12\n```",
    followUp: 'Named expression recursion/debugging help karke inner name local kaise rakhti hai?',
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
    question: 'IIFE kya hai aur ab bhi kab useful hai?',
    answer:
      "- IIFE function expression ko turant call karti hai.\n- Temporary bindings isolate ya top-level await unavailable context mein async entry bana sakti hai.\n- Modules/block scope many old global-variable problems solve karte hain.\n- Example minutes local hai.\n- Async IIFE promise return karti hai\n- rejection handle karna zaroori hai.\n- Previous expression ke saath accidentally join na ho, semicolon boundary rakho.\n\n```js\nconst initialTotal = (() => {\n  const minutes = [5, 10];\n  return minutes.reduce((sum, n) => sum + n, 0);\n})();\nconsole.log(initialTotal); // 15\n```",
    followUp: 'Previous expression ke baad IIFE ko semicolon boundary kyun chahiye ho sakti hai?',
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
    question: 'Memoization implement karo aur invalid cache cases samjhao.',
    answer:
      "- Memoization same input ka previous result reuse karti hai.\n- Key mein all result-affecting inputs aur freshness policy honi chahiye.\n- Example single-number function ka hai, universal memoizer nahi.\n- Map.has cached zero/undefined distinguish karta hai.\n- Unbounded inputs memory retain\n- mutable external dependency stale result la sakti hai.\n- User-specific async work mein identity, rejected-result policy aur eviction explicitly design karo.\n\n```js\nfunction memoizeNumber(fn) {\n  const cache = new Map();\n  return n => {\n    if (!cache.has(n)) cache.set(n, fn(n));\n    return cache.get(n);\n  };\n}\nconst square = memoizeNumber(n => n * n);\nconsole.log(square(4), square(4)); // 16, 16\n```",
    followUp: 'User-specific async query ke keys/eviction kaise design karoge?',
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
    question: 'call/apply/bind kab use karoge?',
    answer:
      "- call regular function ko explicit this/separate args se invoke karta hai.\n- apply same receiver plus array-like args leta hai.\n- bind new function with fixed receiver/optional leading args return karta hai\n- immediately invoke nahi karta.\n- Arrow ka lexical this inse replace nahi hota.\n- Removal ke liye bound callback store karo\n- two bind calls two different identities banati hain.\n\n```js\nfunction total(extra) { return this.minutes + extra; }\nconst learner = {minutes: 20};\nconsole.log(total.call(learner, 5)); // 25\nconsole.log(total.apply(learner, [7])); // 27\nconst later = total.bind(learner, 10);\nconsole.log(later()); // 30\n```",
    followUp: 'Two independent bind calls ke callbacks strictly equal kyun nahi?',
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
    question: 'Objects create karne ke three ways aur prototype methods ka role?',
    answer:
      "- Object literal direct record\n- Object.create chosen prototype\n- constructor/class shared prototype behavior ke instances banate hain.\n- Yeh three teaching groups hain, all APIs ki fixed count nahi.\n- Object.prototype ka toString/isPrototypeOf inherited behavior\n- Object.keys/create/hasOwn static methods hain.\n- Null-prototype object inherited methods nahi rakhta.\n- Isliye obj.hasOwnProperty callable assume karne ke bajay Object.hasOwn safer hai.\n\n```js\nconst literal = {title: 'Arrays'};\nconst behavior = {label() { return this.title; }};\nconst inherited = Object.create(behavior); inherited.title = 'Trees';\nclass Lesson { constructor(title) { this.title = title; } label() { return this.title; } }\nconsole.log(inherited.label(), new Lesson('Graphs').label()); // Trees Graphs\n```",
    followUp: 'obj.hasOwnProperty callable assume karne se Object.hasOwn safer kyun hai?',
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
    question: 'Method chaining versus prototype chain kya hai?',
    answer:
      "- Method chaining previous method ke result par next method call karti hai.\n- Mutable fluent API often this return, immutable version new value return karti hai.\n- Prototype chain inherited property lookup ka mechanism hai, chaining se alag.\n- Example intentionally mutable hai\n- validation/mutation contract document karo.\n- Fresh-return version aliases ka existing object mutate nahi karega, caller ko result retain karna hoga.\n\n```js\nconst progress = {\n  minutes: 0,\n  add(n) { this.minutes += n; return this; },\n  reset() { this.minutes = 0; return this; }\n};\nconsole.log(progress.add(5).add(10).minutes); // 15\n```",
    followUp: 'add fresh value return kare toh aliasing kya badlegi?',
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
    question: 'JS object passing mein mutation/reassignment ka difference dikhao.',
    answer:
      "- JavaScript values pass karta hai.\n- Object value object ko refer karti hai, toh caller/callee same mutable object access kar sakte hain.\n- Parameter reassign caller variable reassign nahi karta.\n- Is difference bina pass-by-reference bolna misleading hai.\n- Replacement chahiye toh new object return aur call site par assign karo.\n- Primitive number reassign sirf local parameter badlega.\n\n```js\nfunction revise(note) {\n  note.done = true;\n  note = {done: false};\n}\nconst original = {done: false};\nrevise(original);\nconsole.log(original.done); // true\n```",
    followUp: 'Object ki jagah number pass karke parameter reassign ho toh?',
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
    question: 'null, undefined, NaN aur value types ka difference?',
    answer:
      "- Types values ke hain\n- variable later different type hold kar sakta hai.\n- Primitives undefined,null,boolean,number,bigint,string,symbol\n- objects doosri main category.\n- undefined often missing/unassigned-to-value\n- null explicit absence convention.\n- NaN invalid numeric result ka number value hai, own type nahi.\n- Number.isNaN noncoercing check deta hai.\n- null==undefined special comparison unki identical identity/type prove nahi karti.\n\n```js\nconsole.log(null === undefined); // false\nconsole.log(null == undefined); // true\nconsole.log(typeof null); // 'object', historical behavior\nconsole.log(typeof NaN); // 'number'\nconsole.log(Number.isNaN(Number('notes'))); // true\n```",
    followUp: 'NaN===NaN false lekin Object.is(NaN,NaN) true kyun?',
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
    question: 'Escape sequences kya hain aur kyun use hoti hain?',
    answer:
      "- Escapes quotes,newline,tab,backslash jaise characters source mein represent karte hain.\n- Source representation aur actual characters alag layers hain.\n- Normal string mein backslash+n newline, escaped backslash+n literal slash-n deta hai.\n- Template actual line breaks allow karti hai.\n- JSON ke andar JS ya regex embed ho toh har layer ka escaping separately samjho\n- printed output se verify karo.\n\n```js\nconst quoted = 'It\\'s time to study';\nconst folder = 'C:\\\\notes';\nconsole.log(quoted); // It's time to study\nconsole.log(folder); // C:\\notes\n```",
    followUp: 'JSON, JS source aur regex ke escaping layers alag kyun samajhne hain?',
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
    question: 'break aur continue ka difference?',
    answer:
      "- break nearest applicable loop/switch exit\n- continue current iteration ka rest skip karke next iteration step par jaata hai.\n- Dono containing function return nahi karte.\n- Nested loops ka unlabeled break sirf nearest loop exit karta hai.\n- while mein continue terminating update skip kare toh infinite loop ho sakta hai.\n- Entire function processing stop karni ho toh return use karo.\n\n```js\nfor (const n of [1, 2, 3, 4, 5]) {\n  if (n === 2) continue;\n  if (n === 4) break;\n  console.log(n);\n}\n// 1, 3\n```",
    followUp: 'Function return karke whole processing kaise stop karoge?',
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
    question: 'Capture, bubble, preventDefault, stopPropagation ka difference?',
    answer:
      "- Capture ancestors se target ki taraf\n- bubbling target se ancestors ki taraf for bubbling events.\n- stopPropagation next propagation rokti hai, default navigation nahi.\n- preventDefault cancelable browser action rokti hai, propagation nahi\n- passive listener cancel nahi kar sakta.\n- stopImmediatePropagation same target ke later listeners bhi rokta hai.\n- Example ancestor capture listener bubble se pehle chalega.\n\n```js\n// Browser excerpt: list is an existing element containing buttons.\nlist.addEventListener('click', event => {\n  const button = event.target.closest('button[data-id]');\n  if (button && list.contains(button)) console.log(button.dataset.id);\n});\nlist.addEventListener('click', () => console.log('capture'), {capture: true});\n```",
    followUp: 'Link propagation stop karne se navigation necessarily kyun nahi rukti?',
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
    question: 'localStorage/sessionStorage/IndexedDB/cookies/memory kab choose karoge?',
    answer:
      "- localStorage synchronous origin-scoped strings, generally sessions ke across\n- sessionStorage origin+tab page-session scoped, reload survive.\n- IndexedDB async structured/large data\n- memory temporary state.\n- Cookies matching HTTP requests ke saath ja sakti hain, server sessions mein useful.\n- Storage/quota failure handle karo.\n- Session cookie ke HttpOnly/Secure/SameSite/expiry/CSRF rules define karo.\n- JS-readable storage injected scripts se exposed\n- persistence deletion/eviction guarantee nahi.\n\n```js\nlocalStorage.setItem('theme', 'dark');\nsessionStorage.setItem('draftTitle', 'Closures');\n```",
    followUp: 'Session ID ko convenience ke liye localStorage mein kyun na rakho?',
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
    question: 'Web Workers kya hain aur page se kaise communicate karte hain?',
    answer:
      "- Worker another execution context mein scripts chalata hai, CPU-heavy work main thread monopolize nahi karta.\n- Direct page DOM access nahi\n- structured-cloned/transferable messages use karo.\n- Example result 8 hai.\n- Startup/transfer cost, errors, stale results aur termination account karo.\n- Tiny task worker mein automatically faster nahi.\n- ArrayBuffer transfer ownership deta hai\n- sender ka usable buffer state badal sakta hai.\n\n```js\n// main.js, served over HTTP(S)\nconst worker = new Worker('./worker.js');\nworker.onmessage = event => console.log(event.data);\nworker.postMessage([3, 5]);\n// worker.js, a separate file\nself.onmessage = event => self.postMessage(event.data.reduce((a, b) => a + b, 0));\n```",
    followUp: 'Large ArrayBuffer clone ke bajay transfer kab better hai?',
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
    question: 'Axios, fetch ya Node HTTP client kab choose karoge?',
    answer:
      "- Axios interceptors/configured instances/transforms aur default status-based rejection deta hai.\n- Fetch browsers/modern Node ka standard API\n- HTTP error par normally fulfill hota hai, response.ok check karo.\n- Node http/https lower-level streams\n- Got jaisi clients apni Node features deti hain.\n- Runtime, cancellation, retry, bundle/team need se choose karo.\n- Popularity universal best proof nahi\n- auth/idempotency tumhe design karni hai.\n\n```js\nasync function loadNotes() {\n  const response = await fetch('/api/notes');\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n```",
    followUp: 'Auth/error policy centralize karke unsafe blind retries kaise avoid karoge?',
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
    question: 'React kya hai; library/framework difference aur vanilla JS ke upar benefit kab?',
    answer:
      "- React UI library hai: props/state se components output describe karte hain, React updates coordinate karta hai.\n- Framework broader routing/data-loading/delivery conventions de sakta hai\n- React uske andar use ho sakta hai.\n- Complex changing UI mein component model helpful, small static page ko little/no React chahiye ho sakta hai.\n- Example component excerpt hai\n- React har manual DOM implementation se inherently faster nahi.\n\n```jsx\nfunction Progress({done, total}) {\n  return <p>{done} of {total} lessons</p>;\n}\n```",
    followUp: 'Production app ke liye UI library ke alawa kaunse decisions chahiye?',
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
    question: 'JSX kaise run hota hai, className kyun, Babel ka role kya?',
    answer:
      "- JSX element-tree syntax hai\n- build transform React-runtime-compatible JS calls banata hai.\n- Browser raw JSX generally execute nahi karta.\n- Babel possible transformer hai, React itself nahi\n- other compilers bhi JSX transform karte hain.\n- Transpilation missing runtime APIs ka universal polyfill nahi.\n- className React DOM ka conventional CSS-class prop hai.\n- Braces expressions\n- normal strings escape hoti hain, dangerouslySetInnerHTML separate trust boundary hai.\n\n```jsx\nconst title = 'Closures';\nconst heading = <h2 className=\"lesson-title\">{title}</h2>;\n```",
    followUp: 'Syntax transformation aur missing runtime API provide karna kaise alag hain?',
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
    question: 'Props/state ka difference aur children kya hai?',
    answer:
      "- Props parent inputs\n- state component-owned changing data hai jiske updates render schedule kar sakte hain.\n- Child received object mutate karke parent update na kare.\n- children nested content prop hai, reusable shells ke liye useful.\n- Panel outer structure own karta, caller content supply.\n- Children one element ya array tak limited nahi, various React nodes ho sakte hain.\n- Distinct actions slot clearer contract de sakta hai.\n\n```jsx\nfunction Panel({title, children}) {\n  return <section><h2>{title}</h2>{children}</section>;\n}\nfunction App() {\n  return <Panel title=\"Practice\"><p>Explain one closure.</p></Panel>;\n}\n```",
    followUp: 'Saara content children ke bajay named actions slot kab clearer hai?',
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
    question: 'Fragments kya hain aur kaunsa DOM element add karte hain?',
    answer:
      "- Fragment siblings group karta hai bina extra DOM wrapper.\n- Extra div flex/grid layout ya table/list structure badal sakta hai.\n- Short fragment syntax key nahi leti\n- keyed groups ke liye explicit Fragment use karo.\n- Example DOM dl/dt/dd hai, fragment node nahi.\n- Layout box, semantics ya event/attribute target required ho toh actual element appropriate hai.\n\n```jsx\nimport {Fragment} from 'react';\nfunction Glossary({items}) {\n  return <dl>{items.map(item => <Fragment key={item.id}><dt>{item.term}</dt><dd>{item.meaning}</dd></Fragment>)}</dl>;\n}\n```",
    followUp: 'div→fragment se text same rehkar flex layout kyun badal sakti hai?',
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
    question: 'useState kya accept/return karta hai; normal variable ke bajay state kab?',
    answer:
      "- useState initial value/initializer leta hai aur current-render state plus setter ki two-item array deta hai.\n- Normal locals render par recreate aur mutation se render request nahi hoti.\n- Output-affecting changing data state mein rakho\n- cheap derived values duplicate store mat karo.\n- Initializer/updater pure hon.\n- Persistent mutable non-render-trigger data ke liye ref\n- changed initial argument existing state reset nahi karta.\n\n```jsx\nimport {useState} from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const doubled = count * 2;\n  return <button onClick={() => setCount(n => n + 1)}>{count} / {doubled}</button>;\n}\n```",
    followUp: 'First render ke baad initial argument badalna existing state reset kyun nahi karta?',
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
    question: 'Parent-child aur sibling communication kaise hoti hai?',
    answer:
      "- Parent props down bhejta hai\n- child prop-callback se intent report, parent owned state update karta hai.\n- Siblings closest suitable common ancestor ki lifted state share kar sakte hain.\n- Har sibling ko needed data/actions hi do.\n- Prop drilling unused intermediate layers se passing hai\n- composition/context reduce kar sakte hain.\n- Short path direct props clear hain\n- temporary input unnecessarily global mat karo.\n\n```jsx\nimport {useState} from 'react';\nfunction Editor({value, onChange}) {\n  return <input aria-label=\"Topic\" value={value} onChange={e => onChange(e.target.value)} />;\n}\nfunction Preview({value}) { return <p>{value}</p>; }\nfunction Workspace() {\n  const [topic, setTopic] = useState('Arrays');\n  return <><Editor value={topic} onChange={setTopic}/><Preview value={topic}/></>;\n}\n```",
    followUp: 'Temporary input ko unnecessarily global store mein lift karne se kaise bachoge?',
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
    question: 'DOM, virtual DOM, reconciliation, render/commit kya; return kab evaluate hota hai?',
    answer:
      "- DOM live browser document hai.\n- React element descriptions ko virtual DOM bolte hain\n- reconciliation type/position/keys se work decide karti hai.\n- Render mein functions/returns evaluate\n- commit mein selected host-DOM changes apply.\n- Component call DOM mutation ya commit guarantee nahi.\n- Example count1→2 par label Started same.\n- Render repeat/interrupt/abandon ho sakta hai, isliye network writes/purity matters.\n\n```jsx\nfunction Status({count}) {\n  const label = count > 0 ? 'Started' : 'New';\n  return <p>{label}</p>;\n}\n```",
    followUp: 'Sirf one commit dikhe tab bhi component-body network write unsafe kyun hai?',
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
    question: 'Function component rerender kab; mount/update/unmount kya?',
    answer:
      "- Own state, normally parent render, consumed context aur subscribed external store work trigger kar sakte hain.\n- Props parent's new render se aati hain, independently child mutate nahi karti.\n- Equal-state bailout/memoization skip possible.\n- Mount identity create, update preserve/replace, unmount remove/cleanup karta hai.\n- Example old committed id cleanup then new setup\n- historical every class lifecycle ka exact replacement nahi.\n\n```jsx\nimport {useEffect} from 'react';\nfunction Room({id}) {\n  useEffect(() => {\n    console.log('setup', id);\n    return () => console.log('cleanup', id);\n  }, [id]);\n  return <p>Room {id}</p>;\n}\n```",
    followUp: 'Dev Strict Mode extra setup/cleanup bina visible unmount kyun dikha sakta hai?',
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
    question: 'Hooks kya hain, ordinary functions se difference aur rules kya?',
    answer:
      "- Hooks React components/custom hooks ko state/effects features dete hain.\n- Ordinary useState/useEffect top-level call karo, loops/branches/handlers/utilities mein nahi.\n- Stable call order React ko state slots associate karne deta hai.\n- Conditional return se pehle hook call ho.\n- Newer use API documented conditional/loop exceptions rakhti hai\n- useState/useEffect par woh exception apply nahi.\n- Naam alone hook rules safe nahi banata.\n\n```jsx\nfunction Summary({visible}) {\n  const [count, setCount] = useState(0); // useState imported from React\n  if (!visible) return null;\n  return <button onClick={() => setCount(n => n + 1)}>{count}</button>;\n}\n```",
    followUp: 'Utility ka naam useSomething rakhna conditional hook calls safe kyun nahi banata?',
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
    question: 'useEffect ke two arguments, return aur cleanup timing kya?',
    answer:
      "- First argument synchronization setup hai, optional cleanup return kar sakta hai.\n- Second reactive dependency list: omit toh relevant commits ke baad\n- [] no reactive deps\n- listed values Object.is compare.\n- Changed deps par old cleanup/new setup, unmount par cleanup.\n- Effects client par\n- ordinary derived data ke liye nahi.\n- Callback async mat banao: promise cleanup nahi.\n- Inner async work ka cancellation/error contract define karo\n- paint timing unconditional nahi.\n\n```jsx\nuseEffect(() => {\n  const onResize = () => console.log(window.innerWidth);\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []); // useEffect imported; inside a component/custom hook\n```",
    followUp: 'roomId-dependent subscription dependency-free listener se kaise alag hogi?',
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
    question: 'React styling ke common ways aur tradeoffs kya hain?',
    answer:
      "- Options plain CSS/className, scoped CSS Modules, inline dynamic styles, utility classes, CSS-in-JS hain.\n- Scoping/runtime/extraction/framework costs vary\n- React ek compulsory method nahi deta.\n- Example ko application meter stylesheet chahiye.\n- Inline keys camelCase\n- :hover/media selectors directly express nahi hote.\n- Dynamic values validate karo\n- many dynamic declarations ke liye CSS custom properties simpler ho sakti hain.\n\n```jsx\nfunction Meter({percent}) {\n  const bounded = Math.max(0, Math.min(100, percent));\n  return <div className=\"meter\"><span style={{display: 'block', width: `${bounded}%`}}>Progress</span></div>;\n}\n```",
    followUp: 'Many inline declarations regenerate karne se CSS custom property kab cleaner hai?',
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
    question: 'HOC kya hai aur custom hook se kaise compare karoge?',
    answer:
      "- HOC component accept karke wrapper component return karta hai, rendering wrap/props inject kar sakta hai.\n- Custom hook wrapper bina stateful logic share karta hai.\n- Dono ka public contract clear ho.\n- Wrapper other component ke render ke bahar create karo taaki identity stable rahe.\n- Example every ref/static property automatically forward promise nahi karta.\n- Simple structure reuse mein children composition enough ho sakti hai.\n\n```jsx\nfunction withLoading(View) {\n  return function LoadingView({loading, ...props}) {\n    return loading ? <p role=\"status\">Loading…</p> : <View {...props}/>;\n  };\n}\nfunction Lessons({items}) { return <ul>{items.map(x => <li key={x.id}>{x.title}</li>)}</ul>; }\nconst LoadableLessons = withLoading(Lessons);\n```",
    followUp: 'Is HOC ke bajay children composition kab simpler hai?',
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
    question: 'React Router kya deta hai; sibling routes data kaise share karein?',
    answer:
      "- Router URLs ko UI se map aur navigation coordinate karta hai: addresses, nested layouts, params/history.\n- General shared-state replacement nahi.\n- Shareable filters URL, shared client state layout/context, remote data server cache mein.\n- Already wrapped app ke andar another BrowserRouter mat add karo.\n- Navigation state contextual data de sakti hai\n- direct link par essential data independently load hona chahiye.\n\n```jsx\n// Declarative React Router app excerpt\nimport {BrowserRouter, Routes, Route, Link, useParams} from 'react-router-dom';\nfunction Lesson() { const {id} = useParams(); return <p>Lesson {id}</p>; }\nfunction App() { return <BrowserRouter><Link to=\"/lessons/42\">Open</Link><Routes><Route path=\"/lessons/:id\" element={<Lesson/>}/></Routes></BrowserRouter>; }\n```",
    followUp: 'Back par URL filter aur unsaved draft ka behavior kaise alag hai?',
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
    question: 'Redux/Flux kya hain; Redux always better ya React-only hai?',
    answer:
      "- Flux unidirectional data flow hai.\n- Redux store/action/reducer se next state compute karta hai\n- React ke bina bhi use ho sakta hai.\n- Context value distribute\n- Redux update model, subscriptions/selectors, middleware/tooling add karta hai.\n- Neither universally better.\n- Temporary state local\n- coordination/tooling justify kare tab shared store.\n- Server cache related but separate problem solve karti hai.\n- New Redux code ka normal starting point Toolkit hai.",
    followUp: 'Context/server-cache wali app mein Redux ko kaunsi concrete need justify karegi?',
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
    question: 'Redux action/reducer kya; initial state aur transition dikhao.',
    answer:
      "- Action type aur usually payload se event describe karta hai.\n- Reducer previous state/action lekar next state return karta hai.\n- Initialization ke undefined input par initial state use hoti hai\n- unknown action existing state return kare.\n- Plain reducer immutable copying dikhata hai.\n- Toolkit createSlice Immer draft mutation syntax allow karta hai\n- ordinary Redux object mutate karna same cheez nahi.\n\n```js\nconst initialState = {minutes: 0};\nfunction reducer(state = initialState, action) {\n  switch (action.type) {\n    case 'study/added': return {...state, minutes: state.minutes + action.payload};\n    default: return state;\n  }\n}\nconsole.log(reducer(undefined, {type: 'study/added', payload: 5})); // {minutes:5}\n```",
    followUp: 'Unknown action existing state return kyun kare, undefined kyun nahi?',
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
    question: 'React/Redux data flow aur side effects ka owner kya hai?',
    answer:
      "- Interaction→dispatch→middleware→reducer→store subscribers→selectors→React UI flow hai.\n- Reducers fetch/timers/external mutation/random IDs/timestamps generate na karein.\n- Event logic/thunks/listener middleware effects own karke results action mein bhejein.\n- Replay deterministic chahiye toh timestamp dispatch se pehle action payload mein ho.\n- State/actions default serializable rakho.\n- Toolkit drafts bhi pure reducer rule follow karte hain\n- middleware dispatch wrap karta hai.",
    followUp: 'Replay ke liye timestamp dispatch se pehle action mein kyun hona chahiye?',
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
    question: 'Redux store methods aur unke uses kya hain?',
    answer:
      "- getState current tree read\n- dispatch action pipeline mein bhejta\n- subscribe listener register karke unsubscribe return karta hai.\n- Listener ke andar getState se latest state lo\n- callback diff payload nahi deta.\n- replaceReducer root swap dynamic features/dev tooling mein useful.\n- Observable interop also exists, normal UI mein rarely chahiye.\n- Returned state mutate mat karo\n- integration destroy par unsubscribe karo.\n\n```js\n// Application excerpt: store was created with configureStore.\nconst unsubscribe = store.subscribe(() => console.log(store.getState()));\nstore.dispatch({type: 'study/added', payload: 5});\nunsubscribe();\n// store.replaceReducer(nextRootReducer) when deliberately changing reducer composition\n```",
    followUp: 'Integration destroy par subscription remove kyun karein?',
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
    question: 'React Redux connect versus modern hooks kaise compare karoge?',
    answer:
      "- connect HOC wrapper ko store subscribe karke selected state/dispatch props map karta hai.\n- Function components ke saath bhi valid.\n- New code useSelector/useDispatch prefer kar sakta hai\n- old connect automatically wrong nahi.\n- Example ko compatible store wala Provider ancestor chahiye.\n- Needed data select karo\n- every selector new object return kare toh comparison/render frequency affect hogi.\n\n```jsx\nimport {connect} from 'react-redux';\nfunction Total({minutes, add}) { return <button onClick={add}>{minutes}</button>; }\nconst ConnectedTotal = connect(\n  state => ({minutes: state.minutes}),\n  dispatch => ({add: () => dispatch({type:'study/added', payload:5})})\n)(Total);\n```",
    followUp: 'Har selector call fresh object return kare toh rendering kya hogi?',
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
    question: 'Component ke bahar Redux state safely kaise access karoge?',
    answer:
      "- Utility/integration ko store explicitly inject karke getState/dispatch use karao\n- React hooks arbitrary functions mein call nahi ho sakte.\n- Dependency visible/testable rehti hai.\n- SSR mein global imported singleton store requests ka user state leak kar sakta hai.\n- Once-read value snapshot hai\n- continuous observation chahiye tab subscribe aur cleanup own karo.\n- Request-specific ownership preserve karo.\n\n```js\nfunction makeStudyService(store) {\n  return {\n    snapshot: () => store.getState().minutes,\n    add: minutes => store.dispatch({type:'study/added', payload:minutes})\n  };\n}\n```",
    followUp: 'SSR mein module singleton store users ka data leak kyun kar sakta hai?',
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
    question: 'Redux middleware example do; reducer mein async work mat rakho.',
    answer:
      "- Middleware dispatch ke around compose hokar log/transform/delay/handle karti hai.\n- next next middleware/base dispatch, store.dispatch pipeline dobara enter karta hai.\n- Same action unconditional redispatch recursion bana sakta hai.\n- Example minutes reducer assume karta hai.\n- Dispatch return preserve, secrets log mat karo.\n- Thunk async function actions handle kar sakta hai\n- reducers sync/pure rehte hain.\n\n```js\nconst audit = store => next => action => {\n  const before = store.getState().minutes;\n  const result = next(action);\n  const after = store.getState().minutes;\n  console.log({type: action.type, before, after});\n  return result;\n};\n// configureStore({reducer, middleware: getDefault => getDefault().concat(audit)})\n```",
    followUp: 'Same action middleware mein unconditional dispatch se infinite recursion kyun?',
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
    question: 'Constructor DI, component scan aur Bean definition ka difference?',
    answer:
      "- DI collaborator supply karti hai, hidden construction nahi.\n- Component scan configured stereotype classes discover\n- Bean method explicit config se object banata hai.\n- Constructor required deps visible aur final fields possible banata hai.\n- Same dependency ki multiple beans hon toh qualifier/primary deliberately choose.\n- Singleton shared hai\n- injection unrelated mutable fields thread-safe nahi banati.\n- Manual constructor se service unit-test ho sakti hai.\n\n```java\n// Spring application excerpt; interfaces/configuration supplied by the app.\n@Service\nclass LessonService {\n  private final LessonRepository repository;\n  LessonService(LessonRepository repository) { this.repository = repository; }\n}\n```",
    followUp: 'Whole Spring context bina LessonService test kaise karoge?',
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
    question: 'Boot auto-configuration kya karti hai; unexpected bean debug kaise?',
    answer:
      "- Boot classpath, properties aur existing beans ki conditions se defaults contribute karta hai\n- entire business design infer nahi karta.\n- Unexpected bean mein condition report, profiles, property sources, definitions inspect karo.\n- Custom bean specified conditions par auto-config backoff kara sakti hai.\n- Small reproduction aur actual effective config dekho\n- every starter always same objects install karta hai assume mat karo.",
    followUp: 'Test profile production config issue hide kaise kar sakti hai?',
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
    question: 'Spring REST input validate aur consistent errors kaise doge?',
    answer:
      "- Boundary DTO validate, service business invariant aur DB concurrent constraints enforce kare.\n- Valid request body par Jakarta validation trigger kar sakta hai\n- advice stable safe errors map kare.\n- Negative/zero input, malformed JSON aur business conflict separately test karo.\n- Status/field-error contract define\n- HTTP200 error-string client reasoning mushkil banata hai.\n- DTO validation uniqueness/authorization ka replacement nahi.\n\n```java\n// Spring MVC excerpt with validation dependency and imports.\nrecord AddMinutes(@jakarta.validation.constraints.Positive int minutes) {}\n@PostMapping(\"/minutes\")\nvoid add(@jakarta.validation.Valid @RequestBody AddMinutes request) {\n  service.add(request.minutes());\n}\n```",
    followUp: 'DTO validation pass ke baad bhi DB mein kaunse checks chahiye?',
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
    question: 'JPA N+1 kya hai; pagination tode bina fix kaise?',
    answer:
      "- N parents load karke lazy relations touch karne par 1+N queries aa sakti hain.\n- Actual SQL/count inspect karo.\n- Access pattern se projection, entity graph, fetch join ya batching choose karo.\n- To-many fetch join rows multiply karke pagination complicate karti hai\n- IDs page then controlled fetch useful ho sakta hai.\n- Every relation eager blanket fix overfetch/inefficient plans la sakta hai.",
    followUp: 'Correct page size aur bounded query count ka test kya hoga?',
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
    question: 'Competing updates mein optimistic/pessimistic locks ka difference?',
    answer:
      "- Optimistic version check stale write ko conflict deta hai, silent lost update nahi.\n- Pessimistic DB locks earlier serialize karte hain, wait/deadlock cost ke saath.\n- Contention/invariant se choose karo.\n- Conflict retry safe ho tab fresh read/business reevaluation ke baad karo.\n- Version field external payment effects ya every DB constraint protect nahi karta.\n- Payment method blind retry duplicate charge la sakti hai.\n\n```java\n// JPA entity field excerpt\n@jakarta.persistence.Version\nprivate long version;\n```",
    followUp: 'Optimistic conflict par payment method blindly retry risky kyun?',
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
    question: 'Unit, MVC slice, repository ya full integration test kab?',
    answer:
      "- Unit ordinary domain logic isolate\n- MVC slice mapping/validation/serialization/controller\n- repository persistence contracts\n- full integration combined wiring/boundaries at more cost check karta hai.\n- SQL dialect/locks ke liye representative DB lo.\n- Scope risk se choose karo, sabko largest context mat banao.\n- Rollback/concurrent inventory real transactions aur concurrent callers se test karo, always-success mocks se nahi.",
    followUp: 'In-memory DB production SQL/isolation bug kaise miss karegi?',
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
    question: 'Comparable/Comparator difference aur deterministic ordering kaise?',
    answer:
      "- Comparable compareTo se natural order\n- Comparator external alternate orders deta hai.\n- Deterministic order ke liye tie-breaker add karo.\n- java.util.Comparator import karo.\n- Minutes subtract compare overflow kar sakta hai\n- comparison helpers lo.\n- Sorted Set/Map ordering-equality se keys identify karte hain\n- same minutes IDs ignore karein toh distinct lessons collapse ho sakte hain.\n- Equals consistency deliberate rakho.\n\n```java\n// Java 17+ excerpt\nrecord Lesson(String id, int minutes) {}\nComparator<Lesson> order = Comparator.comparingInt(Lesson::minutes)\n    .thenComparing(Lesson::id);\n```",
    followUp: 'Same minutes par IDs ignore karne wala TreeSet comparator kya karega?',
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
    question: 'String immutable kyun; StringBuilder kab use karein?',
    answer:
      "- String operations original String mutate nahi karti\n- safe sharing/stable value keys useful hain.\n- Reference variable reassign ho sakti hai.\n- Repeated text assembly one thread mein mutable StringBuilder useful hai.\n- equals content compare karta hai.\n- Har concatenation slow blanket claim mat karo\n- compiler/runtime simple cases optimize karte hain.\n- Shared unsynchronized builder concurrent request text mix/corrupt kar sakta hai.\n\n```java\nString name = \"Java\";\nString upper = name.toUpperCase(java.util.Locale.ROOT);\nStringBuilder summary = new StringBuilder();\nfor (int i = 1; i <= 3; i++) summary.append(i).append(' ');\nSystem.out.println(name); // Java\n```",
    followUp: 'Shared StringBuilder concurrent requests mein unsynchronized kyun unsafe?',
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
    question: 'Overlapping intervals merge kaise; boundary contract kya hai?',
    answer:
      "- Start se intervals sort\n- last merged interval maintain karo.\n- Chosen endpoint rule ke hisaab se overlap ho toh end extend, otherwise append.\n- Closed [1,3]/[3,5] overlap\n- half-open touching policy deliberately define karo.\n- Finite start<=end assume.\n- Example input mutate nahi karta\n- O(n log n) time/O(n) storage.\n- Empty, nested, touching aur disjoint cases test karo.\n\n```js\nfunction mergeClosed(intervals) {\n  const sorted = intervals.map(x => [...x]).sort((a,b) => a[0]-b[0]);\n  const result = [];\n  for (const [start,end] of sorted) {\n    const last = result.at(-1);\n    if (last && start <= last[1]) last[1] = Math.max(last[1], end);\n    else result.push([start,end]);\n  }\n  return result;\n}\n```",
    followUp: 'Half-open touching ranges separate hon toh kya badlega?',
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
    question: 'Prefix frequencies negative values ke target-sum subarrays kaise count karti hain?',
    answer:
      "- Current prefix s aur earlier prefix s-target ka difference target subarray deta hai.\n- Same prefix multiple baar ho sakta hai, frequencies rakho.\n- Initial zero frequency one empty-prefix start represent karti hai.\n- Matches current prefix insert se pehle count karo, warna zero-target empty subarray count ho sakta hai.\n- Normal hashing par expected O(n) time/space\n- Number exact-range limits respect karo.\n\n```js\nfunction countTarget(nums, target) {\n  const seen = new Map([[0,1]]);\n  let prefix = 0, count = 0;\n  for (const n of nums) {\n    prefix += n;\n    count += seen.get(prefix-target) ?? 0;\n    seen.set(prefix, (seen.get(prefix) ?? 0)+1);\n  }\n  return count;\n}\nconsole.log(countTarget([1,-1,1], 1)); // 3\n```",
    followUp: 'Initial prefix zero ki count one kyun?',
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
    question: 'Prefix search mein hash set ke bajay trie kab?',
    answer:
      "- Trie common-prefix paths share karta hai\n- characters walk karke prefix locate, phir descendants enumerate.\n- Hash set exact membership mein good, prefix organization direct nahi deta.\n- Length L par O(L) character steps, lekin node/map memory overhead large ho sakta hai.\n- Unicode normalization/case/bounded suggestions define karo.\n- Tiny static set mein sorted array+binary search simpler/compact ho sakta hai.",
    followUp: 'Har descendant traverse bina top five completions kaise?',
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
    question: 'Expected O(1) LRU get/put design karo; invariants kya?',
    answer:
      "- Map key→node aur doubly linked list MRU→LRU order combine karo.\n- Get hit front move\n- put existing update/move ya new insert\n- overflow tail dono structures se remove.\n- Every map entry exactly one live node, map/list sizes equal.\n- Sentinels empty/single cases simplify.\n- O(capacity) space\n- zero capacity, update-without-growth, repeated hit aur read-after-eviction order test karo.",
    followUp: 'Singly linked list mein arbitrary hit promote karna harder kyun?',
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
    question: 'Dijkstra heap stale entries kyun rakhta hai; handle kaise?',
    answer:
      "- Lazy Dijkstra improve par new distance entry push karta hai, old heap key decrease nahi.\n- Pop distance current best se different ho toh stale skip.\n- Nonnegative weights mein appropriate minimal current entry finalize karo.\n- A→B10, A→C1, C→B1 par B10 stale, best2.\n- Duplicate entries time/memory mein count karo\n- heap mein max one per vertex claim mat karo.",
    followUp: 'Parallel edges/zero weights test aur negatives ka separate algorithm kyun?',
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
    question: 'DP optimal value ke saath chosen solution kaise return kare?',
    answer:
      "- Predecessor/choice ya enough full-table history rakho.\n- 0/1 knapsack backward trace mein skip compare\n- take par capacity ghatao aur previous item row par jao.\n- Compressed array optimum value bachakar simple reconstruction history lose kar sakti hai.\n- Multiple optima ka tie-break define karo.\n- Chosen items once-only, capacity valid aur summed value reported optimum ke equal verify karo.",
    followUp: 'Recompute/divide-and-conquer reconstruction time-memory tradeoff kab useful hai?',
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
    question: 'Collisions aur abuse controls ke saath URL shortener design karo.',
    answer:
      "- Creation/read rates, alias length/custom aliases/expiry/ownership clarify karo.\n- Unique alias→validated destination store karo.\n- Generated collision atomic uniqueness plus bounded retry\n- custom conflict clear response de.\n- Popular redirects ka cache expiry/invalidation define.\n- Destination change/caching ke hisaab se redirect semantics choose karo.\n- Schemes/abuse limits validate\n- sharding se pehle storage/hot-key traffic estimate karo.",
    followUp: 'Cached destination change permanent redirects ko kaise affect karega?',
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
    question: 'Large resumable upload design karo bina every byte app server se bheje.',
    answer:
      "- Authenticated upload session size/type limits ke saath banao.\n- Suitable object-storage multipart upload, short-lived scoped authorization lo.\n- Part/session IDs persist taaki retries/reconnect resume karein.\n- Publish se pehle completion/integrity verify\n- incomplete private, abandoned expire.\n- Untrusted content product policy se scan/process karo.\n- Signed URLs capabilities hain\n- expiry/access constrain karo.\n- Lost completion response par stable session se status recover karo.",
    followUp: 'Storage complete, API response lost ho toh recovery kaise?',
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
    question: 'Preferences/retries/dedup wali email/push service design karo.',
    answer:
      "- Business event aur channel delivery separate karo.\n- Durable event/outbox, current recipient/channel preferences, bounded queue aur attempt identities/outcomes rakho.\n- Provider limits aur transient retry budgets/backoff respect.\n- Replay dedup distinct legitimate notifications block na kare.\n- Provider acceptance human-read proof nahi.\n- Sensitive body logs avoid\n- unsubscribe policy channel-specific ho.\n- Queued work ke waqt preferences revoke ho toh policy recheck karo.",
    followUp: 'Queued notification ke dauran user opt-out kare toh?',
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
    question: 'RPO/RTO backup/disaster recovery ko kaise shape karte hain?',
    answer:
      "- RPO tolerable data loss time mein, RTO service restore target duration hai.\n- Backup frequency/replication/isolation/procedure failure scenarios ke according choose.\n- Replica backup substitute nahi: corruption/delete replicate ho sakta hai.\n- Restore drills, data/app compatibility aur actual recovery time measure karo\n- successful backup log enough nahi.\n- Credentials, dependencies, DNS/client reconnect include karo.\n- Partition tradeoff target ke saath explicit ho.",
    followUp:
      'Partition mein continuing writes aur zero-data-loss goal conflict kyun kar sakte hain?',
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
    question: 'Invalidation ke baad delayed cache fill stale data wapas kaise la sakti hai?',
    answer:
      "- Reader cache miss par v1 read karta hai.\n- Writer v2 commit/invalidate\n- old reader baad mein v1 cache fill karke stale data resurrect karta hai.\n- TTL tab enough jab freshness bound acceptable ho.\n- Versioned keys, generation check ya coordinated protocol stronger ho sakte hain\n- each race analyze karo.\n- Interleaving draw karke proof do, sirf delete-all-races fix claim nahi.",
    followUp: 'Global lock bina older version ko newer replace karne se kaise rokoge?',
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
    question: 'DB/cache/queue/observability mein tenants isolate kaise karoge?',
    answer:
      "- Trusted auth se tenant identity derive\n- queries, authorization, cache aur jobs tak carry karo.\n- DB constraints/access policies defense-in-depth de sakti hain\n- client tenantId authority nahi.\n- Noisy-neighbor budgets partition aur telemetry data isolated rakho.\n- Cross-tenant reads/writes/cache/export/replayed-job cases test karo.\n- Strong physical isolation operational/cost tradeoff hai\n- requirement se choose karo, URL mein field alone enough nahi.",
    followUp: 'Har URL ka tenantId isolation establish kyun nahi karta?',
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
    question: 'First supplied image ke four flex-direction layouts recreate karo.',
    answer:
      "- Supplied image mein normal LTR assume: top-left column, top-right column-reverse, middle-left row, bottom-left row-reverse.\n- DOM1,2,3,4 same\n- sirf flex-direction badlo.\n- Reverse visual progression badalta hai, reading/tab order nahi.\n- Example div duplicate karke direction classes replace karo.\n- Reverse-row 4,3,2,1 right ki taraf\n- content-sized reverse-column mein top4/bottom1.\n- RTL/writing-mode physical directions change kar sakte hain.\n\n```html\n<div class=\"demo column\"><span>1</span><span>2</span><span>3</span><span>4</span></div>\n<style>\n.demo { display:flex; gap:6px; padding:4px; background:#12bdc1; width:280px; }\n.demo span { display:grid; place-items:center; flex:0 0 36px; width:36px; height:36px; background:#eee; }\n.column { flex-direction:column; }\n.column-reverse { flex-direction:column-reverse; }\n.row { flex-direction:row; }\n.row-reverse { flex-direction:row-reverse; }\n</style>\n```",
    followUp: 'RTL/vertical writing modes row/column ki physical direction kaise badalte hain?',
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
    question: 'Second supplied image ke five wrapped align-content layouts recreate karo.',
    answer:
      "- Top row LTR: flex-start,center,flex-end.\n- Bottom-left space-around\n- bottom-middle space-between.\n- align-content multiple flex lines ko cross axis par distribute karta hai\n- wrap aur extra space chahiye.\n- Single line ke items ka alignment alag concern.\n- Example first line6, next2 items\n- each alignment duplicate karo.\n- Space-between outer lines edges\n- space-around outer distributed space inner ka half, fixed gap separately.\n- Dimensions original implementation choices hain, measured image pixels nahi.\n\n```html\n<div class=\"demo\"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>\n<style>\n.demo { display:flex; flex-wrap:wrap; align-content:flex-start; gap:6px; box-sizing:border-box; width:220px; height:140px; padding:4px; background:#12bdc1; }\n.demo span { flex:0 0 28px; height:28px; display:grid; place-items:center; background:#eee; }\n</style>\n```",
    followUp:
      'Single unwrapped row/content-height container mein align-content no-op kyun lagta hai?',
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
    "\n\n- Hoisting declarations ke observable behavior ka naam hai\n- source code physically upar nahi jaata.\n- var binding declaration execute hone se pehle undefined se initialize hoti hai.\n- let/const initialization tak uninitialized rehte hain\n- us waqt read karoge toh ReferenceError aayega.\n- Function declaration aur function expression ka behavior bhi alag hai.\n\n```js\nconsole.log(score); // undefined\nvar score = 2;\n{ const lesson = {done:false}; lesson.done = true; }\n// Reading a let/const binding before its initialization throws ReferenceError.\n```",
  'iq-js-02':
    "\n\n- Har factory call ki apni binding hai.\n- Pehla closure updated total yaad rakhta hai\n- zero ki frozen copy nahi.\n- Isliye a ki do calls ek total badhati hain, jabki b ka counter alag shuru hota hai.\n\n```js\nfunction makeTracker() {\n  let minutes = 0;\n  return amount => (minutes += amount);\n}\nconst a = makeTracker(), b = makeTracker();\nconsole.log(a(5), a(3), b(2)); // 5, 8, 2\n```",
  'iq-js-03':
    "\n\n- Arrow ka apna arguments binding nahi hota aur use new ke saath call nahi kar sakte.\n- Jab this invocation ke receiver se aana chahiye, regular function use karo.\n- Example mein call normal ka this badalta hai, arrow ka lexical this nahi.\n\n```js\nconst lesson = {\n  minutes: 12,\n  callbacks() {\n    return {normal: function () { return this.minutes; }, arrow: () => this.minutes};\n  }\n};\nconst callbacks = lesson.callbacks();\nconsole.log(callbacks.normal.call({minutes:99})); // 99\nconsole.log(callbacks.arrow.call({minutes:99})); // 12\n```",
  'iq-js-13':
    "\n\n- Generator call se iterator banta hai\n- body turant nahi chalti.\n- next() usse agle yield ya return tak resume karta hai.\n- for...of yielded values leta hai, final return value nahi.\n- Generator apne-aap parallel ya asynchronous execution nahi banata.\n\n```js\nfunction* lessonIds() { yield 10; yield 20; return 30; }\nconst ids = lessonIds();\nconsole.log(ids.next()); // {value:10, done:false}\nconsole.log(ids.next()); // {value:20, done:false}\nconsole.log(ids.next()); // {value:30, done:true}\n```",
  'iq-js-16':
    "\n\n- Pehli call base capture karti hai\n- doosri extra deti hai.\n- Currying multiple arguments ko single-argument steps mein arrange karti hai.\n- Partial application kuch arguments pehle fix karti hai\n- dono terms ko har situation mein same mat bolo.\n\n```js\nconst addMinutes = base => extra => base + extra;\nconst afterMorning = addMinutes(25);\nconsole.log(afterMorning(10)); // 35\n```",
  'iq-lab-03':
    "\n\n- z-index apne stacking context ke andar stack level control karta hai: menus, overlays aur sticky headers mein kaam aata hai.\n- Positioned element ka non-auto z-index, opacity below 1 ya transform naya context bana sakta hai.\n- Flex/grid items bina position ke bhi z-index use kar sakte hain.\n- Neeche panel ka context neighbor se neeche hai, isliye andar menu ka 100 neighbor ke 2 ko globally beat nahi karta.\n- Ancestors inspect karo, consistent layer scale rakho aur zaroorat par suitable portal ya top-layer primitive chuno.\n\n```css\n.panel { position: relative; z-index: 1; }\n.menu { position: absolute; z-index: 100; }\n.neighbor { position: relative; z-index: 2; }\n```",
  'iq-react-05':
    "\n\n- Controlled input ki value aur change handler consistent rakho.\n- Uncontrolled input mein defaultValue sirf initial value deta hai\n- baad ki typing DOM manage karta hai.\n- Ek hi input ko uncontrolled se controlled ya ulta switch mat karo.\n- Example mein pehla state se read hota hai, doosra submit par ref se.\n\n```jsx\nimport {useRef, useState} from 'react';\nfunction Controlled() {\n  const [name, setName] = useState('');\n  return <input aria-label=\"Controlled name\" value={name} onChange={e => setName(e.target.value)}/>;\n}\nfunction Uncontrolled() {\n  const input = useRef(null);\n  return <form onSubmit={e => {e.preventDefault(); console.log(input.current.value);}}>\n    <input aria-label=\"Uncontrolled name\" ref={input} defaultValue=\"Learner\"/><button>Read</button>\n  </form>;\n}\n```",
  'iq-react-06':
    "\n\n- useMemo calculated result cache karta hai\n- useCallback function identity cache karta hai\n- memo equal props par parent ki wajah se hone wala render skip kar sakta hai.\n- Stable identity correctness ka substitute nahi.\n- Relevant workload measure karo: state/context updates aur unstable inputs ab bhi kaam karwa sakte hain.\n- Compiler-enabled build mein manual memoization ki zaroorat kam ho sakti hai.\n\n```jsx\nimport {memo, useCallback, useMemo, useState} from 'react';\nconst Results = memo(function Results({items, onChoose}) {\n  return <ul>{items.map(x => <li key={x.id}><button onClick={() => onChoose(x.id)}>{x.title}</button></li>)}</ul>;\n});\nfunction Search({items, query}) {\n  const [selected, setSelected] = useState(null);\n  const visible = useMemo(() => items.filter(x => x.title.includes(query)), [items, query]);\n  const choose = useCallback(id => setSelected(id), []);\n  return <><Results items={visible} onChoose={choose}/><p>{selected}</p></>;\n}\n```",
  'iq-react-07':
    "\n\n- Consumer nearest matching provider ki value padhta hai.\n- Context value distribute karta hai aur change par consumers update karta hai\n- reducer, middleware ya server-cache policy define nahi karta.\n- Shared-state mechanism add karne se pehle dekho composition se prop drilling kam ho sakti hai kya.\n\n```jsx\nimport {createContext, useContext, useState} from 'react';\nconst ThemeContext = createContext('light');\nfunction Label() { return <p>{useContext(ThemeContext)}</p>; }\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return <ThemeContext.Provider value={theme}><button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Toggle</button><Label/></ThemeContext.Provider>;\n}\n```",
  'iq-react-11':
    "\n\n- Recoverable UI region ke around error boundary rakho, taaki render fail ho toh fallback dikhe.\n- Function-component app mein maintained boundary wrapper ya framework ka route-error feature use kar sakte ho.\n- Ordinary event-handler errors aur unrelated async callbacks ke liye alag handling chahiye\n- boundary har promise rejection nahi pakadti.\n- Reset/retry behavior define karo aur private data expose kiye bina useful diagnostics log karo.",
  'iq-react-13':
    "\n\n- Yeh client hook behavior share karta hai, ek global state cell nahi.\n- Har useOnline call ki apni state/effect hoti hai.\n- navigator.onLine sirf connectivity hint hai, API reachable hone ka proof nahi.\n- Server rendering mein initial snapshot aur hydration ko deliberately consistent rakhna padta hai.\n\n```jsx\nimport {useEffect, useState} from 'react';\nfunction useOnline() {\n  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);\n  useEffect(() => {\n    const sync = () => setOnline(navigator.onLine);\n    sync();\n    window.addEventListener('online', sync); window.addEventListener('offline', sync);\n    return () => {window.removeEventListener('online', sync); window.removeEventListener('offline', sync);};\n  }, []);\n  return online;\n}\n```",
  'iq-mongo-14':
    "\n\n- Failure check: TTL deletion asynchronous hai\n- logical expiry ke baad bhi document kuch time present ho sakta hai.\n- Expired session ko turant reject karne ke liye authorization/query contract mein expiry timestamp check karo.\n- TTL cleanup ke liye hai.\n- Expired document delete hone se pehle boundary test karo\n- clock aur renewal rules define karo.\n- Storage cleanup aur authentication validity ko alag responsibilities samjho.",
  'iq-lab-14':
    "\n\n- Failure check: streaming tabhi buffering limit karti hai jab producer backpressure maane.\n- Pipeline transfer, errors aur cleanup coordinate karti hai.\n- Client disconnect ho toh owned database cursor aur downstream work stop karo.\n- Headers send hone ke baad normal JSON error bhejne se download format corrupt ho sakta hai.\n- Partial download aur retry behavior define karo\n- slow/disconnected client ke saath memory, cursor lifetime aur cancellation observe karo.",
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
