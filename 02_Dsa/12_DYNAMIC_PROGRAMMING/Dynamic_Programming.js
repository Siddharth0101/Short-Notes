/**
 * ## Quick revision
 *
 * - DP — overlapping subproblems ke results reuse karo.
 * - State — subproblem ko uniquely define karne wali minimum information.
 * - Transition — smaller states se current answer ka relation.
 * - Base case — smallest states ke known answers.
 * - Memoization — top-down recursion + cache.
 * - Tabulation — bottom-up dependency order mein fill karo.
 * - Complexity — states × transition cost; storage alag count.
 * - 0/1 knapsack — one-array optimization mein capacity reverse scan.
 * - Unbounded choice — reuse allowed; loop order contract ke hisaab se.
 * - Reconstruction — choices/parents store karo jab actual solution chahiye.
 * - Optimization — sirf required prior states rakho; dependency overwrite mat karo.
 * - Grid traveler — state row/column; blocked/boundary cells ke base cases clear karo.
 * - Coin change — minimum coins aur combination count alag transitions maangte hain.
 * - LCS — two-prefix state; matching chars par diagonal + 1, warna neighboring maximum.
 * - Counting order — coin loop aur amount loop ka order combinations vs permutations change kar sakta hai.
 * - Impossible state — infinity/negative sentinel safely choose; overflow aur invalid transitions avoid.
 * - DAG view — DP states dependencies ka graph; valid evaluation order pehle dependencies solve kare.
 */

'use strict';


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
