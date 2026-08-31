'use strict';

/**
 * ========================================================================
 * EXPRESS REST API - NATOURS SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Express Node ke http module ke upar framework hai.
 * - It gives routing, middleware, request parsing, response helpers, static files.
 */


/**
 * ========================================================================
 * 1. BASIC EXPRESS APP
 * ========================================================================
 * NOTES:
 * - app = Express application.
 * - app.listen server start karta hai.
 * - Route handler: (req, res) => response.
 */

// const express = require('express');
// const app = express();
//
// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello from Express' });
// });
//
// app.listen(3000, () => console.log('App running on port 3000'));


/**
 * ========================================================================
 * 2. MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - Middleware request-response cycle ke beech run hota hai.
 * - Middleware ko next() call karna hota hai, warna request hang hogi.
 * - Order matters.
 */

// app.use(express.json());
//
// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     next();
// });


/**
 * ========================================================================
 * 3. ROUTES AND HTTP METHODS
 * ========================================================================
 * NOTES:
 * - GET for read.
 * - POST for create.
 * - PATCH for partial update.
 * - DELETE for remove.
 */

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


/**
 * ========================================================================
 * 4. REST RESOURCE DESIGN
 * ========================================================================
 * NOTES:
 * - Collection route: /tours
 * - Document route: /tours/:id
 * - Nested route: /tours/:tourId/reviews
 * - Versioning: /api/v1
 */


/**
 * ========================================================================
 * 5. REQUEST DATA IN EXPRESS
 * ========================================================================
 * req.params -> URL parameters: /tours/:id
 * req.query  -> query string: ?page=2&sort=price
 * req.body   -> JSON body from POST/PATCH
 * req.headers -> request headers
 */

const requestDataPlaces = {
    params: { id: '5' },
    query: { page: '2', limit: '10' },
    body: { name: 'New Tour' }
};

console.log(requestDataPlaces.params.id);


/**
 * ========================================================================
 * 6. RESPONSE HELPERS
 * ========================================================================
 * NOTES:
 * - res.status(code)
 * - res.json(data)
 * - res.send(text/html)
 * - res.end()
 */

// res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: { tours }
// });


/**
 * ========================================================================
 * 7. POST REQUEST BODY
 * ========================================================================
 * NOTES:
 * - express.json() middleware body parse karta hai.
 * - Without it req.body undefined ho sakta hai.
 */

// app.use(express.json());
//
// exports.createTour = (req, res) => {
//     const newTour = req.body;
//     res.status(201).json({ status: 'success', data: { tour: newTour } });
// };


/**
 * ========================================================================
 * 8. ROUTE PARAMETERS
 * ========================================================================
 * NOTES:
 * - :id dynamic segment hai.
 * - Optional params: :id? possible hai.
 * - Convert string id to number if comparing with numeric JSON data.
 */

// app.get('/api/v1/tours/:id', (req, res) => {
//     const id = req.params.id;
//     res.status(200).json({ requestedId: id });
// });


/**
 * ========================================================================
 * 9. ROUTER
 * ========================================================================
 * NOTES:
 * - Router mini app jaisa hota hai.
 * - Resource-wise routes split karne ke liye use hota hai.
 */

// const tourRouter = express.Router();
//
// tourRouter
//     .route('/')
//     .get(getAllTours)
//     .post(createTour);
//
// tourRouter
//     .route('/:id')
//     .get(getTour)
//     .patch(updateTour)
//     .delete(deleteTour);
//
// app.use('/api/v1/tours', tourRouter);


/**
 * ========================================================================
 * 10. MVC STRUCTURE
 * ========================================================================
 * NOTES:
 * - Model: data and business rules.
 * - View: UI/template.
 * - Controller: request receive, model call, response send.
 *
 * FILE FLOW:
 * server.js -> app.js -> routes -> controllers -> models
 */


/**
 * ========================================================================
 * 11. PARAM MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - app.param or router.param specific param ke liye middleware run karta hai.
 * - Useful for ID validation or preloading document.
 */

// router.param('id', (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
//     next();
// });


/**
 * ========================================================================
 * 12. CHAINING MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - Route me multiple middleware daal sakte ho.
 * - Validation/protection pehle, controller baad me.
 */

// router.post('/', checkBody, createTour);
//
// function checkBody(req, res, next) {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({ status: 'fail', message: 'Missing name or price' });
//     }
//     next();
// }


/**
 * ========================================================================
 * 13. THIRD-PARTY MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - morgan request logging ke liye.
 * - express.json body parser.
 * - express.static static files serve karta hai.
 */

// const morgan = require('morgan');
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// app.use(express.static(`${__dirname}/public`));


/**
 * ========================================================================
 * 14. ENVIRONMENT VARIABLES
 * ========================================================================
 * NOTES:
 * - NODE_ENV decides development/production behavior.
 * - dotenv .env file load karta hai.
 * - Secrets code me hardcode nahi karne.
 */

// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });
//
// const port = process.env.PORT || 3000;


/**
 * ========================================================================
 * 15. APP.JS VS SERVER.JS
 * ========================================================================
 * app.js:
 * - express app create.
 * - middleware setup.
 * - route mounting.
 * - error handling middleware.
 *
 * server.js:
 * - env config.
 * - database connect.
 * - server listen.
 * - process-level errors.
 */


/**
 * ========================================================================
 * 16. POSTMAN
 * ========================================================================
 * NOTES:
 * - API manually test karne ke liye.
 * - Collections save karo.
 * - Environments use karo: dev URL, prod URL, token variables.
 */


/**
 * ========================================================================
 * 17. DATA MODELING: WHEN TO EMBED VS WHEN TO REFERENCE (JONAS COURSE)
 * ========================================================================
 * NOTES:
 * - NoSQL schema design is driven by APP ACCESS PATTERNS & QUERIES (not strict normalization).
 *
 * 🟢 1. RELATIONSHIP CARDINALITY:
 *   • 1 : 1       -> EMBED (e.g. Tour & StartLocation)
 *   • 1 : Few     -> EMBED (e.g. Tour & Locations [3-5 locations])
 *   • 1 : Many    -> EMBED if bounded/dependent; REFERENCE if independent/large
 *   • 1 : Ton     -> CHILD REFERENCE ALWAYS! (Store parent_id in child doc. e.g. Tour & Reviews, Post & Comments).
 *                    ❌ Never embed in parent (16MB document limit breach).
 *   • Many : Many -> REFERENCE (Two-way or Child Referencing).
 *
 * 🔵 2. ACCESS PATTERNS & READ/WRITE RATIO:
 *   • Queried Together?  -> EMBED (1 query, zero .populate() overhead).
 *   • Queried Separately? -> REFERENCE (Independent lifecycle).
 *   • High Read / Low Write -> EMBED (Super fast reads).
 *   • High Write / Dynamic  -> REFERENCE (Prevents rewriting large docs on update).
 *
 * 🟡 3. DATA COUPLING:
 *   • Tightly Coupled -> EMBED (Child data parent ke bina meaningless hai).
 *   • Standalone / Shared -> REFERENCE (Entity multiple places pe share hoti hai, e.g. User/Guides).
 */

