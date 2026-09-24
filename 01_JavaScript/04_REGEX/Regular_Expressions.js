/**
 * ## Quick revision
 *
 * - Literal — fixed pattern ke liye `/abc/`; dynamic text ke liye `new RegExp(...)`.
 * - Escaping — constructor string mein backslash ko extra escape karna pad sakta hai.
 * - `test`/`exec` — boolean check / match details; strings par match, search, replace, split.
 * - Flags — `i` case-insensitive, `g` all matches, `m` line anchors, `s` dot-newline, `u` Unicode mode.
 * - Classes — `\d` digit, `\w` word-character class, `\s` whitespace; uppercase variant negation.
 * - Set — `[abc]` ek listed char; `[^abc]` listed chars ke alawa.
 * - Quantifier — `*` zero+, `+` one+, `?` optional, `{m,n}` repeat range.
 * - Anchors — `^` start, `$` end, `\b` word boundary; flags meaning affect karte hain.
 * - Group — `(x)` capture, `(?:x)` non-capture, `x|y` alternatives.
 * - Backreference — `\1` pehle captured text ko dobara match karta hai.
 * - Lookaround — aas-paas ki condition check; matched text consume nahi karta.
 * - Greedy/lazy — quantifier default zyada match; `?` suffix se lazy search.
 * - Replace — `$1` capture reuse; callback se dynamic replacement.
 * - Unicode — emoji/code points ke liye Unicode-aware matching; grapheme alag concept hai.
 * - Stateful regex — `g`/`y` ke saath repeated `test` ka lastIndex badalta hai.
 * - ReDoS — untrusted/ambiguous patterns se expensive backtracking ho sakti hai.
 * - Escaped literal — user text ko regex pattern banate waqt metacharacters ka intended meaning decide karo.
 * - Capture names — named groups result ko numbered positions se zyada readable bana sakte hain.
 * - Zero-length match — manual global exec loop mein progress ensure; empty match infinite loop kara sakta hai.
 */

// EXAMPLE 1: Literal Notation
const regex1 = /hello/;  // "hello" word dhundhega string me

// EXAMPLE 2: Constructor Notation
const regex2 = new RegExp("hello");  // Same kaam, but constructor se banaya

// EXAMPLE 3: Constructor ka REAL use — Dynamic Pattern
const userInput = "JavaScript";
const dynamicRegex = new RegExp(userInput, "i");  // User input se regex banaya
// "i" flag = case insensitive (baad me detail me padhenge)

console.log(dynamicRegex.test("I love JavaScript"));  // true
console.log(dynamicRegex.test("I love python"));       // false


// ---- A) RegExp Methods ----

// test() — Sirf check karta hai: match hai ya nahi? → true/false
const pattern1 = /mango/;
console.log(pattern1.test("I like mango"));   // true  (mango mila)
console.log(pattern1.test("I like banana"));  // false (mango nahi mila)

// exec() — Match ka detail deta hai (array me) ya null
const pattern2 = /world/;
const result1 = pattern2.exec("hello world");
console.log(result1);
// Output: ["world", index: 6, input: "hello world", groups: undefined]
// index: 6 → "world" 6th position par mila
// Agar match na ho to: null


// ---- B) String Methods jo RegEx lete hain ----

const str = "I love cats and cats are cute";

// match() — Saare matches ka array
console.log(str.match(/cats/g));   // ["cats", "cats"]  (g flag = global, sab dhundho)
console.log(str.match(/dogs/g));   // null  (kuch nahi mila)

// search() — Pehle match ka index
console.log(str.search(/cats/));   // 7  (pehla "cats" index 7 pe hai)
console.log(str.search(/dogs/));   // -1 (nahi mila)

// replace() — Match ko replace karo
console.log(str.replace(/cats/, "dogs"));   
// "I love dogs and cats are cute"  (sirf pehla replace hua)
console.log(str.replace(/cats/g, "dogs"));  
// "I love dogs and dogs are cute"  (g flag se sab replace hue)

// split() — Regex se string todo
const csvData = "apple, banana,  mango ,grape";
console.log(csvData.split(/\s*,\s*/));  
// ["apple", "banana", "mango", "grape"]  
//
// BREAKDOWN of /\s*,\s*/ :
// -------------------------------------------------------
// \s  = Koi bhi SINGLE whitespace character (space, tab, newline)
// *   = 0 ya ZYADA baar (matlab space ho ya na ho, dono chalega)
// ,   = Literal comma (comma pe split hoga)
//
// So: \s*,\s* ka matlab hai:
//     "Pehle 0 ya zyada spaces, phir comma, phir 0 ya zyada spaces"
//
// Ye pattern har tarah ke comma ko handle kar leta hai:
//     ","      → comma, no space         ✓ (grape)
//     ", "     → comma + 1 space baad    ✓ (banana)
//     ",  "    → comma + 2 spaces baad   ✓ (mango)
//     " ,"     → 1 space + comma pehle   ✓ (mango)
//     " , "    → space dono taraf        ✓
//
// Agar sirf comma se split karte (bina regex):
//     csvData.split(",")  → ["apple", " banana", "  mango ", "grape"]
//     ^ Dekho! Spaces aa gaye string me! Regex ne ye problem solve kiya.

// matchAll() — Har match ki detail iterator me milti hai
const allMatches = str.matchAll(/cats/g);
for (const m of allMatches) {
    console.log(m.index, m[0]);  // 7 "cats", 20 "cats"
}


// FLAG: g (Global) — Sab dhundho, ek pe rukna nahi
console.log("aaa".match(/a/));    // ["a"]       → sirf pehla mila
console.log("aaa".match(/a/g));   // ["a","a","a"] → sab mile

// FLAG: i (Case Insensitive) — "A" aur "a" same maano
console.log(/hello/.test("Hello"));    // false (H capital hai)
console.log(/hello/i.test("Hello"));   // true  (i flag ne ignore kar diya)

// FLAG: m (Multiline) — ^ aur $ har line pe kaam karein
const multiLine = "apple\nbanana\ncherry";
console.log(multiLine.match(/^banana$/));    // null (match nahi hua kyunki ek line nhi hai)
console.log(multiLine.match(/^banana$/m));   // ["banana"] (m flag se 2nd line pe match hua)

// FLAG: s (DotAll) — Dot (.) ab newline bhi match karega
console.log(/hello.world/.test("hello\nworld"));    // false (. newline nahi match karta)
console.log(/hello.world/s.test("hello\nworld"));   // true  (s flag se ab karta hai)

// FLAG: u (Unicode) — Emoji / special chars ke liye
console.log(/😀/.test("😀"));     // true
console.log(/\u{1F600}/u.test("😀")); // true (u flag se unicode properly match hua)

// FLAG: y (Sticky) — exact lastIndex se match karo
const stickyRegex = /foo/y;
stickyRegex.lastIndex = 4;
console.log(stickyRegex.test("bar foo baz")); // true (4th index se "foo" shuru hai)


// \d — Digits dhundho
console.log("Phone: 9876".match(/\d/g));   // ["9","8","7","6"]
console.log("Phone: 9876".match(/\d+/g));  // ["9876"]  (\d+ = ek ya zyada digits ek saath)

// \D — Non-digits dhundho
console.log("Age: 25".match(/\D+/g));   // ["Age: "]  (sab kuch jo digit nahi hai)

// \w — Word characters (letters, digits, underscore)
console.log("hi_123!".match(/\w+/g));   // ["hi_123"]  (! word character nahi hai)

// \W — Non-word characters
console.log("hi_123!@#".match(/\W+/g)); // ["!@#"]

// \s — Spaces dhundho
console.log("hello world".match(/\s/g));  // [" "]

// \S — Non-spaces dhundho
console.log("a b c".match(/\S/g));  // ["a", "b", "c"]

// . (Dot) — Koi bhi single character (except newline)
console.log("cat".match(/c.t/));    // ["cat"] (a = koi bhi character)
console.log("cot".match(/c.t/));    // ["cot"]
console.log("ct".match(/c.t/));     // null (beech me koi character chahiye)


// [aeiou] — Sirf vowels dhundho
console.log("Hello World".match(/[aeiou]/gi));  // ["e","o","o"]

// [a-z] — Lowercase letters
console.log("Hello 123".match(/[a-z]+/g));  // ["ello"]

// [A-Za-z] — Saare letters (upper + lower)
console.log("H3llo W0rld".match(/[A-Za-z]+/g));  // ["H", "llo", "W", "rld"]

// [0-9] — Digits
console.log("Year 2025".match(/[0-9]+/));  // ["2025"]

// [^aeiou] — Vowels ke ALAWA sab kuch
console.log("Hello".match(/[^aeiou]/gi));  // ["H","l","l"]

// [^0-9] — Non-digits
console.log("abc123".match(/[^0-9]+/g));   // ["abc"]

// Special chars inside [] lose their power
console.log("3.14".match(/[.]/g));  // ["."]  (sirf literal dot match hua)


// * (Zero or more)
console.log("goood".match(/go*/));   // ["gooo"]  (o 3 baar aaya, sab match)
console.log("gd".match(/go*/));      // ["g"]     (o 0 baar aaya, fir bhi match coz * allows 0)

// + (One or more)
console.log("goood".match(/go+/));   // ["gooo"]  (kam se kam ek o chahiye)
console.log("gd".match(/go+/));      // null      (ek bhi o nahi, to match nahi)

// ? (Zero or one — Optional)
console.log("color".match(/colou?r/));   // ["color"]  (u optional hai)
console.log("colour".match(/colou?r/));  // ["colour"] (u hai to bhi chalega)

// {n} — Exactly n times
console.log("aaa".match(/a{2}/));     // ["aa"]  (exactly 2 a chahiye, 2 mil gaye)
console.log("a".match(/a{2}/));       // null    (sirf 1 a hai, 2 chahiye)

// {n,} — At least n times
console.log("aaaa".match(/a{2,}/));   // ["aaaa"]  (kam se kam 2 a, to 4 bhi chalega)

// {n,m} — Minimum n, Maximum m
console.log("aaaaa".match(/a{2,4}/)); // ["aaaa"]  (2 se 4 ke beech, greedy = max 4 liya)

// GREEDY vs LAZY Example:
const htmlStr = "<b>bold</b> and <i>italic</i>";

// Greedy (default) — jitna zyada ho sake
console.log(htmlStr.match(/<.+>/));     // ["<b>bold</b> and <i>italic</i>"] 
// Pura start se end tak kha gaya! (Ye galat hai agar hume ek tag chahiye tha)

// Lazy (? lagao) — jitna KAM ho sake
console.log(htmlStr.match(/<.+?>/));    // ["<b>"]
// Sirf pehla tag mila! (Ye sahi hai)

console.log(htmlStr.match(/<.+?>/g));   // ["<b>", "</b>", "<i>", "</i>"]
// Global + Lazy = sab tags alag alag mile!


// ^ — Start me match karo
console.log(/^Hello/.test("Hello World"));   // true  (string "Hello" se shuru hai)
console.log(/^Hello/.test("Say Hello"));     // false ("Hello" start me nahi hai)

// $ — End me match karo
console.log(/World$/.test("Hello World"));   // true  (string "World" pe khatam hai)
console.log(/World$/.test("World Cup"));     // false ("World" end me nahi hai)

// ^ + $ — Puri string match ho (start se end tak)
console.log(/^Hello$/.test("Hello"));        // true  (sirf "Hello" hi hai)
console.log(/^Hello$/.test("Hello World"));  // false (extra "World" bhi hai)

// \b — Word Boundary
console.log(/\bcat\b/.test("the cat sat"));     // true  ("cat" as full word mila)
console.log(/\bcat\b/.test("the cats sat"));    // false ("cats" me "cat" full word nahi)
console.log(/\bcat\b/.test("concatenate"));     // false ("cat" beech me hai, full word nahi)

// \B — Non-Word Boundary (word ke beech me)
console.log(/\Bcat\B/.test("concatenate"));     // true  ("cat" word ke andar hai)
console.log(/\Bcat\B/.test("the cat sat"));     // false ("cat" full word hai, beech me nahi)


// CAPTURING GROUP — ( )
const dateStr = "2025-04-07";
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const dateResult = dateStr.match(dateRegex);
console.log(dateResult[0]);  // "2025-04-07" (pura match)
console.log(dateResult[1]);  // "2025" (pehla group — year)
console.log(dateResult[2]);  // "04"   (doosra group — month)
console.log(dateResult[3]);  // "07"   (teesra group — day)

// NON-CAPTURING GROUP — (?: )
// Jab aapko group banana hai but capture nahi chahiye (memory save)
const nonCapture = "I like cats or dogs".match(/I like (?:cats|dogs)/);
console.log(nonCapture[0]);  // "I like cats"
console.log(nonCapture[1]);  // undefined (capture nahi hua kyunki ?: use kiya)

// NAMED GROUP — (?<name> )
const namedRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const namedResult = "2025-04-07".match(namedRegex);
console.log(namedResult.groups.year);   // "2025"
console.log(namedResult.groups.month);  // "04"
console.log(namedResult.groups.day);    // "07"
// Naam de ke access karna BAHUT readable hai. Index yaad nahi rakhna padta.

// ALTERNATION — | (OR operator)
console.log(/cat|dog/.test("I have a cat"));   // true
console.log(/cat|dog/.test("I have a dog"));   // true
console.log(/cat|dog/.test("I have a fish"));  // false

// Alternation with Group
console.log(/I like (tea|coffee)/.test("I like tea"));     // true
console.log(/I like (tea|coffee)/.test("I like coffee"));  // true
console.log(/I like (tea|coffee)/.test("I like juice"));   // false


// \1 — Same word dubara dhundho (Duplicate words detect)
const duplicateRegex = /\b(\w+)\s+\1\b/;
console.log(duplicateRegex.test("the the"));      // true  ("the" 2 baar aaya)
console.log(duplicateRegex.test("the cat"));       // false (alag alag words hain)

// Real use: Duplicate word fix karo
const badText = "I love love JavaScript";
console.log(badText.replace(/\b(\w+)\s+\1\b/, "$1"));
// "I love JavaScript"  (duplicate "love love" → "love" ban gaya)

// Named Backreference — \k<name>
const namedBackRef = /(?<word>\w+)\s+\k<word>/;
console.log(namedBackRef.test("hello hello"));     // true
console.log(namedBackRef.test("hello world"));     // false


// POSITIVE LOOKAHEAD — (?=)
// "Wo digits dhundho jinke AAGE 'px' likha ho"
console.log("width: 100px".match(/\d+(?=px)/));   // ["100"] (100 ke aage px hai ✓)
console.log("weight: 50kg".match(/\d+(?=px)/));    // null    (50 ke aage kg hai, px nahi ✗)

// NEGATIVE LOOKAHEAD — (?!)
// "Wo digits dhundho jinke AAGE 'px' NAHI likha ho"
console.log("50kg".match(/\d+(?!px)/));    // ["50"]  (50 ke aage px nahi hai ✓)
console.log("100px".match(/\d+(?!px)/));   // ["10"]  (Note: 10 ke aage "0" hai, px nahi!)
// ^ Ye tricky hai! Greedy + lookahead milke "10" match kar lete hain

// POSITIVE LOOKBEHIND — (?<=)
// "Wo amount dhundho jiske PEECHE '$' sign ho"
console.log("Price: $99".match(/(?<=\$)\d+/));   // ["99"]  ($ ke baad 99 hai ✓)
console.log("Price: ₹99".match(/(?<=\$)\d+/));   // null    ($ nahi hai ✗)

// NEGATIVE LOOKBEHIND — (?<!)
// "Wo number dhundho jiske PEECHE '$' NAHI ho"
console.log("€50".match(/(?<!\$)\d+/));  // ["50"] ($ nahi hai peeche ✓)
console.log("$50".match(/(?<!\$)\d+/));  // ["0"]  (tricky! "5" ke peeche $ hai, but "0" ke peeche "5" hai)


// Bina escape → galat result
console.log(/3.14/.test("3X14"));   // true! (. ne "X" ko bhi match kar liya 😱)

// Escape se → sahi result
console.log(/3\.14/.test("3X14"));  // false (ab sirf literal dot match hoga ✓)
console.log(/3\.14/.test("3.14"));  // true  ✓

// $ ko escape karo
console.log(/\$100/.test("Price is $100"));  // true (literal $ search kiya)

// ( ) ko escape karo
console.log(/\(hello\)/.test("(hello)"));  // true (literal parentheses match kiye)

// Backslash ko hi escape karo
console.log(/\\n/.test("\\n"));  // true (literal \n match kiya, newline nahi)


// \n — Newline match karo
const multiLineStr = "line1\nline2";
console.log(multiLineStr.match(/line1\nline2/));  // Match karega ✓

// \t — Tab match karo
console.log("name:\tSidd".match(/name:\t\w+/));  // ["name:\tSidd"] ✓

// \x41 — Hex code se "A" match karo
console.log(/\x41/.test("A"));  // true ('A' ka hex code 41 hai)

// \u0041 — Unicode se "A" match karo
console.log(/\u0041/.test("A"));  // true


// ---- 13.1 EMAIL VALIDATION ----
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Breakdown:
// ^                   → Start se shuru karo
// [a-zA-Z0-9._%+-]+  → Username part (letters, digits, dots, underscores, etc.)
// @                   → Literal "@" sign
// [a-zA-Z0-9.-]+     → Domain name (like "gmail", "yahoo")
// \.                  → Literal dot
// [a-zA-Z]{2,}       → TLD (.com, .in, .co — kam se kam 2 letters)
// $                   → End

console.log(emailRegex.test("user@gmail.com"));      // true  ✓
console.log(emailRegex.test("user.name@yahoo.co.in")); // true  ✓
console.log(emailRegex.test("user@.com"));            // false ✗
console.log(emailRegex.test("@gmail.com"));           // false ✗


// ---- 13.2 PHONE NUMBER VALIDATION (Indian 10-digit) ----
const phoneRegex = /^[6-9]\d{9}$/;
// Breakdown:
// ^        → Start
// [6-9]    → Pehla digit 6, 7, 8, ya 9 hona chahiye (Indian numbers)
// \d{9}    → Baaki exactly 9 digits
// $        → End

console.log(phoneRegex.test("9876543210"));   // true  ✓
console.log(phoneRegex.test("1234567890"));   // false ✗ (1 se start nahi ho sakta)
console.log(phoneRegex.test("987654"));       // false ✗ (sirf 6 digits)


// ---- 13.3 PASSWORD STRENGTH CHECK ----
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Breakdown:
// (?=.*[a-z])       → Kam se kam ek lowercase letter hona chahiye
// (?=.*[A-Z])       → Kam se kam ek uppercase letter
// (?=.*\d)          → Kam se kam ek digit
// (?=.*[@$!%*?&])   → Kam se kam ek special character
// [A-Za-z\d@$!%*?&]{8,} → Total length minimum 8 characters
// Sab lookaheads hain — check karte hain but consume nahi karte

console.log(passwordRegex.test("Abc@1234"));   // true  ✓
console.log(passwordRegex.test("abcd1234"));   // false ✗ (uppercase & special missing)
console.log(passwordRegex.test("Ab@1"));       // false ✗ (too short, 8 chahiye)


// ---- 13.4 URL VALIDATION ----
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
// Breakdown:
// (https?:\/\/)?     → "http://" ya "https://" (optional, s? = s optional)
// ([\w-]+\.)+        → Domain parts jaise "www." ya "sub.domain."
// [\w-]+             → Top level domain jaise "com"
// (\/[\w-./?%&=]*)? → Path part (optional, jaise "/page?q=1")

console.log(urlRegex.test("https://www.google.com"));         // true  ✓
console.log(urlRegex.test("http://example.com/path?q=123"));  // true  ✓
console.log(urlRegex.test("google.com"));                     // true  ✓
console.log(urlRegex.test("not a url"));                      // false ✗


// ---- 13.5 HTML TAG MATCH ----
// Opening+Closing tag with same name match karo
const htmlTagRegex = /<(\w+)>(.*?)<\/\1>/;
// Breakdown:
// <(\w+)>    → Opening tag capture karo (jaise <b>, <div>)
// (.*?)      → Tag ke andar ka content (lazy match)
// <\/\1>     → Closing tag jo opening ke SAME ho (\1 = backreference)

const htmlTest = "<b>bold text</b>";
const tagResult = htmlTest.match(htmlTagRegex);
console.log(tagResult[0]);  // "<b>bold text</b>" (pura match)
console.log(tagResult[1]);  // "b"                (tag name)
console.log(tagResult[2]);  // "bold text"         (content)


// ---- 13.6 EXTRACT NUMBERS FROM STRING ----
const messyStr = "I have 3 cats, 12 dogs, and 100 fish";
const numbers = messyStr.match(/\d+/g).map(Number);
console.log(numbers);  // [3, 12, 100]


// ---- 13.7 REPLACE MULTIPLE SPACES WITH SINGLE SPACE ----
const spacey = "too    many     spaces   here";
console.log(spacey.replace(/\s+/g, " "));
// "too many spaces here"


// ---- 13.8 CAMELCASE TO KEBAB-CASE CONVERTER ----
const camel = "backgroundColor";
const kebab = camel.replace(/([A-Z])/g, "-$1").toLowerCase();
console.log(kebab);  // "background-color"
// ([A-Z]) → Uppercase letter capture karo
// -$1     → Uske pehle "-" lagao, $1 = captured letter


// ---- 13.9 INDIAN PINCODE VALIDATION ----
const pincodeRegex = /^[1-9][0-9]{5}$/;
// Pehla digit 1-9 (0 se start nahi hota pincode)
// Baaki 5 digits (0-9)
console.log(pincodeRegex.test("110001"));  // true  ✓ (Delhi)
console.log(pincodeRegex.test("012345"));  // false ✗ (0 se start)
console.log(pincodeRegex.test("1234"));    // false ✗ (sirf 4 digits)


// ---- 13.10 DATE FORMAT (DD/MM/YYYY) VALIDATION ----
const dateFormatRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
// DD:  01-09, 10-29, 30-31
// MM:  01-09, 10-12
// YYYY: koi bhi 4 digit
console.log(dateFormatRegex.test("07/04/2025"));  // true  ✓
console.log(dateFormatRegex.test("32/13/2025"));  // false ✗ (32nd date? 13th month?)
console.log(dateFormatRegex.test("7/4/2025"));    // false ✗ (single digit, 07/04 chahiye)


// Example: Sab words ko capitalize karo (Title Case)
const sentence = "hello world from javascript";
const titled = sentence.replace(/\b\w/g, (char) => char.toUpperCase());
console.log(titled);  // "Hello World From Javascript"
// \b\w → har word ka pehla character, usse uppercase karo

// Example: Template literals jaise kaam — variables replace karo
const template = "Hello {name}, you are {age} years old!";
const data = { name: "Sidd", age: 22 };
const filled = template.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
console.log(filled);  // "Hello Sidd, you are 22 years old!"

// Example: Prices ko double karo
const priceStr = "Apple: $5, Banana: $3, Mango: $10";
const doubled = priceStr.replace(/\$(\d+)/g, (match, price) => "$" + (price * 2));
console.log(doubled);  // "Apple: $10, Banana: $6, Mango: $20"


// Date format change: YYYY-MM-DD → DD/MM/YYYY
const isoDate = "2025-04-07";
const indianDate = isoDate.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
console.log(indianDate);  // "07/04/2025"

// First name Last name → Last name, First name
const fullName = "Siddharth Sharma";
const reversed = fullName.replace(/(\w+)\s(\w+)/, "$2, $1");
console.log(reversed);  // "Sharma, Siddharth"

// $& — Pura match use karo
const highlighted = "I love JavaScript".replace(/JavaScript/, "**$&**");
console.log(highlighted);  // "I love **JavaScript**"


// Emoji detect karo
const emojiRegex = /\p{Emoji}/gu;
console.log("Hello 😀🎉 World".match(emojiRegex));  
// ["😀", "🎉"]

// Hindi (Devanagari) characters detect karo
const hindiRegex = /\p{Script=Devanagari}+/gu;
console.log("Hello नमस्ते World".match(hindiRegex));  
// ["नमस्ते"]

// Kisi bhi language ke letters 
const anyLetter = /\p{L}+/gu;
console.log("Hello مرحبا 你好".match(anyLetter));  
// ["Hello", "مرحبا", "你好"]
// 17. REGEX PERFORMANCE TIPS
// NOTES:
// - RegEx powerful hai, but galat use se SLOW bhi ho sakta hai.
// - Yahan kuch tips hain performance better rakhne ke liye:
//
// 1. BE SPECIFIC — General patterns (jaise .*) avoid karo jab exact pattern pata ho.
//    ❌ /.*@.*\..*/   (bahut zyada backtracking hogi)
//    ✅ /[\w.]+@[\w.]+\.\w{2,}/  (specific characters = fast)
//
// 2. USE NON-CAPTURING GROUPS — Agar capture zaruri nahi, to (?:) use karo.
//    ❌ /(cat|dog)/   (capture bhi karega, memory use hogi)
//    ✅ /(?:cat|dog)/  (sirf match karega, capture nahi)
//
// 3. ANCHORS USE KARO — ^ aur $ lagao jab puri string check karni ho.
//    ❌ /\d{10}/      (string me kahin bhi 10 digits dhundhe ga)
//    ✅ /^\d{10}$/    (sirf 10 digit ki string match karegi)
//
// 4. AVOID CATASTROPHIC BACKTRACKING:
//    - Nested quantifiers bahut DANGEROUS hain: /(a+)+/
//    - Ye exponential time le sakta hai lamba input pe!
//    ❌ /(a+)+b/      → "aaaaaac" pe bahut slow hoga
//    ✅ /a+b/         → Same kaam, but fast
//
// 5. COMPILE ONCE, USE MANY:
//    ❌ Loop me nayi regex banana
//       for(let i=0; i<1000; i++) { "abc".match(new RegExp("abc")); }
//    ✅ Ek baar banao, baar baar use karo
//       const re = /abc/;
//       for(let i=0; i<1000; i++) { "abc".match(re); }
