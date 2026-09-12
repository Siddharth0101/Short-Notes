---
id: js-arrays-objects
title: Arrays objects and simple data modeling
track: javascript
order: 6
level: Foundation
minutes: 12
summary: Represent a list and a record before learning transformations and destructuring.
tags: fundamentals, js, arrays, objects
---

## Mental model

An array represents an ordered collection. An object groups named properties into a record. A list of lesson titles and one learner profile answer different questions, so choose their shapes deliberately. You already know variables, loops and functions; now those tools can process more than one value.

## Read and update collections

```javascript
const titles = ['Variables', 'Decisions'];
titles.push('Loops');
console.log(titles[0]); // Variables
console.log(titles.length); // 3
for (const title of titles) {
  console.log(title);
}

const learner = { name: 'Asha', completed: 2 };
learner.completed = learner.completed + 1;
console.log(learner.name, learner.completed); // Asha 3
```

Array indexing starts at zero. length is a count, not the last valid index. Reading a nonexistent ordinary array element or object property yields undefined. Dot notation names a property directly; bracket notation can use a computed key, such as learner[fieldName].

## Identity and copying

const prevents reassignment of the binding, but does not freeze the array or object it refers to. If const other = learner, both bindings refer to the same object; changing a property through one is visible through the other. Two separate object literals create different identities even if their fields match. This distinction becomes essential for React state later.

Start with shallow records and explicit loops. The collections chapter will introduce map, filter, reduce, destructuring and spread after you understand what data they operate on. Avoid learning a transformation as unexplained punctuation before you can express it with a loop.

## Practice

Create three lesson records with title and minutes properties inside an array. Use a for...of loop to add their minutes into a total, then put the calculation inside a function. Add a fourth lesson and confirm you do not need to change the function. Test an empty list and explain why its total is zero.

## Check before moving on

You should be able to distinguish list position from object field name, and mutation from binding reassignment. The next foundations checkpoint combines these small concepts into a validated calculation. After that, move to deeper scope and collection behavior.

## Sources

[MDN indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) and [working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects) explain these structures.
