# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Linked list operations

```js
function reverseList(head) {
  let previous = null;
  let current = head;
  while (current !== null) {
    const next = current.next; // save before overwriting
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}
```

```js
function cycleStart(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {          // identity comparison, not slow.value === fast.value
      let entry = head;
      while (entry !== slow) { entry = entry.next; slow = slow.next; }
      return entry;               // cycle ka pehla node
    }
  }
  return null;                    // fast null tak pahunch gaya: no cycle
}
```

```js
// Remove all nodes with a given value — bina dummy ke head deletion special case hai.
function removeAll(head, value) {
  const dummy = { next: head };        // dummy.next hi eventual naya head hai
  let prev = dummy;
  let current = head;
  while (current !== null) {
    if (current.value === value) prev.next = current.next; // prev advance nahi hota
    else prev = current;
    current = current.next;
  }
  return dummy.next;                   // head change hua ho toh bhi correct
}
```

```js
function mergeSorted(a, b) {
  const dummy = { next: null };
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;   // remaining suffix ko link karo, copy nahi
  return dummy.next;
}
```

## Stack applications

```js
// Har din ke liye: kitne din baad warmer temperature aaya? Nahi aaya toh 0.
function dailyTemperatures(temps) {
  const answer = new Array(temps.length).fill(0);
  const stack = [];   // INDICES of days whose answer is still unknown
                      // invariant: stack ke temperatures strictly decreasing hain
  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
      const day = stack.pop();       // is din ka answer aaj mila
      answer[day] = i - day;         // indices store kiye isliye distance nikli
    }
    stack.push(i);
  }
  return answer;                     // stack mein bache din: koi warmer day nahi
}
```

```js
class MinStack {
  #items = [];  // { value, min } pairs

  push(value) {
    const min = this.#items.length === 0
      ? value
      : Math.min(value, this.#items[this.#items.length - 1].min);
    this.#items.push({ value, min });
  }

  pop() { return this.#items.pop()?.value; }
  peek() { return this.#items[this.#items.length - 1]?.value; }
  getMin() { return this.#items[this.#items.length - 1]?.min; }
}
```

## Queue implementation

```js
class Queue {
  #items = [];
  #head = 0;

  enqueue(value) { this.#items.push(value); }
  get size() { return this.#items.length - this.#head; }

  dequeue() {
    if (this.size === 0) return undefined;
    const value = this.#items[this.#head];
    this.#items[this.#head++] = undefined; // release object reference
    if (this.#head >= 1024 && this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return value;
  }
}
```

```js
class QueueFromStacks {
  #input = [];
  #output = [];

  enqueue(value) { this.#input.push(value); }   // hamesha O(1)

  dequeue() {
    if (this.#output.length === 0) {
      // Bulk transfer: order reverse hota hai, isliye output ka top = oldest item.
      while (this.#input.length > 0) this.#output.push(this.#input.pop());
    }
    return this.#output.pop();                  // amortized O(1), worst case O(n)
  }
}
```

```js
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = [];   // INDICES, values strictly decreasing (front = current max)
  let head = 0;       // shift() avoid karne ke liye head index

  for (let i = 0; i < nums.length; i++) {
    // 1. Window se bahar nikal chuke index ko front se drop karo.
    if (deque.length - head > 0 && deque[head] <= i - k) head++;
    // 2. Peeche se saare chhote-ya-barabar elements drop karo:
    //    woh kabhi maximum nahi ban sakte, kyunki nums[i] naya aur bada hai.
    while (deque.length - head > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[head]]); // front hamesha window max
  }
  return result;
}
```
