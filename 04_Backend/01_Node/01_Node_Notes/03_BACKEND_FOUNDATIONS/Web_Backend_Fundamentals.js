'use strict';

/**
 * ========================================================================
 * BACK-END WEB DEVELOPMENT - SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Backend ka kaam browser/app ke request ka response banana hai.
 * - Backend usually data, auth, business logic, file handling, payments,
 *   emails, and security manage karta hai.
 */


/**
 * ========================================================================
 * 1. HOW THE WEB WORKS
 * ========================================================================
 * NOTES:
 * - Browser URL enter karta hai.
 * - DNS domain ko IP address me convert karta hai.
 * - Client server se TCP connection banata hai.
 * - HTTPS me TLS encryption layer add hoti hai.
 * - Browser HTTP request bhejta hai.
 * - Server HTTP response bhejta hai.
 */


/**
 * ========================================================================
 * 2. HTTP REQUEST
 * ========================================================================
 * NOTES:
 * - Request line: method + path + HTTP version.
 * - Headers: metadata.
 * - Body: POST/PATCH data.
 *
 * COMMON METHODS:
 * - GET    -> read data.
 * - POST   -> create data.
 * - PATCH  -> partially update data.
 * - PUT    -> replace full resource.
 * - DELETE -> delete data.
 */

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


/**
 * ========================================================================
 * 3. HTTP RESPONSE
 * ========================================================================
 * NOTES:
 * - Status code tells result.
 * - Headers tell content type, caching, cookies, security info.
 * - Body contains HTML, JSON, image, file, etc.
 *
 * COMMON STATUS CODES:
 * - 200 OK
 * - 201 Created
 * - 204 No Content
 * - 400 Bad Request
 * - 401 Unauthorized
 * - 403 Forbidden
 * - 404 Not Found
 * - 500 Internal Server Error
 */


/**
 * ========================================================================
 * 4. FRONTEND VS BACKEND
 * ========================================================================
 * FRONTEND:
 * - UI and user interaction.
 * - HTML/CSS/JS in browser.
 * - Sends requests, displays responses.
 *
 * BACKEND:
 * - Server-side app.
 * - Talks to database.
 * - Validates data.
 * - Authenticates users.
 * - Sends JSON/HTML/files.
 */


/**
 * ========================================================================
 * 5. STATIC VS DYNAMIC VS API
 * ========================================================================
 * STATIC WEBSITE:
 * - Same HTML/CSS/JS files for everyone.
 * - Server sirf files bhejta hai.
 *
 * DYNAMIC WEBSITE:
 * - Server data ke basis pe HTML generate karta hai.
 * - Example: logged-in user dashboard.
 *
 * API:
 * - Server JSON data send karta hai.
 * - Frontend/mobile app khud UI render karta hai.
 */


/**
 * ========================================================================
 * 6. REST API DESIGN
 * ========================================================================
 * NOTES:
 * - REST resource-based URLs use karta hai.
 * - URL me nouns rakho, verbs nahi.
 * - Action HTTP method se clear hota hai.
 *
 * GOOD:
 * - GET /api/v1/tours
 * - POST /api/v1/tours
 * - PATCH /api/v1/tours/5
 *
 * BAD:
 * - /getTours
 * - /createNewTour
 * - /deleteTourById
 */


/**
 * ========================================================================
 * 7. STATELESS API
 * ========================================================================
 * NOTES:
 * - Har request apne aap me complete honi chahiye.
 * - Server previous request ka client state yaad nahi rakhta.
 * - Auth token/cookie request ke saath bhejna padta hai.
 *
 * BENEFIT:
 * - Scaling easy hota hai because any server can handle any request.
 */


/**
 * ========================================================================
 * 8. JSON AND JSEND
 * ========================================================================
 * NOTES:
 * - Backend APIs mostly JSON return karte hain.
 * - JSend ek response format convention hai.
 */

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


/**
 * ========================================================================
 * 9. SERVER-SIDE RENDERING VS CLIENT-SIDE RENDERING
 * ========================================================================
 * SSR:
 * - Server HTML ready karke bhejta hai.
 * - Good first load, SEO, traditional websites.
 *
 * CSR:
 * - Server JSON bhejta hai, browser JS UI banata hai.
 * - Good app-like UX.
 *
 * NATOURS:
 * - REST API + SSR website dono banaye jaate hain.
 */
