'use strict';

/**
 * ========================================================================
 * DYNAMIC PROGRAMMING
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
 */

function fibSlow(n) {
    if (n <= 2) return 1;
    return fibSlow(n - 1) + fibSlow(n - 2);
}

// fibSlow(50) very slow because same calls repeat hoti hain.


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
 */

function fibMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 2) return 1;

    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}


/**
 * ========================================================================
 * 4. TABULATION - BOTTOM UP
 * ========================================================================
 * NOTES:
 * - Iterative approach.
 * - Smallest answers se table fill karo.
 * - Usually recursion stack avoid hota hai.
 */

function fibTab(n) {
    if (n <= 2) return 1;

    const fibNums = [0, 1, 1];

    for (let i = 3; i <= n; i++) {
        fibNums[i] = fibNums[i - 1] + fibNums[i - 2];
    }

    return fibNums[n];
}

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


/**
 * ========================================================================
 * 5. GRID TRAVELER
 * ========================================================================
 * PROBLEM:
 * - m x n grid me top-left se bottom-right tak kitne ways?
 * - Sirf right/down move allowed.
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


/**
 * ========================================================================
 * 6. CAN SUM / HOW SUM / BEST SUM PATTERN
 * ========================================================================
 * NOTES:
 * - Target sum problems DP practice ke liye great hain.
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


/**
 * ========================================================================
 * 7. COIN CHANGE - TABULATION
 * ========================================================================
 * PROBLEM:
 * - Amount banane ke minimum coins count.
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


/**
 * ========================================================================
 * 8. LONGEST COMMON SUBSEQUENCE
 * ========================================================================
 * NOTES:
 * - Subsequence contiguous hona zaroori nahi.
 * - DP table use hoti hai.
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
