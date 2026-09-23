# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Worked solution

```javascript
function dailyTemperatures(temperatures) {
  const waits = Array(temperatures.length).fill(0);
  const stack = [];
  for (let today = 0; today < temperatures.length; today++) {
    while (stack.length &&
      temperatures[today] > temperatures[stack.at(-1)]) {
      const previous = stack.pop();
      waits[previous] = today - previous;
    }
    stack.push(today);
  }
  return waits;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
// [1, 1, 4, 2, 1, 1, 0, 0]
```
