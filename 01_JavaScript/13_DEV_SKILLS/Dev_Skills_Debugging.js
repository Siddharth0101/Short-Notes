/**
 * ## Quick revision
 *
 * - ES module — `import`/`export`; imports live bindings hote hain.
 * - Module scope — variables automatically global nahi bante.
 * - Dynamic import — `import()` Promise deta hai; zaroorat par code load karo.
 * - Bundler — modules/assets ko production bundles mein prepare karta hai.
 * - Tree shaking — unused exports hata sakta hai; side effects limit karte hain.
 * - Lockfile — dependency resolution pin; reproducible install ke liye commit karo.
 * - Source map — built code ko original source se map karta hai.
 * - Debugging — reproduce → breakpoint → state inspect → smallest fix.
 * - Environment — browser bundle mein bheja secret public samjho.
 * - Deployment — hashed assets long-cache; HTML update/revalidation sochkar karo.
 * - Logical assignment — `||=`, `&&=`, `??=` condition meet hone par hi assign.
 * - Immutable array — `toSorted`/`toReversed` original preserve karte hain.
 * - Debug tools — breakpoints, call stack aur Network panel se evidence lo.
 * - Circular import — initialization order matter; module load ke dauran uninitialized binding read fail kar sakti hai.
 * - Dependency audit — direct aur transitive packages alag; lockfile diff review karo.
 * - Polyfill/transpile — missing runtime API provide / syntax transform; dono same kaam nahi.
 */

'use strict';


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
