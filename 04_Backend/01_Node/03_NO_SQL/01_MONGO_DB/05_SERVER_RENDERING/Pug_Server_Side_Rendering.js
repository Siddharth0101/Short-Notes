/**
 * ## Quick revision
 *
 * - SSR/Pug — server HTML banata hai; untrusted output escape karo.
 * - Upload — size/type validate; safe generated filename aur isolated storage.
 * - Payment webhook — raw-body signature verify, then durable idempotent processing.
 * - Duplicate event — unique event ID aur transaction se repeat effect roko.
 * - Email — queue/retry; API response ko slow provider par depend mat karao.
 * - Order state — payment/refund transitions explicit rakho.
 * - Deployment — secrets, health checks, logs aur graceful shutdown.
 * - Recovery — partial failure par retry/reconciliation; browser success screen final proof nahi.
 * - Pug — indentation-based server template syntax.
 * - Escaped interpolation — untrusted text safe output; raw HTML interpolation carefully control.
 * - Extends/block — shared layout; include/mixin — reusable template parts.
 * - SSR route — data load → safe locals → render; auth server par enforce.
 * - File path — user filename ko filesystem path authority mat do; generated safe key use.
 * - Provider timeout — external effect ho chuka ho sakta hai; retry se pehle idempotency/reconciliation.
 * - Outbox job — business write aur pending notification same durable boundary mein record.
 */

'use strict';


// const path = require('path');
//
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));


// exports.getOverview = catchAsync(async (req, res, next) => {
//     const tours = await Tour.find();
//
//     res.status(200).render('overview', {
//         title: 'All Tours',
//         tours
//     });
// });


// PUG EXAMPLE:
// h1= title
// each tour in tours
//   h2 #{tour.name}
//   p= tour.summary
// if user
//   p Logged in as #{user.name}


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


// include _header
// include _footer


// app.use(express.static(path.join(__dirname, 'public')));


// router.get('/', getOverview);
// router.get('/tour/:slug', getTour);
// router.get('/login', getLoginForm);
// router.get('/me', protect, getAccount);


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


// exports.logout = (req, res) => {
//     res.cookie('jwt', 'loggedout', {
//         expires: new Date(Date.now() + 10 * 1000),
//         httpOnly: true
//     });
//     res.status(200).json({ status: 'success' });
// };
