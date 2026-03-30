'use strict';

/**
 * ========================================================================
 * 1. THE CLIENT-SERVER MODEL (Basics)
 * ========================================================================
 * NOTES:
 * - Web ek communication hai do computers ke beech: Ek "Client" (Aapka Browser/Phone) aur ek "Server" (Powerful computer jahan data rakha hai).
 * - Client humesha "Request" bhejta hai (Jaise hotel me customer order deta hai).
 * - Server uss request ko process karta hai aur "Response" wapas bhejta hai (Jaise waiter khana laakar deta hai).
 * - Ye saara communication Internet ke through hota hai.
 */


/**
 * ========================================================================
 * 2. IP ADDRESS & DOMAIN NAMES
 * ========================================================================
 * A) IP ADDRESS (Internet Protocol Address):
 * - Internet par har computer (ya device) ka ek unique number hota hai. (Jaise: 142.250.190.46)
 * - Isko aap Internet ka "Phone Number" ya "Ghar ka Pata" samajh sakte ho. 
 * - Computers sirf IP Addresses (Numbers) samajhte hain, wo naam nahi samajhte.
 * 
 * B) DOMAINS (Domain Name):
 * - Insaan (Humans) lambe IP addresses yaad nahi rakh sakte.
 * - Isliye humne un IP Numbers ko ek aasan anghrezi naam de diya jisko DOMAIN kehte hain.
 * - Example: "google.com" ek domain hai, jiske peeche ek lamba IP address chupa hai (142.250.190.46).
 */


/**
 * ========================================================================
 * 3. DNS - DOMAIN NAME SYSTEM (The Phonebook of the Internet) 📖
 * ========================================================================
 * - INTERVIEW QUESTION: "DNS kya hota hai?"
 * - ANSWER: Ye Internet ki "Telephone Directory" hai. Iska kaam hai insaano ke padhne 
 *   wale "Domain Names" (google.com) ko computers ke padhne wale "IP Addresses" (142.250.190.46) me convert/translate karna.
 * 
 * 🧠 The DNS Lookup Process (Kaam kaise karta hai Detailed mein!):
 * Jab aap browser me type karte ho: www.google.com
 * Toh exact IP (kahan hai google ka server?) dhundhne ke liye ye 4 steps hote hain:
 * 
 * Step 1. BROWSER & OS CACHE (Kya mujhe pehle se pata hai?)
 *    - Browser pehle apni history/memory check karta hai (Cache). Agar aapne kuch der pehle google khola tha, toh usko IP yaad hoga bina kisi dhoond-bhaale hi connection shuru kar dega.
 *    - Agar nahi mila, toh wo aapke Computer ke OS (Windows/Mac) ki "hosts" file me check karta hai.
 * 
 * Step 2. ISP RESOLVER (Aapke Wi-Fi/Network waale bhaiya)
 *    - OS ko bhi nahi pata, toh wo request aapke Internet Service Provider (Jio/Airtel/Hathway) ke DNS Server jisko "Resolver" kehte hain wahan bhejta hai.
 *    - Ye Resolver aapka Personal Assistant hai. Ye aage jaake baki saare internet servers se exactly address nikal k layega aapke liye.
 * 
 * Step 3. THE 3-STEP HIERARCHY (Asli khoj khoobiyon bhari duniya yahan hoti hai!)
 *    A: ROOT Server (The Librarian): 
 *       Resolver sabse pehle internet ke top Root Server ke paas jata hai aur puchta hai "google.com kahan hai?". Root server dhyan se last ka hissa dekhta hai aur bolta hai "Bhai exact mujhe nahi pata, par akhir me '.com' hai toh main tumhe '.com' (TLD) walon ka rasta (IP) de deta hu, unse pucho".
 *    B: TLD Server (Top Level Domain i.e., .com, .in, .net): 
 *       Ab resolver '.com' wale servers ke paas jata hai. .com wala bolta hai "Bhai mujhe exact andar guss kar to nhi pata, par maine domain list me dekha hai tum 'Google' naam ki registry (Authoritative Server) ke paas jao, unki duty yahi hai. Ye lo unka address".
 *    C: AUTHORITATIVE Name Server (The Final Boss / Manager): 
 *       Ab akhir me resolver 'Google' ke kharide hue special Manager server ke paas jata hai. Ye is zone me boss hai, isko permanently exactly pata hota hai ki aaj 'www' subdomain ka target active IP address kya hai. Wo book kholta hai aur ek number (jaise 142.250.190.46) dhund ke nikal deta hai!
 * 
 * Step 4. FINAL RESULTS (The Wapis aana)
 *    - Ye IP nikal ke -> Resolver tak aati hai. 
 *    - Resolver usey future ke liye cache me aapne paas save kar leta hai (taaki agli baar itni mehnat na karni pade).
 *    - Phir wo OS ko wapis deta hai -> OS Browser ko pakdaata hai. 
 *    - Boom! Browser ke paas Server ka exact Ghar ka Pata (IP) pahunch gaya. Ab direct TCP connection (3-way handshake) start hota hai!
 */


/**
 * ========================================================================
 * 4. ANATOMY OF A URL (Uniform Resource Locator)
 * ========================================================================
 * Example URL: https://www.google.com:443/search?q=javascript#section1
 * 
 * TUKDE (Pieces):
 * 1. Protocol / Scheme : "https://"  (Kaun sa rule use hoga baat karne ke liye).
 * 2. Sub-Domain        : "www"       (Domain ka ek specific hissa).
 * 3. Domain Name       : "google.com"(Website ka naam).
 * 4. Port Number       : ":443"      (Server ke kis "Darwaze" (Port) pe jana hai. By default HTTP ka 80 hota hai aur HTTPS ka 443, isliye likha nahi dikhta).
 * 5. Path / Route      : "/search"   (Website ke andar kaun se page pe jana hai).
 * 6. Query String      : "?q=javascript" (Server ko koi extra data bhejna ho key-value format me).
 * 7. Fragment / Hash   : "#section1" (Page load hone k baad directly kis paragraph pe scroll karna hai. Ye sirf Client side hota hai, Server ko kabhi nahi bheja jata).
 */


/**
 * ========================================================================
 * 5. PROTOCOLS & TCP/IP (Rules of Communication)
 * ========================================================================
 * Protocol matlab "Niyam" (Rules). Baat kaise karni hai uske rules.
 * 
 * A) TCP/IP (Transmission Control Protocol / Internet Protocol)
 * - Ye internet ka sabse fundamental rule hai.
 * - IP: Data ko sahi address (IP Address) tak pahunchane ka kaam karta hai.
 * - TCP: Jo lamba data aap bhejte ho (jaise ek video ya webpage), wo ek saath nahi jata. 
 *   TCP us bade data ko chhote-chhote ansho (PACKETS) me tod (break) deta hai. 
 *   Phir server par pahunchne par un packets ko wapas proper sequence me jodta (reassemble) hai.
 *   Agar koi packet raste me gumm (drop) ho jaye, toh TCP khud dubara wapas request karta hai jisse aapka data corrupt nahi hota.
 * 
 * B) TCP 3-WAY HANDSHAKE 🤝 (Very Important Interview Topic!)
 * Data bhejna shuru karne se pehle, Client aur Server ek doosre se connection set karte hain:
 * 1. SYN (Synchronize): Client bolta hai - "Hello Server, Are you there? Mujhe connection banana hai."
 * 2. SYN-ACK (Acknowledge): Server bolta hai - "Yes, I am here. Banate hain connection!"
 * 3. ACK (Acknowledge): Client bolta hai - "Okay cool! Ab main aapse data bhejna/receieve karna shuru kar raha hu."
 * (Is handshake ke baad hi actual data HTTP/HTTPS pe travel karta hai).
 * 
 * C) HTTP / HTTPS (Hyper-Text Transfer Protocol / Secure)
 * - Jab TCP connection ban jata hai, tab "HTTP" batata hai ki Web Page ka data kaise format hoke bhejwaya jayega.
 * - Stateless Protocol: HTTP bhoolakad (amnesic) hota hai. Har naya request uske liye pehli baar jaisa hota hai. 
 *   (Isliye humein Cookies/JWT Auth banani padti hai taaki server humein password dalne k baad pehchaan sake).
 * - HTTPS me 'S' Secure ke liye hota hai. Yahan "TLS/SSL" (Transport Layer Security) encryption ka use hota hai.
 *   Iski wajah se raste me agar koi hacker packets intercept kar bhi le, toh use sirf kachra (gibberish/encrypted text) dikhega.
 */


/**
 * ========================================================================
 * 6. HTTP REQUEST AND RESPONSE STRUCTURE
 * ========================================================================
 * 
 * A) HTTP REQUEST (Client ki taraf se jati hai)
 * Isme 3 cheezein hoti hain:
 * 1. Status Line: Request ka Type/Method (GET, POST, PUT, DELETE) + Path (/users) + HTTP Version.
 * 2. Headers: Meta-data (User-agent konsa browser hai, kis type ka data accept karega, cookies wagera).
 * 3. Body: POST/PUT request ke time jo asli data bejna hota hai (jaise Form submission ya JSON file). GET hamesha empty body rakhta hai.
 * 
 * B) HTTP RESPONSE (Server ki taraf se aati hai)
 * Isme bhi 3 cheezein hoti hain:
 * 1. Status Line: HTTP Version + Status Code (Jaise 200 OK, 404 Not Found) + Status Message.
 * 2. Headers: Meta-data (Data kaun sa format me hai like Content-Type: text/html, cache kab expire hoga, etc).
 * 3. Body: Asli Content (Pura HTML page, Image, JSON data, etc).
 */


/**
 * ========================================================================
 * 7. THE MASTER QUESTION: "WHAT HAPPENS WHEN YOU TYPE WWW.GOOGLE.COM?" 🤯
 * ========================================================================
 * (Agar aap interview me isko completely step-by-step bata dete hain toh impression next level banta hai)
 * 
 * STEP 1: PARSING THE URL
 * Browser check karta hai ki aapne koi "Search Query" likhi hai ya direct "URL" (google.com). 
 * Uske baad usme se Protocol aur Domain alag nikalta hai.
 * 
 * STEP 2: DNS LOOKUP (Finding the IP)
 * Browser local cache check karta hai -> OS Cache -> ISP -> DNS Resolver IP address dhoond kar lata hai. 
 * Maan lijiye IP mila: 142.250.190.46
 * 
 * STEP 3: ESTABLISHING TCP CONNECTION (Handshake)
 * Browser directly udti teer ki tarah data nahi bhejta. Wo server ke IP se judta hai "TCP 3-Way Handshake" ke through (SYN, SYN-ACK, ACK).
 * 
 * STEP 4: TLS/SSL ENCRYPTION HANDSHAKE (If HTTPS)
 * TCP banne ke TURANT baad cryptography ka handshake hota hai public/private keys exchange karne ke liye, taaki data aane or jane ke waqt encrypted rahe.
 * 
 * STEP 5: SENDING THE HTTP REQUEST
 * Ab ja ke Browser ek perfectly formatted secure "GET" request pakda kar Server ki taraff bhej deta hai IP address ko (Ports ke sahare) use karke.
 * 
 * STEP 6: SERVER HANDLING THE REQUEST
 * Google ka Web Server us request ko dekhta hai, samajhta hai. Phir Backend Application (jaise NodeJS/Java/Python) aur Database se data process karke nikal kar ek "HTTP Response" banata hai aur browser ko bhejta hai.
 * 
 * STEP 7: BROWSER RENDERING THE RESPONSE (Very important Frontend Topic!):
 * - BROWSER ko HTML Document mil jata hai aur ye steps chalte hain:
 * - 1. DOM Tree: HTML ko line by line parse karke "DOM Tree" (Document Object Model) banata hai.
 * - 2. CSSOM Tree: CSS files aati hain aur unka "CSSOM Tree" (CSS Object Model) banta hai.
 * - 3. Render Tree: DOM aur CSSOM mil kar "Render Tree" banate hain (ismein elements add hote hain, par CSS 'display:none' wale hat jate hain).
 * - 4. Layout (Reflow): Har element ki screen par exact jagah (x,y points) aur size (width/height) measure hoti hai.
 * - 5. Paint & Composite: Aakhir mein GPU/CPU un pixels ko actually screen pe Paint (draw) kardete hain pixels ki tarah window par.
 * - (Sath-sath me Javascript engine chalta rehta hai DOM events ko handle karne aur interactions jodne ke liye).
 */


/**
 * ========================================================================
 * 8. COMMON HTTP STATUS CODES (Interview me hamesha pooche jate hain)
 * ========================================================================
 * 1xx: Informational (Baat processing main hai)
 * 
 * 2xx: Success (Mubarak ho kaam ho gaya!)
 *      - 200 OK (Sab bhadiya/Data successfully fetched)
 *      - 201 Created (Naya record successfully DB me ban gaya like POST signup)
 * 
 * 3xx: Redirection (Ghar badal liya hai webpage ne idhar-udhar redirect ho rha hai)
 *      - 301 Moved Permanently (Hamesha ke liye link shift)
 *      - 304 Not Modified (Browser ko bola "Apne Cache se data utha lo, server pe kuch page badla nahi hai naya fetch mat karo")
 * 
 * 4xx: Client Error (Aapki i.e. Frontend/User ki Galti Hai)
 *      - 400 Bad Request (Data galat format mein bheja aapne)
 *      - 401 Unauthorized (Log in karo pehle / API auth token galat hai)
 *      - 403 Forbidden (Aap login ho par permission/rules/roles allow nahi karte ye page dekhne ko)
 *      - 404 Not Found (Koi aisa URL ro route udhar back-end pe hai hi nahi)
 * 
 * 5xx: Server Error (Backend developer ya Server System ki Galti Hai)
 *      - 500 Internal Server Error (Backend ka code phat gaya runtime error se)
 *      - 502 Bad Gateway / 503 Service Unavailable (Server crash ho gaya ya server overload/traffic bohot hai)
 */


/**
 * ========================================================================
 * FINAL REVISION TABLE 📝 (How Web Works)
 * ========================================================================
 * | Concept          | Short Description / Metaphor                         |
 * |------------------|------------------------------------------------------|
 * | IP Address       | Internet me Server ka unique Number Code (142.1.0).  |
 * | Domain Name      | Uss Number ka Human-readable Naam (Google.com)        |
 * | DNS              | Internet ki 'Phonebook' jo Name -> IP convert karti hai.|
 * | Protocol         | Computers baatcheet ke RULES.                        |
 * | TCP/IP           | Rules jo data ko chote packets me tod kr reliable banata hai.|
 * | 3-Way Handshake  | TCP me 3 step hi-hello "SYN, SYN-ACK, ACK" connection se pehle.|
 * | HTTP/HTTPS       | Request/Response transfer ka basic Web structure. HTTPS (Safe).|
 * | Stateless        | Server pichla request yaad nahi rakhta (HTTP is stateless).|
 * | Port Number      | Server ke specific darwaze (80 for HTTP, 443 for HTTPS).  |
 * | URL Format       | Protocol + Domain + Port + Route Path + Query Params |
 * | Render Process   | HTML/CSS aake (DOM+CSSOM) -> Render Tree -> Layout -> Paint |
 * ========================================================================
 */

// Bonus Trick yaad rakhne k lye pipeline: 
// URL type -> DNS Lookup -> IP mili -> TCP Handshake -> HTTPS Handshake -> HTTP Request bhagi -> Backend processing (DB call vagera) -> HTTP response aya HTML laakar -> Browser Render (DOM->CSSOM->Paint) -> Done!
