/**
 * ## Quick revision
 *
 * - Heap — complete binary tree with parent-child priority rule.
 * - Min-heap — smallest root; max-heap — largest root.
 * - Peek — O(1); insert/extract — O(log n).
 * - Heapify — bottom-up heap build O(n).
 * - Array layout — zero-based children `2i + 1`, `2i + 2`; parent `floor((i - 1) / 2)`.
 * - Top-k largest — size-k min-heap; O(n log k).
 * - Priority queue — priority ke hisaab se next item; full sorting guaranteed nahi.
 * - Stale entry — priority update ka old queue entry pop par skip karo.
 * - Tie-breaker — equal priorities ka deterministic order define karo.
 * - K-way merge — har sorted source ka next candidate heap mein; O(total items × log k).
 * - Streaming median — lower half max-heap, upper half min-heap; sizes/order balanced rakho.
 * - Arbitrary delete — item locate karne ke liye index map ya lazy deletion chahiye.
 */

'use strict';


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
