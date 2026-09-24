/**
 * ## Quick revision
 *
 * - Frequency counter — repeated counts ke liye map; nested scans bach sakte hain.
 * - Two pointers — ordered/partitioned structure par boundaries move karo.
 * - Sliding window — contiguous range ko incremental add/remove se maintain karo.
 * - Variable window — shrink condition valid honi chahiye; negative sums monotonicity tod sakte hain.
 * - Prefix sum — range sum `prefix[r + 1] - prefix[l]`.
 * - Prefix map — previous sums count karke target-sum subarrays nikalo.
 * - Invariant — pointer/window move ke baad jo rule true rehta hai.
 * - Dry run — duplicates, empty input aur exact boundary check karo.
 * - Difference array — range updates mark karke prefix accumulation se final values nikalo.
 * - Sorted two-sum — low sum par left badhao, high sum par right ghatao.
 * - Permutation window — same length ke window mein required character frequencies match karo.
 */

'use strict';


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
