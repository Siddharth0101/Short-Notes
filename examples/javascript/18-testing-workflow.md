# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Contract se test cases nikalo

```js
// cart.mjs
export function totalPaise(items) {
  let total = 0;
  for (const { pricePaise, quantity } of items) {
    if (![pricePaise, quantity].every(n => Number.isSafeInteger(n) && n >= 0)) {
      throw new RangeError('Invalid line item');
    }
    total += pricePaise * quantity;
    if (!Number.isSafeInteger(total)) throw new RangeError('Unsafe total');
  }
  return total;
}
```

```js
// cart.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { totalPaise } from './cart.mjs';

test('empty cart ka total zero hai', () => {
  assert.equal(totalPaise([]), 0);
});
test('multiple items add hote hain; input same rehta hai', () => {
  const items = [{ pricePaise: 125, quantity: 2 }, { pricePaise: 50, quantity: 3 }];
  const before = structuredClone(items);
  assert.equal(totalPaise(items), 400);
  assert.deepEqual(items, before);
});
test('invalid quantity reject hoti hai', () => {
  assert.throws(() => totalPaise([{ pricePaise: 50, quantity: -1 }]), RangeError);
});
```
