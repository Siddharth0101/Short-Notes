'use strict';

/**
 * ========================================================================
 * HOW THE WEB WORKS — COMPLETE GUIDE (Frontend + Backend Perspective)
 * ========================================================================
 * NOTES:
 * - Web basically ek communication system hai jo 2 computers ke beech kaam karta hai:
 *   Ek "CLIENT" (aapka browser/phone) aur ek "SERVER" (powerful computer jahan 
 *   website ka data stored hai).
 * - Client hamesha REQUEST bhejta hai (jaise restaurant me customer order deta hai).
 * - Server us request ko process karke RESPONSE wapas bhejta hai (jaise waiter 
 *   khana laakar deta hai).
 * - Ye saara communication INTERNET ke through hota hai — wires, cables, satellites 
 *   sab milke kaam karte hain.
 * 
 * REAL LIFE ANALOGY:
 * - Sochlo aap ek restaurant me ho (Internet).
 * - Aap = Client (jo order de raha hai).
 * - Kitchen = Server (jo khana bana raha hai).
 * - Waiter = HTTP Protocol (jo order le jaata hai aur khana wapas laata hai).
 * - Menu Card = DNS (jo aapko batata hai kya available hai aur kahan milega).
 */


/**
 * ========================================================================
 * 1. THE CLIENT-SERVER MODEL (Web ka Foundation)
 * ========================================================================
 * NOTES:
 * - Ye web ka sabse basic architecture hai. Har website isi model pe chalti hai.
 * 
 * CLIENT (Frontend):
 * - Wo device/software jo request bhejta hai.
 * - Examples: Chrome, Firefox, Safari, Mobile Apps, Postman.
 * - Client ka kaam: User se input lena, server ko request bhejna, response ko 
 *   render karke dikhana.
 * 
 * SERVER (Backend):
 * - Wo powerful computer jo 24/7 chalta hai aur requests ka wait karta hai.
 * - Jab request aati hai, server usse process karta hai (database se data nikalta 
 *   hai, calculations karta hai) aur response bhejta hai.
 * - Examples: Google ke servers, Amazon AWS, aapka local Node.js server.
 * 
 * IMPORTANT POINT:
 * - Ek server BAHUT saare clients ko ek saath handle kar sakta hai.
 * - Jaise Google ka ek server millions of users ki requests ek saath process karta hai.
 * - Client hamesha pehle baat shuru karta hai (request bhejta hai). 
 *   Server kabhi khud se client ko data nahi bhejta (unless WebSockets/SSE use ho).
 * 
 * FLOW:
 * Client  ----REQUEST---->  Server
 * Client  <---RESPONSE----  Server
 */


/**
 * ========================================================================
 * 2. IP ADDRESS & DOMAIN NAMES
 * ========================================================================
 * 
 * A) IP ADDRESS (Internet Protocol Address):
 * - Internet par har device (computer, phone, server) ka ek UNIQUE NUMBER hota hai.
 * - Ye Internet ka "Ghar ka Pata" ya "Phone Number" hai.
 * - Computers sirf numbers samajhte hain, naam nahi.
 * 
 * 2 Types of IP:
 * - IPv4: 4 numbers dot se separated → 192.168.1.1 (ye purana format hai, limited addresses)
 * - IPv6: Bahut lamba → 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (naya format, unlimited addresses)
 * 
 * Special IPs jo yaad rakhne chahiye:
 * - 127.0.0.1     → "localhost" (aapka apna computer, khud se khud ko request)
 * - 0.0.0.0       → Sabhi available network interfaces
 * - 192.168.x.x   → Private/Local network (aapke ghar ka Wi-Fi)
 * 
 * B) DOMAIN NAME:
 * - Insaan lambe IP addresses yaad nahi rakh sakte (kaun yaad rakhega 142.250.190.46?)
 * - Isliye humne IP ko ek aasaan naam de diya → DOMAIN NAME.
 * - Example: "google.com" ek domain hai, jiske peeche IP 142.250.190.46 chupa hai.
 * 
 * DOMAIN KE PARTS:
 * - "www.mail.google.com" ko tod ke dekhte hain:
 *   .com       → TLD (Top Level Domain) — category batata hai
 *   google     → SLD (Second Level Domain) — actual website naam
 *   mail       → Subdomain — website ka ek section
 *   www        → Subdomain — historically "World Wide Web"
 * 
 * COMMON TLDs:
 * - .com → Commercial (sabse common, general purpose)
 * - .org → Organization (non-profit)
 * - .net → Network (technical sites)
 * - .in  → India (country specific)
 * - .dev → Developers ke liye
 * - .io  → Tech startups me popular
 */


/**
 * ========================================================================
 * 3. DNS — DOMAIN NAME SYSTEM (Internet ki Phonebook)
 * ========================================================================
 * NOTES:
 * - DNS ka kaam hai Domain Name (google.com) ko IP Address (142.250.190.46) me 
 *   TRANSLATE karna. Kyunki computers sirf numbers samajhte hain.
 * - Sochlo jaise aapke phone me Contact List hai — aap naam se call karte ho, 
 *   par phone internally number dial karta hai. DNS bhi yehi karta hai.
 * 
 * DNS LOOKUP PROCESS (Step by Step — Interview me poochte hain!):
 * Jab aap browser me type karte ho: www.google.com
 * 
 * STEP 1: BROWSER CACHE (Kya browser ko pehle se pata hai?)
 *    - Browser pehle apni memory (cache) check karta hai.
 *    - Agar aapne kuch der pehle google khola tha, to browser ko IP yaad hogi.
 *    - Yaad hai → Seedha connection! Cache me nahi mila → aage badhte hain.
 * 
 * STEP 2: OS CACHE (Kya computer ko pata hai?)
 *    - Browser ne OS (Windows/Mac/Linux) se pucha.
 *    - OS apni DNS cache check karta hai.
 *    - Windows me: ipconfig /displaydns se dekh sakte ho.
 *    - OS ke paas bhi nahi hai → aage!
 * 
 * STEP 3: ISP RESOLVER (Internet Provider se puchho)
 *    - Ab request aapke ISP (Jio/Airtel/BSNL) ke DNS Server pe jati hai.
 *    - Isko "Recursive Resolver" kehte hain — ye aapka PERSONAL ASSISTANT hai.
 *    - Ye aage jaake poore internet me dhundhega aapke liye.
 *    - ISP ke cache me hai → done! Nahi hai → aage!
 * 
 * STEP 4: DNS HIERARCHY (3 Level ki khoj!)
 * 
 *    A) ROOT Name Server (The Librarian):
 *       - Internet me sirf 13 Root Servers hain (a.root-servers.net to m.root-servers.net).
 *       - Resolver puchta hai: "google.com kahan hai?"
 *       - Root Server bolta hai: "Exact mujhe nahi pata, par .com hai to .com wale 
 *         TLD server se pucho. Ye lo unka address."
 * 
 *    B) TLD Server (Top Level Domain — .com, .in, .net):
 *       - Ab resolver .com TLD server ke paas jata hai.
 *       - TLD bolta hai: "google.com? Uska Authoritative Server ye hai, unse pucho."
 * 
 *    C) AUTHORITATIVE Name Server (The Final Boss):
 *       - Ye Google ka apna DNS server hai.
 *       - Isko EXACTLY pata hai ki google.com ka IP kya hai.
 *       - Wo kehta hai: "142.250.190.46 — ye lo!"
 * 
 * STEP 5: RESPONSE WAPAS AANA
 *    - IP milti hai → Resolver tak aati hai.
 *    - Resolver future ke liye CACHE me save kar leta hai (TTL — Time To Live tak).
 *    - Phir OS ko deta hai → OS browser ko deta hai.
 *    - Ab browser ke paas server ka exact address aa gaya!
 * 
 * DNS RECORD TYPES (Important for Backend devs):
 * - A Record     → Domain ko IPv4 address se map karta hai (google.com → 142.250.190.46)
 * - AAAA Record  → Domain ko IPv6 address se map karta hai
 * - CNAME Record → Domain ko doosre domain se point karta hai (www.google.com → google.com)
 * - MX Record    → Email server ka address (Gmail kahan hai mail ke liye)
 * - NS Record    → Kaunsa Name Server responsible hai is domain ke liye
 * - TXT Record   → Text info store karta hai (verification, SPF records)
 */


/**
 * ========================================================================
 * 4. URL — UNIFORM RESOURCE LOCATOR (Web ka Address Format)
 * ========================================================================
 * NOTES:
 * - URL ek address hai jo exactly batata hai ki internet pe koi cheez KAHAN hai.
 * - Har URL ke multiple parts hote hain. Ek example se samjhte hain:
 * 
 * EXAMPLE: https://www.google.com:443/search?q=javascript&lang=en#results
 * 
 * BREAKDOWN:
 * ┌──────────┬─────┬───────────┬─────┬────────┬─────────────────────┬──────────┐
 * │ Protocol │ Sub │  Domain   │Port │  Path  │    Query String     │ Fragment │
 * │ https:// │ www │google.com │:443 │/search │?q=javascript&lang=en│#results  │
 * └──────────┴─────┴───────────┴─────┴────────┴─────────────────────┴──────────┘
 * 
 * 1. PROTOCOL (Scheme) → "https://"
 *    - Connection ke rules batata hai.
 *    - http://  → Normal (unsecure, data plain text me jata hai)
 *    - https:// → Secure (data encrypted hoke jata hai, padh nahi sakte beech me)
 *    - ftp://   → File Transfer Protocol (files upload/download ke liye)
 * 
 * 2. SUBDOMAIN → "www"
 *    - Domain ka ek specific section.
 *    - www → World Wide Web (historically, ab optional hai)
 *    - mail.google.com → Google ka mail section
 *    - docs.google.com → Google ka docs section
 *    - api.example.com → API server (common in backend)
 * 
 * 3. DOMAIN NAME → "google.com"
 *    - Website ka human-readable naam + TLD.
 * 
 * 4. PORT NUMBER → ":443"
 *    - Server ke kis DARWAZE (door) pe jana hai.
 *    - Ek server me bahut saari services chalti hain, port batata hai kaunsi service.
 *    - Default ports (isliye URL me dikhte nahi usually):
 *      HTTP  → Port 80
 *      HTTPS → Port 443
 *    - Development me:
 *      React/Vite → Port 3000 ya 5173
 *      Node.js    → Port 3000 ya 8080
 *      MongoDB    → Port 27017
 * 
 * 5. PATH (Route) → "/search"
 *    - Server ke andar KAUNSA page ya resource chahiye.
 *    - /          → Home page
 *    - /about     → About page
 *    - /api/users → API endpoint (backend)
 *    - /images/logo.png → Specific file
 * 
 * 6. QUERY STRING (Parameters) → "?q=javascript&lang=en"
 *    - Server ko extra data bhejna ho to query string use hoti hai.
 *    - ? se shuru hoti hai, key=value pair me hota hai, & se multiple jodti hai.
 *    - ?q=javascript → search query "javascript"
 *    - &lang=en      → language "english"
 *    - Backend me req.query se access hota hai (Express.js)
 * 
 * 7. FRAGMENT (Hash) → "#results"
 *    - Page ke andar KAUNSE section pe scroll karna hai.
 *    - Ye SIRF client-side hai! Server ko ye kabhi nahi bheja jata.
 *    - Browser isko page load hone ke baad use karta hai scroll ke liye.
 *    - React Router me bhi # use hota hai (HashRouter).
 */


/**
 * ========================================================================
 * 5. PROTOCOLS — Rules of Communication
 * ========================================================================
 * NOTES:
 * - Protocol ka matlab hai "NIYAM" (Rules). 
 * - Jaise 2 insaan baat karte hain to ek language follow karte hain, 
 *   waise computers bhi protocols follow karte hain.
 * 
 * A) TCP/IP (Transmission Control Protocol / Internet Protocol):
 *    - Ye internet ka SABSE FUNDAMENTAL protocol hai. Bina iske internet chale hi nahi.
 *    
 *    IP (Internet Protocol):
 *    - Data ko sahi ADDRESS (IP Address) tak pahunchata hai.
 *    - Jaise letter pe address likha hota hai — IP wahi kaam karta hai.
 *    
 *    TCP (Transmission Control Protocol):
 *    - Bada data ek saath nahi jata. TCP data ko chhote-chhote PACKETS me todta hai.
 *    - Har packet independently travel karta hai (alag-alag raaste se bhi ja sakta hai).
 *    - Server pe pahunchne pe TCP packets ko WAPAS SAHI ORDER me jodta hai.
 *    - Agar koi packet raste me KHOYE to TCP dubara request karta hai (reliable delivery).
 *    
 *    EXAMPLE:
 *    - Sochlo ek 10MB photo bhejna hai.
 *    - TCP usse 100 chhote packets (100KB each) me todega.
 *    - Har packet apna raasta lega internet me.
 *    - Server pe pahunchke sab packets wapas jud ke photo ban jayega.
 *    - Agar packet #47 nahi aaya → TCP bola "Bhai #47 dubara bhejo!"
 * 
 * B) UDP (User Datagram Protocol):
 *    - TCP ka fast but UNRELIABLE cousin.
 *    - Packets bhejta hai but CHECK NAHI karta ki pahunche ya nahi.
 *    - Koi packet gum ho jaye? UDP bola "Mujhe farak nahi padta!"
 *    - USE CASE: Video calls (Zoom), Live streaming, Online gaming.
 *    - Kyunki in me thoda data loss chalega but SPEED chahiye.
 *    - TCP (Reliable + Slow) vs UDP (Fast + Unreliable)
 */


/**
 * ========================================================================
 * 6. TCP 3-WAY HANDSHAKE (Connection banane ka tariqa)
 * ========================================================================
 * NOTES:
 * - Data bhejna shuru karne se PEHLE, Client aur Server ek doosre se formally 
 *   "Hello" bolte hain taaki confirm ho ki dono ready hain.
 * - Ye 3 steps me hota hai — isliye "3-Way Handshake" kehte hain.
 * 
 * STEP 1: SYN (Synchronize)
 *    Client → Server: "Hello Server! Kya tum ready ho? Mujhe connection banana hai."
 *    (Client SYN packet bhejta hai ek random sequence number ke saath)
 * 
 * STEP 2: SYN-ACK (Synchronize + Acknowledge)
 *    Server → Client: "Haan bhai! Main ready hu. Banaate hain connection!"
 *    (Server SYN-ACK bhejta hai — acknowledge + apna sequence number)
 * 
 * STEP 3: ACK (Acknowledge)
 *    Client → Server: "Theek hai! Ab data bhejna shuru karta hu."
 *    (Client ACK bhejta hai — ab connection ESTABLISHED ho gaya)
 * 
 * DIAGRAM:
 *    Client                    Server
 *      |                         |
 *      |--- SYN (seq=100) ------>|   Step 1: "Baat karni hai?"
 *      |                         |
 *      |<-- SYN-ACK (seq=300, ---|   Step 2: "Haan, chalo!"
 *      |    ack=101)             |
 *      |                         |
 *      |--- ACK (ack=301) ------>|   Step 3: "Done! Shuru karte hain"
 *      |                         |
 *      |=== CONNECTION READY ====|   Ab data bhej sakte hain!
 * 
 * CONNECTION CLOSE (4-Way Handshake):
 * - Jab kaam khatam hota hai to connection close bhi properly hota hai:
 *   1. Client → FIN       ("Main done hu")
 *   2. Server → ACK       ("Theek hai, wait karo")
 *   3. Server → FIN       ("Main bhi done hu")
 *   4. Client → ACK       ("Bye!")
 */


/**
 * ========================================================================
 * 7. HTTP & HTTPS (HyperText Transfer Protocol)
 * ========================================================================
 * NOTES:
 * - Jab TCP connection ban jata hai, tab HTTP batata hai ki DATA kaise format 
 *   hoke jayega aur aayega.
 * - HTTP = Web ka LANGUAGE hai. Client kaise bole, Server kaise jawab de — sab 
 *   HTTP decide karta hai.
 * 
 * HTTP KEY FEATURES:
 * 
 * 1. STATELESS (Bhoolakkad):
 *    - HTTP ko memory nahi! Har nayi request uske liye PEHLI BAAR jaisi hai.
 *    - Pichli request me kya hua tha? HTTP ko yaad nahi.
 *    - Isliye humein state manage karne ke liye extra tools chahiye:
 *      Cookies, Sessions, JWT Tokens, LocalStorage
 *    - Example: Login karne ke baad bhi har request me token bhejna padta hai 
 *      kyunki server bhool jaata hai ki "ye login ho chuka hai."
 * 
 * 2. REQUEST-RESPONSE MODEL:
 *    - Client ek REQUEST bhejta hai.
 *    - Server ek RESPONSE deta hai.
 *    - Ek request = ek response. Bas. Done.
 *    - Server khud se client ko data nahi bhej sakta (unless WebSockets).
 * 
 * 3. TEXT-BASED:
 *    - HTTP messages plain text me hote hain (human readable bhi hai).
 *    - Data binary me nahi, text format me travel karta hai.
 * 
 * HTTPS (HTTP + Secure):
 * - HTTP me data PLAIN TEXT me jata hai — hackers beech me padh sakte hain!
 * - HTTPS me TLS/SSL ENCRYPTION hota hai.
 * - Data encrypted (coded) hoke jata hai — hacker intercept kare bhi to kachra dikhega.
 * 
 * TLS/SSL HANDSHAKE (HTTPS me extra step):
 * - TCP handshake ke BAAD, actual data bhejne se PEHLE ye hota hai:
 *   1. Client bolta hai: "Mujhe secure connection chahiye, ye versions support karta hu."
 *   2. Server SSL Certificate bhejta hai (ye mera pehchaan patra hai, trusted hu main).
 *   3. Client certificate verify karta hai (sahi hai? Expired to nahi? Trusted CA ne issue kiya hai?)
 *   4. Dono ek shared SECRET KEY banate hain (Diffie-Hellman algorithm se).
 *   5. Ab se saara data is key se ENCRYPTED hoke jayega — beech me koi padh nahi payega.
 * 
 * HTTP VERSIONS:
 * - HTTP/1.0 → Har request ke liye NAYA connection (bahut slow)
 * - HTTP/1.1 → Keep-Alive: ek connection me MULTIPLE requests (current standard)
 * - HTTP/2   → Multiplexing: ek connection me SIMULTANEOUSLY bahut requests (fast!)
 * - HTTP/3   → UDP-based (QUIC protocol), even faster, newer standard
 */


/**
 * ========================================================================
 * 8. HTTP METHODS (Request ka Type — kya karna hai?)
 * ========================================================================
 * NOTES:
 * - Jab client server ko request bhejta hai to usse batana padta hai 
 *   ki "kya KARNA hai?" — GET karna hai, POST karna hai, DELETE karna hai?
 * - Ye HTTP METHODS kehlaate hain.
 * 
 * IMPORTANT METHODS:
 * 
 * | Method  | Kya karta hai?                  | Body?  | Idempotent? | Safe?  |
 * |---------|---------------------------------|--------|-------------|--------|
 * | GET     | Data LENA (Read/Fetch)          | Nahi   | Haan        | Haan   |
 * | POST    | Naya data BANANA (Create)       | Haan   | Nahi        | Nahi   |
 * | PUT     | Pura data REPLACE karna (Update)| Haan   | Haan        | Nahi   |
 * | PATCH   | Partial data UPDATE karna       | Haan   | Nahi        | Nahi   |
 * | DELETE  | Data MITANA (Delete)            | Nahi   | Haan        | Nahi   |
 * | HEAD    | GET jaisa but sirf Headers      | Nahi   | Haan        | Haan   |
 * | OPTIONS | Server se puchho kya support hai| Nahi   | Haan        | Haan   |
 * 
 * TERMS SAMJHO:
 * - Idempotent: Ek baar karo ya 10 baar karo — result SAME rahega.
 *   GET /users → 10 baar karo, same list aayegi.
 *   DELETE /users/5 → pehli baar delete hoga, baaki baar kuch nahi hoga. Same result.
 *   POST /users → 10 baar karo, 10 NEW users ban jayenge! (Isliye POST idempotent NAHI hai)
 * 
 * - Safe: Server ka data CHANGE nahi karta. GET safe hai (sirf read).
 *   POST/PUT/DELETE safe NAHI hain (data modify karte hain).
 * 
 * CRUD MAPPING:
 * - Create → POST
 * - Read   → GET
 * - Update → PUT / PATCH
 * - Delete → DELETE
 */


/**
 * ========================================================================
 * 9. HTTP REQUEST & RESPONSE STRUCTURE
 * ========================================================================
 * 
 * A) HTTP REQUEST (Client → Server):
 * Isme 3 parts hote hain:
 * 
 * 1. REQUEST LINE (Status Line):
 *    METHOD + PATH + HTTP Version
 *    Example: "GET /api/users HTTP/1.1"
 * 
 * 2. HEADERS (Meta-data):
 *    Key-value pairs jo extra info dete hain:
 *    - Host: google.com                    (kaunse server ko)
 *    - User-Agent: Chrome/120              (kaunsa browser bhej raha)
 *    - Accept: application/json            (kaunse format me data chahiye)
 *    - Content-Type: application/json      (body me kaunsa format bhej rahe)
 *    - Authorization: Bearer eyJhbGci...   (login token)
 *    - Cookie: session_id=abc123           (stored cookies)
 * 
 * 3. BODY (Optional — sirf POST/PUT/PATCH me):
 *    Actual data jo bhejna hai:
 *    { "name": "Sidd", "email": "sidd@gmail.com" }
 *    (GET aur DELETE me body usually EMPTY hoti hai)
 */

// HTTP REQUEST EXAMPLE (Visual):
// ┌─────────────────────────────────────────────┐
// │ POST /api/users HTTP/1.1                    │  ← Request Line
// │                                             │
// │ Host: api.example.com                       │  ← Headers
// │ Content-Type: application/json              │
// │ Authorization: Bearer my-token-here         │
// │                                             │
// │ {                                           │  ← Body
// │   "name": "Siddharth",                      │
// │   "email": "sidd@gmail.com"                 │
// │ }                                           │
// └─────────────────────────────────────────────┘

/**
 * B) HTTP RESPONSE (Server → Client):
 * Isme bhi 3 parts hote hain:
 * 
 * 1. STATUS LINE:
 *    HTTP Version + Status Code + Status Message
 *    Example: "HTTP/1.1 200 OK"
 * 
 * 2. HEADERS:
 *    - Content-Type: text/html           (response kaunse format me hai)
 *    - Content-Length: 3456              (response kitna bada hai bytes me)
 *    - Set-Cookie: session_id=xyz       (browser me cookie set karo)
 *    - Cache-Control: max-age=3600      (1 hour tak cache me rakh lo)
 *    - Access-Control-Allow-Origin: *   (CORS header — kaun access kar sakta hai)
 * 
 * 3. BODY:
 *    Actual data jo server bhej raha hai:
 *    - HTML page (browser render karega)
 *    - JSON data (API response)
 *    - Image/File binary data
 */

// HTTP RESPONSE EXAMPLE (Visual):
// ┌─────────────────────────────────────────────┐
// │ HTTP/1.1 200 OK                             │  ← Status Line
// │                                             │
// │ Content-Type: application/json              │  ← Headers
// │ Cache-Control: no-cache                     │
// │                                             │
// │ {                                           │  ← Body
// │   "status": "success",                      │
// │   "data": {                                 │
// │     "id": 1,                                │
// │     "name": "Siddharth"                     │
// │   }                                         │
// │ }                                           │
// └─────────────────────────────────────────────┘


/**
 * ========================================================================
 * 10. HTTP STATUS CODES (Server ka jawab — kya hua?)
 * ========================================================================
 * NOTES:
 * - Har response ke saath ek NUMBER aata hai jo batata hai ki request ka kya hua.
 * - Ye numbers 5 categories me divided hain. INTERVIEW ME ZAROOR POOCHTE HAIN!
 * 
 * 1xx — INFORMATIONAL (Processing ho rahi hai, wait karo)
 *    100 Continue         → "Server ne request ka pehla part dekh liya, baaki bhi bhejo"
 *    101 Switching Proto  → "Protocol change ho raha hai (jaise HTTP se WebSocket me)"
 * 
 * 2xx — SUCCESS (Sab theek ho gaya!)
 *    200 OK              → "Request successful! Ye lo data."
 *    201 Created         → "Naya resource BAN gaya!" (POST ke baad)
 *    204 No Content      → "Kaam ho gaya, par body me kuch bhejne layaq nahi." (DELETE ke baad)
 * 
 * 3xx — REDIRECTION (Jagah badal gayi, doosri jagah jao)
 *    301 Moved Permanently → "URL hamesha ke liye badal gaya. Naye pe jao."
 *    302 Found (Temporary) → "Abhi ke liye doosri jagah redirect ho raha."
 *    304 Not Modified      → "Data wahi hai, cache se utha lo. Server se dubara download mat karo."
 * 
 * 4xx — CLIENT ERROR (Tumhari galti hai! Request me problem hai)
 *    400 Bad Request    → "Request ka format galat hai. Sahi data bhejo." (validation fail)
 *    401 Unauthorized   → "Pehle LOGIN karo! Token/password missing ya galat hai."
 *    403 Forbidden      → "Login ho but PERMISSION nahi hai. Access denied."
 *    404 Not Found      → "Ye URL/Route exist hi nahi karta server pe."
 *    405 Method Not Allowed → "Is route pe ye method (DELETE etc.) allowed nahi."
 *    408 Request Timeout → "Bahut der laga di request bhejne me."
 *    409 Conflict       → "Data me conflict hai (jaise duplicate email)."
 *    422 Unprocessable  → "Data format sahi hai par logically galat hai."
 *    429 Too Many Req   → "Bahut zyada requests bhej di! Rate limit hit kiya."
 * 
 * 5xx — SERVER ERROR (Server ki galti hai! Backend me problem)
 *    500 Internal Server Error → "Server ka code crash ho gaya. Backend error."
 *    502 Bad Gateway          → "Server ne doosre server se galat response paya."
 *    503 Service Unavailable  → "Server overloaded hai ya maintenance me hai."
 *    504 Gateway Timeout      → "Server ne doosre server ka wait kiya, timeout ho gaya."
 * 
 * YAAD RAKHNE KA TRICK:
 * - 1xx = "Wait"
 * - 2xx = "Yay!"
 * - 3xx = "Go there"
 * - 4xx = "Your fault"
 * - 5xx = "My fault" (Server ka)
 */


/**
 * ========================================================================
 * 11. COOKIES, SESSIONS & TOKENS (State Management — HTTP bhoolakkad hai)
 * ========================================================================
 * NOTES:
 * - HTTP STATELESS hai — server ko yaad nahi ki pichli request kisne bheji thi.
 * - Par hume chahiye ki server pehchaane: "ye wahi user hai jo login kar chuka hai."
 * - Isliye 3 tarike hain state manage karne ke:
 * 
 * A) COOKIES:
 *    - Chhota sa text data jo SERVER browser me STORE karwata hai.
 *    - Har request ke saath cookies AUTOMATICALLY server ko wapas jaati hain.
 *    - Server Set-Cookie header se cookie set karta hai.
 *    - Use: Session IDs store karna, preferences, tracking.
 *    - Limitations: Sirf 4KB data, domain-specific, XSS/CSRF attacks ka risk.
 * 
 * B) SESSIONS:
 *    - Server-side storage. Server ek unique SESSION ID banata hai.
 *    - Wo ID cookie me browser ko bhej deta hai.
 *    - Har request me browser ye ID bhejta hai → Server apni memory me dekhta hai 
 *      ki is ID ka user kaun hai, kya data hai.
 *    - Pros: Secure (actual data server pe hai), large data store ho sakta.
 *    - Cons: Server ki memory use hoti hai, scaling mushkil.
 * 
 * C) JWT (JSON Web Token):
 *    - Ek SELF-CONTAINED token jo user ki info andar le ke chalta hai (encrypted).
 *    - Server token banata hai → Client ko bhejta hai → Client har request me bhejta.
 *    - Server token ko DECODE karke verify karta hai (database check zaruri nahi).
 *    - Structure: HEADER.PAYLOAD.SIGNATURE (3 parts, dot se separated).
 *    - Pros: Stateless (server ko kuch store nahi karna), scalable.
 *    - Cons: Token bada hota hai, revoke karna mushkil (expire hone ka wait).
 */


/**
 * ========================================================================
 * 12. CORS — Cross-Origin Resource Sharing
 * ========================================================================
 * NOTES:
 * - Browser ek SECURITY feature lagata hai: Ek website doosri website ka data 
 *   directly access nahi kar sakti. Isko "Same-Origin Policy" kehte hain.
 * 
 * - ORIGIN kya hai? → Protocol + Domain + Port
 *   "https://example.com:443" → ye ek origin hai.
 *   Agar inmein se KUCH BHI alag ho → Cross-Origin hai.
 * 
 * SAME ORIGIN Examples:
 *   https://example.com/page1  →  https://example.com/page2     (SAME origin)
 * 
 * CROSS ORIGIN Examples:
 *   https://example.com  →  https://api.example.com    (Subdomain alag = CROSS)
 *   http://example.com   →  https://example.com        (Protocol alag = CROSS)
 *   https://example.com  →  https://example.com:8080   (Port alag = CROSS)
 * 
 * - Jab frontend (localhost:3000) backend (localhost:8080) se data maange → 
 *   Browser CORS ERROR deta hai!
 * 
 * FIX: Server ko headers bhejne padte hain:
 *   Access-Control-Allow-Origin: * (ya specific origin)
 *   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
 *   Access-Control-Allow-Headers: Content-Type, Authorization
 * 
 * PREFLIGHT REQUEST:
 * - Kuch requests (POST with JSON, custom headers) me browser PEHLE ek OPTIONS 
 *   request bhejta hai server ko "permission lene ke liye." Isko PREFLIGHT kehte hain.
 * - Server OPTIONS ka response deta hai: "Haan, allowed hai" → phir actual request jati hai.
 */


/**
 * ========================================================================
 * 13. CACHING (Data ko fast access ke liye save karna)
 * ========================================================================
 * NOTES:
 * - Bar bar same data server se laana = SLOW + expensive.
 * - Caching matlab: ek baar laao, save karo, agle baar saved copy se do.
 * 
 * TYPES OF CACHE:
 * 
 * 1. BROWSER CACHE:
 *    - Browser images, CSS, JS files locally save karta hai.
 *    - Agle baar page khologe to downloaded se instant load hoga.
 *    - Cache-Control header se control hota hai:
 *      Cache-Control: max-age=3600 → 1 hour tak cache se dena, server pe mat jana.
 *      Cache-Control: no-cache     → Har baar server se verify karo (304 check).
 *      Cache-Control: no-store     → Kuch bhi cache mat karo (sensitive data).
 * 
 * 2. CDN CACHE (Content Delivery Network):
 *    - Duniya bhar me distributed servers jo static content serve karte hain.
 *    - India me ho aur US ka server hai? CDN ki wajah se India ke nearby server se milega.
 *    - Examples: Cloudflare, AWS CloudFront, Akamai.
 *    - Images, videos, CSS, JS → CDN se FAST milte hain.
 * 
 * 3. SERVER CACHE:
 *    - Backend frequently accessed data ko memory (Redis, Memcached) me rakhta hai.
 *    - Har baar database me jaane se bacha jaata hai.
 *    - Example: "Top 10 Products" → har baar DB query? Nahi! Cache me rakh do.
 */


/**
 * ========================================================================
 * 14. THE MASTER QUESTION: "BROWSER ME URL TYPE KARNE SE PAGE DIKHNE TAK KYA HOTA HAI?"
 * ========================================================================
 * NOTES:
 * - Ye Interview ka SABSE FAMOUS question hai. Agar ye properly explain kar diya 
 *   to interviewer impress ho jayega!
 * 
 * STEP 1: URL PARSING
 * - Browser check karta hai ki aapne kya likha — "Search Query" hai ya "URL"?
 * - Agar URL hai to usse parse karta hai: Protocol, Domain, Path alag nikalta hai.
 * - Agar sirf "google" likha to search engine ki query bana deta hai.
 * 
 * STEP 2: DNS LOOKUP (IP dhundho)
 * - Browser ko server ka IP address chahiye.
 * - Check: Browser Cache → OS Cache → ISP Resolver → DNS Hierarchy
 * - IP mil gayi! (jaise 142.250.190.46)
 * 
 * STEP 3: TCP CONNECTION (3-Way Handshake)
 * - Browser IP address pe TCP connection banata hai.
 * - SYN → SYN-ACK → ACK (3-Way Handshake)
 * - Connection established!
 * 
 * STEP 4: TLS/SSL HANDSHAKE (Agar HTTPS hai)
 * - TCP ke baad encryption ka handshake hota hai.
 * - Certificates verify, keys exchange, secure channel ready!
 * 
 * STEP 5: HTTP REQUEST BHEJNA
 * - Browser ek formatted GET request bhejta hai server ko.
 * - Request me: Method, Path, Headers, Cookies sab included.
 * 
 * STEP 6: SERVER PROCESSING
 * - Server request receive karta hai.
 * - Backend application (Node.js/Django/Java) request ko process karta hai.
 * - Database se data nikalta hai agar zaruri ho.
 * - HTTP Response banata hai (HTML/JSON/Image) aur wapas bhejta hai.
 * 
 * STEP 7: BROWSER RENDERING (Frontend ka kaam!)
 * - Browser ko HTML document milta hai. Ab screen pe dikhana hai:
 * 
 *   A) HTML PARSING → DOM TREE:
 *      - Browser HTML ko line by line parse karta hai.
 *      - Har tag ko ek NODE banakar ek tree structure banata hai = DOM Tree.
 *      - <html> sabse upar, uske andar <head>, <body>, unke andar elements.
 * 
 *   B) CSS PARSING → CSSOM TREE:
 *      - CSS files aur <style> tags ko parse karke CSSOM (CSS Object Model) banata hai.
 *      - Ye tree batata hai ki kaunse element pe kaunsa style lagega.
 * 
 *   C) JAVASCRIPT EXECUTION:
 *      - <script> tag mile → HTML parsing RUKI!
 *      - JS engine (V8 in Chrome) JavaScript execute karta hai.
 *      - JS DOM ko modify kar sakta hai, events add kar sakta hai.
 *      - async/defer attributes se blocking behaviour change hota hai.
 * 
 *   D) RENDER TREE:
 *      - DOM + CSSOM milke RENDER TREE banate hain.
 *      - Render tree me sirf VISIBLE elements hote hain.
 *      - display: none wale elements render tree me NAHI aate.
 *      - visibility: hidden wale AATE hain (space lete hain par dikhte nahi).
 * 
 *   E) LAYOUT (Reflow):
 *      - Har element ki EXACT POSITION (x, y) aur SIZE (width, height) calculate hoti hai.
 *      - Responsive design yahan kaam aata hai (viewport ke hisaab se).
 *      - Ye expensive operation hai — baar baar layout change = slow page.
 * 
 *   F) PAINT:
 *      - Ab actual PIXELS draw hote hain screen pe.
 *      - Colors, borders, shadows, text, images — sab paint hote hain.
 *      - Paint bhi layers me hota hai (z-index, position se layers banti hain).
 * 
 *   G) COMPOSITING:
 *      - Sab layers ko sahi order me COMBINE karke final image banati hai.
 *      - GPU (Graphics Card) ye kaam karta hai fast rendering ke liye.
 * 
 * STEP 8: PAGE INTERACTIVE
 * - JavaScript event listeners active hote hain.
 * - User click, scroll, type kar sakta hai.
 * - Page fully loaded and INTERACTIVE!
 * 
 * COMPLETE PIPELINE (Yaad rakhne wala shortcut):
 * URL Type → DNS Lookup → IP Mili → TCP Handshake → TLS Handshake →
 * HTTP Request → Server Processing → HTTP Response → HTML Parse (DOM) →
 * CSS Parse (CSSOM) → JS Execute → Render Tree → Layout → Paint → Done!
 */


/**
 * ========================================================================
 * 15. WEB SECURITY BASICS (Common Attacks aur Protection)
 * ========================================================================
 * NOTES:
 * - Web development me security BAHUT important hai. Ye common attacks jaan lo:
 * 
 * A) XSS (Cross-Site Scripting):
 *    - Attacker aapki website me MALICIOUS JAVASCRIPT inject kar deta hai.
 *    - Jaise comment box me <script>alert('hacked')</script> likh de.
 *    - Ye script doosre users ke browser me run hogi!
 *    - PROTECTION: User input ko hamesha SANITIZE karo. 
 *      HTML entities me convert karo (< → &lt;, > → &gt;).
 *    - React by default XSS prevent karta hai (JSX auto-escapes).
 * 
 * B) CSRF (Cross-Site Request Forgery):
 *    - Attacker user ko ek fake link bhejta hai.
 *    - User click karta hai → uski COOKIES automatically jaati hain → 
 *      attacker ki request user ke naam se ho jati hai!
 *    - PROTECTION: CSRF tokens use karo (har form me unique token jo verify ho).
 * 
 * C) SQL INJECTION:
 *    - Attacker input field me SQL commands likh deta hai.
 *    - Example: Username me " ' OR 1=1 -- " likh de → saare users ka data leak!
 *    - PROTECTION: Parameterized queries / ORM use karo (Mongoose/Sequelize).
 * 
 * D) MAN-IN-THE-MIDDLE (MITM):
 *    - Hacker client aur server ke beech me baith ke data padh leta hai.
 *    - PROTECTION: HTTPS use karo! Encrypted data hacker padh nahi payega.
 * 
 * E) DDoS (Distributed Denial of Service):
 *    - Millions of fake requests bheji jaati hain server ko crash karne ke liye.
 *    - PROTECTION: Rate limiting, CDN (Cloudflare), Load balancers.
 */


/**
 * ========================================================================
 * 16. WEB STORAGE (Browser me data kahan store hota hai?)
 * ========================================================================
 * NOTES:
 * 
 * | Storage Type   | Size Limit | Expires?                   | Sent to Server?  |
 * |----------------|------------|----------------------------|------------------|
 * | Cookies        | ~4 KB      | Haan (expiry set hoti hai) | Haan (har req)   |
 * | localStorage   | ~5-10 MB   | Nahi (tab band = data raha)| Nahi             |
 * | sessionStorage | ~5-10 MB   | Haan (tab close = gone)    | Nahi             |
 * | IndexedDB      | ~50 MB+    | Nahi (permanent)           | Nahi             |
 * | Cache API      | Varies     | Manual control             | Nahi             |
 * 
 * DETAILS:
 * - Cookies: Server set karta hai, har request ke saath automatically jaati hain.
 *   Small data ke liye (session IDs, auth tokens).
 * 
 * - localStorage: Browser me permanent store. Tab close karo, browser close karo — 
 *   data REHTA hai. Manually delete karna padta hai.
 *   Use: User preferences, theme (dark/light), cart items.
 * 
 * - sessionStorage: Sirf TAB ke liye. Tab close kiya → data GAYAB.
 *   Use: Temporary form data, one-time info.
 * 
 * - IndexedDB: Browser me full DATABASE! Large, structured data store kar sakte ho.
 *   Use: Offline apps, large datasets.
 */


/**
 * ========================================================================
 * 17. APIs & REST (Application Programming Interface)
 * ========================================================================
 * NOTES:
 * - API ek WAITER hai — jo aapke (client) aur kitchen (server) ke beech me 
 *   order le jaata hai aur khana laata hai.
 * - API ek set of RULES hai jinke through 2 software ek doosre se baat karte hain.
 * 
 * REST (Representational State Transfer):
 * - REST ek DESIGN PATTERN hai APIs banane ka. Ye rules follow karo:
 * 
 *   1. Client-Server: Frontend aur Backend ALAG hone chahiye.
 *   2. Stateless: Har request COMPLETE honi chahiye (server kuch yaad nahi rakhta).
 *   3. Uniform Interface: Resources URL se identify ho (/users, /products).
 *   4. Use HTTP Methods properly: GET read, POST create, etc.
 * 
 * RESTful API URL Design:
 *   GET    /api/users        → Saare users lao
 *   GET    /api/users/5      → User #5 ka data lao
 *   POST   /api/users        → Naya user banao
 *   PUT    /api/users/5      → User #5 ka data replace karo
 *   PATCH  /api/users/5      → User #5 ka kuch data update karo
 *   DELETE /api/users/5      → User #5 ko delete karo
 * 
 * RESPONSE FORMAT (Usually JSON):
 *   {
 *     "status": "success",
 *     "results": 2,
 *     "data": {
 *       "users": [
 *         { "id": 1, "name": "Sidd" },
 *         { "id": 2, "name": "Rahul" }
 *       ]
 *     }
 *   }
 */


/**
 * ========================================================================
 * 18. WEBSOCKETS & REAL-TIME COMMUNICATION
 * ========================================================================
 * NOTES:
 * - HTTP me client request bhejta hai, server response deta hai — BAS. Done.
 * - Par kuch cases me server ko KHUD SE client ko data bhejna hota hai:
 *   Chat applications, Live scores, Stock prices, Notifications.
 * 
 * WEBSOCKETS:
 * - Ek PERSISTENT, BIDIRECTIONAL connection jo ek baar banta hai aur OPEN rehta hai.
 * - Client aur Server DONO kisi bhi waqt data bhej sakte hain.
 * - HTTP se shuru hota hai (upgrade request), phir WebSocket protocol me badal jaata hai.
 * 
 * HTTP vs WebSocket:
 * - HTTP:      Half-duplex (ek taraf ek time pe). Request → Response → done.
 * - WebSocket: Full-duplex (dono taraf ek saath). Continuous open channel.
 * 
 * OTHER REAL-TIME OPTIONS:
 * - SSE (Server-Sent Events): Server → Client (one-way). Live feeds ke liye.
 * - Long Polling: Client baar baar server se puchta hai "kuch naya hai?" (purana method).
 * - Short Polling: setInterval se har 5 sec me API call (bahut inefficient!).
 */


/*
========================================================================
FINAL REVISION TABLE — HOW WEB WORKS CHEAT SHEET
========================================================================

| Concept              | Short Description                                         |
|----------------------|-----------------------------------------------------------|
| Client-Server Model  | Client request bhejta, Server response deta               |
| IP Address           | Internet pe device ka unique number (142.250.190.46)      |
| Domain Name          | IP ka human-readable naam (google.com)                    |
| DNS                  | Domain ko IP me convert karta (Internet ki phonebook)     |
| DNS Hierarchy        | Root Server -> TLD Server -> Authoritative Server         |
| URL                  | Protocol + Domain + Port + Path + Query + Fragment        |
| TCP/IP               | Data packets me tod ke reliable delivery karta            |
| UDP                  | Fast but unreliable (video calls, gaming)                 |
| 3-Way Handshake      | SYN -> SYN-ACK -> ACK (connection setup)                 |
| HTTP                 | Web ka protocol, stateless, request-response model        |
| HTTPS                | HTTP + TLS/SSL encryption (secure)                       |
| HTTP Methods         | GET, POST, PUT, PATCH, DELETE (CRUD operations)           |
| Status Codes         | 2xx=Success, 4xx=Client Error, 5xx=Server Error           |
| Cookies              | Small data browser me, har request ke saath jaati hain    |
| Sessions             | Server-side storage, session ID cookie me                 |
| JWT                  | Self-contained token, stateless authentication            |
| CORS                 | Cross-origin security, server se permission chahiye       |
| Caching              | Data save karke speed badhana (browser/CDN/server)        |
| REST API             | Standardized URL design + HTTP methods for APIs           |
| WebSockets           | Persistent bidirectional connection (real-time)            |
| Browser Rendering    | HTML->DOM, CSS->CSSOM, Render Tree, Layout, Paint         |
| XSS                  | Malicious JS injection, sanitize input se bachao          |
| CSRF                 | Fake request user ke naam se, CSRF token se bachao        |

========================================================================
COMPLETE PIPELINE (Yaad rakhlo!):
URL Type -> DNS Lookup -> IP Mili -> TCP Handshake -> TLS Handshake ->
HTTP Request -> Server Processing (DB call etc) -> HTTP Response ->
Browser Render (DOM -> CSSOM -> JS -> Render Tree -> Layout -> Paint) -> Done!
========================================================================
*/
