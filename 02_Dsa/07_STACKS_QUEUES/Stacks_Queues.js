'use strict';

/**
 * ========================================================================
 * STACKS AND QUEUES
 * ========================================================================
 * NOTES:
 * - Stack and queue abstract data types hain.
 * - Inka rule important hai, implementation array ya linked list se ho sakti hai.
 */


/**
 * ========================================================================
 * 1. STACK
 * ========================================================================
 * RULE:
 * - LIFO = Last In, First Out
 *
 * EXAMPLES:
 * - Browser history back button
 * - Undo/redo
 * - Function call stack
 * - DFS iterative
 * - Valid parentheses
 *
 * BIG O:
 * - push: O(1)
 * - pop: O(1)
 *
 * EXAMPLE:
 * Operations: push(10) -> push(20) -> push(30) -> pop() -> pop()
 * After push 10,20,30: top = 30  (size = 3)
 * After pop():         returns 30, top = 20  (size = 2)
 * After pop():         returns 20, top = 10  (size = 1)
 */

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


/**
 * ========================================================================
 * 2. QUEUE
 * ========================================================================
 * RULE:
 * - FIFO = First In, First Out
 *
 * EXAMPLES:
 * - Printer queue
 * - Task scheduling
 * - BFS
 * - Event queues
 *
 * BIG O:
 * - enqueue: O(1)
 * - dequeue: O(1)
 *
 * EXAMPLE:
 * Operations: enqueue('A') -> enqueue('B') -> enqueue('C') -> dequeue() -> dequeue()
 * After enqueue A,B,C: front='A', back='C'  (size = 3)
 * After dequeue():     returns 'A', front='B'  (size = 2)
 * After dequeue():     returns 'B', front='C'  (size = 1)
 */

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


/**
 * ========================================================================
 * 3. ARRAY IMPLEMENTATION TRADEOFF
 * ========================================================================
 * STACK WITH ARRAY:
 * - push/pop from end -> O(1)
 *
 * QUEUE WITH ARRAY:
 * - push + shift -> shift is O(n), not ideal for large queues.
 * - Better: linked list queue or head index technique.
 *
 * EXAMPLE - ArrayQueue:
 * Input:  enqueue(1), enqueue(2), enqueue(3) -> dequeue() twice
 * Output: dequeue returns 1, then 2
 */

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


/**
 * ========================================================================
 * 4. VALID PARENTHESES - STACK PATTERN
 * ========================================================================
 *
 * EXAMPLE:
 * Input:  '({[]})'
 * Output: true  (all brackets properly matched and closed)
 *
 * Input:  '([)]'
 * Output: false  (wrong order of closing)
 *
 * Input:  '{'
 * Output: false  (unclosed bracket)
 */

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


/**
 * ========================================================================
 * 5. MONOTONIC STACK / QUEUE - ADVANCED PATTERN
 * ========================================================================
 * NOTES:
 * - Monotonic stack increasing/decreasing order maintain karta hai.
 * - Next greater element, stock span, daily temperatures me useful.
 *
 * EXAMPLE - nextGreaterElements:
 * Input:  [2, 1, 2, 4, 3]
 * Output: [4, 2, 4, -1, -1]
 *   - 2 ka next greater = 4
 *   - 1 ka next greater = 2
 *   - 2 (second) ka next greater = 4
 *   - 4 ka next greater = -1 (none)
 *   - 3 ka next greater = -1 (none)
 */

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
