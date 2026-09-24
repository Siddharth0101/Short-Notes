/**
 * ## Quick revision
 *
 * - Express — routing aur middleware ka HTTP framework.
 * - Middleware — order matters; response bhejo ya `next()` se control do.
 * - Route — method + path + handler; input ki type/range validate karo.
 * - Express 5 — returned rejected Promise error flow mein jaati hai; detached async work alag handle karo.
 * - Error handler — `(err, req, res, next)`; routes ke baad register karo.
 * - Double response — send ke baad execution/control flow rokna ya return karna socho.
 * - REST — resource URL, consistent methods/status aur bounded pagination.
 * - Error response — safe message/code; stack trace client ko nahi.
 * - 404 handler — unmatched route response; thrown exception se alag flow.
 * - Body limit — parser/upload payload bound karo; unlimited request memory risk.
 * - Middleware continuation — next() ke baad current JS execution automatically return nahi hoti.
 */

'use strict';


// const express = require('express');
// const app = express();
//
// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello from Express' });
// });
//
// app.listen(3000, () => console.log('App running on port 3000'));


// app.use(express.json());
//
// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     next();
// });


// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


const requestDataPlaces = {
    params: { id: '5' },
    query: { page: '2', limit: '10' },
    body: { name: 'New Tour' }
};

console.log(requestDataPlaces.params.id);


// res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: { tours }
// });


// app.use(express.json());
//
// exports.createTour = (req, res) => {
//     const newTour = req.body;
//     res.status(201).json({ status: 'success', data: { tour: newTour } });
// };


// app.get('/api/v1/tours/:id', (req, res) => {
//     const id = req.params.id;
//     res.status(200).json({ requestedId: id });
// });


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


// router.param('id', (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
//     next();
// });


// router.post('/', checkBody, createTour);
//
// function checkBody(req, res, next) {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({ status: 'fail', message: 'Missing name or price' });
//     }
//     next();
// }


// const morgan = require('morgan');
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// app.use(express.static(`${__dirname}/public`));


// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });
//
// const port = process.env.PORT || 3000;
