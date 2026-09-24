/**
 * ## Quick revision
 *
 * - Bubble sort — adjacent swaps; O(n²), early-exit variant best O(n).
 * - Selection sort — minimum select; O(n²), generally unstable.
 * - Insertion sort — sorted prefix mein insert; O(n²), nearly sorted input par useful.
 * - Merge sort — split + merge; O(n log n), array version extra O(n) space.
 * - Quicksort — partition + recurse; average O(n log n), worst O(n²).
 * - Three-way partition — less/equal/greater regions; duplicates ke liye useful.
 * - Heap sort — O(n log n), typical array version O(1) extra space.
 * - Radix/counting — key range/digits ki assumptions par depend karte hain.
 * - Quickselect — kth item; expected O(n), worst O(n²).
 * - Stability — equal-key items ka original order bachta hai.
 * - Comparator — consistent ordering; JS numeric sort mein `(a, b) => a - b`.
 * - Inversions — merge ke waqt cross inversions count; O(n log n).
 * - Comparison lower bound — arbitrary comparison sorting worst-case Ω(n log n); restricted-key algorithms different assumptions use karte hain.
 * - Stable merge — equal keys par left item pehle lo toh original order preserve kar sakte ho.
 * - Pivot choice — randomized pivot adversarial pattern risk kam; worst-case bound automatically remove nahi hota.
 */

'use strict';


const sortExample = [10, 2, 5, 1];
sortExample.sort((a, b) => a - b);
console.log(sortExample); // [1, 2, 5, 10]


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

// Sample Input:  [64, 34, 25, 12, 22, 11, 90]
// Expected Output: [11, 12, 22, 25, 34, 64, 90]
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90])); // [11, 12, 22, 25, 34, 64, 90]

// Sample Input:  [1, 2, 3, 4, 5]  (already sorted -> best case O(n))
// Expected Output: [1, 2, 3, 4, 5]
console.log(bubbleSort([1, 2, 3, 4, 5])); // [1, 2, 3, 4, 5]

// Sample Input:  [5]
// Expected Output: [5]
console.log(bubbleSort([5])); // [5]


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

// Sample Input:  [29, 10, 14, 37, 13]
// Expected Output: [10, 13, 14, 29, 37]
console.log(selectionSort([29, 10, 14, 37, 13])); // [10, 13, 14, 29, 37]

// Sample Input:  [3, 2, 1]
// Expected Output: [1, 2, 3]
console.log(selectionSort([3, 2, 1])); // [1, 2, 3]


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

// Sample Input:  [12, 11, 13, 5, 6]
// Expected Output: [5, 6, 11, 12, 13]
console.log(insertionSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]

// Sample Input:  [1, 2, 3, 4]  (already sorted -> best case O(n))
// Expected Output: [1, 2, 3, 4]
console.log(insertionSort([1, 2, 3, 4])); // [1, 2, 3, 4]

// Sample Input:  [9, 7, 5, 3, 1]  (reverse sorted -> worst case O(n^2))
// Expected Output: [1, 3, 5, 7, 9]
console.log(insertionSort([9, 7, 5, 3, 1])); // [1, 3, 5, 7, 9]


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

// Sample Input:  [38, 27, 43, 3, 9, 82, 10]
// Expected Output: [3, 9, 10, 27, 38, 43, 82]
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10])); // [3, 9, 10, 27, 38, 43, 82]

// Sample Input:  [1]
// Expected Output: [1]
console.log(mergeSort([1])); // [1]

// Sample Input:  [5, 4, 3, 2, 1]
// Expected Output: [1, 2, 3, 4, 5]
console.log(mergeSort([5, 4, 3, 2, 1])); // [1, 2, 3, 4, 5]

// merge() helper test:
// Sample Input:  left=[1, 3, 5], right=[2, 4, 6]
// Expected Output: [1, 2, 3, 4, 5, 6]
console.log(merge([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]


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

// Sample Input:  [3, 6, 8, 10, 1, 2, 1]
// Expected Output: [1, 1, 2, 3, 6, 8, 10]
console.log(quickSort([3, 6, 8, 10, 1, 2, 1])); // [1, 1, 2, 3, 6, 8, 10]

// Sample Input:  [5, 3, 1, 4, 2]
// Expected Output: [1, 2, 3, 4, 5]
console.log(quickSort([5, 3, 1, 4, 2])); // [1, 2, 3, 4, 5]

// Sample Input:  [1]
// Expected Output: [1]
console.log(quickSort([1])); // [1]


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

// Sample Input:  [170, 45, 75, 90, 802, 24, 2, 66]
// Expected Output: [2, 24, 45, 66, 75, 90, 170, 802]
console.log(radixSort([170, 45, 75, 90, 802, 24, 2, 66])); // [2, 24, 45, 66, 75, 90, 170, 802]

// Sample Input:  [1, 100, 10, 1000]
// Expected Output: [1, 10, 100, 1000]
console.log(radixSort([1, 100, 10, 1000])); // [1, 10, 100, 1000]

// Helper functions test:
// Sample Input:  getDigit(7323, 2)
// Expected Output: 3  (hundreds digit of 7323)
console.log(getDigit(7323, 2)); // 3

// Sample Input:  digitCount(12345)
// Expected Output: 5
console.log(digitCount(12345)); // 5

// Sample Input:  mostDigits([23, 567, 89, 12234, 90])
// Expected Output: 5  (12234 has most digits)
console.log(mostDigits([23, 567, 89, 12234, 90])); // 5
