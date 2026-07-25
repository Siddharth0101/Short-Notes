'use strict';

/**
 * ========================================================================
 * DEV SKILLS, DEBUGGING & NEWER ES2022+ FEATURES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "Developer Skills & Debugging" and modern ES2022/ES2023+ updates.
 * - Logical Assignment Operators (&&=, ||=, ??=).
 * - Change-by-copy Array methods (toSorted, toReversed, toSpliced, with).
 * - Debugging with browser DevTools and breakpoints.
 */


/**
 * ========================================================================
 * 1. LOGICAL ASSIGNMENT OPERATORS (ES2021)
 * ========================================================================
 * NOTES:
 * - ||=  (Logical OR Assignment): assigns if variable is FALSY.
 * - ??=  (Logical Nullish Assignment): assigns if variable is NULL or UNDEFINED.
 * - &&=  (Logical AND Assignment): assigns if variable is TRUTHY.
 *
 * ┌───────────────────────────┬───────────────────────────────┐
 * │ Shorthand                 │ Equivalent To                 │
 * ├───────────────────────────┼───────────────────────────────┤
 * │ x ||= y                   │ x = x || y                    │
 * │ x ??= y                   │ x = x ?? y                    │
 * │ x &&= y                   │ x = x && y                    │
 * └───────────────────────────┴───────────────────────────────┘
 */

const rest1 = { name: 'Capri', numGuests: 0 };
const rest2 = { name: 'La Piazza', owner: 'Giovanni' };

// OR assignment (0 is falsy, so rest1.numGuests gets overwritten!):
// rest1.numGuests ||= 10; // 10 (overwrote 0)

// Nullish assignment (0 is NOT nullish, so 0 preserved!):
rest1.numGuests ??= 10; // 0 (preserved!)
rest2.numGuests ??= 10; // 10 (was undefined)

// AND assignment (replace owner if exists):
rest1.owner &&= '<ANONYMOUS>'; // undefined (no owner)
rest2.owner &&= '<ANONYMOUS>'; // '<ANONYMOUS>' (had owner)

console.log(rest1); // { name: 'Capri', numGuests: 0 }
console.log(rest2); // { name: 'La Piazza', owner: '<ANONYMOUS>', numGuests: 10 }


/**
 * ========================================================================
 * 2. IMMUTABLE ARRAY METHODS (ES2023 / ES14)
 * ========================================================================
 * NOTES:
 * - Modern JS added non-mutating alternatives to sort, reverse, splice, and index assignment.
 *
 * ┌─────────────────┬─────────────────────────────┬─────────────────────────┐
 * │ Mutating Method │ Non-Mutating Copy Method    │ Returns                 │
 * ├─────────────────┼─────────────────────────────┼─────────────────────────┤
 * │ sort()          │ toSorted()                  │ New sorted array        │
 * │ reverse()       │ toReversed()                │ New reversed array      │
 * │ splice()        │ toSpliced()                 │ New array with changes  │
 * │ arr[i] = val    │ with(index, value)          │ New array with replacement│
 * └─────────────────┴─────────────────────────────┴─────────────────────────┘
 */

const original = [3, 1, 4, 1, 5, 9];

// toSorted (original untouched):
const sorted = original.toSorted((a, b) => a - b);
console.log(original); // [3, 1, 4, 1, 5, 9] (safe!)
console.log(sorted);   // [1, 1, 3, 4, 5, 9]

// toReversed:
const reversed = original.toReversed();
console.log(reversed); // [9, 5, 1, 4, 1, 3]

// with (immutable element replacement):
const updated = original.with(2, 99); // replace index 2 with 99
console.log(updated);  // [3, 1, 99, 1, 5, 9]

// findLast and findLastIndex:
const numbers = [5, 12, 50, 130, 44];
console.log(numbers.findLast(n => n > 45));       // 44 (searches from right!)
console.log(numbers.findLastIndex(n => n > 45));  // 4 (index of 44)


/**
 * ========================================================================
 * 3. DEVELOPER SKILLS & DEBUGGING FLOW
 * ========================================================================
 * NOTES:
 * - 4-step problem solving framework (Jonas method):
 *   1. Understand the problem (ask right questions, clarify inputs/outputs).
 *   2. Divide & conquer (break big problem into sub-problems).
 *   3. Don't be afraid to research (MDN, StackOverflow).
 *   4. Write pseudo-code before actual coding.
 *
 * DEBUGGING TOOLS:
 * - console.log(), console.warn(), console.error(), console.table().
 * - Chrome DevTools: Sources tab → Breakpoints → Step over / Step into / Call stack.
 * - `debugger;` statement in code triggers breakpoint automatically.
 */

function measureKelvin() {
    const measurement = {
        type: 'temp',
        unit: 'celsius',
        // value: Number(prompt('Degrees celsius:')),
        value: 25,
    };

    // Table view for objects:
    console.table(measurement);

    // debugger; // execution pauses here when DevTools is open!

    const kelvin = measurement.value + 273;
    return kelvin;
}

console.log(measureKelvin()); // 298
