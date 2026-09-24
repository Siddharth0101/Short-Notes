/**
 * ## Quick revision
 *
 * - Linked list — nodes references se linked; random access O(n).
 * - Singly list — next pointer; doubly list — next + previous.
 * - Insert/delete — node/predecessor milne par O(1); dhoondhne ka cost alag.
 * - Stack — LIFO; push/pop top se.
 * - Queue — FIFO; enqueue end, dequeue front.
 * - JS queue — head index/ring buffer use karo; repeated `shift()` shifting kar sakta hai.
 * - Reverse list — previous/current/next pointers se links palto.
 * - Cycle detection — slow/fast pointers; meet karein toh cycle.
 * - Edge cases — empty, one node, head/tail update.
 * - Parentheses — opening stack mein; closing ko matching top chahiye.
 * - Monotonic deque — sliding-window max/min ke outdated aur dominated indices hatao.
 * - Sentinel node — dummy head se insert/delete ke special cases kam hote hain.
 * - Deque — dono ends par add/remove; BFS aur sliding-window patterns mein useful.
 * - Fast/slow gap — kth-from-end ke liye fixed pointer gap; invalid k define karo.
 */

'use strict';


class StackNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    push(value) {
        const newNode = new StackNode(value);

        if (!this.first) {
            this.first = newNode;
            this.last = newNode;
        } else {
            newNode.next = this.first;
            this.first = newNode;
        }

        return ++this.size;
    }

    pop() {
        if (!this.first) return null;

        const temp = this.first;

        if (this.first === this.last) {
            this.last = null;
        }

        this.first = this.first.next;
        this.size--;

        return temp.value;
    }
}

// Sample Input:  push(10), push(20), push(30)
// Expected: size = 3, top (first) = 30
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.size);        // 3
console.log(stack.first.value); // 30  (last pushed = top)

// Sample Input:  pop()
// Expected Output: 30  (LIFO - last in, first out)
console.log(stack.pop()); // 30
console.log(stack.pop()); // 20
console.log(stack.pop()); // 10
console.log(stack.pop()); // null  (empty stack)


class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    enqueue(value) {
        const newNode = new QueueNode(value);

        if (!this.first) {
            this.first = newNode;
            this.last = newNode;
        } else {
            this.last.next = newNode;
            this.last = newNode;
        }

        return ++this.size;
    }

    dequeue() {
        if (!this.first) return null;

        const temp = this.first;

        if (this.first === this.last) {
            this.last = null;
        }

        this.first = this.first.next;
        this.size--;

        return temp.value;
    }
}

// Sample Input:  enqueue('A'), enqueue('B'), enqueue('C')
// Expected: size = 3, front (first) = 'A'
const queue = new Queue();
queue.enqueue('A');
queue.enqueue('B');
queue.enqueue('C');
console.log(queue.size);        // 3
console.log(queue.first.value); // 'A'  (first enqueued = front)

// Sample Input:  dequeue()
// Expected Output: 'A'  (FIFO - first in, first out)
console.log(queue.dequeue()); // 'A'
console.log(queue.dequeue()); // 'B'
console.log(queue.dequeue()); // 'C'
console.log(queue.dequeue()); // null  (empty queue)


class ArrayQueue {
    constructor() {
        this.items = [];
        this.head = 0;
    }

    enqueue(value) {
        this.items.push(value);
    }

    dequeue() {
        if (this.head >= this.items.length) return undefined;

        const value = this.items[this.head];
        this.head++;
        return value;
    }
}

// Sample Input:  enqueue(1), enqueue(2), enqueue(3)
// Expected dequeue order: 1, 2, 3
const aq = new ArrayQueue();
aq.enqueue(1);
aq.enqueue(2);
aq.enqueue(3);
console.log(aq.dequeue()); // 1
console.log(aq.dequeue()); // 2
console.log(aq.dequeue()); // 3
console.log(aq.dequeue()); // undefined  (empty)


function isValidParentheses(str) {
    const stack = [];
    const pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (const char of str) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else if (char in pairs) {
            if (stack.pop() !== pairs[char]) return false;
        }
    }

    return stack.length === 0;
}

// Sample Input:  '({[]})'
// Expected Output: true
console.log(isValidParentheses('({[]})')); // true

// Sample Input:  '([)]'
// Expected Output: false
console.log(isValidParentheses('([)]')); // false

// Sample Input:  '{[]}'
// Expected Output: true
console.log(isValidParentheses('{[]}')); // true

// Sample Input:  '{'
// Expected Output: false  (unclosed)
console.log(isValidParentheses('{')); // false

// Sample Input:  ''
// Expected Output: true  (empty string is valid)
console.log(isValidParentheses('')); // true


function nextGreaterElements(nums) {
    const result = new Array(nums.length).fill(-1);
    const stack = [];

    for (let i = 0; i < nums.length; i++) {
        while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[i];
        }

        stack.push(i);
    }

    return result;
}

// Sample Input:  [2, 1, 2, 4, 3]
// Expected Output: [4, 2, 4, -1, -1]
console.log(nextGreaterElements([2, 1, 2, 4, 3])); // [4, 2, 4, -1, -1]

// Sample Input:  [1, 3, 2, 4]
// Expected Output: [3, 4, 4, -1]
console.log(nextGreaterElements([1, 3, 2, 4])); // [3, 4, 4, -1]

// Sample Input:  [5, 4, 3, 2, 1]  (all decreasing, no next greater)
// Expected Output: [-1, -1, -1, -1, -1]
console.log(nextGreaterElements([5, 4, 3, 2, 1])); // [-1, -1, -1, -1, -1]
