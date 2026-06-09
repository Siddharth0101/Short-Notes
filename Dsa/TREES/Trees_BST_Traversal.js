'use strict';

/**
 * ========================================================================
 * TREES, BINARY SEARCH TREES, TRAVERSALS, TRIES
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
