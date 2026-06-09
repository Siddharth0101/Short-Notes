'use strict';

/**
 * ========================================================================
 * COMMON PROBLEM SOLVING PATTERNS
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
