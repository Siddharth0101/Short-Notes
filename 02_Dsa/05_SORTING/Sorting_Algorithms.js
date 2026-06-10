'use strict';

/**
 * ========================================================================
 * SORTING ALGORITHMS
 * ========================================================================
 * NOTES:
 * - Sorting = data ko order me arrange karna.
 * - Sorting ke baad searching, duplicate handling, two pointers easy ho jaate hain.
 * - JavaScript default sort values ko string bana kar sort karta hai, so comparator use karo.
 */

const sortExample = [10, 2, 5, 1];
sortExample.sort((a, b) => a - b); // [1, 2, 5, 10]


/**
 * ========================================================================
 * 1. BUBBLE SORT
 * ========================================================================
 * NOTES:
 * - Adjacent items compare/swap.
 * - Largest value har pass me end tak bubble ho jaati hai.
 * - Mostly learning purpose.
 *
 * TIME:
 * - Best with noSwap: O(n)
 * - Average/Worst: O(n^2)
 */

function bubbleSort(arr) {
    const nums = [...arr];

    for (let i = nums.length - 1; i > 0; i--) {
        let noSwaps = true;

        for (let j = 0; j < i; j++) {
            if (nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
                noSwaps = false;
            }
        }

        if (noSwaps) break;
    }

    return nums;
}


/**
 * ========================================================================
 * 2. SELECTION SORT
 * ========================================================================
 * NOTES:
 * - Minimum item find karo, front me swap karo.
 * - Swaps kam hote hain, but comparisons O(n^2).
 */

function selectionSort(arr) {
    const nums = [...arr];

    for (let i = 0; i < nums.length; i++) {
        let minIndex = i;

        for (let j = i + 1; j < nums.length; j++) {
            if (nums[j] < nums[minIndex]) minIndex = j;
        }

        if (i !== minIndex) {
            [nums[i], nums[minIndex]] = [nums[minIndex], nums[i]];
        }
    }

    return nums;
}


/**
 * ========================================================================
 * 3. INSERTION SORT
 * ========================================================================
 * NOTES:
 * - Left side sorted portion maintain hota hai.
 * - Nearly sorted data ke liye good.
 * - Online sorting me useful: data aata jaaye aur insert hota jaaye.
 */

function insertionSort(arr) {
    const nums = [...arr];

    for (let i = 1; i < nums.length; i++) {
        const current = nums[i];
        let j = i - 1;

        while (j >= 0 && nums[j] > current) {
            nums[j + 1] = nums[j];
            j--;
        }

        nums[j + 1] = current;
    }

    return nums;
}


/**
 * ========================================================================
 * 4. MERGE SORT
 * ========================================================================
 * NOTES:
 * - Divide and conquer.
 * - Array half me split karo, recursively sort karo, merge karo.
 * - Time always O(n log n), space O(n).
 */

function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i), right.slice(j));
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}


/**
 * ========================================================================
 * 5. QUICK SORT
 * ========================================================================
 * NOTES:
 * - Pivot choose karo.
 * - Smaller values left, larger values right.
 * - Average O(n log n), worst O(n^2) if pivot poor.
 * - Random pivot / median pivot worst case chance kam karta hai.
 */

function pivot(arr, start = 0, end = arr.length - 1) {
    const pivotValue = arr[start];
    let swapIndex = start;

    for (let i = start + 1; i <= end; i++) {
        if (arr[i] < pivotValue) {
            swapIndex++;
            [arr[swapIndex], arr[i]] = [arr[i], arr[swapIndex]];
        }
    }

    [arr[start], arr[swapIndex]] = [arr[swapIndex], arr[start]];
    return swapIndex;
}

function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const pivotIndex = pivot(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }

    return arr;
}


/**
 * ========================================================================
 * 6. RADIX SORT
 * ========================================================================
 * NOTES:
 * - Comparison sort nahi hai.
 * - Integers ko digit by digit bucket me rakhta hai.
 * - Time: O(n * k), k = digits count.
 */

function getDigit(num, place) {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

function digitCount(num) {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
}

function mostDigits(nums) {
    let maxDigits = 0;

    for (const num of nums) {
        maxDigits = Math.max(maxDigits, digitCount(num));
    }

    return maxDigits;
}

function radixSort(nums) {
    let result = [...nums];
    const maxDigitCount = mostDigits(result);

    for (let k = 0; k < maxDigitCount; k++) {
        const buckets = Array.from({ length: 10 }, () => []);

        for (const num of result) {
            const digit = getDigit(num, k);
            buckets[digit].push(num);
        }

        result = [].concat(...buckets);
    }

    return result;
}


/**
 * ========================================================================
 * 7. SORTING CHEAT TABLE
 * ========================================================================
 *
 * Bubble sort       O(n^2), best O(n) with noSwap, learning/simple
 * Selection sort    O(n^2), few swaps
 * Insertion sort    O(n^2), good for nearly sorted data
 * Merge sort        O(n log n), stable, O(n) space
 * Quick sort        O(n log n) average, O(n^2) worst
 * Radix sort        O(n * k), integers only style
 *
 * STABLE SORT:
 * - Equal values ka original relative order same rahe.
 *
 * IN-PLACE SORT:
 * - Extra memory low use ho.
 */
