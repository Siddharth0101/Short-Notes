'use strict';

/**
 * ========================================================================
 * COMMON PROBLEM SOLVING PATTERNS [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Patterns templates jaise hote hain.
 * - Problem dekhte hi agar pattern pehchan gaya, solution fast banega.
 * - Colt Steele ke course me ye section bahut important hai.
 */


/**
 * ========================================================================
 * 1. FREQUENCY COUNTER
 * ========================================================================
 * USE WHEN:
 * - Compare two arrays/strings.
 * - Count occurrences.
 * - Check anagram, same squared values, duplicates.
 *
 * IDEA:
 * - Nested loop O(n^2) avoid karo.
 * - Object/Map me count store karo.
 *
 * EXAMPLE - sameSquared:
 * Input:  arr1 = [1, 2, 3], arr2 = [4, 1, 9]
 * Output: true   (arr2 has squares of arr1: 1^2=1, 2^2=4, 3^2=9)
 *
 * Input:  arr1 = [1, 2, 3], arr2 = [1, 9, 9]
 * Output: false  (9 appears twice but 3^2=9 should be once)
 */

function sameSquared(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    const freq1 = {};
    const freq2 = {};

    for (const val of arr1) freq1[val] = (freq1[val] || 0) + 1;
    for (const val of arr2) freq2[val] = (freq2[val] || 0) + 1;

    for (const key in freq1) {
        const squared = key ** 2;
        if (!(squared in freq2)) return false;
        if (freq2[squared] !== freq1[key]) return false;
    }

    return true;
}

// Sample Input:  [1, 2, 3], [4, 1, 9]
// Expected Output: true
console.log(sameSquared([1, 2, 3], [4, 1, 9])); // true

// Sample Input:  [1, 2, 3], [1, 9, 9]
// Expected Output: false
console.log(sameSquared([1, 2, 3], [1, 9, 9])); // false

// Sample Input:  [1, 2, 1], [4, 4, 1]
// Expected Output: false  (two 1s need two 1s in arr2, but arr2 has two 4s)
console.log(sameSquared([1, 2, 1], [4, 4, 1])); // false


/**
 * EXAMPLE - validAnagram:
 * Input:  str1 = 'anagram', str2 = 'nagaram'
 * Output: true
 *
 * Input:  str1 = 'rat', str2 = 'car'
 * Output: false
 */

function validAnagram(str1, str2) {
    if (str1.length !== str2.length) return false;

    const lookup = {};

    for (const char of str1) {
        lookup[char] = (lookup[char] || 0) + 1;
    }

    for (const char of str2) {
        if (!lookup[char]) return false;
        lookup[char]--;
    }

    return true;
}

// Sample Input:  'anagram', 'nagaram'
// Expected Output: true
console.log(validAnagram('anagram', 'nagaram')); // true

// Sample Input:  'rat', 'car'
// Expected Output: false
console.log(validAnagram('rat', 'car')); // false

// Sample Input:  '', ''
// Expected Output: true  (empty strings are anagrams)
console.log(validAnagram('', '')); // true


/**
 * ========================================================================
 * 2. MULTIPLE POINTERS
 * ========================================================================
 * USE WHEN:
 * - Sorted array/string.
 * - Need pair, unique count, partition, palindrome check.
 *
 * IDEA:
 * - Two pointers alag positions se move karte hain.
 * - Usually O(n) time, O(1) space.
 *
 * EXAMPLE - sumZero:
 * Input:  [-3, -2, -1, 0, 1, 2, 3]
 * Output: [-3, 3]   (sum = 0)
 *
 * Input:  [-2, 0, 1, 3]
 * Output: undefined  (no pair sums to 0)
 */

function sumZero(sortedNums) {
    let left = 0;
    let right = sortedNums.length - 1;

    while (left < right) {
        const sum = sortedNums[left] + sortedNums[right];

        if (sum === 0) return [sortedNums[left], sortedNums[right]];
        if (sum > 0) right--;
        else left++;
    }

    return undefined;
}

// Sample Input:  [-3, -2, -1, 0, 1, 2, 3]
// Expected Output: [-3, 3]
console.log(sumZero([-3, -2, -1, 0, 1, 2, 3])); // [-3, 3]

// Sample Input:  [-2, 0, 1, 3]
// Expected Output: undefined
console.log(sumZero([-2, 0, 1, 3])); // undefined

// Sample Input:  [1, 2, 3]
// Expected Output: undefined  (all positive, no zero sum pair)
console.log(sumZero([1, 2, 3])); // undefined


/**
 * EXAMPLE - countUniqueValues:
 * Input:  [1, 1, 2, 2, 3, 4, 4, 5]
 * Output: 5   (unique values: 1, 2, 3, 4, 5)
 */

function countUniqueValues(sortedNums) {
    if (sortedNums.length === 0) return 0;

    let uniqueIndex = 0;

    for (let scanner = 1; scanner < sortedNums.length; scanner++) {
        if (sortedNums[uniqueIndex] !== sortedNums[scanner]) {
            uniqueIndex++;
            sortedNums[uniqueIndex] = sortedNums[scanner];
        }
    }

    return uniqueIndex + 1;
}

// Sample Input:  [1, 1, 2, 2, 3, 4, 4, 5]
// Expected Output: 5
console.log(countUniqueValues([1, 1, 2, 2, 3, 4, 4, 5])); // 5

// Sample Input:  []
// Expected Output: 0
console.log(countUniqueValues([])); // 0

// Sample Input:  [1, 1, 1, 1, 1, 2]
// Expected Output: 2
console.log(countUniqueValues([1, 1, 1, 1, 1, 2])); // 2


/**
 * ========================================================================
 * 3. SLIDING WINDOW
 * ========================================================================
 * USE WHEN:
 * - Contiguous subarray/substring.
 * - Max/min/sum/length of a window.
 *
 * IDEA:
 * - Window ko grow/shrink karo instead of recalculating from scratch.
 *
 * EXAMPLE - maxSubarraySum:
 * Input:  nums = [2, 6, 9, 2, 1, 8, 5, 6, 3], windowSize = 3
 * Output: 19   (subarray [9, 2, 1] nahi, [8, 5, 6] = 19... actually [6,9,2]=17, [8,5,6]=19)
 *
 * Input:  nums = [1, 2, 5, 2, 8, 1, 5], windowSize = 2
 * Output: 10  (subarray [2, 8] = 10)
 */

function maxSubarraySum(nums, windowSize) {
    if (nums.length < windowSize) return null;

    let windowSum = 0;

    for (let i = 0; i < windowSize; i++) {
        windowSum += nums[i];
    }

    let maxSum = windowSum;

    for (let end = windowSize; end < nums.length; end++) {
        windowSum = windowSum - nums[end - windowSize] + nums[end];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}

// Sample Input:  [1, 2, 5, 2, 8, 1, 5], windowSize = 2
// Expected Output: 10
console.log(maxSubarraySum([1, 2, 5, 2, 8, 1, 5], 2)); // 10

// Sample Input:  [2, 6, 9, 2, 1, 8, 5, 6, 3], windowSize = 3
// Expected Output: 19
console.log(maxSubarraySum([2, 6, 9, 2, 1, 8, 5, 6, 3], 3)); // 19

// Sample Input:  [1, 2], windowSize = 5
// Expected Output: null  (window larger than array)
console.log(maxSubarraySum([1, 2], 5)); // null


/**
 * EXAMPLE - longestUniqueSubstring:
 * Input:  'thisishowwedoit'
 * Output: 6  ('wedoit' or 'howwed'... actually 'wedoit' = 6)
 */

function longestUniqueSubstring(str) {
    let start = 0;
    let longest = 0;
    const seen = {};

    for (let end = 0; end < str.length; end++) {
        const char = str[end];

        if (seen[char] >= start) {
            start = seen[char] + 1;
        }

        seen[char] = end;
        longest = Math.max(longest, end - start + 1);
    }

    return longest;
}

// Sample Input:  'abcabcbb'
// Expected Output: 3  ('abc')
console.log(longestUniqueSubstring('abcabcbb')); // 3

// Sample Input:  'bbbbb'
// Expected Output: 1  ('b')
console.log(longestUniqueSubstring('bbbbb')); // 1

// Sample Input:  'pwwkew'
// Expected Output: 3  ('wke')
console.log(longestUniqueSubstring('pwwkew')); // 3


/**
 * ========================================================================
 * 4. DIVIDE AND CONQUER
 * ========================================================================
 * USE WHEN:
 * - Data sorted hai ya split ho sakta hai.
 * - Problem ko smaller subproblems me tod sakte ho.
 *
 * EXAMPLES:
 * - Binary search
 * - Merge sort
 * - Quick sort
 *
 * EXAMPLE - binarySearchPattern:
 * Input:  [1, 2, 3, 4, 5, 6, 7, 8], target = 6
 * Output: 5  (index of 6)
 *
 * Input:  [1, 2, 3, 4, 5, 6, 7, 8], target = 99
 * Output: -1  (not found)
 */

function binarySearchPattern(sortedNums, target) {
    let left = 0;
    let right = sortedNums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (sortedNums[mid] === target) return mid;
        if (sortedNums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}

// Sample Input:  [1, 2, 3, 4, 5, 6, 7, 8], target = 6
// Expected Output: 5
console.log(binarySearchPattern([1, 2, 3, 4, 5, 6, 7, 8], 6)); // 5

// Sample Input:  [1, 2, 3, 4, 5, 6, 7, 8], target = 99
// Expected Output: -1
console.log(binarySearchPattern([1, 2, 3, 4, 5, 6, 7, 8], 99)); // -1

// Sample Input:  [10, 20, 30, 40, 50], target = 10
// Expected Output: 0
console.log(binarySearchPattern([10, 20, 30, 40, 50], 10)); // 0


/**
 * ========================================================================
 * 5. TWO LOOP REPLACEMENT THINKING
 * ========================================================================
 * NOTES:
 * - Agar nested loop sirf "find matching item/count" kar raha hai,
 *   frequency counter ya hash map try karo.
 * - Agar sorted array me pair dhoondhna hai,
 *   multiple pointers try karo.
 * - Agar contiguous range chahiye,
 *   sliding window try karo.
 */
