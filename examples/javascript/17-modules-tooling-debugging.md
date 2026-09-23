# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Small module boundary

```js
// pricing.js
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

```js
// app.js — loaded with <script type="module" src="app.js"></script>
import { subtotal } from "./pricing.js";
console.log(subtotal([{ price: 150, quantity: 2 }])); // 300

async function openChart() {
  const { renderChart } = await import("./chart.js");
  renderChart();
}
```

## Environment config and code-splitting

```js
// build-tool style env access (e.g. Vite)
const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// route-based split
const routes = [
  { path: "/reports", component: () => import("./pages/Reports.js") }
];
```

## Debug systematically

```js
function processOrders(orders) {
  for (const order of orders) {
    // conditional breakpoint here: order.total < 0
    applyDiscount(order);
  }
}
```

## Research notes: Imports are live read-only bindings

```js
// score.mjs
export let score = 0;
export function award() { score += 2; }

// main.mjs
import { score, award } from './score.mjs';
const before = score;
award();
console.log(before, score); // 0, 2
```
