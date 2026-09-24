/**
 * ## Quick revision
 *
 * - Node.js — JavaScript runtime; I/O async ho sakti hai, heavy JS event loop block karta hai.
 * - Event loop — callbacks schedule; worker pool aur OS kuch async work handle karte hain.
 * - HTTP — method, URL, headers aur body se request; status/headers/body se response.
 * - Module — ESM `import/export`; CommonJS `require/module.exports`.
 * - Stream — chunks mein data; poori file memory mein lena zaroori nahi.
 * - Backpressure — slow consumer ho toh producer ko slow/pause karo.
 * - Buffer — binary bytes; text decode karte waqt encoding sahi rakho.
 * - Environment — config validate karo; secrets client/logs mein leak mat karo.
 * - Express — routing aur middleware ka HTTP framework.
 * - Middleware — order matters; response bhejo ya `next()` se control do.
 * - Route — method + path + handler; input ki type/range validate karo.
 * - Express 5 — returned rejected Promise error flow mein jaati hai; detached async work alag handle karo.
 * - Error handler — `(err, req, res, next)`; routes ke baad register karo.
 * - Double response — send ke baad execution/control flow rokna ya return karna socho.
 * - REST — resource URL, consistent methods/status aur bounded pagination.
 * - Error response — safe message/code; stack trace client ko nahi.
 * - Document — BSON fields ka record; collection related documents rakhti hai.
 * - CRUD — insert, find, update, delete.
 * - Filter — precise conditions; untrusted query objects directly accept mat karo.
 * - `$set` — selected fields update; full replacement alag operation.
 * - Embed — saath read/update hone wala bounded data.
 * - Reference — shared, independently changing ya unbounded relation.
 * - Atomicity — single-document write atomic; multiple documents ke liye boundary plan karo.
 * - Schema design — query/access pattern se start karo.
 * - Authentication — identity verify; authorization — action/resource access verify.
 * - Password — adaptive hash; raw password store/log nahi.
 * - Session/token — expiry, revocation aur secure transport plan karo.
 * - JWT — signature + claims validate; decoded payload trusted nahi hota.
 * - Ownership — requested document user/tenant ka hai ya nahi, server par check.
 * - Injection — fields/operators allowlist karo; input se raw query mat banao.
 * - Rate limit — login/reset jaise sensitive endpoints protect karo.
 * - Browser security — XSS, CSRF aur cookie flags ko credential flow se match karo.
 * - EventEmitter — listeners synchronous call ho sakte hain; emit ko automatic async mat samjho.
 * - Client disconnect — abandoned response ke database/stream work ko cancel/close karo.
 * - CPU saturation — event-loop delay measure; heavy computation ko bounded worker execution do.
 */

'use strict';


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


// Tour.findById(id).populate('guides');
// Review.find().populate({ path: 'user', select: 'name photo' });
// Tour.findById(id).populate('reviews'); // virtual populate
