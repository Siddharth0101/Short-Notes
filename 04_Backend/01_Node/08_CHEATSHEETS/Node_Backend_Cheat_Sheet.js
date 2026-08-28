'use strict';

/**
 * ========================================================================
 * NODE BACKEND CHEAT SHEET - JONAS COURSE REVISION [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Fast revision file.
 * - Interview + project build ke time quick lookup.
 */


/**
 * ========================================================================
 * 1. EXPRESS APP SKELETON
 * ========================================================================
 */

// app.js
// const express = require('express');
// const app = express();
//
// app.use(express.json({ limit: '10kb' }));
// app.use(express.static(`${__dirname}/public`));
// app.use('/api/v1/tours', tourRouter);
// app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl}`, 404)));
// app.use(globalErrorHandler);
//
// module.exports = app;
//
// server.js
// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });
// const app = require('./app');
// mongoose.connect(DB).then(() => console.log('DB connected'));
// const server = app.listen(process.env.PORT || 3000);


/**
 * ========================================================================
 * 2. ROUTER PATTERN
 * ========================================================================
 */

// router
//     .route('/')
//     .get(getAllTours)
//     .post(protect, restrictTo('admin', 'lead-guide'), createTour);
//
// router
//     .route('/:id')
//     .get(getTour)
//     .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
//     .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);


/**
 * ========================================================================
 * 3. CRUD CONTROLLER STATUS CODES
 * ========================================================================
 * GET all     -> 200 + results + data
 * GET one     -> 200 + data
 * POST create -> 201 + data
 * PATCH       -> 200 + updated data
 * DELETE      -> 204 + null/no body
 * Not found   -> 404
 * Bad input   -> 400
 * No login    -> 401
 * No access   -> 403
 */


/**
 * ========================================================================
 * 4. API FEATURES
 * ========================================================================
 * Filtering       -> remove reserved fields, find(queryObj)
 * Advanced filter -> replace gte/gt/lte/lt with $gte/$gt/$lte/$lt
 * Sorting         -> ?sort=price,-ratingsAverage
 * Fields          -> ?fields=name,price,duration
 * Pagination      -> ?page=2&limit=10, skip=(page-1)*limit
 */


/**
 * ========================================================================
 * 5. MONGOOSE SCHEMA OPTIONS
 * ========================================================================
 * required
 * unique
 * default
 * select: false
 * trim
 * lowercase
 * minlength / maxlength
 * min / max
 * enum
 * validate custom function
 */


/**
 * ========================================================================
 * 6. MONGOOSE MIDDLEWARE
 * ========================================================================
 * pre('save')       -> before save/create
 * post('save')      -> after save/create
 * pre(/^find/)      -> before find queries
 * pre('aggregate')  -> before aggregation
 *
 * this in document middleware -> document
 * this in query middleware    -> query
 * this in aggregate middleware -> aggregation object
 */


/**
 * ========================================================================
 * 7. ERROR HANDLING FORMULA
 * ========================================================================
 * 1. Create AppError.
 * 2. Wrap async controllers with catchAsync.
 * 3. Use next(new AppError(...)) for operational errors.
 * 4. Add global error middleware at end.
 * 5. Convert DB/JWT errors to operational errors in production.
 * 6. Handle unhandledRejection and uncaughtException in server.js.
 */


/**
 * ========================================================================
 * 8. AUTH FORMULA
 * ========================================================================
 * Signup:
 * - Create user from allowed fields.
 * - Hash password in pre-save.
 * - Sign JWT.
 * - Send token/cookie.
 *
 * Login:
 * - Check email/password.
 * - Find user + select password.
 * - bcrypt.compare.
 * - Sign JWT.
 *
 * Protect:
 * - Get token.
 * - Verify token.
 * - Check user still exists.
 * - Check password not changed after token.
 * - Set req.user.
 *
 * Restrict:
 * - roles.includes(req.user.role)
 */


/**
 * ========================================================================
 * 9. SECURITY STACK
 * ========================================================================
 * helmet                  -> headers
 * express-rate-limit      -> brute force / DoS limit
 * express.json({limit})   -> body size limit
 * express-mongo-sanitize  -> remove $ and . operators
 * xss-clean               -> clean malicious HTML
 * hpp                     -> prevent duplicate query params
 * bcrypt                  -> password hashing
 * JWT secret              -> env var only
 * httpOnly cookie         -> not accessible by JS
 */


/**
 * ========================================================================
 * 10. DATA MODELING QUICK RULES (EMBED VS REFERENCE - JONAS FRAMEWORK)
 * ========================================================================
 * RELATIONSHIP CARDINALITY:
 * - 1 : 1       -> EMBED (e.g. Tour & StartLocation)
 * - 1 : Few     -> EMBED (e.g. Tour & Locations array [3-5 locations])
 * - 1 : Many    -> EMBED (if bounded/dependent) OR REFERENCE (if standalone/large)
 * - 1 : Ton     -> CHILD REFERENCE ALWAYS! (Store parent_id in child doc. e.g. Reviews, Comments, Logs).
 *                  ❌ Never embed in parent (16MB document size limit).
 * - Many : Many -> REFERENCE (Two-way or Child Referencing).
 *
 * ACCESS PATTERNS & READ/WRITE:
 * - Query together often?  -> EMBED (Fast reads, 1 query, 0 populate cost).
 * - Query separately?      -> REFERENCE (Independent lifecycle).
 * - High Read / Low Write  -> EMBED
 * - High Write / Dynamic   -> REFERENCE (Avoids rewriting huge parent documents)
 *
 * COUPLING:
 * - Tightly coupled / Dependent -> EMBED
 * - Standalone / Shared entity  -> REFERENCE (e.g. User/Guides shared across tours)
 */


/**
 * ========================================================================
 * 11. POPULATE
 * ========================================================================
 */

// Tour.findById(id).populate('guides');
// Review.find().populate({ path: 'user', select: 'name photo' });
// Tour.findById(id).populate('reviews'); // virtual populate


/**
 * ========================================================================
 * 12. GEOSPATIAL
 * ========================================================================
 * GeoJSON Point:
 * {
 *   type: 'Point',
 *   coordinates: [lng, lat]
 * }
 *
 * Index:
 * schema.index({ startLocation: '2dsphere' });
 *
 * Near distances:
 * aggregate with $geoNear as first stage.
 */


/**
 * ========================================================================
 * 13. SSR WITH PUG
 * ========================================================================
 * app.set('view engine', 'pug')
 * res.render('overview', { title, tours })
 * base.pug + blocks + includes
 * res.locals.user for templates
 */


/**
 * ========================================================================
 * 14. PAYMENTS / EMAIL / UPLOADS
 * ========================================================================
 * Stripe:
 * - Create checkout session on backend.
 * - Redirect user to Stripe.
 * - Use webhook for real booking creation.
 *
 * Email:
 * - Nodemailer transport.
 * - Mailtrap dev, SendGrid/prod provider.
 *
 * Upload:
 * - Multer parses multipart/form-data.
 * - memoryStorage + Sharp for image resize.
 * - File filter + size limit.
 */


/**
 * ========================================================================
 * 15. PRODUCTION CHECKLIST
 * ========================================================================
 * - NODE_ENV=production.
 * - All env vars configured.
 * - Secure DB connection.
 * - HTTPS and secure cookies.
 * - Trust proxy if hosted behind proxy.
 * - No stack traces in production.
 * - Process handlers installed.
 * - Static files served.
 * - Stripe/email URLs and keys updated.
 * - Git repo clean and secrets ignored.
 */


/**
 * ========================================================================
 * 16. ONE-LINE MEMORY MAP
 * ========================================================================
 * Node handles runtime -> Express handles HTTP -> MongoDB stores documents ->
 * Mongoose structures data -> Controllers run app logic -> Middleware guards
 * requests -> JWT proves identity -> AppError centralizes failures -> Pug
 * renders website -> Stripe/email/upload add real product features -> env vars
 * and process handlers make production stable.
 */
