'use strict';

/**
 * ========================================================================
 * JONAS NODE.JS COURSE MAP - SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Course ka main project "Natours" hai.
 * - Pehle simple Node server banta hai, phir Express REST API, phir MongoDB,
 *   auth/security, server-side rendered website, payments, uploads, deployment.
 * - Ye notes original short summary hain; course ka transcript/copy nahi.
 */


/**
 * ========================================================================
 * 1. COURSE FLOW
 * ========================================================================
 * NOTES:
 * - Welcome + install Node.js.
 * - Node.js and NPM basics.
 * - Backend web development theory.
 * - Node internals: event loop, streams, modules.
 * - Optional async JS refresher: Promises and async/await.
 * - Express + REST API.
 * - MongoDB basics.
 * - Mongoose + API features.
 * - Express error handling.
 * - Authentication, authorization, security.
 * - Advanced Mongoose + data modeling.
 * - Server-side rendering with Pug.
 * - Payments, email, file uploads, image processing.
 * - Git + production deployment.
 */


/**
 * ========================================================================
 * 2. WHAT YOU SHOULD BE ABLE TO BUILD
 * ========================================================================
 * NOTES:
 * - Fast REST API with Express.
 * - MongoDB database models using Mongoose.
 * - Protected routes with JWT authentication.
 * - Role-based authorization: user, guide, lead-guide, admin.
 * - Secure password reset flow.
 * - Server-rendered website using Pug templates.
 * - Stripe checkout flow.
 * - File upload and image resize pipeline.
 * - Production-ready app with env config, logging, security, deployment.
 */


/**
 * ========================================================================
 * 3. MAIN PROJECT ARCHITECTURE
 * ========================================================================
 * NOTES:
 * - server.js  -> server start, DB connect, process-level errors.
 * - app.js     -> Express app config, middleware, routes, global errors.
 * - routes/    -> URL mapping only.
 * - controllers/ -> request/response logic.
 * - models/    -> Mongoose schemas and business rules.
 * - utils/     -> AppError, catchAsync, email helpers, apiFeatures.
 * - views/     -> Pug templates.
 * - public/    -> static CSS, JS, images.
 *
 * GOLDEN RULE:
 * - Route decides "which controller".
 * - Controller decides "what response".
 * - Model decides "how data works".
 */


/**
 * ========================================================================
 * 4. REST API ROADMAP
 * ========================================================================
 * NOTES:
 * - Resource: /api/v1/tours
 * - HTTP methods:
 *   GET    /tours      -> all tours
 *   POST   /tours      -> create tour
 *   GET    /tours/:id  -> one tour
 *   PATCH  /tours/:id  -> update tour
 *   DELETE /tours/:id  -> delete tour
 *
 * API FEATURES:
 * - Filtering: ?difficulty=easy&price[lt]=500
 * - Sorting: ?sort=price,-ratingsAverage
 * - Field limiting: ?fields=name,price,duration
 * - Pagination: ?page=2&limit=10
 * - Aliases: /top-5-cheap -> pre-filled query options
 */


/**
 * ========================================================================
 * 5. IMPORTANT PACKAGES
 * ========================================================================
 * NOTES:
 * - express              -> server framework.
 * - mongoose             -> MongoDB object data modeling.
 * - dotenv               -> environment variables.
 * - morgan               -> development request logging.
 * - jsonwebtoken         -> JWT sign/verify.
 * - bcryptjs             -> password hashing.
 * - validator            -> email and input validation.
 * - nodemailer           -> send emails.
 * - stripe               -> payments.
 * - multer               -> file uploads.
 * - sharp                -> image processing.
 * - helmet               -> secure HTTP headers.
 * - express-rate-limit   -> limit repeated requests.
 * - express-mongo-sanitize -> prevent NoSQL injection.
 * - xss-clean            -> sanitize HTML/script input.
 * - hpp                  -> prevent HTTP parameter pollution.
 */


/**
 * ========================================================================
 * 6. SKILL CHECKLIST
 * ========================================================================
 * Backend basics        -> HTTP, DNS, request-response, REST
 * Node basics           -> fs, http, url, modules, npm
 * Node internals        -> event loop, thread pool, streams, module cache
 * Express               -> middleware, routers, params, static files
 * MongoDB               -> collections, documents, CRUD, operators
 * Mongoose              -> schema, model, validators, middleware, populate
 * Error handling        -> AppError, catchAsync, global error middleware
 * Auth                  -> signup, login, protect, restrictTo, reset password
 * Security              -> hash, sanitize, rate limit, helmet, cookies
 * SSR                   -> Pug templates, render, protected views
 * Advanced features     -> Stripe, email, upload, image resize
 * Deployment            -> env vars, logging, process errors, Git, production
 */
