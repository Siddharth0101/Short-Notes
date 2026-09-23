# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## JavaScript Map and Set

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}
```

```js
function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = [...word].sort().join('');   // canonical signature
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
```

```js
// Count vector for a-z. Delimiter ke bina "1,11" aur "11,1" collide kar sakte hain.
function countKey(word) {
  const counts = new Array(26).fill(0);
  for (const ch of word) counts[ch.charCodeAt(0) - 97]++;
  return counts.join('#');    // '#' separator — "1#11" != "11#1"
}
```

## A hash map plus a list: the LRU cache

```js
class LRUCache {
  #map = new Map();          // JS Map insertion order preserve karta hai
  #capacity;

  constructor(capacity) { this.#capacity = capacity; }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);        // purani position hatao
    this.#map.set(key, value);    // end par dobara daalo = most recently used
    return value;
  }

  put(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#capacity) {
      const oldest = this.#map.keys().next().value; // first inserted = LRU
      this.#map.delete(oldest);
    }
  }
}
```
