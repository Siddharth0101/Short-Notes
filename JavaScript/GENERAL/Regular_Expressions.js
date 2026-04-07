'use strict';

/**
 * ========================================================================
 * 1. INTRODUCTION TO REGULAR EXPRESSIONS (REGEXP OYa REGEX)
 * ========================================================================
 * NOTES:
 * - Regular Expression (Regex) ek pattern hota hai jiska use hum text me se kuch dhundhne (search),
 *   badalne (replace) ya extract karne ke liye karte hain.
 * - Jaise man lo ek bahut bada text hai aur usme se hume saare "Email IDs" dhundhne hain, toh hum
 *   Regex ka use karenge kiyun ki normal string methods (indexOf) itne complex patterns nahi dhundh sakte.
 * 
 * USE CASES (Kahan use hota hai?):
 * 1. Form Validation (Email sahi format me hai ya nahi, Password strong hai ya nahi).
 * 2. Search & Replace (Kahin pe likhe saare 'color' ko 'colour' karna).
 * 3. Text Extraction (Ek lambi string me se saare phone numbers bahar nikalna).
 */

// --- EXAMPLES ---
const sampleText = "Mera email siddharth@gmail.com hai aur phone 9876543210 hai.";
// Regex se asani se data nikal sakte hain bina string ko todhe-marode:
const emailFinderRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/;
console.log("Found Email:", sampleText.match(emailFinderRegex)[0]); // Output: siddharth@gmail.com


/**
 * ========================================================================
 * 2. CREATING REGULAR EXPRESSIONS (Banaate Kaise Hain?)
 * ========================================================================
 * Regex banane ke 2 main tareeke hote hain:
 * 
 * A) REGEX LITERAL (Sabse zyada use hone wala):
 * - Isme hum pattern ko do forward slashes /.../ ke de beech likhte hain.
 * - Isko Javascript engine script load hote hi parse aur compile kar deta hai (Performance behtar hai).
 * 
 * B) REGEXP CONSTRUCTOR (Jab pattern dynamic ho):
 * - Jab aapko regex run-time pe banana ho, jaise user ki input le kar. Isme pattern string me diya jata hai.
 * - Dhyan dein: Constructor me backslash ko double escape karna padta hai (jaise \\d instead of \d).
 */

// --- EXAMPLES ---
// -> Literal Approach
const regexLiteral = /hello/;
console.log("Literal match: ", regexLiteral.test("hello world")); // true

// -> Constructor Approach
const userSearchKeyword = "siddharth";
const dynamicRegex = new RegExp(userSearchKeyword, "gi"); // 'g' = global, 'i' = case-insensitive
console.log("Constructor match: ", dynamicRegex.test("Hi Siddharth, how are you?")); // true


/**
 * ========================================================================
 * 3. REGEX FLAGS (Modifers - Search ka behavior badalna)
 * ========================================================================
 * Flags ko pattern ke aakhir me lagaya jata hai. Jaise: /pattern/g
 * 
 * - g (Global): By default regex pehli match milte hi ruk jata hai. 'g' batata hai ki rukna nahi hai, pura text search karo.
 * - i (Case-Insensitive): Capital aur small letters me farq nahi rakhta. 
 * - m (Multiline): Agar string multiple lines me hai (\n), toh ^ (start) aur $ (end) anchors ko har line ke aakhri/shuru me check karta hai.
 * - u (Unicode): Unicode characters aur emojis wagara support karne k liye.
 * - y (Sticky): Search ko exactly 'lastIndex' property ki position se hi dhoondna shuru karta hai, aage skip nahi karta.
 * - s (DotAll): By default '.' (dot) har char ko match karta hai except newline (\n). 's' flag se '.' newline ko bhi match karega.
 */

// --- EXAMPLES ---
const strFlags = "Hello hello HeLLo";

// Bina 'g' Flag ke:
console.log("Without 'g':", strFlags.match(/hello/i));
// Sirf pehla hoke aayega, aur baqi string ignore.

// 'g' aur 'i' Flags ke saath:
console.log("With 'g' and 'i':", strFlags.match(/hello/gi));
// Output: [ 'Hello', 'hello', 'HeLLo' ] -> Teeno utha lie.


/**
 * ========================================================================
 * 4. METACHARACTERS (Special Characters jinke paas jadoo hai)
 * ========================================================================
 * Ye sabse important block hai, isse syntax banta hai:
 * 
 * - . (Dot)   : Matches koi bhi SINGLE character (A-Z, a-z, 0-9, special char) except new-line (\n).
 * - \d        : Matches a DIGIT (Number 0 - 9).
 * - \D        : Matches a NON-DIGIT (0-9 ko chhor k kuch bhi, i.e., letter, space).
 * - \w        : Matches a WORD character (alphanumeric aur underscore: A-Z, a-z, 0-9, _).
 * - \W        : Matches a NON-WORD character (spaces, punctuation jese !@#%).
 * - \s        : Matches a SPACE character (space, tab, newline).
 * - \S        : Matches NON-SPACE character.
 * - \ (Escape): Agar aapko actually dot (.) ya \ dhundhna hai toh iska use karte hain (e.g. \. matches a literal dot).
 */

// --- EXAMPLES ---
console.log("Dot (.) Demo :", /h.t/.test("hat"), /h.t/.test("hot"), /h.t/.test("h t")); // Teeno True

const phoneString = "My number is 123-456.";
console.log("Number (\\d) Extract:", phoneString.match(/\d/g));
// Output: [ '1', '2', '3', '4', '5', '6' ] (Saare digits aagye)

console.log("Word char (\\w) vs Symbols:", "A 1_!".match(/\w/g));
// Output: [ 'A', '1', '_' ] ('!' word ni hai na hi space)

console.log("Escape Dot (\\.) :", /www\.google\.com/.test("www.google.com")); // True


/**
 * ========================================================================
 * 5. CHARACTER CLASSES & SETS (Apni marzi k rules)
 * ========================================================================
 * Inko Square Brackets [] ke beech me likhte hain. Ye us location ke liye sirf ek character ko represent karte hain.
 * 
 * - [aeiou]   : String me a, e, i, o, ya u me se KUCH BHI ek letter dhundho.
 * - [a-z]     : a se le kr z tak koi bhi small letter.
 * - [A-Z]     : A se le kr Z tak koi bhi Capital letter.
 * - [0-9]     : Koi bhi numbers (\d ke barabar hai).
 * - [a-zA-Z]  : Koi bhi letter, chahe small ho ya capital.
 * - [^aeiou]  : (^) bracket ke andar NEGATION (Nahi chahiye) ka kaam karta hai. Matlab Inke ILAAWA koi bhi char chalega.
 */

// --- EXAMPLES ---
const textSet = "I have a cat, a bat, and a rat.";
console.log("Character Set [cb]at :", textSet.match(/[cb]at/g));
// Output: [ 'cat', 'bat' ] (rat nahi lia)

console.log("Negation Set [^cb]at:", textSet.match(/[^cb]at/g));
// Output: [ 'rat' ] (cat aur bat reject hue negatives k karan)

console.log("Vowels only:", "Siddharth".match(/[aeiou]/g));
// Output: ['i', 'a']


/**
 * ========================================================================
 * 6. QUANTIFIERS (Kitni baar aana chahiye?)
 * ========================================================================
 * Quantity batane k liye use hote hain ki pichla character kitni baar repeat hoga.
 * 
 * - * (Asterisk) : 0 or MORE times. (Gaayab ho ya kitni baar bhi aaye). Example: a* (matches "", "a", "aaaa")
 * - + (Plus)     : 1 or MORE times. (Kam se kam 1 baar toh aana hi chahiye). Example: a+ (matches "a", "aaa")
 * - ? (Question) : 0 or 1 time. (Optional! Ho toh 1 baar ho, warna na ho). Example: colou?r matching "color" and "colour".
 * - {n}          : Exact 'n' times. Example: \d{3} (Exactly 3 numbers).
 * - {n,}         : Kam se kam 'n' times. Example: \d{3,} (3 ya us se zyada numbers).
 * - {n,m}        : 'n' se le kr 'm' times tak. Example: \d{3,5} (3 se 5 numbers k beech hongay).
 * 
 * 💡 GREEDY VS LAZY (Important Trick):
 * - By default *, +, aur {n,} "Greedy" hote hain. Ye zyada se zyada match lene ki koshish karte hain.
 * - Agar inke aage '?' lagadein (e.g., *? ya +?), tab ye "Lazy" ban jate hain aur kam se kam characters uthate hain.
 */

// --- EXAMPLES ---
console.log("Zero or more (*) :", "gooooogle".match(/go*gle/)); // True
console.log("One or more (+) :", /a+/.test("")); // False, kam ze kam ek 'a' chahiye

console.log("Optional (?) :", "color".match(/colou?r/), "colour".match(/colou?r/));
// Dono me match milega kyuki 'u' Optional (?) hai.

console.log("Specific Quantity {3}:", "12345".match(/\d{3}/)); // [ '123' ]

// GREEDY VS LAZY Demo:
const htmlTag = "<div>This is a div</div> <span>span span</span>";
console.log("Greedy [*]:", htmlTag.match(/<.*>/));
// Pura string end tk extract hogaya: "<div>This is a div</div> <span>span span</span>"
console.log("Lazy [*?]:", htmlTag.match(/<.*?>/));
// Samajhdaar: Sirf pehle bracket bnd hoty sath match kra: "<div>"


/**
 * ========================================================================
 * 7. ANCHORS AND BOUNDARIES (Positions / Bounds)
 * ========================================================================
 * Ye batate hain ki match string ke kahan hona chahiye. Ye character nahi directly positions check karte hain.
 * 
 * - ^ (Caret)  : String/Line ke ekdum SHURU (Start) me match hona chahiye. Example: /^Hello/ 
 * - $ (Dollar) : String/Line ke ekdum AAKHIR (End) me. Example: /World$/
 * - \b         : Word Boundary. Word wahan start ya end ho raha ho.
 * - \B         : Non-Word Boundary. Jaha pe boundary nahi honi chahiye.
 */

// --- EXAMPLES ---
console.log("Start Anchor (^):", /^Hello/.test("Hello world")); // True
console.log("End Anchor ($):", /\.com$/.test("google.com")); // True

const boundaryStr = "cat category comcat";
console.log("Without Boundary:", boundaryStr.match(/cat/g));
// ['cat', 'cat', 'cat'] qk teeno ke word me andar 'cat' chuupa hy.

console.log("With Boundary (\\b):", boundaryStr.match(/\bcat\b/g));
// ['cat'] (Sirf wohi match hua jo akela stand-alone 'cat' hy).


/**
 * ========================================================================
 * 8. GROUPS & ALTERNATION (Sath jodna aur Options dena)
 * ========================================================================
 * 
 * A) ALTERNATION (OR / Ya toh ye ya toh wo) -> |
 * - /apple|orange/ : Ya toh 'apple' dhundho ya phir 'orange'.
 * 
 * B) CAPTURING GROUPS -> ( )
 * - Agar multiple pieces pe ek rule (quantifier) lagana hai, ya match hone pe ek hisse ko variable k roop me yaad rakhna hai.
 * - Example: /(ha)+/ matches "haha", "hahaha".
 * 
 * C) NON-CAPTURING GROUPS -> (?: )
 * - Jab aapko brackets sirf grouping k liye chahiye, par engine ki memory waste nahi karni inko yaad rakhne me.
 * 
 * D) NAMED CAPTURING GROUPS -> (?<name> )
 * - Capture hue result ka ek index hota hai, par named groups se tag lag jata hai result pe jisko use karna aasan hai.
 * 
 * E) BACKREFERENCES -> \1, \2
 * - Pura pattern me agar group ( ) ne pehle kuch match kar liya hai, aur aap chahte ho ki EXACT wahi text aage dubara test ho, toh \1 (group 1 ke liye) ka use karte hain.
 */

// --- EXAMPLES ---
console.log("Alternation OR (|):", "I want an orange".match(/apple|orange/)); // ['orange']

// Capturing Data (Extract karna Parts Ko)
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const dateMatch = "Today is 2024-04-07".match(dateRegex);
console.log("Full Regex Match:", dateMatch[0]); // 2024-04-07
console.log("Match Group (1) Year:", dateMatch[1]);  // 2024

// Named Groups 
const namedDateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const namedResult = "My birthdate is 1999-12-05".match(namedDateRegex);
console.log("Named Group Extracted:", namedResult.groups.year); // Output: 1999

// Backreferences (\1)
// Find repeated words like "hello hello"
const repeatRegex = /\b(\w+)\s+\1\b/; 
console.log("Repeated Word Match:", "I like to to go home".match(repeatRegex)[0]); // Output: "to to"


/**
 * ========================================================================
 * 9. LOOKAHEADS & LOOKBEHINDS (Conditions check karna)
 * ========================================================================
 * Interview ka adv topic! Aapko match check toh krna hai samne or piche, par result me nahi chahiye.
 * 
 * - (?=...)  AAGE POSITIVE (Lookahead): Match only agar iske AAGE wo condition ho.
 * - (?!...)  AAGE NEGATIVE (Negative Lookahead): Match only agar iske AAGE wo nahi ho.
 * - (?<=...) PICHE POSITIVE (Lookbehind): Match tabhi hoga agar iske PICHE wo condition ho.
 * - (?<!...) PICHE NEGATIVE (Negative Lookbehind): Match agar piche wo NAHI ho.
 */

// --- EXAMPLES ---
const textLA = "1st 2nd 3rd 4forth";
// Hmain dhundhna hai sirft Number(\d) -> par condition (?=) hai k aage letter hi hone chaiyain.
console.log("Positive Lookahead (?=):", textLA.match(/\d(?=[a-z])/g));
// ['1', '2', '3', '4']

const moneyStr = "Item 1 costs $100 and Item 2 costs €50";
// Muje price chayie -> Sirf wo number jis se theek pehle $ lag rha ho.
console.log("Positive Lookbehind (?<=):", moneyStr.match(/(?<=\$)\d+/g));
// Result me dollar nikal gya = ['100']


/**
 * ========================================================================
 * 10. JAVASCRIPT REGEX METHODS (Functions jo actually check karenge)
 * ========================================================================
 * 
 * REGEXP METHODS (Regex object ke andar hote hai):
 * 1. regex.test(string) -> (V. IMP) true ya false return karta hai ki match mila ya nahi. Validation me use hota hai.
 * 2. regex.exec(string) -> Ek array laata hai pure match ki details k sath. Global 'g' flag hai toh baar baar loop mein use kar sakte hain.
 * 
 * STRING METHODS (String object ke andar hote hai, inme regex pass kiya jata hai):
 * 1. string.match(regex)    -> Array deta hai matches ka 'g' flag k sath.
 * 2. string.matchAll(regex) -> Ek Iterator deta hai bohut saare matches aur groups ki details ke sath (es2020 feature).
 * 3. string.replace(regex, replaceText) -> Substring ko badalne k liye.
 * 4. string.replaceAll(regex, text) -> Sare occurrences hata k naya text put krta hai. global hona zaruri.
 * 5. string.search(regex)   -> exact indexOf ki tarah pehla index position return karega.
 * 6. string.split(regex)    -> Array banayega split karte hue.
 */

// --- EXAMPLES ---
const sentence = "I love Javascript. Javascript is fun!";

console.log("regex.test():", /Javascript/.test(sentence)); // true

const execRegex = /Javascript/g;
console.log("regex.exec() (Pehli Baar):", execRegex.exec(sentence)[0]); // Javascript

console.log("string.match():", sentence.match(/Javascript/g)); // ['Javascript', 'Javascript']

console.log("string.replace():", sentence.replace(/Javascript/g, "Python"));
// I love Python. Python is fun!

console.log("string.search():", "Where is apple?".search(/apple/)); // 9

console.log("string.split():", "a,b;c-d".split(/[,;-]/)); // [ 'a', 'b', 'c', 'd' ]


/**
 * ========================================================================
 * 11. ADVANCED REAL WORLD EXAMPLES:
 * ========================================================================
 */
// 1. Validating Email
const emailRule = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
console.log("Email Check 1:", emailRule.test("test@gmail.com")); // true
console.log("Email Check 2:", emailRule.test("test@gmailcom")); // false (no dot)

// 2. Extracting Hastags from Tweet
const tweet = "I love learning #Javascript and #Regex !";
console.log("Hashtags found:", tweet.match(/#[a-z0-9_]+/gi));
// Output: [ '#Javascript', '#Regex' ]


/**
 * ========================================================================
 * FINAL REVISION TABLE 📝 (Regex Metacharacters Quick Guide)
 * ========================================================================
 * | Symbol  | Meaning                                          |
 * |---------|--------------------------------------------------|
 * | .       | Any character (except newline).                  |
 * | \w \W   | Word char (a-z0-9_) / NON-Word.                  |
 * | \d \D   | Number / NON-Number.                             |
 * | \s \S   | Space / NON-Space.                               |
 * | [abc]   | Any of a, b, or c.                               |
 * | [^abc]  | NOT a, b, or c.                                  |
 * | [a-z]   | Lowercase letters from a to z.                   |
 * | \1      | Backreference pehle capture ( ) kye hue string ka|
 * | ^ , $   | Start of line / End of line.                     |
 * | \b      | Boundary of a word.                              |
 * | a* , a+ | 'a' 0 or more times / 'a' 1 or more times.       |
 * | a?      | 'a' zero or one time (optional).                 |
 * | {n,m}   | Between 'n' and 'm' times.                       |
 * | ( )     | Capturing Group (remember matched segment).      |
 * | (?: )   | Non-Capturing Group (group but don't remember).  |
 * | (?= )   | Lookahead (must be followed by).                 |
 * ========================================================================
 * P.S: Regex likhte waqt https://regex101.com/ sabse acha dev tool hai isey debug karne ke liye!
 */
