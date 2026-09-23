# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Values and decisions

```js
"use strict";

function calculateTotal(rawPrice, rawQuantity = 1) {
  const price = Number(rawPrice);
  const quantity = Number(rawQuantity);
  if (!Number.isFinite(price) || price < 0) {
    throw new TypeError("Price must be a non-negative number");
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new TypeError("Quantity must be a non-negative integer");
  }
  return price * quantity;
}

console.log(calculateTotal("120", 0)); // 0
console.log(0 || 1); // 1
console.log(0 ?? 1); // 0
```

```js
const cart = { items: 3, toString() { return `Cart(${this.items})`; } };
console.log(`Summary: ${cart}`); // Summary: Cart(3)
console.log([1, 2, 3] + ""); // "1,2,3"
console.log({} + ""); // "[object Object]"
```

## Functions and control flow

```js
function summarizeOrder({ id, total, discount = 0 }, ...notes) {
  const finalTotal = total - discount;
  return { id, finalTotal, noteCount: notes.length };
}

console.log(summarizeOrder({ id: "o1", total: 500, discount: 50 }, "gift wrap", "urgent"));
// { id: "o1", finalTotal: 450, noteCount: 2 }
```
