# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Depth walkthrough — andar kya ho raha hai?

```js
const first = { name: 'Asha', progress: { done: 2 } };
const alias = first;
const copied = { ...first };
copied.name = 'Kabir';
copied.progress.done = 3;
console.log(first.name, first.progress.done, alias === first);
// Asha, 3, true
```
