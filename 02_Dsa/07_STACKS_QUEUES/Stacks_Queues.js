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


/**
 * ========================================================================
 * 4. VALID PARENTHESES - STACK PATTERN
 * ========================================================================
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


/**
 * ========================================================================
 * 5. MONOTONIC STACK / QUEUE - ADVANCED PATTERN
 * ========================================================================
 * NOTES:
 * - Monotonic stack increasing/decreasing order maintain karta hai.
 * - Next greater element, stock span, daily temperatures me useful.
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
