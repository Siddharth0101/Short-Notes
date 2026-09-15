---
id: javascript-browser-foundations
title: HTML CSS and browser rendering essentials
track: javascript
order: 11
level: Foundation
minutes: 28
summary: Semantic HTML meaning aur built-in interaction deta hai; CSS uski layout/style decide karta hai.
tags: html, css, accessibility, browser, layout
---

## Mental model — simple soch

Browser UI teen connected contracts hai: HTML describes meaning, CSS describes presentation, and JavaScript adds behavior. Framework components eventually produce these same browser primitives. Button jaisa dikhne wala div native keyboard behavior automatically nahi leta; React render se har baar browser paint hona bhi zaroori nahi.

> **Core takeaway:** Semantic HTML meaning aur built-in interaction deta hai; CSS uski layout/style decide karta hai.

## The rendering path

Browser HTML se DOM, CSS se style rules banata hai; computed styles resolve, geometry layout, content paint aur suitable layers composite karta hai. Width update layout trigger kar sakti hai; transform often layout avoid karta hai, lekin exact behavior browser/element par depend hai. Actual trace measure karo.

Styles change ke baad geometry read karna synchronous layout force kar sakta hai. Possible ho toh reads pehle batch karo, phir writes. Thousand composited transforms bhi costly ho sakte hain; layer memory aur rasterization resources leti hain.

## A resilient card layout

```html
<main>
  <h1>Study library</h1>
  <form role="search">
    <label for="search">Search chapters</label>
    <input id="search" name="q" type="search">
    <button type="submit">Search</button>
  </form>
  <ul class="cards">
    <li><article><h2>Closures</h2><p>Scope in practice.</p></article></li>
    <li><article><h2>Promises</h2><p>Async outcomes.</p></article></li>
  </ul>
</main>
```

```css
* { box-sizing: border-box; }
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  padding: 0;
  list-style: none;
}
.cards > li { min-width: 0; overflow-wrap: anywhere; }
button:focus-visible, input:focus-visible {
  outline: 3px solid #365b9b;
  outline-offset: 3px;
}
```

Inner min minimum column ko narrow container se overflow hone se rokta hai. min-width:0 flex/grid child ko automatic content minimum se neeche shrink karne deta hai. Long unbroken titles test karo; short demo text overflow chupa deti hai.

## Cascade and positioning traps

Specificity se pehle origin, importance aur cascade-layer order matter karte hain. More selectors weak style boundary ko hide kar sakte hain. Scoped styles aur documented tokens use karo. Flexbox one main axis distribute karta hai; grid two-dimensional placement. Dono semantic DOM order replace nahi karte.

position:absolute containing block use karta hai, always viewport nahi. Transformed ancestor positioned descendants ka containing block badal sakta hai. z-index stacking context ke andar work karta hai; huge number se child parent context escape nahi karta. Pehle ancestor contexts debug karo.

## Practice

Layout mein 200-character title do. 320px width aur 200% zoom check karo. Keyboard se navigate, Enter se submit aur visible input label verify karo. Modal ke liye focus entry, Escape, background interaction aur focus return define karo. Requirement match ho toh native elements use karo.

## Interview questions — bolkar practice karo

**min-width:0 overflow fix kyun kar sakta hai?** Flex item automatic content minimum se neeche shrink kar sakta hai; content ko arbitrarily hide nahi karta.

**display:none par accessibility exposure bachta hai?** Hidden subtree generally layout aur accessibility tree dono se remove hota hai. Hiding behavior interaction ke hisaab se choose karo, sirf appearance se nahi.

## Research notes: Semantic HTML before custom interaction

Navigation ke liye anchor, action ke liye button lo. Clickable div mein keyboard, focus aur accessibility behavior khud add karna padta hai.

```html
<label for="course-search">Find a course</label>
<input id="course-search" name="query" type="search">
<button type="button">Clear search</button>
<a href="/library">Browse all courses</a>
```

Placeholder persistent visible label nahi hai. Pehle native behavior sahi karo, phir styling add karo.

**Interview check:** Sirf div ke click handler mein kya missing ho sakta hai?

**Answer:** Keyboard activation, focusability aur accessible role/name missing ho sakte hain. Correct native element choose karo aur style karte waqt behavior preserve karo.

**Practice:** Sirf keyboard se example navigate aur activate karo.

[Source yahan padho — MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### Layout bug ko DOM se pixels tak trace karo

HTML structure batata hai, CSS matching declarations choose karti hai, layout boxes ki geometry nikalta hai, paint visual content banata hai aur compositing layers combine kar sakti hai. Har property change har stage repeat karaye, zaroori nahi. `width` change layout affect kar sakta hai; transform frequently different rendering path use karta hai, lekin “GPU means always free” guarantee nahi.

Box model mein content width ke saath padding/border count karo. `box-sizing: border-box` declared width mein padding/border include karta hai. Flex child content ke minimum size ki wajah se shrink na ho toh `min-width: 0` relevant ho sakta hai; blindly overflow hidden karke content accessibility lose mat karo.

Semantic button keyboard activation, focus aur disabled behavior ka built-in contract deta hai. Click listener wala div dekhne mein same lagkar bhi equivalent interaction nahi deta. Label/input association aur form submit behavior basic HTML ki responsibility hain, React use magically add nahi karega.

**Debug drill:** Card small viewport par overflow karti hai. Inspect computed width, padding, min-width aur long unbroken content. Ek cause change karke narrow viewport plus keyboard navigation dobara verify karo.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Heading, description aur expand-details action wala lesson card banao. Keyboard aur narrow screen par behavior samjhao.

> **Hint — chhota ishara:** Action ke liye button aur navigation ke liye link use karo.

**Answer guide — pehle khud karo, phir compare karo:** Accessible name wala real button use karo; expanded state ko controlled content se associate karo. Visible focus aur flexible width rakho. Enter/Space activation test karo; long text wrap ho aur action hide na ho.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) aur [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) mein examples ke browser primitives padho.
