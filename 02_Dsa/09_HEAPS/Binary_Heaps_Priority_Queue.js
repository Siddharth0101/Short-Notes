'use strict';

/**
 * ========================================================================
 * BINARY HEAPS AND PRIORITY QUEUE [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Heap ek tree-like structure hai jo usually array me store hota hai.
 * - Binary heap complete binary tree hota hai.
 * - Complete means left to right fill hota hai.
 *
 * TYPES:
 * - Max heap: parent >= children
 * - Min heap: parent <= children
 */


/**
 * ========================================================================
 * 1. HEAP ARRAY INDEX MATH
 * ========================================================================
 * For index i:
 * - Left child: 2i + 1
 * - Right child: 2i + 2
 * - Parent: Math.floor((i - 1) / 2)
 *
 * EXAMPLE:
 * Array: [100, 19, 36, 17, 12, 25, 5]
 * Index:   0    1   2   3   4   5  6
 * - Node at index 0 (100): left = index 1 (19), right = index 2 (36)
 * - Node at index 1 (19):  parent = index 0 (100)
 * - Node at index 2 (36):  left = index 5 (25), right = index 6 (5)
 */


/**
 * ========================================================================
 * 2. MAX BINARY HEAP
 * ========================================================================
 * BIG O:
 * - Insert: O(log n)
 * - Extract max: O(log n)
 * - Search: O(n)
 *
 * EXAMPLE - insert:
 * Insert 41 -> 39 -> 33 -> 18 -> 27 -> 12
 * Heap array after all inserts: [41, 39, 33, 18, 27, 12]
 *
 * Insert 55 -> bubbles up past 12, 33, 41
 * Heap array: [55, 39, 41, 18, 27, 12, 33]
 *
 * EXAMPLE - extractMax:
 * Extract from [55, 39, 41, 18, 27, 12, 33]
 * Returns 55, then sinks 33 down
 * Result: [41, 39, 33, 18, 27, 12]
 */

class MaxBinaryHeap {
    constructor() {
        this.values = [];
    }

    insert(value) {
        this.values.push(value);
        this.bubbleUp();
        return this;
    }

    bubbleUp() {
        let index = this.values.length - 1;
        const element = this.values[index];

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.values[parentIndex];

            if (element <= parent) break;

            this.values[parentIndex] = element;
            this.values[index] = parent;
            index = parentIndex;
        }
    }

    extractMax() {
        const max = this.values[0];
        const end = this.values.pop();

        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }

        return max;
    }

    sinkDown() {
        let index = 0;
        const length = this.values.length;
        const element = this.values[0];

        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let leftChild;
            let rightChild;
            let swapIndex = null;

            if (leftChildIndex < length) {
                leftChild = this.values[leftChildIndex];
                if (leftChild > element) swapIndex = leftChildIndex;
            }

            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                if (
                    (swapIndex === null && rightChild > element) ||
                    (swapIndex !== null && rightChild > leftChild)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;

            this.values[index] = this.values[swapIndex];
            this.values[swapIndex] = element;
            index = swapIndex;
        }
    }
}

// Sample usage: MaxBinaryHeap
const maxHeap = new MaxBinaryHeap();

// Sample Input:  insert 41, 39, 33, 18, 27, 12
// Expected: max is always at index 0
maxHeap.insert(41).insert(39).insert(33).insert(18).insert(27).insert(12);
console.log(maxHeap.values); // [41, 39, 33, 18, 27, 12]
console.log(maxHeap.values[0]); // 41  (max at root)

// Sample Input:  insert 55  (should bubble up to become new root)
// Expected: 55 becomes new root
maxHeap.insert(55);
console.log(maxHeap.values[0]); // 55  (55 > 41, bubbles to top)
console.log(maxHeap.values);    // [55, 39, 41, 18, 27, 12, 33]

// Sample Input:  extractMax()
// Expected Output: 55 (current max), heap restructures
console.log(maxHeap.extractMax()); // 55
console.log(maxHeap.values[0]);    // 41  (new max after 55 removed)

// Sample Input:  extractMax() again
// Expected Output: 41
console.log(maxHeap.extractMax()); // 41

// Edge case - single element:
const singleHeap = new MaxBinaryHeap();
singleHeap.insert(10);
// Sample Input:  extractMax() on single element heap
// Expected Output: 10
console.log(singleHeap.extractMax()); // 10
console.log(singleHeap.values);       // []


/**
 * ========================================================================
 * 3. PRIORITY QUEUE
 * ========================================================================
 * NOTES:
 * - Queue jisme lower/higher priority item pehle nikalta hai.
 * - Hospital ER, scheduler, Dijkstra algorithm me useful.
 * - Here: lower priority number = more important.
 *
 * EXAMPLE:
 * Enqueue: ('flu shot', 3) -> ('critical patient', 1) -> ('regular checkup', 5) -> ('surgery', 2)
 * Dequeue order (lowest priority number first):
 *   1st: 'critical patient' (priority 1)
 *   2nd: 'surgery' (priority 2)
 *   3rd: 'flu shot' (priority 3)
 *   4th: 'regular checkup' (priority 5)
 */

class PriorityNode {
    constructor(value, priority) {
        this.value = value;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(value, priority) {
        const newNode = new PriorityNode(value, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }

    bubbleUp() {
        let index = this.values.length - 1;
        const element = this.values[index];

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.values[parentIndex];

            if (element.priority >= parent.priority) break;

            this.values[parentIndex] = element;
            this.values[index] = parent;
            index = parentIndex;
        }
    }

    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();

        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }

        return min;
    }

    sinkDown() {
        let index = 0;
        const length = this.values.length;
        const element = this.values[0];

        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let leftChild;
            let rightChild;
            let swapIndex = null;

            if (leftChildIndex < length) {
                leftChild = this.values[leftChildIndex];
                if (leftChild.priority < element.priority) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                if (
                    (swapIndex === null && rightChild.priority < element.priority) ||
                    (swapIndex !== null && rightChild.priority < leftChild.priority)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;

            this.values[index] = this.values[swapIndex];
            this.values[swapIndex] = element;
            index = swapIndex;
        }
    }
}

// Sample usage: PriorityQueue (min-heap by priority number)
const pq = new PriorityQueue();

// Sample Input:  enqueue hospital tasks with priorities
pq.enqueue('flu shot', 3);
pq.enqueue('critical patient', 1);
pq.enqueue('regular checkup', 5);
pq.enqueue('surgery', 2);

// Sample Input:  dequeue()
// Expected Output: 'critical patient' (priority 1 = most urgent)
console.log(pq.dequeue().value); // 'critical patient'

// Sample Input:  dequeue()
// Expected Output: 'surgery' (priority 2)
console.log(pq.dequeue().value); // 'surgery'

// Sample Input:  dequeue()
// Expected Output: 'flu shot' (priority 3)
console.log(pq.dequeue().value); // 'flu shot'

// Sample Input:  dequeue()
// Expected Output: 'regular checkup' (priority 5)
console.log(pq.dequeue().value); // 'regular checkup'


/**
 * ========================================================================
 * 4. HEAP USE CASES
 * ========================================================================
 *
 * - Priority queue
 * - Dijkstra shortest path
 * - Heap sort
 * - Find top K largest/smallest
 * - Median from data stream with two heaps
 * - Scheduling problems
 */


/**
 * ========================================================================
 * 5. HEAP VS BST
 * ========================================================================
 *
 * Heap:
 * - Parent-child relation only.
 * - Fast min/max.
 * - Not good for full sorted search.
 *
 * BST:
 * - Left smaller, right larger.
 * - Good for search if balanced.
 * - Can return sorted order via inorder traversal.
 */
