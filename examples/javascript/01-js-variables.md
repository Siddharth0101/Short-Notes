# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Declare before reading

```javascript
const learner = 'Asha';
let completed = 0;
console.log(learner); // Asha
console.log(completed); // 0
completed = completed + 1;
console.log(completed); // 1
```

## Depth walkthrough — andar kya ho raha hai?

```js
let original = 4;
const snapshot = original;
original = original + 3;
console.log(original, snapshot); // 7, 4
```
