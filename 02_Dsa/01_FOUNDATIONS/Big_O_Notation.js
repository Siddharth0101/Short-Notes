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


// O(1) - CONSTANT TIME
// Input size kitna bhi ho, operations fixed rahenge.
function getFirstItem(arr) {
    return arr[0];
}

// Sample Input:  [10, 20, 30, 40, 50]
// Expected Output: 10
console.log(getFirstItem([10, 20, 30, 40, 50])); // 10

// O(n) - LINEAR TIME
// Input double hua, work roughly double hoga.
function printAllItems(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

// Sample Input:  [1, 2, 3]
// Expected Output: 1  2  3  (each printed on new line)
printAllItems([1, 2, 3]); // 1, 2, 3

// O(n^2) - QUADRATIC TIME
// Nested loop: n items ke liye har item ke saath n work.
function printAllPairs(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}

// Sample Input:  [1, 2]
// Expected Output: 1 1 | 1 2 | 2 1 | 2 2  (4 pairs = n^2 = 2^2)
printAllPairs([1, 2]);


 * O(2^n)      Exponential     - many brute force recursion problems
 * O(n!)       Factorial       - all permutations brute force
 *
 * GOLDEN RULE:
 * - O(1), O(log n), O(n), O(n log n) usually good.
 * - O(n^2) can be okay for small input, dangerous for large input.
 * - O(2^n), O(n!) usually need optimization, DP, pruning, or different approach.
 */


function differentInputs(arr1, arr2) {
    // O(a)
    for (let i = 0; i < arr1.length; i++) {
        console.log(arr1[i]);
    }

    // O(b)
    for (let j = 0; j < arr2.length; j++) {
        console.log(arr2[j]);
    }
}
// Total: O(a + b), not O(n)

// Sample Input:  arr1 = ['x', 'y'], arr2 = [10, 20]
// Expected Output: 'x' 'y' 10 20
differentInputs(['x', 'y'], [10, 20]);

function nestedDifferentInputs(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            console.log(arr1[i], arr2[j]);
        }
    }
}
// Total: O(a * b)

// Sample Input:  arr1 = ['A'], arr2 = [1, 2]
// Expected Output: A 1 | A 2  (1 * 2 = 2 pairs)
nestedDifferentInputs(['A'], [1, 2]);


function sumOneToN(n) {
    return n * (n + 1) / 2;
}

// Sample Input:  6
// Expected Output: 21
console.log(sumOneToN(6)); // 21

// Sample Input:  100
// Expected Output: 5050
console.log(sumOneToN(100)); // 5050


// O(1) auxiliary space - sirf ek extra variable
function sumArraySpaceOne(arr) {
    let total = 0;
    for (const num of arr) total += num;
    return total;
}

// Sample Input:  [1, 2, 3, 4]
// Expected Output: 10
console.log(sumArraySpaceOne([1, 2, 3, 4])); // 10

// O(n) auxiliary space - n size ka new array ban raha hai
function doubleArray(arr) {
    const result = [];
    for (const num of arr) result.push(num * 2);
    return result;
}

// Sample Input:  [1, 2, 3, 4]
// Expected Output: [2, 4, 6, 8]
console.log(doubleArray([1, 2, 3, 4])); // [2, 4, 6, 8]

// O(n) space - input string jitni badi, copy bhi utni badi
function copyString(str) {
    return str.slice();
}

// Sample Input:  'hello'
// Expected Output: 'hello'
console.log(copyString('hello')); // 'hello'

// O(k) space - k unique keys object me store hongi
function countValues(arr) {
    const counts = {};

    for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
    }

    return counts;
}

// Sample Input:  ['a', 'b', 'a', 'c', 'b', 'a']
// Expected Output: { a: 3, b: 2, c: 1 }
console.log(countValues(['a', 'b', 'a', 'c', 'b', 'a'])); // { a: 3, b: 2, c: 1 }


function countHalves(n) {
    let count = 0;

    while (n > 1) {
        n = Math.floor(n / 2);
        count++;
    }

    return count;
}

// Sample Input:  16
// Expected Output: 4  (16 -> 8 -> 4 -> 2 -> 1)
console.log(countHalves(16)); // 4

// Sample Input:  1000000
// Expected Output: 19  (about 20 halvings for 1 million)
console.log(countHalves(1000000)); // 19


function linearSearchExample(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }

    return -1;
}

// Best case: target first item -> O(1)
// Sample Input:  [3, 7, 1, 9, 4], target = 3
// Expected Output: 0
console.log(linearSearchExample([3, 7, 1, 9, 4], 3)); // 0

// Worst case: target last item / not present -> O(n)
// Sample Input:  [3, 7, 1, 9, 4], target = 4
// Expected Output: 4
console.log(linearSearchExample([3, 7, 1, 9, 4], 4)); // 4

// Sample Input:  [3, 7, 1, 9, 4], target = 99
// Expected Output: -1
console.log(linearSearchExample([3, 7, 1, 9, 4], 99)); // -1
