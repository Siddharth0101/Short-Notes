---
id: javascript-testing-workflow
title: Testing aur debugging — bug ko repeatable proof banao
track: javascript
order: 18
level: Intermediate
minutes: 33
summary: Test observable contract check karta hai; controlled inputs se failure dobara reproduce aur fix verify karo.
tags: testing, assertions, debugging, async
---

## Mental model — simple soch

Code ek baar sahi output de toh confidence milta hai, lekin correctness ka proof nahi. Test ek chhota repeatable experiment hai: known input do, operation chalao aur observable result compare karo. Thermometer ki tarah test sirf wahi dimension measure karega jiske liye bana hai. Sirf happy path dekhoge toh invalid input aur races chup sakti hain.

> **Core takeaway:** Test ka naam expected behavior bataye; failure ka message tumhe broken contract tak le jaaye.

Pehle functions, arrays, promises aur modules wale chapters complete karo. Yahan Node ke built-in runner se pure JavaScript test karenge; browser layout ko Node assertion se prove nahi karenge.

## Contract se test cases nikalo

Cart total ka contract: prices aur quantities nonnegative safe integers hain, total bhi safe integer rahe, input mutate na ho. Money integer paise mein hai; tax/discount rounding is example ka part nahi. Zero quantity valid hai. Negative/fractional quantity invalid hai. API se string aaye toh boundary par explicit parse/validation karo; calculation quietly coerce na kare.

`cart.mjs` aur `cart.test.mjs` same folder mein banao. Node 22.12+ par `node --test cart.test.mjs` run karo. Neeche blocks do separate files hain.

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

Expected 400 ko implementation ki same loop se calculate mat karo: 125×2 + 50×3 khud derive karo. Warna production aur test dono same mistake repeat kar sakte hain. Test mein API shape ka contract bhi declare karo: yeh function iterable item objects expect karta hai, arbitrary malformed payload parser nahi hai.

## Async tests ka completion kaun own karta hai?

Promise assertion ko `await` ya return karo. Test callback finish ho gaya aur promise baad mein reject hui toh intended assertion reliable tarah execute nahi hui. `await assert.rejects(operation, ExpectedError)` rejection check karta hai; successful async result ke liye resolved value compare karo.

External network, wall clock aur random values repeatability tod sakte hain. Apne service ko `clock`, `load` ya random generator dependency do. Test controlled clock/fake loader supply kare. Fake se apni failure handling prove hoti hai; real HTTP serialization ya database constraint ke liye integration test chahiye. Har collaborator mock karne se sirf mock wiring test ho sakti hai.

Race reproduce karne ke liye A aur B requests ki promises manually resolve karo: B pehle, A baad mein. Final result B rehna chahiye. Real `sleep(1000)` se order hope karna slow aur flaky hai. Fake time ka use tab karo jab time actual contract ka part ho.

## Bug se regression tak workflow

Pehle smallest failing input save karo. Console logs se guess karne ke bajay breakpoint par actual value, call stack aur branch condition inspect karo. Expected aur actual pehli baar jahan diverge hote hain, wahi useful starting point hai. Failing behavior ka regression test banao, fix karo, phir nearby boundary cases run karo.

Git diff read karke check karo ki fix unrelated behavior nahi badal raha. Small commits ko ek behavior ke around rakho. CI mein same lockfile/runtime assumptions aur test command use karo. Coverage percentage batati hai lines execute hui; assertions meaningful hain ya missed requirement hai, woh percentage nahi batati.

## Practice — boundary se bug pakdo

Zero quantity, fractional price aur unsafe total ke cases add karo. `Number.MAX_SAFE_INTEGER` price aur quantity 2 reject honi chahiye. Phir aisa deliberately broken implementation socho jo sirf first item return kare: kaunsa existing test fail hoga? Agar koi nahi, suite mein blind spot hai.

## Depth walkthrough — andar kya ho raha hai?

### Ek useful test implementation badalne par bhi survive kare

Discount calculator ka contract valid price par expected payable amount hai. Test “helper exactly three times call hua” tabhi meaningful hai jab call count actual behavior/cost contract ho. Warna same result nikalne wala cleaner algorithm test ko unnecessary fail karega.

Boundary matrix banao: zero, smallest valid, usual value, maximum, invalid type, out-of-range. Expected result independently calculate karo; implementation ki same expression copy karke expected banana same bug ko dono sides par repeat kar sakta hai.

Async rejection test mein returned promise await/return karo. Assertion callback baad mein chalti rahe aur test pehle finish ho gaya toh green result misleading hoga. Fake timers delay advance karti hain; network promise settlement aur microtasks alag coordination maang sakte hain.

**Regression exercise:** Blank input galti se zero accept ho raha hai. Pehle blank-required test fail karao, phir validation fix, phir valid zero ka separate test green rakho. Isse fix legitimate zero ko reject karke bug hide nahi karega. Tests normal output ke saath contract boundaries defend karte hain.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Unit test aur integration test ka scope apne example se samjhao.

**Apply — khud try karo:** Loader fail hone par retry service maximum 2 attempts kare. Fake loader se calls aur final rejection dono check karo.

> **Hint — chhota ishara:** Attempt limit mein initial call include hai ya nahi pehle define karo.

**Answer guide — pehle khud karo, phir compare karo:** Contract total 2 attempts rakho. Always-rejecting loader ka counter 2 ho aur caller ko rejection mile. First failure/second success par result mile; first success par counter 1 ho. Test ko async completion await karni hogi.

**Exit check — aage badhne se pehle:** Bina real network ya sleep ke teen cases repeatably run kar sakte ho?

## Sources — aur padhne ke liye

[Node test runner](https://nodejs.org/api/test.html) aur [strict assertions](https://nodejs.org/api/assert.html) se API details check karo.
