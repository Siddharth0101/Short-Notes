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
 * - DNS/TLS — address resolve aur encrypted connection establish.
 * - REST — resources + HTTP methods/status; stateless request contract.
 * - Cookies/session — browser credential transport aur server identity state alag concepts.
 * - Proxy — client/server ke beech routing, TLS, caching ya protection layer.
 * - EventEmitter — listeners synchronous call ho sakte hain; emit ko automatic async mat samjho.
 * - Client disconnect — abandoned response ke database/stream work ko cancel/close karo.
 * - CPU saturation — event-loop delay measure; heavy computation ko bounded worker execution do.
 */

'use strict';


const exampleRequest = {
    method: 'POST',
    path: '/api/v1/tours',
    headers: {
        'content-type': 'application/json',
        authorization: 'Bearer token'
    },
    body: {
        name: 'The Forest Hiker',
        price: 397
    }
};

console.log(exampleRequest.method);


const successResponse = {
    status: 'success',
    results: 2,
    data: {
        tours: []
    }
};

const failResponse = {
    status: 'fail',
    message: 'Invalid input data'
};

console.log(successResponse.status, failResponse.status);
