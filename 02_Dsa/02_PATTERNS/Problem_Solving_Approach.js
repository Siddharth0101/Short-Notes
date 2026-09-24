/**
 * ## Quick revision
 *
 * - Big-O — input badhne par upper-bound growth; exact milliseconds nahi.
 * - O(1) — constant; O(log n) — range shrink; O(n) — single scan.
 * - O(n log n) — efficient comparison sorts; O(n²) — many pairwise scans.
 * - Space — auxiliary memory aur recursion stack count karo.
 * - Worst/average/amortized — alag guarantees; interchangeable nahi.
 * - Amortized — operations ki sequence ka total cost average karo.
 * - Recursion — calls × per-call work; stack depth bhi count karo.
 * - Solve — constraints → brute force → bottleneck → invariant → optimize.
 * - JS trap — `shift`, `slice`, spread aur string copies ka cost mat bhoolo.
 * - Independent inputs — two lists sizes n,m hon toh O(n+m); blindly O(n) mat bolo.
 * - Log base — constant bases Big-O mein equivalent; repeated halving logarithmic growth deta hai.
 * - Output space — result materialize karna required ho toh minimum output-size cost bhi batao.
 */

'use strict';


function charCount(str) {
    // 1. Empty object banao.
    // 2. String ke har character par loop karo.
    // 3. Character ko lowercase karo.
    // 4. Agar alphanumeric hai to count update karo.
    // 5. Object return karo.

    const result = {};

    for (const char of str.toLowerCase()) {
        if (/[a-z0-9]/.test(char)) {
            result[char] = (result[char] || 0) + 1;
        }
    }

    return result;
}

// Sample Input:  'hello'
// Expected Output: { h: 1, e: 1, l: 2, o: 1 }
console.log(charCount('hello')); // { h: 1, e: 1, l: 2, o: 1 }

// Sample Input:  'Hi hi!'
// Expected Output: { h: 2, i: 2 }  (uppercase H -> lowercase h, '!' ignored)
console.log(charCount('Hi hi!')); // { h: 2, i: 2 }

// Sample Input:  ''
// Expected Output: {}
console.log(charCount('')); // {}

// Sample Input:  'abc123'
// Expected Output: { a: 1, b: 1, c: 1, 1: 1, 2: 1, 3: 1 }
console.log(charCount('abc123')); // { a: 1, b: 1, c: 1, '1': 1, '2': 1, '3': 1 }


function charCountRefactored(str) {
    const result = {};

    for (const char of str) {
        const lower = char.toLowerCase();

        if (isAlphaNumeric(lower)) {
            result[lower] = (result[lower] || 0) + 1;
        }
    }

    return result;
}

function isAlphaNumeric(char) {
    const code = char.charCodeAt(0);

    if (code >= 48 && code <= 57) return true; // 0-9
    if (code >= 97 && code <= 122) return true; // a-z

    return false;
}

// Sample Input:  'Hello World'
// Expected Output: { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }
console.log(charCountRefactored('Hello World')); // { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }

// Sample Input:  '2fast2furious'
// Expected Output: { 2: 2, f: 2, a: 1, s: 1, t: 1, u: 2, r: 1, i: 1, o: 1 }
console.log(charCountRefactored('2fast2furious')); // { '2': 2, f: 2, a: 1, s: 1, t: 1, u: 2, r: 1, i: 1, o: 1 }
