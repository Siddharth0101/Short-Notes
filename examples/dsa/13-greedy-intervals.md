# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Maximum meetings — earliest finish kyun?

```js
function selectMeetings(intervals) {
  const sorted = intervals.map(([start, end]) => [start, end]);
  if (sorted.some(([s, e]) => !Number.isFinite(s) || !Number.isFinite(e) || s >= e)) {
    throw new RangeError('Expected finite start < end');
  }
  sorted.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const chosen = [];
  let lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {
      chosen.push([start, end]);
      lastEnd = end;
    }
  }
  return chosen;
}
console.log(selectMeetings([[0, 6], [1, 3], [3, 5], [5, 7]]));
// [[1,3], [3,5], [5,7]]
```
