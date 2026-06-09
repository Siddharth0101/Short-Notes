'use strict';

/**
 * ========================================================================
 * RECURSION AND BACKTRACKING
 * ========================================================================
 * NOTES:
 * - Recursion = function khud ko call karta hai.
 * - Har recursive call call stack me ek new frame add karti hai.
 * - Recursive solution me 2 cheezein mandatory hain:
 *   1. Base case
 *   2. Different input ke saath recursive call
 */


/**
 * ========================================================================
 * 1. CALL STACK
 * ========================================================================
 * NOTES:
 * - Function call hota hai -> stack me push.
 * - Function return hota hai -> stack se pop.
 * - Base case missing hua to stack overflow.
 */

function countDown(num) {
    if (num <= 0) {
        console.log('All done');
        return;
    }

    console.log(num);
    countDown(num - 1);
}


/**
 * ========================================================================
 * 2. BASIC RECURSION EXAMPLES
 * ========================================================================
 */

function factorial(num) {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
}

function sumRange(num) {
    if (num === 1) return 1;
    return num + sumRange(num - 1);
}

function power(base, exponent) {
    if (exponent === 0) return 1;
    return base * power(base, exponent - 1);
}


/**
 * ========================================================================
 * 3. COMMON RECURSION MISTAKES
 * ========================================================================
 * MISTAKES:
 * - Base case missing.
 * - Base case wrong.
 * - Recursive call same input se ho rahi hai.
 * - Return keyword bhool gaye.
 */


/**
 * ========================================================================
 * 4. HELPER METHOD RECURSION
 * ========================================================================
 * NOTES:
 * - Outer function result variable banata hai.
 * - Inner helper recursive kaam karta hai.
 * - Jab result collect karna ho, ye style easy hota hai.
 */

function collectOddValues(arr) {
    const result = [];

    function helper(helperInput) {
        if (helperInput.length === 0) return;

        if (helperInput[0] % 2 !== 0) {
            result.push(helperInput[0]);
        }

        helper(helperInput.slice(1));
    }

    helper(arr);
    return result;
}


/**
 * ========================================================================
 * 5. PURE RECURSION
 * ========================================================================
 * NOTES:
 * - Helper array nahi, function return values combine karta hai.
 * - Arrays ke saath slice/spread/concat useful hote hain.
 * - Space zyada lag sakti hai because new arrays bante hain.
 */

function collectOddValuesPure(arr) {
    let newArr = [];

    if (arr.length === 0) return newArr;

    if (arr[0] % 2 !== 0) {
        newArr.push(arr[0]);
    }

    newArr = newArr.concat(collectOddValuesPure(arr.slice(1)));
    return newArr;
}


/**
 * ========================================================================
 * 6. RECURSION WITH ARRAYS/STRINGS
 * ========================================================================
 */

function productOfArray(arr) {
    if (arr.length === 0) return 1;
    return arr[0] * productOfArray(arr.slice(1));
}

function reverseString(str) {
    if (str.length <= 1) return str;
    return reverseString(str.slice(1)) + str[0];
}

function isPalindrome(str) {
    if (str.length <= 1) return true;
    if (str[0] !== str[str.length - 1]) return false;
    return isPalindrome(str.slice(1, -1));
}


/**
 * ========================================================================
 * 7. BACKTRACKING
 * ========================================================================
 * NOTES:
 * - Backtracking = choice lo, explore karo, undo karo.
 * - Useful for permutations, combinations, subsets, maze, N-Queens, Sudoku.
 * - Brute force hota hai but pruning se optimized ho sakta hai.
 */

function getPermutations(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);

    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }

        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;

            used[i] = true;
            path.push(nums[i]);

            backtrack(path);

            path.pop();
            used[i] = false;
        }
    }

    backtrack([]);
    return result;
}

function getSubsets(nums) {
    const result = [];

    function backtrack(start, path) {
        result.push([...path]);

        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }

    backtrack(0, []);
    return result;
}


/**
 * ========================================================================
 * 8. RECURSION VS ITERATION
 * ========================================================================
 * NOTES:
 * - Recursion code clean bana sakta hai, especially trees/graphs/backtracking.
 * - Iteration stack overflow avoid karta hai.
 * - JS me very deep recursion dangerous ho sakti hai.
 *
 * GOOD FIT FOR RECURSION:
 * - Tree traversal
 * - Graph DFS
 * - Divide and conquer
 * - Backtracking
 * - Dynamic programming top-down
 */
