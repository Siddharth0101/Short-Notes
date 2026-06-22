'use strict';

/**
 * ========================================================================
 * LINKED LISTS - SINGLY AND DOUBLY
 * ========================================================================
 * NOTES:
 * - Linked list nodes ka chain hota hai.
 * - Har node value store karta hai plus next node ka reference.
 * - Array me indexes hote hain; linked list me direct index access nahi hota.
 *
 * WHEN USEFUL?
 * - Frequent insert/delete at beginning/end.
 * - Jab re-indexing avoid karni ho.
 */


/**
 * ========================================================================
 * 1. SINGLY LINKED LIST
 * ========================================================================
 * NODE:
 * - value
 * - next
 *
 * BIG O:
 * - push: O(1)
 * - pop: O(n)
 * - shift: O(1)
 * - unshift: O(1)
 * - get: O(n)
 * - set: O(n)
 * - insert: O(n)
 * - remove: O(n)
 *
 * EXAMPLE:
 * Operations: push(10) -> push(20) -> push(30) -> pop() -> shift() -> unshift(5)
 * After push 10,20,30:  10 -> 20 -> 30  (length=3)
 * After pop():          10 -> 20         (length=2, returns node with value 30)
 * After shift():        20               (length=1, returns node with value 10)
 * After unshift(5):     5 -> 20          (length=2)
 */

class SLLNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    push(value) {
        const newNode = new SLLNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }

        this.length++;
        return this;
    }

    pop() {
        if (!this.head) return undefined;

        let current = this.head;
        let newTail = current;

        while (current.next) {
            newTail = current;
            current = current.next;
        }

        this.tail = newTail;
        this.tail.next = null;
        this.length--;

        if (this.length === 0) {
            this.head = null;
            this.tail = null;
        }

        return current;
    }

    shift() {
        if (!this.head) return undefined;

        const oldHead = this.head;
        this.head = oldHead.next;
        this.length--;

        if (this.length === 0) this.tail = null;

        return oldHead;
    }

    unshift(value) {
        const newNode = new SLLNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }

        this.length++;
        return this;
    }

    get(index) {
        if (index < 0 || index >= this.length) return null;

        let counter = 0;
        let current = this.head;

        while (counter !== index) {
            current = current.next;
            counter++;
        }

        return current;
    }

    set(index, value) {
        const node = this.get(index);
        if (!node) return false;

        node.value = value;
        return true;
    }

    insert(index, value) {
        if (index < 0 || index > this.length) return false;
        if (index === 0) return Boolean(this.unshift(value));
        if (index === this.length) return Boolean(this.push(value));

        const newNode = new SLLNode(value);
        const prev = this.get(index - 1);

        newNode.next = prev.next;
        prev.next = newNode;
        this.length++;

        return true;
    }

    remove(index) {
        if (index < 0 || index >= this.length) return undefined;
        if (index === 0) return this.shift();
        if (index === this.length - 1) return this.pop();

        const prev = this.get(index - 1);
        const removed = prev.next;

        prev.next = removed.next;
        this.length--;

        return removed;
    }

    reverse() {
        let node = this.head;
        this.head = this.tail;
        this.tail = node;

        let prev = null;
        let next = null;

        for (let i = 0; i < this.length; i++) {
            next = node.next;
            node.next = prev;
            prev = node;
            node = next;
        }

        return this;
    }
}

// Sample usage: SinglyLinkedList operations
const sll = new SinglyLinkedList();

// Sample Input:  push(10), push(20), push(30)
// Expected: list = 10 -> 20 -> 30, length = 3
sll.push(10).push(20).push(30);
console.log(sll.length);       // 3
console.log(sll.head.value);   // 10
console.log(sll.tail.value);   // 30

// Sample Input:  get(1)
// Expected Output: node with value 20
console.log(sll.get(1).value); // 20

// Sample Input:  get(-1)
// Expected Output: null (invalid index)
console.log(sll.get(-1));      // null

// Sample Input:  set(1, 99)
// Expected Output: true, list = 10 -> 99 -> 30
console.log(sll.set(1, 99));   // true
console.log(sll.get(1).value); // 99

// Sample Input:  insert(1, 50)
// Expected Output: true, list = 10 -> 50 -> 99 -> 30, length = 4
console.log(sll.insert(1, 50)); // true
console.log(sll.length);        // 4
console.log(sll.get(1).value);  // 50

// Sample Input:  remove(1)
// Expected Output: removed node value = 50, length = 3
console.log(sll.remove(1).value); // 50
console.log(sll.length);          // 3

// Sample Input:  pop()
// Expected Output: removed node value = 30
console.log(sll.pop().value);  // 30
console.log(sll.length);       // 2

// Sample Input:  shift()
// Expected Output: removed node value = 10
console.log(sll.shift().value); // 10
console.log(sll.length);        // 1

// Sample Input:  reverse on [1, 2, 3, 4, 5]
const sll2 = new SinglyLinkedList();
[1, 2, 3, 4, 5].forEach(v => sll2.push(v));
sll2.reverse();
// Expected: head = 5, tail = 1
console.log(sll2.head.value); // 5
console.log(sll2.tail.value); // 1


/**
 * ========================================================================
 * 2. DOUBLY LINKED LIST
 * ========================================================================
 * NODE:
 * - value
 * - next
 * - prev
 *
 * BIG IDEA:
 * - Prev pointer ke wajah se backward movement possible hai.
 * - More memory lagti hai, but pop and reverse direction operations better hain.
 *
 * BIG O:
 * - push/pop: O(1)
 * - shift/unshift: O(1)
 * - get: O(n), but half traversal optimization possible
 * - insert/remove: O(n)
 *
 * EXAMPLE:
 * Operations: push(1) -> push(2) -> push(3) -> pop()
 * After push 1,2,3: 1 <-> 2 <-> 3  (length=3)
 * After pop():      1 <-> 2          (length=2, returns node with value 3)
 */

class DLLNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    push(value) {
        const newNode = new DLLNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }

        this.length++;
        return this;
    }

    pop() {
        if (!this.tail) return undefined;

        const popped = this.tail;

        if (this.length === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = popped.prev;
            this.tail.next = null;
            popped.prev = null;
        }

        this.length--;
        return popped;
    }

    shift() {
        if (!this.head) return undefined;

        const oldHead = this.head;

        if (this.length === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = oldHead.next;
            this.head.prev = null;
            oldHead.next = null;
        }

        this.length--;
        return oldHead;
    }

    unshift(value) {
        const newNode = new DLLNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }

        this.length++;
        return this;
    }

    get(index) {
        if (index < 0 || index >= this.length) return null;

        let current;

        if (index <= this.length / 2) {
            current = this.head;
            for (let i = 0; i < index; i++) current = current.next;
        } else {
            current = this.tail;
            for (let i = this.length - 1; i > index; i--) current = current.prev;
        }

        return current;
    }
}

// Sample usage: DoublyLinkedList operations
const dll = new DoublyLinkedList();

// Sample Input:  push(10), push(20), push(30)
// Expected: head=10, tail=30, length=3
dll.push(10).push(20).push(30);
console.log(dll.length);       // 3
console.log(dll.head.value);   // 10
console.log(dll.tail.value);   // 30

// Sample Input:  get(2)  (from tail side, since 2 >= 3/2)
// Expected Output: node with value 30
console.log(dll.get(2).value); // 30

// Sample Input:  pop()
// Expected Output: node with value 30, length=2
console.log(dll.pop().value);  // 30
console.log(dll.length);       // 2

// Sample Input:  shift()
// Expected Output: node with value 10, length=1
console.log(dll.shift().value); // 10
console.log(dll.length);        // 1


/**
 * ========================================================================
 * 3. LINKED LIST INTERVIEW PATTERNS
 * ========================================================================
 *
 * Fast and slow pointers:
 * - Middle of linked list
 * - Cycle detection
 *
 * Reverse pointers:
 * - Reverse linked list
 * - Reverse between positions
 *
 * Dummy node:
 * - Simplifies remove/merge problems.
 *
 * EXAMPLE - hasCycle:
 * Input:  1 -> 2 -> 3 -> 4 -> (back to 2) [has cycle]
 * Output: true
 *
 * Input:  1 -> 2 -> 3 -> null  [no cycle]
 * Output: false
 *
 * EXAMPLE - findMiddle:
 * Input:  1 -> 2 -> 3 -> 4 -> 5
 * Output: node with value 3  (middle node)
 *
 * Input:  1 -> 2 -> 3 -> 4
 * Output: node with value 3  (second middle for even length)
 */

function hasCycle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) return true;
    }

    return false;
}

function findMiddle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

// hasCycle - no cycle test
const nodeA = new SLLNode(1);
const nodeB = new SLLNode(2);
const nodeC = new SLLNode(3);
nodeA.next = nodeB;
nodeB.next = nodeC;
// Sample Input:  1 -> 2 -> 3 -> null
// Expected Output: false
console.log(hasCycle(nodeA)); // false

// hasCycle - with cycle
nodeC.next = nodeB; // creates cycle: 3 -> 2 -> 3 -> ...
// Sample Input:  1 -> 2 -> 3 -> (back to 2)
// Expected Output: true
console.log(hasCycle(nodeA)); // true

// findMiddle test
nodeC.next = null; // remove cycle first
const listForMiddle = new SinglyLinkedList();
[1, 2, 3, 4, 5].forEach(v => listForMiddle.push(v));
// Sample Input:  1 -> 2 -> 3 -> 4 -> 5
// Expected Output: node with value 3
console.log(findMiddle(listForMiddle.head).value); // 3

const listForMiddle2 = new SinglyLinkedList();
[1, 2, 3, 4].forEach(v => listForMiddle2.push(v));
// Sample Input:  1 -> 2 -> 3 -> 4
// Expected Output: node with value 3  (second middle)
console.log(findMiddle(listForMiddle2.head).value); // 3
