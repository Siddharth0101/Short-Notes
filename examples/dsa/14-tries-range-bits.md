# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Fenwick tree — updated sums ke liye blocks

```js
class Fenwick {
  constructor(size) {
    if (!Number.isInteger(size) || size < 0 || size > 1_000_000) throw new RangeError('size');
    this.size = size;
    this.tree = Array(size + 1).fill(0);
  }
  add(index, delta) {
    if (!Number.isInteger(index) || index < 0 || index >= this.size || !Number.isFinite(delta)) {
      throw new RangeError('update');
    }
    for (let i = index + 1; i <= this.size; i += i & -i) this.tree[i] += delta;
  }
  prefix(end) {
    if (!Number.isInteger(end) || end < 0 || end > this.size) throw new RangeError('end');
    let sum = 0;
    for (let i = end; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }
}
const values = [2, 1, 3, 4];
const sums = new Fenwick(values.length);
values.forEach((value, index) => sums.add(index, value));
console.log(sums.prefix(3) - sums.prefix(1)); // 4: indices 1,2
sums.add(1, 5);
console.log(sums.prefix(3) - sums.prefix(1)); // 9
```
