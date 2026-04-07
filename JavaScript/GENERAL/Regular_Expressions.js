'use strict';

/**
 * ========================================================================
 * 1. INTRODUCTION TO REGULAR EXPRESSIONS (REGEXP Ya REGEX) 🔍
 * ========================================================================
 * NOTES:
 * - Regular Expression (Regex) ek pattern hota hai jiska use hum text me se kuch dhundhne (search),
 *   badalne (replace) ya extract karne ke liye karte hain.
 * - Jaise man lo ek bahut bada text hai aur usme se hume saare "Email IDs" dhundhne hain, toh hum
 *   Regex ka use karenge kiyun ki normal string methods (indexOf) itne complex patterns nahi dhundh sakte.
 * 
 * 🧠 Samjho ek Real Life Example se:
 * - Maan lo tumhare paas 1000 pages ka document hai aur tumhe usme se saare phone numbers nikalne hain.
 *   Agar tum manually page by page dhundhoge, toh ghanton lag jayenge.
 *   Par agar tum ek Regex pattern likh do jaise /\d{10}/ (10 digit number dhundho), toh ek second me 
 *   saare phone numbers mil jayenge. Yahi hai Regex ki taqat!
 * 
 * USE CASES (Kahan use hota hai?):
 * 1. Form Validation (Email sahi format me hai ya nahi, Password strong hai ya nahi).
 * 2. Search & Replace (Kahin pe likhe saare 'color' ko 'colour' karna).
 * 3. Text Extraction (Ek lambi string me se saare phone numbers bahar nikalna).
 * 4. Input Sanitization (User ne HTML tags ya malicious code dala toh usse hata dena).
 * 5. URL Routing (Express.js me dynamic routes banana jaise /user/:id).
 * 6. Log Parsing (Server logs me se errors, timestamps, IPs extract karna).
 */

// --- EXAMPLES ---
const sampleText = "Mera email siddharth@gmail.com hai aur phone 9876543210 hai.";
// Regex se asani se data nikal sakte hain bina string ko todhe-marode:
const emailFinderRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/;
console.log("Found Email:", sampleText.match(emailFinderRegex)[0]); // Output: siddharth@gmail.com

// Phone number bhi nikal sakte hain:
console.log("Found Phone:", sampleText.match(/\d{10}/)[0]); // Output: 9876543210


/**
 * ========================================================================
 * 2. CREATING REGULAR EXPRESSIONS (Banaate Kaise Hain?) 🛠️
 * ========================================================================
 * Regex banane ke 2 main tareeke hote hain:
 * 
 * A) REGEX LITERAL (Sabse zyada use hone wala):
 * - Isme hum pattern ko do forward slashes /.../ ke beech likhte hain.
 * - Isko Javascript engine script load hote hi parse aur compile kar deta hai (Performance behtar hai).
 * - Jab tumhe pata hai ki pattern fix rahega aur kabhi badlega nahi, tab ye use karo.
 * - Syntax: const regex = /pattern/flags;
 * 
 * B) REGEXP CONSTRUCTOR (Jab pattern dynamic ho):
 * - Jab aapko regex run-time pe banana ho, jaise user ki input le kar. Isme pattern string me diya jata hai.
 * - Ye tab use hota hai jab tumhe nahi pata ki search kya hoga, user decide karega.
 * - Syntax: const regex = new RegExp("pattern", "flags");
 * - ⚠️ Dhyan dein: Constructor me backslash ko double escape karna padta hai (jaise "\\d" instead of "\d"),
 *   kyunki string me pehle se ek backslash escape character hota hai, toh regex tak pahunchane ke liye
 *   double \\ likhna padta hai.
 * 
 * 🤔 Kab Kaunsa Use Karein?
 * - LITERAL  -> Jab pattern pehle se pata ho (hardcoded). Fast hai. Zyada readable hai.
 * - CONSTRUCTOR -> Jab pattern user input ya kisi variable se aaye. Flexible hai.
 */

// --- EXAMPLES ---
// -> Literal Approach (Pattern pehle se fix hai, email validate karna hai)
const regexLiteral = /hello/;
console.log("Literal match: ", regexLiteral.test("hello world")); // true

// -> Constructor Approach (User ne search bar me kuch type kiya)
const userSearchKeyword = "siddharth";
const dynamicRegex = new RegExp(userSearchKeyword, "gi"); // 'g' = global, 'i' = case-insensitive
console.log("Constructor match: ", dynamicRegex.test("Hi Siddharth, how are you?")); // true

// -> Constructor me double escape ka example:
const digitRegex = new RegExp("\\d+"); // Ye sahi hai (\\d -> \d banega)
// const wrongRegex = new RegExp("\d+"); // Ye GALAT hai (\d string me invalid escape hai)
console.log("Constructor digit:", digitRegex.test("abc123")); // true


/**
 * ========================================================================
 * 3. REGEX FLAGS (Modifers - Search ka behavior badalna) 🚩
 * ========================================================================
 * Flags ko pattern ke aakhir me lagaya jata hai. Jaise: /pattern/g
 * Multiple flags ek saath bhi laga sakte ho: /pattern/gi (global + case-insensitive)
 * 
 * - g (Global): 
 *   By default regex pehli match milte hi ruk jata hai. 'g' batata hai ki rukna nahi hai, pura text search karo.
 *   Maan lo string me "hello" 5 baar likha hai toh bina 'g' sirf pehla milega, 'g' se saare 5 milenge.
 * 
 * - i (Case-Insensitive): 
 *   Capital aur small letters me farq nahi rakhta.
 *   /hello/i -> "HELLO", "Hello", "hElLo" sab match honge.
 *   Bina 'i' ke sirf exact case match hoga.
 * 
 * - m (Multiline): 
 *   Agar string multiple lines me hai (\n se tooti hui), toh ^ (start) aur $ (end) anchors ko 
 *   PURI string ki jagah HAR LINE ke shuru/aakhir me check karta hai.
 *   Example: "Hello\nWorld" -> /^World/m true dega, par /^World/ false dega (bina m ke).
 * 
 * - u (Unicode): 
 *   Unicode characters (UTF-16 surrogate pairs) aur emojis wagera ko theek se process karne ki taqat deta hai.
 *   Bina 'u' ke, kuch emojis jaise 🎉 galat match ho sakte hain kyunki wo internally 2 code units hote hain.
 * 
 * - y (Sticky): 
 *   Search ko exactly regex.lastIndex property ki position se hi dhoondna shuru karta hai.
 *   Agar wahi position pe match nahi mila, toh false de dega, aage ja ker bilkul nahi dhundhega.
 *   Ye 'g' se alag hai kyunki 'g' skip karke aage dhundhta hai, 'y' nahi dhundhta.
 * 
 * - s (DotAll): 
 *   By default '.' (dot) har char ko match karta hai EXCEPT newline (\n).
 *   's' flag lagane ke baad '.' newline ko bhi match karega jisse multiline text pe dot kaam karega.
 */

// --- EXAMPLES ---
const strFlags = "Hello hello HeLLo";

// Bina 'g' Flag ke:
console.log("Without 'g':", strFlags.match(/hello/i));
// Sirf pehla "Hello" match hoke aayega array me, aur baqi string ignore.

// 'g' aur 'i' Flags ke saath:
console.log("With 'g' and 'i':", strFlags.match(/hello/gi));
// Output: [ 'Hello', 'hello', 'HeLLo' ] -> Teeno utha lie.

// 'm' Multiline Flag Example:
const multiStr = "Good Morning\nGood Night";
console.log("Without 'm':", /^Good Night/.test(multiStr)); // false (Second line pe hai par check nahi hua)
console.log("With 'm':", /^Good Night/m.test(multiStr));    // true  (Ab har line ka start check hoga)

// 's' DotAll Flag Example:
const dotStr = "Line1\nLine2";
console.log("Dot without 's':", /Line1.Line2/.test(dotStr));  // false (dot ne \n ko skip kiya)
console.log("Dot with 's':", /Line1.Line2/s.test(dotStr));    // true  (dot ne \n ko bhi match kiya)


/**
 * ========================================================================
 * 4. METACHARACTERS (Special Characters jinke paas jadoo hai) ✨
 * ========================================================================
 * Ye sabse important block hai, isse regex ka sara syntax banta hai.
 * Ye wo special characters hain jo literal text nahi, balki ek RULE ya PATTERN represent karte hain.
 * 
 * CHARACTER MATCHERS (Kaunsa character chahiye?):
 * - . (Dot)   : Matches koi bhi SINGLE character (A-Z, a-z, 0-9, special char) EXCEPT newline (\n).
 *               Jaise /h.t/ -> "hat", "hot", "h1t", "h t" sab match honge, par "ht" nahi (beech me kuch toh chahiye).
 * 
 * - \d        : Matches a DIGIT (Number 0 - 9). Shortcut hai [0-9] ka.
 *               Jaise /\d\d/ -> "42" match karega, par "ab" nahi.
 * - \D        : Matches a NON-DIGIT (0-9 ko chhor k kuch bhi, i.e., letter, space, symbol).
 *               Ye \d ka exact ULTA hai. Jaise /\D/ -> "a", " ", "!" match karega par "5" nahi.
 * 
 * - \w        : Matches a WORD character (alphanumeric aur underscore: A-Z, a-z, 0-9, _).
 *               Shortcut hai [a-zA-Z0-9_] ka. Jaise variable names me jo chars allowed hain.
 * - \W        : Matches a NON-WORD character (spaces, punctuation jese !@#%, hyphen, etc).
 *               Ye \w ka exact ULTA hai.
 * 
 * - \s        : Matches a SPACE/WHITESPACE character (space ' ', tab '\t', newline '\n', carriage return '\r').
 * - \S        : Matches NON-SPACE character. Ye \s ka ULTA hai.
 * 
 * - \t        : Tab character specifically match karta hai.
 * - \n        : Newline character specifically match karta hai.
 * - \r        : Carriage return match karta hai (Windows me \r\n hota hai line break).
 * 
 * ESCAPE CHARACTER:
 * - \ (Backslash): Agar aapko kisi metacharacter ko literally dhundhna hai (jaise actually ek dot '.' ya
 *   dollar '$' ya plus '+' dhundhna ho), toh uske pehle backslash lagao.
 *   Bina escape ke . matlab "kuch bhi", par \. matlab "sirf dot character".
 *   Example: /3\.14/ matches "3.14" exactly, par /3.14/ matches "3X14" bhi (. = kuch bhi).
 */

// --- EXAMPLES ---
console.log("Dot (.) Demo :", /h.t/.test("hat"), /h.t/.test("hot"), /h.t/.test("h t")); // Teeno True
console.log("Dot won't match:", /h.t/.test("ht")); // false (beech me kuch toh chahiye)

const phoneString = "My number is 123-456.";
console.log("Number (\\d) Extract:", phoneString.match(/\d/g));
// Output: [ '1', '2', '3', '4', '5', '6' ] (Saare digits aagye, hyphen nahi aaya)

console.log("Non-Digit (\\D) Extract:", "abc123".match(/\D/g));
// Output: [ 'a', 'b', 'c' ] (Sirf non-digits aaye)

console.log("Word char (\\w) vs Symbols:", "A 1_!@".match(/\w/g));
// Output: [ 'A', '1', '_' ] ('!', '@' aur space word character nahi hain)

console.log("Whitespace (\\s):", "hello world\tok".match(/\s/g));
// Output: [ ' ', '\t' ] (space aur tab dono catch hue)

console.log("Escape Dot (\\.) :", /3\.14/.test("3.14")); // true  (exact dot dhundha)
console.log("Without Escape :", /3.14/.test("3X14"));    // true  (dot ne X ko bhi accept kiya!)


/**
 * ========================================================================
 * 5. CHARACTER CLASSES & SETS (Apni marzi k rules) 📋
 * ========================================================================
 * Inko Square Brackets [] ke beech me likhte hain.
 * Ye us ek position ke liye ek "menu card" ki tarah hain - jo bhi character us menu me hoga, wo chalega.
 * 
 * 🧠 Key Concept: Brackets ke andar ek time pe sirf EK character match hota hai, par wo character
 * bracket ke andar likhi hui kisi bhi cheez me se ho sakta hai.
 * 
 * BASIC SETS:
 * - [aeiou]   : a, e, i, o, ya u me se koi BHI ek letter chalega us position pe.
 * - [abc]     : Sirf a, b, ya c me se koi ek.
 * 
 * RANGES (Hyphen - se range use karte hain):
 * - [a-z]     : a se le kr z tak koi bhi SMALL letter (26 letters).
 * - [A-Z]     : A se le kr Z tak koi bhi CAPITAL letter.
 * - [0-9]     : 0 se 9 tak koi bhi NUMBER (\d ke barabar hai).
 * - [a-zA-Z]  : Koi bhi letter, chahe small ho ya capital.
 * - [a-zA-Z0-9] : Koi bhi letter ya number (almost \w jaisa, par underscore nahi included).
 * - [a-f]     : Sirf a se f tak (hex digits ke liye useful).
 * 
 * NEGATION (Ulta / NOT):
 * - [^aeiou]  : (^) bracket ke ANDAR lagane pe NEGATION ka kaam karta hai.
 *               Matlab "ye characters NAHI chahiye, inke ILAAWA koi bhi char chalega".
 *               Jaise [^0-9] matlab "numbers ke alawa kuch bhi" (\D ke barabar).
 * 
 * ⚠️ IMPORTANT: ^ bracket ke BAHAR lagao toh wo "start of string" anchor hai (Section 7).
 *               ^ bracket ke ANDAR lagao toh wo "NOT" (negation) hai. Context matters!
 * 
 * SPECIAL CHARS INSIDE BRACKETS:
 * - Brackets ke andar zyada tar metacharacters apna special meaning KHO dete hain.
 *   Jaise [.] matlab literally ek dot dhundho (escape ki zarurat nahi).
 *   Par ] aur \ aur ^ (start me) aur - (beech me) ko tab bhi escape karna padta hai.
 */

// --- EXAMPLES ---
const textSet = "I have a cat, a bat, and a rat.";
console.log("Character Set [cb]at :", textSet.match(/[cb]at/g));
// Output: [ 'cat', 'bat' ] (rat nahi lia kyunki 'r' set me nahi tha)

console.log("Negation Set [^cb]at:", textSet.match(/[^cb]at/g));
// Output: [ 'rat' ] (cat aur bat reject hue, baki sab ok toh 'r' wala aaya)

console.log("Vowels only:", "Siddharth".match(/[aeiou]/gi));
// Output: ['i', 'a'] (case-insensitive se bhi try karo)

console.log("Hex chars:", "Color is #ff00ab".match(/[0-9a-fA-F]/g));
// Output: ['f', 'f', '0', '0', 'a', 'b'] (Hex valid characters)

// Range combination:
console.log("Alphanumeric:", "Hello-World_123!".match(/[a-zA-Z0-9]/g));
// Output: ['H','e','l','l','o','W','o','r','l','d','1','2','3'] (hyphen, underscore, ! exclude)


/**
 * ========================================================================
 * 6. QUANTIFIERS (Kitni baar aana chahiye?) 🔢
 * ========================================================================
 * Quantifiers batate hain ki inka theek PEHLE wala character (ya pehla group) kitni baar repeat hoga.
 * Bina quantifier ke har character by default sirf 1 baar match hota hai.
 * 
 * - * (Asterisk / Star) : 0 or MORE times. 
 *   Matlab gaayab ho toh bhi chalega, ya 100 baar aaye tab bhi chalega.
 *   Example: /ab*c/ -> "ac" ✅ (b 0 baar), "abc" ✅ (b 1 baar), "abbbc" ✅ (b 3 baar).
 * 
 * - + (Plus) : 1 or MORE times. 
 *   Kam se kam 1 baar toh aana HI chahiye, 0 baar nahi chalega.
 *   Example: /ab+c/ -> "ac" ❌ (b 0 baar, nahi chalega), "abc" ✅, "abbbc" ✅.
 * 
 * - ? (Question Mark) : 0 or 1 time. 
 *   Optional bana deta hai! Ya toh hoga (1 baar) ya fir nahi hoga (0 baar). 2+ baar nahi.
 *   Example: /colou?r/ -> "color" ✅ (u 0 baar), "colour" ✅ (u 1 baar), "colouur" ❌ (u 2 baar).
 *   Real Use: American vs British spelling handle karna.
 * 
 * - {n} (Exact n times): 
 *   Bilkul EXACT n baar repeat hona chahiye, na kam na zyada.
 *   Example: /\d{3}/ -> "123" ✅, "12" ❌ (sirf 2 hain), "1234" me se "123" match hoga.
 * 
 * - {n,} (Minimum n times): 
 *   Kam se kam n baar aana chahiye, usse zyada kitne bhi baar aa sakte hain.
 *   Example: /\d{3,}/ -> "12" ❌, "123" ✅, "123456789" ✅.
 * 
 * - {n,m} (Between n and m times): 
 *   Minimum n baar aur Maximum m baar. Is range ke andar hona chahiye.
 *   Example: /\d{3,5}/ -> "12" ❌, "123" ✅, "12345" ✅, "123456" me se "12345" match hoga.
 * 
 * 💡 GREEDY VS LAZY (Bohut Important Concept!):
 * 
 * GREEDY (Default Behavior - Laalchi):
 * - By default *, +, aur {n,} "Greedy" hote hain. 
 * - Ye ZYADA se ZYADA characters ko apne andar ghusedne (match) ki koshish karte hain.
 * - Pehle poora bacha hua string kha lete hain, phir agar aage ka pattern fail ho toh PEECHE hatt kar
 *   (backtrack karke) thoda kam match karte hain. Ye "Trial and error" wapas wapas karta hai.
 * 
 * LAZY (? lagake - Sust / Smart):
 * - Agar greedy quantifier ke aage '?' lagadein (jaise *?, +?, {n,}?), tab ye "Lazy" ban jate hain.
 * - Ye KAM se KAM characters match karte hain. Pehle minimum try karte hain, agar aage ka pattern
 *   pass nahi hota toh EK AUR character lete hain, phir try karte hain. Slowly slowly badhte hain.
 * - HTML tags nikalne me ye bohut kaam aata hai (jaise <div> dhundhna hai, pura </div> tak nahi).
 */

// --- EXAMPLES ---
console.log("Zero or more (*) :", "gooooogle".match(/go*gle/)); // matches (o kitne bhi baar)
console.log("One or more (+) :", /a+/.test("")); // False, kam ze kam ek 'a' chahiye
console.log("One or more (+) :", /a+/.test("aaa")); // True

console.log("Optional (?) :", "color".match(/colou?r/), "colour".match(/colou?r/));
// Dono me match milega kyuki 'u' Optional (?) hai.

console.log("Exact {n}:", "12345".match(/\d{3}/));  // [ '123' ] (first 3 digits)
console.log("Min {n,}:", "12345".match(/\d{3,}/));  // [ '12345' ] (3 ya zyada, sab le liya)
console.log("Range {n,m}:", "12345".match(/\d{2,4}/)); // [ '1234' ] (greedy: max 4 le liya)

// GREEDY VS LAZY Demo (Bohut important samjhna):
const htmlTag = "<div>This is a div</div> <span>span span</span>";

console.log("Greedy [*]:", htmlTag.match(/<.*>/));
// .* greedy hai -> Pura string end tk kha gaya: "<div>This is a div</div> <span>span span</span>"
// Kyunki .* ne zyada se zyada characters liye, Last '>' tak chala gaya.

console.log("Lazy [*?]:", htmlTag.match(/<.*?>/));
// .*? lazy hai -> Samajhdaar: Jaise hi pehla '>' mila, ruk gaya: "<div>"
// Kyunki .*? ne kam se kam characters liye.

console.log("Lazy Global:", htmlTag.match(/<.*?>/g));
// Output: [ '<div>', '</div>', '<span>', '</span>' ] -> Saare tags alag alag mil gaye!


/**
 * ========================================================================
 * 7. ANCHORS AND BOUNDARIES (Positions / Bounds) ⚓
 * ========================================================================
 * Ye CHARACTERS NAHI match karte! Ye "POSITIONS" check karte hain.
 * Matlab ye dekhte hain ki match string me KAHAN ho raha hai - shuru me? Aakhir me? Word ke edge pe?
 * Ye koi character consume nahi karte, sirf location verify karte hain (zero-width assertions).
 * 
 * - ^ (Caret): 
 *   String/Line ke ekdum SHURU (Start) me match hona chahiye.
 *   Example: /^Hello/ -> "Hello World" ✅ (Hello shuru me hai), "Say Hello" ❌ (Hello beech me hai).
 *   ⚠️ Yaad rakho: ^ bracket [^...] ke andar alag matlab hai (NOT), bahar alag (START).
 * 
 * - $ (Dollar): 
 *   String/Line ke ekdum AAKHIR (End) me match hona chahiye.
 *   Example: /World$/ -> "Hello World" ✅ (World end me hai), "World Cup" ❌ (World end me nahi).
 * 
 * - ^ aur $ DONO ek saath use karke PURI string ko validate kar sakte ho:
 *   /^\d{10}$/ -> String me SIRF aur SIRF 10 digits honi chahiye, aur kuch nahi.
 *   Ye form validation me BOHUT use hota hai.
 * 
 * - \b (Word Boundary): 
 *   Ye us jagah ko match karta hai jahan ek WORD character (\w) aur ek NON-WORD character (\W) 
 *   milte hain (ya string ka start/end ho).
 *   Isko samjho jaise ek INVISIBLE DEEWAR hai word ke aas paas.
 *   Example: /\bcat\b/ -> "cat" ✅, "the cat sat" ✅, par "category" ❌ aur "scat" ❌.
 *   Kyunki "cat" ke dono taraf boundary (space/start/end) honi chahiye.
 * 
 * - \B (Non-Word Boundary): 
 *   \b ka ULTA. Jaha pe boundary NAHI honi chahiye.
 *   Example: /\Bcat/ -> "scat" ✅ (cat ke pehle boundary nahi hai, 's' hai), "cat" ❌ (pehle boundary hai).
 *   Isse kisi word ke ANDAR ka part dhundh sakte ho.
 */

// --- EXAMPLES ---
console.log("Start Anchor (^):", /^Hello/.test("Hello world")); // True (Hello shuru me hai)
console.log("Start Anchor (^):", /^Hello/.test("Say Hello"));   // False (Hello shuru me nahi)
console.log("End Anchor ($):", /\.com$/.test("google.com")); // True (.com end me hai)
console.log("End Anchor ($):", /\.com$/.test("google.com.pk")); // False (.com end me nahi)

// Full string validation (^ + $ combo):
console.log("Exact 10 digit:", /^\d{10}$/.test("9876543210")); // true
console.log("Extra chars:", /^\d{10}$/.test("98765432101")); // false (11 digits, 10 chahiye)

const boundaryStr = "cat category comcat";
console.log("Without Boundary:", boundaryStr.match(/cat/g));
// ['cat', 'cat', 'cat'] -> teeno words ke andar 'cat' mila (category me bhi, comcat me bhi)

console.log("With Boundary (\\b):", boundaryStr.match(/\bcat\b/g));
// ['cat'] -> Sirf wohi match hua jo AKELA stand-alone 'cat' hai (dono taraf boundary hai).

console.log("Non-Boundary (\\B):", "scat category".match(/\Bcat/g));
// ['cat'] -> Sirf 'scat' wala mila kyunki wahan cat ke pehle boundary nahi hai.


/**
 * ========================================================================
 * 8. GROUPS & ALTERNATION (Sath jodna aur Options dena) 🎯
 * ========================================================================
 * 
 * A) ALTERNATION (OR / Ya toh ye ya toh wo) -> |
 * - Pipe symbol | ek logical OR hai. "Ya ye match karo, ya wo".
 * - /apple|orange/ : Ya toh "apple" dhundho ya phir "orange", jo bhi pehle mile.
 * - ⚠️ Note: | ki priority LOW hoti hai. /hello|world/ ka matlab hai "(hello) ya (world)",
 *   "hell(o ya w)orld" NAHI. Agar specific part pe OR lagana ho toh parentheses use karo: /hell(o|w)orld/.
 * 
 * B) CAPTURING GROUPS -> ( )
 * - Parentheses ka kaam: 
 *   1. Multiple characters ko EK UNIT banana (quantifier lagane ke liye).
 *   2. Match hue hisse ko YAAD RAKHNA (capture karna) taaki baad me use kar sakein.
 * - Jab regex match hota hai toh captured groups result array me index [1], [2], [3]... pe milte hain.
 * - Example: /(ha)+/ -> "ha" ko ek unit maan ke 1+ baar dhunhega. "hahaha" ✅. Bina () ke /ha+/ 
 *   matlab "h" ke baad "a" 1+ baar, toh "haaa" match hota par "haha" nahi.
 * 
 * C) NON-CAPTURING GROUPS -> (?: )
 * - Jab aapko brackets sirf GROUPING ke liye chahiye (jaise OR karne ke liye), par aap nahi chahte 
 *   ki regex engine us hisse ko yaad karke memory waste kare.
 * - Result array me ye group NAHI aata. Performance improvement hota hai.
 * - Example: /(?:http|https):\/\// -> "http://" ya "https://" match karega, par protocol ko capture nahi karega.
 * 
 * D) NAMED CAPTURING GROUPS -> (?<name> )
 * - Normal capturing groups me result [1], [2] se access karna padta hai jo confusing hota hai.
 * - Named groups me tum har group ko naam de sakte ho, phir result.groups.name se access karo.
 * - Ye code ko READABLE aur clean banata hai. ES2018 me aaya tha.
 * 
 * E) BACKREFERENCES -> \1, \2
 * - Pura pattern me agar group ( ) ne pehle kuch match kar liya hai, aur aap chahte ho ki 
 *   EXACT WAHI TEXT aage dubara aaye, toh \1 (group 1 ke liye), \2 (group 2 ke liye) use karo.
 * - Ye "duplicate/repeated content" dhundhne me kaam aata hai.
 * - Example: /(\w+)\s+\1/ -> Pehle ek word capture karo, phir space ke baad WAHI word dubara aaye.
 *   "hello hello" ✅, "hello world" ❌ (dono words alag hain).
 */

// --- EXAMPLES ---
console.log("Alternation OR (|):", "I want an orange".match(/apple|orange/)); // ['orange']

// Grouping for quantifier:
console.log("Without group:", "hahaha".match(/ha+/));  // 'ha' (sirf 'a' pe + laga)
console.log("With group:", "hahaha".match(/(ha)+/));    // 'hahaha' (pura 'ha' ek unit bana)

// Capturing Data (Extract karna Parts Ko)
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const dateMatch = "Today is 2024-04-07".match(dateRegex);
console.log("Full Regex Match:", dateMatch[0]); // 2024-04-07 (pura match)
console.log("Match Group (1) Year:", dateMatch[1]);  // 2024 (pehla capture group)
console.log("Match Group (2) Month:", dateMatch[2]); // 04   (doosra capture group)
console.log("Match Group (3) Day:", dateMatch[3]);   // 07   (teesra capture group)

// Named Groups (Object keys se aasan access)
const namedDateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const namedResult = "My birthdate is 1999-12-05".match(namedDateRegex);
console.log("Named Year:", namedResult.groups.year);   // 1999
console.log("Named Month:", namedResult.groups.month); // 12
console.log("Named Day:", namedResult.groups.day);     // 05

// Backreferences (\1) - Repeated words dhundhna
const repeatRegex = /\b(\w+)\s+\1\b/;
console.log("Repeated Word:", "I like to to go home".match(repeatRegex)[0]); // "to to"
// Kaise kaam kiya: (\w+) ne "to" capture kiya -> \s+ ne space match kiya -> \1 ne dubara "to" match kiya


/**
 * ========================================================================
 * 9. LOOKAHEADS & LOOKBEHINDS (Aage / Peeche dekhna) 🔮
 * ========================================================================
 * Ye ADVANCED assertions hain. Inhe "Zero-Width Assertions" bhi kehte hain kyunki ye koi character
 * consume nahi karte, sirf CHECK karte hain ki condition match ho rahi hai ya nahi.
 * 
 * 🧠 Samjho ek Example se:
 * Maan lo tumhe ek line me se sirf wo NUMBERS chahiye jinke baad "kg" likha ho.
 * Tum number extract karna chahte ho, par "kg" nahi chahiye result me.
 * Toh tum Lookahead use karoge: /\d+(?=kg)/ -> Number lao, par sirf agar aage "kg" ho.
 * 
 * TYPES:
 * 
 * - (?=...)  POSITIVE LOOKAHEAD (Aage ye HONA chahiye):
 *   Match tabhi hoga jab iske AAGE wo pattern ho. Par wo aage wala part result me nahi aata.
 *   Example: /\d+(?=kg)/ -> "50kg" me "50" match karega, par "50lb" me kuch nahi.
 * 
 * - (?!...)  NEGATIVE LOOKAHEAD (Aage ye NAHI hona chahiye):
 *   Match tabhi hoga jab iske AAGE wo pattern NA ho.
 *   Example: /\d+(?!kg)/ -> "50lb" me "50" match karega, par "50kg" me sirf "5" milega
 *   (kyunki "50" ke baad "kg" hai toh poora "50" reject, par "5" ke baad "0" hai jo "kg" nahi).
 * 
 * - (?<=...) POSITIVE LOOKBEHIND (Peeche ye HONA chahiye):
 *   Match tabhi hoga jab iske PICHE wo pattern ho. Peeche wala part result me nahi aata.
 *   Example: /(?<=\$)\d+/ -> "$100" me "100" match karega ($ peeche hai).
 *   "€100" me kuch nahi milega (€ hai, $ nahi).
 * 
 * - (?<!...) NEGATIVE LOOKBEHIND (Peeche ye NAHI hona chahiye):
 *   Match tabhi agar peeche wo pattern NA ho.
 *   Example: /(?<!\$)\d+/ -> "€50" me "50" match karega (peeche $ nahi hai).
 * 
 * 🎯 YAAD RAKHNE KA TRICK:
 *   = matlab "HONA chahiye" (Positive)
 *   ! matlab "NAHI hona chahiye" (Negative)
 *   < matlab "PEECHE dekho" (Lookbehind)
 *   Bina < matlab "AAGE dekho" (Lookahead)
 */

// --- EXAMPLES ---
const textLA = "1st 2nd 3rd 4forth";
// Number dhundho jiske AAGE koi letter ho:
console.log("Positive Lookahead (?=):", textLA.match(/\d(?=[a-z])/g));
// ['1', '2', '3', '4'] -> Numbers match hue, par letters result me nahi aaye

const moneyStr = "Item costs $100 and €50 and ₹200";
// Sirf wo number jis ke PEECHE $ ho:
console.log("Positive Lookbehind (?<=):", moneyStr.match(/(?<=\$)\d+/g));
// ['100'] -> Sirf dollar waala number aaya, euro aur rupee wale nahi

// Negative Lookahead: Number jiske AAGE 'px' NAHI ho
const cssValues = "10px 20em 30px 40rem";
console.log("Negative Lookahead (?!):", cssValues.match(/\d+(?!px)/g));
// ['1', '20', '3', '40'] -> Jo px se pehle nahi hain wo aaye

// Password Validation me Lookahead ka use (Very Common Interview Question!):
// Password me kam se kam ek number hona chahiye AUR kam se kam ek uppercase letter:
const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
console.log("Strong Password:", passwordRegex.test("Hello123")); // true
console.log("Weak Password:", passwordRegex.test("hello123"));   // false (no uppercase)
console.log("Weak Password:", passwordRegex.test("Helloabc"));   // false (no digit)


/**
 * ========================================================================
 * 10. JAVASCRIPT REGEX METHODS & PROPERTIES (Functions jo check karenge) ⚙️
 * ========================================================================
 * 
 * REGEXP OBJECT PROPERTIES:
 * - regex.source    : Regex ka pattern string format me return karega (bina slashes aur flags ke).
 * - regex.flags     : Kaunse flags lage hain wo string me milega (jaise "gi").
 * - regex.lastIndex : Jab 'g' ya 'y' flag laga ho, toh ye property batati hai ki AGLA search kahan se shuru hoga.
 *                     Ye exec() aur test() ke saath automatically update hoti hai.
 *                     ⚠️ GOTCHA: Agar same regex baar baar use karo toh lastIndex ki wajah se unexpected results aa sakte hain!
 * 
 * REGEXP METHODS (Regex object pe call hote hain):
 * 
 * 1. regex.test(string) -> Boolean (true/false)
 *    (V. IMP) Ye sirf batata hai ki match MILA ya NAHI. Validation ke liye BEST hai.
 *    Fastest method hai kyunki ye details nahi nikalta, sirf haan/na bolta hai.
 * 
 * 2. regex.exec(string) -> Array ya null
 *    Ek detailed array laata hai: [fullMatch, group1, group2, ...] + index property + groups property.
 *    Global 'g' flag ke sath isko WHILE LOOP me chalao - har baar agla match dega, 
 *    jab koi match na bache toh null return karega aur loop ruk jayega.
 * 
 * STRING METHODS (String object pe call hote hain, regex parameter pass hota hai):
 * 
 * 1. string.match(regex) -> Array ya null
 *    - BINA 'g' flag: exec() jaisa detailed array deta hai (ek match + groups).
 *    - 'g' flag ke SATH: Saare matches ka simple array deta hai (groups nahi milte).
 * 
 * 2. string.matchAll(regex) -> Iterator (ES2020)
 *    Ek Iterator deta hai jisme har match ki FULL details hoti hain (groups bhi).
 *    Ye match() + 'g' flag ki limitation solve karta hai (global matches with group details).
 *    ⚠️ Regex me 'g' flag LAGANA zaroori hai, warna error aayega.
 * 
 * 3. string.replace(regex, replacement) -> New String
 *    Pattern ko naye text se BADAL deta hai. Original string nahi badlti (strings immutable hain).
 *    Replacement me special patterns use kar sakte ho: $1 (group 1), $& (full match), $` (before match).
 *    Callback function bhi de sakte ho replacement ki jagah for complex logic.
 * 
 * 4. string.replaceAll(regex, replacement) -> New String
 *    replace() jaisa par SAARE occurrences badalta hai. 'g' flag lagana ZAROORI hai warna TypeError aayega.
 * 
 * 5. string.search(regex) -> Number (index ya -1)
 *    indexOf() ki tarah kaam karta hai par REGEX accept karta hai. Pehle match ka index deta hai.
 *    Match nahi mila toh -1 return karta hai. 'g' flag ka koi effect nahi hota.
 * 
 * 6. string.split(regex) -> Array
 *    Pattern ko delimiter (todne wala character) maanke string ko array me tod deta hai.
 *    Multiple delimiters handle karne me regex bahut kaam aata hai.
 */

// --- EXAMPLES ---
const sentence = "I love Javascript. Javascript is fun!";
const myRegex = /Javascript/g;

// Properties:
console.log("Source property:", myRegex.source); // "Javascript" (pattern without slashes)
console.log("Flags property:", myRegex.flags);   // "g"

// 1. regex.test() -> Validation ke liye best
console.log("regex.test():", /Javascript/.test(sentence)); // true

// 2. regex.exec() -> Loop me detailed search (ADVANCED)
myRegex.lastIndex = 0; // reset for safety (bina reset ke galat results aa sakte hain)
let execMatch;
while ((execMatch = myRegex.exec(sentence)) !== null) {
  console.log(`Found "${execMatch[0]}" at index ${execMatch.index}. Next search from: ${myRegex.lastIndex}`);
}
// Output: Found "Javascript" at index 7. Next search from: 17
// Output: Found "Javascript" at index 19. Next search from: 29

// 3. string.match() -> Quick results
console.log("match() with 'g':", sentence.match(/Javascript/g)); // ['Javascript', 'Javascript']
console.log("match() without 'g':", sentence.match(/Javascript/)); // Detailed array (first match only)

// 4. string.replace() -> Text badalna
console.log("replace():", sentence.replace(/Javascript/g, "Python"));
// "I love Python. Python is fun!"

// Replace with captured group ($1):
console.log("Replace with group:", "2024-04-07".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1"));
// "07/04/2024" -> Date format change kar diya using $1, $2, $3!

// 5. string.search() -> Index dhundho
console.log("search():", "Where is apple?".search(/apple/)); // 9

// 6. string.split() -> String todo
console.log("split():", "a,b;c-d".split(/[,;-]/)); // ['a', 'b', 'c', 'd']
// Comma, semicolon, hyphen - teeno se tod diya ek hi regex me!


/**
 * ========================================================================
 * 11. ADVANCED REAL WORLD EXAMPLES 🌍
 * ========================================================================
 */

// 1. Email Validation (Form me sabse common):
const emailRule = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
console.log("Valid Email:", emailRule.test("test@gmail.com"));   // true
console.log("Invalid Email:", emailRule.test("test@gmailcom"));  // false (no dot before domain)
// Breakdown: ^ start se, [a-zA-Z0-9._-]+ username part, @ at sign, [a-zA-Z0-9.-]+ domain, \. dot, [a-zA-Z]{2,6} extension, $ end.

// 2. Extracting Hashtags from Tweet:
const tweet = "I love #Javascript and #Regex and #WebDev !";
console.log("Hashtags:", tweet.match(/#[a-z0-9_]+/gi));
// Output: [ '#Javascript', '#Regex', '#WebDev' ]

// 3. Phone Number Formatting (1234567890 -> 123-456-7890):
console.log("Phone Format:", "1234567890".replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
// Output: "123-456-7890"

// 4. Removing Extra Spaces (Multiple spaces ko ek banana):
console.log("Clean Spaces:", "Hello    World   !".replace(/\s+/g, " "));
// Output: "Hello World !"

// 5. URL Validation (Basic):
const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\/\S*)?$/;
console.log("Valid URL:", urlRegex.test("https://www.google.com")); // true
console.log("Valid URL:", urlRegex.test("google.com")); // true

// 6. HTML Tag Stripping (Security ke liye - XSS protection):
const dirtyHTML = "<script>alert('hack')</script><b>Hello</b>";
console.log("Clean HTML:", dirtyHTML.replace(/<[^>]*>/g, ""));
// Output: "alert('hack')Hello" -> Saare tags hata diye


/**
 * ========================================================================
 * FINAL REVISION TABLE 📝 (Regex Metacharacters Quick Guide)
 * ========================================================================
 * | Symbol  | Meaning                                                     |
 * |---------|-------------------------------------------------------------|
 * | .       | Any character (except newline). 's' flag se newline bhi.    |
 * | \w \W   | Word char (a-z0-9_) / NON-Word.                             |
 * | \d \D   | Number (0-9) / NON-Number.                                  |
 * | \s \S   | Space (space,tab,newline) / NON-Space.                      |
 * | [abc]   | Any of a, b, or c (Character Set).                          |
 * | [^abc]  | NOT a, b, or c (Negated Set).                               |
 * | [a-z]   | Lowercase letters range a to z.                             |
 * | \1      | Backreference pehle capture ( ) kye hue string ka.          |
 * | ^ , $   | Start of line / End of line (Anchors).                      |
 * | \b      | Boundary of a word (Edge detection).                        |
 * | a* , a+ | 'a' 0+ times (Star) / 'a' 1+ times (Plus).                 |
 * | a?      | 'a' zero or one time (Optional).                            |
 * | {n,m}   | Between 'n' and 'm' times (Specific range).                 |
 * | ( )     | Capturing Group (remember + extract matched segment).       |
 * | (?: )   | Non-Capturing Group (group but don't remember).             |
 * | (?= )   | Positive Lookahead (AAGE ye hona chahiye).                  |
 * | (?! )   | Negative Lookahead (AAGE ye NAHI hona chahiye).             |
 * | (?<= )  | Positive Lookbehind (PEECHE ye hona chahiye).               |
 * | (?<! )  | Negative Lookbehind (PEECHE ye NAHI hona chahiye).          |
 * | |       | Alternation (OR - ya ye ya wo).                             |
 * ========================================================================
 * 
 * 🚩 FLAGS QUICK REFERENCE:
 * | Flag | Meaning                                                       |
 * |------|---------------------------------------------------------------|
 * | g    | Global - saare matches dhundho, pehle pe ruko mat.            |
 * | i    | Case-Insensitive - capital/small same hai.                    |
 * | m    | Multiline - ^ aur $ har line pe kaam kare.                    |
 * | s    | DotAll - '.' newline ko bhi match kare.                       |
 * | u    | Unicode - emojis aur special chars support.                   |
 * | y    | Sticky - lastIndex se hi exact search karo.                   |
 * ========================================================================
 * 
 * P.S: Regex likhte waqt https://regex101.com/ sabse acha dev tool hai debug karne ke liye!
 */
