'use strict';

/**
 * ========================================================================
 * BINARY HEAPS AND PRIORITY QUEUE
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
 */


/**
 * ========================================================================
 * 2. MAX BINARY HEAP
 * ========================================================================
 * BIG O:
 * - Insert: O(log n)
 * - Extract max: O(log n)
 * - Search: O(n)
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


/**
 * ========================================================================
 * 3. PRIORITY QUEUE
 * ========================================================================
 * NOTES:
 * - Queue jisme lower/higher priority item pehle nikalta hai.
 * - Hospital ER, scheduler, Dijkstra algorithm me useful.
 * - Here: lower priority number = more important.
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
