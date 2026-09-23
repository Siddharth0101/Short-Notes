# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Representative questions and answers

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Typical browser execution: A D C B
```

## Coding drill and review

```js
function debounce(fn, delay) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    const receiver = this;
    timer = setTimeout(() => fn.apply(receiver, args), delay);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
```
