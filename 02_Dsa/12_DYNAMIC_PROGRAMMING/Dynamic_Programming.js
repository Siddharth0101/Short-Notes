'use strict';

/**
 * ========================================================================
 * DYNAMIC PROGRAMMING [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Dynamic Programming = complex problem ko smaller overlapping subproblems me todna.
 * - Same subproblem baar baar solve ho raha hai to result cache karo.
 *
 * DP TABHI USE KARO JAB:
 * 1. Overlapping subproblems ho.
 * 2. Optimal substructure ho.
 */


/**
 * ========================================================================
 * 1. OVERLAPPING SUBPROBLEMS
 * ========================================================================
 * NOTES:
 * - Same chhote problem repeated solve ho rahe hain.
 * - Fibonacci classic example.
 *
 * EXAMPLE - fibSlow:
 * Input:  n = 6
 * Output: 8  (1, 1, 2, 3, 5, 8)
 *
 * fibSlow(6) calls fibSlow(5) and fibSlow(4)
 * fibSlow(5) calls fibSlow(4) and fibSlow(3)  <- fibSlow(4) called TWICE = overlapping!
 */

function fibSlow(n) {
    if (n <= 2) return 1;
    return fibSlow(n - 1) + fibSlow(n - 2);
}

// Sample Input:  6
// Expected Output: 8  (fib sequence: 1,1,2,3,5,8)
console.log(fibSlow(6)); // 8

// Sample Input:  10
// Expected Output: 55
console.log(fibSlow(10)); // 55
// fibSlow(50) is very slow - same calls repeat hoti hain


/**
 * ========================================================================
 * 2. OPTIMAL SUBSTRUCTURE
 * ========================================================================
 * NOTES:
 * - Big problem ka optimal answer smaller problems ke optimal answer se ban sakta hai.
 * - Shortest path, coin change, knapsack, LCS examples.
 */


/**
 * ========================================================================
 * 3. MEMOIZATION - TOP DOWN
 * ========================================================================
 * NOTES:
 * - Recursion + cache.
 * - Pehle solve karo, result memo me store karo.
 *
 * EXAMPLE - fibMemo:
 * Input:  n = 50
 * Output: 12586269025  (fast! each fib computed only once)
 *
 * fibSlow(50) is impractical, fibMemo(50) is instant.
 */

function fibMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 2) return 1;

    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Sample Input:  6
// Expected Output: 8
console.log(fibMemo(6)); // 8

// Sample Input:  10
// Expected Output: 55
console.log(fibMemo(10)); // 55

// Sample Input:  50  (would be slow with fibSlow)
// Expected Output: 12586269025
console.log(fibMemo(50)); // 12586269025


/**
 * ========================================================================
 * 4. TABULATION - BOTTOM UP
 * ========================================================================
 * NOTES:
 * - Iterative approach.
 * - Smallest answers se table fill karo.
 * - Usually recursion stack avoid hota hai.
 *
 * EXAMPLE - fibTab:
 * Input:  n = 7
 * Output: 13  (fib: 1,1,2,3,5,8,13)
 *
 * EXAMPLE - fibTabSpaceOptimized:
 * Same output but only 2 variables instead of full array.
 */

function fibTab(n) {
    if (n <= 2) return 1;

    const fibNums = [0, 1, 1];

    for (let i = 3; i <= n; i++) {
        fibNums[i] = fibNums[i - 1] + fibNums[i - 2];
    }

    return fibNums[n];
}

// Sample Input:  7
// Expected Output: 13
console.log(fibTab(7)); // 13

// Sample Input:  10
// Expected Output: 55
console.log(fibTab(10)); // 55

function fibTabSpaceOptimized(n) {
    if (n <= 2) return 1;

    let prev2 = 1;
    let prev1 = 1;

    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}

// Sample Input:  7
// Expected Output: 13
console.log(fibTabSpaceOptimized(7)); // 13

// Sample Input:  50
// Expected Output: 12586269025
console.log(fibTabSpaceOptimized(50)); // 12586269025


/**
 * ========================================================================
 * 5. GRID TRAVELER
 * ========================================================================
 * PROBLEM:
 * - m x n grid me top-left se bottom-right tak kitne ways?
 * - Sirf right/down move allowed.
 *
 * EXAMPLE:
 * Input:  m=2, n=3  (2 rows, 3 cols)
 * Output: 3  (three paths: RRD, RDR, DRR)
 *
 * Input:  m=3, n=3
 * Output: 6
 *
 * Input:  m=1, n=1
 * Output: 1  (already at destination)
 *
 * Input:  m=0, n=5  (no rows)
 * Output: 0  (impossible)
 */

function gridTraveler(m, n, memo = {}) {
    const key = `${m},${n}`;
    const reverseKey = `${n},${m}`;

    if (key in memo) return memo[key];
    if (reverseKey in memo) return memo[reverseKey];
    if (m === 1 && n === 1) return 1;
    if (m === 0 || n === 0) return 0;

    memo[key] = gridTraveler(m - 1, n, memo) + gridTraveler(m, n - 1, memo);
    return memo[key];
}

// Sample Input:  m=2, n=3
// Expected Output: 3
console.log(gridTraveler(2, 3)); // 3

// Sample Input:  m=3, n=3
// Expected Output: 6
console.log(gridTraveler(3, 3)); // 6

// Sample Input:  m=18, n=18
// Expected Output: 2333606220  (large but fast with memo)
console.log(gridTraveler(18, 18)); // 2333606220

// Sample Input:  m=1, n=1
// Expected Output: 1
console.log(gridTraveler(1, 1)); // 1

// Sample Input:  m=0, n=5
// Expected Output: 0
console.log(gridTraveler(0, 5)); // 0


/**
 * ========================================================================
 * 6. CAN SUM / HOW SUM / BEST SUM PATTERN
 * ========================================================================
 * NOTES:
 * - Target sum problems DP practice ke liye great hain.
 *
 * EXAMPLE - canSum:
 * Input:  targetSum=7, numbers=[2,3]
 * Output: true  (3+2+2=7)
 *
 * Input:  targetSum=7, numbers=[2,4]
 * Output: false  (can't make 7 with only 2s and 4s)
 *
 * EXAMPLE - bestSum:
 * Input:  targetSum=7, numbers=[5,3,4,7]
 * Output: [7]  (shortest combination, 1 number)
 *
 * Input:  targetSum=8, numbers=[2,3,5]
 * Output: [3,5]  (shorter than [2,2,2,2] or [3,3,2])
 */

function canSum(targetSum, numbers, memo = {}) {
    if (targetSum in memo) return memo[targetSum];
    if (targetSum === 0) return true;
    if (targetSum < 0) return false;

    for (const num of numbers) {
        const remainder = targetSum - num;

        if (canSum(remainder, numbers, memo) === true) {
            memo[targetSum] = true;
            return true;
        }
    }

    memo[targetSum] = false;
    return false;
}

// Sample Input:  targetSum=7, numbers=[2, 3]
// Expected Output: true  (3+2+2=7)
console.log(canSum(7, [2, 3]));     // true

// Sample Input:  targetSum=7, numbers=[2, 4]
// Expected Output: false
console.log(canSum(7, [2, 4]));     // false

// Sample Input:  targetSum=300, numbers=[7, 14]
// Expected Output: false  (fast with memo)
console.log(canSum(300, [7, 14]));  // false

// Sample Input:  targetSum=0, numbers=[1, 2]
// Expected Output: true  (empty combo = sum 0)
console.log(canSum(0, [1, 2]));     // true

function bestSum(targetSum, numbers, memo = {}) {
    if (targetSum in memo) return memo[targetSum];
    if (targetSum === 0) return [];
    if (targetSum < 0) return null;

    let shortestCombination = null;

    for (const num of numbers) {
        const remainder = targetSum - num;
        const remainderCombination = bestSum(remainder, numbers, memo);

        if (remainderCombination !== null) {
            const combination = [...remainderCombination, num];

            if (
                shortestCombination === null ||
                combination.length < shortestCombination.length
            ) {
                shortestCombination = combination;
            }
        }
    }

    memo[targetSum] = shortestCombination;
    return shortestCombination;
}

// Sample Input:  targetSum=7, numbers=[5, 3, 4, 7]
// Expected Output: [7]  (shortest: just one 7)
console.log(bestSum(7, [5, 3, 4, 7]));    // [7]

// Sample Input:  targetSum=8, numbers=[2, 3, 5]
// Expected Output: [3, 5] or [5, 3]  (2 elements, shorter than [2,2,2,2])
console.log(bestSum(8, [2, 3, 5]));       // [3, 5]

// Sample Input:  targetSum=7, numbers=[2, 4]
// Expected Output: null  (impossible)
console.log(bestSum(7, [2, 4]));           // null


/**
 * ========================================================================
 * 7. COIN CHANGE - TABULATION
 * ========================================================================
 * PROBLEM:
 * - Amount banane ke minimum coins count.
 *
 * EXAMPLE:
 * Input:  coins=[1,5,6,9], amount=11
 * Output: 2  (two coins: 5+6=11)
 *
 * Input:  coins=[2], amount=3
 * Output: -1  (impossible)
 */

function minCoins(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
        for (const coin of coins) {
            if (currentAmount - coin >= 0) {
                dp[currentAmount] = Math.min(
                    dp[currentAmount],
                    dp[currentAmount - coin] + 1
                );
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

// Sample Input:  coins=[1, 5, 6, 9], amount=11
// Expected Output: 2  (5+6=11)
console.log(minCoins([1, 5, 6, 9], 11)); // 2

// Sample Input:  coins=[1, 2, 5], amount=11
// Expected Output: 3  (5+5+1=11)
console.log(minCoins([1, 2, 5], 11));    // 3

// Sample Input:  coins=[2], amount=3
// Expected Output: -1  (impossible, can only make even amounts)
console.log(minCoins([2], 3));           // -1

// Sample Input:  coins=[1], amount=0
// Expected Output: 0  (zero coins needed for amount 0)
console.log(minCoins([1], 0));           // 0


/**
 * ========================================================================
 * 8. LONGEST COMMON SUBSEQUENCE
 * ========================================================================
 * NOTES:
 * - Subsequence contiguous hona zaroori nahi.
 * - DP table use hoti hai.
 *
 * EXAMPLE:
 * Input:  text1='abcde', text2='ace'
 * Output: 3  (LCS = 'ace')
 *
 * Input:  text1='abc', text2='abc'
 * Output: 3  (LCS = 'abc', same strings)
 *
 * Input:  text1='abc', text2='def'
 * Output: 0  (no common subsequence)
 */

function longestCommonSubsequence(text1, text2) {
    const rows = text1.length + 1;
    const cols = text2.length + 1;
    const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[text1.length][text2.length];
}

// Sample Input:  'abcde', 'ace'
// Expected Output: 3  (LCS = 'ace')
console.log(longestCommonSubsequence('abcde', 'ace')); // 3

// Sample Input:  'abc', 'abc'
// Expected Output: 3
console.log(longestCommonSubsequence('abc', 'abc'));    // 3

// Sample Input:  'abc', 'def'
// Expected Output: 0
console.log(longestCommonSubsequence('abc', 'def'));    // 0

// Sample Input:  'AGGTAB', 'GXTXAYB'
// Expected Output: 4  (LCS = 'GTAB')
console.log(longestCommonSubsequence('AGGTAB', 'GXTXAYB')); // 4


/**
 * ========================================================================
 * 9. 0/1 KNAPSACK - CONCEPT
 * ========================================================================
 * NOTES:
 * - Item choose ya skip.
 * - Har item ek baar use ho sakta hai.
 * - State: index + remaining capacity.
 *
 * COMMON DP STATE THINKING:
 * - What changes between recursive calls?
 * - That becomes state.
 * - State ko memo/table key banao.
 */


/**
 * ========================================================================
 * 10. DP CHECKLIST
 * ========================================================================
 *
 * 1. Brute force recursion likh sakte ho?
 * 2. Kya same calls repeat ho rahi hain?
 * 3. State variables identify karo.
 * 4. Base cases likho.
 * 5. Recurrence relation socho.
 * 6. Memoization add karo.
 * 7. Need ho to tabulation me convert karo.
 * 8. Space optimize ho sakta hai kya?
 */
