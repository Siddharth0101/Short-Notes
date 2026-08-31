'use strict';

/**
 * ========================================================================
 * EXPRESS ERROR HANDLING - SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Error handling scattered nahi hona chahiye.
 * - Jonas style: AppError class + catchAsync wrapper + global error middleware.
 */


/**
 * ========================================================================
 * 1. TYPES OF ERRORS
 * ========================================================================
 * OPERATIONAL ERRORS:
 * - Predictable problems.
 * - Invalid user input, invalid DB id, duplicate email, not found.
 * - Client ko safe message bhej sakte hain.
 *
 * PROGRAMMING ERRORS:
 * - Bugs in code.
 * - Undefined variable, wrong function call, bad logic.
 * - Production me details leak nahi karna.
 */


/**
 * ========================================================================
 * 2. UNHANDLED ROUTES
 * ========================================================================
 * NOTES:
 * - Sab routes ke baad catch-all route/middleware rakho.
 * - app.all('*') all HTTP methods catch karta hai.
 */

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });


/**
 * ========================================================================
 * 3. APPERROR CLASS
 * ========================================================================
 * NOTES:
 * - Custom operational error.
 * - statusCode -> 404, 400 etc.
 * - status -> fail/client or error/server.
 * - isOperational -> trusted error.
 */

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


/**
 * ========================================================================
 * 4. GLOBAL ERROR MIDDLEWARE
 * ========================================================================
 * NOTES:
 * - Express error middleware has 4 args: err, req, res, next.
 * - Ye middleware routes ke baad mount hota hai.
 */

// app.use((err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
//
//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     });
// });


/**
 * ========================================================================
 * 5. DEVELOPMENT VS PRODUCTION ERRORS
 * ========================================================================
 * DEVELOPMENT:
 * - Full stack trace.
 * - Full error object.
 * - Helpful debugging.
 *
 * PRODUCTION:
 * - Operational error -> safe message.
 * - Programming/unknown error -> generic message.
 */

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


/**
 * ========================================================================
 * 6. CATCHING ASYNC ERRORS
 * ========================================================================
 * NOTES:
 * - Async controller me try/catch repeat karna boring hai.
 * - catchAsync promise rejection ko next(err) bhejta hai.
 */

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


/**
 * ========================================================================
 * 7. MONGOOSE CASTERROR
 * ========================================================================
 * NOTES:
 * - Invalid ObjectId format se CastError aata hai.
 * - Production me friendly 400 response do.
 */

// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}`;
//     return new AppError(message, 400);
// };


/**
 * ========================================================================
 * 8. DUPLICATE FIELDS
 * ========================================================================
 * NOTES:
 * - MongoDB duplicate unique field error code: 11000.
 * - Example: duplicate tour name or email.
 */

// const handleDuplicateFieldsDB = err => {
//     const value = err.keyValue ? Object.values(err.keyValue)[0] : 'duplicate value';
//     return new AppError(`Duplicate field value: ${value}. Please use another value`, 400);
// };


/**
 * ========================================================================
 * 9. VALIDATION ERRORS
 * ========================================================================
 * NOTES:
 * - Multiple validation errors ek saath aa sakte hain.
 * - messages combine karke client ko clear response do.
 */

// const handleValidationErrorDB = err => {
//     const errors = Object.values(err.errors).map(el => el.message);
//     return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
// };


/**
 * ========================================================================
 * 10. JWT ERRORS
 * ========================================================================
 * JsonWebTokenError -> invalid token.
 * TokenExpiredError -> expired token.
 */

// const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);
// const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again', 401);


/**
 * ========================================================================
 * 11. UNHANDLED REJECTIONS
 * ========================================================================
 * NOTES:
 * - DB connection fail, promise reject without catch.
 * - Server gracefully close karo, process exit.
 */

// const server = app.listen(port);
//
// process.on('unhandledRejection', err => {
//     console.log('UNHANDLED REJECTION. Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => process.exit(1));
// });


/**
 * ========================================================================
 * 12. UNCAUGHT EXCEPTIONS
 * ========================================================================
 * NOTES:
 * - Sync code ke uncaught bugs.
 * - Listener app start se pehle define karo.
 * - App uncertain state me hai, so crash and restart.
 */

// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION. Shutting down...');
//     console.log(err.name, err.message);
//     process.exit(1);
// });


/**
 * ========================================================================
 * 13. ERROR HANDLING RULE
 * ========================================================================
 * Controller detects problem -> next(new AppError(...))
 * catchAsync catches rejected promises -> next(err)
 * Global middleware formats response -> res.status(...).json(...)
 * Process handlers catch outside Express -> log, close, exit
 */
