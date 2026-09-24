/**
 * ## Quick revision
 *
 * - Recursion — function smaller subproblem ko call karta hai.
 * - Base case — recursion rokne ka valid smallest case.
 * - Progress — har call base case ke paas jaaye.
 * - Call stack — pending calls memory leti hain; depth limit socho.
 * - Backtracking — choose → explore → undo.
 * - Pruning — impossible branch early skip; valid solutions lose na karo.
 * - Snapshot — result mein mutable path ki copy save karo.
 * - Memoization — same state ka computed result reuse karo.
 * - Complexity — branching factor aur depth se tree size estimate karo.
 * - Permutations/subsets — order matters / selection matters; duplicate handling accordingly.
 * - Visited undo — path-specific visited mark ko backtrack par release; global graph visited ka rule alag.
 * - Tail recursion — language/runtime optimization guaranteed na ho toh stack space still count karo.
 */

'use strict';


function countDown(num) {
    if (num <= 0) {
        console.log('All done');
        return;
    }

    console.log(num);
    countDown(num - 1);
}

// Sample Input:  3
// Expected Output: 3, 2, 1, 'All done'
countDown(3); // 3, 2, 1, All done

// Sample Input:  0
// Expected Output: 'All done'  (base case immediately)
countDown(0); // All done


function factorial(num) {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
}

// Sample Input:  5
// Expected Output: 120
console.log(factorial(5)); // 120

// Sample Input:  0
// Expected Output: 1  (0! = 1 by definition)
console.log(factorial(0)); // 1

// Sample Input:  1
// Expected Output: 1
console.log(factorial(1)); // 1

function sumRange(num) {
    if (num === 1) return 1;
    return num + sumRange(num - 1);
}

// Sample Input:  4
// Expected Output: 10  (4+3+2+1)
console.log(sumRange(4)); // 10

// Sample Input:  6
// Expected Output: 21  (6+5+4+3+2+1)
console.log(sumRange(6)); // 21

function power(base, exponent) {
    if (exponent === 0) return 1;
    return base * power(base, exponent - 1);
}

// Sample Input:  base=2, exponent=3
// Expected Output: 8
console.log(power(2, 3)); // 8

// Sample Input:  base=5, exponent=0
// Expected Output: 1
console.log(power(5, 0)); // 1

// Sample Input:  base=3, exponent=4
// Expected Output: 81
console.log(power(3, 4)); // 81


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

// Sample Input:  [1, 2, 3, 4, 5, 6, 7, 8, 9]
// Expected Output: [1, 3, 5, 7, 9]
console.log(collectOddValues([1, 2, 3, 4, 5, 6, 7, 8, 9])); // [1, 3, 5, 7, 9]

// Sample Input:  [2, 4, 6, 8]
// Expected Output: []  (no odd values)
console.log(collectOddValues([2, 4, 6, 8])); // []


function collectOddValuesPure(arr) {
    let newArr = [];

    if (arr.length === 0) return newArr;

    if (arr[0] % 2 !== 0) {
        newArr.push(arr[0]);
    }

    newArr = newArr.concat(collectOddValuesPure(arr.slice(1)));
    return newArr;
}

// Sample Input:  [1, 2, 3, 4, 5]
// Expected Output: [1, 3, 5]
console.log(collectOddValuesPure([1, 2, 3, 4, 5])); // [1, 3, 5]

// Sample Input:  [4, 6, 8]
// Expected Output: []
console.log(collectOddValuesPure([4, 6, 8])); // []


function productOfArray(arr) {
    if (arr.length === 0) return 1;
    return arr[0] * productOfArray(arr.slice(1));
}

// Sample Input:  [1, 2, 3, 4]
// Expected Output: 24
console.log(productOfArray([1, 2, 3, 4])); // 24

// Sample Input:  [2, 5, 3]
// Expected Output: 30
console.log(productOfArray([2, 5, 3])); // 30

function reverseString(str) {
    if (str.length <= 1) return str;
    return reverseString(str.slice(1)) + str[0];
}

// Sample Input:  'hello'
// Expected Output: 'olleh'
console.log(reverseString('hello')); // 'olleh'

// Sample Input:  'abcde'
// Expected Output: 'edcba'
console.log(reverseString('abcde')); // 'edcba'

function isPalindrome(str) {
    if (str.length <= 1) return true;
    if (str[0] !== str[str.length - 1]) return false;
    return isPalindrome(str.slice(1, -1));
}

// Sample Input:  'racecar'
// Expected Output: true
console.log(isPalindrome('racecar')); // true

// Sample Input:  'hello'
// Expected Output: false
console.log(isPalindrome('hello')); // false

// Sample Input:  'a'
// Expected Output: true  (single char is palindrome)
console.log(isPalindrome('a')); // true


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

// Sample Input:  [1, 2, 3]
// Expected Output: 6 permutations
console.log(getPermutations([1, 2, 3]));
// [ [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] ]

// Sample Input:  [1, 2]
// Expected Output: 2 permutations: [ [1,2], [2,1] ]
console.log(getPermutations([1, 2])); // [ [1, 2], [2, 1] ]

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

// Sample Input:  [1, 2, 3]
// Expected Output: 8 subsets (2^3)
console.log(getSubsets([1, 2, 3]));
// [ [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3] ]

// Sample Input:  [1, 2]
// Expected Output: 4 subsets: [ [], [1], [1,2], [2] ]
console.log(getSubsets([1, 2])); // [ [], [1], [1, 2], [2] ]
