/**
 * ## Quick revision
 *
 * - Working tree — current edits; staging — next commit ka selected snapshot.
 * - Commit — tracked changes ka local snapshot.
 * - Branch — commit ka movable pointer; alag work isolate karo.
 * - `fetch` — remote refs lao; `pull` — fetch ke baad integration.
 * - Merge — histories combine; rebase — commits nayi base par replay.
 * - Conflict — final intended content resolve karo, phir verify aur continue.
 * - `revert` — undo ka naya commit; shared history ke liye useful.
 * - `reset` — branch/index/worktree badal sakta hai; mode samajhkar use karo.
 * - `.gitignore` — already tracked file ko untrack nahi karta.
 * - Review — commit se pehle `git diff` aur staged diff padho.
 * - Deploy — same tested artifact promote; environment config external rakho.
 * - Readiness — ready instance ko traffic; graceful shutdown par drain.
 * - Monitoring — errors, latency aur saturation; rollback trigger define.
 * - `stash` — temporary local changes side mein; long-term backup ka replacement nahi.
 * - `cherry-pick` — selected commit ka change current branch par apply.
 * - `reflog` — local ref movement history; misplaced commit locate karne mein useful.
 */

'use strict';


// git init
// git status
// git add .
// git commit -m "Initial commit"
// git remote add origin <repo-url>
// git push -u origin main


// node_modules/
// config.env
// npm-debug.log
// .DS_Store


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


// app.enable('trust proxy');


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
