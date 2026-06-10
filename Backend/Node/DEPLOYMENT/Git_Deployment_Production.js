'use strict';

/**
 * ========================================================================
 * GIT, DEPLOYMENT, PRODUCTION - SHORT NOTES
 * ========================================================================
 * NOTES:
 * - Production app means code + config + database + secrets + process handling.
 * - Jonas course uses Heroku-style deployment flow, but concepts apply anywhere.
 */


/**
 * ========================================================================
 * 1. GIT BASICS
 * ========================================================================
 * NOTES:
 * - Git tracks code history.
 * - Commit small logical changes.
 * - Do not commit secrets or node_modules.
 */

// git init
// git status
// git add .
// git commit -m "Initial commit"
// git remote add origin <repo-url>
// git push -u origin main


/**
 * ========================================================================
 * 2. .GITIGNORE
 * ========================================================================
 * NOTES:
 * - node_modules install se regenerate hota hai.
 * - config.env secrets contain kar sakta hai.
 * - logs and generated files usually ignore.
 */

// node_modules/
// config.env
// npm-debug.log
// .DS_Store


/**
 * ========================================================================
 * 3. PRODUCTION ENVIRONMENT
 * ========================================================================
 * NOTES:
 * - NODE_ENV=production set karo.
 * - Secrets environment variables me.
 * - Different DB for production.
 */

const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE',
    'DATABASE_PASSWORD',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'STRIPE_SECRET_KEY'
];

console.log(requiredEnvVars.length);


/**
 * ========================================================================
 * 4. START SCRIPT
 * ========================================================================
 * NOTES:
 * - Platform app start karne ke liye npm start use karta hai.
 * - server.js entry point usually.
 */

// package.json:
// {
//   "scripts": {
//     "start": "node server.js",
//     "start:dev": "nodemon server.js"
//   },
//   "engines": {
//     "node": ">=18"
//   }
// }


/**
 * ========================================================================
 * 5. PRODUCTION SECURITY
 * ========================================================================
 * CHECK:
 * - HTTPS enabled.
 * - secure cookies.
 * - helmet headers.
 * - rate limit.
 * - body size limit.
 * - sanitize input.
 * - production error responses hide stack.
 * - DB user has least required permissions.
 */


/**
 * ========================================================================
 * 6. TRUST PROXY
 * ========================================================================
 * NOTES:
 * - Behind Heroku/proxies, secure cookie detection may need trust proxy.
 * - req.secure uses proxy headers if trust proxy enabled.
 */

// app.enable('trust proxy');


/**
 * ========================================================================
 * 7. DATABASE IN PRODUCTION
 * ========================================================================
 * NOTES:
 * - Use Atlas cluster.
 * - Use strong DB password.
 * - Whitelist platform IPs or allow required access.
 * - Backups matter.
 */


/**
 * ========================================================================
 * 8. PROCESS-LEVEL ERRORS
 * ========================================================================
 * NOTES:
 * - unhandledRejection -> close server then exit.
 * - uncaughtException -> log then exit.
 * - Platform restarts process.
 */

// process.on('uncaughtException', err => {
//     console.log(err.name, err.message);
//     process.exit(1);
// });
//
// const server = app.listen(process.env.PORT || 3000);
//
// process.on('unhandledRejection', err => {
//     console.log(err.name, err.message);
//     server.close(() => process.exit(1));
// });


/**
 * ========================================================================
 * 9. LOGGING
 * ========================================================================
 * NOTES:
 * - morgan dev only in development.
 * - Production logs should go to platform log system.
 * - Do not log passwords/tokens/secrets.
 */


/**
 * ========================================================================
 * 10. BUILD / BUNDLE FRONTEND ASSETS
 * ========================================================================
 * NOTES:
 * - If using client JS bundler, run build before deploy or as postbuild.
 * - Public files must be served by Express static middleware.
 */


/**
 * ========================================================================
 * 11. DEPLOYMENT CHECKLIST
 * ========================================================================
 * - npm start works locally.
 * - NODE_ENV=production tested.
 * - All env vars set on platform.
 * - Database connection works.
 * - Stripe webhook URL updated.
 * - Email provider production credentials set.
 * - Cookies work over HTTPS.
 * - No secrets committed.
 * - Error responses safe.
 * - Static files load.
 */


/**
 * ========================================================================
 * 12. COMMON PRODUCTION BUGS
 * ========================================================================
 * App crashes on start       -> missing env var, DB connection error.
 * Login cookie not setting   -> secure cookie without HTTPS/proxy config.
 * Images not showing         -> wrong static path or ephemeral filesystem.
 * Stripe works local not prod -> wrong webhook/secret/domain.
 * CORS/cookie issues         -> wrong domain, sameSite, secure settings.
 */
