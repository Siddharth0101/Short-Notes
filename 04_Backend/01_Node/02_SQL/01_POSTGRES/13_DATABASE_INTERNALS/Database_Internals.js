'use strict';

/**
 * ========================================================================
 * DATABASE INTERNALS - SHORT NOTES (Stephen Grider Course)
 * ========================================================================
 * NOTES:
 * - PostgreSQL data ko hard drive pe kaise store karta hai, ye samajhna 
 *   performance tuning aur index behavior samajhne ke liye ZARURI hai.
 * - Key terms: Heap, Blocks/Pages, Tuples, Buffer Pool, Item Pointers (CTID).
 */


/**
 * ========================================================================
 * 1. THE HEAP (MAIN STORAGE FILE)
 * ========================================================================
 * NOTES:
 * - Har PostgreSQL table actually me hard drive pe ek "Heap File" hoti hai.
 * - Heap ka matlab hai unsorted data. Jab hum naya row insert karte hain,
 *   woh file me jahan space milti hai wahan add ho jata hai (typically at the end).
 * - "Full Table Scan" (Seq Scan) ka matlab hai DB is poori Heap file ko shuru
 *   se leke end tak padh raha hai.
 */


/**
 * ========================================================================
 * 2. PAGES / BLOCKS (8KB CHUNKS) [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Hard drive se data byte-by-byte read nahi hota. OS aur DB data ko "Blocks" 
 *   ya "Pages" me divide karte hain.
 * - PostgreSQL me ek Page ka size EXACTLY 8KB (8192 bytes) hota hai.
 * - Ek table (Heap) me hazaron/lakho 8KB Pages hote hain.
 * 
 * THE HEAP STRUCTURE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ users table (Heap File)                                     │
 * │ ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
 * │ │ Page 0    │  │ Page 1    │  │ Page 2    │  │ Page 3    │  │
 * │ │ (8 KB)    │  │ (8 KB)    │  │ (8 KB)    │  │ (8 KB)    │  │
 * │ └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 * - Agar hum sirf ek single row read kar rahe hain, DB ko poora 8KB 
 *   Page hard drive se RAM me load karna padta hai.
 */


/**
 * ========================================================================
 * 3. TUPLES (ROWS)
 * ========================================================================
 * NOTES:
 * - Tuple = Relational database terminology for a "Row".
 * - Ek 8KB Page ke andar multiple Tuples (rows) store hoti hain.
 * - Agar row size choti hai, toh ek page me hundreds of tuples aa sakti hain.
 * - PostgreSQL Page Layout:
 *   - Page Header (metadata)
 *   - Item Pointers (array of pointers pointing to tuples)
 *   - Free Space (middle)
 *   - Tuples (stored from the bottom up)
 */


/**
 * ========================================================================
 * 4. ITEM POINTER (CTID) — THE EXACT ADDRESS
 * ========================================================================
 * NOTES:
 * - CTID (Tuple ID) = Har row ka exact physical address on the hard drive.
 * - CTID format: `(BlockNumber, TupleIndex)`
 * - Example: `(0, 1)` means Block 0, 1st Tuple.
 * - INDEXES (like B-Tree) strictly is CTID value ko save karte hain.
 * 
 * WHY THIS MATTERS FOR INDEXES:
 * - B-Tree find karta hai -> (0, 1)
 * - DB seedha Block 0 (8KB) hard drive se RAM me laata hai aur 1st Tuple read kar leta hai.
 * - Bina index ke, saare blocks RAM me laane padte (Seq Scan).
 */

// -- You can actually select the hidden 'ctid' column in Postgres!
// SELECT ctid, * FROM users LIMIT 5;
// -- Output:
// -- ctid   | id | username
// -- -------+----+---------
// -- (0,1)  | 1  | alice
// -- (0,2)  | 2  | bob


/**
 * ========================================================================
 * 5. THE BUFFER POOL (RAM CACHE)
 * ========================================================================
 * NOTES:
 * - Hard Drive (Disk) se read karna bohot slow hai.
 * - PostgreSQL RAM me ek space reserve rakhta hai jise "Buffer Pool" (ya Shared Buffers) kehte hain.
 * - Jab bhi DB koi 8KB Page read karta hai, woh usko Buffer Pool me cache kar leta hai.
 * - Next time same page chahiye ho → 1000x faster read from RAM.
 * - Memory bharne pe Cache Eviction algorithms (like LRU) purane pages ko RAM se nikal dete hain.
 *
 * QUERY EXECUTION FLOW:
 * 1. Query aati hai.
 * 2. DB dekhta hai kya required 8KB Page already Buffer Pool (RAM) me hai?
 * 3. YES -> Return data (Super Fast ⚡)
 * 4. NO -> Hard drive se 8KB Page read karo, Buffer Pool me load karo, return data (Slow 🐌).
 */


/**
 * ========================================================================
 * 6. UPDATES, DELETES, AND VACUUM (MVCC)
 * ========================================================================
 * NOTES:
 * - PostgreSQL Multi-Version Concurrency Control (MVCC) use karta hai.
 * - Jab aap UPDATE/DELETE karte ho, purana Tuple actually delete NAHI hota!
 * - Woh sirf "Dead Tuple" mark ho jata hai (taaki concurrent transactions purana data padh sakein).
 * - Naya UPDATE ek fresh Tuple banke store hota hai (with new CTID).
 * 
 * VACUUM:
 * - Over time, dead tuples Pages (8KB) me jagah gherte hain (Table Bloat).
 * - "VACUUM" process in dead tuples ki space free karti hai future inserts ke liye.
 * - Autovacuum daemon background me yeh automatically karta rehta hai.
 */


/**
 * ========================================================================
 * 7. INTERNALS RULES
 * ========================================================================
 * - Tables are Heap Files (unsorted).
 * - Data is read from Disk to RAM in 8KB chunks called Pages/Blocks.
 * - Tuples (rows) live inside Pages.
 * - Indexes store the CTID (Block#, Tuple#) to instantly find the right 8KB Page.
 * - Query tuning is essentially reducing the number of 8KB Pages loaded from Disk.
 * - Updates create dead tuples; Vacuum cleans them up.
 */

const internalsRules = {
    heap: 'Unsorted main data file',
    page: '8KB block of data read from disk to RAM',
    tuple: 'A single row stored inside a page',
    ctid: 'Exact physical address (Block#, Tuple#)',
    bufferPool: 'RAM cache for 8KB pages to speed up queries',
    vacuum: 'Process to clean up dead tuples from UPDATEs/DELETEs'
};

console.log('Database Internals rules:', internalsRules);
