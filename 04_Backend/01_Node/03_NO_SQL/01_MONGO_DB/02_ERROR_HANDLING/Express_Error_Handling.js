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


// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });


class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

console.log(new AppError('Not found', 404).status);


// app.use((err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
//
//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     });
// });


// const sendErrorDev = (err, res) => {
//     res.status(err.statusCode).json({
//         status: err.status,
//         error: err,
//         message: err.message,
//         stack: err.stack
//     });
// };
//
// const sendErrorProd = (err, res) => {
//     if (err.isOperational) {
//         res.status(err.statusCode).json({ status: err.status, message: err.message });
//     } else {
//         console.error('ERROR:', err);
//         res.status(500).json({ status: 'error', message: 'Something went wrong' });
//     }
// };


const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

console.log(typeof catchAsync);

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id);
//
//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }
//
//     res.status(200).json({ status: 'success', data: { tour } });
// });


// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}`;
//     return new AppError(message, 400);
// };


// const handleDuplicateFieldsDB = err => {
//     const value = err.keyValue ? Object.values(err.keyValue)[0] : 'duplicate value';
//     return new AppError(`Duplicate field value: ${value}. Please use another value`, 400);
// };


// const handleValidationErrorDB = err => {
//     const errors = Object.values(err.errors).map(el => el.message);
//     return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
// };


// const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);
// const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again', 401);


// const server = app.listen(port);
//
// process.on('unhandledRejection', err => {
//     console.log('UNHANDLED REJECTION. Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => process.exit(1));
// });


// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION. Shutting down...');
//     console.log(err.name, err.message);
//     process.exit(1);
// });
