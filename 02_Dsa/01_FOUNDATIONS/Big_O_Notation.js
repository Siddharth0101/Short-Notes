'use strict';

/**
 * ========================================================================
 * BIG O NOTATION - COMPLETE SHORT NOTES
 * ========================================================================
 * NOTES:
 * - Big O ka kaam hai code ki performance ko input size ke hisaab se describe karna.
 * - Input size ko usually "n" bolte hain.
 * - Hum exact seconds nahi count karte, hum growth rate count karte hain.
 * - Example: n badhne par operations kitni speed se badh rahe hain?
 *
 * WHY IMPORTANT?
 * - Same problem ke multiple solutions ho sakte hain.
 * - Big O batata hai kaunsa solution large input par better chalega.
 * - Interviews me "works" se zyada important hota hai "scales well".
 */


/**
 * ========================================================================
 * 1. TIME COMPLEXITY
 * ========================================================================
 * NOTES:
 * - Time complexity = input badhne par operations kaise grow karte hain.
 * - Machine speed alag ho sakti hai, but operation growth same concept rehta hai.
 *
 * EXAMPLE:
 * Input:  arr = [10, 20, 30, 40, 50]
 * Output: getFirstItem => 10  (O(1) - instant, no matter how big arr is)
 */

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


/**
 * ========================================================================
 * 2. COMMON BIG O ORDER
 * ========================================================================
 * FASTEST TO SLOWEST:
 *
 * O(1)        Constant        - direct access, fixed work
 * O(log n)    Logarithmic     - binary search
 * O(n)        Linear          - single loop
 * O(n log n)  Linearithmic    - good sorting algorithms
 * O(n^2)      Quadratic       - nested loops
 * O(2^n)      Exponential     - many brute force recursion problems
 * O(n!)       Factorial       - all permutations brute force
 *
 * GOLDEN RULE:
 * - O(1), O(log n), O(n), O(n log n) usually good.
 * - O(n^2) can be okay for small input, dangerous for large input.
 * - O(2^n), O(n!) usually need optimization, DP, pruning, or different approach.
 */


/**
 * ========================================================================
 * 3. SIMPLIFYING BIG O
 * ========================================================================
 * RULES:
 * 1. Constants drop karo.
 *    O(2n) -> O(n), O(500) -> O(1)
 *
 * 2. Smaller terms drop karo.
 *    O(n + 10) -> O(n)
 *    O(n^2 + n + 5) -> O(n^2)
 *
 * 3. Different inputs ko different variables do.
 *    Two arrays: O(a + b), nested two arrays: O(a * b)
 *
 * 4. Assignment, arithmetic, comparison, object property access usually O(1).
 *
 * 5. Loop complexity depends on loop growth.
 *
 * EXAMPLE:
 * Input:  arr1 = ['a', 'b'], arr2 = [1, 2, 3]
 * Output: prints arr1 items then arr2 items => O(a + b)
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


/**
 * ========================================================================
 * 4. SUM FROM 1 TO N FORMULA
 * ========================================================================
 * NOTES:
 * - 1 + 2 + 3 + ... + n ka direct formula:
 *   n * (n + 1) / 2
 * - Isse loop ke bina sum mil jaata hai, so calculation O(1) hoti hai.
 *
 * HOW FORMULA AAYA?
 * - Example: 1 + 2 + 3 + 4 + 5 + 6
 * - Ends se pair banao:
 *   1 + 6 = 7
 *   2 + 5 = 7
 *   3 + 4 = 7
 * - Har pair ka sum n + 1 hota hai.
 * - Total numbers n hain, so pairs n / 2 hain.
 * - Sum = number of pairs * value of each pair
 * - Sum = (n / 2) * (n + 1)
 * - Same thing: n * (n + 1) / 2
 *
 * EXAMPLE:
 * Input:  n = 6
 * Output: 21   (1+2+3+4+5+6 = 21)
 */

function sumOneToN(n) {
    return n * (n + 1) / 2;
}

// Sample Input:  6
// Expected Output: 21
console.log(sumOneToN(6)); // 21

// Sample Input:  100
// Expected Output: 5050
console.log(sumOneToN(100)); // 5050


/**
 * ========================================================================
 * 5. SPACE COMPLEXITY
 * ========================================================================
 * NOTES:
 * - Space complexity = input badhne par memory usage kaise grow hota hai.
 * - Interviews me mostly "auxiliary space" count karte hain.
 * - Auxiliary space = input ke alawa algorithm kitni extra memory use karta hai.
 *
 * COLT STEELE STYLE RULES OF THUMB:
 * - Most primitives O(1) space hote hain:
 *   number, boolean, null, undefined
 * - String O(n) space leti hai:
 *   n = string length, because characters badhte hain.
 * - Arrays and objects usually O(n) space lete hain:
 *   n = array length ya object keys count.
 * - Fixed variables use ho rahe hain -> O(1) space.
 * - New array/object/string ban raha hai with n items -> O(n) space.
 * - Recursion me call stack bhi memory count hoti hai.
 *
 * EXAMPLE:
 * Input:  [1, 2, 3, 4]
 * Output: sumArraySpaceOne => 10  (O(1) space, just 'total' variable)
 *         doubleArray      => [2, 4, 6, 8]  (O(n) space, new array)
 */

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


/**
 * ========================================================================
 * 6. LOGARITHMS - WHY O(log n) FAST HOTA HAI?
 * ========================================================================
 * NOTES:
 * - log ka simple meaning: kitni baar divide karna padega.
 * - Binary search me har step me search space half ho jaata hai.
 * - 1,000,000 items me binary search about 20 steps me answer dhoondh sakta hai.
 *
 * EXAMPLE:
 * Input:  n = 16
 * Output: 4  (16->8->4->2->1 = 4 halvings)
 */

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


/**
 * ========================================================================
 * 7. BEST, AVERAGE, WORST CASE
 * ========================================================================
 * NOTES:
 * - Best case: easiest input.
 * - Average case: normal expected input.
 * - Worst case: hardest input.
 * - Usually interviews me worst case Big O discuss hota hai.
 *
 * EXAMPLE:
 * Input:  arr = [3, 7, 1, 9, 4], target = 3
 * Output: 0  (target is first item -> Best case O(1))
 *
 * Input:  arr = [3, 7, 1, 9, 4], target = 99
 * Output: -1  (target not found -> Worst case O(n))
 */

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


/**
 * ========================================================================
 * 8. QUICK CHEAT TABLE
 * ========================================================================
 *
 * Access array by index              O(1)
 * Loop through array                 O(n)
 * Nested loop same array             O(n^2)
 * Binary search sorted array         O(log n)
 * Merge sort / quick sort average    O(n log n)
 * Hash map get/set average           O(1)
 * BFS/DFS graph adjacency list       O(V + E)
 *
 * INTERVIEW LINE:
 * - "Time complexity is O(n), space complexity is O(1)"
 * - Hamesha time aur space dono mention karne ki habit banao.
 */
