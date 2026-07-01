/**
 * ========================================================================
 * REGULAR EXPRESSIONS (RegEx) IN JAVASCRIPT - COMPLETE GUIDE
 * ========================================================================
 * NOTES:
 * - Regular Expression (ya short me "RegEx") ek text pattern hota hai jo hum use
 *   karte hain kisi string me se kuch SEARCH, MATCH, REPLACE ya VALIDATE karne 
 *   ke liye.
 * - Jaise ki email validate karna, phone number dhundhna, ya kisi text me se 
 *   specific word nikalna — ye sab RegEx se hota hai.
 * - JavaScript me RegEx ek special object hota hai (RegExp object).
 * - Ye har programming language me hota hai, but yahan hum JavaScript ke context 
 *   me sikhenge.
 * 
 * REAL LIFE EXAMPLE SAMJHO:
 * - Sochlo aapke paas ek 1000 pages ki book hai aur aapko usme se sirf "JavaScript" 
 *   word dhundhna hai — to RegEx wahi kaam karta hai, par strings ke andar!
 */


/**
 * ========================================================================
 * 1. RegEx BANANE KE 2 TARIKE (Creating Regular Expressions)
 * ========================================================================
 * NOTES:
 * - JavaScript me RegEx banane ke 2 tarike hain:
 * 
 *   1. LITERAL NOTATION (/ / ke andar likhte hain) — Ye sabse common hai.
 *      Syntax: /pattern/flags
 * 
 *   2. CONSTRUCTOR NOTATION (new RegExp() se banate hain) — Jab pattern 
 *      dynamically (runtime pe) banana ho tab use hota hai.
 *      Syntax: new RegExp("pattern", "flags")
 * 
 * DIFFERENCE:
 * - Literal me pattern fix hota hai (hard-coded).
 * - Constructor me aap variable se pattern bana sakte ho (dynamic).
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


/**
 * ========================================================================
 * 2. RegEx METHODS (RegEx ke saath kaunse methods use hote hain?)
 * ========================================================================
 * NOTES:
 * - RegEx ko use karne ke liye kuch built-in methods hain. Ye 2 jagah se aate hain:
 * 
 *   A) RegExp Object ke methods:
 *      - test()  → true/false return karta hai (match mila ya nahi)
 *      - exec()  → match ka detailed result (array) return karta hai, ya null
 * 
 *   B) String Object ke methods (jo regex accept karte hain):
 *      - match()   → saare matches ka array deta hai
 *      - search()  → pehle match ka INDEX deta hai (-1 agar na mile)
 *      - replace() → match ko replace karke NEW string deta hai
 *      - split()   → regex ke basis par string ko TODTA hai (array me)
 *      - matchAll() → saare matches ka iterator deta hai (detailed info ke saath)
 */

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


/**
 * ========================================================================
 * 3. FLAGS (Regex ke Flags / Modifiers)
 * ========================================================================
 * NOTES:
 * - Flags regex ke behaviour ko change karte hain. 
 * - Ye regex ke BAAD likhte hain: /pattern/flags
 * - Multiple flags ek saath use kar sakte ho: /pattern/gi
 * 
 * IMPORTANT FLAGS:
 * 
 * | Flag | Naam              | Kya karta hai?                                              |
 * |------|-------------------|-------------------------------------------------------------|
 * | g    | Global            | SAARE matches dhundhta hai (pehle match pe nahi rukta)      |
 * | i    | Case Insensitive  | Upper/Lower case ignore karta hai ("A" = "a")               |
 * | m    | Multiline         | ^ aur $ har line ke start/end pe kaam karte hain            |
 * | s    | DotAll            | Dot (.) newline (\n) ko bhi match karta hai                 |
 * | u    | Unicode           | Unicode characters (emoji, etc.) sahi se match hote hain    |
 * | y    | Sticky            | lastIndex position se hi match karta hai (exact position)   |
 * | d    | hasIndices        | Match ke start/end indices bhi deta hai                     |
 */

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


/**
 * ========================================================================
 * 4. CHARACTER CLASSES (Character ka type batao)
 * ========================================================================
 * NOTES:
 * - Character classes se hum bata sakte hain ki hume KAUNSE type ke characters 
 *   chahiye — jaise digit, letter, space, etc.
 * 
 * | Shorthand | Full Form     | Matlab                                        |
 * |-----------|---------------|-----------------------------------------------|
 * | \d        | [0-9]         | Koi bhi DIGIT (0 se 9)                        |
 * | \D        | [^0-9]        | Jo digit NAHI hai (letter, symbol, space)      |
 * | \w        | [a-zA-Z0-9_]  | Koi bhi WORD character (letter, digit, _)     |
 * | \W        | [^a-zA-Z0-9_] | Jo word character NAHI hai (space, @, #, etc) |
 * | \s        |               | Koi bhi SPACE/WHITESPACE (space, tab, newline) |
 * | \S        |               | Jo SPACE nahi hai                              |
 * | .         |               | Koi BHI character (except newline by default)  |
 */

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


/**
 * ========================================================================
 * 5. CHARACTER SETS & RANGES ( [ ] brackets)
 * ========================================================================
 * NOTES:
 * - Square brackets [ ] ke andar hum APNE CUSTOM character groups define 
 *   kar sakte hain.
 * - [abc]    → "a" YA "b" YA "c" me se koi bhi ek
 * - [a-z]    → "a" se "z" tak koi bhi lowercase letter
 * - [A-Z]    → koi bhi uppercase letter
 * - [0-9]    → koi bhi digit (same as \d)
 * - [a-zA-Z] → koi bhi letter (upper ya lower)
 * 
 * NEGATION (Ulta):
 * - [^abc]   → "a", "b", "c" ke ALAWA koi bhi character
 * - [^0-9]   → digits ke alawa kuch bhi (same as \D)
 * 
 * IMPORTANT:
 * - [ ] ke andar special characters (jaise . * +) apna special meaning KHO dete hain.
 *   Matlab [.] ka matlab sirf literal dot (.) hai, "koi bhi character" nahi.
 */

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


/**
 * ========================================================================
 * 6. QUANTIFIERS (Kitni baar repeat ho?)
 * ========================================================================
 * NOTES:
 * - Quantifiers batate hain ki ek character ya group KITNI BAAR aana chahiye.
 * 
 * | Quantifier | Matlab                                                    |
 * |------------|-----------------------------------------------------------|
 * | *          | 0 ya zyada baar (kuch bhi ho, chahe ek bhi na ho)         |
 * | +          | 1 ya zyada baar (kam se kam ek to hona chahiye)            |
 * | ?          | 0 ya 1 baar (ho ya na ho, optional hai)                    |
 * | {n}        | EXACTLY n baar (na kam, na zyada)                          |
 * | {n,}       | Kam se kam n baar (n ya usse zyada)                        |
 * | {n,m}      | Minimum n baar, Maximum m baar                             |
 * 
 * GREEDY vs LAZY:
 * - By default quantifiers GREEDY hote hain — jitna zyada match ho sake utna karte hain.
 * - Lazy banane ke liye quantifier ke baad ? lagao — jitna KAM ho sake utna match karega.
 */

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


/**
 * ========================================================================
 * 7. ANCHORS (Position mark karo — kahan se shuru, kahan pe khatam)
 * ========================================================================
 * NOTES:
 * - Anchors kisi character ko match NAHI karte, ye POSITION ko match karte hain.
 * 
 * | Anchor | Matlab                                                        |
 * |--------|---------------------------------------------------------------|
 * | ^      | String ke SHURU me match karo (ya line ke shuru me with 'm')  |
 * | $      | String ke END me match karo (ya line ke end me with 'm')      |
 * | \b     | WORD BOUNDARY — jahan word shuru ya khatam hota hai           |
 * | \B     | NON-WORD BOUNDARY — word ke beech me (boundary ke alawa)      |
 * 
 * WORD BOUNDARY (\b) Samjho:
 * - "cat" me → \b hoga: _c-a-t_ (shuru aur end dono pe boundary hai)
 * - "cats" me "cat" dhundhne pe → \bcat\b se "cat" match NAHI hoga kyunki 
 *   "cat" ke baad "s" hai (boundary nahi hai wahan)
 */

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


/**
 * ========================================================================
 * 8. GROUPS & ALTERNATION (Grouping aur OR operator)
 * ========================================================================
 * NOTES:
 * - Parentheses ( ) se hum pattern ko GROUP kar sakte hain.
 * - Groups ke major uses:
 *   1. CAPTURING — Match ke hisse ko alag se capture karna (baad me use karna)
 *   2. QUANTIFIER apply karna — Puri group pe * ya + lagana
 *   3. ALTERNATION (|) — "ye YA wo" type condition banana (OR operator)
 * 
 * TYPES OF GROUPS:
 * | Syntax      | Type               | Kya karta hai?                           |
 * |-------------|--------------------|------------------------------------------|
 * | (abc)       | Capturing Group    | "abc" match + capture karega (memory me) |
 * | (?:abc)     | Non-Capturing Group| "abc" match karega, but capture NAHI      |
 * | (?<name>abc)| Named Group        | "abc" match + naam de ke capture karega  |
 * | (a|b)       | Alternation        | "a" YA "b" me se koi bhi match karega   |
 */

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


/**
 * ========================================================================
 * 9. BACKREFERENCES (Pehle capture kiya hua dobara use karo)
 * ========================================================================
 * NOTES:
 * - Jab aap capturing group se kuch capture karte ho, to wahi cheez dobara 
 *   match karne ke liye BACKREFERENCE use karte ho.
 * - \1 → Pehle group ka match dubara dhundho
 * - \2 → Doosre group ka match dubara dhundho
 * - Named backreference: \k<name>
 * 
 * USE CASE:
 * - Repeated words dhundhna (jaise "the the" — galti se 2 baar likha hua)
 * - Matching opening and closing HTML tags
 */

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


/**
 * ========================================================================
 * 10. LOOKAHEAD & LOOKBEHIND (Aage/Peeche dekho, par match me mat lo)
 * ========================================================================
 * NOTES:
 * - Ye "assertions" hain — ye check karte hain ki match ke AAGE ya PEECHE 
 *   kya hai, but wo part match me include NAHI hota.
 * - Sochlo jaise aap kisi se puchho: "Samne chai ki dukaan hai kya?" — aap 
 *   chai ki dukaan ko dekhte ho but usse nahi milte, sirf confirm karte ho.
 * 
 * | Syntax     | Naam                | Matlab                                           |
 * |------------|---------------------|--------------------------------------------------|
 * | (?=abc)    | Positive Lookahead  | AAGE "abc" HONA chahiye (tab match karo)          |
 * | (?!abc)    | Negative Lookahead  | AAGE "abc" NAHI hona chahiye (tab match karo)      |
 * | (?<=abc)   | Positive Lookbehind | PEECHE "abc" HONA chahiye (tab match karo)         |
 * | (?<!abc)   | Negative Lookbehind | PEECHE "abc" NAHI hona chahiye (tab match karo)    |
 */

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


/**
 * ========================================================================
 * 11. ESCAPE CHARACTERS (Special Characters ko literal banana)
 * ========================================================================
 * NOTES:
 * - RegEx me kuch characters SPECIAL hain — inke apne meaning hote hain.
 * - Agar aapko inhe literally (as it is) match karna hai, to BACKSLASH (\) lagao.
 * 
 * SPECIAL CHARACTERS JO ESCAPE CHAHTE HAIN:
 * . * + ? ^ $ { } [ ] ( ) | \ /
 * 
 * EXAMPLE:
 * - . ka matlab "koi bhi character" hai. But agar aapko literal DOT chahiye to \. likho.
 * - $ ka matlab "string ka end" hai. But agar aapko $ sign chahiye to \$ likho.
 */

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


/**
 * ========================================================================
 * 12. COMMON SPECIAL SEQUENCES (Commonly used escape patterns)
 * ========================================================================
 * NOTES:
 * 
 * | Sequence | Matlab                                              |
 * |----------|-----------------------------------------------------|
 * | \n       | Newline (nayi line)                                  |
 * | \t       | Tab (tab space)                                      |
 * | \r       | Carriage Return                                      |
 * | \0       | Null character                                       |
 * | \xNN     | Hex code se character (e.g., \x41 = "A")            |
 * | \uNNNN   | Unicode character (e.g., \u0041 = "A")              |
 */

// \n — Newline match karo
const multiLineStr = "line1\nline2";
console.log(multiLineStr.match(/line1\nline2/));  // Match karega ✓

// \t — Tab match karo
console.log("name:\tSidd".match(/name:\t\w+/));  // ["name:\tSidd"] ✓

// \x41 — Hex code se "A" match karo
console.log(/\x41/.test("A"));  // true ('A' ka hex code 41 hai)

// \u0041 — Unicode se "A" match karo
console.log(/\u0041/.test("A"));  // true


/**
 * ========================================================================
 * 13. PRACTICAL EXAMPLES — Real World RegEx Patterns
 * ========================================================================
 * NOTES:
 * - Ab tak jo seekha hai wo sab milake kuch REAL WORLD problems solve karte hain.
 * - Ye patterns interviews me aur actual projects me bahut kaam aate hain.
 */

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


/**
 * ========================================================================
 * 14. REPLACE WITH FUNCTIONS (Dynamic Replace)
 * ========================================================================
 * NOTES:
 * - String.replace() me dusra argument ek FUNCTION bhi ho sakta hai!
 * - Ye function har match ke liye call hota hai, aur jo return karega wahi 
 *   replace hoga.
 * - Function ko milte hain: (match, group1, group2, ..., offset, fullString)
 * 
 * USE CASE:
 * - Har match pe alag logic lagana ho (jaise capitalize karna, calculate karna)
 */

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


/**
 * ========================================================================
 * 15. REGEX WITH replace() — $1, $2 SYNTAX (Replacement Patterns)
 * ========================================================================
 * NOTES:
 * - Replace me captured groups ko $1, $2, etc. se refer kar sakte ho.
 * - Ye bahut powerful hai — bina function likhke bhi groups ko rearrange kar sakte ho.
 * 
 * | Pattern | Matlab                                          |
 * |---------|-------------------------------------------------|
 * | $1      | Pehle capturing group ka match                  |
 * | $2      | Doosre capturing group ka match                 |
 * | $&      | Pura match (sab groups mila ke)                 |
 * | $`      | Match se PEHLE ki string                        |
 * | $'      | Match ke BAAD ki string                         |
 * | $$      | Literal "$" sign                                |
 */

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


/**
 * ========================================================================
 * 16. UNICODE & EMOJI IN REGEX
 * ========================================================================
 * NOTES:
 * - Modern JavaScript me aapko emoji aur non-English characters bhi handle karne 
 *   padte hain.
 * - 'u' flag use karo taaki Unicode properly kaam kare.
 * - \p{} se Unicode categories match kar sakte ho (with 'u' flag):
 *   - \p{L}     → Koi bhi letter (kisi bhi language ka)
 *   - \p{N}     → Koi bhi number
 *   - \p{Emoji} → Koi bhi emoji
 *   - \p{Script=Devanagari} → Hindi/Sanskrit characters
 */

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


// ========================================================================
// 17. REGEX PERFORMANCE TIPS
// ========================================================================
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


/*
========================================================================
FINAL REVISION TABLE — COMPLETE RegEx CHEAT SHEET
========================================================================

🔹 CREATING REGEX:
| Method       | Syntax                    | Use                                |
|------------- |---------------------------|------------------------------------|
| Literal      | /pattern/flags            | Fixed/known patterns               |
| Constructor  | new RegExp("pattern","f") | Dynamic patterns (variable se)     |

🔹 METHODS:
| Method       | Return              | Example                              |
|------------- |---------------------|--------------------------------------|
| test()       | true/false          | /abc/.test("abc") → true             |
| exec()       | Array ya null       | /abc/.exec("abc") → ["abc"]          |
| match()      | Array ya null       | "abc".match(/a/) → ["a"]            |
| matchAll()   | Iterator            | "aaa".matchAll(/a/g)                 |
| search()     | Index ya -1         | "abc".search(/b/) → 1               |
| replace()    | New string          | "abc".replace(/a/,"x") → "xbc"      |
| split()      | Array               | "a-b".split(/-/) → ["a","b"]        |

🔹 FLAGS:
| Flag | Kaam                                                          |
|------|---------------------------------------------------------------|
| g    | Global — sab matches dhundho                                  |
| i    | Case insensitive                                              |
| m    | Multiline — ^ $ har line pe                                   |
| s    | DotAll — . newline bhi match kare                             |
| u    | Unicode — emoji/special chars sahi se match ho                |
| y    | Sticky — exact position se match                              |

🔹 CHARACTER CLASSES:
| Symbol | Matlab                    | Symbol | Matlab (Ulta)             |
|--------|---------------------------|--------|---------------------------|
| \d     | Digit [0-9]               | \D     | Non-digit                 |
| \w     | Word [a-zA-Z0-9_]        | \W     | Non-word                  |
| \s     | Space/Whitespace          | \S     | Non-space                 |
| .      | Koi bhi (except newline)  |        |                           |

🔹 QUANTIFIERS:
| Symbol  | Matlab               | Greedy/Lazy         |
|---------|----------------------|---------------------|
| *       | 0 ya zyada           | *? = lazy           |
| +       | 1 ya zyada           | +? = lazy           |
| ?       | 0 ya 1               | ?? = lazy           |
| {n}     | Exactly n             |                     |
| {n,}    | Minimum n             | {n,}? = lazy        |
| {n,m}   | n se m ke beech       | {n,m}? = lazy       |

🔹 ANCHORS:
| Symbol | Matlab                                        |
|--------|-----------------------------------------------|
| ^      | String/line ke start me                       |
| $      | String/line ke end me                         |
| \b     | Word boundary                                 |
| \B     | Non-word boundary                             |

🔹 GROUPS:
| Syntax         | Type                | Capture? |
|----------------|---------------------|----------|
| (abc)          | Capturing           | Haan ✓   |
| (?:abc)        | Non-Capturing       | Nahi ✗   |
| (?<name>abc)   | Named Capturing     | Haan ✓   |
| (a|b)          | Alternation (OR)    | Haan ✓   |

🔹 LOOKAROUND:
| Syntax     | Type                 | Match me aata hai? |
|------------|----------------------|--------------------|
| (?=abc)    | Positive Lookahead   | Nahi               |
| (?!abc)    | Negative Lookahead   | Nahi               |
| (?<=abc)   | Positive Lookbehind  | Nahi               |
| (?<!abc)   | Negative Lookbehind  | Nahi               |

========================================================================
*/
