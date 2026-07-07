'use strict';

/**
 * ========================================================================
 * TREES, BINARY SEARCH TREES, TRAVERSALS, TRIES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Tree hierarchical data structure hai.
 * - Root top node hota hai.
 * - Child, parent, sibling, leaf, edge, path, depth, height common terms hain.
 *
 * REAL EXAMPLES:
 * - DOM tree
 * - File system
 * - Organization chart
 * - Comment threads
 */


/**
 * ========================================================================
 * 1. TREE TERMS
 * ========================================================================
 *
 * Root: tree ka top node.
 * Parent: jis node ke children hain.
 * Child: parent se connected lower node.
 * Leaf: jiske children nahi.
 * Edge: parent-child connection.
 * Depth: root se node tak distance.
 * Height: node se deepest leaf tak distance.
 * Subtree: tree ka smaller part.
 */


/**
 * ========================================================================
 * 2. BINARY SEARCH TREE
 * ========================================================================
 * RULE:
 * - Har node ke left me smaller values.
 * - Har node ke right me larger values.
 *
 * BIG O:
 * - Insert/search average: O(log n)
 * - Insert/search worst: O(n) if tree becomes a line.
 *
 * EXAMPLE - insert + find:
 * Input:  insert(10), insert(6), insert(15), insert(3), insert(8)
 * Tree:
 *          10
 *         /  \
 *        6    15
 *       / \
 *      3   8
 *
 * find(6)  -> true
 * find(99) -> false
 *
 * EXAMPLE - traversals:
 * BFS order:       [10, 6, 15, 3, 8]
 * DFS PreOrder:    [10, 6, 3, 8, 15]
 * DFS InOrder:     [3, 6, 8, 10, 15]  (sorted!)
 * DFS PostOrder:   [3, 8, 6, 15, 10]
 */

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new BSTNode(value);

        if (!this.root) {
            this.root = newNode;
            return this;
        }

        let current = this.root;

        while (true) {
            if (value === current.value) return undefined;

            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }

                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }

                current = current.right;
            }
        }
    }

    find(value) {
        if (!this.root) return false;

        let current = this.root;

        while (current) {
            if (value === current.value) return true;
            if (value < current.value) current = current.left;
            else current = current.right;
        }

        return false;
    }

    bfs() {
        const data = [];
        const queue = [];

        if (this.root) queue.push(this.root);

        while (queue.length) {
            const node = queue.shift();
            data.push(node.value);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        return data;
    }

    dfsPreOrder() {
        const data = [];

        function traverse(node) {
            data.push(node.value);
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
        }

        if (this.root) traverse(this.root);
        return data;
    }

    dfsInOrder() {
        const data = [];

        function traverse(node) {
            if (node.left) traverse(node.left);
            data.push(node.value);
            if (node.right) traverse(node.right);
        }

        if (this.root) traverse(this.root);
        return data;
    }

    dfsPostOrder() {
        const data = [];

        function traverse(node) {
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
            data.push(node.value);
        }

        if (this.root) traverse(this.root);
        return data;
    }
}

// Sample usage: Build BST and test operations
const bst = new BinarySearchTree();

// Sample Input:  insert 10, 6, 15, 3, 8, 20
// Expected Tree:
//         10
//        /  \
//       6    15
//      / \     \
//     3   8    20
bst.insert(10).insert(6).insert(15).insert(3).insert(8).insert(20);

// Sample Input:  find(6)
// Expected Output: true
console.log(bst.find(6));  // true

// Sample Input:  find(99)
// Expected Output: false
console.log(bst.find(99)); // false

// Sample Input:  find(20)
// Expected Output: true
console.log(bst.find(20)); // true

// Sample Input:  bfs()
// Expected Output: [10, 6, 15, 3, 8, 20]  (level by level)
console.log(bst.bfs()); // [10, 6, 15, 3, 8, 20]

// Sample Input:  dfsPreOrder()
// Expected Output: [10, 6, 3, 8, 15, 20]  (node, left, right)
console.log(bst.dfsPreOrder()); // [10, 6, 3, 8, 15, 20]

// Sample Input:  dfsInOrder()
// Expected Output: [3, 6, 8, 10, 15, 20]  (sorted - left, node, right)
console.log(bst.dfsInOrder()); // [3, 6, 8, 10, 15, 20]

// Sample Input:  dfsPostOrder()
// Expected Output: [3, 8, 6, 20, 15, 10]  (left, right, node)
console.log(bst.dfsPostOrder()); // [3, 8, 6, 20, 15, 10]

// Duplicate insert test:
// Sample Input:  insert(10) again (duplicate)
// Expected Output: undefined  (duplicates not allowed)
console.log(bst.insert(10)); // undefined


/**
 * ========================================================================
 * 3. TREE TRAVERSAL
 * ========================================================================
 * BFS:
 * - Level by level.
 * - Queue use hoti hai.
 * - Shortest path in unweighted tree/graph thinking me useful.
 *
 * DFS PREORDER:
 * - Node, left, right.
 * - Tree copy/serialize karne me useful.
 *
 * DFS INORDER:
 * - Left, node, right.
 * - BST me sorted order deta hai.
 *
 * DFS POSTORDER:
 * - Left, right, node.
 * - Delete/free/evaluate expression tree me useful.
 */


/**
 * ========================================================================
 * 4. BALANCED TREES - CONCEPT
 * ========================================================================
 * NOTES:
 * - Normal BST skewed ho sakta hai, then operations O(n).
 * - Balanced BST height ko controlled rakhta hai.
 *
 * EXAMPLES:
 * - AVL Tree
 * - Red Black Tree
 * - B-Tree / B+Tree (databases/file systems)
 */


/**
 * ========================================================================
 * 5. TRIE - PREFIX TREE
 * ========================================================================
 * NOTES:
 * - Strings/prefixes store karne ke liye tree.
 * - Autocomplete, dictionary, spell-check, prefix search me useful.
 *
 * TIME:
 * - Insert/search: O(k), k = word length.
 *
 * EXAMPLE:
 * Insert: 'apple', 'app', 'apply', 'bat'
 * search('app')    -> true
 * search('ap')     -> false  ('ap' not a complete word)
 * startsWith('ap') -> true   ('ap' is a valid prefix)
 * search('bat')    -> true
 * search('batman') -> false
 */

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let current = this.root;

        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }

            current = current.children[char];
        }

        current.isEndOfWord = true;
    }

    search(word) {
        let current = this.root;

        for (const char of word) {
            if (!current.children[char]) return false;
            current = current.children[char];
        }

        return current.isEndOfWord;
    }

    startsWith(prefix) {
        let current = this.root;

        for (const char of prefix) {
            if (!current.children[char]) return false;
            current = current.children[char];
        }

        return true;
    }
}

// Sample usage: Build Trie and test search/prefix
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.insert('apply');
trie.insert('bat');

// Sample Input:  search('app')
// Expected Output: true  ('app' was inserted as a complete word)
console.log(trie.search('app'));   // true

// Sample Input:  search('ap')
// Expected Output: false  ('ap' prefix only, not a complete word)
console.log(trie.search('ap'));    // false

// Sample Input:  search('apple')
// Expected Output: true
console.log(trie.search('apple')); // true

// Sample Input:  search('apples')
// Expected Output: false  (not inserted)
console.log(trie.search('apples')); // false

// Sample Input:  startsWith('ap')
// Expected Output: true  ('ap' is prefix of 'apple', 'app', 'apply')
console.log(trie.startsWith('ap'));  // true

// Sample Input:  startsWith('cat')
// Expected Output: false
console.log(trie.startsWith('cat')); // false

// Sample Input:  search('bat')
// Expected Output: true
console.log(trie.search('bat'));     // true

// Sample Input:  search('batman')
// Expected Output: false
console.log(trie.search('batman'));  // false
