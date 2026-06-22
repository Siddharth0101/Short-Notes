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
 *
 * EXAMPLE:
 * Input:  arr = [10, 15, 20, 25, 30], target = 20
 * Output: 2  (index of 20)
 *
 * Input:  arr = [10, 15, 20, 25, 30], target = 99
 * Output: -1  (not found)
 */

function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }

    return -1;
}

// Sample Input:  [10, 15, 20, 25, 30], target = 20
// Expected Output: 2
console.log(linearSearch([10, 15, 20, 25, 30], 20)); // 2

// Sample Input:  [10, 15, 20, 25, 30], target = 99
// Expected Output: -1
console.log(linearSearch([10, 15, 20, 25, 30], 99)); // -1

// Sample Input:  [5], target = 5
// Expected Output: 0  (only element, first index)
console.log(linearSearch([5], 5)); // 0


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
 *
 * EXAMPLE:
 * Input:  [1, 3, 5, 7, 9, 11, 13, 15], target = 9
 * Output: 4  (index of 9)
 *
 * Input:  [1, 3, 5, 7, 9, 11, 13, 15], target = 6
 * Output: -1  (not in array)
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

// Sample Input:  [1, 3, 5, 7, 9, 11, 13, 15], target = 9
// Expected Output: 4
console.log(binarySearch([1, 3, 5, 7, 9, 11, 13, 15], 9)); // 4

// Sample Input:  [1, 3, 5, 7, 9, 11, 13, 15], target = 6
// Expected Output: -1
console.log(binarySearch([1, 3, 5, 7, 9, 11, 13, 15], 6)); // -1

// Sample Input:  [1, 3, 5, 7, 9, 11, 13, 15], target = 1
// Expected Output: 0  (leftmost element)
console.log(binarySearch([1, 3, 5, 7, 9, 11, 13, 15], 1)); // 0

// Sample Input:  [1, 3, 5, 7, 9, 11, 13, 15], target = 15
// Expected Output: 7  (rightmost element)
console.log(binarySearch([1, 3, 5, 7, 9, 11, 13, 15], 15)); // 7


/**
 * ========================================================================
 * 3. BINARY SEARCH RECURSIVE
 * ========================================================================
 *
 * EXAMPLE:
 * Input:  [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23
 * Output: 5  (index of 23)
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

// Sample Input:  [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23
// Expected Output: 5
console.log(binarySearchRecursive([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)); // 5

// Sample Input:  [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 100
// Expected Output: -1
console.log(binarySearchRecursive([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 100)); // -1


/**
 * ========================================================================
 * 4. NAIVE STRING SEARCH
 * ========================================================================
 * NOTES:
 * - Larger string me smaller pattern count karna.
 * - Worst case O(n * m), jahan n = long string, m = pattern length.
 *
 * EXAMPLE:
 * Input:  longStr = 'wowomgzomgomg', pattern = 'omg'
 * Output: 3  ('omg' appears 3 times)
 *
 * Input:  longStr = 'hello world', pattern = 'xyz'
 * Output: 0  (pattern not found)
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

// Sample Input:  'wowomgzomgomg', 'omg'
// Expected Output: 3
console.log(naiveStringSearch('wowomgzomgomg', 'omg')); // 3

// Sample Input:  'hello world', 'world'
// Expected Output: 1
console.log(naiveStringSearch('hello world', 'world')); // 1

// Sample Input:  'hello world', 'xyz'
// Expected Output: 0
console.log(naiveStringSearch('hello world', 'xyz')); // 0

// Sample Input:  'aaaa', 'aa'
// Expected Output: 3  (positions: 0,1,2 overlap)
console.log(naiveStringSearch('aaaa', 'aa')); // 3


/**
 * ========================================================================
 * 5. KMP STRING SEARCH - CONCEPT
 * ========================================================================
 * NOTES:
 * - KMP = Knuth Morris Pratt.
 * - Pattern mismatch hone par unnecessary comparisons avoid karta hai.
 * - Prefix table batata hai pattern me kitna reusable match already hai.
 * - Time: O(n + m)
 *
 * EXAMPLE:
 * Input:  text = 'ababcababcabcabc', pattern = 'ababcabc'
 * Output: 2  (pattern appears twice)
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

// Sample Input:  text = 'aabcaabxaaaz', pattern = 'aab'
// Expected Output: 2
console.log(kmpSearch('aabcaabxaaaz', 'aab')); // 2

// Sample Input:  text = 'ababcababcabcabc', pattern = 'abc'
// Expected Output: 4
console.log(kmpSearch('ababcababcabcabc', 'abc')); // 4

// Sample Input:  text = 'hello', pattern = 'xyz'
// Expected Output: 0
console.log(kmpSearch('hello', 'xyz')); // 0

// LPS table example:
// Sample Input:  pattern = 'aabaab'
// Expected Output: [0, 1, 0, 1, 2, 3]
console.log(buildLps('aabaab')); // [0, 1, 0, 1, 2, 3]


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
