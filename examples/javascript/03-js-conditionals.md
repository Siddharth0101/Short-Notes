# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Trace one decision

```javascript
const score = 72;
const submitted = true;
if (!submitted) {
  console.log('Submit your work first');
} else if (score >= 80) {
  console.log('Ready for advanced practice');
} else if (score >= 50) {
  console.log('Revise and try again');
} else {
  console.log('Repeat the fundamentals');
}
```

## Depth walkthrough — andar kya ho raha hai?

```js
function grade(score) {
  if (!Number.isFinite(score) || score < 0 || score > 100) return 'invalid';
  if (score >= 80) return 'distinction';
  if (score >= 50) return 'pass';
  return 'retry';
}
console.log([49, 50, 79, 80, 101].map(grade));
// ['retry', 'pass', 'pass', 'distinction', 'invalid']
```
