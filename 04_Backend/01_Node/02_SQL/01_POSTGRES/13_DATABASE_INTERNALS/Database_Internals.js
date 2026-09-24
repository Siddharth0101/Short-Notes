/**
 * ## Quick revision
 *
 * - Page — disk/storage I/O ka block; rows/index entries pages mein.
 * - Buffer cache — hot pages memory mein; cache hit/miss latency badalta hai.
 * - B-tree — balanced lookup/range structure; splits aur maintenance ka write cost.
 * - WAL — changes ka durable log recovery ke liye.
 * - MVCC — row versions se concurrent snapshots; old versions cleanup chahiye.
 * - Vacuum — dead-row cleanup/space reuse; exact behavior PostgreSQL-specific.
 * - Planner — statistics se cost estimate; stale stats bad plan de sakti hain.
 * - Locks — conflicting operations coordinate; waits/deadlocks measure karo.
 * - Durability — commit guarantee storage/log configuration se tied hai.
 * - Checkpoint — dirty-page persistence aur log recovery work coordinate; latency spikes monitor.
 * - Long snapshot — old row versions retain kar sakta hai; transaction age inspect.
 * - Hot page — concentrated updates contention la sakti hain; access pattern aur index keys evaluate.
 */

'use strict';


// -- You can actually select the hidden 'ctid' column in Postgres!
// SELECT ctid, * FROM users LIMIT 5;
// -- Output:
// -- ctid   | id | username
// -- -------+----+---------
// -- (0,1)  | 1  | alice
// -- (0,2)  | 2  | bob


const internalsRules = {
    heap: 'Unsorted main data file',
    page: '8KB block of data read from disk to RAM',
    tuple: 'A single row stored inside a page',
    ctid: 'Exact physical address (Block#, Tuple#)',
    bufferPool: 'RAM cache for 8KB pages to speed up queries',
    vacuum: 'Process to clean up dead tuples from UPDATEs/DELETEs'
};

console.log('Database Internals rules:', internalsRules);
