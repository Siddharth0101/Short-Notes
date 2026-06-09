'use strict';

/**
 * ========================================================================
 * PROBLEM SOLVING APPROACH - HOW TO THINK IN DSA
 * ========================================================================
 * NOTES:
 * - DSA me sabse pehle coding nahi, thinking hoti hai.
 * - Agar problem clear nahi hai to code messy ho jaata hai.
 * - Ye approach Colt Steele style interviews ke liye very useful hai.
 */


/**
 * ========================================================================
 * 1. UNDERSTAND THE PROBLEM
 * ========================================================================
 * QUESTIONS:
 * - Inputs kya hain?
 * - Output kya chahiye?
 * - Input size kitna ho sakta hai?
 * - Invalid input handle karna hai kya?
 * - Kya order matter karta hai?
 * - Kya duplicates allowed hain?
 * - Time/space constraints kya hain?
 *
 * INTERVIEW LINE:
 * - "Can I clarify the input and expected output first?"
 */


/**
 * ========================================================================
 * 2. EXPLORE EXAMPLES
 * ========================================================================
 * NOTES:
 * - Simple examples lo.
 * - Edge cases lo.
 * - Empty input, one item, duplicates, negative numbers, sorted/unsorted.
 */

// Problem: Write function that returns char count for a string.
// Examples:
// charCount("hello") -> { h: 1, e: 1, l: 2, o: 1 }
// charCount("") -> {}
// charCount("Hi hi!") -> should case matter? Should symbols count?


/**
 * ========================================================================
 * 3. BREAK IT DOWN
 * ========================================================================
 * NOTES:
 * - Code likhne se pehle steps comments me likho.
 * - Ye half battle jeet leta hai.
 */

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


/**
 * ========================================================================
 * 4. SOLVE OR SIMPLIFY
 * ========================================================================
 * NOTES:
 * - Agar full problem hard lag rahi hai, easy part pehle solve karo.
 * - Hard part ko temporarily ignore karke working version banao.
 * - Phir missing complexity add karo.
 *
 * EXAMPLE:
 * - Pehle char count without validation.
 * - Phir lowercase.
 * - Phir only alphanumeric filter.
 */


/**
 * ========================================================================
 * 5. LOOK BACK AND REFACTOR
 * ========================================================================
 * QUESTIONS:
 * - Kya result correct hai?
 * - Kya code readable hai?
 * - Kya time complexity improve ho sakti hai?
 * - Kya space complexity improve ho sakti hai?
 * - Kya edge cases pass ho rahe hain?
 * - Kya variable names meaningful hain?
 */

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


/**
 * ========================================================================
 * 6. PROBLEM SOLVING CHECKLIST
 * ========================================================================
 *
 * 1. Restate problem in your own words.
 * 2. Identify inputs.
 * 3. Identify output.
 * 4. Ask about edge cases.
 * 5. Write examples.
 * 6. Write step-by-step comments.
 * 7. Code the simple version.
 * 8. Test manually.
 * 9. Refactor.
 * 10. State Big O.
 */
