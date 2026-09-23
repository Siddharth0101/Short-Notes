# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Build a readable transformation

```js
const orders = [
  { id: "a", customer: "Asha", total: 300, paid: true },
  { id: "b", customer: "Kabir", total: 150, paid: false },
  { id: "c", customer: "Asha", total: 100, paid: true }
];
const paid = orders.filter(order => order.paid);
const total = paid.reduce((sum, order) => sum + order.total, 0);
const customers = [...new Set(paid.map(order => order.customer))];
const highestFirst = orders.toSorted((a, b) => b.total - a.total);
const lookup = new Map(orders.map(order => [order.id, order]));
console.log(total, customers, lookup.get("b")?.total); // 400 ["Asha"] 150
```

## Grouping and aggregating

```js
const byCustomer = orders.reduce((acc, order) => {
  (acc[order.customer] ??= []).push(order);
  return acc;
}, {});
console.log(Object.keys(byCustomer)); // ["Asha", "Kabir"]

// Newer runtimes: Object.groupBy expresses the same intent as a builtin.
const grouped = Object.groupBy(orders, order => order.customer);
console.log(grouped.Asha.length); // 2
```

```js
const privateData = new WeakMap();
class Session {
  constructor(token) { privateData.set(this, { token }); }
  get token() { return privateData.get(this).token; }
}
```
