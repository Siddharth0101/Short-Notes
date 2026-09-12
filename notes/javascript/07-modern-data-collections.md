---
id: js-modern-data-collections
title: Objects arrays and modern data transformations
track: javascript
order: 7
level: Intermediate
minutes: 26
summary: Destructuring, collections, array pipelines aur immutable updates ke practical rules seekho.
tags: arrays, objects, map, set, destructuring, immutability
---

## Mental model

Collection method choose karne se pehle desired output bolo. Har item transform karna hai to map, subset chahiye to filter, ek matching item chahiye to find, boolean answer chahiye to some/every, aur aggregate chahiye to reduce. Method chain ko fancy banane ke liye use mat karo; intermediate data ka meaning clear hona chahiye. Input mutate karne wala operation caller ki assumptions tod sakta hai.

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

`toSorted()` input array ko preserve karta hai. Older runtime mein `[...orders].sort(...)` equivalent shallow-copy pattern hai. Numeric comparator important hai: default sort string ordering karta hai. `sort`, `reverse` aur `splice` mutate karte hain; `toSorted`, `toReversed` aur `toSpliced` new array dete hain. New array ke nested objects phir bhi original references ho sakte hain.

## Choose the right shape

Object fixed named fields ke liye straightforward hai. Map arbitrary keys aur dynamic dictionary operations ke liye useful hai; key object ho to identity matter karti hai. Set duplicates ko identity/value equality rules se remove karta hai, deep object contents compare karke nahi. `new Set([{x:1}, {x:1}])` mein two entries hain. Data ko id se deduplicate karne ke liye Map ya explicit key extraction use karo.

Destructuring selected fields read karta hai. Rest remaining elements collect karta hai; spread elements expand karta hai. Object spread shallow copy hai. Nested update mein changed path ke har object ko copy karo. `user?.address?.city ?? "Unknown"` missing paths ko handle karta hai, lekin malformed data validation ka substitute nahi hai. Logical assignment `??=` sirf missing value initialize karta hai; `||=` zero/false ko bhi replace karega.

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

`??=` yahan missing key ko empty array se initialize karta hai bina existing array ko overwrite kiye — agar `||=` use karte to already-empty array (falsy nahi, lekin agar value kabhi `0`/`""` hoti) ke saath surprising results aa sakte the. `Object.groupBy` (recent addition) same intent builtin method se express karta hai, lekin runtime support pehle verify karo.

WeakMap tab useful hai jab key object ho aur garbage collection block nahi karni:

```js
const privateData = new WeakMap();
class Session {
  constructor(token) { privateData.set(this, { token }); }
  get token() { return privateData.get(this).token; }
}
```

WeakMap key sirf object ho sakti hai, aur entry ko garbage collector reclaim kar sakta hai jab instance kahin aur reference na ho. Regular `Map` yeh guarantee nahi deta — entry hamesha reachable rehti hai jab tak explicitly `delete` na ho, isliye long-lived cache mein memory leak ka risk hota hai.

## Gotchas

- Empty array par initial accumulator ke bina reduce throw karta hai.
- `forEach` return values collect nahi karta aur async callbacks ko await nahi karta.
- `find` missing result par undefined deta hai; direct property read crash kar sakta hai.
- Long chains multiple intermediate arrays allocate kar sakti hain; performance concern ko profile karo.

## Common mistakes

- **Wrong assumption:** `{ ...user, address: { ...user.address, city: "Pune" } }` ek full deep clone hai. **Why it breaks:** Sirf listed levels copy hote hain; agar `address` ke andar aur nested object hai (jaise geo coordinates), woh shared reference reh jaata hai aur mutate karne par original bhi change hoga. **Fix:** Har changed path ko explicitly spread karo, ya jab poora object plain serializable data ho to `structuredClone(user)` use karo.
- **Wrong assumption:** Set duplicate objects ko apne aap remove kar dega agar unke fields same hain. **Why it breaks:** Set identity-based hai; `{id:1}` aur dusra `{id:1}` alag object references hain, dono store ho jaayenge. **Fix:** Id ke hisaab se dedupe karne ke liye `Map<id, item>` ya `filter` with a seen-ids `Set` of primitive ids use karo.
- **Wrong assumption:** `Object.groupBy`, `toSorted` jaise naye methods har jagah available hain. **Why it breaks:** Yeh recent additions hain; older browser ya Node version mein "is not a function" error dega. **Fix:** Target environment ki runtime version check karo, ya reduce/spread-based equivalent fallback rakho.

Real app mein yeh pattern order-history dashboard ka customer-wise grouping, admin table sorting/filtering aur user-session store (WeakMap) jaisi jagah directly use hota hai — inhi mistakes se stale shared state ya silent memory growth production mein aata hai.

## Practice

Orders ko customer-wise group karo, totals calculate karo aur top two customers return karo. Empty input, repeated ids aur equal totals ke cases likho. Sorting mein deterministic tie-breaker add karo.

## Interview questions

**Q. Spread deep clone hai?** Nahi; first level copy hota hai. Suitable structured data ke liye structuredClone useful ho sakta hai, lekin functions jaise values clone nahi hote.

**Q. Map object se kab better hai?** Jab dynamic keys, non-string key identity, direct size aur entry iteration ki need ho. API JSON payload ke liye plain object usually simpler hai.

## Sources

[MDN Array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) mutation aur methods ka reference hai. [MDN keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections) Map aur Set explain karta hai.
