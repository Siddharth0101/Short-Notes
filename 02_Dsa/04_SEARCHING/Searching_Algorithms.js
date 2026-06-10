'use strict';

/**
 * ========================================================================
 * SEARCHING ALGORITHMS
 * ========================================================================
 * NOTES:
 * - Searching ka matlab data structure me target value dhoondhna.
 * - Agar data unsorted hai, usually linear search.
 * - Agar data sorted hai, binary search powerful hai.
 */


/**
 * ========================================================================
 * 1. LINEAR SEARCH
 * ========================================================================
 * NOTES:
 * - Ek ek item check karo.
 * - Unsorted data ke liye default approach.
 *
 * TIME:
 * - Best: O(1)
 * - Average/Worst: O(n)
 */

function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }

    return -1;
}


/**
 * ========================================================================
 * 2. BINARY SEARCH
 * ========================================================================
 * NOTES:
 * - Sirf sorted array par kaam karta hai.
 * - Har step me search space half hota hai.
 *
 * TIME:
 * - O(log n)
 */

function binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const current = sortedArr[middle];

        if (current === target) return middle;
        if (current < target) left = middle + 1;
        else right = middle - 1;
    }

    return -1;
}


/**
 * ========================================================================
 * 3. BINARY SEARCH RECURSIVE
 * ========================================================================
 */

function binarySearchRecursive(sortedArr, target, left = 0, right = sortedArr.length - 1) {
    if (left > right) return -1;

    const middle = Math.floor((left + right) / 2);

    if (sortedArr[middle] === target) return middle;

    if (sortedArr[middle] < target) {
        return binarySearchRecursive(sortedArr, target, middle + 1, right);
    }

    return binarySearchRecursive(sortedArr, target, left, middle - 1);
}


/**
 * ========================================================================
 * 4. NAIVE STRING SEARCH
 * ========================================================================
 * NOTES:
 * - Larger string me smaller pattern count karna.
 * - Worst case O(n * m), jahan n = long string, m = pattern length.
 */

function naiveStringSearch(longStr, pattern) {
    let count = 0;

    for (let i = 0; i <= longStr.length - pattern.length; i++) {
        let j = 0;

        for (; j < pattern.length; j++) {
            if (longStr[i + j] !== pattern[j]) break;
        }

        if (j === pattern.length) count++;
    }

    return count;
}


/**
 * ========================================================================
 * 5. KMP STRING SEARCH - CONCEPT
 * ========================================================================
 * NOTES:
 * - KMP = Knuth Morris Pratt.
 * - Pattern mismatch hone par unnecessary comparisons avoid karta hai.
 * - Prefix table batata hai pattern me kitna reusable match already hai.
 * - Time: O(n + m)
 */

function buildLps(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else if (length !== 0) {
            length = lps[length - 1];
        } else {
            lps[i] = 0;
            i++;
        }
    }

    return lps;
}

function kmpSearch(text, pattern) {
    if (pattern.length === 0) return 0;

    const lps = buildLps(pattern);
    let i = 0;
    let j = 0;
    let count = 0;

    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }

        if (j === pattern.length) {
            count++;
            j = lps[j - 1];
        } else if (i < text.length && text[i] !== pattern[j]) {
            if (j !== 0) j = lps[j - 1];
            else i++;
        }
    }

    return count;
}


/**
 * ========================================================================
 * 6. SEARCHING CHEAT
 * ========================================================================
 *
 * Unsorted array                  -> Linear search
 * Sorted array                    -> Binary search
 * Prefix lookup words             -> Trie
 * Graph shortest path unweighted  -> BFS
 * Graph shortest path weighted    -> Dijkstra
 * Repeated membership checks      -> Set / Map
 */
