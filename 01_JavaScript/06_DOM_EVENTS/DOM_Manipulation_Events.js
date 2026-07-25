'use strict';

/**
 * ========================================================================
 * DOM MANIPULATION & EVENTS - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - DOM = Document Object Model. Browser HTML ko JS objects ke tree me convert karta hai.
 * - JS DOM ke through HTML content change kar sakta hai, styles badal sakta hai.
 *
 * DOM TREE STRUCTURE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                         document                            │
 * │                            │                                │
 * │                     <html lang="en">                        │
 * │                     ┌──────┴──────┐                         │
 * │                  <head>         <body>                      │
 * │                     │        ┌────┴─────────┐               │
 * │                  <title>   <header>      <section>          │
 * │                              │              │               │
 * │                            <h1>           <button>          │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. SELECTING ELEMENTS
 * ========================================================================
 * NOTES:
 * - document.querySelector('.class')       -> pehla matching element.
 * - document.querySelectorAll('.class')     -> NodeList of all matching elements.
 * - document.getElementById('id')           -> by ID (fastest).
 * - document.getElementsByClassName('cls')  -> HTMLCollection (live).
 * - document.getElementsByTagName('p')      -> HTMLCollection (live).
 *
 * IMPORTANT:
 * - querySelectorAll returns STATIC NodeList (snapshot).
 * - getElementsBy* returns LIVE HTMLCollection (auto-updates when DOM changes).
 * - querySelector me CSS selector syntax use hota hai: .class, #id, tag, [attr].
 */

// const message = document.querySelector('.message');
// console.log(message.textContent);  // element ka text

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);          // NodeList of all .section elements

// Special elements:
// document.documentElement -> <html>
// document.head            -> <head>
// document.body            -> <body>


/**
 * ========================================================================
 * 2. MANIPULATING CONTENT AND STYLES
 * ========================================================================
 * NOTES:
 * - textContent: sirf text (no HTML).
 * - innerHTML: text + HTML tags.
 * - value: input/textarea ka value.
 * - style.property: inline style set karta hai.
 *
 * CSS CUSTOM PROPERTIES (Variables):
 * - document.documentElement.style.setProperty('--color-primary', 'orangered');
 *
 * READING COMPUTED STYLES:
 * - getComputedStyle(element).property -> final rendered value milta hai.
 */

// Content:
// document.querySelector('.message').textContent = 'Correct Number! 🎉';
// document.querySelector('.number').innerHTML = '<b>13</b>';
// document.querySelector('.guess').value = 23;

// Inline styles:
// document.querySelector('body').style.backgroundColor = '#60b347';
// document.querySelector('.number').style.width = '30rem';

// Reading computed style:
// const height = getComputedStyle(document.querySelector('.message')).height;
// console.log(height); // '40px' (string with unit)


/**
 * ========================================================================
 * 3. WORKING WITH CLASSES
 * ========================================================================
 * NOTES:
 * - classList = best way to add/remove CSS classes dynamically.
 * - className se directly set karna AVOID karo (overwrite karta hai).
 *
 * METHODS:
 * - el.classList.add('class1', 'class2')    -> add classes.
 * - el.classList.remove('class1', 'class2') -> remove classes.
 * - el.classList.toggle('class')            -> hai toh remove, nahi toh add.
 * - el.classList.contains('class')          -> true/false.
 */

// const modal = document.querySelector('.modal');
// const overlay = document.querySelector('.overlay');
//
// modal.classList.remove('hidden');
// overlay.classList.add('hidden');
// modal.classList.toggle('active');
// console.log(modal.classList.contains('hidden')); // false


/**
 * ========================================================================
 * 4. ATTRIBUTES AND DATA ATTRIBUTES
 * ========================================================================
 * NOTES:
 * - Standard attributes: el.src, el.alt, el.href, el.id, el.className.
 * - Non-standard: el.getAttribute('designer'), el.setAttribute('company', 'Bankist').
 *
 * DATA ATTRIBUTES (data-*):
 * - HTML: <div data-version-number="3.0">
 * - JS: el.dataset.versionNumber -> '3.0'
 * - Naam camelCase me convert hota hai.
 */

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);                     // standard attribute
// console.log(logo.getAttribute('designer')); // non-standard attribute
// console.log(logo.dataset.versionNumber);    // data-version-number -> camelCase


/**
 * ========================================================================
 * 5. EVENT LISTENERS
 * ========================================================================
 * NOTES:
 * - addEventListener('event', callback) -> best way.
 * - Multiple listeners ek element pe laga sakte ho.
 * - removeEventListener se listener hata sakte ho (same function reference chahiye).
 *
 * COMMON EVENTS:
 * - click, dblclick, mouseenter, mouseleave
 * - keydown, keyup, keypress
 * - submit, change, input, focus, blur
 * - scroll, resize, load, DOMContentLoaded
 */

// const h1 = document.querySelector('h1');
//
// const handleHover = function () {
//     console.log('Mouse entered h1');
//     h1.removeEventListener('mouseenter', handleHover); // one-time listener
// };
//
// h1.addEventListener('mouseenter', handleHover);

// Keyboard events:
// document.addEventListener('keydown', function (e) {
//     console.log(e.key);  // 'Escape', 'Enter', 'ArrowUp', etc.
//     if (e.key === 'Escape') {
//         // close modal
//     }
// });


/**
 * ========================================================================
 * 6. EVENT PROPAGATION: BUBBLING AND CAPTURING
 * ========================================================================
 * NOTES:
 * - Event 3 phases me travel karta hai:
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │                   EVENT PROPAGATION FLOW                     │
 * │                                                              │
 * │  1. CAPTURING PHASE (top-down)                               │
 * │     document ──→ <html> ──→ <body> ──→ <section>             │
 * │                                              │               │
 * │  2. TARGET PHASE                             ▼               │
 * │     [<button>]  <─────────────────────  Event Target         │
 * │        │                                                     │
 * │  3. BUBBLING PHASE (bottom-up)                               │
 * │     [<button>] ──→ <section> ──→ <body> ──→ document       │
 * └──────────────────────────────────────────────────────────────┘
 *
 * - addEventListener by default BUBBLING phase me listen karta hai.
 * - Capturing me listen: addEventListener('click', fn, true)  // 3rd arg = true.
 *
 * e.target:         jis element pe actually click hua.
 * e.currentTarget:  jis element pe listener laga hai (= this).
 * e.stopPropagation(): bubbling rok deta hai (avoid karo unless zaruri ho).
 */

// const nav = document.querySelector('.nav');
// const navLinks = document.querySelector('.nav__links');
// const navLink = document.querySelector('.nav__link');
//
// // Sab pe click listener lagao — bubbling observe karo:
// navLink.addEventListener('click', function (e) {
//     console.log('LINK', e.target, e.currentTarget);
// });
//
// navLinks.addEventListener('click', function (e) {
//     console.log('CONTAINER', e.target, e.currentTarget);
//     // e.target = actual click target (navLink)
//     // e.currentTarget = navLinks (jahan listener laga hai)
// });
//
// nav.addEventListener('click', function (e) {
//     console.log('NAV', e.target, e.currentTarget);
// });


/**
 * ========================================================================
 * 7. EVENT DELEGATION
 * ========================================================================
 * NOTES:
 * - Problem: 100 buttons pe alag-alag listener lagana = wasteful.
 * - Solution: parent pe ek listener lagao, e.target se pata karo kaunsa child.
 *
 * BENEFITS:
 * - Memory efficient: ek listener vs hundreds.
 * - Dynamically added elements bhi automatically covered.
 * - Best practice for lists, navs, tables.
 *
 * PATTERN:
 * 1. Parent pe listener lagao.
 * 2. e.target.closest('.selector') se correct element find karo.
 * 3. Guard clause: agar match nahi mila toh return.
 */

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//     e.preventDefault();
//
//     // Match the clicked element to the desired child:
//     const clicked = e.target.closest('.nav__link');
//
//     // Guard clause: click kahi aur hua (gap me, etc.)
//     if (!clicked) return;
//
//     const id = clicked.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// });


/**
 * ========================================================================
 * 8. CREATING AND REMOVING DOM ELEMENTS
 * ========================================================================
 * NOTES:
 * - document.createElement('div') -> naya element create.
 * - el.innerHTML = '...'          -> HTML se content set.
 * - parent.prepend(el)            -> start me insert.
 * - parent.append(el)             -> end me insert.
 * - parent.before(el)             -> parent se pehle.
 * - parent.after(el)              -> parent ke baad.
 * - el.remove()                   -> element delete.
 * - el.cloneNode(true)            -> deep copy of element.
 *
 * IMPORTANT:
 * - Ek element DOM me ek hi jagah ho sakta hai.
 * - prepend kiya phir append kiya -> element MOVE ho jayega, duplicate nahi hoga.
 * - Duplicate chahiye toh cloneNode(true) use karo.
 */

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = 'We use cookies. <button class="btn--close">Got it!</button>';
//
// const header = document.querySelector('.header');
// header.prepend(message);
// // header.append(message); // ye move karega, not duplicate
// // header.append(message.cloneNode(true)); // ye duplicate karega
//
// document.querySelector('.btn--close').addEventListener('click', function () {
//     message.remove();
// });


/**
 * ========================================================================
 * 9. SMOOTH SCROLLING
 * ========================================================================
 * NOTES:
 * - Modern way: element.scrollIntoView({ behavior: 'smooth' })
 * - Old way: window.scrollTo({ left, top, behavior: 'smooth' })
 *
 * COORDINATES:
 * - el.getBoundingClientRect() -> element ki position (relative to viewport).
 * - window.scrollX, window.scrollY -> current scroll position.
 */

// const section1 = document.querySelector('#section--1');
//
// // Modern (best):
// section1.scrollIntoView({ behavior: 'smooth' });
//
// // Old approach (for reference):
// const coords = section1.getBoundingClientRect();
// window.scrollTo({
//     left: coords.left + window.scrollX,
//     top: coords.top + window.scrollY,
//     behavior: 'smooth',
// });


/**
 * ========================================================================
 * 10. INTERSECTION OBSERVER API
 * ========================================================================
 * NOTES:
 * - Observe karta hai jab ek element viewport ya kisi ancestor se intersect karta hai.
 * - Scroll event se MUCH better performance (no constant firing).
 * - Use cases: lazy loading images, infinite scroll, sticky nav, reveal-on-scroll.
 *
 * OPTIONS:
 * - root: null (viewport) ya koi container element.
 * - threshold: 0 to 1 (0 = just entering, 1 = fully visible).
 *   Array bhi de sakte ho: [0, 0.25, 0.5, 1].
 * - rootMargin: offset add karna (e.g., '-90px' for sticky nav).
 */

// const obsCallback = function (entries, observer) {
//     entries.forEach(entry => {
//         if (!entry.isIntersecting) return;
//         entry.target.classList.remove('section--hidden');
//         observer.unobserve(entry.target); // once revealed, stop observing
//     });
// };
//
// const obsOptions = {
//     root: null,       // viewport
//     threshold: 0.15,  // 15% visible hone par trigger
// };
//
// const sectionObserver = new IntersectionObserver(obsCallback, obsOptions);
//
// const allSections = document.querySelectorAll('.section');
// allSections.forEach(section => {
//     sectionObserver.observe(section);
//     section.classList.add('section--hidden');
// });


/**
 * ========================================================================
 * 11. LAZY LOADING IMAGES
 * ========================================================================
 * NOTES:
 * - Performance optimization: pehle low-res placeholder load karo,
 *   jab user scroll kare tab real high-res image load karo.
 * - HTML: <img src="lazy-img.jpg" data-src="real-img.jpg" class="lazy-img">
 * - JS: IntersectionObserver se detect karo, src ko data-src se replace karo.
 * - load event pe lazy-img class hatao (blur filter remove).
 */

// const imgTargets = document.querySelectorAll('img[data-src]');
//
// const loadImg = function (entries, observer) {
//     const [entry] = entries;
//     if (!entry.isIntersecting) return;
//
//     entry.target.src = entry.target.dataset.src; // swap src
//
//     entry.target.addEventListener('load', function () {
//         entry.target.classList.remove('lazy-img'); // remove blur
//     });
//
//     observer.unobserve(entry.target);
// };
//
// const imgObserver = new IntersectionObserver(loadImg, {
//     root: null,
//     threshold: 0,
//     rootMargin: '200px', // start loading 200px before visible
// });
//
// imgTargets.forEach(img => imgObserver.observe(img));


/**
 * ========================================================================
 * 12. DOM TRAVERSAL
 * ========================================================================
 * NOTES:
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │                     DOM TRAVERSAL MAP                        │
 * │                                                              │
 * │                   parentElement / closest()                  │
 * │                              ▲                               │
 * │                              │                               │
 * │   previousElementSibling ◄── [ELEMENT] ──► nextElementSibling│
 * │                              │                               │
 * │                              ▼                               │
 * │                     children / querySelector                 │
 * └──────────────────────────────────────────────────────────────┘
 *
 * - Downwards (children):
 *   el.querySelectorAll('.child')   -> all matching descendants.
 *   el.children                     -> only element children (HTMLCollection).
 *   el.firstElementChild / lastElementChild
 *
 * - Upwards (parents):
 *   el.parentElement                -> direct parent element.
 *   el.closest('.selector')         -> nearest ancestor matching selector.
 *
 * - Sideways (siblings):
 *   el.previousElementSibling / nextElementSibling
 */

// const h1 = document.querySelector('h1');
//
// // Going down:
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
//
// // Going up:
// console.log(h1.parentElement);
// console.log(h1.closest('.header')); // nearest .header ancestor
//
// // Going sideways:
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
//
// // All siblings:
// [...h1.parentElement.children].forEach(el => {
//     if (el !== h1) el.style.transform = 'scale(0.5)';
// });
