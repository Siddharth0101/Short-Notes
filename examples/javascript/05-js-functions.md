# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## One operation many inputs

```javascript
function lessonMinutes(lessons, minutesPerLesson) {
  return lessons * minutesPerLesson;
}
const monday = lessonMinutes(2, 15);
const tuesday = lessonMinutes(3, 10);
console.log(monday + tuesday); // 60
```

## Build with familiar statements

```javascript
function sumThrough(last) {
  let total = 0;
  for (let value = 1; value <= last; value++) {
    total += value;
  }
  return total;
}
console.log(sumThrough(4)); // 10
```

## Depth walkthrough — andar kya ho raha hai?

```js
function discounted(price, discount = 0) {
  return price - discount;
}
const first = discounted(20, 5);
const second = discounted(20);
console.log(first + second); // 35
```
