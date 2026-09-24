/**
 * ## Quick revision
 *
 * - DOM — browser ka document tree; selector se node pakdo.
 * - `textContent` — plain text set karo; untrusted HTML inject mat karo.
 * - Event flow — capture → target → bubble.
 * - Delegation — parent par listener; child ko `closest()` se identify karo.
 * - `preventDefault` — default action rokta hai; bubbling nahi.
 * - `stopPropagation` — event propagation rokta hai; default action nahi.
 * - Cleanup — listener hatane mein same callback aur matching capture option chahiye.
 * - Debounce — rukne ke baad run; throttle — frequency limit karo.
 * - Layout thrashing — repeated write/read se forced layout; reads aur writes batch karo.
 * - Observer — visibility ke liye IntersectionObserver, size ke liye ResizeObserver.
 * - `target`/`currentTarget` — event ka original target / current listener wala element.
 * - `classList` — add/remove/toggle se classes manage; poora className overwrite zaroori nahi.
 * - `once` listener — pehli invocation ke baad automatically remove ho jaata hai.
 */

'use strict';


// const message = document.querySelector('.message');
// console.log(message.textContent);  // element ka text

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);          // NodeList of all .section elements

// Special elements:
// document.documentElement -> <html>
// document.head            -> <head>
// document.body            -> <body>


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


// const modal = document.querySelector('.modal');
// const overlay = document.querySelector('.overlay');
//
// modal.classList.remove('hidden');
// overlay.classList.add('hidden');
// modal.classList.toggle('active');
// console.log(modal.classList.contains('hidden')); // false


// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);                     // standard attribute
// console.log(logo.getAttribute('designer')); // non-standard attribute
// console.log(logo.dataset.versionNumber);    // data-version-number -> camelCase


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
