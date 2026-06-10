'use strict';

/**
 * ========================================================================
 * SERVER-SIDE RENDERING WITH PUG - SHORT NOTES
 * ========================================================================
 * NOTES:
 * - SSR me server HTML generate karke browser ko bhejta hai.
 * - Pug template engine concise syntax use karta hai.
 * - Natours app me API ke saath website views bhi banti hain.
 */


/**
 * ========================================================================
 * 1. SETTING VIEW ENGINE
 * ========================================================================
 * NOTES:
 * - app.set('view engine', 'pug') Express ko Pug use karne bolta hai.
 * - views folder location set kar sakte ho.
 */

// const path = require('path');
//
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));


/**
 * ========================================================================
 * 2. RENDERING A TEMPLATE
 * ========================================================================
 * NOTES:
 * - res.render('templateName', data)
 * - Express views/templateName.pug find karta hai.
 */

// exports.getOverview = catchAsync(async (req, res, next) => {
//     const tours = await Tour.find();
//
//     res.status(200).render('overview', {
//         title: 'All Tours',
//         tours
//     });
// });


/**
 * ========================================================================
 * 3. PUG BASICS
 * ========================================================================
 * NOTES:
 * - Indentation structure define karta hai.
 * - #{variable} interpolation.
 * - if/else condition.
 * - each loop.
 */

// PUG EXAMPLE:
// h1= title
// each tour in tours
//   h2 #{tour.name}
//   p= tour.summary
// if user
//   p Logged in as #{user.name}


/**
 * ========================================================================
 * 4. BASE TEMPLATE AND BLOCKS
 * ========================================================================
 * NOTES:
 * - base.pug common layout hota hai.
 * - Other templates extends base.
 * - block content replaceable area hota hai.
 */

// base.pug:
// doctype html
// html
//   head
//     title Natours | #{title}
//   body
//     include _header
//     block content
//     include _footer
//
// overview.pug:
// extends base
// block content
//   h1 All Tours


/**
 * ========================================================================
 * 5. INCLUDES
 * ========================================================================
 * NOTES:
 * - Reusable pieces: header, footer, tour card.
 * - File name often starts with underscore: _header.pug.
 */

// include _header
// include _footer


/**
 * ========================================================================
 * 6. STATIC ASSETS
 * ========================================================================
 * NOTES:
 * - CSS/images/client JS public folder me.
 * - express.static se serve.
 */

// app.use(express.static(path.join(__dirname, 'public')));


/**
 * ========================================================================
 * 7. VIEW ROUTES
 * ========================================================================
 * NOTES:
 * - API routes JSON return karte hain.
 * - View routes HTML render karte hain.
 */

// router.get('/', getOverview);
// router.get('/tour/:slug', getTour);
// router.get('/login', getLoginForm);
// router.get('/me', protect, getAccount);


/**
 * ========================================================================
 * 8. LOGIN FROM WEBSITE
 * ========================================================================
 * NOTES:
 * - Browser form submit ya client JS axios/fetch call.
 * - API login success pe JWT cookie set.
 * - Page reload/redirect ke baad server cookie read kar sakta hai.
 */

// Client-side idea:
// const login = async (email, password) => {
//     const res = await axios({
//         method: 'POST',
//         url: '/api/v1/users/login',
//         data: { email, password }
//     });
//
//     if (res.data.status === 'success') {
//         window.setTimeout(() => location.assign('/'), 1500);
//     }
// };


/**
 * ========================================================================
 * 9. IS LOGGED IN MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - For rendered pages, user login state check.
 * - If JWT cookie exists and valid, set res.locals.user.
 * - Templates can access res.locals variables.
 */

// exports.isLoggedIn = async (req, res, next) => {
//     if (req.cookies.jwt) {
//         try {
//             const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
//             const currentUser = await User.findById(decoded.id);
//             if (!currentUser) return next();
//             if (currentUser.changedPasswordAfter(decoded.iat)) return next();
//
//             res.locals.user = currentUser;
//             return next();
//         } catch (err) {
//             return next();
//         }
//     }
//     next();
// };


/**
 * ========================================================================
 * 10. LOGOUT
 * ========================================================================
 * NOTES:
 * - JWT cookie overwrite with short expiry.
 * - Browser loses auth.
 */

// exports.logout = (req, res) => {
//     res.cookie('jwt', 'loggedout', {
//         expires: new Date(Date.now() + 10 * 1000),
//         httpOnly: true
//     });
//     res.status(200).json({ status: 'success' });
// };


/**
 * ========================================================================
 * 11. PROTECTING PAGES
 * ========================================================================
 * NOTES:
 * - API protect returns JSON error.
 * - View protect can redirect/render login if not logged in.
 * - In Jonas style, protect middleware works for both if adjusted.
 */


/**
 * ========================================================================
 * 12. UPDATING USER DATA FROM ACCOUNT PAGE
 * ========================================================================
 * NOTES:
 * - Account page sends PATCH /api/v1/users/updateMe.
 * - For photo upload, use FormData.
 * - After success, reload page to show updated data.
 */


/**
 * ========================================================================
 * 13. SSR GOOD PRACTICES
 * ========================================================================
 * - Keep templates mostly presentation.
 * - Fetch data in controller.
 * - Put reusable UI in includes.
 * - Store logged-in user in res.locals.
 * - Never expose secrets to templates.
 * - Use escaped output for user content.
 */
